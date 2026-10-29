// Per-account ranking model, rebuilt from explicit feedback so edits and undo are exact.
let tasteModelCache=null;
function tasteFeatures(r){
 const features=[];
 for(const [group,values] of Object.entries({cuisine:r.c,tag:r.t,ambience:r.a,occasion:r.o})){
  for(const value of Array.isArray(values)?values:[]){const text=String(value).trim().toLowerCase();if(text&&text.length<=60&&!['restaurant','food court','fast food','veg','vegetarian','nonveg','non-vegetarian'].includes(text))features.push(group+':'+text)}
 }
 const cuisines=Object.keys(cuisineAliases).filter(key=>cuisineFits(r,key));
 for(const key of cuisines)features.push('cuisine:'+key.toLowerCase());
 if(r.p)features.push('price:'+r.p);if(r.s)features.push('spice:'+r.s);
 const unique=[...new Set(features)].sort();
 const base=Object.entries({cuisine:12,tag:12,ambience:6,occasion:4,price:1,spice:1}).flatMap(([group,limit])=>unique.filter(feature=>feature.startsWith(group+':')).slice(0,limit));
 // Crossed features let pairwise training learn cuisine-specific contexts instead of only global tastes.
 const contexts=[...base.filter(feature=>feature.startsWith('price:')||feature.startsWith('spice:')), ...base.filter(feature=>feature.startsWith('occasion:')).slice(0,4),...base.filter(feature=>feature.startsWith('ambience:')).slice(0,6)];
 const combinations=contexts.flatMap(context=>cuisines.map(cuisine=>'combination:'+cuisine.toLowerCase()+'|'+context));
 return [...base,...combinations].slice(0,64);
}
function indexTasteEvidence(samples){
 const byFeature=new Map(),sizes=[];
 samples.forEach((sample,index)=>{
  const taste=[...new Set(sample.features.filter(feature=>!feature.startsWith('price:')&&!feature.startsWith('spice:')))];
  sizes.push(taste.length);
  for(const feature of taste){if(!byFeature.has(feature))byFeature.set(feature,[]);byFeature.get(feature).push(index)}
 });
 return {byFeature,sizes};
}
function trainTasteModel(samples){
 const weights=Object.create(null);
 const liked=samples.filter(sample=>sample.target===1),passed=samples.filter(sample=>sample.target===0);
 if(liked.length&&passed.length){
  // Rotate explicit like/pass pairs; work stays linear in feedback size, not all pairs.
  for(let epoch=0;epoch<24;epoch++)for(let i=0;i<Math.max(liked.length,passed.length);i++){
   const positive=liked[i%liked.length],negative=passed[(i+epoch)%passed.length],difference=Object.create(null);
   for(const [sample,sign] of [[positive,1],[negative,-1]])for(const feature of sample.features)difference[feature]=(difference[feature]||0)+sign/Math.sqrt(sample.features.length);
   const score=Object.entries(difference).reduce((sum,[feature,value])=>sum+(weights[feature]||0)*value,0);
   const error=1/(1+Math.exp(Math.max(-20,Math.min(20,score))));
   for(const [feature,value] of Object.entries(difference))if(value)weights[feature]=(weights[feature]||0)*.997+.25*error*value;
  }
  // Pairwise differences cancel identical features; batch pointwise evidence preserves the majority signal.
  for(let epoch=0;epoch<12;epoch++){
   const gradient=Object.create(null);
   for(const sample of samples){
    const scale=1/Math.sqrt(sample.features.length),score=sample.features.reduce((sum,feature)=>sum+(weights[feature]||0)*scale,0);
    const error=sample.target-1/(1+Math.exp(-Math.max(-20,Math.min(20,score))));
    for(const feature of sample.features)gradient[feature]=(gradient[feature]||0)+error*scale;
   }
   for(const [feature,value] of Object.entries(gradient))weights[feature]=(weights[feature]||0)*.997+.25*value/samples.length;
  }
  return {weights,samples,evidence:indexTasteEvidence(samples)};
 }
 for(let epoch=0;epoch<12;epoch++)for(const sample of samples){
  const scale=1/Math.sqrt(sample.features.length),score=sample.features.reduce((n,f)=>n+(weights[f]||0)*scale,0),prediction=1/(1+Math.exp(-Math.max(-20,Math.min(20,score))));
  for(const feature of sample.features)weights[feature]=(weights[feature]||0)*.997+.25*(sample.target-prediction)*scale;
 }
 return {weights,samples,evidence:indexTasteEvidence(samples)};
}
function getTasteModel(){
 const samples=Object.entries(state.feedback||{}).filter(([,value])=>['like','dislike'].includes(value)).sort(([a],[b])=>a.localeCompare(b)).map(([id,value])=>{const r=activeRestaurant(id);return r?{id,features:tasteFeatures(r),target:value==='like'?1:0}:null}).filter(s=>s?.features.length);
 // Catalogue corrections and late cloud loads must invalidate the same feedback's model.
 const key=String(currentUser?.id||'')+'|'+JSON.stringify(samples);
 if(!tasteModelCache||tasteModelCache.key!==key)tasteModelCache={key,model:trainTasteModel(samples)};
 return tasteModelCache.model;
}
function tasteModelAdjustment(r,model){
 if(['like','dislike'].includes(state.feedback?.[r.id]))return 0;
 model=model||getTasteModel();
 const features=tasteFeatures(r);
 const taste=features.filter(feature=>!feature.startsWith('price:')&&!feature.startsWith('spice:'));
 const evidence=model.evidence||indexTasteEvidence(model.samples),overlaps=new Map();
 for(const feature of taste)for(const index of evidence.byFeature.get(feature)||[])overlaps.set(index,(overlaps.get(index)||0)+1);
 // Cosine overlap discounts weak neighbours instead of treating any shared tag as a full example.
 const support=[...overlaps].reduce((sum,[index,count])=>sum+count/Math.sqrt(taste.length*evidence.sizes[index]),0);
 if(!support||!features.length)return 0;
 const score=features.reduce((sum,f)=>sum+(model.weights[f]||0),0)/Math.sqrt(features.length);
 const probability=1/(1+Math.exp(-Math.max(-20,Math.min(20,score))));
 return Math.max(-6,Math.min(6,(probability-.5)*12*Math.min(1,support/3)));
}

