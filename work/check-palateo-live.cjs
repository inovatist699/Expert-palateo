const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const crypto=require('node:crypto');
const base='https://palateo.in';
async function main(){
 const response=await fetch(base+'/app/',{signal:AbortSignal.timeout(20000)});
 assert.equal(response.status,200,'public app must load without Vercel login');
 const html=await response.text();
 const local=fs.readFileSync(path.join(__dirname,'palateo_cloudflare_pages/app/index.html'),'utf8');
 assert.equal(html.replace(/^\uFEFF/,'').replace(/\r\n?/g,'\n'),local.replace(/^\uFEFF/,'').replace(/\r\n?/g,'\n'),'public alias must serve current build');
 const script=html.match(/<script>([\s\S]*?)<\/script>/)[1].replace(/\r\n?/g,'\n');
 const hash='sha256-'+crypto.createHash('sha256').update(script).digest('base64');
 assert.ok(response.headers.get('content-security-policy')?.includes(hash),'live CSP hash must match');
 const dependency=html.match(/<script src="(https:\/\/cdn\.jsdelivr\.net\/npm\/@supabase\/supabase-js@2\.117\.2)" integrity="([^"]+)" crossorigin="anonymous"><\/script>/);
 assert.ok(dependency,'Supabase script must use integrity protection');
 const cdn=await fetch(dependency[1],{signal:AbortSignal.timeout(20000)});
 assert.equal(cdn.status,200,'pinned Supabase CDN dependency');
 assert.equal('sha384-'+crypto.createHash('sha384').update(Buffer.from(await cdn.arrayBuffer())).digest('base64'),dependency[2],'CDN bytes must match the deployed integrity hash');
 for(const route of ['/privacy/','/terms/','/robots.txt','/sitemap.xml']){
  const r=await fetch(base+route,{signal:AbortSignal.timeout(15000)});assert.equal(r.status,200,route);
 }
 for(const route of ['/.env.local','/.vercel/project.json']){
  const r=await fetch(base+route,{redirect:'manual',signal:AbortSignal.timeout(15000)});assert.ok([403,404].includes(r.status),'private file exposed: '+route);
 }
 const url=local.match(/const PALATEO_SUPABASE_URL = "([^"]+)"/)[1];
 const key=local.match(/const PALATEO_SUPABASE_PUBLISHABLE_KEY = "([^"]+)"/)[1];
 const health=await fetch(url+'/auth/v1/health',{headers:{apikey:key},signal:AbortSignal.timeout(15000)});
 assert.equal(health.status,200,'Supabase Auth health');
 for(const table of ['profiles','taste_profiles','saved_restaurants','interactions']){
  const r=await fetch(url+'/rest/v1/'+table+'?select=*&limit=1',{headers:{apikey:key},signal:AbortSignal.timeout(15000)});
  if(r.status===200)assert.deepEqual(await r.json(),[],'anonymous access to private table: '+table);
  else assert.ok([401,403].includes(r.status),'unexpected private-table response: '+table+' '+r.status);
 }
 console.log('PASS: live build, CSP, policies, sitemap, private-file protection, Supabase health and anonymous account-data isolation');
}
main().catch(error=>{console.error(error.message);process.exitCode=1});
