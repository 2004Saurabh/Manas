import React from "react";
import { BRAND_ASSETS, CONTACT_INFO } from "../data/manasData";

export default function Footer({ navigate }) {
  const currentYear = new Date().getFullYear();

  const servicesLinks = [
    { label: "Van Advertising", slug: "van-advertising" },
    { label: "Canopy Advertising", slug: "canopy-advertising" },
    { label: "Outdoor Umbrella", slug: "umbrella-advertising" },
    { label: "Flex Printing", slug: "flex-printing" },
    { label: "Vinyl Printing", slug: "vinyl-printing" },
    { label: "In-Shop Branding", slug: "in-shop-branding" },
    { label: "Offset Printing", slug: "offset-printing" },
  ];

  return (
    <footer className="border-t border-white/5 py-14">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 md:grid-cols-4">
        {/* Brand Info */}
        <div>
          <button
            type="button"
            onClick={() => navigate("/")}
            className="flex items-center gap-2 text-left focus:outline-none"
          >
            <img
              src={BRAND_ASSETS.logo}
              alt="Manas Advertising logo"
              className="h-12 w-auto"
            />
            <span className="font-display text-lg font-bold tracking-widest text-foreground">
              MANAS
            </span>
          </button>
          <p className="mt-4 max-w-xs text-sm text-muted-foreground leading-relaxed">
            Your Brand Everywhere. Premium advertising, printing and branding since 2010.
          </p>
          <div className="mt-3">
            <a
              href={CONTACT_INFO.mapUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-start gap-1.5 text-xs text-accent hover:underline font-medium leading-relaxed max-w-xs"
            >
              <span className="shrink-0 mt-0.5">📍</span>
              <span>{CONTACT_INFO.address}</span>
            </a>
          </div>
        </div>

        {/* Services Navigation */}
        <div>
          <div className="text-xs uppercase tracking-widest text-muted-foreground font-semibold">
            Services
          </div>
          <ul className="mt-4 space-y-2 text-sm">
            {servicesLinks.map((service) => (
              <li key={service.slug}>
                <button
                  type="button"
                  onClick={() => navigate(`/services#${service.slug}`)}
                  className="text-foreground/80 transition hover:text-foreground text-left"
                >
                  {service.label}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Company Navigation */}
        <div>
          <div className="text-xs uppercase tracking-widest text-muted-foreground font-semibold">
            Company
          </div>
          <ul className="mt-4 space-y-2 text-sm">
            <li>
              <button
                type="button"
                onClick={() => navigate("/about")}
                className="text-foreground/80 transition hover:text-foreground"
              >
                About
              </button>
            </li>
            <li>
              <button
                type="button"
                onClick={() => navigate("/portfolio")}
                className="text-foreground/80 transition hover:text-foreground"
              >
                Portfolio
              </button>
            </li>
            <li>
              <button
                type="button"
                onClick={() => navigate("/services")}
                className="text-foreground/80 transition hover:text-foreground"
              >
                Services
              </button>
            </li>
            <li>
              <button
                type="button"
                onClick={() => navigate("/contact")}
                className="text-foreground/80 transition hover:text-foreground"
              >
                Contact
              </button>
            </li>
            <li>
              <button
                type="button"
                onClick={() => navigate("/portal")}
                className="text-accent font-semibold transition hover:underline"
              >
                Staff & Field CRM Portal
              </button>
            </li>
          </ul>
        </div>

        {/* Social Links */}
        <div>
          <div className="text-xs uppercase tracking-widest text-muted-foreground font-semibold">
            Follow
          </div>
          <ul className="mt-4 space-y-2 text-sm">
            <li>
              <a
                href={CONTACT_INFO.socials.instagram}
                target="_blank"
                rel="noreferrer"
                className="text-foreground/80 transition hover:text-foreground"
              >
                Instagram
              </a>
            </li>
            <li>
              <a
                href={CONTACT_INFO.socials.linkedin}
                target="_blank"
                rel="noreferrer"
                className="text-foreground/80 transition hover:text-foreground"
              >
                LinkedIn
              </a>
            </li>
            <li>
              <a
                href={CONTACT_INFO.socials.behance}
                target="_blank"
                rel="noreferrer"
                className="text-foreground/80 transition hover:text-foreground"
              >
                Behance
              </a>
            </li>
            <li>
              <a
                href={CONTACT_INFO.socials.facebook}
                target="_blank"
                rel="noreferrer"
                className="text-foreground/80 transition hover:text-foreground"
              >
                Facebook
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="mx-auto mt-12 flex max-w-7xl flex-wrap items-center justify-between gap-4 px-6 text-xs text-muted-foreground">
        <div>© {currentYear} Manas Advertising. All rights reserved.</div>
        <div>Crafted with obsession in India.</div>
      </div>
    </footer>
  );
}