/* --- INSTAGRAM REELS-STYLE TWO-TOWER TASTE EMBEDDINGS & REAL-TIME CRAVING ENGINE --- */

function triggerHaptic(type='light'){
 try{
  if(typeof navigator!=='undefined'&&navigator.vibrate){
   if(type==='light')navigator.vibrate(12);
   else if(type==='medium')navigator.vibrate(24);
   else if(type==='success')navigator.vibrate([15,35,20]);
  }
 }catch(e){}
}

const cravingCategories = {
 spicy: {
  id: 'spicy',
  icon: '🔥',
  label: 'Fiery & Spicy',
  terms: ['spicy','schezwan','chilli','pepper','tandoor','wok','hot','chettinad','andhra','kolhapuri','mirchi','tikka','peri peri','wasabi','curry','sizzler'],
  boostAxes: { heat: 0.45, aromatic: 0.25 },
  boost: 14
 },
 comfort: {
  id: 'comfort',
  icon: '🍕',
  label: 'Comfort & Cheesy',
  terms: ['pizza','burger','pasta','cheese','cheesy','fries','loaded','garlic bread','risotto','lasagna','quesadilla','nachos','creamy','sandwich'],
  boostAxes: { rich: 0.4, crisp: 0.25, umami: 0.2 },
  boost: 14
 },
 cafe: {
  id: 'cafe',
  icon: '☕',
  label: 'Cozy Cafe & Coffee',
  terms: ['cafe','coffee','espresso','cappuccino','brew','sourdough','toast','latte','croissant','matcha','bakery','patisserie','pancakes','avocado'],
  boostAxes: { aromatic: 0.35, acidity: 0.2, crisp: 0.2 },
  boost: 14
 },
 asian: {
  id: 'asian',
  icon: '🍜',
  label: 'Bowls & Asian',
  terms: ['asian','ramen','dim sum','dumpling','sushi','noodles','bao','thai','wok','pan-asian','oriental','miso','tempura','korean','japanese'],
  boostAxes: { umami: 0.45, ferment: 0.3, salt: 0.15 },
  boost: 14
 },
 clean: {
  id: 'clean',
  icon: '🥗',
  label: 'Fresh & Clean',
  terms: ['healthy','salad','smoothie','bowl','organic','fresh','green','cold-pressed','superfood','low calorie','grilled','clean','falafel','mezze'],
  boostAxes: { acidity: 0.3, crisp: 0.35 },
  boost: 14
 },
 regional: {
  id: 'regional',
  icon: '🥘',
  label: 'Authentic Regional',
  terms: ['thali','gujarati','kathiyawadi','rajasthani','marwadi','punjabi','dal makhani','dhokli','dosa','south indian','biryani','heritage','mughlai','bhojanalay'],
  boostAxes: { aromatic: 0.35, ferment: 0.25, rich: 0.2 },
  boost: 14
 },
 sweet: {
  id: 'sweet',
  icon: '🍰',
  label: 'Sweet Tooth',
  terms: ['dessert','ice cream','gelato','kulfi','chocolate','waffle','brownie','cake','pastry','sweet','fondant','shake','sundae','falooda'],
  boostAxes: { sweet: 0.55, rich: 0.3 },
  boost: 14
 },
 street: {
  id: 'street',
  icon: '⚡',
  label: 'Chaat & Street Food',
  terms: ['chaat','pani puri','dahi puri','sev puri','pav bhaji','vada pav','kathi roll','roll','street food','farsan','bhelpuri','samosa'],
  boostAxes: { crisp: 0.4, acidity: 0.3, heat: 0.2 },
  boost: 14
 }
};

