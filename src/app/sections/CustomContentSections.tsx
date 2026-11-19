import Image from "next/image";
import type { SiteContent } from "@/src/app/lib/siteContentSchema";

export default function CustomContentSections({ sections }: { sections: SiteContent["extraSections"] }) {
  return <>{sections.map((section) => (
    <section key={section.id} id={section.id} className="scroll-mt-24 border-t border-slate-200 bg-white py-16 sm:py-20">
      <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 md:grid-cols-2 md:px-6">
        <div className={section.image ? "" : "md:col-span-2 md:mx-auto md:max-w-3xl md:text-center"}>
          <h2 className="text-3xl font-semibold tracking-tight text-brand-navy sm:text-4xl">{section.title}</h2>
          <p className="mt-5 whitespace-pre-line text-base leading-8 text-slate-600">{section.body}</p>
        </div>
        {section.image && <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-slate-100">
          <Image src={section.image} alt={section.title} fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover" />
        </div>}
      </div>
    </section>
  ))}</>;
}
