const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict'),{execFileSync}=require('node:child_process');
const root=path.resolve(__dirname,'..'),mobile=path.join(root,'mobile'),output=path.join(mobile,'www');
execFileSync(process.execPath,[path.join(__dirname,'build.cjs'),'mobile'],{stdio:'inherit'});
const built=path.join(mobile,'.web-build');
assert.ok(output.startsWith(mobile+path.sep)&&path.basename(output)==='www','Only clear generated mobile assets');
fs.rmSync(output,{recursive:true,force:true});
// Copy only the shared source's public allowlist; never web deployment output or server code.
const manifest=JSON.parse(fs.readFileSync(path.join(root,'src/app/manifest.json')));
for(const dest of ['app/index.html',...Object.values(manifest.publicFiles)].filter(file=>!file.startsWith('api/'))){
 const target=path.resolve(output,dest);if(!target.startsWith(output+path.sep))throw Error('Invalid mobile asset path');
 fs.mkdirSync(path.dirname(target),{recursive:true});fs.copyFileSync(path.join(built,dest),target);
}
const config=JSON.parse(fs.readFileSync(path.join(built,'vercel.json')));
const csp=config.headers[0].headers.find(h=>h.key==='Content-Security-Policy').value.replace(/frame-ancestors [^;]+;?\s*/,'').replace("connect-src 'self'", "connect-src 'self' https://palateo.in").replace(' http://localhost:*','');
const html=fs.readFileSync(path.join(built,'app/index.html'),'utf8').replace(/<script src="https:\/\/cdn\.jsdelivr\.net\/npm\/@supabase\/supabase-js[^>]*><\/script>/,'').replace('<head>','<head><meta http-equiv="Content-Security-Policy" content="'+csp+'"><base href="/app/"><script src="/mobile-config.js"></script><script src="/native.js"></script>');
fs.writeFileSync(path.join(output,'index.html'),html);
fs.writeFileSync(path.join(output,'app/index.html'),html);
fs.writeFileSync(path.join(output,'mobile-config.js'),"window.PALATEO_WEB_ORIGIN='https://palateo.in';\n");
require(path.join(mobile,'node_modules/esbuild')).buildSync({entryPoints:[path.join(mobile,'native.js')],bundle:true,format:'iife',target:'es2020',outfile:path.join(output,'native.js')});
console.log('Mobile web assets prepared. Run cap sync before compiling native builds.');
