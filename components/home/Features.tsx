import Container from "@/components/ui/Container";
import Section from "@/components/ui/Section";
import Heading from "@/components/ui/Heading";
import Card from "@/components/ui/Card";

const features = [
  {
    title: "کیفیت ممتاز",
    text: "استفاده از بهترین متریال و هنر دست استادکاران ایرانی."
  },
  {
    title: "بسته‌بندی لوکس",
    text: "طراحی اختصاصی جعبه‌های هدیه ویژه مدیران و سازمان‌ها."
  },
  {
    title: "ارسال بین‌المللی",
    text: "آمادگی ارسال سفارشات به سراسر جهان."
  }
];

export default function Features() {
  return (
    <Section>
      <Container>

        <Heading
          title="چرا فرداد؟"
          subtitle="ترکیب هنر اصیل ایرانی با استانداردهای لوکس جهانی"
        />

        <div className="grid gap-8 md:grid-cols-3">

          {features.map((item) => (
            <Card
              key={item.title}
              className="p-8 text-center"
            >
              <h3 className="text-2xl font-bold text-primary">
                {item.title}
              </h3>

              <p className="mt-4 leading-8 text-gray-600">
                {item.text}
              </p>

            </Card>
          ))}

        </div>

      </Container>
    </Section>
  );
}