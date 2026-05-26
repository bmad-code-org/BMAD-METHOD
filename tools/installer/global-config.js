/**
 * Helpers for the cross-platform global BMad config directory.
 *
 * The "global" tier is read-only to most installer code paths — only core
 * scope:user answers (user_name, communication_language) and identity defaults
 * are written there, and only by the post-install global-write step. Everything
 * else reads.
 *
 * Location precedence:
 *   1. $BMAD_HOME (for CI / corporate / multi-account setups)
 *   2. ~/.bmad
 *
 * Works on macOS, Linux, WSL, and Windows: os.homedir() returns the
 * platform-appropriate home (and on WSL, the Linux home — each WSL distro has
 * its own global config).
 */

const path = require('node:path');
const os = require('node:os');
const fs = require('./fs-native');

function resolveGlobalDir() {
  const override = process.env.BMAD_HOME;
  if (override && override.trim()) {
    return path.resolve(override.trim());
  }
  return path.join(os.homedir(), '.bmad');
}

function globalTeamConfigPath() {
  return path.join(resolveGlobalDir(), 'config.toml');
}

function globalUserConfigPath() {
  return path.join(resolveGlobalDir(), 'config.user.toml');
}

/**
 * Parse a minimal subset of TOML — enough for the installer-owned files:
 * top-level tables ([section] / [section.sub]) and simple scalar values
 * (string, number, boolean). No arrays of tables, inline tables, datetimes,
 * or multiline strings — those don't appear in files we author. Reader stays
 * dependency-free; we only consume what we emit.
 *
 * For an unrecognized shape, the offending line is silently dropped (rather
 * than erroring) to keep the installer resilient against hand-edits that
 * went slightly outside the documented schema.
 */
function parseSimpleToml(content) {
  const result = {};
  let currentTable = result;

  for (const rawLine of content.split('\n')) {
    const line = stripInlineComment(rawLine).trim();
    if (!line) continue;

    const sectionMatch = line.match(/^\[([^\]]+)]\s*$/);
    if (sectionMatch) {
      const parts = sectionMatch[1].split('.').map((p) => p.trim());
      currentTable = result;
      for (const part of parts) {
        if (!currentTable[part] || typeof currentTable[part] !== 'object' || Array.isArray(currentTable[part])) {
          currentTable[part] = {};
        }
        currentTable = currentTable[part];
      }
      continue;
    }

    const kvMatch = line.match(/^([A-Za-z0-9_-]+)\s*=\s*(.+)$/);
    if (kvMatch) {
      const [, key, rawValue] = kvMatch;
      const parsed = parseTomlScalar(rawValue.trim());
      if (parsed !== undefined) {
        currentTable[key] = parsed;
      }
    }
  }

  return result;
}

/**
 * Strip a trailing `# comment` from a TOML line, but only when the `#` lives
 * outside a double-quoted string. We don't author multiline strings or
 * literal strings, so a single double-quote scanner is sufficient.
 */
function stripInlineComment(line) {
  let inString = false;
  let escaped = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (escaped) {
      escaped = false;
      continue;
    }
    if (ch === '\\') {
      escaped = true;
      continue;
    }
    if (ch === '"') {
      inString = !inString;
      continue;
    }
    if (ch === '#' && !inString) {
      return line.slice(0, i);
    }
  }
  return line;
}

function parseTomlScalar(raw) {
  if (raw.startsWith('"') && raw.endsWith('"') && raw.length >= 2) {
    return raw
      .slice(1, -1)
      .replaceAll(String.raw`\"`, '"')
      .replaceAll(String.raw`\\`, '\\')
      .replaceAll(String.raw`\n`, '\n')
      .replaceAll(String.raw`\r`, '\r')
      .replaceAll(String.raw`\t`, '\t');
  }
  if (raw === 'true') return true;
  if (raw === 'false') return false;
  if (/^-?\d+$/.test(raw)) return Number.parseInt(raw, 10);
  if (/^-?\d+\.\d+$/.test(raw)) return Number.parseFloat(raw);
  return; // dropped silently — see header comment
}

/**
 * Load both global TOML files. Either may be missing; returns merged result.
 * Files are read but never written by this helper.
 *
 * @returns {Promise<{ team: object, user: object, merged: object }>}
 */
async function loadGlobalConfig() {
  const team = await readTomlFile(globalTeamConfigPath());
  const user = await readTomlFile(globalUserConfigPath());
  // Shallow-deep merge: user table wins over team at every key path. The
  // installer only consults the merged view for default-seeding, so this is
  // sufficient (we don't need the full structural-merge of resolve_config.py).
  const merged = mergeDeep(team, user);
  return { team, user, merged };
}

async function readTomlFile(filePath) {
  if (!(await fs.pathExists(filePath))) return {};
  try {
    const content = await fs.readFile(filePath, 'utf8');
    return parseSimpleToml(content);
  } catch {
    return {};
  }
}

function mergeDeep(base, override) {
  if (!override || typeof override !== 'object' || Array.isArray(override)) return override === undefined ? base : override;
  if (!base || typeof base !== 'object' || Array.isArray(base)) return override;
  const result = { ...base };
  for (const [key, value] of Object.entries(override)) {
    result[key] = mergeDeep(result[key], value);
  }
  return result;
}

module.exports = {
  resolveGlobalDir,
  globalTeamConfigPath,
  globalUserConfigPath,
  parseSimpleToml,
  loadGlobalConfig,
};
