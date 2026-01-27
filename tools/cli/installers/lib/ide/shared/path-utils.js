/**
 * Path transformation utilities for IDE installer standardization
 *
 * Provides utilities to convert hierarchical paths to flat naming conventions.
 *
 * DASH-BASED NAMING (new standard):
 * - Agents: bmad-module-name.agent.md (with .agent.md suffix)
 * - Workflows/Tasks/Tools: bmad-module-name.md
 *
 * Example outputs:
 * - cis/agents/storymaster.md → bmad-cis-storymaster.agent.md
 * - bmm/workflows/plan-project.md → bmad-bmm-plan-project.md
 * - bmm/tasks/create-story.md → bmad-bmm-create-story.md
 * - core/agents/brainstorming.md → bmad-brainstorming.agent.md
 */

// Type segments - agents are included in naming, others are filtered out
const TYPE_SEGMENTS = ['workflows', 'tasks', 'tools'];
const AGENT_SEGMENT = 'agents';

/**
 * Convert hierarchical path to flat dash-separated name (NEW STANDARD)
 * Converts: 'bmm', 'agents', 'pm' → 'bmad-bmm-pm.agent.md'
 * Converts: 'bmm', 'workflows', 'correct-course' → 'bmad-bmm-correct-course.md'
 * Converts: 'core', 'agents', 'brainstorming' → 'bmad-brainstorming.agent.md' (core items skip module prefix)
 *
 * @param {string} module - Module name (e.g., 'bmm', 'core')
 * @param {string} type - Artifact type ('agents', 'workflows', 'tasks', 'tools')
 * @param {string} name - Artifact name (e.g., 'pm', 'brainstorming')
 * @returns {string} Flat filename like 'bmad-bmm-pm.agent.md' or 'bmad-bmm-correct-course.md'
 */
