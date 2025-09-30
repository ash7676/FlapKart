class Logger {
  constructor() {
    if (Logger.instance) {
      return Logger.instance;
    }
    this.logCount = 0;
    Logger.instance = this;
  }
  log(message) {
    this.logCount++;
    console.log(
      `[${new Date().toISOString()}] ${message} (log # ${this.logCount})`
    );
  }
}

module.exports =  Logger;
