import { timingSafeEqual } from "node:crypto";
import { HttpException, Injectable } from "@nestjs/common";
import {
  CartMutationKind,
  CartStatus,
  CommerceAuditActorType,
  CommerceAuditEventType,
  CommerceAuditSubjectType,
  Prisma,
} from "@prisma/client";
import { PrismaService } from "../database";
import {
  calculateCartExpiry,
  calculateQuoteExpiry,
  calculateQuoteTotals,
  createLineEquivalenceKey,
  createMutationRequestHash,
  createQuoteFingerprint,
  IDEMPOTENCY_TTL_MILLISECONDS,
} from "./cart-policy";
import { CartRecord, CartRepository } from "./cart.repository";
import {
  assertLineReference,
  assertOperationKey,
  CommerceDigest,
  digestToHex,
  generateLineReference,
  hashCartToken,
  sha256,
} from "./cart-token";
import { cartNotFound, commerceConflict, commerceUnprocessable } from "./commerce-errors";
import { CartableOffer, CommerceService } from "./commerce.service";
import { ResolvedStore } from "./commerce.repository";
import { multiplyRial, toMoney } from "./money";
import { StoreContextService } from "./store-context.service";

type LineIntent = {
  productSlug: string;
  publicReference: string;
  quantity: number;
  wasPresent: boolean;
};

type QuotedLine = LineIntent & {
  equivalenceKey: CommerceDigest;
  lineSubtotalAmountRial: bigint;
  offer: CartableOffer;
  quoteExpiresAt: Date;
};

type PublicCart = Readonly<{
  revision: number;
  status: "active" | "expired";
  expiresAt: string;
  quote: Readonly<{ status: "fresh" | "stale"; validUntil: string | null }>;
  subtotal: ReturnType<typeof toMoney>;
  lines: readonly Readonly<{
    reference: string;
    product: Readonly<{ slug: string; name: string }>;
    quantity: number;
    unitPrice: ReturnType<typeof toMoney>;
    subtotal: ReturnType<typeof toMoney>;
    availability: "available" | "requires-refresh" | "unavailable";
  }>[];
}>;

type MutationInput = Readonly<{
  expectedRevision: number;
  idempotencyKey: string;
  kind: CartMutationKind;
  rawToken: string;
  requestHashParts: readonly string[];
  requestId?: string;
  transform: (lines: readonly LineIntent[]) => readonly LineIntent[];
}>;

@Injectable()
export class CartService {
  constructor(
    private readonly cartRepository: CartRepository,
    private readonly commerceService: CommerceService,
    private readonly prisma: PrismaService,
    private readonly storeContext: StoreContextService,
  ) {}

  async createOrResolve(rawToken: string, requestId?: string): Promise<void> {
    const store = this.storeContext.getActiveStore();
    const tokenHash = hashCartToken(rawToken);
    const now = new Date();
    const existing = await this.cartRepository.findByToken(store.id, tokenHash);

    if (existing) {
      if (await this.cartRepository.expireIfNeeded(existing, now)) {
        throw commerceUnprocessable("CART_EXPIRED");
      }

      await this.prisma.cart.updateMany({
        data: {
          expiresAt: calculateCartExpiry(
            now,
            store.guestCartIdleTtlSeconds,
            existing.absoluteExpiresAt,
          ),
          lastActivityAt: now,
        },
        where: { id: existing.id, status: CartStatus.ACTIVE, storeId: store.id, tokenHash },
      });

      return;
    }

    const absoluteExpiresAt = new Date(now.getTime() + store.guestCartAbsoluteTtlSeconds * 1_000);
    const expiresAt = calculateCartExpiry(now, store.guestCartIdleTtlSeconds, absoluteExpiresAt);

    try {
      await this.prisma.$transaction(async (transaction) => {
        const cart = await transaction.cart.create({
          data: {
            absoluteExpiresAt,
            expiresAt,
            lastActivityAt: now,
            storeId: store.id,
            tokenHash,
          },
          select: { id: true, revision: true },
        });

        await transaction.commerceAuditEvent.create({
          data: {
            actorType: CommerceAuditActorType.GUEST,
            cartRevision: cart.revision,
            eventType: CommerceAuditEventType.CART_CREATED,
            requestId,
            storeId: store.id,
            subjectReference: cart.id,
            subjectType: CommerceAuditSubjectType.CART,
          },
        });
      });
    } catch (error) {
      if (isPrismaError(error, "P2002")) {
        const racedCart = await this.cartRepository.findByToken(store.id, tokenHash);

        if (racedCart && !(await this.cartRepository.expireIfNeeded(racedCart, now))) {
          return;
        }
      }

      throw error;
    }
  }

