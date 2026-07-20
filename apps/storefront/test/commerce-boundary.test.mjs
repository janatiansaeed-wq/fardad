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

test("public Product contracts and capability publication remain commerce-free", () => {
  const catalog = read("packages/types/src/catalog.ts");
  const features = read("apps/storefront/src/config/brands/fardad/feature-profile.ts");
  assert.doesNotMatch(catalog, /price|availability|stock|cart/i);
  assert.match(features, /implemented: new Set\(\["catalog\.products"\]\)/);
  assert.equal(
    existsSync(join(workspaceRoot, "apps/storefront/app/(public)/cart/page.tsx")),
    false,
  );
});

test("public commerce contracts omit internal ownership and persistence fields", () => {
  const contracts = read("packages/types/src/commerce.ts");
  assert.doesNotMatch(
    contracts,
    /storeId|offerId|productId|token|hash|audit|readiness|Prisma|ProductOfferStatus/,
  );
});
