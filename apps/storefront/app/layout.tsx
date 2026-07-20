import type { Metadata } from "next";
import type { CSSProperties } from "react";

import "./globals.css";

import { fardadProfile } from "@/src/config/fardad-store";
import { createStorefrontMetadata } from "@/src/lib/metadata";

export const metadata: Metadata = createStorefrontMetadata(fardadProfile);

const storefrontCssVariables = {
  "--ui-color-background": fardadProfile.design.colors.background,
  "--ui-color-surface": fardadProfile.design.colors.surface,
  "--ui-color-text": fardadProfile.design.colors.text,
  "--ui-color-muted-text": fardadProfile.design.colors.mutedText,
  "--ui-color-primary": fardadProfile.design.colors.primary,
  "--ui-color-primary-contrast": fardadProfile.design.colors.primaryContrast,
  "--ui-color-secondary": fardadProfile.design.colors.secondary,
  "--ui-color-secondary-contrast": fardadProfile.design.colors.secondaryContrast,
  "--ui-color-border": fardadProfile.design.colors.border,
  "--ui-color-focus": fardadProfile.design.colors.focus,
  "--ui-radius-small": fardadProfile.design.radius.small,
  "--ui-radius-medium": fardadProfile.design.radius.medium,
  "--ui-content-max-width": fardadProfile.design.contentMaxWidth,
  "--ui-shadow-card": "0 20px 60px rgb(8 22 19 / 15%)",
} as CSSProperties;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang={fardadProfile.identity.language} dir={fardadProfile.identity.direction}>
      <body style={storefrontCssVariables}>{children}</body>
    </html>
  );
}
