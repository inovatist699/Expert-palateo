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
    budget: '500_1000',
    spice: 'medium',
    occasion: 'family',
    priority: 'food',
    distance: 'any'
  });
  useAccount(user('review-tester'));
  authRequired = false;
  state.answers = answers();
  state.onboarded = true;
  await finishV5();

  const venues = ranked();
  assert.ok(venues.length > 0, 'Must have ranked venues available');
  const richVenue = venues.find(v => v.review_insights && v.review_insights.length > 0) || venues[0];

  // 1. Review Summary Component Rendering
  const reviewHtml = renderReviewInsights(richVenue);
  assert.match(reviewHtml, /class="placeReviewsSummary"/, 'Summary container must render');
  assert.match(reviewHtml, /Google Review Insights/, 'Must feature Google Review Insights title');
  assert.match(reviewHtml, /class="verifiedReviewsBadge"/, 'Must feature verified reviews count badge');
  assert.match(reviewHtml, /class="reviewRatingOverview"/, 'Must render rating overview grid');
  assert.match(reviewHtml, /class="ratingBigNumber"/, 'Must display big numeric star score');
  assert.match(reviewHtml, /class="ratingBarsList"/, 'Must render 5-star distribution bar graph');
  assert.match(reviewHtml, /5★/, 'Must include 5-star row');
  assert.match(reviewHtml, /1★/, 'Must include 1-star row');

  // 2. Sentiment Breakdown
  assert.match(reviewHtml, /class="sentimentPill positive"/, 'Must include positive sentiment pill');
  assert.match(reviewHtml, /class="sentimentPill mixed"/, 'Must include mixed sentiment pill');
  assert.match(reviewHtml, /class="sentimentPill critical"/, 'Must include critical sentiment pill');

  // 3. Key Themes
  assert.match(reviewHtml, /class="reviewThemesCluster"/, 'Must render key review themes cluster');
  assert.match(reviewHtml, /class="themeTag"/, 'Must render bite-sized theme tags');

  // 4. Dish Mentions in Reviews
  assert.match(reviewHtml, /class="dishMentionsSection"/, 'Must render dish mentions section');
  assert.match(reviewHtml, /class="dishMentionItem"/, 'Must render individual dish mention items');
  assert.match(reviewHtml, /class="dishMentionCount"/, 'Must show mention count and loved percentage');

  // 5. Insider Tips & Watch-outs
  assert.match(reviewHtml, /class="insiderTipsCard"/, 'Must render insider tips card');
  assert.match(reviewHtml, /INSIDER DINER TIP/, 'Must label insider tip clearly');

  // 6. Graceful Degradation on Minimal Data
  const minimalVenue = {
    id: 'minimal-spot',
    name: 'Simple Chai Stall',
    city: 'Ahmedabad',
    rating: 4.1,
    review_count: 45,
    c: ['Cafe'],
    p: 'under_500'
  };
  const minimalHtml = renderReviewInsights(minimalVenue);
  assert.ok(minimalHtml.length > 0, 'Must render gracefully without crashing on minimal venue');
  assert.match(minimalHtml, /4\.1/, 'Must display available rating');
  assert.match(minimalHtml, /45 Verified Reviews/, 'Must show available review count');
  assert.match(minimalHtml, /insiderTipsCard/, 'Must provide fallback diner tip');

  // 7. Full Integration in Details Screen
  detailRestaurantId = richVenue.id;
  place();
  const screenHtml = document.getElementById('root').innerHTML;
  assert.match(screenHtml, /class="placeReviewsSummary"/, 'Place screen must include review insights section');

  console.log('PASS: Google review insights, rating distribution, sentiment breakdown, key themes, dish mentions, insider tips, and graceful degradation');
})().catch(err => {
  console.error(err);
  process.exit(1);
});
`, context);
