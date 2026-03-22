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
 * Clear the cached platform codes (useful for testing)
 */
function clearCache() {
  _cachedPlatformCodes = null;
}

module.exports = {
  loadPlatformCodes,
  clearCache,
};
