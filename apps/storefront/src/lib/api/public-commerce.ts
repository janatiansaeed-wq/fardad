import "server-only";

import type {
  AddCartLineInput,
  PublicCart,
  PublicCommerceErrorCode,
  PublicPurchasingOption,
  SetCartLineQuantityInput,
} from "@fardad/types";
import { createCommerceBffProof } from "@/src/lib/commerce/commerce-bff-proof";
import { assertCommerceStoreBinding } from "@/src/lib/commerce/commerce-config";

const apiBaseUrl = (process.env.STOREFRONT_API_BASE_URL ?? "http://localhost:4000/api/v1").replace(
  /\/$/,
  "",
);

export class PublicCommerceNotFoundError extends Error {
  constructor() {
    super("Public commerce resource not found");
  }
}

export class PublicCommerceConflictError extends Error {
  constructor(readonly code: PublicCommerceErrorCode) {
    super("Public commerce request conflicted");
  }
}

export class PublicCommerceRequestError extends Error {
  constructor(readonly code?: PublicCommerceErrorCode) {
    super("Public commerce request failed");
  }
}

export async function getPublicPurchasingOption(slug: string): Promise<PublicPurchasingOption> {
  return request<PublicPurchasingOption>(
    `public/commerce/products/${encodeURIComponent(slug)}/purchasing-option`,
    { method: "GET" },
  );
}

export async function createGuestCart(token: string): Promise<void> {
  const path = "public/cart";
  await request<void>(path, bffMutationRequest(path, token, undefined, undefined, "POST", ""));
}

export async function getGuestCart(token: string): Promise<PublicCart> {
  return request<PublicCart>("public/cart", {
    headers: cartHeaders(token),
    method: "GET",
  });
}

export async function addGuestCartLine(
  token: string,
  revision: number,
  idempotencyKey: string,
  input: AddCartLineInput,
): Promise<void> {
  const path = "public/cart/lines";
  const body = JSON.stringify({ productSlug: input.productSlug, quantity: input.quantity });
  await request<void>(
    path,
    bffMutationRequest(path, token, revision, idempotencyKey, "POST", body),
  );
}

export async function setGuestCartLineQuantity(
  token: string,
  lineReference: string,
  revision: number,
  idempotencyKey: string,
  input: SetCartLineQuantityInput,
): Promise<void> {
  const path = `public/cart/lines/${encodeURIComponent(lineReference)}`;
  const body = JSON.stringify({ quantity: input.quantity });
  await request<void>(
    path,
    bffMutationRequest(path, token, revision, idempotencyKey, "PATCH", body),
  );
}

export async function removeGuestCartLine(
  token: string,
  lineReference: string,
  revision: number,
  idempotencyKey: string,
): Promise<void> {
  const path = `public/cart/lines/${encodeURIComponent(lineReference)}`;
  await request<void>(
    path,
    bffMutationRequest(path, token, revision, idempotencyKey, "DELETE", ""),
  );
}

export async function refreshGuestCartQuote(
  token: string,
  revision: number,
  idempotencyKey: string,
): Promise<void> {
  const path = "public/cart/quote/refresh";
  await request<void>(path, bffMutationRequest(path, token, revision, idempotencyKey, "POST", ""));
}

function cartHeaders(token: string): HeadersInit {
  return { "x-fardad-cart-token": token };
}

function bffMutationRequest(
  path: string,
  token: string,
  revision: number | undefined,
  idempotencyKey: string | undefined,
  method: string,
  body: string,
): RequestInit {
  const ifMatch = revision === undefined ? "" : `"${revision}"`;
  const operationKey = idempotencyKey ?? "";
  const target = new URL(`${apiBaseUrl}/${path}`);

  return {
    body: body || undefined,
    headers: {
      ...cartHeaders(token),
      ...createCommerceBffProof({
        body,
        host: target.host,
        idempotencyKey: operationKey,
        ifMatch,
        method,
        path: `/${path}`,
        token,
      }),
      "Content-Type": "application/json",
      ...(operationKey ? { "Idempotency-Key": operationKey } : {}),
      ...(ifMatch ? { "If-Match": ifMatch } : {}),
    },
    method,
  };
}

async function request<T>(path: string, init: RequestInit): Promise<T> {
  assertCommerceStoreBinding();

  let response: Response;

  try {
    response = await fetch(`${apiBaseUrl}/${path}`, {
      ...init,
      cache: "no-store",
      headers: {
        Accept: "application/json",
        ...init.headers,
      },
    });
  } catch {
    throw new PublicCommerceRequestError();
  }

  if (response.status === 404) {
    throw new PublicCommerceNotFoundError();
  }

  if (!response.ok) {
    const code = await readErrorCode(response);

    if (response.status === 409 && code) {
      throw new PublicCommerceConflictError(code);
    }

    throw new PublicCommerceRequestError(code);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
}

async function readErrorCode(response: Response): Promise<PublicCommerceErrorCode | undefined> {
  try {
    const body = (await response.json()) as { code?: unknown };
    return isCommerceErrorCode(body.code) ? body.code : undefined;
  } catch {
    return undefined;
  }
}

function isCommerceErrorCode(value: unknown): value is PublicCommerceErrorCode {
  return (
    typeof value === "string" &&
    [
      "CART_EXPIRED",
      "CART_LIMIT_REACHED",
      "CART_REVISION_CONFLICT",
      "IDEMPOTENCY_CONFLICT",
      "PRODUCT_UNAVAILABLE",
      "QUANTITY_NOT_ALLOWED",
      "QUOTE_CHANGED",
    ].includes(value)
  );
}
