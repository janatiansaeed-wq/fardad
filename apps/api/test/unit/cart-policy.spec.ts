import assert from "node:assert/strict";
import { describe, test } from "node:test";
import {
  calculateCartExpiry,
  calculateQuoteExpiry,
  calculateQuoteTotals,
  createLineEquivalenceKey,
  createMutationRequestHash,
  createQuoteFingerprint,
  parseExpectedRevision,
} from "../../src/commerce/cart-policy";
import { generateCartToken, hashCartToken } from "../../src/commerce/cart-token";

describe("guest Cart policies", () => {
  test("generates a 256-bit opaque token and stores a fixed SHA-256 digest", () => {
    const token = generateCartToken();
    const otherToken = generateCartToken();
    assert.match(token, /^[A-Za-z0-9_-]{43}$/);
    assert.notEqual(token, otherToken);
    assert.equal(hashCartToken(token).byteLength, 32);
    assert.notDeepEqual(hashCartToken(token), hashCartToken(otherToken));
  });

  test("caps sliding idle expiry at absolute expiry", () => {
    const now = new Date("2026-07-20T00:00:00.000Z");
    const absolute = new Date("2026-07-21T00:00:00.000Z");
    assert.equal(
      calculateCartExpiry(now, 3_600, absolute).toISOString(),
      "2026-07-20T01:00:00.000Z",
    );
    assert.equal(calculateCartExpiry(now, 172_800, absolute).toISOString(), absolute.toISOString());
  });

  test("uses the earliest Store or Offer quote expiry", () => {
    const now = new Date("2026-07-20T00:00:00.000Z");
    const offerEnd = new Date("2026-07-20T00:05:00.000Z");
    assert.equal(calculateQuoteExpiry(now, 900, null).toISOString(), "2026-07-20T00:15:00.000Z");
    assert.equal(calculateQuoteExpiry(now, 900, offerEnd).toISOString(), offerEnd.toISOString());
  });

  test("computes exact totals and stable, scoped equivalence/fingerprint digests", () => {
    const lines = [
      {
        offerId: "offer-b",
        offerVersion: 1,
        productId: "product-b",
        quantity: 2,
        unitPriceAmountRial: 50n,
      },
      {
        offerId: "offer-a",
        offerVersion: 3,
        productId: "product-a",
        quantity: 4,
        unitPriceAmountRial: 25n,
      },
    ] as const;
    assert.deepEqual(calculateQuoteTotals(lines), { lineSubtotals: [100n, 100n], subtotal: 200n });
    assert.deepEqual(
      createQuoteFingerprint(1, lines),
      createQuoteFingerprint(1, [...lines].reverse()),
    );
    assert.notDeepEqual(createQuoteFingerprint(1, lines), createQuoteFingerprint(2, lines));
    assert.notDeepEqual(
      createLineEquivalenceKey("store-a", "product-a", "offer-a"),
      createLineEquivalenceKey("store-b", "product-a", "offer-a"),
    );
  });

  test("requires quoted positive integer revisions and request-specific idempotency digests", () => {
    assert.equal(parseExpectedRevision('"12"'), 12);
    for (const value of [undefined, "12", '"0"', '"01"', '"1.5"']) {
      assert.throws(() => parseExpectedRevision(value));
    }
    assert.deepEqual(
      createMutationRequestHash(["ADD_LINE", "slug", "1"]),
      createMutationRequestHash(["ADD_LINE", "slug", "1"]),
    );
    assert.notDeepEqual(
      createMutationRequestHash(["ADD_LINE", "slug", "1"]),
      createMutationRequestHash(["ADD_LINE", "slug", "2"]),
    );
  });
});
