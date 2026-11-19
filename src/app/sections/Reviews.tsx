import Section from "@/src/app/components/Section";
import Reveal from "@/src/app/components/Reveal";
import type { SiteContent } from "@/src/app/lib/siteContentSchema";
export default function Reviews({ reviews, site }: { reviews: SiteContent["reviews"]; site: SiteContent["site"] }) {
  return (
    <Section id="reviews">
      <Reveal>
        <h2 className="text-4xl md:text-6xl font-semibold text-brand-navy text-center">
          {reviews.title}
        </h2>
        <p className="mt-6 text-center text-slate-600 text-lg">{site.locationLabel}</p>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {reviews.items.map((r, index) => (
            <figure key={`${r.author}-${r.source}-${index}`} className="rounded-2xl border border-slate-200 bg-white shadow-soft p-8">
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
