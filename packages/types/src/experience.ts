import type {
  CategoryVariantId,
  FeatureVariantId,
  HeroVariantId,
  HomeSectionId,
  LayoutDensityId,
  MobileNavigationVariantId,
  MotionProfileId,
  ProductCardVariantId,
  ShellVariantId,
} from "./theme";

export type ExperienceProfile = Readonly<{
  id: string;
  version: number;
  approval: "provisional" | "approved";
  sourceVersion: string;
  themePreset: Readonly<{
    id: string;
    version: number;
  }>;
  shell: ShellVariantId;
  home: Readonly<{
    sections: readonly HomeSectionId[];
    hero: HeroVariantId;
    features: FeatureVariantId;
    categories: CategoryVariantId;
  }>;
  productCard: ProductCardVariantId;
  density: LayoutDensityId;
  motion: MotionProfileId;
  mobileNavigation: MobileNavigationVariantId;
  provisionalFields: readonly string[];
}>;
