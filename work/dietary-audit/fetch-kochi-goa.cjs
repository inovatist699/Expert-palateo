const fs=require('node:fs');
const targets=[
 ['koc-brindhavan-palarivattom','Kochi','Palarivattom','https://www.district.in/dining/kochi/brindhavan-veg-restaurant-palarivattom'],
 ['koc-gokul-oottupura-kadavanthra','Kochi','Kadavanthra','https://www.district.in/dining/kochi/gokul-oottupura-kadavanthra'],
 ['goa-navtara-panaji','Goa','Panaji / Municipal Market','https://www.district.in/dining/goa/navtara-veg-restaurant-panaji'],
 ['goa-cafe-tato-patto','Goa','Patto / Panaji','https://www.district.in/dining/goa/cafe-tato-since-1913-panaji']
];
(async()=>{
 const records=[];
 for(const [id,city,area,url] of targets){
  const response=await fetch(url);if(!response.ok)throw new Error(url+' '+response.status);
  const html=await response.text();
  const schemas=[...html.matchAll(/<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)].flatMap(m=>{const v=JSON.parse(m[1]);return Array.isArray(v)?v:[v]});
  const restaurant=schemas.flatMap(s=>s['@graph']||[s]).find(s=>s['@type']==='Restaurant');if(!restaurant?.geo||!restaurant.aggregateRating)throw new Error('Missing branch data: '+id);
  records.push({id,city,area,url,restaurant});
 }
 fs.writeFileSync(__dirname+'/kochi-goa-provider-data.json',JSON.stringify(records,null,2)+'\n');
 console.log(JSON.stringify(records,null,2));
})().catch(e=>{console.error(e);process.exitCode=1});
