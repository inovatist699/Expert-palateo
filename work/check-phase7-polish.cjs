const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const dir = path.join(__dirname, 'palateo_cloudflare_pages');
const css = fs.readFileSync(path.join(dir, 'app', 'theme.css'), 'utf8');

// 1. Apple-Quality Keyframe Animations
assert.match(css, /@keyframes saveBounce/, 'Theme must include saveBounce animation');
assert.match(css, /@keyframes likePulse/, 'Theme must include likePulse animation');
assert.match(css, /@keyframes screenFadeIn/, 'Theme must include screenFadeIn animation');
assert.match(css, /@keyframes badgePop/, 'Theme must include badgePop animation');
assert.match(css, /@keyframes shimmerWave/, 'Theme must include shimmerWave animation');

// 2. Micro-Interaction Class Bindings
assert.match(css, /\.cardSaveBtn\.saved[\s\S]*?animation:\s*saveBounce/, 'Bookmark save state must trigger saveBounce');
assert.match(css, /button\[data-rest-action="like"\]\[aria-pressed="true"\][\s\S]*?animation:\s*likePulse/, 'Like action must trigger likePulse');
assert.match(css, /button:active:not\(:disabled\)[\s\S]*?transform:\s*scale\(0\.97\)/, 'Buttons must provide tactile active press feedback');

// 3. Hardware Acceleration & Smooth Gestures
assert.match(css, /\.screen[\s\S]*?will-change:\s*opacity,\s*transform/, 'Screen transitions must be GPU hardware accelerated');
assert.match(css, /\.zestMapCarousel[\s\S]*?-webkit-overflow-scrolling:\s*touch/, 'Carousel must use momentum touch scrolling');
assert.match(css, /\.zestMapCarousel[\s\S]*?scroll-snap-type:\s*x mandatory/, 'Carousel must enforce snap scroll physics');
assert.match(css, /\.zestCarouselCard[\s\S]*?scroll-snap-align:\s*center/, 'Carousel cards must snap to center');

// 4. Accessibility & Reduced Motion
assert.match(css, /@media\s*\(prefers-reduced-motion:\s*reduce\)[\s\S]*?animation:\s*none\s*!important/, 'Reduced motion must disable animations');
assert.match(css, /@media\s*\(prefers-reduced-motion:\s*reduce\)[\s\S]*?transition:\s*none\s*!important/, 'Reduced motion must disable transitions');

// 5. Layered Elevation & Shadows
assert.match(css, /\.restaurant-card[\s\S]*?box-shadow:/, 'Cards must use layered shadows');

console.log('PASS: Apple-quality animations, micro-interactions, hardware acceleration, gesture physics, reduced motion, and elevation tokens');
