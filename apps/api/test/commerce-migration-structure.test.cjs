const assert = require("node:assert/strict");
const { readFileSync } = require("node:fs");
const { join } = require("node:path");
const { test } = require("node:test");

const workspaceRoot = join(__dirname, "..", "..", "..");
const migration = readFileSync(
  join(
    workspaceRoot,
    "apps/api/prisma/migrations/20260720020000_add_store_offer_guest_cart_foundation/migration.sql",
  ),
  "utf8",
);

test("commerce migration is additive, scoped, and constraint-backed", () => {
  for (const table of [
    "stores",
    "product_offers",
    "carts",
    "cart_lines",
    "cart_mutation_records",
    "commerce_audit_events",
  ]) {
    assert.match(migration, new RegExp(`CREATE TABLE "${table}"`));
  }

  assert.match(migration, /product_offers_one_active_per_store_product/);
  assert.match(migration, /product_offers_store_id_product_id_version_key/);
  assert.match(migration, /WHERE "status" = 'ACTIVE'/);
  assert.match(migration, /FOREIGN KEY \("cart_id", "store_id"\)/);
  assert.match(migration, /FOREIGN KEY \("offer_id", "store_id"\)/);
  assert.match(migration, /octet_length\("token_hash"\) = 32/);
  assert.match(
    migration,
    /line_subtotal_amount_rial"::numeric = "unit_price_amount_rial"::numeric \* "quantity"/,
  );
  assert.doesNotMatch(migration, /DROP TABLE|DROP COLUMN|TRUNCATE|DELETE FROM|UPDATE "products"/i);
});

test("Cart implementation guards revision, idempotency, expiry, audit, and serializable races", () => {
  const service = readFileSync(
    join(workspaceRoot, "apps/api/src/commerce/cart.service.ts"),
    "utf8",
  );
  assert.match(service, /TransactionIsolationLevel\.Serializable/);
  assert.match(service, /storeId_keyHash/);
  assert.match(service, /revision: input\.expectedRevision/);
  assert.match(service, /absoluteExpiresAt: \{ gt: now \}/);
  assert.match(service, /commerceAuditEvent\.create/);
  assert.match(service, /timingSafeEqual/);
});

test("Store bootstrap is fixed, idempotent, and refuses to overwrite drift", () => {
  const bootstrap = readFileSync(
    join(workspaceRoot, "apps/api/src/commerce/bootstrap-store.ts"),
    "utf8",
  );
  assert.match(bootstrap, /const storeKey = "fardad"/);
  assert.match(bootstrap, /const profileKey = "fardad-production"/);
  assert.match(bootstrap, /Existing Fardad Store does not match/);
  assert.doesNotMatch(bootstrap, /transaction\.store\.update/);
});
