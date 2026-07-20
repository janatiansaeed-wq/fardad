import { Injectable } from "@nestjs/common";
import {
  CommerceAuditActorType,
  CommerceAuditEventType,
  CommerceAuditSubjectType,
  CommerceCurrency,
  Prisma,
  ProductOfferAvailability,
  ProductOfferSalesMode,
  ProductOfferStatus,
} from "@prisma/client";
import { PrismaService } from "../database";
import { invalidCommerceRequest } from "./commerce-errors";
import { assertPositiveRial, parseRialAmount } from "./money";
import { StoreContextService } from "./store-context.service";

export type CreateProductOfferInput = Readonly<{
  availability: ProductOfferAvailability;
  effectiveFrom: Date;
  effectiveUntil: Date | null;
  maxQuantity: number;
  minQuantity: number;
  priceAmountRial: string | null;
  productId: string;
  salesMode: ProductOfferSalesMode;
}>;

@Injectable()
export class OfferManagementService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly storeContext: StoreContextService,
  ) {}

  async createDraft(input: CreateProductOfferInput, requestId?: string) {
    const store = this.storeContext.getActiveStore();
    const priceAmountRial = validateOfferInput(input, store.maxLineQuantity);

    return this.retrySerializable(async (transaction) => {
      const latest = await transaction.productOffer.findFirst({
        orderBy: { version: "desc" },
        select: { version: true },
        where: { productId: input.productId, storeId: store.id },
      });
      const offer = await transaction.productOffer.create({
        data: {
          availability: input.availability,
          currency: CommerceCurrency.IRR,
          effectiveFrom: input.effectiveFrom,
          effectiveUntil: input.effectiveUntil,
          maxQuantity: input.maxQuantity,
          minQuantity: input.minQuantity,
          priceAmountRial,
          productId: input.productId,
          salesMode: input.salesMode,
          status: ProductOfferStatus.DRAFT,
          storeId: store.id,
          version: (latest?.version ?? 0) + 1,
        },
        select: { id: true, version: true },
      });

      await transaction.commerceAuditEvent.create({
        data: {
          actorType: CommerceAuditActorType.SYSTEM,
          eventType: CommerceAuditEventType.OFFER_CREATED,
          requestId,
          storeId: store.id,
          subjectReference: offer.id,
          subjectType: CommerceAuditSubjectType.PRODUCT_OFFER,
        },
      });
      return offer;
    });
  }

  async activate(offerId: string, requestId?: string): Promise<void> {
    const store = this.storeContext.getActiveStore();

    await this.retrySerializable(async (transaction) => {
      const target = await transaction.productOffer.findFirst({
        select: {
          availability: true,
          effectiveFrom: true,
          effectiveUntil: true,
          id: true,
          maxQuantity: true,
          minQuantity: true,
          priceAmountRial: true,
          productId: true,
          salesMode: true,
          status: true,
        },
        where: { id: offerId, storeId: store.id },
      });

      if (!target || target.status === ProductOfferStatus.ARCHIVED) {
        throw invalidCommerceRequest();
      }

      if (target.status === ProductOfferStatus.ACTIVE) {
        return;
      }

      validateOfferInput(
        {
          availability: target.availability,
          effectiveFrom: target.effectiveFrom,
          effectiveUntil: target.effectiveUntil,
          maxQuantity: target.maxQuantity,
          minQuantity: target.minQuantity,
          priceAmountRial: target.priceAmountRial?.toString(10) ?? null,
          productId: target.productId,
          salesMode: target.salesMode,
        },
        store.maxLineQuantity,
      );

      const previous = await transaction.productOffer.findMany({
        select: { id: true },
        where: {
          id: { not: target.id },
          productId: target.productId,
          status: ProductOfferStatus.ACTIVE,
          storeId: store.id,
        },
      });

      if (previous.length) {
        await transaction.productOffer.updateMany({
          data: { status: ProductOfferStatus.INACTIVE },
          where: { id: { in: previous.map((offer) => offer.id) }, storeId: store.id },
        });
        await transaction.commerceAuditEvent.createMany({
          data: previous.map((offer) => ({
            actorType: CommerceAuditActorType.SYSTEM,
            eventType: CommerceAuditEventType.OFFER_DEACTIVATED,
            requestId,
            storeId: store.id,
            subjectReference: offer.id,
            subjectType: CommerceAuditSubjectType.PRODUCT_OFFER,
          })),
        });
      }

      await transaction.productOffer.update({
        data: { status: ProductOfferStatus.ACTIVE },
        where: { id: target.id },
      });
      await transaction.commerceAuditEvent.create({
        data: {
          actorType: CommerceAuditActorType.SYSTEM,
          eventType: CommerceAuditEventType.OFFER_ACTIVATED,
          requestId,
          storeId: store.id,
          subjectReference: target.id,
          subjectType: CommerceAuditSubjectType.PRODUCT_OFFER,
        },
      });
    });
  }

  private async retrySerializable<T>(
    operation: (transaction: Prisma.TransactionClient) => Promise<T>,
  ): Promise<T> {
    for (let attempt = 0; attempt < 3; attempt += 1) {
      try {
        return await this.prisma.$transaction(operation, {
          isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
        });
      } catch (error) {
        if (isRetryableConflict(error) && attempt < 2) {
          continue;
        }

        throw error;
      }
    }

    throw new Error("Offer transaction retry exhausted");
  }
}

export function validateOfferInput(
  input: CreateProductOfferInput,
  storeMaximumQuantity: number,
): bigint | null {
  if (
    !Number.isSafeInteger(input.minQuantity) ||
    !Number.isSafeInteger(input.maxQuantity) ||
    input.minQuantity < 1 ||
    input.maxQuantity < input.minQuantity ||
    input.maxQuantity > storeMaximumQuantity ||
    (input.effectiveUntil !== null &&
      input.effectiveUntil.getTime() <= input.effectiveFrom.getTime())
  ) {
    throw invalidCommerceRequest();
  }

  const priceAmountRial =
    input.priceAmountRial === null ? null : parseRialAmount(input.priceAmountRial);

  if (input.salesMode === ProductOfferSalesMode.ONLINE) {
    try {
      assertPositiveRial(priceAmountRial);
    } catch {
      throw invalidCommerceRequest();
    }
  }

  return priceAmountRial;
}

function isRetryableConflict(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    ["P2002", "P2034"].includes(String((error as { code?: unknown }).code))
  );
}
