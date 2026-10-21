-- Evidence and pre-update values: docs/VADODARA_DIETARY_AUDIT_2026-10-21.md.
-- Append only; preserve existing dietary labels and reject conflicting records.
begin;
do $$
declare
  target_ids text[] := array[
    'vad-greenr-cafe', 'vad-mouj-by-mishri', 'vad-house-of-failures',
    'dno-vad-stellar', 'dno-vad-la-ville', 'dno-vad-kansaar',
    'dno-vad-22nd-parallel', 'dno-vad-makeba'
  ];
begin
  if (select count(*) from public.restaurants
      where city = 'Vadodara' and external_provider = 'palateo-curated'
        and external_place_id = any(target_ids)) <> 8 then
    raise exception 'Expected exactly eight verified Vadodara restaurants';
  end if;
  if exists (
    select 1 from public.restaurants r, unnest(r.dietary_options) as option(value)
    where r.city = 'Vadodara' and r.external_provider = 'palateo-curated'
      and r.external_place_id = any(target_ids)
      and regexp_replace(lower(option.value), '[^a-z]', '', 'g') = any(array[
        'egg','eggs','eggetarian','ovovegetarian','eggoptions',
        'nonveg','nonvegetarian','nonvegetarianoptions','mixed','both'
      ])
  ) then
    raise exception 'Conflicting dietary evidence; re-audit before labelling';
  end if;
  update public.restaurants
    set dietary_options = array_append(coalesce(dietary_options, '{}'::text[]), 'pure_veg')
    where city = 'Vadodara' and external_provider = 'palateo-curated'
      and external_place_id = any(target_ids)
      and not ('pure_veg' = any(coalesce(dietary_options, '{}'::text[])));
end $$;
commit;
