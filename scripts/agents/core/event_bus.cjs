const EventEmitter = require('node:events');

class AgentEventBus extends EventEmitter {
  constructor() {
    super();
    this.setMaxListeners(50);
    this.history = [];
  }

  emit(event, ...args) {
    const timestamp = new Date().toISOString();
    this.history.push({ event, args, timestamp });
    if (this.history.length > 500) {
      this.history.shift();
    }
    return super.emit(event, ...args);
  }

  getRecentEvents(limit = 20) {
    return this.history.slice(-limit);
  }
}

const globalEventBus = new AgentEventBus();

module.exports = globalEventBus;
