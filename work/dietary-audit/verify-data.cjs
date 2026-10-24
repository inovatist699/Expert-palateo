const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict'),path=require('node:path');
const audit=JSON.parse(fs.readFileSync('docs/OTHER_CITIES_DIETARY_AUDIT_2026-10-21.json','utf8'));
const before=JSON.parse(fs.readFileSync(__dirname+'/database-full-before.json','utf8'));
const after=JSON.parse(fs.readFileSync(__dirname+'/database-full-after.json','utf8'));
const expected=new Map(audit.database_records.map(r=>[r.id,r]));
assert.equal(after.length,before.length);
assert.equal(new Set(after.map(r=>r.id)).size,after.length);
for(const row of before){
  const current=after.find(r=>r.id===row.id);
  assert.ok(current,row.id);
  assert.deepEqual(current,{...row,dietary_options:expected.has(row.id)?[...row.dietary_options,'pure_veg']:row.dietary_options});
}
const fixture=fs.readFileSync('work/check-diet-distance.cjs','utf8');
const setup=fixture.slice(0,fixture.indexOf('vm.runInContext(`'));
vm.runInNewContext(setup+`
context.before=before;context.after=after;
vm.runInContext(\`
 const cityCounts=()=>Object.fromEntries(Object.keys(dietaryAudit.bundled_city_counts).map(city=>{selectedCity=city;return [city,getActiveCatalog().length]}));
 dbCatalog=before.map(normalizeDbRestaurant);const originalCounts=cityCounts();
 dbCatalog=after.map(normalizeDbRestaurant);assert.deepEqual(cityCounts(),originalCounts);
 for(const expected of dietaryAudit.source_records){
  selectedCity=expected.city;
  const restaurant=getActiveCatalog().find(r=>r.name===expected.name);
  assert.ok(isPureVegRestaurant(restaurant),expected.id+' must survive the live DB overlay');
 }
 const counts=Object.fromEntries(Object.keys(dietaryAudit.bundled_city_counts).map(city=>{selectedCity=city;return [city,{all:getActiveCatalog().length,pure:getActiveCatalog().filter(isPureVegRestaurant).length}]}));
 console.log(JSON.stringify(counts));
\`,context);
`,{require,__dirname:path.resolve('work'),console,URL,before,after});
console.log('PASS: all 272 database rows preserved, only nine approved dietary arrays changed, all city counts preserved, and every reviewed label survives database precedence');
