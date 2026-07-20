import type { CSSProperties } from "react";
import type { CardShadowId, FontFamilyId, SemanticDesignTokens } from "@fardad/types";

const fontFamilies: Readonly<Record<FontFamilyId, string>> = {
  "system-sans": "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  "system-serif": "Georgia, 'Times New Roman', serif",
};

const cardShadows: Readonly<Record<CardShadowId, string>> = {
  none: "none",
  soft: "0 12px 32px rgb(0 0 0 / 8%)",
  raised: "0 20px 60px rgb(8 22 19 / 15%)",
};

export function createThemeCssVariables(tokens: SemanticDesignTokens): CSSProperties {
  return {
    "--ui-color-background": tokens.colors.background,
    "--ui-color-surface": tokens.colors.surface,
    "--ui-color-text": tokens.colors.text,
    "--ui-color-muted-text": tokens.colors.mutedText,
    "--ui-color-primary": tokens.colors.primary,
    "--ui-color-primary-contrast": tokens.colors.primaryContrast,
    "--ui-color-secondary": tokens.colors.secondary,
    "--ui-color-secondary-contrast": tokens.colors.secondaryContrast,
    "--ui-color-border": tokens.colors.border,
    "--ui-color-focus": tokens.colors.focus,
    "--ui-radius-small": tokens.radius.small,
    "--ui-radius-medium": tokens.radius.medium,
    "--ui-content-max-width": tokens.contentMaxWidth,
    "--ui-font-body": fontFamilies[tokens.typography.body],
    "--ui-font-display": fontFamilies[tokens.typography.display],
    "--ui-shadow-card": cardShadows[tokens.elevation.card],
  } as CSSProperties;
}
