import type { ThemePreset } from "@fardad/types";

export const luxuryHeritageThemePreset: ThemePreset = {
  id: "luxury-heritage",
  version: 2,
  approval: "provisional",
  sourceVersion: "wo-043b-1-visual-foundation",
  tokens: {
    colors: {
      // WO-043B-1 keeps these roles provisional until Fardad approves the final brand palette.
      background: "#F8F4EC",
      surface: "#FFFFFF",
      text: "#081613",
      mutedText: "#4B5563",
      primary: "#0E3B2E",
      primaryContrast: "#FFFFFF",
      secondary: "#C2A46B",
      secondaryContrast: "#081613",
      border: "#8C8273",
      focus: "#A97142",
    },
    radius: {
      small: "0.5rem",
      medium: "1rem",
    },
    typography: {
      body: "system-sans",
      display: "system-sans",
    },
    elevation: {
      card: "soft",
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
