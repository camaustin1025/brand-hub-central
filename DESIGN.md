---
name: Ordergroove Brand Hub
description: The internal source of truth for the Ordergroove brand — bold, precise, electric.
colors:
  midnight: "#17132F"
  indigo: "#2E2A47"
  green: "#00FF85"
  green-light: "#009A50"
  cyan: "#00FAFF"
  lemon: "#EAFF00"
  carrot: "#FF8500"
  radish: "#D32E55"
  flamingo: "#FF61D3"
  eggplant: "#8500FF"
  white: "#FFFFFF"
  surface-light: "#F5F5F8"
  border-light: "#D8D7DF"
  muted-ink: "#666279"
  ink-on-dark: "#EBEAF0"
typography:
  marquee:
    fontFamily: "Figtree, ui-sans-serif, system-ui, sans-serif"
    # cqi, not vw: the side rail owns part of the viewport, so the marquee is
    # measured against the content pane. See Layout → The Full-Bleed Rule.
    fontSize: "clamp(56px, 11cqi, 132px)"
    fontWeight: 800
    lineHeight: 0.86
    letterSpacing: "-0.04em"
  specimen:
    fontFamily: "Figtree, ui-sans-serif, system-ui, sans-serif"
    fontSize: "82px"
    fontWeight: 800
    lineHeight: 0.9
    letterSpacing: "-0.04em"
  band:
    fontFamily: "Figtree, ui-sans-serif, system-ui, sans-serif"
    fontSize: "52px"
    fontWeight: 700
    lineHeight: 1
    letterSpacing: "-0.03em"
  display:
    fontFamily: "Figtree, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(2rem, 5vw, 3.25rem)"
    fontWeight: 700
    lineHeight: 1.08
    letterSpacing: "-0.02em"
  headline:
    fontFamily: "Figtree, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(1.5rem, 3vw, 2rem)"
    fontWeight: 700
    lineHeight: 1.08
    letterSpacing: "-0.02em"
  card-title:
    fontFamily: "Figtree, ui-sans-serif, system-ui, sans-serif"
    fontSize: "26px"
    fontWeight: 700
    lineHeight: 1.05
    letterSpacing: "-0.025em"
  title:
    fontFamily: "Figtree, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.25rem"
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: "-0.01em"
  lead:
    fontFamily: "Figtree, ui-sans-serif, system-ui, sans-serif"
    fontSize: "17px"
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: "normal"
  body:
    fontFamily: "Figtree, ui-sans-serif, system-ui, sans-serif"
    fontSize: "15px"
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: "normal"
  label:
    fontFamily: "Figtree, ui-sans-serif, system-ui, sans-serif"
    fontSize: "14px"
    fontWeight: 600
    lineHeight: 1.4
    letterSpacing: "normal"
  micro:
    fontFamily: "Figtree, ui-sans-serif, system-ui, sans-serif"
    fontSize: "11px"
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "0.12em"
  eyebrow:
    fontFamily: "Figtree, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "0.16em"
  # The icon face. Not a second brand typeface — Figtree remains the only one
  # for text — but it is a real font the system loads, so it is declared here
  # rather than living only in the Icons prose below. Axes are brand law:
  # FILL 0, wght 300, GRAD 0, opsz 24 (July 2025 brand deck, audit D12).
  icon:
    fontFamily: "Material Symbols Outlined"
    fontSize: "24px"
    fontWeight: 300
    lineHeight: 1
    letterSpacing: "normal"
rounded:
  sm: "6px"
  md: "8px"
  lg: "10px"
  card: "20px"
  hero: "28px"
  full: "9999px"
spacing:
  gutter: "24px"
  # The three vertical steps, which double. See Layout → The Rhythm Rule.
  step-block: "24px"
  step-module: "48px"
  step-section: "96px"
  # The sticky chrome height, and therefore every anchor's scroll-margin.
  stick: "76px"
  # The side nav, expanded and collapsed to its icon rail.
  sidenav: "256px"
  sidenav-icon: "64px"
  container-max: "1280px"
  container-content-max: "1200px"
