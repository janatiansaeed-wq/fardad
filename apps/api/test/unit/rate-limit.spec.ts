import assert from "node:assert/strict";
import { test } from "node:test";
import { CommerceRateLimitService } from "../../src/commerce/commerce-rate-limit.service";

test("commerce rate limiting is scoped and resets after its bounded window", () => {
  const limiter = new CommerceRateLimitService();
  limiter.consume("store-a:token-a", 2, 1_000, 1_000);
  limiter.consume("store-a:token-a", 2, 1_000, 1_001);
  assert.throws(() => limiter.consume("store-a:token-a", 2, 1_000, 1_002));
  assert.doesNotThrow(() => limiter.consume("store-b:token-a", 2, 1_000, 1_002));
  assert.doesNotThrow(() => limiter.consume("store-a:token-a", 2, 1_000, 2_001));
});
