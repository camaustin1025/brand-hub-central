CREATE OR REPLACE FUNCTION public.enforce_ordergroove_domain()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF NEW.email IS NULL OR lower(split_part(NEW.email, '@', 2)) <> 'ordergroove.com' THEN
    RAISE EXCEPTION 'Only @ordergroove.com accounts can sign in';
  END IF;
  RETURN NEW;
END;
$$;
REVOKE EXECUTE ON FUNCTION public.enforce_ordergroove_domain() FROM PUBLIC, anon, authenticated;
DROP TRIGGER IF EXISTS enforce_ordergroove_domain ON auth.users;
CREATE TRIGGER enforce_ordergroove_domain
BEFORE INSERT OR UPDATE OF email ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.enforce_ordergroove_domain();