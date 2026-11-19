"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";

export default function LoginForm() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
      });
      const result = await response.json().catch(() => ({})) as { error?: string };
      if (!response.ok) throw new Error(result.error || "Could not sign in.");
      router.replace("/admin");
      router.refresh();
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Could not sign in.");
      setSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 lg:grid lg:grid-cols-[1fr_1fr]">
      <section className="relative hidden overflow-hidden bg-brand-navy p-12 text-white lg:flex lg:flex-col lg:justify-between xl:p-16">
        <div className="absolute -right-20 -top-24 h-80 w-80 rounded-full border border-white/10" />
        <div className="absolute -right-2 -top-6 h-44 w-44 rounded-full border border-brand-accent/30" />
        <a href="/" className="relative z-10 inline-flex items-center gap-3 font-semibold">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-white/10 text-brand-accent">K</span>
          <span>King Electric<span className="mt-0.5 block text-xs font-normal text-slate-300">Website administration</span></span>
        </a>
        <div className="relative z-10 max-w-xl py-16">
          <svg viewBox="0 0 48 48" className="mb-8 h-12 w-12 text-brand-accent" fill="none" aria-hidden="true"><path d="M27 5 12 26h10l-1 17 15-23H25l2-15Z" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round"/></svg>
          <h1 className="text-4xl font-semibold leading-tight tracking-tight xl:text-5xl">Keep your website up to date.</h1>
          <p className="mt-5 max-w-md text-base leading-7 text-slate-300">Sign in to manage your business details, services, project photos and customer reviews.</p>
        </div>
        <p className="relative z-10 text-xs text-slate-400">Private administrator access · Changes publish to the website when saved</p>
      </section>

      <section className="flex min-h-screen items-center justify-center px-5 py-12 sm:px-8">
        <div className="w-full max-w-[400px]">
          <a href="/" className="mb-10 inline-flex items-center gap-3 font-semibold text-brand-navy lg:hidden"><span className="grid h-9 w-9 place-items-center rounded-xl bg-brand-navy text-brand-accent">K</span>King Electric</a>
          <p className="text-sm font-semibold text-slate-500">Website admin</p>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight text-brand-navy">Sign in</h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">Use the administrator credentials provided to you.</p>

          <form onSubmit={submit} className="mt-8 space-y-5">
            <label className="block text-sm font-medium text-slate-700">Username<input autoComplete="username" required value={username} onChange={(event) => setUsername(event.target.value)} className="mt-1.5 w-full rounded-lg border border-slate-200 bg-white px-3.5 py-3 text-sm outline-none transition focus:border-brand-navy focus:ring-2 focus:ring-brand-navy/10" /></label>
            <label className="block text-sm font-medium text-slate-700">Password<input type="password" autoComplete="current-password" required value={password} onChange={(event) => setPassword(event.target.value)} className="mt-1.5 w-full rounded-lg border border-slate-200 bg-white px-3.5 py-3 text-sm outline-none transition focus:border-brand-navy focus:ring-2 focus:ring-brand-navy/10" /></label>
            {error && <p role="alert" className="rounded-lg border border-red-200 bg-red-50 px-3.5 py-3 text-sm text-red-800">{error}</p>}
            <button disabled={submitting} className="w-full rounded-lg bg-brand-navy px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-navy2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent focus-visible:ring-offset-2 disabled:cursor-wait disabled:opacity-60">{submitting ? "Signing in…" : "Sign in"}</button>
          </form>
          <p className="mt-6 text-xs leading-5 text-slate-500">Your session expires automatically after eight hours.</p>
        </div>
      </section>
    </main>
  );
}
