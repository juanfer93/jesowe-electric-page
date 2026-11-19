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
import CustomContentSections from "@/src/app/sections/CustomContentSections";
import { getSiteContent } from "@/src/app/lib/siteContentStore";

export const dynamic = "force-dynamic";

export default async function Page() {
  const content = await getSiteContent();
  return (
    <main className="min-h-screen">
      <Header site={content.site} nav={content.nav} />
      <Hero />
      <HeroInfo hero={content.hero} site={content.site} />
      <Services services={content.services} />
      <Values values={content.values} />
      <Team team={content.team} site={content.site} hero={content.hero} />
      <Reviews reviews={content.reviews} site={content.site} />
      <CustomContentSections sections={content.extraSections} />
      <Projects projects={content.projects} />
      <Contact contact={content.contact} site={content.site} />
      <Footer site={content.site} services={content.services} contact={content.contact} />
      <BackToTop />
    </main>
  );
}
