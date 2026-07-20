export type HexColor = `#${string}`;

export type FontFamilyId = "system-sans" | "system-serif";
export type CardShadowId = "none" | "soft" | "raised";
export type LayoutDensityId = "comfortable" | "spacious";
export type MotionProfileId = "none" | "restrained";
export type MediaTreatmentId = "natural" | "editorial";
export type ShellVariantId = "standard";
export type HeroVariantId = "centered";
export type FeatureVariantId = "three-column";
export type CategoryVariantId = "card-grid";
export type ProductCardVariantId = "standard";
export type MobileNavigationVariantId = "disclosure";
export type HomeSectionId = "hero" | "features" | "categories";

export type SemanticColorTokens = Readonly<{
  background: HexColor;
  surface: HexColor;
  text: HexColor;
  mutedText: HexColor;
  primary: HexColor;
  primaryContrast: HexColor;
  secondary: HexColor;
  secondaryContrast: HexColor;
  border: HexColor;
  focus: HexColor;
}>;

export type SemanticDesignTokens = Readonly<{
  colors: SemanticColorTokens;
  radius: Readonly<{
    small: `${number}rem`;
    medium: `${number}rem`;
  }>;
  typography: Readonly<{
    body: FontFamilyId;
    display: FontFamilyId;
  }>;
  elevation: Readonly<{
    card: CardShadowId;
  }>;
  contentMaxWidth: `${number}rem`;
}>;

export type ThemePreset = Readonly<{
  id: string;
  version: number;
  approval: "provisional" | "approved";
  sourceVersion: string;
  tokens: SemanticDesignTokens;
  layout: Readonly<{
    density: LayoutDensityId;
    sectionRhythm: "generous";
  }>;
  motionLimit: MotionProfileId;
  mediaTreatment: MediaTreatmentId;
  allowed: Readonly<{
    shell: readonly ShellVariantId[];
    hero: readonly HeroVariantId[];
    features: readonly FeatureVariantId[];
    categories: readonly CategoryVariantId[];
    productCard: readonly ProductCardVariantId[];
    mobileNavigation: readonly MobileNavigationVariantId[];
    homeSections: readonly HomeSectionId[];
  }>;
}>;
