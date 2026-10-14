const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '../../..');

function loadEnvSafely(filePath) {
  if (fs.existsSync(filePath)) {
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      for (const line of content.split(/\r?\n/)) {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith('#')) continue;
        const eqIdx = trimmed.indexOf('=');
        if (eqIdx !== -1) {
          const key = trimmed.slice(0, eqIdx).trim();
          let val = trimmed.slice(eqIdx + 1).trim();
          if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
            val = val.slice(1, -1);
          }
          if (!process.env[key]) {
            process.env[key] = val;
          }
        }
      }
    } catch (_) {}
  }
}

// Load potential env files in order of precedence
loadEnvSafely(path.join(root, '.env.agents.local'));
loadEnvSafely(path.join(root, 'work/palateo_cloudflare_pages/.env.resend.local'));
loadEnvSafely(path.join(root, 'work/palateo_cloudflare_pages/.env.auth-check.local'));
loadEnvSafely(path.join(root, '.env.local'));
loadEnvSafely(path.join(root, '.env'));

const configPath = path.join(root, 'config/agents.config.json');
let rawConfig = {};
try {
  rawConfig = JSON.parse(fs.readFileSync(configPath, 'utf8'));
} catch (e) {
  console.warn('[Config] Warning: Could not read agents.config.json, using defaults.');
}

const config = {
  ...rawConfig,
  root,
  env: {
    mode: process.env.FLEET_MODE || (rawConfig.marketing?.instagram?.dryRunPublish === false ? 'live' : 'dry-run'),
    logLevel: process.env.FLEET_LOG_LEVEL || 'info',
    instagram: {
      accountId: process.env.INSTAGRAM_ACCOUNT_ID || '',
      accessToken: process.env.META_ACCESS_TOKEN || process.env.INSTAGRAM_ACCESS_TOKEN || '',
      graphVersion: process.env.INSTAGRAM_GRAPH_VERSION || rawConfig.marketing?.instagram?.graphApiVersion || 'v21.0'
    },
    resend: {
      apiKey: process.env.RESEND_API_KEY || '',
      mailToken: process.env.WAITLIST_MAIL_TOKEN || '',
      from: process.env.EMAIL_FROM_ADDRESS || rawConfig.ops?.emailOps?.fromAddress || 'concierge@palateo.in'
    },
    vercel: {
      token: process.env.VERCEL_TOKEN || '',
      orgId: process.env.VERCEL_ORG_ID || 'team_IDls8zTG4aRll5HgBB3VaPHH',
      projectId: process.env.VERCEL_PROJECT_ID || 'prj_FDDeOkC7enBhavqpKgKdUIy1Bg69'
    },
    supabase: {
      url: process.env.PALATEO_SUPABASE_URL || 'https://vfxlqsmffvyfuvjrcxux.supabase.co',
      anonKey: process.env.PALATEO_SUPABASE_ANON_KEY || '',
      serviceKey: process.env.PALATEO_SUPABASE_SERVICE_ROLE_KEY || ''
    },
    sentry: {
      authToken: process.env.SENTRY_AUTH_TOKEN || ''
    },
    omniroute: {
      baseUrl: process.env.OMNIROUTE_BASE_URL || 'http://localhost:20128/v1'
    }
  }
};

module.exports = config;
