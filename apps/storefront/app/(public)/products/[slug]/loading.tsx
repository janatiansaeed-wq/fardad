import Container from "@fardad/ui/Container";
import { getStorefrontProfile } from "@/src/lib/storefront-config";

export default function ProductDetailLoading() {
  const { productDetail } = getStorefrontProfile().content;

  return (
    <Container className="py-10 lg:py-16">
      <section aria-busy="true" aria-live="polite">
        <p className="sr-only">{productDetail.loading}</p>
        <div className="h-5 w-64 animate-pulse rounded bg-[var(--ui-color-border,#d1d5db)] motion-reduce:animate-none" />
        <div className="mt-8 grid gap-10 lg:grid-cols-2 lg:gap-14">
          <div className="aspect-[4/3] animate-pulse rounded-[var(--ui-radius-medium,0.75rem)] bg-[var(--ui-color-surface,#ffffff)] shadow-[var(--ui-shadow-card,0_12px_32px_rgba(0,0,0,0.08))] motion-reduce:animate-none" />
          <div>
            <div className="h-5 w-32 animate-pulse rounded bg-[var(--ui-color-border,#d1d5db)] motion-reduce:animate-none" />
            <div className="mt-6 h-12 w-3/4 animate-pulse rounded bg-[var(--ui-color-border,#d1d5db)] motion-reduce:animate-none" />
            <div className="mt-8 h-28 animate-pulse rounded bg-[var(--ui-color-surface,#ffffff)] motion-reduce:animate-none" />
          </div>
        </div>
      </section>
    </Container>
  );
}
