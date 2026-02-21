const fs = require('fs-extra');
const path = require('node:path');
const yaml = require('yaml');
const prompts = require('../../../lib/prompts');

/**
 * Manages external official modules defined in external-official-modules.yaml
 * These are modules hosted in external repositories that can be installed
 *
 * @class ExternalModuleManager
 */
class ExternalModuleManager {
  constructor() {
    this.externalModulesConfigPath = path.join(__dirname, '../../../external-official-modules.yaml');
    this.cachedModules = null;
  }

  /**
   * Load and parse the external-official-modules.yaml file
   * @returns {Object} Parsed YAML content with modules object
   */
  async loadExternalModulesConfig() {
    if (this.cachedModules) {
      return this.cachedModules;
    }

    try {
      const content = await fs.readFile(this.externalModulesConfigPath, 'utf8');
      const config = yaml.parse(content);
      this.cachedModules = config;
      return config;
    } catch (error) {
      await prompts.log.warn(`Failed to load external modules config: ${error.message}`);
      return { modules: {} };
    }
  }

  /**
   * Get list of available external modules
   * @returns {Array<Object>} Array of module info objects
   */
  async listAvailable() {
    const config = await this.loadExternalModulesConfig();
    const modules = [];

    for (const [key, moduleConfig] of Object.entries(config.modules || {})) {
      modules.push({
        key,
        url: moduleConfig.url,
        moduleDefinition: moduleConfig['module-definition'],
        code: moduleConfig.code,
        name: moduleConfig.name,
        header: moduleConfig.header,
        subheader: moduleConfig.subheader,
        description: moduleConfig.description || '',
        defaultSelected: moduleConfig.defaultSelected === true,
        type: moduleConfig.type || 'community', // bmad-org or community
        npmPackage: moduleConfig.npmPackage || null, // Include npm package name
        isExternal: true,
      });
    }

    return modules;
  }

  /**
   * Get module info by code
   * @param {string} code - The module code (e.g., 'cis')
   * @returns {Object|null} Module info or null if not found
   */
  async getModuleByCode(code) {
    const modules = await this.listAvailable();
    return modules.find((m) => m.code === code) || null;
  }

  /**
   * Get module info by key
   * @param {string} key - The module key (e.g., 'bmad-creative-intelligence-suite')
   * @returns {Object|null} Module info or null if not found
   */
  async getModuleByKey(key) {
    const config = await this.loadExternalModulesConfig();
    const moduleConfig = config.modules?.[key];

    if (!moduleConfig) {
      return null;
    }

    return {
      key,
      url: moduleConfig.url,
      moduleDefinition: moduleConfig['module-definition'],
      code: moduleConfig.code,
      name: moduleConfig.name,
      header: moduleConfig.header,
      subheader: moduleConfig.subheader,
      description: moduleConfig.description || '',
      defaultSelected: moduleConfig.defaultSelected === true,
      type: moduleConfig.type || 'community', // bmad-org or community
      npmPackage: moduleConfig.npmPackage || null, // Include npm package name
      isExternal: true,
    };
  }

  /**
   * Check if a module code exists in external modules
   * @param {string} code - The module code to check
   * @returns {boolean} True if the module exists
   */
  async hasModule(code) {
    const module = await this.getModuleByCode(code);
    return module !== null;
  }

  /**
   * Get the URL for a module by code
   * @param {string} code - The module code
   * @returns {string|null} The URL or null if not found
   */
  async getModuleUrl(code) {
    const module = await this.getModuleByCode(code);
    return module ? module.url : null;
  }

  /**
   * Get the module definition path for a module by code
   * @param {string} code - The module code
   * @returns {string|null} The module definition path or null if not found
   */
  async getModuleDefinition(code) {
    const module = await this.getModuleByCode(code);
    return module ? module.moduleDefinition : null;
  }
}

module.exports = { ExternalModuleManager };
