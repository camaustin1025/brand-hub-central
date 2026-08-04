# [Page name]

**Route:** `/[path]`
**Status:** `[READY]` | `[DRAFT]` | `[TO GATHER]` | `[OPEN: D#]`
**Owner:** Brand & Content
**Last reviewed:** YYYY-MM-DD

**Page header**, renders in `<PageHeader>`. Format limits from style guide 4.2 apply.

- **Eyebrow:** _(≤ 30 chars, ALL CAPS at render, no trailing period)_
- **Title:** _(≤ 60 chars, no trailing period)_
- **Subhead:** _(≤ 140 chars. If this is a hero, it must contain "subscriptions", rule 3.1.2)_

---

## Copy one block per section below. Delete the ones you don't use.

### Slot: `[slot-id]`

- **Heading:** _(what `<ModuleHead title>` shows)_
- **Note:** _(optional one-liner under the heading; keep to ~68ch of running prose)_
- **Aside:** _(optional right-side label, e.g. "locked order", or a `<DraftBadge>`)_
- **Status:** `[READY]`
- **Source:** _(e.g. "style guide 1.3" or "Phase 0 audit §23", required)_

**Body:**

> Write the block here. Prose caps at 68ch measure when rendered. Statements, not
> sentences, in anything that reads as display copy: no trailing periods on headings,
> labels, or subtitles (2.3).

**Structured items** _(only if the block renders as cards, a numbered list, or a table)_

| Field | Value |
|---|---|
| | |

---

## Rule check before marking `[READY]`

Run style guide Section 3 against every word above. These are pass/fail, not suggestions.

- [ ] No em-dashes anywhere (3.1.3)
- [ ] "Subscriptions" appears in any hero subhead (3.1.2)
- [ ] Does not lead with "AI" or "AI agents"; no "AI-powered" (3.1.1)
- [ ] "Everychannel" is one word (3.1.4)
- [ ] No competitor named, Recharge, Loop, Skio, Smartrr, Stay Ai, Bold (3.1.5)
- [ ] No "out of the box" (3.1.6) · no "heartland intelligence" (3.1.7) ·
      no "Relationship Commerce" (3.1.8)
- [ ] "build" is not the verb for adopting Ordergroove (3.1.9)
- [ ] Company is never framed as new (3.1.10)
- [ ] No AI-tells: delve, seamless, innovative, game-changing, revolutionary,
      industry-leading, cutting-edge, excited to announce, "experience" as filler (3.1.11)
- [ ] Terminology table 3.2 respected (subscribers not users; retention not churn
      prevention; recurring revenue not MRR/ARR; built for scale not enterprise-grade)
- [ ] No trailing periods on headings, titles, labels, subtitles (2.3)
- [ ] Every hex copied from `tokens.md`, never from memory or a screenshot (5.2 drift warning)
- [ ] Every block has a slot ID that exists in `src/data/sections.ts`
