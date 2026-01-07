"use client";

import { useState } from "react";
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
            <div
              key={p.title}
              className="group w-full rounded-2xl border border-slate-200 bg-white shadow-soft transition-transform hover:-translate-y-1 flex flex-col min-h-[320px]"
            >
              <div className="p-6 flex flex-col flex-1">
                <h3 className="text-xl md:text-2xl font-semibold text-brand-navy mb-3 leading-tight">
                  {p.title}
                </h3>
                {p.description && (
                  <p className="text-slate-600 mb-5 leading-relaxed text-[15px] min-h-[48px]">
                    {p.description}
                  </p>
                )}
                {p.features && p.features.length > 0 && (
                  <ul className="mb-5 space-y-2.5 flex-1 min-h-[120px]">
                    {p.features.map((feature, index) => (
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
                <button
                  onClick={() => setSelectedProject(p)}
                  className="flex items-center gap-2 text-brand-navy font-medium hover:text-brand-accent transition-colors group/btn mt-auto pt-2"
                >
                  <span>View Photos</span>
                  <svg 
                    className="w-5 h-5 transform group-hover/btn:translate-x-1 transition-transform" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
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
