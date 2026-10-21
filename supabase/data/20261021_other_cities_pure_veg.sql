-- Reviewed evidence and pre-update values: docs/OTHER_CITIES_DIETARY_AUDIT_2026-10-21.json.
-- Append only; abort the whole transaction if identity or dietary data changed.
begin;
do $$
declare
  target record;
begin
  for target in select * from jsonb_to_recordset('[{"id":"df798a5d-8f41-4bcb-9a80-61174d602ec9","external_provider":"palateo_demo","external_place_id":"r1","name":"Agashiye","city":"Ahmedabad","area":"Old City","address":"Old City, Ahmedabad","dietary_options":[]},{"id":"f6a9ae02-5651-4eaf-a958-3a1dc44699ca","external_provider":"palateo_demo","external_place_id":"r3","name":"Under The Neem Trees","city":"Ahmedabad","area":"Bodakdev","address":"Bodakdev, Ahmedabad","dietary_options":[]},{"id":"d84a2405-3d0e-42bb-b41d-b0b3d2496938","external_provider":"palateo_demo","external_place_id":"r4","name":"650 — The Global Kitchen","city":"Ahmedabad","area":"Ahmedabad","address":"Ahmedabad","dietary_options":[]},{"id":"d3d1c74b-cfdc-43cc-b82a-4851fc81f52a","external_provider":"palateo_demo","external_place_id":"r10","name":"Rajwadu","city":"Ahmedabad","area":"Jivraj Park","address":"Jivraj Park, Ahmedabad","dietary_options":[]},{"id":"a18d5124-d825-42a5-8ad5-cad86d5b08b0","external_provider":"palateo_demo","external_place_id":"r11","name":"Jassi De Parathe","city":"Ahmedabad","area":"Prahlad Nagar","address":"Prahlad Nagar, Ahmedabad","dietary_options":[]},{"id":"47e438cc-720d-4ada-bff3-08f3b137b84f","external_provider":"openstreetmap","external_place_id":"node/8548483880","name":"Swati Snacks","city":"Ahmedabad","area":"Ahmedabad","address":null,"dietary_options":[]},{"id":"a1fab5a9-0f35-439c-b2d3-055dcf614d28","external_provider":"openstreetmap","external_place_id":"node/4445025289","name":"Atithi Dining Hall","city":"Ahmedabad","area":"Ahmedabad","address":null,"dietary_options":[]},{"id":"f6de0d88-8d85-4d9e-81e8-480c2b1bee32","external_provider":"openstreetmap","external_place_id":"node/440339381","name":"Vishala","city":"Ahmedabad","area":"Ahmedabad","address":null,"dietary_options":[]},{"id":"95604f83-1ecc-4795-ac13-00a35b19c8be","external_provider":"openstreetmap","external_place_id":"node/9123477265","name":"Gordhan Thal","city":"Ahmedabad","area":"Ahmedabad","address":"Shapath Tower Ground Floor Sarkhej Gandhi Nagar Highway, Near State Bank Of India, Thaltej, Ahmedabad, 380054","dietary_options":["veg"]}]'::jsonb)
    as t(id uuid, external_provider text, external_place_id text, name text, city text,
         area text, address text, dietary_options text[])
  loop
    if not exists (
      select 1 from public.restaurants r where r.id=target.id
        and r.external_provider=target.external_provider and r.external_place_id=target.external_place_id
        and r.name=target.name and r.city=target.city
        and r.area is not distinct from target.area and r.address is not distinct from target.address
        and (r.dietary_options is not distinct from target.dietary_options
          or r.dietary_options is not distinct from array_append(target.dietary_options,'pure_veg'))
    ) then
      raise exception 'Restaurant identity or dietary data changed: %', target.id;
    end if;
    if exists (
      select 1 from public.restaurants r,
        unnest(coalesce(r.dietary_options,'{}'::text[]) || coalesce(r.tags,'{}'::text[])) as option(value)
      where r.id=target.id and regexp_replace(lower(option.value),'[^a-z]','','g')=any(array[
        'egg','eggs','eggetarian','ovovegetarian','eggoptions',
        'nonveg','nonvegetarian','nonvegetarianoptions','mixed','both'
      ])
    ) then
      raise exception 'Conflicting dietary evidence: %', target.id;
    end if;
    update public.restaurants
      set dietary_options=array_append(coalesce(dietary_options,'{}'::text[]),'pure_veg')
      where id=target.id and not ('pure_veg'=any(coalesce(dietary_options,'{}'::text[])));
  end loop;
end $$;
commit;
