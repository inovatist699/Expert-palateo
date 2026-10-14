const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..'),read=file=>fs.readFileSync(path.join(root,file),'utf8');
(async()=>{
 const {validateProduction,allowedOrigins}=await import('../server/runtime-config.js');
 assert.throws(()=>validateProduction({NODE_ENV:'production'}),/DATABASE_URL/);
 assert.throws(()=>validateProduction({NODE_ENV:'production',DATABASE_URL:'postgresql://db'}),/BETTER_AUTH_SECRET/);
 const env={NODE_ENV:'production',DATABASE_URL:'postgresql://db',BETTER_AUTH_SECRET:'a'.repeat(40),BETTER_AUTH_URL:'https://api.palateo.in'};
 assert.doesNotThrow(()=>validateProduction(env));assert.throws(()=>validateProduction({...env,BETTER_AUTH_URL:'http://localhost:3000'}),/HTTPS/);
 assert.equal(allowedOrigins.some(origin=>origin.includes('*')),false);
 assert.doesNotMatch(read('server/index.js'),/seedDefaultUser|Palateo@1234/);
 assert.doesNotMatch(read('server/db.js'),/rejectUnauthorized:\s*false/);
 const config=JSON.parse(read('mobile/capacitor.config.json'));
 assert.equal(config.appId,'in.palateo.app');assert.equal(config.server.url,undefined);assert.equal(config.android.allowMixedContent,false);
 assert.match(read('mobile/android/variables.gradle'),/targetSdkVersion = 36/);
 assert.match(read('mobile/android/app/src/main/AndroidManifest.xml'),/allowBackup="false"/);
 assert.match(read('mobile/ios/App/App/Info.plist'),/NSLocationWhenInUseUsageDescription/);
 assert.doesNotMatch(read('src/services/better-auth-client.js'),/palateo_privacy_consent:\s*true/);
 assert.match(read('src/features/companion/controller.js'),/Live AI permission not granted/);
 assert.match(read('src/legal/privacy/index.html'),/OpenRouter/);
 assert.match(read('src/features/auth/deletion.js'),/delete_own_account/);
 const vm=require('node:vm'),source=read('src/features/companion/controller.js');
 const requestCode=source.match(/  async function requestPalo\(options\) \{[\s\S]*?\n  \}\n  function replyPalo/)[0].replace(/\n  function replyPalo$/,'');
 const saved=new Map();let accepted=false,calls=0,prompts=0;
 const context=vm.createContext({currentUser:{id:'owner'},cityName:()=> 'Mumbai',isRailwayActive:()=>true,AbortSignal,Error,
  window:{confirm:()=>{prompts++;return accepted}},localStorage:{getItem:key=>saved.get(key),setItem:(key,value)=>saved.set(key,value)},
  railwayFetch:async()=>{calls++;return {reply:'test answer'}}});
 vm.runInContext(requestCode,context);
 await assert.rejects(()=>vm.runInContext('requestPalo({})',context),/permission/);assert.equal(calls,0);
 accepted=true;await vm.runInContext('requestPalo({})',context);assert.equal(calls,1);
 await vm.runInContext('requestPalo({})',context);assert.equal(calls,2);assert.equal(prompts,2);
 saved.clear();accepted=false;await assert.rejects(()=>vm.runInContext('requestPalo({})',context),/permission/);assert.equal(calls,2);
 const palo=require('../src/server/api/palo.js');let code,headers={};const res={setHeader:(key,value)=>headers[key]=value,status:value=>{code=value;return res},end(){},json(){}};
 await palo({method:'OPTIONS',headers:{origin:'capacitor://localhost'}},res);assert.equal(code,204);assert.equal(headers['Access-Control-Allow-Origin'],'capacitor://localhost');
 headers={};await palo({method:'OPTIONS',headers:{origin:'https://untrusted.example'}},res);assert.equal(code,405);assert.equal(headers['Access-Control-Allow-Origin'],undefined);
 for(const page of ['legal/delete-account/index.html','pages/support/index.html'])assert.ok(read('src/'+page).includes('palateo.com@gmail.com'));
 console.log('PASS: production configuration, no seeded credentials, native config, deletion, consent/revocation blocks AI traffic, exact native CORS');
})().catch(error=>{console.error(error);process.exit(1)});
