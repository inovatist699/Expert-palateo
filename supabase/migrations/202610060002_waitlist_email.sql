begin;
alter table public.launch_waitlist add column if not exists welcome_attempt_at timestamptz;
alter table public.launch_waitlist add column if not exists welcome_attempts integer not null default 0;
alter table public.launch_waitlist add column if not exists welcome_sent_at timestamptz;
create or replace function public.waitlist_welcome(p_email text, p_token text, p_sent boolean default false)
returns boolean language plpgsql security definer set search_path = '' as $$
begin
  if p_token is null or encode(sha256(convert_to(p_token,'UTF8')),'hex') <> '73e691233d2c852e39eb7be5b2bae29c11211339d0e166e53c79d246998c81eb' then
    raise exception 'Not authorized' using errcode = '42501';
  end if;
  perform pg_advisory_xact_lock(60100602);
  if p_sent then
    update public.launch_waitlist set welcome_sent_at = now() where email = lower(trim(p_email)) and welcome_attempts > 0;
    return false;
  end if;
  -- ponytail: conservative global budget leaves room under Resend's 100/day free ceiling.
  if (select coalesce(sum(welcome_attempts),0) from public.launch_waitlist where welcome_attempt_at > now() - interval '24 hours') >= 90 then return false; end if;
  update public.launch_waitlist set welcome_attempt_at = now(), welcome_attempts = welcome_attempts + 1
    where email = lower(trim(p_email)) and welcome_sent_at is null and welcome_attempts < 3
      and (welcome_attempt_at is null or welcome_attempt_at < now() - interval '24 hours');
  return found;
end;
$$;
revoke all on function public.waitlist_welcome(text,text,boolean) from public;
grant execute on function public.waitlist_welcome(text,text,boolean) to anon, authenticated;
commit;
