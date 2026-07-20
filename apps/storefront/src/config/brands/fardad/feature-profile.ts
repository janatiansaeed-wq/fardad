import { getEntitledCapabilities } from "@fardad/config/capabilities";
import type { FeatureProfile } from "@fardad/types";

const edition = "base" as const;

export const fardadFeatureProfile: FeatureProfile = {
  id: "fardad-base",
  version: 1,
  edition,
  entitled: getEntitledCapabilities(edition),
  availability: {
    enabled: new Set([
      "catalog.products",
      "catalog.shop",
      "content.articles",
      "content.news",
      "content.digitalCatalog",
      "pages.about",
      "pages.contact",
      "account.foundation",
    ]),
    // Only routes with a publishable storefront implementation are exposed.
    // Product Experience extensions remain unavailable until their public flows exist.
    implemented: new Set(["catalog.products"]),
  },
};
