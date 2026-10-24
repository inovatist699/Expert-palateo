(async () => {
const fs = require('node:fs');
const assert = require('node:assert/strict');
const root = __dirname + '/';
const steps = fs.readFileSync('C:/Users/Aayush/.gemini/antigravity/brain/cbd7810d-efa5-413e-9986-703ebd7c094d/.system_generated/logs/transcript.jsonl', 'utf8').trim().split('\n').map(line => JSON.parse(line));
const prior = fs.existsSync(root + 'resolved-links.json') ? JSON.parse(fs.readFileSync(root + 'resolved-links.json', 'utf8')) : [];
const known = new Map(prior.map(r => [r.redirect, r]));
const links = [...new Set(steps.filter(s => s.type === 'GENERIC').flatMap(s => [...(s.content || '').matchAll(/https:\/\/vertexaisearch\.cloud\.google\.com\/grounding-api-redirect\/[^\s)]+/g)].map(m => m[0])))].filter(url => !known.has(url));
for (let offset = 0; offset < links.length; offset += 6) {
  const batch = await Promise.all(links.slice(offset, offset + 6).map(async redirect => {
    assert.equal(new URL(redirect).hostname, 'vertexaisearch.cloud.google.com');
    try {
      const response = await fetch(redirect, { signal: AbortSignal.timeout(15000) });
      const record = { redirect, url: response.url, status: response.status };
      await response.body?.cancel();
      return record;
    } catch (e) { return { redirect, error: e.message }; }
  }));
  for (const row of batch) known.set(row.redirect, row);
  fs.writeFileSync(root + 'resolved-links.json', JSON.stringify([...known.values()], null, 2));
}
console.log(JSON.stringify({ discovered: links.length, total: known.size, resolved: [...known.values()].filter(r => r.url && r.url !== r.redirect).length }));
let query = '';
const index = [];
for (const step of steps) {
  const call = step.tool_calls?.find(t => t.name === 'search_web');
  if (call) query = call.args.query;
  if (step.type === 'GENERIC' && step.content?.includes('returned the following summary:')) {
    index.push({ query, sources: [...step.content.matchAll(/https:\/\/vertexaisearch\.cloud\.google\.com\/grounding-api-redirect\/[^\s)]+/g)].map(m => known.get(m[0])?.url).filter(Boolean) });
  }
}
fs.writeFileSync(root + 'research-index.json', JSON.stringify(index, null, 2));
})().catch(error => { console.error(error.message); process.exitCode = 1; });
