const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');

const dir = path.join(__dirname, 'palateo_cloudflare_pages');
const html = fs.readFileSync(path.join(dir, 'app', 'index.html'), 'utf8');
const script = html.match(/<script>([\s\S]*?)<\/script>/)[1].replace(/\r\n?/g, '\n');

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
  const answers = () => ({
    mood: 'quiet',
    cuisine: 'Gujarati',
    diet: 'veg',
    budget: 'under_500',
    spice: 'hot',
    occasion: 'family',
    priority: 'food',
    distance: 'any'
  });
  useAccount(user('card-tester'));
  authRequired = false;
  state.answers = answers();
  state.onboarded = true;
  await finishV5();

  const venues = ranked();
  assert.ok(venues.length > 0, 'Must have ranked venues available');
  const testVenue = venues[0];

  // 1. Restaurant Card Anatomy
  const cardHtml = card(testVenue);
  assert.match(cardHtml, /class="cardHeroContainer"/, 'Card must have TasteTrail hero container');
  assert.match(cardHtml, /class="cardMatchBadge match/, 'Card must have prominent Palate Match badge');
  assert.match(cardHtml, /class="cardSaveBtn/, 'Card must have quick bookmark/save button');
  assert.match(cardHtml, /class="cardHeroMetaRow"/, 'Card must have hero metadata row (price and vibe)');
  assert.match(cardHtml, /class="cardBodyContent"/, 'Card must have dedicated body content wrapper');
  assert.match(cardHtml, /class="cardBestDishes"/, 'Card must feature Must Try dish highlights');
  assert.match(cardHtml, /MUST TRY HIGHLIGHTS/, 'Best dishes section must be labeled Must Try');
  assert.match(cardHtml, /class="cardExploreBtn"/, 'Card must have direct primary CTA to explore details');
  assert.match(cardHtml, /data-rest-action="like"/, 'Card must retain like action');
  assert.match(cardHtml, /data-rest-action="dislike"/, 'Card must retain dislike action');
  assert.match(cardHtml, /data-rest-action="save"/, 'Card must retain save action');
  assert.match(cardHtml, /data-rest-action="visited"/, 'Card must retain visited action');
  assert.match(cardHtml, /data-rest-action="maps"/, 'Card must retain directions action');
  assert.match(cardHtml, /data-action="view-pin"/, 'Card must retain on-map action');

  // 2. Must Try Intelligence & Taste Highlights
  const sampleDishes = resolveBestDishes(testVenue);
  assert.ok(sampleDishes.length > 0, 'Venue must resolve curated or generated signature dishes');
  assert.ok(sampleDishes[0].name, 'Dish must have a valid name');
  assert.ok(sampleDishes[0].price, 'Dish must have a valid price');
  assert.ok(sampleDishes[0].dietary, 'Dish must have dietary classification');

  const hotHighlight = dishTasteHighlight({ name: 'Spicy Masala Curry', description: 'Hot chili gravy' }, testVenue);
  assert.match(hotHighlight, /spice tolerance/i, 'High spice user gets spicy match badge');

  state.answers.spice = 'mild';
  const mildHighlight = dishTasteHighlight({ name: 'Malai Kofta', description: 'Creamy sweet gravy' }, testVenue);
  assert.match(mildHighlight, /mild flavor preference/i, 'Mild user gets mild flavor badge');

  // 3. Restaurant Details View (place)
  detailRestaurantId = testVenue.id;
  place();
  const placeHtml = document.getElementById('root').innerHTML;
  assert.match(placeHtml, /class="placeHero"/, 'Details screen must have hero section');
  assert.match(placeHtml, /id="placeBack"/, 'Details screen must have back button');
  assert.match(placeHtml, /id="placeTitle"/, 'Details screen must render venue title');
  assert.match(placeHtml, /class="placeMatch"/, 'Details screen must render Palate Match score');
  assert.match(placeHtml, /class="placeQuickStats"/, 'Details screen must render quick stats');
  assert.match(placeHtml, /class="placeTagsRow"/, 'Details screen must render tags row');
  assert.match(placeHtml, /class="placeBreakdown"/, 'Details screen must render Palate AI breakdown');
  assert.match(placeHtml, /placeAiHeader/, 'Details screen must render AI breakdown header');
  assert.match(placeHtml, /class="placeAbout"/, 'Details screen must render About section');
  assert.match(placeHtml, /class="placeAddress"/, 'Details screen must render location and address');
  assert.match(placeHtml, /class="placeSignatureDishes"/, 'Details screen must render Must Try dishes');
  assert.match(placeHtml, /Signature Dishes (&|&amp;) Must Try Menu/, 'Signature dishes section must be titled');
  assert.match(placeHtml, /dishTasteHighlight/, 'Signature dishes must include taste highlights');
  assert.match(placeHtml, /class="placeDishes"/, 'Details screen must preserve live dish calibration deck');
  assert.match(placeHtml, /class="placeFeedback"/, 'Details screen must render feedback actions');
  assert.match(placeHtml, /class="placeStickyActions"/, 'Details screen must render sticky bottom action bar');

  console.log('PASS: TasteTrail card anatomy, Must Try dish intelligence, dietary badges, taste highlights, detail hero, breakdown narrative, and sticky actions');
})().catch(err => {
  console.error(err);
  process.exit(1);
});
`, context);
