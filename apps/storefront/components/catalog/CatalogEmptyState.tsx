import type { LocalizedContentProfile } from "@fardad/types";

type CatalogEmptyStateProps = {
  categoryName?: string;
  content: LocalizedContentProfile["catalog"];
};

export default function CatalogEmptyState({ categoryName, content }: CatalogEmptyStateProps) {
  const title = categoryName
    ? content.emptyCategoryTitleTemplate.replace("{categoryName}", categoryName)
    : content.emptyTitle;

  return (
    <section
      aria-live="polite"
      className="rounded-[var(--ui-radius-medium,0.75rem)] border border-dashed border-[var(--ui-color-border,#d1d5db)] bg-[var(--ui-color-surface,#ffffff)] px-6 py-16 text-center"
    >
      <h2 className="text-2xl font-bold text-[var(--ui-color-primary,#1f2937)]">{title}</h2>
      <p className="mx-auto mt-3 max-w-xl leading-7 text-[var(--ui-color-muted-text,#4b5563)]">
        {content.emptyDescription}
      </p>
    </section>
  );
}
