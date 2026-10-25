'use strict';
const crypto = require('node:crypto');
const ISSUER = 'https://palateo.in/api/truecaller';
const PROVIDER = 'custom:palateo-truecaller';
const AUDIENCE = 'palateo-truecaller';
const ANDROID_CLIENT = 'qnjkaprmmd59o3aembxue5mzrproqqjjeixlkil_as4';
const ORIGINS = new Set(['capacitor://localhost', 'https://localhost', 'https://palateo.in', 'https://www.palateo.in']);
const unavailable = { code: 'TRUECALLER_UNAVAILABLE', error: 'Truecaller sign-in is unavailable. Please sign in with email.' };
const digest = value => crypto.createHash('sha256').update(value).digest('hex');
function fail(status, code) { const error = new Error(code); error.status = status; throw error; }
function text(value, pattern) { return typeof value === 'string' && pattern.test(value); }
function phone(value) {
  if (typeof value !== 'string') fail(502, 'TRUECALLER_INVALID_IDENTITY');
  const normalized = value.startsWith('+') ? value : '+' + value;
  if (!/^\+[1-9][0-9]{7,14}$/.test(normalized)) fail(502, 'TRUECALLER_INVALID_IDENTITY');
  return normalized;
}
async function jsonRequest(url, options = {}) {
  const response = await fetch(url, { ...options, redirect: 'error', signal: AbortSignal.timeout(7000) });
  if (!response.ok) fail(502, 'TRUECALLER_PROVIDER_FAILED');
  const reader = response.body.getReader();
  let size = 0; const chunks = [];
  try {
    for (;;) {
      const { value, done } = await reader.read(); if (done) break;
      size += value.byteLength; if (size > 32768) fail(502, 'TRUECALLER_PROVIDER_FAILED');
      chunks.push(Buffer.from(value));
    }
  } finally { await reader.cancel().catch(() => {}); }
  try { return JSON.parse(Buffer.concat(chunks).toString('utf8')); }
  catch { fail(502, 'TRUECALLER_PROVIDER_FAILED'); }
}
function signingKey() {
  if (!process.env.TRUECALLER_IDENTITY_PRIVATE_KEY) return null;
  const key = crypto.createPrivateKey(Buffer.from(process.env.TRUECALLER_IDENTITY_PRIVATE_KEY, 'base64'));
  if (key.asymmetricKeyType !== 'rsa' || key.asymmetricKeyDetails.modulusLength < 2048) throw Error('Invalid signing key');
  return key;
}
function identityToken(number, nonceHash, key) {
  const jwk = crypto.createPublicKey(key).export({ format: 'jwk' });
  const now = Math.floor(Date.now() / 1000);
  // Verified phone is the common identity across Truecaller's different client products.
  const payload = { iss: ISSUER, aud: AUDIENCE, sub: 'phone:' + number, iat: now, exp: now + 60,
    nonce: nonceHash, phone_number: number, phone_number_verified: true };
  const encoded = [{ alg: 'RS256', typ: 'JWT', kid: digest(jwk.n).slice(0, 24) }, payload]
    .map(value => Buffer.from(JSON.stringify(value)).toString('base64url')).join('.');
  return encoded + '.' + crypto.sign('RSA-SHA256', Buffer.from(encoded), key).toString('base64url');
}
function webEnabled(key) {
  return !!key && process.env.TRUECALLER_WEB_ENABLED === 'true' &&
    process.env.TRUECALLER_WEB_PHONE_ONLY_CONFIRMED === 'true' &&
    text(process.env.TRUECALLER_WEB_PARTNER_KEY, /^[A-Za-z0-9_-]{8,256}$/) &&
    text(process.env.TRUECALLER_WEB_CALLBACK_SECRET, /^[A-Za-z0-9_-]{43,128}$/) &&
    !!process.env.TRUECALLER_IDENTITY_PRIVATE_KEY;
}
async function flow(action, values) {
  const body = JSON.stringify({ operation: action, input: values }), now = Math.floor(Date.now() / 1000);
  const key = signingKey(), jwk = crypto.createPublicKey(key).export({ format: 'jwk' });
  const encoded = [{ alg: 'RS256', kid: digest(jwk.n).slice(0, 24) }, {
    iss: ISSUER, aud: 'palateo-truecaller-flow', iat: now, exp: now + 20, bodyHash: digest(body)
  }].map(value => Buffer.from(JSON.stringify(value)).toString('base64url')).join('.');
  const assertion = encoded + '.' + crypto.sign('RSA-SHA256', Buffer.from(encoded), key).toString('base64url');
  return jsonRequest('https://ntuaqcnbhqtbhbnnobmm.supabase.co/functions/v1/truecaller-flows', {
    method: 'POST', headers: { Authorization: 'Bearer ' + assertion, 'Content-Type': 'application/json' }, body
  });
}
function sourceHash(req, key) {
  const ip = (process.env.VERCEL === '1' ? req.headers['x-vercel-forwarded-for'] : req.socket?.remoteAddress) || 'unknown';
  return crypto.createHmac('sha256', key.export({ type: 'pkcs8', format: 'der' })).update(String(ip)).digest('hex');
}
function encryptToken(token, key) {
  const iv = crypto.randomBytes(12);
  const secret = crypto.createHash('sha256').update(key.export({ type: 'pkcs8', format: 'der' })).digest();
  const cipher = crypto.createCipheriv('aes-256-gcm', secret, iv);
  return Buffer.concat([iv, cipher.update(token, 'utf8'), cipher.final(), cipher.getAuthTag()]).toString('base64url');
}
function decryptToken(value, key) {
  const data = Buffer.from(value, 'base64url');
  const secret = crypto.createHash('sha256').update(key.export({ type: 'pkcs8', format: 'der' })).digest();
  const cipher = crypto.createDecipheriv('aes-256-gcm', secret, data.subarray(0, 12));
  cipher.setAuthTag(data.subarray(-16));
  return Buffer.concat([cipher.update(data.subarray(12, -16)), cipher.final()]).toString('utf8');
}
async function webRequest(body, req, res, key, action) {
  if (!webEnabled(key)) return res.status(503).json(unavailable);
  if (action === 'web-callback') {
    const supplied = new URL(req.url, ISSUER).searchParams.get('secret') || '';
    const expected = process.env.TRUECALLER_WEB_CALLBACK_SECRET;
    if (supplied.length !== expected.length || !crypto.timingSafeEqual(Buffer.from(supplied), Buffer.from(expected))) fail(403, 'TRUECALLER_CALLBACK_REJECTED');
    if (!text(body.requestId, /^[A-Za-z0-9_-]{43}$/)) fail(400, 'TRUECALLER_INVALID_REQUEST');
    if (body.status === 'flow_invoked') return res.status(200).json({ accepted: true });
    if (body.status === 'user_rejected') { await flow('reject', { id: body.requestId }); return res.status(200).json({ accepted: true }); }
    if (body.endpoint !== 'https://profile4-noneu.truecaller.com/v1/default' ||
        !text(body.accessToken, /^[\x21-\x7e]{8,4096}$/)) fail(400, 'TRUECALLER_INVALID_REQUEST');
    // Acknowledge quickly; the requesting browser fetches the profile after the durable handoff.
    await flow('callback', { id: body.requestId, token: encryptToken(body.accessToken, key) });
    return res.status(200).json({ accepted: true });
  }
  if (!ORIGINS.has(req.headers.origin)) fail(403, 'TRUECALLER_ORIGIN_REJECTED');
  if (!text(body.nonce, /^[A-Za-z0-9_-]{43,128}$/)) fail(400, 'TRUECALLER_INVALID_REQUEST');
  if (action === 'web-start') {
    const id = crypto.randomBytes(32).toString('base64url'), secret = crypto.randomBytes(32).toString('base64url');
    const result = await flow('start', { id, secret: digest(secret), nonce: digest(body.nonce),
      source: sourceHash(req, key) });
    if (!result?.created) fail(429, 'TRUECALLER_TRY_LATER');
    return res.status(200).json({ requestId: id, completionSecret: secret, partnerKey: process.env.TRUECALLER_WEB_PARTNER_KEY });
  }
  if (!text(body.requestId, /^[A-Za-z0-9_-]{43}$/) || !text(body.completionSecret, /^[A-Za-z0-9_-]{43}$/)) fail(400, 'TRUECALLER_INVALID_REQUEST');
  const result = await flow('consume', { id: body.requestId, secret: digest(body.completionSecret), nonce: digest(body.nonce) });
  if (result?.status === 'waiting') return res.status(202).json({ status: 'waiting' });
  if (result?.status !== 'ready' || !result.token) fail(401, 'TRUECALLER_VERIFICATION_EXPIRED');
  const profile = await jsonRequest('https://profile4-noneu.truecaller.com/v1/default', {
    headers: { Authorization: 'Bearer ' + decryptToken(result.token, key) }
  });
  // Ignore names, emails, addresses and every other profile field.
  if (!Array.isArray(profile.phoneNumbers) || profile.phoneNumbers.length !== 1 || !profile.userId) fail(502, 'TRUECALLER_INVALID_IDENTITY');
  return res.status(200).json({ idToken: identityToken(phone(profile.phoneNumbers[0]), digest(body.nonce), key), provider: PROVIDER });
}
module.exports = async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('Content-Type', 'application/json');
  if (ORIGINS.has(req.headers.origin)) {
    res.setHeader('Access-Control-Allow-Origin', req.headers.origin);
    res.setHeader('Vary', 'Origin');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    if (req.method === 'OPTIONS') return res.status(204).end();
  }
  try {
    const action = new URL(req.url || '/', ISSUER).searchParams.get('action');
    const key = signingKey();
    if (req.method === 'GET' && action === 'discovery' && key) {
      // Verification-only issuer for Supabase's documented signInWithIdToken grant.
      return res.status(200).json({ issuer: ISSUER, jwks_uri: ISSUER + '?action=jwks',
        authorization_endpoint: ISSUER + '?action=authorize', token_endpoint: ISSUER + '?action=token',
        response_types_supported: [], grant_types_supported: [], token_endpoint_auth_methods_supported: ['none'],
        id_token_signing_alg_values_supported: ['RS256'], subject_types_supported: ['public'] });
    }
    // The adapter only issues proofs after Truecaller verification, never generic OAuth grants.
    if (action === 'authorize' || action === 'token') return res.status(400).json({
      error: action === 'authorize' ? 'unsupported_response_type' : 'unsupported_grant_type' });
    if (req.method === 'GET' && action === 'jwks' && key) {
      const jwk = crypto.createPublicKey(key).export({ format: 'jwk' });
      return res.status(200).json({ keys: [{ ...jwk, kid: digest(jwk.n).slice(0, 24), use: 'sig', alg: 'RS256' }] });
    }
    const enabled = process.env.TRUECALLER_ANDROID_ENABLED === 'true' && !!key;
    if (req.method === 'GET' && action === 'config') return res.status(200).json({ android: enabled, web: webEnabled(key),
      linking: process.env.TRUECALLER_LINKING_ENABLED === 'true', provider: PROVIDER });
    if (req.method !== 'POST') { res.setHeader('Allow', 'GET, POST, OPTIONS'); return res.status(405).json({ error: 'Method not allowed' }); }
    if (!enabled && !webEnabled(key)) return res.status(503).json(unavailable);
    if (!/^application\/json(?:;|$)/i.test(req.headers['content-type'] || '')) fail(415, 'TRUECALLER_INVALID_REQUEST');
    let body = req.body;
    if (typeof body === 'string') { if (Buffer.byteLength(body) > 8192) fail(413, 'TRUECALLER_INVALID_REQUEST'); try { body = JSON.parse(body); } catch { fail(400, 'TRUECALLER_INVALID_REQUEST'); } }
    if (!body || typeof body !== 'object' || Array.isArray(body) || Buffer.byteLength(JSON.stringify(body)) > 8192) fail(400, 'TRUECALLER_INVALID_REQUEST');
    if (['web-start', 'web-poll', 'web-callback'].includes(action)) return await webRequest(body, req, res, key, action);
    if (!enabled) return res.status(503).json(unavailable);
    if (!ORIGINS.has(req.headers.origin)) fail(403, 'TRUECALLER_ORIGIN_REJECTED');
    if (Object.keys(body).some(k => !['authorizationCode', 'codeVerifier', 'nonce'].includes(k)) ||
        !text(body.authorizationCode, /^[A-Za-z0-9._~+\/=-]{8,2048}$/) ||
        !text(body.codeVerifier, /^[A-Za-z0-9._~-]{43,128}$/) ||
        !text(body.nonce, /^[A-Za-z0-9_-]{43,128}$/)) fail(400, 'TRUECALLER_INVALID_REQUEST');
    const attempt = await flow('attempt', { source: sourceHash(req, key) });
    if (!attempt?.allowed) fail(429, 'TRUECALLER_TRY_LATER');
    const token = await jsonRequest('https://oauth-account-noneu.truecaller.com/v1/token', {
      method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ grant_type: 'authorization_code', client_id: ANDROID_CLIENT,
        code: body.authorizationCode, code_verifier: body.codeVerifier }).toString()
    });
    if (token.token_type?.toLowerCase() !== 'bearer' || !text(token.access_token, /^[\x21-\x7e]{8,4096}$/)) fail(502, 'TRUECALLER_INVALID_IDENTITY');
    const profile = await jsonRequest('https://oauth-account-noneu.truecaller.com/v1/userinfo', {
      headers: { Authorization: 'Bearer ' + token.access_token }
    });
    if (!text(profile.sub, /^.{1,255}$/) || profile.phone_number_verified !== true) fail(502, 'TRUECALLER_INVALID_IDENTITY');
    return res.status(200).json({ idToken: identityToken(phone(profile.phone_number), digest(body.nonce), key), provider: PROVIDER });
  } catch (error) {
    // Provider bodies, bearer credentials, phone numbers and codes must never reach logs/errors.
    return res.status(error.status || 503).json({ code: error.status ? error.message : 'TRUECALLER_UNAVAILABLE',
      error: 'Truecaller could not verify this sign-in. Please try again or use email.' });
  }
};
