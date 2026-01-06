"use client";

import { useState } from "react";
import Image from "next/image";
import Section from "@/src/app/components/Section";
import Reveal from "@/src/app/components/Reveal";
import ProjectModal from "@/src/app/components/ProjectModal";
import { PROJECTS } from "@/src/app/lib/content";

type Project = typeof PROJECTS.cards[number];

export default function Projects() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  return (
    <Section id="projects" className="bg-brand-mist">
      <Reveal>
        <h2 className="text-4xl md:text-6xl font-semibold text-brand-navy text-center">
          {PROJECTS.title}
        </h2>

        <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-3 max-w-5xl mx-auto">
          {PROJECTS.cards.map((p) => (
            <button
              key={p.title}
              onClick={() => setSelectedProject(p)}
              className="group text-left w-full rounded-2xl overflow-hidden border border-slate-200 bg-white shadow-soft transition-transform hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-brand-navy/50"
            >
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
                
                {/* Overlay Icon indicating clickability */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/20">
                  <div className="bg-white/90 p-3 rounded-full shadow-lg transform scale-75 group-hover:scale-100 transition-transform duration-300">
                    <svg className="w-6 h-6 text-brand-navy" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                    </svg>
                  </div>
                </div>
              </div>
              <div className="p-5">
                <h3 className="text-2xl md:text-[26px] font-semibold text-brand-navy group-hover:opacity-90 transition">
                  {p.title}
                </h3>
              </div>
            </button>
          ))}
        </div>
      </Reveal>

      <ProjectModal
        project={selectedProject}
        isOpen={!!selectedProject}
        onClose={() => setSelectedProject(null)}
      />
    </Section>
  );
}
