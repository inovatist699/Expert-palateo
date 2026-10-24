const fs=require('node:fs'),assert=require('node:assert/strict');
const audit=JSON.parse(fs.readFileSync('docs/OTHER_CITIES_DIETARY_AUDIT_2026-10-21.json','utf8'));
const targets=audit.database_records.map(({id,external_provider,external_place_id,name,city,area,address,dietary_options})=>{
  assert.match(id,/^[0-9a-f-]{36}$/);assert.equal(city,'Ahmedabad');
  return {id,external_provider,external_place_id,name,city,area,address,dietary_options};
});
assert.equal(targets.length,9);
const sql=`-- Reviewed evidence and pre-update values: docs/OTHER_CITIES_DIETARY_AUDIT_2026-10-21.json.
-- Append only; abort the whole transaction if identity or dietary data changed.
begin;
do $$
declare
  target record;
begin
  for target in select * from jsonb_to_recordset('${JSON.stringify(targets).replaceAll("'","''")}'::jsonb)
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
`;
fs.writeFileSync('supabase/data/20261021_other_cities_pure_veg.sql',sql);
console.log('Generated guarded update for',targets.length,'restaurants');
