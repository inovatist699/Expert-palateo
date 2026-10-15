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

  state.feedback={};rebuildLearning();
  state.answers.diet='eggetarian';
  assert.ok(hasTasteAnswers(),'Eggetarian is a valid complete quiz answer');
  assert.ok(availableCalibrationDishes().some(d=>d.diet==='egg'));
  assert.ok(availableCalibrationDishes().every(d=>d.diet!=='nonveg'));
  const eggVenue={...humbleTasteFit,id:'egg-only',dietaryOptions:['eggs']};
  const meatVenue={...humbleTasteFit,id:'meat-only',dietaryOptions:['non-vegetarian']};
  const unknownVenue={...humbleTasteFit,id:'unknown-diet',dietaryOptions:[]};
  assert.ok(rec(eggVenue).score>rec(unknownVenue).score,'Known egg options beat unknown dietary evidence');
  assert.ok(rec(meatVenue).score<=35,'Meat-only venue cannot become an Eggetarian fit');
  assert.ok(rec(unknownVenue).why.includes('Dietary options not verified'));
  learn(meatVenue,'like');assert.ok(rec(meatVenue).score<=35);learn(meatVenue,null);
  state.answers.diet='veg';
  assert.ok(availableCalibrationDishes().every(d=>d.diet==='veg'));
  assert.ok(rec(eggVenue).score<=35,'Egg-only is not vegetarian');
  state.answers.diet='any';
  assert.ok(hasTasteAnswers(),'Existing any preference remains compatible');
  assert.ok(availableCalibrationDishes().some(d=>d.diet==='nonveg'));
  assert.ok(rec(meatVenue).score>35,'All foods removes dietary restriction');
  state.answers.diet='eggetarian';
  state.dishFeedback={'butter-chicken':'love'};
  assert.equal(dishAdjustment({...meatVenue,c:['Punjabi']}),0,'Old meat feedback cannot leak into Eggetarian estimates');
  state.dishFeedback={};
  state.answers.diet='veg';
  const complete=rec(humbleTasteFit);
  const unknownSpice=rec({...humbleTasteFit,s:null});
  assert.ok(unknownSpice.score<complete.score,'Missing spice evidence must not receive the confidence of a verified match');
  assert.equal(unknownSpice.matchBreakdown.find(x=>x.label==='Spice level').factor,0);
  const unknownPrice=rec({...humbleTasteFit,p:'unknown'});
  assert.ok(unknownPrice.score<complete.score,'Missing price evidence must not inflate a match');
  assert.equal(unknownPrice.matchBreakdown.find(x=>x.label==='Price').factor,0);
  userLocation={lat:23,lon:72};
  const located={...humbleTasteFit,latitude:23.045,longitude:72};
  assert.ok(rec(located).score>=complete.score,'Adding valid GPS must not dilute taste fit');
  assert.ok(rec(located).score<=complete.score+3,'Proximity is a bounded bonus');
  userLocation=null;
  state.answers.priority='food';
  assert.ok(rec({...humbleTasteFit,rating:4.6,review_count:500}).score>rec({...humbleTasteFit,rating:5,review_count:1}).score,'Established positive reviews beat a single five-star rating at equal taste fit');
  const noReviews=rec({...humbleTasteFit,rating:4,review_count:0}).score;
  assert.equal(rec({...humbleTasteFit,rating:5,review_count:0}).score,noReviews,'Unsubstantiated ratings provide no quality bonus');
  console.log('PASS: missing-evidence confidence, GPS stability, bounded proximity and review-supported quality');
  console.log('PASS: Eggetarian/all-foods options, dietary conflicts, unknown evidence and calibration isolation');
  console.log('PASS: Recommendation quality evaluation (taste fit vs popularity, conflict resilience, feedback symmetry, signal idempotency)');
};
`, context);

context.runRecommendationQualityAudit();
