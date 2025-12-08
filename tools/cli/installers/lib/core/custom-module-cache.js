/**
 * Custom Module Source Cache
 * Caches custom module sources under _cfg/custom/ to ensure they're never lost
 * and can be checked into source control
 */

const fs = require('fs-extra');
const path = require('node:path');
const crypto = require('node:crypto');

class CustomModuleCache {
  constructor(bmadDir) {
    this.bmadDir = bmadDir;
    this.customCacheDir = path.join(bmadDir, '_cfg', 'custom');
    this.manifestPath = path.join(this.customCacheDir, 'cache-manifest.yaml');
  }

  /**
   * Ensure the custom cache directory exists
   */
  async ensureCacheDir() {
    await fs.ensureDir(this.customCacheDir);
  }

  /**
   * Get cache manifest
   */
  async getCacheManifest() {
    if (!(await fs.pathExists(this.manifestPath))) {
      return {};
    }

    const content = await fs.readFile(this.manifestPath, 'utf8');
    const yaml = require('js-yaml');
    return yaml.load(content) || {};
  }

  /**
   * Update cache manifest
   */
  async updateCacheManifest(manifest) {
    const yaml = require('js-yaml');
    const content = yaml.dump(manifest, {
      indent: 2,
      lineWidth: -1,
      noRefs: true,
      sortKeys: false,
    });

    await fs.writeFile(this.manifestPath, content);
  }

  /**
   * Calculate hash of a file or directory
   */
  async calculateHash(sourcePath) {
    const hash = crypto.createHash('sha256');

    const isDir = (await fs.stat(sourcePath)).isDirectory();

    if (isDir) {
      // For directories, hash all files
      const files = [];
      async function collectFiles(dir) {
        const entries = await fs.readdir(dir, { withFileTypes: true });
        for (const entry of entries) {
          if (entry.isFile()) {
            files.push(path.join(dir, entry.name));
          } else if (entry.isDirectory() && !entry.name.startsWith('.')) {
            await collectFiles(path.join(dir, entry.name));
          }
        }
      }

      await collectFiles(sourcePath);
      files.sort(); // Ensure consistent order

      for (const file of files) {
        const content = await fs.readFile(file);
        const relativePath = path.relative(sourcePath, file);
        hash.update(relativePath + '|' + content.toString('base64'));
      }
    } else {
      // For single files
      const content = await fs.readFile(sourcePath);
      hash.update(content);
    }

    return hash.digest('hex');
  }

  /**
   * Cache a custom module source
   * @param {string} moduleId - Module ID
   * @param {string} sourcePath - Original source path
   * @param {Object} metadata - Additional metadata to store
   * @returns {Object} Cached module info
   */
  async cacheModule(moduleId, sourcePath, metadata = {}) {
    await this.ensureCacheDir();

    const cacheDir = path.join(this.customCacheDir, moduleId);
    const cacheManifest = await this.getCacheManifest();

    // Check if already cached and unchanged
    if (cacheManifest[moduleId]) {
      const cached = cacheManifest[moduleId];
      if (cached.originalHash && cached.originalHash === (await this.calculateHash(sourcePath))) {
        // Source unchanged, return existing cache info
        return {
          moduleId,
          cachePath: cacheDir,
          ...cached,
        };
      }
    }

    // Remove existing cache if it exists
    if (await fs.pathExists(cacheDir)) {
      await fs.remove(cacheDir);
    }

    // Copy module to cache
    await fs.copy(sourcePath, cacheDir, {
      filter: (src) => {
        const relative = path.relative(sourcePath, src);
        // Skip node_modules, .git, and other common ignore patterns
        return !relative.includes('node_modules') && !relative.startsWith('.git') && !relative.startsWith('.DS_Store');
      },
    });

    // Calculate hash of the source
    const sourceHash = await this.calculateHash(sourcePath);
    const cacheHash = await this.calculateHash(cacheDir);

    // Update manifest - don't store originalPath for source control friendliness
    cacheManifest[moduleId] = {
      originalHash: sourceHash,
      cacheHash: cacheHash,
      cachedAt: new Date().toISOString(),
      ...metadata,
    };

    await this.updateCacheManifest(cacheManifest);

    return {
      moduleId,
      cachePath: cacheDir,
      ...cacheManifest[moduleId],
    };
  }

  /**
   * Get cached module info
   * @param {string} moduleId - Module ID
   * @returns {Object|null} Cached module info or null
   */
  async getCachedModule(moduleId) {
    const cacheManifest = await this.getCacheManifest();
    const cached = cacheManifest[moduleId];

    if (!cached) {
      return null;
    }

    const cacheDir = path.join(this.customCacheDir, moduleId);

    if (!(await fs.pathExists(cacheDir))) {
      // Cache dir missing, remove from manifest
      delete cacheManifest[moduleId];
      await this.updateCacheManifest(cacheManifest);
      return null;
    }

    // Verify cache integrity
    const currentCacheHash = await this.calculateHash(cacheDir);
    if (currentCacheHash !== cached.cacheHash) {
      console.warn(`Warning: Cache integrity check failed for ${moduleId}`);
    }

    return {
      moduleId,
      cachePath: cacheDir,
      ...cached,
    };
  }

  /**
   * Get all cached modules
   * @returns {Array} Array of cached module info
   */
  async getAllCachedModules() {
    const cacheManifest = await this.getCacheManifest();
    const cached = [];

    for (const [moduleId, info] of Object.entries(cacheManifest)) {
      const cachedModule = await this.getCachedModule(moduleId);
      if (cachedModule) {
        cached.push(cachedModule);
      }
    }

    return cached;
  }

  /**
   * Remove a cached module
   * @param {string} moduleId - Module ID to remove
   */
  async removeCachedModule(moduleId) {
    const cacheManifest = await this.getCacheManifest();
    const cacheDir = path.join(this.customCacheDir, moduleId);

    // Remove cache directory
    if (await fs.pathExists(cacheDir)) {
      await fs.remove(cacheDir);
    }

    // Remove from manifest
    delete cacheManifest[moduleId];
    await this.updateCacheManifest(cacheManifest);
  }

  /**
   * Sync cached modules with a list of module IDs
   * @param {Array<string>} moduleIds - Module IDs to keep
   */
  async syncCache(moduleIds) {
    const cached = await this.getAllCachedModules();

    for (const cachedModule of cached) {
      if (!moduleIds.includes(cachedModule.moduleId)) {
        await this.removeCachedModule(cachedModule.moduleId);
      }
    }
  }
}

module.exports = { CustomModuleCache };
