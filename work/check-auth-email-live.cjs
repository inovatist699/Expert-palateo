const fs=require('node:fs');
const path=require('node:path');
const assert=require('node:assert/strict');
const root=path.join(__dirname,'palateo_cloudflare_pages');
process.loadEnvFile(path.join(root,'.env.resend.local'));
const html=fs.readFileSync(path.join(root,'app/index.html'),'utf8');
const url=html.match(/const PALATEO_SUPABASE_URL = "([^"]+)"/)[1];
const key=html.match(/const PALATEO_SUPABASE_PUBLISHABLE_KEY = "([^"]+)"/)[1];
async function main(){
 const account=JSON.parse(fs.readFileSync(path.join(root,'.env.auth-check.local'),'utf8'));
 const response=await fetch(url+'/auth/v1/recover?redirect_to='+encodeURIComponent('https://palateo.in/app/'),{method:'POST',headers:{apikey:key,'Content-Type':'application/json'},body:JSON.stringify({email:account.email}),signal:AbortSignal.timeout(20000)});
 assert.equal(response.status,200,'Supabase recovery request');
 const emails=await fetch('https://api.resend.com/emails',{headers:{Authorization:'Bearer '+process.env.RESEND_API_KEY},signal:AbortSignal.timeout(15000)});
 assert.ok(emails.ok,'Resend delivery inspection');
 const list=(await emails.json()).data;
 const mail=list.find(x=>x.to.includes(account.email)&&/reset|recovery/i.test(x.subject));
 assert.ok(mail,'Supabase recovery message must reach Resend');
 console.log(JSON.stringify({recoveryRequest:'accepted',messageId:mail.id,event:mail.last_event,subject:mail.subject}));
 if(process.argv.includes('--verify')){
  const detail=await fetch('https://api.resend.com/emails/'+mail.id,{headers:{Authorization:'Bearer '+process.env.RESEND_API_KEY}});assert.ok(detail.ok);const message=await detail.json();
  const link=(message.html||message.text||'').match(/https:\/\/[^\s"<>]+\/auth\/v1\/verify\?[^\s"<>]+/);assert.ok(link);
  const callback=await fetch(link[0].replaceAll('&amp;','&'),{redirect:'manual',signal:AbortSignal.timeout(20000)});const destination=callback.headers.get('location');assert.ok(destination?.startsWith('https://palateo.in/app/'));
  const fragment=new URLSearchParams(new URL(destination).hash.slice(1));assert.equal(fragment.get('type'),'recovery');const token=fragment.get('access_token');assert.ok(token);
  const newPassword=require('node:crypto').randomBytes(24).toString('base64url');
  const update=await fetch(url+'/auth/v1/user',{method:'PUT',headers:{apikey:key,Authorization:'Bearer '+token,'Content-Type':'application/json'},body:JSON.stringify({password:newPassword}),signal:AbortSignal.timeout(20000)});assert.equal(update.status,200);
  account.password=newPassword;fs.writeFileSync(path.join(root,'.env.auth-check.local'),JSON.stringify(account));
  const login=await fetch(url+'/auth/v1/token?grant_type=password',{method:'POST',headers:{apikey:key,'Content-Type':'application/json'},body:JSON.stringify({email:account.email,password:account.password}),signal:AbortSignal.timeout(20000)});assert.equal(login.status,200);
  console.log('PASS: real recovery link, production callback, isolated test password update and subsequent login');
 }
}
main().catch(e=>{console.error(e.message,e.cause?.code||'');process.exitCode=1});
