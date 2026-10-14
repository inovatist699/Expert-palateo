// Launch the installed OmniRoute gateway; never emulate provider responses.
const fs=require('node:fs'),path=require('node:path'),{spawn}=require('node:child_process');
const root=path.resolve(__dirname,'..');
const localEnv=path.join(root,'.env.palo.local');
if(fs.existsSync(localEnv))process.loadEnvFile(localEnv);
const base=(process.env.OMNIROUTE_URL||process.env.OMNIROUTE_BASE_URL||'http://127.0.0.1:20128').replace(/\/+$/,'').replace(/\/v1$/,'');
async function status(){
 const response=await fetch(base+'/v1/models',{headers:process.env.OMNIROUTE_API_KEY?{Authorization:'Bearer '+process.env.OMNIROUTE_API_KEY}:{},signal:AbortSignal.timeout(5000)});
 if(!response.ok)throw Error('OmniRoute HTTP '+response.status);
 const data=await response.json();console.log(JSON.stringify({online:true,base,models:data.data.map(m=>m.id)}));
}
if(process.argv.includes('--status'))status().catch(e=>{console.error(JSON.stringify({online:false,error:e.message}));process.exitCode=1});
else (async()=>{
 try{await status();return}catch{}
 const app=process.env.OMNIROUTE_INSTALL_DIR||(process.env.LOCALAPPDATA&&path.join(process.env.LOCALAPPDATA,'Programs/OmniRoute/resources/app'));
 if(!app||!fs.existsSync(path.join(app,'server-ws.mjs')))throw Error('Install OmniRoute or set OMNIROUTE_INSTALL_DIR to its server directory.');
 const data=process.env.DATA_DIR||(process.env.APPDATA&&path.join(process.env.APPDATA,'omniroute'));
 if(!data)throw Error('Set DATA_DIR to the existing OmniRoute data directory.');
 const env={...process.env,DATA_DIR:data,PORT:String(new URL(base).port||20128),HOSTNAME:'127.0.0.1',NODE_ENV:'production'};
 const secretFile=path.join(data,'server.env');
 if(fs.existsSync(secretFile))for(const line of fs.readFileSync(secretFile,'utf8').split(/\r?\n/)){const m=line.match(/^([A-Z_]+)=(.*)$/);if(m)env[m[1]]=m[2].replace(/^"|"$/g,'');}
 const child=spawn(process.execPath,[path.join(app,'server-ws.mjs')],{cwd:app,env,stdio:'inherit',windowsHide:true});
 child.on('error',()=>{console.error('Unable to start OmniRoute');process.exitCode=1});
 child.on('exit',code=>{process.exitCode=code||0});
})().catch(e=>{console.error(e.message);process.exitCode=1});
