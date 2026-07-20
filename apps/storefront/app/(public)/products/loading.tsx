import Container from "@fardad/ui/Container";

export default function ProductsLoading() {
  return (
    <Container className="py-12 lg:py-16">
      <section aria-busy="true" aria-live="polite">
        <p className="sr-only">در حال بارگذاری محصولات</p>
        <div className="h-10 w-48 animate-pulse rounded bg-[var(--ui-color-border,#d1d5db)]" />
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }, (_, index) => (
            <div
              key={index}
              aria-hidden="true"
              className="h-80 animate-pulse rounded-[var(--ui-radius-medium,0.75rem)] bg-[var(--ui-color-surface,#ffffff)] shadow-[var(--ui-shadow-card,0_12px_32px_rgba(0,0,0,0.08))]"
            />
          ))}
        </div>
      </section>
    </Container>
  );
}
