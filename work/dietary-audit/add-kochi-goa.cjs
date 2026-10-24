const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const providers=require('./kochi-goa-provider-data.json');
const evidence={
 'koc-brindhavan-palarivattom':['https://brindhavan.in/','https://brindhavan.in/contact-us/'],
 'koc-gokul-oottupura-kadavanthra':['https://gokuloottupura.in/pure-veg-dining-in-kochi-why-gokul-oottupura-leads-the-way/','https://gokuloottupura.in/outlets/'],
 'goa-navtara-panaji':['https://navtara.in/','https://navtara.in/about-us/'],
 'goa-cafe-tato-patto':['https://www.swiggy.com/restaurants/central-goa/panjim/cafe-tato-483519/dineout']
};
const records=providers.map(({id,city,area,url,restaurant:r})=>{
 assert.ok(r.aggregateRating.ratingValue>0&&r.aggregateRating.ratingValue<=5);
 assert.ok(r.geo.latitude>0&&r.geo.longitude>0);
 const cost=Number(r.priceRange.replace(/[^0-9]/g,''));assert.ok(cost>0);
 return {id,name:r.name,area,city,latitude:r.geo.latitude,longitude:r.geo.longitude,address:r.address.streetAddress,c:r.servesCuisine,p:cost<500?'under_500':cost<=1000?'500_1000':'1000_2000',displayPrice:r.priceRange,rating:r.aggregateRating.ratingValue,review_count:r.aggregateRating.ratingCount,ratingSource:'District',t:['Restaurant'],a:[],o:[],dietaryOptions:['vegetarian','pure_veg'],emoji:'🍽️',maps:'https://www.google.com/maps/search/?api=1&query='+r.geo.latitude+','+r.geo.longitude,description:'Vegetarian-only restaurant in '+area+'.',source_url:url,source_updated_at:'2026-10-21',dietary_sources:evidence[id]};
});
for(const city of ['Kochi','Goa']){
 const file='src/models/venues/'+city.toLowerCase()+'.js',original=fs.readFileSync(file,'utf8');
 const read=s=>vm.runInNewContext(s+';'+city.toLowerCase()+'Catalog');
 const before=read(original),additions=records.filter(r=>r.city===city);
 assert.ok(additions.every(r=>!before.some(b=>b.id===r.id||b.name.toLowerCase()===r.name.toLowerCase())));
 const updated=original.replace(/\s*\];\s*$/,',\n'+additions.map(r=>JSON.stringify(r,null,4)).join(',\n')+'\n];\n');
 assert.deepEqual(JSON.parse(JSON.stringify(read(updated))),JSON.parse(JSON.stringify([...before,...additions])));
 fs.writeFileSync(file,updated);
}
fs.writeFileSync('docs/KOCHI_GOA_DIETARY_AUDIT_2026-10-21.json',JSON.stringify({reviewed_at:'2026-10-21',catalogue_counts:{Kochi:{before:14,after:16,pure_veg:2},Goa:{before:15,after:17,pure_veg:2}},added_records:records.map(r=>({id:r.id,name:r.name,city:r.city,area:r.area,address:r.address,latitude:r.latitude,longitude:r.longitude,rating:r.rating,review_count:r.review_count,displayPrice:r.displayPrice,metadata_source:r.source_url,dietary_sources:r.dietary_sources}))},null,2)+'\n');
console.log('Added four verified branches; all existing records preserved exactly.');
