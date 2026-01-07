const HERO_VIDEO_URL = "/videos/hero.mp4";

export default function Hero() {
  return (
    <section id="home" className="relative scroll-mt-24">
      <div className="relative h-[78vh] min-h-[560px] w-full bg-brand-navy overflow-hidden">
        <video
          className="absolute inset-0 h-full w-full object-cover opacity-40"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          aria-hidden="true"
        >
          <source src={HERO_VIDEO_URL} type="video/mp4" />
        </video>
      </div>
    </section>
  );
}
