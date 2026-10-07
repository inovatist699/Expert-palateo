-- Refresh selected Vadodara listings with Google rating snapshots and high-level
-- signals from Google reviews. This is an additive metadata update: no rows are deleted.
begin;

alter table public.restaurants add column if not exists review_insights text[] not null default '{}';
update public.restaurants
set rating = v.rating,
    review_count = v.review_count,
    dietary_options = v.dietary_options,
    ambience_tags = v.ambience_tags,
    occasion_tags = v.occasion_tags,
    spice_profile = null,
    review_insights = v.review_insights,
    source_updated_at = '2026-10-02T00:00:00Z'
from (values
  ('vad-the-brewery', 4.4::numeric, 3846, array['vegetarian','non-vegetarian']::text[], array['lively','modern','live music']::text[], array['friends','date']::text[], array['Google reviews often praise the lively atmosphere and music','Some recent reviews report high prices and uneven service']::text[]),
  ('vad-mouj-by-mishri', 4.7::numeric, 314, array['vegetarian']::text[], array['cozy','modern']::text[], array['friends','date']::text[], array['Google review summaries note vegetarian options and positive food and ambience feedback']::text[]),
  ('vad-house-of-failures', 4.6::numeric, 1462, array['vegetarian']::text[], array['peaceful','cozy','live music']::text[], array['friends','date']::text[], array['Google reviews praise the peaceful setting and live music','Recent feedback flags menu availability and value for money']::text[]),
  ('vad-cafe-fitoor', 4.5::numeric, 1465, array['vegetarian','non-vegetarian']::text[], array['cozy','lively']::text[], array['friends','date']::text[], array['Google rating is 4.5 from about 1.5k reviews; reviewers mention ambience and a broad menu']::text[]),
  ('vad-charmant-heritage-cafe', 4.3::numeric, 1235, array[]::text[], array['cozy','heritage']::text[], array['friends','date']::text[], array['Google reviews praise heritage decor','Recent reviews include slow-service complaints']::text[]),
  ('vad-greenr-cafe', 4.5::numeric, 73, array['vegetarian']::text[], array['modern','cozy']::text[], array['friends','date']::text[], array['Google reviewer reports an all-vegetarian menu with vegan and Jain options']::text[]),
  ('vad-cave-cafe', 4.9::numeric, 471, array['vegetarian_options']::text[], array['cozy','themed']::text[], array['date','friends']::text[], array['Google reviews mention themed decor, warm atmosphere and attentive service']::text[])
) as v(external_place_id,rating,review_count,dietary_options,ambience_tags,occasion_tags,review_insights)
where restaurants.external_provider = 'palateo-curated'
  and restaurants.external_place_id = v.external_place_id
  and restaurants.city = 'Vadodara';
commit;




