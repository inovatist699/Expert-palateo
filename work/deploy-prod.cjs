const { spawnSync } = require('node:child_process');
const path = require('node:path');
const fs = require('node:fs');

const appDataAuth = path.join(process.env.APPDATA || 'C:\\Users\\Aayush\\AppData\\Roaming', 'com.vercel.cli\\Data\\auth.json');
const codexAuth = 'C:\\Users\\Aayush\\Documents\\Codex\\2026-09-30\\referenced-chatgpt-conversation-this-is-an\\work\\.vercel-cli-profile\\auth\\auth.json';

// Keep auth profiles in sync
if (fs.existsSync(appDataAuth) && fs.existsSync(path.dirname(codexAuth))) {
  try { fs.copyFileSync(appDataAuth, codexAuth); } catch (e) {}
} else if (fs.existsSync(codexAuth) && fs.existsSync(path.dirname(appDataAuth))) {
  try { fs.copyFileSync(codexAuth, appDataAuth); } catch (e) {}
}

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
if (process.env.VERCEL_TOKEN) {
  vercelArgs.push('--token', process.env.VERCEL_TOKEN);
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
