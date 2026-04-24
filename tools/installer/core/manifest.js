const path = require('node:path');
const fs = require('../fs-native');
const crypto = require('node:crypto');
const { resolveModuleVersion } = require('../modules/version-resolver');
const prompts = require('../prompts');

class Manifest {
  /**
   * Create a new manifest
   * @param {string} bmadDir - Path to bmad directory
   * @param {Object} data - Manifest data
   * @param {Array} installedFiles - List of installed files (no longer used, files tracked in files-manifest.csv)
   */
  async create(bmadDir, data, installedFiles = []) {
    const manifestPath = path.join(bmadDir, '_config', 'manifest.yaml');
    const yaml = require('yaml');

    // Ensure _config directory exists
    await fs.ensureDir(path.dirname(manifestPath));

    // Get the BMad version from package.json
    const bmadVersion = data.version || require(path.join(process.cwd(), 'package.json')).version;

    // Convert module list to new detailed format
    const moduleDetails = [];
    if (data.modules && Array.isArray(data.modules)) {
      for (const moduleName of data.modules) {
        // Core and BMM modules use the BMad version
        const moduleVersion = moduleName === 'core' || moduleName === 'bmm' ? bmadVersion : null;
        const now = data.installDate || new Date().toISOString();

        moduleDetails.push({
          name: moduleName,
          version: moduleVersion,
          installDate: now,
          lastUpdated: now,
          source: moduleName === 'core' || moduleName === 'bmm' ? 'built-in' : 'unknown',
        });
      }
    }

    // Structure the manifest data
    const manifestData = {
      installation: {
        version: bmadVersion,
        installDate: data.installDate || new Date().toISOString(),
        lastUpdated: data.lastUpdated || new Date().toISOString(),
      },
      modules: moduleDetails,
      ides: data.ides || [],
    };

    // Write YAML manifest
    // Clean the manifest data to remove any non-serializable values
    const cleanManifestData = structuredClone(manifestData);

    const yamlContent = yaml.stringify(cleanManifestData, {
      indent: 2,
      lineWidth: 0,
      sortKeys: false,
    });

    // Ensure POSIX-compliant final newline
    const content = yamlContent.endsWith('\n') ? yamlContent : yamlContent + '\n';
    await fs.writeFile(manifestPath, content, 'utf8');
    return { success: true, path: manifestPath, filesTracked: 0 };
  }

  /**
   * Read existing manifest
   * @param {string} bmadDir - Path to bmad directory
   * @returns {Object|null} Manifest data or null if not found
   */
  async read(bmadDir) {
    const yamlPath = path.join(bmadDir, '_config', 'manifest.yaml');
    const yaml = require('yaml');

    if (await fs.pathExists(yamlPath)) {
      try {
        const content = await fs.readFile(yamlPath, 'utf8');
        const manifestData = yaml.parse(content);

        // Handle new detailed module format
        const modules = manifestData.modules || [];

        // For backward compatibility: if modules is an array of strings (old format),
        // the calling code may need the array of names
        const moduleNames = modules.map((m) => (typeof m === 'string' ? m : m.name));

        // Check if we have the new detailed format
        const hasDetailedModules = modules.length > 0 && typeof modules[0] === 'object';

        // Flatten the structure for compatibility with existing code
        return {
          version: manifestData.installation?.version,
          installDate: manifestData.installation?.installDate,
          lastUpdated: manifestData.installation?.lastUpdated,
          modules: moduleNames, // Simple array of module names for backward compatibility
          modulesDetailed: hasDetailedModules ? modules : null, // New detailed format
          ides: manifestData.ides || [],
        };
      } catch (error) {
        await prompts.log.error(`Failed to read YAML manifest: ${error.message}`);
      }
    }

    return null;
  }

  /**
   * Read raw manifest data without flattening
   * @param {string} bmadDir - Path to bmad directory
   * @returns {Object|null} Raw manifest data or null if not found
   */
  async _readRaw(bmadDir) {
    const yamlPath = path.join(bmadDir, '_config', 'manifest.yaml');
    const yaml = require('yaml');

    if (await fs.pathExists(yamlPath)) {
      try {
        const content = await fs.readFile(yamlPath, 'utf8');
        return yaml.parse(content);
      } catch (error) {
        await prompts.log.error(`Failed to read YAML manifest: ${error.message}`);
      }
    }

    return null;
  }

  /**
   * Flatten manifest for backward compatibility
   * @param {Object} manifest - Raw manifest data
   * @returns {Object} Flattened manifest
   */
  _flattenManifest(manifest) {
    const modules = manifest.modules || [];
    const moduleNames = modules.map((m) => (typeof m === 'string' ? m : m.name));
    const hasDetailedModules = modules.length > 0 && typeof modules[0] === 'object';

    return {
      version: manifest.installation?.version,
      installDate: manifest.installation?.installDate,
      lastUpdated: manifest.installation?.lastUpdated,
      modules: moduleNames,
      modulesDetailed: hasDetailedModules ? modules : null,
      ides: manifest.ides || [],
    };
  }

