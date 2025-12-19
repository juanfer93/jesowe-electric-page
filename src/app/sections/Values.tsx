import Section from "../components/Section";
import Reveal from "../components/Reveal";
import { VALUES } from "@/src/app/lib/content";

export default function Values() {
  return (
    <Section id="values">
      <Reveal>
        <h2 className="text-3xl md:text-5xl font-semibold text-slate-900 text-center">
          {VALUES.title}
        </h2>

        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {VALUES.items.map((v) => (
            <div key={v.title} className="rounded-2xl border border-slate-200 bg-white shadow-soft p-8">
              <h3 className="text-2xl font-semibold text-slate-900">{v.title}</h3>
              <p className="mt-4 text-slate-600 leading-relaxed">{v.body}</p>
            </div>
          ))}
        </div>
      </Reveal>
    </Section>
  );
}
