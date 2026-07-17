import Container from "@/components/ui/Container";
import Section from "@/components/ui/Section";
import Heading from "@/components/ui/Heading";
import Card from "@/components/ui/Card";

const categories = [
  "فیروزه کوبی",
  "میناکاری",
  "خاتم کاری",
  "قلمزنی",
  "هدایای مدیریتی",
  "پک‌های هدیه"
];

export default function Categories() {
  return (
    <Section className="bg-white">

      <Container>

        <Heading
          title="دسته‌بندی محصولات"
          subtitle="مجموعه‌ای از فاخرترین صنایع دستی ایران"
        />

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">

          {categories.map((item) => (
            <Card
              key={item}
              className="flex h-56 items-center justify-center"
            >
              <h3 className="text-2xl font-bold text-primary">
                {item}
              </h3>
            </Card>
          ))}

        </div>

      </Container>

    </Section>
  );
}