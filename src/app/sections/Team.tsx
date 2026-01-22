import Section from "@/src/app/components/Section";
import Reveal from "@/src/app/components/Reveal";
import { TEAM, SITE, HERO } from "@/src/app/lib/content";
import NextImage from "next/image";

export default function Team() {
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
              {TEAM.title}
            </h2>
            <p className="mt-8 max-w-3xl mx-auto text-slate-200 leading-relaxed text-lg font-light drop-shadow-md">
              {TEAM.body}
            </p>
            <div className="mt-10 flex flex-col sm:flex-row items-center gap-6">
              <a
                href={SITE.phoneTel}
                className="bg-brand-accent text-brand-navy font-bold py-3 px-8 rounded-full text-lg hover:bg-white hover:scale-105 transition-all duration-300 shadow-lg"
              >
                {HERO.secondaryCta}
              </a>
              <a
                href={SITE.phoneTel}
                className="text-white text-xl font-medium hover:text-brand-accent transition-colors"
              >
                {SITE.phoneDisplay}
              </a>
            </div>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
