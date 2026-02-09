const fs = require('fs-extra');
const path = require('node:path');
const { BMAD_FOLDER_NAME } = require('./shared/path-utils');
const prompts = require('../../../lib/prompts');

/**
 * IDE Manager - handles IDE-specific setup
 * Dynamically discovers and loads IDE handlers
 *
 * Loading strategy:
 * 1. Custom installer files (codex.js, github-copilot.js, kilo.js) - for platforms with unique installation logic
 * 2. Config-driven handlers (from platform-codes.yaml) - for standard IDE installation patterns
 */
class IdeManager {
  constructor() {
    this.handlers = new Map();
    this._initialized = false;
    this.bmadFolderName = BMAD_FOLDER_NAME; // Default, can be overridden
  }

  /**
   * Set the bmad folder name for all IDE handlers
   * @param {string} bmadFolderName - The bmad folder name
   */
  setBmadFolderName(bmadFolderName) {
    this.bmadFolderName = bmadFolderName;
    // Update all loaded handlers
    for (const handler of this.handlers.values()) {
      if (typeof handler.setBmadFolderName === 'function') {
        handler.setBmadFolderName(bmadFolderName);
      }
    }
  }

  /**
   * Ensure handlers are loaded (lazy loading)
   */
  async ensureInitialized() {
    if (!this._initialized) {
      await this.loadHandlers();
      this._initialized = true;
    }
  }

  /**
   * Dynamically load all IDE handlers
   * 1. Load custom installer files first (codex.js, github-copilot.js, kilo.js)
   * 2. Load config-driven handlers from platform-codes.yaml
   */
  async loadHandlers() {
    // Load custom installer files
    await this.loadCustomInstallerFiles();

    // Load config-driven handlers from platform-codes.yaml
    await this.loadConfigDrivenHandlers();
  }

  /**
   * Load custom installer files (unique installation logic)
   * These files have special installation patterns that don't fit the config-driven model
   */
  async loadCustomInstallerFiles() {
    const ideDir = __dirname;
    const customFiles = ['codex.js', 'github-copilot.js', 'kilo.js'];

    for (const file of customFiles) {
      const filePath = path.join(ideDir, file);
      if (!fs.existsSync(filePath)) continue;

      try {
        const HandlerModule = require(filePath);
        const HandlerClass = HandlerModule.default || Object.values(HandlerModule)[0];

        if (HandlerClass) {
          const instance = new HandlerClass();
          if (instance.name && typeof instance.name === 'string') {
            if (typeof instance.setBmadFolderName === 'function') {
              instance.setBmadFolderName(this.bmadFolderName);
            }
            this.handlers.set(instance.name, instance);
          }
        }
      } catch (error) {
        await prompts.log.warn(`Warning: Could not load ${file}: ${error.message}`);
      }
    }
  }

  /**
   * Load config-driven handlers from platform-codes.yaml
   * This creates ConfigDrivenIdeSetup instances for platforms with installer config
   */
  async loadConfigDrivenHandlers() {
    const { loadPlatformCodes } = require('./platform-codes');
    const platformConfig = await loadPlatformCodes();

    const { ConfigDrivenIdeSetup } = require('./_config-driven');

    for (const [platformCode, platformInfo] of Object.entries(platformConfig.platforms)) {
      // Skip if already loaded by custom installer
      if (this.handlers.has(platformCode)) continue;

      // Skip if no installer config (platform may not need installation)
      if (!platformInfo.installer) continue;

      const handler = new ConfigDrivenIdeSetup(platformCode, platformInfo);
      if (typeof handler.setBmadFolderName === 'function') {
        handler.setBmadFolderName(this.bmadFolderName);
      }
      this.handlers.set(platformCode, handler);
    }
  }

  /**
   * Get all available IDEs with their metadata
   * @returns {Array} Array of IDE information objects
   */
  getAvailableIdes() {
    const ides = [];

    for (const [key, handler] of this.handlers) {
      // Skip handlers without valid names
      const name = handler.displayName || handler.name || key;

      // Filter out invalid entries (undefined name, empty key, etc.)
      if (!key || !name || typeof key !== 'string' || typeof name !== 'string') {
        continue;
      }

      ides.push({
        value: key,
        name: name,
        preferred: handler.preferred || false,
      });
    }

    // Sort: preferred first, then alphabetical
    ides.sort((a, b) => {
      if (a.preferred && !b.preferred) return -1;
      if (!a.preferred && b.preferred) return 1;
      return a.name.localeCompare(b.name);
    });

    return ides;
  }

  /**
   * Get preferred IDEs
   * @returns {Array} Array of preferred IDE information
   */
  getPreferredIdes() {
    return this.getAvailableIdes().filter((ide) => ide.preferred);
  }

  /**
   * Get non-preferred IDEs
   * @returns {Array} Array of non-preferred IDE information
   */
  getOtherIdes() {
    return this.getAvailableIdes().filter((ide) => !ide.preferred);
  }

