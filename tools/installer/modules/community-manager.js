const fs = require('../fs-native');
const os = require('node:os');
const path = require('node:path');
const { execSync } = require('node:child_process');
const prompts = require('../prompts');
const { RegistryClient } = require('./registry-client');
const { decideChannelForModule } = require('./channel-plan');
const { parseGitHubRepo, tagExists } = require('./channel-resolver');

const MARKETPLACE_OWNER = 'bmad-code-org';
const MARKETPLACE_REPO = 'bmad-plugins-marketplace';
const MARKETPLACE_REF = 'main';

/**
 * Manages community modules from the BMad marketplace registry.
 * Fetches community-index.yaml and categories.yaml from GitHub.
 * Returns empty results when the registry is unreachable.
 * Community modules are pinned to approved SHA when set; uses HEAD otherwise.
 */
function quoteShellRef(ref) {
  if (typeof ref !== 'string' || !/^[\w.\-+/]+$/.test(ref)) {
    throw new Error(`Unsafe ref name: ${JSON.stringify(ref)}`);
  }
  return `"${ref}"`;
}

class CommunityModuleManager {
  // moduleCode → { channel, version, sha, registryApprovedTag, registryApprovedSha, repoUrl, bypassedCurator }
  // Shared across all instances; the manifest writer often uses a fresh instance.
  static _resolutions = new Map();

  constructor() {
    this._client = new RegistryClient();
    this._cachedIndex = null;
    this._cachedCategories = null;
  }

