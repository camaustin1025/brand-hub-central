-- Close the anon write path.
--
-- The initial migration granted `anon` unrestricted INSERT / UPDATE / DELETE on
-- assets, asset_categories, and the brand-assets bucket. The publishable key
-- ships in the client bundle (VITE_SUPABASE_PUBLISHABLE_KEY), so anyone who
-- loaded the site could lift it and rewrite or delete the entire asset library
-- straight against the REST API — no app, no site password, no admin passphrase.
--
-- All writes now go through the admin server functions, which run with the
-- service role behind `requireAdmin` (src/lib/admin-session.ts). service_role
-- bypasses RLS, so it is unaffected by everything below.
--
-- Reads stay open: the public hub renders published assets with the anon key.

-- =========================
-- asset_categories
-- =========================
DROP POLICY IF EXISTS "categories anon write" ON public.asset_categories;
DROP POLICY IF EXISTS "categories anon update" ON public.asset_categories;
DROP POLICY IF EXISTS "categories anon delete" ON public.asset_categories;

REVOKE INSERT, UPDATE, DELETE ON public.asset_categories FROM anon, authenticated;

-- =========================
-- assets
-- =========================
DROP POLICY IF EXISTS "assets anon insert" ON public.assets;
DROP POLICY IF EXISTS "assets anon update" ON public.assets;
DROP POLICY IF EXISTS "assets anon delete" ON public.assets;

REVOKE INSERT, UPDATE, DELETE ON public.assets FROM anon, authenticated;

-- Unpublished rows are drafts; they should not be readable by the public key.
-- listAssets() already filters on is_published, and the admin list runs with
-- the service role, so this narrows the policy without changing either caller.
DROP POLICY IF EXISTS "assets anon read" ON public.assets;
CREATE POLICY "assets public read published" ON public.assets
  FOR SELECT USING (is_published = true);

-- =========================
-- storage: brand-assets bucket
-- =========================
DROP POLICY IF EXISTS "brand-assets anon insert" ON storage.objects;
DROP POLICY IF EXISTS "brand-assets anon update" ON storage.objects;
DROP POLICY IF EXISTS "brand-assets anon delete" ON storage.objects;
