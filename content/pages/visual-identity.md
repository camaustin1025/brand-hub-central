# Visual Identity

**Route:** `/visual-identity`
**Status:** `[READY]` except `gradients`, which is `[OPEN: D3]`, and the two blocks that need new slots
**Owner:** Brand & Content
**Last reviewed:** 2026-08-04

Values on this page come from [`../tokens.md`](../tokens.md), never retyped. Every hex is
click-to-copy per project scope, which is the whole reason the drift warning exists: people
copy from screenshots.

> **Two blocks below have no slot yet.** The Phase 0 carry-over manifest puts Circles and
> Visual Containers on this page, but `src/data/sections.ts` has no ids for them. Add
> `circles` and `containers` to the `/visual-identity` array in the same commit that adds the
> blocks, or the headings render without ever highlighting in the contents rail.

**Page header**

- **Eyebrow:** Visual Identity
- **Title:** Color, logo, and the shapes we own
- **Subhead:** Click any hex to copy it. Copy from here, never from memory or a screenshot, because the near-misses are drift and not alternatives.

---

### Slot: `core`

- **Heading:** Core
- **Note:** Midnight, White, and Groovy Green. Lead with the correct-contrast green.
- **Status:** `[READY]`
- **Source:** `tokens.md` Core, style guide 5.2

Renders from `CORE` in `src/data/tokens.ts`. Four swatches, each with hex, RGB, usage, and a
measured contrast badge.

---

### Slot: `supporting-neutrals`

- **Heading:** Supporting neutrals
- **Status:** `[READY]`
- **Source:** `tokens.md` Supporting neutrals

Renders from `SUPPORTING`. Fully cleared in the audit: every value matches canon exactly.

---

### Slot: `secondary`

- **Heading:** Secondary
- **Note:** Decorative pop only, never leading. Laser Lemon is never text on white.
- **Status:** `[READY]`
- **Source:** `tokens.md` Secondary

Renders from `SECONDARY`. `#FF61D3` is Flamingo Pink as of D10.

---

### Slot: `gradients`

- **Heading:** Gradients
- **Status:** `[OPEN: D3]`: the approved set is settled, the retirements are not
- **Source:** `tokens.md` Gradients, style guide 5.2

**Body:**

> The signature is Green to Cyan on dark. Purple to Blue to Green and Orange to Yellow are
> also approved. Gradient styling is reserved for the payoff line, one per section.

**Guardrail to publish alongside them:** the web brand gradient is deliberate, separate canon
for web. It looks like a near-miss of the marketing stops. Do not correct either one toward
the other.

Pending D3: whether old-hub Gradients 3 to 8 are retired outright, and whether Gradient 7
gets re-blessed. Until then this block ships with the approved set only and a draft badge on
anything conditional.

---

### Slot: `green-legibility`

- **Heading:** Green legibility
- **Note:** The most-missed rule in the system.
- **Status:** `[READY]`
- **Source:** style guide 5.2

**Body:**

> Light background, `#009A50`. Dark background, `#00FF85`. Never green text on white.

**Structured items**, the measured matrix, computed with `src/lib/contrast.ts` so the page
can never report a ratio that disagrees with a swatch badge

| Green | On white | On Midnight |
|---|---|---|
| `#00FF85` Groovy Green | 1.34:1, fails | 13.36:1, passes AAA |
| `#009A50` Green (light-bg) | 3.66:1, large text and graphics only | (not used on dark) |

**The exception, and its boundary.** The logo rings on light backgrounds are `#00CC6A`, which
measures 2.13:1. That is a logo-only value: WCAG 1.4.11 exempts logotypes from the contrast
bars. The exemption covers the mark and nothing drawn next to it. See the logo block below.

---

### Slot: `logo`

- **Heading:** Logo
- **Status:** `[READY]` for rules. `[TO GATHER]` for minimum-size specs and rendered examples
- **Source:** style guide 5.1, written from `[TO GATHER]` on Aug 4 2026

**Body:**

