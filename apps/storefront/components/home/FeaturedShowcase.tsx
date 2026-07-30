import Link from "next/link";
import Container from "@fardad/ui/Container";
import Image from "@fardad/ui/Image";
import { fardadHomePresentation } from "@/src/config/brands/fardad/home-presentation";

export default function FeaturedShowcase() {
  const { showcase } = fardadHomePresentation;

  return (
    <section
      id="showcase"
      className="overflow-hidden border-b border-[var(--ui-color-border,#8c8273)] bg-white py-16 lg:py-24"
    >
      <Container>
        <header className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-semibold text-[var(--ui-color-primary,#0e3b2e)]">
            {showcase.eyebrow}
          </p>
          <h2 className="mt-3 text-[var(--ui-color-text,#081613)]">{showcase.title}</h2>
          <p className="mx-auto mt-4 text-lg text-[var(--ui-color-muted-text,#4b5563)]">
            {showcase.description}
          </p>
        </header>

        <div className="mt-10 grid gap-5 lg:grid-cols-3">
          {showcase.items.map((item, index) => (
            <article
              key={item.title}
              className="group overflow-hidden rounded-[1.25rem] border border-[var(--ui-color-border,#8c8273)] bg-[var(--ui-color-background,#f8f4ec)] shadow-[0_18px_55px_rgb(8_22_19_/_0.1)]"
            >
              <div className="relative aspect-[4/5] overflow-hidden bg-[#0e3b2e]">
                <Image
                  fill
                  alt={`تصویرپردازی نمایشی ${item.title}`}
                  loading="lazy"
                  sizes="(min-width: 1024px) 33vw, 100vw"
                  src={item.image}
                  className="transition-transform duration-700 group-hover:scale-[1.035]"
                  style={{ objectPosition: item.imagePosition }}
                />
                <div
                  aria-hidden="true"
                  className="absolute inset-0 bg-[linear-gradient(180deg,transparent_55%,rgb(6_29_24_/_0.9)_100%)]"
                />
                <span className="absolute start-5 top-5 rounded-full border border-white/30 bg-[#082b22]/80 px-3 py-1 text-xs font-semibold text-white backdrop-blur">
                  تصویر نمایشی {String(index + 1).padStart(2, "۰")}
                </span>
              </div>
              <div className="p-6 sm:p-7">
                <p className="text-xs font-semibold text-[var(--ui-color-focus,#a97142)]">
                  {item.eyebrow}
                </p>
                <h3 className="mt-2 text-[var(--ui-color-text,#081613)]">{item.title}</h3>
                <p className="mt-3 text-sm leading-7 text-[var(--ui-color-muted-text,#4b5563)]">
                  {item.description}
                </p>
                <Link
                  href="#organizational-orders"
                  aria-label={`استعلام و سفارش برای ${item.title}`}
                  className="mt-6 inline-flex min-h-11 items-center gap-2 rounded-full bg-[var(--ui-color-primary,#0e3b2e)] px-5 py-2 font-semibold text-white transition-colors hover:bg-[var(--ui-color-text,#081613)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ui-color-focus,#a97142)] focus-visible:ring-offset-4"
                >
                  استعلام و سفارش
                  <span aria-hidden="true">←</span>
                </Link>
              </div>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}
