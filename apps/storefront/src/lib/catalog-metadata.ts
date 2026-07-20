import type { Metadata } from "next";
import { fardadProfile } from "@/src/config/fardad-store";

type CatalogMetadataInput = {
  canonicalPath: string;
  description: string;
  page: number;
  title: string;
};

export function createCatalogMetadata({
  canonicalPath,
  description,
  page,
  title,
}: CatalogMetadataInput): Metadata {
  const canonical = page === 1 ? canonicalPath : `${canonicalPath}?page=${page}`;

  return {
    alternates: { canonical },
    description,
    robots: page === 1 ? { follow: true, index: true } : { follow: true, index: false },
    title,
    openGraph: {
      description,
      locale: fardadProfile.seo.openGraph.locale,
      siteName: fardadProfile.seo.openGraph.siteName,
      title,
      type: "website",
      url: canonical,
    },
  };
}
