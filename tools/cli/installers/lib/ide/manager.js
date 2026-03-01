const fs = require('fs-extra');
const path = require('node:path');
const chalk = require('chalk');

/**
 * IDE Manager - handles IDE-specific setup for WDS
 * Dynamically discovers and loads IDE handlers
 */
class IdeManager {
  constructor() {
    this.handlers = new Map();
    this.loadHandlers();
    this.wdsFolderName = '_bmad/wds'; // Default, can be overridden
  }

  /**
   * Set the WDS folder name for all IDE handlers
   * @param {string} wdsFolderName - The WDS folder name
   */
  setWdsFolderName(wdsFolderName) {
    this.wdsFolderName = wdsFolderName;
    // Update all loaded handlers
    for (const handler of this.handlers.values()) {
      if (typeof handler.setWdsFolderName === 'function') {
        handler.setWdsFolderName(wdsFolderName);
      }
    }
  }

  /**
   * Dynamically load all IDE handlers from directory
   */
  loadHandlers() {
    const ideDir = __dirname;

    try {
      // Get all JS files in the IDE directory
      const files = fs.readdirSync(ideDir).filter((file) => {
        // Skip base class, manager, and utility files (starting with _)
        return file.endsWith('.js') && !file.startsWith('_') && file !== 'manager.js';
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
            // Only add if the instance has a valid name
            if (instance.name && typeof instance.name === 'string') {
              this.handlers.set(instance.name, instance);
            } else {
              console.log(chalk.yellow(`  Warning: ${moduleName} handler missing valid 'name' property`));
            }
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
      // Skip handlers without valid names
      const name = handler.displayName || handler.name || key;

      // Filter out invalid entries
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
   * Setup IDE integrations for selected IDEs
   * Main method called by installer
   * @param {string} projectDir - Project directory
   * @param {string} wdsDir - WDS installation directory
   * @param {Array<string>} selectedIdes - List of IDE names to setup
   * @param {Object} options - Setup options (logger, etc.)
   * @returns {Object} Results object with success/failure counts
   */
  async setup(projectDir, wdsDir, selectedIdes, options = {}) {
    const results = {
      success: [],
      failed: [],
      skipped: [],
    };

    const logger = options.logger || console;

    // Set WDS folder name if provided
    if (options.wdsFolderName) {
      this.setWdsFolderName(options.wdsFolderName);
    }

    for (const ideName of selectedIdes) {
      const handler = this.handlers.get(ideName.toLowerCase());

      if (!handler) {
        logger.warn(chalk.yellow(`  ⚠ IDE '${ideName}' is not yet supported`));
        results.skipped.push({ ide: ideName, reason: 'unsupported' });
        continue;
      }

      try {
        logger.log(chalk.dim(`  Setting up ${handler.displayName || ideName}...`));
        await handler.setup(projectDir, wdsDir, options);
        results.success.push(ideName);
        logger.log(chalk.green(`  ✓ ${handler.displayName || ideName} configured`));
      } catch (error) {
        logger.warn(chalk.yellow(`  ⚠ Failed to setup ${ideName}: ${error.message}`));
        results.failed.push({ ide: ideName, error: error.message });
      }
    }

    // Log summary
    if (results.success.length > 0) {
      logger.log(chalk.dim(`  Configured ${results.success.length} IDE(s)`));
    }

    if (results.failed.length > 0) {
      logger.warn(chalk.yellow(`  ${results.failed.length} IDE(s) failed to configure`));
    }

    return results;
  }

  /**
   * Cleanup IDE configurations
   * @param {string} projectDir - Project directory
   * @returns {Array} Results for each IDE
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
   * Detect installed IDEs in project
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
