"use client";

import Image from "next/image";
import Section from "@/src/app/components/Section";
import Reveal from "@/src/app/components/Reveal";
import { SERVICES } from "@/src/app/lib/content";

export default function Services() {
  return (
    <Section id="services" className="bg-brand-mist">
      <Reveal>
        <h2 className="text-4xl md:text-6xl font-semibold text-brand-navy text-center">
          {SERVICES.title}
        </h2>

        <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-3 max-w-5xl mx-auto">
          {SERVICES.cards.map((service) => (
            <div
              key={service.title}
              className="w-full rounded-2xl border border-slate-200 bg-white shadow-soft flex flex-col overflow-hidden"
            >
              <div className="relative h-48 w-full overflow-hidden bg-slate-100">
                <Image
                  src={service.img}
                  alt={service.title}
                  fill
                  sizes="(min-width: 1280px) 33vw, (min-width: 768px) 50vw, 100vw"
                  className="object-cover"
                  priority={false}
                />
              </div>
              <div className="p-6 flex flex-col flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-3xl" aria-hidden="true">
                    {service.emoji}
                  </span>
                  <h3 className="text-lg md:text-xl font-semibold text-brand-navy leading-snug">
                    {service.title}
                  </h3>
                </div>
                {service.description && (
                  <p className="text-slate-600 mb-5 leading-relaxed text-[15px]">
                    {service.description}
                  </p>
                )}
                {service.features && service.features.length > 0 && (
                  <ul className="space-y-2.5 flex-1">
                    {service.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-2.5 text-slate-600">
                        <span className="text-brand-accent mt-1.5 flex-shrink-0">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <circle cx="10" cy="10" r="3" />
                          </svg>
                        </span>
                        <span className="text-sm leading-relaxed">{feature}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          ))}
        </div>
      </Reveal>
    </Section>
  );
}