function toDashName(module, type, name) {
  const isAgent = type === AGENT_SEGMENT;

  // For core module, skip the module prefix: use 'bmad-name.md' instead of 'bmad-core-name.md'
  if (module === 'core') {
    return isAgent ? `bmad-${name}.agent.md` : `bmad-${name}.md`;
  }

  // Module artifacts: bmad-module-name.md or bmad-module-name.agent.md
  // eslint-disable-next-line unicorn/prefer-string-replace-all -- regex replace is intentional here
  const dashName = name.replace(/\//g, '-'); // Flatten nested paths
  return isAgent ? `bmad-${module}-${dashName}.agent.md` : `bmad-${module}-${dashName}.md`;
}

/**
 * Convert relative path to flat dash-separated name
 * Converts: 'bmm/agents/pm.md' → 'bmad-bmm-pm.agent.md'
 * Converts: 'bmm/workflows/correct-course.md' → 'bmad-bmm-correct-course.md'
 * Converts: 'core/agents/brainstorming.md' → 'bmad-brainstorming.agent.md' (core items skip module prefix)
 *
 * @param {string} relativePath - Path like 'bmm/agents/pm.md'
 * @returns {string} Flat filename like 'bmad-bmm-pm.agent.md' or 'bmad-brainstorming.md'
 */
function toDashPath(relativePath) {
  if (!relativePath || typeof relativePath !== 'string') {
    // Return a safe default for invalid input
    return 'bmad-unknown.md';
  }

  const withoutExt = relativePath.replace('.md', '');
  const parts = withoutExt.split(/[/\\]/);

  const module = parts[0];
  const type = parts[1];
  const name = parts.slice(2).join('-');

  return toDashName(module, type, name);
}

/**
 * Create custom agent dash name
 * Creates: 'bmad-custom-fred-commit-poet.agent.md'
 *
 * @param {string} agentName - Custom agent name
 * @returns {string} Flat filename like 'bmad-custom-fred-commit-poet.agent.md'
 */
function customAgentDashName(agentName) {
  return `bmad-custom-${agentName}.agent.md`;
}

/**
 * Check if a filename uses dash format
 * @param {string} filename - Filename to check
 * @returns {boolean} True if filename uses dash format
 */
function isDashFormat(filename) {
  return filename.startsWith('bmad-') && filename.includes('-');
}

/**
 * Extract parts from a dash-formatted filename
 * Parses: 'bmad-bmm-pm.agent.md' → { prefix: 'bmad', module: 'bmm', type: 'agents', name: 'pm' }
 * Parses: 'bmad-bmm-correct-course.md' → { prefix: 'bmad', module: 'bmm', type: 'workflows', name: 'correct-course' }
 * Parses: 'bmad-brainstorming.agent.md' → { prefix: 'bmad', module: 'core', type: 'agents', name: 'brainstorming' } (core agents)
 * Parses: 'bmad-brainstorming.md' → { prefix: 'bmad', module: 'core', type: 'workflows', name: 'brainstorming' } (core workflows)
 *
 * @param {string} filename - Dash-formatted filename
 * @returns {Object|null} Parsed parts or null if invalid format
 */
function parseDashName(filename) {
  const withoutExt = filename.replace('.md', '');
  const parts = withoutExt.split('-');

  if (parts.length < 2 || parts[0] !== 'bmad') {
    return null;
  }

  // Check if this is an agent file (has .agent suffix)
  const isAgent = withoutExt.endsWith('.agent');

  if (isAgent) {
    // This is an agent file
    // Format: bmad-name.agent (core) or bmad-module-name.agent
    if (parts.length === 3) {
      // Core agent: bmad-name.agent
      return {
        prefix: parts[0],
        module: 'core',
        type: 'agents',
        name: parts[1],
      };
    } else {
      // Module agent: bmad-module-name.agent
      return {
        prefix: parts[0],
        module: parts[1],
        type: 'agents',
        name: parts.slice(2).join('-'),
      };
    }
  }

  // Not an agent file - must be a workflow/tool/task
  // If only 2 parts (bmad-name), it's a core workflow/tool/task
  if (parts.length === 2) {
    return {
      prefix: parts[0],
      module: 'core',
      type: 'workflows', // Default to workflows for non-agent core items
      name: parts[1],
    };
  }

  // Otherwise, it's a module workflow/tool/task (bmad-module-name)
  return {
    prefix: parts[0],
    module: parts[1],
    type: 'workflows', // Default to workflows for non-agent module items
    name: parts.slice(2).join('-'),
  };
}

// ============================================================================
// LEGACY FUNCTIONS (underscore format) - kept for backward compatibility
// ============================================================================

/**
 * Convert hierarchical path to flat underscore-separated name (LEGACY)
 * @deprecated Use toDashName instead
 */
function toUnderscoreName(module, type, name) {
  const isAgent = type === AGENT_SEGMENT;
  if (module === 'core') {
    return isAgent ? `bmad_agent_${name}.md` : `bmad_${name}.md`;
  }
  return isAgent ? `bmad_${module}_agent_${name}.md` : `bmad_${module}_${name}.md`;
}

/**
 * Convert relative path to flat underscore-separated name (LEGACY)
 * @deprecated Use toDashPath instead
 */
function toUnderscorePath(relativePath) {
  const withoutExt = relativePath.replace('.md', '');
  const parts = withoutExt.split(/[/\\]/);

  const module = parts[0];
  const type = parts[1];
  const name = parts.slice(2).join('_');

  return toUnderscoreName(module, type, name);
}

/**
 * Create custom agent underscore name (LEGACY)
 * @deprecated Use customAgentDashName instead
 */
function customAgentUnderscoreName(agentName) {
  return `bmad_custom_${agentName}.md`;
}

/**
 * Check if a filename uses underscore format (LEGACY)
 * @deprecated Use isDashFormat instead
 */
function isUnderscoreFormat(filename) {
  return filename.startsWith('bmad_') && filename.includes('_');
}

/**
 * Extract parts from an underscore-formatted filename (LEGACY)
 * @deprecated Use parseDashName instead
 */
function parseUnderscoreName(filename) {
  const withoutExt = filename.replace('.md', '');
  const parts = withoutExt.split('_');

  if (parts.length < 2 || parts[0] !== 'bmad') {
    return null;
  }

  const agentIndex = parts.indexOf('agent');

  if (agentIndex !== -1) {
    if (agentIndex === 1) {
      return {
        prefix: parts[0],
        module: 'core',
        type: 'agents',
        name: parts.slice(agentIndex + 1).join('_'),
      };
    } else {
      return {
        prefix: parts[0],
        module: parts[1],
        type: 'agents',
        name: parts.slice(agentIndex + 1).join('_'),
      };
    }
  }

  if (parts.length === 2) {
    return {
      prefix: parts[0],
      module: 'core',
      type: 'workflows',
      name: parts[1],
    };
  }

  return {
    prefix: parts[0],
    module: parts[1],
    type: 'workflows',
    name: parts.slice(2).join('_'),
  };
}

// Backward compatibility aliases (colon format was same as underscore)
const toColonName = toUnderscoreName;
const toColonPath = toUnderscorePath;
const customAgentColonName = customAgentUnderscoreName;
const isColonFormat = isUnderscoreFormat;
const parseColonName = parseUnderscoreName;

module.exports = {
  // New standard (dash-based)
  toDashName,
  toDashPath,
  customAgentDashName,
  isDashFormat,
  parseDashName,

  // Legacy (underscore-based) - kept for backward compatibility
  toUnderscoreName,
  toUnderscorePath,
  customAgentUnderscoreName,
  isUnderscoreFormat,
  parseUnderscoreName,

  // Backward compatibility aliases
  toColonName,
  toColonPath,
  customAgentColonName,
  isColonFormat,
  parseColonName,

  TYPE_SEGMENTS,
  AGENT_SEGMENT,
};
