import Container from "@fardad/ui/Container";
import Button from "@fardad/ui/Button";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-hero py-32 lg:py-44">
      <Container>
        <div className="mx-auto max-w-4xl text-center">

          <span className="inline-flex rounded-full border border-secondary px-4 py-2 text-sm text-secondary">
            Luxury Persian Handicrafts
          </span>

          <h1 className="mt-8 text-5xl font-black leading-tight text-white lg:text-7xl">
            هنر ایرانی،
            <br />
            در اوج شکوه و اصالت
          </h1>

          <p className="mx-auto mt-8 max-w-3xl text-lg leading-9 text-gray-300">
            طراحی و تولید هدایای مدیریتی، سازمانی و صادراتی با استفاده از
            فاخرترین هنرهای سنتی ایران.
          </p>

          <div className="mt-12 flex justify-center gap-5">
            <Button>
              مشاهده محصولات
            </Button>

            <Button variant="outline">
              دریافت کاتالوگ
            </Button>
          </div>

        </div>
      </Container>
    </section>
  );
}
