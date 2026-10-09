const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
const crypto = require('node:crypto');
const dir = path.join(__dirname, 'palateo_cloudflare_pages');
const html = fs.readFileSync(path.join(dir, 'app', 'index.html'), 'utf8');
assert.match(html, /<script src="https:\/\/cdn\.jsdelivr\.net\/npm\/@supabase\/supabase-js@2\.117\.2" integrity="sha384-[A-Za-z0-9+/]{64}" crossorigin="anonymous"><\/script>/, 'Supabase CDN dependency must be pinned and integrity protected');
const script = html.match(/<script>([\s\S]*?)<\/script>/)[1].replace(/\r\n?/g, '\n');
const nodes = new Map();
const node = id => {
  if (!nodes.has(id)) nodes.set(id, {innerHTML:'', classList:{add(){},remove(){},toggle(){}},setAttribute(){},removeAttribute(){},focus(){},remove(){}});
  return nodes.get(id);
};
const context = vm.createContext({console, URL, setTimeout:()=>0, clearTimeout(){},
  window:{scrollTo(){}}, navigator:{}, location:{href:'https://palateocloudflarepages.vercel.app/'},
  localStorage:{getItem:()=>null,setItem(){}},
  document:{getElementById:node,querySelectorAll:()=>[],addEventListener(){},body:{insertAdjacentHTML(){}}},assert});
