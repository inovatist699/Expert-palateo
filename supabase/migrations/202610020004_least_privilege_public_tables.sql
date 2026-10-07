-- Reduce exposed PostgREST table privileges to the operations used by Palateo.
-- RLS remains enabled and continues to scope authenticated rows to their owner.
-- This migration changes grants only; it does not alter or delete application data.

begin;

do $preflight$
declare
  table_name text;
begin
  foreach table_name in array array[
    'app_events', 'connections', 'interactions', 'profiles',
    'recommendation_events', 'restaurants', 'saved_restaurants', 'taste_profiles'
  ] loop
    if not exists (
      select 1
      from pg_catalog.pg_class c
      join pg_catalog.pg_namespace n on n.oid = c.relnamespace
      where n.nspname = 'public'
        and c.relname = table_name
        and c.relkind in ('r', 'p')
        and c.relrowsecurity
    ) then
      raise exception 'Expected public.%, with RLS enabled, was not found; no changes were applied.', table_name;
    end if;
  end loop;
end;
$preflight$;

-- Remove the broad grants previously present (including TRUNCATE, which RLS
-- does not protect). Service-role access and database-owner access are intact.
revoke all privileges on table
  public.app_events,
  public.connections,
  public.interactions,
  public.profiles,
  public.recommendation_events,
  public.restaurants,
  public.saved_restaurants,
  public.taste_profiles
from anon, authenticated;

-- The catalog is intentionally readable without signing in.
grant select on table public.restaurants to anon, authenticated;

-- Authenticated client operations, protected by the existing RLS policies.
grant insert on table public.app_events to authenticated;
grant insert, delete on table public.connections to authenticated;
grant select, insert on table public.interactions to authenticated;
grant select, insert, update on table public.profiles to authenticated;
grant select, insert, update, delete on table public.saved_restaurants to authenticated;
grant select, insert, update on table public.taste_profiles to authenticated;

-- recommendation_events has no direct frontend caller; keep it inaccessible to
-- anon/authenticated unless a reviewed feature needs a narrowly scoped grant.

commit;
