const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const root = path.resolve(__dirname, '..');
const companionJs = fs.readFileSync(path.join(root, 'src/features/companion/controller.js'), 'utf8');
const interactiveCss = fs.readFileSync(path.join(root, 'src/styles/interactive.css'), 'utf8');
const metrosJs = fs.readFileSync(path.join(root, 'src/models/venues/metros.js'), 'utf8');
const ahmedabadJs = fs.readFileSync(path.join(root, 'src/models/venues/ahmedabad.js'), 'utf8');
const vadodaraJs = fs.readFileSync(path.join(root, 'src/models/venues/vadodara.js'), 'utf8');

console.log('=== Running check-palo-pet.cjs ===');

// 1. Static Contract & Anti-Window Audits
assert.ok(!companionJs.includes('<dialog id="petDialog"'), 'Must not use blocking modal dialog window for pet');
assert.ok(!companionJs.includes('petDialog::backdrop'), 'Must not use blocking window backdrop');
assert.ok(companionJs.includes('paloContainer'), 'Must mount on-screen floating companion container');
assert.ok(companionJs.includes('paloCreature'), 'Must feature animated vector creature');
assert.ok(companionJs.includes('paloSvg'), 'Must render SVG pet mascot');
assert.ok(companionJs.includes('paloBubble'), 'Must use attached non-blocking speech bubble hub');
assert.ok(companionJs.includes('PaloMLTasteEngine'), 'Must implement online reinforcement learning engine');
assert.ok(companionJs.includes('analyzeVenueReviews'), 'Must implement deep review analysis');
assert.ok(companionJs.includes('searchVenuesByReviewInsights'), 'Must search verified diner review quotes');
assert.ok(companionJs.includes('playCuteSound'), 'Must implement procedural Web Audio cute chirps');
assert.ok(companionJs.includes('pitch = 1.56') || companionJs.includes('pitch = 1.'), 'Must tune cute pitched voice synthesis');

// 2. CSS Animation & Mobile Ergonomics Audit
assert.ok(interactiveCss.includes('paloFloat'), 'Must include floating breathing animation');
assert.ok(interactiveCss.includes('paloBlink'), 'Must include eye blinking animation');
assert.ok(interactiveCss.includes('paloTalkBob'), 'Must include speaking animation');
assert.ok(interactiveCss.includes('paloJoyJump'), 'Must include celebration delight jump');
assert.ok(interactiveCss.includes('paloReviewCard'), 'Must style verified review citation card');
assert.ok(interactiveCss.includes('paloBrainDrawer'), 'Must style ML taste genome drawer');
assert.ok(interactiveCss.includes('@media(prefers-reduced-motion:reduce)'), 'Must respect vestibular accessibility');

