"use client";

import Link from "next/link";
import { useUIStore } from "@/src/app/store/uiStore";
import type { SiteContent } from "@/src/app/lib/siteContentSchema";

export default function MobileMenu({ site, nav }: { site: SiteContent["site"]; nav: SiteContent["nav"] }) {
  const open = useUIStore((s) => s.mobileMenuOpen);
  const setOpen = useUIStore((s) => s.setMobileMenuOpen);

  if (!open) return null;

  const handleNav = (href: string) => (e: React.MouseEvent) => {
    setOpen(false);
    if (!href.startsWith("#")) {
      return;
    }
    e.preventDefault();
    const id = href.replace("#", "");
    const target = document.getElementById(id);
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }
    window.location.href = `/${href}`;
  };

  return (
    <div className="fixed inset-0 z-[60] bg-black">
      <button
        onClick={() => setOpen(false)}
        aria-label="Close menu"
        className="absolute right-6 top-6 text-4xl text-white hover:text-brand-accent transition"
      >
        ×
      </button>

      <div className="h-full w-full flex items-center justify-center">
        <nav className="flex flex-col items-center gap-10">
          {nav.map((item) => (
            <span
              key={item.href}
              className="text-3xl md:text-4xl font-light text-slate-200 hover:text-brand-accent transition"
            >
              {item.href.startsWith("#") ? (
                <a href={item.href} onClick={handleNav(item.href)}>
                  {item.label}
                </a>
              ) : (
                <Link href={item.href} onClick={handleNav(item.href)}>
                  {item.label}
                </Link>
              )}
            </span>
          ))}

          <a
            href={site.phoneTel}
            className="mt-4 text-brand-accent hover:text-white transition underline underline-offset-8"
          >
            {site.phoneDisplay}
          </a>
        </nav>
      </div>
    </div>
  );
}
