const assert = require("node:assert/strict");
const { readFileSync } = require("node:fs");
const { join } = require("node:path");
const { test } = require("node:test");

const workspaceRoot = join(__dirname, "..", "..", "..");
const read = (path) => readFileSync(join(workspaceRoot, path), "utf8");

test("all five Cart mutations require Commerce BFF proof before service mutation", () => {
  const controller = read("apps/api/src/commerce/public-cart.controller.ts");
  assert.equal((controller.match(/this\.assertTrustedMutation\(requestHeaders/g) ?? []).length, 5);
  for (const path of [
    'path: "/public/cart"',
    'path: "/public/cart/lines"',
    "path: `/public/cart/lines/",
    'path: "/public/cart/quote/refresh"',
  ]) {
    assert.match(controller, new RegExp(path.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  }
  assert.ok(
    controller.indexOf("this.assertTrustedMutation") < controller.indexOf("createOrResolve(token"),
  );
});

test("proof is server-only, timing-safe, bounded, replay-protected, and not a public contract", () => {
  const proof = read("apps/api/src/commerce/commerce-bff-proof.service.ts");
  const env = read("apps/api/src/config/env.validation.ts");
  const contracts = read("packages/types/src/commerce.ts");
  assert.match(proof, /createHmac/);
  assert.match(proof, /timingSafeEqual/);
  assert.match(proof, /proofLifetimeMilliseconds = 60_000/);
  assert.match(proof, /usedNonces/);
  assert.match(proof, /input\.origin !== undefined/);
  assert.match(env, /COMMERCE_BFF_SHARED_SECRET: z\.string\(\)\.min\(32\)/);
  assert.doesNotMatch(contracts, /BFF|signature|nonce|shared.?secret/i);
});
