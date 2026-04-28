// Names that, when used as object keys, can mutate `Object.prototype` and
// cascade into every plain-object lookup in the process. The whole `--set`
// pipeline assigns into plain `{}` maps keyed by user input, so a flag like
// `--set __proto__.polluted=1` would otherwise reach
// `overrides.__proto__[key] = value`, which assigns onto Object.prototype.
// We reject both segments at parse time and harden the maps in
// `parseSetEntries` with `Object.create(null)`.
const PROTOTYPE_POLLUTING_NAMES = new Set(['__proto__', 'prototype', 'constructor']);

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
  // Note: only the LHS is trimmed. Values may legitimately contain leading
  // or trailing whitespace (paths with spaces, quoted strings); module / key
  // names cannot, so it's safe to be strict on the left.
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
  if (PROTOTYPE_POLLUTING_NAMES.has(moduleCode) || PROTOTYPE_POLLUTING_NAMES.has(key)) {
    throw new Error(
      `--set "${entry}": '__proto__', 'prototype', and 'constructor' are reserved and cannot be used as a module or key name.`,
    );
  }
  return { module: moduleCode, key, value };
}

/**
 * Parse repeated `--set` entries into a `{ module: { key: value } }` map.
 * Later entries overwrite earlier ones for the same key.
 *
 * Both the outer map and the per-module inner maps are `Object.create(null)`
 * so that even if a future caller bypasses `parseSetEntry`'s reserved-name
 * check, lookups can't traverse `Object.prototype` and pollution-style writes
 * land on the map's own properties (not the global prototype).
 *
 * @param {string[]} entries
 * @returns {Object<string, Object<string, string>>}
 */
function parseSetEntries(entries) {
  const overrides = Object.create(null);
  if (!Array.isArray(entries)) return overrides;
  for (const entry of entries) {
    const { module: moduleCode, key, value } = parseSetEntry(entry);
    if (!overrides[moduleCode]) overrides[moduleCode] = Object.create(null);
    overrides[moduleCode][key] = value;
  }
  return overrides;
}

module.exports = { parseSetEntry, parseSetEntries };
