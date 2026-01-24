/**
 * Path transformation utilities for IDE installer standardization
 *
 * Provides utilities to convert hierarchical paths to flat naming conventions.
 * - Underscore format (bmad_module_name.md) - Windows-compatible universal format
 */

// Type segments - agents are included in naming, others are filtered out
const TYPE_SEGMENTS = ['workflows', 'tasks', 'tools'];
const AGENT_SEGMENT = 'agents';

/**
 * Convert hierarchical path to flat underscore-separated name
 * Converts: 'bmm', 'agents', 'pm' → 'bmad_bmm_agent_pm.md'
 * Converts: 'bmm', 'workflows', 'correct-course' → 'bmad_bmm_correct-course.md'
 * Converts: 'core', 'agents', 'brainstorming' → 'bmad_agent_brainstorming.md' (core items skip module prefix)
 *
 * @param {string} module - Module name (e.g., 'bmm', 'core')
 * @param {string} type - Artifact type ('agents', 'workflows', 'tasks', 'tools')
 * @param {string} name - Artifact name (e.g., 'pm', 'brainstorming')
 * @returns {string} Flat filename like 'bmad_bmm_agent_pm.md' or 'bmad_bmm_correct-course.md'
 */
function toUnderscoreName(module, type, name) {
  const isAgent = type === AGENT_SEGMENT;
  // For core module, skip the module prefix: use 'bmad_name.md' instead of 'bmad_core_name.md'
  if (module === 'core') {
    return isAgent ? `bmad_agent_${name}.md` : `bmad_${name}.md`;
  }
  return isAgent ? `bmad_${module}_agent_${name}.md` : `bmad_${module}_${name}.md`;
}

/**
 * Convert relative path to flat underscore-separated name
 * Converts: 'bmm/agents/pm.md' → 'bmad_bmm_agent_pm.md'
 * Converts: 'bmm/workflows/correct-course.md' → 'bmad_bmm_correct-course.md'
 * Converts: 'core/agents/brainstorming.md' → 'bmad_agent_brainstorming.md' (core items skip module prefix)
 *
 * @param {string} relativePath - Path like 'bmm/agents/pm.md'
 * @returns {string} Flat filename like 'bmad_bmm_agent_pm.md' or 'bmad_brainstorming.md'
 */
function toUnderscorePath(relativePath) {
  const withoutExt = relativePath.replace('.md', '');
  const parts = withoutExt.split(/[/\\]/);

  const module = parts[0];
  const type = parts[1];
  const name = parts.slice(2).join('_');

  // Use toUnderscoreName for consistency
  return toUnderscoreName(module, type, name);
}

/**
 * Create custom agent underscore name
 * Creates: 'bmad_custom_fred-commit-poet.md'
 *
 * @param {string} agentName - Custom agent name
 * @returns {string} Flat filename like 'bmad_custom_fred-commit-poet.md'
 */
function customAgentUnderscoreName(agentName) {
  return `bmad_custom_${agentName}.md`;
}

/**
 * Check if a filename uses underscore format
 * @param {string} filename - Filename to check
 * @returns {boolean} True if filename uses underscore format
 */
function isUnderscoreFormat(filename) {
  return filename.startsWith('bmad_') && filename.includes('_');
}

/**
 * Extract parts from an underscore-formatted filename
 * Parses: 'bmad_bmm_agent_pm.md' → { prefix: 'bmad', module: 'bmm', type: 'agents', name: 'pm' }
 * Parses: 'bmad_bmm_correct-course.md' → { prefix: 'bmad', module: 'bmm', type: 'workflows', name: 'correct-course' }
 * Parses: 'bmad_agent_brainstorming.md' → { prefix: 'bmad', module: 'core', type: 'agents', name: 'brainstorming' } (core agents)
 * Parses: 'bmad_brainstorming.md' → { prefix: 'bmad', module: 'core', type: 'workflows', name: 'brainstorming' } (core workflows)
 *
 * @param {string} filename - Underscore-formatted filename
 * @returns {Object|null} Parsed parts or null if invalid format
 */
function parseUnderscoreName(filename) {
  const withoutExt = filename.replace('.md', '');
  const parts = withoutExt.split('_');

  if (parts.length < 2 || parts[0] !== 'bmad') {
    return null;
  }

  // Check if this is an agent file (has 'agent' as one of the parts)
  const agentIndex = parts.indexOf('agent');

  if (agentIndex !== -1) {
    // This is an agent file
    // Format: bmad_agent_name (core) or bmad_module_agent_name
    if (agentIndex === 1) {
      // Core agent: bmad_agent_name
      return {
        prefix: parts[0],
        module: 'core',
        type: 'agents',
        name: parts.slice(agentIndex + 1).join('_'),
      };
    } else {
      // Module agent: bmad_module_agent_name
      return {
        prefix: parts[0],
        module: parts[1],
        type: 'agents',
        name: parts.slice(agentIndex + 1).join('_'),
      };
    }
  }

  // Not an agent file - must be a workflow/tool/task
  // If only 2 parts (bmad_name), it's a core workflow/tool/task
  if (parts.length === 2) {
    return {
      prefix: parts[0],
      module: 'core',
      type: 'workflows', // Default to workflows for non-agent core items
      name: parts[1],
    };
  }

  // Otherwise, it's a module workflow/tool/task (bmad_module_name)
  return {
    prefix: parts[0],
    module: parts[1],
    type: 'workflows', // Default to workflows for non-agent module items
    name: parts.slice(2).join('_'),
  };
}

// Backward compatibility aliases (deprecated)
const toColonName = toUnderscoreName;
const toColonPath = toUnderscorePath;
const toDashPath = toUnderscorePath;
const customAgentColonName = customAgentUnderscoreName;
const customAgentDashName = customAgentUnderscoreName;
const isColonFormat = isUnderscoreFormat;
const isDashFormat = isUnderscoreFormat;
const parseColonName = parseUnderscoreName;
const parseDashName = parseUnderscoreName;

module.exports = {
  toUnderscoreName,
  toUnderscorePath,
  customAgentUnderscoreName,
  isUnderscoreFormat,
  parseUnderscoreName,
  // Backward compatibility aliases
  toColonName,
  toColonPath,
  toDashPath,
  customAgentColonName,
  customAgentDashName,
  isColonFormat,
  isDashFormat,
  parseColonName,
  parseDashName,
  TYPE_SEGMENTS,
  AGENT_SEGMENT,
};