> The interlocking-rings mark, from the 2022 rebrand. The logomark derives from the *o* in the
> wordmark. **Logo** means the full lockup, wordmark plus rings. **Logomark** means the rings
> alone. Keep the distinction: it is the terminology everyone downstream uses.

The old story tied the rings to a retired term. The replacement writes itself from the central
belief: subscriptions aren't programs, they're relationships, and two linked rings are what
that looks like.

**Structured items**

| Background | Ring green | Wordmark |
|---|---|---|
| Light | `#00CC6A` | Midnight `#17132F` |
| Dark (Midnight) | `#00FF85` | White |

**Sub-block: clearspace and colorways**

- Clearspace on all sides equals the width of the logomark
- Single-color, all White or all Midnight, when the background is bright or nonstandard, for print restrictions, for laser etching or engraving, and in multi-brand group graphics
- Isolated logomark default is the green mark on Midnight. On white, use the light-background ring value

**Sub-block: partnership lockups**

- X lockup or vertical-bar lockup
- Separator in Midnight, White, or Groovy Green, centered
- Spaced at 0.2x, with the x reference measured off the logo

`[TO GATHER]` Minimum-size specs. Example lockup art is blocked on D11.

---

### Slot: `misuse`

- **Heading:** Misuse
- **Status:** `[READY]` for rules, `[TO GATHER]` for rendered examples
- **Source:** style guide 5.1, Phase 0 audit §20 (KEEP verbatim)

**Structured items**, renders as a gallery, one tile per prohibition

| Don't | |
|---|---|
| Recolor outside the approved colorways | |
| Add drop shadows or effects | |
| Place at low resolution | |
| Stretch, skew, or rotate | |
| Outline the mark | |

`[TO GATHER]` Re-render each example. The rules carry verbatim; only the artwork needs
rebuilding.

---

### Slot: `circles`: NEEDS A NEW SLOT ID

- **Heading:** Circles
- **Status:** `[READY]` for rules, `[TO GATHER]` for examples
- **Source:** Phase 0 audit §23, KEEP verbatim, explicitly on the salvage list

**Body:**

> The signature background device, modeled on the logomark.

**Structured items**

| Rule | Detail |
|---|---|
| Always in pairs | A gradient circle over a solid circle. Never a single circle |
| Circle cutouts as profile frames | White inside stroke at 3% of the circle's diameter |
| Circle frames for merchant product photos | Bright, colorful, centered. Square crops are easiest to frame |

`[TO GATHER]` Example art. Every existing example carries merchant or partner logos, so
regeneration is blocked on D11.

---

### Slot: `containers`: NEEDS A NEW SLOT ID

- **Heading:** Visual containers
- **Status:** `[READY]` for rules, `[TO GATHER]` for examples
- **Source:** Phase 0 audit §24, KEEP verbatim, explicitly on the salvage list

**Body:**

> The ownable shape: a rounded rectangle with three rounded corners and one square corner. In
> a multi-container layout the hard corner must be the same corner, facing the same direction.
> Images inside a container share the treatment.

**Structured items**

| Variant | When to use it |
|---|---|
| Solid | Busy graphics |
| Gradient outline | Light backgrounds, fewer elements |
| Dropshadow | Ample negative space. Solid or gradient shadow behind the top frame |

**Worth publishing alongside it:** the product design system has no asymmetric corner at all
(Brand vs Product Audit, conflict 6), which makes this page the only living spec for the
device. That is a reconciliation to schedule, not a reason to soften the rule here.

---

## Not on this page, and why

The old typography chapters are retired: both described Soleil, which 5.3 bans by name.
Typography lives on `/tokens` instead. The old icon page is retired by D12. Illustrations are
D8 and stay off v1.

---

## Rule check

- [x] No em-dashes
- [x] No competitor named
- [x] No retired terms in live copy
- [x] Every hex traced to `tokens.md`, none retyped from memory
- [x] No trailing periods on headings or the eyebrow
- [ ] **Two slot IDs missing:** add `circles` and `containers` to `src/data/sections.ts`
