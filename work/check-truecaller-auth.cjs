'use strict';
const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const fs = require('node:fs');
const vm = require('node:vm');
const handler = require('../src/server/api/truecaller.js');
const savedEnv = { ...process.env }, originalFetch = global.fetch;
const nonce = 'n'.repeat(43), verifier = 'v'.repeat(43);
const body = { authorizationCode: 'real-provider-code', codeVerifier: verifier, nonce };
const hash = value => crypto.createHash('sha256').update(value).digest('hex');
const response = value => new Response(JSON.stringify(value), { status: 200 });
let requests = [], profile, tokenResponse, flows = new Map();
async function invoke(payload, url = '/', origin = 'https://palateo.in', method = 'POST') {
 const result = { headers: {}, setHeader(k,v){this.headers[k]=v}, status(n){this.code=n;return this}, json(data){this.data=data;return this}, end(){} };
 await handler({method,url,headers:{origin,'content-type':'application/json'},body:payload,socket:{remoteAddress:'127.0.0.1'}},result);
 assert.equal(result.headers['Cache-Control'],'no-store'); return result;
}
global.fetch = async (url, options) => {
 requests.push({url,options}); assert.equal(options.redirect,'error');
 if(url.endsWith('/v1/token'))return response(tokenResponse);
 if(url.endsWith('/v1/userinfo'))return response(profile);
 if(url.endsWith('/v1/default'))return response({userId:'verified-provider-user',phoneNumbers:['919876543210'],onlineIdentities:{email:'do-not-link@example.com'}});
 if(url.endsWith('/rpc/truecaller_flow')){
  assert.ok(options.headers.apikey);const {operation,input}=JSON.parse(options.body);
  if(operation==='attempt')return response({allowed:true});
  if(operation==='start'){flows.set(input.id,{...input,status:'waiting'});return response({created:true})}
  const item=flows.get(input.id);
  if(!item)return response({status:'expired'});
  if(operation==='callback'){if(item.status==='waiting'){item.status='ready';item.token=input.token}return response({accepted:true})}
  if(operation==='consume'){
   if(item.secret!==input.secret||item.nonce!==input.nonce)return response({status:'expired'});
   if(item.status==='waiting')return response({status:'waiting'});
   flows.delete(input.id);return response(item);
  }
 }
 throw Error('Unexpected network destination '+url);
};
function verifyJwt(result, publicKey) {
 assert.equal(result.code,200);assert.equal(result.data.provider,'custom:palateo-truecaller');
 const [header,payload,signature]=result.data.idToken.split('.');
 assert.ok(crypto.verify('RSA-SHA256',Buffer.from(header+'.'+payload),publicKey,Buffer.from(signature,'base64url')));
 const claims=JSON.parse(Buffer.from(payload,'base64url'));
 assert.equal(claims.nonce,hash(nonce));assert.equal(claims.sub,'phone:+919876543210');
 assert.equal(claims.aud,'palateo-truecaller');assert.equal(claims.exp-claims.iat,60);
 assert.equal(claims.phone_number_verified,true);assert.equal(claims.email,undefined);
 for(const name of ['user','token','access_token','refresh_token'])assert.equal(result.data[name],undefined);
 return claims;
}
(async()=>{
 delete process.env.TRUECALLER_IDENTITY_PRIVATE_KEY;delete process.env.TRUECALLER_ANDROID_ENABLED;delete process.env.TRUECALLER_WEB_ENABLED;
 assert.equal((await invoke(body)).code,503);assert.equal(requests.length,0);
 const {privateKey,publicKey}=crypto.generateKeyPairSync('rsa',{modulusLength:2048});
 process.env.TRUECALLER_IDENTITY_PRIVATE_KEY=Buffer.from(privateKey.export({type:'pkcs8',format:'pem'})).toString('base64');
 process.env.TRUECALLER_ANDROID_ENABLED='true';
 process.env.SUPABASE_SECRET_KEY='server-only-test-key';
 tokenResponse={token_type:'Bearer',access_token:'provider-access-token'};
 profile={sub:'truecaller-user',phone_number:'919876543210',phone_number_verified:true};
 verifyJwt(await invoke(body),publicKey);
 const tokenRequest=requests.find(request=>request.url.endsWith('/v1/token'));
 assert.equal(new URLSearchParams(tokenRequest.options.body).get('client_id'),'qnjkaprmmd59o3aembxue5mzrproqqjjeixlkil_as4');
 assert.equal(new URLSearchParams(tokenRequest.options.body).get('code_verifier'),verifier);
 assert.equal(requests.find(request=>request.url.endsWith('/v1/userinfo')).options.headers.Authorization,'Bearer provider-access-token');
 const jwks=await invoke(null,'/?action=jwks',undefined,'GET');
 assert.equal(jwks.data.keys[0].kty,'RSA');assert.equal(jwks.data.keys[0].d,undefined);
 assert.equal((await invoke(null,'/?action=discovery',undefined,'GET')).data.issuer,'https://palateo.in/api/truecaller');
 for(const bad of [{phone:'+919876543210'},{...body,clientId:'attacker'}, {...body,endpoint:'http://localhost'}, {...body,codeVerifier:'short'}, {...body,nonce:'short'},null,'{bad']){
  const count=requests.length;assert.equal((await invoke(bad)).code,400);assert.equal(requests.length,count);
 }
 assert.equal((await invoke(body,'/','https://attacker.example')).code,403);
 for(const badProfile of [{...profile,phone_number_verified:false},{...profile,phone_number_verified:'true'},{...profile,phone_number:'123'},{phone_number:'+919876543210',phone_number_verified:true}]){
  const valid=profile;profile=badProfile;assert.equal((await invoke(body)).code,502);profile=valid;
 }
 const goodToken=tokenResponse;tokenResponse={token_type:'Bearer',access_token:'bad\r\nheader'};
 assert.equal((await invoke(body)).code,502);tokenResponse=goodToken;
 assert.equal((await invoke({nonce},'/?action=web-start')).code,503);
 Object.assign(process.env,{TRUECALLER_WEB_ENABLED:'true',TRUECALLER_WEB_PHONE_ONLY_CONFIRMED:'true',TRUECALLER_WEB_PARTNER_KEY:'registered-web-key',TRUECALLER_WEB_CALLBACK_SECRET:'s'.repeat(43),SUPABASE_SECRET_KEY:'server-only-test-key'});
 const started=await invoke({nonce},'/?action=web-start');assert.equal(started.code,200);
 const flow={...started.data,nonce};delete flow.partnerKey;
 assert.equal((await invoke(flow,'/?action=web-poll')).code,202);
 let count=requests.length;
 assert.equal((await invoke({requestId:flow.requestId,accessToken:'valid-provider-token',endpoint:'http://127.0.0.1/private'},'/?action=web-callback&secret=wrong',undefined)).code,403);
 assert.equal(requests.length,count);
 const callback={requestId:flow.requestId,accessToken:'valid-provider-token',endpoint:'https://profile4-noneu.truecaller.com/v1/default'};
 assert.equal((await invoke(callback,'/?action=web-callback&secret='+process.env.TRUECALLER_WEB_CALLBACK_SECRET,undefined)).code,200);
 assert.notEqual(flows.get(flow.requestId).token,callback.accessToken);
 assert.equal((await invoke({...flow,completionSecret:'x'.repeat(43)},'/?action=web-poll')).code,401);
 assert.equal((await invoke({...flow,nonce:'x'.repeat(43)},'/?action=web-poll')).code,401);
 const claims=verifyJwt(await invoke(flow,'/?action=web-poll'),publicKey);
 assert.equal(claims.email,undefined);assert.equal((await invoke(flow,'/?action=web-poll')).code,401);
 // Client must exchange the identity proof through Supabase, never set a fabricated session.
 const source=fs.readFileSync(require('node:path').join(__dirname,'../src/features/auth/service.js'),'utf8');
 let signIns=0,links=0,consent=0;
 const user={id:'existing-account',identities:[]};
 const context=vm.createContext({isRailwayActive:()=>false,crypto:crypto.webcrypto,Uint8Array,btoa:value=>Buffer.from(value,'binary').toString('base64'),AbortSignal,
  window:{PalateoNative:{truecaller:{prepare:async()=>{},isAvailable:async()=>true,verifyMobile:async()=>({authorizationCode:body.authorizationCode,codeVerifier:verifier})}}},
  fetch:async(url,options)=>response(options?.body?{provider:'custom:palateo-truecaller',idToken:'signed-identity-proof'}:{android:true,linking:true}),
  getSupabaseClient:()=>({auth:{signInWithIdToken:async credentials=>{signIns++;assert.equal(credentials.token,'signed-identity-proof');assert.equal(credentials.nonce.length,43);return {data:{user,session:{user}}}},linkIdentity:async()=>{links++;return {data:{user,session:{user}}}}}}),
  useAccount:u=>{context.currentUser=u},currentUser:null,hasLegalConsent:()=>false,updateMode:()=>{},requireLegalConsent:()=>{consent++}
 });
 vm.runInContext(source,context);await context.verifyWithTruecaller();assert.equal(signIns,1);assert.equal(consent,1);
 await context.verifyWithTruecaller({link:true});assert.equal(links,1);assert.equal(signIns,1);
 console.log('PASS: real-code exchange, verified identity, signed nonce-bound proof, callback authentication, durable consume and canonical session/explicit linking contracts');
})().catch(error=>{console.error(error);process.exitCode=1}).finally(()=>{global.fetch=originalFetch;for(const key of Object.keys(process.env))if(!(key in savedEnv))delete process.env[key];Object.assign(process.env,savedEnv)});
