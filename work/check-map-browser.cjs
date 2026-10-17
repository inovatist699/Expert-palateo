const fs=require('node:fs'),path=require('node:path'),http=require('node:http'),assert=require('node:assert/strict');
const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
const built=path.resolve(__dirname,'palateo_cloudflare_pages');
// Reuse the dietary fixture so map markers exercise the same eligibility rules.
const fixture=fs.readFileSync(path.join(__dirname,'check-diet-browser.cjs'),'utf8').match(/const fixture=`([\s\S]*?)`;/)[1].replace("go('discover')","go('home')");
const html=fs.readFileSync(path.join(built,'app/index.html'),'utf8').replace(/^initV5\(\);\r?$/m,fixture);
(async()=>{
 const server=http.createServer((req,res)=>{
  const url=new URL(req.url,'http://localhost');if(url.pathname==='/app/'){res.setHeader('Content-Type','text/html');return res.end(html)}
  const file=path.resolve(built,'.'+url.pathname);if(!file.startsWith(built+path.sep)||!fs.existsSync(file)||!fs.statSync(file).isFile())return res.writeHead(404).end();
  res.setHeader('Content-Type',file.endsWith('.js')?'text/javascript':file.endsWith('.css')?'text/css':'application/octet-stream');res.end(fs.readFileSync(file));
 });await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));let browser;
 try{
  browser=await chromium.launch({headless:true,channel:'msedge',args:['--use-angle=swiftshader','--enable-unsafe-swiftshader']});
  const page=await browser.newPage({viewport:{width:390,height:844},reducedMotion:'reduce'}),errors=[];
  page.on('pageerror',e=>errors.push(e.message));await page.route('**/*sentry*/**',route=>route.abort());
  await page.addInitScript(()=>{sessionStorage.setItem('palo-intro','1');localStorage.setItem('palateo-palo-voice','off')});
  await page.goto('http://127.0.0.1:'+server.address().port+'/app/');
  await page.waitForFunction(()=>typeof streetMap!=='undefined'&&streetMap,{timeout:15000});
  await page.evaluate(()=>{window.mapErrors=[];streetMap.on('error',e=>mapErrors.push(e.error?.message||String(e.error)))});
  await page.waitForFunction(()=>streetMap?.loaded(),{timeout:30000});
  assert.deepEqual(await page.evaluate(()=>mapErrors),[],'Map style and tile resources load without errors');
  assert.equal(await page.locator('.restaurantMarker').count(),2,'Map excludes egg-only venues for vegetarian users');
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
  await page.locator('[data-action="pure-veg"]').click();
  assert.equal(await page.locator('.restaurantMarker').count(),1,'Pure-veg filters map markers');
  assert.equal(await page.evaluate(()=>streetMap.getStyle().version),8);
  assert.ok(await page.locator('.maplibregl-ctrl-attrib').isVisible(),'Map attribution remains visible');
  if(process.env.PALATEO_TEST_OUTPUT){fs.mkdirSync(process.env.PALATEO_TEST_OUTPUT,{recursive:true});await page.screenshot({path:path.join(process.env.PALATEO_TEST_OUTPUT,'map-mobile.png')})}
  assert.deepEqual(errors,[]);console.log('PASS: real map style/tiles, dietary markers, pure-veg filter, attribution and mobile layout');
 }finally{await browser?.close();server.close()}
})().catch(e=>{console.error(e);process.exitCode=1});
