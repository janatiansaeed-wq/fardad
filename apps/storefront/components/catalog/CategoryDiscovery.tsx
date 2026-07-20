import Link from "next/link";
import type { PublicCategorySummary } from "@fardad/types";

type CategoryDiscoveryProps = {
  categories: readonly PublicCategorySummary[];
};

export default function CategoryDiscovery({ categories }: CategoryDiscoveryProps) {
  if (!categories.length) {
    return null;
  }

  return (
    <nav aria-label="دسته‌بندی محصولات" className="mb-10">
      <ul className="flex flex-wrap gap-3">
        {categories.map((category) => (
          <li key={category.slug}>
            <Link
              href={`/products/category/${category.slug}`}
              className="inline-flex min-h-11 items-center rounded-full border border-[var(--ui-color-border,#d1d5db)] px-4 text-sm font-medium text-[var(--ui-color-primary,#1f2937)] transition-colors hover:bg-[var(--ui-color-primary,#1f2937)] hover:text-[var(--ui-color-primary-contrast,#ffffff)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ui-color-focus,#2563eb)] focus-visible:ring-offset-2"
            >
              {category.name}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
