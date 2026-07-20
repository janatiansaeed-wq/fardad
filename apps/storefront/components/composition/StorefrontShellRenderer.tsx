import type { ReactNode } from "react";
import type { StorefrontProfile } from "@fardad/types";
import SkipLink from "@fardad/ui/SkipLink";
import StorefrontFooter from "@/components/layout/StorefrontFooter";
import StorefrontHeader from "@/components/layout/StorefrontHeader";

type StorefrontShellRendererProps = Readonly<{
  children: ReactNode;
  profile: StorefrontProfile;
}>;

export default function StorefrontShellRenderer({
  children,
  profile,
}: StorefrontShellRendererProps) {
  switch (profile.experience.shell) {
    case "standard":
      return (
        <>
          <SkipLink href="#main-content">{profile.content.shell.skipToContent}</SkipLink>
          <StorefrontHeader profile={profile} />
          <main id="main-content" tabIndex={-1}>
            {children}
          </main>
          <StorefrontFooter profile={profile} />
        </>
      );
  }
}
