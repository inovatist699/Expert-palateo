const https = require('https');
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const htmlPath = path.join(__dirname, 'palateo_cloudflare_pages', 'app', 'index.html');
const cachePath = path.join(__dirname, 'google_photos_cache.json');

let cache = {};
if (fs.existsSync(cachePath)) {
  try { cache = JSON.parse(fs.readFileSync(cachePath, 'utf8')); } catch (e) {}
}

function saveCache() {
  fs.writeFileSync(cachePath, JSON.stringify(cache, null, 2), 'utf8');
}

function get(url) {
  return new Promise((resolve, reject) => {
    https.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': '*/*'
      }
    }, res => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return get(res.headers.location).then(resolve, reject);
      }
      let b = '';
      res.on('data', c => b += c);
      res.on('end', () => resolve(b));
    }).on('error', reject);
  });
}

function verifyImage(url) {
  return new Promise(resolve => {
    if (!url) return resolve(false);
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, res => {
      resolve(res.statusCode === 200 && (res.headers['content-type'] || '').includes('image'));
    }).on('error', () => resolve(false));
  });
}

async function fetchGooglePhotoForVenue(name, area, city, lat, lng) {
  const cacheKey = `${name}_${city}`.toLowerCase();
  if (cache[cacheKey]) {
    return cache[cacheKey];
  }

  const queries = [
    `${name} ${area || ''} ${city}`,
    `${name} ${city}`,
    name
  ];

  for (const q of queries) {
    try {
      const searchUrl = `https://www.google.com/search?tbm=map&authuser=0&hl=en&gl=in&q=${encodeURIComponent(q.trim())}`;
      const searchBody = await get(searchUrl);

      const fidMatch = searchBody.match(/"(0x[0-9a-f]+:0x[0-9a-f]+)"/);
      if (!fidMatch) continue;
      const fid = fidMatch[1];

      const entityUrl = `https://www.google.com/earth/rpc/entity?lat=${lat || 23.0}&lng=${lng || 72.5}&fid=${fid}&q=${encodeURIComponent(name)}`;
      const entityBody = await get(entityUrl);

      const imgMatch = entityBody.match(/https:\/\/[^"'\s<>]+\.googleusercontent\.com\/[^"'\s<>]+/);
      if (imgMatch) {
        const photoUrl = imgMatch[0].replace(/=w\d+-h\d+-k-no.*/, '=w800-h500-k-no');
        const ok = await verifyImage(photoUrl);
        if (ok) {
          cache[cacheKey] = photoUrl;
          saveCache();
          return photoUrl;
        }
      }
    } catch (e) {
      // try next query
    }
  }

  return null;
}

async function mapPool(items, limit, fn) {
  const results = new Array(items.length);
  let index = 0;
  async function worker() {
    while (index < items.length) {
      const i = index++;
      results[i] = await fn(items[i], i);
    }
  }
  const workers = Array.from({ length: Math.min(limit, items.length) }, () => worker());
  await Promise.all(workers);
  return results;
}

async function main() {
  let html = fs.readFileSync(htmlPath, 'utf8');

  function extractArray(arrayName) {
    const match = html.match(new RegExp(`const ${arrayName}=\\[([\\s\\S]*?)\\];`));
    if (!match) return [];
    const sandbox = {};
    vm.runInNewContext(`res = [${match[1]}];`, sandbox);
    return sandbox.res;
  }

  const catalog = extractArray('catalog');
  const vadodaraCatalog = extractArray('vadodaraCatalog');
  const curatedAdditions = extractArray('curatedAdditions');

  console.log(`Starting Google photo fetch for ${catalog.length + vadodaraCatalog.length + curatedAdditions.length} venues with concurrency 4...`);

  let fetched = 0;

  await mapPool(catalog, 4, async (v, i) => {
    const photo = await fetchGooglePhotoForVenue(v.name, v.area, v.city || 'Ahmedabad', v.latitude, v.longitude);
    if (photo) {
      v.photo = photo;
      fetched++;
      console.log(`[${i+1}/${catalog.length}] ${v.name} (Ahmedabad): GOOGLE PHOTO OK`);
    } else {
      console.log(`[${i+1}/${catalog.length}] ${v.name} (Ahmedabad): FALLBACK`);
    }
  });

  await mapPool(vadodaraCatalog, 4, async (v, i) => {
    const photo = await fetchGooglePhotoForVenue(v.name, v.area, 'Vadodara', v.latitude, v.longitude);
    if (photo) {
      v.photo = photo;
      fetched++;
      console.log(`[${i+1}/${vadodaraCatalog.length}] ${v.name} (Vadodara): GOOGLE PHOTO OK`);
    } else {
      console.log(`[${i+1}/${vadodaraCatalog.length}] ${v.name} (Vadodara): FALLBACK`);
    }
  });

  await mapPool(curatedAdditions, 4, async (v, i) => {
    const photo = await fetchGooglePhotoForVenue(v.name, v.area, v.city, v.latitude, v.longitude);
    if (photo) {
      v.photo_url = photo;
      fetched++;
      console.log(`[${i+1}/${curatedAdditions.length}] ${v.name} (${v.city}): GOOGLE PHOTO OK`);
    } else {
      console.log(`[${i+1}/${curatedAdditions.length}] ${v.name} (${v.city}): FALLBACK`);
    }
  });

  console.log(`\nDone! Total Google Photos retrieved: ${fetched} / ${catalog.length + vadodaraCatalog.length + curatedAdditions.length}`);
  saveCache();

  // Now update html
  const catalogLines = catalog.map(r => JSON.stringify(r)).map(s => {
    // format as readable object
    return s.replace(/"([a-zA-Z0-9_]+)":/g, '$1:');
  });

  // Let's do surgical replacement of photo fields for each venue in catalog and vadodaraCatalog
  // For each venue in catalog where we found a Google photo:
  for (const v of catalog) {
    if (v.photo && v.photo.includes('googleusercontent.com')) {
      const regex = new RegExp(`(\\{id:'${v.id}',[\\s\\S]*?photo:)(?:'[^']*'|"[^"]*")`);
      html = html.replace(regex, `$1'${v.photo}'`);
    }
  }

  for (const v of vadodaraCatalog) {
    if (v.photo && v.photo.includes('googleusercontent.com')) {
      const regex = new RegExp(`(\\{id:'${v.id}',[\\s\\S]*?photo:)(?:'[^']*'|"[^"]*")`);
      html = html.replace(regex, `$1'${v.photo}'`);
    }
  }

  for (const v of curatedAdditions) {
    if (v.photo_url && v.photo_url.includes('googleusercontent.com')) {
      const regex = new RegExp(`(\\{"external_provider":"palateo-curated","external_place_id":"${v.external_place_id}",[\\s\\S]*?"photo_url":)(?:null|"[^"]*")`);
      html = html.replace(regex, `$1"${v.photo_url}"`);
    }
  }

  fs.writeFileSync(htmlPath, html, 'utf8');
  console.log('Successfully updated work/palateo_cloudflare_pages/app/index.html with Google photos!');
}

main().catch(console.error);
