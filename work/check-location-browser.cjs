const fs=require('node:fs'),path=require('node:path'),http=require('node:http'),assert=require('node:assert/strict'),crypto=require('node:crypto');
const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
const fixture=fs.readFileSync(path.join(__dirname,'check-diet-browser.cjs'),'utf8').match(/const fixture=`([\s\S]*?)`;/)[1].replace("go('discover')","syncTaste=async()=>{};userLocation=null;go('home')");
(async()=>{
 for(const surface of ['web','android']){
  const root=path.resolve(__dirname,surface==='web'?'palateo_cloudflare_pages':'../mobile/www');
  let html=fs.readFileSync(path.join(root,'app/index.html'),'utf8');const inline=html.match(/<script>([\s\S]*?)<\/script>/)[1];
  html=html.replace(/^initV5\(\);\r?$/m,fixture);
  const hash=s=>crypto.createHash('sha256').update(s.replace(/\r\n?/g,'\n')).digest('base64');
  html=html.replace('sha256-'+hash(inline),'sha256-'+hash(html.match(/<script>([\s\S]*?)<\/script>/)[1]));
  const server=http.createServer((req,res)=>{
   const url=new URL(req.url,'http://localhost');if(url.pathname==='/app/'){res.setHeader('Content-Type','text/html');return res.end(html)}
   const file=path.resolve(root,'.'+url.pathname);if(!file.startsWith(root+path.sep)||!fs.existsSync(file)||!fs.statSync(file).isFile())return res.writeHead(404).end();
   res.setHeader('Content-Type',({'.js':'text/javascript','.css':'text/css','.svg':'image/svg+xml'})[path.extname(file)]||'application/octet-stream');res.end(fs.readFileSync(file));
  });await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));let browser;
  try{
   browser=await chromium.launch({headless:true,channel:'msedge',args:['--use-angle=swiftshader','--enable-unsafe-swiftshader']});
   const context=await browser.newContext({viewport:{width:390,height:844},reducedMotion:'reduce',permissions:['geolocation'],geolocation:{latitude:23.0225,longitude:72.5714,accuracy:20}}),page=await context.newPage(),errors=[];
   page.on('pageerror',e=>errors.push(e.message));await page.route('**/*sentry*/**',route=>route.abort());
   await page.addInitScript(()=>{sessionStorage.setItem('palo-intro','1');localStorage.setItem('palateo-palo-voice','off')});
   await page.goto('http://127.0.0.1:'+server.address().port+'/app/');
   assert.equal(await page.evaluate(()=>userLocation),null);
   await page.locator('.studioLocate').click();await page.waitForFunction(()=>!!userLocation&&!locationRequestPending);
   await page.waitForFunction(()=>streetMap?.loaded(),{timeout:30000});
   assert.equal(await page.locator('.studioUserLocation').count(),1);assert.equal(await page.locator('.restaurantMarker').count(),2);
   assert.match(await page.locator('.restaurant-card').first().textContent(),/0.1 km away/);
   await page.evaluate(()=>{go('profile');return setProfileDistance(2)});await page.evaluate(()=>go('home'));
   await page.waitForFunction(()=>streetMap?.loaded(),{timeout:30000});
   assert.equal(await page.locator('.restaurantMarker').count(),1,'Radius removes far venues from the map');
   await page.locator('.studioLocate').click();await page.waitForFunction(()=>!locationRequestPending);
   assert.equal(await page.evaluate(()=>state.answers.distance),'2');assert.equal(await page.locator('.restaurantMarker').count(),1);
   await page.evaluate(()=>{go('discover');discoverSort='distance';drawDiscover()});
   assert.equal(await page.locator('#list .restaurant-card').count(),1);
   await page.evaluate(()=>{dbCatalog.push({...dbCatalog[0],id:'bad',name:'Invalid coordinates',latitude:'',longitude:false});state.answers.distance='any';go('home')});
   await page.waitForFunction(()=>streetMap?.loaded(),{timeout:30000});
   assert.equal(await page.locator('.restaurantMarker').count(),2,'Malformed coordinates never create map pins');
   await page.evaluate(async()=>{
    if(window.PalateoNative)window.PalateoNative.getCurrentPosition=()=>Promise.reject({code:'OS-PLUG-GLOC-0003'});
    else navigator.geolocation.getCurrentPosition=(ok,fail)=>fail({code:1});
    await useMyLocation();
   });
   assert.equal(await page.evaluate(()=>userLocation),null);assert.equal(await page.locator('.studioUserLocation').count(),0);
   assert.match(await page.locator('[data-location-status]').textContent(),/declined/);
   assert.equal(await page.locator('.restaurant-card').first().textContent().then(t=>/km away/.test(t)),false,'No stale distance after permission failure');
   await page.evaluate(()=>{setCity('Vadodara')});assert.equal(await page.evaluate(()=>userLocation),null);
   assert.deepEqual(errors,[]);console.log('PASS: '+surface+' real-map GPS, distance labels/radius, refresh, invalid pins, denial and city switching');
  }finally{await browser?.close();server.close()}
 }
})().catch(e=>{console.error(e);process.exitCode=1});
