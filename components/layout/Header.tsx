import Container from "@/components/ui/Container";
import Navbar from "./Navbar";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/90 backdrop-blur-md">
      <Container>
        <div className="flex h-20 items-center justify-between">
          <div className="text-2xl font-bold text-primary">
            فرداد
          </div>

          <Navbar />
        </div>
      </Container>
    </header>
  );
}