import BackToTop from "@/src/app/components/BackToTop";
import Footer from "@/src/app/components/Footer";
import Header from "@/src/app/components/Header";
import Reveal from "@/src/app/components/Reveal";
import Image from "next/image";
import { getSiteContent } from "@/src/app/lib/siteContentStore";

export const dynamic = "force-dynamic";

export default async function Page() {
  const content = await getSiteContent();
  return (
    <main className="min-h-screen bg-white text-slate-900">
      <Header site={content.site} nav={content.nav} />

      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <Reveal>
            <h1 className="mt-4 text-4xl font-semibold text-brand-navy sm:text-5xl">
              {content.about.title}
            </h1>
          </Reveal>
        </div>
      </section>

      <section className="border-t border-slate-200 py-16 sm:py-20">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 lg:grid-cols-[1.1fr_1fr] lg:items-center">
          <Reveal className="relative aspect-[4/3] w-full overflow-hidden rounded-3xl bg-slate-100">
            <Image
              src={content.about.imageOne}
              alt="Electrical charger installation"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </Reveal>
          <Reveal className="text-center lg:text-left">
            <p className="text-base leading-8 text-slate-600 sm:text-lg">
              {content.about.body}
            </p>
          </Reveal>
        </div>
      </section>

      <section className="border-t border-slate-200 py-16 sm:py-20">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 lg:grid-cols-[1fr_1.1fr] lg:items-center">
          <Reveal className="order-2 text-center lg:order-1 lg:text-left">
            <p className="text-base leading-8 text-slate-600 sm:text-lg">
              {content.about.body2}
            </p>
          </Reveal>
          <Reveal className="order-1 relative aspect-[4/3] w-full overflow-hidden rounded-3xl bg-slate-100 lg:order-2">
            <Image
              src={content.about.imageTwo}
              alt="Electrical charger equipment"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </Reveal>
        </div>
      </section>

      <Footer site={content.site} services={content.services} contact={content.contact} />
      <BackToTop />
    </main>
  );
}
