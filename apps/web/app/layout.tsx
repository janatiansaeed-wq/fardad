import type { Metadata } from "next";

import "./globals.css";

import { seo } from "@fardad/config/seo";

export const metadata: Metadata = {
  title: seo.defaultTitle,
  description: seo.description,
  keywords: seo.keywords
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fa" dir="rtl">
      <body>{children}</body>
    </html>
  );
}
