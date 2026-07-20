import assert from "node:assert/strict";
import { describe, test } from "node:test";
import { ProductOfferAvailability, ProductOfferSalesMode } from "@prisma/client";
import { validateOfferInput } from "../../src/commerce/offer-management.service";

const baseInput = {
  availability: ProductOfferAvailability.AVAILABLE_TO_ORDER,
  effectiveFrom: new Date("2026-07-20T00:00:00.000Z"),
  effectiveUntil: new Date("2026-07-21T00:00:00.000Z"),
  maxQuantity: 99,
  minQuantity: 1,
  priceAmountRial: "1000",
  productId: "00000000-0000-4000-8000-000000000003",
  salesMode: ProductOfferSalesMode.ONLINE,
} as const;

describe("Product Offer policy", () => {
  test("accepts an exact positive online IRR price and approved quantities", () => {
    assert.equal(validateOfferInput(baseInput, 99), 1_000n);
  });

  test("rejects zero online price, invalid windows, and Store quantity overflow", () => {
    assert.throws(() => validateOfferInput({ ...baseInput, priceAmountRial: "0" }, 99));
    assert.throws(() =>
      validateOfferInput({ ...baseInput, effectiveUntil: baseInput.effectiveFrom }, 99),
    );
    assert.throws(() => validateOfferInput({ ...baseInput, maxQuantity: 100 }, 99));
  });

  test("permits null price only for non-cartable sales modes", () => {
    assert.equal(
      validateOfferInput(
        { ...baseInput, priceAmountRial: null, salesMode: ProductOfferSalesMode.PRICE_HIDDEN },
        99,
      ),
      null,
    );
    assert.equal(
      validateOfferInput(
        { ...baseInput, priceAmountRial: null, salesMode: ProductOfferSalesMode.INQUIRY_ONLY },
        99,
      ),
      null,
    );
  });
});
