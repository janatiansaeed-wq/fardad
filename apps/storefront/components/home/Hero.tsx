import type { HeroVariantId, LocalizedContentProfile } from "@fardad/types";
import Button from "@fardad/ui/Button";
import Container from "@fardad/ui/Container";

type HeroProps = Readonly<{
  content: LocalizedContentProfile["home"]["hero"];
  variant: HeroVariantId;
}>;

export default function Hero({ content, variant }: HeroProps) {
  return (
    <section
      data-variant={variant}
      className="relative overflow-hidden bg-[linear-gradient(135deg,var(--ui-color-primary,#1f2937),var(--ui-color-text,#111827))] py-32 lg:py-44"
    >
      <Container>
        <div className="mx-auto max-w-4xl text-center">
          <span className="inline-flex rounded-full border border-[var(--ui-color-secondary,#e5e7eb)] px-4 py-2 text-sm text-[var(--ui-color-secondary,#e5e7eb)]">
            {content.eyebrow}
          </span>
          <h1 className="mt-8 text-5xl font-black leading-tight text-[var(--ui-color-primary-contrast,#ffffff)] lg:text-7xl">
            {content.titleBeforeBreak}
            <br />
            {content.titleAfterBreak}
          </h1>
          <p className="mx-auto mt-8 max-w-3xl text-lg leading-9 text-[var(--ui-color-primary-contrast,#ffffff)] opacity-80">
            {content.description}
          </p>
          <div className="mt-12 flex justify-center gap-5">
            <Button>{content.primaryAction}</Button>
            <Button variant="outline">{content.secondaryAction}</Button>
          </div>
        </div>
      </Container>
    </section>
  );
}
