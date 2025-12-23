const os = require('node:os');

/**
 * Environment Variable Resolver
 *
 * Resolves configuration values from environment variables
 * with fallbacks to system defaults.
 */

/**
 * Get user name from environment variables
 * Tries USER, USERNAME, LOGNAME in order, falls back to system username or 'User'
 * @returns {string} User name
 */
function getUserName() {
  // Try common environment variables
  const envUser = process.env.USER || process.env.USERNAME || process.env.LOGNAME;

  if (envUser) {
    return envUser;
  }

  // Try Node.js os.userInfo()
  try {
    const userInfo = os.userInfo();
    if (userInfo.username) {
      return userInfo.username;
    }
  } catch {
    // os.userInfo() can fail in some environments
  }

  // Final fallback
  return 'User';
}

/**
 * Get system language from environment variables
 * Tries LANG, LC_ALL, falls back to 'English'
 * @returns {string} Language name
 */
function getSystemLanguage() {
  const lang = process.env.LANG || process.env.LC_ALL;

  if (!lang) {
    return 'English';
  }

  // Parse language from locale string (e.g., 'en_US.UTF-8' -> 'English')
  const langCode = lang.split('_')[0].toLowerCase();

  // Map common language codes to full names
  const languageMap = {
    en: 'English',
    es: 'Spanish',
    fr: 'French',
    de: 'German',
    it: 'Italian',
    pt: 'Portuguese',
    ru: 'Russian',
    ja: 'Japanese',
    zh: 'Chinese',
    ko: 'Korean',
    ar: 'Arabic',
    hi: 'Hindi',
  };

  return languageMap[langCode] || 'English';
}

/**
 * Get home directory from environment
 * @returns {string} Home directory path
 */
function getHomeDirectory() {
  return process.env.HOME || process.env.USERPROFILE || os.homedir();
}

/**
 * Resolve a config value with priority: CLI > ENV > default
 * @param {*} cliValue - Value from CLI argument
 * @param {string} envVar - Environment variable name to check
 * @param {*} defaultValue - Default value if neither CLI nor ENV is set
 * @returns {*} Resolved value
 */
function resolveValue(cliValue, envVar, defaultValue) {
  // CLI value has highest priority
  if (cliValue !== undefined && cliValue !== null) {
    return cliValue;
  }

  // Try environment variable
  if (envVar && process.env[envVar]) {
    return process.env[envVar];
  }

  // Use default
  return defaultValue;
}

/**
 * Get all environment-based defaults
 * @returns {Object} Default config values from environment
 */
function getEnvironmentDefaults() {
  return {
    userName: getUserName(),
    communicationLanguage: getSystemLanguage(),
    documentLanguage: getSystemLanguage(),
    homeDirectory: getHomeDirectory(),
  };
}

module.exports = {
  getUserName,
  getSystemLanguage,
  getHomeDirectory,
  resolveValue,
  getEnvironmentDefaults,
};
