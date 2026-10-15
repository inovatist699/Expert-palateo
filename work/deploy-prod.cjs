const { spawnSync } = require('node:child_process');
const path = require('node:path');
const fs = require('node:fs');

const defaultVercelBin = 'C:\\Users\\Aayush\\Documents\\Codex\\2026-09-30\\referenced-chatgpt-conversation-this-is-an\\work\\vercel_cli_tmp\\node_modules\\.bin\\vercel.CMD';
const vercelBin = fs.existsSync(defaultVercelBin) ? defaultVercelBin : 'vercel';
const projectDir = path.join(__dirname, 'palateo_cloudflare_pages');

console.log('Deploying from:', projectDir);

const env = {
  ...process.env,
  VERCEL_ORG_ID: 'team_IDls8zTG4aRll5HgBB3VaPHH',
  VERCEL_PROJECT_ID: 'prj_FDDeOkC7enBhavqpKgKdUIy1Bg69'
};

const vercelArgs = [
  'deploy',
  '--prod',
  '--yes',
  '--scope', 'palateo'
];

const res = spawnSync(vercelBin, vercelArgs, {
  cwd: projectDir,
  env,
  shell: true,
  encoding: 'utf8',
  stdio: 'inherit'
});

console.log('Deploy exit code:', res.status);
if (res.error) console.error(res.error.message);
process.exit(res.status ?? 1);
