import Section from "@/src/app/components/Section";
import Reveal from "@/src/app/components/Reveal";
import { REVIEWS, SITE } from "@/src/app/lib/content";
export default function Reviews() {
  return (
    <Section id="reviews">
      <Reveal>
        <h2 className="text-4xl md:text-6xl font-semibold text-brand-navy text-center">
          {REVIEWS.title}
        </h2>
        <p className="mt-6 text-center text-slate-600 text-lg">{SITE.locationLabel}</p>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {REVIEWS.items.map((r) => (
            <figure key={`${r.author}-${r.source}`} className="rounded-2xl border border-slate-200 bg-white shadow-soft p-8">
              <blockquote className="text-slate-700 leading-relaxed">“{r.quote}”</blockquote>
              <figcaption className="mt-6 text-sm text-slate-500">
                <span className="font-semibold text-slate-900">{r.author}</span> · {r.source}
              </figcaption>
            </figure>
          ))}
        </div>
      </Reveal>
    </Section>
  );
}
