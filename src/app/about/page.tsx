import BackToTop from "@/src/app/components/BackToTop";
import Footer from "@/src/app/components/Footer";
import Header from "@/src/app/components/Header";
import { REVIEWS, SITE, TEAM, VALUES } from "@/src/app/lib/content";

export default function Page() {
  const review = REVIEWS.items[0];

  return (
    <main className="min-h-screen bg-white text-slate-900">
      <Header />

      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-brand-accent">
            The Full Story
          </p>
          <h1 className="mt-4 text-4xl font-semibold text-brand-accent sm:text-5xl">About</h1>
          <p className="mt-6 text-base leading-8 text-slate-600 sm:text-lg">
            At our company, we are committed to providing exceptional electrical services to both
            homeowners and businesses throughout Virginia. Our unwavering dedication to safety,
            quality, and customer satisfaction has earned us a reputation as a trusted provider of
            electrical solutions in the region. Since 2011, we have proudly served Northern
            Virginia and look forward to continuing that commitment for years to come.
          </p>
        </div>
      </section>

      <section className="border-t border-slate-200 py-16 sm:py-20">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 lg:grid-cols-[1.1fr_1fr] lg:items-center">
          <div className="aspect-[4/3] w-full rounded-3xl border-2 border-dashed border-slate-300 bg-slate-100 text-sm text-slate-500 sm:text-base">
            <div className="flex h-full items-center justify-center px-6 text-center">
              Image placeholder (add your photo here)
            </div>
          </div>
          <div className="text-center lg:text-left">
            <h2 className="text-3xl font-semibold text-brand-accent sm:text-4xl">{VALUES.title}</h2>
          </div>
        </div>
      </section>

      <section className="border-t border-slate-200 py-16 sm:py-20">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 lg:grid-cols-[1fr_1.1fr] lg:items-center">
          <div className="order-2 text-center lg:order-1 lg:text-left">
            <h2 className="text-3xl font-semibold text-brand-accent sm:text-4xl">{TEAM.title}</h2>
            <p className="mt-6 text-base leading-8 text-slate-600 sm:text-lg">{TEAM.body}</p>
          </div>
          <div className="order-1 aspect-[4/3] w-full rounded-3xl border-2 border-dashed border-slate-300 bg-slate-100 text-sm text-slate-500 sm:text-base lg:order-2">
            <div className="flex h-full items-center justify-center px-6 text-center">
              Image placeholder (add your photo here)
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-slate-200 py-16 sm:py-20">
        <div className="mx-auto max-w-5xl px-4 text-center">
          <h2 className="text-3xl font-semibold text-brand-accent sm:text-4xl">{REVIEWS.title}</h2>
          <p className="mt-6 text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
            {SITE.locationLabel}
          </p>
          <p className="mt-12 text-base leading-8 text-slate-600 sm:text-lg">{review.quote}</p>
          <p className="mt-6 text-sm font-semibold uppercase tracking-[0.15em] text-slate-500">
            {review.author} &nbsp;{review.source}
          </p>
        </div>
      </section>

      <Footer />
      <BackToTop />
    </main>
  );
}
