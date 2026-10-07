-- Expose only public venue fields through a read-only view. Revoke direct
-- REST reads of the base table so internal/source columns stay off the client API.
-- The view contains public venue catalogue data only; user-owned data remains in
-- separate RLS-protected tables.
begin;

create or replace view public.restaurant_catalog
with (security_barrier = true)
as
select
  id,
  external_provider,
  external_place_id,
  name,
  address,
  area,
  city,
  latitude,
  longitude,
  cuisines,
  price,
  price_display,
  rating,
  review_count,
  tags,
  dietary_options,
  ambience_tags,
  occasion_tags,
  spice_profile,
  photo_url,
  maps_url
from public.restaurants;

revoke all privileges on table public.restaurants from anon, authenticated;
grant select on table public.restaurant_catalog to anon, authenticated;

commit;
