const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const read=p=>fs.readFileSync(path.join(__dirname,'../src',p),'utf8');
const learner=process.argv[2]?fs.readFileSync(process.argv[2],'utf8'):read('features/recommendations/learner.js');
const context=vm.createContext({assert,console,state:{feedback:{}},currentUser:{id:'evaluation'},venues:{}});
vm.runInContext(read('features/calibration/model.js')+'\n'+learner,context);
vm.runInContext(`
activeRestaurant=id=>venues[id];
const combinations=[['Italian','quiet'],['Italian','lively'],['Gujarati','quiet'],['Gujarati','lively']];
const venue=(id,index)=>({id,c:[combinations[index][0]],a:[combinations[index][1]],p:'under_500',s:'mild'});
const results=[];
// Synthetic taste patterns: cuisine, atmosphere and crossed cuisine/atmosphere preferences.
for(const likedMask of [3,5,9,6,10,12]){
 state.feedback={};venues={};
 for(let i=0;i<4;i++)for(let copy=0;copy<3;copy++){
  const id='train-'+i+'-'+copy;venues[id]=venue(id,i);state.feedback[id]=(likedMask&(1<<i))?'like':'dislike';
 }
 const model=getTasteModel(),heldOut=combinations.map((_,i)=>({index:i,relevant:!!(likedMask&(1<<i)),score:tasteModelAdjustment(venue('heldout-'+i,i),model)}));
 assert.ok(heldOut.every(r=>Number.isFinite(r.score)&&Math.abs(r.score)<=6));
 const positives=heldOut.filter(r=>r.relevant),negatives=heldOut.filter(r=>!r.relevant);
 const auc=positives.reduce((sum,p)=>sum+negatives.reduce((s,n)=>s+(p.score>n.score?1:p.score===n.score?.5:0),0),0)/(positives.length*negatives.length);
 const top=heldOut.slice().sort((a,b)=>b.score-a.score||a.index-b.index).slice(0,2);
 results.push({pattern:likedMask,auc,precisionAt2:top.filter(r=>r.relevant).length/2});
 assert.equal(getTasteModel(),model,'Repeated inference reuses the fitted model');
}
globalThis.metrics={synthetic:true,heldOutVenues:24,patterns:results,meanAuc:results.reduce((s,r)=>s+r.auc,0)/results.length,precisionAt2:results.reduce((s,r)=>s+r.precisionAt2,0)/results.length};
`,context);
console.log(JSON.stringify(context.metrics));
if(!process.argv[2]){
 assert.ok(context.metrics.meanAuc>=.95,'Learn held-out combination preferences, not just independent cuisine/vibe effects');
 assert.equal(context.metrics.precisionAt2,1,'Both top venues should match each synthetic taste pattern');
 vm.runInContext(`
 const identical=[{id:'yes',features:['cuisine:italian'],target:1},{id:'no',features:['cuisine:italian'],target:0}];
 const conflict=trainTasteModel(identical);state.feedback={};
 assert.equal(tasteModelAdjustment({id:'unseen',c:['Italian']},conflict),0,'Indistinguishable conflicting examples must not invent a preference');
 assert.deepEqual(Object.keys(trainTasteModel([]).weights),[]);
 const skewed=[];
 for(let i=0;i<90;i++)skewed.push({id:'like-'+i,target:1,features:tasteFeatures({c:['Italian'],a:['quiet']})});
 skewed.push({id:'pass',target:0,features:tasteFeatures({c:['Italian'],a:['lively']})});
 const imbalanced=trainTasteModel(skewed);
 assert.ok(tasteModelAdjustment({id:'quiet',c:['Italian'],a:['quiet']},imbalanced)>tasteModelAdjustment({id:'lively',c:['Italian'],a:['lively']},imbalanced),'A minority pass must still teach a relative preference');
 assert.ok(Object.values(imbalanced.weights).every(Number.isFinite));
 `,context);
 console.log('PASS: held-out synthetic ranking, bounded learning, cache reuse and contradictory evidence');
}
