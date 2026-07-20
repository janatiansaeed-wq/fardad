import type { ExperienceProfile } from "@fardad/types";

export const fardadExperienceProfile: ExperienceProfile = {
  id: "fardad-luxury-heritage",
  version: 1,
  approval: "provisional",
  sourceVersion: "wo-011-legacy-reference",
  themePreset: {
    id: "luxury-heritage",
    version: 1,
  },
  shell: "standard",
  home: {
    sections: ["hero", "features", "categories"],
    hero: "centered",
    features: "three-column",
    categories: "card-grid",
  },
  productCard: "standard",
  density: "spacious",
  motion: "restrained",
  mobileNavigation: "disclosure",
  provisionalFields: ["themePreset", "home", "productCard", "density", "motion"],
};
