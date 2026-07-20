import type { CategoryVariantId, LocalizedContentProfile } from "@fardad/types";
import Card from "@fardad/ui/Card";
import Container from "@fardad/ui/Container";
import Heading from "@fardad/ui/Heading";
import Section from "@fardad/ui/Section";

type CategoriesProps = Readonly<{
  content: LocalizedContentProfile["home"]["categories"];
  variant: CategoryVariantId;
}>;

export default function Categories({ content, variant }: CategoriesProps) {
  return (
    <Section className="bg-[var(--ui-color-surface,#ffffff)]">
      <Container>
        <Heading title={content.title} subtitle={content.subtitle} />
        <div data-variant={variant} className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {content.items.map((item) => (
            <Card key={item} className="flex h-56 items-center justify-center">
              <h3 className="text-2xl font-bold text-[var(--ui-color-primary,#1f2937)]">{item}</h3>
            </Card>
          ))}
        </div>
      </Container>
    </Section>
  );
}
