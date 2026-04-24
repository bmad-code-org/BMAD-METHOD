/**
 * Clean install configuration built from user input.
 * User input comes from either UI answers or headless CLI flags.
 */
class Config {
  constructor({ directory, modules, ides, skipPrompts, verbose, actionType, coreConfig, moduleConfigs, quickUpdate, channelOptions }) {
    this.directory = directory;
    this.modules = Object.freeze([...modules]);
    this.ides = Object.freeze([...ides]);
    this.skipPrompts = skipPrompts;
    this.verbose = verbose;
    this.actionType = actionType;
    this.coreConfig = coreConfig;
    this.moduleConfigs = moduleConfigs;
    this._quickUpdate = quickUpdate;
    // channelOptions carry a Map + Set; don't deep-freeze.
    this.channelOptions = channelOptions || null;
    Object.freeze(this);
  }

  /**
   * Build a clean install config from raw user input.
   * @param {Object} userInput - UI answers or CLI flags
   * @returns {Config}
   */
  static build(userInput) {
    const modules = [...(userInput.modules || [])];
    if (userInput.installCore && !modules.includes('core')) {
      modules.unshift('core');
    }

    return new Config({
      directory: userInput.directory,
      modules,
      ides: userInput.skipIde ? [] : [...(userInput.ides || [])],
      skipPrompts: userInput.skipPrompts || false,
      verbose: userInput.verbose || false,
      actionType: userInput.actionType,
      coreConfig: userInput.coreConfig || {},
      moduleConfigs: userInput.moduleConfigs || null,
      quickUpdate: userInput._quickUpdate || false,
      channelOptions: userInput.channelOptions || null,
    });
  }

  hasCoreConfig() {
    return this.coreConfig && Object.keys(this.coreConfig).length > 0;
  }

  isQuickUpdate() {
    return this._quickUpdate;
  }
}

module.exports = { Config };
