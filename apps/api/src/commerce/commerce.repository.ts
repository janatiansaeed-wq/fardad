import { Injectable } from "@nestjs/common";
import {
  Prisma,
  ProductOfferAvailability,
  ProductOfferSalesMode,
  ProductOfferStatus,
  StoreStatus,
} from "@prisma/client";
import { PrismaService } from "../database";
import { publicProductLifecycleWhere } from "../public-catalog/public-catalog.repository";

const storeSelect = Prisma.validator<Prisma.StoreSelect>()({
  currency: true,
  guestCartAbsoluteTtlSeconds: true,
  guestCartIdleTtlSeconds: true,
  id: true,
  key: true,
  maxCartLines: true,
  maxLineQuantity: true,
  profileKey: true,
  quoteTtlSeconds: true,
  status: true,
  version: true,
});

const offerCandidateSelect = Prisma.validator<Prisma.ProductOfferSelect>()({
  availability: true,
  currency: true,
  effectiveFrom: true,
  effectiveUntil: true,
  id: true,
  maxQuantity: true,
  minQuantity: true,
  priceAmountRial: true,
  product: {
    select: {
      id: true,
      name: true,
      slug: true,
    },
  },
  productId: true,
  salesMode: true,
  status: true,
  storeId: true,
  version: true,
});

export type ResolvedStore = Prisma.StoreGetPayload<{ select: typeof storeSelect }>;
export type OfferCandidate = Prisma.ProductOfferGetPayload<{
  select: typeof offerCandidateSelect;
}>;
export type CommerceDatabaseClient = PrismaService | Prisma.TransactionClient;

@Injectable()
export class CommerceRepository {
  constructor(private readonly prisma: PrismaService) {}

  findActiveStoreByKey(key: string): Promise<ResolvedStore | null> {
    return this.prisma.store.findFirst({
      where: { key, status: StoreStatus.ACTIVE },
      select: storeSelect,
    });
  }

  findEffectiveOfferByProductSlug(
    storeId: string,
    slug: string,
    now: Date,
    client: CommerceDatabaseClient = this.prisma,
  ): Promise<OfferCandidate | null> {
    return client.productOffer.findFirst({
      where: {
        availability: {
          in: [ProductOfferAvailability.AVAILABLE_TO_ORDER, ProductOfferAvailability.UNAVAILABLE],
        },
        effectiveFrom: { lte: now },
        OR: [{ effectiveUntil: null }, { effectiveUntil: { gt: now } }],
        product: {
          is: {
            ...publicProductLifecycleWhere(now),
            slug,
          },
        },
        salesMode: {
          in: [
            ProductOfferSalesMode.ONLINE,
            ProductOfferSalesMode.PRICE_HIDDEN,
            ProductOfferSalesMode.INQUIRY_ONLY,
          ],
        },
        status: ProductOfferStatus.ACTIVE,
        storeId,
      },
      select: offerCandidateSelect,
    });
  }

  findEffectiveOfferById(
    storeId: string,
    offerId: string,
    now: Date,
    client: CommerceDatabaseClient = this.prisma,
  ): Promise<OfferCandidate | null> {
    return client.productOffer.findFirst({
      where: {
        effectiveFrom: { lte: now },
        id: offerId,
        OR: [{ effectiveUntil: null }, { effectiveUntil: { gt: now } }],
        product: { is: publicProductLifecycleWhere(now) },
        status: ProductOfferStatus.ACTIVE,
        storeId,
      },
      select: offerCandidateSelect,
    });
  }
}
