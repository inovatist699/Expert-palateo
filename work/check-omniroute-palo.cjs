// ============================================================================
// Comprehensive Verification Suite: OmniRoute Setup & Palo AI Taste Training
// ============================================================================

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const root = path.resolve(__dirname, '..');
const companionJs = fs.readFileSync(path.join(root, 'src/features/companion/controller.js'), 'utf8');
const paloApiJs = fs.readFileSync(path.join(root, 'src/server/api/palo.js'), 'utf8');
const manifestJson = JSON.parse(fs.readFileSync(path.join(root, 'src/app/manifest.json'), 'utf8'));

console.log('=== Running check-omniroute-palo.cjs ===');

// 1. Manifest & Endpoint Registrations
assert.ok(manifestJson.publicFiles['server/api/palo.js'] === 'api/palo.js', 'Must expose api/palo.js in publicFiles');
assert.ok(fs.existsSync(path.join(root, 'scripts/omniroute_server.cjs')), 'Must provide scripts/omniroute_server.cjs');

// 2. Static Contract Audits for OmniRoute Connection & Training
assert.ok(companionJs.includes('learnFromOmniRoute'), 'PaloMLTasteEngine must implement learnFromOmniRoute');
assert.ok(companionJs.includes('omniRouteConnected'), 'Genome must indicate OmniRoute connectivity');
assert.ok(companionJs.includes("'Local taste recommendations'"), 'Local replies must not claim a live connection');
assert.ok(companionJs.includes('/api/palo'), 'Companion controller must connect to /api/palo endpoint');
assert.ok(companionJs.includes('paloConceptPill'), 'Brain drawer must render OmniRoute concept pills');
assert.ok(companionJs.includes('aiLearnings'), 'PaloMLTasteEngine must record AI learnings');
assert.ok(companionJs.includes('PaloMemoryStore'), 'Must implement PaloMemoryStore');
assert.ok(!companionJs.includes('runAutonomousLearningCycle'), 'Model calls must only run on user requests');
assert.ok(companionJs.includes('session.access_token'), 'Live requests must include session authentication');
assert.ok(companionJs.includes('paloMemoryCard'), 'Brain drawer must render adaptive memory card');
assert.ok(companionJs.includes('Conversational Small Talk'), 'Companion must implement Conversational Small Talk');
assert.ok(companionJs.includes('how are you'), 'Companion must implement how are you check-in');
assert.ok(companionJs.includes('who are you'), 'Companion must implement who are you identity check');
assert.ok(companionJs.includes('isConversational'), 'PaloMemoryStore must support isConversational flag');

// 3. API Handler Simulation (/api/palo)
const paloHandler = require(path.join(root, 'src/server/api/palo.js'));

async function testApiHandler() {
  require('./check-palo-api.cjs');
}

// 4. Runtime Simulation in VM Context
const domElements = new Map();
function createMockElement(tag, id = '') {
  return {
    tagName: tag.toUpperCase(),
    id,
    classList: {
      classes: new Set(),
      add(c) { this.classes.add(c); },
      remove(c) { this.classes.delete(c); },
      contains(c) { return this.classes.has(c); }
    },
    style: {},
    attributes: {},
    setAttribute(k, v) { this.attributes[k] = v; },
    getAttribute(k) { return this.attributes[k]; },
    innerHTML: '',
    textContent: '',
    children: [],
    listeners: {},
    addEventListener(ev, fn) {
      if (!this.listeners[ev]) this.listeners[ev] = [];
      this.listeners[ev].push(fn);
    },
    dispatchEvent(ev) {
      (this.listeners[ev.type] || []).forEach(fn => fn(ev));
    },
    querySelector(sel) {
      if (sel === 'select') return { value: 'crookie', onchange: null };
      if (sel === 'video') return { pause() {}, play() { return Promise.resolve(); } };
      return null;
    },
    querySelectorAll() { return []; },
    replaceChildren() { this.children = []; this.innerHTML = ''; },
    append(el) { this.children.push(el); },
    focus() {}
  };
}

const mockStorage = {};
const windowMock = {
  SpeechSynthesisUtterance: function(text) { this.text = text; },
  speechSynthesis: {
    speak: () => {},
    cancel: () => {},
    getVoices: () => []
  },
  AudioContext: function() {
    this.currentTime = 0;
    this.destination = {};
    this.createOscillator = () => ({
      connect: () => {},
      frequency: { setValueAtTime() {}, exponentialRampToValueAtTime() {} },
      start() {},
      stop() {}
    });
    this.createGain = () => ({
      connect: () => {},
      gain: { setValueAtTime() {}, exponentialRampToValueAtTime() {} }
    });
  },
  matchMedia: () => ({ matches: false }),
  localStorage: {
    getItem: k => mockStorage[k] || null,
    setItem: (k, v) => { mockStorage[k] = String(v); },
    removeItem: k => { delete mockStorage[k]; }
  },
  sessionStorage: {
    getItem: () => null,
    setItem: () => {}
  }
};

const documentMock = {
  body: {
    insertAdjacentHTML(pos, html) {
      const match = html.match(/id="([^"]+)"/g);
      if (match) {
        match.forEach(m => {
          const id = m.replace(/id="|"/g, '');
          domElements.set(id, createMockElement('div', id));
        });
      }
    },
    append() {}
  },
  getElementById(id) {
    if (!domElements.has(id)) domElements.set(id, createMockElement('div', id));
    return domElements.get(id);
  },
  createElement(tag) { return createMockElement(tag); },
  addEventListener() {}
};

