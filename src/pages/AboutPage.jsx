import React from "react";
import {
  Sparkles,
  ArrowRight,
  Award,
  Zap,
  Shield,
  Heart,
  Target,
  Users,
} from "lucide-react";
import BackgroundBlobs from "../components/BackgroundBlobs";
import Counter from "../components/Counter";
import {
  BELIEFS,
  TEAM_MEMBERS,
  MILESTONES,
  BRANDS,
} from "../data/manasData";

const ICON_MAP = {
  Award,
  Zap,
  Shield,
  Heart,
  Target,
  Users,
};

export default function AboutPage({ navigate }) {
  return (
    <>
      {/* 1. HERO HEADER */}
      <section className="relative overflow-hidden pt-40 pb-20">
        <BackgroundBlobs />

        <div className="relative mx-auto max-w-4xl px-6 text-center">
          <div className="inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 text-xs uppercase tracking-[0.2em] text-accent font-semibold">
            <Sparkles className="h-3.5 w-3.5" />
            <span>About Manas</span>
          </div>

          <h1 className="mt-6 font-display text-5xl sm:text-6xl lg:text-7xl font-bold leading-[1.05]">
            Fifteen years of making brands{" "}
            <span className="text-gradient">impossible to ignore.</span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-base sm:text-lg text-muted-foreground leading-relaxed">
            Manas Advertising began in 2010 with a single flex printer and a
            stubborn belief: that great advertising is a craft, not a commodity.
            Today, we run one of India's most integrated brand-production
            houses — design, print, and install, all in-house.
          </p>
        </div>
      </section>

      {/* 2. STATS ROW */}
      <section className="relative pb-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid gap-6 rounded-3xl glass-strong p-8 sm:grid-cols-4 border border-white/10 shadow-lg">
            {[
              { n: 15, s: "+", l: "Years" },
              { n: 1200, s: "+", l: "Projects" },
              { n: 480, s: "+", l: "Clients" },
              { n: 40, s: "+", l: "Cities" },
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

      {/* 3. PRINCIPLES SECTION */}
      <section className="relative py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mx-auto max-w-2xl text-center">
            <div className="text-xs uppercase tracking-[0.25em] text-accent font-semibold">
              What we believe
            </div>
            <h2 className="mt-3 font-display text-4xl sm:text-5xl font-bold">
              Six principles. <span className="text-gradient">Zero exceptions.</span>
            </h2>
          </div>

          <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {BELIEFS.map((belief) => {
              const IconComp = ICON_MAP[belief.iconName] || Award;
              return (
                <div
                  key={belief.title}
                  className="rounded-2xl glass-strong p-7 transition-all duration-300 hover:-translate-y-1.5 border border-white/10 shadow-md"
                >
                  <div className="grid h-12 w-12 place-items-center rounded-xl bg-primary/90 text-primary-foreground shadow-md">
                    <IconComp className="h-5 w-5" />
                  </div>
                  <h3 className="mt-5 font-display text-xl font-semibold text-foreground">
                    {belief.title}
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                    {belief.text}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. STORY TIMELINE SECTION */}
      <section className="relative py-24">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mx-auto max-w-2xl text-center">
            <div className="text-xs uppercase tracking-[0.25em] text-accent font-semibold">
              Our story
            </div>
            <h2 className="mt-3 font-display text-4xl sm:text-5xl font-bold">
              Fifteen years, <span className="text-gradient">one thread.</span>
            </h2>
          </div>

          <div className="relative mt-16">
            {/* Center line */}
            <div className="pointer-events-none absolute left-4 top-0 h-full w-px bg-gradient-to-b from-transparent via-primary/40 to-transparent md:left-1/2 md:-translate-x-1/2" />

            <div className="space-y-10">
              {MILESTONES.map((item, idx) => {
                const isEven = idx % 2 === 0;
                return (
                  <div
                    key={item.year}
                    className={`relative flex flex-col gap-4 pl-12 md:flex-row md:items-center md:gap-8 md:pl-0 ${
                      isEven ? "md:flex-row" : "md:flex-row-reverse"
                    }`}
                  >
                    <div
                      className={`md:w-1/2 ${
                        isEven ? "md:pr-12 md:text-right" : "md:pl-12"
                      }`}
                    >
                      <div className="rounded-2xl glass-strong p-6 border border-white/10 shadow-lg transition-transform hover:scale-[1.01]">
                        <div className="text-sm font-semibold text-accent">
                          {item.year}
                        </div>
                        <h3 className="mt-1 font-display text-xl font-semibold text-foreground">
                          {item.title}
                        </h3>
                        <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                          {item.text}
                        </p>
                      </div>
                    </div>

                    {/* Timeline Node Ring */}
                    <div className="absolute left-4 top-6 -translate-x-1/2 md:left-1/2 md:top-1/2 md:-translate-y-1/2">
                      <div className="grid h-4 w-4 place-items-center rounded-full bg-primary ring-4 ring-background shadow-[0_0_12px_rgba(0,119,255,0.8)]" />
                    </div>

                    <div className="hidden md:block md:w-1/2" />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* 5. TEAM SHOWCASE SECTION */}
      <section className="relative py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mx-auto max-w-2xl text-center">
            <div className="text-xs uppercase tracking-[0.25em] text-accent font-semibold">
              The team
            </div>
            <h2 className="mt-3 font-display text-4xl sm:text-5xl font-bold">
              Small crew. <span className="text-gradient">Big output.</span>
            </h2>
            <p className="mt-4 text-muted-foreground text-sm sm:text-base">
              The people who own your project from brief to install.
            </p>
          </div>

          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {TEAM_MEMBERS.map((member) => (
              <div
                key={member.name}
                className="flex items-center gap-5 rounded-2xl glass-strong p-6 border border-white/10 shadow-md transition-transform hover:-translate-y-1"
              >
                <div
                  className="grid h-16 w-16 place-items-center rounded-2xl text-2xl font-bold text-white shadow-lg shrink-0"
                  style={{ background: "var(--gradient-primary)" }}
                >
                  {member.initial}
                </div>
                <div>
                  <div className="font-display text-lg font-semibold text-foreground">
                    {member.name}
                  </div>
                  <div className="text-xs uppercase tracking-widest text-muted-foreground mt-0.5">
                    {member.role}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. TRUSTED BRANDS LOGO GRID */}
      <section className="relative py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center">
            <div className="text-xs uppercase tracking-[0.25em] text-accent font-semibold">
              Trusted by
            </div>
            <h2 className="mt-3 font-display text-4xl sm:text-5xl font-bold">
              Brands that returned.
            </h2>
          </div>

          <div className="mt-12 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
            {BRANDS.map((brand) => (
              <div
                key={brand}
                className="grid h-20 place-items-center rounded-xl glass text-xs font-bold tracking-[0.2em] text-muted-foreground transition hover:text-foreground hover:scale-105 border border-white/5"
              >
                {brand}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. STUDIO CALL CTA */}
      <section className="relative py-24">
        <div className="mx-auto max-w-6xl px-6">
          <div className="rounded-[2rem] glass-strong p-10 text-center sm:p-16 border border-white/10 shadow-2xl">
            <h2 className="font-display text-4xl sm:text-5xl font-bold text-foreground">
              Want to see what we can do?
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-muted-foreground text-sm sm:text-base">
              Book a 20-minute studio call. Bring a brief, or just an idea.
            </p>
            <button
              type="button"
              onClick={() => navigate("/contact")}
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-primary px-7 py-4 text-sm font-semibold text-primary-foreground transition-all duration-300 hover:scale-[1.03] hover:bg-primary/90 shadow-lg shadow-blue-500/25"
            >
              <span>Talk to Manas</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </section>
    </>
  );
}
