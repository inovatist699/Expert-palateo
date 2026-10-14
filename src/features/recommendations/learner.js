// A per-account logistic model, rebuilt from explicit feedback so edits and undo are exact.
let tasteModelCache=null;
function tasteFeatures(r){
 const features=[];
 for(const [group,values] of Object.entries({cuisine:r.c,tag:r.t,ambience:r.a,occasion:r.o})){
  for(const value of Array.isArray(values)?values:[]){const text=String(value).trim().toLowerCase();if(text&&text.length<=60)features.push(group+':'+text)}
 }
 if(r.p)features.push('price:'+r.p);if(r.s)features.push('spice:'+r.s);
 return [...new Set(features)].sort().slice(0,40);
}
function trainTasteModel(excludedId){
 const samples=Object.entries(state.feedback||{}).filter(([id,value])=>id!==excludedId&&['like','dislike'].includes(value)).sort(([a],[b])=>a.localeCompare(b)).map(([id,value])=>{const r=activeRestaurant(id);return r?{features:tasteFeatures(r),target:value==='like'?1:0}:null}).filter(s=>s?.features.length);
 const weights=Object.create(null);
 for(let epoch=0;epoch<12;epoch++)for(const sample of samples){
  const scale=1/Math.sqrt(sample.features.length),score=sample.features.reduce((n,f)=>n+(weights[f]||0)*scale,0),prediction=1/(1+Math.exp(-Math.max(-20,Math.min(20,score))));
  for(const feature of sample.features)weights[feature]=(weights[feature]||0)*.997+.25*(sample.target-prediction)*scale;
 }
 return {weights,samples:samples.length};
}
function tasteModelAdjustment(r){
 if(['like','dislike'].includes(state.feedback?.[r.id]))return 0;
 const key=String(currentUser?.id||'')+'|'+JSON.stringify(Object.entries(state.feedback||{}).sort(([a],[b])=>a.localeCompare(b)));
 if(!tasteModelCache||tasteModelCache.key!==key)tasteModelCache={key,models:new Map()};
 // Direct feedback already handles known places; the model generalises to unrated places.
 const excluded='';
 if(!tasteModelCache.models.has(excluded))tasteModelCache.models.set(excluded,trainTasteModel(excluded));
 const model=tasteModelCache.models.get(excluded),features=tasteFeatures(r);
 if(!model.samples||!features.length)return 0;
 const score=features.reduce((sum,f)=>sum+(model.weights[f]||0),0)/Math.sqrt(features.length);
 const probability=1/(1+Math.exp(-Math.max(-20,Math.min(20,score))));
 return Math.max(-6,Math.min(6,(probability-.5)*12*Math.min(1,model.samples/3)));
}
