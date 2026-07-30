import Link from "next/link";
import type { StorefrontProfile } from "@fardad/types";
import Navigation from "@fardad/ui/Navigation";
import SiteHeader from "@fardad/ui/SiteHeader";
import MobileNavigation from "./MobileNavigation";
import { resolveStorefrontNavigation } from "@/src/lib/navigation";

type StorefrontHeaderProps = Readonly<{
  profile: StorefrontProfile;
}>;

export default function StorefrontHeader({ profile }: StorefrontHeaderProps) {
  const navigation = resolveStorefrontNavigation();
  const { shell } = profile.content;

  return (
    <SiteHeader
      className="shadow-[0_1px_0_rgb(8_22_19_/_0.04)]"
      brand={
        <Link
          href="/"
          className="group inline-flex min-h-12 shrink-0 items-center gap-3 rounded-[var(--ui-radius-small,0.375rem)] px-1 text-[var(--ui-color-primary,#0e3b2e)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ui-color-focus,#a97142)] focus-visible:ring-offset-2"
        >
          <span className="grid h-11 w-11 place-items-center rounded-full border border-[var(--ui-color-secondary,#c2a46b)] bg-[var(--ui-color-primary,#0e3b2e)] text-lg font-bold text-[#e4ca96] transition-transform group-hover:-rotate-3">
            ف
          </span>
          <span>
            <span className="block text-2xl font-bold leading-none">{profile.brand.displayName}</span>
            <span className="mt-1 hidden text-[0.65rem] font-semibold leading-none text-[var(--ui-color-muted-text,#4b5563)] sm:block">
              روایت معاصر هنر ایرانی
            </span>
          </span>
        </Link>
      }
      navigation={
        <Navigation
          items={navigation}
          ariaLabel={shell.primaryNavigationLabel}
          className="w-full"
          listClassName="flex justify-center gap-1"
          linkClassName="inline-flex min-h-11 items-center rounded-full px-3 py-2 text-sm font-semibold leading-none text-[var(--ui-color-text,#081613)] hover:bg-[var(--ui-color-background,#f8f4ec)] hover:text-[var(--ui-color-primary,#0e3b2e)]"
        />
      }
      actions={
        <>
          <div className="hidden items-center gap-2 lg:flex">
            <button
              type="button"
              disabled
              title="جست‌وجوی کاتالوگ پس از اتصال داده فعال می‌شود"
              aria-label="جست‌وجوی کاتالوگ در نسخه نمایشی فعال نیست"
              className="inline-flex min-h-11 items-center gap-2 rounded-full border border-[var(--ui-color-border,#8c8273)] px-3 text-sm font-semibold text-[var(--ui-color-muted-text,#4b5563)]"
            >
              <span aria-hidden="true" className="text-xl leading-none">
                ⌕
              </span>
              <span className="hidden xl:inline">جست‌وجو</span>
            </button>
            <Link
              href="#organizational-orders"
              className="inline-flex min-h-11 items-center rounded-full bg-[var(--ui-color-primary,#0e3b2e)] px-4 text-sm font-semibold text-white transition-colors hover:bg-[var(--ui-color-text,#081613)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ui-color-focus,#a97142)] focus-visible:ring-offset-2"
            >
              سفارش سازمانی
            </Link>
          </div>
          <MobileNavigation
            items={navigation}
            ariaLabel={shell.primaryNavigationLabel}
            menuLabel={shell.mobileMenuLabel}
            variant={profile.experience.mobileNavigation}
          />
        </>
      }
    />
  );
}
