import type { FontFamilyId, SemanticColorTokens } from "./theme";

export type TextDirection = "ltr" | "rtl";
export type BrandApprovalState = "provisional" | "approved";

export type PublicAssetReference = Readonly<{
  src: string;
  alt: string;
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
  id: string;
  version: number;
  approval: BrandApprovalState;
  source: Readonly<{
    kind: "legacy-reference" | "brand-specification";
    version: string;
  }>;
  identity: Readonly<{
    displayName: string;
    legalName?: string;
    locale: string;
    language: string;
    direction: TextDirection;
    canonicalUrl?: string;
    timezone?: string;
    currency?: string;
  }>;
  palette: Readonly<{
    semanticOverrides: Partial<SemanticColorTokens>;
  }>;
  typography: Readonly<{
    body: FontFamilyId;
    display: FontFamilyId;
  }>;
  voice: Readonly<{
    tone: readonly ("heritage" | "premium" | "warm" | "precise")[];
  }>;
  assets: Readonly<{
    logo?: PublicAssetReference;
  }>;
  contact?: ContactInformation;
  social?: SocialLinks;
  seoIdentity: Readonly<{
    siteName: string;
  }>;
  copyright?: string;
  provisionalFields: readonly string[];
}>;
