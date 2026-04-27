const fs = require('../fs-native');
const os = require('node:os');
const path = require('node:path');
const { execSync } = require('node:child_process');
const prompts = require('../prompts');

function quoteCustomRef(ref) {
  if (typeof ref !== 'string' || !/^[\w.\-+/]+$/.test(ref)) {
    throw new Error(`Unsafe ref name: ${JSON.stringify(ref)}`);
  }
  return `"${ref}"`;
}

/**
 * Manages custom modules installed from user-provided sources.
 * Supports any Git host (GitHub, GitLab, Bitbucket, self-hosted) and local file paths.
 * Validates input, clones repos, reads .claude-plugin/marketplace.json, resolves plugins.
 */
class CustomModuleManager {
  /** @type {Map<string, Object>} Shared across all instances: module code -> ResolvedModule */
  static _resolutionCache = new Map();

  // ─── Source Parsing ───────────────────────────────────────────────────────

  /**
   * Parse a user-provided source input into a structured descriptor.
   * Accepts local file paths, HTTPS Git URLs, HTTP Git URLs, and SSH Git URLs.
   * For HTTPS/HTTP URLs with deep paths (e.g., /tree/main/subdir), extracts the subdir.
   * The original protocol (http or https) is preserved in the returned cloneUrl.
   *
   * @param {string} input - URL or local file path
   * @returns {Object} Parsed source descriptor:
   *   { type: 'url'|'local', cloneUrl, subdir, localPath, cacheKey, displayName, isValid, error }
   */
  parseSource(input) {
    if (!input || typeof input !== 'string') {
      return {
        type: null,
        cloneUrl: null,
        subdir: null,
        localPath: null,
        cacheKey: null,
        displayName: null,
        isValid: false,
        error: 'Source is required',
      };
    }

    const trimmedRaw = input.trim();
    if (!trimmedRaw) {
      return {
        type: null,
        cloneUrl: null,
        subdir: null,
        localPath: null,
        cacheKey: null,
        displayName: null,
        isValid: false,
        error: 'Source is required',
      };
    }

    // Extract optional @<tag-or-branch> suffix from the end of the input.
    // Semver-valid characters: letters, digits, dot, hyphen, underscore, plus, slash.
    // Raw commit SHAs are NOT supported here — `git clone --branch` can't take
    // them; use --pin at the module level or check out the SHA manually.
    // Only strip when the tail looks like a ref, so we don't disturb
    // URLs without a version spec or the SSH protocol's `git@host:...` prefix.
    let trimmed = trimmedRaw;
    let versionSuffix = null;
    const lastAt = trimmedRaw.lastIndexOf('@');
    // Skip if @ is part of git@github.com:... (first char cannot be stripped as version)
    // and skip if @ appears before the path rather than after a ref-shaped tail.
    if (lastAt > 0) {
      const candidate = trimmedRaw.slice(lastAt + 1);
      const before = trimmedRaw.slice(0, lastAt);
      // candidate must be ref-shaped and must not itself look like a URL / SSH host
      if (/^[\w.\-+/]+$/.test(candidate) && !candidate.includes(':')) {
        // Avoid consuming the @ in `git@host:owner/repo` — `before` wouldn't end with a path separator
        // in that case. Require that the @ comes after the host/path, not inside the auth segment.
        // Rule: the @ is a version suffix only if `before` looks like a complete URL or local path.
        const beforeLooksLikeRepo =
          before.startsWith('/') ||
          before.startsWith('./') ||
          before.startsWith('../') ||
          before.startsWith('~') ||
          /^https?:\/\//i.test(before) ||
          /^git@[^:]+:.+/.test(before);
        if (beforeLooksLikeRepo) {
          versionSuffix = candidate;
          trimmed = before;
        }
      }
    }

    // Local path detection: starts with /, ./, ../, or ~
    if (trimmed.startsWith('/') || trimmed.startsWith('./') || trimmed.startsWith('../') || trimmed.startsWith('~')) {
      if (versionSuffix) {
        return {
          type: 'local',
          cloneUrl: null,
          subdir: null,
          localPath: null,
          cacheKey: null,
          displayName: null,
          isValid: false,
          error: 'Local paths do not support @version suffixes',
        };
      }
      return this._parseLocalPath(trimmed);
    }

    // SSH URL: git@host:owner/repo.git
    const sshMatch = trimmed.match(/^git@([^:]+):([^/]+)\/([^/.]+?)(?:\.git)?$/);
    if (sshMatch) {
      const [, host, owner, repo] = sshMatch;
      return {
        type: 'url',
        cloneUrl: trimmed,
        subdir: null,
        localPath: null,
        version: versionSuffix || null,
        rawInput: trimmedRaw,
        cacheKey: `${host}/${owner}/${repo}`,
        displayName: `${owner}/${repo}`,
        isValid: true,
        error: null,
      };
    }

    // HTTPS/HTTP URL: https://host/owner/repo[/tree/branch/subdir][.git]
    const httpsMatch = trimmed.match(/^(https?):\/\/([^/]+)\/([^/]+)\/([^/.]+?)(?:\.git)?(\/.*)?$/);
    if (httpsMatch) {
      const [, protocol, host, owner, repo, remainder] = httpsMatch;
      const cloneUrl = `${protocol}://${host}/${owner}/${repo}`;
      let subdir = null;
      let urlRef = null; // branch/tag extracted from /tree/<ref>/subdir

      if (remainder) {
        // Extract subdir from deep path patterns used by various Git hosts
        const deepPathPatterns = [
          { regex: /^\/(?:-\/)?tree\/([^/]+)\/(.+)$/, refIdx: 1, pathIdx: 2 }, // GitHub, GitLab
          { regex: /^\/(?:-\/)?blob\/([^/]+)\/(.+)$/, refIdx: 1, pathIdx: 2 },
          { regex: /^\/src\/([^/]+)\/(.+)$/, refIdx: 1, pathIdx: 2 }, // Gitea/Forgejo
        ];
        // Also match `/tree/<ref>` with no subdir
        const refOnlyPatterns = [/^\/(?:-\/)?tree\/([^/]+?)\/?$/, /^\/(?:-\/)?blob\/([^/]+?)\/?$/, /^\/src\/([^/]+?)\/?$/];

        for (const p of deepPathPatterns) {
          const match = remainder.match(p.regex);
          if (match) {
            urlRef = match[p.refIdx];
            subdir = match[p.pathIdx].replace(/\/$/, '');
            break;
          }
        }
        if (!subdir) {
          for (const r of refOnlyPatterns) {
            const match = remainder.match(r);
            if (match) {
              urlRef = match[1];
              break;
            }
          }
        }
      }

      // Precedence: explicit @version suffix > URL /tree/<ref> path segment.
      const version = versionSuffix || urlRef || null;

      return {
        type: 'url',
        cloneUrl,
        subdir,
        localPath: null,
        version,
        rawInput: trimmedRaw,
        cacheKey: `${host}/${owner}/${repo}`,
        displayName: `${owner}/${repo}`,
        isValid: true,
        error: null,
      };
    }

    return {
      type: null,
      cloneUrl: null,
      subdir: null,
      localPath: null,
      cacheKey: null,
      displayName: null,
      isValid: false,
      error: 'Not a valid Git URL or local path',
    };
  }

