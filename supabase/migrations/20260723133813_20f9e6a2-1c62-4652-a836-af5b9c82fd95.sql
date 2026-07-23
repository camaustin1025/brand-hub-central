
-- =========================
-- asset_categories
-- =========================
CREATE TABLE public.asset_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  label text NOT NULL,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.asset_categories TO anon, authenticated;
GRANT ALL ON public.asset_categories TO service_role;

ALTER TABLE public.asset_categories ENABLE ROW LEVEL SECURITY;

-- TODO: tighten RLS when auth ships (admin-only writes; public reads OK)
CREATE POLICY "categories anon read" ON public.asset_categories FOR SELECT USING (true);
CREATE POLICY "categories anon write" ON public.asset_categories FOR INSERT WITH CHECK (true);
CREATE POLICY "categories anon update" ON public.asset_categories FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "categories anon delete" ON public.asset_categories FOR DELETE USING (true);

-- =========================
-- assets
-- =========================
CREATE TABLE public.assets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  title text NOT NULL,
  description text NOT NULL DEFAULT '',
  category_id uuid REFERENCES public.asset_categories(id) ON DELETE SET NULL,
  type text NOT NULL,
  formats text[] NOT NULL DEFAULT '{}',
  tags text[] NOT NULL DEFAULT '{}',
  storage_path text,        -- path in brand-assets bucket, or NULL if pending
  preview_path text,        -- path in brand-assets bucket, or external URL, or NULL
  preview_bg text,          -- 'midnight' | 'light' | null
  is_published boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX assets_category_idx ON public.assets(category_id);
CREATE INDEX assets_published_idx ON public.assets(is_published);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.assets TO anon, authenticated;
GRANT ALL ON public.assets TO service_role;

ALTER TABLE public.assets ENABLE ROW LEVEL SECURITY;

-- TODO: tighten RLS when auth ships (admin-only writes; public reads of published only)
CREATE POLICY "assets anon read" ON public.assets FOR SELECT USING (true);
CREATE POLICY "assets anon insert" ON public.assets FOR INSERT WITH CHECK (true);
CREATE POLICY "assets anon update" ON public.assets FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "assets anon delete" ON public.assets FOR DELETE USING (true);

-- =========================
-- updated_at trigger
-- =========================
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER asset_categories_set_updated_at
BEFORE UPDATE ON public.asset_categories
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER assets_set_updated_at
BEFORE UPDATE ON public.assets
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- =========================
-- Seed categories (matches src/data/assets.ts ASSET_CATEGORIES)
-- =========================
INSERT INTO public.asset_categories (slug, label, sort_order) VALUES
  ('logo', 'Logo kit', 1),
  ('font', 'Font kit', 2),
  ('token', 'Design tokens', 3),
  ('background', 'Backgrounds', 4),
  ('social', 'Social graphics', 5),
  ('template', 'Templates', 6);

-- =========================
-- Seed assets (matches src/data/assets.ts ASSETS)
-- storage_path uses `public/<file>` to mirror the current /public serving paths;
-- once we start uploading through the bucket, admin will replace with real bucket keys.
-- =========================
INSERT INTO public.assets (slug, title, description, category_id, type, formats, tags, storage_path, preview_path, preview_bg, sort_order)
SELECT 'logo-dark', 'Logo — on dark',
  'Primary lockup: white wordmark, Groovy Green rings, on Midnight.',
  c.id, 'logo', ARRAY['PNG','SVG'], ARRAY['logo','dark','primary'],
  '/logo-dark.png', '/logo-dark.png', NULL, 1
FROM public.asset_categories c WHERE c.slug = 'logo';

INSERT INTO public.assets (slug, title, description, category_id, type, formats, tags, storage_path, preview_path, preview_bg, sort_order)
SELECT 'logo-light', 'Logo — on light',
  'Primary lockup: Midnight wordmark and rings, on white. Ring green pending audit D1.',
  c.id, 'logo', ARRAY['PNG','SVG'], ARRAY['logo','light','primary'],
  '/logo-white.png', '/logo-white.png', 'light', 2
FROM public.asset_categories c WHERE c.slug = 'logo';

INSERT INTO public.assets (slug, title, description, category_id, type, formats, tags, storage_path, preview_path, preview_bg, sort_order)
SELECT 'logomark', 'Isolated logomark',
  'The interlocking rings alone. Default: Groovy Green on Midnight.',
  c.id, 'logo', ARRAY['PNG','SVG'], ARRAY['logo','logomark','mark'],
  '/logomark.png', '/logomark.png', NULL, 3
FROM public.asset_categories c WHERE c.slug = 'logo';

INSERT INTO public.assets (slug, title, description, category_id, type, formats, tags, storage_path, preview_path, preview_bg, sort_order)
SELECT 'font-kit', 'Figtree font kit',
  'Static weights 400 to 800. The only brand typeface.',
  c.id, 'font', ARRAY['TTF','ZIP'], ARRAY['font','figtree','typography'],
  NULL, NULL, NULL, 1
FROM public.asset_categories c WHERE c.slug = 'font';

INSERT INTO public.assets (slug, title, description, category_id, type, formats, tags, storage_path, preview_path, preview_bg, sort_order)
SELECT 'tokens-json', 'tokens.json',
  'Canonical color, type, and gradient values as JSON.',
  c.id, 'token', ARRAY['JSON'], ARRAY['tokens','developers'],
  NULL, NULL, NULL, 1
FROM public.asset_categories c WHERE c.slug = 'token';

INSERT INTO public.assets (slug, title, description, category_id, type, formats, tags, storage_path, preview_path, preview_bg, sort_order)
SELECT 'tokens-css', 'tokens.css',
  'The same values as CSS custom properties.',
  c.id, 'token', ARRAY['CSS'], ARRAY['tokens','developers','css'],
  NULL, NULL, NULL, 2
FROM public.asset_categories c WHERE c.slug = 'token';

INSERT INTO public.assets (slug, title, description, category_id, type, formats, tags, storage_path, preview_path, preview_bg, sort_order)
SELECT 'zoom-bg', 'Zoom background — Groovy Green',
  'Midnight canvas with the paired-circle gradient.',
  c.id, 'background', ARRAY['PNG'], ARRAY['zoom','background','circles'],
  '/midnight_bg.png', '/midnight_bg.png', NULL, 1
FROM public.asset_categories c WHERE c.slug = 'background';

INSERT INTO public.assets (slug, title, description, category_id, type, formats, tags, storage_path, preview_path, preview_bg, sort_order)
SELECT 'social-linkedin', 'LinkedIn banner',
  'Approved company banner, sized for LinkedIn.',
  c.id, 'social', ARRAY['PNG'], ARRAY['social','linkedin','banner'],
  NULL, NULL, NULL, 1
FROM public.asset_categories c WHERE c.slug = 'social';

-- =========================
-- Storage RLS for brand-assets bucket (open while auth is off)
-- TODO: tighten to admin-only writes and authenticated reads when auth ships
-- =========================
CREATE POLICY "brand-assets anon read" ON storage.objects
  FOR SELECT USING (bucket_id = 'brand-assets');
CREATE POLICY "brand-assets anon insert" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'brand-assets');
CREATE POLICY "brand-assets anon update" ON storage.objects
  FOR UPDATE USING (bucket_id = 'brand-assets') WITH CHECK (bucket_id = 'brand-assets');
CREATE POLICY "brand-assets anon delete" ON storage.objects
  FOR DELETE USING (bucket_id = 'brand-assets');
