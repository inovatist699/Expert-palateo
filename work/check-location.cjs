const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const read=p=>fs.readFileSync(path.join(__dirname,'../src',p),'utf8');
function setup(native=false){
 let success,failure,renders=0;
 const ctx=vm.createContext({console,Promise,state:{answers:{distance:'2'}},currentUser:{id:'owner'},selectedCity:'Ahmedabad',userLocation:null,discoverSort:'distance',homeLimit:12,homeCuisine:'all',selectedPinId:null,page:'home',cityCenters:{Ahmedabad:[23.0225,72.5714],Vadodara:[22.3072,73.1812]},document:{getElementById:()=>null,querySelectorAll:()=>[]},persist(){},go(){renders++},window:{},navigator:{geolocation:{getCurrentPosition(ok,fail){success=ok;failure=fail}}}});
 if(native)ctx.window.PalateoNative={getCurrentPosition:()=>new Promise((ok,fail)=>{success=ok;failure=fail})};
 vm.runInContext(read('features/location/controller.js')+'\n'+read('services/catalog-query.js')+'\n'+read('features/map/views.js'),ctx);
 return {ctx,run:s=>vm.runInContext(s,ctx),ok:(lat=23.0225,lon=72.5714)=>success({coords:{latitude:lat,longitude:lon}}),fail:e=>failure(e),renders:()=>renders};
}
(async()=>{
 for(const native of [false,true]){
  const t=setup(native),{ctx,run}=t;
  let p=run('useMyLocation()');assert.equal(run('useMyLocation()'),p,'Repeated taps share one request');t.ok();assert.equal(await p,true);
  assert.equal(ctx.state.answers.distance,'2','Refreshing GPS in the same city preserves the chosen radius');
  assert.ok(run('venueDistanceKm({latitude:23.0325,longitude:72.5714})')>1.11);
  assert.ok(run('venueDistanceKm({latitude:23.0325,longitude:72.5714})')<1.12);
  assert.equal(run('withinTravelRange({latitude:23.0525,longitude:72.5714})'),false);
  p=run('useMyLocation()');t.fail({code:native?'OS-PLUG-GLOC-0003':1});assert.equal(await p,false);
  assert.equal(ctx.userLocation,null,'Failed refresh must not silently keep using an old location');
  assert.equal(ctx.discoverSort,'match');assert.match(run('locationStatusMessage'),/declined/);
  p=run('useMyLocation()');t.ok(22.3072,73.1812);await p;assert.equal(ctx.selectedCity,'Vadodara');assert.equal(ctx.state.answers.distance,'any');
  ctx.discoverSort='distance';p=run('useMyLocation()');run("setCity('Ahmedabad')");assert.equal(await p,false);t.ok(22.3072,73.1812);await Promise.resolve();assert.equal(ctx.selectedCity,'Ahmedabad');assert.equal(ctx.userLocation,null);assert.equal(ctx.discoverSort,'match');
  p=run('useMyLocation()');ctx.currentUser={id:'other'};t.ok();assert.equal(await p,false);assert.equal(ctx.userLocation,null);
  p=run('useMyLocation()');t.ok(0,0);assert.equal(await p,false);assert.equal(ctx.userLocation,null);assert.match(run('locationStatusMessage'),/coverage/);
  p=run('useMyLocation()');t.ok(NaN,0);assert.equal(await p,false);assert.equal(run('locationRequestPending'),false);
 }
 const t=setup();t.ctx.navigator.geolocation.getCurrentPosition=()=>{throw new Error('Unavailable')};
 assert.equal(await t.run('useMyLocation()'),false,'Synchronous provider errors must settle the request');assert.equal(t.run('locationRequestPending'),false);
 for(const value of ['', ' ',false,[],null,undefined,NaN,91]){
  t.ctx.bad=value;assert.equal(t.run('hasCoordinates({latitude:bad,longitude:72})'),false,'Reject malformed marker latitude');
 }
 assert.equal(t.run("hasCoordinates({latitude:'0',longitude:'0'})"),true,'Zero is a valid coordinate');
 console.log('PASS: browser/native location success, radius preservation, distances, denial, refresh failure, city/account races and marker coordinates');
})().catch(e=>{console.error(e);process.exitCode=1});
