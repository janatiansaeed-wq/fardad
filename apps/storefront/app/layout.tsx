import type { Metadata } from "next";

import "./globals.css";

import { createStorefrontMetadata } from "@/src/lib/metadata";
import { getStorefrontProfile } from "@/src/lib/storefront-config";
import { createThemeCssVariables } from "@/src/lib/theme-css-variables";

export const metadata: Metadata = createStorefrontMetadata(getStorefrontProfile());

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const profile = getStorefrontProfile();

  return (
    <html lang={profile.identity.language} dir={profile.identity.direction}>
      <body style={createThemeCssVariables(profile.design)}>{children}</body>
    </html>
  );
}
