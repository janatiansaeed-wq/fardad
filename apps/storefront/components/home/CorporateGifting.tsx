import Link from "next/link";
import Container from "@fardad/ui/Container";
import Image from "@fardad/ui/Image";
import { fardadHomePresentation } from "@/src/config/brands/fardad/home-presentation";

export default function CorporateGifting() {
  const { corporate } = fardadHomePresentation;

  return (
    <section
      id="organizational-orders"
      className="overflow-hidden border-b border-[#1f5948] bg-[#082b22] py-16 text-white lg:py-24"
    >
      <Container>
        <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-16">
          <div>
            <div className="flex items-center gap-3">
              <span aria-hidden="true" className="h-px w-10 bg-[#e4ca96]" />
              <p className="text-sm font-semibold text-[#e4ca96]">{corporate.eyebrow}</p>
            </div>
            <h2 className="mt-5 max-w-[14ch] text-white">{corporate.title}</h2>
            <p className="mt-5 max-w-2xl text-lg leading-9 text-white/74">
              {corporate.description}
            </p>
            <ul className="mt-8 grid gap-3" role="list">
              {corporate.points.map((point) => (
                <li key={point} className="flex items-center gap-3 text-white/88">
                  <span
                    aria-hidden="true"
                    className="grid h-7 w-7 shrink-0 place-items-center rounded-full border border-[#e4ca96]/50 text-xs text-[#e4ca96]"
                  >
                    ✓
                  </span>
                  <span>{point}</span>
                </li>
              ))}
            </ul>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link
                href="#showcase"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#e4ca96] px-6 py-3 font-semibold text-[#082b22] transition-colors hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-4 focus-visible:ring-offset-[#082b22]"
              >
                دیدن پیشنهادهای نمایشی
                <span aria-hidden="true">←</span>
              </Link>
              <Link
                href="/products"
                className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/30 px-6 py-3 font-semibold text-white transition-colors hover:border-[#e4ca96] hover:text-[#e4ca96] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-4 focus-visible:ring-offset-[#082b22]"
              >
                ورود به کاتالوگ
              </Link>
            </div>
          </div>

          <figure className="relative">
            <div
              aria-hidden="true"
              className="absolute -inset-3 rounded-[1.75rem] border border-[#e4ca96]/35 sm:-inset-5"
            />
            <div className="relative aspect-[4/5] overflow-hidden rounded-[1.25rem] border border-white/15 shadow-[0_30px_80px_rgb(0_0_0_/_0.34)] sm:aspect-[5/4] lg:aspect-[4/5] xl:aspect-[5/4]">
              <Image
                fill
                alt="چیدمان نمایشی پک هدیه سازمانی با عناصر الهام‌گرفته از صنایع دستی ایران"
                loading="lazy"
                sizes="(min-width: 1024px) 52vw, 100vw"
                src={corporate.image}
                className="object-[50%_62%]"
              />
              <div className="absolute inset-x-5 bottom-5 rounded-xl border border-white/20 bg-[#082b22]/84 p-4 text-sm leading-7 text-white/78 backdrop-blur sm:inset-x-7 sm:bottom-7">
                تصویرپردازی این بخش برای نمایش امکان ارائه و ترکیب هدیه است؛ محصول یا موجودی
                قطعی را بازنمایی نمی‌کند.
              </div>
            </div>
          </figure>
        </div>
      </Container>
    </section>
  );
}
