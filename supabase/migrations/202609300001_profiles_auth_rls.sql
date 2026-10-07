-- Palateo profile bootstrap and self-access policies.
-- Additive only: this migration does not drop tables, rows, policies, or triggers.

begin;

do $preflight$
declare
  required_column text;
begin
  if not exists (
    select 1
    from pg_catalog.pg_class as c
    join pg_catalog.pg_namespace as n on n.oid = c.relnamespace
    where n.nspname = 'public'
      and c.relname = 'profiles'
      and c.relkind in ('r', 'p')
  ) then
    raise exception 'Expected public.profiles table was not found; no changes were applied.';
  end if;

  if not exists (
    select 1
    from pg_catalog.pg_class as c
    join pg_catalog.pg_namespace as n on n.oid = c.relnamespace
    where n.nspname = 'public'
      and c.relname = 'profiles'
      and c.relrowsecurity
  ) then
    raise exception 'Row Level Security is not enabled on public.profiles; review the table before applying this migration.';
  end if;

  if exists (
    select 1
    from pg_catalog.pg_class as c
    join pg_catalog.pg_namespace as n on n.oid = c.relnamespace
    where n.nspname = 'public'
      and c.relname = 'profiles'
      and c.relforcerowsecurity
  ) then
    raise exception 'FORCE ROW LEVEL SECURITY is enabled on public.profiles; review the trigger owner policy before applying this migration.';
  end if;

  foreach required_column in array array['id', 'display_name', 'phone', 'email', 'onboarding_completed'] loop
    if not exists (
      select 1
      from information_schema.columns
      where table_schema = 'public'
        and table_name = 'profiles'
        and column_name = required_column
    ) then
      raise exception 'Expected public.profiles.% column was not found; no changes were applied.', required_column;
    end if;
  end loop;
end;
$preflight$;

create or replace function public.palateo_handle_new_auth_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $function$
declare
  v_display_name text;
begin
  v_display_name := coalesce(
    nullif(btrim(new.raw_user_meta_data ->> 'full_name'), ''),
    nullif(btrim(new.raw_user_meta_data ->> 'name'), ''),
    nullif(split_part(coalesce(new.email, ''), '@', 1), ''),
    'Palateo User'
  );

  insert into public.profiles (id, display_name, phone, email, onboarding_completed)
  values (
    new.id,
    v_display_name,
    nullif(btrim(new.raw_user_meta_data ->> 'phone'), ''),
    new.email,
    false
  )
  on conflict (id) do nothing;

  return new;
end;
$function$;

revoke all on function public.palateo_handle_new_auth_user() from public, anon, authenticated;
grant execute on function public.palateo_handle_new_auth_user() to supabase_auth_admin;

do $trigger$
begin
  if not exists (
    select 1
    from pg_catalog.pg_trigger
    where tgrelid = 'auth.users'::regclass
      and tgname = 'palateo_profile_after_auth_user_insert'
      and not tgisinternal
  ) then
    execute 'create trigger palateo_profile_after_auth_user_insert after insert on auth.users for each row execute function public.palateo_handle_new_auth_user()';
  end if;
end;
$trigger$;

grant select, insert, update on table public.profiles to authenticated;

do $policies$
begin
  if not exists (
    select 1 from pg_catalog.pg_policies
    where schemaname = 'public' and tablename = 'profiles'
      and policyname = 'palateo_profiles_self_select'
  ) then
    execute 'create policy palateo_profiles_self_select on public.profiles as permissive for select to authenticated using ((select auth.uid()) = id)';
  end if;

  if not exists (
    select 1 from pg_catalog.pg_policies
    where schemaname = 'public' and tablename = 'profiles'
      and policyname = 'palateo_profiles_self_insert'
  ) then
    execute 'create policy palateo_profiles_self_insert on public.profiles as permissive for insert to authenticated with check ((select auth.uid()) = id)';
  end if;

  if not exists (
    select 1 from pg_catalog.pg_policies
    where schemaname = 'public' and tablename = 'profiles'
      and policyname = 'palateo_profiles_self_update'
  ) then
    execute 'create policy palateo_profiles_self_update on public.profiles as permissive for update to authenticated using ((select auth.uid()) = id) with check ((select auth.uid()) = id)';
  end if;

  -- This restrictive owner check keeps any existing permissive policy from
  -- allowing an authenticated user to read or change another user's profile.
  if not exists (
    select 1 from pg_catalog.pg_policies
    where schemaname = 'public' and tablename = 'profiles'
      and policyname = 'palateo_profiles_owner_guard'
  ) then
    execute 'create policy palateo_profiles_owner_guard on public.profiles as restrictive for all to authenticated using ((select auth.uid()) = id) with check ((select auth.uid()) = id)';
  end if;
end;
$policies$;

commit;
