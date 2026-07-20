import type { ReactNode } from "react";
import StorefrontShellRenderer from "@/components/composition/StorefrontShellRenderer";
import { getStorefrontProfile } from "@/src/lib/storefront-config";

export default function PublicLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <StorefrontShellRenderer profile={getStorefrontProfile()}>{children}</StorefrontShellRenderer>
  );
}
