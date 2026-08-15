export class EventEmitter {
  constructor() {
    this.events = {};
  }

  subscribe(event, callback) {
    if (!this.events[event]) {
      this.events[event] = [];
    }
    this.events[event].push(callback);

    // Return unsubscribe function to remove the need to manually rewrite the
    // event to unsubscribe
    return () => {
      this.unsubscribe(event, callback);
    };
  }

  unsubscribe(event, callback) {
    if (!this.events[event]) return;
    this.events[event] = this.events[event].filter((cb) => cb !== callback);
  }

  publish(event, ...args) {
    if (!this.events[event]) return;
    for (const callback of this.events[event]) callback(...args);
  }
}
