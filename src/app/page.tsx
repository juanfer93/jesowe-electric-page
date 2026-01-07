import BackToTop from "@/src/app/components/BackToTop";
import Footer from "@/src/app/components/Footer";
import Header from "@/src/app/components/Header";
import Contact from "@/src/app/sections/Contact";
import Hero from "@/src/app/sections/Hero";
import HeroInfo from "@/src/app/sections/HeroInfo";
import Projects from "@/src/app/sections/Projects";
import Reviews from "@/src/app/sections/Reviews";
import Services from "@/src/app/sections/Services";
import Team from "@/src/app/sections/Team";
import Values from "@/src/app/sections/Values";

export default function Page() {
  return (
    <main className="min-h-screen">
      <Header />
      <Hero />
      <HeroInfo />
      <Services />
      <Values />
      <Team />
      <Reviews />
      <Projects />
      <Contact />
      <Footer />
      <BackToTop />
    </main>
  );
}
