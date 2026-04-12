const fs = require('../fs-native');
const os = require('node:os');
const path = require('node:path');
const { execSync } = require('node:child_process');
const yaml = require('yaml');
const prompts = require('../prompts');
const { RegistryClient } = require('./registry-client');

const MARKETPLACE_OWNER = 'bmad-code-org';
const MARKETPLACE_REPO = 'bmad-plugins-marketplace';
const MARKETPLACE_REF = 'main';
const FALLBACK_CONFIG_PATH = path.join(__dirname, 'registry-fallback.yaml');

/**
 * Manages official modules from the remote BMad marketplace registry.
 * Fetches registry/official.yaml from GitHub; falls back to the bundled
 * external-official-modules.yaml when the network is unavailable.
 *
 * @class ExternalModuleManager
 */
class ExternalModuleManager {
  constructor() {
    this._client = new RegistryClient();
  }

  /**
   * Load the official modules registry from GitHub, falling back to the
   * bundled YAML file if the fetch fails.
   * @returns {Object} Parsed YAML content with modules array
   */
  async loadExternalModulesConfig() {
    if (this.cachedModules) {
      return this.cachedModules;
    }

    // Try remote registry first
    try {
      const config = await this._client.fetchGitHubYaml(MARKETPLACE_OWNER, MARKETPLACE_REPO, 'registry/official.yaml', MARKETPLACE_REF);
      if (config?.modules?.length) {
        this.cachedModules = config;
        return config;
      }
    } catch {
      // Fall through to local fallback
    }

    // Fallback to bundled file
    try {
      const content = await fs.readFile(FALLBACK_CONFIG_PATH, 'utf8');
      const config = yaml.parse(content);
      this.cachedModules = config;
      await prompts.log.warn('Could not reach BMad registry; using bundled module list.');
      return config;
    } catch (error) {
      await prompts.log.warn(`Failed to load modules config: ${error.message}`);
      return { modules: [] };
    }
  }

  /**
   * Normalize a module entry from either the remote registry format
   * (snake_case, array) or the legacy bundled format (kebab-case, object map).
   * @param {Object} mod - Raw module config from YAML
   * @param {string} [key] - Key name (only for legacy map format)
   * @returns {Object} Normalized module info
   */
  _normalizeModule(mod, key) {
    return {
      key: key || mod.name,
      url: mod.repository || mod.url,
      moduleDefinition: mod.module_definition || mod['module-definition'],
      code: mod.code,
      name: mod.display_name || mod.name,
      description: mod.description || '',
      defaultSelected: mod.default_selected === true || mod.defaultSelected === true,
      type: mod.type || 'bmad-org',
      npmPackage: mod.npm_package || mod.npmPackage || null,
      builtIn: mod.built_in === true,
      isExternal: mod.built_in !== true,
    };
  }

  /**
   * Get list of available modules from the registry
   * @returns {Array<Object>} Array of module info objects
   */
  async listAvailable() {
    const config = await this.loadExternalModulesConfig();

    // Remote format: modules is an array
    if (Array.isArray(config.modules)) {
      return config.modules.map((mod) => this._normalizeModule(mod));
    }

    // Legacy bundled format: modules is an object map
    const modules = [];
    for (const [key, mod] of Object.entries(config.modules || {})) {
      modules.push(this._normalizeModule(mod, key));
    }
    return modules;
  }

  /**
   * Get module info by code
   * @param {string} code - The module code (e.g., 'cis')
   * @returns {Object|null} Module info or null if not found
   */
  async getModuleByCode(code) {
    const modules = await this.listAvailable();
    return modules.find((m) => m.code === code) || null;
  }

  /**
   * Get the cache directory for external modules
   * @returns {string} Path to the external modules cache directory
   */
  getExternalCacheDir() {
    const cacheDir = path.join(os.homedir(), '.bmad', 'cache', 'external-modules');
    return cacheDir;
  }

