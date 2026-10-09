// Local responsive test harness; kept outside the deployment directory.
const http=require('node:http'),fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'palateo_cloudflare_pages');
const screens={home:['Home','redesign-app-375.png'],details:['Place & About','redesign-place-375.png'],quiz:['Favourite cuisines','redesign-quiz-cuisines.png'],spice:['Spice quiz','redesign-quiz-spice.png'],calibration:['Live dish calibration','redesign-calibration-mobile.png'],profile:['My palate','redesign-profile-mobile.png'],waitlist:['Waitlist','redesign-waitlist-375.png']};
http.createServer((req,res)=>{
 const url=new URL(req.url,'http://127.0.0.1');
 if(url.pathname==='/design-preview'){
  res.setHeader('Content-Type','text/html; charset=utf-8');res.setHeader('Cache-Control','no-store');
  res.end(`<!doctype html><html lang="en"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Palateo design preview</title><style>body{margin:0;padding:24px;font:16px/1.6 system-ui;background:#c3e7f1;color:#20373b}main{max-width:1400px;margin:auto}h1{font-size:32px;margin:0}p{color:#315e68;max-width:65ch}nav{display:flex;gap:16px;flex-wrap:wrap;margin:16px 0 28px}a{color:#20373b;text-underline-offset:4px}a:focus-visible{outline:3px solid #20373b;outline-offset:4px}.screens{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,290px),1fr));gap:24px;align-items:start}figure{margin:0;min-width:0}figcaption{font-weight:700;margin:0 0 10px}img{width:100%;max-width:375px;border-radius:16px;display:block}.palette{display:grid;grid-template-columns:repeat(auto-fit,minmax(140px,1fr));gap:12px;margin:24px 0}.swatch{border:1px solid #20373b;border-radius:12px;padding:18px;color:#20373b;line-height:1.5}.swatch strong,.swatch span{display:block}.swatch.moonstone{color:#112c31}.swatch.gunmetal{color:#c3e7f1}</style><main><h1>Palateo design preview</h1><p>Actual screenshots from the tested local build. Production has not been updated. These screenshots show the isolated test account; open the app to try the interactive version with your account.</p><nav><a href="/app/">Open interactive app</a><a href="/">Open waitlist</a><a href="/viewport?width=375&height=812">375px interactive view</a></nav><section class="palette" aria-label="Your selected colour palette"><div class="swatch" style="background:#c3e7f1"><strong>Light blue</strong><span>#C3E7F1</span></div><div class="swatch moonstone" style="background:#519cab"><strong>Moonstone</strong><span>#519CAB</span></div><div class="swatch" style="background:#ffc64f"><strong>Saffron</strong><span>#FFC64F</span></div><div class="swatch gunmetal" style="background:#20373b"><strong>Gunmetal</strong><span>#20373B</span></div></section><div class="screens">${Object.entries(screens).map(([key,[label]])=>`<figure><figcaption>${label}</figcaption><img src="/preview-image/${key}" alt="${label} at a 375px mobile viewport" loading="lazy"></figure>`).join('')}</div></main></html>`);return;
 }
 if(url.pathname.startsWith('/preview-image/')){
  const screen=screens[url.pathname.slice('/preview-image/'.length)];
  const image=screen&&path.resolve(__dirname,'../outputs',screen[1]);
  if(!image||!fs.existsSync(image)){res.writeHead(404);res.end();return}
  res.setHeader('Content-Type','image/png');res.setHeader('Cache-Control','no-store');fs.createReadStream(image).pipe(res);return;
 }
 if(url.pathname==='/viewport'){
  const width=[320,375,768,1024,1440].includes(Number(url.searchParams.get('width')))?Number(url.searchParams.get('width')):375;
  const height=[568,812,900].includes(Number(url.searchParams.get('height')))?Number(url.searchParams.get('height')):812;
  res.setHeader('Content-Type','text/html');
  res.end(`<!doctype html><html lang="en"><title>Palateo responsive check</title><style>body{margin:0;background:#dce2dd;font:14px system-ui}iframe{display:block;border:0;width:${width}px;height:${height}px}nav{padding:8px}a{margin-right:12px}</style><nav>${[320,375,768,1024,1440].map(w=>`<a href="/viewport?width=${w}&height=${w===320?568:812}">${w}px</a>`).join('')}</nav><iframe title="Palateo app" src="/app/"></iframe></html>`);return;
 }
 const target=path.resolve(root,'.'+decodeURIComponent(url.pathname)+(url.pathname.endsWith('/')?'index.html':''));
 if(!target.startsWith(root+path.sep)||!/^\.(html|js|css|svg|png)$/.test(path.extname(target))||!fs.existsSync(target)){res.writeHead(404);res.end();return;}
 res.setHeader('Content-Type',({'.html':'text/html','.js':'text/javascript','.css':'text/css','.svg':'image/svg+xml','.png':'image/png'})[path.extname(target)]);
 res.setHeader('Cache-Control','no-store');fs.createReadStream(target).pipe(res);
}).listen(8771,'127.0.0.1',()=>console.log('Responsive preview: http://127.0.0.1:8771/viewport'));
