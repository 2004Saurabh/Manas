import React from "react";

export default function BackgroundBlobs() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* Dynamic colorful glowing blurs */}
      <div className="absolute -top-40 -left-40 h-[600px] w-[600px] rounded-full bg-primary/30 blur-[140px] animate-float-slow" />
      <div className="absolute top-1/3 -right-40 h-[520px] w-[520px] rounded-full bg-accent/25 blur-[140px] animate-float-slower" />
      <div className="absolute bottom-0 left-1/3 h-[420px] w-[420px] rounded-full bg-primary/20 blur-[120px] animate-float-slow" />
      
      {/* Subtle grid pattern overlay */}
      <div
        className="absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            "linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)",
          backgroundSize: "80px 80px",
          maskImage: "radial-gradient(ellipse at center, black 40%, transparent 80%)",
          WebkitMaskImage: "radial-gradient(ellipse at center, black 40%, transparent 80%)",
        }}
      />
    </div>
  );
}
