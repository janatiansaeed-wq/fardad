import "server-only";

import { cookies } from "next/headers";
import type { PublicCart } from "@fardad/types";
import { getGuestCart, PublicCommerceNotFoundError } from "@/src/lib/api/public-commerce";
import { cartCookieName, isGuestCartToken } from "./cart-cookie";

export async function getCurrentGuestCart(): Promise<PublicCart | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(cartCookieName)?.value;

  if (!isGuestCartToken(token)) {
    return null;
  }

  try {
    return await getGuestCart(token);
  } catch (error) {
    if (error instanceof PublicCommerceNotFoundError) {
      return null;
    }

    throw error;
  }
}
