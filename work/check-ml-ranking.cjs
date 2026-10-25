const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const read=p=>fs.readFileSync(path.join(__dirname,'../src',p),'utf8');
const learner=process.argv[2]?fs.readFileSync(process.argv[2],'utf8'):read('features/recommendations/learner.js');
const context=vm.createContext({assert,console,state:{feedback:{}},currentUser:{id:'evaluation'},venues:{}});
vm.runInContext(read('features/calibration/model.js')+'\n'+learner,context);
vm.runInContext(`
activeRestaurant=id=>venues[id];
const results=[];
// New venue IDs hold out identity; these synthetic cases test feature generalisation, not real-user accuracy.
for(const [axis,values] of Object.entries({ambience:['quiet','lively'],occasion:['date','family'],price:['under_500','2000_plus'],spice:['mild','hot']})){
const combinations=[['Italian',values[0]],['Italian',values[1]],['Gujarati',values[0]],['Gujarati',values[1]]];
const venue=(id,index)=>{
 const [cuisine,value]=combinations[index],r={id,c:[cuisine]};
 if(axis==='ambience')r.a=[value];if(axis==='occasion')r.o=[value];if(axis==='price')r.p=value;if(axis==='spice')r.s=value;
 return r;
};
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
 results.push({axis,pattern:likedMask,auc,precisionAt2:top.filter(r=>r.relevant).length/2});
 assert.equal(getTasteModel(),model,'Repeated inference reuses the fitted model');
}
}
globalThis.metrics={synthetic:true,heldOutVenues:results.length*4,patterns:results,meanAuc:results.reduce((s,r)=>s+r.auc,0)/results.length,precisionAt2:results.reduce((s,r)=>s+r.precisionAt2,0)/results.length};
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
 const repeated={c:['Italian'],a:['quiet']};
 for(const [likes,passes,sign] of [[90,1,1],[1,90,-1]]){
  const samples=Array.from({length:likes+passes},(_,i)=>({features:tasteFeatures(repeated),target:i<likes?1:0}));
  const model=trainTasteModel(samples);
  assert.ok(sign*tasteModelAdjustment({id:'majority-heldout',...repeated},model)>1,'One contradictory rating must not erase overwhelming evidence of the opposite preference');
 }
 const skewed=[];
 for(let i=0;i<90;i++)skewed.push({id:'like-'+i,target:1,features:tasteFeatures({c:['Italian'],a:['quiet']})});
 skewed.push({id:'pass',target:0,features:tasteFeatures({c:['Italian'],a:['lively']})});
 const imbalanced=trainTasteModel(skewed);
 assert.ok(tasteModelAdjustment({id:'quiet',c:['Italian'],a:['quiet']},imbalanced)>tasteModelAdjustment({id:'lively',c:['Italian'],a:['lively']},imbalanced),'A minority pass must still teach a relative preference');
 assert.ok(tasteModelAdjustment({id:'quiet',c:['Italian'],a:['quiet']},imbalanced)>0&&tasteModelAdjustment({id:'lively',c:['Italian'],a:['lively']},imbalanced)<0,'Majority likes must not turn a distinct passed pattern into a positive recommendation');
 const reversed=trainTasteModel(skewed.map(sample=>({...sample,target:1-sample.target})));
 assert.ok(tasteModelAdjustment({id:'quiet',c:['Italian'],a:['quiet']},reversed)<0&&tasteModelAdjustment({id:'lively',c:['Italian'],a:['lively']},reversed)>0,'Majority passes must not suppress a distinct liked pattern');
 assert.ok(Object.values(imbalanced.weights).every(Number.isFinite));
 const rich={c:Object.keys(cuisineAliases),a:['quiet','lively','cozy','formal','modern','heritage'],o:['date','family','solo','friends'],p:'under_500',s:'mild'};
 const features=tasteFeatures(rich);
 assert.ok(features.length<=64,'Feature crosses must retain the browser model size bound');
 assert.equal(new Set(features).size,features.length,'Repeated metadata must not multiply model evidence');
 const specific=tasteFeatures({c:['Italian'],o:['date'],p:'under_500',s:'mild'});
 for(const context of ['occasion:date','price:under_500','spice:mild'])assert.ok(specific.includes('combination:italian|'+context));
 const crowded={...rich,a:Array.from({length:80},(_,i)=>'ambience-'+i),t:Array.from({length:80},(_,i)=>'tag-'+i)};
 const crowdedFeatures=tasteFeatures(crowded);
 for(const feature of ['cuisine:italian','occasion:date','price:under_500','spice:mild'])assert.ok(crowdedFeatures.includes(feature),'Large metadata groups must not erase '+feature);
 assert.deepEqual(tasteFeatures({...crowded,a:crowded.a.slice().reverse(),t:crowded.t.slice().reverse()}),crowdedFeatures,'Metadata order must not change the feature budget');
 const similar={c:['Italian'],a:['quiet'],o:['date'],p:'under_500',s:'mild'};
 const strong=trainTasteModel([{features:tasteFeatures(similar),target:1}]);
 const weak=trainTasteModel([{features:tasteFeatures({c:['Japanese'],a:['quiet'],o:['family']}),target:1}]);
 // Isolate evidence confidence from fitted weights: only the feedback neighbourhood differs.
 assert.ok(tasteModelAdjustment({id:'new',...similar},{...weak,weights:strong.weights})<tasteModelAdjustment({id:'new',...similar},strong)/2,'One shared atmosphere tag must not count as a full matching example');
 assert.equal(tasteModelAdjustment({id:'new',...similar},strong),tasteModelAdjustment({id:'new',...similar},{weights:strong.weights,samples:strong.samples}),'Indexed evidence must match the reference calculation');
 const indexed={weights:strong.weights,evidence:strong.evidence,get samples(){throw new Error('Inference scanned training samples')}};
 assert.equal(tasteModelAdjustment({id:'new',...similar},indexed),tasteModelAdjustment({id:'new',...similar},strong));
 // Conflicting labels and previously unseen tags, with held-out combinations of nuisance metadata.
 for(let seed=0;seed<5;seed++){
  const noisy=[];
  for(let cuisine=0;cuisine<2;cuisine++)for(let price=0;price<2;price++)for(let copy=0;copy<5;copy++){
   const r={c:[cuisine?'Gujarati':'Italian'],p:price?'2000_plus':'under_500',t:['training-'+seed+'-'+copy],a:[copy%2?'quiet':'lively']};
   const preferred=cuisine===price;
   noisy.push({features:tasteFeatures(r),target:Number(copy===seed?!preferred:preferred)});
  }
  const model=trainTasteModel(noisy),scores=[];
  for(let cuisine=0;cuisine<2;cuisine++)for(let price=0;price<2;price++)scores.push({relevant:cuisine===price,score:tasteModelAdjustment({id:'noisy-heldout',c:[cuisine?'Gujarati':'Italian'],p:price?'2000_plus':'under_500',t:['unseen-tag'],a:['quiet']},model)});
  assert.ok(Math.min(...scores.filter(x=>x.relevant).map(x=>x.score))>Math.max(...scores.filter(x=>!x.relevant).map(x=>x.score)),'Context ranking must survive 20% contradictory labels and unseen tags, split '+seed);
 }
 `,context);
 console.log('PASS: held-out synthetic ranking, noisy labels, unseen tags, balanced feature budgets, similarity confidence, indexed inference, cache reuse and contradictory evidence');
}
