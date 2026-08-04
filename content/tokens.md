# Token intake

Columns here are the exact fields of the types in
[`src/data/tokens.ts`](../src/data/tokens.ts). A filled row converts without translation.

Every value below is already verified hex-by-hex against `brand.md` and style guide 5.2 in
the Phase 0 audit. **You are confirming, not writing.** Only the rows carrying a `D#` need
a decision.

**Drift warning (5.2):** near-miss hexes `#0b0820`, `#0B0E22`, `#14102a`, `#7bfa92` are
drift from old site scrapes, not alternatives. Copy from this file, never from memory or a
screenshot.

---

## Colors

`onLight` / `onDark` record the brand's *intent* — where a value is approved to appear,
including as a fill or at large sizes. They do **not** drive the contrast badge on
`<Swatch>`; that verdict is measured from the hex at runtime, because these flags disagreed
with the measured ratio on six swatches. Editing a flag will not change what a badge says.

### Core

> Lead with the correct-contrast green: `#009A50` on light, `#00FF85` on dark.

| name | hex | rgb | usage | onLight | onDark |
|---|---|---|---|---|---|
| Midnight | `#17132F` | 23, 19, 47 | Primary dark background. Heading and body text on light. Never pure black. | ✅ | ❌ |
| White | `#FFFFFF` | 255, 255, 255 | Light backgrounds. Text and logo on dark. | ❌ | ✅ |
| Groovy Green | `#00FF85` | 0, 255, 133 | Accent on DARK backgrounds only. Fails contrast as text on white. | ❌ | ✅ |
| Green (light-bg) | `#009A50` | 0, 154, 80 | The green to use on LIGHT backgrounds. | ✅ | ❌ |

### Supporting neutrals

Fully cleared in the audit — every value matches canon exactly.

| name | hex | rgb | usage | onLight | onDark |
|---|---|---|---|---|---|
| Dark Indigo | `#2E2A47` | 46, 42, 71 | Muted surfaces on dark. Subtitle/muted text on light. | ✅ | ✅ |
| Muted | `#4F4A6A` | 79, 74, 106 | Text tone on light. | ✅ | ❌ |
| Soft | `#666279` | 102, 98, 121 | Secondary text tone on light. | ✅ | ❌ |
| Border | `#D8D7DF` | 216, 215, 223 | Borders and dividers on light. | ❌ | ❌ |
| Subtitle on dark | `#EBEAF0` | 235, 234, 240 | Subtitle text on dark surfaces. | ❌ | ✅ |

### Secondary

> Decorative pop only, never leading. Laser Lemon is never text on white.

| name | hex | rgb | usage | onLight | onDark |
|---|---|---|---|---|---|
| Intense Cyan | `#00FAFF` | 0, 250, 255 | Decorative accent. | ❌ | ✅ |
| Laser Lemon | `#EAFF00` | 234, 255, 0 | Decorative accent. Never text on white. | ❌ | ✅ |
| Neon Carrot | `#FF8500` | 255, 133, 0 | Decorative accent. | ✅ | ✅ |
| Radiant Radish | `#D32E55` | 211, 46, 85 | Decorative accent. | ✅ | ✅ |
| Flamingo Pink | `#FF61D3` | 255, 97, 211 | Decorative accent. | ✅ | ✅ |
| Electric Eggplant | `#8500FF` | 133, 0, 255 | Decorative accent. | ❌ | ✅ |

---

## Ramps

Carried from the old hub as chart and tint reference. The neutrals ramp is cleared value
for value. The green ramp holds the one real drift the audit was hunting.

**Neutrals:** Gray-100 `#17132F` · Gray-200 `#2E2A47` · Gray-300 `#4F4A6A` ·
Gray-400 `#666279` · Gray-500 `#787688` · Gray-600 `#9896A7` · Gray-700 `#ABA9BA` ·
Gray-800 `#D8D7DF` · Gray-900 `#EBEAF0` · Gray-950 `#F5F5F8`

**Greens:** Green-300 is `#009A50`, corrected from the old ramp's `#009950` (D2, settled
Aug 4 2026). Green-500 `#00FF85` matches. Green-400 `#00CC6A` demotes to a ramp step and
loses its on-light role: the 5.2 contrast rule replaces the old "Green-400 is for use on
light backgrounds" note.

