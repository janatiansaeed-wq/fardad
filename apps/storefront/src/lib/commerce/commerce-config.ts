import "server-only";

const fardadCommerceStoreKey = "fardad";

export function assertCommerceStoreBinding(): void {
  if (process.env.COMMERCE_STORE_KEY !== fardadCommerceStoreKey) {
    throw new Error("Commerce Store binding is unavailable");
  }
}

export function getCommerceBffSharedSecret(): string {
  const secret = process.env.COMMERCE_BFF_SHARED_SECRET;

  if (!secret || Buffer.byteLength(secret, "utf8") < 32) {
    throw new Error("Commerce BFF proof configuration is unavailable");
  }

  return secret;
}
