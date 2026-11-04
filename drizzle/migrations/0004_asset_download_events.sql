CREATE TABLE public.asset_download_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  asset_type text NOT NULL CHECK (asset_type IN ('icon', 'icon_set')),
  asset_id text NOT NULL CHECK (char_length(asset_id) BETWEEN 1 AND 120),
  variant text CHECK (variant IS NULL OR char_length(variant) <= 120),
  format text NOT NULL CHECK (format IN ('svg', 'png')),
  item_count integer NOT NULL DEFAULT 1 CHECK (item_count BETWEEN 1 AND 1000),
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX asset_download_events_created_at_idx ON public.asset_download_events (created_at);
ALTER TABLE public.asset_download_events ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.asset_download_events FROM PUBLIC, anon, authenticated;
GRANT INSERT ON public.asset_download_events TO authenticated;
GRANT ALL ON public.asset_download_events TO service_role;
CREATE POLICY "asset downloads own insert" ON public.asset_download_events
FOR INSERT TO authenticated
WITH CHECK (user_id = auth.uid());
