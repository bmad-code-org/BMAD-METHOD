const path = require('node:path');
const semver = require('semver');
const yaml = require('yaml');
const fs = require('../fs-native');
const { getExternalModuleCachePath, getModulePath, resolveInstalledModuleYaml } = require('../project-root');

const DEFAULT_PARENT_DEPTH = 8;

/**
 * Resolve a module version from authoritative on-disk metadata.
 * Preference order:
 *   1. package.json nearest the module source/cache root
 *   2. module.yaml in the module source directory
 *   3. .claude-plugin/marketplace.json
 *   4. caller-provided fallback version
 *
 * @param {string} moduleName - Module code/name
 * @param {Object} [options]
 * @param {string} [options.moduleSourcePath] - Directory containing module.yaml
 * @param {string} [options.fallbackVersion] - Final fallback when no metadata is found
 * @param {string[]} [options.marketplacePluginNames] - Preferred marketplace plugin names
 * @returns {Promise<{version: string|null, source: string|null, path: string|null}>}
 */
async function resolveModuleVersion(moduleName, options = {}) {
  const moduleSourcePath = await normalizeDirectoryPath(options.moduleSourcePath);
  const packageJsonPath = await findPackageJsonPath(moduleName, moduleSourcePath);

  if (packageJsonPath) {
    const packageVersion = await readPackageJsonVersion(packageJsonPath);
    if (packageVersion) {
      return {
        version: packageVersion,
        source: 'package.json',
        path: packageJsonPath,
      };
    }
  }

  const moduleYamlPath = await findModuleYamlPath(moduleName, moduleSourcePath);
  if (moduleYamlPath) {
    const moduleVersion = await readModuleYamlVersion(moduleYamlPath);
    if (moduleVersion) {
      return {
        version: moduleVersion,
        source: 'module.yaml',
        path: moduleYamlPath,
      };
    }
  }

  const marketplaceVersion = await findMarketplaceVersion(moduleName, moduleSourcePath, options.marketplacePluginNames || []);
  if (marketplaceVersion) {
    return marketplaceVersion;
  }

  const fallbackVersion = normalizeVersion(options.fallbackVersion);
  if (fallbackVersion) {
    return {
      version: fallbackVersion,
      source: 'fallback',
      path: null,
    };
  }

  return {
    version: null,
    source: null,
    path: null,
  };
}

async function findPackageJsonPath(moduleName, moduleSourcePath) {
  const roots = await buildSearchRoots(moduleName, moduleSourcePath);

  for (const root of roots) {
    const packageJsonPath = await findNearestUpwardFile(root.searchDir, 'package.json', { boundaryDir: root.boundaryDir });
    if (packageJsonPath) {
      return packageJsonPath;
    }
  }

  return null;
}

async function findModuleYamlPath(moduleName, moduleSourcePath) {
  if (moduleSourcePath) {
    const directModuleYamlPath = path.join(moduleSourcePath, 'module.yaml');
    if (await fs.pathExists(directModuleYamlPath)) {
      return directModuleYamlPath;
    }
  }

  return resolveInstalledModuleYaml(moduleName);
}

async function findMarketplaceVersion(moduleName, moduleSourcePath, marketplacePluginNames) {
  const roots = await buildSearchRoots(moduleName, moduleSourcePath);

  for (const root of roots) {
    const marketplacePath = await findNearestUpwardFile(root.searchDir, path.join('.claude-plugin', 'marketplace.json'), {
      boundaryDir: root.boundaryDir,
    });
    if (!marketplacePath) {
      continue;
    }

    const data = await readJsonFile(marketplacePath);
    if (!data) {
      continue;
    }

    const version = extractMarketplaceVersion(data, moduleName, marketplacePluginNames);
    if (version) {
      return {
        version,
        source: 'marketplace.json',
        path: marketplacePath,
      };
    }
  }

  return null;
}

async function buildSearchRoots(moduleName, moduleSourcePath) {
  const roots = [];
  const seen = new Set();

  const addRoot = async (candidate) => {
    const normalized = await normalizeExistingDirectory(candidate);
    if (!normalized || seen.has(normalized)) {
      return;
    }

    seen.add(normalized);
    roots.push({
      searchDir: normalized,
      boundaryDir: await findSearchBoundary(normalized),
    });
  };

  await addRoot(moduleSourcePath);

  if (moduleName === 'core' || moduleName === 'bmm') {
    await addRoot(getModulePath(moduleName));
  } else {
    await addRoot(getExternalModuleCachePath(moduleName));
  }

  return roots;
}

