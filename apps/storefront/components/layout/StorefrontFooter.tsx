import SiteFooter from "@fardad/ui/SiteFooter";
import { getStorefrontProfile } from "@/src/lib/storefront-config";

export default function StorefrontFooter() {
  const profile = getStorefrontProfile();
  const { brand } = profile;

  return (
    <SiteFooter
      identity={
        <div>
          <h2 className="text-xl font-bold text-[var(--ui-color-primary,#1f2937)]">
            {brand.displayName}
          </h2>
          <p className="mt-2 max-w-xl text-sm leading-7 text-[var(--ui-color-muted-text,#4b5563)]">
            {brand.description}
          </p>
          {brand.contact.email ? (
            <a
              className="mt-4 inline-block rounded-[var(--ui-radius-small,0.375rem)] text-sm text-[var(--ui-color-primary,#1f2937)] underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ui-color-focus,#2563eb)]"
              href={`mailto:${brand.contact.email}`}
            >
              {brand.contact.email}
            </a>
          ) : null}
        </div>
      }
      legal={brand.copyright}
    />
  );
}
