/**
 * Clean install configuration built from user input.
 * User input comes from either UI answers or headless CLI flags.
 */
class Config {
  constructor({
    directory,
    modules,
    ides,
    skipPrompts,
    verbose,
    actionType,
    coreConfig,
    moduleConfigs,
    quickUpdate,
    channelOptions,
    setOverrideKeys,
    setOverrides,
  }) {
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
    // Per-module list of keys originating from `--set <module>.<key>=<value>`
    // that are NOT in the module's prompt schema. The manifest writer keeps
    // these through the schema-strict partition so user-asserted overrides
    // survive into config.toml even when the schema doesn't declare them.
    this.setOverrideKeys = setOverrideKeys || {};
    // Raw `--set` values keyed by module/key. The UI flow applies these in
    // `collectModuleConfigs` and populates `moduleConfigs`, so this field is
    // primarily for the non-UI path where `OfficialModules.build` runs
    // headless collection itself and needs the raw values to pre-seed
    // answers and skip prompts.
    this.setOverrides = setOverrides || {};
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
      setOverrideKeys: userInput.setOverrideKeys || {},
      setOverrides: userInput.setOverrides || {},
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
