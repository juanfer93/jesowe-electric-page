"use client";

import { useState } from "react";
import Section from "@/src/app/components/Section";
import Reveal from "@/src/app/components/Reveal";
import ProjectModal from "@/src/app/components/ProjectModal";
import { PROJECTS } from "@/src/app/lib/content";
import NextImage from "next/image";

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
              type="button"
              onClick={() => setSelectedProject(p)}
              className="group w-full rounded-2xl border border-slate-200 bg-white shadow-soft transition-all hover:-translate-y-1 flex flex-col overflow-hidden text-left h-full"
            >
              <div className="relative w-full h-48 bg-slate-100">
                <NextImage
                  src={p.img}
                  alt={p.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
              </div>
              <div className="p-4 flex flex-col flex-1">
                <h3 className="text-lg font-semibold text-brand-navy mb-2 leading-snug">
                  {p.title}
                </h3>
                {p.description && (
                  <p className="text-slate-600 mb-4 leading-relaxed text-sm line-clamp-3">
                    {p.description}
                  </p>
                )}
                <div className="flex items-center gap-2 text-brand-navy text-sm font-medium hover:text-brand-accent transition-colors group/btn mt-auto pt-2">
                  <span>View Photos</span>
                  <svg
                    className="w-4 h-4 transform group-hover/btn:translate-x-1 transition-transform"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
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
