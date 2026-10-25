import publicKey from './public-key.json' with { type: 'json' };

const encoder = new TextEncoder();
const decode = (value: string) => Uint8Array.from(atob(value.replace(/-/g, '+').replace(/_/g, '/')), c => c.charCodeAt(0));
const hash = async (value: string) => Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256', encoder.encode(value))), b => b.toString(16).padStart(2, '0')).join('');
const key = crypto.subtle.importKey('jwk', publicKey, { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' }, false, ['verify']);
const reply = (status: number, value: unknown) => new Response(JSON.stringify(value), {
  status, headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' }
});
async function limitedText(stream: ReadableStream<Uint8Array> | null, limit: number) {
  if (!stream) throw Error('Missing body');
  const reader = stream.getReader(), chunks: Uint8Array[] = []; let size = 0;
  try {
    for (;;) { const { value, done } = await reader.read(); if (done) break;
      size += value.length; if (size > limit) throw Error('Body too large'); chunks.push(value);
    }
  } finally { await reader.cancel().catch(() => {}); }
  const bytes = new Uint8Array(size); let offset = 0;
  for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.length; }
  return new TextDecoder('utf-8', { fatal: true }).decode(bytes);
}

Deno.serve(async request => {
  if (request.method !== 'POST') return reply(405, { error: 'POST required' });
  let body: string;
  try {
    const authorization = request.headers.get('Authorization') || '';
    if (!authorization.startsWith('Bearer ') || authorization.length > 4096) throw Error('Invalid assertion');
    const parts = authorization.slice(7).split('.'); if (parts.length !== 3) throw Error('Invalid assertion');
    const header = JSON.parse(new TextDecoder().decode(decode(parts[0])));
    if (header.alg !== 'RS256' || header.kid !== publicKey.kid) throw Error('Invalid algorithm');
    if (!await crypto.subtle.verify('RSASSA-PKCS1-v1_5', await key, decode(parts[2]), encoder.encode(parts[0] + '.' + parts[1]))) throw Error('Invalid signature');
    const claims = JSON.parse(new TextDecoder().decode(decode(parts[1]))), now = Math.floor(Date.now() / 1000);
    if (claims.iss !== 'https://palateo.in/api/truecaller' || claims.aud !== 'palateo-truecaller-flow' ||
      !Number.isInteger(claims.iat) || !Number.isInteger(claims.exp) || claims.iat > now + 5 ||
      claims.exp <= now || claims.exp - claims.iat <= 0 || claims.exp - claims.iat > 30) throw Error('Invalid assertion claims');
    body = await limitedText(request.body, 16384);
    if (claims.bodyHash !== await hash(body)) throw Error('Body mismatch');
    const input = JSON.parse(body);
    if (Object.keys(input).sort().join(',') !== 'input,operation' ||
      !['attempt', 'start', 'callback', 'reject', 'consume'].includes(input.operation) ||
      !input.input || typeof input.input !== 'object' || Array.isArray(input.input)) throw Error('Invalid operation');
  } catch { return reply(401, { error: 'Unauthorized' }); }
  try {
    // The privileged key never leaves this managed Supabase runtime.
    const secret = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    if (!secret) throw Error('Backend unavailable');
    const response = await fetch('https://ntuaqcnbhqtbhbnnobmm.supabase.co/rest/v1/rpc/truecaller_flow', {
      method: 'POST', redirect: 'error', signal: AbortSignal.timeout(2000),
      headers: { apikey: secret, Authorization: 'Bearer ' + secret, 'Content-Type': 'application/json' }, body
    });
    if (!response.ok) throw Error('State unavailable');
    return reply(200, JSON.parse(await limitedText(response.body, 32768)));
  } catch { return reply(503, { error: 'Verification state unavailable' }); }
});
