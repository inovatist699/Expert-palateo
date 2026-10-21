const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const html=fs.readFileSync(path.join(__dirname,'palateo_cloudflare_pages/app/index.html'),'utf8');
const script=html.match(/<script>([\s\S]*?)<\/script>/)[1].replace(/\r\n?/g,'\n');
const dietaryAudit=JSON.parse(fs.readFileSync(path.join(__dirname,'../docs/OTHER_CITIES_DIETARY_AUDIT_2026-10-21.json'),'utf8'));
const nodes=new Map(),node=id=>{if(!nodes.has(id))nodes.set(id,{innerHTML:'',classList:{add(){},remove(){},toggle(){}},setAttribute(){},removeAttribute(){},focus(){},remove(){}});return nodes.get(id)};
const context=vm.createContext({assert,dietaryAudit,console,URL,setTimeout:()=>0,clearTimeout(){},window:{scrollTo(){}},navigator:{},location:{href:'https://palateo.in/app/'},localStorage:{getItem:()=>null,setItem(){}},document:{getElementById:node,querySelectorAll:()=>[],addEventListener(){},body:{insertAdjacentHTML(){}}}});
vm.runInContext(script.replace(/initV5\(\);\s*$/,''),context);
vm.runInContext(`
 useAccount({id:'diet-distance',user_metadata:{palateo_legal_version:LEGAL_VERSION,palateo_privacy_consent:true}});
 state.answers={mood:'quiet',cuisine:'Gujarati',diet:'veg',budget:'under_500',spice:'mild',occasion:'family',priority:'food',distance:'any'};
 state.onboarded=true;authRequired=false;
 selectedCity='Vadodara';
 const auditedVadodara=getActiveCatalog();
 const verifiedPureIds=['vad-greenr-cafe','vad-mouj-by-mishri','vad-house-of-failures','vad-jagdish-farshan','vad-jassi-de-parathe','vad-vishal-sandwich','vad-new-alka-restaurant','vad-hot-bite','vad-kansar-thali','dno-vad-la-ville','dno-vad-kansaar','dno-vad-22nd-parallel','dno-vad-makeba','dno-vad-stellar'];
 assert.equal(auditedVadodara.length,120,'Dietary corrections must retain every existing Vadodara entry');
 for(const id of verifiedPureIds){
  const records=auditedVadodara.filter(r=>r.id===id);
  assert.ok(records.length,id+' must remain in the catalogue');
  assert.ok(records.every(isPureVegRestaurant),id+' needs verified pure-veg evidence');
 }
 for(const id of ['vad-cafe-fitoor','vad-the-brewery','vad-raju-omelet','vad-jay-mahakali-usal','vad-jassi-de-paranthe']){
  assert.equal(isPureVegRestaurant(auditedVadodara.find(r=>r.id===id)),false,id+' must not gain an unsupported pure-veg label');
 }
 for(const [city,count] of Object.entries(dietaryAudit.bundled_city_counts)){
  selectedCity=city;
  assert.equal(getActiveCatalog().length,count+({Kochi:2,Goa:2,Vadodara:12,Ahmedabad:8}[city]||0),city+' must retain its complete catalogue plus reviewed additions');
 }
 for(const expected of dietaryAudit.source_records){
  selectedCity=expected.city;
  const restaurant=getActiveCatalog().find(r=>r.id===expected.id&&r.name===expected.name&&r.area===expected.area);
  assert.ok(restaurant,expected.id+' must remain in its audited branch');
  assert.ok(isPureVegRestaurant(restaurant),expected.id+' must appear in Pure veg');
 }
 for(const [city,id] of [['Mumbai','mum-bombay-canteen'],['Delhi NCR','del-andhra-bhavan'],['Bengaluru','blr-meghana'],['Hyderabad','hyd-paradise'],['Chennai','chn-buhari'],['Kolkata','kol-peter-cat'],['Pune','pun-george'],['Jaipur','jpr-handi'],['Kochi','koc-kashi-art'],['Goa','goa-gunpowder'],['Chandigarh','chd-pal-dhaba']]){
  selectedCity=city;
  const restaurant=getActiveCatalog().find(r=>r.id===id);assert.ok(restaurant,id+' must remain in the catalogue');
  assert.equal(isPureVegRestaurant(restaurant),false,id+' must remain outside Pure veg');
 }
 for(const [city,ids] of [['Kochi',['koc-brindhavan-palarivattom','koc-gokul-oottupura-kadavanthra']],['Goa',['goa-navtara-panaji','goa-cafe-tato-patto']]]){
  selectedCity=city;pureVegOnly=true;
  assert.deepEqual(ranked().map(r=>r.id).sort(),ids.slice().sort(),city+' must show its two verified pure-veg branches');
  for(const id of ids){const r=getActiveCatalog().find(r=>r.id===id);assert.ok(hasCoordinates(r),id+' needs a verified map position');assert.equal(r.ratingSource,'District');}
 }
 pureVegOnly=false;
 selectedCity='Ahmedabad';
 const base={city:'Ahmedabad',c:['Gujarati'],t:['Restaurant'],a:['quiet'],o:['family'],p:'under_500',s:'mild',rating:4.5,review_count:90,latitude:23.0225,longitude:72.5714};
 const pure={...base,id:'pure',name:'Listed pure veg',dietaryOptions:['pure_veg']};
 const veg={...base,id:'veg',name:'Veg options',dietaryOptions:['vegetarian_options']};
 const egg={...base,id:'egg',name:'Egg only',dietaryOptions:['eggetarian']};
 const meat={...base,id:'meat',name:'Meat only',dietaryOptions:['non-vegetarian']};
 const mixed={...base,id:'mixed',name:'Mixed kitchen',dietaryOptions:['vegetarian','non-vegetarian','eggs']};
 const unknown={...base,id:'unknown',name:'Unknown kitchen',dietaryOptions:[]};
 const contradictory={...base,id:'conflict',name:'Conflicting pure claim',dietaryOptions:['pure veg','eggs']};
 dbCatalog=[pure,veg,egg,meat,mixed,unknown];getActiveCatalog=()=>dbCatalog;
 const ids=()=>ranked().map(r=>r.id).sort();
 const originalBudget=state.answers.budget;state.answers.budget='500_1000';
 assert.ok(rec({...veg,p:'under_500'}).score>rec({...veg,p:'1000_2000'}).score,'An affordable alternative should beat an equally distant over-budget option');
 assert.match(rec({...veg,p:'under_500'}).why.join(' '),/budget/i);
 state.answers.budget=originalBudget;
 state.saves.push(veg.id);learn(veg,'dislike');
 assert.ok(!ids().includes(veg.id),'Explicit passes are excluded from recommendations');
 assert.ok(state.saves.includes(veg.id),'Passing must not delete saved places');
 learn(veg,null);assert.ok(ids().includes(veg.id),'Undo restores eligibility');
 assert.deepEqual(ids(),['mixed','pure','veg'],'Vegetarian is a hard eligibility rule, not only a score penalty');
 learn(egg,'like');assert.ok(!ids().includes('egg'),'Likes cannot override vegetarian exclusions');learn(egg,null);
 state.answers.diet='eggetarian';assert.deepEqual(ids(),['egg','mixed','pure','veg']);
 state.answers.diet='nonveg';assert.deepEqual(ids(),['meat','mixed']);
 state.answers.diet='any';assert.equal(ids().length,6,'All foods keeps unverified dietary data available');
 pureVegOnly=true;dbCatalog.push(contradictory);assert.deepEqual(ids(),['pure'],'Pure veg excludes mixed, unknown and conflicting listings');
 const explicit=normalizeDbRestaurant({id:'explicit',name:'Explicit flag',city:'Ahmedabad',price:'under_500',rating:4.2,is_pure_veg:true,dietary_options:[]});
 assert.ok(isPureVegRestaurant(explicit),'Preserve an explicit pure-veg field from the catalogue');
 assert.equal(isPureVegRestaurant(veg),false,'Vegetarian options do not establish a vegetarian-only kitchen');
 assert.equal(isPureVegRestaurant({...pure,dietaryOptions:['vegetarian','jain']}),false,'Jain/veg options alone do not prove pure veg');
 pureVegOnly=false;state.answers.diet='veg';userLocation={lat:23.0225,lon:72.5714};
 const near={...veg,id:'near',name:'Nearby match',latitude:23.0235};
 const far={...veg,id:'far',name:'Farther match',latitude:23.0625};
 dbCatalog=[far,near];
 assert.ok(rec(near).score>rec(far).score,'Distance influences otherwise equal taste matches');
 assert.equal(ranked()[0].id,'near');
 assert.ok(rec(near).distanceKm>0&&rec(near).distanceKm<.2,'Use actual GPS coordinates');
 state.answers.distance='2';assert.deepEqual(ids(),['near'],'Apply the chosen travel radius as a hard filter');
 const missing={...veg,id:'missing',latitude:null};dbCatalog=[near,far,missing];assert.deepEqual(ids(),['near']);
 state.answers.distance='any';assert.ok(ids().includes('missing'),'Unknown distance is allowed without a radius');
 assert.equal(venueDistanceKm({...veg,latitude:''}),null);assert.equal(venueDistanceKm({...veg,longitude:200}),null);
 userLocation=null;state.answers.distance='2';assert.equal(ids().length,3,'No GPS must not fabricate a distance or use the city centre');
 assert.equal(rec(near).distanceKm,null);assert.match(travelRangeNote(),/location access/);
 pureVegOnly=true;useAccount({id:'other-account',user_metadata:{}});assert.equal(pureVegOnly,false,'Filter state must not leak across accounts');
 console.log('PASS: strict diet exclusions, pure-veg evidence/conflicts, distance ranking/radius, unknown GPS and account isolation');
`,context);
