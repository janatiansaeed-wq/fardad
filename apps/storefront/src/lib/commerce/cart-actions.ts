"use server";

import { randomBytes } from "node:crypto";
import { cookies, headers } from "next/headers";
import type { AddCartLineInput, PublicCart, SetCartLineQuantityInput } from "@fardad/types";
import {
  addGuestCartLine,
  createGuestCart,
  getGuestCart,
  PublicCommerceConflictError,
  PublicCommerceRequestError,
  refreshGuestCartQuote,
  removeGuestCartLine,
  setGuestCartLineQuantity,
} from "@/src/lib/api/public-commerce";
import {
  cartCookieName,
  cartCookieOptions,
  generateGuestCartToken,
  isGuestCartToken,
} from "./cart-cookie";

export type CartActionResult =
  | Readonly<{ cart: PublicCart; status: "success" }>
  | Readonly<{
      cart: PublicCart | null;
      status: "failure";
      reason: "cart-expired" | "generic" | "quantity" | "revision-conflict" | "unavailable";
    }>;

export async function createGuestCartAction(): Promise<CartActionResult> {
  return executeCartAction(async (setToken) => {
    const token = await getOrCreateToken();
    setToken(token);
    return token;
  });
}

export async function addGuestCartLineAction(input: AddCartLineInput): Promise<CartActionResult> {
  return executeCartAction(async (setToken) => {
    const token = await getOrCreateToken();
    setToken(token);
    const cart = await getGuestCart(token);
    await addGuestCartLine(token, cart.revision, generateIdempotencyKey(), input);
    return token;
  });
}

export async function setGuestCartLineQuantityAction(
  lineReference: string,
  input: SetCartLineQuantityInput,
  revision: number,
): Promise<CartActionResult> {
  return executeCartAction(async (setToken) => {
    const token = await requireToken();
    setToken(token);
    await setGuestCartLineQuantity(token, lineReference, revision, generateIdempotencyKey(), input);
    return token;
  });
}

export async function removeGuestCartLineAction(
  lineReference: string,
  revision: number,
): Promise<CartActionResult> {
  return executeCartAction(async (setToken) => {
    const token = await requireToken();
    setToken(token);
    await removeGuestCartLine(token, lineReference, revision, generateIdempotencyKey());
    return token;
  });
}

export async function refreshGuestCartQuoteAction(revision: number): Promise<CartActionResult> {
  return executeCartAction(async (setToken) => {
    const token = await requireToken();
    setToken(token);
    await refreshGuestCartQuote(token, revision, generateIdempotencyKey());
    return token;
  });
}

async function executeCartAction(
  operation: (setToken: (token: string) => void) => Promise<string>,
): Promise<CartActionResult> {
  let token: string | undefined;

  try {
    await assertSameOriginMutation();
    token = await operation((currentToken) => {
      token = currentToken;
    });
    await refreshCookie(token);
    return { cart: await getGuestCart(token), status: "success" };
  } catch (error) {
    return {
      cart: token ? await readCartAfterFailure(token) : null,
      reason: mapCartActionFailure(error),
      status: "failure",
    };
  }
}

async function readCartAfterFailure(token: string): Promise<PublicCart | null> {
  try {
    return await getGuestCart(token);
  } catch {
    return null;
  }
}

function mapCartActionFailure(
  error: unknown,
): Extract<CartActionResult, { status: "failure" }>["reason"] {
  if (error instanceof PublicCommerceConflictError) {
    return "revision-conflict";
  }

  if (error instanceof PublicCommerceRequestError) {
    switch (error.code) {
      case "CART_EXPIRED":
        return "cart-expired";
      case "PRODUCT_UNAVAILABLE":
        return "unavailable";
      case "QUANTITY_NOT_ALLOWED":
      case "CART_LIMIT_REACHED":
        return "quantity";
      default:
        return "generic";
    }
  }

  return "generic";
}

async function getOrCreateToken(): Promise<string> {
  const cookieStore = await cookies();
  const current = cookieStore.get(cartCookieName)?.value;

  if (isGuestCartToken(current)) {
    try {
      await createGuestCart(current);
      cookieStore.set(cartCookieName, current, cartCookieOptions);
      return current;
    } catch (error) {
      if (!(error instanceof PublicCommerceRequestError) || error.code !== "CART_EXPIRED") {
        throw error;
      }
    }
  }

  const token = generateGuestCartToken();
  await createGuestCart(token);
  cookieStore.set(cartCookieName, token, cartCookieOptions);
  return token;
}

async function refreshCookie(token: string): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(cartCookieName, token, cartCookieOptions);
}

async function requireToken(): Promise<string> {
  const cookieStore = await cookies();
  const token = cookieStore.get(cartCookieName)?.value;

  if (!isGuestCartToken(token)) {
    throw new Error("Guest Cart is unavailable");
  }

  return token;
}

async function assertSameOriginMutation(): Promise<void> {
  const requestHeaders = await headers();
  const originValue = requestHeaders.get("origin");
  const host = requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host");
  const forwardedProtocol = requestHeaders.get("x-forwarded-proto");

  if (!originValue || !host) {
    throw new Error("Invalid commerce mutation origin");
  }

  let origin: URL;

  try {
    origin = new URL(originValue);
  } catch {
    throw new Error("Invalid commerce mutation origin");
  }

  const isLoopback = ["localhost", "127.0.0.1", "[::1]"].includes(origin.hostname);

  if (
    origin.host !== host ||
    (forwardedProtocol && origin.protocol !== `${forwardedProtocol}:`) ||
    (!forwardedProtocol && origin.protocol !== "https:" && !isLoopback)
  ) {
    throw new Error("Invalid commerce mutation origin");
  }
}

function generateIdempotencyKey(): string {
  return randomBytes(32).toString("base64url");
}
