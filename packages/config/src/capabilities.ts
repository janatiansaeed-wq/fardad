import type { CommerceCapability, CommerceEdition } from "@fardad/types";

export const editionCapabilityRegistry: Readonly<Record<CommerceEdition, readonly CommerceCapability[]>> = {
  base: [
    "catalog.products",
    "catalog.shop",
    "content.articles",
    "content.news",
    "content.digitalCatalog",
    "pages.about",
    "pages.contact",
    "account.foundation",
  ],
  plus: [
    "product.intelligence",
    "gift.experience",
    "gift.boxes",
    "gift.addonServices",
    "product.configuration",
  ],
  pro: ["marketing.intelligence", "crm.foundation", "analytics.advanced"],
  enterprise: ["corporate.sales", "intelligence.aiBi", "platform.multiWebsite"],
};

const editionOrder: readonly CommerceEdition[] = ["base", "plus", "pro", "enterprise"];

export function getEntitledCapabilities(edition: CommerceEdition): ReadonlySet<CommerceCapability> {
  const lastEditionIndex = editionOrder.indexOf(edition);
  return new Set(
    editionOrder.slice(0, lastEditionIndex + 1).flatMap((entry) => editionCapabilityRegistry[entry]),
  );
}
