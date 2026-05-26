const path = require('node:path');
const fs = require('./fs-native');
const yaml = require('yaml');
const { getProjectRoot, getModulePath, getExternalModuleCachePath } = require('./project-root');

/**
 * Read a module.yaml and return its declared `code:` field, or null if missing/unparseable.
 */
async function readModuleCode(yamlPath) {
  try {
    const parsed = yaml.parse(await fs.readFile(yamlPath, 'utf8'));
    if (parsed && typeof parsed === 'object' && typeof parsed.code === 'string') {
      return parsed.code;
    }
  } catch {
    // fall through
  }
  return null;
}

/**
 * Discover module.yaml files for officials we can read locally:
 *   - core, bmm: bundled in src/ (always present)
 *   - external officials: only if previously cloned to ~/.bmad/cache/external-modules/
 *
 * Each result's `code` is the `code:` field from the module.yaml when present;
 * that's the value `--set <module>.<key>=<value>` matches against.
 *
 * Community/custom modules are not enumerated; users reference their own
 * module.yaml directly per the design (see issue #1663).
 *
 * @returns {Promise<Array<{code: string, yamlPath: string, source: string}>>}
 */
async function discoverOfficialModuleYamls() {
  const found = [];
  // Dedupe is case-insensitive because module caches occasionally retain a
  // legacy UPPERCASE-named directory alongside the canonical lowercase one
  // (same module, different cache key from an older schema). We pick whichever
  // entry we see first and skip the alternate-case duplicate. NOTE: `--set`
  // matching itself is case-sensitive (it keys on `moduleName` from the install
  // flow's selected list, which is always lowercase short codes), so the
  // surfaced `code` here is what users should type. Don't change to
  // case-sensitive dedupe without revisiting that contract.
  const seenCodes = new Set();

  const addFound = async (yamlPath, source, fallbackCode) => {
    const declaredCode = await readModuleCode(yamlPath);
    const code = declaredCode || fallbackCode;
    if (!code) return;
    const lower = code.toLowerCase();
    if (seenCodes.has(lower)) return;
    seenCodes.add(lower);
    found.push({ code, yamlPath, source });
  };

  // Built-ins.
  for (const code of ['core', 'bmm']) {
    const yamlPath = path.join(getModulePath(code), 'module.yaml');
    if (await fs.pathExists(yamlPath)) {
      // Built-ins use their well-known short codes regardless of what the
      // module.yaml `code:` says, since the install flow keys on these.
      seenCodes.add(code.toLowerCase());
      found.push({ code, yamlPath, source: 'built-in' });
    }
  }

  // Bundled in src/modules/<code>/module.yaml (rare, but supported by getModulePath).
  const srcModulesDir = path.join(getProjectRoot(), 'src', 'modules');
  if (await fs.pathExists(srcModulesDir)) {
    const entries = await fs.readdir(srcModulesDir, { withFileTypes: true });
    for (const entry of entries) {
      if (!entry.isDirectory()) continue;
      const yamlPath = path.join(srcModulesDir, entry.name, 'module.yaml');
      if (await fs.pathExists(yamlPath)) {
        await addFound(yamlPath, 'bundled', entry.name);
      }
    }
  }

  // External cache (~/.bmad/cache/external-modules/<code>/...).
  const cacheRoot = getExternalModuleCachePath('').replace(/\/$/, '');
  if (await fs.pathExists(cacheRoot)) {
    const rawEntries = await fs.readdir(cacheRoot, { withFileTypes: true });
    for (const entry of rawEntries) {
      if (!entry.isDirectory()) continue;
      const candidates = [
        path.join(cacheRoot, entry.name, 'module.yaml'),
        path.join(cacheRoot, entry.name, 'src', 'module.yaml'),
        path.join(cacheRoot, entry.name, 'skills', 'module.yaml'),
      ];
      for (const candidate of candidates) {
        if (await fs.pathExists(candidate)) {
          await addFound(candidate, 'cached', entry.name);
          break;
        }
      }
    }
  }

  return found;
}

function formatPromptText(item) {
  if (Array.isArray(item.prompt)) return item.prompt.join(' ');
  return String(item.prompt || '').trim();
}

