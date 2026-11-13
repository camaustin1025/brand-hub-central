# Brand vs. Product Audit — Ordergroove

**Sources:** *Og – Branding Updates* (July 2025 brand guidelines, 10 pp.) vs. *Groovy Design System / GDS* (product UI design system, 35 pp.)
**Third input:** pre-analyzed conflict summary (on Desktop)
**Compiled:** July 16, 2026

---

## The one-line framing

These aren't two versions of the same guide. The **Branding Updates deck is a marketing brand guide** (font, color, logo, photography, chart style). The **GDS is a product UI design system** (tokens, ramps, components, contrast grading). Most differences between them are just *scope*, and that's fine. What matters is the handful of places where they genuinely disagree on the **shared foundation — font, green, and shape** — because those produce visibly different output when a marketing asset and the live product sit side by side.

Bonus for leadership: each system is strong exactly where the other is weak. The brand deck has the signature look but no tokens, type scale, or accessibility targets. The GDS has all of those but doesn't render the brand's signature font, green, or shape. They evolved separately — different owners, no shared token source — and drifted.

---

## The conflicts

### 1. Typography — three fonts across three documents

| | Specifies |
|---|---|
| **Brand deck** | **Figtree** — "unifying all of our internal and external communications with a consistent brand font." Explicitly **sunsetting Soleil** ("on the web and in print") and telling teams **not** to use Helvetica/Arial unless Figtree is unavailable. |
| **Product (GDS)** | **Inter** — the primary Heading, Body, and Button pages all specify "Inter Font Family." The GDS carries a second, **grayed-out alternate set built on Soleil** (Heading Scale "Soleil Font Family"). So the product treats **Inter as primary and Soleil as the fallback** — the exact inverse of the brand deck. Figtree appears nowhere in the GDS. |
| **Current canon (brand.md)** | **Figtree** everywhere. |

**Practical impact:** The marketing spec says Figtree, the product ships on Inter, and the product's documented fallback is **Soleil — the very font the brand is sunsetting.** A landing page and the in-app screen it advertises are set in two different typefaces. Three fonts, three documents, no single source of truth.

### 2. Typography — the H1 / type scale doesn't line up

- **GDS (Inter):** H1 = Semi Bold, **36 px** / 46 line-height / −0.3 tracking. Five headings on a strict 4px scale.
- **GDS (Soleil alternate):** H1 = Bold, **36 px** / 44 line-height.
- **Brand canon (brand.md):** H1 ≈ **40–44 px**.

**Practical impact:** At least three different "official" H1 specs. Even after you pick a font, headline sizing won't match between a marketing template and the product.

### 3. Color — the product green is **not** the brand's signature green ⚠️ *(the important one)*

- **Brand signature — Groovy Green `#00FF85`** (neon, RGB 0 255 133). The hero color on the title slide, the logo mark, the gradients.
- **Product UI green — the GDS "secondary" ramp** tops out at **`#2EDC76`** (secondary-400) / **`#23CE6B`** (secondary-500) — a noticeably **muted, desaturated green.** The neon `#00FF85` appears **only** on the GDS "Marketing Colors" page, walled off from the interface palette.

**Practical impact:** The live product **does not render the brand's signature color.** Put a marketing asset and the app side by side and you see two different greens. This is very likely deliberate — `#00FF85` fails text-contrast on white (WCAG), which is why it's kept out of the UI ramp — but the *result* is a visible brand-to-product gap on the single most recognizable color the company owns.

### 4. Color — there are ~four green families in play

- Brand primaries alone carry **two** greens: **Green `#008847`** and **Groovy Green `#00FF85`**.
- GDS adds a **muted "secondary" ramp** (`#DCF9E8 → #157A3F`) used in the UI…
- …and a separate **"success" ramp** (`#F2FFF9 → #0D1813`).

**Practical impact:** "Ordergroove green" isn't one value — it's four families depending on which document and surface you're on. No shared token ties them together.

### 5. Color — three floating reds

- `#D32E55` ("Radiant Radish," from the earlier brand audit)
- `#E90052` (appears in brand gradient art)
- `#E90050` (GDS product/marketing "Red")

**Practical impact:** Near-identical reds with different lineages and no canonical token. Low visual severity, but it's the kind of drift that multiplies.

### 6. Shape language — asymmetric brand device vs. uniform product radius ⚠️

