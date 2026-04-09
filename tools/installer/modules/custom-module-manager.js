const fs = require('fs-extra');
const os = require('node:os');
const path = require('node:path');
const { execSync } = require('node:child_process');
const prompts = require('../prompts');
const { RegistryClient } = require('./registry-client');

/**
 * Manages custom modules installed from user-provided GitHub URLs.
 * Validates URLs, fetches .claude-plugin/marketplace.json, clones repos.
 */
class CustomModuleManager {
  /** @type {Map<string, Object>} Shared across all instances: module code -> ResolvedModule */
  static _resolutionCache = new Map();

  constructor() {
    this._client = new RegistryClient();
  }

  // ─── URL Validation ───────────────────────────────────────────────────────

  /**
   * Parse and validate a GitHub repository URL.
   * Supports HTTPS and SSH formats.
   * @param {string} url - GitHub URL to validate
   * @returns {Object} { owner, repo, isValid, error }
   */
  validateGitHubUrl(url) {
    if (!url || typeof url !== 'string') {
      return { owner: null, repo: null, isValid: false, error: 'URL is required' };
    }

    const trimmed = url.trim();

    // HTTPS format: https://github.com/owner/repo[.git]
    const httpsMatch = trimmed.match(/^https?:\/\/github\.com\/([^/]+)\/([^/.]+?)(?:\.git)?$/);
    if (httpsMatch) {
      return { owner: httpsMatch[1], repo: httpsMatch[2], isValid: true, error: null };
    }

    // SSH format: git@github.com:owner/repo.git
    const sshMatch = trimmed.match(/^git@github\.com:([^/]+)\/([^/.]+?)(?:\.git)?$/);
    if (sshMatch) {
      return { owner: sshMatch[1], repo: sshMatch[2], isValid: true, error: null };
    }

    return { owner: null, repo: null, isValid: false, error: 'Not a valid GitHub URL (expected https://github.com/owner/repo)' };
  }

  // ─── Discovery ────────────────────────────────────────────────────────────

  /**
   * Fetch .claude-plugin/marketplace.json from a GitHub repository.
   * @param {string} repoUrl - GitHub repository URL
   * @returns {Object} Parsed marketplace.json content
   */
  async fetchMarketplaceJson(repoUrl) {
    const { owner, repo, isValid, error } = this.validateGitHubUrl(repoUrl);
    if (!isValid) throw new Error(error);

    const rawUrl = `https://raw.githubusercontent.com/${owner}/${repo}/HEAD/.claude-plugin/marketplace.json`;

    try {
      return await this._client.fetchJson(rawUrl);
    } catch (error_) {
      if (error_.message.includes('404')) {
        throw new Error(`No .claude-plugin/marketplace.json found in ${owner}/${repo}. This repository may not be a BMad module.`);
      }
      if (error_.message.includes('403')) {
        throw new Error(`Repository ${owner}/${repo} is not accessible. Make sure it is public.`);
      }
      throw new Error(`Failed to fetch marketplace.json from ${owner}/${repo}: ${error_.message}`);
    }
  }

  /**
   * Discover modules from a GitHub repository's marketplace.json.
   * @param {string} repoUrl - GitHub repository URL
   * @returns {Array<Object>} Normalized plugin list
   */
  async discoverModules(repoUrl) {
    const data = await this.fetchMarketplaceJson(repoUrl);
    const plugins = data?.plugins;

    if (!Array.isArray(plugins) || plugins.length === 0) {
      throw new Error('marketplace.json contains no plugins');
    }

    return plugins.map((plugin) => this._normalizeCustomModule(plugin, repoUrl, data));
  }

  // ─── Clone ────────────────────────────────────────────────────────────────

  /**
   * Get the cache directory for custom modules.
   * @returns {string} Path to the custom modules cache directory
   */
  getCacheDir() {
    return path.join(os.homedir(), '.bmad', 'cache', 'custom-modules');
  }

