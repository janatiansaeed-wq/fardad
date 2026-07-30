import Container from "@fardad/ui/Container";
import Section from "@fardad/ui/Section";
import { fardadHomePresentation } from "@/src/config/brands/fardad/home-presentation";

export default function EditorialStories() {
  const { editorial } = fardadHomePresentation;

  return (
    <Section className="relative overflow-hidden bg-[var(--ui-color-background,#f8f4ec)]">
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[radial-gradient(circle_at_12%_12%,rgb(194_164_107_/_0.2),transparent_26%)]"
      />
      <Container className="relative">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,0.75fr)_minmax(0,1.25fr)] lg:gap-16">
          <header className="max-w-xl">
            <p className="text-sm font-semibold text-[var(--ui-color-primary,#0e3b2e)]">
              {editorial.eyebrow}
            </p>
            <h2 className="mt-3 text-[var(--ui-color-text,#081613)]">{editorial.title}</h2>
            <p className="mt-5 text-lg text-[var(--ui-color-muted-text,#4b5563)]">
              {editorial.description}
            </p>
            <div
              aria-hidden="true"
              className="mt-8 flex items-center gap-3 text-[var(--ui-color-secondary,#c2a46b)]"
            >
              <span className="h-px w-16 bg-current" />
              <span className="grid h-10 w-10 place-items-center rounded-full border border-current">
                ف
              </span>
            </div>
          </header>

          <ol className="grid gap-4" role="list">
            {editorial.items.map((item, index) => (
              <li
                key={item.title}
                className="grid gap-5 rounded-[1rem] border border-[var(--ui-color-border,#8c8273)] bg-white p-5 shadow-[0_14px_40px_rgb(8_22_19_/_0.06)] sm:grid-cols-[auto_minmax(0,1fr)] sm:items-start sm:p-7"
              >
                <span
                  aria-hidden="true"
                  className="grid h-12 w-12 place-items-center rounded-full bg-[var(--ui-color-primary,#0e3b2e)] text-sm font-semibold text-[#e4ca96]"
                >
                  {new Intl.NumberFormat("fa-IR", {
                    minimumIntegerDigits: 2,
                    useGrouping: false,
                  }).format(index + 1)}
                </span>
                <article>
                  <p className="text-xs font-semibold text-[var(--ui-color-focus,#a97142)]">
                    {item.label}
                  </p>
                  <h3 className="mt-2 text-[var(--ui-color-text,#081613)]">{item.title}</h3>
                  <p className="mt-2 text-sm leading-7 text-[var(--ui-color-muted-text,#4b5563)]">
                    {item.description}
                  </p>
                </article>
              </li>
            ))}
          </ol>
        </div>
      </Container>
    </Section>
  );
}