  async getCart(rawToken: string, now = new Date()): Promise<PublicCart> {
    const store = this.storeContext.getActiveStore();
    const cart = await this.requireActiveCart(store, hashCartToken(rawToken), now);
    const lineAvailability = await Promise.all(
      cart.lines.map(async (line) => this.getLineAvailability(store, line, now)),
    );
    const quoteFresh =
      cart.quoteExpiresAt !== null &&
      cart.quoteExpiresAt.getTime() > now.getTime() &&
      lineAvailability.every((availability) => availability === "available");

    return {
      expiresAt: cart.expiresAt.toISOString(),
      lines: cart.lines.map((line, index) => ({
        availability: lineAvailability[index],
        product: {
          name: line.productNameSnapshot,
          slug: line.productSlugSnapshot,
        },
        quantity: line.quantity,
        reference: line.publicReference,
        subtotal: toMoney(line.lineSubtotalAmountRial),
        unitPrice: toMoney(line.unitPriceAmountRial),
      })),
      quote: {
        status: quoteFresh ? "fresh" : "stale",
        validUntil: cart.quoteExpiresAt?.toISOString() ?? null,
      },
      revision: cart.revision,
      status: "active",
      subtotal: toMoney(cart.subtotalAmountRial),
    };
  }

  async addLine(
    rawToken: string,
    productSlug: string,
    quantity: number,
    expectedRevision: number,
    idempotencyKey: string,
    requestId?: string,
  ): Promise<void> {
    await this.applyMutation({
      expectedRevision,
      idempotencyKey,
      kind: CartMutationKind.ADD_LINE,
      rawToken,
      requestHashParts: ["ADD_LINE", productSlug, String(quantity)],
      requestId,
      transform: (lines) => {
        const existing = lines.find((line) => line.productSlug === productSlug);

        if (!existing) {
          return [
            ...lines,
            {
              productSlug,
              publicReference: generateLineReference(),
              quantity,
              wasPresent: false,
            },
          ];
        }

        return lines.map((line) =>
          line.publicReference === existing.publicReference
            ? { ...line, quantity: line.quantity + quantity }
            : line,
        );
      },
    });
  }

  async setLineQuantity(
    rawToken: string,
    lineReference: string,
    quantity: number,
    expectedRevision: number,
    idempotencyKey: string,
    requestId?: string,
  ): Promise<void> {
    assertLineReference(lineReference);
    await this.applyMutation({
      expectedRevision,
      idempotencyKey,
      kind: CartMutationKind.SET_LINE_QUANTITY,
      rawToken,
      requestHashParts: ["SET_LINE_QUANTITY", lineReference, String(quantity)],
      requestId,
      transform: (lines) => {
        if (!lines.some((line) => line.publicReference === lineReference)) {
          throw cartNotFound();
        }

        return lines.map((line) =>
          line.publicReference === lineReference ? { ...line, quantity } : line,
        );
      },
    });
  }

  async removeLine(
    rawToken: string,
    lineReference: string,
    expectedRevision: number,
    idempotencyKey: string,
    requestId?: string,
  ): Promise<void> {
    assertLineReference(lineReference);
    await this.applyMutation({
      expectedRevision,
      idempotencyKey,
      kind: CartMutationKind.REMOVE_LINE,
      rawToken,
      requestHashParts: ["REMOVE_LINE", lineReference],
      requestId,
      transform: (lines) => {
        if (!lines.some((line) => line.publicReference === lineReference)) {
          throw cartNotFound();
        }

        return lines.filter((line) => line.publicReference !== lineReference);
      },
    });
  }

  async refreshQuote(
    rawToken: string,
    expectedRevision: number,
    idempotencyKey: string,
    requestId?: string,
  ): Promise<void> {
    await this.applyMutation({
      expectedRevision,
      idempotencyKey,
      kind: CartMutationKind.REFRESH_QUOTE,
      rawToken,
      requestHashParts: ["REFRESH_QUOTE"],
      requestId,
      transform: (lines) => lines,
    });
  }

