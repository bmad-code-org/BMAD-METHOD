const fs = require('fs-extra');
const os = require('node:os');
const path = require('node:path');
const { execSync } = require('node:child_process');
const prompts = require('../prompts');
const { RegistryClient } = require('./registry-client');

const MARKETPLACE_BASE = 'https://raw.githubusercontent.com/bmad-code-org/bmad-plugins-marketplace/main';
const COMMUNITY_INDEX_URL = `${MARKETPLACE_BASE}/registry/community-index.yaml`;
const CATEGORIES_URL = `${MARKETPLACE_BASE}/categories.yaml`;

/**
 * Manages community modules from the BMad marketplace registry.
 * Fetches community-index.yaml and categories.yaml from GitHub.
 * Returns empty results when the registry is unreachable.
 * Community modules are pinned to approved SHA when set; uses HEAD otherwise.
 */
class CommunityModuleManager {
  constructor() {
    this._client = new RegistryClient();
    this._cachedIndex = null;
    this._cachedCategories = null;
  }

  // ─── Data Loading ──────────────────────────────────────────────────────────

  /**
   * Load the community module index from the marketplace repo.
   * Returns empty when the registry is unreachable.
   * @returns {Object} Parsed YAML with modules array
   */
  async loadCommunityIndex() {
    if (this._cachedIndex) return this._cachedIndex;

    try {
      const config = await this._client.fetchYaml(COMMUNITY_INDEX_URL);
      if (config?.modules?.length) {
        this._cachedIndex = config;
        return config;
      }
    } catch {
      // Registry unreachable - no community modules available
    }

    return { modules: [] };
  }

  /**
   * Load categories from the marketplace repo.
   * Returns empty when the registry is unreachable.
   * @returns {Object} Parsed categories.yaml content
   */
  async loadCategories() {
    if (this._cachedCategories) return this._cachedCategories;

    try {
      const config = await this._client.fetchYaml(CATEGORIES_URL);
      if (config?.categories) {
        this._cachedCategories = config;
        return config;
      }
    } catch {
      // Registry unreachable - no categories available
    }

    return { categories: {} };
  }

  // ─── Listing & Filtering ──────────────────────────────────────────────────

  /**
   * Get all community modules, normalized.
   * @returns {Array<Object>} Normalized community modules
   */
  async listAll() {
    const index = await this.loadCommunityIndex();
    return (index.modules || []).map((mod) => this._normalizeCommunityModule(mod));
  }

  /**
   * Get community modules filtered to a category.
   * @param {string} categorySlug - Category slug (e.g., 'design-and-creative')
   * @returns {Array<Object>} Filtered modules
   */
  async listByCategory(categorySlug) {
    const all = await this.listAll();
    return all.filter((mod) => mod.category === categorySlug);
  }

  /**
   * Get promoted/featured community modules, sorted by rank.
   * @returns {Array<Object>} Featured modules
   */
  async listFeatured() {
    const all = await this.listAll();
    return all.filter((mod) => mod.promoted === true).sort((a, b) => (a.promotedRank || 999) - (b.promotedRank || 999));
  }

  /**
   * Search community modules by keyword.
   * Matches against name, display name, description, and keywords array.
   * @param {string} query - Search query
   * @returns {Array<Object>} Matching modules
   */
  async searchByKeyword(query) {
    const all = await this.listAll();
    const q = query.toLowerCase();
    return all.filter((mod) => {
      const searchable = [mod.name, mod.displayName, mod.description, ...(mod.keywords || [])].join(' ').toLowerCase();
      return searchable.includes(q);
    });
  }

  /**
   * Get categories with module counts for UI display.
   * Only returns categories that have at least one community module.
   * @returns {Array<Object>} Array of { slug, name, moduleCount }
   */
  async getCategoryList() {
    const all = await this.listAll();
    const categoriesData = await this.loadCategories();
    const categories = categoriesData.categories || {};

    // Count modules per category
    const counts = {};
    for (const mod of all) {
      counts[mod.category] = (counts[mod.category] || 0) + 1;
    }

    // Build list with display names from categories.yaml
    const result = [];
    for (const [slug, count] of Object.entries(counts)) {
      const catInfo = categories[slug];
      result.push({
        slug,
        name: catInfo?.name || slug,
        moduleCount: count,
      });
    }

    // Sort alphabetically by name
    result.sort((a, b) => a.name.localeCompare(b.name));
    return result;
  }

