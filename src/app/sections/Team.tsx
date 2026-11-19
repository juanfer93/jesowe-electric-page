import Section from "@/src/app/components/Section";
import Reveal from "@/src/app/components/Reveal";
import NextImage from "next/image";
import type { SiteContent } from "@/src/app/lib/siteContentSchema";

export default function Team({ team, site, hero }: { team: SiteContent["team"]; site: SiteContent["site"]; hero: SiteContent["hero"] }) {
  return (
    <Section id="team" className="bg-brand-navy relative overflow-hidden">
      <div className="absolute inset-0 z-0">
        <NextImage
          src="/img/team-bg.png"
          alt="Team background"
          fill
          className="object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-black/60" />
      </div>
      <div className="relative z-10">
        <Reveal>
          <div className="flex flex-col items-center text-center">
            <h2 className="text-4xl md:text-6xl font-medium text-white">
              {team.title}
            </h2>
            <p className="mt-8 max-w-3xl mx-auto text-slate-200 leading-relaxed text-lg font-light drop-shadow-md">
              {team.body}
            </p>
            <div className="mt-10 flex flex-col sm:flex-row items-center gap-6">
              <a
                href={site.phoneTel}
                className="bg-brand-accent text-brand-navy font-bold py-3 px-8 rounded-full text-lg hover:bg-white hover:scale-105 transition-all duration-300 shadow-lg"
              >
                {hero.secondaryCta}
              </a>
              <a
                href={site.phoneTel}
                className="text-white text-xl font-medium hover:text-brand-accent transition-colors"
              >
                {site.phoneDisplay}
              </a>
            </div>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
