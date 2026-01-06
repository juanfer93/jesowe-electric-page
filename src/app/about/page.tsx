import BackToTop from "@/src/app/components/BackToTop";
import Footer from "@/src/app/components/Footer";
import Header from "@/src/app/components/Header";
import Reveal from "@/src/app/components/Reveal";
import { REVIEWS, SITE, TEAM, VALUES } from "@/src/app/lib/content";
import Image from "next/image";

export default function Page() {
  const review = REVIEWS.items[0];

  return (
    <main className="min-h-screen bg-white text-slate-900">
      <Header />

      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <Reveal>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-brand-accent">
              The Full Story
            </p>
            <h1 className="mt-4 text-4xl font-semibold text-brand-navy sm:text-5xl">About</h1>
            <p className="mt-6 text-base leading-8 text-slate-600 sm:text-lg">
              At our company, we are committed to providing exceptional electrical services to
              both homeowners and businesses throughout Virginia. Our unwavering dedication to
              safety, quality, and customer satisfaction has earned us a reputation as a trusted
              provider of electrical solutions in the region. Since 2011, we have proudly served
              Northern Virginia and look forward to continuing that commitment for years to come.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="border-t border-slate-200 py-16 sm:py-20">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 lg:grid-cols-[1.1fr_1fr] lg:items-center">
          <Reveal className="relative aspect-[4/3] w-full overflow-hidden rounded-3xl bg-slate-100">
            <Image
              src="/img/charger.avif"
              alt="Electrical charger installation"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </Reveal>
          <Reveal className="text-center lg:text-left">
            <h2 className="text-3xl font-semibold text-brand-navy sm:text-4xl">{VALUES.title}</h2>
          </Reveal>
        </div>
      </section>

      <section className="border-t border-slate-200 py-16 sm:py-20">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 lg:grid-cols-[1fr_1.1fr] lg:items-center">
          <Reveal className="order-2 text-center lg:order-1 lg:text-left">
            <h2 className="text-3xl font-semibold text-brand-navy sm:text-4xl">{TEAM.title}</h2>
            <p className="mt-6 text-base leading-8 text-slate-600 sm:text-lg">{TEAM.body}</p>
          </Reveal>
          <Reveal className="order-1 relative aspect-[4/3] w-full overflow-hidden rounded-3xl bg-slate-100 lg:order-2">
            <Image
              src="/img/charger2.jpg"
              alt="Electrical charger equipment"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </Reveal>
        </div>
      </section>

      <section className="border-t border-slate-200 py-16 sm:py-20">

        <div className="mx-auto max-w-5xl px-4 text-center">
          <Reveal>
            <h2 className="text-3xl font-semibold text-brand-navy sm:text-4xl">{REVIEWS.title}</h2>
            <p className="mt-6 text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
              {SITE.locationLabel}
            </p>
            <p className="mt-12 text-base leading-8 text-slate-600 sm:text-lg">{review.quote}</p>
            <p className="mt-6 text-sm font-semibold uppercase tracking-[0.15em] text-slate-500">
              {review.author} &nbsp;{review.source}
            </p>
          </Reveal>
        </div>
      </section>

      <Footer />
      <BackToTop />
    </main>
  );
}
