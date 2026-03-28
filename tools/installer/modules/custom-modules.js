const path = require('node:path');
const fs = require('fs-extra');
const yaml = require('yaml');
const { CustomHandler } = require('../custom-handler');
const { Manifest } = require('../core/manifest');
const prompts = require('../prompts');

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
   * Install a custom module from its source path.
   * @param {string} moduleName - Module identifier
   * @param {string} bmadDir - Target bmad directory
   * @param {Function} fileTrackingCallback - Optional callback to track installed files
   * @param {Object} options - Install options
   * @param {Object} options.moduleConfig - Pre-collected module configuration
   * @returns {Object} Install result
   */
  async install(moduleName, bmadDir, fileTrackingCallback = null, options = {}) {
    const sourcePath = this.paths.get(moduleName);
    if (!sourcePath) {
      throw new Error(`No source path for custom module '${moduleName}'`);
    }

    if (!(await fs.pathExists(sourcePath))) {
      throw new Error(`Source for custom module '${moduleName}' not found at: ${sourcePath}`);
    }

    const targetPath = path.join(bmadDir, moduleName);

    // Read custom.yaml and merge into module config
    let moduleConfig = options.moduleConfig ? { ...options.moduleConfig } : {};
    const customConfigPath = path.join(sourcePath, 'custom.yaml');
    if (await fs.pathExists(customConfigPath)) {
      try {
        const content = await fs.readFile(customConfigPath, 'utf8');
        const customConfig = yaml.parse(content);
        if (customConfig) {
          moduleConfig = { ...moduleConfig, ...customConfig };
        }
      } catch (error) {
        await prompts.log.warn(`Failed to read custom.yaml for ${moduleName}: ${error.message}`);
      }
    }

    // Remove existing installation
    if (await fs.pathExists(targetPath)) {
      await fs.remove(targetPath);
    }

    // Copy files with filtering
    await this._copyWithFiltering(sourcePath, targetPath, fileTrackingCallback);

    // Add to manifest
    const manifest = new Manifest();
    const versionInfo = await manifest.getModuleVersionInfo(moduleName, bmadDir, sourcePath);
    await manifest.addModule(bmadDir, moduleName, {
      version: versionInfo.version,
      source: versionInfo.source,
      npmPackage: versionInfo.npmPackage,
      repoUrl: versionInfo.repoUrl,
    });

    return { success: true, module: moduleName, path: targetPath, moduleConfig };
  }

  /**
   * Copy module files, filtering out install-time-only artifacts.
   * @param {string} sourcePath - Source module directory
   * @param {string} targetPath - Target module directory
   * @param {Function} fileTrackingCallback - Optional callback to track installed files
   */
  async _copyWithFiltering(sourcePath, targetPath, fileTrackingCallback = null) {
    const files = await this._getFileList(sourcePath);

    for (const file of files) {
      if (file.startsWith('sub-modules/')) continue;

      const isInSidecar = path
        .dirname(file)
        .split('/')
        .some((dir) => dir.toLowerCase().endsWith('-sidecar'));
      if (isInSidecar) continue;

      if (file === 'module.yaml') continue;
      if (file === 'config.yaml') continue;

      const sourceFile = path.join(sourcePath, file);
      const targetFile = path.join(targetPath, file);

      // Skip web-only agents
      if (file.startsWith('agents/') && file.endsWith('.md')) {
        const content = await fs.readFile(sourceFile, 'utf8');
        if (/<agent[^>]*\slocalskip="true"[^>]*>/.test(content)) {
          continue;
        }
      }

      await fs.ensureDir(path.dirname(targetFile));
      await fs.copy(sourceFile, targetFile, { overwrite: true });

      if (fileTrackingCallback) {
        fileTrackingCallback(targetFile);
      }
    }
  }

  /**
   * Recursively list all files in a directory.
   * @param {string} dir - Directory to scan
   * @param {string} baseDir - Base directory for relative paths
   * @returns {string[]} Relative file paths
   */
  async _getFileList(dir, baseDir = dir) {
    const files = [];
    const entries = await fs.readdir(dir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        files.push(...(await this._getFileList(fullPath, baseDir)));
      } else {
        files.push(path.relative(baseDir, fullPath));
      }
    }

    return files;
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
