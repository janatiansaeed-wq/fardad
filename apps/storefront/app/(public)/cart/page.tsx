import type { Metadata } from "next";
import { notFound } from "next/navigation";
import CartExperience from "@/components/commerce/CartExperience";
import { getCurrentGuestCartState } from "@/src/lib/commerce/cart-session";
import { getStorefrontProfile } from "@/src/lib/storefront-config";
import { isShopPublished } from "@/src/lib/shop-capability";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const { content } = getStorefrontProfile();
  return {
    description: content.cart.metadataDescription,
    title: content.cart.metadataTitle,
  };
}

export default async function CartPage() {
  const profile = getStorefrontProfile();

  if (!isShopPublished(profile)) {
    notFound();
  }

  const { cart, wasExpired } = await getCurrentGuestCartState();

  return (
    <CartExperience
      content={profile.content.cart}
      initialCart={cart}
      initialMessage={wasExpired ? profile.content.cart.expiredMessage : undefined}
      locale={profile.content.locale}
    />
  );
}
