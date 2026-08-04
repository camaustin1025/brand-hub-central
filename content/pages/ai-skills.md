# AI & Skills

**Route:** `/ai-skills`
**Status:** `[READY]` for what exists. `[TO GATHER]` for the assistant
**Owner:** Brand & Content
**Last reviewed:** 2026-08-04

Net-new. No old-hub content exists for this page, which means nothing to audit and nothing to
retire, but also no structure to inherit.

**The argument the page makes:** the end state is a guide that enforces itself. On-brand
becomes the default output rather than a review outcome. Everything below is a step toward
that, so the page reads as a roadmap with the finished parts already usable.

**Page header**

- **Eyebrow:** AI & Skills
- **Title:** The tools that keep work on brand from the first draft
- **Subhead:** A brand review that catches mistakes after the fact is a brand review that happened too late.

---

### Slot: `available`

- **Heading:** Available now
- **Status:** `[READY]`
- **Source:** style guide 9, "Already in place"

**Structured items**, one card per skill

| Skill | What it does | Reach for it when |
|---|---|---|
| `brand.md` | The canonical agent-facing brand context, imported into active project CLAUDE.md files | Any session doing Ordergroove work. It loads itself |
| `ordergroove-slides` | On-brand decks with bundled fonts and design tokens | Any deck or presentation |
| `ordergroove-doc` | On-brand Word docs. Also reformats an existing doc to match | Any memo, one-pager, brief, or doc deliverable |
| `v2linkedinpost` | LinkedIn drafting against the voice and the post templates | Any LinkedIn post, including editing a draft |

**Publish this caveat with the table**, because it is the difference between the tools
working and quietly not working: these skills read `brand.md`. If the copy in
`~/Documents/claude-prompt-library/` drifts from `content/canon/`, sessions produce
confidently off-brand work with no error to catch it. The sync rule is in
[`../README.md`](../README.md).

---

### Slot: `assistant`

- **Heading:** The brand assistant
- **Status:** `[TO GATHER]`: proposed, not built
- **Source:** style guide 9, "Proposed next step"

**Body:**

> A unified `ordergroove-brand` skill that any employee's session loads automatically, so the
> guide enforces itself rather than being something people are supposed to remember.

**Structured items**, the build, in order

| Step | What it does |
|---|---|
| 1 | This guide becomes the skill's reference layer, with Section 3 extracted into a machine-checkable rules file: one rule per line, each with a pass/fail test |
| 2 | `SKILL.md` triggers on any Ordergroove copy, visual, deck, social, PR, or web task, and applies the rules as pass/fail checks on the FIRST draft, not the final one |
| 3 | The existing doc, slides, and LinkedIn skills import the same rules file rather than duplicating rules, so a rule changed once propagates everywhere |
| 4 | A verify step greps the skill's own output for banned strings before returning: em-dashes, "out of the box," "AI-powered," competitor names, near-miss hexes |
| 5 | Distribution through the company plugin marketplace, so sales and CS sessions get the same guardrails |

**Step 3 is the load-bearing one.** Today the rules are duplicated across three skills, which
means a rule change is three edits and a rule that gets changed twice is a rule that now
disagrees with itself. That is the same failure mode as three greens on white.

`[TO GATHER]` Scope and timeline. This is a build, not a content gather, so it needs an owner
and a slot in the roadmap before it belongs on the page as more than a stated intent.

---

## Known consistency debts to surface here

Style guide 9 lists these, found while assembling the guide. They belong on this page because
they are exactly what an enforcing skill would have caught:

- The live Summer 2026 Drop page contains "100+ out-of-the-box triggers and nodes" in the Workflows section, and em-dashes throughout the copy deck. Both violate Section 3
- The foundation copy says "15+ years" while positioning canon says 16 years old. Recommended convention: "15+ years" in copy, "founded 2010" and "16 years" in facts
- The wiki voice page still lists the older Rights to Win names, "Every Channel Architecture" and "Experimentation Velocity"

Publishing the debts is the point. A page that claims the system is clean while three known
violations sit in live copy teaches people the rules are decorative.

---

## Rule check

- [x] No em-dashes
- [x] No competitor named
- [x] Does not lead with AI. The page is about AI tools, and the headline leads with the outcome
- [x] Banned phrases appear only as quoted examples of violations
- [x] No trailing periods on headings or the eyebrow
- [x] Every slot ID exists in `src/data/sections.ts`
