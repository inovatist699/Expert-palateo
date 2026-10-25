-- Apply to the canonical Supabase database before enabling mobile-web verification.
-- No account/profile tables are changed. No browser role can read or execute this API.
create schema if not exists private;
create table if not exists private.truecaller_flows (
  id text primary key,
  secret_hash text not null,
  nonce_hash text not null,
  source_hash text not null,
  created_at timestamptz not null default now(),
  expires_at timestamptz not null default now() + interval '3 minutes',
  status text not null default 'waiting' check (status in ('waiting','ready','rejected')),
  encrypted_token text
);
alter table private.truecaller_flows enable row level security;
revoke all on private.truecaller_flows from public, anon, authenticated;
create table if not exists private.truecaller_attempts (
  source_hash text primary key,
  started_at timestamptz not null default now(),
  attempts integer not null default 1
);
alter table private.truecaller_attempts enable row level security;
revoke all on private.truecaller_attempts from public, anon, authenticated;

create or replace function public.truecaller_flow(operation text, input jsonb)
returns jsonb language plpgsql security definer set search_path = '' as $$
declare item private.truecaller_flows%rowtype; attempt_count integer;
begin
  if coalesce(current_setting('request.jwt.claims', true)::jsonb->>'role','') <> 'service_role' then
    raise exception 'Not authorized' using errcode='42501';
  end if;
  if operation='attempt' then
    delete from private.truecaller_attempts where started_at < now() - interval '3 minutes';
    insert into private.truecaller_attempts(source_hash) values(input->>'source')
      on conflict(source_hash) do update set attempts=private.truecaller_attempts.attempts+1
      returning attempts into attempt_count;
    return jsonb_build_object('allowed',attempt_count<=10);
  end if;
  if operation='start' then
    perform pg_advisory_xact_lock(7240261025);
    delete from private.truecaller_flows where expires_at <= now();
    if (select count(*) from private.truecaller_flows) >= 1000 or
       (select count(*) from private.truecaller_flows where source_hash=input->>'source') >= 10 then
      return jsonb_build_object('created',false);
    end if;
    insert into private.truecaller_flows(id,secret_hash,nonce_hash,source_hash)
      values(input->>'id',input->>'secret',input->>'nonce',input->>'source');
    return jsonb_build_object('created',true);
  end if;
  select * into item from private.truecaller_flows where id=input->>'id' for update;
  if not found or item.expires_at <= now() then
    delete from private.truecaller_flows where id=input->>'id';
    return jsonb_build_object('status','expired');
  end if;
  if operation='callback' then
    if item.status='waiting' then
      update private.truecaller_flows set encrypted_token=input->>'token',status='ready' where id=item.id;
    end if;
    return jsonb_build_object('accepted',true);
  elsif operation='reject' then
    update private.truecaller_flows set status='rejected' where id=item.id and status='waiting';
    return jsonb_build_object('accepted',true);
  elsif operation='consume' then
    if item.secret_hash is distinct from input->>'secret' or item.nonce_hash is distinct from input->>'nonce' then
      return jsonb_build_object('status','expired');
    end if;
    if item.status='waiting' then return jsonb_build_object('status','waiting'); end if;
    delete from private.truecaller_flows where id=item.id;
    return jsonb_build_object('status',item.status,'token',item.encrypted_token);
  end if;
  raise exception 'Invalid operation';
end;
$$;
revoke all on function public.truecaller_flow(text,jsonb) from public, anon, authenticated;
grant execute on function public.truecaller_flow(text,jsonb) to service_role;
