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

module.exports = { parseSetEntry, parseSetEntries };
