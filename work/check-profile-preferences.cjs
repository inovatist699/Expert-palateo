const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
const root=process.argv[2]||path.resolve(__dirname,'..');
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const ctx=vm.createContext({state:{answers:{}},userLocation:{lat:22.3,lon:73.2}});
vm.runInContext(read('src/features/quiz/questions.js')+'\n'+read('src/services/catalog-query.js'),ctx);
assert.equal(vm.runInContext("questions.some(q=>['budget','distance'].includes(q.k))",ctx),false);
for(const [distance,expected] of [['0',false],['1',true],['50',true],['any',true],[undefined,true]]){
 ctx.state.answers.distance=distance;
 assert.equal(vm.runInContext('withinTravelRange({latitude:22.301,longitude:73.2})',ctx),expected,'range '+distance);
}
ctx.state.answers.distance='0';assert.equal(vm.runInContext('withinTravelRange({latitude:22.3,longitude:73.2})',ctx),true);
ctx.state.answers.distance='1';assert.equal(vm.runInContext('withinTravelRange({})',ctx),false);
ctx.userLocation=null;assert.equal(vm.runInContext('withinTravelRange({})',ctx),true);
const view=read('src/features/profile/views.js');
assert.match(view,/Budget tier \(optional\)/);assert.match(view,/Distance filter \(optional\)/);
assert.match(view,/min="0" max="51" step="1"/);assert.match(view,/Any budget/);assert.doesNotMatch(view,/<h2>Your preferences<\/h2>/);assert.match(view,/Taste Genome Studio filters/);
assert.doesNotMatch(view,/retake taste quiz|reset-taste/i);
assert.doesNotMatch(read('src/services/user-repository.js'),/Number\(a.distance\|\|5\)/);
(async()=>{
 let resolveLocation,calls=0;ctx.currentUser={id:'owner'};ctx.cityName=()=> 'Vadodara';ctx.persist=()=>{};ctx.profile=()=>{};ctx.syncTaste=async()=>{};ctx.toast=()=>{};ctx.document={getElementById:()=>null};ctx.feedbackSyncQueue=Promise.resolve();
 ctx.useMyLocation=()=>{calls++;return new Promise(resolve=>{resolveLocation=resolve})};
 const pending=vm.runInContext('setProfileDistance(5)',ctx);
 await vm.runInContext('setProfileDistance(51)',ctx);resolveLocation(true);await pending;
 assert.equal(ctx.state.answers.distance,'any','A late location result must not override Anywhere');assert.equal(calls,1);
 ctx.useMyLocation=async()=>false;await vm.runInContext('setProfileDistance(10)',ctx);assert.equal(ctx.state.answers.distance,'any','Denied location falls back to Anywhere');
 ctx.userLocation={lat:22.3,lon:73.2};await vm.runInContext('setProfileDistance(0)',ctx);assert.equal(ctx.state.answers.distance,'0','Zero is a real optional range');
 await vm.runInContext('setProfileDistance(52)',ctx);assert.equal(ctx.state.answers.distance,'0','Invalid range is rejected');
 console.log('PASS: optional preferences, 0–50 km, unlimited range, denied location, invalid input and stale location requests.');
})().catch(error=>{console.error(error);process.exitCode=1});
