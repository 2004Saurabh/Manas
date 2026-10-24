import React, { useState } from "react";
import { Sparkles, ArrowRight, ArrowUpRight } from "lucide-react";
import BackgroundBlobs from "../components/BackgroundBlobs";
import { PORTFOLIO_PROJECTS } from "../data/manasData";

export default function PortfolioPage({ navigate }) {
  const [activeCategory, setActiveCategory] = useState("All");

  const categories = [
    "All",
    ...Array.from(new Set(PORTFOLIO_PROJECTS.map((p) => p.category))),
  ];

  const filteredProjects =
    activeCategory === "All"
      ? PORTFOLIO_PROJECTS
      : PORTFOLIO_PROJECTS.filter((p) => p.category === activeCategory);

  return (
    <>
      {/* Portfolio Hero Header */}
      <section className="relative overflow-hidden pt-40 pb-16">
        <BackgroundBlobs />

        <div className="relative mx-auto max-w-6xl px-6 text-center">
          <div className="inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 text-xs uppercase tracking-[0.2em] text-accent font-semibold">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Selected Work</span>
          </div>

          <h1 className="mt-6 font-display text-5xl sm:text-6xl lg:text-7xl font-bold">
            Work that <span className="text-gradient">gets noticed.</span>
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-muted-foreground text-base sm:text-lg">
            A short cut of recent projects across fleet, retail and outdoor.
            Every piece designed, produced and installed by Manas teams.
          </p>
        </div>
      </section>

      {/* Portfolio Gallery Section */}
      <section className="relative pb-32">
        <div className="mx-auto max-w-7xl px-6">
          {/* Category Filter Pills */}
          <div className="mb-10 flex flex-wrap justify-center gap-2">
            {categories.map((cat) => {
              const isActive = activeCategory === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setActiveCategory(cat)}
                  className={`rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-widest transition-all duration-300 ${
                    isActive
                      ? "bg-primary text-primary-foreground shadow-md shadow-blue-500/25 scale-105"
                      : "glass text-muted-foreground hover:text-foreground hover:bg-white/10"
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>

          {/* Dynamic Masonry Gallery Grid */}
          <div className="grid auto-rows-[260px] grid-cols-2 gap-4 sm:grid-cols-4">
            {filteredProjects.map((project) => {
              const spanClass =
                activeCategory === "All"
                  ? project.span
                  : "col-span-2 row-span-2";

              return (
                <figure
                  key={project.title}
                  className={`group relative overflow-hidden rounded-2xl border border-white/10 ${spanClass} shadow-lg`}
                >
                  {/* Photo */}
                  <img
                    src={project.img}
                    alt={project.title}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />

                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/40 to-transparent" />

                  {/* Figcaption Info */}
                  <figcaption className="absolute inset-x-0 bottom-0 p-5">
                    <div className="flex items-end justify-between gap-3">
                      <div>
                        <div className="text-[10px] uppercase tracking-widest text-accent font-semibold">
                          {project.category} · {project.year}
                        </div>
                        <div className="mt-1 font-display text-lg font-semibold leading-tight text-white">
                          {project.title}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {project.client}
                        </div>
                      </div>

                      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-primary text-primary-foreground opacity-0 transition-opacity duration-300 group-hover:opacity-100 shadow-md">
                        <ArrowUpRight className="h-4 w-4" />
                      </span>
                    </div>
                  </figcaption>
                </figure>
              );
            })}
          </div>

          {/* Bottom Call to Action Card */}
          <div className="mt-20 rounded-3xl glass-strong p-10 text-center border border-white/10 shadow-2xl">
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-foreground">
              Have a project in mind?
            </h2>
            <p className="mx-auto mt-3 max-w-lg text-sm sm:text-base text-muted-foreground">
              We take on new work every month. Send us your brief and we'll
              respond within 24 hours.
            </p>
            <button
              type="button"
              onClick={() => navigate("/contact")}
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-all duration-300 hover:scale-[1.03] hover:bg-primary/90 shadow-lg shadow-blue-500/25"
            >
              <span>Start a project</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </section>
    </>
  );
}
