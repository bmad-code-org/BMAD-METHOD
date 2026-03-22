const path = require('node:path');
const fs = require('fs-extra');
const yaml = require('yaml');

/**
 * Load bmad-skill-manifest.yaml from a directory.
 * Single-entry manifests (canonicalId at top level) apply to all files in the directory.
 * Multi-entry manifests are keyed by source filename.
 * @param {string} dirPath - Directory to check for bmad-skill-manifest.yaml
 * @returns {Object|null} Parsed manifest or null
 */
async function loadSkillManifest(dirPath) {
  const manifestPath = path.join(dirPath, 'bmad-skill-manifest.yaml');
  try {
    if (!(await fs.pathExists(manifestPath))) return null;
    const content = await fs.readFile(manifestPath, 'utf8');
    const parsed = yaml.parse(content);
    if (!parsed || typeof parsed !== 'object') return null;
    if (parsed.canonicalId || parsed.type) return { __single: parsed };
    return parsed;
  } catch (error) {
    console.warn(`Warning: Failed to parse bmad-skill-manifest.yaml in ${dirPath}: ${error.message}`);
    return null;
  }
}

/**
 * Get the canonicalId for a specific file from a loaded skill manifest.
 * @param {Object|null} manifest - Loaded manifest (from loadSkillManifest)
 * @param {string} filename - Source filename to look up (e.g., 'pm.md', 'help.md', 'pm.agent.yaml')
 * @returns {string} canonicalId or empty string
 */
function getCanonicalId(manifest, filename) {
  if (!manifest) return '';
  // Single-entry manifest applies to all files in the directory
  if (manifest.__single) return manifest.__single.canonicalId || '';
  // Multi-entry: look up by filename directly
  if (manifest[filename]) return manifest[filename].canonicalId || '';
  // Fallback: try alternate extensions for compiled files
  const baseName = filename.replace(/\.(md|xml)$/i, '');
  const agentKey = `${baseName}.agent.yaml`;
  if (manifest[agentKey]) return manifest[agentKey].canonicalId || '';
  const xmlKey = `${baseName}.xml`;
  if (manifest[xmlKey]) return manifest[xmlKey].canonicalId || '';
  return '';
}

/**
 * Get the artifact type for a specific file from a loaded skill manifest.
 * @param {Object|null} manifest - Loaded manifest (from loadSkillManifest)
 * @param {string} filename - Source filename to look up
 * @returns {string|null} type or null
 */
function getArtifactType(manifest, filename) {
  if (!manifest) return null;
  // Single-entry manifest applies to all files in the directory
  if (manifest.__single) return manifest.__single.type || null;
  // Multi-entry: look up by filename directly
  if (manifest[filename]) return manifest[filename].type || null;
  // Fallback: try alternate extensions for compiled files
  const baseName = filename.replace(/\.(md|xml)$/i, '');
  const agentKey = `${baseName}.agent.yaml`;
  if (manifest[agentKey]) return manifest[agentKey].type || null;
  const xmlKey = `${baseName}.xml`;
  if (manifest[xmlKey]) return manifest[xmlKey].type || null;
  return null;
}

/**
 * Get the install_to_bmad flag for a specific file from a loaded skill manifest.
 * @param {Object|null} manifest - Loaded manifest (from loadSkillManifest)
 * @param {string} filename - Source filename to look up
 * @returns {boolean} install_to_bmad value (defaults to true)
 */
function getInstallToBmad(manifest, filename) {
  if (!manifest) return true;
  // Single-entry manifest applies to all files in the directory
  if (manifest.__single) return manifest.__single.install_to_bmad !== false;
  // Multi-entry: look up by filename directly
  if (manifest[filename]) return manifest[filename].install_to_bmad !== false;
  // Fallback: try alternate extensions for compiled files
  const baseName = filename.replace(/\.(md|xml)$/i, '');
  const agentKey = `${baseName}.agent.yaml`;
  if (manifest[agentKey]) return manifest[agentKey].install_to_bmad !== false;
  const xmlKey = `${baseName}.xml`;
  if (manifest[xmlKey]) return manifest[xmlKey].install_to_bmad !== false;
  return true;
}

module.exports = { loadSkillManifest, getCanonicalId, getArtifactType, getInstallToBmad };
