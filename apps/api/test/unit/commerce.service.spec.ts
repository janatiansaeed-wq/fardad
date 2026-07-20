import assert from "node:assert/strict";
import { describe, test } from "node:test";
import { NotFoundException, UnprocessableEntityException } from "@nestjs/common";
import {
  CommerceCurrency,
  ProductOfferAvailability,
  ProductOfferSalesMode,
  ProductOfferStatus,
  StoreStatus,
} from "@prisma/client";
import { CommerceService } from "../../src/commerce/commerce.service";
import type { OfferCandidate, ResolvedStore } from "../../src/commerce/commerce.repository";

const store: ResolvedStore = {
  currency: CommerceCurrency.IRR,
  guestCartAbsoluteTtlSeconds: 7_776_000,
  guestCartIdleTtlSeconds: 2_592_000,
  id: "00000000-0000-4000-8000-000000000001",
  key: "fardad",
  maxCartLines: 50,
  maxLineQuantity: 99,
  profileKey: "fardad-production",
  quoteTtlSeconds: 900,
  status: StoreStatus.ACTIVE,
  version: 1,
};

const candidate: OfferCandidate = {
  availability: ProductOfferAvailability.AVAILABLE_TO_ORDER,
  currency: CommerceCurrency.IRR,
  effectiveFrom: new Date("2026-07-20T00:00:00.000Z"),
  effectiveUntil: null,
  id: "00000000-0000-4000-8000-000000000002",
  maxQuantity: 100,
  minQuantity: 1,
  priceAmountRial: 12_340n,
  product: {
    id: "00000000-0000-4000-8000-000000000003",
    name: "محصول",
    slug: "product-slug",
  },
  productId: "00000000-0000-4000-8000-000000000003",
  salesMode: ProductOfferSalesMode.ONLINE,
  status: ProductOfferStatus.ACTIVE,
  storeId: store.id,
  version: 4,
};

function createService(offer: OfferCandidate | null, ready = true): CommerceService {
  return new CommerceService(
    {
      findEffectiveOfferByProductSlug: async () => offer,
    } as never,
    {
      evaluate: async () => ({ isPublicationReady: ready }),
    } as never,
  );
}

describe("Store-scoped Product Offer evaluation", () => {
  test("maps an effective online offer to safe public values and Store quantity ceiling", async () => {
    const option = await createService(candidate).getPurchasingOption(store, "product-slug");
    assert.deepEqual(option, {
      availability: "available-to-order",
      mode: "online",
      price: { amount: "12340", currency: "IRR" },
      productSlug: "product-slug",
      quantity: { max: 99, min: 1 },
    });
    assert.equal("id" in option, false);
    assert.equal("storeId" in option, false);
  });

  test("does not disclose price for price-hidden or inquiry-only modes", async () => {
    for (const salesMode of [
      ProductOfferSalesMode.PRICE_HIDDEN,
      ProductOfferSalesMode.INQUIRY_ONLY,
    ]) {
      const option = await createService({ ...candidate, salesMode }).getPurchasingOption(
        store,
        "product-slug",
      );
      assert.equal(option.price, null);
    }
  });

  test("returns the same generic not-found boundary for absent or non-ready products", async () => {
    await assert.rejects(() => createService(null).getPurchasingOption(store, "missing"), {
      constructor: NotFoundException,
      message: "Product not found",
    });
    await assert.rejects(
      () => createService(candidate, false).getPurchasingOption(store, "missing"),
      {
        constructor: NotFoundException,
        message: "Product not found",
      },
    );
  });

  test("only online, available, positive, quantity-valid offers are cartable", async () => {
    const mapped = await createService(candidate).resolveCartableOffer(store, "product-slug", 99);
    assert.equal(mapped.priceAmountRial, 12_340n);
    await assert.rejects(
      () =>
        createService({
          ...candidate,
          availability: ProductOfferAvailability.UNAVAILABLE,
        }).resolveCartableOffer(store, "product-slug", 1),
      UnprocessableEntityException,
    );
    await assert.rejects(
      () =>
        createService({
          ...candidate,
          salesMode: ProductOfferSalesMode.INQUIRY_ONLY,
        }).resolveCartableOffer(store, "product-slug", 1),
      UnprocessableEntityException,
    );
    await assert.rejects(
      () => createService(candidate).resolveCartableOffer(store, "product-slug", 100),
      UnprocessableEntityException,
    );
  });
});
