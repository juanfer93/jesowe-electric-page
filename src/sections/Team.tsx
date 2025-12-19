import Section from "../components/Section";
import Reveal from "../components/Reveal";
import { TEAM } from "@/src/lib/content";

export default function Team() {
  return (
    <Section id="team" className="bg-brand-mist">
      <Reveal>
        <h2 className="text-4xl md:text-6xl font-semibold text-brand-navy text-center">
          {TEAM.title}
        </h2>
        <p className="mt-8 max-w-3xl mx-auto text-center text-slate-600 leading-relaxed text-lg">
          {TEAM.body}
        </p>
      </Reveal>
    </Section>
  );
}
