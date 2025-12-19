"use client";

import { useEffect } from "react";
import { NAV, SITE } from "@/src/lib/content";
import MobileMenu from "./MobileMenu";
import { useUIStore } from "@/src/store/uiStore";

export default function Header() {
  const open = useUIStore((s) => s.mobileMenuOpen);
  const setOpen = useUIStore((s) => s.setMobileMenuOpen);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const scrollTo = (href: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    const id = href.replace("#", "");
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <>
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur border-b border-slate-100">
        <div className="mx-auto max-w-6xl px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full border border-slate-200 grid place-items-center text-brand-navy font-semibold">
              JE
            </div>
            <div className="leading-tight">
              <div className="font-semibold text-slate-900">{SITE.companyName}</div>
              <div className="text-xs text-slate-500">{SITE.tagline}</div>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-6">
            {NAV.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={scrollTo(item.href)}
                className="text-sm text-slate-600 hover:text-slate-900 transition"
              >
                {item.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <a
              href={SITE.phoneTel}
              className="hidden sm:inline text-brand-navy font-semibold underline underline-offset-8"
            >
              {SITE.phoneDisplay}
            </a>

            <button
              onClick={() => setOpen(true)}
              aria-label="Open menu"
              className="md:hidden h-10 w-10 rounded-lg border border-slate-200 hover:bg-slate-50 transition grid place-items-center"
            >
              <div className="space-y-1">
                <div className="h-0.5 w-5 bg-slate-700" />
                <div className="h-0.5 w-5 bg-slate-700" />
                <div className="h-0.5 w-5 bg-slate-700" />
              </div>
            </button>
          </div>
        </div>
      </header>

      <MobileMenu />
    </>
  );
}
