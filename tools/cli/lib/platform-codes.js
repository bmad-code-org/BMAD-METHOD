const fs = require('fs-extra');
const path = require('node:path');
const yaml = require('yaml');
const { getProjectRoot } = require('./project-root');

/**
 * Platform Codes Manager
 * Loads and provides access to the centralized platform codes configuration
 */
class PlatformCodes {
  constructor() {
    this.configPath = path.join(getProjectRoot(), 'tools', 'platform-codes.yaml');
    this.loadConfig();
  }

  /**
   * Load the platform codes configuration
   */
  loadConfig() {
    try {
      if (fs.existsSync(this.configPath)) {
        const content = fs.readFileSync(this.configPath, 'utf8');
        this.config = yaml.parse(content);
      } else {
        console.warn(`Platform codes config not found at ${this.configPath}`);
        this.config = { platforms: {} };
      }
    } catch (error) {
      console.error(`Error loading platform codes: ${error.message}`);
      this.config = { platforms: {} };
    }
  }

  /**
   * Get all platform codes
   * @returns {Object} All platform configurations
   */
  getAllPlatforms() {
    return this.config.platforms || {};
  }

  /**
   * Get a specific platform configuration
   * @param {string} code - Platform code
   * @returns {Object|null} Platform configuration or null if not found
   */
  getPlatform(code) {
    return this.config.platforms[code] || null;
  }

  /**
   * Check if a platform code is valid
   * @param {string} code - Platform code to validate
   * @returns {boolean} True if valid
   */
  isValidPlatform(code) {
    return code in this.config.platforms;
  }

  /**
   * Get all preferred platforms
   * @returns {Array} Array of preferred platform codes
   */
  getPreferredPlatforms() {
    return Object.entries(this.config.platforms)
      .filter(([, config]) => config.preferred)
      .map(([code]) => code);
  }

  /**
   * Get platforms by category
   * @param {string} category - Category to filter by
   * @returns {Array} Array of platform codes in the category
   */
  getPlatformsByCategory(category) {
    return Object.entries(this.config.platforms)
      .filter(([, config]) => config.category === category)
      .map(([code]) => code);
  }

  /**
   * Get platform display name
   * @param {string} code - Platform code
   * @returns {string} Display name or code if not found
   */
  getDisplayName(code) {
    const platform = this.getPlatform(code);
    return platform ? platform.name : code;
  }

  /**
   * Validate platform code format
   * @param {string} code - Platform code to validate
   * @returns {boolean} True if format is valid
   */
  isValidFormat(code) {
    const conventions = this.config.conventions || {};
    const pattern = conventions.allowed_characters || 'a-z0-9-';
    const maxLength = conventions.max_code_length || 20;

    const regex = new RegExp(`^[${pattern}]+$`);
    return regex.test(code) && code.length <= maxLength;
  }

  /**
   * Get all platform codes as array
   * @returns {Array} Array of platform codes
   */
  getCodes() {
    return Object.keys(this.config.platforms);
  }
  config = null;
}

// Export singleton instance
module.exports = new PlatformCodes();
