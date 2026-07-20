import { createHash } from "node:crypto";
import { CommerceDigest, copyDigest } from "./cart-token";
import { addRial, multiplyRial } from "./money";

export const IDEMPOTENCY_TTL_MILLISECONDS = 24 * 60 * 60 * 1_000;

export type QuoteLine = Readonly<{
  offerId: string;
  offerVersion: number;
  productId: string;
  quantity: number;
  unitPriceAmountRial: bigint;
}>;

export function addSeconds(value: Date, seconds: number): Date {
  return new Date(value.getTime() + seconds * 1_000);
}

export function earliestDate(left: Date, right: Date): Date {
  return left.getTime() <= right.getTime() ? left : right;
}

export function calculateCartExpiry(
  now: Date,
  idleTtlSeconds: number,
  absoluteExpiresAt: Date,
): Date {
  return earliestDate(addSeconds(now, idleTtlSeconds), absoluteExpiresAt);
}

export function calculateQuoteExpiry(
  now: Date,
  quoteTtlSeconds: number,
  offerEffectiveUntil: Date | null,
): Date {
  const policyExpiry = addSeconds(now, quoteTtlSeconds);
  return offerEffectiveUntil ? earliestDate(policyExpiry, offerEffectiveUntil) : policyExpiry;
}

export function calculateQuoteTotals(lines: readonly QuoteLine[]): {
  lineSubtotals: readonly bigint[];
  subtotal: bigint;
} {
  const lineSubtotals = lines.map((line) => multiplyRial(line.unitPriceAmountRial, line.quantity));
  const subtotal = lineSubtotals.reduce((total, amount) => addRial(total, amount), 0n);
  return { lineSubtotals, subtotal };
}

export function createLineEquivalenceKey(
  storeId: string,
  productId: string,
  offerId: string,
): CommerceDigest {
  return digestCanonical(["v1", storeId, productId, offerId]);
}

export function createQuoteFingerprint(
  storeVersion: number,
  lines: readonly QuoteLine[],
): CommerceDigest {
  const canonicalLines = [...lines]
    .sort((left, right) => left.productId.localeCompare(right.productId))
    .map((line) =>
      [line.productId, line.offerId, String(line.offerVersion), String(line.quantity)].join("|"),
    );

  return digestCanonical(["v1", String(storeVersion), ...canonicalLines]);
}

export function createMutationRequestHash(parts: readonly string[]): CommerceDigest {
  return digestCanonical(["v1", ...parts]);
}

export function parseExpectedRevision(value: string | undefined): number {
  const match = value?.match(/^"([1-9][0-9]*)"$/);
  const revision = match ? Number(match[1]) : Number.NaN;

  if (!Number.isSafeInteger(revision)) {
    throw new Error("Invalid cart revision");
  }

  return revision;
}

function digestCanonical(parts: readonly string[]): CommerceDigest {
  const hash = createHash("sha256");

  for (const part of parts) {
    hash.update(String(Buffer.byteLength(part, "utf8")));
    hash.update(":");
    hash.update(part, "utf8");
    hash.update("|");
  }

  return copyDigest(hash.digest());
}
