import type { BrandProfile } from "@fardad/types";

export const fardadBrandProfile: BrandProfile = {
  id: "fardad",
  version: 1,
  approval: "provisional",
  source: {
    kind: "legacy-reference",
    version: "wo-011",
  },
  identity: {
    displayName: "فرداد",
    locale: "fa-IR",
    language: "fa",
    direction: "rtl",
  },
  palette: {
    semanticOverrides: {},
  },
  typography: {
    body: "system-sans",
    display: "system-sans",
  },
  voice: {
    tone: ["heritage", "premium", "warm"],
  },
  assets: {},
  social: {},
  seoIdentity: {
    siteName: "Fardad",
  },
  provisionalFields: [
    "palette",
    "typography",
    "voice",
    "assets.logo",
    "contact",
    "social",
    "legalName",
    "canonicalUrl",
    "copyright",
  ],
};
