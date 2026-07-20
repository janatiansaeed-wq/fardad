import type { CapabilityAvailability } from "./capabilities";
import type { NavigationGroup, NavigationSource } from "./navigation";

export type TextDirection = "ltr" | "rtl";

export type PublicAssetReference = Readonly<{
  src: string;
  alt: string;
}>;

export type StoreIdentity = Readonly<{
  name: string;
  legalName?: string;
  locale: string;
  language: string;
  direction: TextDirection;
  url: string;
  timezone?: string;
  currency?: string;
}>;

export type ContactInformation = Readonly<{
  email?: string;
  phone?: string;
  mobile?: string;
  address?: string;
}>;

export type SocialLinks = Readonly<{
  instagram?: string;
  telegram?: string;
  whatsapp?: string;
  linkedin?: string;
  aparat?: string;
}>;

export type BrandProfile = Readonly<{
  displayName: string;
  slogan?: string;
  description: string;
  logo?: PublicAssetReference;
  contact: ContactInformation;
  social: SocialLinks;
  copyright: string;
}>;

export type SemanticDesignTokens = Readonly<{
  colors: Readonly<{
    background: string;
    surface: string;
    text: string;
    mutedText: string;
    primary: string;
    primaryContrast: string;
    secondary: string;
    secondaryContrast: string;
    border: string;
    focus: string;
  }>;
  radius: Readonly<{
    small: string;
    medium: string;
  }>;
  contentMaxWidth: string;
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
  brand: BrandProfile;
  design: SemanticDesignTokens;
  seo: SeoDefaults;
  navigation: NavigationSource;
  footerNavigation?: readonly NavigationGroup[];
  capabilities: CapabilityAvailability;
}>;
