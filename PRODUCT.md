# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Ordergroove employees, marketing first and then the whole company. Invited guests get a limited view: staff-only pages and downloads are hidden from them. People arrive with one specific need, usually from a Slack link or the hub search: grab an approved file (logo, font, Zoom background, LinkedIn graphic, icon) or check a brand rule (color, type, voice, messaging). Mostly on laptops.

## Product Purpose

The internal Ordergroove Brand Hub. It replaces the retired Frontify site and was built in-house instead of buying Frontify. Success means people find the right file or rule in seconds, instead of copying from old decks and screenshots or asking marketing.

## Positioning

The hub and the AI tools read the same canon. Site content comes from the brand style guide, and brand.md (the agent-facing version) is kept in sync with it, so the hub, the Claude skills, and llms.txt never give different answers.

## Operating Context

- Sign-in is Google, restricted to @ordergroove.com.
- Links to pages and assets are shared in Slack, so old links must keep working.
- Content is edited through Lovable and Claude Code with GitHub sync. Lovable syncs the `codex/single-page-brand-hub` branch.
- Claude skills (ordergroove-slides, ordergroove-doc, v2linkedinpost) load brand.md.

## Capabilities and Constraints

- Stack: Lovable app (React, Tailwind, shadcn) on Lovable Cloud (Supabase). GA4 from day one. llms.txt and raw markdown endpoints ship with the site.
- Never ship "Coming soon" pages. Only pages with real content go live.
- Unresolved canon renders with a draft or WIP badge instead of being hidden or invented.
- The tokens page publishes marketing canon. Product (GDS) reconciliation is out of scope for now.

## Brand Commitments

- Figtree everywhere. No em dashes. Never lead with "AI".
- Groovy Green #00FF85 on dark backgrounds, #009A50 on light. Midnight #17132F. Midnight labels on green buttons.
- Hub buttons and downloads (approved 2026-11-11): pills in two sizes (40px main action, 32px compact controls), Midnight on light and white on Midnight for the main action, outlined for secondary. File downloads are links with a Groovy Green highlighter on hover. The full rule lives in brand.md.
- The voice pass/fail list in brand-style-guide.md Section 3 applies to every user-facing word.
- brand.md is canon and wins every conflict. Canon edits wait for Cameron's go-ahead.

## Evidence on Hand

- `content-sources/`: brand-style-guide.md, brand.md, the old-hub PDF, the Brand vs Product Audit.
- `assets/` and `public/`: Figtree TTFs, logo PNG and SVG files, gradients, Zoom backgrounds, the icon library.
- Not cleared yet, so never fabricate: exec headshots, customer logos.

## Product Principles

1. Get people to the file or rule fast. Search and downloads beat browsing.
2. Ship only real content. No placeholders, no "Coming soon".
3. One source of truth. The hub never disagrees with brand.md.
4. The hub follows its own rules, because people copy what they see on it.

## Accessibility & Inclusion

Visible keyboard focus on every control. Green text and fills follow the contrast rule above.
