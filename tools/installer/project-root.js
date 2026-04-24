const path = require('node:path');
const os = require('node:os');
const fs = require('./fs-native');

/**
 * Find the BMAD project root directory by looking for package.json
 * or specific BMAD markers
 */
function findProjectRoot(startPath = __dirname) {
  let currentPath = path.resolve(startPath);

  // Keep going up until we find package.json with bmad-method
  while (currentPath !== path.dirname(currentPath)) {
    const packagePath = path.join(currentPath, 'package.json');

    if (fs.existsSync(packagePath)) {
      try {
        const pkg = fs.readJsonSync(packagePath);
        // Check if this is the BMAD project
        if (pkg.name === 'bmad-method' || fs.existsSync(path.join(currentPath, 'src', 'core-skills'))) {
          return currentPath;
        }
      } catch {
        // Continue searching
      }
    }

    // Also check for src/core-skills as a marker
    if (fs.existsSync(path.join(currentPath, 'src', 'core-skills', 'agents'))) {
      return currentPath;
    }

    currentPath = path.dirname(currentPath);
  }

  // If we can't find it, use process.cwd() as fallback
  return process.cwd();
}

// Cache the project root after first calculation
let cachedRoot = null;

function getProjectRoot() {
  if (!cachedRoot) {
    cachedRoot = findProjectRoot();
  }
  return cachedRoot;
}

/**
 * Get path to source directory
 */
function getSourcePath(...segments) {
  return path.join(getProjectRoot(), 'src', ...segments);
}

/**
 * Get path to a module's directory
 * bmm is a built-in module directly under src/
 * core is also directly under src/
 * All other modules are stored remote
 */
function getModulePath(moduleName, ...segments) {
  if (moduleName === 'core') {
    return getSourcePath('core-skills', ...segments);
  }
  if (moduleName === 'bmm') {
    return getSourcePath('bmm-skills', ...segments);
  }
  return getSourcePath('modules', moduleName, ...segments);
}

/**
 * Path to the local external-module clone cache.
 * External official modules (bmb, cis, gds, tea, wds, etc.) are cloned here
 * by ExternalModuleManager during install and are not copied into <src>/modules/.
 */
function getExternalModuleCachePath(moduleName, ...segments) {
  const base = process.env.BMAD_EXTERNAL_MODULES_CACHE || path.join(os.homedir(), '.bmad', 'cache', 'external-modules');
  return path.join(base, moduleName, ...segments);
}

/**
 * Locate an installed module's `module.yaml` by filesystem lookup only.
 *
 * Built-in modules (core, bmm) live under <src>. External official modules are
 * cloned into ~/.bmad/cache/external-modules/<name>/ with varying internal
 * layouts (some at src/module.yaml, some at skills/module.yaml, some nested).
 * Local custom-source modules are not cached; their path is read from the
 * CustomModuleManager resolution cache set during the same install run.
 * This mirrors the candidate-path search in
 * ExternalModuleManager.findExternalModuleSource but performs no git/network
 * work, which keeps it safe to call during manifest writing.
 *
 * @param {string} moduleName
 * @returns {Promise<string|null>} Absolute path to module.yaml, or null if not found.
 */
async function resolveInstalledModuleYaml(moduleName) {
  const builtIn = path.join(getModulePath(moduleName), 'module.yaml');
  if (await fs.pathExists(builtIn)) return builtIn;

  // Search a resolved root directory using the same candidate-path pattern.
  async function searchRoot(root) {
    for (const dir of ['skills', 'src']) {
      const direct = path.join(root, dir, 'module.yaml');
      if (await fs.pathExists(direct)) return direct;

      const dirPath = path.join(root, dir);
      if (await fs.pathExists(dirPath)) {
        const entries = await fs.readdir(dirPath, { withFileTypes: true });
        for (const entry of entries) {
          if (!entry.isDirectory()) continue;
          const nested = path.join(dirPath, entry.name, 'module.yaml');
          if (await fs.pathExists(nested)) return nested;
        }
      }
    }

    // BMB standard: {setup-skill}/assets/module.yaml (setup skill is any *-setup directory)
    const rootEntries = await fs.readdir(root, { withFileTypes: true });
    for (const entry of rootEntries) {
      if (!entry.isDirectory() || !entry.name.endsWith('-setup')) continue;
      const setupAssets = path.join(root, entry.name, 'assets', 'module.yaml');
      if (await fs.pathExists(setupAssets)) return setupAssets;
    }

    const atRoot = path.join(root, 'module.yaml');
    if (await fs.pathExists(atRoot)) return atRoot;
    return null;
  }

  const cacheRoot = getExternalModuleCachePath(moduleName);
  if (await fs.pathExists(cacheRoot)) {
    const found = await searchRoot(cacheRoot);
    if (found) return found;
  }

  // Fallback: local custom-source modules store their source path in the
  // CustomModuleManager resolution cache populated during the same install run.
  // Match by code OR name since callers may use either form.
  try {
    const { CustomModuleManager } = require('./modules/custom-module-manager');
    for (const [, mod] of CustomModuleManager._resolutionCache) {
      if ((mod.code === moduleName || mod.name === moduleName) && mod.localPath) {
        const found = await searchRoot(mod.localPath);
        if (found) return found;
      }
    }
  } catch {
    // Resolution cache unavailable — continue
  }

  return null;
}

module.exports = {
  getProjectRoot,
  getSourcePath,
  getModulePath,
  getExternalModuleCachePath,
  resolveInstalledModuleYaml,
  findProjectRoot,
};
