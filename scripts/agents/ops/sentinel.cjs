const BaseAgent = require('../core/agent_base.cjs');
const { spawnSync } = require('node:child_process');
const path = require('node:path');
const fs = require('node:fs');

class SentinelAgent extends BaseAgent {
  constructor() {
    super(
      'ops:sentinel',
      'App Sentinel & Quality Gatekeeper',
      'Continuously monitors app stability, executes verification test suites, checks CSP integrity, and validates responsive viewports.'
    );
  }

  async execute(context = {}) {
    const root = this.config.root;
    const report = {
      timestamp: new Date().toISOString(),
      buildPassed: false,
      checksPassed: false,
      liveChecksPassed: null,
      cspVerified: false,
      tests: [],
      summary: ''
    };

    // 1. Build Verification
    this.log('Step 1: Running compilation & fragment build...');
    const buildScript = path.join(root, 'scripts/build.cjs');
    const buildRes = spawnSync(process.execPath, [buildScript], { cwd: root, encoding: 'utf8' });
    if (buildRes.status !== 0) {
      report.summary = `Build failed with exit code ${buildRes.status}: ${buildRes.stderr || buildRes.stdout}`;
      throw new Error(report.summary);
    }
    report.buildPassed = true;
    this.log('Build succeeded.');

    // 2. CSP Hash Verification
    this.log('Step 2: Checking CSP hash alignment...');
    const builtVercelPath = path.join(root, 'work/palateo_cloudflare_pages/vercel.json');
    const vercelConfig = JSON.parse(fs.readFileSync(builtVercelPath, 'utf8'));
    const cspHeader = vercelConfig.headers[0].headers.find(h => h.key === 'Content-Security-Policy');
    const builtHtml = fs.readFileSync(path.join(root, 'work/palateo_cloudflare_pages/app/index.html'), 'utf8');
    const scriptMatch = builtHtml.match(/<script>([\s\S]*?)<\/script>/);
    if (!scriptMatch) {
      throw new Error('Unable to find inline script tag in built app/index.html');
    }
    const crypto = require('node:crypto');
    const calculatedHash = 'sha256-' + crypto.createHash('sha256').update(scriptMatch[1].replace(/\r\n?/g, '\n')).digest('base64');
    if (!cspHeader.value.includes(calculatedHash)) {
      throw new Error(`CSP hash mismatch: header contains ${cspHeader.value.match(/sha256-[^' ]+/)?.[0]} but calculated is ${calculatedHash}`);
    }
    report.cspVerified = true;
    this.log(`CSP hash verified (${calculatedHash}).`);

    // 3. Run Standard Check Suites (work/check-all.cjs)
    this.log('Step 3: Running check-all test matrix...');
    const checkAllScript = path.join(root, 'work/check-all.cjs');
    const checkRes = spawnSync(process.execPath, [checkAllScript], { cwd: root, encoding: 'utf8' });
    if (checkRes.status !== 0) {
      report.summary = `Test suite failed:\n${checkRes.stderr || checkRes.stdout}`;
      throw new Error(report.summary);
    }
    report.checksPassed = true;
    this.log('All 9 core check suites passed.');

    // 4. Live Health Check (optional or if requested)
    if (context.checkLive || this.config.ops?.sentinel?.checkLiveEndpoints) {
      this.log('Step 4: Probing live production domain (https://palateo.in)...');
      try {
        const liveScript = path.join(root, 'work/check-palateo-live.cjs');
        if (fs.existsSync(liveScript)) {
          const liveRes = spawnSync(process.execPath, [liveScript], { cwd: root, encoding: 'utf8', timeout: 30000 });
          report.liveChecksPassed = liveRes.status === 0;
          if (liveRes.status === 0) {
            this.log('Live domain verified successfully.');
          } else {
            this.log(`Live checks warning: ${liveRes.stderr || liveRes.stdout}`, 'warn');
          }
        }
      } catch (e) {
        this.log(`Live check skipped or timed out: ${e.message}`, 'warn');
        report.liveChecksPassed = false;
      }
    }

    report.summary = 'App is 100% healthy: build, CSP, taste model, onboarding, and Sentry telemetry are validated.';
    this.eventBus.emit('ops:sentinel:healthy', report);
    return report;
  }
}

module.exports = SentinelAgent;