  // ─── Module Lookup ────────────────────────────────────────────────────────

  /**
   * Get a community module by its code.
   * @param {string} code - Module code (e.g., 'wds')
   * @returns {Object|null} Normalized module or null
   */
  async getModuleByCode(code) {
    const all = await this.listAll();
    return all.find((m) => m.code === code) || null;
  }

  // ─── Clone with Tag Pinning ───────────────────────────────────────────────

  /**
   * Get the cache directory for community modules.
   * @returns {string} Path to the community modules cache directory
   */
  getCacheDir() {
    return path.join(os.homedir(), '.bmad', 'cache', 'community-modules');
  }

  /**
   * Clone a community module repository, pinned to its approved tag.
   * @param {string} moduleCode - Module code
   * @param {Object} [options] - Clone options
   * @param {boolean} [options.silent] - Suppress spinner output
   * @returns {string} Path to the cloned repository
   */
  async cloneModule(moduleCode, options = {}) {
    const moduleInfo = await this.getModuleByCode(moduleCode);
    if (!moduleInfo) {
      throw new Error(`Community module '${moduleCode}' not found in the registry`);
    }

    const cacheDir = this.getCacheDir();
    const moduleCacheDir = path.join(cacheDir, moduleCode);
    const silent = options.silent || false;

    await fs.ensureDir(cacheDir);

    const createSpinner = async () => {
      if (silent) {
        return { start() {}, stop() {}, error() {}, message() {} };
      }
      return await prompts.spinner();
    };

    const sha = moduleInfo.approvedSha;
    let needsDependencyInstall = false;
    let wasNewClone = false;

    if (await fs.pathExists(moduleCacheDir)) {
      // Already cloned - update to latest HEAD
      const fetchSpinner = await createSpinner();
      fetchSpinner.start(`Checking ${moduleInfo.displayName}...`);
      try {
        const currentRef = execSync('git rev-parse HEAD', { cwd: moduleCacheDir, stdio: 'pipe' }).toString().trim();
        execSync('git fetch origin --depth 1', {
          cwd: moduleCacheDir,
          stdio: ['ignore', 'pipe', 'pipe'],
          env: { ...process.env, GIT_TERMINAL_PROMPT: '0' },
        });
        execSync('git reset --hard origin/HEAD', {
          cwd: moduleCacheDir,
          stdio: ['ignore', 'pipe', 'pipe'],
        });
        const newRef = execSync('git rev-parse HEAD', { cwd: moduleCacheDir, stdio: 'pipe' }).toString().trim();
        if (currentRef !== newRef) needsDependencyInstall = true;
        fetchSpinner.stop(`Verified ${moduleInfo.displayName}`);
      } catch {
        fetchSpinner.error(`Fetch failed, re-downloading ${moduleInfo.displayName}`);
        await fs.remove(moduleCacheDir);
        wasNewClone = true;
      }
    } else {
      wasNewClone = true;
    }

    if (wasNewClone) {
      const fetchSpinner = await createSpinner();
      fetchSpinner.start(`Fetching ${moduleInfo.displayName}...`);
      try {
        execSync(`git clone --depth 1 "${moduleInfo.url}" "${moduleCacheDir}"`, {
          stdio: ['ignore', 'pipe', 'pipe'],
          env: { ...process.env, GIT_TERMINAL_PROMPT: '0' },
        });
        fetchSpinner.stop(`Fetched ${moduleInfo.displayName}`);
        needsDependencyInstall = true;
      } catch (error) {
        fetchSpinner.error(`Failed to fetch ${moduleInfo.displayName}`);
        throw new Error(`Failed to clone community module '${moduleCode}': ${error.message}`);
      }
    }

    // If pinned to a specific SHA, check out that exact commit.
    // Refuse to install if the approved SHA cannot be reached - security requirement.
    if (sha) {
      const headSha = execSync('git rev-parse HEAD', { cwd: moduleCacheDir, stdio: 'pipe' }).toString().trim();
      if (headSha !== sha) {
        try {
          execSync(`git fetch --depth 1 origin ${sha}`, {
            cwd: moduleCacheDir,
            stdio: ['ignore', 'pipe', 'pipe'],
            env: { ...process.env, GIT_TERMINAL_PROMPT: '0' },
          });
          execSync(`git checkout ${sha}`, {
            cwd: moduleCacheDir,
            stdio: ['ignore', 'pipe', 'pipe'],
          });
          needsDependencyInstall = true;
        } catch {
          await fs.remove(moduleCacheDir);
          throw new Error(
            `Community module '${moduleCode}' could not be pinned to its approved commit (${sha}). ` +
              `Installation refused for security. The module registry entry may need updating.`,
          );
        }
      }
    }

    // Install dependencies if needed
    const packageJsonPath = path.join(moduleCacheDir, 'package.json');
    if ((needsDependencyInstall || wasNewClone) && (await fs.pathExists(packageJsonPath))) {
      const installSpinner = await createSpinner();
      installSpinner.start(`Installing dependencies for ${moduleInfo.displayName}...`);
      try {
        execSync('npm install --omit=dev --no-audit --no-fund --no-progress --legacy-peer-deps', {
          cwd: moduleCacheDir,
          stdio: ['ignore', 'pipe', 'pipe'],
          timeout: 120_000,
        });
        installSpinner.stop(`Installed dependencies for ${moduleInfo.displayName}`);
      } catch (error) {
        installSpinner.error(`Failed to install dependencies for ${moduleInfo.displayName}`);
        if (!silent) await prompts.log.warn(`  ${error.message}`);
      }
    }

    return moduleCacheDir;
  }

