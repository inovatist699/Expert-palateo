const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),os=require('node:os'),crypto=require('node:crypto'),{execFileSync}=require('node:child_process');
const root=path.resolve(__dirname,'..'),temporary=fs.mkdtempSync(path.join(os.tmpdir(),'palateo-build-isolation-'));
const write=(file,value)=>{const target=path.join(temporary,file);fs.mkdirSync(path.dirname(target),{recursive:true});fs.writeFileSync(target,value)};
function snapshot(directory){
 const hashes={};
 for(const relative of fs.readdirSync(directory,{recursive:true})){const file=path.join(directory,relative);if(fs.statSync(file).isFile())hashes[relative]=crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex')}
 return hashes;
}
try{
 for(const directory of ['src','config'])fs.cpSync(path.join(root,directory),path.join(temporary,directory),{recursive:true});
 for(const file of ['scripts/build.cjs','scripts/build-mobile.cjs','mobile/native.js'])write(file,fs.readFileSync(path.join(root,file)));
 fs.symlinkSync(path.join(root,'mobile/node_modules'),path.join(temporary,'mobile/node_modules'),process.platform==='win32'?'junction':'dir');
 write('work/palateo_cloudflare_pages/app/index.html','existing web release');
 write('work/palateo_cloudflare_pages/vercel.json','existing web deployment config');
 write('mobile/www/api/stale.js','server code must never remain in the Android bundle');
 const web=path.join(temporary,'work/palateo_cloudflare_pages'),mobile=path.join(temporary,'mobile/www'),webBefore=snapshot(web);
 execFileSync(process.execPath,[path.join(temporary,'scripts/build-mobile.cjs')],{cwd:temporary,stdio:'pipe'});
 assert.deepEqual(snapshot(web),webBefore,'An Android build must not rebuild or read web deployment output');
 assert.equal(fs.existsSync(path.join(mobile,'api')),false,'Remove stale server code from generated mobile assets');
 assert.equal(fs.existsSync(path.join(temporary,'mobile/.web-build/api')),false,'Mobile staging must not contain server APIs');
 const mobileHtml=fs.readFileSync(path.join(mobile,'index.html'),'utf8');
 assert.match(mobileHtml,/<script src="\/native.js"><\/script>/);
 assert.doesNotMatch(mobileHtml,/cdn\.jsdelivr\.net\/npm\/@supabase/);
 const mobileBefore=snapshot(mobile);
 execFileSync(process.execPath,[path.join(temporary,'scripts/build.cjs')],{cwd:temporary,stdio:'pipe'});
 assert.deepEqual(snapshot(mobile),mobileBefore,'A web build must not change the packaged Android release');
 assert.doesNotMatch(fs.readFileSync(path.join(web,'app/index.html'),'utf8'),/<script src="\/native.js">/);
 assert.equal(fs.existsSync(path.join(web,'api/palo.js')),true,'Web APIs remain in the web deployment only');
 const webHtml=fs.readFileSync(path.join(web,'app/index.html'),'utf8');
 assert.equal(mobileHtml.match(/<script>([\s\S]*?)<\/script>/)[1],webHtml.match(/<script>([\s\S]*?)<\/script>/)[1],'Web and Android must ship identical recommendation, account and preference logic');
 assert.throws(()=>execFileSync(process.execPath,[path.join(temporary,'scripts/build.cjs'),'../unexpected'],{stdio:'pipe'}),'Reject unrecognized build targets');
 console.log('PASS: independent web/Android build outputs, native-only bridge, stale mobile API removal and fixed target paths');
}finally{
 assert.ok(temporary.startsWith(path.resolve(os.tmpdir())+path.sep)&&path.basename(temporary).startsWith('palateo-build-isolation-'));
 fs.rmSync(temporary,{recursive:true,force:true});
}
