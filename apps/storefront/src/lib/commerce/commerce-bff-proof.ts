import "server-only";

import { createHash, createHmac, randomBytes } from "node:crypto";
import { getCommerceBffSharedSecret } from "./commerce-config";

interface CommerceBffProofInput {
  body: string;
  host: string;
  idempotencyKey: string;
  ifMatch: string;
  method: string;
  path: string;
  token: string;
}

export function createCommerceBffProof(input: CommerceBffProofInput): Record<string, string> {
  const timestamp = Math.floor(Date.now() / 1_000).toString();
  const nonce = randomBytes(16).toString("base64url");
  const payload = JSON.stringify([
    "v1",
    input.method.toUpperCase(),
    input.path,
    input.host.toLowerCase(),
    digest(input.token),
    input.ifMatch,
    input.idempotencyKey,
    digest(input.body),
    timestamp,
    nonce,
  ]);
  const signature = createHmac("sha256", getCommerceBffSharedSecret())
    .update(payload, "utf8")
    .digest("base64url");

  return {
    "x-fardad-commerce-bff-nonce": nonce,
    "x-fardad-commerce-bff-signature": signature,
    "x-fardad-commerce-bff-timestamp": timestamp,
  };
}

function digest(value: string): string {
  return createHash("sha256").update(value, "utf8").digest("base64url");
}
