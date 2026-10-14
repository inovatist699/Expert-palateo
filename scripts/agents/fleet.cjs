#!/usr/bin/env node

/**
 * PALATEO AUTONOMOUS AGENT FLEET COMMANDER
 * Orchestrates engineering operations, app verification, ML intelligence,
 * data pipelines, email handling, deployments, and autonomous Instagram marketing.
 */

const path = require('node:path');
const fs = require('node:fs');

// Core
const config = require('./core/config.cjs');
const eventBus = require('./core/event_bus.cjs');

// Operations & Engineering Swarm
const SentinelAgent = require('./ops/sentinel.cjs');
const UIPolisherAgent = require('./ops/ui_polisher.cjs');
const VersionKeeperAgent = require('./ops/version_keeper.cjs');
const MLEngineAgent = require('./ops/ml_engine.cjs');
const EmailOpsAgent = require('./ops/email_ops.cjs');
const DataMasterAgent = require('./ops/data_master.cjs');
const DeployerAgent = require('./ops/deployer.cjs');

// Creative & Marketing Swarm
const ReelDirectorAgent = require('./marketing/reel_director.cjs');
const StoryEngineAgent = require('./marketing/story_engine.cjs');
const PostCuratorAgent = require('./marketing/post_curator.cjs');
const InstagramPublisherAgent = require('./marketing/instagram_publisher.cjs');
const GrowthHackerAgent = require('./marketing/growth_hacker.cjs');

class FleetCommander {
  constructor() {
    this.config = config;
    this.eventBus = eventBus;

    // Instantiate Agents
    this.agents = {
      // Ops
      'ops:sentinel': new SentinelAgent(),
      'ops:ui_polisher': new UIPolisherAgent(),
      'ops:version_keeper': new VersionKeeperAgent(),
      'ops:ml_engine': new MLEngineAgent(),
      'ops:email_ops': new EmailOpsAgent(),
      'ops:data_master': new DataMasterAgent(),
      'ops:deployer': new DeployerAgent(),

      // Marketing
      'marketing:reel_director': new ReelDirectorAgent(),
      'marketing:story_engine': new StoryEngineAgent(),
      'marketing:post_curator': new PostCuratorAgent(),
      'marketing:instagram_publisher': new InstagramPublisherAgent(),
      'marketing:growth_hacker': new GrowthHackerAgent()
    };
  }

  printBanner() {
    console.log('\n' + '='.repeat(68));
    console.log('   🤖 PALATEO AUTONOMOUS AGENT FLEET COMMANDER');
    console.log('   Full-Stack Operations, Taste ML & Instagram Growth Swarm');
    console.log('='.repeat(68));
    console.log(` Mode:        ${this.config.env.mode.toUpperCase()}`);
    console.log(` Target App:  ${this.config.app.name} (${this.config.app.liveUrl})`);
    console.log(` Active Fleet: ${Object.keys(this.agents).length} Specialized Autonomous Agents`);
    console.log('='.repeat(68) + '\n');
  }

  async runAgent(agentId, context = {}) {
    const agent = this.agents[agentId];
    if (!agent) {
      console.error(`[Fleet] Error: Unknown agent "${agentId}". Available: ${Object.keys(this.agents).join(', ')}`);
      return { success: false, error: 'Agent not found' };
    }
    return await agent.run(context);
  }

  async runOpsSwarm(context = {}) {
    console.log('\n>>> [FLEET] ACTIVATING OPERATIONS & ENGINEERING SWARM <<<\n');
    const opsResults = {};
    const opsList = [
      'ops:sentinel',
      'ops:ui_polisher',
      'ops:version_keeper',
      'ops:ml_engine',
      'ops:data_master',
      'ops:email_ops'
    ];

    for (const id of opsList) {
      opsResults[id] = await this.runAgent(id, context);
      if (!opsResults[id].success) {
        console.error(`\n[Fleet] ❌ CRITICAL: ${id} failed. Halting Ops pipeline.`);
        return { success: false, phase: 'ops', results: opsResults };
      }
    }

    // Deployer is triggered if requested or in full run
    if (context.deploy) {
      console.log('\n>>> [FLEET] PRE-FLIGHT VERIFIED -> EXECUTING DEPLOYMENT <<<\n');
      opsResults['ops:deployer'] = await this.runAgent('ops:deployer', context);
    }

    return { success: true, phase: 'ops', results: opsResults };
  }