vm.runInContext(script.replace(/initV5\(\);\s*$/, ''), context);
// A persisted city used to evaluate cityCenters before its const declaration.
const returningContext=vm.createContext({console,URL,setTimeout:()=>0,clearTimeout(){},window:{scrollTo(){}},navigator:{},location:{href:'https://palateo.in/app/'},localStorage:{getItem:()=>JSON.stringify({selectedCity:'Vadodara'}),setItem(){}},document:context.document});
vm.runInContext(script.replace(/initV5\(\);\s*$/, ''),returningContext);
assert.equal(vm.runInContext('selectedCity',returningContext),'Vadodara','A returning user restores their city without crashing startup');
vm.runInContext(`
globalThis.runChecks=async()=>{
 const user=id=>({id,user_metadata:{palateo_legal_version:LEGAL_VERSION,palateo_privacy_consent:true}});
 const answers=()=>Object.fromEntries(questions.map(q=>[q.k,q.o[0][0]]));
 useAccount(user('new-user'));authRequired=false;
 let taste={confidence:82,max_distance_km:5},interactions=[];
 let writes=0,pending=null;
 supabaseClient={from(table){const result={data:table==='taste_profiles'?taste:table==='profiles'?{}:table==='interactions'?interactions:[],error:null};const q={select(){return q},eq(){return q},order(){return q},range(){return q},maybeSingle(){return q},upsert(){writes++;return q},update(){writes++;return q},insert(){return q},then(resolve,reject){return (pending?pending.then(()=>result):Promise.resolve(result)).then(resolve,reject)}};return q}};
 state.onboarded=true;
 await loadCloudState();
 assert.equal(hasTasteProfile(),false,'empty cloud row must not complete onboarding');
 assert.equal(ranked().length,0);
 go('home');assert.match(document.getElementById('root').innerHTML,/Taste profile setup/);
 assert.match(document.getElementById('root').innerHTML,/class="tasteActions"/);
 assert.match(document.getElementById('root').innerHTML,/Your taste quiz/);
 assert.doesNotMatch(document.getElementById('root').innerHTML,/tasteQuizBanner/,'Quiz must fit mobile without a repeated promotional banner');
 assert.doesNotMatch(document.getElementById('root').innerHTML,/Find food that feels like you/);
 const originalSetup=document.getElementById('root').innerHTML;
 let scrollCalls=0;window.scrollTo=()=>scrollCalls++;
 pick('mood','quiet',0);assert.equal(scrollCalls,0,'Picking must not jump to the top');
 assert.equal(document.getElementById('root').innerHTML,originalSetup,'Picking preserves the focused choice node');
 assert.equal(document.getElementById('tasteContinue').disabled,false);
 state.answers={};
 await finishV5();assert.equal(writes,0,'incomplete setup must not write a profile');
 state.answers=answers();state.answers.spice='invalid';state.onboarded=true;
 assert.equal(hasTasteProfile(),false,'invalid choices must not unlock matches');
 state.answers=answers();state.onboarded=false;await finishV5();
 assert.equal(hasTasteProfile(),true);assert.ok(ranked().length>0);assert.equal(writes,2);
 home();assert.ok(document.getElementById('root').innerHTML.includes(ranked()[0].score+'%<small> top taste match</small>'),'Home percentage must be the real top restaurant score');
 assert.equal(hasCoordinates({latitude:null,longitude:null}),false,'Missing coordinates must not create a map pin at zero');
 assert.equal(hasCoordinates({latitude:22.3,longitude:73.2}),true);
 assert.equal(hasCoordinates({latitude:95,longitude:73.2}),false,'Invalid coordinates must not be mapped');
 assert.match(document.getElementById('root').innerHTML,/data-action="home-view"/,'Both recommendation views stay available');
 assert.doesNotMatch(card(ranked()[0]),/Verified Coordinates|Trust Guarantee|Direct Google Maps verification/,'Do not invent verification in restaurant recommendations');
 const a=answers();taste={cuisines:{primary:a.cuisine},spice_level:a.spice,budget:a.budget,ambience:{primary:a.mood},occasions:{primary:a.occasion},priorities:{primary:a.priority,dietary_preference:a.diet},max_distance_km:Number(a.distance)};
 useAccount(null);assert.equal(ranked().length,0);
 useAccount(user('new-user'));await loadCloudState();assert.equal(hasTasteProfile(),true,'complete cloud profile restores on return');
 useAccount(user('another-user'));assert.equal(hasTasteProfile(),false,'account switch clears old taste');
 taste=null;await loadCloudState();assert.equal(ranked().length,0);
 taste={cuisines:{primary:a.cuisine},spice_level:a.spice,budget:a.budget,ambience:{primary:a.mood},occasions:{primary:a.occasion},priorities:{primary:a.priority,dietary_preference:a.diet},max_distance_km:2};
 let release;pending=new Promise(resolve=>release=resolve);const loading=loadCloudState();
 pick('mood','lively',0);release();await loading;pending=null;
 assert.equal(state.answers.mood,'lively','late cloud response must not erase new answers');
 state.answers=answers();state.onboarded=true;resetTaste();assert.equal(ranked().length,0);
 taste={cuisines:{primary:a.cuisine},spice_level:a.spice,budget:a.budget,ambience:{primary:a.mood},occasions:{primary:a.occasion},priorities:{primary:a.priority,dietary_preference:a.diet},max_distance_km:2};
 await loadCloudState();assert.equal(hasTasteProfile(),false,'retake must not restore old answers');
 assert.equal(Object.keys(state.answers).length,0);
 state.answers=answers();state.onboarded=true;state.retakeInProgress=false;state.feedback={};
 assert.equal(curatedAdditions.length,16);assert.equal(new Set(curatedAdditions.map(r=>r.external_place_id)).size,16);
 for(const row of curatedAdditions){const venue=normalizeDbRestaurant(row);assert.ok(isQualifiedVenue(venue));assert.ok(Number.isFinite(rec(venue).score));assert.equal(venue.id,row.external_place_id);}
 const restaurant={...catalog[0],id:'feedback-test',dbId:'feedback-db'};dbCatalog=[restaurant];
 rebuildLearning();const baseline=rec(restaurant).score;
 learn(restaurant,'like');assert.equal(state.ai.likes,1);assert.equal(state.confidence,100);
 assert.ok(rec(restaurant).score>baseline);learn(restaurant,null);
 assert.equal(state.ai.likes,0);assert.equal(state.confidence,100);assert.equal(rec(restaurant).score,baseline);
 assert.equal(Object.keys(state.ai.signals).length,0);
 // Cover high and low matches in both cities: ceilings must not swallow feedback or undo.
 for(const city of ['Ahmedabad','Vadodara']){
  const perfect={...restaurant,id:'perfect-'+city,city,c:['Gujarati'],t:['Gujarati','Restaurant'],a:['quiet'],o:['date'],p:'under_500',s:'mild',dietaryOptions:['vegetarian'],rating:5,review_count:1000};
  const poor={...perfect,id:'poor-'+city,c:['Italian'],t:['Restaurant'],a:['lively'],o:['friends'],p:'2000_plus',s:'hot',dietaryOptions:['nonveg']};
  dbCatalog=[perfect,poor];state.feedback={};rebuildLearning();
  const initial=rec(perfect).score;assert.ok(initial>90);assert.ok(rec(poor).score<50);
  learn(perfect,'like');assert.ok(rec(perfect).score>initial,'High match must rise on like');assert.equal(feedbackCount(),1);
  assert.equal(state.ai.signals.gujarati,1,'Duplicate tags teach once');learn(perfect,null);assert.equal(rec(perfect).score,initial);assert.equal(feedbackCount(),0);
  learn(perfect,'dislike');assert.ok(rec(perfect).score<initial);learn(perfect,null);assert.equal(rec(perfect).score,initial);
  const low=rec(poor).score;learn(poor,'dislike');assert.ok(rec(poor).score<low,'Low match must also change');learn(poor,null);assert.equal(rec(poor).score,low);
 }
 dbCatalog=[restaurant];state.feedback={};rebuildLearning();
 const legacyBaseline=rec(restaurant).score;
 learn(restaurant,'like');assert.equal(rec(restaurant).score,Math.min(99,legacyBaseline+7),'Original Vercel like reinforcement');
 learn(restaurant,null);assert.equal(rec(restaurant).score,legacyBaseline);
 learn(restaurant,'dislike');assert.equal(rec(restaurant).score,Math.max(1,legacyBaseline-18),'Original Vercel pass reinforcement');
 learn(restaurant,null);learn(restaurant,'visited');assert.equal(rec(restaurant).score,Math.min(99,legacyBaseline+4));
 learn(restaurant,null);
 learn(restaurant,'like');learn(restaurant,'dislike');assert.equal(state.ai.likes,0);assert.equal(state.ai.dislikes,1);
 interactions=[{restaurant_id:restaurant.dbId,type:'like'},{restaurant_id:restaurant.dbId,type:'like',metadata:{removed:true}}];
 await loadCloudState();assert.equal(state.feedback[restaurant.id],undefined);assert.equal(state.confidence,100);assert.equal(state.ai.dislikes,0);
 interactions=[{restaurant_id:restaurant.dbId,type:'visited'}];await loadCloudState();assert.equal(state.ai.visits,1);
 interactions=[];await loadCloudState();assert.equal(state.ai.visits,0);
 const originalSync=syncInteraction;let synced;
 syncInteraction=async(rest,type,metadata)=>{synced={type,metadata};return true};logEvent=async()=>true;
 await rateV5(restaurant.id,'like');assert.equal(state.ai.likes,1);
 assert.match(card(rec(restaurant)),/♥ Undo like/);
 const beforeUndoScroll=scrollCalls;
 await rateV5(restaurant.id,'like');assert.equal(state.ai.likes,0);assert.equal(synced.metadata.removed,true);assert.equal(synced.type,'like');
 assert.equal(scrollCalls,beforeUndoScroll,'Undo must preserve reading position');
 assert.match(card(rec(restaurant)),/♡ Like/);
 syncInteraction=async()=>false;await rateV5(restaurant.id,'like');assert.match(document.getElementById('toast').textContent,/cloud sync failed/);
 await loadCloudState();assert.equal(state.feedback[restaurant.id],'like','Failed cloud writes must preserve local feedback on reopen');
 syncInteraction=originalSync;
 interactions=[];let releaseOldFeedback;pending=new Promise(resolve=>releaseOldFeedback=resolve);
 const oldFeedbackLoad=loadCloudState();await Promise.resolve();learn(restaurant,'like');state.unsyncedFeedback={};
 pending=null;releaseOldFeedback();await oldFeedbackLoad;assert.equal(state.feedback[restaurant.id],'like','A stale cloud read must not undo feedback already changed and synced');
 learn(restaurant,null);
 state.feedback={};state.unsyncedFeedback={};let releaseFeedback,feedbackCalls=[];
 syncInteraction=async(rest,type,metadata)=>{feedbackCalls.push(metadata.removed);if(feedbackCalls.length===1)await new Promise(resolve=>releaseFeedback=resolve);return true};
 const rapidLike=rateV5(restaurant.id,'like');await Promise.resolve();const rapidUndo=rateV5(restaurant.id,'like');assert.equal(state.ai.likes,0,'Undo is immediate even before the first cloud write finishes');
 await Promise.resolve();releaseFeedback();await Promise.all([rapidLike,rapidUndo]);assert.deepEqual(feedbackCalls,[false,true]);assert.equal(state.confidence,100);
 syncInteraction=originalSync;
 window.supabase={};let recoveryCalls=0;supabaseClient.auth={resetPasswordForEmail:async(email,options)=>{recoveryCalls++;assert.equal(options.redirectTo,'https://palateo.in/app/');return {error:null}},resend:async()=>({error:null}),updateUser:async()=>({error:null})};
 document.getElementById('authEmail').value='user@example.invalid';await sendAuthEmail('recovery');assert.equal(recoveryCalls,1);await sendAuthEmail('recovery');assert.equal(recoveryCalls,1,'Email requests have a cooldown');
 document.getElementById('resetPassword').value='strong-password';document.getElementById('resetConfirm').value='different';await resetAccountPassword();assert.match(document.getElementById('authStatus').textContent,/matching passwords/);
 document.getElementById('resetConfirm').value='strong-password';passwordRecovery=true;await resetAccountPassword();assert.equal(passwordRecovery,false);
 let pageCalls=0;const paged=await loadAllRows({range(offset){pageCalls++;return Promise.resolve({data:Array.from({length:offset===0?500:1},(_,i)=>({id:offset+i})),error:null})}});assert.equal(pageCalls,2);assert.equal(paged.data.length,501);
 state.answers.distance='2';userLocation={lat:22.3,lon:73.2};assert.equal(withinTravelRange({latitude:22.3,longitude:73.2}),true);assert.equal(withinTravelRange({latitude:23,longitude:73.2}),false);assert.equal(withinTravelRange({}),false);
 dbCatalog=[restaurant];state.saves=[restaurant.id];saved();assert.ok(document.getElementById('root').innerHTML.includes(restaurant.name),'Saved place survives a distance filter with missing coordinates');
 state.answers.distance='any';assert.equal(withinTravelRange({}),true);userLocation=null;
 const generic={...restaurant,c:['Restaurant']},unknown={...restaurant,c:[]};assert.equal(rec(generic).score,rec(unknown).score,'A venue type is not a verified cuisine mismatch');
};`, context);
context.runChecks().then(()=>{
  const hash='sha256-'+crypto.createHash('sha256').update(script).digest('base64');
  const config=JSON.parse(fs.readFileSync(path.join(dir,'vercel.json'),'utf8'));
  const header=config.headers[0].headers.find(h=>h.key==='Content-Security-Policy');
  if(process.argv.includes('--update-csp')){
    header.value=header.value.replace(/sha256-[A-Za-z0-9+/=]+/,hash);
    fs.writeFileSync(path.join(dir,'vercel.json'),JSON.stringify(config,null,2)+'\n');
  }
  assert.ok(header.value.includes(hash),'CSP must match browser-normalized script');
  console.log('PASS: onboarding, account isolation, cloud race, reversible ratings, cloud replay, sync failures, password recovery, email cooldown, CSP');
}).catch(error=>{console.error(error);process.exitCode=1});