components:
  button-primary:
    backgroundColor: "{colors.green-light}"
    textColor: "{colors.white}"
    rounded: "{rounded.full}"
    padding: "8px 24px"
    height: "40px"
  button-primary-hover:
    backgroundColor: "{colors.green-light}"
    textColor: "{colors.white}"
    rounded: "{rounded.full}"
  button-outline:
    backgroundColor: "transparent"
    textColor: "{colors.midnight}"
    rounded: "{rounded.full}"
    padding: "8px 24px"
    height: "40px"
  card:
    backgroundColor: "{colors.white}"
    textColor: "{colors.midnight}"
    rounded: "{rounded.card}"
    padding: "24px"
  card-dark:
    backgroundColor: "{colors.midnight}"
    textColor: "{colors.ink-on-dark}"
    rounded: "{rounded.card}"
    padding: "32px 28px"
  input:
    backgroundColor: "transparent"
    textColor: "{colors.midnight}"
    rounded: "{rounded.md}"
    padding: "4px 12px"
    height: "36px"
  chip:
    backgroundColor: "{colors.surface-light}"
    textColor: "{colors.midnight}"
    rounded: "{rounded.full}"
    padding: "4px 10px"
---

# Design System: Ordergroove Brand Hub

## Overview

**Creative North Star: "The Live Wire"**

The Brand Hub is electric and current, never archival. Its whole reason to exist is to be the opposite of a static PDF brandbook, so the design carries a pulse: quiet, disciplined structure with committed islands of Midnight and neon-green running through it like a charge. The interface is calm where it needs to be readable — high-contrast surfaces, one typeface, generous rhythm — and it comes alive exactly where the brand does: in the accent islands, the correct-contrast green, and the signature notch. Energy comes from contrast and precision, not from motion noise or gradient overload.

The register is confident and expert. This is an internal tool people arrive at mid-task to grab a logo, confirm a hex, or check a headline, so retrieval always wins the tie against expression. But the hub also _demonstrates_ the brand it documents: using it should itself feel like a working proof of what good Ordergroove work looks like. That is the balance to hold — a serious, well-run system that still has a current running through it.

The system rejects three looks explicitly: the sterile exported-print-guideline feel, the generic gray SaaS-admin dashboard, and gratuitous decoration that fights the find-and-leave job. When in doubt, make the structure quieter and let the color island carry the charge.

**Key Characteristics:**

