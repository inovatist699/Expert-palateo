const fs=require('node:fs'),path=require('node:path'),http=require('node:http'),assert=require('node:assert/strict');
const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
const {contrast}=require('./check-design-colors.cjs');
const built=path.join(__dirname,'palateo_cloudflare_pages'),output=process.env.PALATEO_TEST_OUTPUT;
const server=http.createServer((req,res)=>{
 const url=new URL(req.url,'http://localhost'),file=path.resolve(built,'.'+url.pathname+(url.pathname.endsWith('/')?'index.html':''));
 if(!file.startsWith(built+path.sep)||!fs.existsSync(file)||!fs.statSync(file).isFile())return res.writeHead(404).end();
 res.setHeader('Content-Type',({'.html':'text/html','.js':'text/javascript','.css':'text/css','.svg':'image/svg+xml','.png':'image/png','.webm':'video/webm'})[path.extname(file)]||'application/octet-stream');res.end(fs.readFileSync(file));
});
async function readable(locator){
 const colours=await locator.evaluate(el=>{
  const rgb=value=>'#'+value.match(/\d+/g).slice(0,3).map(x=>Number(x).toString(16).padStart(2,'0')).join('');
  let bg=el;while(bg&&getComputedStyle(bg).backgroundColor==='rgba(0, 0, 0, 0)')bg=bg.parentElement;
  return {fg:rgb(getComputedStyle(el).color),bg:rgb(getComputedStyle(bg).backgroundColor)};
 });
 assert.ok(contrast(colours.fg,colours.bg)>=4.5,'Readable text: '+await locator.textContent());
}
(async()=>{
 await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));let browser;
 try{
  browser=await chromium.launch({headless:true,channel:'msedge'});const origin='http://127.0.0.1:'+server.address().port;
  if(output)fs.mkdirSync(output,{recursive:true});
  for(const width of [320,390,1440]){
   const page=await browser.newPage({viewport:{width,height:900},reducedMotion:'reduce'}),errors=[];
   page.on('pageerror',e=>errors.push(e.message));
   await page.addInitScript(()=>{sessionStorage.setItem('palo-intro','1');localStorage.setItem('palateo-palo-voice','off')});
   await page.route('https://ntuaqcnbhqtbhbnnobmm.supabase.co/**',route=>{
    const failed=route.request().url().includes('/auth/v1/token');
    return route.fulfill({status:failed?400:200,contentType:'application/json',headers:{'Access-Control-Allow-Origin':'*'},body:failed?JSON.stringify({msg:'Invalid login credentials',error_code:'invalid_credentials'}):'[]'});
   });
   await page.goto(origin+'/app/',{waitUntil:'domcontentloaded'});await page.locator('#authEmail').waitFor({state:'visible'});
   for(const selector of ['#authTitle','#authModal .fieldLabel','#authModal .linkBtn','#authSubmit','#authModal .loginPet span'])await readable(page.locator(selector).first());
   assert.equal(await page.locator('#authEmail').evaluate(el=>getComputedStyle(el).fontSize),'16px');
   assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
   assert.ok(await page.locator('#authModal .modalCard').evaluate(el=>el.scrollWidth<=el.clientWidth));
   await page.locator('#authEmail').fill('reader@example.invalid');await page.locator('#authPass').fill('fixture-password');
   await page.getByRole('button',{name:'Show password',exact:true}).click();assert.equal(await page.locator('#authPass').getAttribute('type'),'text');
   await page.getByRole('button',{name:'Hide password',exact:true}).click();assert.equal(await page.locator('#authPass').getAttribute('type'),'password');
   await page.locator('#authSubmit').click();await page.waitForFunction(()=>document.getElementById('authStatus').textContent.includes('did not match'));
   await readable(page.locator('#authStatus'));assert.equal(await page.locator('#authSubmit').isEnabled(),true);
   if(output)await page.screenshot({path:path.join(output,'login-'+width+'.png'),fullPage:true});
   await page.locator('[data-action="auth-mode"]').click();await page.locator('#authName').waitFor({state:'visible'});
   assert.ok(await page.locator('#authModal .modalCard').evaluate(el=>el.scrollWidth<=el.clientWidth));
   await page.locator('#authSubmit').scrollIntoViewIfNeeded();assert.ok(await page.locator('#authSubmit').isVisible());
   assert.ok(await page.locator('[data-action="auth-mode"]').textContent());
   let result=200,submissions=0;
   await page.route('**/api/waitlist',async route=>{submissions++;await route.fulfill({status:result,contentType:'application/json',body:JSON.stringify({ok:result===200})})});
   await page.goto(origin+'/#join');
   if(output)await page.screenshot({path:path.join(output,'waitlist-'+width+'.png'),fullPage:true});
   assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
   for(const selector of ['.join-card h3','.join-card .form-intro','#waitlist-form>label','.join-card .form-note'])await readable(page.locator(selector).first());
   assert.equal(await page.locator('#email').evaluate(el=>getComputedStyle(el).fontSize),'16px');
   await page.locator('#email').fill('reader@example.invalid');await page.locator('#city').selectOption('Ahmedabad');
   await page.locator('#waitlist-form button[type=submit]').click();assert.equal(submissions,0,'Consent is required');
   await page.locator('[name=consent]').check();await page.locator('#waitlist-form button[type=submit]').click();
   await page.waitForFunction(()=>document.getElementById('form-status').textContent.includes('on the list'));
   assert.equal(await page.locator('#email').inputValue(),'');assert.equal(submissions,1);
   result=429;await page.locator('#email').fill('reader@example.invalid');await page.locator('#city').selectOption('Vadodara');await page.locator('[name=consent]').check();
   await page.locator('#waitlist-form button[type=submit]').click();await page.waitForFunction(()=>document.getElementById('form-status').textContent.includes('wait a minute'));
   assert.equal(await page.locator('#email').inputValue(),'reader@example.invalid','Failure preserves input');await readable(page.locator('#form-status'));
   assert.equal(await page.locator('#waitlist-form button[type=submit]').isEnabled(),true);
   if(output){await page.screenshot({path:path.join(output,'waitlist-'+width+'.png'),fullPage:true});await page.locator('#join').screenshot({path:path.join(output,'waitlist-form-'+width+'.png')});}
   assert.deepEqual(errors,[]);await page.close();
  }
  console.log('PASS: 320/390/1440px login/signup, password toggle, sign-in error recovery, form contrast, waitlist consent/success/rate-limit and preserved input (isolated API fixtures)');
 }finally{await browser?.close();server.close()}
})().then(()=>process.exit(0)).catch(error=>{console.error(error);server.close();process.exit(1)});
