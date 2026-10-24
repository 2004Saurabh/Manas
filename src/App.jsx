import React, { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import HomePage from "./pages/HomePage";
import ServicesPage from "./pages/ServicesPage";
import PortfolioPage from "./pages/PortfolioPage";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";
import PortalPage from "./pages/PortalPage";
import { MessageCircle } from "lucide-react";
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
        href={`https://wa.me/${CONTACT_INFO.phoneRaw}?text=Hi%20Manas%20Advertising%2C%20I%20would%20like%20to%20inquire%20about%20your%20services.`}
        target="_blank"
        rel="noreferrer"
        aria-label="Chat on WhatsApp"
        className="fixed bottom-6 right-6 z-40 grid h-14 w-14 place-items-center rounded-full bg-[#25D366] text-white shadow-2xl transition-all duration-300 hover:scale-110 hover:shadow-[#25D366]/40 glow"
      >
        <MessageCircle className="h-7 w-7 fill-current" />
      </a>
    </div>
  );
}