  private async applyMutation(input: MutationInput): Promise<void> {
    const store = this.storeContext.getActiveStore();
    const tokenHash = hashCartToken(input.rawToken);
    const operationKey = assertOperationKey(input.idempotencyKey);
    const keyHash = sha256(operationKey);
    const requestHash = createMutationRequestHash([
      store.id,
      digestToHex(tokenHash),
      ...input.requestHashParts,
    ]);
    const replay = await this.cartRepository.findMutation(store.id, keyHash);

    if (replay) {
      this.assertReplay(replay.requestHash, requestHash);
      return;
    }

    const now = new Date();
    const cart = await this.requireActiveCart(store, tokenHash, now);

    if (cart.revision !== input.expectedRevision) {
      throw commerceConflict("CART_REVISION_CONFLICT");
    }

    const existingIntents = cart.lines.map<LineIntent>((line) => ({
      productSlug: line.productSlugSnapshot,
      publicReference: line.publicReference,
      quantity: line.quantity,
      wasPresent: true,
    }));
    const desiredIntents = input.transform(existingIntents);

    if (desiredIntents.length > store.maxCartLines) {
      throw commerceUnprocessable("CART_LIMIT_REACHED");
    }

    const quotedLines = await Promise.all(
      desiredIntents.map(async (intent): Promise<QuotedLine> => {
        const offer = await this.commerceService.resolveCartableOffer(
          store,
          intent.productSlug,
          intent.quantity,
          now,
        );
        return {
          ...intent,
          equivalenceKey: createLineEquivalenceKey(store.id, offer.productId, offer.id),
          lineSubtotalAmountRial: multiplyRial(offer.priceAmountRial, intent.quantity),
          offer,
          quoteExpiresAt: calculateQuoteExpiry(now, store.quoteTtlSeconds, offer.effectiveUntil),
        };
      }),
    );
    const totals = calculateQuoteTotals(
      quotedLines.map((line) => ({
        offerId: line.offer.id,
        offerVersion: line.offer.version,
        productId: line.offer.productId,
        quantity: line.quantity,
        unitPriceAmountRial: line.offer.priceAmountRial,
      })),
    );
    const quoteExpiresAt = quotedLines.reduce<Date | null>(
      (earliest, line) =>
        !earliest || line.quoteExpiresAt.getTime() < earliest.getTime()
          ? line.quoteExpiresAt
          : earliest,
      null,
    );
    const quoteFingerprint = quotedLines.length
      ? createQuoteFingerprint(
          store.version,
          quotedLines.map((line) => ({
            offerId: line.offer.id,
            offerVersion: line.offer.version,
            productId: line.offer.productId,
            quantity: line.quantity,
            unitPriceAmountRial: line.offer.priceAmountRial,
          })),
        )
      : null;

    await this.runSerializable(async (transaction) => {
      const racedReplay = await transaction.cartMutationRecord.findUnique({
        where: { storeId_keyHash: { keyHash, storeId: store.id } },
        select: { requestHash: true },
      });

      if (racedReplay) {
        this.assertReplay(racedReplay.requestHash, requestHash);
        return;
      }

      for (const line of quotedLines) {
        const stillCartable = await this.commerceService.isOfferStillCartable(
          transaction,
          store,
          line.offer,
          line.quantity,
          now,
        );

        if (!stillCartable) {
          throw commerceConflict("QUOTE_CHANGED");
        }
      }

      const nextRevision = input.expectedRevision + 1;
      const expiresAt = calculateCartExpiry(
        now,
        store.guestCartIdleTtlSeconds,
        cart.absoluteExpiresAt,
      );
      const guardedUpdate = await transaction.cart.updateMany({
        data: {
          expiresAt,
          lastActivityAt: now,
          quoteExpiresAt,
          quoteFingerprint,
          quotedAt: quoteExpiresAt ? now : null,
          revision: { increment: 1 },
          subtotalAmountRial: totals.subtotal,
        },
        where: {
          absoluteExpiresAt: { gt: now },
          expiresAt: { gt: now },
          id: cart.id,
          revision: input.expectedRevision,
          status: CartStatus.ACTIVE,
          storeId: store.id,
          tokenHash,
        },
      });

      if (guardedUpdate.count !== 1) {
        throw commerceConflict("CART_REVISION_CONFLICT");
      }

      const retainedReferences = quotedLines.map((line) => line.publicReference);
      await transaction.cartLine.deleteMany({
        where: {
          cartId: cart.id,
          storeId: store.id,
          ...(retainedReferences.length ? { publicReference: { notIn: retainedReferences } } : {}),
        },
      });

      for (const line of quotedLines) {
        const data = {
          equivalenceKey: line.equivalenceKey,
          lineSubtotalAmountRial: line.lineSubtotalAmountRial,
          offerId: line.offer.id,
          offerVersion: line.offer.version,
          productId: line.offer.productId,
          productNameSnapshot: line.offer.productName,
          productSlugSnapshot: line.offer.productSlug,
          quantity: line.quantity,
          quoteExpiresAt: line.quoteExpiresAt,
          unitPriceAmountRial: line.offer.priceAmountRial,
        };

        if (line.wasPresent) {
          const updated = await transaction.cartLine.updateMany({
            data,
            where: {
              cartId: cart.id,
              publicReference: line.publicReference,
              storeId: store.id,
            },
          });

          if (updated.count !== 1) {
            throw commerceConflict("QUOTE_CHANGED");
          }
        } else {
          await transaction.cartLine.create({
            data: {
              ...data,
              cartId: cart.id,
              publicReference: line.publicReference,
              storeId: store.id,
            },
          });
        }
      }

      await transaction.commerceAuditEvent.create({
        data: {
          actorType: CommerceAuditActorType.GUEST,
          cartRevision: nextRevision,
          eventType: auditEventFor(input.kind),
          requestId: input.requestId,
          storeId: store.id,
          subjectReference: cart.id,
          subjectType: CommerceAuditSubjectType.CART,
        },
      });
      await transaction.cartMutationRecord.create({
        data: {
          cartId: cart.id,
          expiresAt: new Date(now.getTime() + IDEMPOTENCY_TTL_MILLISECONDS),
          keyHash,
          kind: input.kind,
          requestHash,
          resultingRevision: nextRevision,
          storeId: store.id,
        },
      });
    });
  }

