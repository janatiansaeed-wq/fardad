import Link from "next/link";
import Navigation from "@fardad/ui/Navigation";
import SiteHeader from "@fardad/ui/SiteHeader";
import MobileNavigation from "./MobileNavigation";
import { resolveStorefrontNavigation } from "@/src/lib/navigation";
import { getStorefrontProfile } from "@/src/lib/storefront-config";

export default function StorefrontHeader() {
  const profile = getStorefrontProfile();
  const navigation = resolveStorefrontNavigation();
  const navigationLabel = "ناوبری اصلی";

  return (
    <SiteHeader
      brand={
        <Link
          href="/"
          className="rounded-[var(--ui-radius-small,0.375rem)] text-2xl font-bold text-[var(--ui-color-primary,#1f2937)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ui-color-focus,#2563eb)] focus-visible:ring-offset-2"
        >
          {profile.brand.displayName}
        </Link>
      }
      navigation={<Navigation items={navigation} ariaLabel={navigationLabel} />}
      actions={<MobileNavigation items={navigation} ariaLabel={navigationLabel} />}
    />
  );
}