  // ─── Source Finding ───────────────────────────────────────────────────────

  /**
   * Find the source path for a community module (clone + locate module.yaml).
   * @param {string} moduleCode - Module code
   * @param {Object} [options] - Options passed to cloneModule
   * @returns {string|null} Path to the module source or null
   */
  async findModuleSource(moduleCode, options = {}) {
    const moduleInfo = await this.getModuleByCode(moduleCode);
    if (!moduleInfo) return null;

    const cloneDir = await this.cloneModule(moduleCode, options);

    // Check configured module_definition path first
    if (moduleInfo.moduleDefinition) {
      const configuredPath = path.join(cloneDir, moduleInfo.moduleDefinition);
      if (await fs.pathExists(configuredPath)) {
        return path.dirname(configuredPath);
      }
    }

    // Fallback: search skills/ and src/ directories
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

    // Check repo root
    const rootCandidate = path.join(cloneDir, 'module.yaml');
    if (await fs.pathExists(rootCandidate)) {
      return path.dirname(rootCandidate);
    }

    return moduleInfo.moduleDefinition ? path.dirname(path.join(cloneDir, moduleInfo.moduleDefinition)) : null;
  }

  // ─── Normalization ────────────────────────────────────────────────────────

  /**
   * Normalize a community module entry to a consistent shape.
   * @param {Object} mod - Raw module from community-index.yaml
   * @returns {Object} Normalized module info
   */
  _normalizeCommunityModule(mod) {
    return {
      key: mod.name,
      code: mod.code,
      name: mod.display_name || mod.name,
      displayName: mod.display_name || mod.name,
      description: mod.description || '',
      url: mod.repository || mod.url,
      moduleDefinition: mod.module_definition || mod['module-definition'],
      npmPackage: mod.npm_package || mod.npmPackage || null,
      author: mod.author || '',
      license: mod.license || '',
      type: 'community',
      category: mod.category || '',
      subcategory: mod.subcategory || '',
      keywords: mod.keywords || [],
      version: mod.version || null,
      approvedTag: mod.approved_tag || null,
      approvedSha: mod.approved_sha || null,
      approvedDate: mod.approved_date || null,
      reviewer: mod.reviewer || null,
      trustTier: mod.trust_tier || 'unverified',
      promoted: mod.promoted === true,
      promotedRank: mod.promoted_rank || null,
      defaultSelected: false,
      builtIn: false,
      isExternal: true,
    };
  }
}

module.exports = { CommunityModuleManager };
