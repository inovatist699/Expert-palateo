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
  const answers = () => Object.fromEntries(questions.map(q => [q.k, q.o[0][0]]));
  useAccount(user('map-tester'));
  authRequired = false;
  state.answers = answers();
  state.onboarded = true;
  await finishV5();

  const venues = ranked();
  assert.ok(venues.length > 0, 'Must have ranked venues available');
  const mapped = venues.filter(hasCoordinates);
  assert.ok(mapped.length > 0, 'Must have places with valid coordinates');

  // 1. Vector Map Canvas (720x420)
  const svg = renderZestMapSvg(mapped, 'Ahmedabad', mapped[0].id);
  assert.match(svg, /viewBox="0 0 720 420"/, 'SVG canvas must be 720x420');
  assert.match(svg, /id="zestGrid"/, 'Micro-grid coordinate pattern must be defined');
  assert.match(svg, /class="zestMapBlocks"/, 'Stylized urban blocks must exist');
  assert.match(svg, /class="zestMapPaths"/, 'Arterial road ribbons must exist');
  assert.match(svg, /SABARMATI RIVER/, 'Ahmedabad theme must include Sabarmati River');

  // 2. City Map Themes for all 13 Indian Metros
  const metros = ['Ahmedabad', 'Mumbai', 'Delhi NCR', 'Bengaluru', 'Hyderabad', 'Chennai', 'Kolkata', 'Pune', 'Jaipur', 'Kochi', 'Goa', 'Chandigarh', 'Vadodara'];
  for (const m of metros) {
    const citySvg = renderZestMapSvg(mapped, m, null);
    assert.ok(citySvg.includes('zestMapSvg'), 'City SVG rendered for ' + m);
  }

  // 3. Category Emojis & Pins
  assert.match(svg, /class="zestPin active"/, 'Selected venue pin must have active class');
  assert.match(svg, /class="zestPinPulse"/, 'Active pin must have pulsing radar ring');
  assert.match(svg, /class="zestPinCircle"/, 'Pin circle must be rendered');
  assert.match(svg, /class="zestActivePinLabel"/, 'Active venue floating label pill must exist');

  // 4. Dynamic Heatmap Layer
  mapHeatmap = false;
  const svgNoHeat = renderZestMapSvg(mapped, 'Ahmedabad', null);
  assert.doesNotMatch(svgNoHeat, /zestHeatmapLayer/, 'Heatmap layer absent when mapHeatmap is false');
  mapHeatmap = true;
  const svgWithHeat = renderZestMapSvg(mapped, 'Ahmedabad', null);
  assert.match(svgWithHeat, /zestHeatmapLayer/, 'Heatmap layer present when mapHeatmap is true');
  mapHeatmap = false;

  // 5. Transform & Zoom Pan Gestures
  mapZoom = 1; mapPan = { x: 0, y: 0 };
  zoomMap(0.2);
  assert.equal(mapZoom, 1.2, 'Zooming in must increment zoom level');
  zoomMap(-0.4);
  assert.equal(mapZoom, 0.85, 'Zooming out is clamped to minimum 0.85');
  resetMapZoom();
  assert.equal(mapZoom, 1, 'Reset zoom returns map to 1.0');
  assert.equal(mapPan.x, 0); assert.equal(mapPan.y, 0);

  centerMapOnPoint(400, 250);
  assert.notEqual(mapPan.x, 0, 'centerMapOnPoint shifts mapPan.x towards target');
  assert.notEqual(mapPan.y, 0, 'centerMapOnPoint shifts mapPan.y towards target');
  resetMapZoom();

  // 6. Synchronized Bottom Carousel
  const carouselHtml = renderZestMapCarousel(mapped, mapped[0].id);
  assert.match(carouselHtml, /class="zestMapCarousel"/, 'Carousel container must exist');
  assert.match(carouselHtml, /class="zestCarouselCard active"/, 'Active card must match selected pin');
  assert.match(carouselHtml, /zestCarouselMatch/, 'Card must show match percentage badge');
  assert.match(carouselHtml, /Must Try/, 'Card must feature Must Try dish highlight');
  assert.match(carouselHtml, /Directions ↗/, 'Card must have Directions action');
  assert.match(carouselHtml, /Details →/, 'Card must have Details action');

  // 7. Home Screen Full Rendering
  homeView = 'map';
  home();
  const homeHtml = document.getElementById('root').innerHTML;
  assert.match(homeHtml, /class="zestCityBar"/, 'City bar with 13 Indian metros must be on Palate Map');
  assert.match(homeHtml, /PALATE RADAR/, 'Palate Radar badge must be displayed');
  assert.match(homeHtml, /class="zestQuickFilters"/, 'Quick filter chips must exist');
  assert.match(homeHtml, /toggle-90-match/, '90%+ quick filter chip must be present');
  assert.match(homeHtml, /class="zestMapControls"/, 'Floating map control cluster must exist');
  assert.match(homeHtml, /id="zestMapCarousel"/, 'Synchronized carousel must be rendered on Palate Map');
  assert.match(homeHtml, /homeDiscoverSection/, 'Discover section must be preserved on home page');
  assert.match(homeHtml, /homePeopleSection/, 'People section must be preserved on home page');

  // 8. Bidirectional Sync
  syncMapAndCarousel(mapped[0].id);
  assert.equal(selectedPinId, mapped[0].id, 'syncMapAndCarousel sets selectedPinId');

  console.log('PASS: 720x420 vector map, 13 metro themes, Saffron pins, pulsing halos, heatmap toggle, pan/zoom transforms, synchronized carousel, HUD controls, and home page sections');
})().catch(err => {
  console.error(err);
  process.exit(1);
});
`, context);
