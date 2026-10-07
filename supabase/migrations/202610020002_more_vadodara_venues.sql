-- Add three currently listed Vadodara cafe/restaurant venues with published ratings and prices.
-- Additive and idempotent: existing records are not overwritten or removed.
begin;
alter table public.restaurants add column if not exists price_display text;
with incoming as (
  select * from jsonb_populate_recordset(null::public.restaurants, $palateo_json$[
    {"external_provider":"palateo-curated","external_place_id":"vad-the-brewery","name":"The Brewery","address":"The Distillery, R1 Museum Square, Alembic City, Alembic Road, Vadodara 390003","area":"Alembic City","city":"Vadodara","cuisines":["Cafe","Coffee","Pizza","Brewpub"],"price":"500_1000","price_display":"₹1,000 for two","rating":4.4,"review_count":3900,"tags":["Cafe","Restaurant"],"dietary_options":[],"ambience_tags":["lively","modern"],"occasion_tags":["friends","date"],"spice_profile":"medium","maps_url":"https://www.google.com/maps/search/?api=1&query=The%20Brewery%20Alembic%20City%20Vadodara","source_updated_at":"2026-10-02T00:00:00Z"},
    {"external_provider":"palateo-curated","external_place_id":"vad-mouj-by-mishri","name":"Mouj by Mishri","address":"Shop 8 & 9, Hall 3, Art District, Alembic City, Alembic Road, Vadodara 390007","area":"Alembic City","city":"Vadodara","cuisines":["Cafe","Desserts","Asian","North Indian"],"price":"500_1000","price_display":"₹1,200 for two","rating":4.7,"review_count":607,"tags":["Cafe","Restaurant"],"dietary_options":[],"ambience_tags":["cozy","modern"],"occasion_tags":["friends","date"],"spice_profile":"medium","maps_url":"https://www.google.com/maps/search/?api=1&query=Mouj%20by%20Mishri%20Alembic%20City%20Vadodara","source_updated_at":"2026-10-02T00:00:00Z"},
    {"external_provider":"palateo-curated","external_place_id":"vad-house-of-failures","name":"The House of Failures","address":"Plot No. 2, Ground Floor, Vasna–Bhayli Main Road, Ashwamegh Nagar, Bhayli, Vadodara 390020","area":"Bhayli","city":"Vadodara","cuisines":["Cafe","Coffee","Continental","Italian","Asian"],"price":"500_1000","price_display":"₹1,200 for two","rating":4.6,"review_count":1462,"tags":["Cafe","Restaurant"],"dietary_options":[],"ambience_tags":["lively","modern"],"occasion_tags":["friends","date"],"spice_profile":"medium","maps_url":"https://www.google.com/maps/search/?api=1&query=The%20House%20of%20Failures%20Bhayli%20Vadodara","source_updated_at":"2026-10-02T00:00:00Z"}
  ]$palateo_json$::jsonb)
)
insert into public.restaurants (
  external_provider, external_place_id, name, address, area, city, latitude, longitude,
  cuisines, price, price_display, rating, review_count, tags, dietary_options,
  ambience_tags, occasion_tags, spice_profile, maps_url, source_updated_at
)
select external_provider, external_place_id, name, address, area, city, latitude, longitude,
       cuisines, price, price_display, rating, review_count, tags, dietary_options,
       ambience_tags, occasion_tags, spice_profile, maps_url, source_updated_at
from incoming
on conflict (external_provider, external_place_id) do nothing;
commit;
