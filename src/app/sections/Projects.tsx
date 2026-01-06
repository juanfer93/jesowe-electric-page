import Image from "next/image";
import Section from "@/src/app/components/Section";
import Reveal from "@/src/app/components/Reveal";
import { PROJECTS } from "@/src/app/lib/content";

export default function Projects() {
  return (
    <Section id="projects" className="bg-brand-mist">
      <Reveal>
        <h2 className="text-4xl md:text-6xl font-semibold text-brand-navy text-center">
          {PROJECTS.title}
        </h2>

        <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-3 max-w-5xl mx-auto">
          {PROJECTS.cards.map((p) => (
            <div key={p.title} className="group rounded-2xl overflow-hidden border border-slate-200 bg-white shadow-soft">
              <div className="relative aspect-[16/10] bg-slate-200">
                <Image
                  src={p.img}
                  alt={p.title}
                  fill
                  sizes="(min-width: 1280px) 30vw, (min-width: 1024px) 40vw, (min-width: 768px) 45vw, 100vw"
                  className="object-cover"
                  priority={p.title.includes("Tesla")}
                />
                <div className="absolute inset-0 bg-gradient-to-tr from-brand-navy/25 to-transparent" />
              </div>
              <div className="p-5">
                <h3 className="text-2xl md:text-[26px] font-semibold text-brand-navy group-hover:opacity-90 transition">
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
