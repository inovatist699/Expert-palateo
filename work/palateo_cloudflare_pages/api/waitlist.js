const {randomUUID} = require('node:crypto');
async function reportServerError(code, level = 'error') {
  if (!['waitlist_storage_failed','waitlist_welcome_failed','waitlist_request_failed','monitoring_connection_check'].includes(code)) return;
  if (!process.env.SENTRY_DSN) return;
  try {
    const dsn = new URL(process.env.SENTRY_DSN);
    if (dsn.protocol !== 'https:' || !dsn.hostname.endsWith('.sentry.io')) return;
    const event_id = randomUUID().replaceAll('-', '');
    const envelope = JSON.stringify({event_id,dsn:dsn.href,sent_at:new Date().toISOString()})+'\n'+JSON.stringify({type:'event'})+'\n'+JSON.stringify({event_id,timestamp:Date.now()/1000,platform:'node',level,message:code,environment:'production',release:'palateo-2026-10-06-monitoring',tags:{surface:'waitlist_api'}})+'\n';
    // ponytail: bounded error messages use the official envelope format; add the Node SDK if tracing is needed.
    const result=await fetch(dsn.origin+'/api/'+dsn.pathname.split('/').filter(Boolean).pop()+'/envelope/', {method:'POST',headers:{'Content-Type':'application/x-sentry-envelope'},body:envelope,signal:AbortSignal.timeout(2000)});
    return result.ok ? event_id : null;
  } catch { /* Monitoring must never block a successful signup. */ }
}
module.exports = async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('Content-Type', 'application/json');
  if (req.method !== 'POST') { res.setHeader('Allow','POST'); return res.status(405).json({error:'Method not allowed'}); }
  if (req.headers.origin && !['https://palateo.in','https://www.palateo.in','https://palateocloudflarepages.vercel.app'].includes(req.headers.origin)) return res.status(403).json({error:'Origin not allowed'});
  if (Number(req.headers['content-length']) > 2048) return res.status(413).json({error:'Request too large'});
  if (!String(req.headers['content-type'] || '').startsWith('application/json')) return res.status(415).json({error:'JSON required'});
  let body;
  try { body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body; } catch { return res.status(400).json({error:'Invalid request'}); }
  if (!body || typeof body !== 'object') return res.status(400).json({error:'Invalid request'});
  if (Buffer.byteLength(JSON.stringify(body),'utf8') > 2048) return res.status(413).json({error:'Request too large'});
  if (body.website) return res.status(200).json({ok:true});
  const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
  const ALLOWED_CITIES = ['Ahmedabad','Vadodara','Mumbai','Delhi NCR','Bengaluru','Hyderabad','Chennai','Kolkata','Pune','Jaipur','Kochi','Goa','Chandigarh','Other'];
  if (!email || email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || !ALLOWED_CITIES.includes(body.city) || body.consent !== true) return res.status(400).json({error:'Valid email, city and consent required'});
  try {
    const url = "https://ntuaqcnbhqtbhbnnobmm.supabase.co"; const key = "sb_publishable__YWaFqDXVc-R_UlEl5DVcQ_ust-d4vp";
    const result = await fetch(url + '/rest/v1/rpc/join_launch_waitlist', {method:'POST',headers:{apikey:key,Authorization:'Bearer '+key,'Content-Type':'application/json'},body:JSON.stringify({p_email:email,p_city:body.city,p_consent:true}),signal:AbortSignal.timeout(10000)});
    if (!result.ok) { const failure = await result.json().catch(() => ({})); if(failure.code !== 'P0001')await reportServerError('waitlist_storage_failed'); return res.status(failure.code === 'P0001' ? 429 : 503).json({error:'Waitlist temporarily unavailable'}); }
    // Keep the signup saved even when the email provider is unavailable.
    if (process.env.RESEND_API_KEY && process.env.WAITLIST_MAIL_TOKEN && !email.endsWith('.invalid')) {
      try {
        const mailRpc = async sent => fetch(url + '/rest/v1/rpc/waitlist_welcome', {method:'POST',headers:{apikey:key,Authorization:'Bearer '+key,'Content-Type':'application/json'},body:JSON.stringify({p_email:email,p_token:process.env.WAITLIST_MAIL_TOKEN,p_sent:sent}),signal:AbortSignal.timeout(5000)});
        const claim = await mailRpc(false);
        if (!claim.ok) throw new Error('claim_failed');
        if (await claim.json() === true) {
          const mail = await fetch('https://api.resend.com/emails', {method:'POST',headers:{Authorization:'Bearer '+process.env.RESEND_API_KEY,'Content-Type':'application/json','Idempotency-Key':'waitlist-'+require('node:crypto').createHash('sha256').update(email).digest('hex')},body:JSON.stringify({from:'Palateo <hello@updates.palateo.in>',to:[email],reply_to:'palateo.com@gmail.com',subject:'Your seat at Palateo is saved',text:'You are on the Palateo waitlist. We will email you when access opens. Explore what is coming at https://palateo.in/\n\nIf you did not request this, or want to leave the waitlist, email palateo.com@gmail.com.\n\nAayush Mittal · Palateo · 937 GIDC Makarpura, Vadodara'}),signal:AbortSignal.timeout(8000)});
          if (!mail.ok) throw new Error('send_failed');
          if (!(await mailRpc(true)).ok) throw new Error('receipt_failed');
        }
      } catch { console.error('waitlist_welcome_failed'); await reportServerError('waitlist_welcome_failed','warning'); }
    }
    return res.status(200).json({ok:true});
  } catch { await reportServerError('waitlist_request_failed'); return res.status(503).json({error:'Waitlist temporarily unavailable'}); }
};
module.exports.reportServerError = reportServerError;