function getTimeOfDayContext(){
 let hour;
 try {
  const now = new Date();
  const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
  const ist = new Date(utc + (3600000 * 5.5));
  hour = ist.getHours() + ist.getMinutes() / 60;
 } catch(e){
  const now = new Date();
  hour = now.getHours() + now.getMinutes() / 60;
 }
 if (hour >= 6.0 && hour < 11.5) {
  return {
   period: 'breakfast',
   label: 'Morning Fuel & Breakfast',
   prompt: 'Filter coffee, crispy dosas, bakeries & fresh morning eats',
   icon: '🌅',
   timeStr: Math.floor(hour) + ':' + (Math.round((hour % 1) * 60) < 10 ? '0' : '') + Math.round((hour % 1) * 60) + ' AM'
  };
 } else if (hour >= 11.5 && hour < 15.5) {
  return {
   period: 'lunch',
   label: 'Lunch Hours',
   prompt: 'Hearty regional thalis, executive bowls & wholesome lunch spots',
   icon: '☀️',
   timeStr: (Math.floor(hour) > 12 ? Math.floor(hour) - 12 : Math.floor(hour)) + ':' + (Math.round((hour % 1) * 60) < 10 ? '0' : '') + Math.round((hour % 1) * 60) + ' PM'
  };
 } else if (hour >= 15.5 && hour < 19.0) {
  return {
   period: 'tea',
   label: 'High Tea & Evening Bites',
   prompt: 'Chai, artisanal cafes, patisseries & street chaat',
   icon: '☕',
   timeStr: (Math.floor(hour) - 12) + ':' + (Math.round((hour % 1) * 60) < 10 ? '0' : '') + Math.round((hour % 1) * 60) + ' PM'
  };
 } else if (hour >= 19.0 && hour < 23.5) {
  return {
   period: 'dinner',
   label: 'Evening Dining & Dinner',
   prompt: 'Fine dining bistros, woodfired ovens, tandoor grills & dates',
   icon: '🌙',
   timeStr: (Math.floor(hour) - 12) + ':' + (Math.round((hour % 1) * 60) < 10 ? '0' : '') + Math.round((hour % 1) * 60) + ' PM'
  };
 } else {
  return {
   period: 'latenight',
   label: 'Midnight Cravings & Desserts',
   prompt: 'Late-night kitchens, artisanal ice creams & 24/7 night spots',
   icon: '✨',
   timeStr: (hour < 12 ? Math.floor(hour) : Math.floor(hour) - 12) + ':' + (Math.round((hour % 1) * 60) < 10 ? '0' : '') + Math.round((hour % 1) * 60) + (hour < 12 ? ' AM' : ' PM')
  };
 }
}

