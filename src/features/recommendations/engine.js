/* Preference fit plus bounded proximity, review evidence and reversible feedback. */
function restaurantDietaryEvidence(r){
 const values=[...(Array.isArray(r.dietaryOptions)?r.dietaryOptions:[]),...(Array.isArray(r.dietary_options)?r.dietary_options:[]),...(r.t||[]),...(r.tags||[]),r.dietaryType,r.dietary_type].filter(value=>typeof value==='string').map(value=>value.toLowerCase().replace(/[^a-z]/g,''));
 const has=options=>values.some(value=>options.includes(value));
 const hasEgg=has(['egg','eggs','eggetarian','ovovegetarian','eggoptions']);
 const hasNonVeg=has(['nonveg','nonvegetarian','nonvegetarianoptions','mixed','both']);
 const pureClaim=r.isPureVeg===true||r.is_pure_veg===true||r.pure_veg===true||has(['pureveg','purevegetarian','vegetarianonly','vegonly','veganonly']);
 const hasVeg=pureClaim||has(['veg','vegetarian','jain','vegan','vegetarianoptions','vegoptions','mixed','both']);
 return {hasVeg,hasEgg,hasNonVeg,pureVegetarian:pureClaim&&!hasEgg&&!hasNonVeg};
}
function isPureVegRestaurant(r){return restaurantDietaryEvidence(r).pureVegetarian}
function matchesDietaryPreference(r){
 const evidence=restaurantDietaryEvidence(r),diet=state.answers?.diet;
 return diet==='veg'?evidence.hasVeg:diet==='eggetarian'?(evidence.hasVeg||evidence.hasEgg):diet==='nonveg'?evidence.hasNonVeg:true;
}
function compareRecommendations(a,b){return (b.rankScore??b.score)-(a.rankScore??a.score)||(a.distanceKm??Infinity)-(b.distanceKm??Infinity)||String(a.id).localeCompare(String(b.id))}
function rec(r,tasteModel){
const a=state.answers||{},f=state.feedback||{},why=[];
const list=v=>Array.isArray(v)?v.map(x=>String(x).toLowerCase().trim()):[];
const cuisines=list(r.c||r.cuisines),ambience=list(r.a||r.ambience_tags),occasions=list(r.o||r.occasion_tags),tags=list(r.t||r.tags);
const preferenceFactors=[];
const addFactor=(label,weight,factor,matchLabel)=>{preferenceFactors.push({label,weight,factor});if(factor>0.45&&matchLabel)why.push(matchLabel);else if(factor<-.45)why.push(label+' differs from your preference')};
const wordMatch=(values,terms)=>values.some(x=>terms.some(term=>x===term||x.includes(term)));
if(preferredCuisines(a).length){
 const hit=preferredCuisines(a).some(key=>cuisineFits(r,key));
 const known=cuisines.some(x=>!['restaurant','fast food','food court'].includes(x));
 addFactor('Cuisine',a.priority==='food'?32:24,hit?1:known?-0.7:0,'One of your favourite cuisines');
}
const budgetRanks={under_500:0,'500_1000':1,'1000_2000':2,'2000_plus':3};
if(a.budget&&Object.hasOwn(budgetRanks,a.budget)){
 const gap=budgetRanks[r.p]-budgetRanks[a.budget];
 const factor=!Object.hasOwn(budgetRanks,r.p)?0:gap===0?1:gap<0?.7:gap===1?-.35:-.9;
 addFactor('Price',20,factor,gap===0?'Budget fit':gap<0?'Within your budget':null);
}
const {hasVeg,hasNonVeg,hasEgg}=restaurantDietaryEvidence(r);
const dietMatch=a.diet==='veg'?hasVeg:a.diet==='eggetarian'?(hasVeg||hasEgg):hasNonVeg;
const dietConflict=(a.diet==='veg'&&(hasNonVeg||hasEgg)&&!hasVeg)||(a.diet==='eggetarian'&&hasNonVeg&&!hasVeg&&!hasEgg)||(a.diet==='nonveg'&&hasVeg&&!hasNonVeg);
if(['veg','eggetarian','nonveg'].includes(a.diet)){
 const known=dietMatch||dietConflict;
 addFactor('Dietary options',22,dietMatch?1:known?-1:0,a.diet==='eggetarian'?(hasEgg?'Egg options noted':'Vegetarian options suit your diet'):a.diet==='veg'?'Vegetarian options noted':'Non-vegetarian options noted');
 if(!known)why.push('Dietary options not verified');
}
if(preferredVibes(a).length){
 const aliases={quiet:['quiet','cozy','calm','peaceful','heritage','intimate'],lively:['lively','music','vibrant','energetic','modern'],date:['date','romantic','intimate','cozy','heritage'],family:['family','kid-friendly','peaceful']};
 const hit=preferredVibes(a).some(v=>wordMatch(ambience,aliases[v]||[v]));
 addFactor('Ambience',a.priority==='ambience'?20:14,hit?1:ambience.length?-.55:0,'Vibe match');
}
if(a.occasion){const hit=occasions.includes(String(a.occasion).toLowerCase());addFactor('Occasion',12,hit?1:occasions.length?-.6:0,'Occasion fit')}
if(['mild','medium','hot'].includes(a.spice)){
 const levels=['mild','medium','hot'],actual=levels.indexOf(String(r.s||'').toLowerCase()),gap=Math.abs(actual-levels.indexOf(a.spice));
 addFactor('Spice level',8,actual<0?0:gap===0?1:gap===1?-.3:-1,'Spice fit');
}
if(a.priority==='unique'){const unique=wordMatch([...ambience,...tags],['heritage','live music','unique','themed','brewpub']);addFactor('Experience',8,unique?1:0,unique?'Distinctive experience noted':null)}
if(a.priority==='value'){const factor=!Object.hasOwn(budgetRanks,r.p)?0:budgetRanks[r.p]<=1?1:budgetRanks[r.p]===2?-.25:-.7;addFactor('Value',8,factor,factor>0?'Value fit':null)}
const distanceKm=venueDistanceKm(r),travelRange=Number(a.distance);
let totalWeight=preferenceFactors.reduce((sum,x)=>sum+x.weight,0),preferenceScore=totalWeight?preferenceFactors.reduce((sum,x)=>sum+x.factor*x.weight,0)/totalWeight:0;
let s=55+preferenceScore*36;
// GPS enriches a match without changing the denominator of its taste score.
if(distanceKm!==null){const proximity=Math.max(0,1-distanceKm/(Number.isFinite(travelRange)&&travelRange>0?travelRange:10));s+=3*proximity;addFactor('Distance',0,proximity,'Nearby · '+distanceKm.toFixed(1)+' km away')}
/* Supported review quality is bounded and applies alongside every taste priority. */
const count=Number(r.review_count),reviewCount=Number.isFinite(count)&&count>0?count:0,rating=Number(r.rating);
if(Number.isFinite(rating)&&rating>0&&rating<=5)s+=Math.max(-4,Math.min(2,(rating-4)*(a.priority==='food'?3:2)*reviewCount/(reviewCount+30)));
// Review prose remains display-only: keyword presence cannot establish positive sentiment.

const learnedDelta=tasteModelAdjustment(r,tasteModel);s+=learnedDelta;
if(learnedDelta>=1)why.unshift('Similar to places you liked');
else if(learnedDelta<=-1)why.unshift('Similar to places you passed');
const dishDelta=dishAdjustment(r);s+=dishDelta;
const topCal=venueCalibratedDishes(r)[0];
if(dishDelta>=1){why.unshift('Your dish preferences favour this cuisine');if(topCal&&topCal.matchScore>=88)why.unshift('Palate fit: '+dishSensoryWhy(topCal,r).replace(/^Calibrated for your love of /,''));}
else if(dishDelta<=-1)why.push('Your dish passes lower this estimate');if(topCal)preferenceFactors.push({label:'Sensory Palate Fit',weight:0,factor:(topCal.matchScore-50)/50,matchLabel:topCal.matchScore+'% sensory fit ('+topCal.name+')'});if(typeof getRankedTasteTwins==='function'){const topTwin=getRankedTasteTwins()[0];if(topTwin&&topTwin.dynamicMatch>=88){const specificHit=topTwin.likes.some(id=>{const d=calibrationDishes.find(x=>x.id===id);return d&&dishAffinity(r,d)>=1;});if(specificHit&&dishDelta>=0){why.push('Taste twin pick · '+topTwin.name+' ('+topTwin.dynamicMatch+'% match)');}}}
const hasHours=!!(r.openTiming||r.hours||r.timing);
if(hasHours&&typeof getVenueOpenStatus==='function'){
 const openInfo=getVenueOpenStatus(r);
 const ist=(typeof getISTDate==='function')?getISTDate():new Date();
 const h=ist.getHours()+ist.getMinutes()/60;
 const period=(h>=6.5&&h<11.5)?'breakfast':(h>=11.5&&h<15.5)?'lunch':(h>=15.5&&h<19.0)?'tea':(h>=19.0&&h<23.0)?'dinner':'latenight';
 const pool=[...(r.c||[]),...(r.t||[]),...(r.o||[]),...(r.a||[])].map(x=>String(x).toLowerCase());
 const corpus=pool.join(' ')+' '+((r.why||'')+' '+(r.description||'')+' '+(r.name||'')).toLowerCase();
 const mealKeywords={breakfast:['breakfast','dosa','idli','south indian','cafe','coffee','bakery','poha','farsan','puri','morning'],lunch:['lunch','thali','gujarati','punjabi','north indian','biryani','rice','meal','bhojanalay','wholesome'],tea:['tea','chai','coffee','cafe','bakery','snacks','chaat','patisserie','sandwich','dessert','bakes'],dinner:['dinner','fine dining','rooftop','multi-cuisine','italian','pan-asian','tandoor','romantic']};
 const mealFit=(period==='latenight')?((typeof isLateNightCafe==='function'&&isLateNightCafe(r))||/late\s*night|midnight|24\s*hours|24\/7|night\s*owl|ice\s*cream|kulfi|falooda/i.test(corpus)):mealKeywords[period]?.some(term=>corpus.includes(term));
 if(openInfo.isOpen){
  const boost=mealFit?2.5:1.2;
  s+=boost;
  const periodLabels={breakfast:'breakfast',lunch:'lunch',tea:'afternoon coffee & tea',dinner:'dinner',latenight:'midnight dining'};
  if(mealFit)why.unshift('Open now · Ideal for '+(periodLabels[period]||'dining'));
  else why.push('Open now ('+openInfo.statusText+')');
  preferenceFactors.push({label:'Timing & Operating Hours',weight:0,factor:mealFit?0.75:0.45,matchLabel:openInfo.statusText});
 }else{
  s-=2.0;
  preferenceFactors.push({label:'Operating Hours',weight:0,factor:-0.4,matchLabel:openInfo.statusText});
  why.push(openInfo.statusText);
 }
}
s=Math.max(1,Math.min(96,s));
// Original Vercel reinforcement: bounded additions preserve the strength of taste conflicts.
// Keep room above the baseline ceiling so liking a high match visibly changes it.
if(f[r.id]==='like'){s+=7;why.unshift('You liked this before')}
if(f[r.id]==='dislike'){s-=18;why.unshift('You rejected this before')}
if(f[r.id]==='visited'){s+=4;why.unshift('You visited this place')}
if(dietConflict)s=Math.min(s,35);
s=Math.max(1,Math.min(99,s));
if(!why.length)why.push('Matches your overall palate');
return {...r,distanceKm,description:r.description||(typeof r.why==='string'?r.why:''),rankScore:s,score:Math.round(s),why,matchBreakdown:preferenceFactors};
}
function applyDiversityReranking(candidates){
 if(!Array.isArray(candidates)||candidates.length<=2)return candidates;
 const pool=candidates.slice(0,Math.min(candidates.length,30));
 const remainingTail=candidates.slice(30);
 const selected=[];
 const unselected=pool.slice();
 selected.push(unselected.shift());
 const getPrimaryCuisine=r=>{const c=r.c||r.cuisines;return (Array.isArray(c)&&c.length)?String(c[0]).toLowerCase().trim():''};
 const getPrimaryTags=r=>{const t=r.t||r.tags;return (Array.isArray(t)&&t.length)?t.slice(0,3).map(x=>String(x).toLowerCase().trim()):[]};
 while(unselected.length>0){
  const last1=selected[selected.length-1],last2=selected.length>=2?selected[selected.length-2]:null;
  let bestIdx=0,bestMmrScore=-Infinity;
  for(let i=0;i<unselected.length;i++){
   const cand=unselected[i],candCuisine=getPrimaryCuisine(cand),candTags=getPrimaryTags(cand);
   let penalty=0;
   if(candCuisine&&candCuisine===getPrimaryCuisine(last1))penalty+=3.5;
   else if(last2&&candCuisine&&candCuisine===getPrimaryCuisine(last2))penalty+=1.5;
   const last1Tags=getPrimaryTags(last1),sharedTags=candTags.filter(tag=>last1Tags.includes(tag));
   if(sharedTags.length>=2)penalty+=1.5;
   const effectivePenalty=Math.min(penalty,4.5);
   const mmrScore=(cand.rankScore??cand.score)-effectivePenalty;
   if(mmrScore>bestMmrScore){bestMmrScore=mmrScore;bestIdx=i}
  }
  selected.push(unselected.splice(bestIdx,1)[0]);
 }
 return [...selected,...remainingTail];
}
function ranked(){
 if(!hasTasteProfile())return [];
 const model=getTasteModel();
 const candidates=getActiveCatalog().filter(r=>state.feedback?.[r.id]!=='dislike'&&isQualifiedVenue(r)&&matchesDietaryPreference(r)&&(!pureVegOnly||isPureVegRestaurant(r))&&withinTravelRange(r)).map(r=>rec(r,model)).sort(compareRecommendations);
 return applyDiversityReranking(candidates);
}
