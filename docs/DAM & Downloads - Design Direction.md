# DAM & Downloads — Design Direction

**Purpose:** Design and layout exploration for the brand hub's asset surfaces (the Downloads page in v1, the DAM-lite asset library in v1.5). Grounded in a Refero sweep of real DAMs, brand hubs, and asset libraries, plus three enterprise brand hubs Cameron flagged (Carta, 1Password, Zoom).
**Date:** July 23, 2026 · Feeds Phase 1 scaffolding and the v1.5 DAM-lite build.
**Scope note:** Per the project plan, DAM-lite (search, tags, asset detail) is v1.5, after the Frontify-review meeting. In v1, the "Downloads" page is a flat, curated grab-and-go surface. This doc covers both so the v1 layout is built to grow into v1.5 without a rework.

## The one pattern that organizes everything

Every strong brand hub splits into three modes. Carta's hub makes this explicit in its own top nav, and it maps cleanly onto our v1 pages:

| Mode | What it is | Their name (Carta) | Our surface |
|---|---|---|---|
| **Read** | Learn the rules | Brand guidelines | Foundation & Messaging · Voice & Language Rules · Visual Identity · Design Tokens |
| **Grab** | Take a finished asset | Asset library | Downloads (v1) → DAM-lite (v1.5) |
| **Build** | Make an on-brand asset | Asset builder | GTM & Employee Toolkit (Drive/Canva links, v1) → future |

Keeping these three visually and navigationally distinct is the single highest-leverage IA decision. A visitor who wants the logo right now should never have to read a guidelines essay to find it, and someone learning the voice rules shouldn't get dumped into a file grid. Our current v1 page list already respects this split; the job is to make it legible in the layout.

## References worth stealing from

All links open the reference in Refero or the live site.