  private async requireActiveCart(
    store: ResolvedStore,
    tokenHash: CommerceDigest,
    now: Date,
  ): Promise<CartRecord> {
    const cart = await this.cartRepository.findByToken(store.id, tokenHash);

    if (!cart) {
      throw cartNotFound();
    }

    if (await this.cartRepository.expireIfNeeded(cart, now)) {
      throw commerceUnprocessable("CART_EXPIRED");
    }

    return cart;
  }

  private async getLineAvailability(
    store: ResolvedStore,
    line: CartRecord["lines"][number],
    now: Date,
  ): Promise<PublicCart["lines"][number]["availability"]> {
    try {
      const offer = await this.commerceService.resolveCartableOffer(
        store,
        line.productSlugSnapshot,
        line.quantity,
        now,
      );

      if (
        offer.id !== line.offerId ||
        offer.version !== line.offerVersion ||
        offer.priceAmountRial !== line.unitPriceAmountRial
      ) {
        return "requires-refresh";
      }

      return line.quoteExpiresAt.getTime() > now.getTime() ? "available" : "requires-refresh";
    } catch (error) {
      if (error instanceof HttpException) {
        return "unavailable";
      }

      throw error;
    }
  }

  private assertReplay(existingHash: Uint8Array, requestHash: CommerceDigest): void {
    const existing = Buffer.from(existingHash);
    const requested = Buffer.from(requestHash);

    if (existing.length !== requested.length || !timingSafeEqual(existing, requested)) {
      throw commerceConflict("IDEMPOTENCY_CONFLICT");
    }
  }

  private async runSerializable(
    operation: (transaction: Prisma.TransactionClient) => Promise<void>,
  ) {
    for (let attempt = 0; attempt < 3; attempt += 1) {
      try {
        await this.prisma.$transaction(operation, {
          isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
        });
        return;
      } catch (error) {
        if (isPrismaError(error, "P2034") && attempt < 2) {
          continue;
        }

        if (isPrismaError(error, "P2002")) {
          throw commerceConflict("QUOTE_CHANGED");
        }

        throw error;
      }
    }
  }
}

function auditEventFor(kind: CartMutationKind): CommerceAuditEventType {
  switch (kind) {
    case CartMutationKind.ADD_LINE:
      return CommerceAuditEventType.CART_LINE_ADDED;
    case CartMutationKind.SET_LINE_QUANTITY:
      return CommerceAuditEventType.CART_LINE_QUANTITY_SET;
    case CartMutationKind.REMOVE_LINE:
      return CommerceAuditEventType.CART_LINE_REMOVED;
    case CartMutationKind.REFRESH_QUOTE:
      return CommerceAuditEventType.CART_QUOTE_REFRESHED;
  }
}

function isPrismaError(error: unknown, code: string): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    (error as { code?: unknown }).code === code
  );
}