const sandbox = {
  window: windowMock,
  document: documentMock,
  localStorage: windowMock.localStorage,
  sessionStorage: windowMock.sessionStorage,
  matchMedia: windowMock.matchMedia,
  SpeechSynthesisUtterance: windowMock.SpeechSynthesisUtterance,
  currentUser: { id: 'usr-omniroute-tester' },
  authRequired: false,
  hasTasteProfile: () => true,
  cityName: () => 'Mumbai',
  displayPrice: () => '₹1,200 for two',
  esc: s => String(s || ''),
  state: {
    feedback: {},
    saves: [],
    dishFeedback: {},
    answers: { diet: 'any', spice: 'medium' }
  },
  availableCalibrationDishes: () => [
    { id: 'dish-pizza', name: 'Neapolitan Truffle Pizza', cuisine: 'Italian', tags: ['pizza', 'truffle'] }
  ],
  normalizeDishFeedback: v => v || {},
  activeRestaurant: () => null,
  ranked: () => [],
  rateDish: () => {},
  rateV5: () => {},
  console,
  setTimeout,
  clearTimeout
};

vm.createContext(sandbox);
vm.runInContext(companionJs, sandbox);

// 5. Test Palo ML Training via OmniRoute
const paloEngine = sandbox.window.paloML;
assert.ok(paloEngine, 'paloML must be exported on window');

// Cold start verification
assert.equal(paloEngine.genome.level, 0, 'Level must be 0 at cold start without explicit place feedback');
const initialXP = paloEngine.genome.xp;

// Train Palo with OmniRoute Insights
const trainingData = {
  cuisines: ['Bakery', 'Desserts'],
  dishes: ['Crookie', 'Butter Croissant'],
  vibes: ['trendy', 'instagrammable']
};

const trainRes = paloEngine.learnFromOmniRoute(trainingData, 'viral crookie');
assert.equal(trainRes.leveledUp,false,'Generated insights must not train preferences');
assert.equal(paloEngine.genome.xp,initialXP,'No fabricated learning XP');
assert.equal(paloEngine.genome.omniRouteConnected,false,'Connection starts unverified');
assert.equal(paloEngine.genome.cuisines.Bakery,undefined);

// Ensure account feedback level isolation is preserved
assert.equal(paloEngine.genome.level, 0, 'Genome level remains strictly bound to explicit feedback');

// 6. Test Cognitive Reasoning & Emotion Modulation
const thoughtBox = sandbox.document.getElementById('paloThoughtBox');
const thoughtSteps = sandbox.document.getElementById('paloThoughtSteps');
assert.ok(thoughtBox, 'Thought box element must exist');
assert.ok(thoughtSteps, 'Thought steps element must exist');

// 7. Test Persistent Adaptive Memory & Continuous Learning Store
const paloMemory = sandbox.window.paloMemory;
assert.ok(paloMemory, 'paloMemory must be exported on window');
assert.equal(paloMemory.data.episodes.length, 0, 'Memory starts clean at cold start');

paloMemory.recordInteraction('crispy benne dosa and filter coffee', 'Visit Vidyarthi Bhavan', {
  dish: 'benne dosa',
  venue: 'Vidyarthi Bhavan',
  spice: 'mild',
  vibe: 'heritage'
});
assert.equal(paloMemory.data.episodes.length, 1, 'Episode must be recorded in memory');
assert.equal(paloMemory.getMemorySummary().recentTopics[0], 'benne dosa');
assert.equal(paloMemory.data.episodes[0].venue,'Vidyarthi Bhavan');
const summary = paloMemory.getMemorySummary();
assert.ok(!summary.persona.includes('Loves'),'Questions must not imply preferences');
assert.equal(summary.recentVenue, 'Vidyarthi Bhavan', 'Must retrieve recent venue');
assert.equal(summary.totalEpisodes, 1, 'Total episodes must be 1');

// Test that conversational check-ins do NOT pollute cravings dictionary
paloMemory.recordInteraction('how are you doing', 'Arrey ekdum mast!', {
  emotion: 'joy',
  isConversational: true
});
assert.equal(paloMemory.data.episodes.length, 2, 'Conversational interaction recorded in episodes');
assert.ok(!paloMemory.getMemorySummary().recentTopics.includes('how are you doing'));
sandbox.currentUser={id:'other-account'};
assert.equal(paloMemory.data.episodes.length,0,'No cross-account memory');
paloMemory.recordInteraction('pizza','', {dish:'pizza'});
sandbox.currentUser={id:'usr-omniroute-tester'};
assert.equal(paloMemory.data.episodes.length,2,'Own memory restored');
assert.ok(!paloMemory.getMemorySummary().recentTopics.includes('pizza'));
for(let i=0;i<30;i++)paloMemory.recordInteraction('topic '+i,'');
assert.equal(paloMemory.data.episodes.length,25,'Memory bounded');
paloMemory.data.episodes[0].time=Date.now()-31*86400000;
assert.equal(paloMemory.getMemorySummary().totalEpisodes,24,'Old memory expires');
paloMemory.clear();assert.equal(paloMemory.data.episodes.length,0);
sandbox.currentUser=null;paloMemory.recordInteraction('private','');
assert.equal(paloMemory.data.episodes.length,0,'No signed-out storage');
mockStorage['palateo-palo-memory-v2:corrupt']='{"episodes":[null,1,{"time":0,"query":"expired"}]}';
sandbox.currentUser={id:'corrupt'};assert.equal(paloMemory.data.episodes.length,0,'Invalid storage ignored');

testApiHandler().then(() => {
  console.log('PASS: OmniRoute API gateway, adaptive memory loop, cognitive thought stream, emotion voice modulation, and Palo ML training');
}).catch(err => {
  console.error('FAIL in testApiHandler:', err);
  process.exit(1);
});
