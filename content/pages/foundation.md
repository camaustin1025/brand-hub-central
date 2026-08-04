# Foundation & Messaging

**Route:** `/foundation`
**Status:** `[READY]` except `boilerplate`, which is `[TO GATHER]` and needs a rewrite
**Owner:** Brand & Content
**Last reviewed:** 2026-08-04

This page is the worked example. It is filled from canon and matches what
[`src/routes/foundation.tsx`](../../src/routes/foundation.tsx) renders today, so you can
see exactly what "filled out" looks like before starting a blank one.

**Page header**

- **Eyebrow:** Foundation & Messaging
- **Title:** Who we are and what we lead with
- **Subhead:** Ordergroove is the enterprise standard for subscriptions and recurring revenue. Always ladder down from the category, never up from features.

---

### Slot: `category`

- **Heading:** The category we own
- **Status:** `[READY]` (definition itself is `[OPEN]` per style guide 1.2, leadership is still sharpening it; the working description below holds)
- **Source:** style guide 1.2, `brand.md` Positioning

**Body:**

> Our lead message is a category move, not a product pitch. **Autonomous Subscriptions**
> is the category we are defining: a team of AI agents that help enterprise brands recover
> revenue, reduce churn, and act on subscriber data faster.
>
> Cleared for external use since June 17, 2026. "Autonomous Commerce" stays internal for
> now. "Relationship Commerce" is retired, never use it.

---

### Slot: `belief`

- **Heading:** Central belief
- **Status:** `[READY]`
- **Source:** style guide 1.3

**Body:**

> Subscriptions aren't programs. They're relationships. Growth comes from flexibility, not
> lock-in, and the best retention is giving customers control, not friction.

---

### Slot: `audience`

- **Heading:** Who we serve
- **Status:** `[READY]`
- **Source:** style guide 1.4

**Body:**

> Enterprise and mid-market B2C brands with repeat purchase patterns (CPG, beauty, wellness,
> pet, food, retail, omnichannel), typically $50M+ GMV. Buyers are VP/Director of eCommerce,
> VP/Head of Digital, and retention, loyalty, CRM, and subscription leaders.

---

### Slot: `rights`

- **Heading:** Rights to Win
- **Aside:** locked order
- **Status:** `[READY]`: but see `decisions.md`, the older four-pillar framework still circulates in legacy materials (1.5 `[OPEN]`)
- **Source:** style guide 1.5, `brand.md`

**Structured items**, renders as three cards, do not reorder

| # | Title | Body |
|---|---|---|
| 01 | Everychannel Infrastructure | Subscriptions that work across every channel: in-store, digital, wholesale, and emerging surfaces. Scan to Subscribe is a proof point here. |
| 02 | The Groove Network | The data moat: 1,000+ brands, $110B+ in transaction signals, 75M+ subscriber profiles. The most diversified data network in the category. |
| 03 | Testing Velocity | Continuous experimentation at a pace no team could match alone. Agents appear by name only inside this pillar. |

---

### Slot: `ladder`

- **Heading:** The message ladder
- **Note:** Every asset starts at the top and steps down only as far as the format requires.
- **Status:** `[READY]`
- **Source:** style guide 4.1

**Structured items**, renders as a numbered list

| Rung | Body |
|---|---|
| Category | Autonomous Subscriptions, the shift in how subscription commerce works. |
| Rights to Win | Everychannel Infrastructure, The Groove Network, Testing Velocity, in that locked order. |
| Products | The agents, Workflows, GraphQL, the MCP server. |
| Proof points | Capabilities, stats, customer results. Deep-dive content only. |

---

### Slot: `boilerplate`

- **Heading:** Company boilerplate
- **Aside:** `<DraftBadge>Rewrite in progress</DraftBadge>`
- **Status:** `[TO GATHER]` as of Aug 4 2026. **The 1.7 draft does not hold and needs a
  rewrite**, so this is placeholder copy, not copy awaiting a signature. The badge should
  say rewrite, not pending approval, or readers will treat the text below as near-final.
- **Source:** style guide 1.7, superseded

**Body**, currently on the page, keep only until the rewrite lands:

> Ordergroove is the enterprise standard for subscriptions and recurring revenue, powering
> flexible subscriber experiences for 1,000+ leading brands across every channel.

The ~50-word and ~100-word versions in 1.7 fall with it. All three lengths get rewritten
together so they ladder consistently.

`[TO GATHER]` New one-liner, short, and full boilerplate. Ratified elevator pitch for sales.
Legal-approved customer names usable in boilerplate (blocked on D11).

---

## Not on this page, and why

The Phase 0 audit retired the old hub's entire Key Messaging chapter, the vision statement
was built on "Relationship Commerce" (3.1.8) and the market-map graphic named seven
competitors (3.1.5). Nothing from it was salvaged. Personas are D5: condensed cards aligned
to 1.4 with a retention/CRM leader added, if they ship in v1 at all.

---

## Rule check

- [x] No em-dashes
- [x] No competitor named
- [x] No "Relationship Commerce," "out of the box," "heartland intelligence"
- [x] Company not framed as new
- [x] No AI-tells
- [x] "Everychannel" one word
- [x] No trailing periods on headings or the eyebrow
- [x] Every slot ID exists in `src/data/sections.ts`
