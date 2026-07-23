import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { PublicProductDetail, PublicPurchasingOption } from "@fardad/types";
import ProductDetail from "@/components/catalog/ProductDetail";
import {
  getPublicPurchasingOption,
  PublicCommerceNotFoundError,
  PublicCommerceRequestError,
} from "@/src/lib/api/public-commerce";
import { getPublicProduct, PublicCatalogNotFoundError } from "@/src/lib/api/public-catalog";
import { createProductMetadata } from "@/src/lib/product-metadata";
import { isShopPublished } from "@/src/lib/shop-capability";
import { getStorefrontProfile } from "@/src/lib/storefront-config";

type ProductDetailPageProps = Readonly<{
  params: Promise<{ slug: string }>;
}>;

export const dynamic = "force-dynamic";

async function resolvePublicProduct(slug: string): Promise<PublicProductDetail> {
  try {
    return await getPublicProduct(slug);
  } catch (error) {
    if (error instanceof PublicCatalogNotFoundError) {
      notFound();
    }

    throw error;
  }
}

async function resolvePurchasingOption(slug: string): Promise<PublicPurchasingOption | null> {
  try {
    return await getPublicPurchasingOption(slug);
  } catch (error) {
    if (
      error instanceof PublicCommerceNotFoundError ||
      error instanceof PublicCommerceRequestError
    ) {
      return null;
    }

    return null;
  }
}

export async function generateMetadata({ params }: ProductDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await resolvePublicProduct(slug);
  return createProductMetadata(product, getStorefrontProfile());
}

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { slug } = await params;
  const profile = getStorefrontProfile();
  const shoppingPublished = isShopPublished(profile);
  const [product, purchasingOption] = await Promise.all([
    resolvePublicProduct(slug),
    shoppingPublished ? resolvePurchasingOption(slug) : Promise.resolve(null),
  ]);

  return (
    <ProductDetail
      content={profile.content.productDetail}
      density={profile.experience.density}
      isShoppingPublished={shoppingPublished}
      locale={profile.content.locale}
      product={product}
      purchasingOption={purchasingOption}
    />
  );
}
