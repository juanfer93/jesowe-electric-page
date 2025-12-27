"use client";

import { useEffect } from "react";
import Image from "next/image";
import { NAV, SITE } from "@/src/app/lib/content";
import { KING_ELECTRIC_LOGO } from "@/src/app/lib/brandAssets";
import MobileMenu from "./MobileMenu";
import { useUIStore } from "@/src/app/store/uiStore";

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
      <header className="sticky top-0 z-50 bg-black/70 backdrop-blur border-b border-white/10">
        <div className="mx-auto max-w-6xl px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Image
              src={KING_ELECTRIC_LOGO}
              alt="King Electric Home Renovations"
              width={160}
              height={64}
              className="h-10 w-auto rounded-md bg-black object-contain ring-1 ring-white/10 sm:h-12"
              priority
            />
            <div className="leading-tight">
              <div className="font-semibold text-white">{SITE.companyName}</div>
              <div className="text-xs text-brand-accent/90">{SITE.tagline}</div>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-6">
            {NAV.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={scrollTo(item.href)}
                className="text-sm text-slate-200 hover:text-brand-accent transition"
              >
                {item.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <a
              href={SITE.phoneTel}
              className="hidden sm:inline text-brand-accent font-semibold underline underline-offset-8"
            >
              {SITE.phoneDisplay}
            </a>

            <button
              onClick={() => setOpen(true)}
              aria-label="Open menu"
              className="md:hidden h-10 w-10 rounded-lg border border-white/20 hover:bg-white/10 transition grid place-items-center"
            >
              <div className="space-y-1">
                <div className="h-0.5 w-5 bg-white" />
                <div className="h-0.5 w-5 bg-white" />
                <div className="h-0.5 w-5 bg-white" />
              </div>
            </button>
          </div>
        </div>
      </header>

      <MobileMenu />
    </>
  );
}
