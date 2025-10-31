# Orange Tool Interface

A production-ready Next.js experience for Orange Tool featuring immersive motion, a refreshed brand system, and dual-language support. The redesign keeps the existing operational logic available behind a feature flag while showcasing a new hero dashboard, calculators, pro-rata analytics, assistant timeline, and documentation hub.

## Highlights
- **Brand-first UI** with luxurious orange gradients, glassmorphism surfaces, and large rounded geometry.
- **Motion system** powered by Framer Motion with nuanced hover states, scroll reveals, and a first-load splash animation.
- **Theme + locale persistence** using `next-themes` and localStorage (Arabic/English with instant RTL/LTR flips).
- **Feature flag** via `NEXT_PUBLIC_ORANGE_NEW_UI` to switch between the new experience and the legacy client instantly.
- **Accessibility-aware** components with ≥4.5:1 contrast, keyboard focus rings, and responsive typography.

## Project Structure
```
client/                  # Next.js app router project
  app/
    layout.tsx           # Injects theme + language providers, sets globals
    page.tsx             # Feature flag controlled entry point
  components/
    Header.tsx           # Glass header with logo, language switcher, theme toggle, CTA
    GradientBG.tsx       # Hero background glow and animated geometry
    SplashScreen.tsx     # First-load splash with blur-in logo
    sections/            # Hero, KPI cards, feature grid, calculators, pro-rata, assistant, docs
    ui/Card.tsx          # Shared glass card styling with hover sheen
    legacy/LegacyApp.tsx # Minimal legacy shell rendered when the flag is disabled
  lib/
    i18n.ts              # English/Arabic copy blocks
    utils.ts             # Helpers for classNames and formatting
  styles/globals.css     # Tailwind layers + CSS variables for the brand palette
  tailwind.config.ts     # Tailwind config scoped to the Next app
  next.config.mjs
legacy-client/           # Original Vite-based client kept for reference
server/                  # Existing Express backend remains untouched
shared/                  # Shared types and utilities
```

## Getting Started

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Set the feature flag**
   Create a `.env.local` inside `client/` (or export at runtime):
   ```env
   NEXT_PUBLIC_ORANGE_NEW_UI=true
   ```
   - `true` → renders the new Next.js interface
   - `false` → displays the preserved legacy experience

3. **Run the backend + frontend together**
   ```bash
   npm run dev
   ```
   When `NEXT_PUBLIC_ORANGE_NEW_UI=true` the Express server boots the embedded Next.js dev server.
   If the flag is `false` the classic Vite client is served instead.

4. **Run the Next.js frontend only (optional)**
   ```bash
   npm run client:dev
   ```
   Useful when iterating exclusively on the redesigned UI.

5. **Production build**
   ```bash
   npm run build
   ```
   This command compiles the Next.js frontend and bundles the Express server with esbuild.

## Design System Notes
- Primary gradient token `var(--grad-hero)` powers hero surfaces and CTAs.
- `Card` components apply glass surfaces, hover lift (+4px), and sheen lines.
- Inputs are pill-shaped with orange focus rings and helper labels.
- Motion durations follow the 180–260 ms micro-interaction / 480–700 ms macro-transition cadence.
- RTL layout is fully supported through `LanguageProvider`, updating `<html dir/lang>` live.

## Environment Variables
- `NEXT_PUBLIC_ORANGE_NEW_UI` — toggles between the redesigned UI (`true`) and the legacy interface (`false`).
- Existing backend variables (OpenAI, database, etc.) remain unchanged.

Enjoy the refreshed Orange Tool experience! ✨
