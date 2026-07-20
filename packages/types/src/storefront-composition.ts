import type { BrandProfile } from "./brand";
import type { LocalizedContentProfile } from "./content";
import type { FeatureProfile } from "./capabilities";
import type { ExperienceProfile } from "./experience";
import type { ThemePreset } from "./theme";

export type StorefrontComposition = Readonly<{
  id: string;
  version: number;
  theme: ThemePreset;
  brand: BrandProfile;
  experience: ExperienceProfile;
  feature: FeatureProfile;
  content: LocalizedContentProfile;
}>;
