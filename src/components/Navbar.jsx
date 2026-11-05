import React, { useState } from "react";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { BRAND_ASSETS } from "../data/manasData";

export default function Navbar({ currentPath, navigate }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: "Home", path: "/" },
    { label: "Services", path: "/services" },
    { label: "Portfolio", path: "/portfolio" },
    { label: "About", path: "/about" },
    { label: "Contact", path: "/contact" },
  ];

  const handleNavClick = (path) => {
    navigate(path);
    setMobileMenuOpen(false);
  };

  return (
    <header className="fixed top-4 left-1/2 z-50 w-[calc(100%-2rem)] max-w-6xl -translate-x-1/2">
      <div className="flex items-center justify-between rounded-full glass-strong px-5 py-3 shadow-lg">
        {/* Brand Logo & Name */}
        <button
          type="button"
          onClick={() => handleNavClick("/")}
          className="flex items-center gap-2 transition hover:opacity-85 focus:outline-none"
        >
          <img
            src={BRAND_ASSETS.logo}
            alt="Manas Advertising logo"
            className="h-9 w-auto object-contain"
          />
          <span className="font-display text-sm font-bold tracking-widest text-foreground">
            MANAS
          </span>
        </button>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-7 text-sm md:flex">
          {navLinks.map((link) => {
            const isActive = currentPath === link.path;
            return (
              <button
                key={link.path}
                type="button"
                onClick={() => handleNavClick(link.path)}
                className={`transition-colors font-medium ${
                  isActive
                    ? "text-foreground font-semibold"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {link.label}
              </button>
            );
          })}
        </nav>

        {/* Action Button & Mobile Menu Toggle */}
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => handleNavClick("/contact")}
            className="inline-flex items-center gap-1.5 rounded-full bg-primary px-3.5 py-1.5 text-xs font-semibold text-primary-foreground transition-transform hover:scale-105 hover:bg-primary/90 shadow-md"
          >
            <span>Get Quote</span>
            <ArrowUpRight className="h-3.5 w-3.5" />
          </button>

          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="grid h-8 w-8 place-items-center rounded-full glass text-foreground md:hidden"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="mt-2 rounded-2xl glass-strong p-4 shadow-xl md:hidden">
          <nav className="flex flex-col gap-2">
            {navLinks.map((link) => {
              const isActive = currentPath === link.path;
              return (
                <button
                  key={link.path}
                  type="button"
                  onClick={() => handleNavClick(link.path)}
                  className={`rounded-xl px-4 py-2.5 text-left text-sm font-medium transition ${
                    isActive
                      ? "bg-primary/20 text-foreground font-semibold"
                      : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
                  }`}
                >
                  {link.label}
                </button>
              );
            })}
          </nav>
        </div>
      )}
    </header>
  );
}
