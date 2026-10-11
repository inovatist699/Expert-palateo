const { spawnSync } = require('node:child_process');
const path = require('node:path');
const fs = require('node:fs');

const authPath = 'C:\\Users\\Aayush\\Documents\\Codex\\2026-09-30\\referenced-chatgpt-conversation-this-is-an\\work\\.vercel-cli-profile\\auth\\auth.json';
let authToken = process.env.VERCEL_TOKEN || '';
if (!authToken && fs.existsSync(authPath)) {
  try {
    const authData = JSON.parse(fs.readFileSync(authPath, 'utf8'));
    authToken = authData.token || '';
  } catch (err) {
    console.warn('Notice: Unable to parse auth profile, relying on environment or CLI session.');
  }
}

const defaultVercelBin = 'C:\\Users\\Aayush\\Documents\\Codex\\2026-09-30\\referenced-chatgpt-conversation-this-is-an\\work\\vercel_cli_tmp\\node_modules\\.bin\\vercel.CMD';
const vercelBin = fs.existsSync(defaultVercelBin) ? defaultVercelBin : 'vercel';
const projectDir = path.join(__dirname, 'palateo_cloudflare_pages');

console.log('Deploying from:', projectDir);

const appDataProfile = 'C:\\Users\\Aayush\\Documents\\Codex\\2026-09-30\\referenced-chatgpt-conversation-this-is-an\\work\\.vercel-cli-profile\\AppData\\Roaming';
const env = {
  ...process.env,
  APPDATA: fs.existsSync(appDataProfile) ? appDataProfile : (process.env.APPDATA || ''),
  VERCEL_TOKEN: authToken,
  VERCEL_ORG_ID: 'team_IDls8zTG4aRll5HgBB3VaPHH',
  VERCEL_PROJECT_ID: 'prj_FDDeOkC7enBhavqpKgKdUIy1Bg69'
};

const vercelArgs = [
  'deploy',
  '--prod',
  '--yes',
  '--scope', 'palateo'
];
if (authToken) {
  vercelArgs.push('--token', authToken);
}

const res = spawnSync(vercelBin, vercelArgs, {
  cwd: projectDir,
  env,
  shell: true,
  encoding: 'utf8',
  stdio: 'inherit'
});

console.log('Deploy exit code:', res.status);
process.exit(res.status || 0);
