import React, { useState, useEffect } from "react";
import {
  Sparkles,
  Phone,
  MessageCircle,
  Mail,
  MapPin,
  Clock,
  ArrowRight,
  CheckCircle2,
  Navigation,
  ExternalLink,
} from "lucide-react";
import BackgroundBlobs from "../components/BackgroundBlobs";
import WhatsAppIcon from "../components/WhatsAppIcon";
import { SERVICES, FAQS, CONTACT_INFO } from "../data/manasData";

export default function ContactPage({ preselectedService }) {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    company: "",
    email: "",
    phone: "",
    service: "",
    budget: "",
    message: "",
  });

  useEffect(() => {
    if (preselectedService) {
      const matched = SERVICES.find((s) => s.slug === preselectedService);
      if (matched) {
        setFormData((prev) => ({ ...prev, service: matched.title }));
      }
    }
  }, [preselectedService]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const contactCards = [
    {
      icon: Phone,
      label: "Call us",
      value: CONTACT_INFO.phonePrimary,
      sub: CONTACT_INFO.phoneSecondary,
      href: `tel:${CONTACT_INFO.phoneRaw}`,
    },
    {
      icon: WhatsAppIcon,
      label: "WhatsApp",
      value: CONTACT_INFO.whatsapp,
      sub: "Instant Chat",
      href: CONTACT_INFO.whatsappUrl,
      external: true,
      iconBg: "bg-[#25D366] text-white shadow-[0_4px_14px_rgba(37,211,102,0.4)]",
    },
    {
      icon: Mail,
      label: "Email",
      value: CONTACT_INFO.email,
      href: `mailto:${CONTACT_INFO.email}`,
    },
    {
      icon: MapPin,
      label: "Studio",
      value: CONTACT_INFO.shortAddress,
      href: "#map",
    },
  ];

  return (
    <>
      {/* 1. HERO HEADER */}
      <section className="relative overflow-hidden pt-40 pb-16">
        <BackgroundBlobs />

        <div className="relative mx-auto max-w-4xl px-6 text-center">
          <div className="inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 text-xs uppercase tracking-[0.2em] text-accent font-semibold">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Contact</span>
          </div>

          <h1 className="mt-6 font-display text-5xl sm:text-6xl lg:text-7xl font-bold">
            Let's talk <span className="text-gradient">brand.</span>
          </h1>

          <p className="mx-auto mt-5 max-w-xl text-base sm:text-lg text-muted-foreground">
            Reach out any way you like — we usually reply within an hour on
            business days.
          </p>
        </div>
      </section>

      {/* 2. DIRECT CONTACT METHODS */}
      <section className="relative pb-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {contactCards.map((card) => {
              const IconComp = card.icon;
              return (
                <a
                  key={card.label}
                  href={card.href}
                  target={card.external ? "_blank" : undefined}
                  rel={card.external ? "noreferrer" : undefined}
                  className="group rounded-2xl glass-strong p-6 transition-all duration-300 hover:-translate-y-1.5 border border-white/10 shadow-md block"
                >
                  <div className={`grid h-12 w-12 place-items-center rounded-xl ${card.iconBg || "bg-primary/90 text-primary-foreground"} shadow-md`}>
                    <IconComp className="h-5 w-5 fill-current" />
                  </div>
                  <div className="mt-5 text-[10px] uppercase tracking-widest text-muted-foreground font-semibold">
                    {card.label}
                  </div>
                  <div className="mt-1 font-display text-lg font-semibold transition group-hover:text-accent text-foreground truncate">
                    {card.value}
                  </div>
                  {card.sub && (
                    <div className="mt-0.5 text-xs text-muted-foreground font-medium">
                      {card.sub}
                    </div>
                  )}
                </a>
              );
            })}
          </div>
        </div>
      </section>

      {/* 3. STUDIO & REQUEST A QUOTE FORM */}
      <section className="relative py-16">
        <div className="mx-auto grid max-w-7xl gap-10 px-6 lg:grid-cols-5">
          {/* Studio Details & Map */}
          <div className="lg:col-span-2 space-y-6">
            <div>
              <h2 className="font-display text-3xl sm:text-4xl font-bold text-foreground">
                Visit the studio.
              </h2>
              <p className="mt-3 text-muted-foreground leading-relaxed">
                {CONTACT_INFO.address}. Walk-ins welcome — but a call ahead is kind.
              </p>
              <div className="mt-3">
                <a
                  href={CONTACT_INFO.mapUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 text-xs font-semibold text-accent hover:underline"
                >
                  <Navigation className="h-3.5 w-3.5" />
                  <span>Get Directions on Google Maps</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            </div>

            {/* Hours card */}
            <div className="rounded-2xl glass p-5 border border-white/10">
              <div className="flex items-center gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-xl bg-primary/90 text-primary-foreground shadow-sm">
                  <Clock className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-xs uppercase tracking-widest text-muted-foreground font-semibold">
                    Hours
                  </div>
                  <div className="text-sm font-semibold text-foreground">
                    {CONTACT_INFO.hours}
                  </div>
                </div>
              </div>
            </div>

            {/* Google Maps Embed */}
            <div
              id="map"
              className="overflow-hidden rounded-2xl border border-white/10 shadow-lg relative group"
            >
              <iframe
                title="Manas Advertising location"
                src={CONTACT_INFO.mapEmbedUrl}
                className="h-72 w-full"
                loading="lazy"
              />
              <div className="p-3 bg-[#121424] border-t border-white/10 flex items-center justify-between">
                <span className="text-xs text-muted-foreground flex items-center gap-1.5 truncate max-w-[70%]">
                  <MapPin className="h-3.5 w-3.5 text-accent shrink-0" />
                  <span className="truncate">{CONTACT_INFO.address}</span>
                </span>
                <a
                  href={CONTACT_INFO.mapUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:text-accent transition"
                >
                  <span>Open Maps</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            </div>
          </div>

          {/* Interactive Quote Request Form */}
          <div className="lg:col-span-3 rounded-3xl glass-strong p-8 sm:p-10 border border-white/10 shadow-2xl">
            <h3 className="font-display text-2xl sm:text-3xl font-semibold text-foreground">
              Request a quote
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Tell us what you need. We'll take it from there.
            </p>

            {submitted ? (
              <div className="mt-8 rounded-2xl border border-accent/30 bg-accent/10 p-8 text-center">
                <div className="mx-auto mb-3 grid h-12 w-12 place-items-center rounded-full bg-accent/20 text-accent">
                  <CheckCircle2 className="h-7 w-7" />
                </div>
                <div className="font-display text-2xl font-bold text-accent">
                  Message received.
                </div>
                <p className="mt-2 text-sm text-muted-foreground max-w-sm mx-auto">
                  A brand manager will reach out within 24 hours. Thank you for
                  choosing Manas Advertising.
                </p>

                {/* Instant Location Delivery Card */}
                <div className="mt-6 rounded-2xl border border-white/10 bg-black/40 p-5 text-left">
                  <div className="flex items-start gap-3.5">
                    <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-primary text-primary-foreground shadow-md">
                      <MapPin className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <div className="text-xs uppercase tracking-widest text-accent font-semibold">
                        Our Studio Location
                      </div>
                      <div className="text-sm font-semibold text-foreground mt-0.5">
                        Manas Advertising — {CONTACT_INFO.shortAddress}
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        {CONTACT_INFO.address}
                      </p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        <a
                          href={CONTACT_INFO.mapUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground transition hover:bg-primary/90 shadow-md"
                        >
                          <Navigation className="h-3.5 w-3.5" />
                          <span>Open in Google Maps / Directions</span>
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      </div>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setSubmitted(false)}
                  className="mt-6 inline-flex rounded-full bg-primary/20 px-5 py-2 text-xs font-semibold text-foreground hover:bg-primary/40 transition"
                >
                  Send another inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="mt-6 grid gap-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <input
                    required
                    type="text"
                    placeholder="Full name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-foreground outline-none transition focus:border-primary focus:bg-white/10 placeholder:text-muted-foreground"
                  />
                  <input
                    required
                    type="text"
                    placeholder="Company"
                    value={formData.company}
                    onChange={(e) =>
                      setFormData({ ...formData, company: e.target.value })
                    }
                    className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-foreground outline-none transition focus:border-primary focus:bg-white/10 placeholder:text-muted-foreground"
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <input
                    required
                    type="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-foreground outline-none transition focus:border-primary focus:bg-white/10 placeholder:text-muted-foreground"
                  />
                  <input
                    required
                    type="tel"
                    placeholder="Phone / WhatsApp"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-foreground outline-none transition focus:border-primary focus:bg-white/10 placeholder:text-muted-foreground"
                  />
                </div>

                <select
                  value={formData.service}
                  onChange={(e) =>
                    setFormData({ ...formData, service: e.target.value })
                  }
                  className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-foreground outline-none transition focus:border-primary focus:bg-white/10 cursor-pointer"
                >
                  <option value="" className="bg-[#121424] text-gray-300">
                    Service — Select one
                  </option>
                  {SERVICES.map((service) => (
                    <option
                      key={service.slug}
                      value={service.title}
                      className="bg-[#121424] text-white"
                    >
                      {service.title}
                    </option>
                  ))}
                  <option value="Multiple / Not sure" className="bg-[#121424] text-white">
                    Multiple / Not sure
                  </option>
                </select>

                <select
                  value={formData.budget}
                  onChange={(e) =>
                    setFormData({ ...formData, budget: e.target.value })
                  }
                  className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-foreground outline-none transition focus:border-primary focus:bg-white/10 cursor-pointer"
                >
                  <option value="" className="bg-[#121424] text-gray-300">
                    Budget range
                  </option>
                  <option value="Under ₹50,000" className="bg-[#121424] text-white">
                    Under ₹50,000
                  </option>
                  <option value="₹50,000 – ₹2,00,000" className="bg-[#121424] text-white">
                    ₹50,000 – ₹2,00,000
                  </option>
                  <option value="₹2,00,000 – ₹10,00,000" className="bg-[#121424] text-white">
                    ₹2,00,000 – ₹10,00,000
                  </option>
                  <option value="₹10,00,000+" className="bg-[#121424] text-white">
                    ₹10,00,000+
                  </option>
                </select>

                <textarea
                  rows={4}
                  placeholder="Tell us about your project…"
                  value={formData.message}
                  onChange={(e) =>
                    setFormData({ ...formData, message: e.target.value })
                  }
                  className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-foreground outline-none transition focus:border-primary focus:bg-white/10 placeholder:text-muted-foreground resize-none"
                />

                <button
                  type="submit"
                  className="mt-2 inline-flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground transition-all duration-300 hover:scale-[1.01] hover:bg-primary/90 shadow-lg shadow-blue-500/25 cursor-pointer"
                >
                  <span>Send request</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* 4. FREQUENTLY ASKED QUESTIONS */}
      <section className="relative py-24">
        <div className="mx-auto max-w-4xl px-6">
          <div className="text-center">
            <div className="text-xs uppercase tracking-[0.25em] text-accent font-semibold">
              FAQs
            </div>
            <h2 className="mt-3 font-display text-4xl sm:text-5xl font-bold">
              Common <span className="text-gradient">questions.</span>
            </h2>
          </div>

          <div className="mt-12 space-y-4">
            {FAQS.map((faq, index) => (
              <details
                key={index}
                className="group rounded-2xl glass-strong p-6 transition-all duration-300 border border-white/10"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-left font-display text-lg font-semibold text-foreground select-none">
                  <span>{faq.q}</span>
                  <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-primary/20 text-accent transition-transform duration-300 group-open:rotate-45">
                    <span className="text-lg leading-none">+</span>
                  </span>
                </summary>
                <p className="mt-4 text-sm sm:text-base text-muted-foreground leading-relaxed">
                  {faq.a}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
