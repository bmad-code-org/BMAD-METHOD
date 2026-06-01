const path = require('node:path');
const { pathToFileURL } = require('node:url');
const { getSourcePath } = require('../project-root');

/**
 * Bridge to the bmad-module skill's ESM libraries.
 *
 * The installer is CommonJS; the new module system's install logic lives as
 * zero-dependency ESM under `src/core-skills/bmad-module/scripts/lib/`. Rather
 * than reimplement (and risk drifting from) the spec, the installer reuses the
 * exact same functions the runtime `bmad-module` skill uses to validate a
 * `.claude-plugin/plugin.json#bmad` manifest and lay a module out on disk.
 *
 * This file is the single place that knows the `src/` layout. It lazily
 * `import()`s each lib once and caches the namespace. `pathToFileURL` makes the
 * dynamic-import specifier valid on Windows (bare absolute paths are rejected
 * there).
 */

const LIB_REL = ['core-skills', 'bmad-module', 'scripts', 'lib'];

function libUrl(file) {
  return pathToFileURL(getSourcePath(...LIB_REL, file)).href;
}

const _cache = new Map();
async function load(file) {
  if (!_cache.has(file)) {
    _cache.set(file, await import(libUrl(file)));
  }
  return _cache.get(file);
}

/**
 * Load the subset of skill libs the installer needs to detect, validate, copy,
 * and finalize a new-system (`plugin.json#bmad`) module. Returns a flat object
 * of the named exports.
 */
async function loadBmadModuleLib() {
  const [pluginJson, installPlan, fsSafe, npmDeps] = await Promise.all([
    load('plugin-json.mjs'),
    load('install-plan.mjs'),
    load('fs-safe.mjs'),
    load('npm-deps.mjs'),
  ]);
  return {
    // plugin-json.mjs
    readAndValidateManifest: pluginJson.readAndValidateManifest,
    RESERVED_CODES: pluginJson.RESERVED_CODES,
    CODE_REGEX: pluginJson.CODE_REGEX,
    // install-plan.mjs
    readUserIgnores: installPlan.readUserIgnores,
    buildIgnoreMatcher: installPlan.buildIgnoreMatcher,
    buildCopyPlan: installPlan.buildCopyPlan,
    rewriteManifestPaths: installPlan.rewriteManifestPaths,
    validateDeclaredPaths: installPlan.validateDeclaredPaths,
    // fs-safe.mjs
    stageCopyPlan: fsSafe.stageCopyPlan,
    atomicSwapDir: fsSafe.atomicSwapDir,
    // npm-deps.mjs
    installModuleDeps: npmDeps.installModuleDeps,
  };
}

/**
 * Read `.claude-plugin/plugin.json` from a directory and return the parsed
 * object only when it carries a `bmad` block (i.e. it's a new-system module
 * manifest). Returns null when the file is absent, unparseable, or lacks a
 * `bmad` key — callers then fall back to the legacy marketplace.json path.
 * No validation here; resolution validates via readAndValidateManifest.
 *
 * @param {string} dir - Absolute path to a candidate module root
 * @returns {Promise<Object|null>}
 */
async function readPluginManifest(dir) {
  const fs = require('../fs-native');
  const manifestPath = path.join(dir, '.claude-plugin', 'plugin.json');
  if (!(await fs.pathExists(manifestPath))) return null;
  try {
    const parsed = JSON.parse(await fs.readFile(manifestPath, 'utf8'));
    if (parsed && typeof parsed === 'object' && parsed.bmad && typeof parsed.bmad === 'object') {
      return parsed;
    }
  } catch {
    // Malformed JSON — treat as "not a new-system module" and let the legacy
    // resolver (or validateDeclaredPaths at install time) surface the problem.
  }
  return null;
}

module.exports = { loadBmadModuleLib, readPluginManifest };
