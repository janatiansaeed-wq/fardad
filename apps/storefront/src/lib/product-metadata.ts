import type { Metadata } from "next";
import type { PublicProductDetail, StorefrontProfile } from "@fardad/types";

export function createProductMetadata(
  product: PublicProductDetail,
  profile: StorefrontProfile,
): Metadata {
  const title = product.seo.title?.trim() || product.name;
  const description = product.seo.description?.trim() || product.shortDescription;
  const productPath = `/products/${encodeURIComponent(product.slug)}`;
  const canonicalUrl = profile.identity.url
    ? new URL(productPath, profile.identity.url).toString()
    : undefined;

  return {
    ...(canonicalUrl ? { alternates: { canonical: canonicalUrl } } : {}),
    description,
    robots: { follow: true, index: true },
    title,
    openGraph: {
      description,
      locale: profile.seo.openGraph.locale,
      siteName: profile.seo.openGraph.siteName,
      title,
      type: "website",
      ...(canonicalUrl ? { url: canonicalUrl } : {}),
      ...(product.mainImage
        ? {
            images: [
              {
                alt: product.mainImage.alt,
                url: product.mainImage.src,
              },
            ],
          }
        : {}),
    },
  };
}
