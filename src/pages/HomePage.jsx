import React from "react";
import {
  ArrowRight,
  Check,
  Phone,
  Sparkles,
  Star,
  Award,
  Truck,
  Tent,
  Umbrella,
  Printer,
  Palette,
  Store,
  Package,
} from "lucide-react";
import Counter from "../components/Counter";
import ServicesWheel from "../components/ServicesWheel";
import {
  BRAND_ASSETS,
  SERVICES,
  TESTIMONIALS,
  BRANDS,
  CONTACT_INFO,
} from "../data/manasData";

// Icon mapping helper
const ICON_MAP = {
  Truck,
  Tent,
  Umbrella,
  Printer,
  Palette,
  Store,
  Package,
};

export default function HomePage({ navigate }) {
  return (
    <>
      {/* 1. HERO SECTION */}
      <section className="relative flex min-h-screen items-center overflow-hidden">
        {/* Background Image & Overlay */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${BRAND_ASSETS.heroBg})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/60 to-black/35 backdrop-blur-[0.5px]" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#090a0f] via-transparent to-black/30" />

        {/* Hero Ambient Glow */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 overflow-hidden"
        >
          <div className="absolute -top-32 -left-32 h-[500px] w-[500px] rounded-full bg-primary/25 blur-[120px]" />
          <div className="absolute top-1/2 -right-32 h-[500px] w-[500px] rounded-full bg-accent/20 blur-[130px]" />
        </div>

        {/* Content Container */}
        <div className="relative z-10 mx-auto w-full max-w-7xl px-6 pt-36 pb-28 lg:pt-44 lg:pb-36">
          <div className="max-w-3xl">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold text-white backdrop-blur-md shadow-sm">
              <Sparkles className="h-3.5 w-3.5 text-[#00aaff]" />
              <span>Creative Advertising & Branding Since 2010</span>
            </div>

            {/* Main Headline */}
            <h1 className="mt-6 font-display text-[clamp(2.5rem,6vw,5.2rem)] font-bold leading-[1.08] tracking-tight text-white">
              Building Brands Through{" "}
              <span className="text-gradient">Creative Advertising</span>
            </h1>

            {/* Description */}
            <p className="mt-6 text-lg text-gray-300 md:text-xl leading-relaxed max-w-2xl">
              Manas Advertising delivers creative advertising, printing, vehicle
              branding, promotional, and outdoor branding solutions that help
              businesses stand out and connect with the right audience.
            </p>

            {/* Actions */}
            <div className="mt-10 flex flex-wrap items-center gap-4">
              <button
                type="button"
                onClick={() => navigate("/contact")}
                className="group inline-flex items-center gap-2 rounded-full bg-[#0077ff] px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-500/25 transition hover:bg-blue-600 hover:scale-[1.02]"
              >
                <span>Consult With Us</span>
                <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
              </button>

              <button
                type="button"
                onClick={() => navigate("/portfolio")}
                className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-6 py-3.5 text-sm font-semibold text-white backdrop-blur-md transition hover:bg-white/15"
              >
                View Our Work
              </button>

              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/40 px-5 py-3.5 text-sm font-semibold text-white backdrop-blur-md">
                <Award className="h-4 w-4 text-[#00aaff]" />
                <span>15+ Years Excellence</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Marquee Strip */}
        <div className="absolute bottom-0 left-0 right-0 border-y border-white/10 bg-black/30 backdrop-blur-md py-4">
          <div className="flex overflow-hidden">
            <div className="animate-marquee flex shrink-0 gap-14 pr-14 whitespace-nowrap text-xs sm:text-sm uppercase tracking-[0.3em] text-muted-foreground font-semibold">
              {[0, 1].map((setIndex) => (
                <div key={setIndex} className="flex gap-14">
                  {BRANDS.map((brand) => (
                    <span key={`${setIndex}-${brand}`} className="flex items-center gap-14">
                      <span>{brand}</span>
                      <span className="text-accent">◆</span>
                    </span>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 2. SERVICES OVERVIEW SECTION */}
      <section className="relative py-32">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mx-auto max-w-2xl text-center">
            <div className="inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 text-xs uppercase tracking-[0.2em] text-accent font-semibold">
              Our Services
            </div>
            <h2 className="mt-5 font-display text-4xl sm:text-5xl lg:text-6xl font-bold">
              Every surface. <span className="text-gradient">Every city.</span>
            </h2>
            <p className="mt-4 text-muted-foreground text-base sm:text-lg">
              Eight disciplines. One relentless standard. We handle the concept,
              the print, and the install — end to end.
            </p>
          </div>

          <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {SERVICES.map((service) => {
              const IconComp = ICON_MAP[service.iconName] || Truck;
              return (
                <article
                  key={service.slug}
                  className="group relative overflow-hidden rounded-3xl glass-strong transition-all duration-500 hover:-translate-y-1.5 hover:shadow-[0_20px_50px_rgba(0,119,255,0.25)] border border-white/10"
                >
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <img
                      src={service.img}
                      alt={service.title}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-card via-card/40 to-transparent" />
                    <div className="absolute left-5 top-5 grid h-11 w-11 place-items-center rounded-xl bg-primary/90 text-primary-foreground backdrop-blur shadow-md">
                      <IconComp className="h-5 w-5" />
                    </div>
                  </div>

                  <div className="p-6">
                    <h3 className="font-display text-xl font-semibold text-foreground">
                      {service.title}
                    </h3>
                    <p className="mt-2 text-sm text-muted-foreground leading-relaxed line-clamp-2">
                      {service.tagline}
                    </p>
                    <button
                      type="button"
                      onClick={() => navigate(`/services#${service.slug}`)}
                      className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-accent transition group-hover:gap-2.5"
                    >
                      <span>Learn more</span>
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* 3. THE MANAS METHOD SECTION */}
      <section className="relative overflow-hidden py-32">
        <div className="absolute inset-0 opacity-60 pointer-events-none">
          <div className="absolute left-1/2 top-1/2 h-[700px] w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/10 blur-3xl" />
        </div>

        <div className="relative mx-auto grid max-w-7xl gap-16 px-6 lg:grid-cols-2 lg:items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 text-xs uppercase tracking-[0.2em] text-accent font-semibold">
              The Manas Method
            </div>
            <h2 className="mt-5 font-display text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">
              A single loop <br /> that{" "}
              <span className="text-gradient">never breaks.</span>
            </h2>
            <p className="mt-5 max-w-lg text-muted-foreground text-base sm:text-lg leading-relaxed">
              From the first sketch to the final install, every service connects.
              That's how we deliver campaigns that feel written by one hand —
              because they are.
            </p>

            <ul className="mt-8 space-y-3">
              {[
                "In-house creative, print and install teams",
                "Colour-accurate, weatherproof materials",
                "Nationwide install network",
                "One dedicated brand manager per project",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm">
                  <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-primary/20 text-accent">
                    <Check className="h-3 w-3" />
                  </span>
                  <span className="text-muted-foreground font-medium">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <ServicesWheel />
          </div>
        </div>
      </section>

      {/* 4. STATS METRICS ROW */}
      <section className="relative py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid gap-6 rounded-3xl glass-strong p-8 sm:grid-cols-2 lg:grid-cols-5 border border-white/10 shadow-lg">
            {[
              { n: 1200, s: "+", l: "Projects Completed" },
              { n: 480, s: "+", l: "Happy Clients" },
              { n: 15, s: "+", l: "Years Experience" },
              { n: 40, s: "+", l: "Cities Served" },
              { n: 2, s: "M sq/ft", l: "Print Capacity" },
            ].map((stat) => (
              <div key={stat.l} className="text-center">
                <div className="font-display text-4xl sm:text-5xl font-bold text-gradient">
                  <Counter to={stat.n} suffix={stat.s} />
                </div>
                <div className="mt-2 text-xs uppercase tracking-widest text-muted-foreground font-medium">
                  {stat.l}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. CLIENT TESTIMONIALS */}
      <section className="relative py-32">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mx-auto max-w-2xl text-center">
            <div className="inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 text-xs uppercase tracking-[0.2em] text-accent font-semibold">
              Client Voices
            </div>
            <h2 className="mt-5 font-display text-4xl sm:text-5xl lg:text-6xl font-bold">
              Trusted by <span className="text-gradient">brands that grow.</span>
            </h2>
          </div>

          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {TESTIMONIALS.slice(0, 3).map((item) => (
              <blockquote
                key={item.name}
                className="rounded-3xl glass-strong p-7 border border-white/10 transition-transform duration-300 hover:-translate-y-1 shadow-md flex flex-col justify-between"
              >
                <div>
                  <div className="flex gap-1 text-accent">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-current" />
                    ))}
                  </div>
                  <p className="mt-5 text-base leading-relaxed text-foreground/90 italic">
                    "{item.text}"
                  </p>
                </div>

                <footer className="mt-6 flex items-center gap-3 pt-4 border-t border-white/5">
                  <div className="grid h-10 w-10 place-items-center rounded-full bg-primary/20 font-semibold text-accent">
                    {item.name[0]}
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-foreground">
                      {item.name}
                    </div>
                    <div className="text-xs text-muted-foreground">{item.role}</div>
                  </div>
                </footer>
              </blockquote>
            ))}
          </div>
        </div>
      </section>

      {/* 6. CALL TO ACTION BANNER */}
      <section className="relative py-24">
        <div className="mx-auto max-w-6xl px-6">
          <div
            className="relative overflow-hidden rounded-[2rem] p-12 sm:p-20 text-center border border-white/10 shadow-2xl"
            style={{ background: "var(--gradient-hero)" }}
          >
            <div
              className="absolute inset-0 opacity-30 pointer-events-none"
              style={{ background: "var(--gradient-primary)" }}
            />
            <div className="relative">
              <h2 className="mx-auto max-w-3xl font-display text-4xl sm:text-6xl lg:text-7xl font-bold leading-tight text-white">
                Let's build your <span className="text-gradient">brand.</span>
              </h2>
              <p className="mx-auto mt-5 max-w-xl text-muted-foreground text-base sm:text-lg">
                Free consultation. Quote within 24 hours. National install
                network ready.
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-4">
                <button
                  type="button"
                  onClick={() => navigate("/contact")}
                  className="inline-flex items-center gap-2 rounded-full bg-primary px-7 py-4 text-sm font-semibold text-primary-foreground shadow-lg shadow-blue-500/30 transition hover:scale-[1.03] hover:bg-primary/90"
                >
                  <span>Request a Free Quote</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
                <a
                  href={`tel:${CONTACT_INFO.phoneRaw}`}
                  className="inline-flex items-center gap-2 rounded-full glass-strong px-7 py-4 text-sm font-semibold text-foreground transition hover:bg-white/15"
                >
                  <Phone className="h-4 w-4" />
                  <span>{CONTACT_INFO.phone}</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
