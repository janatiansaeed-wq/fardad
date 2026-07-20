"use server";

import { randomBytes } from "node:crypto";
import { cookies, headers } from "next/headers";
import type { AddCartLineInput, SetCartLineQuantityInput } from "@fardad/types";
import {
  addGuestCartLine,
  createGuestCart,
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

export async function createGuestCartAction(): Promise<void> {
  await assertSameOriginMutation();
  await getOrCreateToken();
}

export async function addGuestCartLineAction(
  input: AddCartLineInput,
  revision: number,
): Promise<void> {
  await assertSameOriginMutation();
  const token = await getOrCreateToken();
  await addGuestCartLine(token, revision, generateIdempotencyKey(), input);
  await refreshCookie(token);
}

export async function setGuestCartLineQuantityAction(
  lineReference: string,
  input: SetCartLineQuantityInput,
  revision: number,
): Promise<void> {
  await assertSameOriginMutation();
  const token = await requireToken();
  await setGuestCartLineQuantity(token, lineReference, revision, generateIdempotencyKey(), input);
  await refreshCookie(token);
}

export async function removeGuestCartLineAction(
  lineReference: string,
  revision: number,
): Promise<void> {
  await assertSameOriginMutation();
  const token = await requireToken();
  await removeGuestCartLine(token, lineReference, revision, generateIdempotencyKey());
  await refreshCookie(token);
}

export async function refreshGuestCartQuoteAction(revision: number): Promise<void> {
  await assertSameOriginMutation();
  const token = await requireToken();
  await refreshGuestCartQuote(token, revision, generateIdempotencyKey());
  await refreshCookie(token);
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
