import type { ExperienceProfile } from "@fardad/types";

export const fardadExperienceProfile: ExperienceProfile = {
  id: "fardad-luxury-heritage",
  version: 2,
  approval: "provisional",
  sourceVersion: "wo-043b-1-visual-foundation",
  themePreset: {
    id: "luxury-heritage",
    version: 2,
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
