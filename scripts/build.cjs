const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const vm = require('node:vm');
const assert = require('node:assert/strict');

const root = path.resolve(__dirname, '..');
const source = path.join(root, 'src');
const output = path.join(root, 'work/palateo_cloudflare_pages');
const manifest = JSON.parse(fs.readFileSync(path.join(source, 'app/manifest.json'), 'utf8'));
function inside(directory, relative) {
 assert.ok(typeof relative === 'string' && !path.isAbsolute(relative), 'Expected a relative path');
 const resolved = path.resolve(directory, relative);
 assert.ok(resolved.startsWith(directory + path.sep), 'Path must stay inside its directory');
 assert.ok(!relative.split(/[\\/]/).some(part => part.startsWith('.')), 'Do not bundle private configuration');
 return resolved;
}
function read(relative) { return fs.readFileSync(inside(source, relative), 'utf8'); }
function write(relative, content) {
 const destination = inside(output, relative);
 fs.mkdirSync(path.dirname(destination), {recursive:true});
 // Avoid changing timestamps and triggering reloads for an unchanged build.
 if (fs.existsSync(destination) && fs.readFileSync(destination).equals(Buffer.from(content))) return;
 fs.writeFileSync(destination, content);
}
assert.equal(new Set(manifest.scripts).size, manifest.scripts.length, 'Duplicate script fragments');
const script = manifest.scripts.map(read).join('');
new vm.Script(script, {filename:'palateo-app.js'});
let shell = read('app/shell.html');
assert.equal((shell.match(/\{\{app-script\}\}/g) || []).length, 1, 'Expected one application script slot');
assert.equal((shell.match(/\{\{style:/g) || []).length, manifest.styles.length, 'Styles must have matching slots');
for (const style of manifest.styles) {
 const slot = '{{style:' + style + '}}';
 assert.equal(shell.split(slot).length, 2, 'Expected exactly one slot for ' + style);
 shell = shell.replace(slot, () => read(style));
}
shell = shell.replace('{{app-script}}', () => script);
assert.ok(!/\{\{(?:app-script|style:)/.test(shell), 'Unresolved build slot');
assert.ok(!/<\/script>/i.test(script), 'Script content must not close its HTML element');

// Browsers normalize CRLF before applying the inline-script CSP hash.
const hash = 'sha256-' + crypto.createHash('sha256').update(script.replace(/\r\n?/g, '\n')).digest('base64');
const config = JSON.parse(fs.readFileSync(path.join(root, 'config/vercel.json'), 'utf8'));
const csp = config.headers[0].headers.find(header => header.key === 'Content-Security-Policy');
assert.ok(csp && /sha256-[A-Za-z0-9+/=]+/.test(csp.value), 'Missing app CSP hash');
csp.value = csp.value.replace(/sha256-[A-Za-z0-9+/=]+/, hash);
const destinations = new Set(['app/index.html', 'vercel.json']);
const publicFiles = Object.entries(manifest.publicFiles).map(([from, to]) => {
 assert.ok(!destinations.has(to), 'Duplicate build destination: ' + to);
 destinations.add(to);
 inside(output, to);
 return [to, fs.readFileSync(inside(source, from))];
});
write('app/index.html', shell);
for (const [destination, content] of publicFiles) write(destination, content);
write('vercel.json', JSON.stringify(config, null, 2) + '\n');
console.log('Built Palateo: ' + manifest.scripts.length + ' script fragments, ' + manifest.styles.length + ' styles; CSP updated.');
