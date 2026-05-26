// `--set <module>.<key>=<value>` is a post-install patch. The installer runs
// its normal flow and writes `_bmad/config.toml`, `_bmad/config.user.toml`,
// and `_bmad/<module>/config.yaml`; afterwards `applySetOverrides` upserts
// each override into those files.
//
// This is intentionally NOT integrated with the prompt/template/schema
// system. Tradeoffs:
//   - No `result:` template rendering: `--set bmm.project_knowledge=research`
//     writes "research" verbatim. Pass `--set bmm.project_knowledge='{project-root}/research'`
//     if you want the rendered form.
//   - Carry-forward across installs is best-effort: declared schema keys
//     persist via the existingValue path on the next interactive run; values
//     for keys outside any module's schema may need to be re-passed on each
//     install (or edited directly in `_bmad/config.toml`).
//   - No "key not in schema" validation: whatever you assert, we write.
//
// Names that, when used as object keys, can mutate `Object.prototype` and
// cascade into every plain-object lookup in the process. The `--set` pipeline
// assigns into plain `{}` maps keyed by user input, so `--set __proto__.x=1`
// would otherwise reach `overrides.__proto__[x] = 1` and pollute every plain
// object. We reject the names at parse time and harden the maps in
// `parseSetEntries` with `Object.create(null)` for defense-in-depth.
const PROTOTYPE_POLLUTING_NAMES = new Set(['__proto__', 'prototype', 'constructor']);

const path = require('node:path');
const fs = require('./fs-native');
const yaml = require('yaml');
const { globalUserConfigPath } = require('./global-config');
const { resolveInstalledModuleYaml } = require('./project-root');

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
 * Later entries overwrite earlier ones for the same key. Both the outer
 * map and the per-module inner maps are `Object.create(null)` so callers
 * that bypass `parseSetEntry`'s name check still can't pollute prototypes.
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

/**
 * Encode a `--set` value as a TOML literal. Types are inferred from the value
 * so `--set bmm.workers=4` writes `workers = 4` (integer), not `"4"` (string).
 *
 * Rules (mirror how TOML would interpret the literal hand-typed in a config):
 *   - `true` / `false`  → boolean
 *   - `-?\d+`           → integer
 *   - `-?\d+\.\d+`      → float
 *   - everything else   → quoted basic string
 *
 * To force a string that looks like a bool/number, wrap in literal quotes:
 *   --set foo.x='"true"'   →  x = "true"
 *
 * @param {string} value raw value as received from the --set flag
 */
function tomlString(value) {
  const s = String(value);
  if (s === 'true' || s === 'false') return s;
  if (/^-?\d+$/.test(s)) return s;
  if (/^-?\d+\.\d+$/.test(s)) return s;
  // Per the TOML spec, basic strings escape `\`, `"`, and control characters.
  return (
    '"' +
    s
      .replaceAll('\\', '\\\\')
      .replaceAll('"', String.raw`\"`)
      .replaceAll('\b', String.raw`\b`)
      .replaceAll('\f', String.raw`\f`)
      .replaceAll('\n', String.raw`\n`)
      .replaceAll('\r', String.raw`\r`)
      .replaceAll('\t', String.raw`\t`) +
    '"'
  );
}

/**
 * Section header for a given module code.
 * - `core`     → `[core]`
 * - `<other>`  → `[modules.<other>]`
 *
 * Mirrors the layout `manifest-generator.writeCentralConfig` produces.
 */
function sectionHeader(moduleCode) {
  return moduleCode === 'core' ? '[core]' : `[modules.${moduleCode}]`;
}

/**
 * Insert or update `key = value` inside a TOML section, returning the new
 * file content. The format produced by the installer is regular and small
 * enough that a line scanner is more reliable than pulling in a TOML
 * round-tripper that would normalize the file's existing whitespace and
 * comment structure.
 *
 *   - If `[section]` exists and contains `key`, replace the value on that
 *     line (preserving any inline comment after the value).
 *   - If `[section]` exists but `key` doesn't, append `key = value` at the
 *     end of the section (before the next `[...]` header or EOF, skipping
 *     trailing blank lines so the section stays tidy).
 *   - If `[section]` doesn't exist, append a new section block at EOF.
 *
 * @param {string} content   existing file content (may be empty)
 * @param {string} section   exact `[section]` header to target
 * @param {string} key
 * @param {string} valueToml already TOML-encoded value (e.g. `"foo"`)
 * @returns {string} new content
 */
