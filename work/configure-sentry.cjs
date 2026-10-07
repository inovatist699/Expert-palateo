const fs = require('node:fs');
const path = require('node:path');
const root = path.join(__dirname,'palateo_cloudflare_pages');
process.loadEnvFile(path.join(root,'.env.sentry.local'));
const dsn = process.env.SENTRY_DSN;
if (!dsn || !new URL(dsn).hostname.endsWith('.sentry.io')) throw Error('Sentry DSN unavailable');
const monitoring = path.join(root,'monitoring.js');
fs.writeFileSync(monitoring,fs.readFileSync(monitoring,'utf8').replace('__SENTRY_DSN__',dsn));
const tags = '<script src="/vendor/sentry-11.4.0.min.js"></script><script src="/monitoring.js"></script>';
for(const file of ['index.html','app/index.html']) {
  const p = path.join(root,file), html = fs.readFileSync(p,'utf8');
  if(!html.includes('/monitoring.js'))fs.writeFileSync(p,html.replace('</head>',tags+'</head>'));
}
const p = path.join(root,'vercel.json'), config = JSON.parse(fs.readFileSync(p,'utf8'));
const csp = config.headers[0].headers.find(h=>h.key==='Content-Security-Policy');
if(!csp.value.includes(new URL(dsn).origin))csp.value=csp.value.replace("connect-src 'self'", "connect-src 'self' "+new URL(dsn).origin);
fs.writeFileSync(p,JSON.stringify(config,null,2)+'\n');
const policy = path.join(root,'privacy/index.html');
let privacy = fs.readFileSync(policy,'utf8');
if(!privacy.includes('https://sentry.io/privacy/')) {
  const end = privacy.indexOf('</section>',privacy.indexOf('<section id="sharing">'));
  if(end<0)throw Error('Privacy provider section missing');
  privacy=privacy.slice(0,end)+'<p>We use <a href="https://sentry.io/privacy/">Sentry</a> to detect and investigate technical errors on the app and waitlist. Reports include a technical error category, app version and limited code locations. We remove account details, form contents, credentials, URL queries and fragments, and discard IP addresses from stored error events. We do not enable Sentry session recordings or behavioural analytics. Providers still receive network requests needed to deliver their services.</p>'+privacy.slice(end);
  fs.writeFileSync(policy,privacy);
}
console.log('Configured public DSN, local SDK and restricted Sentry ingestion CSP.');
if(process.argv.includes('--privacy'))(async()=>{
  const origin = new URL(dsn).hostname.includes('.de.') ? 'https://de.sentry.io' : 'https://us.sentry.io';
  const response = await fetch(origin+'/api/0/projects/'+encodeURIComponent(process.env.SENTRY_ORG)+'/'+encodeURIComponent(process.env.SENTRY_PROJECT)+'/', {
    method:'PUT',headers:{Authorization:'Bearer '+process.env.SENTRY_AUTH_TOKEN,'Content-Type':'application/json'},
    body:JSON.stringify({defaultEnvironment:'production',dataScrubber:true,dataScrubberDefaults:true,scrubIPAddresses:true,sensitiveFields:['email','phone','password','token','authorization'],allowedDomains:['https://palateo.in','https://www.palateo.in'],scrapeJavaScript:false}),signal:AbortSignal.timeout(15000)
  });
  if(!response.ok)throw Error('Sentry privacy settings request returned '+response.status);
  const settings=await response.json();
  console.log(JSON.stringify({privacyConfigured:true,scrubIPAddresses:settings.options?.['sentry:scrub_ip_address']??settings.scrubIPAddresses}));
})().catch(e=>{console.error(e.message);process.exitCode=1});
