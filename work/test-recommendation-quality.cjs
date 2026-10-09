const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const dir = path.join(__dirname, 'palateo_cloudflare_pages');
const html = fs.readFileSync(path.join(dir, 'app', 'index.html'), 'utf8');
const script = html.match(/<script>([\s\S]*?)<\/script>/)[1].replace(/\r\n?/g, '\n');

const nodes = new Map();
const node = id => {
  if (!nodes.has(id)) nodes.set(id, { innerHTML: '', classList: { add(){}, remove(){}, toggle(){} }, setAttribute(){}, removeAttribute(){}, focus(){}, remove(){} });
  return nodes.get(id);
};

const context = vm.createContext({
  console, URL, setTimeout: () => 0, clearTimeout(){},
  window: { scrollTo(){} }, navigator: {}, location: { href: 'https://palateo.in/app/' },
  localStorage: { getItem: () => null, setItem(){} },
  document: { getElementById: node, querySelectorAll: () => [], addEventListener(){}, body: { insertAdjacentHTML(){} } },
  assert
});

vm.runInContext(script.replace(/initV5\(\);\s*$/, ''), context);

vm.runInContext(`
globalThis.runRecommendationQualityAudit = () => {
  const user = { id: 'audit-user', user_metadata: { palateo_legal_version: LEGAL_VERSION, palateo_privacy_consent: true } };
  useAccount(user);
  authRequired = false;
  state.onboarded = true;

  // Scenario 1: Taste fit vs Popularity
  // Vegetarian Gujarati diner on a budget (under_500)
  state.answers = {
    mood: 'quiet',
    cuisine: 'Gujarati',
    diet: 'veg',
    budget: 'under_500',
    spice: 'mild',
    occasion: 'family',
    priority: 'value',
    distance: 'any'
  };

  const highRatedMismatch = {
    id: 'test-luxury-italian',
    name: 'Luxury Italian',
    city: 'Ahmedabad',
    c: ['Italian'],
    t: ['Italian', 'Premium'],
    a: ['lively'],
    o: ['party'],
    p: '2000_plus',
    s: 'hot',
    dietaryOptions: ['nonveg'],
    rating: 4.9,
    review_count: 5000
  };

  const humbleTasteFit = {
    id: 'test-modest-gujarati',
    name: 'Modest Gujarati Thali',
    city: 'Ahmedabad',
    c: ['Gujarati'],
    t: ['Gujarati', 'Thali'],
    a: ['quiet'],
    o: ['family'],
    p: 'under_500',
    s: 'mild',
    dietaryOptions: ['vegetarian'],
    rating: 4.2,
    review_count: 85
  };

  state.feedback = {};
  dbCatalog = [highRatedMismatch, humbleTasteFit];
  rebuildLearning();

  const fitScore = rec(humbleTasteFit).score;
  const mismatchScore = rec(highRatedMismatch).score;

  assert.ok(fitScore > 80, 'Taste fit must score high (>80), got: ' + fitScore);
  assert.ok(mismatchScore < 45, 'High-rated mismatch must score low (<45), got: ' + mismatchScore);
  assert.ok(fitScore > mismatchScore + 35, 'Personalized fit must significantly outperform popularity alone');

  // Scenario 2: Single like cannot erase severe dietary conflict
  learn(highRatedMismatch, 'like');
  const likedMismatchScore = rec(highRatedMismatch).score;
  assert.ok(likedMismatchScore < 50, 'Single like must not make a dietary conflict place acceptable (got ' + likedMismatchScore + ')');
  assert.equal(likedMismatchScore, Math.min(35,mismatchScore + 7), 'Dietary conflict remains capped even after a like');

  // Scenario 3: Undo restores baseline exactly
  learn(highRatedMismatch, null);
  assert.equal(rec(highRatedMismatch).score, mismatchScore, 'Undo must return score exactly to baseline');

  // Scenario 4: Dislike significantly lowers score
  learn(humbleTasteFit, 'dislike');
  const dislikedFitScore = rec(humbleTasteFit).score;
  assert.equal(dislikedFitScore, fitScore - 18, 'Pass applies bounded negative reinforcement (-18)');
  learn(humbleTasteFit, null);
  assert.equal(rec(humbleTasteFit).score, fitScore, 'Undo pass restores baseline');

  // Scenario 5: Multiple calls to rebuildLearning() do not duplicate signals
  learn(humbleTasteFit, 'like');
  const signalCountBefore = { ...state.ai.signals };
  rebuildLearning();
  assert.deepEqual(state.ai.signals, signalCountBefore, 'rebuildLearning must be idempotent');

  // Scenario 6: Test across real curated additions in Ahmedabad and Vadodara
  for (const venue of curatedAdditions) {
    const v = normalizeDbRestaurant(venue);
    const score = rec(v).score;
    assert.ok(Number.isFinite(score), 'Score must be finite for ' + v.name);
    assert.ok(score >= 1 && score <= 99, 'Score must be within 1..99 bounds for ' + v.name);
  }

  console.log('PASS: Recommendation quality evaluation (taste fit vs popularity, conflict resilience, feedback symmetry, signal idempotency)');
};
`, context);

context.runRecommendationQualityAudit();
