export type CommerceEdition = "base" | "plus" | "pro" | "enterprise";

export type CommerceCapability =
  | "catalog.products"
  | "catalog.shop"
  | "content.articles"
  | "content.news"
  | "content.digitalCatalog"
  | "pages.about"
  | "pages.contact"
  | "account.foundation"
  | "product.intelligence"
  | "gift.experience"
  | "gift.boxes"
  | "gift.addonServices"
  | "product.configuration"
  | "marketing.intelligence"
  | "crm.foundation"
  | "analytics.advanced"
  | "corporate.sales"
  | "intelligence.aiBi"
  | "platform.multiWebsite";

export type CapabilityAvailability = Readonly<{
  enabled: ReadonlySet<CommerceCapability>;
  implemented: ReadonlySet<CommerceCapability>;
}>;

export type FeatureProfile = Readonly<{
  id: string;
  version: number;
  edition: CommerceEdition;
  entitled: ReadonlySet<CommerceCapability>;
  availability: CapabilityAvailability;
}>;
