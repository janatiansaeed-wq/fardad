import type { FeatureVariantId, LocalizedContentProfile } from "@fardad/types";
import Card from "@fardad/ui/Card";
import Container from "@fardad/ui/Container";
import Heading from "@fardad/ui/Heading";
import Section from "@fardad/ui/Section";

type FeaturesProps = Readonly<{
  content: LocalizedContentProfile["home"]["features"];
  variant: FeatureVariantId;
}>;

export default function Features({ content, variant }: FeaturesProps) {
  return (
    <Section>
      <Container>
        <Heading title={content.title} subtitle={content.subtitle} />
        <div data-variant={variant} className="grid gap-8 md:grid-cols-3">
          {content.items.map((item) => (
            <Card key={item.title} className="p-8 text-center">
              <h3 className="text-2xl font-bold text-[var(--ui-color-primary,#1f2937)]">
                {item.title}
              </h3>
              <p className="mt-4 leading-8 text-[var(--ui-color-muted-text,#4b5563)]">
                {item.description}
              </p>
            </Card>
          ))}
        </div>
      </Container>
    </Section>
  );
}
