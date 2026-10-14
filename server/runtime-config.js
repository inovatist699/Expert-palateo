import 'dotenv/config';

export function validateProduction(env = process.env) {
  if (env.NODE_ENV !== 'production') return;
  if (!env.DATABASE_URL) throw Error('DATABASE_URL is required in production; memory storage is development-only.');
  if (!env.BETTER_AUTH_SECRET || env.BETTER_AUTH_SECRET.length < 32 || /development|example|changeme/i.test(env.BETTER_AUTH_SECRET)) throw Error('Set a private BETTER_AUTH_SECRET of at least 32 characters.');
  let url;
  try { url = new URL(env.BETTER_AUTH_URL); } catch { throw Error('Set the public HTTPS BETTER_AUTH_URL.'); }
  if (url.protocol !== 'https:' || /^(localhost|127\.0\.0\.1|\[::1\])$/.test(url.hostname)) throw Error('BETTER_AUTH_URL must be a public HTTPS URL.');
}

export const allowedOrigins = [
  'https://palateo.in', 'https://www.palateo.in', 'https://palateocloudflarepages.vercel.app',
  'capacitor://localhost', 'https://localhost',
  ...(process.env.NODE_ENV === 'production' ? [] : ['http://localhost:3000', 'http://localhost:8771', 'http://127.0.0.1:3000', 'http://127.0.0.1:8771']),
  ...(process.env.ALLOWED_ORIGINS || '').split(',').map(value => value.trim()).filter(Boolean)
];
if (allowedOrigins.some(value => value.includes('*'))) throw Error('ALLOWED_ORIGINS must contain exact origins, not wildcards.');
validateProduction();
