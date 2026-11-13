# Ordergroove Brand Hub — Project Context

Read this first. This folder is the working home for building the Ordergroove internal brand hub. The decision phase is done; you are here to execute.

## State of play (as of 2026-07-22)

The decision: **build the hub ourselves instead of buying Frontify ($15-35K/yr)**. Full reasoning in `docs/`. Cameron is presenting the pilot at the Frontify proposal review with Lauren and Heidi (~Wed/Thu, July 29-30), so **the pilot must be live before that meeting**.

Decisions already locked (do not re-litigate):

- **Stack:** Lovable app (React/Tailwind/shadcn) + Lovable Cloud (Supabase) + GitHub two-way sync so Claude Code can edit content directly
- **Auth:** Google sign-in via Supabase OAuth, restricted to @ordergroove.com (enforce with an auth hook/trigger rejecting other domains)
- **Scope v1:** marketing brand hub with downloadable token kits (tokens.json, tokens.css, font kit, logo kit). Templates module deferred. DAM-lite and MCP (Lovable Agent integrations) are v1.5, after the meeting
- **Assistant:** pilot stretch goal. Lovable AI edge function, full canon (~20K tokens) in the system prompt, no RAG. Lives on the homepage. Log every Q&A to a table
- **Search (v1.5):** same assets table either way; Postgres FTS vs Algolia Grow decided at build time (Cameron leans Grow: ~$0/mo at our volume, no contract; verify no base fee at signup)
- **Analytics:** GA4 tag from day one. **No "Coming soon" pages, ever** (only ship pages with real content)
- **llms.txt + raw markdown endpoints** ship in v1 (static file in public/ works on the Vite stack)

## Phase 0 (current): old-hub content audit

Before any conversion: audit `content-sources/Brand Guidelines - Ordergroove Brand Hub.pdf` section by section against current canon (brand.md wins every conflict; brand-style-guide.md and the Brand vs Product Audit are the other references). Output: `docs/Phase 0 - Old Hub Content Audit.md` with a KEEP / UPDATE / RETIRE / CAMERON'S CALL verdict per section, an assets-to-re-source list (every download link in the PDF pointed into the now-dead Frontify site), Cameron's consolidated decision list, and a carry-over manifest. **Phase 1 converts only manifest-cleared content.**

## Phase 1 (after Phase 0): content conversion

Convert `content-sources/` into site-ready content files. The style guide is the spine; brand.md is the agent-facing canon (they must never drift: any canon change updates both in the same commit). The PDF is the OLD hub (2022-2023, Frontify export): salvage evergreen sections (logo rules, color ramps/shades, photography guidance, circle treatments, visual containers), but its messaging is retired ("Relationship Commerce", Soleil typography) — current canon always wins. `Brand vs Product Audit.md` explains known brand-vs-product conflicts; the tokens page publishes MARKETING canon (Figtree, Groovy Green #00FF85 dark / #008847 light, Midnight #17132F) and leaves product reconciliation for later.

V1 pages: Home (latest updates + top links) · Foundation & Messaging · Voice & Language Rules (pass/fail list verbatim) · Visual Identity (click-to-copy hexes) · Downloads · Design Tokens · GTM & Employee Toolkit (Drive/Canva links) · AI & Skills.

Blocked on Cameron (she knows): the Phase 0 decision list (~15-20 min of quick picks), the 12 `[OPEN]`/`[TO GATHER]` flags in brand-style-guide.md (~60-90 min pass; unresolved ones render with a "draft" badge), the Lovable project kickoff + GitHub connect (her account), and asset clearance calls (exec headshots, customer logos).

## File map

- `docs/` — the four decision docs (feasibility plan, research addendum, team brief, one-sheeter). Read the feasibility plan's architecture + pilot sections before building
- `content-sources/` — brand-style-guide.md (content spine), brand.md (canon), the old-hub PDF (structure/salvage reference), the brand-vs-product audit
- `assets/` — starter kit: Figtree TTFs (open license), logo-dark/logo-white PNGs, gradient + background PNGs

These are **snapshots copied 2026-07-22**. Canonical originals live in `~/Documents/claude-prompt-library/` (brand.md, brand-style-guide.md — brand.md is auto-imported into other repos, so canon edits must flow back there) and the Obsidian vault at `💼 Work/Projects/Brand Hub/` (decision docs). If this folder becomes the git repo synced to Lovable, it becomes the working source of truth for site content.

## Working rules

- Brand rules apply to everything user-facing: Figtree, no em-dashes, never lead with "AI," full pass/fail list in brand-style-guide.md Section 3
- Cameron's voice rules apply to any copy she'll publish: no AI-tells, no corporate-speak, narrative over bullet-spam
- Commit only when asked; never push without being asked
- Her time is the scarce resource: batch questions, default to acting, surface only real blockers
