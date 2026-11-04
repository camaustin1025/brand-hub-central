# Icon library downloads: build plan

November 3, 2026 · Built locally · Not committed · Tracking migration not yet applied

Source: Figma Slide Skill 2.0, Icons page (node 1:2597). Icon Library frame 18:782, light spec 27:782, dark spec 32:803.

## What shipped

Cameron's calls: Plain exports the bare 48 px glyph, PNG at 512 px only, download tracking included. The library first shipped inside the Icons section; on November 4 Cameron moved it to its own page, `/icon-library`.

1. **Glyphs** (`src/data/icon-glyphs.json`, 70 KB compressed, loaded only when the library is near the screen). 283 come from Google's Material Symbols Rounded files (48 px optical size, weight 400), which match the Figma geometry. 10 are Figma exports because Google has redrawn them since the file was made: smartphone, install_mobile, mobile_friendly, pin_drop, query_stats, extension, automation, auto_awesome, keep, share. All 293 bounding boxes were checked against Figma. To rebuild: `scripts/icon-library/build-glyphs.mjs` (instructions at the top of the file).
2. **Library page** (`src/pages/IconLibrary.tsx`, route `/icon-library`, listed under Visual identity in the sidebar). The Icons section keeps the guidance and links to the page with a "Download icons" button; old `/#icon-library` links redirect. Staff only, like Design canvas, because guests are view-only. **Library UI** (`src/components/brand/IconLibrary.tsx`): background, color, style and format toggles; search with aliases ("heart" finds favorite); a category dropdown instead of 17 chips, to keep phones tidy; click any icon to download; ZIP of whatever is showing. The copy-name button was dropped: it would have doubled the tab stops to 586.
3. **Rendering and ZIPs** (`src/lib/icon-render.ts`): SVGs are built as text, PNGs drawn on a canvas, ZIPs written by a small built-in writer. No new dependencies. A full 293-icon PNG ZIP builds in under 3 seconds and weighs about 6 MB.
4. **Tracking**: `asset_download_events` (insert-only, owner-checked) in `drizzle/migrations/0004_asset_download_events.sql`, written by `src/lib/asset-downloads.ts`. Local development only logs to the console. The table must be applied in Lovable Cloud (see AGENTS.md) before rows appear; until then, inserts fail silently.
5. **Checks**: `npm run test:hub` now also runs `scripts/check-icon-library.mjs` (glyph data, all 27 styles, search, ZIP structure via `unzip -t`, migration).

Not verified: a downloaded PNG placed in a real Google Slides deck, and native iOS or Android browsers.

## What we're building

A browsable library of all 293 Figma icons inside the Icons section of the hub. Pick a background, a color, a treatment and a format, then download one icon, one category, or the full set as a ZIP. It replaces the "Downloadable icon library, planned for v2" line in `src/components/brand/IconGuidance.tsx`.

## What's in the Figma file

### 293 icons in 16 categories

All Material Symbols Rounded, 48 × 48.

| Category | Icons |
| --- | --- |
| Subscriptions & Renewals | 16 |
| Orders & Shipping | 30 |
| Payments & Pricing | 20 |
| Retention & Loyalty | 16 |
| Customers & People | 16 |
| Data & Growth | 19 |
| Platform & Integrations | 19 |
| AI & Automation | 16 |
| Time & Planning | 16 |
| Status & Comparison | 18 |
| Arrows & Markers | 19 |
| Messaging & Engagement | 15 |
| Documents & Content | 10 |
| Merchant Categories | 16 |
| Shopping & Store | 15 |
| Tech & Devices | 32 |
| **Total** | **293** |

### Two color sets, three treatments

| Background | Colors | Plain | Tinted | Solid |
| --- | --- | --- | --- | --- |
| Light | Flamingo Pink #FF61D3, Tile Teal #00BEC0, Brand Green #009A50, Midnight #17132F | Icon in the color | Icon plus an 80 px circle in the color at 12% opacity | Full-color circle, white icon |
| Dark | Groovy Green #00FF85, Flamingo Pink #FF61D3, Intense Cyan #00FAFF, Neon Carrot #FF8500, White #FFFFFF | Icon in the color | Icon plus an 80 px circle in the color at 12% opacity | Full-color circle, Midnight icon |

These values already live in `ICON_COLORS` in `src/data/brand-resources.ts`, verified against the same Figma specs.

Rules from the Figma spec notes, enforced by the picker:

