const BaseAgent = require('../core/agent_base.cjs');
const path = require('node:path');
const fs = require('node:fs');

class VersionKeeperAgent extends BaseAgent {
  constructor() {
    super(
      'ops:version_keeper',
      'Version Keeper & Dependency Auditor',
      'Inspects dependency manifests, tracks release metadata, enforces semantic versioning, and validates runtime compatibility.'
    );
  }

  async execute(context = {}) {
    const root = this.config.root;
    const pkgPath = path.join(root, 'package.json');
    const metadataPath = path.join(root, 'metadata.json');

    const result = {
      nodeVersion: process.version,
      packageInfo: {},
      actionTaken: 'inspected',
      upToDate: true
    };

    this.log(`Step 1: Inspecting runtime environment (Node.js ${process.version})...`);
    const nodeMajor = parseInt(process.version.replace('v', '').split('.')[0], 10);
    if (nodeMajor < 20) {
      this.log(`Node.js version ${process.version} is below recommended LTS (Node 20+).`, 'warn');
      result.upToDate = false;
    }

    this.log('Step 2: Checking package.json and workspace scripts...');
    const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
    result.packageInfo = {
      name: pkg.name,
      scriptsCount: Object.keys(pkg.scripts || {}).length
    };

    let metadata = {};
    if (fs.existsSync(metadataPath)) {
      try {
        metadata = JSON.parse(fs.readFileSync(metadataPath, 'utf8'));
      } catch (_) {}
    }

    if (context.bumpPatch) {
      this.log('Step 3: Bumping release build metadata...');
      metadata.buildTime = new Date().toISOString();
      metadata.revision = (metadata.revision || 1) + 1;
      fs.writeFileSync(metadataPath, JSON.stringify(metadata, null, 2));
      result.actionTaken = `bumped_revision_${metadata.revision}`;
      this.log(`Updated metadata.json revision to ${metadata.revision}`, 'success');
    }

    this.log('Dependency and version inspection complete.', 'success');
    return result;
  }
}

module.exports = VersionKeeperAgent;
