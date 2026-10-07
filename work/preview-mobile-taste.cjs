// Local responsive test harness; kept outside the deployment directory.
const http=require('node:http'),fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'palateo_cloudflare_pages');
http.createServer((req,res)=>{
 const url=new URL(req.url,'http://127.0.0.1');
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
