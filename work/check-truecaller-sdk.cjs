'use strict';
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const root = path.resolve(__dirname, '..');
const read = file => fs.readFileSync(path.join(root, file), 'utf8');

(async () => {
  console.log('=== Checking Truecaller SDK Mobile Verification Integration ===');

  // 1. Check Android Native Dependencies & Manifest
  const buildGradle = read('mobile/android/app/build.gradle');
  assert.ok(buildGradle.includes('com.truecaller.android.sdk:truecaller-sdk:3.3.0'), 'Must include Truecaller SDK dependency in app/build.gradle');

  const stringsXml = read('mobile/android/app/src/main/res/values/strings.xml');
  assert.ok(stringsXml.includes('truecaller_client_id'), 'strings.xml must define truecaller_client_id');

  const manifestXml = read('mobile/android/app/src/main/AndroidManifest.xml');
  assert.ok(manifestXml.includes('com.truecaller.android.sdk.ClientId'), 'AndroidManifest.xml must declare com.truecaller.android.sdk.ClientId meta-data');
  assert.ok(manifestXml.includes('android:allowBackup="false"'), 'Must maintain allowBackup="false"');

  // 2. Check Java Capacitor Plugin & Activity Registration
  assert.ok(fs.existsSync(path.join(root, 'mobile/android/app/src/main/java/in/palateo/app/TruecallerPlugin.java')), 'TruecallerPlugin.java must exist');
  const pluginJava = read('mobile/android/app/src/main/java/in/palateo/app/TruecallerPlugin.java');
  assert.ok(pluginJava.includes('@CapacitorPlugin(name = "TruecallerAuth")'), 'Plugin must be named TruecallerAuth');
  assert.ok(pluginJava.includes('implements TcOAuthCallback'), 'Plugin must implement TcOAuthCallback');
  assert.ok(pluginJava.includes('generateCodeVerifier'), 'Plugin must support PKCE code verifier');
  assert.ok(pluginJava.includes('generateCodeChallenge'), 'Plugin must support PKCE code challenge');
  assert.match(pluginJava, /activeState.equals\(data.getState\(\)\)/, 'OAuth state must match');
  assert.match(pluginJava, /TcSdk.initAsync/);
  assert.match(stringsXml, /truecaller_enabled">false/);
  assert.doesNotMatch(stringsXml, /palateo_android_client_id/);

  const mainActivity = read('mobile/android/app/src/main/java/in/palateo/app/MainActivity.java');
  assert.ok(mainActivity.includes('registerPlugin(TruecallerPlugin.class)'), 'MainActivity must register TruecallerPlugin.class');

  // 3. Check Native Bridge in mobile/native.js
  const nativeJs = read('mobile/native.js');
  assert.ok(nativeJs.includes('truecaller'), 'mobile/native.js must expose truecaller API on PalateoNative');
  assert.ok(nativeJs.includes('TruecallerAuth'), 'mobile/native.js must bridge TruecallerAuth');

  // 4. Check Frontend Auth Feature Integration
  const authViews = read('src/features/auth/views.js');

  const authController = read('src/features/auth/controller.js');
  assert.ok(authController.includes('function handleTruecallerAuth'), 'Auth controller must declare handleTruecallerAuth');

  const authService = read('src/features/auth/service.js');
  assert.ok(authService.includes('function verifyWithTruecaller'), 'Auth service must declare verifyWithTruecaller');

  const eventsJs = read('src/app/events.js');
  assert.ok(eventsJs.includes("case 'truecaller-verify':"), 'app/events.js must handle truecaller-verify click');

  const authModalCss = read('src/styles/auth-modal.css');
  assert.ok(authModalCss.includes('.truecallerBtn'), 'auth-modal.css must style truecallerBtn');

  // 5. Check Server Endpoints & Manifest
  const manifestJson = JSON.parse(read('src/app/manifest.json'));
  assert.equal(manifestJson.publicFiles['server/api/truecaller.js'], 'api/truecaller.js', 'manifest.json must register server/api/truecaller.js');
  assert.ok(fs.existsSync(path.join(root, 'server/routes/truecaller.js')), 'server/routes/truecaller.js must exist');

  const vercelJson = JSON.parse(read('config/vercel.json'));
  const csp = vercelJson.headers[0].headers.find(h => h.key === 'Content-Security-Policy').value;
  assert.ok(csp.includes('https://*.truecaller.com'), 'CSP connect-src must allow https://*.truecaller.com');

  // No provider configuration/session integration is available: fail closed in every environment.
  const truecallerApi = require('../src/server/api/truecaller.js');
  const originalFetch = global.fetch;
  const originalEnv = process.env.NODE_ENV;
  let networkCalls = 0;
  global.fetch = async () => { networkCalls++; return { ok: true, json: async () => ({}) }; };
  try {
    for (const env of ['production', 'development', 'test']) {
      process.env.NODE_ENV = env;
      for (const body of [
        { code: 'mock_truecaller_code_123' },
        { code: 'test_code' },
        { code: 'unverified-code', codeVerifier: 'a'.repeat(43), clientId: 'attacker-client' },
        { phone: '+919876543210', name: 'Unverified caller' },
        { action: 'callback', requestId: 'x', accessToken: 'x', endpoint: 'http://127.0.0.1/private' },
        null, '{invalid json'
      ]) {
        const res = { headers: {}, setHeader(k,v) { this.headers[k]=v; }, status(n) { this.code=n; return this; }, json(data) { this.data=data; return this; }, end() {} };
        await truecallerApi({ method: 'POST', headers: { origin: 'https://palateo.in' }, body }, res);
        assert.equal(res.code, 503, env+' must not fabricate identity');
        assert.equal(res.data.code, 'TRUECALLER_UNAVAILABLE');
        for (const field of ['user', 'token', 'verified', 'phone']) assert.equal(res.data[field], undefined);
        assert.equal(res.headers['Cache-Control'], 'no-store');
      }
    }
    assert.equal(networkCalls, 0, 'Disabled verification must not contact providers or write profiles');
  } finally {
    global.fetch = originalFetch;
    if (originalEnv === undefined) delete process.env.NODE_ENV; else process.env.NODE_ENV = originalEnv;
  }

  const app = (await import('../server/index.js')).default;
  const server = await new Promise(resolve => { const instance=app.listen(0,'127.0.0.1',()=>resolve(instance)); });
  try {
    for (const endpoint of ['/api/auth/truecaller', '/api/user/truecaller']) {
      const res = await fetch('http://127.0.0.1:'+server.address().port+endpoint, {method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({code:'mock_legacy',phone:'+919876543210'})});
      assert.equal(res.status, 503);
      assert.equal((await res.json()).code, 'TRUECALLER_UNAVAILABLE');
    }
    assert.equal((await fetch('http://127.0.0.1:'+server.address().port+'/health')).status,200);
  } finally { await new Promise(resolve=>server.close(resolve)); }

  const context = vm.createContext({});
  vm.runInContext(authService, context);
  await assert.rejects(()=>context.verifyWithTruecaller({phone:'+919876543210'}),/email/i);
  assert.doesNotMatch(authViews, /data-action="truecaller-verify"/, 'Sign-in must not advertise unavailable verification');
  assert.match(authViews, /id="authEmail"/);
  assert.match(authViews, /id="authPass"/);
  console.log('PASS: Truecaller fails closed on both backends in every environment; no fake users, tokens, profile writes or client sign-in');
  process.exit(0);
})().catch(err => {
  console.error('FAILED check-truecaller-sdk:', err);
  process.exit(1);
});
