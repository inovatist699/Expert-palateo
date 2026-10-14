const assert=require('node:assert/strict');
const handler=require('../src/server/api/palo.js');
const realFetch=global.fetch,env={...process.env};
for(const name of ['GEMINI_API_KEY','OMNIROUTE_URL','OMNIROUTE_BASE_URL','OMNIROUTE_API_KEY','GROQ_API_KEY','PALO_GROQ_FREE_ONLY','OPENROUTER_API_KEY'])delete process.env[name];
let calls=[],user=0,failPrimary=false;
global.fetch=async(url,options)=>{
 calls.push({url,options});
 if(url.includes('/auth/'))return {ok:true,json:async()=>({id:'palo-test-'+(++user)})};
 if(failPrimary&&url.includes('gateway.test'))return {ok:false,status:429};
 return {ok:true,json:async()=>({model:'actual-free-model',choices:[{message:{content:'Try the supplied cafe.'}}],candidates:[{content:{parts:[{text:'Try the supplied cafe.'}]}}]})};
};
async function request(body,authorization='Bearer test-session',method='POST'){
 let status,payload;const res={setHeader(){},status(v){status=v;return this},json(v){payload=v}};
 await handler({method,headers:{authorization},body},res);return {status,payload};
}
(async()=>{
 assert.equal((await request({query:'pizza'},'', 'GET')).status,405);
 assert.equal((await request({query:'pizza'},'')).status,401);
 assert.equal((await request({query:'x'.repeat(1001)})).status,400);
 assert.equal((await request({query:'pizza',action:'evolve'})).status,400);
 assert.equal((await request({query:'pizza'})).status,503);
 process.env.GEMINI_API_KEY='test-gemini-key';
 let geminiResp=await request({query:'pizza'});
 assert.equal(geminiResp.status,200);
 assert.equal(geminiResp.payload.source,'Google AI Studio');
 assert.equal(geminiResp.payload.model,'gemini-3.5-flash');
 delete process.env.GEMINI_API_KEY;
 process.env.GROQ_API_KEY='test-key';
 assert.equal((await request({query:'pizza'})).status,503,'Groq requires explicit free-account configuration');
 process.env.PALO_GROQ_FREE_ONLY='true';
 let response=await request({query:'pizza',model:'paid-model',memory:{private:'do not send'},candidates:[null,{name:'Cafe',cuisines:['Italian']}]});
 assert.equal(response.status,200);assert.equal(response.payload.source,'Groq');
 let body=JSON.parse(calls.at(-1).options.body);
 assert.equal(body.model,'openai/gpt-oss-20b');assert.equal(body.max_completion_tokens,600);
 assert.ok(!JSON.stringify(body).includes('do not send'));
 process.env.OMNIROUTE_BASE_URL='http://gateway.test/v1/';process.env.OMNIROUTE_API_KEY='local-test-key';
 response=await request({query:'pizza',turns:[null,{role:'system',text:'bad'},{role:'user',text:'pizza'}],taste:{likes:['dosa'],dislikes:['chilli']},memory:{recentTopics:['coffee'],private:'secret'}});
 assert.equal(response.payload.source,'OmniRoute');assert.equal(response.payload.model,'actual-free-model');
 assert.equal(calls.at(-1).url,'http://gateway.test/v1/chat/completions');
 body=JSON.parse(calls.at(-1).options.body);assert.equal(body.model,'palo-free');assert.equal(body.messages.length,2,'No duplicate current user turn');
 assert.ok(body.messages[0].content.includes('chilli'));assert.ok(body.messages[0].content.includes('coffee'));assert.ok(!JSON.stringify(body).includes('secret'));
 failPrimary=true;response=await request({query:'pizza'});assert.equal(response.payload.source,'Groq','Fail over after 429');
 delete process.env.GROQ_API_KEY;process.env.OPENROUTER_API_KEY='free-test-key';
 response=await request({query:'pizza'});assert.equal(response.payload.source,'OpenRouter free');assert.equal(JSON.parse(calls.at(-1).options.body).model,'openrouter/free');
 global.fetch=async(url)=>({ok:url.includes('/auth/'),json:async()=>({id:'failure-test'})});
 assert.equal((await request({query:'pizza'})).status,503);
 global.fetch=async()=>({ok:false});assert.equal((await request({query:'pizza'})).status,401);
 console.log('PASS: Palo auth, limits, free-only routes, 429 failover, actual model, bounded taste/memory context and failure handling');
})().finally(()=>{global.fetch=realFetch;for(const k of Object.keys(process.env))if(!(k in env))delete process.env[k];Object.assign(process.env,env)}).catch(e=>{console.error(e);process.exitCode=1});
