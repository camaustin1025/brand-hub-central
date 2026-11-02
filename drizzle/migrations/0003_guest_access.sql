CREATE TYPE public.app_role AS ENUM ('admin', 'guest');

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

CREATE POLICY "own roles readable" ON public.user_roles FOR SELECT TO authenticated
USING (user_id = auth.uid());

CREATE TABLE public.guest_invites (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL UNIQUE,
  full_name text NOT NULL DEFAULT '',
  company text NOT NULL DEFAULT '',
  invited_by uuid,
  expires_at timestamptz NOT NULL DEFAULT (now() + interval '90 days'),
  revoked_at timestamptz,
  last_sent_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.guest_invites TO authenticated;
GRANT ALL ON public.guest_invites TO service_role;
ALTER TABLE public.guest_invites ENABLE ROW LEVEL SECURITY;
CREATE POLICY "admins manage guests" ON public.guest_invites FOR ALL TO authenticated
USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE OR REPLACE FUNCTION public.guest_invites_normalize()
RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
BEGIN
  NEW.email := lower(trim(NEW.email));
  RETURN NEW;
END;
$$;
CREATE TRIGGER guest_invites_normalize BEFORE INSERT OR UPDATE ON public.guest_invites
FOR EACH ROW EXECUTE FUNCTION public.guest_invites_normalize();

-- Who the signed-in user is: 'staff', 'guest', 'expired', or 'none'.
CREATE OR REPLACE FUNCTION public.my_access()
RETURNS text LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = public AS $$
DECLARE
  _email text := lower(coalesce(auth.jwt() ->> 'email', ''));
  _inv public.guest_invites;
BEGIN
  IF _email = '' THEN RETURN 'none'; END IF;
  IF split_part(_email, '@', 2) = 'ordergroove.com' THEN
    RETURN CASE WHEN public.has_role(auth.uid(), 'admin') THEN 'admin' ELSE 'staff' END;
  END IF;
  SELECT * INTO _inv FROM public.guest_invites WHERE email = _email;
  IF NOT FOUND THEN RETURN 'none'; END IF;
  IF _inv.revoked_at IS NOT NULL OR _inv.expires_at <= now() THEN RETURN 'expired'; END IF;
  RETURN 'guest';
END;
$$;
REVOKE EXECUTE ON FUNCTION public.my_access() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.my_access() TO authenticated;

CREATE OR REPLACE FUNCTION public.enforce_ordergroove_domain()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF NEW.email IS NOT NULL AND lower(split_part(NEW.email, '@', 2)) = 'ordergroove.com' THEN
    RETURN NEW;
  END IF;
  IF NEW.email IS NOT NULL AND EXISTS (
    SELECT 1 FROM public.guest_invites
    WHERE email = lower(NEW.email) AND revoked_at IS NULL AND expires_at > now()
  ) THEN
    RETURN NEW;
  END IF;
  RAISE EXCEPTION 'Only @ordergroove.com accounts or invited guests can sign in';
END;
$$;
REVOKE EXECUTE ON FUNCTION public.enforce_ordergroove_domain() FROM PUBLIC, anon, authenticated;