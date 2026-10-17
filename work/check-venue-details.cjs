const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const root={innerHTML:''};let venue={id:'test',name:'Test venue',city:'Ahmedabad',c:['Gujarati'],p:'under_500',rating:4.5,review_count:50,review_insights:['Friendly staff'],score:80,why:['Cuisine fit'],matchBreakdown:[]};
const ctx=vm.createContext({assert,console,Date,URL,setTimeout(){},state:{answers:{diet:'veg'},feedback:{},saves:[],dishFeedback:{}},document:{getElementById(){return root}},location:{href:'https://palateo.in/app/'},activeRestaurant:()=>venue,rec:r=>r,cityName:()=> 'Ahmedabad',photo:()=>'',detailRestaurantId:'test'});
for(const file of ['src/shared/ui/formatting.js','src/features/calibration/model.js','src/features/place/views.js','src/features/profile/views.js'])vm.runInContext(fs.readFileSync(file,'utf8'),ctx);
vm.runInContext(`
assert.equal(getVenueOpenStatus({}).isOpen,null,'Missing hours must stay unknown');
assert.match(getVenueOpenStatus({}).statusText,/unverified/i);
for(const hours of [{Monday:'9-5'},[],42,'Closed','9:99 AM - 11 PM','25:00 - 26:00'])assert.doesNotThrow(()=>getVenueOpenStatus({hours}));
assert.equal(parseTimeStr('25:00'),null);assert.equal(parseTimeStr('9:99 AM'),null);assert.equal(parseTimeStr('9:00 garbage'),null);
getISTDate=()=>new Date(2026,0,1,23,30);
assert.equal(getVenueOpenStatus({hours:'10 PM - 2 AM'}).isOpen,true);
assert.equal(getVenueOpenStatus({hours:'09:00 - 17:00'}).isOpen,false);
assert.equal(getVenueOpenStatus({hours:'Open 24 hours'}).isOpen,true);
place();
assert.doesNotMatch(document.getElementById('root').innerHTML,/Google Maps Verified|₹56|Signature crowd favourite/,'Do not invent verification, menu or prices');
assert.match(document.getElementById('root').innerHTML,/taste examples|not a verified menu/i);
`,ctx);
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
