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
  
  // 1. Initial State & Unauthenticated Isolation
  useAccount(null);
  assert.equal(hasTasteProfile(), false, 'Unauthenticated user has no taste profile');
  assert.equal(ranked().length, 0, 'No ranked venues without authenticated taste session');

  // 2. Complete Onboarding Flow for Pure Vegetarian Diner
  useAccount(user('pure-veg-diner'));
  authRequired = false;
  state.answers = {
    mood: 'quiet',
    cuisine: 'Gujarati',
    diet: 'veg',
    budget: 'under_500',
    spice: 'mild',
    occasion: 'family',
    priority: 'food',
    distance: 'any'
  };
  state.onboarded = false;

  let cloudUpsertPayload = null;
  supabaseClient = {
    from(table) {
      const q = {
        select() { return q; },
        eq() { return q; },
        order() { return q; },
        range() { return q; },
        maybeSingle() { return q; },
        upsert(val) { cloudUpsertPayload = val; return q; },
        update() { return q; },
        insert() { return q; },
        then(resolve) {
          return Promise.resolve({
            data: table === 'taste_profiles' ? cloudUpsertPayload : table === 'profiles' ? { id: 'pure-veg-diner' } : [],
            error: null
          }).then(resolve);
        }
      };
      return q;
    }
  };

  await finishV5();
  assert.equal(hasTasteProfile(), true, 'Profile completes after finishV5');
  assert.ok(cloudUpsertPayload, 'Cloud write must occur on finishV5');
  assert.equal(cloudUpsertPayload.cuisines.primary, 'Gujarati', 'Cloud payload retains primary cuisine');
  assert.equal(cloudUpsertPayload.priorities.dietary_preference, 'veg', 'Cloud payload retains vegetarian preference');

  // 3. Strict Dietary Enforcement
  const allVenues = ranked();
  assert.ok(allVenues.length > 0, 'Ranked places exist');

  const meatVenue = {
    id: 'test-meat-palace',
    name: 'Tandoori Meat Palace',
    city: 'Ahmedabad',
    c: ['North Indian', 'Mughlai'],
    t: ['Kebabs', 'Biryani'],
    a: ['casual'],
    o: ['friends'],
    p: '500_1000',
    s: 'hot',
    dietaryOptions: ['non-vegetarian'],
    rating: 4.8,
    review_count: 3000
  };
  dbCatalog.push(meatVenue);
  const meatRec = rec(meatVenue);
  assert.ok(meatRec.score < 40, 'Non-vegetarian venue must receive heavy conflict penalty for vegetarian user');
  assert.ok(meatRec.why.some(w => w.includes('Vegetarian options differs') || w.includes('preference')), 'Match explanation explicitly flags dietary conflict');

  // 4. Dynamic Taste Calibration & Real-time Recalculation
  const vegCafe = allVenues.find(v => v.dietaryOptions?.includes('vegetarian') || v.dietaryOptions?.includes('vegetarian_options'));
  assert.ok(vegCafe, 'Vegetarian cafe exists');
  const baseScore = rec(vegCafe).score;

  // Like increases score
  learn(vegCafe, 'like');
  const likedScore = rec(vegCafe).score;
  assert.ok(likedScore > baseScore, 'Liking venue boosts recommendation score');

  // Dislike lowers score
  learn(vegCafe, 'dislike');
  const dislikedScore = rec(vegCafe).score;
  assert.ok(dislikedScore < baseScore, 'Disliking venue heavily reduces score');

  // Undo restores exact baseline
  learn(vegCafe, null);
  assert.equal(rec(vegCafe).score, baseScore, 'Undoing feedback restores baseline score exactly');

  // 5. Shortlist Saving & Cloud Sync
  let savedWrite = false;
  supabaseClient = {
    from(table) {
      const q = {
        select() { return q; },
        eq() { return q; },
        order() { return q; },
        range() { return q; },
        maybeSingle() { return q; },
        upsert() { return q; },
        update() { return q; },
        insert() { savedWrite = true; return q; },
        delete() { return q; },
        then(resolve) { return Promise.resolve({ data: [], error: null }).then(resolve); }
      };
      return q;
    }
  };

  await saveV5(vegCafe.id);
  assert.ok(state.saves.includes(vegCafe.id), 'Saved place recorded in local state');
  await saveV5(vegCafe.id);
  assert.ok(!state.saves.includes(vegCafe.id), 'Toggling save removes place from shortlist');

  // 6. Account Isolation Verification
  useAccount(user('isolated-account'));
  assert.equal(state.saves.length, 0, 'Saves do not leak to another user');
  assert.equal(Object.keys(state.feedback).length, 0, 'Feedback does not leak to another user');

  console.log('PASS: Complete personalization pipeline, strict dietary enforcement, real-time recalculation, shortlist saves, and account isolation');
})().catch(err => {
  console.error(err);
  process.exit(1);
});
`, context);
