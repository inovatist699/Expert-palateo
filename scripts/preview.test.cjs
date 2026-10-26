const {test} = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const {createServer, build} = require('./preview.cjs');

test('preview serves the canonical build and excludes private/server files', async () => {
  build();
  const server = createServer();
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  const base = `http://127.0.0.1:${server.address().port}`;
  try {
    for (const route of ['/', '/app/', '/app/studio.css']) {
      const response = await fetch(base + route);
      assert.equal(response.status, 200, route);
      const file = route.slice(1) + (route.endsWith('/') ? 'index.html' : '');
      assert.equal(await response.text(), fs.readFileSync(path.join(__dirname, '../work/palateo_cloudflare_pages', file), 'utf8'));
    }
    for (const route of ['/.env', '/package.json', '/src/app/shell.html', '/api/waitlist', '/vercel.json', '/%2e%2e%2fpackage.json']) {
      assert.equal((await fetch(base + route)).status, 404, route);
    }
    assert.equal((await fetch(base + '/%ZZ')).status, 400);
    assert.match((await fetch(base + '/app/intro.webm', {method:'HEAD'})).headers.get('content-type'), /^video\/webm/);
    assert.equal((await fetch(base + '/app/', {method:'POST'})).status, 405);
    assert.equal(await (await fetch(base + '/app/', {method:'HEAD'})).text(), '');
  } finally {
    await new Promise(resolve => server.close(resolve));
  }
});
