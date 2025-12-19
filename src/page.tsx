import Header from "./components/Header";
import BackToTop from "./components/BackToTop";

import Hero from "./sections/Hero";
import About from "./sections/About";
import Services from "./sections/Services";
import Values from "./sections/Values";
import Team from "./sections/Team";
import Reviews from "./sections/Reviews";
import Projects from "./sections/Projects";
import Contact from "./sections/Contact";

export default function Page() {
  return (
    <main className="min-h-screen">
      <Header />
      <Hero />
      <About />
      <Services />
      <Values />
      <Team />
      <Reviews />
      <Projects />
      <Contact />
      <BackToTop />
    </main>
  );
}
