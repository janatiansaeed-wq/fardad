import Link from "next/link";
import type { CategoryVariantId, LocalizedContentProfile } from "@fardad/types";
import Container from "@fardad/ui/Container";
import Image from "@fardad/ui/Image";
import Section from "@fardad/ui/Section";
import { fardadHomePresentation } from "@/src/config/brands/fardad/home-presentation";

type CategoriesProps = Readonly<{
  content: LocalizedContentProfile["home"]["categories"];
  variant: CategoryVariantId;
}>;

export default function Categories({ content, variant }: CategoriesProps) {
  return (
    <Section className="overflow-hidden border-b border-[var(--ui-color-border,#8c8273)] bg-[var(--ui-color-background,#f8f4ec)]">
      <Container>
        <div className="mb-10 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <header className="max-w-3xl">
            <p className="text-sm font-semibold text-[var(--ui-color-primary,#0e3b2e)]">
              کشف بر اساس هنر
            </p>
            <h2 className="mt-3 text-[var(--ui-color-text,#081613)]">{content.title}</h2>
            <p className="mt-4 text-lg text-[var(--ui-color-muted-text,#4b5563)]">
              {content.subtitle}
            </p>
          </header>
          <Link
            href="/products"
            className="inline-flex min-h-11 w-fit items-center gap-2 rounded-full border border-[var(--ui-color-primary,#0e3b2e)] px-5 py-2 font-semibold text-[var(--ui-color-primary,#0e3b2e)] transition-colors hover:bg-[var(--ui-color-primary,#0e3b2e)] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ui-color-focus,#a97142)] focus-visible:ring-offset-4"
          >
            مشاهده کاتالوگ
            <span aria-hidden="true">←</span>
          </Link>
        </div>

        <ul
          data-variant={variant}
          className="grid gap-4 sm:grid-cols-2 lg:grid-cols-12"
          role="list"
        >
          {content.items.map((item, index) => {
            const presentation = fardadHomePresentation.categories.find(
              (category) => category.title === item,
            );

            return (
              <li
                key={item}
                className={
                  index < 2
                    ? "min-w-0 lg:col-span-6"
                    : "min-w-0 lg:col-span-3"
                }
              >
                <article className="group relative isolate min-h-[22rem] overflow-hidden rounded-[1.25rem] border border-[var(--ui-color-border,#8c8273)] bg-[#0e3b2e] shadow-[0_18px_50px_rgb(8_22_19_/_0.12)]">
                  {presentation ? (
                    <Image
                      fill
                      alt={`تصویر نمایشی برای دسته ${item}`}
                      sizes={
                        index < 2
                          ? "(min-width: 1024px) 50vw, (min-width: 640px) 50vw, 100vw"
                          : "(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                      }
                      src={presentation.image}
                      className="transition-transform duration-700 group-hover:scale-[1.035]"
                      style={{ objectPosition: presentation.imagePosition }}
                    />
                  ) : null}
                  <div
                    aria-hidden="true"
                    className="absolute inset-0 z-0 bg-[linear-gradient(180deg,rgb(6_29_24_/_0.04)_25%,rgb(6_29_24_/_0.94)_100%)]"
                  />
                  <div className="absolute inset-x-0 bottom-0 z-10 p-6 sm:p-7">
                    <div className="mb-4 flex items-center gap-3 text-[#e4ca96]">
                      <span className="h-px w-8 bg-current" />
                      <span className="text-xs font-semibold">دسته‌بندی نمایشی</span>
                    </div>
                    <h3 className="text-white">{item}</h3>
                    {presentation ? (
                      <p className="mt-3 text-sm leading-7 text-white/72">
                        {presentation.description}
                      </p>
                    ) : null}
                  </div>
                </article>
              </li>
            );
          })}
        </ul>
        <p className="mt-5 text-xs leading-6 text-[var(--ui-color-muted-text,#4b5563)]">
          تصاویر این بخش برای نمایش جهت بصری ساخته شده‌اند و نشان‌دهنده موجودی تأییدشده نیستند.
        </p>
      </Container>
    </Section>
  );
}
