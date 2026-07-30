import type { StorefrontComposition } from "@fardad/types";
import { getThemePreset } from "@/src/themes/theme-preset-registry";
import { fardadBrandProfile } from "./brand-profile";
import { fardadExperienceProfile } from "./experience-profile";
import { fardadFeatureProfile } from "./feature-profile";
import { fardadLocalizedContentProfile } from "./content.fa";

export const fardadStorefrontComposition: StorefrontComposition = {
  id: "fardad-production",
  version: 2,
  theme: getThemePreset("luxury-heritage"),
  brand: fardadBrandProfile,
  experience: fardadExperienceProfile,
  feature: fardadFeatureProfile,
  content: fardadLocalizedContentProfile,
};

export {
  fardadBrandProfile,
  fardadExperienceProfile,
  fardadFeatureProfile,
  fardadLocalizedContentProfile,
};