  /**
   * Clone a custom module repository to cache.
   * @param {string} repoUrl - GitHub repository URL
   * @param {Object} [options] - Clone options
   * @param {boolean} [options.silent] - Suppress spinner output
   * @param {boolean} [options.skipInstall] - Skip npm install (for browsing before user confirms)
   * @returns {string} Path to the cloned repository
   */
  async cloneRepo(repoUrl, options = {}) {
    const { owner, repo, isValid, error } = this.validateGitHubUrl(repoUrl);
    if (!isValid) throw new Error(error);

    const cacheDir = this.getCacheDir();
    const repoCacheDir = path.join(cacheDir, owner, repo);
    const silent = options.silent || false;

    await fs.ensureDir(path.join(cacheDir, owner));

    const createSpinner = async () => {
      if (silent) {
        return { start() {}, stop() {}, error() {} };
      }
      return await prompts.spinner();
    };

    if (await fs.pathExists(repoCacheDir)) {
      // Update existing clone
      const fetchSpinner = await createSpinner();
      fetchSpinner.start(`Updating ${owner}/${repo}...`);
      try {
        execSync('git fetch origin --depth 1', {
          cwd: repoCacheDir,
          stdio: ['ignore', 'pipe', 'pipe'],
          env: { ...process.env, GIT_TERMINAL_PROMPT: '0' },
        });
        execSync('git reset --hard origin/HEAD', {
          cwd: repoCacheDir,
          stdio: ['ignore', 'pipe', 'pipe'],
        });
        fetchSpinner.stop(`Updated ${owner}/${repo}`);
      } catch {
        fetchSpinner.error(`Update failed, re-downloading ${owner}/${repo}`);
        await fs.remove(repoCacheDir);
      }
    }

    if (!(await fs.pathExists(repoCacheDir))) {
      const fetchSpinner = await createSpinner();
      fetchSpinner.start(`Cloning ${owner}/${repo}...`);
      try {
        execSync(`git clone --depth 1 "${repoUrl}" "${repoCacheDir}"`, {
          stdio: ['ignore', 'pipe', 'pipe'],
          env: { ...process.env, GIT_TERMINAL_PROMPT: '0' },
        });
        fetchSpinner.stop(`Cloned ${owner}/${repo}`);
      } catch (error_) {
        fetchSpinner.error(`Failed to clone ${owner}/${repo}`);
        throw new Error(`Failed to clone ${repoUrl}: ${error_.message}`);
      }
    }

    // Install dependencies if package.json exists (skip during browsing/analysis)
    const packageJsonPath = path.join(repoCacheDir, 'package.json');
    if (!options.skipInstall && (await fs.pathExists(packageJsonPath))) {
      const installSpinner = await createSpinner();
      installSpinner.start(`Installing dependencies for ${owner}/${repo}...`);
      try {
        execSync('npm install --omit=dev --no-audit --no-fund --no-progress --legacy-peer-deps', {
          cwd: repoCacheDir,
          stdio: ['ignore', 'pipe', 'pipe'],
          timeout: 120_000,
        });
        installSpinner.stop(`Installed dependencies for ${owner}/${repo}`);
      } catch (error_) {
        installSpinner.error(`Failed to install dependencies for ${owner}/${repo}`);
        if (!silent) await prompts.log.warn(`  ${error_.message}`);
      }
    }

    return repoCacheDir;
  }

  // ─── Plugin Resolution ────────────────────────────────────────────────────

  /**
   * Resolve a plugin to determine installation strategy and module registration files.
   * Results are cached in _resolutionCache keyed by module code.
   * @param {string} repoPath - Absolute path to the cloned repository
   * @param {Object} plugin - Raw plugin object from marketplace.json
   * @param {string} [repoUrl] - Original GitHub URL for manifest tracking
   * @returns {Promise<Array<Object>>} Array of ResolvedModule objects
   */
  async resolvePlugin(repoPath, plugin, repoUrl) {
    const { PluginResolver } = require('./plugin-resolver');
    const resolver = new PluginResolver();
    const resolved = await resolver.resolve(repoPath, plugin);

    // Stamp repo URL onto each resolved module for manifest tracking
    for (const mod of resolved) {
      if (repoUrl) mod.repoUrl = repoUrl;
      CustomModuleManager._resolutionCache.set(mod.code, mod);
    }

    return resolved;
  }

  /**
   * Get a cached resolution result by module code.
   * @param {string} moduleCode - Module code to look up
   * @returns {Object|null} ResolvedModule or null if not cached
   */
  getResolution(moduleCode) {
    return CustomModuleManager._resolutionCache.get(moduleCode) || null;
  }

  // ─── Source Finding ───────────────────────────────────────────────────────

