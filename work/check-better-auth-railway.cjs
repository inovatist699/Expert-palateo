const assert = require('node:assert/strict');
const http = require('node:http');
const { gzipSync } = require('node:zlib');

async function run() {
  console.log('=== Checking Better Auth & Railway Backend Service ===');

  // Dynamically import ESM backend server in test mode
  const { default: app, startServer } = await import('../server/index.js');
  assert.ok(app, 'Express backend app must be exported');
  app.post('/_test/body-parser', (req, res) => res.json(req.body));
  await startServer(3000);

  // GHSA-27r3-jxmh-p828: trailing compressed bytes must not crash the shared API.
  for (const [type, payload] of [
    ['application/json', '{"diet":"veg"}'],
    ['application/x-www-form-urlencoded', 'diet=veg']
  ]) {
    for (const trailing of [Buffer.alloc(0), Buffer.concat([Buffer.from([0]), Buffer.alloc(100 * 1024, 0x58)])]) {
      const body = Buffer.concat([gzipSync(payload), trailing]);
      const parsed = await new Promise((resolve, reject) => {
        const request = http.request({
          host: '127.0.0.1', port: 3000, path: '/_test/body-parser', method: 'POST',
          headers: { 'Content-Type': type, 'Content-Encoding': 'gzip', 'Content-Length': body.length }
        }, response => {
          let data = '';
          response.setEncoding('utf8');
          response.on('data', chunk => { data += chunk; });
          response.on('error', reject);
          response.on('end', () => resolve({ status: response.statusCode, data }));
        });
        request.on('error', reject);
        request.setTimeout(5000, () => request.destroy(new Error('Compressed request timed out')));
        request.end(body);
      });
      assert.equal(parsed.status, 200);
      assert.deepEqual(JSON.parse(parsed.data), { diet: 'veg' });
      // The vulnerable decoder can emit its uncaught error after the response.
      await new Promise(resolve => setTimeout(resolve, 200));
      assert.equal((await fetch('http://127.0.0.1:3000/health')).status, 200);
    }
  }
  console.log('PASS: JSON and form compressed bodies preserve data and survive trailing bytes');

  // Probe server over loopback
  const res = await fetch('http://localhost:3000/health');
  assert.equal(res.status, 200, 'Healthcheck endpoint must return 200');
  const health = await res.json();
  assert.equal(health.status, 'ok', 'Healthcheck status must be ok');
  assert.equal(health.auth, 'better-auth', 'Auth engine must be Better Auth');
  console.log('PASS: Railway healthcheck verification (/health)');

  const signup=await fetch('http://localhost:3000/api/auth/sign-up/email',{method:'POST',headers:{'Content-Type':'application/json',Origin:'http://localhost:3000'},body:JSON.stringify({email:'palateo@gmail.com',password:'Palateo@1234',name:'Local test'})});
  assert.equal(signup.status,200);
  // Test sign in with test-created user: palateo@gmail.com / Palateo@1234
  const signinRes = await fetch('http://localhost:3000/api/auth/sign-in/email', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Origin': 'http://localhost:3000'
    },
    body: JSON.stringify({
      email: 'palateo@gmail.com',
      password: 'Palateo@1234'
    })
  });

  assert.equal(signinRes.status, 200, 'Seeded user palateo@gmail.com must be able to sign in with Palateo@1234');
  const signinData = await signinRes.json();
  assert.ok(signinData.token, 'Better Auth signin must return an active session token');
  assert.equal(signinData.user.email, 'palateo@gmail.com');
  console.log('PASS: Better Auth email authentication with palateo@gmail.com / Palateo@1234');

  // Test taste profile sync with Better Auth token
  const tasteRes = await fetch('http://localhost:3000/api/user/taste', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${signinData.token}`
    },
    body: JSON.stringify({
      cuisines: { primary: 'Gujarati', favorites: ['Gujarati', 'North Indian'] },
      spice_level: 'medium',
      budget: '500_to_1000',
      confidence: 94
    })
  });
  assert.equal(tasteRes.status, 200, 'Taste profile update must succeed');
  console.log('PASS: Authenticated taste profile update via Railway backend');

  // Test unified hydration endpoint (/api/user/state)
  const stateRes = await fetch('http://localhost:3000/api/user/state', {
    headers: {
      'Authorization': `Bearer ${signinData.token}`
    }
  });
  assert.equal(stateRes.status, 200, 'User state hydration must return 200');
  const stateData = await stateRes.json();
  assert.equal(stateData.taste.cuisines.primary, 'Gujarati', 'Hydrated taste profile must match');
  console.log('PASS: Unified user state hydration endpoint (/api/user/state)');

  const originalFetch=global.fetch;
  process.env.OMNIROUTE_URL='http://palo-gateway.test';process.env.OMNIROUTE_API_KEY='test-key';
  global.fetch=async(url,options)=>String(url).startsWith('http://palo-gateway.test')?{ok:true,json:async()=>({model:'free-test',choices:[{message:{content:'A mild vegetarian catalogue option.'}}]})}:originalFetch(url,options);
  const palo=await fetch('http://localhost:3000/api/palo',{method:'POST',headers:{'Content-Type':'application/json',Authorization:'Bearer '+signinData.token},body:JSON.stringify({query:'a mild vegetarian meal'})});
  assert.equal(palo.status,200,'Better Auth session must reach Palo');
  assert.equal((await palo.json()).source,'OmniRoute');
  const denied=await fetch('http://localhost:3000/api/palo',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({query:'pizza',authenticatedUser:{id:'spoof'}})});
  assert.equal(denied.status,401,'HTTP body cannot supply a trusted identity');
  global.fetch=originalFetch;
  console.log('PASS: Palo accepts verified Better Auth sessions and rejects unsigned identity spoofing');
  const deletion=await fetch('http://localhost:3000/api/auth/delete-user',{method:'POST',headers:{'Content-Type':'application/json',Origin:'http://localhost:3000',Authorization:'Bearer '+signinData.token},body:JSON.stringify({password:'Palateo@1234'})});
  assert.equal(deletion.status,200);
  const deletedState=await fetch('http://localhost:3000/api/user/state',{headers:{Authorization:'Bearer '+signinData.token}});
  assert.equal(deletedState.status,401);
  const {memStore}=await import('../server/db.js');assert.equal(memStore.tasteProfiles.has(signinData.user.id),false);
  console.log('PASS: account deletion removes taste data and invalidates access');
  console.log('All Better Auth and Railway backend checks passed successfully ✓\n');
  process.exit(0);
}

run().catch(err => {
  console.error('FAILED check-better-auth-railway:', err);
  process.exit(1);
});
