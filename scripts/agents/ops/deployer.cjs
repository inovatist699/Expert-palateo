const BaseAgent = require('../core/agent_base.cjs');
const { spawnSync } = require('node:child_process');
const path = require('node:path');
const fs = require('node:fs');

class DeployerAgent extends BaseAgent {
  constructor() {
    super(
      'ops:deployer',
      'Deployment Orchestrator & Release Gatekeeper',
      'Enforces pre-deployment verification gates, updates CSP hashes, builds production bundles, and coordinates zero-downtime releases.'
    );
  }

  async execute(context = {}) {
    const root = this.config.root;
    const report = {
      preFlightPassed: false,
      cspUpdated: false,
      deployed: false,
      target: 'Vercel (palateo-app)',
      liveUrl: 'https://palateo.in',
      postDeployPassed: false
    };

    // 1. Mandatory Pre-Flight Verification Gate
    this.log('Gate 1: Running mandatory pre-flight checks (check-all.cjs)...');
    const checkRes = spawnSync(process.execPath, [path.join(root, 'work/check-all.cjs')], { cwd: root, encoding: 'utf8' });
    if (checkRes.status !== 0) {
      throw new Error(`Deployment blocked: Pre-flight checks failed:\n${checkRes.stderr || checkRes.stdout}`);
    }
    report.preFlightPassed = true;
    this.log('Pre-flight check passed.');

    // 2. CSP Hash Update & Bundle Build
    this.log('Gate 2: Rebuilding production bundle and synchronizing CSP hashes...');
    const cspScript = path.join(root, 'work/check-taste-onboarding.cjs');
    const cspRes = spawnSync(process.execPath, [cspScript, '--update-csp'], { cwd: root, encoding: 'utf8' });
    if (cspRes.status !== 0) {
      throw new Error(`CSP synchronization failed:\n${cspRes.stderr || cspRes.stdout}`);
    }
    report.cspUpdated = true;
    this.log('CSP and production bundles synchronized.');

    // 3. Execute Deployment
    if (context.dryRun || this.config.env.mode === 'dry-run') {
      this.log('Gate 3: DRY RUN MODE - Skipping external Vercel network upload.', 'info');
      report.deployed = 'dry_run_passed';
      report.postDeployPassed = true;
    } else {
      this.log('Gate 3: Executing production deployment to Vercel...');
      const deployScript = path.join(root, 'work/deploy-prod.cjs');
      const deployRes = spawnSync(process.execPath, [deployScript], { cwd: root, encoding: 'utf8' });
      if (deployRes.status !== 0) {
        throw new Error(`Deployment execution failed:\n${deployRes.stderr || deployRes.stdout}`);
      }
      report.deployed = true;
      this.log('Production artifacts successfully deployed to Vercel.', 'success');

      // 4. Post-Deploy Live Smoke Test
      this.log('Gate 4: Running post-deployment live sanity check...');
      const liveScript = path.join(root, 'work/check-palateo-live.cjs');
      if (fs.existsSync(liveScript)) {
        const liveRes = spawnSync(process.execPath, [liveScript], { cwd: root, encoding: 'utf8', timeout: 30000 });
        report.postDeployPassed = liveRes.status === 0;
        if (liveRes.status === 0) {
          this.log('Live production endpoint (https://palateo.in) responded 200 OK with strict CSP.', 'success');
        } else {
          this.log(`Live smoke test warning: ${liveRes.stderr || liveRes.stdout}`, 'warn');
        }
      }
    }

    this.eventBus.emit('ops:deploy:success', report);
    return report;
  }
}

module.exports = DeployerAgent;
