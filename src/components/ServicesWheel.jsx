import React, { useState } from "react";
import { Truck, Printer, Store, Palette, Umbrella, Tent } from "lucide-react";
import { BRAND_ASSETS } from "../data/manasData";

const WHEEL_ITEMS = [
  { icon: Truck, label: "Van Advertising", desc: "Turn every road into your marketing space." },
  { icon: Printer, label: "Flex Printing", desc: "High-quality flex for banners & hoardings." },
  { icon: Store, label: "In-Shop Branding", desc: "Complete interior branding solutions." },
  { icon: Palette, label: "Offset Printing", desc: "Business cards, brochures, stationery." },
  { icon: Umbrella, label: "Umbrella Advertising", desc: "Printed promotional umbrellas." },
  { icon: Tent, label: "Canopy Advertising", desc: "Custom canopies for events & outdoor." },
];

export default function ServicesWheel() {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <div className="relative mx-auto flex h-[560px] w-full max-w-[560px] items-center justify-center sm:h-[620px] sm:max-w-[620px]">
      {/* Decorative concentric orbits */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div className="absolute h-[460px] w-[460px] rounded-full border border-primary/20 sm:h-[520px] sm:w-[520px]" />
        <div
          className="absolute h-[360px] w-[360px] rounded-full border border-primary/10 animate-spin-slow sm:h-[400px] sm:w-[400px]"
          style={{ borderStyle: "dashed" }}
        />
        <div className="absolute h-[240px] w-[240px] rounded-full bg-primary/10 blur-3xl" />
      </div>

      {/* Center hub */}
      <div className="relative z-20 flex h-40 w-40 flex-col items-center justify-center rounded-full glass-strong glow transition-transform duration-500 hover:scale-105">
        <img
          src={BRAND_ASSETS.logo}
          alt="Manas Advertising logo"
          className="h-16 w-auto drop-shadow-md"
        />
        <span className="mt-1 text-[9px] uppercase tracking-widest text-muted-foreground font-semibold">
          Est. 2010
        </span>
        <span className="absolute inset-0 rounded-full border border-primary/40 animate-pulse-ring pointer-events-none" />
      </div>

      {/* Orbiting Service Buttons */}
      {WHEEL_ITEMS.map((item, idx) => {
        const angle = (idx / WHEEL_ITEMS.length) * Math.PI * 2 - Math.PI / 2;
        // Radius is 220px
        const x = Math.cos(angle) * 220;
        const y = Math.sin(angle) * 220;
        const IconComponent = item.icon;
        const isActive = activeIndex === idx;

        return (
          <button
            key={item.label}
            type="button"
            onMouseEnter={() => setActiveIndex(idx)}
            onClick={() => setActiveIndex(idx)}
            className="group absolute z-10 flex flex-col items-center gap-2 text-center transition-transform duration-300 hover:scale-110 focus:outline-none"
            style={{
              transform: `translate(${x}px, ${y}px)`,
            }}
          >
            <span
              className={`flex h-16 w-16 items-center justify-center rounded-2xl transition-all duration-300 ${
                isActive
                  ? "bg-primary text-primary-foreground scale-110 shadow-[0_0_40px_rgba(79,70,229,0.7)] ring-2 ring-primary"
                  : "glass text-muted-foreground hover:text-foreground hover:scale-105"
              }`}
            >
              <IconComponent className="h-7 w-7 transition-transform group-hover:scale-110" />
            </span>
            <span
              className={`max-w-[90px] text-[11px] font-medium leading-tight transition-colors ${
                isActive ? "text-foreground font-semibold" : "text-muted-foreground"
              }`}
            >
              {item.label}
            </span>
          </button>
        );
      })}

      {/* Bottom active detail card */}
      <div className="absolute -bottom-4 left-1/2 z-30 w-[280px] -translate-x-1/2 rounded-2xl glass-strong p-4 text-center transition-all duration-300 shadow-xl border border-white/10">
        <div className="text-sm font-semibold text-foreground">
          {WHEEL_ITEMS[activeIndex].label}
        </div>
        <div className="mt-1 text-xs text-muted-foreground">
          {WHEEL_ITEMS[activeIndex].desc}
        </div>
      </div>
    </div>
  );
}
