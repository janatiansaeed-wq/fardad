import { getEntitledCapabilities } from "@fardad/config/capabilities";
import type { CapabilityAvailability, CommerceEdition } from "@fardad/types";

export const fardadEdition: CommerceEdition = "base";

export const fardadEntitledCapabilities = getEntitledCapabilities(fardadEdition);

export const fardadCapabilityAvailability: CapabilityAvailability = {
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
  // WO-006 extensions intentionally remain absent until their public flows exist.
  implemented: new Set(["catalog.products"]),
};
