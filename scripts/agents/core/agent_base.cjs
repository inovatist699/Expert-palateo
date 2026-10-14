const eventBus = require('./event_bus.cjs');
const config = require('./config.cjs');

class BaseAgent {
  /**
   * @param {string} id - Unique identifier (e.g. 'ops:sentinel', 'marketing:reel_director')
   * @param {string} name - Friendly name (e.g. 'App Sentinel Agent')
   * @param {string} role - Description of role & responsibility
   */
  constructor(id, name, role) {
    this.id = id;
    this.name = name;
    this.role = role;
    this.config = config;
    this.eventBus = eventBus;
    this.state = {
      status: 'idle',
      lastRun: null,
      lastError: null,
      runsCount: 0,
      failuresCount: 0
    };
  }

  log(message, level = 'info') {
    const timestamp = new Date().toISOString();
    const prefix = `[${timestamp}] [${this.name}]`;
    if (level === 'error') {
      console.error(`${prefix} ❌ ${message}`);
    } else if (level === 'warn') {
      console.warn(`${prefix} ⚠️ ${message}`);
    } else if (level === 'success') {
      console.log(`${prefix} ✅ ${message}`);
    } else {
      console.log(`${prefix} ℹ️ ${message}`);
    }
  }

  async run(context = {}) {
    this.state.status = 'running';
    this.state.runsCount++;
    this.state.lastRun = new Date().toISOString();
    this.log(`Starting execution run #${this.state.runsCount}...`);
    this.eventBus.emit(`agent:start`, { id: this.id, name: this.name, context });

    const startTime = Date.now();
    try {
      const result = await this.execute(context);
      const durationMs = Date.now() - startTime;
      this.state.status = 'success';
      this.log(`Execution completed successfully in ${durationMs}ms`, 'success');
      this.eventBus.emit(`agent:success`, { id: this.id, name: this.name, result, durationMs });
      return {
        success: true,
        agentId: this.id,
        durationMs,
        data: result
      };
    } catch (err) {
      const durationMs = Date.now() - startTime;
      this.state.status = 'failed';
      this.state.failuresCount++;
      this.state.lastError = err.message;
      this.log(`Execution failed after ${durationMs}ms: ${err.message}`, 'error');
      this.eventBus.emit(`agent:error`, { id: this.id, name: this.name, error: err.message, stack: err.stack, durationMs });
      return {
        success: false,
        agentId: this.id,
        durationMs,
        error: err.message
      };
    }
  }

  /**
   * Abstract execute method to be implemented by child agents
   * @param {object} context 
   */
  async execute(context) {
    throw new Error(`Execute method must be implemented by subclass ${this.constructor.name}`);
  }
}

module.exports = BaseAgent;
