import { Injectable, NotFoundException } from "@nestjs/common";
import {
  CommerceCurrency,
  ProductOfferAvailability,
  ProductOfferSalesMode,
  ProductOfferStatus,
} from "@prisma/client";
import { ProductDataQualityService } from "../product";
import { commerceUnprocessable, productNotFound } from "./commerce-errors";
import {
  CommerceDatabaseClient,
  CommerceRepository,
  OfferCandidate,
  ResolvedStore,
} from "./commerce.repository";
import { assertPositiveRial, toMoney } from "./money";

type PublicPurchasingOption = Readonly<{
  productSlug: string;
  mode: "online" | "price-hidden" | "inquiry-only";
  availability: "available-to-order" | "unavailable";
  price: ReturnType<typeof toMoney> | null;
  quantity: Readonly<{ min: number; max: number }>;
}>;

export type CartableOffer = Readonly<{
  effectiveUntil: Date | null;
  id: string;
  maxQuantity: number;
  minQuantity: number;
  priceAmountRial: bigint;
  productId: string;
  productName: string;
  productSlug: string;
  version: number;
}>;

@Injectable()
export class CommerceService {
  constructor(
    private readonly commerceRepository: CommerceRepository,
    private readonly productDataQualityService: ProductDataQualityService,
  ) {}

  async getPurchasingOption(
    store: ResolvedStore,
    slug: string,
    now = new Date(),
  ): Promise<PublicPurchasingOption> {
    const candidate = await this.commerceRepository.findEffectiveOfferByProductSlug(
      store.id,
      slug,
      now,
    );

    if (!candidate || !(await this.isPublicationReady(candidate.product.id))) {
      throw productNotFound();
    }

    const productSlug = candidate.product.slug?.trim();

    if (!productSlug || candidate.currency !== CommerceCurrency.IRR) {
      throw productNotFound();
    }

    const mode = mapSalesMode(candidate.salesMode);
    const availability =
      candidate.availability === ProductOfferAvailability.AVAILABLE_TO_ORDER
        ? "available-to-order"
        : "unavailable";
    const price =
      candidate.salesMode === ProductOfferSalesMode.ONLINE ? mapOnlinePrice(candidate) : null;

    return {
      availability,
      mode,
      price,
      productSlug,
      quantity: {
        max: Math.min(candidate.maxQuantity, store.maxLineQuantity),
        min: candidate.minQuantity,
      },
    };
  }

  async resolveCartableOffer(
    store: ResolvedStore,
    slug: string,
    quantity: number,
    now = new Date(),
  ): Promise<CartableOffer> {
    const candidate = await this.commerceRepository.findEffectiveOfferByProductSlug(
      store.id,
      slug,
      now,
    );

    if (!candidate || !(await this.isPublicationReady(candidate.product.id))) {
      throw commerceUnprocessable("PRODUCT_UNAVAILABLE");
    }

    return this.toCartableOffer(store, candidate, quantity);
  }

  async isOfferStillCartable(
    client: CommerceDatabaseClient,
    store: ResolvedStore,
    offer: CartableOffer,
    quantity: number,
    now: Date,
  ): Promise<boolean> {
    const current = await this.commerceRepository.findEffectiveOfferById(
      store.id,
      offer.id,
      now,
      client,
    );

    if (!current) {
      return false;
    }

    try {
      const mapped = this.toCartableOffer(store, current, quantity);
      return (
        mapped.version === offer.version &&
        mapped.priceAmountRial === offer.priceAmountRial &&
        mapped.productId === offer.productId
      );
    } catch {
      return false;
    }
  }

  private toCartableOffer(
    store: ResolvedStore,
    candidate: OfferCandidate,
    quantity: number,
  ): CartableOffer {
    const productName = candidate.product.name?.trim();
    const productSlug = candidate.product.slug?.trim();
    const maximumQuantity = Math.min(candidate.maxQuantity, store.maxLineQuantity);

    if (
      candidate.storeId !== store.id ||
      candidate.status !== ProductOfferStatus.ACTIVE ||
      candidate.currency !== CommerceCurrency.IRR ||
      candidate.salesMode !== ProductOfferSalesMode.ONLINE ||
      candidate.availability !== ProductOfferAvailability.AVAILABLE_TO_ORDER ||
      !productName ||
      !productSlug
    ) {
      throw commerceUnprocessable("PRODUCT_UNAVAILABLE");
    }

    if (
      !Number.isSafeInteger(quantity) ||
      quantity < candidate.minQuantity ||
      quantity > maximumQuantity
    ) {
      throw commerceUnprocessable("QUANTITY_NOT_ALLOWED");
    }

    try {
      assertPositiveRial(candidate.priceAmountRial);
    } catch {
      throw commerceUnprocessable("PRODUCT_UNAVAILABLE");
    }

    return {
      effectiveUntil: candidate.effectiveUntil,
      id: candidate.id,
      maxQuantity: maximumQuantity,
      minQuantity: candidate.minQuantity,
      priceAmountRial: candidate.priceAmountRial,
      productId: candidate.productId,
      productName,
      productSlug,
      version: candidate.version,
    };
  }

  private async isPublicationReady(productId: string): Promise<boolean> {
    try {
      const quality = await this.productDataQualityService.evaluate(productId);
      return quality.isPublicationReady;
    } catch (error) {
      if (error instanceof NotFoundException) {
        return false;
      }

      throw error;
    }
  }
}

function mapSalesMode(salesMode: ProductOfferSalesMode): PublicPurchasingOption["mode"] {
  switch (salesMode) {
    case ProductOfferSalesMode.ONLINE:
      return "online";
    case ProductOfferSalesMode.PRICE_HIDDEN:
      return "price-hidden";
    case ProductOfferSalesMode.INQUIRY_ONLY:
      return "inquiry-only";
  }
}

function mapOnlinePrice(candidate: OfferCandidate): PublicPurchasingOption["price"] {
  try {
    assertPositiveRial(candidate.priceAmountRial);
    return toMoney(candidate.priceAmountRial);
  } catch {
    throw productNotFound();
  }
}
