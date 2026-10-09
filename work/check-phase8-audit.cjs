const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');

const dir = path.join(__dirname, 'palateo_cloudflare_pages');
const html = fs.readFileSync(path.join(dir, 'app', 'index.html'), 'utf8');
const css = fs.readFileSync(path.join(dir, 'app', 'theme.css'), 'utf8');
const script = html.match(/<script>([\s\S]*?)<\/script>/)[1].replace(/\r\n?/g, '\n');

// 1. Production Security & Hygiene Audit
assert.doesNotMatch(html, /service_role/i, 'Client HTML must never expose Supabase service_role keys');
assert.doesNotMatch(html, /supabase_secret/i, 'Client HTML must not expose secret API credentials');
assert.match(html, /data-action="open-place"/, 'Cards must use declarative event delegation');
assert.match(css, /env\(safe-area-inset-bottom\)/, 'Theme must support iOS safe-area-insets');

const nodes = new Map();
const node = id => {
  if (!nodes.has(id)) nodes.set(id, {
    innerHTML: '',
    textContent: '',
    style: {},
    classList: {
      classes: new Set(),
      add(c) { this.classes.add(c); },
      remove(c) { this.classes.delete(c); },
      toggle(c, force) {
        if (force === undefined) {
          if (this.classes.has(c)) this.classes.delete(c);
          else this.classes.add(c);
        } else if (force) this.classes.add(c);
        else this.classes.delete(c);
      },
      contains(c) { return this.classes.has(c); }
    },
    setAttribute() {},
    removeAttribute() {},
    focus() {},
    remove() {},
    scrollIntoView() {},
    getBoundingClientRect() { return { left: 100, width: 300 }; }
  });
  return nodes.get(id);
};

const context = vm.createContext({
  console,
  URL,
  setTimeout: fn => { if (typeof fn === 'function') fn(); return 0; },
  clearTimeout() {},
  window: { scrollTo() {} },
  navigator: {},
  location: { href: 'https://palateo.in/app/' },
  localStorage: { getItem: () => null, setItem() {} },
  document: {
    getElementById: node,
    querySelector: () => ({ style: {}, focus() {}, scrollIntoView() {} }),
    querySelectorAll: () => [],
    addEventListener() {},
    body: { insertAdjacentHTML() {} }
  },
  assert,
  process
});

vm.runInContext(script.replace(/initV5\(\);\s*$/, ''), context);

vm.runInContext(`
(async () => {
  const user = id => ({ id, user_metadata: { palateo_legal_version: LEGAL_VERSION, palateo_privacy_consent: true } });

  // Journey 1: New User Onboarding -> Taste Genome -> Palate Map -> Restaurant Details -> Save
  useAccount(user('e2e-tester'));
  authRequired = false;
  state.answers = {
    mood: 'quiet',
    cuisine: 'Gujarati',
    diet: 'veg',
    budget: '500_1000',
    spice: 'hot',
    occasion: 'family',
    priority: 'food',
    distance: 'any'
  };
  state.onboarded = true;
  await finishV5();

  // Palate Map view verification
  homeView = 'map';
  home();
  const homeHtml = document.getElementById('root').innerHTML;
  assert.match(homeHtml, /zestMapContainer/, 'Palate Map container must be rendered');
  assert.match(homeHtml, /zestMapStage/, 'Map stage must be active');
  assert.match(homeHtml, /zestMapCarousel/, 'Synchronized carousel must be active');

  // Restaurant card inspection
  const venues = ranked();
  assert.ok(venues.length > 0, 'Must have ranked recommendations');
  const topVenue = venues[0];
  const cardHtml = card(topVenue);
  assert.match(cardHtml, /cardHeroContainer/, 'Card must have photo container');
  assert.match(cardHtml, /cardMatchBadge/, 'Card must have match badge');
  assert.match(cardHtml, /cardBestDishes/, 'Card must feature Must Try dishes');

  // Open Details Screen
  detailRestaurantId = topVenue.id;
  place();
  const placeHtml = document.getElementById('root').innerHTML;
  assert.match(placeHtml, /placeHero/, 'Details screen must have hero section');
  assert.match(placeHtml, /placeBreakdown/, 'Details screen must have match breakdown');
  assert.match(placeHtml, /placeReviewsSummary/, 'Details screen must feature review insights');
  assert.match(placeHtml, /placeSignatureDishes/, 'Details screen must feature Must Try dishes');
  assert.match(placeHtml, /placeStickyActions/, 'Details screen must feature sticky action bar');

  // Save to Shortlist
  await saveV5(topVenue.id);
  assert.ok(state.saves.includes(topVenue.id), 'Place saved to shortlist');

  // Journey 2: 13 Indian Metro City Switching
  const metros = ['Ahmedabad', 'Mumbai', 'Delhi NCR', 'Bengaluru', 'Hyderabad', 'Chennai', 'Kolkata', 'Pune', 'Jaipur', 'Kochi', 'Goa', 'Chandigarh', 'Vadodara'];
  for (const m of metros) {
    selectedCity = m;
    const citySvg = renderZestMapSvg(venues, m, null);
    assert.match(citySvg, /zestMapSvg/, 'Map SVG renders for ' + m);
  }

  // Journey 3: Edge Case Verification
  // Missing coordinates
  const nullCoords = hasCoordinates({ latitude: null, longitude: null });
  assert.equal(nullCoords, false, 'Null coordinates do not map');
  
  // Empty query in discover
  drawDiscover('xyznotfoundanywhere123');
  assert.match(document.getElementById('list').innerHTML, /No places found/, 'Empty query produces clean empty state');

  console.log('PASS: End-to-end user journeys, 13-metro city coverage, safe area insets, security hygiene, and edge case resilience');
})().catch(err => {
  console.error(err);
  process.exit(1);
});
`, context);
