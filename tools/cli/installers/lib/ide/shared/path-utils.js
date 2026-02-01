/**
 * Path transformation utilities for IDE installer standardization
 *
 * Provides utilities to convert hierarchical paths to flat naming conventions.
 *
 * DASH-BASED NAMING (new standard):
 * - Agents: bmad-agent-module-name.md (with bmad-agent- prefix)
 * - Workflows/Tasks/Tools: bmad-module-name.md
 *
 * Example outputs:
 * - cis/agents/storymaster.md → bmad-agent-cis-storymaster.md
 * - bmm/workflows/plan-project.md → bmad-bmm-plan-project.md
 * - bmm/tasks/create-story.md → bmad-bmm-create-story.md
 * - core/agents/brainstorming.md → bmad-agent-brainstorming.md (core agents skip module name)
 */

// Type segments - agents are included in naming, others are filtered out
const TYPE_SEGMENTS = ['workflows', 'tasks', 'tools'];
const AGENT_SEGMENT = 'agents';

// BMAD installation folder name - centralized constant for all installers
const BMAD_FOLDER_NAME = '_bmad';

/**
 * Convert hierarchical path to flat dash-separated name (NEW STANDARD)
 * Converts: 'bmm', 'agents', 'pm' → 'bmad-agent-bmm-pm.md'
 * Converts: 'bmm', 'workflows', 'correct-course' → 'bmad-bmm-correct-course.md'
 * Converts: 'core', 'agents', 'brainstorming' → 'bmad-agent-brainstorming.md' (core agents skip module name)
 *
 * @param {string} module - Module name (e.g., 'bmm', 'core')
 * @param {string} type - Artifact type ('agents', 'workflows', 'tasks', 'tools')
 * @param {string} name - Artifact name (e.g., 'pm', 'brainstorming')
 * @returns {string} Flat filename like 'bmad-agent-bmm-pm.md' or 'bmad-bmm-correct-course.md'
 */
function toDashName(module, type, name) {
  const isAgent = type === AGENT_SEGMENT;

  // For core module, skip the module name: use 'bmad-agent-name.md' instead of 'bmad-agent-core-name.md'
  if (module === 'core') {
    return isAgent ? `bmad-agent-${name}.md` : `bmad-${name}.md`;
  }

  // Module artifacts: bmad-module-name.md or bmad-agent-module-name.md
  // eslint-disable-next-line unicorn/prefer-string-replace-all -- regex replace is intentional here
  const dashName = name.replace(/\//g, '-'); // Flatten nested paths
  return isAgent ? `bmad-agent-${module}-${dashName}.md` : `bmad-${module}-${dashName}.md`;
}

/**
 * Convert relative path to flat dash-separated name
 * Converts: 'bmm/agents/pm.md' → 'bmad-agent-bmm-pm.md'
 * Converts: 'bmm/agents/tech-writer/tech-writer.md' → 'bmad-agent-bmm-tech-writer.md' (uses folder name)
 * Converts: 'bmm/workflows/correct-course.md' → 'bmad-bmm-correct-course.md'
 * Converts: 'core/agents/brainstorming.md' → 'bmad-agent-brainstorming.md' (core agents skip module name)
 *
 * @param {string} relativePath - Path like 'bmm/agents/pm.md'
 * @returns {string} Flat filename like 'bmad-agent-bmm-pm.md' or 'bmad-brainstorming.md'
 */
function toDashPath(relativePath) {
  if (!relativePath || typeof relativePath !== 'string') {
    // Return a safe default for invalid input
    return 'bmad-unknown.md';
  }

  // Strip common file extensions to avoid double extensions in generated filenames
  // e.g., 'create-story.xml' → 'create-story', 'workflow.yaml' → 'workflow'
  const withoutExt = relativePath.replace(/\.(md|yaml|yml|json|xml|toml)$/i, '');
  const parts = withoutExt.split(/[/\\]/);

  const module = parts[0];
  const type = parts[1];
  let name;

  // For agents, if nested in a folder (more than 3 parts), use the folder name only
  // e.g., 'bmm/agents/tech-writer/tech-writer' → 'tech-writer' (not 'tech-writer-tech-writer')
  if (type === 'agents' && parts.length > 3) {
    // Use the folder name (parts[2]) as the name, ignore the file name
    name = parts[2];
  } else {
    // For non-nested or non-agents, join all parts after type
    name = parts.slice(2).join('-');
  }

  return toDashName(module, type, name);
}

/**
 * Create custom agent dash name
 * Creates: 'bmad-custom-agent-fred-commit-poet.md'
 *
 * @param {string} agentName - Custom agent name
 * @returns {string} Flat filename like 'bmad-custom-agent-fred-commit-poet.md'
 */
function customAgentDashName(agentName) {
  return `bmad-custom-agent-${agentName}.md`;
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
 * Parses: 'bmad-agent-bmm-pm.md' → { prefix: 'bmad', module: 'bmm', type: 'agents', name: 'pm' }
 * Parses: 'bmad-bmm-correct-course.md' → { prefix: 'bmad', module: 'bmm', type: 'workflows', name: 'correct-course' }
 * Parses: 'bmad-agent-brainstorming.md' → { prefix: 'bmad', module: 'core', type: 'agents', name: 'brainstorming' } (core agents)
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

  // Check if this is an agent file (has 'agent' as second part)
  const isAgent = parts[1] === 'agent';

  if (isAgent) {
    // This is an agent file
    // Format: bmad-agent-name (core) or bmad-agent-module-name
    if (parts.length === 3) {
      // Core agent: bmad-agent-name
      return {
        prefix: parts[0],
        module: 'core',
        type: 'agents',
        name: parts[2],
      };
    } else {
      // Module agent: bmad-agent-module-name
      return {
        prefix: parts[0],
        module: parts[2],
        type: 'agents',
        name: parts.slice(3).join('-'),
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
  // Strip common file extensions (same as toDashPath for consistency)
  const withoutExt = relativePath.replace(/\.(md|yaml|yml|json|xml|toml)$/i, '');
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
  BMAD_FOLDER_NAME,
};
