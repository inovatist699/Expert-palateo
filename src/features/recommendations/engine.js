/* Adaptive recommendation algorithm.
   Base content similarity -> feedback reinforcement -> social similarity -> exploration.
*/
function rec(r){
const a=state.answers||{},f=state.feedback||{},why=[];
const list=v=>Array.isArray(v)?v.map(x=>String(x).toLowerCase().trim()):[];
const cuisines=list(r.c||r.cuisines),ambience=list(r.a||r.ambience_tags),occasions=list(r.o||r.occasion_tags),tags=list(r.t||r.tags);
const diet=list(r.dietaryOptions||r.dietary_options).map(x=>x.replace(/[^a-z]/g,''));
const preferenceFactors=[];
const addFactor=(label,weight,factor,matchLabel)=>{preferenceFactors.push({label,weight,factor});if(factor>0.45&&matchLabel)why.push(matchLabel);else if(factor<-.45)why.push(label+' differs from your preference')};
const wordMatch=(values,terms)=>values.some(x=>terms.some(term=>x===term||x.includes(term)));
if(a.cuisine){
 const hit=preferredCuisines(a).some(key=>cuisineFits(r,key));
 const known=cuisines.some(x=>!['restaurant','fast food','food court'].includes(x));
 addFactor('Cuisine',a.priority==='food'?32:24,hit?1:known?-0.7:0,'One of your favourite cuisines');
}
const budgetRanks={under_500:0,'500_1000':1,'1000_2000':2,'2000_plus':3};
if(a.budget&&Object.hasOwn(budgetRanks,a.budget)&&Object.hasOwn(budgetRanks,r.p)){
 const gap=Math.abs(budgetRanks[a.budget]-budgetRanks[r.p]);
 const factor=gap===0?1:gap===1?-.15:-.8;
 addFactor('Price',20,factor,gap===0?'Budget fit':null);
}
const hasVeg=diet.some(x=>['veg','vegetarian','pureveg','jain','vegan','vegetarianonly','vegetarianoptions'].includes(x));
const hasNonVeg=diet.some(x=>['nonveg','nonvegetarian','nonvegetarianoptions','mixed','both'].includes(x));
const vegetarianOnly=diet.some(x=>['vegetarian','pureveg','jain','vegan','vegetarianonly'].includes(x));
const hasEgg=diet.some(x=>['egg','eggs','eggetarian','ovovegetarian','eggoptions'].includes(x));
const dietMatch=a.diet==='veg'?hasVeg:a.diet==='eggetarian'?(hasVeg||hasEgg):hasNonVeg;
const dietConflict=(a.diet==='veg'&&(hasNonVeg||hasEgg)&&!hasVeg)||(a.diet==='eggetarian'&&hasNonVeg&&!hasVeg&&!hasEgg)||(a.diet==='nonveg'&&vegetarianOnly&&!hasNonVeg);
if(['veg','eggetarian','nonveg'].includes(a.diet)){
 const known=dietMatch||dietConflict;
 addFactor('Dietary options',22,dietMatch?1:known?-1:0,a.diet==='eggetarian'?(hasEgg?'Egg options noted':'Vegetarian options suit your diet'):a.diet==='veg'?'Vegetarian options noted':'Non-vegetarian options noted');
 if(!known)why.push('Dietary options not verified');
}
if(a.mood){
 const aliases={quiet:['quiet','cozy','calm','peaceful','heritage','intimate'],lively:['lively','music','vibrant','energetic','modern'],date:['date','romantic','intimate','cozy','heritage'],family:['family','kid-friendly','peaceful']};
 const hit=preferredVibes(a).some(v=>wordMatch(ambience,aliases[v]||[v]));
 addFactor('Ambience',a.priority==='ambience'?20:14,hit?1:ambience.length?-.55:0,'Vibe match');
}
if(a.occasion){const hit=occasions.includes(String(a.occasion).toLowerCase());addFactor('Occasion',12,hit?1:occasions.length?-.6:0,'Occasion fit')}
if(a.spice&&a.spice!=='depends'&&r.s){const spice=String(r.s).toLowerCase(),wanted=String(a.spice).toLowerCase();addFactor('Spice level',8,spice===wanted?1:-.65,'Spice fit')}
if(a.priority==='unique'){const unique=wordMatch([...ambience,...tags],['heritage','live music','unique','themed','brewpub']);addFactor('Experience',8,unique?1:0,unique?'Distinctive experience noted':null)}
if(a.priority==='value'&&Object.hasOwn(budgetRanks,r.p)){const factor=budgetRanks[r.p]<=1?1:budgetRanks[r.p]===2?-.25:-.7;addFactor('Value',8,factor,factor>0?'Value fit':null)}
let totalWeight=preferenceFactors.reduce((sum,x)=>sum+x.weight,0),preferenceScore=totalWeight?preferenceFactors.reduce((sum,x)=>sum+x.factor*x.weight,0)/totalWeight:0;
let s=55+preferenceScore*36;
/* Rating and review count add a small confidence signal; they never override taste conflicts. */
if(a.priority==='food'&&Number.isFinite(Number(r.rating)))s+=(Number(r.rating)-4)*2;
const reviewCount=Number(r.review_count||0);if(reviewCount>=100)s+=1.5;else if(reviewCount>=30)s+=.75;
if(Array.isArray(r.review_insights)&&r.review_insights.length){
 const insightText=r.review_insights.join(' ').toLowerCase();
 if(a.mood==='quiet'&&/\b(peaceful|calm|cozy|serene|tranquil|quiet)\b/.test(insightText)){s+=1.5;why.push('Diners highlight peaceful ambience')}
 if(a.mood==='lively'&&/\b(vibrant|bustling|lively|energetic)\b/.test(insightText)){s+=1.5;why.push('Diners praise lively atmosphere')}
 if(a.cuisine&&insightText.includes(String(a.cuisine).toLowerCase())){s+=1.5;why.push('Diners praise '+a.cuisine+' specialties')}
 if(a.priority==='unique'&&/\b(heritage|iconic|historic|authentic)\b/.test(insightText)){s+=1.5;why.push('Diners highlight authentic character')}
}

const learnedDelta=tasteModelAdjustment(r);s+=learnedDelta;
if(learnedDelta>=1)why.unshift('Similar to places you liked');
else if(learnedDelta<=-1)why.unshift('Similar to places you passed');
const dishDelta=dishAdjustment(r);s+=dishDelta;
if(dishDelta>=1)why.unshift('Your dish preferences favour this cuisine');
else if(dishDelta<=-1)why.unshift('Your dish passes lower this estimate');
s=Math.max(1,Math.min(96,s));
// Original Vercel reinforcement: bounded additions preserve the strength of taste conflicts.
// Keep room above the baseline ceiling so liking a high match visibly changes it.
if(f[r.id]==='like'){s+=7;why.unshift('You liked this before')}
if(f[r.id]==='dislike'){s-=18;why.unshift('You rejected this before')}
if(f[r.id]==='visited'){s+=4;why.unshift('You visited this place')}
if(dietConflict)s=Math.min(s,35);
s=Math.max(1,Math.min(99,Math.round(s)));
if(!why.length)why.push('Matches your overall palate');
return {...r,description:r.description||(typeof r.why==='string'?r.why:''),score:s,why,matchBreakdown:preferenceFactors};
}
function ranked(){return catalog.map(rec).sort((a,b)=>b.score-a.score)}
