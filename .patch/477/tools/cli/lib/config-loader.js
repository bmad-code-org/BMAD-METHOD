/**
 * Manifest Configuration Loader
 * Handles loading, caching, and accessing manifest configuration
 * File: tools/cli/lib/config-loader.js
 */

const fs = require('fs-extra');
const yaml = require('js-yaml');
const path = require('node:path');

/**
 * ManifestConfigLoader
 * Loads and caches manifest configuration files
 */
class ManifestConfigLoader {
  constructor() {}

  /**
   * Load manifest configuration from YAML file
   * @param {string} manifestPath - Path to manifest file
   * @returns {Promise<Object>} Loaded configuration object
   * @throws {Error} If YAML is invalid
   */
  async loadManifest(manifestPath) {
    try {
      // Return cached config if same path
      if (this.manifestPath === manifestPath && this.config !== null) {
        return this.config;
      }

      // Check if file exists
      if (!fs.existsSync(manifestPath)) {
        this.config = {};
        this.manifestPath = manifestPath;
        return this.config;
      }

      // Read and parse YAML
      const fileContent = fs.readFileSync(manifestPath, 'utf8');
      const parsed = yaml.load(fileContent);

      // Cache the configuration
      this.config = parsed || {};
      this.manifestPath = manifestPath;

      return this.config;
    } catch (error) {
      // Re-throw parsing errors
      if (error instanceof yaml.YAMLException) {
        throw new TypeError(`Invalid YAML in manifest: ${error.message}`);
      }
      throw error;
    }
  }

  /**
   * Get configuration value by key
   * Supports nested keys using dot notation (e.g., "nested.key")
   * @param {string} key - Configuration key
   * @param {*} defaultValue - Default value if key not found
   * @returns {*} Configuration value or default
   */
  getConfig(key, defaultValue) {
    if (this.config === null) {
      return defaultValue;
    }

    // Handle nested keys with dot notation
    const keys = key.split('.');
    let value = this.config;

    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        return defaultValue;
      }
    }

    return value;
  }

  /**
   * Check if configuration key exists
   * @param {string} key - Configuration key
   * @returns {boolean} True if key exists
   */
  hasConfig(key) {
    if (this.config === null) {
      return false;
    }

    // Handle nested keys with dot notation
    const keys = key.split('.');
    let value = this.config;

    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        return false;
      }
    }

    return true;
  }

  /**
   * Clear cached configuration
   */
  clearCache() {
    this.config = null;
    this.manifestPath = null;
  }
  config = null;
  manifestPath = null;
}

module.exports = { ManifestConfigLoader };