function upsertTomlKey(content, section, key, valueToml) {
  const lines = content.split('\n');
  // Track whether the file already ended with a newline so we can preserve
  // that. `split('\n')` on `"a\n"` yields `['a', '']`, which gives us the
  // marker we need.
  const hadTrailingNewline = lines.length > 0 && lines.at(-1) === '';
  if (hadTrailingNewline) lines.pop();

  // Locate the target section. Tolerates a trailing inline comment on the
  // header (`[core]  # personal`) and a header line with non-newline
  // trailing whitespace — `line.trim() === section` would miss both.
  const sectionStart = lines.findIndex((line) => isSectionHeader(line, section));
  if (sectionStart === -1) {
    // Section doesn't exist — append a new block. Pad with a blank line if
    // the file is non-empty so sections stay visually separated.
    if (lines.length > 0 && lines.at(-1).trim() !== '') lines.push('');
    lines.push(section, `${key} = ${valueToml}`);
    return lines.join('\n') + (hadTrailingNewline ? '\n' : '');
  }

  // Find the section's end (next `[...]` header or EOF).
  let sectionEnd = lines.length;
  for (let i = sectionStart + 1; i < lines.length; i++) {
    if (/^\s*\[/.test(lines[i])) {
      sectionEnd = i;
      break;
    }
  }

  // Look for the key inside the section. Match `<key> = ...` allowing
  // optional leading whitespace; preserve the comment tail (`# ...`) if any.
  const keyPattern = new RegExp(`^(\\s*)${escapeRegExp(key)}\\s*=\\s*(.*)$`);
  for (let i = sectionStart + 1; i < sectionEnd; i++) {
    const match = lines[i].match(keyPattern);
    if (match) {
      const indent = match[1];
      // Preserve trailing comment if present. `findInlineCommentStart` tracks
      // double-quoted string state so a `#` inside a value like
      // `"path with # hash"` isn't mistaken for a comment marker (per TOML
      // spec, basic strings may contain unescaped `#`).
      const tail = match[2];
      const commentIdx = findInlineCommentStart(tail);
      const commentSuffix = commentIdx === -1 ? '' : tail.slice(commentIdx);
      lines[i] = `${indent}${key} = ${valueToml}${commentSuffix}`;
      return lines.join('\n') + (hadTrailingNewline ? '\n' : '');
    }
  }

  // Section exists but key doesn't. Insert before the next section header,
  // skipping trailing blank lines inside the current section so the new
  // entry sits with its siblings.
  let insertAt = sectionEnd;
  while (insertAt > sectionStart + 1 && lines[insertAt - 1].trim() === '') {
    insertAt--;
  }
  lines.splice(insertAt, 0, `${key} = ${valueToml}`);
  return lines.join('\n') + (hadTrailingNewline ? '\n' : '');
}

function escapeRegExp(s) {
  return s.replaceAll(/[.*+?^${}()|[\]\\]/g, String.raw`\$&`);
}

/**
 * Match a TOML section header line against a target like `[core]`. Tolerates
 * leading/trailing whitespace and a trailing inline comment, which the
 * previous `line.trim() === section` check missed.
 */
function isSectionHeader(line, target) {
  const trimmed = line.trimStart();
  if (!trimmed.startsWith(target)) return false;
  const after = trimmed.slice(target.length);
  return /^\s*(?:#.*)?$/.test(after);
}

/**
 * Find the start index of an inline `# comment` in a TOML value tail,
 * tracking double-quoted string state so a `#` inside a string literal is
 * not treated as a comment. Returns the index of the whitespace run that
 * precedes the `#` (matching the contract of the old `/\s+#/` regex), or
 * -1 if there's no inline comment.
 */
function findInlineCommentStart(text) {
  let inString = false;
  let escaped = false;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
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
      let j = i;
      while (j > 0 && /\s/.test(text[j - 1])) j--;
      if (j < i) return j;
    }
  }
  return -1;
}