- High-contrast Midnight surfaces with committed neon-green accent islands
- Figtree as the only typeface, headings running tight
- The structural green-contrast rule (#009A50 on light, #00FF85 on dark)
- The signature notch shape (three rounded corners, one square)
- Flat by default — depth is contrast and tonal layering, not shadow
- Material Symbols at a single ratified axis set

## Colors

A committed, high-energy palette anchored by Midnight and a two-state brand green, with a bench of secondary neons reserved for decorative pop.

### Primary

- **Midnight** (#17132F): The primary dark background and the default ink color on light surfaces. Never pure black — this is the floor the whole system sits on.
- **Groovy Green** (#00FF85): The accent on dark surfaces only. Used for eyebrows, active states, icons, and highlights when the surface is Midnight. Fails contrast as text on white — that failure is the reason the light variant exists.
- **Green (light-bg)** (#009A50): The green to use on light backgrounds — the correct-contrast counterpart that keeps green legible as text and UI accent on white/`#F5F5F8`.

### Secondary

Decorative pop only, never leading, never carrying meaning alone.

- **Intense Cyan** (#00FAFF): Decorative accent; the second stop in the signature gradient.
- **Laser Lemon** (#EAFF00): Decorative accent. Never text on white.
- **Neon Carrot** (#FF8500): Decorative accent, warm gradient anchor.
- **Radiant Radish** (#D32E55): Decorative accent; also the destructive/error tone.
- **Flamingo Pink** (#FF61D3): Decorative accent.
- **Electric Eggplant** (#8500FF): Decorative accent.

### Neutral

- **White** (#FFFFFF): Card surfaces on light; text and logo on dark.
- **Cloud** (#F5F5F8): The light page background — a hair off white so white cards read as raised.
- **Dark Indigo** (#2E2A47): Muted/card surface on dark; subtitle and muted text on light.
- **Soft Ink** (#666279): Secondary text tone on light.
- **Border** (#D8D7DF): Borders and dividers on light. On dark, borders are white at 12% opacity.
- **Hairline** (#EBEAF0): The faint rule between rows inside one module — lighter than Border, which separates modules from each other. Held by `--color-og-hairline`.
- **Ink on Dark** (#EBEAF0): Body and subtitle text on Midnight surfaces. Held by `--color-og-ink`.

Hairline and Ink on Dark carry the same value today and mean different things — one is a divider on light, the other is text on Midnight. They are separate tokens on purpose; changing one must not silently move the other.

### Gradients

Five, all at 112° (see The Gradient-Angle Rule). `data/tokens.ts` holds the CSS; every surface that paints one reads it from there.

| Id | Name | Stops | Status |
| --- | --- | --- | --- |
| `signature` | Signature (Green → Cyan) | #00FF85 → #00FAFF | Signature |
| `marquee` | Marquee (Green → Cyan → Lemon) | #00FF85 0% → #00FAFF 52% → #EAFF00 100% | Signature |
| `purple` | Purple → Blue → Green | #7821F5 → #71ACFF → #00FF85 | Approved |
| `warm` | Orange → Yellow | #FF8500 → #EAFF00 | Approved |
| `web` | Web brand gradient | #E0FE00 → #0BFE5F → #00FEFE | Web |

The `marquee` stops are load-bearing: it is the home hero, and at even thirds the cyan lands under the omni bar and the lemon runs off the right edge.

`purple` and `web` contain the only colors in the system that are not in the palette above — #7821F5, #71ACFF, #E0FE00, #0BFE5F, #00FEFE. They are **gradient stops, not palette colors**: they exist to be interpolated through and must never be pulled out as a fill, a text color, or a border. #E0FE00 / #0BFE5F / #00FEFE in particular are the live ordergroove.com web gradient's own stops, which sit a few points off Laser Lemon, Groovy Green, and Intense Cyan — near enough to look like a typo and far enough that swapping in the palette values changes the gradient.

### Named Rules

**The Green-Contrast Rule.** Green is never one color. On Midnight it is `#00FF85` (13.4:1 — comfortable). On light surfaces it is a green dark enough to read, and the semantic `--primary` token flips with the surface so this happens automatically: any nested Midnight island (`.dark`) resolves green to `#00FF85`, and any light module inside it (`.light`) resolves back to the light value.

**The Light-Green Split.** Measured, `#009A50` is **3.66:1** on white and **3.36:1** on `#F5F5F8`. That clears WCAG AA for large text (3:1) and for UI shapes, but it fails the 4.5:1 required for body and label text — which is most of what the green is actually used for (12px kickers, card links, nav). So the two roles are separated:

- **`#009A50` — the brand swatch.** Brand canon, what `/tokens` and `/visual-identity` publish, and what `--color-og-green-light` holds. Use it where the literal color is the subject: swatches, specimens, gradient stops. Safe as a fill behind Midnight text.
- **`#008040` — the UI accent.** What `--primary` resolves to on light, and therefore what `Kicker`, `CardLink`, nav links, and every `text-primary` actually paint. **5.05:1** on white, **4.64:1** on `#F5F5F8` — passes AA on both.

Reach for `text-primary`, never a hardcoded green, and the right one applies itself. Note this is an accessibility correction made in the UI layer: **ratifying `#008040` into the published brand palette is a Brand & Content decision that has not been made.** Until it is, the hub deliberately documents `#009A50` while rendering its own chrome in `#008040`.

**The One-Green Accent Rule.** The brand green is the voice, not the wallpaper. Lead every colored moment with the correct-contrast green; the secondary neons appear only as decorative pop (gradients, tiny status ticks), never as the primary action or a meaning-bearing signal.

## Typography

**Display / Body / Label Font:** Figtree (self-hosted, weights 400–800), with `ui-sans-serif, system-ui, sans-serif` fallback.

**Character:** One typeface does everything. Figtree is geometric-humanist and tech-forward; the personality comes from weight and tracking, not from a second face. Headings run tight and heavy; body runs open and readable; the eyebrow is the one place letter-spacing opens up.

### Hierarchy

The ramp runs in two tiers. **Display** sizes are per-moment and set explicitly; **text** sizes are a closed set of four steps that everything else must land on.

**Display tier** — set these values directly, and only for the moment named:

- **Marquee** (800, `clamp(56px, 11cqi, 132px)`, line-height 0.86, tracking −0.04em): The home hero, and nothing else. `cqi`, not `vw` — see The Full-Bleed Rule. The ramp is unchanged; only the box it measures is (130px at 1440 either way).
- **Specimen** (800, `82px`, 0.9, −0.04em): The Figtree specimen on the Foundations module. It is a type sample, so it is set at sample scale.
- **Band** (700, `52px`, 1.0, −0.03em): The full-bleed Midnight band headline.
- **Display** (700, `clamp(2rem, 5vw, 3.25rem)`, 1.08, −0.02em): Page titles (`PageHeader`).
- **Headline** (700, `clamp(1.5rem, 3vw, 2rem)`, 1.08, −0.02em): Section headers.
- **Card title** (700, `26px`, 1.05, −0.025em): The lead line inside a feature card.
- **Title** (600, `1.25rem`/20px, 1.2): Card titles and sub-section heads.

**Text tier** — four steps, no others:

- **Lead** (400, `17px`, 1.6): Standfirst copy under a band headline. Sparing.
- **Body** (400, `15px`, 1.5): Running text, card blurbs, prose. Keep measure around 60–75ch.
- **Label** (500–600, `14px`, 1.4): UI labels, table headers, metadata, dates.
- **Micro** (700, `11px`, 1.2): Tag and badge pills only.
- **Eyebrow** (700, `0.75rem`/12px, tracking 0.16em, UPPERCASE, green): The signature small-cap kicker. Always via `Kicker` / `CardLink` / `Aside`, never hand-rolled.

### Named Rules

**The Tight-Head Rule.** All `h1`–`h3` run at weight 700, `letter-spacing: -0.02em`, `line-height: 1.08` — matching the live ordergroove.com site. Headings are dense and assertive; never loosen them.

**The Eyebrow Rule.** Every major section opens with an ALL-CAPS eyebrow tracked to `0.16em` in green. It is the system's rhythm marker — recurring, small, and always the correct-contrast green for its surface.

**The Four-Step Rule.** Running text uses exactly four sizes: `17 / 15 / 14 / 11`, plus the 12px eyebrow. If you are reaching for a half-pixel step (`14.5px`) or a value between two of these, the answer is one of the four — the distinction you are trying to draw is a weight or colour distinction, not a size one. Display sizes are exempt, but each is named above and tied to one moment; a new display size means a new named entry here, not an ad-hoc value.

## Layout

The page is a fixed left rail and a fluid content pane. The rail is persistent from `md` (768px) up — expanded to `256px` from `xl` (1280px), and the `64px` icon form between `md` and `xl`. Off-canvas only below `md`. `--sidenav` is the width of the _track_ the rail reserves, not of the panel in it: pointing at the icon rail opens the full panel over the content, and the track never moves. The pane holds `.site-container`: centered, `1280px` max-width, `40px` inline padding, stepping down to `24px` below `md` — so the content box is `1200px` wherever there is room for it.

The rail takes its width out of the pane, not out of the container's cap, which means the container only binds once the pane exceeds 1280px. Measured, with the rail expanded:

| viewport | pane  | content box |
| -------- | ----- | ----------- |
| 1280px   | 1024  | 944         |
| 1440px   | 1184  | 1104        |
| ≥1536px  | ≥1280 | 1200        |

Collapsing the rail to its icon width returns the full 1200px from 1344px up. That is the icon rail's job — it is a width control, not a decluttering one.

Card grids use explicit column templates (e.g. `2fr 1fr 1fr` for the home color grid) or `auto-fit` with a tile floor where a group's item count varies, rather than a fixed column count that strands orphans. Spacing follows the Tailwind 4px base scale; the recurring gutter is `24px`. Multi-column grids collapse to single column at `md` (768px).

`--stick` is the sticky chrome height (`76px` — the masthead, and nothing else). It is the header's height, the rail's sticky offset, and the `scroll-margin-top` on every `.section-step` and `ModuleHead`, so the three cannot disagree and an in-page anchor always lands `--step-block` clear of the chrome.

### Named Rules

**The Rhythm Rule.** Three vertical intervals, and they double: `--step-block` 24, `--step-module` 48, `--step-section` 96, applied as `.block-step` / `.module-step` / `.section-step`. Block is a head to the content it introduces; module is related sub-modules inside one section; section is one top-level module to the next. Below `md` they compress to 20 / 40 / 72, preserving the ratio — shrinking only the section step would flatten it and put the monotony back. Anything smaller than a block step is a Tailwind 4px step inside a single block; there is no fourth interval.

**The Full-Bleed Rule.** "Full bleed" means the width of the content pane, not the viewport — the rail owns the left edge, and a surface that ran under it would be a bug, not a bleed. The pane is a container query context, so anything sized to the bleed sizes in `cqi` rather than `vw`. The home marquee is the one live case: `clamp(56px, 11cqi, 132px)`.

## Elevation & Depth

Flat by default. Surfaces sit at rest with no shadow; depth is created by **contrast and tonal layering**, not elevation — a Midnight (`.dark`) island dropped onto the light `#F5F5F8` page reads as raised purely through color, and white cards separate from the cloud-gray background the same way. Borders (`#D8D7DF` on light, white/12% on dark) do the quiet separation work.

Shadow is reserved as a **response to state**, never a resting property. Cards lift on hover with a large, soft, tinted shadow (`hover:shadow-2xl hover:shadow-og-midnight/15`) — the only place shadow appears.

### Named Rules

**The Flat-At-Rest Rule.** No surface carries a resting shadow. If you want separation, reach for a border or a tonal surface change first. Shadow appears only on hover/active, and when it does it is large, soft, and tinted toward Midnight — never a hard gray drop shadow.

## Shapes

Rounded, humane geometry with one deliberate break. Radii climb by role rather than a single global value: inputs and small chips at `6–8px`, cards at a generous `20px` (`.visual-container`), the hero island at `28px`, and buttons fully pill-shaped (`rounded-full`). The base `--radius` primitive is `10px`; the larger card/hero radii are intentional signatures, not accidents of scale.

The signature form is **the notch**: a module with three rounded corners and one square corner (`.notch-br` squares the bottom-right, `.notch-bl` the bottom-left). It is opt-in and used sparingly as a brand tell, never applied to every card. Gradients are linear at `112°`, led by the signature Green → Cyan.

**The Gradient-Angle Rule.** Every brand gradient runs at `112°` — the angle locked with the Gradient Marquee home (July 2026). It is a single value across `data/tokens.ts`, the `.bg-og-*` utilities in `styles.css`, and any inline gradient. If you are writing a gradient at any other angle, it is wrong.

### Named Rules

**The Notch Rule.** The notch (three rounded corners + one square) is a signature accent, not a default. Apply it to a hero moment or a featured tile to sign the surface as Ordergroove; do not notch every card, or it stops meaning anything. The three-door module is the worked example: all three cards sit on the same Midnight surface and only the lead one is notched. With the colour constant across the set, the notch is the sole thing marking that door — which is the notch doing more work than it did when it was one cue among two, not less. Three notched cards in a row would be a pattern, and a pattern is not a signature.

## Components

### Buttons

- **Shape:** Fully pill (`rounded-full`), weight 600.
- **Primary:** Filled in the correct-contrast green — `#009A50` on light, `#00FF85` inside a `.dark` island — with white/`#FFFFFF` (light) or Midnight (dark) text. Default size `40px` tall, `8px 24px` padding; large is `48px` / `8px 32px`.
- **Hover / Focus:** Primary darkens to `primary/90`. Focus shows a 2px `ring` in green with a 2px background-colored offset. Transition is color only (`transition-colors`).
- **Outline / Secondary / Ghost:** Outline is a transparent fill with an input-colored border, filling to `accent` on hover. Secondary uses the muted `#ECEBF2` surface. Ghost is chromeless until hover.

### Chips / Tags

- **Style:** Pill (`rounded-full`), small (`~11px` text, `4px 10px` padding). On dark islands, a `white/10` fill with white text; on light, a muted surface fill.
- **State:** Used for metadata and status ticks (e.g. contrast badges), not primary navigation.

### Section Openers

- **`SectionHead`** — a green kicker on a Midnight rule, with an optional muted `Aside` chrome tag. Home's rhythm marker; its sections are short modules you scan past.
- **`ModuleHead`** — the same rule at heading weight, for the inner routes, where the headings _are_ the scanning structure. `id` is required: it is the anchor the side nav's section list targets and the element its observer watches.

### Doors (Home)

**All three doors are Midnight — one band, not an island.** This is the hub's one deliberate exception to leading with accent islands, and the reason is the Green-Contrast Rule rather than composition. `--primary` resolves to `#00FF85` only inside a `.dark` island; on the white page it is the AA-corrected `#008040`. So while the module ran 1-dark / 2-light, two of its three doors were painting their kicker, link and diagram in the corrected green, and the module could never show the brand's actual accent more than once. An all-Midnight band is the only version of it where every door renders `#00FF85`.

The split also kept provoking one question — _why is that one different?_ — which is the tell that a distinction is decorative. The dark card was standing in for "this is the lead", a convention the page never stated. The notch now carries that, and carries it alone.

The three-door module is the one place on the hub that carries diagrams. `DoorDiagram` draws them on a shared grammar: a 240×112 field, 1px strokes, and **exactly one green element per drawing — the verb**. Guidelines measures, Downloads retrieves, Toolkit assembles. Inline SVG taking its colour from `--primary`, with `og-soft`/`white-40` stroke pairs so the component still draws correctly on either surface.

The rule the grammar enforces: a drawing has to name a verb the card's label implies. A door labelled "Downloads" gets retrieval, not a generic swoosh. If you cannot name the verb, the drawing is decoration and does not belong.

Diagram strokes carry meaning, so they owe 3:1 against their surface (SC 1.4.11). That rules out `og-border` on white (`#D8D7DF` is 1.3:1) — use `og-soft` (5.3:1) on light and `white/40` (4.6:1) on Midnight.

### Cards / Containers

- **Corner Style:** `20px` (`.visual-container`); the notch variant squares one corner.
- **Background:** White on light pages; Midnight (`.dark` island) or Dark Indigo for accent modules.
- **Shadow Strategy:** Flat at rest; `shadow-2xl` tinted toward Midnight on hover (see Elevation).
- **Border:** `#D8D7DF` on light, `white/12%` on dark.
- **Internal Padding:** `24–32px` (`px-7 py-8` on dark hero cards).

### Inputs / Fields

- **Style:** `8px` radius (`rounded-md`), transparent background, input-colored border, `36px` tall.
- **Focus:** 1px `ring` in green, no resting shadow.
- **Disabled:** 50% opacity, `not-allowed` cursor.

### Navigation

**One rail, on Midnight.** `SideNav` is the hub's only navigation surface. It groups every route by the three brand-hub modes — **Read** (Guidelines), **Grab** (Assets), **Build** (Toolkit) — and nests the active route's own headings one indent below it, so site position and page position are answered by the same element.

- **Groups** are Radix `Collapsible`, plural — more than one open at a time, all three open by default. Not an `Accordion`: with seven routes, seeing the whole map at once is the feature.
- **Sections** appear only under the active route, scroll-spied. They are contextual, not a preference, so they are never persisted.
- **The icon rail is the floor, not a hidden state.** Between `md` and `xl` the rail is always the `64px` glyph column, and above `xl` it is the user's stored preference. The rail used to vanish below 1280 behind a hamburger; a nav you cannot see is not a nav, and 64px is a price worth paying where 256px was not. Every route in `data/nav.ts` must declare an `icon`, because in this form the glyph is the only identifier.
- **Hover or focus opens it over the content.** The panel grows to `256px` and floats; the reserved track stays at `64px`, so nothing reflows under the pointer. Both the resting width and the stored preference are stamped onto `data-sidenav` before first paint, so the rail never jumps on load.
- **Below `md`** the same component renders in a drawer. One component, two containers — the previous header kept a second hand-written copy of the nav for mobile, which is how the desktop bar drifted to three links while the drawer showed seven. The drawer's trigger is bordered like the search control beside it: bare, it was the only chromeless glyph on the bar, and the control that opens the whole site map read as less interactive than the one next to it.
- **`aria-current`** has two values and they are distinct: `page` on route links, `location` on section links. Two things can be current on one page; they must not both claim it the same way.
- **The `Sys.status` line** lives in the rail's foot, not in a sticky strip under the masthead. As chrome it cost 36px of sticky height on every scroll of every page to carry one static sentence, and it was the entire reason `--stick` was 112px. The signal it carries — the hub is live, not archival — is the North Star, so this is a real reduction in its prominence, taken deliberately for the height.
- Retrieval-first: the nav's job is fast wayfinding, not decoration.

### Named Rules

**The Chrome-Island Rule.** Midnight chrome is a departure from accent islands, and it is confined to chrome. The side nav is a committed Midnight surface; the content pane is not, and no page surface inherits this. The reason it is worth the departure: on Midnight the nav's accents resolve to the real `#00FF85` through `--primary`, which the white masthead could never do. If you find yourself reaching for Midnight on a _content_ surface because "the nav does it," that is the drift this rule exists to catch.

**No Second Rail.** A page gets one navigation rail. Contents, breadcrumbs, and route lists belong in the side nav or nowhere — a right-hand contents rail plus a left nav boxes the reading column between two maps and costs more width than either is worth. Section labels live in `data/sections.ts`, keyed by path, and must match the `id` on the route's `ModuleHead`.

### Icons (Signature)

- **Material Symbols Outlined**, at the single ratified axis set: `FILL 0, wght 300, GRAD 0, opsz 24` (July 2025 brand deck, audit D12). These axes are brand law — do not tune weight or fill per use. Icons inherit the surface's correct-contrast green when used as accents.

## Do's and Don'ts

### Do:

- **Do** flip green with the surface: `#009A50` on light, `#00FF85` on dark. Let the semantic `--primary` token and `.dark` / `.light` islands do this automatically.
- **Do** open major sections with an uppercase eyebrow tracked to `0.16em` in green.
- **Do** keep headings tight — 700 weight, `-0.02em` tracking, `1.08` line-height.
- **Do** create depth with contrast, tonal surfaces, and borders; reserve shadow for hover only.
- **Do** use the notch as a sparing signature on hero or featured surfaces — one card in a set, not the set.
- **Do** reach for `.block-step` / `.module-step` / `.section-step` instead of ad-hoc vertical padding.
- **Do** render icons as Material Symbols at `wght 300, FILL 0, GRAD 0, opsz 24`.
- **Do** let retrieval win: when expression and scannability conflict, choose scannability.

### Don't:

- **Don't** put Groovy Green (#00FF85) or Laser Lemon (#EAFF00) as text on white — they fail contrast. Use `#009A50` for green on light.
- **Don't** give surfaces a resting drop shadow, and never a hard gray one.
- **Don't** notch every card, or introduce a second typeface — Figtree only.
- **Don't** lead with the secondary neons; they are decorative pop, never the primary action.
- **Don't** let the hub drift toward a gray SaaS-admin look or a static exported-PDF feel. The Midnight rail is the guard against that, not a licence for it.
- **Don't** add a second navigation rail to a page, or let Midnight leak from chrome onto a content surface.
- **Don't** draw a diagram you cannot name the verb of, and never with `og-border` strokes — they are 1.3:1 on white.
- **Don't** retune the Material Symbols axes per use — they are ratified brand spec.
