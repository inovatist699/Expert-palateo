'use strict';
const assert=require('node:assert/strict'),crypto=require('node:crypto'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const {transformSync}=require('../mobile/node_modules/esbuild');
const pair=crypto.generateKeyPairSync('rsa',{modulusLength:2048}),publicKey=pair.publicKey.export({format:'jwk'});
const hash=value=>crypto.createHash('sha256').update(value).digest('hex');
publicKey.kid=hash(publicKey.n).slice(0,24);
let handler,calls=0,upstreamFailure=false;
const source=fs.readFileSync(path.join(__dirname,'../supabase/functions/truecaller-flows/index.ts'),'utf8');
const context=vm.createContext({exports:{},module:{exports:{}},require:name=>{assert.equal(name,'./public-key.json');return publicKey},
 TextEncoder,TextDecoder,Uint8Array,Response,AbortSignal,atob,crypto:crypto.webcrypto,
 Deno:{serve:fn=>{handler=fn},env:{get:name=>{assert.equal(name,'SUPABASE_SERVICE_ROLE_KEY');return 'managed-server-secret'}}},
 fetch:async(url,options)=>{calls++;assert.equal(url,'https://ntuaqcnbhqtbhbnnobmm.supabase.co/rest/v1/rpc/truecaller_flow');
  assert.equal(options.headers.Authorization,'Bearer managed-server-secret');assert.equal(options.redirect,'error');
  return new Response(JSON.stringify(upstreamFailure?{privateDiagnostic:'must-not-leak'}:{allowed:true}),{status:upstreamFailure?500:200})}
});
vm.runInContext(transformSync(source,{loader:'ts',format:'cjs',target:'es2022'}).code,context);
function request(body,claims={},header={}){
 const now=Math.floor(Date.now()/1000);
 const encoded=[{alg:'RS256',kid:publicKey.kid,...header},{iss:'https://palateo.in/api/truecaller',aud:'palateo-truecaller-flow',iat:now,exp:now+20,bodyHash:hash(body),...claims}]
  .map(value=>Buffer.from(JSON.stringify(value)).toString('base64url')).join('.');
 const token=encoded+'.'+crypto.sign('RSA-SHA256',Buffer.from(encoded),pair.privateKey).toString('base64url');
 return new Request('https://example.invalid/',{method:'POST',headers:{Authorization:'Bearer '+token},body});
}
(async()=>{
 const body=JSON.stringify({operation:'attempt',input:{source:'test-hash'}});
 assert.equal((await handler(new Request('https://example.invalid/',{method:'POST',body}))).status,401);assert.equal(calls,0);
 assert.deepEqual(await (await handler(request(body))).json(),{allowed:true});assert.equal(calls,1);
 const now=Math.floor(Date.now()/1000);
 for(const claims of [{aud:'wrong'},{iss:'wrong'},{exp:now-1,iat:now-21},{exp:now+100},{iat:now+10,exp:now+20},{iat:'not-an-integer'},{bodyHash:hash('tampered')}]){
  assert.equal((await handler(request(body,claims))).status,401);
 }
 assert.equal((await handler(request(body,{}, {alg:'none'}))).status,401);
 assert.equal((await handler(request(body,{}, {kid:'wrong'}))).status,401);
 assert.equal((await handler(request(JSON.stringify({operation:'arbitrary-rpc',input:{}})))).status,401);
 assert.equal((await handler(request(JSON.stringify({operation:'attempt',input:{},url:'http://localhost'})))).status,401);
 assert.equal((await handler(request('x'.repeat(17000)))).status,401);assert.equal(calls,1);
 upstreamFailure=true;const failed=await handler(request(body));assert.equal(failed.status,503);
 assert.equal(JSON.stringify(await failed.json()).includes('privateDiagnostic'),false);
 console.log('PASS: managed-state bridge pins RSA/issuer/audience/body/time, rejects forged/oversized requests, and never exports backend credentials or diagnostics');
})().catch(error=>{console.error(error);process.exitCode=1});
