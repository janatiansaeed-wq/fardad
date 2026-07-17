import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

import Hero from "@/components/home/Hero";
import Features from "@/components/home/Features";
import Categories from "@/components/home/Categories";

export default function HomePage() {
  return (
    <>
      <Header />

      <main>
        <Hero />
        <Features />
        <Categories />
      </main>

      <Footer />
    </>
  );
}