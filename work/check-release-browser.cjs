// Run with PLAYWRIGHT_MODULE pointing to an installed Playwright module if needed.
const fs=require('node:fs'),path=require('node:path'),http=require('node:http'),assert=require('node:assert/strict');
const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
const root=path.resolve(__dirname,'..'),built=path.join(root,'work/palateo_cloudflare_pages');
(async()=>{
 const {startServer}=await import('../server/index.js');const backend=await startServer(3000);
 const login=await fetch('http://localhost:3000/api/auth/sign-up/email',{method:'POST',headers:{'Content-Type':'application/json',Origin:'http://localhost:3000'},body:JSON.stringify({email:'release-browser@example.invalid',password:'ReleaseTest@1234',name:'Release test',palateo_legal_version:'2026-10-14',palateo_privacy_consent:true,palateo_legal_accepted_at:new Date().toISOString()})});
 const session=await login.json();assert.ok(session.token);
 const fixture=`setRailwayUrl('http://localhost:3000');useAccount(normalizeBetterAuthUser(${JSON.stringify(session.user)}));betterAuthToken=${JSON.stringify(session.token)};state.backendType='railway';state.answers=Object.fromEntries(questions.map(q=>[q.k,q.o[0][0]]));state.onboarded=true;authRequired=false;document.getElementById('nav').classList.remove('hide');go('profile');`;
 const html=fs.readFileSync(path.join(built,'app/index.html'),'utf8').replace(/^initV5\(\);\r?$/m,fixture);
 const preview=http.createServer((req,res)=>{
  const url=new URL(req.url,'http://localhost');if(url.pathname==='/app/'){res.setHeader('Content-Type','text/html');res.end(html);return;}
  const target=path.resolve(built,'.'+url.pathname+(url.pathname.endsWith('/')?'index.html':''));if(!target.startsWith(built+path.sep)||!fs.existsSync(target)||!fs.statSync(target).isFile()){res.writeHead(404).end();return;}
  res.setHeader('Content-Type',({'.html':'text/html','.js':'text/javascript','.css':'text/css','.svg':'image/svg+xml','.png':'image/png','.webm':'video/webm'})[path.extname(target)]||'application/octet-stream');res.end(fs.readFileSync(target));
 });await new Promise(resolve=>preview.listen(8771,'127.0.0.1',resolve));let browser;
 try{
  browser=await chromium.launch({headless:true,channel:'msedge'});const page=await browser.newPage({viewport:{width:390,height:844},reducedMotion:'reduce'});const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.addInitScript(()=>{sessionStorage.setItem('palo-intro','1');localStorage.setItem('palateo-palo-voice','off')});
  await page.goto('http://127.0.0.1:8771/app/',{waitUntil:'domcontentloaded'});
  await page.locator('.profilePrivacy summary').click();await page.locator('[data-action="delete-account"]').click();
  await page.locator('#deleteAccountPassword').fill('incorrect-password');await page.locator('#deleteAccountConfirm').check();await page.locator('#deleteAccountSubmit').click();
  await page.waitForFunction(()=>document.getElementById('deleteAccountStatus').textContent.toLowerCase().includes('password')&&!document.getElementById('deleteAccountSubmit').disabled);
  if(process.env.PALATEO_TEST_OUTPUT){fs.mkdirSync(process.env.PALATEO_TEST_OUTPUT,{recursive:true});await page.screenshot({path:path.join(process.env.PALATEO_TEST_OUTPUT,'account-deletion-review.png')});}
  await page.locator('#deleteAccountPassword').fill('ReleaseTest@1234');await page.locator('#deleteAccountSubmit').click();
  await page.waitForFunction(()=>!document.getElementById('accountDeletionDialog'));
  assert.equal(await page.evaluate(()=>currentUser),null);assert.ok((await page.locator('body').textContent()).includes('deleted'));
  assert.equal((await fetch('http://localhost:3000/api/user/state',{headers:{Authorization:'Bearer '+session.token}})).status,401);
  for(const url of ['support','delete-account','privacy']){const response=await page.goto('http://127.0.0.1:8771/'+url+'/');assert.equal(response.status(),200);assert.ok(await page.locator('h1').textContent());}
  assert.deepEqual(errors,[]);console.log('PASS: mobile-width deletion dialog, wrong-password rejection, deletion, revoked session and public support/privacy pages');
 }finally{await browser?.close();preview.close();backend.close()}
})().then(()=>process.exit(0)).catch(e=>{console.error(e);process.exit(1)});
