const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const {spawnSync} = require('node:child_process');

const root = path.resolve(__dirname, '..');
const output = path.join(root, 'work/palateo_cloudflare_pages');
const manifest = require('../src/app/manifest.json');
const files = new Set(['app/index.html', ...Object.values(manifest.publicFiles)]);
const types = {'.html':'text/html', '.css':'text/css', '.js':'text/javascript', '.svg':'image/svg+xml', '.png':'image/png', '.jpg':'image/jpeg', '.webm':'video/webm', '.json':'application/json', '.txt':'text/plain', '.xml':'application/xml'};

function build() {
  const result = spawnSync(process.execPath, [path.join(__dirname, 'build.cjs')], {stdio:'inherit'});
  if (result.status !== 0) throw new Error('Preview build failed');
}

function createServer() {
  return http.createServer((req, res) => {
    res.setHeader('Cache-Control', 'no-store');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    if (!['GET', 'HEAD'].includes(req.method)) {
      res.writeHead(405, {'Allow':'GET, HEAD'}).end();
      return;
    }
    let file;
    try {
      const pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
      file = pathname.slice(1) + (pathname.endsWith('/') ? 'index.html' : '');
    } catch {
      res.writeHead(400).end();
      return;
    }
    if (file.startsWith('api/') || !files.has(file)) {
      res.writeHead(404).end();
      return;
    }
    try {
      // Rebuild HTML requests so source edits appear on preview reload in any OS.
      if (file.endsWith('.html')) build();
      const body = fs.readFileSync(path.join(output, file));
      res.writeHead(200, {'Content-Type':(types[path.extname(file)] || 'application/octet-stream') + '; charset=utf-8'});
      res.end(req.method === 'HEAD' ? undefined : body);
    } catch (error) {
      console.error(error.message);
      res.writeHead(500).end('Preview build or file read failed');
    }
  });
}

if (require.main === module) {
  const port = Number(process.env.PORT || 3000);
  if (!Number.isInteger(port) || port < 1 || port > 65535) throw new Error('PORT must be between 1 and 65535');
  build();
  createServer().listen(port, '0.0.0.0', () => console.log(`Palateo preview: http://localhost:${port}/app/ (waitlist: /)`));
}
module.exports = {createServer, build};