function getRealTimeCravingBoost(r, cravingKey){
 if(!cravingKey||cravingKey==='all')return {fits:false,boost:0,label:''};
 const def=cravingCategories[cravingKey];
 if(!def)return {fits:false,boost:0,label:''};
 const corpus=[...(r.c||[]),...(r.t||[]),...(r.o||[]),...(r.a||[]),r.name||'',r.description||'',r.why||''].join(' ').toLowerCase();
 const matches=def.terms.some(t=>corpus.includes(t));
 if(!matches)return {fits:false,boost:0,label:def.label};
 return {fits:true,boost:def.boost,label:def.label,icon:def.icon};
}

function computeVenueLatentVector(r){
 const vec = new Float64Array(16);
 const calDishes = typeof venueCalibratedDishes === 'function' ? venueCalibratedDishes(r) : [];
 if(calDishes.length && calDishes[0].sensoryProfile){
  const sp = calDishes[0].sensoryProfile;
  vec[0] = sp.umami ?? 0.5;
  vec[1] = sp.acidity ?? 0.5;
  vec[2] = sp.sweet ?? 0.45;
  vec[3] = sp.salt ?? 0.5;
  vec[4] = sp.bitter ?? 0.3;
  vec[5] = sp.heat ?? 0.4;
  vec[6] = sp.crisp ?? 0.55;
  vec[7] = sp.rich ?? 0.5;
  vec[8] = sp.aromatic ?? 0.6;
  vec[9] = sp.ferment ?? 0.35;
 } else {
  vec[0] = 0.5; vec[1] = 0.5; vec[2] = 0.45; vec[3] = 0.5; vec[4] = 0.3;
  vec[5] = r.s === 'hot' ? 0.85 : r.s === 'mild' ? 0.2 : 0.5;
  vec[6] = 0.55; vec[7] = 0.5; vec[8] = 0.6; vec[9] = 0.35;
 }
 vec[10] = r.s === 'hot' ? 0.9 : r.s === 'mild' ? 0.2 : 0.55;
 vec[11] = r.p === '2000_plus' ? 0.95 : r.p === '1000_2000' ? 0.75 : r.p === '500_1000' ? 0.5 : 0.25;
 const isVeg = typeof isPureVegRestaurant === 'function' ? isPureVegRestaurant(r) : false;
 vec[12] = isVeg ? 1.0 : (r.dietaryOptions || []).includes('veg') ? 0.7 : 0.3;
 const amb = (r.a || []).map(x => String(x).toLowerCase());
 vec[13] = amb.some(x => ['quiet','cozy','calm','peaceful','intimate'].includes(x)) ? 0.85 : 0.25;
 const occ = (r.o || []).map(x => String(x).toLowerCase());
 vec[14] = occ.some(x => ['date','romantic','party'].includes(x)) ? 0.9 : 0.4;
 const count = Number(r.review_count || 0);
 vec[15] = Math.min(1.0, count / 500);

 let norm = 0;
 for(let i = 0; i < 16; i++) norm += vec[i] * vec[i];
 norm = Math.sqrt(norm) || 1;
 for(let i = 0; i < 16; i++) vec[i] /= norm;
 return vec;
}