function inferType(item) {
  if (item['single-select']) return 'single-select';
  if (item['multi-select']) return 'multi-select';
  if (typeof item.default === 'boolean') return 'boolean';
  if (typeof item.default === 'number') return 'number';
  return 'string';
}

function formatModuleOptions(code, parsed, source) {
  const lines = [];
  const header = source === 'built-in' ? code : `${code} (${source})`;
  lines.push(header + ':');

  let count = 0;
  for (const [key, item] of Object.entries(parsed)) {
    if (!item || typeof item !== 'object' || !('prompt' in item)) continue;
    count++;
    const type = inferType(item);
    const scope = item.scope === 'user' ? ' [user-scope]' : '';
    const defaultStr = item.default === undefined || item.default === null ? '(none)' : String(item.default);
    lines.push(`  ${code}.${key}    (${type}${scope})  default: ${defaultStr}`);
    const promptText = formatPromptText(item);
    if (promptText) lines.push(`    ${promptText}`);
    if (Array.isArray(item['single-select'])) {
      const values = item['single-select'].map((v) => (typeof v === 'object' ? v.value : v)).filter((v) => v !== undefined);
      if (values.length > 0) lines.push(`    values: ${values.join(' | ')}`);
    }
    lines.push('');
  }

  if (count === 0) {
    lines.push('  (no configurable options)', '');
  }
  return lines.join('\n');
}

/**
 * Render `--list-options` output.
 *
 * Returns `{ text, ok }` so callers can surface a non-zero exit code on
 * a typo'd module-code lookup. Discovery dedupes case-insensitively, so
 * the lookup is also case-insensitive — typing `--list-options BMM` and
 * `--list-options bmm` both find the bmm built-in.
 *
 * @param {string|null} moduleCode - if non-null, restrict to this module
 * @returns {Promise<{text: string, ok: boolean}>}
 */
async function formatOptionsList(moduleCode) {
  const discovered = await discoverOfficialModuleYamls();
  const needle = moduleCode ? moduleCode.toLowerCase() : null;
  const filtered = needle ? discovered.filter((d) => d.code.toLowerCase() === needle) : discovered;

  if (filtered.length === 0) {
    if (moduleCode) {
      const text = [
        `No locally-known module.yaml for '${moduleCode}'.`,
        '',
        'Built-in modules (core, bmm) are always available. External officials',
        'appear here after they have been installed at least once on this machine',
        '(they are cached under ~/.bmad/cache/external-modules/).',
        '',
        'For community or custom modules, read the module.yaml file in that',
        "module's source repository directly.",
      ].join('\n');
      return { text, ok: false };
    }
    return { text: 'No modules found.', ok: false };
  }

  const sections = [];
  // Track when a module-scoped lookup couldn't actually be rendered (yaml
  // unparseable or empty after parse). The full `--list-options` output is
  // tolerant of one bad entry, but `--list-options <module>` against a single
  // unreadable module should still fail tooling so a CI script catches it.
  let moduleScopedFailure = false;
  sections.push('Available --set keys', 'Format: --set <module>.<key>=<value> (repeatable)', '');
  for (const { code, yamlPath, source } of filtered) {
    let parsed;
    try {
      parsed = yaml.parse(await fs.readFile(yamlPath, 'utf8'));
    } catch {
      sections.push(`${code} (${source}): could not parse module.yaml`, '');
      if (moduleCode) moduleScopedFailure = true;
      continue;
    }
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
      sections.push(`${code} (${source}): module.yaml is not a valid object (got ${Array.isArray(parsed) ? 'array' : typeof parsed})`, '');
      if (moduleCode) moduleScopedFailure = true;
      continue;
    }
    sections.push(formatModuleOptions(code, parsed, source));
  }

  if (!moduleCode) {
    sections.push(
      'Community and custom modules are not listed here — read their module.yaml directly. Unknown keys still persist with a warning.',
    );
  }

  return { text: sections.join('\n'), ok: !moduleScopedFailure };
}

module.exports = { formatOptionsList, discoverOfficialModuleYamls };
