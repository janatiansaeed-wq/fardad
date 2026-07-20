import type { ThemePreset } from "@fardad/types";

export const luxuryHeritageThemePreset: ThemePreset = {
  id: "luxury-heritage",
  version: 1,
  approval: "provisional",
  sourceVersion: "wo-011-legacy-reference",
  tokens: {
    colors: {
      background: "#F8F4EC",
      surface: "#FFFFFF",
      text: "#081613",
      mutedText: "#4B5563",
      primary: "#0E3B2E",
      primaryContrast: "#FFFFFF",
      secondary: "#C2A46B",
      secondaryContrast: "#081613",
      border: "#E5E7EB",
      focus: "#A97142",
    },
    radius: {
      small: "0.5rem",
      medium: "1.5rem",
    },
    typography: {
      body: "system-sans",
      display: "system-sans",
    },
    elevation: {
      card: "raised",
    },
    contentMaxWidth: "90rem",
  },
  layout: {
    density: "spacious",
    sectionRhythm: "generous",
  },
  motionLimit: "restrained",
  mediaTreatment: "editorial",
  allowed: {
    shell: ["standard"],
    hero: ["centered"],
    features: ["three-column"],
    categories: ["card-grid"],
    productCard: ["standard"],
    mobileNavigation: ["disclosure"],
    homeSections: ["hero", "features", "categories"],
  },
};