/**
 * Look up `[section] key` in a TOML file. Returns true if the file exists,
 * the section is present, and `key` is set within it. Used by
 * `applySetOverrides` to route an override to the file that already owns
 * the key (so user-scope keys land in `config.user.toml`, team-scope keys
 * land in `config.toml`).
 */
async function tomlHasKey(filePath, section, key) {
  if (!(await fs.pathExists(filePath))) return false;
  const content = await fs.readFile(filePath, 'utf8');
  const lines = content.split('\n');
  const keyPattern = new RegExp(`^\\s*${escapeRegExp(key)}\\s*=`);
  // Walk every line tracking whether we're inside the target section. This
  // both tolerates inline-commented headers (`[core]  # personal`) and
  // handles the edge case where the same section appears more than once
  // (legal in TOML — tomllib merges them — but the previous `findIndex`
  // only checked the first block, misrouting `--set`).
  let inTargetSection = false;
  for (const line of lines) {
    if (/^\s*\[/.test(line)) {
      inTargetSection = isSectionHeader(line, section);
      continue;
    }
    if (inTargetSection && keyPattern.test(line)) return true;
  }
  return false;
}

/**
 * Look up which prompt keys in `core/module.yaml` are declared `scope: user`.
 * Used so `--set` routes core scope:user keys (user_name, communication_language)
 * to the global identity file the installer's writeGlobalUserCore writes to,
 * rather than polluting project config.toml as a team-scope key.
 * Returns an empty set if core isn't installed or the schema can't be parsed.
 */
async function loadCoreUserScopeKeys() {
  const result = new Set();
  try {
    const corePath = await resolveInstalledModuleYaml('core');
    if (!corePath) return result;
    const parsed = yaml.parse(await fs.readFile(corePath, 'utf8'));
    if (!parsed || typeof parsed !== 'object') return result;
    for (const [key, value] of Object.entries(parsed)) {
      if (value && typeof value === 'object' && 'prompt' in value && value.scope === 'user') {
        result.add(key);
      }
    }
  } catch {
    // Schema unavailable — fall back to two-tier routing.
  }
  return result;
}

/**
 * Apply parsed `--set` overrides to the central TOML files written by the
 * installer. Called at the end of an install / quick-update.
 *
 * Routing per (module, key):
 *   1. If `~/.bmad/config.user.toml` already has `[section] key`, update there
 *      (global identity store — same place writeGlobalUserCore writes to).
 *   2. Else if `_bmad/config.user.toml` already has `[section] key`, update
 *      there (project-scoped personal override).
 *   3. Else if the key is a known core scope:user key (user_name,
 *      communication_language per core/module.yaml), route to global. Otherwise
 *      writeCentralConfig's next-install partition would strip the value out
 *      of project files.
 *   4. Otherwise update `_bmad/config.toml` (team scope, the default).
 *
 * The schema-correct partition lives in `manifest-generator`. We only reach
 * for the core schema (small, always present) so the first-run case for
 * `--set core.user_name=...` doesn't land in the wrong file.
 *
 * @param {Object<string, Object<string, string>>} overrides
 * @param {string} bmadDir absolute path to `_bmad/`
 * @returns {Promise<Array<{module:string,key:string,scope:'team'|'user',file:string}>>}
 *          a list of applied entries (for caller logging)
 */
async function applySetOverrides(overrides, bmadDir) {
  const applied = [];
  if (!overrides || typeof overrides !== 'object') return applied;

  const teamPath = path.join(bmadDir, 'config.toml');
  const userPath = path.join(bmadDir, 'config.user.toml');
  const globalPath = globalUserConfigPath();
  const coreUserKeys = await loadCoreUserScopeKeys();

  for (const moduleCode of Object.keys(overrides)) {
    // Skip overrides for modules not actually installed. The installer writes
    // `_bmad/<module>/config.yaml` for every installed module (including core),
    // so its presence is a reliable "is this module here?" signal that works
    // for both fresh installs and quick-updates without coupling to caller-
    // supplied module lists.
    const moduleConfigYaml = path.join(bmadDir, moduleCode, 'config.yaml');
    if (!(await fs.pathExists(moduleConfigYaml))) {
      continue;
    }

    const section = sectionHeader(moduleCode);
    const moduleOverrides = overrides[moduleCode] || {};
    for (const key of Object.keys(moduleOverrides)) {
      const value = moduleOverrides[key];
      const valueToml = tomlString(value);

      // 3-tier routing: prefer the file that already owns the key; otherwise
      // honor core's user-scope partition (so `--set core.user_name` lands in
      // ~/.bmad on a fresh install, not in project team config).
      const globalOwnsIt = moduleCode === 'core' && (await tomlHasKey(globalPath, section, key));
      const userOwnsIt = !globalOwnsIt && (await tomlHasKey(userPath, section, key));
      const isCoreUserScope = moduleCode === 'core' && coreUserKeys.has(key) && !userOwnsIt;
      let targetPath;
      let scope;
      if (globalOwnsIt || isCoreUserScope) {
        targetPath = globalPath;
        scope = 'user';
      } else if (userOwnsIt) {
        targetPath = userPath;
        scope = 'user';
      } else {
        targetPath = teamPath;
        scope = 'team';
      }

      // The team file always exists post-install; the user/global files only
      // exist once the installer has reason to write to them. If we're routing
      // to one that doesn't exist yet, create it with a minimal header so it
      // has the same shape as installer-written files.
      let content = '';
      if (await fs.pathExists(targetPath)) {
        content = await fs.readFile(targetPath, 'utf8');
      } else if (targetPath === globalPath) {
        await fs.ensureDir(path.dirname(globalPath));
        content = '# Global personal BMad config (see ~/.bmad).\n';
      } else {
        content = '# Personal overrides for _bmad/config.toml.\n';
      }

      const next = upsertTomlKey(content, section, key, valueToml);
      await fs.writeFile(targetPath, next, 'utf8');
      applied.push({
        module: moduleCode,
        key,
        scope,
        file: targetPath === globalPath ? '~/.bmad/config.user.toml' : path.basename(targetPath),
      });
    }

    // Also patch the per-module yaml (`_bmad/<module>/config.yaml`). The
    // installer reads this file as `_existingConfig` on subsequent runs and
    // surfaces declared values as prompt defaults — under `--yes` those
    // defaults are accepted, so patching here gives `--set` natural
    // carry-forward for declared keys without needing schema-strict
    // partition exemptions in the manifest writer. For undeclared keys the
    // value lives in the per-module yaml but won't be re-emitted into
    // config.toml on the next install (the schema-strict partition drops
    // it); re-pass `--set` if you need it sticky.
    const moduleYamlPath = path.join(bmadDir, moduleCode, 'config.yaml');
    if (await fs.pathExists(moduleYamlPath)) {
      try {
        const text = await fs.readFile(moduleYamlPath, 'utf8');
        const parsed = yaml.parse(text);
        if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
          // Preserve the installer's banner header (everything up to the
          // first non-comment line) so `_bmad/<module>/config.yaml` keeps
          // its provenance comments after we round-trip it.
          const headerLines = [];
          for (const line of text.split('\n')) {
            if (line.startsWith('#') || line.trim() === '') {
              headerLines.push(line);
            } else {
              break;
            }
          }
          for (const key of Object.keys(moduleOverrides)) {
            parsed[key] = moduleOverrides[key];
          }
          const body = yaml.stringify(parsed, { indent: 2, lineWidth: 0, minContentWidth: 0 });
          const header = headerLines.length > 0 ? headerLines.join('\n') + '\n' : '';
          await fs.writeFile(moduleYamlPath, header + body, 'utf8');
        }
      } catch {
        // Per-module yaml unparseable — skip silently. The central toml was
        // already patched above, which is the user-visible state for the
        // current install. Carry-forward will fail next install but the
        // current install reflects the override.
      }
    }
  }

  return applied;
}

module.exports = { parseSetEntry, parseSetEntries, applySetOverrides, upsertTomlKey, tomlString };
