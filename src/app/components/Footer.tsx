import Image from "next/image";

import Reveal from "@/src/app/components/Reveal";
import { KING_ELECTRIC_LOGO } from "@/src/app/lib/brandAssets";
import type { SiteContent } from "@/src/app/lib/siteContentSchema";

export default function Footer({ site, services, contact }: { site: SiteContent["site"]; services: SiteContent["services"]; contact: SiteContent["contact"] }) {
  return (
    <footer className="border-t border-white/10 bg-brand-navy text-slate-100">
      <Reveal className="mx-auto grid max-w-6xl gap-10 px-6 py-14 md:grid-cols-[1.2fr_1fr_1fr]">
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="rounded-full bg-white p-1">
              <Image
                src={KING_ELECTRIC_LOGO}
                alt={`${site.companyName} logo`}
                width={48}
                height={48}
                className="h-10 w-10 rounded-full bg-black object-contain"
              />
            </div>
            <div>
              <p className="text-lg font-semibold">{site.companyName}</p>
              <p className="text-sm text-slate-300">{site.tagline}</p>
            </div>
          </div>
          <p className="text-sm leading-relaxed text-slate-300">
            Licensed and insured electrical contractor delivering safe, reliable
            installations and renovations across Virginia.
          </p>
        </div>
        <div className="space-y-3">
          <p className="text-base font-semibold">Services</p>
          <ul className="space-y-2 text-sm text-slate-300">
            {services.cards.map((service, index) => (
              <li key={`${service.title}-${index}`} className="flex items-start gap-2">
                <span className="mt-1 h-1.5 w-1.5 rounded-full bg-brand-accent" />
                <span>{service.title}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="space-y-3">
          <p className="text-base font-semibold">Contact</p>
          <div className="space-y-2 text-sm text-slate-300">
            <a className="block hover:text-white" href={site.phoneTel}>
              {site.phoneDisplay}
            </a>
            <a
              className="block hover:text-white"
              href={`mailto:${site.toEmail}`}
            >
              {site.toEmail}
            </a>
            <p>{site.locationLabel}</p>
            <div className="pt-2 text-xs text-slate-400">
              {contact.businessHours.map((hours, index) => <p key={`${hours}-${index}`}>{hours}</p>)}
            </div>
          </div>
        </div>
      </Reveal>
      <Reveal className="border-t border-white/10 py-4 text-center text-xs text-slate-400">
        © {new Date().getFullYear()} {site.companyName}. All rights reserved.
      </Reveal>
    </footer>
  );
}