function computeUserPalateEmbedding(){
 if(typeof computeUserTasteVector !== 'function') return null;
 const { vector: u } = computeUserTasteVector();
 const a = state.answers || {};
 const vec = new Float64Array(16);
 vec[0] = u.umami ?? 0.55;
 vec[1] = u.acidity ?? 0.5;
 vec[2] = u.sweet ?? 0.45;
 vec[3] = u.salt ?? 0.55;
 vec[4] = u.bitter ?? 0.3;
 vec[5] = u.heat ?? 0.5;
 vec[6] = u.crisp ?? 0.6;
 vec[7] = u.rich ?? 0.55;
 vec[8] = u.aromatic ?? 0.65;
 vec[9] = u.ferment ?? 0.4;

 vec[10] = a.spice === 'hot' ? 0.9 : a.spice === 'mild' ? 0.2 : 0.55;
 vec[11] = a.budget === '2000_plus' ? 0.95 : a.budget === '1000_2000' ? 0.75 : a.budget === '500_1000' ? 0.5 : 0.25;
 vec[12] = a.diet === 'veg' ? 1.0 : a.diet === 'eggetarian' ? 0.7 : 0.3;
 const vibes = typeof preferredVibes === 'function' ? preferredVibes(a) : [];
 vec[13] = vibes.includes('quiet') ? 0.85 : 0.25;
 vec[14] = a.occasion === 'date' ? 0.9 : 0.4;
 vec[15] = 0.5;

 let norm = 0;
 for(let i = 0; i < 16; i++) norm += vec[i] * vec[i];
 norm = Math.sqrt(norm) || 1;
 for(let i = 0; i < 16; i++) vec[i] /= norm;
 return vec;
}

let cachedUserEmbedding = null;
let cachedEmbeddingKey = '';

function reelsTwoTowerTasteScore(r){
 if(!state?.answers || Object.keys(state.answers).length === 0) return { delta: 0, reelMatchPct: 75 };
 const key = JSON.stringify(state.answers) + '|' + JSON.stringify(state.dishFeedback||{});
 if(!cachedUserEmbedding || cachedEmbeddingKey !== key){
  cachedUserEmbedding = computeUserPalateEmbedding();
  cachedEmbeddingKey = key;
 }
 if(!cachedUserEmbedding) return { delta: 0, reelMatchPct: 75 };
 const v = computeVenueLatentVector(r);
 let dot = 0;
 for(let i = 0; i < 16; i++) dot += cachedUserEmbedding[i] * v[i];
 const cosine = Math.max(0, Math.min(1, dot));
 const reelMatchPct = Math.round(Math.min(99, Math.max(65, cosine * 100)));
 const delta = Math.max(-1.2, Math.min(1.2, (cosine - 0.75) * 5));
 return { delta, reelMatchPct };
}

function getTasteTwinLookalike(r){
 if(typeof getRankedTasteTwins !== 'function') return null;
 const twins = getRankedTasteTwins();
 if(!twins || !twins.length) return null;
 const top = twins[0];
 if(!top || top.dynamicMatch < 84) return null;
 const matchingDishId = (top.likes || []).find(id => {
  const d = (typeof calibrationDishes !== 'undefined') ? calibrationDishes.find(x => x.id === id) : null;
  return d && typeof dishAffinity === 'function' && dishAffinity(r, d) >= 1;
 });
 if(matchingDishId){
  const d = calibrationDishes.find(x => x.id === matchingDishId);
  return {
   twinName: top.name,
   matchPct: top.dynamicMatch,
   dishName: d ? d.name : ''
  };
 }
 return null;
}

function getBanditExplorationBonus(r){
 const rating = Number(r.rating || 0);
 const count = Number(r.review_count || 0);
 if(rating >= 4.3 && count >= 15){
  return Math.min(0.6, (rating - 4.2) * 0.8 * Math.min(1.0, count / 80));
 }
 return 0;
}
