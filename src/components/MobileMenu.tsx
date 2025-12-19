"use client";

import Link from "next/link";
import { NAV, SITE } from "@/src/lib/content";
import { useUIStore } from "@/src/store/uiStore";

export default function MobileMenu() {
  const open = useUIStore((s) => s.mobileMenuOpen);
  const setOpen = useUIStore((s) => s.setMobileMenuOpen);

  if (!open) return null;

  const handleNav = (href: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    setOpen(false);
    const id = href.replace("#", "");
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="fixed inset-0 z-[60] bg-white">
      <button
        onClick={() => setOpen(false)}
        aria-label="Close menu"
        className="absolute right-6 top-6 text-4xl text-slate-700 hover:text-slate-900 transition"
      >
        ×
      </button>

      <div className="h-full w-full flex items-center justify-center">
        <nav className="flex flex-col items-center gap-10">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={handleNav(item.href)}
              className="text-3xl md:text-4xl font-light text-slate-500 hover:text-slate-900 transition"
            >
              {item.label}
            </Link>
          ))}

          <a
            href={SITE.phoneTel}
            className="mt-4 text-slate-600 hover:text-slate-900 transition underline underline-offset-8"
          >
            {SITE.phoneDisplay}
          </a>
        </nav>
      </div>
    </div>
  );
}
