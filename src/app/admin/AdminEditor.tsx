"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import type { SiteContent } from "@/src/app/lib/siteContentSchema";

type TabId = "overview" | "business" | "home" | "services" | "projects" | "reviews" | "sections";

const TABS: { id: TabId; label: string; detail: string }[] = [
  { id: "overview", label: "Overview", detail: "Your website at a glance" },
  { id: "business", label: "Business details", detail: "Contact and navigation" },
  { id: "home", label: "Page content", detail: "Home, about, team and contact" },
  { id: "services", label: "Services", detail: "Cards and descriptions" },
  { id: "projects", label: "Projects", detail: "Portfolio and photo galleries" },
  { id: "reviews", label: "Reviews", detail: "Customer quotes" },
  { id: "sections", label: "Extra sections", detail: "Add prepared text sections" }
];

type FieldProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  multiline?: boolean;
  hint?: string;
  rows?: number;
  type?: string;
};

function Field({ label, value, onChange, multiline = false, hint, rows = 4, type = "text" }: FieldProps) {
  const shared = "mt-1.5 w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none transition focus:border-brand-navy focus:ring-2 focus:ring-brand-navy/10";
  return (
    <label className="block min-w-0 text-sm font-medium text-slate-700">
      {label}
      {multiline ? (
        <textarea className={`${shared} resize-y`} rows={rows} value={value} onChange={(event) => onChange(event.target.value)} />
      ) : (
        <input className={shared} type={type} value={value} onChange={(event) => onChange(event.target.value)} />
      )}
      {hint && <span className="mt-1 block text-xs font-normal leading-5 text-slate-500">{hint}</span>}
    </label>
  );
}