  async runMarketingSwarm(context = {}) {
    console.log('\n>>> [FLEET] ACTIVATING CREATIVE & INSTAGRAM MARKETING SWARM <<<\n');
    const marketingResults = {};

    // 1. Reel Director generates short video package
    const reelRes = await this.runAgent('marketing:reel_director', context);
    marketingResults['marketing:reel_director'] = reelRes;

    // 2. Story Engine generates daily interactive story
    const storyRes = await this.runAgent('marketing:story_engine', context);
    marketingResults['marketing:story_engine'] = storyRes;

    // 3. Post Curator generates feed carousel
    const postRes = await this.runAgent('marketing:post_curator', context);
    marketingResults['marketing:post_curator'] = postRes;

    // 4. Growth Hacker analyzes metrics
    const growthRes = await this.runAgent('marketing:growth_hacker', context);
    marketingResults['marketing:growth_hacker'] = growthRes;

    // 5. Publisher queues / dispatches to Instagram
    if (reelRes.success && reelRes.data) {
      marketingResults['marketing:instagram_publisher_reel'] = await this.runAgent('marketing:instagram_publisher', {
        item: {
          type: 'reel',
          title: reelRes.data.title,
          caption: reelRes.data.caption,
          mediaUrl: 'https://palateo.in/resources/og-image.png'
        }
      });
    }

    if (storyRes.success && storyRes.data) {
      marketingResults['marketing:instagram_publisher_story'] = await this.runAgent('marketing:instagram_publisher', {
        item: {
          type: 'story',
          title: 'Daily Taste Poll',
          caption: 'Take the Palateo Daily Taste Quiz',
          mediaUrl: 'https://palateo.in/resources/og-image.png'
        }
      });
    }

    return { success: true, phase: 'marketing', results: marketingResults };
  }

  async runFullFleet(context = {}) {
    this.printBanner();
    const startTime = Date.now();
    const finalReport = {
      startedAt: new Date().toISOString(),
      mode: this.config.env.mode,
      ops: null,
      marketing: null,
      durationMs: 0
    };

    // Phase 1: Operations & Engineering
    finalReport.ops = await this.runOpsSwarm({ ...context, deploy: context.deploy || false });

    // Phase 2: Marketing & Instagram Swarm
    finalReport.marketing = await this.runMarketingSwarm(context);

    finalReport.durationMs = Date.now() - startTime;
    finalReport.completedAt = new Date().toISOString();

    // Save report to disk
    const reportPath = path.join(this.config.root, 'work/agent_fleet_report.json');
    fs.writeFileSync(reportPath, JSON.stringify(finalReport, null, 2), 'utf8');

    console.log('\n' + '='.repeat(68));
    console.log(` 🎉 FULL FLEET EXECUTION FINISHED IN ${(finalReport.durationMs / 1000).toFixed(2)}s`);
    console.log(` Audit Report saved to: work/agent_fleet_report.json`);
    console.log('='.repeat(68) + '\n');

    return finalReport;
  }

  printStatus() {
    this.printBanner();
    console.log('AGENT ROSTER & HEALTH STATUS:\n');
    for (const [id, agent] of Object.entries(this.agents)) {
      console.log(` • [${id}] - ${agent.name}`);
      console.log(`   Role:    ${agent.role}`);
      console.log(`   Status:  ${agent.state.status.toUpperCase()} (Runs: ${agent.state.runsCount}, Failures: ${agent.state.failuresCount})\n`);
    }
  }

  startDaemon(intervalMinutes = 30) {
    this.printBanner();
    console.log(`[Daemon] 🚀 Started autonomous fleet heartbeat daemon (Interval: ${intervalMinutes}m).`);
    console.log(`[Daemon] Press Ctrl+C to terminate.\n`);

    const cycle = async () => {
      console.log(`\n[Daemon] [${new Date().toISOString()}] Triggering scheduled heartbeat cycle...`);
      try {
        await this.runFullFleet({ dryRun: true });
      } catch (e) {
        console.error(`[Daemon] Cycle error: ${e.message}`);
      }
    };

    // Run first cycle immediately
    cycle();
    setInterval(cycle, intervalMinutes * 60 * 1000);
  }
}

// CLI Execution Router
async function main() {
  const commander = new FleetCommander();
  const args = process.argv.slice(2);

  if (args.includes('--status')) {
    commander.printStatus();
    return;
  }

  if (args.includes('--daemon')) {
    commander.startDaemon(commander.config.scheduler?.heartbeatMinutes || 30);
    return;
  }

  const dryRun = args.includes('--dry-run') || commander.config.env.mode === 'dry-run';
  const deploy = args.includes('--deploy');

  const agentArg = args.find(a => a.startsWith('--agent='));
  if (agentArg) {
    const agentId = agentArg.split('=')[1];
    commander.printBanner();
    await commander.runAgent(agentId, { dryRun, deploy });
    return;
  }

  if (args.includes('--ops')) {
    commander.printBanner();
    await commander.runOpsSwarm({ dryRun, deploy });
    return;
  }

  if (args.includes('--marketing')) {
    commander.printBanner();
    await commander.runMarketingSwarm({ dryRun });
    return;
  }

  // Default: run full fleet
  await commander.runFullFleet({ dryRun, deploy });
}

if (require.main === module) {
  main().catch(err => {
    console.error('[Fleet] Fatal Error:', err);
    process.exit(1);
  });
}

module.exports = FleetCommander;
