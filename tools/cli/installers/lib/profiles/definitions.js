/**
 * Installation Profile Definitions
 *
 * Profiles are pre-defined combinations of modules, agents, and workflows
 * for common use cases. Users can select a profile with --profile=<name>
 * and override specific selections with CLI flags.
 */

const PROFILES = {
  minimal: {
    name: 'minimal',
    description: 'Minimal installation - core + dev agent + essential workflows',
    modules: ['core'],
    agents: ['dev'],
    workflows: ['create-tech-spec', 'quick-dev'],
  },

  full: {
    name: 'full',
    description: 'Full installation - all modules, agents, and workflows',
    modules: 'all',
    agents: 'all',
    workflows: 'all',
  },

  'solo-dev': {
    name: 'solo-dev',
    description: 'Single developer setup - dev tools and planning workflows',
    modules: ['core', 'bmm'],
    agents: ['dev', 'architect', 'analyst', 'tech-writer'],
    workflows: ['create-tech-spec', 'quick-dev', 'dev-story', 'code-review', 'create-prd', 'create-architecture'],
  },

  team: {
    name: 'team',
    description: 'Team collaboration setup - planning and execution workflows',
    modules: ['core', 'bmm'],
    agents: ['dev', 'architect', 'pm', 'sm', 'analyst', 'ux-designer'],
    workflows: [
      'create-product-brief',
      'create-prd',
      'create-architecture',
      'create-epics-and-stories',
      'sprint-planning',
      'create-story',
      'dev-story',
      'code-review',
      'workflow-init',
    ],
  },
};

/**
 * Get a profile by name
 * @param {string} name - Profile name (minimal, full, solo-dev, team)
 * @returns {Object|null} Profile definition or null if not found
 */
function getProfile(name) {
  if (!name) {
    return null;
  }

  const profile = PROFILES[name.toLowerCase()];
  if (!profile) {
    return null;
  }

  // Return a copy to prevent mutation
  return { ...profile };
}

/**
 * Get all available profile names
 * @returns {string[]} Array of profile names
 */
function getProfileNames() {
  return Object.keys(PROFILES);
}

/**
 * Get profile descriptions for help text
 * @returns {Object} Map of profile name to description
 */
function getProfileDescriptions() {
  const descriptions = {};
  for (const [name, profile] of Object.entries(PROFILES)) {
    descriptions[name] = profile.description;
  }
  return descriptions;
}

module.exports = {
  getProfile,
  getProfileNames,
  getProfileDescriptions,
};
