import { createHash, timingSafeEqual } from "node:crypto";

export class TokenHasher {
  static hash(token: string): string {
    return createHash("sha256").update(token).digest("hex");
  }

  static matches(token: string, storedHash: string): boolean {
    const tokenHash = Buffer.from(this.hash(token), "hex");
    const expectedHash = Buffer.from(storedHash, "hex");

    return tokenHash.length === expectedHash.length && timingSafeEqual(tokenHash, expectedHash);
  }
}
