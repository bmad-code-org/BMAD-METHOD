const os = require('node:os');
const fs = require('fs-extra');
const yaml = require('yaml');
const prompts = require('./prompts');
const { getModulePath } = require('./project-root');

let cachedCoreConfigDefaults = null;

function getFallbackUsername() {
  let safeUsername;
  try {
    safeUsername = os.userInfo().username;
  } catch {
    safeUsername = process.env.USER || process.env.USERNAME || 'User';
  }

  if (typeof safeUsername !== 'string' || safeUsername.trim() === '') {
    return 'User';
  }

  const normalizedUsername = safeUsername.trim();
  return normalizedUsername.charAt(0).toUpperCase() + normalizedUsername.slice(1);
}

function normalizeDefaultString(value, fallback) {
  return typeof value === 'string' && value.trim() !== '' ? value.trim() : fallback;
}

function isMissingOrUnresolvedCoreConfigValue(value) {
  return value == null || (typeof value === 'string' && (value.trim() === '' || /^\{[^}]+\}$/.test(value.trim())));
}

function applyDefaultCoreConfig(coreConfig = {}, defaults = {}) {
  const normalizedConfig = { ...coreConfig };
  let appliedDefaults = false;

  for (const [key, value] of Object.entries(defaults)) {
    if (isMissingOrUnresolvedCoreConfigValue(normalizedConfig[key])) {
      normalizedConfig[key] = value;
      appliedDefaults = true;
    }
  }

  return { coreConfig: normalizedConfig, appliedDefaults };
}

async function getDefaultCoreConfig() {
  if (cachedCoreConfigDefaults) {
    return { ...cachedCoreConfigDefaults };
  }

  const fallbackDefaults = {
    user_name: getFallbackUsername(),
    communication_language: 'English',
    document_output_language: 'English',
    output_folder: '_bmad-output',
  };

  try {
    const moduleYamlPath = getModulePath('core', 'module.yaml');
    const moduleConfig = yaml.parse(await fs.readFile(moduleYamlPath, 'utf8')) || {};

    cachedCoreConfigDefaults = {
      user_name: normalizeDefaultString(moduleConfig.user_name?.default, fallbackDefaults.user_name),
      communication_language: normalizeDefaultString(moduleConfig.communication_language?.default, fallbackDefaults.communication_language),
      document_output_language: normalizeDefaultString(
        moduleConfig.document_output_language?.default,
        fallbackDefaults.document_output_language,
      ),
      output_folder: normalizeDefaultString(moduleConfig.output_folder?.default, fallbackDefaults.output_folder),
    };
  } catch (error) {
    await prompts.log.warn(`Failed to load module.yaml, falling back to defaults: ${error.message}`);
    cachedCoreConfigDefaults = fallbackDefaults;
  }

  return { ...cachedCoreConfigDefaults };
}

function clearCoreConfigDefaultsCache() {
  cachedCoreConfigDefaults = null;
}

module.exports = {
  applyDefaultCoreConfig,
  clearCoreConfigDefaultsCache,
  getDefaultCoreConfig,
  isMissingOrUnresolvedCoreConfigValue,
};
