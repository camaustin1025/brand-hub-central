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
    fontSize: "clamp(56px, 9vw, 132px)"
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
rounded:
  sm: "6px"
  md: "8px"
  lg: "10px"
  card: "20px"
  hero: "28px"
  full: "9999px"
spacing:
  gutter: "24px"
  section: "72px"
  container-max: "1200px"
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
- **Ink on Dark** (#EBEAF0): Body and subtitle text on Midnight surfaces.

### Named Rules

**The Green-Contrast Rule.** Green is never one color. On light backgrounds it is `#009A50`; on Midnight it is `#00FF85`. This is structural, not stylistic — the semantic `--primary` token flips with the surface, so green never renders as an illegible text color on white. Any nested Midnight island (`.dark`) resolves green to `#00FF85`, and any light module inside it (`.light`) resolves back to `#009A50`.

**The One-Green Accent Rule.** The brand green is the voice, not the wallpaper. Lead every colored moment with the correct-contrast green; the secondary neons appear only as decorative pop (gradients, tiny status ticks), never as the primary action or a meaning-bearing signal.

## Typography

**Display / Body / Label Font:** Figtree (self-hosted, weights 400–800), with `ui-sans-serif, system-ui, sans-serif` fallback.

**Character:** One typeface does everything. Figtree is geometric-humanist and tech-forward; the personality comes from weight and tracking, not from a second face. Headings run tight and heavy; body runs open and readable; the eyebrow is the one place letter-spacing opens up.

### Hierarchy

The ramp runs in two tiers. **Display** sizes are per-moment and set explicitly; **text** sizes are a closed set of four steps that everything else must land on.

**Display tier** — set these values directly, and only for the moment named:

- **Marquee** (800, `clamp(56px, 9vw, 132px)`, line-height 0.86, tracking −0.04em): The home hero, and nothing else.
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

Content is centered in a `1200px` max-width container (`.site-container`) with `24px` inline padding. Vertical rhythm between major sections runs large — roughly `64–72px` (`pt-16` / `pt-[72px]`) — giving the page an unhurried, scannable cadence. Card grids use explicit column templates (e.g. `2fr 1fr 1fr` with fixed `150px` rows for the color grid) rather than uniform auto-fit, so featured items get more room. Spacing follows the Tailwind 4px base scale; the recurring gutter is `24px`. Responsive shifts happen mainly at the `md` (768px) breakpoint: multi-column grids collapse to single column, and hero padding steps down from `88px` to `64px` vertical.

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

**The Notch Rule.** The notch (three rounded corners + one square) is a signature accent, not a default. Apply it to a hero moment or a featured tile to sign the surface as Ordergroove; do not notch every card, or it stops meaning anything.

## Components

### Buttons

- **Shape:** Fully pill (`rounded-full`), weight 600.
- **Primary:** Filled in the correct-contrast green — `#009A50` on light, `#00FF85` inside a `.dark` island — with white/`#FFFFFF` (light) or Midnight (dark) text. Default size `40px` tall, `8px 24px` padding; large is `48px` / `8px 32px`.
- **Hover / Focus:** Primary darkens to `primary/90`. Focus shows a 2px `ring` in green with a 2px background-colored offset. Transition is color only (`transition-colors`).
- **Outline / Secondary / Ghost:** Outline is a transparent fill with an input-colored border, filling to `accent` on hover. Secondary uses the muted `#ECEBF2` surface. Ghost is chromeless until hover.

### Chips / Tags

- **Style:** Pill (`rounded-full`), small (`~11px` text, `4px 10px` padding). On dark islands, a `white/10` fill with white text; on light, a muted surface fill.
- **State:** Used for metadata and status ticks (e.g. contrast badges), not primary navigation.

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

- Grouped by the three brand-hub modes — **Read** (Guidelines), **Grab** (Downloads), **Build** (Toolkit). Labels in Figtree label weight; active/hover states in the correct-contrast green. Retrieval-first: the nav's job is fast wayfinding, not decoration.

### Icons (Signature)

- **Material Symbols Outlined**, at the single ratified axis set: `FILL 0, wght 300, GRAD 0, opsz 24` (July 2025 brand deck, audit D12). These axes are brand law — do not tune weight or fill per use. Icons inherit the surface's correct-contrast green when used as accents.

## Do's and Don'ts

### Do:

- **Do** flip green with the surface: `#009A50` on light, `#00FF85` on dark. Let the semantic `--primary` token and `.dark` / `.light` islands do this automatically.
- **Do** open major sections with an uppercase eyebrow tracked to `0.16em` in green.
- **Do** keep headings tight — 700 weight, `-0.02em` tracking, `1.08` line-height.
- **Do** create depth with contrast, tonal surfaces, and borders; reserve shadow for hover only.
- **Do** use the notch as a sparing signature on hero or featured surfaces.
- **Do** render icons as Material Symbols at `wght 300, FILL 0, GRAD 0, opsz 24`.
- **Do** let retrieval win: when expression and scannability conflict, choose scannability.

### Don't:

- **Don't** put Groovy Green (#00FF85) or Laser Lemon (#EAFF00) as text on white — they fail contrast. Use `#009A50` for green on light.
- **Don't** give surfaces a resting drop shadow, and never a hard gray one.
- **Don't** notch every card, or introduce a second typeface — Figtree only.
- **Don't** lead with the secondary neons; they are decorative pop, never the primary action.
- **Don't** let the hub drift toward a gray SaaS-admin look or a static exported-PDF feel.
- **Don't** retune the Material Symbols axes per use — they are ratified brand spec.
