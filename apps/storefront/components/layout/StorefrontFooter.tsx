import Link from "next/link";
import type { StorefrontProfile } from "@fardad/types";
import SiteFooter from "@fardad/ui/SiteFooter";

type StorefrontFooterProps = Readonly<{
  profile: StorefrontProfile;
}>;

export default function StorefrontFooter({ profile }: StorefrontFooterProps) {
  const { brand } = profile;

  return (
    <SiteFooter
      className="border-[#1f5948] bg-[#061d18] py-14 text-white"
      identity={
        <div className="max-w-2xl">
          <div className="flex items-center gap-3">
            <span className="grid h-12 w-12 place-items-center rounded-full border border-[#e4ca96]/55 text-lg font-bold text-[#e4ca96]">
              ف
            </span>
            <div>
              <h2 className="text-2xl font-bold text-white">{brand.displayName}</h2>
              <p className="mt-1 text-xs font-semibold text-[#e4ca96]">
                روایت معاصر هنر و هدیه ایرانی
              </p>
            </div>
          </div>
          <p className="mt-6 max-w-xl text-sm leading-8 text-white/68">{brand.description}</p>
          <p className="mt-3 max-w-xl text-sm leading-8 text-white/68">
            مسیری برای کشف صنایع دستی، هدیه‌های سازمانی و ارائه‌هایی که با دقت انتخاب می‌شوند.
          </p>
        </div>
      }
      navigation={
        <div className="grid grid-cols-2 gap-8 text-sm sm:min-w-80">
          <div>
            <h3 className="text-base font-bold text-[#e4ca96]">فرداد</h3>
            <ul className="mt-4 grid gap-3 text-white/72">
              <li>
                <Link className="hover:text-white" href="/">
                  خانه
                </Link>
              </li>
              <li>
                <Link className="hover:text-white" href="/products">
                  کاتالوگ
                </Link>
              </li>
              <li>
                <Link className="hover:text-white" href="#showcase">
                  ویترین منتخب
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-base font-bold text-[#e4ca96]">همکاری</h3>
            <ul className="mt-4 grid gap-3 text-white/72">
              <li>
                <Link className="hover:text-white" href="#organizational-orders">
                  سفارش سازمانی
                </Link>
              </li>
              <li>
                <Link className="hover:text-white" href="#organizational-orders">
                  سفارش اختصاصی
                </Link>
              </li>
              <li>
                <span>مشاوره انتخاب هدیه</span>
              </li>
            </ul>
          </div>
        </div>
      }
      legal={
        <div className="flex flex-col gap-2 border-t border-white/10 pt-6 text-white/48 sm:flex-row sm:items-center sm:justify-between">
          <span>{brand.copyright ?? "فرداد — نسخه نمایشی فروشگاه"}</span>
          <span>تصاویر ارائه‌شده در صفحه اصلی، تصویرپردازی نمایشی‌اند.</span>
        </div>
      }
    />
  );
}
