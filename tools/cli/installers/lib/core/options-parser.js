const { getProfile } = require('../profiles/definitions');

/**
 * CLI Options Parser
 *
 * Parses and normalizes CLI options for non-interactive installation.
 * Handles profiles, comma-separated lists, special values, and validation.
 */

/**
 * Parse comma-separated list into array
 * @param {string|undefined} value - Comma-separated string or undefined
 * @returns {string[]|null} Array of trimmed values or null if undefined
 */
function parseList(value) {
  if (!value) {
    return null;
  }

  if (typeof value !== 'string') {
    return null;
  }

  return value
    .split(',')
    .map((item) => item.trim())
    .filter((item) => item.length > 0);
}

/**
 * Check if value is a special keyword
 * @param {string|string[]|null} value - Value to check
 * @returns {boolean} True if special keyword (all, none, minimal)
 */
function isSpecialValue(value) {
  if (Array.isArray(value) && value.length === 1) {
    value = value[0];
  }

  return value === 'all' || value === 'none' || value === 'minimal';
}

/**
 * Separate additive (+) and subtractive (-) modifiers from list
 * @param {string[]} list - Array of items, some may have +/- prefix
 * @returns {Object} { base: [], add: [], remove: [] }
 */
function separateModifiers(list) {
  const result = {
    base: [],
    add: [],
    remove: [],
  };

  if (!list || !Array.isArray(list)) {
    return result;
  }

  for (const item of list) {
    if (item.startsWith('+')) {
      result.add.push(item.slice(1));
    } else if (item.startsWith('-')) {
      result.remove.push(item.slice(1));
    } else {
      result.base.push(item);
    }
  }

  return result;
}

/**
 * Apply modifiers to a base list (additive/subtractive)
 * @param {string[]} baseList - Base list of items
 * @param {string[]} add - Items to add
 * @param {string[]} remove - Items to remove
 * @returns {string[]} Modified list
 */
function applyModifiers(baseList, add = [], remove = []) {
  let result = [...baseList];

  // Add items
  for (const item of add) {
    if (!result.includes(item)) {
      result.push(item);
    }
  }

  // Remove items
  for (const item of remove) {
    result = result.filter((i) => i !== item);
  }

  return result;
}

/**
 * Parse and normalize CLI options
 * @param {Object} cliOptions - Raw CLI options from commander
 * @returns {Object} Normalized options
 */
function parseOptions(cliOptions) {
  const normalized = {
    nonInteractive: cliOptions.nonInteractive || false,
    userName: cliOptions.userName,
    skillLevel: cliOptions.skillLevel,
    outputFolder: cliOptions.outputFolder,
    communicationLanguage: cliOptions.communicationLanguage,
    documentLanguage: cliOptions.documentLanguage,
    modules: parseList(cliOptions.modules),
    agents: parseList(cliOptions.agents),
    workflows: parseList(cliOptions.workflows),
    team: cliOptions.team,
    profile: cliOptions.profile,
  };

  // Expand profile if provided
  if (normalized.profile) {
    const profile = getProfile(normalized.profile);
    if (!profile) {
      throw new Error(`Unknown profile: ${normalized.profile}. Valid profiles: minimal, full, solo-dev, team`);
    }

    // Profile provides defaults, but CLI options override
    normalized.profileModules = profile.modules;
    normalized.profileAgents = profile.agents;
    normalized.profileWorkflows = profile.workflows;

    // If no explicit modules/agents/workflows, use profile values
    if (!normalized.modules) {
      normalized.modules = profile.modules;
    }
    if (!normalized.agents) {
      normalized.agents = profile.agents;
    }
    if (!normalized.workflows) {
      normalized.workflows = profile.workflows;
    }
  }

  return normalized;
}

/**
 * Validate parsed options for conflicts and errors
 * @param {Object} options - Parsed options
 * @returns {Object} { valid: boolean, errors: string[] }
 */
function validateOptions(options) {
  const errors = [];

  // Validate skill level
  if (options.skillLevel) {
    const validLevels = ['beginner', 'intermediate', 'advanced'];
    if (!validLevels.includes(options.skillLevel.toLowerCase())) {
      errors.push(`Invalid skill level: ${options.skillLevel}. Valid values: beginner, intermediate, advanced`);
    }
  }

  // Validate profile
  if (options.profile) {
    const validProfiles = ['minimal', 'full', 'solo-dev', 'team'];
    if (!validProfiles.includes(options.profile.toLowerCase())) {
      errors.push(`Invalid profile: ${options.profile}. Valid values: minimal, full, solo-dev, team`);
    }
  }

  // Check for empty selections
  if (options.agents && Array.isArray(options.agents) && options.agents.length === 0) {
    errors.push('Agents list cannot be empty');
  }

  if (options.workflows && Array.isArray(options.workflows) && options.workflows.length === 0) {
    errors.push('Workflows list cannot be empty');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

module.exports = {
  parseList,
  isSpecialValue,
  separateModifiers,
  applyModifiers,
  parseOptions,
  validateOptions,
};
