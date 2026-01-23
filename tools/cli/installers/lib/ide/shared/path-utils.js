/**
 * Path transformation utilities for IDE installer standardization
 *
 * Provides utilities to convert hierarchical paths to flat naming conventions.
 * - Underscore format (bmad_module_name.md) - Windows-compatible universal format
 */

// Type segments to filter out from paths
const TYPE_SEGMENTS = ['agents', 'workflows', 'tasks', 'tools'];

/**
 * Convert hierarchical path to flat underscore-separated name
 * Converts: 'bmm/agents/pm.md' → 'bmad_bmm_pm.md'
 * Converts: 'bmm/workflows/correct-course.md' → 'bmad_bmm_correct-course.md'
 *
 * @param {string} module - Module name (e.g., 'bmm', 'core')
 * @param {string} type - Artifact type ('agents', 'workflows', 'tasks', 'tools') - filtered out
 * @param {string} name - Artifact name (e.g., 'pm', 'correct-course')
 * @returns {string} Flat filename like 'bmad_bmm_pm.md'
 */
function toUnderscoreName(module, type, name) {
  return `bmad_${module}_${name}.md`;
}

/**
 * Convert relative path to flat underscore-separated name
 * Converts: 'bmm/agents/pm.md' → 'bmad_bmm_pm.md'
 * Converts: 'bmm/workflows/correct-course.md' → 'bmad_bmm_correct-course.md'
 *
 * @param {string} relativePath - Path like 'bmm/agents/pm.md'
 * @returns {string} Flat filename like 'bmad_bmm_pm.md'
 */
function toUnderscorePath(relativePath) {
  const withoutExt = relativePath.replace('.md', '');
  const parts = withoutExt.split(/[/\\]/);
  // Filter out type segments (agents, workflows, tasks, tools)
  const filtered = parts.filter((p) => !TYPE_SEGMENTS.includes(p));
  return `bmad_${filtered.join('_')}.md`;
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
 * Parses: 'bmad_bmm_pm.md' → { prefix: 'bmad', module: 'bmm', name: 'pm' }
 *
 * @param {string} filename - Underscore-formatted filename
 * @returns {Object|null} Parsed parts or null if invalid format
 */
function parseUnderscoreName(filename) {
  const withoutExt = filename.replace('.md', '');
  const parts = withoutExt.split('_');

  if (parts.length < 3 || parts[0] !== 'bmad') {
    return null;
  }

  return {
    prefix: parts[0],
    module: parts[1],
    name: parts.slice(2).join('_'), // Handle names that might contain underscores
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
};
