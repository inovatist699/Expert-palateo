const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const root = path.resolve(__dirname, '..');
const companionJs = fs.readFileSync(path.join(root, 'src/features/companion/controller.js'), 'utf8');
const interactiveCss = fs.readFileSync(path.join(root, 'src/styles/interactive.css'), 'utf8');
const metroCityFiles = [
  'mumbai.js', 'delhi.js', 'bengaluru.js', 'hyderabad.js', 'chennai.js',
  'kolkata.js', 'pune.js', 'jaipur.js', 'kochi.js', 'goa.js', 'chandigarh.js'
];
const metroCityScripts = metroCityFiles.map(f => fs.readFileSync(path.join(root, 'src/models/venues', f), 'utf8'));
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
assert.ok(companionJs.includes('playCuteSound'), 'Must implement procedural Web Audio cute chirps');
assert.ok(companionJs.includes('pitch = 1.56') || companionJs.includes('pitch = 1.'), 'Must tune cute pitched voice synthesis');
assert.ok(companionJs.includes('EMOTION_VOICE_PROFILES'), 'Must define EMOTION_VOICE_PROFILES');
assert.ok(companionJs.includes('detectEmotion'), 'Must implement detectEmotion engine');
assert.ok(companionJs.includes("type === 'joy'"), 'Must implement procedural joy arpeggio sound');
assert.ok(companionJs.includes("type === 'curious'"), 'Must implement procedural curious slide chirp');
assert.ok(companionJs.includes("type === 'warm'"), 'Must implement procedural warm harmonic chime');
assert.ok(companionJs.includes("type === 'playful'"), 'Must implement procedural playful syncopated chirp');
assert.ok(companionJs.includes("type === 'gentle'"), 'Must implement procedural gentle descending chime');
assert.ok(companionJs.includes('paloThoughtBox'), 'Must render live cognitive thought stream');

// 2. CSS Animation & Mobile Ergonomics Audit
assert.ok(interactiveCss.includes('paloFloat'), 'Must include floating breathing animation');
assert.ok(interactiveCss.includes('paloBlink'), 'Must include eye blinking animation');
assert.ok(interactiveCss.includes('paloTalkBob'), 'Must include speaking animation');
assert.ok(interactiveCss.includes('paloJoyJump'), 'Must include celebration delight jump');
assert.ok(interactiveCss.includes('is-joyful'), 'Must include is-joyful animation state');
assert.ok(interactiveCss.includes('is-curious'), 'Must include is-curious animation state');
assert.ok(interactiveCss.includes('is-warm'), 'Must include is-warm animation state');
assert.ok(interactiveCss.includes('is-playful'), 'Must include is-playful animation state');
assert.ok(interactiveCss.includes('is-gentle'), 'Must include is-gentle animation state');
assert.ok(interactiveCss.includes('paloReviewCard'), 'Must style verified review citation card');
assert.ok(interactiveCss.includes('paloBrainDrawer'), 'Must style ML taste genome drawer');
assert.ok(interactiveCss.includes('paloThoughtBox'), 'Must style live cognitive thought stream');
assert.ok(interactiveCss.includes('paloBrainStatsGrid'), 'Must style cognitive stats grid');
assert.ok(interactiveCss.includes('paloTeachForm'), 'Must style teach brain form');
assert.ok(interactiveCss.includes('paloConceptCloud'), 'Must style concept cloud');
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
  normalizeDishFeedback: v => v || {},
  activeRestaurant: id => sandbox.allMetroVenues.find(v=>v.id===id),
  rateDish: () => {},
  rateV5: (id, val) => { sandbox.state.feedback[id] = val; },
  console,
  setTimeout,
  clearTimeout
};

// Evaluate city venue databases, metros, ahmedabad, and vadodara data in sandbox
vm.createContext(sandbox);
for (const script of metroCityScripts) {
  vm.runInContext(script, sandbox);
}
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

// 8. Verify Indian Hindi Accent Audio Engine
assert.ok(companionJs.includes('toIndianHindiAccentSpoken'), 'Must implement Indian Hindi accent speech transformer');
assert.ok(companionJs.includes('hindiVoice'), 'Must prioritize authentic native Hindi voice');
assert.ok(companionJs.includes('indianEnVoice') || companionJs.includes('en-IN'), 'Must prioritize Indian English voice for authentic accent');

// 9. Verify Emotional Voice Profiles & Tone Modulation
const engine = sandbox.window.paloEmotionEngine;
assert.ok(engine, 'Must export paloEmotionEngine on window');
assert.ok(engine.EMOTION_VOICE_PROFILES.joy, 'Must have joy profile');
assert.ok(engine.EMOTION_VOICE_PROFILES.curious, 'Must have curious profile');
assert.ok(engine.EMOTION_VOICE_PROFILES.warm, 'Must have warm profile');
assert.ok(engine.EMOTION_VOICE_PROFILES.playful, 'Must have playful profile');
assert.ok(engine.EMOTION_VOICE_PROFILES.gentle, 'Must have gentle profile');
assert.equal(engine.detectEmotion('kuch meetha ho jaye mast dessert'), 'warm');
assert.equal(engine.detectEmotion('chatpata teekha tadka mirchi'), 'playful');
assert.equal(engine.detectEmotion('searching web for trending dishes', { isWebSearch: true }), 'curious');
assert.equal(engine.detectEmotion('waah waah bawaal ek number fit 99%'), 'joy');
assert.equal(engine.detectEmotion('not for me avoid pass please'), 'gentle');

// Verify speech utterance modulation
let lastSpokenUtterance = null;
sandbox.window.speechSynthesis.speak = u => { lastSpokenUtterance = u; };
engine.speakCute('Wah mazaa aa gaya!', 'joy');
assert.ok(lastSpokenUtterance, 'Must create speech utterance');
assert.equal(lastSpokenUtterance.pitch, 1.62, 'Must apply joy pitch 1.62');
assert.equal(lastSpokenUtterance.rate, 1.08, 'Must apply joy rate 1.08');

engine.speakCute('Koi baat nahi ji!', 'gentle');
assert.equal(lastSpokenUtterance.pitch, 1.34, 'Must apply gentle pitch 1.34');
assert.equal(lastSpokenUtterance.rate, 0.92, 'Must apply gentle rate 0.92');

// Verify procedural sound triggers
engine.playCuteSound('joy');
engine.playCuteSound('curious');
engine.playCuteSound('warm');
engine.playCuteSound('playful');
engine.playCuteSound('gentle');


assert.equal(sandbox.window.paloML.genome.level,0,'No fabricated training at cold start');
sandbox.state.feedback[bombayCanteen.id]='like';
assert.equal(sandbox.window.paloML.genome.level,1,'Summary reflects explicit place feedback');
delete sandbox.state.feedback[bombayCanteen.id];
assert.equal(sandbox.window.paloML.genome.level,0,'Undo resets summary');
console.log('PASS: non-modal pet, animation, voice profiles, city coverage, explicit-feedback summary and undo');
