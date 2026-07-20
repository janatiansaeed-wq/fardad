import { createHash, randomBytes } from "node:crypto";

const cartTokenPattern = /^[A-Za-z0-9_-]{43}$/;
const operationKeyPattern = /^[A-Za-z0-9_-]{22,86}$/;
const lineReferencePattern = /^[A-Za-z0-9_-]{22}$/;

export function generateCartToken(): string {
  return randomBytes(32).toString("base64url");
}

export function assertCartToken(value: string | undefined): string {
  if (!value || !cartTokenPattern.test(value)) {
    throw new Error("Invalid cart token");
  }

  return value;
}

export type CommerceDigest = Uint8Array<ArrayBuffer>;

export function hashCartToken(value: string): CommerceDigest {
  return sha256(assertCartToken(value));
}

export function assertOperationKey(value: string | undefined): string {
  if (!value || !operationKeyPattern.test(value)) {
    throw new Error("Invalid operation key");
  }

  return value;
}

export function assertLineReference(value: string): string {
  if (!lineReferencePattern.test(value)) {
    throw new Error("Invalid line reference");
  }

  return value;
}

export function generateLineReference(): string {
  return randomBytes(16).toString("base64url");
}

export function sha256(value: string): CommerceDigest {
  return copyDigest(createHash("sha256").update(value, "utf8").digest());
}

export function digestToHex(value: CommerceDigest): string {
  return Buffer.from(value).toString("hex");
}

export function copyDigest(value: Uint8Array): CommerceDigest {
  const result = new Uint8Array(value.byteLength);
  result.set(value);
  return result;
}