  /**
   * Add a module to the manifest with optional version info
   * If module already exists, update its version info
   * @param {string} bmadDir - Path to bmad directory
   * @param {string} moduleName - Module name to add
   * @param {Object} options - Optional version info
   */
  async addModule(bmadDir, moduleName, options = {}) {
    let manifest = await this._readRaw(bmadDir);
    if (!manifest) {
      // Bootstrap a minimal manifest if it doesn't exist yet
      // (e.g., skill-only modules with no agents to compile)
      manifest = { modules: [] };
    }

    if (!manifest.modules) {
      manifest.modules = [];
    }

    const existingIndex = manifest.modules.findIndex((m) => m.name === moduleName);

    if (existingIndex === -1) {
      // Module doesn't exist, add it
      const entry = {
        name: moduleName,
        version: options.version || null,
        installDate: new Date().toISOString(),
        lastUpdated: new Date().toISOString(),
        source: options.source || 'unknown',
        npmPackage: options.npmPackage || null,
        repoUrl: options.repoUrl || null,
      };
      if (options.channel) entry.channel = options.channel;
      if (options.sha) entry.sha = options.sha;
      if (options.localPath) entry.localPath = options.localPath;
      if (options.rawSource) entry.rawSource = options.rawSource;
      if (options.registryApprovedTag) entry.registryApprovedTag = options.registryApprovedTag;
      if (options.registryApprovedSha) entry.registryApprovedSha = options.registryApprovedSha;
      manifest.modules.push(entry);
    } else {
      // Module exists, update its version info
      const existing = manifest.modules[existingIndex];
      manifest.modules[existingIndex] = {
        ...existing,
        version: options.version === undefined ? existing.version : options.version,
        source: options.source || existing.source,
        npmPackage: options.npmPackage === undefined ? existing.npmPackage : options.npmPackage,
        repoUrl: options.repoUrl === undefined ? existing.repoUrl : options.repoUrl,
        localPath: options.localPath === undefined ? existing.localPath : options.localPath,
        channel: options.channel === undefined ? existing.channel : options.channel,
        sha: options.sha === undefined ? existing.sha : options.sha,
        rawSource: options.rawSource === undefined ? existing.rawSource : options.rawSource,
        registryApprovedTag: options.registryApprovedTag === undefined ? existing.registryApprovedTag : options.registryApprovedTag,
        registryApprovedSha: options.registryApprovedSha === undefined ? existing.registryApprovedSha : options.registryApprovedSha,
        lastUpdated: new Date().toISOString(),
      };
    }

    await this._writeRaw(bmadDir, manifest);
  }

  /**
   * Get all modules with their version info
   * @param {string} bmadDir - Path to bmad directory
   * @returns {Array} Array of module info objects
   */
  async getAllModuleVersions(bmadDir) {
    const manifest = await this._readRaw(bmadDir);
    if (!manifest || !manifest.modules) {
      return [];
    }

    return manifest.modules;
  }

  /**
   * Write raw manifest data to file
   * @param {string} bmadDir - Path to bmad directory
   * @param {Object} manifestData - Raw manifest data to write
   */
  async _writeRaw(bmadDir, manifestData) {
    const yaml = require('yaml');
    const manifestPath = path.join(bmadDir, '_config', 'manifest.yaml');

    await fs.ensureDir(path.dirname(manifestPath));

    const cleanManifestData = structuredClone(manifestData);

    const yamlContent = yaml.stringify(cleanManifestData, {
      indent: 2,
      lineWidth: 0,
      sortKeys: false,
    });

    const content = yamlContent.endsWith('\n') ? yamlContent : yamlContent + '\n';
    await fs.writeFile(manifestPath, content, 'utf8');
  }

  /**
   * Calculate SHA256 hash of a file
   * @param {string} filePath - Path to file
   * @returns {string} SHA256 hash
   */
  async calculateFileHash(filePath) {
    try {
      const content = await fs.readFile(filePath);
      return crypto.createHash('sha256').update(content).digest('hex');
    } catch {
      return null;
    }
  }

