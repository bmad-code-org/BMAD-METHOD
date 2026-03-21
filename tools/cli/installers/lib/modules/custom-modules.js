class CustomModules {
  constructor() {
    this.paths = new Map();
  }

  setPaths(customModulePaths) {
    this.paths = customModulePaths;
  }

  has(moduleCode) {
    return this.paths.has(moduleCode);
  }

  get(moduleCode) {
    return this.paths.get(moduleCode);
  }

  set(moduleId, sourcePath) {
    this.paths.set(moduleId, sourcePath);
  }
}

module.exports = { CustomModules };
