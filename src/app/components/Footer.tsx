import Image from "next/image";

import Reveal from "@/src/app/components/Reveal";
import { KING_ELECTRIC_LOGO } from "@/src/app/lib/brandAssets";
import { SERVICES, SITE } from "@/src/app/lib/content";

const HIGHLIGHTED_SERVICES = SERVICES.items.slice(0, 4);

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-brand-navy text-slate-100">
      <Reveal className="mx-auto grid max-w-6xl gap-10 px-6 py-14 md:grid-cols-[1.2fr_1fr_1fr]">
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="rounded-full bg-white p-2">
              <Image
                src={KING_ELECTRIC_LOGO}
                alt={`${SITE.companyName} logo`}
                width={64}
                height={64}
              />
            </div>
            <div>
              <p className="text-lg font-semibold">{SITE.companyName}</p>
              <p className="text-sm text-slate-300">{SITE.tagline}</p>
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
            {HIGHLIGHTED_SERVICES.map((service) => (
              <li key={service} className="flex items-start gap-2">
                <span className="mt-1 h-1.5 w-1.5 rounded-full bg-brand-accent" />
                <span>{service}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="space-y-3">
          <p className="text-base font-semibold">Contact</p>
          <div className="space-y-2 text-sm text-slate-300">
            <a className="block hover:text-white" href={SITE.phoneTel}>
              {SITE.phoneDisplay}
            </a>
            <a
              className="block hover:text-white"
              href={`mailto:${SITE.toEmail}`}
            >
              {SITE.toEmail}
            </a>
            <p>{SITE.locationLabel}</p>
            <div className="pt-2 text-xs text-slate-400">
              <p>Mon - Sat: 7AM - 6 PM</p>
              <p>Sunday: Closed</p>
            </div>
          </div>
        </div>
      </Reveal>
      <Reveal className="border-t border-white/10 py-4 text-center text-xs text-slate-400">
        © {new Date().getFullYear()} {SITE.companyName}. All rights reserved.
      </Reveal>
    </footer>
  );
}
