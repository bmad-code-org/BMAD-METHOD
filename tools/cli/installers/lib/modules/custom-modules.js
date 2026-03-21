const path = require('node:path');
const { CustomHandler } = require('../custom-handler');

class CustomModules {
  constructor() {
    this.paths = new Map();
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

  /**
   * Discover custom module source paths from all available sources.
   * @param {Object} config - Installation configuration
   * @param {Object} paths - InstallPaths instance
   * @returns {Map<string, string>} Map of module ID to source path
   */
  async discoverPaths(config, paths) {
    this.paths = new Map();

    if (config._quickUpdate) {
      if (config._customModuleSources) {
        for (const [moduleId, customInfo] of config._customModuleSources) {
          this.paths.set(moduleId, customInfo.sourcePath);
        }
      }
      return this.paths;
    }

    // From manifest (regular updates)
    if (config._isUpdate && config._existingInstall && config._existingInstall.customModules) {
      for (const customModule of config._existingInstall.customModules) {
        let absoluteSourcePath = customModule.sourcePath;

        if (absoluteSourcePath && absoluteSourcePath.startsWith('_config')) {
          absoluteSourcePath = path.join(paths.bmadDir, absoluteSourcePath);
        } else if (!absoluteSourcePath && customModule.relativePath) {
          absoluteSourcePath = path.resolve(paths.projectRoot, customModule.relativePath);
        } else if (absoluteSourcePath && !path.isAbsolute(absoluteSourcePath)) {
          absoluteSourcePath = path.resolve(absoluteSourcePath);
        }

        if (absoluteSourcePath) {
          this.paths.set(customModule.id, absoluteSourcePath);
        }
      }
    }

    // From UI: selectedFiles
    if (config.customContent && config.customContent.selected && config.customContent.selectedFiles) {
      const customHandler = new CustomHandler();
      for (const customFile of config.customContent.selectedFiles) {
        const customInfo = await customHandler.getCustomInfo(customFile, paths.projectRoot);
        if (customInfo && customInfo.id) {
          this.paths.set(customInfo.id, customInfo.path);
        }
      }
    }

    // From UI: sources
    if (config.customContent && config.customContent.sources) {
      for (const source of config.customContent.sources) {
        this.paths.set(source.id, source.path);
      }
    }

    // From UI: cachedModules
    if (config.customContent && config.customContent.cachedModules) {
      const selectedCachedIds = config.customContent.selectedCachedModules || [];
      const shouldIncludeAll = selectedCachedIds.length === 0 && config.customContent.selected;

      for (const cachedModule of config.customContent.cachedModules) {
        if (cachedModule.id && cachedModule.cachePath && (shouldIncludeAll || selectedCachedIds.includes(cachedModule.id))) {
          this.paths.set(cachedModule.id, cachedModule.cachePath);
        }
      }
    }

    return this.paths;
  }
}

module.exports = { CustomModules };
