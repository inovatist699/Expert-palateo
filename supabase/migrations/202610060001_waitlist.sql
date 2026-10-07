begin;
create table if not exists public.launch_waitlist (
  id uuid primary key default gen_random_uuid(),
  email text not null unique check (length(email) <= 254 and email = lower(trim(email)) and email ~ '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$'),
  city text not null check (city in ('Ahmedabad','Vadodara','Other')),
  consent_version text not null default 'waitlist-2026-10-06' check (consent_version = 'waitlist-2026-10-06'),
  created_at timestamptz not null default now()
);
alter table public.launch_waitlist enable row level security;
revoke all on public.launch_waitlist from anon, authenticated;
create index if not exists launch_waitlist_created_at_idx on public.launch_waitlist (created_at);
create or replace function public.join_launch_waitlist(p_email text, p_city text, p_consent boolean)
returns void language plpgsql security definer set search_path = '' as $$
begin
  if p_consent is distinct from true or p_email is null or length(p_email) > 254 or p_email !~ '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$' or p_city is null or p_city not in ('Ahmedabad','Vadodara','Other') then
    raise exception 'Invalid waitlist details' using errcode = '22023';
  end if;
  perform pg_advisory_xact_lock(60100601);
  -- ponytail: a global 30/minute cap bounds public writes; use verified per-IP throttling if legitimate traffic reaches it.
  if (select count(*) from public.launch_waitlist where created_at > now() - interval '1 minute') >= 30 or (select count(*) from public.launch_waitlist) >= 5000 then
    raise exception 'Waitlist temporarily busy' using errcode = 'P0001';
  end if;
  insert into public.launch_waitlist(email,city) values (lower(trim(p_email)),p_city) on conflict (email) do nothing;
end;
$$;
revoke all on function public.join_launch_waitlist(text,text,boolean) from public;
grant execute on function public.join_launch_waitlist(text,text,boolean) to anon, authenticated;
commit;
