const fs=require('node:fs'),path=require('node:path'),http=require('node:http'),assert=require('node:assert/strict'),crypto=require('node:crypto');
const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
const root=path.resolve(__dirname,'../mobile/www');
(async()=>{
 const html=fs.readFileSync(path.join(root,'index.html'),'utf8');
 assert.ok(!html.includes('cdn.jsdelivr.net/npm/@supabase'),'Authentication SDK must be bundled');
 const inline=html.match(/<script>([\s\S]*?)<\/script>/)[1];
 assert.ok(html.includes('sha256-'+crypto.createHash('sha256').update(inline.replace(/\r\n?/g,'\n')).digest('base64')));
 assert.equal(fs.existsSync(path.join(root,'api')),false,'No server API code in mobile assets');
 const server=http.createServer((req,res)=>{const pathname=new URL(req.url,'http://localhost').pathname;const file=path.resolve(root,'.'+pathname+(pathname.endsWith('/')?'index.html':''));if(!file.startsWith(root+path.sep)||!fs.existsSync(file)){res.writeHead(404).end();return;}res.setHeader('Content-Type',({'.html':'text/html','.js':'text/javascript','.css':'text/css','.svg':'image/svg+xml','.png':'image/png','.webm':'video/webm'})[path.extname(file)]||'application/octet-stream');res.end(fs.readFileSync(file));});
 await new Promise(resolve=>server.listen(8772,'127.0.0.1',resolve));let browser;
 try{
  browser=await chromium.launch({headless:true,channel:'msedge'});const page=await browser.newPage({viewport:{width:390,height:844},reducedMotion:'reduce'}),errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  await page.route('https://ntuaqcnbhqtbhbnnobmm.supabase.co/rest/v1/**',route=>route.fulfill({status:200,contentType:'application/json',headers:{'Access-Control-Allow-Origin':'*','Content-Range':'0-0/0'},body:'[]'}));
  await page.addInitScript(()=>sessionStorage.setItem('palo-intro','1'));
  await page.goto('http://127.0.0.1:8772/',{waitUntil:'domcontentloaded'});
  await page.locator('#authEmail').waitFor({state:'visible'});
  assert.equal(await page.evaluate(()=>typeof window.supabase.createClient),'function');
  assert.equal(await page.evaluate(()=>typeof window.PalateoNative.getCurrentPosition),'function');
  assert.deepEqual(errors,[]);
  console.log('PASS: packaged mobile web assets boot under CSP, bundled authentication/native bridge, sign-in visible and no script errors (catalog fixture)');
 }finally{await browser?.close();server.close()}
})().then(()=>process.exit(0)).catch(e=>{console.error(e);process.exit(1)});
