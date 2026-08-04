# Open decisions

**Status: 12 of 17 answered, August 4 2026.** Five remain, listed first.

Sources: `Phase 0 - Old Hub Content Audit.md` (D1–D13, A1–A12) and the
`[TO GATHER]` / `[OPEN]` / `[DRAFT]` flags still live in `brand-style-guide.md` v0.1.

---

## Still open

Four of these need someone other than you. One is yours.

### Yours

- [ ] **D3. Gradient family.** Retire old-hub Gradients 3–8, keep 1–2, generate the
      approved Orange → Yellow. Gradient 7 (`#00FAFF` → `#8500FF`) is built from canon
      colors if you want to re-bless it. → *Recommended:* retire all six.
      **Answer:** ______

### Blocked on other people

- [ ] **D11. Legal-approved merchant list.** Which merchant names and logos are cleared for
      About-page mentions, lockup examples, and circle/container example art. Also confirm
      the partner collage's "loop" logo is Loop Returns, not the competitor (rule 3.1.5).
      **Blocks every example-art regeneration and asset A11.**
      **Answer:** ______

- [ ] **D5. Personas.** Ship in v1 or defer to v1.5? Strip the demographic blocks down to
      role plus pains? Regenerate or drop the portraits, which look AI-generated and
      violate the hub's own photography rules? → *Recommended:* condensed cards aligned to
      style guide 1.4 with a retention/CRM persona added, demographics stripped, no portraits.
      **Answer:** ______

- [ ] **D13. Executive headshots.** Current leadership roster plus clearance. Gates asset A8.
      **Answer:** ______

- [ ] **`#brand` Slack channel name.** Style guide 8.3 still marks this confirm. It is the
      contact line on the hub's Home page.
      **Answer:** ______

---

## Answered

### Tier 1

- [x] **D1. Logo ring green on white** → **`#00CC6A`, as a documented logo-only exception**
      Figma holds `#00CC6A`, and the Figma master is the arbiter. This is option (a) in the
      audit, and it was the audit's own first recommendation.

      **Why it is legitimate despite measuring 2.13:1 on white:** WCAG 1.4.11 carries an
      explicit logotype exception, so brand marks are out of scope for the contrast bars.
      The rings are a mark, not a UI element.

      **The boundary that keeps this from re-seeding drift:** `#00CC6A` is for the logo
      rings and nothing else. It is not a palette color. Text, icons, buttons, borders, and
      every other graphical element on a light background still take `#009A50`, which is
      the 5.2 contrast rule and is not modified by this exception.

      **Consequence:** the shipping assets are already correct. `logo-white.png` and
      `ordergroove-logomark-light-bgs.png` both measure `#00CC6A` and need no re-export.
      **Asset A1, the logo kit, is fully unblocked.**

- [x] **D2. Green-300 ramp value** → **`#009A50`**
      Corrects the old ramp's `#009950`. Applied to `content/tokens.md`.

- [x] **D10. Name for `#FF61D3`** → **Flamingo Pink**
      Applied to `src/data/tokens.ts` and `content/tokens.md`.
      **Canon-sync owed:** `brand.md` already says "Flamingo Pink" in both locations, so it
      is correct as-is. The style guide's 5.2 says "Flamboyant Flamingo" and is the file
      that needs the edit.

- [x] **D12. Icon standard** → **Material Symbols, Weight 300, Fill Off, Grade Normal, Dark Indigo**
      Retires the old custom outlined set, whose own roadmap (a filled set) contradicted the
      ratified Fill Off. Publish as a block on Visual Identity.

- [x] **Where the style guide lives** → **the Brand Hub**
      Style guide 8.3 needs updating from `[LOCATION TBD]` to point here.

### Tier 2

- [x] **D4. Verbal Persona chapter** → **retire both the celebrity and the archetype**
      Style guide 2.1's "confident operator in the room" supersedes it. Nothing carries.

- [x] **D6. 2022 proof claims** → **drop them, 4.3 is the live set**
      Removes "CLTV up to 4X," CB Insights, Forbes/MarTech/Diginomica from circulation.

- [x] **D7. "Subscriptions for serious brands"** → **live tagline**
      Consequence: the old About banner art is reusable, and the tagline can appear on the
      hub. It clears Section 3 as written, no AI lead, no hype adjective, subscriptions
      named, no trailing period.

- [x] **D9. Photography AI rule** → **keep the spirit, reword for 2026**
      Proposed wording: "Nothing that reads as AI generated or over manipulated. AI assisted
      retouching is fine." Replaces the blunt 2022 ban on "AI-generation styles."

- [x] **Company boilerplate** → **needs a rewrite**
      Not simply awaiting Lauren. The 1.7 draft does not hold, so the one-liner currently
      live on `/foundation` is placeholder, not pending. See `pages/foundation.md`.

- [x] **Category definition** → **working description holds, still open**
      1.2 stays `[OPEN]`; the Foundation page keeps its draft badge until leadership ratifies.

- [x] **Four-pillar framework** → **Rights to Win only, hunt and fix the legacy docs**
      Known offenders: legacy materials still leading with flexibility / profitability /
      enterprise-ready / omnichannel, and the wiki voice page still listing "Every Channel
      Architecture" and "Experimentation Velocity."

---

## The three greens, resolved

The audit opened with "three different greens on white are in circulation." All three now
have a defined job, which is what kills the drift.

| Green | Job | Where it applies |
|---|---|---|
| `#00CC6A` | Logo rings only | The mark, on light backgrounds. Not a palette color. |
| `#009A50` | The light-background green | Text, icons, UI, borders, everything that is not the mark |
| `#00FF85` | The dark-background green | Accent on Midnight, including the logo rings on dark |

---

## Tier 3 — v1.1, do not block launch

- [ ] **D8. Illustration and animation policy.** Old hub says none is used, 5.4 expects a
      style eventually, and motion now exists (Retention Agent video).
      → *Recommended:* no page in v1, document the real policy in v1.1.

- [ ] **Style guide 6.5.** Email templates, signature blocks, booth/swag rules, in-product
      voice examples. None exist in codified form.

- [ ] **Style guide 2.4.** Product voice and internal-comms examples for the tone-by-channel table.

- [ ] **Style guide 4.3.** The definitive stat sheet with refresh dates, plus approved
      customer logos and named case-study stats. Overlaps D11.

- [ ] **Style guide 7.** Three to five more on-brand/off-brand pairs, harvested from real
      campaign drafts as they come up in review.

- [ ] **Style guide 5.4.** Full imagery and iconography direction. The old photography rules
      are cleared as the seed; examples rebuild from the Retention Agent video and the
      Summer 2026 Drop pages.

---

## Assets to re-source (A1–A12)

Tracked as rows in [`assets.csv`](assets.csv). Every old-hub download link resolves into the
dead Frontify site, so all twelve families need a home. **A1, the logo kit, is now unblocked
by D1** and needs only the batch export from Figma.
