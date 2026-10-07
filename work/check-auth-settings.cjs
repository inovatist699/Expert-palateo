const fs=require('node:fs');
const path=require('node:path');
const html=fs.readFileSync(path.join(__dirname,'palateo_cloudflare_pages/app/index.html'),'utf8');
const url=html.match(/const PALATEO_SUPABASE_URL = "([^"]+)"/)[1];
const key=html.match(/const PALATEO_SUPABASE_PUBLISHABLE_KEY = "([^"]+)"/)[1];
fetch(url+'/auth/v1/settings',{headers:{apikey:key},signal:AbortSignal.timeout(15000)}).then(async r=>{
 if(!r.ok)throw new Error('Auth settings returned '+r.status);
 const s=await r.json();
 console.log(JSON.stringify({emailEnabled:s.external?.email,emailAutoConfirm:s.mailer_autoconfirm,phoneEnabled:s.external?.phone,phoneAutoConfirm:s.sms_autoconfirm,signupDisabled:s.disable_signup,captchaEnabled:s.security?.captcha_enabled,providers:s.external},null,2));
}).catch(error=>{console.error(error.message);process.exitCode=1});
