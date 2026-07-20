import assert from "node:assert/strict";
import { test } from "node:test";
import {
  CommerceBffProofService,
  createCommerceBffSignature,
} from "../../src/commerce/commerce-bff-proof.service";

const secret = "test-commerce-bff-secret-at-least-32-bytes";
const now = 1_750_000_000_000;

function signedInput(overrides: Record<string, string | undefined> = {}) {
  const input = {
    body: "",
    host: "127.0.0.1:4015",
    idempotencyKey: "",
    ifMatch: "",
    method: "POST",
    nonce: "AAAAAAAAAAAAAAAAAAAAAA",
    origin: undefined,
    path: "/public/cart",
    timestamp: Math.floor(now / 1_000).toString(),
    token: "0123456789abcdef0123456789abcdef0123456789a",
    ...overrides,
  };

  return {
    ...input,
    signature: createCommerceBffSignature(secret, {
      body: input.body ?? "",
      host: input.host ?? "",
      idempotencyKey: input.idempotencyKey ?? "",
      ifMatch: input.ifMatch ?? "",
      method: input.method ?? "",
      nonce: input.nonce ?? "",
      path: input.path ?? "",
      timestamp: input.timestamp ?? "",
      token: input.token ?? "",
    }),
  };
}

test("accepts one current proof bound to the mutation request", () => {
  const service = new CommerceBffProofService();
  assert.doesNotThrow(() => service.assertTrustedMutation(signedInput(), now));
});

test("rejects absent, invalid, stale, future, Origin-bearing, and Host-mismatched proofs", () => {
  const cases = [
    { signature: undefined },
    { signature: "A".repeat(43) },
    signedInput({ timestamp: Math.floor((now - 61_000) / 1_000).toString() }),
    signedInput({ timestamp: Math.floor((now + 61_000) / 1_000).toString() }),
    signedInput({ origin: "https://storefront.example" }),
    { ...signedInput(), host: "attacker.example" },
  ];

  for (const candidate of cases) {
    const service = new CommerceBffProofService();
    const input = "path" in candidate ? candidate : { ...signedInput(), ...candidate };
    assert.throws(() => service.assertTrustedMutation(input, now), /Commerce request forbidden/);
  }
});

test("rejects replay of an otherwise valid nonce", () => {
  const service = new CommerceBffProofService();
  const input = signedInput();
  service.assertTrustedMutation(input, now);
  assert.throws(() => service.assertTrustedMutation(input, now), /Commerce request forbidden/);
});
