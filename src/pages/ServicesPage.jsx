import React, { useState, useEffect } from "react";
import {
  Sparkles,
  ArrowRight,
  Check,
  Truck,
  Tent,
  Umbrella,
  Printer,
  Palette,
  Store,
  Package,
  Eye,
} from "lucide-react";
import BackgroundBlobs from "../components/BackgroundBlobs";
import { SERVICES } from "../data/manasData";

const ICON_MAP = {
  Truck,
  Tent,
  Umbrella,
  Printer,
  Palette,
  Store,
  Package,
};

function ServiceArticle({ service, index, navigate }) {
  const [activeImg, setActiveImg] = useState(service.img);
  const IconComp = ICON_MAP[service.iconName] || Truck;
  const isReversed = index % 2 === 1;
  const serviceNumber = String(index + 1).padStart(2, "0");

  const angleLabels = service.galleryLabels || [
    "Angle 1",
    "Angle 2",
    "Angle 3",
    "Angle 4",
  ];

  return (
    <article
      id={service.slug}
      className={`grid gap-12 lg:grid-cols-2 lg:items-center ${
        isReversed ? "lg:[&>*:first-child]:order-2" : ""
      } scroll-mt-28`}
    >
      {/* Visual Image Card & Gallery */}
      <div className="flex flex-col gap-3">
        <div className="relative overflow-hidden rounded-3xl glass-strong p-3.5 border border-white/10 shadow-xl group">
          <img
            src={activeImg}
            alt={service.title}
            loading="lazy"
            className="h-[420px] w-full rounded-2xl object-cover transition-all duration-500 group-hover:scale-105"
          />

          <div className="absolute left-6 top-6 grid h-12 w-12 place-items-center rounded-xl bg-primary text-primary-foreground shadow-lg backdrop-blur">
            <IconComp className="h-5 w-5" />
          </div>

          {service.gallery && service.gallery.length > 1 && (
            <div className="absolute bottom-6 left-6 inline-flex items-center gap-1.5 rounded-full bg-black/75 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur shadow-md">
              <Eye className="h-3.5 w-3.5 text-accent" />
              <span>Real Work Project · Click photos to view angles</span>
            </div>
          )}
        </div>

        {/* Thumbnail Selector if gallery exists */}
        {service.gallery && service.gallery.length > 1 && (
          <div className="grid grid-cols-4 gap-2 pt-1">
            {service.gallery.map((gImg, gIdx) => (
              <button
                key={gIdx}
                type="button"
                onClick={() => setActiveImg(gImg)}
                className={`group relative h-20 overflow-hidden rounded-xl border-2 transition-all duration-200 cursor-pointer ${
                  activeImg === gImg
                    ? "border-primary ring-2 ring-primary/40 scale-[1.03]"
                    : "border-white/10 opacity-70 hover:opacity-100 hover:border-white/30"
                }`}
                title={angleLabels[gIdx] || `View ${gIdx + 1}`}
              >
                <img
                  src={gImg}
                  alt={angleLabels[gIdx] || `Angle ${gIdx + 1}`}
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-x-0 bottom-0 bg-black/70 px-1 py-0.5 text-[9px] text-white text-center font-medium truncate">
                  {angleLabels[gIdx] || `Angle ${gIdx + 1}`}
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Details Column */}
      <div>
        <div className="text-xs uppercase tracking-[0.25em] text-accent font-semibold">
          {serviceNumber} / Service
        </div>

        <h2 className="mt-3 font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground">
          {service.title}
        </h2>

        <p className="mt-3 text-lg font-medium text-accent/90">
          {service.tagline}
        </p>

        <p className="mt-4 text-muted-foreground leading-relaxed text-sm sm:text-base">
          {service.desc}
        </p>

        {/* Included & Deliverables Grid */}
        <div className="mt-8 grid gap-6 sm:grid-cols-2">
          {/* What's included */}
          <div>
            <div className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">
              What's included
            </div>
            <ul className="mt-3 space-y-2 text-sm">
              {service.features.map((feature) => (
                <li key={feature} className="flex items-start gap-2">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                  <span className="text-foreground/90 font-medium">
                    {feature}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Deliverables */}
          <div>
            <div className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">
              Deliverables
            </div>
            <ul className="mt-3 space-y-2 text-sm">
              {service.deliverables.map((deliv) => (
                <li key={deliv} className="flex items-start gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                  <span className="text-muted-foreground font-medium">
                    {deliv}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Request Quote Button */}
        <button
          type="button"
          onClick={() => navigate(`/contact?service=${service.slug}`)}
          className="mt-8 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-all duration-300 hover:scale-[1.03] hover:bg-primary/90 shadow-md shadow-blue-500/20 cursor-pointer"
        >
          <span>Request a quote for {service.title}</span>
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </article>
  );
}

export default function ServicesPage({ navigate, hash }) {
  useEffect(() => {
    if (hash) {
      const element = document.getElementById(hash.replace("#", ""));
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [hash]);

  return (
    <>
      {/* Services Hero Header */}
      <section className="relative overflow-hidden pt-40 pb-20">
        <BackgroundBlobs />

        <div className="relative mx-auto max-w-6xl px-6 text-center">
          <div className="inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 text-xs uppercase tracking-[0.2em] text-accent font-semibold">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Services</span>
          </div>

          <h1 className="mt-6 font-display text-5xl sm:text-6xl lg:text-7xl font-bold leading-tight">
            What we <span className="text-gradient">produce.</span>
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-muted-foreground text-base sm:text-lg leading-relaxed">
            Eight interconnected disciplines under one roof. From the first
            sketch to the final install — we own the whole chain so the quality
            never breaks.
          </p>
        </div>
      </section>

      {/* Services List Section */}
      <section className="relative pb-32">
        <div className="mx-auto max-w-7xl space-y-28 px-6">
          {SERVICES.map((service, index) => (
            <ServiceArticle
              key={service.slug}
              service={service}
              index={index}
              navigate={navigate}
            />
          ))}
        </div>
      </section>
    </>
  );
}
