const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),assert=require('node:assert/strict');
const root=path.join(__dirname,'palateo_cloudflare_pages'),file=path.join(root,'.env.auth-check.local');
process.loadEnvFile(path.join(root,'.env.resend.local'));
const html=fs.readFileSync(path.join(root,'app/index.html'),'utf8');
const url=html.match(/const PALATEO_SUPABASE_URL = "([^"]+)"/)[1],key=html.match(/const PALATEO_SUPABASE_PUBLISHABLE_KEY = "([^"]+)"/)[1];
const headers={apikey:key,'Content-Type':'application/json'};
async function main(){
 let account=fs.existsSync(file)?JSON.parse(fs.readFileSync(file,'utf8')):{email:'palateo.com+launchcheck20261006@gmail.com',password:crypto.randomBytes(24).toString('base64url')};
 fs.writeFileSync(file,JSON.stringify(account));
 if(!account.id){
  const r=await fetch(url+'/auth/v1/signup?redirect_to='+encodeURIComponent('https://palateo.in/app/'),{method:'POST',headers,body:JSON.stringify({email:account.email,password:account.password,data:{name:'Palateo Launch Test',full_name:'Palateo Launch Test'}}),signal:AbortSignal.timeout(20000)});
  assert.equal(r.status,200,'Test signup must succeed');const data=await r.json();account.id=data.id||data.user?.id;assert.ok(account.id);assert.equal(data.access_token,undefined,'Unverified user must not receive a session');fs.writeFileSync(file,JSON.stringify(account));
 }
 const listResponse=await fetch('https://api.resend.com/emails',{headers:{Authorization:'Bearer '+process.env.RESEND_API_KEY},signal:AbortSignal.timeout(15000)});assert.ok(listResponse.ok);
 const mail=(await listResponse.json()).data.find(x=>x.to.includes(account.email)&&/confirm/i.test(x.subject));assert.ok(mail,'Confirmation email must reach Resend');
 console.log(JSON.stringify({signup:account.verified?'verified':'pending verification',messageId:mail.id,emailStatus:mail.last_event}));
 if(process.argv.includes('--verify')&&!account.verified){
  const detail=await fetch('https://api.resend.com/emails/'+mail.id,{headers:{Authorization:'Bearer '+process.env.RESEND_API_KEY},signal:AbortSignal.timeout(15000)});assert.ok(detail.ok);const email=await detail.json();
  const link=(email.html||email.text||'').match(/https:\/\/[^\s"<>]+\/auth\/v1\/verify\?[^\s"<>]+/);assert.ok(link,'Verification link');
  const verified=await fetch(link[0].replaceAll('&amp;','&'),{redirect:'manual',signal:AbortSignal.timeout(20000)});const location=verified.headers.get('location');assert.ok(location?.startsWith('https://palateo.in/app/'),'Confirmation must return to the public beta');assert.ok(new URLSearchParams(new URL(location).hash.slice(1)).get('access_token'),'Confirmation must create a session');
  const login=await fetch(url+'/auth/v1/token?grant_type=password',{method:'POST',headers,body:JSON.stringify({email:account.email,password:account.password}),signal:AbortSignal.timeout(20000)});assert.equal(login.status,200);const session=await login.json();assert.ok(session.access_token);account.verified=true;fs.writeFileSync(file,JSON.stringify(account));
  const profile=await fetch(url+'/rest/v1/profiles?id=eq.'+account.id+'&select=id',{headers:{...headers,Authorization:'Bearer '+session.access_token},signal:AbortSignal.timeout(15000)});assert.equal(profile.status,200);assert.equal((await profile.json())[0]?.id,account.id,'Signup trigger must create profile');
  console.log('PASS: SMTP confirmation, production redirect, verified login, persisted Supabase profile');
 }
 if(process.argv.includes('--feedback')){
  const login=await fetch(url+'/auth/v1/token?grant_type=password',{method:'POST',headers,body:JSON.stringify({email:account.email,password:account.password}),signal:AbortSignal.timeout(20000)});assert.equal(login.status,200);const session=await login.json();
  const authHeaders={...headers,Authorization:'Bearer '+session.access_token};
  const catalogue=await fetch(url+'/rest/v1/restaurant_catalog?select=id&limit=1',{headers:authHeaders});assert.ok(catalogue.ok);const restaurant=(await catalogue.json())[0];assert.ok(restaurant);
  for(const removed of [false,true]){const r=await fetch(url+'/rest/v1/interactions',{method:'POST',headers:authHeaders,body:JSON.stringify({user_id:account.id,restaurant_id:restaurant.id,type:'like',source:'launch_regression_check',metadata:{removed}})});assert.equal(r.status,201,'Like/unlike must persist under existing RLS');}
  const history=await fetch(url+'/rest/v1/interactions?user_id=eq.'+account.id+'&select=type,metadata&order=created_at.desc&limit=1',{headers:authHeaders});assert.ok(history.ok);assert.equal((await history.json())[0]?.metadata.removed,true);
  for(const table of ['profiles','taste_profiles','saved_restaurants','interactions']){
   const ownerColumn=table==='profiles'?'id':'user_id';const r=await fetch(url+'/rest/v1/'+table+'?'+ownerColumn+'=neq.'+account.id+'&select=*&limit=1',{headers:authHeaders});assert.equal(r.status,200);assert.deepEqual(await r.json(),[],'Test user cannot read another account: '+table);
  }
  const rejected=await fetch(url+'/rest/v1/interactions',{method:'POST',headers:authHeaders,body:JSON.stringify({user_id:crypto.randomUUID(),restaurant_id:restaurant.id,type:'like'})});assert.equal(rejected.status,403,'Cross-account write must be denied');
  console.log('PASS: real Supabase like/unlike persistence, authenticated isolation and rejected cross-account write');
 }
}
main().catch(e=>{console.error(e.message,e.cause?.code||'');process.exitCode=1});