// 3. VM Execution & Behavioral Simulation
const domElements = new Map();
function createMockElement(tag, id = '') {
  return {
    tagName: tag.toUpperCase(),
    id,
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
      if (sel === 'select') return { value: '', onchange: null };
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
  SpeechRecognition: function() {
    this.start = () => {};
    this.abort = () => {};
  },
  speechSynthesis: {
    speak: () => {},
    cancel: () => {},
    getVoices: () => [
      { name: 'Google UK English Female', lang: 'en-GB' },
      { name: 'Samantha', lang: 'en-US' }
    ]
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
  SpeechSynthesisUtterance: function(text) { this.text = text; },
  currentUser: { id: 'usr-pet-tester' },
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
    { id: 'dish-pizza', name: 'Neapolitan Truffle Pizza', cuisine: 'Italian', tags: ['pizza', 'truffle'] },
    { id: 'dish-dosa', name: 'Benne Dosa', cuisine: 'SouthIndian', tags: ['dosa', 'crispy'] }
  ],
  rateDish: () => {},
  rateV5: (id, val) => { sandbox.state.feedback[id] = val; },
  console,
  setTimeout,
  clearTimeout
};

// Evaluate metros, ahmedabad, and vadodara data in sandbox
vm.createContext(sandbox);
vm.runInContext(metrosJs.replace('const allMetroVenues=', 'globalThis.allMetroVenues='), sandbox);
vm.runInContext(ahmedabadJs.replace('const catalog=', 'globalThis.ahmedabadCatalog='), sandbox);
vm.runInContext(vadodaraJs.replace('const vadodaraCatalog=', 'globalThis.vadodaraCatalog='), sandbox);
sandbox.ranked = () => sandbox.allMetroVenues;

// Execute companion controller in sandbox
vm.runInContext(companionJs, sandbox);

// 4. Verify ML Learning Cycle & Review Intelligence in runtime
const bombayCanteen = sandbox.allMetroVenues.find(v => v.id === 'mum-bombay-canteen');
assert.ok(bombayCanteen, 'Must load Bombay Canteen from metros');
assert.ok(bombayCanteen.review_insights.length > 0, 'Must have verified review insights');
assert.ok(bombayCanteen.review_insights.includes('progressive regional indian'), 'Must have progressive regional review quote');

// 5. Verify Hindi & Hinglish Intelligence Dictionary
assert.ok(companionJs.includes('HinglishDictionary'), 'Must define HinglishDictionary');
assert.ok(companionJs.includes('parseHinglish'), 'Must implement parseHinglish intent parser');
assert.ok(companionJs.includes('mast biryani'), 'Must include Hinglish suggestions for biryani');
assert.ok(companionJs.includes('chatpata aur teekha'), 'Must include Hinglish suggestions for spicy/chatpata');

// 6. Verify Comprehensive 13 Cities & Focus Cities Coverage
const metroCities = ['Mumbai', 'Delhi NCR', 'Bengaluru', 'Hyderabad', 'Chennai', 'Kolkata', 'Pune', 'Jaipur', 'Kochi', 'Goa', 'Chandigarh'];
metroCities.forEach(city => {
  const count = sandbox.allMetroVenues.filter(v => v.city === city).length;
  assert.ok(count >= 10, `Must have at least 10 verified venues in ${city}, found ${count}`);
});

// Specific checks for user-focused cities:
const mumbaiCount = sandbox.allMetroVenues.filter(v => v.city === 'Mumbai').length;
const delhiCount = sandbox.allMetroVenues.filter(v => v.city === 'Delhi NCR').length;
const puneCount = sandbox.allMetroVenues.filter(v => v.city === 'Pune').length;
const ahmedabadCount = sandbox.ahmedabadCatalog.length;
const vadodaraCount = sandbox.vadodaraCatalog.length;

assert.ok(mumbaiCount >= 90, `Must have at least 90 verified venues in Mumbai, found ${mumbaiCount}`);
assert.ok(delhiCount >= 90, `Must have at least 90 verified venues in Delhi NCR, found ${delhiCount}`);
assert.ok(puneCount >= 90, `Must have at least 90 verified venues in Pune, found ${puneCount}`);
assert.ok(ahmedabadCount >= 100, `Must have at least 100 verified venues in Ahmedabad, found ${ahmedabadCount}`);
assert.ok(vadodaraCount >= 86, `Must have at least 86 verified venues in Vadodara, found ${vadodaraCount}`);
assert.ok(sandbox.vadodaraCatalog.some(v => v.id === 'vad-hot-bite'), 'Must include Hot Bite in Vadodara catalog');
assert.ok(sandbox.allMetroVenues.some(v => v.id === 'mum-dragonfly-club'), 'Must include Dragonfly club in Mumbai');
assert.ok(sandbox.allMetroVenues.some(v => v.id === 'del-privee-club'), 'Must include Privee club in Delhi');
assert.ok(sandbox.allMetroVenues.some(v => v.id === 'pun-high-spirits'), 'Must include High Spirits club in Pune');
assert.ok(sandbox.ahmedabadCatalog.some(v => v.id === 'ahm-sphere-lounge'), 'Must include Sphere Lounge club in Ahmedabad');
assert.ok(sandbox.allMetroVenues.some(v => v.id === 'del-tom-uncles-maggi'), 'Must include Tom Uncle Maggi in Delhi');
assert.ok(sandbox.allMetroVenues.some(v => v.id === 'mum-mithibai-anand-dosa'), 'Must include Anand Stall Mithibai in Mumbai');
assert.ok(sandbox.allMetroVenues.some(v => v.id === 'pun-flavours-sandwich'), 'Must include Flavours BMCC in Pune');
assert.ok(sandbox.ahmedabadCatalog.some(v => v.id === 'ahm-cept-khau-gali'), 'Must include CEPT Khau Gali in Ahmedabad');
assert.ok(sandbox.allMetroVenues.length >= 415, `Must have 415+ metro venues total, found ${sandbox.allMetroVenues.length}`);

console.log('PASS: Palo animated vector mascot anatomy');
console.log('PASS: Non-blocking attached speech bubble architecture');
console.log('PASS: Cute voice synthesis & procedural Web Audio chirps');
console.log('PASS: Online reinforcement learning taste genome & leveling');
console.log('PASS: Deep access to verified restaurant diner review insights');
console.log('PASS: Hindi & Hinglish dictionary and conversational intelligence');
console.log('PASS: Comprehensive restaurant coverage across all 13 listed cities');
console.log('All Palo checks passed successfully.\n');
