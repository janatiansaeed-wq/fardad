import "server-only";

import { randomBytes } from "node:crypto";

export const cartCookieName = "__Host-fardad-cart";
export const cartCookieMaxAgeSeconds = 2_592_000;

const cartTokenPattern = /^[A-Za-z0-9_-]{43}$/;

export function generateGuestCartToken(): string {
  return randomBytes(32).toString("base64url");
}

export function isGuestCartToken(value: string | undefined): value is string {
  return typeof value === "string" && cartTokenPattern.test(value);
}

export const cartCookieOptions = {
  httpOnly: true,
  maxAge: cartCookieMaxAgeSeconds,
  path: "/",
  sameSite: "lax",
  secure: true,
} as const;
