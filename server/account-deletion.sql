ALTER TABLE public."user" ADD COLUMN IF NOT EXISTS palateo_legal_version TEXT;
ALTER TABLE public."user" ADD COLUMN IF NOT EXISTS palateo_legal_accepted_at TEXT;
ALTER TABLE public."user" ADD COLUMN IF NOT EXISTS palateo_privacy_consent BOOLEAN DEFAULT FALSE;
-- The trigger keeps domain cleanup in the same transaction as auth-user deletion,
-- including installations created before the domain foreign keys existed.
CREATE OR REPLACE FUNCTION public.cleanup_deleted_account() RETURNS trigger
LANGUAGE plpgsql SET search_path = '' AS $$
BEGIN
  DELETE FROM public.connections WHERE requester_id = OLD.id OR recipient_id = OLD.id;
  DELETE FROM public.app_events WHERE user_id = OLD.id;
  DELETE FROM public.interactions WHERE user_id = OLD.id;
  DELETE FROM public.saved_restaurants WHERE user_id = OLD.id;
  DELETE FROM public.taste_profiles WHERE user_id = OLD.id;
  DELETE FROM public.profiles WHERE id = OLD.id;
  DELETE FROM public.launch_waitlist WHERE lower(email) = lower(OLD.email);
  RETURN OLD;
END;
$$;
DROP TRIGGER IF EXISTS cleanup_deleted_account ON public."user";
CREATE TRIGGER cleanup_deleted_account BEFORE DELETE ON public."user"
FOR EACH ROW EXECUTE FUNCTION public.cleanup_deleted_account();
