import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { PublicProductDetail } from "@fardad/types";
import ProductDetail from "@/components/catalog/ProductDetail";
import { getPublicProduct, PublicCatalogNotFoundError } from "@/src/lib/api/public-catalog";
import { createProductMetadata } from "@/src/lib/product-metadata";
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

export async function generateMetadata({ params }: ProductDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await resolvePublicProduct(slug);
  return createProductMetadata(product, getStorefrontProfile());
}

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { slug } = await params;
  const product = await resolvePublicProduct(slug);
  const profile = getStorefrontProfile();

  return (
    <ProductDetail
      content={profile.content.productDetail}
      density={profile.experience.density}
      product={product}
    />
  );
}
