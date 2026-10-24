# Manas Advertising — Web Application

A modern, high-performance web application recreating and enhancing the [Manas Advertising](https://manasadverstisment.netlify.app/) brand experience.

Built with **React**, **Vite**, and **Tailwind CSS**.

---

## ✨ Features Included

1. **Brand Identity & Aesthetic**
   - High-end dark theme with custom OKLCH color spaces (`--navy`, `--royal`, `--accent`).
   - Frosted glassmorphism (`.glass`, `.glass-strong`) with multi-layer ambient blur orbs (`BackgroundBlobs`).
   - Space Grotesk & Inter typography with gradient text accents.

2. **Interactive Components**
   - **Interactive Services Wheel**: Concentric rotating orbits with interactive service nodes and dynamic active status cards.
   - **Live Metric Counters**: Auto count-up metrics for years of experience, projects delivered, happy clients, and cities served.
   - **Infinite Marquee**: Seamless brand partner reel (`NEXA RETAIL`, `URBAN FLEET`, etc.).
   - **Portfolio Gallery Filter**: Instant categorization for Van Advertising, Flex Printing, Canopy, Umbrella, In-Shop Branding, and Offset Printing.
   - **Detailed Services Showcase**: 7 dedicated service disciplines featuring dual-column breakdown of features and deliverables.
   - **Quote Request Form & Contact Hub**: Interactive request form with budget tiers, studio location, and 1-click WhatsApp integration.
   - **FAQ Accordion**: Animated collapsible questions and answers.

---

## 🚀 Quick Start Guide

### 1. Install Dependencies
Make sure you have [Node.js](https://nodejs.org/) installed, then run:

```bash
npm install
```

### 2. Start Development Server
```bash
npm run dev
```

The application will be running locally at `http://localhost:5173/`.

### 3. Build for Production
```bash
npm run build
```

This compiles optimized assets to the `dist/` directory, ready to deploy to Netlify, Vercel, or any static host.

---

## 📂 Project Structure

```
Manas/
├── index.html                 # Main HTML template with Google Fonts & Meta tags
├── package.json               # Dependencies and build scripts
├── vite.config.js             # Vite bundler config
├── tailwind.config.js         # Custom colors, fonts, keyframes & animations
├── postcss.config.js          # PostCSS processor config
└── src/
    ├── main.jsx               # React entry point
    ├── App.jsx                # Router, navigation state & layout
    ├── index.css              # Tailwind directives & glassmorphic utility classes
    ├── data/
    │   └── manasData.js       # Complete services, portfolio, team, beliefs & client data
    ├── components/
    │   ├── Navbar.jsx         # Floating pill header with mobile drawer
    │   ├── Footer.jsx         # 4-column footer with brand summary & links
    │   ├── BackgroundBlobs.jsx# Ambient glowing blur orbs & grid
    │   ├── Counter.jsx        # Animated count-up metrics
    │   └── ServicesWheel.jsx  # Concentric rotating services wheel
    └── pages/
        ├── HomePage.jsx       # Hero, Marquee, Overview, Method, Testimonials, CTA
        ├── ServicesPage.jsx   # 7 Deep-dive service disciplines with deliverables
        ├── PortfolioPage.jsx  # Filterable portfolio gallery with masonry layout
        ├── AboutPage.jsx      # 15-year narrative, beliefs, timeline & team cards
        └── ContactPage.jsx    # Quick contact methods, Google Map & quote form
```
