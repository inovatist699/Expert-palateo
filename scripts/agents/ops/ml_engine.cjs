const BaseAgent = require('../core/agent_base.cjs');
const { spawnSync } = require('node:child_process');
const path = require('node:path');

class MLEngineAgent extends BaseAgent {
  constructor() {
    super(
      'ops:ml_engine',
      'ML & Taste Intelligence Engine',
      'Validates dining recommendation scoring algorithms, monitors taste vector calibration, and prevents preference drift.'
    );
  }

  async execute(context = {}) {
    const root = this.config.root;
    const report = {
      tasteModelPassed: false,
      recommendationQualityPassed: false,
      dishCalibrationPassed: false,
      paloPetPassed: false,
      scenariosEvaluated: [
        'Vegetarian Gujarati Diner (budget under_500)',
        'Spicy Andhra/South Indian Diner',
        'Luxury Date Night Diner',
        'Eggetarian Cafe Diner'
      ],
      metrics: {
        tasteFitVsPopularity: 'verified',
        dietaryConflictResilience: 'verified',
        feedbackSymmetry: 'verified',
        signalIdempotency: 'verified'
      }
    };

    this.log('Step 1: Testing core taste preference model (check-taste-model.cjs)...');
    const tasteRes = spawnSync(process.execPath, [path.join(root, 'work/check-taste-model.cjs')], { cwd: root, encoding: 'utf8' });
    if (tasteRes.status !== 0) {
      throw new Error(`Taste model verification failed:\n${tasteRes.stderr || tasteRes.stdout}`);
    }
    report.tasteModelPassed = true;
    this.log('Taste model cold start, generalization, and negative learning verified.');

    this.log('Step 2: Testing recommendation quality and conflict resilience (test-recommendation-quality.cjs)...');
    const recRes = spawnSync(process.execPath, [path.join(root, 'work/test-recommendation-quality.cjs')], { cwd: root, encoding: 'utf8' });
    if (recRes.status !== 0) {
      throw new Error(`Recommendation quality audit failed:\n${recRes.stderr || recRes.stdout}`);
    }
    report.recommendationQualityPassed = true;
    this.log('Recommendation ranking precision and dietary boundaries verified.');

    this.log('Step 3: Testing dish-level calibration & related-venue scoring (check-dish-calibration.cjs)...');
    const dishRes = spawnSync(process.execPath, [path.join(root, 'work/check-dish-calibration.cjs')], { cwd: root, encoding: 'utf8' });
    if (dishRes.status !== 0) {
      throw new Error(`Dish calibration failed:\n${dishRes.stderr || dishRes.stdout}`);
    }
    report.dishCalibrationPassed = true;
    this.log('Dish love/pass/undo scoring vectors calibrated.');

    this.log('Step 4: Testing Palo AI Companion & OmniRoute intelligence (check-palo-pet.cjs)...');
    const paloRes = spawnSync(process.execPath, [path.join(root, 'work/check-palo-pet.cjs')], { cwd: root, encoding: 'utf8' });
    if (paloRes.status !== 0) {
      throw new Error(`Palo companion check failed:\n${paloRes.stderr || paloRes.stdout}`);
    }
    report.paloPetPassed = true;
    this.log('Palo companion neural emotion states and feedback summary verified.');

    this.log('All ML models and recommendation heuristics operating within optimal bounds.', 'success');
    return report;
  }
}

module.exports = MLEngineAgent;
