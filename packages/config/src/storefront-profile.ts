import type {
  HexColor,
  SemanticColorTokens,
  SemanticDesignTokens,
  StorefrontComposition,
  StorefrontProfile,
} from "@fardad/types";
import { defaultSemanticTokens } from "./storefront-defaults";

function includesValue<T>(values: readonly T[], value: T): boolean {
  return values.includes(value);
}

function assertNonEmpty(value: string, field: string): void {
  if (!value.trim()) {
    throw new Error(`Storefront profile field ${field} must not be empty.`);
  }
}

function parseHexColor(value: HexColor): readonly [number, number, number] {
  if (!/^#[0-9a-f]{6}$/i.test(value)) {
    throw new Error(`Semantic color ${value} must use six-digit hexadecimal notation.`);
  }

  return [
    Number.parseInt(value.slice(1, 3), 16),
    Number.parseInt(value.slice(3, 5), 16),
    Number.parseInt(value.slice(5, 7), 16),
  ];
}

function relativeLuminance(value: HexColor): number {
  const channels = parseHexColor(value).map((channel) => {
    const normalized = channel / 255;
    return normalized <= 0.03928 ? normalized / 12.92 : ((normalized + 0.055) / 1.055) ** 2.4;
  });

  return channels[0] * 0.2126 + channels[1] * 0.7152 + channels[2] * 0.0722;
}

function contrastRatio(first: HexColor, second: HexColor): number {
  const firstLuminance = relativeLuminance(first);
  const secondLuminance = relativeLuminance(second);
  const lighter = Math.max(firstLuminance, secondLuminance);
  const darker = Math.min(firstLuminance, secondLuminance);
  return (lighter + 0.05) / (darker + 0.05);
}

function assertContrast(
  colors: SemanticColorTokens,
  foreground: keyof SemanticColorTokens,
  background: keyof SemanticColorTokens,
  minimum: number,
): void {
  if (contrastRatio(colors[foreground], colors[background]) < minimum) {
    throw new Error(
      `Semantic colors ${foreground}/${background} do not meet the required ${minimum}:1 contrast ratio.`,
    );
  }
}

export function resolveSemanticTokens(composition: StorefrontComposition): SemanticDesignTokens {
  const { brand, theme } = composition;
  const colors = {
    ...defaultSemanticTokens.colors,
    ...theme.tokens.colors,
    ...brand.palette.semanticOverrides,
  };
  const tokens: SemanticDesignTokens = {
    ...defaultSemanticTokens,
    ...theme.tokens,
    colors,
    radius: { ...defaultSemanticTokens.radius, ...theme.tokens.radius },
    typography: {
      ...defaultSemanticTokens.typography,
      ...theme.tokens.typography,
      ...brand.typography,
    },
    elevation: { ...defaultSemanticTokens.elevation, ...theme.tokens.elevation },
  };

  assertContrast(tokens.colors, "text", "background", 4.5);
  assertContrast(tokens.colors, "primaryContrast", "primary", 4.5);
  assertContrast(tokens.colors, "secondaryContrast", "secondary", 4.5);
  assertContrast(tokens.colors, "focus", "background", 3);

  return tokens;
}

export function validateStorefrontComposition(composition: StorefrontComposition): void {
  const { brand, content, experience, feature, theme } = composition;

  assertNonEmpty(composition.id, "composition.id");
  assertNonEmpty(brand.identity.displayName, "brand.identity.displayName");
  assertNonEmpty(content.locale, "content.locale");

  if (experience.themePreset.id !== theme.id || experience.themePreset.version !== theme.version) {
    throw new Error("Experience Profile references an unavailable Theme Preset version.");
  }

  if (content.locale !== brand.identity.locale) {
    throw new Error("Localized Content Profile locale must match the Brand Profile locale.");
  }

  if (!includesValue(theme.allowed.shell, experience.shell)) {
    throw new Error("Experience Profile selected an unsupported shell variant.");
  }
  if (!includesValue(theme.allowed.hero, experience.home.hero)) {
    throw new Error("Experience Profile selected an unsupported hero variant.");
  }
  if (!includesValue(theme.allowed.features, experience.home.features)) {
    throw new Error("Experience Profile selected an unsupported features variant.");
  }
  if (!includesValue(theme.allowed.categories, experience.home.categories)) {
    throw new Error("Experience Profile selected an unsupported categories variant.");
  }
  if (!includesValue(theme.allowed.productCard, experience.productCard)) {
    throw new Error("Experience Profile selected an unsupported product-card variant.");
  }
  if (!includesValue(theme.allowed.mobileNavigation, experience.mobileNavigation)) {
    throw new Error("Experience Profile selected an unsupported mobile-navigation variant.");
  }
  if (experience.density !== theme.layout.density) {
    throw new Error("Experience Profile selected a density outside the Theme Preset boundary.");
  }
  if (theme.motionLimit === "none" && experience.motion !== "none") {
    throw new Error("Experience Profile selected motion beyond the Theme Preset limit.");
  }

  const uniqueSections = new Set(experience.home.sections);
  if (uniqueSections.size !== experience.home.sections.length) {
    throw new Error("Experience Profile home sections must not contain duplicates.");
  }
  for (const section of experience.home.sections) {
    if (!includesValue(theme.allowed.homeSections, section)) {
      throw new Error(`Experience Profile selected unsupported home section ${section}.`);
    }
  }

  for (const capability of feature.availability.enabled) {
    if (!feature.entitled.has(capability)) {
      throw new Error(`Enabled capability ${capability} is not entitled for this Feature Profile.`);
    }
  }

  resolveSemanticTokens(composition);
}

export function resolveStorefrontComposition(
  composition: StorefrontComposition,
): StorefrontProfile {
  validateStorefrontComposition(composition);

  const { brand, content, experience, feature, theme } = composition;
  const design = resolveSemanticTokens(composition);

  return {
    identity: {
      name: brand.identity.displayName,
      legalName: brand.identity.legalName,
      locale: brand.identity.locale,
      language: brand.identity.language,
      direction: brand.identity.direction,
      url: brand.identity.canonicalUrl,
      timezone: brand.identity.timezone,
      currency: brand.identity.currency,
    },
    brand: {
      displayName: brand.identity.displayName,
      description: content.shell.footerDescription,
      logo: brand.assets.logo,
      contact: brand.contact ?? {},
      social: brand.social ?? {},
      copyright: brand.copyright,
    },
    design,
    seo: {
      defaultTitle: content.seo.defaultTitle,
      titleTemplate: content.seo.titleTemplate,
      description: content.seo.description,
      keywords: content.seo.keywords,
      robots: content.seo.robots,
      openGraph: {
        locale: content.seo.openGraphLocale,
        siteName: brand.seoIdentity.siteName,
      },
    },
    navigation: { kind: "static", items: content.navigation },
    capabilities: feature.availability,
    theme,
    brandProfile: brand,
    experience,
    feature,
    content,
  };
}
