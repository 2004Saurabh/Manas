import React from "react";
import {
  Sprout,
  Globe,
  FlaskConical,
  Crown,
  Shield,
  Dna,
  Leaf,
  ShieldCheck,
  Sun,
  Sparkles,
  CheckCircle2,
} from "lucide-react";

const ICON_MAP = {
  sprout: Sprout,
  globe: Globe,
  flask: FlaskConical,
  gem: Crown,
  shield: Shield,
  dna: Dna,
  leaf: Leaf,
  "shield-check": ShieldCheck,
  sun: Sun,
  sparkle: Sparkles,
  seed: Sprout,
};

export default function ClientLogoCard({ client }) {
  const IconComponent = ICON_MAP[client.iconType] || Sparkles;

  return (
    <div
      className={`group relative overflow-hidden rounded-2xl glass-strong border border-white/10 p-5 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl ${client.borderHover} flex flex-col justify-between`}
      style={{
        background: `radial-gradient(120% 120% at 0% 0%, ${client.glowColor} 0%, rgba(18, 20, 36, 0.85) 100%)`,
      }}
    >
      <div>
        {/* Top Badges Row */}
        <div className="flex items-center justify-between gap-2 mb-3.5">
          <div
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl shadow-md transition-transform duration-300 group-hover:scale-110"
            style={{
              backgroundColor: `${client.accentColor}20`,
              color: client.accentColor,
              border: `1px solid ${client.accentColor}40`,
            }}
          >
            <IconComponent className="h-5 w-5" />
          </div>

          <span
            className="rounded-full px-2.5 py-0.5 text-[10px] font-bold tracking-widest uppercase border"
            style={{
              backgroundColor: `${client.accentColor}15`,
              color: client.accentColor,
              borderColor: `${client.accentColor}30`,
            }}
          >
            {client.ticker}
          </span>
        </div>

        {/* Company Title */}
        <h4 className="font-display text-base font-bold text-foreground leading-snug group-hover:text-white transition">
          {client.name}
        </h4>

        {/* Tagline / Subtitle */}
        <p className="mt-1 text-xs text-muted-foreground font-medium line-clamp-1">
          {client.tagline}
        </p>

        {/* Sector Tag */}
        <div className="mt-2.5 flex items-center gap-1.5 text-[11px] font-semibold text-accent">
          <CheckCircle2 className="h-3 w-3 shrink-0" />
          <span>{client.category}</span>
        </div>
      </div>

      {/* Production Deliverables footer */}
      <div className="mt-4 pt-3 border-t border-white/5 text-[10px] text-muted-foreground">
        <span className="text-white/40 uppercase tracking-wider block font-semibold mb-0.5">
          Assets Produced:
        </span>
        <span className="text-white/80 font-medium line-clamp-1">
          {client.deliverables}
        </span>
      </div>
    </div>
  );
}
