import type { FeatureVariantId, LocalizedContentProfile } from "@fardad/types";
import Container from "@fardad/ui/Container";
import Section from "@fardad/ui/Section";

type FeaturesProps = Readonly<{
  content: LocalizedContentProfile["home"]["features"];
  variant: FeatureVariantId;
}>;

export default function Features({ content, variant }: FeaturesProps) {
  return (
    <Section className="border-b border-[var(--ui-color-border,#8c8273)] bg-[var(--ui-color-primary,#0e3b2e)]">
      <Container>
        <header className="mx-auto max-w-3xl text-center">
          <div
            aria-hidden="true"
            className="mx-auto mb-5 h-px w-16 bg-[var(--ui-color-secondary,#c2a46b)]"
          />
          <h2 className="text-[var(--ui-color-primary-contrast,#ffffff)]">{content.title}</h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-[var(--ui-color-primary-contrast,#ffffff)] opacity-80">
            {content.subtitle}
          </p>
        </header>

        <ul data-variant={variant} className="mt-10 grid gap-4 md:grid-cols-3" role="list">
          {content.items.map((item) => (
            <li key={item.title} className="min-w-0">
              <article className="h-full rounded-[var(--ui-radius-medium,1rem)] border border-[var(--ui-color-secondary,#c2a46b)] bg-[var(--ui-color-surface,#ffffff)] p-6 text-start sm:p-8">
                <div
                  aria-hidden="true"
                  className="mb-6 flex items-center gap-3"
                >
                  <span className="h-2.5 w-2.5 rounded-full bg-[var(--ui-color-secondary,#c2a46b)]" />
                  <span className="h-px w-10 bg-[var(--ui-color-border,#8c8273)]" />
                </div>
                <h3 className="text-[var(--ui-color-text,#081613)]">{item.title}</h3>
                <p className="mt-4 text-[var(--ui-color-muted-text,#4b5563)]">
                  {item.description}
                </p>
              </article>
            </li>
          ))}
        </ul>
      </Container>
    </Section>
  );
}
