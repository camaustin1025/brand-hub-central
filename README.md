# Ordergroove Brand Hub

The internal home for the Ordergroove brand: guidelines, downloadable assets, design tokens, and the tools to stay on brand. Built in-house instead of Frontify.

## Stack

Vite + React 18 + TypeScript + Tailwind CSS + shadcn/ui, with `react-router-dom`. The conventions (SWC plugin, `@/` path alias, shadcn CSS-variable theming, structure) deliberately match Lovable's generator so the two-way GitHub sync is low-friction.

## Getting started

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # tsc --noEmit && vite build → dist/
```

## Project structure

```
src/
  components/
    ui/          shadcn primitives (button, ...)
    brand/       Swatch, VisualContainer, AssetCard, DraftBadge
    layout/      Header, Footer, Layout, PageHeader, ErrorBoundary, ScrollToTop
  pages/         Home + the 7 v1 pages + NotFound
  data/          nav, tokens (verified brand values), assets (DAM-ready model)
  index.css      theme tokens (light default, .dark islands) + Figtree @font-face
public/          fonts, logos, favicon, llms.txt
content-sources/ brand canon (brand.md wins), style guide, old-hub PDF, audit inputs
docs/            decision docs + the Phase 0 audit + DAM design direction
assets/          starter kit (Figtree TTFs, logos, gradients)
```

## Social customizer

The Toolkit includes three New Employee pilot templates: Proud to join, I've joined and Excited to share. Each uses Figtree and exports a 1200 × 627 PNG. Artwork and thumbnails ship from `public/social/`; Figma comparison renders stay in `docs/social-references/new-employee/`.

Templates require a nonempty `category` and may reference a registered `previewAssetId`. Text rules accept an approved-token `color` and an `opacity` from 0.1 to 1; omitted values retain the variant foreground at full opacity. Toolkit cards are grouped by category, search labels include the category, and editors with one variant hide the Design picker. Schema details, validation coverage and browser checks are documented in [the social template README](src/data/social-templates.README.md).

```bash
TZ=America/Los_Angeles npm run test:social
TZ=Pacific/Auckland npm run test:social
npm run build
npm run lint
```

## Design system notes

- **Light by default.** The page canvas is a soft off-white (`#F5F5F8`) with white cards. Midnight (`#17132F`) is used for accent islands (hero, footer, preview tiles), each wrapped in a `.dark` class so shadcn tokens flip correctly.
- **The green contrast rule is structural.** `.dark` islands resolve green to `#00FF85`; light surfaces resolve it to `#009A50`. The `<Swatch>` component also renders a live WCAG contrast badge. Never green text on white.
- **Type:** Figtree everywhere, self-hosted. Headings run tight (negative tracking, ~1.08 leading), green ALL-CAPS tracked eyebrows.
- **Modules:** uniform 20px radius, fully-rounded pill buttons, matching the live ordergroove.com site and the Carta brand hub. The asymmetric "Visual Container" brand shape is available as an opt-in accent (`.notch-br`).
- **Nav:** simplified to Guidelines (dropdown) / Downloads / More (dropdown) + search.

## Bringing this into Lovable

1. Push this repo to a GitHub repository you own (nothing has been pushed yet).
2. In Lovable, create the project and connect that GitHub repo for two-way sync.
3. Lovable Cloud (Supabase) then layers on: Google OAuth restricted to `@ordergroove.com`, the assets table, the Q&A log, and the AI assistant edge function.

The app runs fully standalone today (no backend required), so it imports and previews immediately.

## Status

**Built:** all 8 v1 pages routing and rendering with real canon content, the light/Carta-inspired design system, the three reusable primitives (Swatch, VisualContainer, AssetCard), Figtree + logos + favicon, error boundary, `llms.txt`.

**Pending (tracked in `docs/`):**
- `tokens.json` / `tokens.css` — generate after audit decisions **D1** (logo-on-white ring green) and **D2** (Green-300 ramp) land.
- Example art and merchant logos — gated on **D11** (legal-approved merchant list).
- Real asset files — most download links point at assets being re-sourced (every old-hub link was dead).

See `docs/Phase 0 - Old Hub Content Audit.md` for the full content audit and decision list, and `docs/DAM & Downloads - Design Direction.md` for the asset-surface design direction.
