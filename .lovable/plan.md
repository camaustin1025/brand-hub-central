# Admin UI Plan

A hidden `/admin` surface to manage the asset library backend without touching code. Auth is deferred, so the route is gated by a simple client-side check (env-based passphrase or a `localStorage` flag) with a clear TODO to swap for real auth + role check before publish.

## Scope (v1)

Manage the two live tables (`assets`, `asset_categories`) and the `brand-assets` storage bucket end-to-end from the UI. No guidelines/CMS editing yet — that stays in Step 4.

## Routes

```text
/admin                    → dashboard (counts, recent uploads, quick links)
/admin/assets             → asset list (table, search, filter, bulk actions)
/admin/assets/new         → upload / create asset
/admin/assets/$id         → edit asset (metadata, replace file, preview)
/admin/categories         → category list + inline create/rename/reorder
```

All under a shared `/admin` layout with a sidebar (Assets, Categories, back to site) and a "Preview site" link.

## Features

**Asset list (`/admin/assets`)**
- Table: preview thumb, title, category, type, formats, tags, published toggle, updated_at
- Search by title/tag, filter by category & type
- Row actions: edit, duplicate, delete
- Drag handle for `sort_order` (dnd-kit)
- Bulk: publish/unpublish, delete, change category

**Asset create/edit**
- Fields: title, slug (auto from title, editable), description, category (select), type, formats (multi), tags (chip input), preview background (midnight/light), published toggle, sort_order
- File upload → `brand-assets` bucket (main file + optional preview image), stores the bucket path
- Replace file without losing metadata
- Show current signed preview
- Validation with zod; slug uniqueness check

**Categories (`/admin/categories`)**
- Inline table: label, slug, sort_order, asset count
- Create / rename / reorder / delete (block delete when assets attached, offer reassignment)

**Dashboard (`/admin`)**
- Total assets, unpublished count, categories count
- 5 most recently updated assets with quick edit links

## Technical Details

- **Access gate**: `AdminGate` component wrapping the `/admin` layout. v1 = passphrase compared to `VITE_ADMIN_PASSPHRASE`, stored in `sessionStorage`. TODO comment marks the swap to Supabase auth + `has_role('admin')` before publish.
- **Server functions** in `src/lib/admin-assets.functions.ts`:
  `listAssetsAdmin` (includes unpublished), `upsertAsset`, `deleteAsset`, `reorderAssets`, `listCategoriesAdmin`, `upsertCategory`, `deleteCategory`, `getUploadUrl` (returns a signed upload URL to the bucket).
- **Storage**: uploads go directly from browser to Supabase Storage via signed upload URL to avoid streaming through server functions. Path convention: `assets/<category-slug>/<slug>.<ext>`, previews at `previews/<slug>.<ext>`.
- **Invalidation**: after any mutation, invalidate `["assets"]` and `["admin","assets"]` query keys so `/downloads` reflects changes immediately.
- **RLS**: current policies are open (anon read/write) with TODOs. No schema changes in this step; when auth lands we swap policies to `has_role(auth.uid(),'admin')` for writes.
- **UI kit**: shadcn Table, Dialog, Sheet (for edit), Form, Sonner toasts, dnd-kit for reorder.

## Out of Scope (later steps)

- Real auth + admin role table (Step 5)
- Guidelines page CMS (Step 4)
- Audit log / version history
- Collections / sharing links

## Suggested Build Order

1. `/admin` layout + gate + dashboard shell
2. Categories CRUD (simpler, unblocks asset form)
3. Asset list + edit form (no upload yet, wire metadata)
4. Storage upload + preview handling
5. Reorder + bulk actions + polish
