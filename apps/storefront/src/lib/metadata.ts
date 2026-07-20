import type { Metadata } from "next";
import type { StorefrontProfile } from "@fardad/types";

export function createStorefrontMetadata(profile: StorefrontProfile): Metadata {
  return {
    metadataBase: profile.identity.url ? new URL(profile.identity.url) : undefined,
    title: {
      default: profile.seo.defaultTitle,
      template: profile.seo.titleTemplate,
    },
    description: profile.seo.description,
    keywords: profile.seo.keywords ? [...profile.seo.keywords] : undefined,
    robots: profile.seo.robots,
    openGraph: {
      type: "website",
      locale: profile.seo.openGraph.locale,
      siteName: profile.seo.openGraph.siteName,
    },
  };
}
