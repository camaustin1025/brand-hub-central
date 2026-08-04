# Brand Hub content system

This folder is where hub content gets written and approved **before** it becomes code.
Filling in a file here is the last non-engineering step: once a block is `[READY]`,
converting it is mechanical.

Nothing in here starts blank. Every file is pre-seeded from canon you already have.

---

## The rule that makes this work: slot IDs

Every content block carries a **slot ID**. The slot ID is not decorative — it is the
`id` passed to `<ModuleHead>` on the route, and it is what the side-nav contents rail
anchors to. A block with no slot ID has nowhere to go.

The live registry is [`src/data/sections.ts`](../src/data/sections.ts). Adding a block
means adding a slot there in the same commit, or the heading renders but never
highlights (nothing catches that at build time).

**Current slots:**

| Route | Slot IDs |
|---|---|
| `/foundation` | `category` · `belief` · `audience` · `rights` · `ladder` · `boilerplate` |
| `/voice` | `personality` · `pass-fail` · `use-this` |
| `/visual-identity` | `core` · `supporting-neutrals` · `secondary` · `gradients` · `green-legibility` · `logo` · `misuse` |
| `/tokens` | `kits` · `core-color` · `type` · `gradients` |
| `/ai-skills` | `available` · `assistant` |
| `/downloads` | none — sections are Supabase categories, resolved at request time |
| `/toolkit` | none — one flat grid |

---

## The four files

| File | Holds | Becomes |
|---|---|---|
| `decisions.md` | Every open question, one checkbox each | Unblocks two-thirds of everything below |
| `pages/*.md` | Prose blocks, one file per route | `src/routes/*.tsx` |
| `tokens.md` | Color, gradient, and type values | `src/data/tokens.ts` |
| `assets.csv` | One row per downloadable file | Rows in the Supabase `assets` table |

---

### `assets.csv` column contract

Columns after `status` are the Supabase `assets` table, one for one. Two intake-only
columns get dropped at import: `ref` (the A-number from the Phase 0 audit) and
`open_question` (what has to be answered before the row can go `[READY]`).

- `type` — one of `logo` `font` `token` `background` `social` `template`
- `formats` — pipe-separated, from `SVG` `PNG` `EPS` `TTF` `JSON` `CSS` `ZIP`
- `tags` — semicolon-separated
- `category_slug` — must match a row in `asset_categories`, or create it first at
  `/admin/categories`
- `storage_path` / `preview_path` — paths inside the `brand-assets` bucket. Blank means
  the file is still being re-sourced, which is why it renders greyed out instead of as a
  broken link.
- `preview_bg` — `midnight` or `light`
- `is_published` — `FALSE` until the file actually exists

---

## Status vocabulary

Carried over from `brand-style-guide.md` so one vocabulary covers the guide and the hub.

- **`[READY]`** — approved. Convert it.
- **`[DRAFT]`** — content exists, leadership hasn't ratified it. Ships behind `<DraftBadge>`.
- **`[TO GATHER]`** — the source material does not exist yet. Blocks the block.
- **`[OPEN: D#]`** — waiting on a decision in `decisions.md`. Ships behind `<DraftBadge>`.

Nothing ships as "Coming soon." The old hub had four of those pages and the Phase 0
audit retired every one of them by name.

---

## Fill order

1. **`decisions.md`** — ~30 minutes. Unblocks the largest share of everything else.
2. **`tokens.md`** — ~10 minutes. Mostly pre-filled; you are confirming, not writing.
3. **`pages/*.md`** — roughly one sitting per page. `foundation.md` is done as the worked example.
4. **`assets.csv`** — the long pole. This is file-gathering, not writing, and it does not block the guideline pages.

---

## Where the content comes from

Precedence order. Higher wins every conflict.

1. **`canon/brand.md`** — canonical agent-facing context
2. **`canon/brand-style-guide.md` v0.2**, August 4 2026 — the full guide, section-numbered
3. **`Phase 0 - Old Hub Content Audit.md`** — 37 sections graded KEEP/UPDATE/RETIRE,
   plus the carry-over manifest that scopes v1
   (`~/Desktop/Projects/brand-hub/docs/`)
4. **`Brand vs Product Audit.md`** — where brand and product design have drifted
   (`~/Desktop/Projects/brand-hub/content-sources/`)
5. **Frontify export** — the old hub as 40 markdown pages plus an asset manifest
   (`~/Desktop/Ordergroove-Brand-Hub-Export/markdown/`)

### `canon/` is the source, the other copies are mirrors

Style guide 8.3 now says the guide lives in the Brand Hub, so `canon/` is where it lives and
where it gets edited. Two mirrors exist and both are downstream:

- `~/Documents/claude-prompt-library/brand-style-guide.md` and `brand.md` — the pair that
  agents load into project sessions. **This mirror matters most**, because a session reading
  a stale copy will confidently produce off-brand work.
- `~/Desktop/Projects/brand-hub/content-sources/` — the reference checkout that also holds
  the Phase 0 audit and the old-hub PDF.

**The sync rule:** edit `canon/`, then copy out to both. Never edit a mirror directly. If
the mirrors ever disagree with `canon/`, `canon/` wins, because it is the only copy under
version control alongside the hub that publishes it.

Cite the source in each block's `Source:` line. When a block has no source, that is the
signal it needs a `[TO GATHER]`, not an invention.
