import Section from "@/src/app/components/Section";
import Reveal from "@/src/app/components/Reveal";
import { ABOUT, SITE } from "@/src/app/lib/content";

export default function About() {
  return (
    <Section id="about">
      <Reveal>
        <h2 className="text-4xl md:text-6xl font-semibold text-brand-navy text-center">
          About Us
        </h2>
        <p className="mt-8 max-w-3xl mx-auto text-center text-slate-600 leading-relaxed text-lg">
          {ABOUT.body}
        </p>

        <div className="mt-10 flex justify-center">
          <a
            href={SITE.phoneTel}
            className="rounded-xl border border-slate-200 px-6 py-3 font-semibold text-slate-800 hover:bg-slate-50 transition"
          >
            Call {SITE.phoneDisplay}
          </a>
        </div>
      </Reveal>
    </Section>
  );
}
