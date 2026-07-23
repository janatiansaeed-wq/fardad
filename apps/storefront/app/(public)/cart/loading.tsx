import Container from "@fardad/ui/Container";
import { getStorefrontProfile } from "@/src/lib/storefront-config";

export default function CartLoading() {
  const { cart } = getStorefrontProfile().content;

  return (
    <Container className="py-10 lg:py-16">
      <section aria-busy="true" aria-live="polite">
        <p className="sr-only">{cart.loading}</p>
        <div className="h-10 w-48 animate-pulse rounded bg-[var(--ui-color-border,#d1d5db)] motion-reduce:animate-none" />
        <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_22rem]">
          <div className="h-72 animate-pulse rounded-[var(--ui-radius-medium,0.75rem)] bg-[var(--ui-color-surface,#ffffff)] motion-reduce:animate-none" />
          <div className="h-48 animate-pulse rounded-[var(--ui-radius-medium,0.75rem)] bg-[var(--ui-color-surface,#ffffff)] motion-reduce:animate-none" />
        </div>
      </section>
    </Container>
  );
}
