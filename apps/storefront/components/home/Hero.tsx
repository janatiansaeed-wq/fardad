import Link from "next/link";
import type { HeroVariantId, LocalizedContentProfile } from "@fardad/types";
import Container from "@fardad/ui/Container";
import Image from "@fardad/ui/Image";

type HeroProps = Readonly<{
  content: LocalizedContentProfile["home"]["hero"];
  variant: HeroVariantId;
}>;

export default function Hero({ content, variant }: HeroProps) {
  return (
    <section
      data-variant={variant}
      className="relative isolate overflow-hidden border-b border-[var(--ui-color-border,#8c8273)] bg-[#082b22]"
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_8%_15%,rgb(194_164_107_/_0.2),transparent_32%),linear-gradient(135deg,#082b22_0%,#0e3b2e_58%,#061d18_100%)]"
      />
      <Container>
        <div className="grid min-h-[calc(100svh-5rem)] items-center gap-10 py-12 sm:py-16 lg:grid-cols-[minmax(0,0.82fr)_minmax(28rem,1.18fr)] lg:gap-14 lg:py-20">
          <div className="relative z-10 max-w-2xl">
            <div className="flex items-center gap-3">
              <span
                aria-hidden="true"
                className="h-px w-10 shrink-0 bg-[var(--ui-color-secondary,#c2a46b)]"
              />
              <p
                lang="en"
                dir="ltr"
                className="text-xs font-semibold uppercase tracking-[0.2em] text-[#e4ca96]"
              >
                {content.eyebrow}
              </p>
            </div>
            <h1
              data-typography-role="display"
              className="mt-6 max-w-[11ch] text-white"
            >
              <span className="block">{content.titleBeforeBreak}</span>
              <span className="block text-[#e4ca96]">
                {content.titleAfterBreak}
              </span>
            </h1>
            <p className="mt-7 max-w-xl text-base leading-9 text-white/74 sm:text-lg">
              {content.description}
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
              <Link
                href="/products"
                className="inline-flex min-h-12 w-full items-center justify-center gap-3 rounded-full bg-[#e4ca96] px-7 py-3 font-semibold text-[#082b22] transition-transform hover:-translate-y-0.5 hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-4 focus-visible:ring-offset-[#082b22] sm:w-auto"
              >
                {content.primaryAction}
                <span aria-hidden="true" className="text-xl leading-none">
                  ←
                </span>
              </Link>
              <Link
                href="#organizational-orders"
                className="inline-flex min-h-12 w-full items-center justify-center rounded-full border border-white/30 px-7 py-3 font-semibold text-white transition-colors hover:border-[#e4ca96] hover:text-[#e4ca96] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-4 focus-visible:ring-offset-[#082b22] sm:w-auto"
              >
                سفارش سازمانی
              </Link>
            </div>
            <div className="mt-10 flex flex-wrap gap-x-6 gap-y-2 border-t border-white/15 pt-5 text-sm text-white/64">
              <span>صنایع دستی ایرانی</span>
              <span aria-hidden="true">•</span>
              <span>هدیه‌های سازمانی</span>
              <span aria-hidden="true">•</span>
              <span>ارائه اختصاصی</span>
            </div>
          </div>

          <figure className="relative mx-auto w-full max-w-3xl lg:mx-0">
            <div
              aria-hidden="true"
              className="absolute -inset-3 rounded-[2rem] border border-[#e4ca96]/45 sm:-inset-5"
            />
            <div className="relative aspect-[4/5] overflow-hidden rounded-[1.5rem] border border-white/15 bg-[#061d18] shadow-[0_35px_90px_rgb(0_0_0_/_0.38)] sm:aspect-[5/4] lg:aspect-[4/5] xl:aspect-[5/4]">
              <Image
                fill
                priority
                alt="چیدمان نمایشی از صنایع دستی و بسته‌بندی هدیه با حال‌وهوای ایرانی"
                sizes="(min-width: 1280px) 52vw, (min-width: 1024px) 48vw, 100vw"
                src="/images/presentation/fardad-hero-presentation.png"
                className="object-cover object-[64%_center]"
              />
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-[linear-gradient(180deg,transparent_55%,rgb(6_29_24_/_0.76)_100%)]"
              />
              <div className="absolute inset-x-5 bottom-5 flex items-end justify-between gap-4 text-white sm:inset-x-7 sm:bottom-7">
                <div>
                  <p className="text-xs font-semibold text-[#e4ca96]">تصویرپردازی نمایشی</p>
                  <p className="mt-1 text-sm text-white/72">الهام‌گرفته از هنر و هدیه ایرانی</p>
                </div>
                <span
                  aria-hidden="true"
                  className="grid h-12 w-12 shrink-0 place-items-center rounded-full border border-white/30 text-xl"
                >
                  ف
                </span>
              </div>
            </div>
            <figcaption className="sr-only">
              این تصویر برای ارائه بصری نسخه نمایشی ساخته شده و نمایش موجودی تأییدشده فرداد نیست.
            </figcaption>
          </figure>
        </div>
      </Container>
    </section>
  );
}
