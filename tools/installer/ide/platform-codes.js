const fs = require('../fs-native');
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

/**
 * Format the installable platform list for human-readable output (used by --list-tools).
 * Sourced from IdeManager so this view matches what --tools accepts at install time
 * (suspended platforms excluded).
 * @returns {Promise<string>} Formatted multi-line string with id, name, target_dir, preferred flag.
 */
async function formatPlatformList() {
  const { IdeManager } = require('./manager');
  const ideManager = new IdeManager();
  await ideManager.ensureInitialized();

  const entries = ideManager.getAvailableIdes().map((ide) => {
    const handler = ideManager.handlers.get(ide.value);
    return {
      id: ide.value,
      name: ide.name,
      targetDir: handler?.installerConfig?.target_dir || '',
      preferred: ide.preferred,
    };
  });

  const idWidth = Math.max(...entries.map((e) => e.id.length), 'ID'.length);
  const nameWidth = Math.max(...entries.map((e) => e.name.length), 'Name'.length);

  const pad = (s, w) => s + ' '.repeat(Math.max(0, w - s.length));
  const lines = [
    `Supported tool IDs (pass via --tools <id>[,<id>...]):`,
    '',
    `  ${pad('ID', idWidth)}  ${pad('Name', nameWidth)}  Target dir`,
    `  ${pad('-'.repeat(idWidth), idWidth)}  ${pad('-'.repeat(nameWidth), nameWidth)}  ${'-'.repeat(10)}`,
  ];

  for (const e of entries) {
    const star = e.preferred ? ' *' : '  ';
    lines.push(`${star}${pad(e.id, idWidth)}  ${pad(e.name, nameWidth)}  ${e.targetDir}`);
  }

  lines.push('', '* = recommended / preferred', '', 'Example: bmad-method install --modules bmm --tools claude-code');

  return lines.join('\n');
}

module.exports = {
  loadPlatformCodes,
  clearCache,
  formatPlatformList,
};