  /**
   * Find the module source path within a cloned custom repo.
   * @param {string} repoUrl - GitHub repository URL (for cache location)
   * @param {string} [pluginSource] - Plugin source path from marketplace.json
   * @returns {string|null} Path to directory containing module.yaml
   */
  async findModuleSource(repoUrl, pluginSource) {
    const { owner, repo } = this.validateGitHubUrl(repoUrl);
    const repoCacheDir = path.join(this.getCacheDir(), owner, repo);

    if (!(await fs.pathExists(repoCacheDir))) return null;

    // Try plugin source path first (e.g., "./src/pro-skills")
    if (pluginSource) {
      const sourcePath = path.join(repoCacheDir, pluginSource);
      const moduleYaml = path.join(sourcePath, 'module.yaml');
      if (await fs.pathExists(moduleYaml)) {
        return sourcePath;
      }
    }

    // Fallback: search skills/ and src/ directories
    for (const dir of ['skills', 'src']) {
      const rootCandidate = path.join(repoCacheDir, dir, 'module.yaml');
      if (await fs.pathExists(rootCandidate)) {
        return path.dirname(rootCandidate);
      }
      const dirPath = path.join(repoCacheDir, dir);
      if (await fs.pathExists(dirPath)) {
        const entries = await fs.readdir(dirPath, { withFileTypes: true });
        for (const entry of entries) {
          if (entry.isDirectory()) {
            const subCandidate = path.join(dirPath, entry.name, 'module.yaml');
            if (await fs.pathExists(subCandidate)) {
              return path.dirname(subCandidate);
            }
          }
        }
      }
    }

    // Check repo root
    const rootCandidate = path.join(repoCacheDir, 'module.yaml');
    if (await fs.pathExists(rootCandidate)) {
      return repoCacheDir;
    }

    return null;
  }

  /**
   * Find module source by module code, searching the custom cache.
   * @param {string} moduleCode - Module code to search for
   * @param {Object} [options] - Options
   * @returns {string|null} Path to the module source or null
   */
  async findModuleSourceByCode(moduleCode, options = {}) {
    // Check resolution cache first (populated by resolvePlugin)
    const resolved = CustomModuleManager._resolutionCache.get(moduleCode);
    if (resolved) {
      // For strategies 1-2: the common parent or setup skill's parent has the module files
      if (resolved.moduleYamlPath) {
        return path.dirname(resolved.moduleYamlPath);
      }
      // For strategy 5 (synthesized): return the first skill's parent as a reference path
      if (resolved.skillPaths && resolved.skillPaths.length > 0) {
        return path.dirname(resolved.skillPaths[0]);
      }
    }

    const cacheDir = this.getCacheDir();
    if (!(await fs.pathExists(cacheDir))) return null;

    // Search through all custom repo caches
    try {
      const owners = await fs.readdir(cacheDir, { withFileTypes: true });
      for (const ownerEntry of owners) {
        if (!ownerEntry.isDirectory()) continue;
        const ownerPath = path.join(cacheDir, ownerEntry.name);
        const repos = await fs.readdir(ownerPath, { withFileTypes: true });
        for (const repoEntry of repos) {
          if (!repoEntry.isDirectory()) continue;
          const repoPath = path.join(ownerPath, repoEntry.name);

          // Check marketplace.json for matching module code
          const marketplacePath = path.join(repoPath, '.claude-plugin', 'marketplace.json');
          if (await fs.pathExists(marketplacePath)) {
            try {
              const data = JSON.parse(await fs.readFile(marketplacePath, 'utf8'));
              for (const plugin of data.plugins || []) {
                if (plugin.name === moduleCode) {
                  // Found the module - find its source
                  const sourcePath = plugin.source ? path.join(repoPath, plugin.source) : repoPath;
                  const moduleYaml = path.join(sourcePath, 'module.yaml');
                  if (await fs.pathExists(moduleYaml)) {
                    return sourcePath;
                  }
                }
              }
            } catch {
              // Skip malformed marketplace.json
            }
          }
        }
      }
    } catch {
      // Cache doesn't exist or is inaccessible
    }

    return null;
  }

  // ─── Normalization ────────────────────────────────────────────────────────

  /**
   * Normalize a plugin from marketplace.json to a consistent shape.
   * @param {Object} plugin - Plugin object from marketplace.json
   * @param {string} repoUrl - Source repository URL
   * @param {Object} data - Full marketplace.json data
   * @returns {Object} Normalized module info
   */
  _normalizeCustomModule(plugin, repoUrl, data) {
    return {
      code: plugin.name,
      name: plugin.name,
      displayName: plugin.name,
      description: plugin.description || '',
      version: plugin.version || null,
      author: plugin.author || data.owner || '',
      url: repoUrl,
      source: plugin.source || null,
      skills: plugin.skills || [],
      rawPlugin: plugin,
      type: 'custom',
      trustTier: 'unverified',
      builtIn: false,
      isExternal: true,
    };
  }
}

module.exports = { CustomModuleManager };
