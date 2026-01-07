import Reveal from "@/src/app/components/Reveal";
import { HERO, SITE } from "@/src/app/lib/content";

export default function HeroInfo() {
  return (
    <section className="relative bg-white py-16 md:py-24">
      <div className="relative mx-auto max-w-6xl px-4">
        <Reveal className="max-w-2xl">
          <p className="text-xs tracking-widest text-slate-500 uppercase">
            {SITE.companyName}
          </p>
          <h1 className="mt-4 text-4xl md:text-6xl font-semibold text-slate-900 leading-tight">
            {HERO.headline}
          </h1>
          <p className="mt-6 text-lg text-slate-600 leading-relaxed">
            {HERO.subheadline}
          </p>

          <div className="mt-10 flex flex-col sm:flex-row gap-3">
            <a
              href="#contact"
              className="inline-flex justify-center items-center rounded-xl bg-brand-accent px-6 py-3 font-semibold text-slate-900 hover:brightness-95 transition"
            >
              {HERO.primaryCta}
            </a>

            <a
              href={SITE.phoneTel}
              className="inline-flex justify-center items-center rounded-xl border border-slate-400 px-6 py-3 font-semibold text-slate-900 hover:bg-slate-50 transition"
            >
              {HERO.secondaryCta} · {SITE.phoneDisplay}
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