### Homepage / hub landing
- **[Carta brand hub](https://brand.carta.com)** (the closest comp to what we're building, and it's a live Frontify hub, the exact product we're replacing). Structure: a short **Welcome** with a brand-story hook → an **interactive color palette** ("flip a swatch to explore," each swatch showing name + hex + a line of evocative brand copy) → four **"Explore the Carta brand" cards** (Brand guidelines / Asset library / Asset builder / Introducing Ink). Dark near-black canvas (`#1A1A1A`), coral accent (`#FF7D55`), generous whitespace, big type. **This is structurally almost identical to what we'd do with Midnight + Groovy Green** — a reassuring proof point that our palette choice reads as premium-enterprise, not loud.
- **[Nextdoor Media assets](https://refero.design/pages/955d2ed6-5972-4257-97ca-2b5b1389f8d2)** — a corporate media kit with a left-rail of section labels (Logos, Product Imagery, Lifestyle Imagery, Featured Videos) and wide content bands with carousels. Good model for a single-scroll assets page with anchored sections.

### Grab-and-go / asset library (the DAM proper)
- **[Squarespace Asset Library](https://refero.design/pages/ffc259a0-2a69-481f-af7e-d4c477f98bf7)** — the cleanest reference: left sidebar, "Asset Library" H1, All Files / Trash tabs, sort + search + grid/list toggle, Add Folder + Upload actions, uniform thumbnail grid with filenames. This is the template for our DAM-lite main view.
- **[Raster](https://refero.design/pages/13def0c6-03f0-4142-8ec8-35f6c3ee1c4e)** — a modern dark-themed DAM ("digital asset manager for modern teams"): sidebar nav (Tags / Trash / Search / Upload), image grid with metadata on each card. Closest to a Midnight-dark treatment of the grid.
- **[Dropbox team file grid](https://refero.design/pages/005631a1-5d06-433f-8ef4-1998932ddc5e)** — three-column layout (nav / grid / info drawer). The right-hand **info drawer** is the pattern for showing asset metadata without leaving the grid.
- **[Dock asset detail](https://refero.design/pages/decbf993-76f8-47ce-b33e-6d676976c1eb)** — a single-asset view: large preview, filename + size, Download button, "Add to collection," last-updated/owner, and a right rail with **Views / Shares / Downloads analytics** and an activity feed. This is the model for our asset-detail page and ties directly to the analytics-from-day-one requirement (GA4 events on downloads).

### Brand-guidelines pages (the "Read" mode, done beautifully)
- **[Jace AI brand guidelines](https://refero.design/pages/6e0c442b-31f0-492c-829a-70720f2fc6e2)** — the best single reference for our guideline pages. Editorial layout: numbered contents (Tone of Voice / Logo / Icon / Colours / Typography / Images), long-form voice guidance with DO/DON'T columns, then per-section asset galleries each with its **own "Download all …" button**, click-to-copy hex swatches with usage labels, and a type specimen. Everything we need on Visual Identity and Voice pages, in one coherent aesthetic.
- **[ElevenLabs brand + press kit](https://refero.design/pages/364cd667-486b-4382-9418-d93e3ea8b739)** — clean logo/symbol download blocks plus a **"what to avoid" misuse grid**. We already have misuse content in the old PDF (Logo Don'ts); this is how to present it.
- **[Craft brand assets](https://refero.design/pages/d37f3d3e-3bc9-4acc-83d9-96447379b3c9)** — minimal, warm, single-column: logo/wordmark/app-icon showcases on tinted tiles, an "Intellectual property" usage reminder, download CTA. Good for restraint.

### Color & token presentation
- **[Carta capital colors](https://brand.carta.com)** — flip-card swatches, hex + poetic descriptor per color. Engaging without being gimmicky.
- **[Sketch color variables](https://refero.design/pages/46600cc2-4074-41c9-8627-61cc9a6732bb)** — swatch cards with HEX values and an export affordance; closer to a design-token presentation.
- **[Coolors contrast checker](https://refero.design/pages/c206e954-33ae-40bf-8857-e1fcbe23a8a9)** — worth noting because our single most-missed rule is the green contrast rule (`#009A50` on light, `#00FF85` on dark). Showing a live pass/fail contrast badge on each swatch would encode that rule into the UI itself.

## Recommended layout for our surfaces

### v1 — Downloads page (flat, curated, ships for the meeting)
A single scroll, sectioned by asset family, no search/filter yet. Sections in a **visual-container card grid** (our three-rounded-corners-one-square shape from the brand):

- **Logo kit** — dark and light lockups on Midnight/White tiles, isolated logomark, single-color variants. Each tile: preview + format chips (SVG / PNG / EPS) + one-click download.
- **Token kits** — tokens.json, tokens.css, downloadable as files, with a copy-to-clipboard affordance.
- **Font kit** — Figtree weights (already in `assets/`), one "Download font kit" button.
- **Backgrounds & social** — Zoom backgrounds, social banners, new-hire graphics (links to Canva where live).

Each download fires a GA4 event from day one so v1.5's analytics rail has history to show.

### v1 — Visual Identity page (the engaging one)
Model on Jace AI + Carta. Dark Midnight canvas. Sections:
- **Color** — click-to-copy swatch cards (Carta flip-card treatment optional), each with hex, RGB, name, usage label, and a **live contrast badge** enforcing the green rule.
- **Gradients** — the two cleared gradients + the generated Orange → Yellow, as large swatches with copyable CSS.
- **Logo** — lockups, clearspace, the misuse gallery (ElevenLabs pattern).
- **Circles & Visual Containers** — show the signature devices in situ.

### v1.5 — DAM-lite asset library
Model on Squarespace + Raster + Dock:
- **Left sidebar**: asset categories (Logos, Photography, Icons, Templates, Social, Backgrounds), plus Search and Recent.
- **Main**: search field + sort + grid/list toggle + a thumbnail grid on the same assets table we ship in v1 (so no data migration).
- **Asset detail** (Dock model): large preview, metadata, format/download options, and a right rail with GA4-backed Views/Downloads. Filters by tag and type. This is where FTS-vs-Algolia gets decided at build time.

## Visual direction: translating the references to our brand

The references converge on a look we can hit natively with our system:

- **Dark, spacious, editorial.** Carta (near-black + coral) and the dark DAMs (Raster, Dropbox dark) prove the Midnight-first, Groovy-Green-accent direction reads as premium-enterprise. Default the hub to Midnight `#17132F` canvas with `#00FF85` accents; use White surfaces for dense reading pages (guidelines) where `#009A50` green applies.
- **Cards are our Visual Containers.** Every reference leans on card grids. We already own a distinctive card shape (three rounded corners, one square). Using it for asset tiles and "explore" cards makes the grid unmistakably Ordergroove instead of generic-shadcn.
- **Circles as the hero device.** Where Carta uses floating coral squares, we use the paired-circle motif from the brand. That's our equivalent of their signature hero animation.
- **Figtree throughout**, big display sizes for section headers (H1 40-44px per canon), eyebrow labels in ALL CAPS 0.16em.
- **Click-to-copy everywhere** hexes and tokens appear — it's table stakes in every guideline reference and directly serves our "click-to-copy hexes" v1 requirement.

## Concrete implication for scaffolding (starting now)

The scaffolding should assume this IA from the start:
1. **A shared layout shell**: top nav with the three modes legible (Read / Grab, with Build as toolkit links), search affordance stubbed, Midnight-default theme.
2. **A reusable `AssetCard` / VisualContainer component** (our asymmetric-corner shape) used by both the v1 Downloads grid and the v1.5 DAM grid — build it once.
3. **A `Swatch` component** with click-to-copy + contrast badge, used on Visual Identity and Design Tokens.
4. **An `assets` data model** flat enough for v1 Downloads but with the tag/type/format fields v1.5 DAM-lite will filter on — so v1.5 is additive, not a rebuild.

Building these four primitives now is what lets the DAM-lite drop in later without touching the v1 pages.