  /**
   * Parse a local filesystem path.
   * @param {string} rawPath - Path string (may contain ~ for home)
   * @returns {Object} Parsed source descriptor
   */
  _parseLocalPath(rawPath) {
    const expanded = rawPath.startsWith('~') ? path.join(os.homedir(), rawPath.slice(1)) : rawPath;
    const resolved = path.resolve(expanded);

    if (!fs.pathExistsSync(resolved)) {
      return {
        type: 'local',
        cloneUrl: null,
        subdir: null,
        localPath: resolved,
        cacheKey: null,
        displayName: path.basename(resolved),
        isValid: false,
        error: `Path does not exist: ${resolved}`,
      };
    }

    return {
      type: 'local',
      cloneUrl: null,
      subdir: null,
      localPath: resolved,
      cacheKey: null,
      displayName: path.basename(resolved),
      isValid: true,
      error: null,
    };
  }

  // ─── Marketplace JSON ─────────────────────────────────────────────────────

  /**
   * Read .claude-plugin/marketplace.json from a local directory.
   * @param {string} dirPath - Directory to read from
   * @returns {Object|null} Parsed marketplace.json or null if not found
   */
  async readMarketplaceJsonFromDisk(dirPath) {
    const marketplacePath = path.join(dirPath, '.claude-plugin', 'marketplace.json');
    if (!(await fs.pathExists(marketplacePath))) return null;
    try {
      return JSON.parse(await fs.readFile(marketplacePath, 'utf8'));
    } catch {
      return null;
    }
  }

