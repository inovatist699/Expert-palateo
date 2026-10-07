-- Trigger functions are invoked by PostgreSQL triggers, not by browser RPCs.
-- Remove direct execute rights from public API roles while preserving their
-- existing trigger bindings and service-role grants.

begin;

do $preflight$
declare
  function_name text;
begin
  foreach function_name in array array[
    'public.handle_new_user()',
    'public.sync_profile_from_auth()',
    'public.rls_auto_enable()',
    'public.palateo_handle_new_auth_user()'
  ] loop
    if to_regprocedure(function_name) is null then
      raise exception 'Expected function % was not found; no changes were applied.', function_name;
    end if;
  end loop;
end;
$preflight$;

revoke execute on function public.handle_new_user() from public, anon, authenticated;
revoke execute on function public.sync_profile_from_auth() from public, anon, authenticated;
revoke execute on function public.rls_auto_enable() from public, anon, authenticated;
revoke execute on function public.palateo_handle_new_auth_user() from public, anon, authenticated;
grant execute on function public.palateo_handle_new_auth_user() to supabase_auth_admin;

commit;
