import type { BrandProfile, ContactInformation, PublicAssetReference, SocialLinks } from "./brand";
import type { CapabilityAvailability, FeatureProfile } from "./capabilities";
import type { LocalizedContentProfile } from "./content";
import type { ExperienceProfile } from "./experience";
import type { NavigationGroup, NavigationSource } from "./navigation";
import type { SemanticDesignTokens, ThemePreset } from "./theme";
import type { TextDirection } from "./brand";

export type StoreIdentity = Readonly<{
  name: string;
  legalName?: string;
  locale: string;
  language: string;
  direction: TextDirection;
  url?: string;
  timezone?: string;
  currency?: string;
}>;

export type ResolvedBrandProfile = Readonly<{
  displayName: string;
  slogan?: string;
  description: string;
  logo?: PublicAssetReference;
  contact: ContactInformation;
  social: SocialLinks;
  copyright?: string;
}>;

export type SeoDefaults = Readonly<{
  defaultTitle: string;
  titleTemplate: string;
  description: string;
  keywords?: readonly string[];
  robots: Readonly<{
    index: boolean;
    follow: boolean;
  }>;
  openGraph: Readonly<{
    locale: string;
    siteName: string;
  }>;
}>;

export type StorefrontProfile = Readonly<{
  identity: StoreIdentity;
  brand: ResolvedBrandProfile;
  design: SemanticDesignTokens;
  seo: SeoDefaults;
  navigation: NavigationSource;
  footerNavigation?: readonly NavigationGroup[];
  capabilities: CapabilityAvailability;
  theme: ThemePreset;
  brandProfile: BrandProfile;
  experience: ExperienceProfile;
  feature: FeatureProfile;
  content: LocalizedContentProfile;
}>;