  /**
   * Get module version info from source
   * @param {string} moduleName - Module name/code
   * @param {string} bmadDir - Path to bmad directory
   * @param {string} moduleSourcePath - Optional source path for custom modules
   * @returns {Object} Version info object with version, source, npmPackage, repoUrl
   */
  async getModuleVersionInfo(moduleName, bmadDir, moduleSourcePath = null) {
    // Resolve source type first, then read version with the correct path context
    if (['core', 'bmm'].includes(moduleName)) {
      const versionInfo = await resolveModuleVersion(moduleName, { moduleSourcePath });
      return {
        version: versionInfo.version,
        source: 'built-in',
        npmPackage: null,
        repoUrl: null,
      };
    }

    // Check if this is an external official module
    const { ExternalModuleManager } = require('../modules/external-manager');
    const extMgr = new ExternalModuleManager();
    const moduleInfo = await extMgr.getModuleByCode(moduleName);

    if (moduleInfo) {
      const externalResolution = extMgr.getResolution(moduleName);
      const versionInfo = await resolveModuleVersion(moduleName, { moduleSourcePath });
      return {
        // Git tag recorded during install trumps the on-disk package.json
        // version, so the manifest carries "v1.7.0" instead of "1.7.0".
        version: externalResolution?.version || versionInfo.version,
        source: 'external',
        npmPackage: moduleInfo.npmPackage || null,
        repoUrl: moduleInfo.url || null,
        channel: externalResolution?.channel || null,
        sha: externalResolution?.sha || null,
      };
    }

    // Check if this is a community module
    const { CommunityModuleManager } = require('../modules/community-manager');
    const communityMgr = new CommunityModuleManager();
    const communityInfo = await communityMgr.getModuleByCode(moduleName);
    if (communityInfo) {
      const communityResolution = communityMgr.getResolution(moduleName);
      const versionInfo = await resolveModuleVersion(moduleName, {
        moduleSourcePath,
        fallbackVersion: communityInfo.version,
      });
      return {
        version: communityResolution?.version || versionInfo.version || communityInfo.version,
        source: 'community',
        npmPackage: communityInfo.npmPackage || null,
        repoUrl: communityInfo.url || null,
        channel: communityResolution?.channel || null,
        sha: communityResolution?.sha || null,
        registryApprovedTag: communityResolution?.registryApprovedTag || null,
        registryApprovedSha: communityResolution?.registryApprovedSha || null,
      };
    }

    // Check if this is a custom module (from user-provided URL or local path)
    const { CustomModuleManager } = require('../modules/custom-module-manager');
    const customMgr = new CustomModuleManager();
    const resolved = customMgr.getResolution(moduleName);
    const customSource = await customMgr.findModuleSourceByCode(moduleName, { bmadDir });
    if (customSource || resolved) {
      const versionInfo = await resolveModuleVersion(moduleName, {
        moduleSourcePath: moduleSourcePath || customSource,
        fallbackVersion: resolved?.version,
        marketplacePluginNames: resolved?.pluginName ? [resolved.pluginName] : [],
      });
      const hasGitClone = !!resolved?.repoUrl;
      return {
        // Prefer the git ref we actually cloned over the package.json version.
        version: resolved?.cloneRef || (hasGitClone ? 'main' : versionInfo.version),
        source: 'custom',
        npmPackage: null,
        repoUrl: resolved?.repoUrl || null,
        localPath: resolved?.localPath || null,
        channel: hasGitClone ? (resolved?.cloneRef ? 'pinned' : 'next') : null,
        sha: resolved?.cloneSha || null,
        rawSource: resolved?.rawInput || null,
      };
    }

    // Unknown module
    const versionInfo = await resolveModuleVersion(moduleName, { moduleSourcePath });
    return {
      version: versionInfo.version,
      source: 'unknown',
      npmPackage: null,
      repoUrl: null,
    };
  }

  /**
   * Fetch latest version from npm for a package
   * @param {string} packageName - npm package name
   * @returns {string|null} Latest version or null
   */
  async fetchNpmVersion(packageName) {
    try {
      const https = require('node:https');
      const { execSync } = require('node:child_process');

      // Try using npm view first (more reliable)
      try {
        const result = execSync(`npm view ${packageName} version`, {
          encoding: 'utf8',
          stdio: 'pipe',
          timeout: 10_000,
        });
        return result.trim();
      } catch {
        // Fallback to npm registry API
        return new Promise((resolve, reject) => {
          https
            .get(`https://registry.npmjs.org/${packageName}`, (res) => {
              let data = '';
              res.on('data', (chunk) => (data += chunk));
              res.on('end', () => {
                try {
                  const pkg = JSON.parse(data);
                  resolve(pkg['dist-tags']?.latest || pkg.version || null);
                } catch {
                  resolve(null);
                }
              });
            })
            .on('error', () => resolve(null));
        });
      }
    } catch {
      return null;
    }
  }

  /**
   * Check for available updates for installed modules
   * @param {string} bmadDir - Path to bmad directory
   * @returns {Array} Array of update info objects
   */
  async checkForUpdates(bmadDir) {
    const semver = require('semver');
    const modules = await this.getAllModuleVersions(bmadDir);
    const updates = [];

    for (const module of modules) {
      if (!module.npmPackage) {
        continue; // Skip modules without npm package (built-in)
      }

      const latestVersion = await this.fetchNpmVersion(module.npmPackage);
      if (!latestVersion) {
        continue;
      }

      const installedVersion = semver.valid(module.version) || semver.valid(semver.coerce(module.version || ''));
      const availableVersion = semver.valid(latestVersion) || semver.valid(semver.coerce(latestVersion));

      if (installedVersion && availableVersion && semver.gt(availableVersion, installedVersion)) {
        updates.push({
          name: module.name,
          installedVersion: module.version,
          latestVersion: latestVersion,
          npmPackage: module.npmPackage,
          updateAvailable: true,
        });
      }
    }

    return updates;
  }
}

module.exports = { Manifest };
