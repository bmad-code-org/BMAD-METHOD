const path = require('node:path');
const fs = require('./fs-native');
const yaml = require('yaml');
const { getModulePath, getExternalModuleCachePath } = require('./project-root');

/**
 * Parse a single `--set <module>.<key>=<value>` entry.
 * @param {string} entry - raw flag value
 * @returns {{module: string, key: string, value: string}}
 * @throws {Error} on malformed input
 */
function parseSetEntry(entry) {
  if (typeof entry !== 'string' || entry.length === 0) {
    throw new Error('--set: empty entry. Expected <module>.<key>=<value>');
  }
  const eq = entry.indexOf('=');
  if (eq === -1) {
    throw new Error(`--set "${entry}": missing '='. Expected <module>.<key>=<value>`);
  }
  const lhs = entry.slice(0, eq);
  const value = entry.slice(eq + 1);
  const dot = lhs.indexOf('.');
  if (dot === -1) {
    throw new Error(`--set "${entry}": missing '.'. Expected <module>.<key>=<value>`);
  }
  const moduleCode = lhs.slice(0, dot).trim();
  const key = lhs.slice(dot + 1).trim();
  if (!moduleCode || !key) {
    throw new Error(`--set "${entry}": empty module or key. Expected <module>.<key>=<value>`);
  }
  return { module: moduleCode, key, value };
}

/**
 * Parse repeated `--set` entries into a `{ module: { key: value } }` map.
 * Later entries overwrite earlier ones for the same key.
 * @param {string[]} entries
 * @returns {Object<string, Object<string, string>>}
 */
function parseSetEntries(entries) {
  const overrides = {};
  if (!Array.isArray(entries)) return overrides;
  for (const entry of entries) {
    const { module: moduleCode, key, value } = parseSetEntry(entry);
    if (!overrides[moduleCode]) overrides[moduleCode] = {};
    overrides[moduleCode][key] = value;
  }
  return overrides;
}

/**
 * Find a module's source `module.yaml` for officials only.
 * Returns null for community/custom; we don't validate those.
 * @param {string} moduleCode
 * @returns {Promise<string|null>}
 */
async function findOfficialModuleYaml(moduleCode) {
  const builtIn = path.join(getModulePath(moduleCode), 'module.yaml');
  if (await fs.pathExists(builtIn)) return builtIn;

  const externalRoot = getExternalModuleCachePath(moduleCode);
  if (!(await fs.pathExists(externalRoot))) return null;

  const candidates = [
    path.join(externalRoot, 'module.yaml'),
    path.join(externalRoot, 'src', 'module.yaml'),
    path.join(externalRoot, 'skills', 'module.yaml'),
  ];
  for (const candidate of candidates) {
    if (await fs.pathExists(candidate)) return candidate;
  }
  return null;
}

/**
 * Read declared config keys (those with a `prompt:`) from a module.yaml.
 * Returns a Set of key names, or null if the file can't be read.
 */
async function readDeclaredKeys(moduleYamlPath) {
  try {
    const parsed = yaml.parse(await fs.readFile(moduleYamlPath, 'utf8'));
    if (!parsed || typeof parsed !== 'object') return null;
    const keys = new Set();
    for (const [key, value] of Object.entries(parsed)) {
      if (value && typeof value === 'object' && 'prompt' in value) {
        keys.add(key);
      }
    }
    return keys;
  } catch {
    return null;
  }
}

module.exports = { parseSetEntry, parseSetEntries, findOfficialModuleYaml, readDeclaredKeys };
