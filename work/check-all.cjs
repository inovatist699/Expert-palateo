const { spawnSync } = require('node:child_process');
const path = require('node:path');

const scripts = [
  'check-taste-onboarding.cjs',
  'check-waitlist.cjs',
  'check-sentry.cjs',
  'test-recommendation-quality.cjs',
  'check-dish-calibration.cjs',
  'check-design-colors.cjs',
  'check-phase3-map.cjs',
  'check-phase4-cards.cjs',
  'check-phase5-reviews.cjs',
  'check-phase6-integration.cjs',
  'check-phase7-polish.cjs',
  'check-phase8-audit.cjs'
];

let failed = false;
for (const s of scripts) {
  const file = path.join(__dirname, s);
  console.log(`\n=== Running ${s} ===`);
  const res = spawnSync(process.execPath, [file], { stdio: 'inherit' });
  if (res.status !== 0) {
    console.error(`FAILED: ${s} exited with code ${res.status}`);
    failed = true;
    break;
  }
}

if (failed) {
  process.exit(1);
} else {
  console.log('\nAll checks passed successfully.');
}
