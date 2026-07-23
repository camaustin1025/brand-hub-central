## What's already in place (from your GitHub push)

Your Claude prototype is further along than the kickoff plan assumed. What's shipped:

- **Design system** in place with Ordergroove tokens: Midnight, Groovy Green (both light/dark variants), Dark Indigo, plus supporting neutrals, secondary pop colors, and gradients (`src/data/tokens.ts`).
- **Layout shell**: `Header`, `Footer`, `PageHeader` components wired into `__root.tsx`. Root metadata is already Ordergroove-branded (no placeholder).
- **Content routes** exist for all Guideline / Grab / Build sections: `/foundation`, `/voice`, `/visual-identity`, `/tokens`, `/downloads`, `/toolkit`, `/ai-skills`.
- **Nav model** grouped by three brand-hub modes (Read / Grab / Build) in `src/data/nav.ts`.
- **Asset model** already carries the DAM-lite fields (type, formats, tags, preview, href) with `href: null` marking assets pending re-source. Assets are hardcoded in `src/data/assets.ts` with 8 seeded items (logos, font kit, tokens, backgrounds, social).
- **Brand components**: `AssetCard`, `Swatch`, `VisualContainer`, `DraftBadge`.
- **Lovable Cloud** enabled (empty schema, no buckets yet).

## What's not yet in place

- No backend for assets — everything reads from the `ASSETS` array. There's no upload, edit, add, or delete flow.
- No admin surface (no upload UI, no way to swap the still-`null` hrefs without editing code).
- No storage bucket, no `assets` table, no categories/tags in the DB.
- No search / filter / detail view on `/downloads` (called out as "arrives with DAM-lite in v1.5" in the current copy).
- Auth intentionally deferred per your request.

## Comparison to the original kickoff plan

| Kickoff phase | Status |
| --- | --- |
| Phase 1 — Auth foundation | **Skip for now** per your request. Revisit before publish. |
| Phase 2 — Design system + shell | **Done** in the prototype. |
| Phase 3 — Brand guidelines pages | **Done** (multiple routes vs one combined page — better). |
| Phase 4 — Asset library (backend + upload/browse/download) | **Sketched frontend only.** Backend work is the next big lift. |
| Phase 5 — Collections / admin / roles | **Not started.** Admin without roles is fine while auth is off. |

## Suggested next steps

Given your two priorities (admin-configurable backend + real asset library) and the "no auth yet, easy to see and edit" constraint, I'd sequence the next work like this:

### Step 1 — Asset library backend (schema + storage)

- Create a Cloud Storage bucket `brand-assets` (public so downloads work without auth for now; can be flipped private when auth lands).
- Migrations:
  - `asset_categories` (slug, label, sort_order) — seed with the 5 categories from `ASSET_CATEGORIES`.
  - `assets` (title, description, category_id, type, formats[], tags[], storage_path, preview_path, preview_bg, is_published, sort_order).
  - `asset_files` (optional: multiple file formats per asset — e.g. one asset with SVG + PNG + EPS variants).
- Wide-open RLS while auth is off: allow anon SELECT on published rows; allow anon INSERT/UPDATE/DELETE gated by a temporary "admin mode" flag (see step 3). Add a `TODO: tighten RLS when auth ships` comment on each policy.
- Seed rows for the 8 existing hardcoded assets so the site keeps working while we swap the source of truth.

### Step 2 — Read path swap on `/downloads`

- Replace the `ASSETS` import with a server function that reads from the DB (grouped by category).
- Keep the existing `AssetCard` — just feed it DB rows shaped like the current `Asset` type.
- Add search box + tag/format/category filters + an asset detail modal or drawer (the "DAM-lite v1.5" work called out in the current subhead).

### Step 3 — Admin surface at `/admin`

A single `/admin` route (unlisted from the nav) with tabs:
- **Assets**: table view with inline edit, upload new (drag-drop into the storage bucket), replace file, toggle published, edit tags/formats/category, reorder.
- **Categories**: rename, reorder, add.
- **Content blocks** (stretch): editable copy for the hero, "latest updates" list, and the Foundation / Voice page intros so non-devs can update messaging without a code change.

While auth is off, gate `/admin` with a simple env-based passphrase or a URL query flag (`?admin=1` stored in localStorage) so it's visible but not linked. Not real security — just so it doesn't leak into search engines. Real role-based gating comes when auth lands.

### Step 4 — Editable content beyond assets (optional, worth flagging)

If you want the guidelines pages (Foundation, Voice, Visual Identity intros, Updates list) to be admin-editable too, we'd add a small `content_blocks` table keyed by slug and swap those pages to read from it. This is what turns the hub from a "code-editable site" into a "brand-team-editable site." Say the word if you want this included in Step 3.

### Step 5 — Auth (deferred)

When you're ready to publish, we layer in:
- Email + Google sign-in (Lovable Cloud managed).
- Move `/admin` behind `_authenticated/` with an `admin` role check via a `user_roles` table.
- Tighten RLS: authenticated SELECT on assets, admin-only write.
- Optionally gate the whole site behind sign-in if it's internal-only.

## Technical notes

- Storage bucket is public in step 1 for zero-friction downloads and previews; flip to private + signed URLs in step 5.
- The existing `Asset` type in `src/data/assets.ts` becomes the shared shape between DB rows and UI — keep it and add a mapper.
- Admin uploads use `supabase.storage.from('brand-assets').upload(...)` from the browser (fine while writes are open); revisit as server functions once auth lands.
- All new DB reads on public routes go through public server functions (no `requireSupabaseAuth` yet), so SSR/prerender doesn't fail.

## Recommended first build turn

Start with **Step 1 + Step 2** together: schema, seed, bucket, and swap `/downloads` to read from the DB. That gets the plumbing real without any UI risk. Admin (Step 3) as the immediately-following turn.