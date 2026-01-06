import Reveal from "@/src/app/components/Reveal";
import { HERO, SITE } from "@/src/app/lib/content";

const HERO_VIDEO_URL = "/videos/hero.mp4";

export default function Hero() {
  return (
    <section id="home" className="relative scroll-mt-24">
      <div className="relative h-[78vh] min-h-[560px] w-full bg-brand-navy">
        <div className="absolute inset-0 bg-black" />
        <video
          className="absolute inset-0 h-full w-full object-cover opacity-60"
          autoPlay
          muted
          loop
          playsInline
          aria-hidden="true"
        >
          <source src={HERO_VIDEO_URL} type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 to-slate-900/20" />

        <div className="relative mx-auto max-w-6xl px-4 h-full flex items-center">
          <Reveal className="max-w-2xl">
            <p className="text-xs tracking-widest text-slate-200/80 uppercase">
              {SITE.companyName}
            </p>
            <h1 className="mt-4 text-4xl md:text-6xl font-semibold text-white leading-tight">
              {HERO.headline}
            </h1>
            <p className="mt-6 text-lg text-slate-100/90 leading-relaxed">
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
                className="inline-flex justify-center items-center rounded-xl border border-white/30 px-6 py-3 font-semibold text-white hover:bg-white/10 transition"
              >
                {HERO.secondaryCta} · {SITE.phoneDisplay}
              </a>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
