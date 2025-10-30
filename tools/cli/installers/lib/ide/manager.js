const fs = require('fs-extra');
const path = require('node:path');
const chalk = require('chalk');

/**
 * IDE Manager - handles IDE-specific setup
 * Dynamically discovers and loads IDE handlers
 */
class IdeManager {
  constructor() {
    this.handlers = new Map();
    this.loadHandlers();
  }

  /**
   * Dynamically load all IDE handlers from directory
   */
  loadHandlers() {
    const ideDir = __dirname;

    try {
      // Get all JS files in the IDE directory
      const files = fs.readdirSync(ideDir).filter((file) => {
        // Skip base class, manager, utility files (starting with _), and helper modules
        return file.endsWith('.js') && !file.startsWith('_') && file !== 'manager.js' && file !== 'workflow-command-generator.js';
      });

      // Sort alphabetically for consistent ordering
      files.sort();

      for (const file of files) {
        const moduleName = path.basename(file, '.js');

        try {
          const modulePath = path.join(ideDir, file);
          const HandlerModule = require(modulePath);

          // Get the first exported class (handles various export styles)
          const HandlerClass = HandlerModule.default || HandlerModule[Object.keys(HandlerModule)[0]];

          if (HandlerClass) {
            const instance = new HandlerClass();
            // Use the name property from the instance (set in constructor)
            this.handlers.set(instance.name, instance);
          }
        } catch (error) {
          console.log(chalk.yellow(`  Warning: Could not load ${moduleName}: ${error.message}`));
        }
      }
    } catch (error) {
      console.error(chalk.red('Failed to load IDE handlers:'), error.message);
    }
  }

  /**
   * Get all available IDEs with their metadata
   * @returns {Array} Array of IDE information objects
   */
  getAvailableIdes() {
    const ides = [];

    for (const [key, handler] of this.handlers) {
      ides.push({
        value: key,
        name: handler.displayName || handler.name || key,
        preferred: handler.preferred || false,
      });
    }

    // Sort: preferred first, then alphabetical
    ides.sort((a, b) => {
      if (a.preferred && !b.preferred) return -1;
      if (!a.preferred && b.preferred) return 1;
      // Ensure both names exist before comparing
      const nameA = a.name || '';
      const nameB = b.name || '';
      return nameA.localeCompare(nameB);
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

  getHandler(ideName) {
    return this.handlers.get((ideName || '').toLowerCase());
  }

  getDisplayName(ideName) {
    const handler = this.getHandler(ideName);
    return handler?.displayName || handler?.name || ideName;
  }

  getStateDir(bmadDir) {
    return path.join(bmadDir, '_cfg', 'ide-state');
  }

  getStatePath(bmadDir, ideName) {
    return path.join(this.getStateDir(bmadDir), `${ideName}.json`);
  }

  async loadPersistedConfig(ideName, bmadDir) {
    try {
      const statePath = this.getStatePath(bmadDir, ideName.toLowerCase());
      if (!(await fs.pathExists(statePath))) {
        return null;
      }
      return await fs.readJson(statePath);
    } catch {
      return null;
    }
  }

  async savePersistedConfig(ideName, bmadDir, config) {
    const stateDir = this.getStateDir(bmadDir);
    await fs.ensureDir(stateDir);

    const statePath = this.getStatePath(bmadDir, ideName.toLowerCase());

    if (config === null || config === undefined) {
      if (await fs.pathExists(statePath)) {
        await fs.remove(statePath);
      }
      return;
    }

    await fs.writeJson(statePath, config, { spaces: 2 });
  }

  /**
   * Setup IDE configuration
   * @param {string} ideName - Name of the IDE
   * @param {string} projectDir - Project directory
   * @param {string} bmadDir - BMAD installation directory
   * @param {Object} options - Setup options
   */
  async setup(ideName, projectDir, bmadDir, options = {}) {
    const handler = this.getHandler(ideName);

    if (!handler) {
      console.warn(chalk.yellow(`⚠️  IDE '${ideName}' is not yet supported`));
      console.log(chalk.dim('Supported IDEs:', [...this.handlers.keys()].join(', ')));
      return { success: false, reason: 'unsupported' };
    }

    try {
      const handlerOptions = {
        ...options,
        mode: options.mode || 'install',
      };
      const result = (await handler.setup(projectDir, bmadDir, handlerOptions)) || {};
      const payload = typeof result === 'object' && result !== null ? result : {};
      const success = typeof payload.success === 'boolean' ? payload.success : true;

      return {
        ide: ideName,
        ...payload,
        success,
      };
    } catch (error) {
      console.error(chalk.red(`Failed to setup ${ideName}:`), error.message);
      return { success: false, error: error.message };
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
}

module.exports = { IdeManager };
