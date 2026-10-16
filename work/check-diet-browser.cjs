const fs=require('node:fs'),path=require('node:path'),http=require('node:http'),assert=require('node:assert/strict');
const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
const built=path.join(__dirname,'palateo_cloudflare_pages');
const fixture=`useAccount({id:'diet-browser',user_metadata:{palateo_legal_version:LEGAL_VERSION,palateo_privacy_consent:true}});
state.answers={mood:'quiet',cuisine:'Gujarati',diet:'veg',budget:'under_500',spice:'mild',occasion:'family',priority:'food',distance:'any'};
state.onboarded=true;authRequired=false;userLocation={lat:23.0225,lon:72.5714};
const base={city:'Ahmedabad',c:['Gujarati'],t:['Restaurant'],a:['quiet'],o:['family'],p:'under_500',s:'mild',rating:4.5,review_count:90,longitude:72.5714};
dbCatalog=[{...base,id:'pure',name:'Listed pure veg',latitude:23.0235,dietaryOptions:['pure_veg']},{...base,id:'mixed',name:'Mixed kitchen',latitude:23.0625,dietaryOptions:['vegetarian','non-vegetarian','eggs']},{...base,id:'egg',name:'Egg only',latitude:23.024,dietaryOptions:['eggetarian']}];
getActiveCatalog=()=>dbCatalog;document.getElementById('nav').classList.remove('hide');go('discover');`;
const html=fs.readFileSync(path.join(built,'app/index.html'),'utf8').replace(/^initV5\(\);\r?$/m,fixture);
(async()=>{
 const server=http.createServer((req,res)=>{
  const url=new URL(req.url,'http://localhost');if(url.pathname==='/app/'){res.setHeader('Content-Type','text/html');return res.end(html)}
  const file=path.resolve(built,'.'+url.pathname);if(!file.startsWith(built+path.sep)||!fs.existsSync(file)||!fs.statSync(file).isFile())return res.writeHead(404).end();
  res.end(fs.readFileSync(file));
 });await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));let browser;
 try{
  browser=await chromium.launch({headless:true,channel:'msedge'});const page=await browser.newPage({viewport:{width:390,height:844},reducedMotion:'reduce'}),errors=[];
  page.on('pageerror',e=>errors.push(e.message));await page.addInitScript(()=>{sessionStorage.setItem('palo-intro','1');localStorage.setItem('palateo-palo-voice','off')});
  await page.goto('http://127.0.0.1:'+server.address().port+'/app/');
  assert.match(await page.locator('#list .restaurant-card').first().textContent(),/0.1 km away/);assert.equal(await page.locator('#list .restaurant-card').count(),2);assert.equal(await page.locator('[data-place-id="egg"]').count(),0);
  await page.locator('[data-studio-toggle-search]').click();await page.locator('#discoverSort').selectOption('distance');assert.equal(await page.locator('#list .restaurant-card').first().getAttribute('data-place-id'),'pure');
  const toggle=page.locator('[data-action="pure-veg"]');await toggle.click();assert.equal(await toggle.getAttribute('aria-pressed'),'true');assert.equal(await page.locator('#list .restaurant-card').count(),1);
  await page.locator('[data-studio-filter="Gujarati"]').click();assert.equal(await toggle.getAttribute('aria-pressed'),'true');assert.equal(await page.locator('#discoverSort').inputValue(),'distance');
  await toggle.focus();await page.keyboard.press('Space');assert.equal(await toggle.getAttribute('aria-pressed'),'false');assert.match(await page.locator('#list .restaurant-card').first().textContent(),/0.1 km away/);assert.equal(await page.locator('#list .restaurant-card').count(),2);
  await page.evaluate(()=>go('home'));await toggle.click();assert.equal(await toggle.getAttribute('aria-pressed'),'true');assert.equal(await page.evaluate(()=>ranked().length),1);
  assert.ok(await page.locator('#dietaryFilterNote').isVisible());assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
  await page.evaluate(()=>{syncTaste=async()=>{};go('discover')});
  await page.locator('[data-rest-action="dislike"][data-rest-id="pure"]').click();
  assert.equal(await page.locator('#list [data-place-id="pure"]').count(),0,'A passed place disappears from suggestions');
  await page.evaluate(()=>go('profile'));
  await page.locator('[data-passed-summary]').click();
  await page.getByRole('button',{name:'Undo pass for Listed pure veg',exact:true}).click();
  assert.match(await page.locator('[data-passed-summary]').textContent(),/\(0\)/);
  assert.equal(await page.locator('[data-passed-summary]').evaluate(el=>el===document.activeElement),true,'Undo keeps keyboard focus');
  await page.evaluate(()=>go('discover'));assert.equal(await page.locator('#list [data-place-id="pure"]').count(),1,'Undo restores the recommendation');
  if(process.env.PALATEO_TEST_OUTPUT){fs.mkdirSync(process.env.PALATEO_TEST_OUTPUT,{recursive:true});await page.screenshot({path:path.join(process.env.PALATEO_TEST_OUTPUT,'pure-veg-mobile.png'),fullPage:true})}
  assert.deepEqual(errors,[]);console.log('PASS: mobile-width dietary exclusion, pure-veg toggle, keyboard access, cuisine/sort persistence and home filter');
 }finally{await browser?.close();server.close()}
})().catch(e=>{console.error(e);process.exitCode=1});