  // ─── Discovery ────────────────────────────────────────────────────────────

  /**
   * Discover modules from pre-read marketplace.json data.
   * @param {Object} marketplaceData - Parsed marketplace.json content
   * @param {string|null} sourceUrl - Source URL for tracking (null for local paths)
   * @returns {Array<Object>} Normalized plugin list
   */
  async discoverModules(marketplaceData, sourceUrl) {
    const plugins = marketplaceData?.plugins;

    if (!Array.isArray(plugins) || plugins.length === 0) {
      throw new Error('marketplace.json contains no plugins');
    }

    return plugins.map((plugin) => this._normalizeCustomModule(plugin, sourceUrl, marketplaceData));
  }

  // ─── Source Resolution ────────────────────────────────────────────────────

  /**
   * High-level coordinator: parse input, clone if URL, determine discovery vs direct mode.
   * @param {string} input - URL or local path
   * @param {Object} [options] - Options passed to cloneRepo
   * @returns {Object} { parsed, rootDir, repoPath, sourceUrl, marketplace, mode: 'discovery'|'direct' }
   */
  async resolveSource(input, options = {}) {
    const parsed = this.parseSource(input);
    if (!parsed.isValid) throw new Error(parsed.error);

    let rootDir;
    let repoPath;
    let sourceUrl;

    if (parsed.type === 'local') {
      rootDir = parsed.localPath;
      repoPath = null;
      sourceUrl = null;
    } else {
      repoPath = await this.cloneRepo(input, options);
      sourceUrl = parsed.cloneUrl;
      rootDir = parsed.subdir ? path.join(repoPath, parsed.subdir) : repoPath;

      if (parsed.subdir && !(await fs.pathExists(rootDir))) {
        throw new Error(`Subdirectory '${parsed.subdir}' not found in cloned repository`);
      }
    }

    const marketplace = await this.readMarketplaceJsonFromDisk(rootDir);
    const mode = marketplace ? 'discovery' : 'direct';

    return { parsed, rootDir, repoPath, sourceUrl, marketplace, mode };
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
   * Supports any Git host (GitHub, GitLab, Bitbucket, self-hosted, etc.).
   * @param {string} sourceInput - Git URL (HTTPS, HTTP, or SSH)
   * @param {Object} [options] - Clone options
   * @param {boolean} [options.silent] - Suppress spinner output
   * @param {boolean} [options.skipInstall] - Skip npm install (for browsing before user confirms)
   * @returns {string} Path to the cloned repository
   */
  async cloneRepo(sourceInput, options = {}) {
    const parsed = this.parseSource(sourceInput);
    if (!parsed.isValid) throw new Error(parsed.error);
    if (parsed.type === 'local') throw new Error('cloneRepo does not accept local paths');

    const cacheDir = this.getCacheDir();
    const repoCacheDir = path.join(cacheDir, ...parsed.cacheKey.split('/'));
    const silent = options.silent || false;
    const displayName = parsed.displayName;

    // Pin override: --pin CODE=TAG resolved at module-selection time overrides
    // any @version suffix present in the URL.
    const effectiveVersion = options.pinOverride || parsed.version || null;

    await fs.ensureDir(path.dirname(repoCacheDir));

    const createSpinner = async () => {
      if (silent) {
        return { start() { }, stop() { }, error() { } };
      }
      return await prompts.spinner();
    };

    // If an existing cache exists but was cloned at a different version, re-clone.
    // Tracked via .bmad-source.json's recorded version.
    if (await fs.pathExists(repoCacheDir)) {
      let cachedVersion = null;
      try {
        const existing = await fs.readJson(path.join(repoCacheDir, '.bmad-source.json'));
        cachedVersion = existing?.version || null;
      } catch {
        // no metadata; treat as mismatched to be safe if a version was requested
      }
      if ((effectiveVersion || null) !== (cachedVersion || null)) {
        await fs.remove(repoCacheDir);
      }
    }

    if (await fs.pathExists(repoCacheDir)) {
      // Update existing clone (same version as before)
      const fetchSpinner = await createSpinner();
      fetchSpinner.start(`Updating ${displayName}...`);
      try {
        execSync('git fetch origin --depth 1', {
          cwd: repoCacheDir,
          stdio: ['ignore', 'pipe', 'pipe'],
          env: { ...process.env, GIT_TERMINAL_PROMPT: '0' },
        });
        if (effectiveVersion) {
          // Fetch the ref as either a tag or a branch — `origin <ref>` works
          // for both, whereas `origin tag <ref>` fails for branch refs parsed
          // out of /tree/<branch>/... URLs.
          execSync(`git fetch --depth 1 origin ${quoteCustomRef(effectiveVersion)} --no-tags`, {
            cwd: repoCacheDir,
            stdio: ['ignore', 'pipe', 'pipe'],
            env: { ...process.env, GIT_TERMINAL_PROMPT: '0' },
          });
          execSync(`git checkout --quiet FETCH_HEAD`, {
            cwd: repoCacheDir,
            stdio: ['ignore', 'pipe', 'pipe'],
          });
        } else {
          execSync('git reset --hard origin/HEAD', {
            cwd: repoCacheDir,
            stdio: ['ignore', 'pipe', 'pipe'],
          });
        }
        fetchSpinner.stop(`Updated ${displayName}`);
      } catch {
        fetchSpinner.error(`Update failed, re-downloading ${displayName}`);
        await fs.remove(repoCacheDir);
      }
    }

    if (!(await fs.pathExists(repoCacheDir))) {
      const fetchSpinner = await createSpinner();
      fetchSpinner.start(`Cloning ${displayName}${effectiveVersion ? ` @ ${effectiveVersion}` : ''}...`);
      try {
        if (effectiveVersion) {
          execSync(`git clone --depth 1 --branch ${quoteCustomRef(effectiveVersion)} "${parsed.cloneUrl}" "${repoCacheDir}"`, {
            stdio: ['ignore', 'pipe', 'pipe'],
            env: { ...process.env, GIT_TERMINAL_PROMPT: '0' },
          });
        } else {
          execSync(`git clone --depth 1 "${parsed.cloneUrl}" "${repoCacheDir}"`, {
            stdio: ['ignore', 'pipe', 'pipe'],
            env: { ...process.env, GIT_TERMINAL_PROMPT: '0' },
          });
        }
        fetchSpinner.stop(`Cloned ${displayName}`);
      } catch (error_) {
        fetchSpinner.error(`Failed to clone ${displayName}`);
        const refSuffix = effectiveVersion ? `@${effectiveVersion}` : '';
        throw new Error(`Failed to clone ${parsed.cloneUrl}${refSuffix}: ${error_.message}`);
      }
    }

    // Record the resolved SHA for the manifest writer.
    let resolvedSha = null;
    try {
      resolvedSha = execSync('git rev-parse HEAD', { cwd: repoCacheDir, stdio: 'pipe' }).toString().trim();
    } catch {
      // swallow — a non-git repo (local path) wouldn't reach here anyway
    }

    // Write source metadata for later URL reconstruction
    const metadataPath = path.join(repoCacheDir, '.bmad-source.json');
    await fs.writeJson(metadataPath, {
      cloneUrl: parsed.cloneUrl,
      cacheKey: parsed.cacheKey,
      displayName: parsed.displayName,
      version: effectiveVersion || null,
      rawInput: parsed.rawInput || sourceInput,
      sha: resolvedSha,
      clonedAt: new Date().toISOString(),
    });

    // Install dependencies if package.json exists (skip during browsing/analysis)
    const packageJsonPath = path.join(repoCacheDir, 'package.json');
    if (!options.skipInstall && (await fs.pathExists(packageJsonPath))) {
      const installSpinner = await createSpinner();
      installSpinner.start(`Installing dependencies for ${displayName}...`);
      try {
        execSync('npm install --omit=dev --no-audit --no-fund --no-progress --legacy-peer-deps', {
          cwd: repoCacheDir,
          stdio: ['ignore', 'pipe', 'pipe'],
          timeout: 120_000,
        });
        installSpinner.stop(`Installed dependencies for ${displayName}`);
      } catch (error_) {
        installSpinner.error(`Failed to install dependencies for ${displayName}`);
        if (!silent) await prompts.log.warn(`  ${error_.message}`);
      }
    }

    return repoCacheDir;
  }

  // ─── Plugin Resolution ────────────────────────────────────────────────────

  /**
   * Resolve a plugin to determine installation strategy and module registration files.
   * Results are cached in _resolutionCache keyed by module code.
   * @param {string} repoPath - Absolute path to the cloned repository or local directory
   * @param {Object} plugin - Raw plugin object from marketplace.json
   * @param {string} [sourceUrl] - Original URL for manifest tracking (null for local)
   * @param {string} [localPath] - Local source path for manifest tracking (null for URLs)
   * @returns {Promise<Array<Object>>} Array of ResolvedModule objects
   */
  async resolvePlugin(repoPath, plugin, sourceUrl, localPath) {
    const { PluginResolver } = require('./plugin-resolver');
    const resolver = new PluginResolver();
    const resolved = await resolver.resolve(repoPath, plugin);

    // Read clone metadata (written by cloneRepo) so we can pick up the
    // resolved git ref + SHA for manifest recording.
    let cloneMetadata = null;
    if (sourceUrl) {
      try {
        cloneMetadata = await fs.readJson(path.join(repoPath, '.bmad-source.json'));
      } catch {
        // no metadata — local-source or legacy cache
      }
    }

    // Stamp source info onto each resolved module for manifest tracking
    for (const mod of resolved) {
      if (sourceUrl) mod.repoUrl = sourceUrl;
      if (localPath) mod.localPath = localPath;
      if (cloneMetadata) {
        mod.cloneRef = cloneMetadata.version || null;
        mod.cloneSha = cloneMetadata.sha || null;
        mod.rawInput = cloneMetadata.rawInput || null;
      }
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
   * Find the module source path within a cached or local source directory.
   * @param {string} sourceInput - Git URL or local path (used to locate cached clone)
   * @param {string} [pluginSource] - Plugin source path from marketplace.json
   * @returns {string|null} Path to directory containing module.yaml
   */
  async findModuleSource(sourceInput, pluginSource) {
    const parsed = this.parseSource(sourceInput);
    if (!parsed.isValid) return null;

    let baseDir;
    if (parsed.type === 'local') {
      baseDir = parsed.localPath;
    } else {
      baseDir = path.join(this.getCacheDir(), ...parsed.cacheKey.split('/'));
    }

    if (!(await fs.pathExists(baseDir))) return null;

    // Try plugin source path first (e.g., "./src/pro-skills")
    if (pluginSource) {
      const sourcePath = path.join(baseDir, pluginSource);
      const moduleYaml = path.join(sourcePath, 'module.yaml');
      if (await fs.pathExists(moduleYaml)) {
        return sourcePath;
      }
    }

    // Fallback: search skills/ and src/ directories
    for (const dir of ['skills', 'src']) {
      const rootCandidate = path.join(baseDir, dir, 'module.yaml');
      if (await fs.pathExists(rootCandidate)) {
        return path.dirname(rootCandidate);
      }
      const dirPath = path.join(baseDir, dir);
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

    // Check base directory root
    const rootCandidate = path.join(baseDir, 'module.yaml');
    if (await fs.pathExists(rootCandidate)) {
      return baseDir;
    }

    return null;
  }

  /**
   * Find module source by module code, searching the custom cache.
   * Handles both new 3-level cache structure (host/owner/repo) and
   * legacy 2-level structure (owner/repo).
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

    // Search through all cached repo roots
    try {
      const { PluginResolver } = require('./plugin-resolver');
      const resolver = new PluginResolver();
      const repoRoots = await this._findCacheRepoRoots(cacheDir);

      for (const { repoPath, metadata } of repoRoots) {
        // Check marketplace.json for matching module code
        const marketplacePath = path.join(repoPath, '.claude-plugin', 'marketplace.json');
        if (!(await fs.pathExists(marketplacePath))) continue;

        try {
          const data = JSON.parse(await fs.readFile(marketplacePath, 'utf8'));
          for (const plugin of data.plugins || []) {
            // Direct name match (legacy behavior)
            if (plugin.name === moduleCode) {
              const sourcePath = plugin.source ? path.join(repoPath, plugin.source) : repoPath;
              const moduleYaml = path.join(sourcePath, 'module.yaml');
              if (await fs.pathExists(moduleYaml)) {
                return sourcePath;
              }
            }

            // Resolve plugin to check if any module.yaml code matches
            if (plugin.skills && plugin.skills.length > 0) {
              try {
                const resolvedMods = await resolver.resolve(repoPath, plugin);
                for (const mod of resolvedMods) {
                  if (mod.code === moduleCode) {
                    // Use metadata for URL reconstruction instead of deriving from path
                    mod.repoUrl = metadata?.cloneUrl || null;
                    CustomModuleManager._resolutionCache.set(mod.code, mod);
                    if (mod.moduleYamlPath) {
                      return path.dirname(mod.moduleYamlPath);
                    }
                    if (mod.skillPaths && mod.skillPaths.length > 0) {
                      return path.dirname(mod.skillPaths[0]);
                    }
                  }
                }
              } catch {
                // Skip unresolvable plugins
              }
            }
          }
        } catch {
          // Skip malformed marketplace.json
        }
      }
    } catch {
      // Cache doesn't exist or is inaccessible
    }

    // Fallback: check manifest for localPath (local-source modules not in cache)
    return this._findLocalSourceFromManifest(moduleCode, options);
  }

  /**
   * Check the installation manifest for a localPath entry for this module.
   * Used as fallback when the module was installed from a local source (no cache entry).
   * Returns the path only if it still exists on disk; never removes installed files.
   * @param {string} moduleCode - Module code to search for
   * @param {Object} [options] - Options (must include bmadDir or will search common locations)
   * @returns {string|null} Path to the local module source or null
   */
  async _findLocalSourceFromManifest(moduleCode, options = {}) {
    try {
      const { Manifest } = require('../core/manifest');
      const manifestObj = new Manifest();

      // Try to find bmadDir from options or common locations
      const bmadDir = options.bmadDir;
      if (!bmadDir) return null;

      const manifestData = await manifestObj.read(bmadDir);
      if (!manifestData?.modulesDetailed) return null;

      const moduleEntry = manifestData.modulesDetailed.find((m) => m.name === moduleCode);
      if (!moduleEntry?.localPath) return null;

      // Only return the path if it still exists (source not removed)
      if (await fs.pathExists(moduleEntry.localPath)) {
        return moduleEntry.localPath;
      }

      return null;
    } catch {
      return null;
    }
  }

  /**
   * Recursively find repo root directories within the cache.
   * A repo root is identified by containing .bmad-source.json (new) or .claude-plugin/ (legacy).
   * Handles both 3-level (host/owner/repo) and legacy 2-level (owner/repo) cache layouts.
   * @param {string} dir - Directory to search
   * @param {number} [depth=0] - Current recursion depth
   * @param {number} [maxDepth=4] - Maximum recursion depth
   * @returns {Promise<Array<{repoPath: string, metadata: Object|null}>>}
   */
  async _findCacheRepoRoots(dir, depth = 0, maxDepth = 4) {
    const results = [];

    // Check if this directory is a repo root
    const metadataPath = path.join(dir, '.bmad-source.json');
    const claudePluginDir = path.join(dir, '.claude-plugin');

    if (await fs.pathExists(metadataPath)) {
      try {
        const metadata = JSON.parse(await fs.readFile(metadataPath, 'utf8'));
        results.push({ repoPath: dir, metadata });
      } catch {
        results.push({ repoPath: dir, metadata: null });
      }
      return results; // Don't recurse into repo contents
    }
    if (await fs.pathExists(claudePluginDir)) {
      results.push({ repoPath: dir, metadata: null });
      return results;
    }

    // Recurse into subdirectories
    if (depth >= maxDepth) return results;
    try {
      const entries = await fs.readdir(dir, { withFileTypes: true });
      for (const entry of entries) {
        if (!entry.isDirectory() || entry.name.startsWith('.')) continue;
        const subResults = await this._findCacheRepoRoots(path.join(dir, entry.name), depth + 1, maxDepth);
        results.push(...subResults);
      }
    } catch {
      // Directory not readable
    }
    return results;
  }

  // ─── Normalization ────────────────────────────────────────────────────────

  /**
   * Normalize a plugin from marketplace.json to a consistent shape.
   * @param {Object} plugin - Plugin object from marketplace.json
   * @param {string|null} sourceUrl - Source URL (null for local paths)
   * @param {Object} data - Full marketplace.json data
   * @returns {Object} Normalized module info
   */
  _normalizeCustomModule(plugin, sourceUrl, data) {
    return {
      code: plugin.name,
      name: plugin.name,
      displayName: plugin.name,
      description: plugin.description || '',
      version: plugin.version || null,
      author: plugin.author || data.owner || '',
      url: sourceUrl || null,
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
