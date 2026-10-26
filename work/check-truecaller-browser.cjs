const fs=require('node:fs'),path=require('node:path'),http=require('node:http'),assert=require('node:assert/strict'),crypto=require('node:crypto');
const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
(async()=>{
 for(const surface of ['web','android']){
  const root=path.resolve(__dirname,surface==='web'?'palateo_cloudflare_pages':'../mobile/www');
  const original=fs.readFileSync(path.join(root,'app/index.html'),'utf8');
  const fixture="isRailwayActive=()=>false;truecallerRequest=async()=>({android:false,web:false});authRequired=true;requireAuthGate();";
  let html=original.replace(/^initV5\(\);\r?$/m,fixture);
  const hash=value=>crypto.createHash('sha256').update(value.match(/<script>([\s\S]*?)<\/script>/)[1].replace(/\r\n?/g,'\n')).digest('base64');
  html=html.replace('sha256-'+hash(original),'sha256-'+hash(html));
  const server=http.createServer((req,res)=>{
   const url=new URL(req.url,'http://localhost');if(url.pathname==='/app/'){res.setHeader('Content-Type','text/html');return res.end(html)}
   const file=path.resolve(root,'.'+url.pathname);if(!file.startsWith(root+path.sep)||!fs.existsSync(file)||!fs.statSync(file).isFile())return res.writeHead(404).end();
   if(file.endsWith('.js'))res.setHeader('Content-Type','text/javascript');if(file.endsWith('.css'))res.setHeader('Content-Type','text/css');res.end(fs.readFileSync(file));
  });await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));let browser;
  try{
   browser=await chromium.launch({headless:true,channel:'msedge'});const page=await browser.newPage({viewport:{width:390,height:844}});
   await page.goto('http://127.0.0.1:'+server.address().port+'/app/');
   const button=page.locator('[data-action="truecaller-verify"]');await button.waitFor({state:'attached'});
   assert.equal(await button.isVisible(),false,surface+': disabled Truecaller must stay hidden despite button display styles');
   assert.equal(await page.locator('#authEmail').isVisible(),true);
   assert.equal(await page.locator('#authSubmit').isEnabled(),true);
   await page.evaluate(()=>{window.PalateoNative={truecaller:{}};truecallerRequest=async()=>({android:true,web:false});return refreshTruecallerButtons()});
   assert.equal(await button.isVisible(),true,surface+': backend-enabled native option must be visible');
   await page.evaluate(()=>{truecallerRequest=async()=>({android:false,web:false});return refreshTruecallerButtons()});
   assert.equal(await button.isVisible(),false,surface+': disabling hides an already shown option');
   console.log('PASS: '+surface+' Truecaller activation visibility and email fallback');
  }finally{if(browser)await browser.close();await new Promise(resolve=>server.close(resolve))}
 }
})().catch(error=>{console.error(error);process.exitCode=1});