  /** Get the most recent channel resolution for a community module. */
  getResolution(moduleCode) {
    return CommunityModuleManager._resolutions.get(moduleCode) || null;
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
      const config = await this._client.fetchGitHubYaml(
        MARKETPLACE_OWNER,
        MARKETPLACE_REPO,
        'registry/community-index.yaml',
        MARKETPLACE_REF,
      );
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
      const config = await this._client.fetchGitHubYaml(MARKETPLACE_OWNER, MARKETPLACE_REPO, 'categories.yaml', MARKETPLACE_REF);
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

    // ─── Resolve channel plan ──────────────────────────────────────────────
    // Default community behavior (stable channel) honors the curator's
    // approved SHA. --next=CODE and --pin CODE=TAG override the curator; we
    // warn the user before bypassing the approved version.
    const planEntry = decideChannelForModule({
      code: moduleCode,
      channelOptions: options.channelOptions,
      registryDefault: 'stable',
    });

    const approvedSha = moduleInfo.approvedSha;
    const approvedTag = moduleInfo.approvedTag;

    let bypassedCurator = false;
    if (planEntry.channel !== 'stable') {
      bypassedCurator = true;
      if (!silent) {
        const approvedLabel = approvedTag || approvedSha || 'curator-approved version';
        await prompts.log.warn(
          `WARNING: Installing '${moduleCode}' from ${
            planEntry.channel === 'pinned' ? `tag ${planEntry.pin}` : 'main HEAD'
          } bypasses the curator-approved ${approvedLabel}. Proceed only if you trust this source.`,
        );
        if (!options.channelOptions?.acceptBypass) {
          const proceed = await prompts.confirm({
            message: `Continue installing '${moduleCode}' with curator bypass?`,
            default: false,
          });
          if (!proceed) {
            throw new Error(`Install of community module '${moduleCode}' cancelled by user.`);
          }
        }
      }
    }

    let needsDependencyInstall = false;
    let wasNewClone = false;

    if (await fs.pathExists(moduleCacheDir)) {
      // Already cloned — refresh to the correct ref for the resolved channel.
      // A pinned install must not reset to origin/HEAD (it would silently drift
      // to main on every re-install). Stable + approvedSha is handled below
      // by the curator-SHA checkout logic.
      const fetchSpinner = await createSpinner();
      fetchSpinner.start(`Checking ${moduleInfo.displayName}...`);
      try {
        const currentRef = execSync('git rev-parse HEAD', { cwd: moduleCacheDir, stdio: 'pipe' }).toString().trim();
        execSync('git fetch origin --depth 1', {
          cwd: moduleCacheDir,
          stdio: ['ignore', 'pipe', 'pipe'],
          env: { ...process.env, GIT_TERMINAL_PROMPT: '0' },
        });
        if (planEntry.channel === 'pinned') {
          // Fetch the pin tag specifically and check it out.
          execSync(`git fetch --depth 1 origin ${quoteShellRef(planEntry.pin)} --no-tags`, {
            cwd: moduleCacheDir,
            stdio: ['ignore', 'pipe', 'pipe'],
            env: { ...process.env, GIT_TERMINAL_PROMPT: '0' },
          });
          execSync('git checkout --quiet FETCH_HEAD', {
            cwd: moduleCacheDir,
            stdio: ['ignore', 'pipe', 'pipe'],
          });
        } else {
          // stable (approvedSha path re-checks out below) and next: track main.
          execSync('git reset --hard origin/HEAD', {
            cwd: moduleCacheDir,
            stdio: ['ignore', 'pipe', 'pipe'],
          });
        }
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
        if (planEntry.channel === 'pinned') {
          execSync(`git clone --depth 1 --branch ${quoteShellRef(planEntry.pin)} "${moduleInfo.url}" "${moduleCacheDir}"`, {
            stdio: ['ignore', 'pipe', 'pipe'],
            env: { ...process.env, GIT_TERMINAL_PROMPT: '0' },
          });
        } else {
          execSync(`git clone --depth 1 "${moduleInfo.url}" "${moduleCacheDir}"`, {
            stdio: ['ignore', 'pipe', 'pipe'],
            env: { ...process.env, GIT_TERMINAL_PROMPT: '0' },
          });
        }
        fetchSpinner.stop(`Fetched ${moduleInfo.displayName}`);
        needsDependencyInstall = true;
      } catch (error) {
        fetchSpinner.error(`Failed to fetch ${moduleInfo.displayName}`);
        throw new Error(`Failed to clone community module '${moduleCode}': ${error.message}`);
      }
    }

    // ─── Check out the resolved ref per channel ──────────────────────────
    if (planEntry.channel === 'stable' && approvedSha) {
      // Default path: pin to the curator-approved SHA. Refuse install if the SHA
      // is unreachable (tag may have been deleted or rewritten) — security requirement.
      const headSha = execSync('git rev-parse HEAD', { cwd: moduleCacheDir, stdio: 'pipe' }).toString().trim();
      if (headSha !== approvedSha) {
        try {
          execSync(`git fetch --depth 1 origin ${quoteShellRef(approvedSha)}`, {
            cwd: moduleCacheDir,
            stdio: ['ignore', 'pipe', 'pipe'],
            env: { ...process.env, GIT_TERMINAL_PROMPT: '0' },
          });
          execSync(`git checkout ${quoteShellRef(approvedSha)}`, {
            cwd: moduleCacheDir,
            stdio: ['ignore', 'pipe', 'pipe'],
          });
          needsDependencyInstall = true;
        } catch {
          await fs.remove(moduleCacheDir);
          throw new Error(
            `Community module '${moduleCode}' could not be pinned to its approved commit (${approvedSha}). ` +
              `Installation refused for security. The module registry entry may need updating, ` +
              `or use --next=${moduleCode} / --pin ${moduleCode}=<tag> to explicitly bypass.`,
          );
        }
      }
    } else if (planEntry.channel === 'stable' && !approvedSha) {
      // Registry data gap: tag or SHA missing. Warn but proceed at HEAD (pre-existing behavior).
      if (!silent) {
        await prompts.log.warn(`Community module '${moduleCode}' has no curator-approved SHA in the registry; installing from main HEAD.`);
      }
    } else if (planEntry.channel === 'pinned') {
      // We cloned the tag directly above (via --branch), but ensure HEAD matches.
      // No additional checkout needed.
    }
    // else: 'next' channel — already at origin/HEAD from the fetch/reset above.

    // Record the resolution so the manifest writer can pick up channel/version/sha.
    const installedSha = execSync('git rev-parse HEAD', { cwd: moduleCacheDir, stdio: 'pipe' }).toString().trim();
    const recordedVersion =
      planEntry.channel === 'pinned' ? planEntry.pin : planEntry.channel === 'next' ? 'main' : approvedTag || installedSha.slice(0, 7);
    CommunityModuleManager._resolutions.set(moduleCode, {
      channel: planEntry.channel,
      version: recordedVersion,
      sha: installedSha,
      registryApprovedTag: approvedTag || null,
      registryApprovedSha: approvedSha || null,
      repoUrl: moduleInfo.url,
      bypassedCurator,
      planSource: planEntry.source,
    });

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
