"use client";

import Section from "@/src/app/components/Section";
import Reveal from "@/src/app/components/Reveal";
import { CONTACT, SITE } from "@/src/app/lib/content";

import { useUIStore } from "@/src/app/store/uiStore";
import { contactSchema, type ContactFormValues } from "@/src/app/lib/contactSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

export default function Contact() {
  const status = useUIStore((s) => s.contactStatus);
  const errorMsg = useUIStore((s) => s.contactError);
  const setStatus = useUIStore((s) => s.setContactStatus);
  const setError = useUIStore((s) => s.setContactError);
  const resetStatus = useUIStore((s) => s.resetContactStatus);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isSubmitSuccessful }
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: { firstName: "", lastName: "", email: "", message: "" },
    mode: "onTouched"
  });

  const onSubmit = async (values: ContactFormValues) => {
    setStatus("sending");
    setError("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values)
      });

      if (!res.ok) {
        const data = (await res.json().catch(() => ({}))) as { error?: string };
        throw new Error(data.error || "Failed to send");
      }

      setStatus("sent");
      reset(values, { keepValues: false });
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Unknown error");
    }
  };

  return (
    <Section id="contact">
      <Reveal>
        <h2 className="text-4xl md:text-6xl font-semibold text-brand-navy text-center">
          {CONTACT.title}
        </h2>
        <p className="mt-6 max-w-4xl mx-auto text-center text-slate-600 text-lg leading-relaxed">
          {CONTACT.subtitle}
        </p>

        <div className="mt-12 grid gap-8 md:grid-cols-2">
          {/* FORM */}
          <div className="rounded-2xl border border-slate-200 bg-white shadow-soft p-8">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div>
                <label className="text-sm text-slate-600">First Name</label>
                <input
                  {...register("firstName")}
                  className="mt-2 w-full border-b border-slate-300 focus:border-brand-navy outline-none py-2"
                />
                {errors.firstName?.message && (
                  <p className="mt-1 text-sm text-red-600">{errors.firstName.message}</p>
                )}
              </div>

              <div>
                <label className="text-sm text-slate-600">Last Name</label>
                <input
                  {...register("lastName")}
                  className="mt-2 w-full border-b border-slate-300 focus:border-brand-navy outline-none py-2"
                />
                {errors.lastName?.message && (
                  <p className="mt-1 text-sm text-red-600">{errors.lastName.message}</p>
                )}
              </div>

              <div>
                <label className="text-sm text-slate-600">Email *</label>
                <input
                  {...register("email")}
                  type="email"
                  className="mt-2 w-full border-b border-slate-300 focus:border-brand-navy outline-none py-2"
                />
                {errors.email?.message && (
                  <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                )}
              </div>

              <div>
                <label className="text-sm text-slate-600">Message *</label>
                <textarea
                  {...register("message")}
                  rows={5}
                  className="mt-2 w-full border-b border-slate-300 focus:border-brand-navy outline-none py-2 resize-none"
                />
                {errors.message?.message && (
                  <p className="mt-1 text-sm text-red-600">{errors.message.message}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={isSubmitting || status === "sending"}
                className="w-full rounded-xl bg-brand-navy text-white font-semibold py-3 hover:bg-brand-navy2 transition disabled:opacity-60"
              >
                {status === "sending" ? "Sending..." : "Send"}
              </button>

              {status === "sent" && (
                <div className="text-sm text-emerald-700">
                  Message sent successfully.
                </div>
              )}

              {status === "error" && (
                <div className="text-sm text-red-600">Error: {errorMsg}</div>
              )}

              {(status === "sent" || status === "error") && (
                <button
                  type="button"
                  onClick={() => resetStatus()}
                  className="text-sm text-slate-500 underline underline-offset-4 hover:text-slate-800"
                >
                  Dismiss message
                </button>
              )}
            </form>

            <div className="mt-8 flex items-center justify-between gap-3">
              <a
                href={SITE.phoneTel}
                className="text-brand-navy font-semibold underline underline-offset-8"
              >
                {SITE.phoneDisplay}
              </a>
              <span className="text-sm text-slate-500">Tap to call</span>
            </div>
          </div>

          {/* MAP + HOURS */}
          <div className="space-y-6">
            <div className="rounded-2xl overflow-hidden border border-slate-200 bg-white shadow-soft">
              <iframe
                title="Google Map"
                src={SITE.mapsEmbedUrl}
                className="w-full h-[320px]"
                loading="lazy"
              />
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white shadow-soft p-8">
              <h3 className="text-xl font-semibold text-slate-900">Business hours :</h3>
              <ul className="mt-4 space-y-2 text-slate-600">
                {CONTACT.businessHours.map((h) => (
                  <li key={h}>{h}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </Reveal>
    </Section>
  );
}