  /**
   * Setup IDE configuration
   * @param {string} ideName - Name of the IDE
   * @param {string} projectDir - Project directory
   * @param {string} bmadDir - BMAD installation directory
   * @param {Object} options - Setup options
   */
  async setup(ideName, projectDir, bmadDir, options = {}) {
    const handler = this.handlers.get(ideName.toLowerCase());

    if (!handler) {
      await prompts.log.warn(`IDE '${ideName}' is not yet supported`);
      await prompts.log.message(`Supported IDEs: ${[...this.handlers.keys()].join(', ')}`);
      return { success: false, ide: ideName, error: 'unsupported IDE' };
    }

    try {
      const handlerResult = await handler.setup(projectDir, bmadDir, options);
      // Build detail string from handler-returned data
      let detail = '';
      if (handlerResult && handlerResult.results) {
        // Config-driven handlers return { success, results: { agents, workflows, tasks, tools } }
        const r = handlerResult.results;
        const parts = [];
        if (r.agents > 0) parts.push(`${r.agents} agents`);
        if (r.workflows > 0) parts.push(`${r.workflows} workflows`);
        if (r.tasks > 0) parts.push(`${r.tasks} tasks`);
        if (r.tools > 0) parts.push(`${r.tools} tools`);
        detail = parts.join(', ');
      } else if (handlerResult && handlerResult.counts) {
        // Codex handler returns { success, counts: { agents, workflows, tasks }, written }
        const c = handlerResult.counts;
        const parts = [];
        if (c.agents > 0) parts.push(`${c.agents} agents`);
        if (c.workflows > 0) parts.push(`${c.workflows} workflows`);
        if (c.tasks > 0) parts.push(`${c.tasks} tasks`);
        detail = parts.join(', ');
      } else if (handlerResult && handlerResult.modes !== undefined) {
        // Kilo handler returns { success, modes, workflows, tasks, tools }
        const parts = [];
        if (handlerResult.modes > 0) parts.push(`${handlerResult.modes} modes`);
        if (handlerResult.workflows > 0) parts.push(`${handlerResult.workflows} workflows`);
        if (handlerResult.tasks > 0) parts.push(`${handlerResult.tasks} tasks`);
        if (handlerResult.tools > 0) parts.push(`${handlerResult.tools} tools`);
        detail = parts.join(', ');
      }
      return { success: true, ide: ideName, detail, handlerResult };
    } catch (error) {
      await prompts.log.error(`Failed to setup ${ideName}: ${error.message}`);
      return { success: false, ide: ideName, error: error.message };
    }
  }

  /**
   * Cleanup IDE configurations
   * @param {string} projectDir - Project directory
   */
  async cleanup(projectDir) {
    const results = [];

    for (const [name, handler] of this.handlers) {
      try {
        await handler.cleanup(projectDir);
        results.push({ ide: name, success: true });
      } catch (error) {
        results.push({ ide: name, success: false, error: error.message });
      }
    }

    return results;
  }

  /**
   * Get list of supported IDEs
   * @returns {Array} List of supported IDE names
   */
  getSupportedIdes() {
    return [...this.handlers.keys()];
  }

  /**
   * Check if an IDE is supported
   * @param {string} ideName - Name of the IDE
   * @returns {boolean} True if IDE is supported
   */
  isSupported(ideName) {
    return this.handlers.has(ideName.toLowerCase());
  }

  /**
   * Detect installed IDEs
   * @param {string} projectDir - Project directory
   * @returns {Array} List of detected IDEs
   */
  async detectInstalledIdes(projectDir) {
    const detected = [];

    for (const [name, handler] of this.handlers) {
      if (typeof handler.detect === 'function' && (await handler.detect(projectDir))) {
        detected.push(name);
      }
    }

    return detected;
  }

  /**
   * Install custom agent launchers for specified IDEs
   * @param {Array} ides - List of IDE names to install for
   * @param {string} projectDir - Project directory
   * @param {string} agentName - Agent name (e.g., "fred-commit-poet")
   * @param {string} agentPath - Path to compiled agent (relative to project root)
   * @param {Object} metadata - Agent metadata
   * @returns {Object} Results for each IDE
   */
  async installCustomAgentLaunchers(ides, projectDir, agentName, agentPath, metadata) {
    const results = {};

    for (const ideName of ides) {
      const handler = this.handlers.get(ideName.toLowerCase());

      if (!handler) {
        await prompts.log.warn(`IDE '${ideName}' is not yet supported for custom agent installation`);
        continue;
      }

      try {
        if (typeof handler.installCustomAgentLauncher === 'function') {
          const result = await handler.installCustomAgentLauncher(projectDir, agentName, agentPath, metadata);
          if (result) {
            results[ideName] = result;
          }
        }
      } catch (error) {
        await prompts.log.warn(`Failed to install ${ideName} launcher: ${error.message}`);
      }
    }

    return results;
  }
}

module.exports = { IdeManager };