- **Brand:** the ownable **"Visual Container"** — an asymmetric rounded shape (**three rounded corners + one square corner**) plus the **paired-circle motif** (the logo is two interlocking circles; photos sit in circles; semicircles anchor the layouts).
- **Product (GDS):** "we use a **single radius type (rounded square)**." Radius tokens are uniform — **4 / 8 / 12 / 16 / 20 px** (`$OG-radius-1x`–`5x`). **No asymmetric corner. No circles.**

**Practical impact:** The product expresses **none** of the brand's signature shape. The one visual device meant to be instantly "Ordergroove" doesn't exist in the interface.

### 7. Icons

- **Brand:** **Material Symbols**, Weight 300, Fill Off, Grade Normal; "bigger concepts require a custom icon solution." Rendered in Dark Indigo.
- **Product (GDS):** references icon slots (`-icon`, `-leading-icon`, `-trailing-icon`) but **doesn't document a weight/fill/grade spec.**

**Practical impact:** No conflict in intent, but the brand's icon rules aren't carried into the product system — so icon weight/style can drift per screen.

### 8. Spacing — brand has none; product is irregular

- **Brand:** no spacing/grid system defined.
- **Product (GDS):** a base-4 scale, but it **jumps** — 0, 4, 8, 12, 16, 20, 24, then **64, 80, 120 px** (`$OG-space-0x`–`9x`), skipping 32/48. A GDS contributor note even flags "not having a multiple of 4 or 6 on grids/spacing."

**Practical impact:** Marketing and product can't share spacing rules (one has none), and the product scale itself has gaps that invite off-system values.

### 9. Shadow / elevation — product-only, built on Midnight

- **Product (GDS):** five shadow tokens (`$OG-shadow-card`, `-base-m`, `-base-l`, `-button-default`, `-button-pressed`), all built on **Midnight `#17132F`** at low opacity.
- **Brand:** no shadow system.

**Practical impact:** Depth/elevation only exists on the product side. Not a clash, but another axis the brand deck simply doesn't cover.

### 10. Accessibility rigor — the inverse gap

- **Product (GDS):** computes **WCAG AA/AAA pass-fail on every color step**, for both light and dark surfaces.
- **Brand:** **no accessibility targets.** Its hero color `#00FF85` fails text contrast — which is exactly why the product quietly dropped it from the UI ramp.

**Practical impact:** The two systems are strong in opposite places. This is the crux of the leadership story: the fix isn't "one is wrong," it's "merge the strengths onto one token source."

### 11. Chart / data-viz palette

- **Brand:** a full **rainbow chart system** (greens, cyan, lemon, olive, orange, brown, purple, blues) for marketing decks.
- **Product (GDS):** no categorical data-viz palette — only semantic ranges (success/warning/error/base).

**Practical impact:** In-product charts have no brand-sanctioned categorical palette to pull from, so dashboards will improvise.

---

## Where they actually agree (say this out loud)

- **Midnight `#17132F` is the shared anchor.** GDS base-800 = `#17132F`, and every product shadow is built on it. The one foundation both systems hold identically.
- **The secondary / marketing palette matches.** GDS "Marketing Colors" (Cyan `#00FAFF`, Laser Lemon `#EAFF00`, Orange/Neon Carrot `#FF8500`, Flamingo/Pink `#FF61D3`, Eggplant/Purple `#8500FF`) line up with the brand secondaries.

---

## Caveats — don't treat the GDS as gospel either

- **Unfinished template placeholders** left in: "Describe your destructive color range" on the Neutral page; "success color range" on the **Tertiary page, which is actually blue** (`#0511F2`-family).
- **Wrong worked example:** the Design-tokens page shows `#80F3BB = $OG-color-base-400`, but the Base table says base-400 = **`#686678`** (a grey).
- **Inconsistent token casing:** `$OG-color-base-400` vs. `$og-color-base-100`.
- **Duplicate token:** error-50 and error-100 both map to `$og-color-error-100`.

---

## Root cause

Different owners, no shared token source. The **GDS is credited to Cameron Robinson & Davi Shamá**; the **Brand Hub to Zack Jenkins.** Two strong systems, built in parallel, with nothing tying their color/type values together — which is precisely how they drifted apart on font, green, and shape.

## Recommendation (one move)

Establish a **single shared token source** and reconcile the three foundations first: pick one primary font (Figtree vs. Inter), decide whether the product may express Groovy Green `#00FF85` anywhere (or define the approved accessible substitute), and decide whether the brand's asymmetric container/circle shape enters the component library. Everything else is downstream of those three.
