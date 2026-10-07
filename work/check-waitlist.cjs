const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const handler = require('./palateo_cloudflare_pages/api/waitlist');
const root = path.join(__dirname,'palateo_cloudflare_pages');
async function call(body, method='POST', headers={}) {
 const res={code:200,setHeader(){},status(code){this.code=code;return this;},json(data){this.data=data;return this;}};
 await handler({method,body,headers:{'content-type':'application/json',...headers}},res);return res;
}
(async()=>{
 const savedFetch=global.fetch; let calls=0;
 global.fetch=async()=>{calls++;return {ok:true};};
 assert.equal((await call({},'GET')).code,405);
 assert.equal((await call({email:'invalid',city:'Ahmedabad',consent:true})).code,400);
 assert.equal((await call({email:'test@example.invalid',city:'Other',consent:false})).code,400);
 assert.equal((await call({email:'test@example.invalid',city:'Unknown',consent:true})).code,400);
 assert.equal((await call({},'POST',{origin:'https://evil.example'})).code,403);
 assert.equal((await call({},'POST',{'content-length':'3000'})).code,413);
 assert.equal((await call({extra:'x'.repeat(3000)})).code,413,'Actual body size is checked without a Content-Length header');
 assert.equal((await call({website:'bot'})).code,200); assert.equal(calls,0);
 assert.equal((await call({email:'test@example.invalid',city:'Other',consent:true})).code,200); assert.equal(calls,1);
 process.env.RESEND_API_KEY='test-server-key'; process.env.WAITLIST_MAIL_TOKEN='test-guard';
 let mailCalls=[];
 global.fetch=async(url,options)=>{mailCalls.push({url,body:JSON.parse(options.body),headers:options.headers});return {ok:true,json:async()=>true};};
 assert.equal((await call({email:'test@example.com',city:'Other',consent:true})).code,200);
 assert.equal(mailCalls.length,4); assert.equal(mailCalls[2].url,'https://api.resend.com/emails');
 assert.ok(mailCalls[2].headers['Idempotency-Key']); assert.equal(mailCalls[3].body.p_sent,true);
 mailCalls=[];global.fetch=async(url)=>{mailCalls.push(url);return {ok:true,json:async()=>false};};
 assert.equal((await call({email:'test@example.com',city:'Other',consent:true})).code,200);assert.equal(mailCalls.length,2,'Duplicates must not send mail');
 global.fetch=async(url)=>({ok:!url.includes('waitlist_welcome'),json:async()=>({})});
 assert.equal((await call({email:'test@example.com',city:'Other',consent:true})).code,200,'Email failure must preserve successful signup');
 delete process.env.RESEND_API_KEY;delete process.env.WAITLIST_MAIL_TOKEN;
 global.fetch=async()=>({ok:false,json:async()=>({code:'P0001'})});
 assert.equal((await call({email:'test@example.invalid',city:'Other',consent:true})).code,429);
 global.fetch=async()=>{throw new Error('network');};
 assert.equal((await call({email:'test@example.invalid',city:'Other',consent:true})).code,503);
 global.fetch=savedFetch;
 const html=fs.readFileSync(root+'/index.html','utf8');
 assert.ok(html.includes('https://palateo.in/')); assert.ok(html.includes('id="motion-toggle"'));
 assert.ok(fs.readFileSync(root+'/waitlist.css','utf8').includes('prefers-reduced-motion'));
 assert.ok(fs.readFileSync(root+'/app/index.html','utf8').includes('hasTasteProfile'));
 if(process.argv.includes('--live')){
  const host='https://palateo.in';
  for(const page of ['/','/waitlist.css','/waitlist.js','/privacy/','/terms/','/app/']){const response=await fetch(host+page,{signal:AbortSignal.timeout(15000)});assert.equal(response.status,200,page);}
  const email='palateo-launch-check-20261006@example.invalid';
  for(let i=0;i<2;i++){const response=await fetch(host+'/api/waitlist',{method:'POST',headers:{'Content-Type':'application/json',Origin:host},body:JSON.stringify({email,city:'Other',consent:true,website:''}),signal:AbortSignal.timeout(15000)});assert.equal(response.status,200,await response.text());}
  const invalid=await fetch(host+'/api/waitlist',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email:'bad',city:'Other',consent:true})});assert.equal(invalid.status,400);
  const app=fs.readFileSync(root+'/app/index.html','utf8');const url=app.match(/const PALATEO_SUPABASE_URL = "([^"]+)"/)[1];const key=app.match(/const PALATEO_SUPABASE_PUBLISHABLE_KEY = "([^"]+)"/)[1];
  const privateRead=await fetch(url+'/rest/v1/launch_waitlist?select=email&limit=1',{headers:{apikey:key,Authorization:'Bearer '+key}});assert.ok([401,403].includes(privateRead.status),'Subscriber emails must not be publicly readable');
  console.log('Live HTTPS pages, signup, duplicate response, validation and denied subscriber reads passed. Synthetic test email retained for admin verification.');
 }
 console.log('Waitlist checks passed.');
})().catch(e=>{console.error(e.message);process.exitCode=1;});
