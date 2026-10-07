const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const root=path.join(__dirname,'palateo_cloudflare_pages');
if(process.argv.includes('--browser')) {
 const page='<!doctype html><html><head><title>Palateo isolated monitoring check</title><script src="/sdk.js"></script><script>const init=Sentry.init;Sentry.init=options=>init({...options,transport:()=>({send(envelope){document.getElementById("result").textContent=JSON.stringify(envelope);return Promise.resolve({statusCode:200})},flush(){return Promise.resolve(true)}})});</script><script src="/monitoring.js"></script></head><body><h1>Isolated Sentry browser check</h1><p>Events stay in this page. No telemetry leaves the browser.</p><button id="trigger">Trigger synthetic error</button><pre id="result">Waiting</pre><script>document.getElementById("trigger").addEventListener("click",()=>{throw new Error("private@example.com password=veryprivate")});</script></body></html>';
 const server=require('node:http').createServer((req,res)=>{
  res.setHeader('Content-Type',req.url==='/'?'text/html':'application/javascript');
  if(req.url==='/')return res.end(page);
  if(req.url==='/sdk.js')return res.end(fs.readFileSync(root+'/vendor/sentry-11.4.0.min.js'));
  if(req.url==='/monitoring.js')return res.end(fs.readFileSync(root+'/monitoring.js'));
  res.statusCode=404;res.end();
 });
 server.listen(0,'127.0.0.1',()=>console.log('Isolated browser check: http://127.0.0.1:'+server.address().port));
}
let config, captures=[];
const context={window:{Sentry:true},location:{origin:'https://palateo.in',pathname:'/app/'},URL,
  Sentry:{init(c){config=c},globalHandlersIntegration(){return 'GlobalHandlers'},dedupeIntegration(){return 'Dedupe'},captureMessage(...args){captures.push(args)}}};
vm.runInNewContext(fs.readFileSync(root+'/monitoring.js','utf8'),context);
assert.equal(config.sendDefaultPii,false);assert.equal(config.autoSessionTracking,false);assert.equal(config.tracesSampleRate,0);assert.equal(config.maxBreadcrumbs,0);
assert.equal(config.defaultIntegrations,false);assert.deepEqual(Array.from(config.integrations),['GlobalHandlers','Dedupe']);
const event={event_id:'test',message:'password=mysecret',user:{email:'private@example.com'},request:{url:'https://palateo.in/app/#access_token=secret'},breadcrumbs:[{data:{password:'private'}}],extra:{phone:'9876543210'},contexts:{location:{lat:22.2}},exception:{values:[{type:'TypeError',value:'token=veryprivate',stacktrace:{frames:[{filename:'https://palateo.in/app/?email=private@example.com#token=secret',function:'render',lineno:1},{filename:'https://external.invalid/?token=private'}]}}]}};
const safe=config.beforeSend(event),text=JSON.stringify(safe);
for(const secret of ['mysecret','private','veryprivate','access_token','9876543210','contexts','breadcrumbs','request'])assert.ok(!text.includes(secret),'Sensitive telemetry leak: '+secret);
assert.equal(safe.exception.values[0].stacktrace.frames[0].filename,'https://palateo.in/app/');
context.window.reportPalateoError('feedback_sync_failed');context.window.reportPalateoError('email=private@example.com');assert.equal(captures.length,1);
for(let i=0;i<4;i++)assert.ok(config.beforeSend({message:'error'}));assert.equal(config.beforeSend({message:'error'}),null);
for(const file of ['index.html','app/index.html'])assert.ok(fs.readFileSync(root+'/'+file,'utf8').includes('/monitoring.js'));
const handler=require(root+'/api/waitlist.js');
(async()=>{
 const savedFetch=global.fetch,savedDSN=process.env.SENTRY_DSN;
 process.env.SENTRY_DSN='https://public@o123.ingest.de.sentry.io/456';let request;
 global.fetch=async(url,options)=>{request={url,options};return {ok:true}};
 const id=await handler.reportServerError('waitlist_request_failed');assert.match(id,/^[a-f0-9]{32}$/);
 assert.equal(request.url,'https://o123.ingest.de.sentry.io/api/456/envelope/');
 const parts=request.options.body.trim().split('\n');assert.equal(JSON.parse(parts[1]).type,'event');assert.equal(JSON.parse(parts[2]).message,'waitlist_request_failed');
 request=null;await handler.reportServerError('private@example.com');assert.equal(request,null);
 global.fetch=async()=>{throw Error('monitoring offline')};await handler.reportServerError('waitlist_request_failed');
 global.fetch=savedFetch;if(savedDSN===undefined)delete process.env.SENTRY_DSN;else process.env.SENTRY_DSN=savedDSN;
 if(process.argv.includes('--live')){
  process.loadEnvFile(root+'/.env.sentry.local');
  const eventId=await handler.reportServerError('monitoring_connection_check');assert.ok(eventId,'Sentry rejected verification event');
  fs.writeFileSync(path.join(__dirname,'../outputs/Sentry-verification-event.json'),JSON.stringify({eventId,project:process.env.SENTRY_PROJECT},null,2));
  console.log('Sentry accepted a synthetic verification event.');
 }
 console.log('PASS: Sentry initialization, privacy scrubbing, bounded event volume, backend envelope and monitoring failure isolation');
})().catch(e=>{console.error(e.message);process.exitCode=1});