async function findNearestUpwardFile(startDir, relativeFilePath, options = {}) {
  const normalizedStartDir = await normalizeExistingDirectory(startDir);
  if (!normalizedStartDir) {
    return null;
  }

  const maxDepth = options.maxDepth ?? DEFAULT_PARENT_DEPTH;
  const normalizedBoundaryDir = await normalizeDirectoryPath(options.boundaryDir);
  let currentDir = normalizedStartDir;
  for (let depth = 0; depth <= maxDepth; depth++) {
    const candidate = path.join(currentDir, relativeFilePath);
    if (await fs.pathExists(candidate)) {
      return candidate;
    }

    if (normalizedBoundaryDir && currentDir === normalizedBoundaryDir) {
      break;
    }

    const parentDir = path.dirname(currentDir);
    if (parentDir === currentDir) {
      break;
    }
    currentDir = parentDir;
  }

  return null;
}

async function findSearchBoundary(startDir) {
  const normalizedStartDir = await normalizeExistingDirectory(startDir);
  if (!normalizedStartDir) {
    return null;
  }

  let currentDir = normalizedStartDir;
  for (let depth = 0; depth <= DEFAULT_PARENT_DEPTH; depth++) {
    if (
      (await fs.pathExists(path.join(currentDir, 'package.json'))) ||
      (await fs.pathExists(path.join(currentDir, '.claude-plugin', 'marketplace.json'))) ||
      (await fs.pathExists(path.join(currentDir, '.git')))
    ) {
      return currentDir;
    }

    const parentDir = path.dirname(currentDir);
    if (parentDir === currentDir) {
      break;
    }
    currentDir = parentDir;
  }

  return normalizedStartDir;
}

async function normalizeDirectoryPath(candidate) {
  if (!candidate) {
    return null;
  }

  const resolvedPath = path.resolve(candidate);
  try {
    const stats = await fs.stat(resolvedPath);
    return stats.isDirectory() ? resolvedPath : path.dirname(resolvedPath);
  } catch {
    return resolvedPath;
  }
}

async function normalizeExistingDirectory(candidate) {
  const normalized = await normalizeDirectoryPath(candidate);
  if (!normalized) {
    return null;
  }

  if (!(await fs.pathExists(normalized))) {
    return null;
  }

  return normalized;
}

async function readPackageJsonVersion(packageJsonPath) {
  const data = await readJsonFile(packageJsonPath);
  return normalizeVersion(data?.version);
}

async function readModuleYamlVersion(moduleYamlPath) {
  try {
    const content = await fs.readFile(moduleYamlPath, 'utf8');
    const data = yaml.parse(content);
    return normalizeVersion(data?.version || data?.module_version || data?.moduleVersion);
  } catch {
    return null;
  }
}

async function readJsonFile(filePath) {
  try {
    const content = await fs.readFile(filePath, 'utf8');
    return JSON.parse(content);
  } catch {
    return null;
  }
}

function extractMarketplaceVersion(data, moduleName, marketplacePluginNames = []) {
  const plugins = Array.isArray(data?.plugins) ? data.plugins : [];
  if (plugins.length === 0) {
    return null;
  }

  const preferredNames = new Set(
    [moduleName, ...marketplacePluginNames]
      .filter((value) => typeof value === 'string')
      .map((value) => value.trim())
      .filter(Boolean),
  );

  const exactMatches = [];
  const fallbackVersions = [];

  for (const plugin of plugins) {
    const version = normalizeVersion(plugin?.version);
    if (!version) {
      continue;
    }

    fallbackVersions.push(version);

    const pluginNames = [plugin?.name, plugin?.code].filter((value) => typeof value === 'string').map((value) => value.trim());
    if (pluginNames.some((name) => preferredNames.has(name))) {
      exactMatches.push(version);
    }
  }

  return pickBestVersion(exactMatches.length > 0 ? exactMatches : fallbackVersions);
}

function pickBestVersion(versions) {
  const candidates = versions.map(normalizeVersion).filter(Boolean);
  if (candidates.length === 0) {
    return null;
  }

  candidates.sort(compareVersionsDescending);
  return candidates[0];
}

function compareVersionsDescending(left, right) {
  const leftSemver = normalizeSemver(left);
  const rightSemver = normalizeSemver(right);

  if (leftSemver && rightSemver) {
    return semver.rcompare(leftSemver, rightSemver);
  }

  if (leftSemver) {
    return -1;
  }

  if (rightSemver) {
    return 1;
  }

  return right.localeCompare(left, undefined, { numeric: true, sensitivity: 'base' });
}

function normalizeSemver(version) {
  return semver.valid(version) || semver.valid(semver.coerce(version));
}

function normalizeVersion(version) {
  if (typeof version !== 'string') {
    return null;
  }

  const trimmed = version.trim();
  return trimmed || null;
}

module.exports = {
  resolveModuleVersion,
};
