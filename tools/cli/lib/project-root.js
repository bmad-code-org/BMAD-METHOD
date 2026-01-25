const path = require('node:path');
const fs = require('fs-extra');

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
        if (pkg.name === 'bmad-method' || fs.existsSync(path.join(currentPath, 'src', 'core'))) {
          return currentPath;
        }
      } catch {
        // Continue searching
      }
    }

    // Also check for src/core as a marker
    if (fs.existsSync(path.join(currentPath, 'src', 'core', 'agents'))) {
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
    return getSourcePath('core', ...segments);
  }
  if (moduleName === 'bmm') {
    return getSourcePath('bmm', ...segments);
  }
  return getSourcePath('modules', moduleName, ...segments);
}

module.exports = {
  getProjectRoot,
  getSourcePath,
  getModulePath,
  findProjectRoot,
};