---

## Gradients

`status` maps to the `Gradient` type: `signature` | `approved` | `web`.

| name | css | stops | status |
|---|---|---|---|
| Signature (Green → Cyan) | `linear-gradient(112deg, #00FF85, #00FAFF)` | `#00FF85`, `#00FAFF` | signature |
| Purple → Blue → Green | `linear-gradient(112deg, #7821F5, #71ACFF, #00FF85)` | `#7821F5`, `#71ACFF`, `#00FF85` | approved |
| Orange → Yellow | `linear-gradient(112deg, #FF8500, #EAFF00)` | `#FF8500`, `#EAFF00` | approved |
| Web brand gradient | `linear-gradient(112deg, #E0FE00, #0BFE5F, #00FEFE)` | `#E0FE00`, `#0BFE5F`, `#00FEFE` | web |

**Guardrail:** the web brand gradient is deliberate, separate canon for web. It looks like a
near-miss of the marketing stops. Do not "correct" either one toward the other.

**Retired `[OPEN: D3]`:** old-hub Gradients 3–8. Four use off-palette colors — `#E90052`
(a floating red, distinct from Radiant Radish `#D32E55`) and `#F669A7` (a pink in no
palette). Gradient 7 (`#00FAFF` → `#8500FF`) is built from canon colors if you want to
re-bless it.

---

## Typography

Source: style guide 5.3. Figtree TTFs already sit in
`~/Desktop/Projects/brand-hub/assets/`.

| Item | Value |
|---|---|
| Typeface | Figtree, everywhere |
| Weights | 400 / 500 / 600 / 700 / 800 |
| Exception | Cormorant, campaign cards only |
| Forbidden | Arial, Helvetica, Calibri, Soleil, and any silent fallback to them |
| Eyebrow | 12px, ALL CAPS, 0.16em letter-spacing |
| H1 | 40–44px |
| Subhead | 21px |
| Body | 15px |
| Casing | Title Case on titles; ALL CAPS with tracking on eyebrows |
| Periods | None on headlines, titles, labels, subtitles |
| Emoji | Never, in designed materials |

Figtree is a free Google Font and works natively in Google Workspace, so no substitute font
is needed. The old hub's Inter-for-Google-Suite page is retired — it is the documented root
of the brand/product font split, and republishing it would re-seed the drift.

---

## Format limits

Source: style guide 4.2. These belong in the hub because writers hit them daily.

| Element | Limit |
|---|---|
| H1 | ≤ 60 characters |
| Subhead | ≤ 140 characters, must contain "subscriptions" if hero |
| CTA | ≤ 24 characters |
| Wire / PR summary | 155 characters (characters, not words) |
| Meta description | ~155 characters |

---

## Logo values

**The ring green on light backgrounds is `#00CC6A`, a documented logo-only exception**
(D1, settled Aug 4 2026 against the Figma master).

**This does not modify the 5.2 contrast rule.** `#00CC6A` is not a palette color and has
exactly one job. Everything that is not the mark, text, icons, buttons, borders, and every
other graphical element, still takes `#009A50` on light. Treating `#00CC6A` as a general
green is how the system ended up with three of them.

WCAG 1.4.11 carries an explicit logotype exception, so the mark is out of scope for the
contrast bars that govern the rest of the palette.

| Asset | What it is | Ring green | State |
|---|---|---|---|
| `logo-white.png` | Full lockup, Midnight wordmark plus rings | `#00CC6A` | Correct as shipped |
| `ordergroove-logomark-light-bgs.png` | Isolated logomark, rings only | `#00CC6A` | Correct as shipped |
| `logo-dark.png` | Full lockup on Midnight | `#00FF85` | Correct as shipped |

`[TO GATHER]` Style guide 5.1 is still empty. It wants: primary and secondary lockups,
clearspace and minimum-size specs, approved color variants per background, misuse gallery.
Source from the Figma design system.

Already cleared and carrying verbatim from the old hub: geometry story, logo vs logomark
distinction, clearspace equals the logomark's width, single-color logic, the partnership
lockup system, and the full misuse gallery.
