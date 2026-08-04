# Design Tokens

**Route:** `/tokens`
**Status:** `[READY]` for values. `[TO GATHER]` for the downloadable kits themselves
**Owner:** Brand & Content
**Last reviewed:** 2026-08-04

The developer-facing view of the same values Visual Identity shows designers. One source,
two presentations: if this page and that one ever disagree, one of them stopped reading
`src/data/tokens.ts`.

**Page header**

- **Eyebrow:** Design Tokens
- **Title:** The canonical values, ready to pull into code
- **Subhead:** Marketing canon. Product reconciliation is a separate decision and deliberately out of scope here.

---

### Slot: `kits`

- **Heading:** Downloadable token kits
- **Status:** `[TO GATHER]`: the values exist, the generated files do not
- **Source:** Phase 0 carry-over manifest, Downloads

**Body:**

> Generated from the verified values below, so a kit can never drift from the page that
> documents it.

**Structured items**

| Kit | Format | State |
|---|---|---|
| `tokens.json` | JSON | Generate. Rows in `assets.csv` |
| `tokens.css` | CSS custom properties | Generate. Rows in `assets.csv` |
| Font kit | TTF, zipped | Figtree static weights already sit in `~/Desktop/Projects/brand-hub/assets/` |
| Logo kit | SVG, EPS, PNG | Unblocked by D1. Needs the batch export from Figma |

---

### Slot: `core-color`

- **Heading:** Core color
- **Status:** `[READY]`
- **Source:** [`../tokens.md`](../tokens.md)

Renders from `COLOR_GROUPS`. Click-to-copy hex on every swatch.

**Publish the contrast rule at the top of this block, not the bottom.** It is the most-missed
rule in the system, and a developer scanning for a hex will take the first green they see:

> Light background `#009A50`. Dark background `#00FF85`. Never green text on white.

**Sub-block: the ramps**

| Ramp | Values |
|---|---|
| Neutrals | Gray-100 `#17132F` · 200 `#2E2A47` · 300 `#4F4A6A` · 400 `#666279` · 500 `#787688` · 600 `#9896A7` · 700 `#ABA9BA` · 800 `#D8D7DF` · 900 `#EBEAF0` · 950 `#F5F5F8` |
| Greens | Green-300 `#009A50` (corrected per D2) · Green-400 `#00CC6A` (ramp step only, no on-light role) · Green-500 `#00FF85` |

**Sub-block: the drift warning**

> Near-miss hexes `#0b0820`, `#0B0E22`, `#14102a`, `#7bfa92` are drift from old site scrapes,
> not alternatives. Copy from this page, never from memory or a screenshot.

**Note the one exception explicitly**, or someone will find `#00CC6A` in a logo SVG and
assume it is a palette green: `#00CC6A` applies to the logo rings on light backgrounds and to
nothing else.

---

### Slot: `type`

- **Heading:** Type
- **Status:** `[READY]`
- **Source:** style guide 5.3

**Structured items**

| Item | Value |
|---|---|
| Typeface | Figtree, everywhere |
| Weights | 400 / 500 / 600 / 700 / 800 |
| Exception | Cormorant, campaign cards only |
| Forbidden | Arial, Helvetica, Calibri, Soleil, and any silent fallback to them |
| Eyebrow | 12px, ALL CAPS, 0.16em letter-spacing |
| H1 | 40 to 44px |
| Subhead | 21px |
| Body | 15px |
| Casing | Title Case on titles. ALL CAPS with tracking on eyebrow labels |
| Periods | None on headlines, titles, labels, subtitles |
| Emoji | Never, in designed materials |

**Publish this line, because it kills a recurring question:** Figtree is a free Google Font
and works natively in Google Workspace, so no substitute font is needed anywhere. The old
Inter-for-Google-Suite workaround is retired, and it is the documented root of the
brand/product font split.

**Sub-block: format limits** (4.2), same table as `/voice`, repeated here because developers
building templates need it and will not think to look on a voice page.

| Element | Limit |
|---|---|
| H1 | ≤ 60 characters |
| Subhead | ≤ 140 characters, must contain "subscriptions" if hero |
| CTA | ≤ 24 characters |
| Wire / PR summary | 155 characters |
| Meta description | ~155 characters |

---

### Slot: `gradients`

- **Heading:** Gradients
- **Status:** `[OPEN: D3]` for the retirements, `[READY]` for the approved set
- **Source:** [`../tokens.md`](../tokens.md)

Renders from `GRADIENTS` with copyable CSS on each.

| Name | CSS | Status |
|---|---|---|
| Signature (Green → Cyan) | `linear-gradient(112deg, #00FF85, #00FAFF)` | signature |
| Purple → Blue → Green | `linear-gradient(112deg, #7821F5, #71ACFF, #00FF85)` | approved |
| Orange → Yellow | `linear-gradient(112deg, #FF8500, #EAFF00)` | approved |
| Web brand gradient | `linear-gradient(112deg, #E0FE00, #0BFE5F, #00FEFE)` | web |

**Usage rule to publish with them:** gradient styling is reserved for the payoff line, one per
section.

---

## Scope note to publish on the page

Product reconciliation is explicitly out of scope. The Brand vs Product Audit documents where
the two systems diverge, and picking a shared token source is a later decision. This page is
marketing canon, and saying so prevents a developer from treating it as the product system.

---

## Rule check

- [x] No em-dashes
- [x] No competitor named
- [x] Every value traced to `../tokens.md`
- [x] The `#00CC6A` exception stated with its boundary
- [x] No trailing periods on headings or the eyebrow
- [x] Every slot ID exists in `src/data/sections.ts`
