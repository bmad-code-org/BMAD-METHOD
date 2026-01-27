const fs = require('fs-extra');
const path = require('node:path');
const yaml = require('yaml');

const PLATFORM_CODES_PATH = path.join(__dirname, 'platform-codes.yaml');

let _cachedPlatformCodes = null;

/**
 * Load the platform codes configuration from YAML
 * @returns {Object} Platform codes configuration
 */
async function loadPlatformCodes() {
  if (_cachedPlatformCodes) {
    return _cachedPlatformCodes;
  }

  if (!(await fs.pathExists(PLATFORM_CODES_PATH))) {
    throw new Error(`Platform codes configuration not found at: ${PLATFORM_CODES_PATH}`);
  }

  const content = await fs.readFile(PLATFORM_CODES_PATH, 'utf8');
  _cachedPlatformCodes = yaml.parse(content);
  return _cachedPlatformCodes;
}

/**
 * Get platform information by code
 * @param {string} platformCode - Platform code (e.g., 'claude-code', 'cursor')
 * @returns {Object|null} Platform info or null if not found
 */
function getPlatformInfo(platformCode) {
  if (!_cachedPlatformCodes) {
    throw new Error('Platform codes not loaded. Call loadPlatformCodes() first.');
  }

  return _cachedPlatformCodes.platforms[platformCode] || null;
}

/**
 * Get all preferred platforms
 * @returns {Promise<Array>} Array of preferred platform codes
 */
async function getPreferredPlatforms() {
  const config = await loadPlatformCodes();
  return Object.entries(config.platforms)
    .filter(([_, info]) => info.preferred)
    .map(([code, _]) => code);
}

/**
 * Get all platform codes by category
 * @param {string} category - Category to filter by (ide, cli, tool, etc.)
 * @returns {Promise<Array>} Array of platform codes in the category
 */
async function getPlatformsByCategory(category) {
  const config = await loadPlatformCodes();
  return Object.entries(config.platforms)
    .filter(([_, info]) => info.category === category)
    .map(([code, _]) => code);
}

/**
 * Get all platforms with installer config
 * @returns {Promise<Array>} Array of platform codes that have installer config
 */
async function getConfigDrivenPlatforms() {
  const config = await loadPlatformCodes();
  return Object.entries(config.platforms)
    .filter(([_, info]) => info.installer)
    .map(([code, _]) => code);
}

/**
 * Get platforms that use custom installers (no installer config)
 * @returns {Promise<Array>} Array of platform codes with custom installers
 */
async function getCustomInstallerPlatforms() {
  const config = await loadPlatformCodes();
  return Object.entries(config.platforms)
    .filter(([_, info]) => !info.installer)
    .map(([code, _]) => code);
}

/**
 * Clear the cached platform codes (useful for testing)
 */
function clearCache() {
  _cachedPlatformCodes = null;
}

module.exports = {
  loadPlatformCodes,
  getPlatformInfo,
  getPreferredPlatforms,
  getPlatformsByCategory,
  getConfigDrivenPlatforms,
  getCustomInstallerPlatforms,
  clearCache,
};
