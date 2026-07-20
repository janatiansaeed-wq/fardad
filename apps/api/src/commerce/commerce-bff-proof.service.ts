import { createHash, createHmac, timingSafeEqual } from "node:crypto";
import { ForbiddenException, Injectable } from "@nestjs/common";
import { env } from "../config";

export const commerceBffHeaders = {
  nonce: "x-fardad-commerce-bff-nonce",
  signature: "x-fardad-commerce-bff-signature",
  timestamp: "x-fardad-commerce-bff-timestamp",
} as const;

const proofVersion = "v1";
const proofLifetimeMilliseconds = 60_000;
const noncePattern = /^[A-Za-z0-9_-]{22}$/;
const signaturePattern = /^[A-Za-z0-9_-]{43}$/;
const timestampPattern = /^\d{10}$/;

export interface CommerceBffProofInput {
  body: string;
  host: string | undefined;
  idempotencyKey: string | undefined;
  ifMatch: string | undefined;
  method: string;
  nonce: string | undefined;
  origin: string | undefined;
  path: string;
  signature: string | undefined;
  timestamp: string | undefined;
  token: string | undefined;
}

interface CommerceBffSignatureInput {
  body: string;
  host: string;
  idempotencyKey: string;
  ifMatch: string;
  method: string;
  nonce: string;
  path: string;
  timestamp: string;
  token: string;
}

@Injectable()
export class CommerceBffProofService {
  private readonly usedNonces = new Map<string, number>();

  assertTrustedMutation(input: CommerceBffProofInput, now = Date.now()): void {
    if (input.origin !== undefined) {
      throw forbiddenCommerceRequest();
    }

    const host = normalizeHost(input.host);
    const timestamp = input.timestamp;
    const nonce = input.nonce;
    const signature = input.signature;

    if (
      !host ||
      !timestamp ||
      !timestampPattern.test(timestamp) ||
      !nonce ||
      !noncePattern.test(nonce) ||
      !signature ||
      !signaturePattern.test(signature)
    ) {
      throw forbiddenCommerceRequest();
    }

    const issuedAt = Number(timestamp) * 1_000;
    if (!Number.isSafeInteger(issuedAt) || Math.abs(now - issuedAt) > proofLifetimeMilliseconds) {
      throw forbiddenCommerceRequest();
    }

    this.removeExpiredNonces(now);
    if (this.usedNonces.has(nonce)) {
      throw forbiddenCommerceRequest();
    }

    const expected = Buffer.from(
      createCommerceBffSignature(env.COMMERCE_BFF_SHARED_SECRET, {
        body: input.body,
        host,
        idempotencyKey: input.idempotencyKey ?? "",
        ifMatch: input.ifMatch ?? "",
        method: input.method,
        nonce,
        path: input.path,
        timestamp,
        token: input.token ?? "",
      }),
      "base64url",
    );
    const received = Buffer.from(signature, "base64url");

    if (expected.length !== received.length || !timingSafeEqual(expected, received)) {
      throw forbiddenCommerceRequest();
    }

    this.usedNonces.set(nonce, issuedAt + proofLifetimeMilliseconds);
  }

  private removeExpiredNonces(now: number): void {
    for (const [nonce, expiresAt] of this.usedNonces) {
      if (expiresAt < now) {
        this.usedNonces.delete(nonce);
      }
    }
  }
}

export function createCommerceBffSignature(
  secret: string,
  input: CommerceBffSignatureInput,
): string {
  const payload = JSON.stringify([
    proofVersion,
    input.method.toUpperCase(),
    input.path,
    input.host.toLowerCase(),
    digest(input.token),
    input.ifMatch,
    input.idempotencyKey,
    digest(input.body),
    input.timestamp,
    input.nonce,
  ]);

  return createHmac("sha256", secret).update(payload, "utf8").digest("base64url");
}

function digest(value: string): string {
  return createHash("sha256").update(value, "utf8").digest("base64url");
}

function normalizeHost(value: string | undefined): string | null {
  if (!value || value.trim() !== value) {
    return null;
  }

  try {
    const parsed = new URL(`http://${value}`);
    if (
      parsed.pathname !== "/" ||
      parsed.search ||
      parsed.hash ||
      parsed.username ||
      parsed.password
    ) {
      return null;
    }

    return parsed.host.toLowerCase();
  } catch {
    return null;
  }
}

function forbiddenCommerceRequest(): ForbiddenException {
  return new ForbiddenException("Commerce request forbidden");
}
