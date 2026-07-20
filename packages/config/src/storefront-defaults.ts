import type { SemanticDesignTokens, TextDirection } from "@fardad/types";

export const defaultLocale = "en";
export const defaultDirection: TextDirection = "ltr";

export const defaultSemanticTokens: SemanticDesignTokens = {
  colors: {
    background: "#ffffff",
    surface: "#ffffff",
    text: "#111827",
    mutedText: "#4b5563",
    primary: "#1f2937",
    primaryContrast: "#ffffff",
    secondary: "#e5e7eb",
    secondaryContrast: "#111827",
    border: "#d1d5db",
    focus: "#2563eb",
  },
  radius: {
    small: "0.375rem",
    medium: "0.75rem",
  },
  contentMaxWidth: "90rem",
};
