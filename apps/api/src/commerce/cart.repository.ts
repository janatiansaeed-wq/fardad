import { Injectable } from "@nestjs/common";
import { CartStatus, Prisma } from "@prisma/client";
import { PrismaService } from "../database";
import { CommerceDigest } from "./cart-token";

const cartLineSelect = Prisma.validator<Prisma.CartLineSelect>()({
  offerId: true,
  offerVersion: true,
  productId: true,
  productNameSnapshot: true,
  productSlugSnapshot: true,
  publicReference: true,
  quantity: true,
  quoteExpiresAt: true,
  lineSubtotalAmountRial: true,
  unitPriceAmountRial: true,
});

const cartSelect = Prisma.validator<Prisma.CartSelect>()({
  absoluteExpiresAt: true,
  expiresAt: true,
  id: true,
  lastActivityAt: true,
  lines: {
    orderBy: [{ createdAt: "asc" }, { publicReference: "asc" }],
    select: cartLineSelect,
  },
  quoteExpiresAt: true,
  quoteFingerprint: true,
  quotedAt: true,
  revision: true,
  status: true,
  storeId: true,
  subtotalAmountRial: true,
});

export type CartRecord = Prisma.CartGetPayload<{ select: typeof cartSelect }>;

@Injectable()
export class CartRepository {
  constructor(private readonly prisma: PrismaService) {}

  findByToken(storeId: string, tokenHash: CommerceDigest): Promise<CartRecord | null> {
    return this.prisma.cart.findFirst({
      where: { storeId, tokenHash },
      select: cartSelect,
    });
  }

  findMutation(storeId: string, keyHash: CommerceDigest) {
    return this.prisma.cartMutationRecord.findUnique({
      where: { storeId_keyHash: { keyHash, storeId } },
      select: { requestHash: true, resultingRevision: true },
    });
  }

  async expireIfNeeded(cart: CartRecord, now: Date): Promise<boolean> {
    if (
      cart.status !== CartStatus.ACTIVE ||
      (cart.expiresAt.getTime() > now.getTime() && cart.absoluteExpiresAt.getTime() > now.getTime())
    ) {
      return cart.status === CartStatus.EXPIRED;
    }

    return this.prisma.$transaction(async (transaction) => {
      const expired = await transaction.cart.updateMany({
        data: { status: CartStatus.EXPIRED },
        where: { id: cart.id, status: CartStatus.ACTIVE, storeId: cart.storeId },
      });

      if (expired.count === 1) {
        await transaction.commerceAuditEvent.create({
          data: {
            actorType: "SYSTEM",
            cartRevision: cart.revision,
            eventType: "CART_EXPIRED",
            storeId: cart.storeId,
            subjectReference: cart.id,
            subjectType: "CART",
          },
        });
      }

      return true;
    });
  }
}
