CREATE TABLE public.social_usage_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  template_id text NOT NULL,
  template_version integer NOT NULL,
  event text NOT NULL CHECK (event IN ('editor_opened', 'downloaded')),
  first_download boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.social_usage_events ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.social_usage_events FROM PUBLIC, anon, authenticated;
GRANT INSERT ON public.social_usage_events TO authenticated;
GRANT ALL ON public.social_usage_events TO service_role;
CREATE POLICY "social usage own insert" ON public.social_usage_events
FOR INSERT TO authenticated
WITH CHECK (user_id = auth.uid());
