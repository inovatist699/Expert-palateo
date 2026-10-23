const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const root={innerHTML:''};let venue={id:'test',name:'Test venue',city:'Ahmedabad',c:['Gujarati'],p:'under_500',rating:4.5,review_count:50,review_insights:['Friendly staff'],score:80,why:['Cuisine fit'],matchBreakdown:[]};
const ctx=vm.createContext({assert,console,Date,URL,setTimeout(){},state:{answers:{diet:'veg'},feedback:{},saves:[],dishFeedback:{}},document:{getElementById(){return root}},location:{href:'https://palateo.in/app/'},activeRestaurant:()=>venue,rec:r=>r,cityName:()=> 'Ahmedabad',resolveVenuePhoto:()=>'',detailRestaurantId:'test'});
for(const file of ['src/shared/ui/formatting.js','src/features/calibration/model.js','src/shared/ui/restaurant-card.js','src/features/place/views.js','src/features/profile/views.js'])vm.runInContext(fs.readFileSync(file,'utf8'),ctx);
vm.runInContext(`
for(const venue of [{},{c:['Cafe']},null,undefined]){
 assert.equal(getVenueOpenStatus(venue).isOpen,null,'Missing hours must not imply open or closed');
 assert.equal(getVenueOpenStatus(venue).statusText,'Hours unverified');
}
for(const hours of [{Monday:'9-5'},[],42,'Closed','9:99 AM - 11 PM','25:00 - 26:00'])assert.equal(getVenueOpenStatus({hours}).isOpen,null,'Malformed hours remain unknown');
assert.equal(parseTimeStr('25:00'),null);assert.equal(parseTimeStr('9:99 AM'),null);assert.equal(parseTimeStr('9:00 garbage'),null);
getISTDate=()=>new Date(2026,0,1,23,30);
assert.equal(getVenueOpenStatus({hours:'10 PM - 2 AM'}).isOpen,true);
assert.equal(getVenueOpenStatus({hours:'09:00 - 17:00'}).isOpen,false);
assert.equal(getVenueOpenStatus({hours:'Open 24 hours'}).isOpen,true);
assert.equal(getVenueOpenStatus({}).isOpen,null,'Missing hours remain unknown at night');
assert.doesNotMatch(getVenueOpenStatus({hours:'24/7'}).timingText,/Confirmed with venue/i);
getISTDate=()=>new Date(2026,0,1,14,0);
assert.equal(getVenueOpenStatus({}).isOpen,null,'Missing hours remain unknown during the day');
assert.equal(getVenueOpenStatus({hours:'9 AM - 5 PM'}).isOpen,true);
assert.match(getVenueOpenStatus({hours:'9 AM - 5 PM'}).statusText,/Within listed hours/);
place();
assert.match(document.getElementById('root').innerHTML,/Hours unverified/);
assert.doesNotMatch(document.getElementById('root').innerHTML,/Open Now|Standard hours|Confirmed with venue/);
assert.doesNotMatch(document.getElementById('root').innerHTML,/Google Maps Verified|₹56|Signature crowd favourite/,'Do not invent verification, menu or prices');
assert.match(document.getElementById('root').innerHTML,/taste examples|not a verified menu/i);
`,ctx);
assert.match(vm.runInContext('studioRestaurantCard(activeRestaurant())',ctx),/Hours unverified/);
assert.doesNotMatch(vm.runInContext('studioRestaurantCard(activeRestaurant())',ctx),/studioStatus isClosed|Open Now/);
for(const diet of ['veg','eggetarian','any']){
 ctx.state.answers.diet=diet;vm.runInContext('place()',ctx);
 const html=root.innerHTML;for(const [,id] of html.matchAll(/data-action="dish-rate" data-dish-id="([^"]+)"/g))assert.ok(vm.runInContext('calibrationDishes.some(d=>d.id==='+JSON.stringify(id)+')',ctx));
 if(diet==='veg')assert.doesNotMatch(html,/Contains egg|Non-vegetarian/);
 if(diet==='any'){assert.match(html,/Chicken dum biryani|Gujarati thali/)}
}
venue.signatureDishes=[{id:'menu-only',name:'Listed dish',isVeg:true}];vm.runInContext('place()',ctx);assert.match(root.innerHTML,/Price not listed/);assert.doesNotMatch(root.innerHTML,/data-action="dish-rate"/);
ctx.getActiveCatalog=()=>[venue];ctx.ranked=()=>[];ctx.state.feedback.test='visited';
assert.match(vm.runInContext('renderPassportModal()',ctx),/Test venue/,'Visit history must survive recommendation filters');
console.log('PASS: venue hours validation, overnight ranges, unknown evidence and honest dish examples');
