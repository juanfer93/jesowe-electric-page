import Section from "../components/Section";
import Reveal from "../components/Reveal";
import { PROJECTS } from "@/src/lib/content";

export default function Projects() {
  return (
    <Section id="projects" className="bg-brand-mist">
      <Reveal>
        <h2 className="text-4xl md:text-6xl font-semibold text-brand-navy text-center">
          {PROJECTS.title}
        </h2>

        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {PROJECTS.cards.map((p) => (
            <div key={p.title} className="group rounded-2xl overflow-hidden border border-slate-200 bg-white shadow-soft">
              <div className="relative h-64 bg-slate-200">
                <div className="absolute inset-0 bg-gradient-to-tr from-brand-navy/35 to-transparent" />
                <div className="absolute inset-0 grid place-items-center text-slate-500">
                  <span className="text-sm">Image: {p.img}</span>
                </div>
              </div>
              <div className="p-8">
                <h3 className="text-3xl font-semibold text-brand-navy group-hover:opacity-90 transition">
                  {p.title}
                </h3>
              </div>
            </div>
          ))}
        </div>
      </Reveal>
    </Section>
  );
}
