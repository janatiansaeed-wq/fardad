import type { ReactNode } from "react";
import SkipLink from "@fardad/ui/SkipLink";
import StorefrontFooter from "@/components/layout/StorefrontFooter";
import StorefrontHeader from "@/components/layout/StorefrontHeader";

export default function PublicLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <>
      <SkipLink href="#main-content">پرش به محتوای اصلی</SkipLink>
      <StorefrontHeader />
      <main id="main-content" tabIndex={-1}>
        {children}
      </main>
      <StorefrontFooter />
    </>
  );
}
