"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { createPortal } from "react-dom";

type Project = {
  title: string;
  gallery?: string[] | readonly string[];
};

type Props = {
  project: Project | null;
  isOpen: boolean;
  onClose: () => void;
};

export default function ProjectModal({ project, isOpen, onClose }: Props) {
  const [visible, setVisible] = useState(false);

  // Handle animation state
  useEffect(() => {
    if (isOpen) {
      // Small delay to allow mounting before animation
      const timer = setTimeout(() => setVisible(true), 10);
      return () => clearTimeout(timer);
    } else {
      setVisible(false);
    }
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  // Lock body scroll
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen && !visible) return null;

  // Use portal to render at root level to avoid z-index issues
  // Note: Checking for document to avoid SSR issues
  if (typeof document === "undefined") return null;

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div
        className={`absolute inset-0 bg-brand-navy/60 backdrop-blur-sm transition-opacity duration-300 ease-out ${
          visible ? "opacity-100" : "opacity-0"
        }`}
        onClick={onClose}
      />

      {/* Modal Content */}
      <div
        className={`relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white rounded-2xl shadow-2xl transform transition-all duration-300 ease-out ${
          visible ? "scale-100 opacity-100 translate-y-0" : "scale-95 opacity-0 translate-y-4"
        }`}
      >
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 bg-white border-b border-slate-100">
          <h3 className="text-xl md:text-2xl font-semibold text-brand-navy">
            {project?.title}
          </h3>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-slate-100 transition-colors text-slate-500 hover:text-brand-navy"
            aria-label="Close modal"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          {project?.gallery && project.gallery.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 justify-items-center">
              {project.gallery.map((src, index) => (
                <div
                  key={index}
                  className="relative h-40 sm:h-44 md:h-48 w-full max-w-[280px] rounded-xl overflow-hidden bg-slate-100 shadow-sm border border-slate-100"
                >
                  <Image
                    src={src}
                    alt={`${project.title} - Image ${index + 1}`}
                    fill
                    sizes="(min-width: 1024px) 280px, (min-width: 768px) 240px, 100vw"
                    className="object-cover hover:scale-105 transition-transform duration-500"
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-slate-500">
              <p>No additional photos available for this project.</p>
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
}