  /**
   * Clone an external module repository to cache
   * @param {string} moduleCode - Code of the external module
   * @param {Object} options - Clone options
   * @param {boolean} options.silent - Suppress spinner output
   * @returns {string} Path to the cloned repository
   */
  async cloneExternalModule(moduleCode, options = {}) {
    const moduleInfo = await this.getModuleByCode(moduleCode);

    if (!moduleInfo) {
      throw new Error(`External module '${moduleCode}' not found in the BMad registry`);
    }

    const cacheDir = this.getExternalCacheDir();
    const moduleCacheDir = path.join(cacheDir, moduleCode);
    const silent = options.silent || false;

    // Create cache directory if it doesn't exist
    await fs.ensureDir(cacheDir);

    // Helper to create a spinner or a no-op when silent
    const createSpinner = async () => {
      if (silent) {
        return {
          start() {},
          stop() {},
          error() {},
          message() {},
          cancel() {},
          clear() {},
          get isSpinning() {
            return false;
          },
          get isCancelled() {
            return false;
          },
        };
      }
      return await prompts.spinner();
    };

    // Track if we need to install dependencies
    let needsDependencyInstall = false;
    let wasNewClone = false;

    // Check if already cloned
    if (await fs.pathExists(moduleCacheDir)) {
      // Try to update if it's a git repo
      const fetchSpinner = await createSpinner();
      fetchSpinner.start(`Fetching ${moduleInfo.name}...`);
      try {
        const currentRef = execSync('git rev-parse HEAD', { cwd: moduleCacheDir, stdio: 'pipe' }).toString().trim();
        // Fetch and reset to remote - works better with shallow clones than pull
        execSync('git fetch origin --depth 1', {
          cwd: moduleCacheDir,
          stdio: ['ignore', 'pipe', 'pipe'],
          env: { ...process.env, GIT_TERMINAL_PROMPT: '0' },
        });
        execSync('git reset --hard origin/HEAD', {
          cwd: moduleCacheDir,
          stdio: ['ignore', 'pipe', 'pipe'],
          env: { ...process.env, GIT_TERMINAL_PROMPT: '0' },
        });
        const newRef = execSync('git rev-parse HEAD', { cwd: moduleCacheDir, stdio: 'pipe' }).toString().trim();

        fetchSpinner.stop(`Fetched ${moduleInfo.name}`);
        // Force dependency install if we got new code
        if (currentRef !== newRef) {
          needsDependencyInstall = true;
        }
      } catch {
        fetchSpinner.error(`Fetch failed, re-downloading ${moduleInfo.name}`);
        // If update fails, remove and re-clone
        await fs.remove(moduleCacheDir);
        wasNewClone = true;
      }
    } else {
      wasNewClone = true;
    }

    // Clone if not exists or was removed
    if (wasNewClone) {
      const fetchSpinner = await createSpinner();
      fetchSpinner.start(`Fetching ${moduleInfo.name}...`);
      try {
        execSync(`git clone --depth 1 "${moduleInfo.url}" "${moduleCacheDir}"`, {
          stdio: ['ignore', 'pipe', 'pipe'],
          env: { ...process.env, GIT_TERMINAL_PROMPT: '0' },
        });
        fetchSpinner.stop(`Fetched ${moduleInfo.name}`);
      } catch (error) {
        fetchSpinner.error(`Failed to fetch ${moduleInfo.name}`);
        throw new Error(`Failed to clone external module '${moduleCode}': ${error.message}`);
      }
    }

    // Install dependencies if package.json exists
    const packageJsonPath = path.join(moduleCacheDir, 'package.json');
    const nodeModulesPath = path.join(moduleCacheDir, 'node_modules');
    if (await fs.pathExists(packageJsonPath)) {
      // Install if node_modules doesn't exist, or if package.json is newer (dependencies changed)
      const nodeModulesMissing = !(await fs.pathExists(nodeModulesPath));

      // Force install if we updated or cloned new
      if (needsDependencyInstall || wasNewClone || nodeModulesMissing) {
        const installSpinner = await createSpinner();
        installSpinner.start(`Installing dependencies for ${moduleInfo.name}...`);
        try {
          execSync('npm install --omit=dev --no-audit --no-fund --no-progress --legacy-peer-deps', {
            cwd: moduleCacheDir,
            stdio: ['ignore', 'pipe', 'pipe'],
            timeout: 120_000, // 2 minute timeout
          });
          installSpinner.stop(`Installed dependencies for ${moduleInfo.name}`);
        } catch (error) {
          installSpinner.error(`Failed to install dependencies for ${moduleInfo.name}`);
          if (!silent) await prompts.log.warn(`  ${error.message}`);
        }
      } else {
        // Check if package.json is newer than node_modules
        let packageJsonNewer = false;
        try {
          const packageStats = await fs.stat(packageJsonPath);
          const nodeModulesStats = await fs.stat(nodeModulesPath);
          packageJsonNewer = packageStats.mtime > nodeModulesStats.mtime;
        } catch {
          // If stat fails, assume we need to install
          packageJsonNewer = true;
        }

        if (packageJsonNewer) {
          const installSpinner = await createSpinner();
          installSpinner.start(`Installing dependencies for ${moduleInfo.name}...`);
          try {
            execSync('npm install --omit=dev --no-audit --no-fund --no-progress --legacy-peer-deps', {
              cwd: moduleCacheDir,
              stdio: ['ignore', 'pipe', 'pipe'],
              timeout: 120_000, // 2 minute timeout
            });
            installSpinner.stop(`Installed dependencies for ${moduleInfo.name}`);
          } catch (error) {
            installSpinner.error(`Failed to install dependencies for ${moduleInfo.name}`);
            if (!silent) await prompts.log.warn(`  ${error.message}`);
          }
        }
      }
    }

    return moduleCacheDir;
  }

  /**
   * Find the source path for an external module
   * @param {string} moduleCode - Code of the external module
   * @param {Object} options - Options passed to cloneExternalModule
   * @returns {string|null} Path to the module source or null if not found
   */
  async findExternalModuleSource(moduleCode, options = {}) {
    const moduleInfo = await this.getModuleByCode(moduleCode);

    if (!moduleInfo || moduleInfo.builtIn) {
      return null;
    }

    // Clone the external module repo
    const cloneDir = await this.cloneExternalModule(moduleCode, options);

    // The module-definition specifies the path to module.yaml relative to repo root
    // We need to return the directory containing module.yaml
    const moduleDefinitionPath = moduleInfo.moduleDefinition; // e.g., 'skills/module.yaml'
    const configuredPath = path.join(cloneDir, moduleDefinitionPath);

    if (await fs.pathExists(configuredPath)) {
      return path.dirname(configuredPath);
    }

    // Fallback: search skills/ and src/ (root level and one level deep for subfolders)
    for (const dir of ['skills', 'src']) {
      const rootCandidate = path.join(cloneDir, dir, 'module.yaml');
      if (await fs.pathExists(rootCandidate)) {
        return path.dirname(rootCandidate);
      }
      const dirPath = path.join(cloneDir, dir);
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

    // Check repo root as last fallback
    const rootCandidate = path.join(cloneDir, 'module.yaml');
    if (await fs.pathExists(rootCandidate)) {
      return path.dirname(rootCandidate);
    }

    // Nothing found: return configured path (preserves old behavior for error messaging)
    return path.dirname(configuredPath);
  }
  cachedModules = null;
}

module.exports = { ExternalModuleManager };
