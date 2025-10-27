/**
 * Module Manager - Centralized dynamic import management
 * Handles loading and caching of ES modules to reduce memory overhead
 */

class ModuleManager {
  constructor() {
    this._cache = new Map();
    this._loadingPromises = new Map();
  }

  /**
   * Initialize all commonly used ES modules at once
   * @returns {Promise<Object>} Object containing all loaded modules
   */
  async initializeCommonModules() {
    const modules = await Promise.all([
      this.getModule('chalk'),
      this.getModule('ora'),
      this.getModule('inquirer'),
    ]);

    return {
      chalk: modules[0],
      ora: modules[1],
      inquirer: modules[2],
    };
  }

  /**
   * Get a module by name, with caching
   * @param {string} moduleName - Name of the module to load
   * @returns {Promise<any>} The loaded module
   */
  async getModule(moduleName) {
    // Return from cache if available
    if (this._cache.has(moduleName)) {
      return this._cache.get(moduleName);
    }

    // If already loading, return the existing promise
    if (this._loadingPromises.has(moduleName)) {
      return this._loadingPromises.get(moduleName);
    }

    // Start loading the module
    const loadPromise = this._loadModule(moduleName);
    this._loadingPromises.set(moduleName, loadPromise);

    try {
      const module = await loadPromise;
      this._cache.set(moduleName, module);
      this._loadingPromises.delete(moduleName);
      return module;
    } catch (error) {
      this._loadingPromises.delete(moduleName);
      throw error;
    }
  }

  /**
   * Internal method to load a specific module
   * @private
   */
  async _loadModule(moduleName) {
    switch (moduleName) {
      case 'chalk': {
        return (await import('chalk')).default;
      }
      case 'ora': {
        return (await import('ora')).default;
      }
      case 'inquirer': {
        return (await import('inquirer')).default;
      }
      case 'glob': {
        return (await import('glob')).glob;
      }
      case 'globSync': {
        return (await import('glob')).globSync;
      }
      default: {
        throw new Error(`Unknown module: ${moduleName}`);
      }
    }
  }

  /**
   * Clear the module cache to free memory
   */
  clearCache() {
    this._cache.clear();
    this._loadingPromises.clear();
  }

  /**
   * Get multiple modules at once
   * @param {string[]} moduleNames - Array of module names
   * @returns {Promise<Object>} Object with module names as keys
   */
  async getModules(moduleNames) {
    const modules = await Promise.all(moduleNames.map((name) => this.getModule(name)));

    return moduleNames.reduce((accumulator, name, index) => {
      accumulator[name] = modules[index];
      return accumulator;
    }, {});
  }
}

// Singleton instance
const moduleManager = new ModuleManager();

module.exports = moduleManager;