1. The light set is for white or light backgrounds. Midnight Plain and Tinted need a light background.
2. The dark set is for non-white backgrounds only.
3. Dark Solid tiles use a Midnight icon, because white disappears on those colors.
4. The icon is 60% of the tile: 48 px inside 80 px.

Each icon has 27 variants (12 light, 15 dark). Across 293 icons that is 7,911 combinations per format, too many to store as static files.

## Approach: build each variant in the browser

Store each glyph once (one SVG path in a 48 × 48 box). When someone downloads, the page builds the SVG for the chosen color and treatment, draws a PNG from it with a canvas, and packs ZIPs in the browser with a small built-in ZIP writer.

Why this approach:

1. One source file instead of roughly 16,000 static files.
2. A Figma color change is a one-line edit to `ICON_COLORS`.
3. No build step, no storage bucket, works on the current Vite stack.

Trade-off: a full 293-icon PNG ZIP takes a few seconds to build on the viewer's machine. The button shows progress while it works.

## Download experience

Controls at the top of the library, kept visible while scrolling:

1. **Background:** Light or Dark
2. **Color:** only the colors valid for that background
3. **Treatment:** Plain, Tinted or Solid
4. **Format:** SVG or PNG (512 px, transparent background)

Below the controls:

1. A search box that matches icon names and categories ("card" finds credit_card, add_card, credit_card_off).
2. Category chips: All, plus the 16 categories.
3. A grid that previews every icon in the chosen style, on the chosen background.
4. Click an icon to download it. Focus or hover shows its name, with a copy-name button for people who use the Material Symbols font.
5. "Download Orders & Shipping (30)" and "Download all 293" ZIP buttons.

File naming:

- Single file: `og-icon_credit_card_light_brand-green_tinted.svg`
- ZIP: `ordergroove-icons_light_brand-green_tinted.zip`, with a folder per category plus `LICENSE.txt` and `NOTICE.txt` (Apache 2.0 requires both to travel with the icons)

Why both formats: Google Slides can't import SVG, so PNG is the default for most of the company. PowerPoint, Keynote, Canva and Figma take SVG.

## Build steps

1. **Extract the glyphs from Figma (about 30 min).** One read-only `use_figma` script exports all 293 symbols as SVG strings in a single call. Save them to `src/data/icon-glyphs.json` as name, category and path. Compare credit_card, favorite and bar_chart against the existing exports in `public/icon-guidance/` to confirm the paths match. Fallback only if the export fails: Google's Material Symbols Rounded SVGs, matched by name and checked against the same three exports.
2. **Render and ZIP helpers (about 1.5 hr).** New `src/lib/icon-render.ts` with `buildIconSvg`, `svgToPng` and `zipFiles`. Colors and treatments come from `ICON_COLORS`.
3. **Library UI (about 2.5 hr).** New `src/components/brand/IconLibrary.tsx`, lazy-loaded so the glyph data (about 60 KB compressed) loads only when someone reaches the Icons section. Mount it in `IconGuidance.tsx` in place of the "planned for v2" line, reusing the existing Light and Dark toggle pattern.
4. **Wire it into the hub (about 45 min).** Replace the "Brand icon examples" card in `src/data/assets.ts` with an "Icon library" entry that links to `#icons`. Add icon names to hub search. Update `public/icon-guidance/NOTICE.txt` and `public/llms.txt`.
5. **Checks and browser verification (about 1.5 hr).** New `scripts/check-icon-library.mjs`, added to `npm run test:hub`: 293 icons, 16 categories, unique names, valid path data, every color and treatment combination builds, every ZIP includes the license. In the browser: light and dark, phone width, keyboard-only download, and a downloaded PNG placed in a Google Slides deck.

Total: about 6.5 hours of build time, one session.

## Decisions (Cameron, November 3)

1. **Placement.** Inside the Icons section (recommended: guidance and downloads stay together) or a page of its own. *Changed November 4: own page.*
2. **Plain export size.** Tight 48 px glyph (recommended: drops into a slide with no extra padding) or the 80 px tile frame Figma uses (lines up with Tinted and Solid).
3. **PNG size.** 512 px only (recommended) or 512 px plus 1024 px.
4. **Download tracking.** The hub doesn't log asset downloads yet, and the north-star metric is weekly downloads. Add an `asset_download_events` table in this build (about 45 min more, needs a Lovable Cloud migration) or ship without it and add tracking later.

## Out of scope

1. Icons that aren't in the Figma file. The current guidance already links Google's full library for one-offs.
2. An icon font or React icon package for the product team.
3. Sizes beyond SVG and 512 px PNG.
