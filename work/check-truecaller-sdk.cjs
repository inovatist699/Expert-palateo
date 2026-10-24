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

  const mainActivity = read('mobile/android/app/src/main/java/in/palateo/app/MainActivity.java');
  assert.ok(mainActivity.includes('registerPlugin(TruecallerPlugin.class)'), 'MainActivity must register TruecallerPlugin.class');

  // 3. Check Native Bridge in mobile/native.js
  const nativeJs = read('mobile/native.js');
  assert.ok(nativeJs.includes('truecaller'), 'mobile/native.js must expose truecaller API on PalateoNative');
  assert.ok(nativeJs.includes('TruecallerAuth'), 'mobile/native.js must bridge TruecallerAuth');

  // 4. Check Frontend Auth Feature Integration
  const authViews = read('src/features/auth/views.js');
  assert.ok(authViews.includes('data-action="truecaller-verify"'), 'Auth dialog must include Truecaller verify action button');

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

  // 6. Test Truecaller Serverless Endpoint Execution
  const truecallerApi = require('../src/server/api/truecaller.js');
  let responseCode = null;
  let responseData = null;
  const mockRes = {
    setHeader() {},
    status(code) {
      responseCode = code;
      return {
        json(data) {
          responseData = data;
          return this;
        },
        end() {}
      };
    }
  };

  await truecallerApi({
    method: 'POST',
    headers: { origin: 'https://palateo.in' },
    body: {
      code: 'mock_truecaller_code_123',
      codeVerifier: 'mock_pkce_verifier',
      clientId: 'palateo_android_client_id'
    }
  }, mockRes);

  assert.equal(responseCode, 200, 'Serverless Truecaller API must return 200 on mock test verification');
  assert.equal(responseData.ok, true, 'Response ok must be true');
  assert.equal(responseData.verified, true, 'Response verified must be true');
  assert.equal(responseData.phone, '+919876543210', 'Response must return verified phone number');
  assert.ok(responseData.user, 'Response must return user object');

  // 7. Test Frontend verifyWithTruecaller in mock VM context
  const sandbox = {
    window: {
      PalateoNative: {
        truecaller: {
          isAvailable: async () => true,
          verifyMobile: async () => ({ authorizationCode: 'mock_tc_auth_code', codeVerifier: 'mock_verifier' })
        }
      },
      localStorage: {
        getItem: () => null,
        setItem: () => {}
      }
    },
    location: { host: 'localhost:8771' },
    navigator: { userAgent: 'Android' },
    fetch: async (url, opts) => ({
      ok: true,
      json: async () => ({
        ok: true,
        verified: true,
        phone: '+919876543210',
        user: { id: 'tc_123', name: 'Palateo Foodie', email: 'tc_user@palateo.in', phone: '+919876543210' }
      })
    }),
    isRailwayActive: () => false,
    useAccount: () => {},
    authRequired: true,
    backendReady: false,
    state: { profile: {}, userId: null, backendConnected: false, onboarded: true },
    persist: () => {},
    logEvent: async () => {},
    updateMode: () => {},
    closeAuth: () => {},
    document: { getElementById: () => ({ classList: { remove: () => {} } }) },
    toast: () => {},
    go: () => {},
    onboard: () => {}
  };

  const context = vm.createContext(sandbox);
  vm.runInContext(authService, context);
  const user = await context.verifyWithTruecaller();
  assert.equal(user.id, 'tc_123', 'verifyWithTruecaller must resolve returned authenticated user');
  assert.equal(sandbox.authRequired, false, 'authRequired must be false after verification');
  assert.equal(sandbox.state.profile.phone, '+919876543210', 'User phone must be populated in state.profile');

  console.log('PASS: Truecaller Android SDK dependencies, native plugin, bridge, frontend UI, backend API & verification contracts verified');
})().catch(err => {
  console.error('FAILED check-truecaller-sdk:', err);
  process.exit(1);
});
