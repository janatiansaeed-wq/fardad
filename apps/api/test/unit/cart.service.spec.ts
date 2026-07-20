import assert from "node:assert/strict";
import { describe, test } from "node:test";
import { ConflictException, NotFoundException, UnprocessableEntityException } from "@nestjs/common";
import { CartStatus, CommerceCurrency, StoreStatus } from "@prisma/client";
import { createMutationRequestHash } from "../../src/commerce/cart-policy";
import type { CartRecord } from "../../src/commerce/cart.repository";
import { CartService } from "../../src/commerce/cart.service";
import { generateCartToken, hashCartToken } from "../../src/commerce/cart-token";
import type { ResolvedStore } from "../../src/commerce/commerce.repository";

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

const now = new Date("2026-07-20T00:00:00.000Z");
const cart: CartRecord = {
  absoluteExpiresAt: new Date("2026-10-18T00:00:00.000Z"),
  expiresAt: new Date("2026-08-19T00:00:00.000Z"),
  id: "00000000-0000-4000-8000-000000000010",
  lastActivityAt: now,
  lines: [
    {
      lineSubtotalAmountRial: 2_000n,
      offerId: "00000000-0000-4000-8000-000000000020",
      offerVersion: 2,
      productId: "00000000-0000-4000-8000-000000000030",
      productNameSnapshot: "محصول",
      productSlugSnapshot: "product-slug",
      publicReference: "abcdefghijklmnopqrstuv",
      quantity: 2,
      quoteExpiresAt: new Date("2026-07-20T00:15:00.000Z"),
      unitPriceAmountRial: 1_000n,
    },
  ],
  quoteExpiresAt: new Date("2026-07-20T00:15:00.000Z"),
  quoteFingerprint: new Uint8Array(32),
  quotedAt: now,
  revision: 3,
  status: CartStatus.ACTIVE,
  storeId: store.id,
  subtotalAmountRial: 2_000n,
};

function createService(options?: {
  cartRecord?: CartRecord | null;
  expired?: boolean;
  mutationHash?: Uint8Array | null;
}): CartService {
  return new CartService(
    {
      expireIfNeeded: async () => options?.expired ?? false,
      findByToken: async () => (options && "cartRecord" in options ? options.cartRecord : cart),
      findMutation: async () =>
        options?.mutationHash
          ? { requestHash: options.mutationHash, resultingRevision: cart.revision }
          : null,
    } as never,
    {
      resolveCartableOffer: async () => ({
        effectiveUntil: null,
        id: cart.lines[0].offerId,
        maxQuantity: 99,
        minQuantity: 1,
        priceAmountRial: 1_000n,
        productId: cart.lines[0].productId,
        productName: cart.lines[0].productNameSnapshot,
        productSlug: cart.lines[0].productSlugSnapshot,
        version: cart.lines[0].offerVersion,
      }),
    } as never,
    {} as never,
    { getActiveStore: () => store } as never,
  );
}

describe("guest Cart ownership and public boundary", () => {
  test("returns exact safe snapshots without internal ownership or offer fields", async () => {
    const result = await createService().getCart(generateCartToken(), now);
    assert.deepEqual(result, {
      expiresAt: "2026-08-19T00:00:00.000Z",
      lines: [
        {
          availability: "available",
          product: { name: "محصول", slug: "product-slug" },
          quantity: 2,
          reference: "abcdefghijklmnopqrstuv",
          subtotal: { amount: "2000", currency: "IRR" },
          unitPrice: { amount: "1000", currency: "IRR" },
        },
      ],
      quote: { status: "fresh", validUntil: "2026-07-20T00:15:00.000Z" },
      revision: 3,
      status: "active",
      subtotal: { amount: "2000", currency: "IRR" },
    });
    const serialized = JSON.stringify(result);
    for (const prohibited of ["storeId", "offerId", "productId", "tokenHash", "audit"]) {
      assert.equal(serialized.includes(prohibited), false);
    }
  });

  test("uses a generic not-found boundary for an unknown bearer token", async () => {
    await assert.rejects(
      () => createService({ cartRecord: null }).getCart(generateCartToken(), now),
      {
        constructor: NotFoundException,
        message: "Cart not found",
      },
    );
  });

  test("rejects expired ownership and stale optimistic revisions", async () => {
    await assert.rejects(
      () => createService({ expired: true }).getCart(generateCartToken(), now),
      UnprocessableEntityException,
    );
    await assert.rejects(
      () => createService().addLine(generateCartToken(), "product-slug", 1, 2, generateCartToken()),
      ConflictException,
    );
  });

  test("replays the same idempotent mutation and rejects key reuse with different intent", async () => {
    const token = generateCartToken();
    const tokenHash = Buffer.from(hashCartToken(token)).toString("hex");
    const sameHash = createMutationRequestHash([
      store.id,
      tokenHash,
      "ADD_LINE",
      "product-slug",
      "1",
    ]);
    await assert.doesNotReject(() =>
      createService({ mutationHash: sameHash }).addLine(
        token,
        "product-slug",
        1,
        3,
        generateCartToken(),
      ),
    );
    await assert.rejects(
      () =>
        createService({ mutationHash: sameHash }).addLine(
          token,
          "product-slug",
          2,
          3,
          generateCartToken(),
        ),
      ConflictException,
    );
  });
});
