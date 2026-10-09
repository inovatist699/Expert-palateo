const { spawnSync } = require('node:child_process');
const path = require('node:path');
const fs = require('node:fs');

const authPath = 'C:\\Users\\Aayush\\Documents\\Codex\\2026-09-30\\referenced-chatgpt-conversation-this-is-an\\work\\.vercel-cli-profile\\auth\\auth.json';
const authData = JSON.parse(fs.readFileSync(authPath, 'utf8'));
const vercelBin = 'C:\\Users\\Aayush\\Documents\\Codex\\2026-09-30\\referenced-chatgpt-conversation-this-is-an\\work\\vercel_cli_tmp\\node_modules\\.bin\\vercel.CMD';
const projectDir = path.join(__dirname, 'palateo_cloudflare_pages');

console.log('Deploying from:', projectDir);

const token = process.env.VERCEL_TOKEN || authData.token;

const env = {
  ...process.env,
  APPDATA: 'C:\\Users\\Aayush\\Documents\\Codex\\2026-09-30\\referenced-chatgpt-conversation-this-is-an\\work\\.vercel-cli-profile\\AppData\\Roaming',
  VERCEL_TOKEN: token,
  VERCEL_ORG_ID: 'team_IDls8zTG4aRll5HgBB3VaPHH',
  VERCEL_PROJECT_ID: 'prj_FDDeOkC7enBhavqpKgKdUIy1Bg69'
};

const res = spawnSync(vercelBin, [
  'deploy',
  '--prod',
  '--yes',
  '--scope', 'palateo',
  '--token', token
], {
  cwd: projectDir,
  env,
  shell: true,
  encoding: 'utf8',
  stdio: 'inherit'
});

console.log('Deploy exit code:', res.status);
process.exit(res.status || 0);
