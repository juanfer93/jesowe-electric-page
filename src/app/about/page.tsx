import BackToTop from "@/src/app/components/BackToTop";
import Footer from "@/src/app/components/Footer";
import Header from "@/src/app/components/Header";
import Reveal from "@/src/app/components/Reveal";
import Image from "next/image";

export default function Page() {
  return (
    <main className="min-h-screen bg-white text-slate-900">
      <Header />

      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <Reveal>
            <h1 className="mt-4 text-4xl font-semibold text-brand-navy sm:text-5xl">
              Professional Electrical Services in Virginia
            </h1>
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
            <p className="text-base leading-8 text-slate-600 sm:text-lg">
              King Electric provides reliable residential and commercial electrical services in Virginia. Our licensed electricians specialize in EV charger installations, electrical panel upgrades, indoor and outdoor lighting, and home electrical improvements.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="border-t border-slate-200 py-16 sm:py-20">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 lg:grid-cols-[1fr_1.1fr] lg:items-center">
          <Reveal className="order-2 text-center lg:order-1 lg:text-left">
            <p className="text-base leading-8 text-slate-600 sm:text-lg">
              We focus on safe, code-compliant work, clear communication, and long-lasting solutions. Your safety and satisfaction are always our priority.
            </p>
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

      <Footer />
      <BackToTop />
    </main>
  );
}
