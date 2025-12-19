import Section from "../components/Section";
import Reveal from "../components/Reveal";
import { SERVICES } from "@/src/app/lib/content";

export default function Services() {
  return (
    <Section id="services" className="bg-brand-mist">
      <Reveal>
        <h2 className="text-4xl md:text-6xl font-semibold text-brand-navy text-center">
          {SERVICES.title}
        </h2>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {SERVICES.items.map((s) => (
            <div key={s} className="rounded-2xl border border-slate-200 bg-white shadow-soft p-5">
              <div className="flex items-start gap-3">
                <span className="mt-1 inline-block h-2 w-2 rounded-full bg-brand-accent" />
                <p className="text-slate-700">{s}</p>
              </div>
            </div>
          ))}
        </div>
      </Reveal>
    </Section>
  );
}
