import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { test } from "node:test";

const workspaceRoot = join(dirname(fileURLToPath(import.meta.url)), "..", "..", "..");
const read = (path) => readFileSync(join(workspaceRoot, path), "utf8");

test("Storefront commerce boundary is server-only and keeps the API origin private", () => {
  const client = read("apps/storefront/src/lib/api/public-commerce.ts");
  const actions = read("apps/storefront/src/lib/commerce/cart-actions.ts");
  const session = read("apps/storefront/src/lib/commerce/cart-session.ts");
  const proof = read("apps/storefront/src/lib/commerce/commerce-bff-proof.ts");
  assert.match(client, /^import "server-only";/);
  assert.match(client, /cache: "no-store"/);
  assert.doesNotMatch(client, /NEXT_PUBLIC_/);
  assert.match(actions, /^"use server";/);
  assert.match(actions, /assertSameOriginMutation/);
  assert.match(actions, /Idempotency|generateIdempotencyKey/);
  assert.match(session, /^import "server-only";/);
  assert.match(session, /getCurrentGuestCart/);
  assert.match(proof, /^import "server-only";/);
  assert.match(proof, /createHmac\("sha256"/);
  assert.match(proof, /randomBytes\(16\)/);
  assert.doesNotMatch(proof, /NEXT_PUBLIC_/);
  assert.equal((client.match(/bffMutationRequest\(/g) ?? []).length, 6);
  assert.match(proof, /x-fardad-commerce-bff-signature/);
});

test("guest Cart cookie is host-only, secure, HttpOnly, SameSite Lax, and bounded", () => {
  const cookie = read("apps/storefront/src/lib/commerce/cart-cookie.ts");
  assert.match(cookie, /__Host-fardad-cart/);
  assert.match(cookie, /httpOnly: true/);
  assert.match(cookie, /secure: true/);
  assert.match(cookie, /sameSite: "lax"/);
  assert.match(cookie, /path: "\/"/);
  assert.match(cookie, /2_592_000/);
  assert.doesNotMatch(cookie, /domain:/i);
});

test("public catalog contracts remain commerce-free while shop publication is capability-gated", () => {
  const catalog = read("packages/types/src/catalog.ts");
  const features = read("apps/storefront/src/config/brands/fardad/feature-profile.ts");
  const navigation = read("apps/storefront/src/config/brands/fardad/navigation.ts");
  const capability = read("apps/storefront/src/lib/shop-capability.ts");
  const cartPage = read("apps/storefront/app/(public)/cart/page.tsx");
  const session = read("apps/storefront/src/lib/commerce/cart-session.ts");
  assert.doesNotMatch(catalog, /price|availability|stock|cart/i);
  assert.match(features, /implemented: new Set\(\["catalog\.products", "catalog\.shop"\]\)/);
  assert.match(navigation, /href: "\/cart"/);
  assert.match(navigation, /requiresAllCapabilities: \["catalog\.shop"\]/);
  assert.match(capability, /resolveVisibleCapabilities/);
  assert.match(capability, /isCapabilityVisible/);
  assert.match(cartPage, /isShopPublished/);
  assert.match(cartPage, /notFound\(\)/);
  assert.match(session, /getCurrentGuestCartState/);
  assert.match(session, /error\.code === "CART_EXPIRED"/);
});

test("Cart route provides route-local loading, error, empty, and populated states", () => {
  const experience = read("apps/storefront/components/commerce/CartExperience.tsx");
  assert.equal(existsSync(join(workspaceRoot, "apps/storefront/app/(public)/cart/page.tsx")), true);
  assert.equal(
    existsSync(join(workspaceRoot, "apps/storefront/app/(public)/cart/loading.tsx")),
    true,
  );
  assert.equal(
    existsSync(join(workspaceRoot, "apps/storefront/app/(public)/cart/error.tsx")),
    true,
  );
  assert.match(experience, /cart\.status === "expired"/);
  assert.match(experience, /cart\.lines\.length === 0/);
  assert.match(experience, /setGuestCartLineQuantityAction/);
  assert.match(experience, /removeGuestCartLineAction/);
  assert.match(experience, /refreshGuestCartQuoteAction/);
  assert.match(experience, /aria-live="polite"/);
});

test("client commerce controls use Server Actions and keep private commerce values out of client code", () => {
  const purchase = read("apps/storefront/components/commerce/ProductPurchaseControl.tsx");
  const cart = read("apps/storefront/components/commerce/CartExperience.tsx");
  for (const source of [purchase, cart]) {
    assert.match(source, /^"use client";/);
    assert.doesNotMatch(
      source,
      /STOREFRONT_API_BASE_URL|COMMERCE_BFF|x-fardad-commerce|x-fardad-cart-token|offerId|storeId|apiBaseUrl/i,
    );
    assert.doesNotMatch(source, /CART_EXPIRED|PRODUCT_UNAVAILABLE|QUANTITY_NOT_ALLOWED/i);
  }
  assert.match(purchase, /addGuestCartLineAction/);
  assert.match(cart, /refreshGuestCartQuoteAction/);
  assert.match(cart, /revision-conflict/);
  assert.match(cart, /cart-expired/);
});

test("public commerce contracts omit internal ownership and persistence fields", () => {
  const contracts = read("packages/types/src/commerce.ts");
  assert.doesNotMatch(
    contracts,
    /storeId|offerId|productId|token|hash|audit|readiness|Prisma|ProductOfferStatus/,
  );
});
