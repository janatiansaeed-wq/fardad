import Container from "@/components/ui/Container";
import company from "@/config/company";

export default function Footer() {
  return (
    <footer className="border-t bg-white py-12">
      <Container>
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <div>
            <h3 className="text-xl font-bold text-primary">
              {company.name}
            </h3>

            <p className="mt-2 text-sm text-gray-600">
              {company.description}
            </p>
          </div>

          <div className="text-sm text-gray-500">
            {company.copyright}
          </div>
        </div>
      </Container>
    </footer>
  );
}