-- Only a recently signed-in owner may delete their own account. Existing foreign
-- keys cascade profiles, taste, feedback, saves, connections and account events.
CREATE SCHEMA IF NOT EXISTS private;
CREATE OR REPLACE FUNCTION private.delete_own_account() RETURNS void
LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
DECLARE owner_id uuid := auth.uid(); owner_email text;
BEGIN
  IF owner_id IS NULL OR NOT EXISTS (
    SELECT 1 FROM auth.sessions WHERE user_id = owner_id
      AND id = nullif(auth.jwt()->>'session_id','')::uuid
      AND created_at > now() - interval '5 minutes'
  ) THEN RAISE EXCEPTION 'Sign in again before deleting your account' USING ERRCODE='42501'; END IF;
  SELECT email INTO owner_email FROM auth.users WHERE id = owner_id;
  DELETE FROM public.launch_waitlist WHERE lower(email) = lower(owner_email);
  DELETE FROM auth.users WHERE id = owner_id;
END;
$$;
REVOKE ALL ON FUNCTION private.delete_own_account() FROM PUBLIC, anon;
GRANT USAGE ON SCHEMA private TO authenticated;
GRANT EXECUTE ON FUNCTION private.delete_own_account() TO authenticated;
CREATE OR REPLACE FUNCTION public.delete_own_account() RETURNS void
LANGUAGE sql SECURITY INVOKER SET search_path = '' AS $$ SELECT private.delete_own_account(); $$;
REVOKE ALL ON FUNCTION public.delete_own_account() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.delete_own_account() TO authenticated;