function ImageField({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  const [draft, setDraft] = useState(value.startsWith("data:image/") ? "" : value);
  const [uploadError, setUploadError] = useState("");
  useEffect(() => setDraft(value.startsWith("data:image/") ? "" : value), [value]);
  const previewSource = value.startsWith("/img/") || value.startsWith("data:image/") ? value : null;
  return (
    <div className="grid grid-cols-[72px_1fr] items-start gap-3">
      <div className="relative mt-6 h-[72px] w-[72px] overflow-hidden rounded-lg border border-slate-200 bg-slate-100">
        {previewSource && <Image src={previewSource} alt="" fill sizes="72px" unoptimized className="object-cover" />}
      </div>
      <div className="space-y-2">
      <Field
        label={label}
        value={draft}
        onChange={(nextValue) => {
          setDraft(nextValue);
          onChange(nextValue || value);
        }}
        hint={value.startsWith("data:image/") ? "The current image is embedded. Leave this blank to keep it, enter a site path, or upload a replacement." : "Use a site image path such as /img/charger.avif, or upload a replacement."}
      />
      <label className="inline-flex cursor-pointer items-center gap-2 rounded-md px-2.5 py-1.5 text-xs font-semibold text-brand-navy transition hover:bg-brand-mist focus-within:ring-2 focus-within:ring-brand-accent">
        <span>Upload image</span>
        <input type="file" accept="image/png,image/jpeg,image/webp,image/avif" className="sr-only" onChange={(event) => {
          const file = event.target.files?.[0];
          event.target.value = "";
          setUploadError("");
          if (!file) return;
          if (file.size > 1_400_000) {
            setUploadError("Choose an image smaller than 1.4 MB.");
            return;
          }
          if (!["image/png", "image/jpeg", "image/webp", "image/avif"].includes(file.type)) {
            setUploadError("Use a PNG, JPEG, WebP or AVIF image.");
            return;
          }
          const reader = new FileReader();
          reader.onload = () => {
            if (typeof reader.result === "string") {
              setDraft("");
              onChange(reader.result);
            }
          };
          reader.onerror = () => setUploadError("Could not read that image.");
          reader.readAsDataURL(file);
        }} />
      </label>
      {uploadError && <p role="alert" className="text-xs text-red-700">{uploadError}</p>}
      </div>
    </div>
  );
}

function CardHeading({ eyebrow, title, action }: { eyebrow: string; title: string; action?: React.ReactNode }) {
  return (
    <div className="mb-6 flex flex-wrap items-start justify-between gap-4 border-b border-slate-100 pb-5">
      <div>
        <p className="text-xs font-semibold tracking-wide text-slate-500">{eyebrow}</p>
        <h2 className="mt-1 text-xl font-semibold tracking-tight text-brand-navy">{title}</h2>
      </div>
      {action}
    </div>
  );
}

function AddButton({ children, onClick }: { children: React.ReactNode; onClick: () => void }) {
  return <button type="button" onClick={onClick} className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:border-brand-navy hover:text-brand-navy focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent">{children}</button>;
}

function RemoveButton({ onClick }: { onClick: () => void }) {
  return <button type="button" onClick={onClick} className="rounded-md px-2.5 py-1.5 text-xs font-semibold text-red-700 transition hover:bg-red-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-300">Remove</button>;
}

export default function AdminEditor() {
  const router = useRouter();
  const [content, setContent] = useState<SiteContent | null>(null);
  const [activeTab, setActiveTab] = useState<TabId>("overview");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    fetch("/api/admin/content", { cache: "no-store" })
      .then(async (response) => {
        if (response.status === 401) {
          router.replace("/admin/login");
          return null;
        }
        if (!response.ok) throw new Error("Could not load website content.");
        return (await response.json()) as SiteContent;
      })
      .then((result) => { if (active && result) setContent(result); })
      .catch((requestError: unknown) => {
        if (active) setError(requestError instanceof Error ? requestError.message : "Could not load website content.");
      })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [router]);

  const update = (recipe: (current: SiteContent) => SiteContent) => {
    setContent((current) => current ? recipe(current) : current);
    setMessage("");
    setError("");
  };

  const updateService = (index: number, patch: Partial<SiteContent["services"]["cards"][number]>) => update((current) => ({
    ...current,
    services: { ...current.services, cards: current.services.cards.map((item, itemIndex) => itemIndex === index ? { ...item, ...patch } : item) }
  }));
  const updateProject = (index: number, patch: Partial<SiteContent["projects"]["cards"][number]>) => update((current) => ({
    ...current,
    projects: { ...current.projects, cards: current.projects.cards.map((item, itemIndex) => itemIndex === index ? { ...item, ...patch } : item) }
  }));
  const updateReview = (index: number, patch: Partial<SiteContent["reviews"]["items"][number]>) => update((current) => ({
    ...current,
    reviews: { ...current.reviews, items: current.reviews.items.map((item, itemIndex) => itemIndex === index ? { ...item, ...patch } : item) }
  }));

  const save = async () => {
    if (!content) return;
    setSaving(true);
    setMessage("");
    setError("");
    try {
      const response = await fetch("/api/admin/content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(content)
      });
      const result = await response.json().catch(() => ({})) as { error?: string };
      if (response.status === 401) {
        router.replace("/admin/login");
        return;
      }
      if (!response.ok) throw new Error(result.error || "Could not save changes.");
      setMessage("Changes saved. The public site now uses this content.");
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Could not save changes.");
    } finally {
      setSaving(false);
    }
  };

  const logout = async () => {
    await fetch("/api/admin/logout", { method: "POST" }).catch(() => undefined);
    router.replace("/admin/login");
    router.refresh();
  };

  if (loading) return <div className="grid min-h-screen place-items-center bg-slate-50 text-sm text-slate-500">Loading your website content…</div>;
  if (!content) return <div className="grid min-h-screen place-items-center bg-slate-50 p-6 text-center"><p className="max-w-md text-sm text-red-700">{error || "Could not load the editor."}</p></div>;

  const active = TABS.find((tab) => tab.id === activeTab) || TABS[0];

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 lg:flex">
      <aside className="border-b border-slate-200 bg-white lg:sticky lg:top-0 lg:flex lg:h-screen lg:w-[250px] lg:shrink-0 lg:flex-col lg:border-b-0 lg:border-r">
        <div className="flex items-center justify-between gap-3 px-5 py-5 lg:block lg:px-6 lg:py-7">
          <a href="/" className="inline-flex items-center gap-3 text-sm font-semibold text-brand-navy">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-brand-navy text-sm font-bold text-brand-accent">K</span>
            <span>King Electric<span className="mt-0.5 block text-xs font-normal text-slate-500">Website admin</span></span>
          </a>
          <button onClick={logout} className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 lg:hidden">Sign out</button>
        </div>
        <nav aria-label="Admin sections" className="flex gap-1 overflow-x-auto px-3 pb-3 lg:block lg:flex-1 lg:space-y-1 lg:overflow-y-auto lg:px-3">
          {TABS.map((tab) => (
            <button key={tab.id} onClick={() => { setActiveTab(tab.id); setError(""); setMessage(""); }} aria-current={activeTab === tab.id ? "page" : undefined}
              className={`shrink-0 rounded-lg px-3 py-2.5 text-left text-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent lg:block lg:w-full ${activeTab === tab.id ? "bg-brand-mist font-semibold text-brand-navy" : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"}`}>
              <span>{tab.label}</span><span className="mt-0.5 hidden text-xs font-normal text-slate-500 lg:block">{tab.detail}</span>
            </button>
          ))}
        </nav>
        <div className="hidden border-t border-slate-200 p-4 lg:block">
          <a href="/" target="_blank" rel="noreferrer" className="block rounded-lg px-3 py-2 text-sm text-slate-600 hover:bg-slate-50">View public website ↗</a>
          <button onClick={logout} className="mt-1 w-full rounded-lg px-3 py-2 text-left text-sm text-slate-600 hover:bg-slate-50">Sign out</button>
        </div>
      </aside>

      <section className="min-w-0 flex-1">
        <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/95 backdrop-blur">
          <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-4 sm:px-8">
            <div><h1 className="text-lg font-semibold tracking-tight text-brand-navy sm:text-xl">{active.label}</h1><p className="mt-0.5 text-xs text-slate-500">{active.detail}</p></div>
            <div className="flex items-center gap-3">
              {message && <span role="status" className="hidden text-sm text-emerald-700 sm:inline">{message}</span>}
              <button onClick={save} disabled={saving} className="rounded-lg bg-brand-navy px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-navy2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent focus-visible:ring-offset-2 disabled:cursor-wait disabled:opacity-60">{saving ? "Saving…" : "Save changes"}</button>
            </div>
          </div>
        </header>

        <div className="mx-auto max-w-6xl space-y-6 px-5 py-7 sm:px-8 sm:py-9">
          {message && <p role="status" className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800 sm:hidden">{message}</p>}
          {error && <p role="alert" className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">{error}</p>}

          {activeTab === "overview" && <div className="space-y-6">
            <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="grid gap-6 p-6 sm:p-8 lg:grid-cols-[1fr_auto] lg:items-center">
                <div><p className="text-sm font-semibold text-brand-navy">Your website content, in one place</p><h2 className="mt-2 max-w-xl text-3xl font-semibold leading-tight tracking-tight text-slate-950">Make updates and keep your services current.</h2><p className="mt-3 max-w-xl text-sm leading-6 text-slate-600">Edit the information shown on the public site. The page layout and server settings stay managed in the website code.</p></div>
                <div className="grid h-24 w-24 place-items-center rounded-2xl bg-brand-mist text-brand-navy"><svg viewBox="0 0 48 48" className="h-12 w-12" fill="none" aria-hidden="true"><path d="M27 5 12 26h10l-1 17 15-23H25l2-15Z" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round"/><path d="M38 9v7M34.5 12.5h7M8 34v6M5 37h6" stroke="#F6C400" strokeWidth="2.5" strokeLinecap="round"/></svg></div>
              </div>
            </section>
            <div className="grid gap-4 sm:grid-cols-3">
              {[{ label: "Services", count: content.services.cards.length, tab: "services" as const }, { label: "Projects", count: content.projects.cards.length, tab: "projects" as const }, { label: "Reviews", count: content.reviews.items.length, tab: "reviews" as const }].map((item) => <button key={item.label} onClick={() => setActiveTab(item.tab)} className="rounded-xl border border-slate-200 bg-white p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-slate-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent"><span className="text-sm text-slate-500">{item.label}</span><span className="mt-2 block text-3xl font-semibold tabular-nums text-brand-navy">{item.count}</span><span className="mt-3 block text-xs text-slate-500">Manage {item.label.toLowerCase()} →</span></button>)}
            </div>
            <p className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-6 text-amber-950">Changes are saved on this server. For a production deployment, the content file must live on persistent storage so redeployments do not erase edits.</p>
          </div>}

          {activeTab === "business" && <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <CardHeading eyebrow="Website identity" title="Business details" />
            <div className="grid gap-5 md:grid-cols-2">
              <Field label="Business name" value={content.site.companyName} onChange={(value) => update((current) => ({ ...current, site: { ...current.site, companyName: value } }))} />
              <Field label="Tagline" value={content.site.tagline} onChange={(value) => update((current) => ({ ...current, site: { ...current.site, tagline: value } }))} />
              <Field label="Phone number" value={content.site.phoneDisplay} onChange={(value) => update((current) => ({ ...current, site: { ...current.site, phoneDisplay: value, phoneTel: `tel:${value.replace(/[^0-9+]/g, "")}` } }))} />
              <Field label="Email" type="email" value={content.site.toEmail} onChange={(value) => update((current) => ({ ...current, site: { ...current.site, toEmail: value } }))} />
              <Field label="Location" value={content.site.locationLabel} onChange={(value) => update((current) => ({ ...current, site: { ...current.site, locationLabel: value } }))} />
              <Field label="Map embed URL" value={content.site.mapsEmbedUrl} onChange={(value) => update((current) => ({ ...current, site: { ...current.site, mapsEmbedUrl: value } }))} hint="Use the HTTPS Google Maps embed address." />
            </div>
            <div className="mt-8 border-t border-slate-100 pt-6">
              <CardHeading eyebrow="Navigation" title="Menu links" action={<AddButton onClick={() => update((current) => ({ ...current, nav: [...current.nav, { label: "New link", href: "#contact" }] }))}>Add link</AddButton>} />
              <div className="space-y-3">{content.nav.map((item, index) => <div key={`${item.href}-${index}`} className="grid gap-3 rounded-lg border border-slate-100 p-3 sm:grid-cols-[1fr_1fr_auto] sm:items-end"><Field label="Label" value={item.label} onChange={(value) => update((current) => ({ ...current, nav: current.nav.map((entry, entryIndex) => entryIndex === index ? { ...entry, label: value } : entry) }))} /><Field label="Link" value={item.href} onChange={(value) => update((current) => ({ ...current, nav: current.nav.map((entry, entryIndex) => entryIndex === index ? { ...entry, href: value } : entry) }))} hint="Use #services, #projects, /about or a custom section anchor." /><RemoveButton onClick={() => update((current) => ({ ...current, nav: current.nav.filter((_, entryIndex) => entryIndex !== index) }))} /></div>)}</div>
            </div>
          </section>}

          {activeTab === "home" && <div className="space-y-6">
            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8"><CardHeading eyebrow="Homepage" title="Main message" /><div className="grid gap-5"><Field label="Headline" value={content.hero.headline} onChange={(value) => update((current) => ({ ...current, hero: { ...current.hero, headline: value } }))} /><Field label="Supporting text" multiline value={content.hero.subheadline} onChange={(value) => update((current) => ({ ...current, hero: { ...current.hero, subheadline: value } }))} /><div className="grid gap-5 sm:grid-cols-2"><Field label="Primary button" value={content.hero.primaryCta} onChange={(value) => update((current) => ({ ...current, hero: { ...current.hero, primaryCta: value } }))} /><Field label="Call button" value={content.hero.secondaryCta} onChange={(value) => update((current) => ({ ...current, hero: { ...current.hero, secondaryCta: value } }))} /></div></div></section>
            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8"><CardHeading eyebrow="About page" title="About the business" /><div className="grid gap-5 md:grid-cols-2"><Field label="Section title" value={content.about.title} onChange={(value) => update((current) => ({ ...current, about: { ...current.about, title: value } }))} /><ImageField label="First image" value={content.about.imageOne} onChange={(value) => update((current) => ({ ...current, about: { ...current.about, imageOne: value } }))} /><Field label="First paragraph" multiline rows={6} value={content.about.body} onChange={(value) => update((current) => ({ ...current, about: { ...current.about, body: value } }))} /><ImageField label="Second image" value={content.about.imageTwo} onChange={(value) => update((current) => ({ ...current, about: { ...current.about, imageTwo: value } }))} /><Field label="Second paragraph" multiline rows={5} value={content.about.body2} onChange={(value) => update((current) => ({ ...current, about: { ...current.about, body2: value } }))} /></div></section>
            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8"><CardHeading eyebrow="Company" title="Team section" /><div className="grid gap-5"><Field label="Section title" value={content.team.title} onChange={(value) => update((current) => ({ ...current, team: { ...current.team, title: value } }))} /><Field label="Description" multiline rows={5} value={content.team.body} onChange={(value) => update((current) => ({ ...current, team: { ...current.team, body: value } }))} /></div></section>
            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8"><CardHeading eyebrow="Contact section" title="Contact copy and hours" /><div className="grid gap-5"><Field label="Title" value={content.contact.title} onChange={(value) => update((current) => ({ ...current, contact: { ...current.contact, title: value } }))} /><Field label="Description" multiline value={content.contact.subtitle} onChange={(value) => update((current) => ({ ...current, contact: { ...current.contact, subtitle: value } }))} /><Field label="Business hours" multiline rows={7} value={content.contact.businessHours.join("\n")} onChange={(value) => update((current) => ({ ...current, contact: { ...current.contact, businessHours: value.split("\n") } }))} hint="One line per day." /></div></section>
          </div>}

          {activeTab === "services" && <section className="space-y-5">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8"><CardHeading eyebrow="Service catalog" title="Services" action={<AddButton onClick={() => update((current) => ({ ...current, services: { ...current.services, cards: [...current.services.cards, { emoji: "⚡", title: "New service", description: "", img: "/img/charger.avif", features: [] }] } }))}>Add service</AddButton>} /><Field label="Section title" value={content.services.title} onChange={(value) => update((current) => ({ ...current, services: { ...current.services, title: value } }))} /></div>
            {content.services.cards.map((service, index) => <article key={`${service.title}-${index}`} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8"><CardHeading eyebrow={`Service ${String(index + 1).padStart(2, "0")}`} title={service.title || "Untitled service"} action={<RemoveButton onClick={() => update((current) => ({ ...current, services: { ...current.services, cards: current.services.cards.filter((_, itemIndex) => itemIndex !== index) } }))} />} /><div className="grid gap-5 md:grid-cols-2"><Field label="Icon" value={service.emoji} onChange={(value) => updateService(index, { emoji: value })} /><Field label="Service name" value={service.title} onChange={(value) => updateService(index, { title: value })} /><Field label="Description" multiline value={service.description} onChange={(value) => updateService(index, { description: value })} /><ImageField label="Image path" value={service.img} onChange={(value) => updateService(index, { img: value })} /><Field label="Features" multiline rows={6} value={service.features.join("\n")} onChange={(value) => updateService(index, { features: value.split("\n") })} hint="One feature per line." /></div></article>)}
          </section>}

          {activeTab === "projects" && <section className="space-y-5">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8"><CardHeading eyebrow="Portfolio" title="Projects" action={<AddButton onClick={() => update((current) => ({ ...current, projects: { ...current.projects, cards: [...current.projects.cards, { title: "New project", img: "/img/charger.avif", description: "", features: [], gallery: [] }] } }))}>Add project</AddButton>} /><Field label="Section title" value={content.projects.title} onChange={(value) => update((current) => ({ ...current, projects: { ...current.projects, title: value } }))} /></div>
            {content.projects.cards.map((project, index) => <article key={`${project.title}-${index}`} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8"><CardHeading eyebrow={`Project ${String(index + 1).padStart(2, "0")}`} title={project.title || "Untitled project"} action={<RemoveButton onClick={() => update((current) => ({ ...current, projects: { ...current.projects, cards: current.projects.cards.filter((_, itemIndex) => itemIndex !== index) } }))} />} /><div className="grid gap-5 md:grid-cols-2"><Field label="Project name" value={project.title} onChange={(value) => updateProject(index, { title: value })} /><ImageField label="Cover image path" value={project.img} onChange={(value) => updateProject(index, { img: value })} /><Field label="Description" multiline value={project.description} onChange={(value) => updateProject(index, { description: value })} /><Field label="Highlights" multiline value={project.features.join("\n")} onChange={(value) => updateProject(index, { features: value.split("\n") })} hint="One highlight per line." /><Field label="Gallery image paths" multiline rows={5} value={project.gallery.join("\n")} onChange={(value) => updateProject(index, { gallery: value.split("\n") })} hint="One /img/... path per line." /></div></article>)}
          </section>}

          {activeTab === "reviews" && <section className="space-y-5">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8"><CardHeading eyebrow="Customer feedback" title="Reviews" action={<AddButton onClick={() => update((current) => ({ ...current, reviews: { ...current.reviews, items: [...current.reviews.items, { quote: "", author: "", source: "Google review" }] } }))}>Add review</AddButton>} /><Field label="Section title" value={content.reviews.title} onChange={(value) => update((current) => ({ ...current, reviews: { ...current.reviews, title: value } }))} /></div>
            {content.reviews.items.map((review, index) => <article key={`${review.author}-${index}`} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8"><CardHeading eyebrow={`Review ${String(index + 1).padStart(2, "0")}`} title={review.author || "New review"} action={<RemoveButton onClick={() => update((current) => ({ ...current, reviews: { ...current.reviews, items: current.reviews.items.filter((_, itemIndex) => itemIndex !== index) } }))} />} /><div className="grid gap-5 md:grid-cols-3"><Field label="Customer" value={review.author} onChange={(value) => updateReview(index, { author: value })} /><Field label="Source" value={review.source} onChange={(value) => updateReview(index, { source: value })} /><Field label="Review" multiline rows={4} value={review.quote} onChange={(value) => updateReview(index, { quote: value })} /></div></article>)}
          </section>}

          {activeTab === "sections" && <section className="space-y-5">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8"><CardHeading eyebrow="Prepared layout" title="Extra text sections" action={<AddButton onClick={() => update((current) => ({ ...current, extraSections: [...current.extraSections, { id: `custom-${crypto.randomUUID().slice(0, 8)}`, title: "New section", body: "", image: "" }] }))}>Add section</AddButton>} /><p className="max-w-2xl text-sm leading-6 text-slate-600">Add a heading, text and optional existing site image. These sections use the website’s prepared layout and appear before projects.</p></div>
            {content.extraSections.map((section, index) => <article key={section.id} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8"><CardHeading eyebrow={`Extra section ${String(index + 1).padStart(2, "0")}`} title={section.title || "Untitled section"} action={<RemoveButton onClick={() => update((current) => ({ ...current, extraSections: current.extraSections.filter((_, itemIndex) => itemIndex !== index), nav: current.nav.filter((item) => item.href !== `#${section.id}`) }))} />} /><div className="grid gap-5 md:grid-cols-2"><Field label="Section title" value={section.title} onChange={(value) => update((current) => ({ ...current, extraSections: current.extraSections.map((item, itemIndex) => itemIndex === index ? { ...item, title: value } : item) }))} /><Field label="Menu label (optional)" value={content.nav.find((item) => item.href === `#${section.id}`)?.label || ""} onChange={(value) => update((current) => ({ ...current, nav: value ? (current.nav.some((item) => item.href === `#${section.id}`) ? current.nav.map((item) => item.href === `#${section.id}` ? { ...item, label: value } : item) : [...current.nav, { label: value, href: `#${section.id}` }]) : current.nav.filter((item) => item.href !== `#${section.id}`) }))} /><Field label="Text" multiline rows={5} value={section.body} onChange={(value) => update((current) => ({ ...current, extraSections: current.extraSections.map((item, itemIndex) => itemIndex === index ? { ...item, body: value } : item) }))} /><ImageField label="Optional image path" value={section.image} onChange={(value) => update((current) => ({ ...current, extraSections: current.extraSections.map((item, itemIndex) => itemIndex === index ? { ...item, image: value } : item) }))} /></div></article>)}
            {content.extraSections.length === 0 && <div className="rounded-xl border border-dashed border-slate-300 bg-white px-6 py-12 text-center"><p className="text-sm font-medium text-slate-800">No extra sections yet</p><p className="mt-1 text-sm text-slate-500">Add a prepared section when you want to share more information.</p></div>}
          </section>}
          <div className="flex justify-end border-t border-slate-200 pt-5"><button onClick={save} disabled={saving} className="rounded-lg bg-brand-navy px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-navy2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent focus-visible:ring-offset-2 disabled:cursor-wait disabled:opacity-60">{saving ? "Saving…" : "Save changes"}</button></div>
        </div>
      </section>
    </main>
  );
}
