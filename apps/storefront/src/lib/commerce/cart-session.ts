import "server-only";

import { cookies } from "next/headers";
import type { PublicCart } from "@fardad/types";
import {
  getGuestCart,
  PublicCommerceNotFoundError,
  PublicCommerceRequestError,
} from "@/src/lib/api/public-commerce";
import { cartCookieName, isGuestCartToken } from "./cart-cookie";

export async function getCurrentGuestCart(): Promise<PublicCart | null> {
  const { cart } = await getCurrentGuestCartState();
  return cart;
}

export async function getCurrentGuestCartState(): Promise<
  Readonly<{
    cart: PublicCart | null;
    wasExpired: boolean;
  }>
> {
  const cookieStore = await cookies();
  const token = cookieStore.get(cartCookieName)?.value;

  if (!isGuestCartToken(token)) {
    return { cart: null, wasExpired: false };
  }

  try {
    return { cart: await getGuestCart(token), wasExpired: false };
  } catch (error) {
    if (error instanceof PublicCommerceNotFoundError) {
      return { cart: null, wasExpired: false };
    }

    if (error instanceof PublicCommerceRequestError && error.code === "CART_EXPIRED") {
      return { cart: null, wasExpired: true };
    }

    throw error;
  }
}
