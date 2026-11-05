import React, { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import HomePage from "./pages/HomePage";
import ServicesPage from "./pages/ServicesPage";
import PortfolioPage from "./pages/PortfolioPage";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";
import PortalPage from "./pages/PortalPage";
import WhatsAppIcon from "./components/WhatsAppIcon";
import { CONTACT_INFO } from "./data/manasData";

export default function App() {
  const [currentPath, setCurrentPath] = useState(
    window.location.pathname || "/"
  );
  const [currentHash, setCurrentHash] = useState(window.location.hash || "");
  const [selectedService, setSelectedService] = useState("");

  // Sync state with browser location
  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname || "/");
      setCurrentHash(window.location.hash || "");
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  // Navigation handler
  const navigate = (to) => {
    let path = to;
    let hash = "";

    if (to.includes("#")) {
      const parts = to.split("#");
      path = parts[0] || "/services";
      hash = `#${parts[1]}`;
    }

    if (to.includes("?service=")) {
      const match = to.match(/service=([^&]+)/);
      if (match) {
        setSelectedService(match[1]);
      }
      path = "/contact";
    }

    setCurrentPath(path);
    setCurrentHash(hash);
    window.history.pushState({}, "", to);

    if (!hash) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // Render appropriate view based on route
  const renderPage = () => {
    switch (currentPath) {
      case "/services":
        return <ServicesPage navigate={navigate} hash={currentHash} />;
      case "/portfolio":
        return <PortfolioPage navigate={navigate} />;
      case "/about":
        return <AboutPage navigate={navigate} />;
      case "/contact":
        return <ContactPage preselectedService={selectedService} />;
      case "/portal":
        return <PortalPage navigate={navigate} />;
      case "/":
      default:
        return <HomePage navigate={navigate} />;
    }
  };

  if (currentPath === "/portal") {
    return <PortalPage navigate={navigate} />;
  }

  return (
    <div className="relative min-h-screen bg-background text-foreground flex flex-col justify-between selection:bg-primary/40 selection:text-white">
      {/* Top Floating Glass Header */}
      <Navbar currentPath={currentPath} navigate={navigate} />

      {/* Main Page Body */}
      <main className="flex-1">{renderPage()}</main>

      {/* Footer */}
      <Footer navigate={navigate} />

      {/* Floating WhatsApp Quick Action Button */}
      <a
        href={CONTACT_INFO.whatsappUrl}
        target="_blank"
        rel="noreferrer"
        aria-label="Chat on WhatsApp"
        title="Chat with Manas Advertising on WhatsApp"
        className="fixed bottom-6 right-6 z-40 flex items-center gap-2 group cursor-pointer focus:outline-none"
      >
        <span className="hidden sm:inline-flex items-center rounded-full bg-[#121424]/90 backdrop-blur px-3 py-1.5 text-xs font-semibold text-white border border-white/10 shadow-lg opacity-0 transition-opacity duration-200 group-hover:opacity-100">
          Chat on WhatsApp
        </span>
        <div className="relative grid h-14 w-14 place-items-center rounded-full bg-[#25D366] text-white shadow-[0_10px_25px_rgba(37,211,102,0.45)] transition-all duration-300 group-hover:scale-110 group-hover:shadow-[0_15px_30px_rgba(37,211,102,0.65)]">
          <WhatsAppIcon className="h-7 w-7 fill-white" />
          <span className="absolute -top-0.5 -right-0.5 flex h-3.5 w-3.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#25D366] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-400 border-2 border-[#121424]"></span>
          </span>
        </div>
      </a>
    </div>
  );
}
