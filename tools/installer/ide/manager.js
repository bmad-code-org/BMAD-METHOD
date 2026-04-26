const { BMAD_FOLDER_NAME } = require('./shared/path-utils');
const prompts = require('../prompts');

/**
 * IDE Manager - handles IDE-specific setup
 * Dynamically discovers and loads IDE handlers
 *
 * Loading strategy:
 * All platforms are config-driven from platform-codes.yaml.
 */
class IdeManager {
  constructor() {
    this.handlers = new Map();
    this._initialized = false;
    this.bmadFolderName = BMAD_FOLDER_NAME; // Default, can be overridden
  }

  /**
   * Set the bmad folder name for all IDE handlers
   * @param {string} bmadFolderName - The bmad folder name
   */
  setBmadFolderName(bmadFolderName) {
    this.bmadFolderName = bmadFolderName;
    // Update all loaded handlers
    for (const handler of this.handlers.values()) {
      if (typeof handler.setBmadFolderName === 'function') {
        handler.setBmadFolderName(bmadFolderName);
      }
    }
  }

  /**
   * Ensure handlers are loaded (lazy loading)
   */
  async ensureInitialized() {
    if (!this._initialized) {
      await this.loadHandlers();
      this._initialized = true;
    }
  }

  /**
   * Dynamically load all IDE handlers from platform-codes.yaml
   */
  async loadHandlers() {
    await this.loadConfigDrivenHandlers();
  }

  /**
   * Load config-driven handlers from platform-codes.yaml
   * This creates ConfigDrivenIdeSetup instances for platforms with installer config
   */
  async loadConfigDrivenHandlers() {
    const { loadPlatformCodes } = require('./platform-codes');
    const platformConfig = await loadPlatformCodes();

    const { ConfigDrivenIdeSetup } = require('./_config-driven');

    for (const [platformCode, platformInfo] of Object.entries(platformConfig.platforms)) {
      // Skip if no installer config (platform may not need installation)
      if (!platformInfo.installer) continue;

      const handler = new ConfigDrivenIdeSetup(platformCode, platformInfo);
      if (typeof handler.setBmadFolderName === 'function') {
        handler.setBmadFolderName(this.bmadFolderName);
      }
      this.handlers.set(platformCode, handler);
    }
  }

  /**
   * Get all available IDEs with their metadata
   * @returns {Array} Array of IDE information objects
   */
  getAvailableIdes() {
    const ides = [];

    for (const [key, handler] of this.handlers) {
      // Skip handlers without valid names
      const name = handler.displayName || handler.name || key;

      // Filter out invalid entries (undefined name, empty key, etc.)
      if (!key || !name || typeof key !== 'string' || typeof name !== 'string') {
        continue;
      }

      // Skip suspended platforms (e.g., IDE doesn't support skills yet)
      if (handler.platformConfig?.suspended) {
        continue;
      }

      ides.push({
        value: key,
        name: name,
        preferred: handler.preferred || false,
      });
    }

    // Sort: preferred first, then alphabetical
    ides.sort((a, b) => {
      if (a.preferred && !b.preferred) return -1;
      if (!a.preferred && b.preferred) return 1;
      return a.name.localeCompare(b.name);
    });

    return ides;
  }

  /**
   * Get preferred IDEs
   * @returns {Array} Array of preferred IDE information
   */
  getPreferredIdes() {
    return this.getAvailableIdes().filter((ide) => ide.preferred);
  }

  /**
   * Get non-preferred IDEs
   * @returns {Array} Array of non-preferred IDE information
   */
  getOtherIdes() {
    return this.getAvailableIdes().filter((ide) => !ide.preferred);
  }

  /**
   * Setup IDE configuration
   * @param {string} ideName - Name of the IDE
   * @param {string} projectDir - Project directory
   * @param {string} bmadDir - BMAD installation directory
   * @param {Object} options - Setup options
   */
  async setup(ideName, projectDir, bmadDir, options = {}) {
    const handler = this.handlers.get(ideName.toLowerCase());

    if (!handler) {
      await prompts.log.warn(`IDE '${ideName}' is not yet supported`);
      await prompts.log.message(`Supported IDEs: ${[...this.handlers.keys()].join(', ')}`);
      return { success: false, ide: ideName, error: 'unsupported IDE' };
    }

    // Block suspended platforms — clean up legacy files but don't install
    if (handler.platformConfig?.suspended) {
      if (!options.silent) {
        await prompts.log.warn(`${handler.displayName || ideName}: ${handler.platformConfig.suspended}`);
      }
      // Still clean up legacy artifacts so old broken configs don't linger
      if (typeof handler.cleanup === 'function') {
        try {
          await handler.cleanup(projectDir, { silent: true });
        } catch {
          // Best-effort cleanup — don't let stale files block the suspended result
        }
      }
      return { success: false, ide: ideName, error: 'suspended' };
    }

    try {
      const handlerResult = await handler.setup(projectDir, bmadDir, options);
      // Build detail string from handler-returned data
      let detail = '';
      if (handlerResult && handlerResult.results) {
        const r = handlerResult.results;
        let count = r.skillDirectories || r.skills || 0;
        // Dedup'd platform: report the count its peer wrote so the user sees
        // a consistent picture across all platforms sharing the dir.
        if (count === 0 && r.sharedTargetHandledByPeer && options.sharedSkillCount) {
          count = options.sharedSkillCount;
        }
        const targetDir = handler.installerConfig?.target_dir || null;
        if (count > 0 && targetDir) {
          detail = `${count} skills → ${targetDir}`;
        } else if (count > 0) {
          detail = `${count} skills`;
        }
      }
      // Propagate handler's success status (default true for backward compat)
      const success = handlerResult?.success !== false;
      return { success, ide: ideName, detail, error: handlerResult?.error, handlerResult };
    } catch (error) {
      await prompts.log.error(`Failed to setup ${ideName}: ${error.message}`);
      return { success: false, ide: ideName, error: error.message };
    }
  }

  /**
   * Run setup for multiple IDEs as a single batch.
   * Dedupes work when several selected platforms share the same target_dir:
   * the first platform owns the directory write, peers skip it.
   * @param {Array<string>} ideList - IDE names to set up
   * @param {string} projectDir
   * @param {string} bmadDir
   * @param {Object} [options] - Forwarded to each handler.setup
   * @returns {Promise<Array>} Per-IDE results
   */
  async setupBatch(ideList, projectDir, bmadDir, options = {}) {
    await this.ensureInitialized();
    const results = [];
    // target_dir → { firstIde, skillCount } from the platform that actually wrote it
    const claimedTargets = new Map();

    for (const ideName of ideList) {
      const handler = this.handlers.get(ideName.toLowerCase());
      if (!handler) {
        results.push(await this.setup(ideName, projectDir, bmadDir, options));
        continue;
      }

      const target = handler.installerConfig?.target_dir || null;
      const claim = target ? claimedTargets.get(target) : null;
      const skipTarget = !!claim;

      const result = await this.setup(ideName, projectDir, bmadDir, {
        ...options,
        skipTarget,
        sharedWith: claim?.firstIde || null,
        sharedTarget: target,
        sharedSkillCount: claim?.skillCount || 0,
      });

      if (target && !claim) {
        const writtenCount = result.handlerResult?.results?.skillDirectories || result.handlerResult?.results?.skills || 0;
        // Only claim the target when the install actually succeeded and wrote skills.
        // If the first platform fails (ancestor conflict, exception, etc.), leave the
        // dir unclaimed so the next peer becomes the new first writer instead of
        // silently skipping into a broken/empty target_dir.
        if (result.success && writtenCount > 0) {
          claimedTargets.set(target, { firstIde: ideName, skillCount: writtenCount });
        }
      }
      results.push(result);
    }

    return results;
  }

  /**
   * Cleanup IDE configurations
   * @param {string} projectDir - Project directory
   * @param {Object} [options] - Cleanup options passed through to handlers
   */
  async cleanup(projectDir, options = {}) {
    const results = [];

    for (const [name, handler] of this.handlers) {
      try {
        await handler.cleanup(projectDir, options);
        results.push({ ide: name, success: true });
      } catch (error) {
        results.push({ ide: name, success: false, error: error.message });
      }
    }

    return results;
  }

  /**
   * Cleanup only the IDEs in the provided list
   * Falls back to cleanup() (all handlers) if ideList is empty or undefined
   * @param {string} projectDir - Project directory
   * @param {Array<string>} ideList - List of IDE names to clean up
   * @param {Object} [options] - Cleanup options passed through to handlers
   *   options.remainingIdes - IDE names still installed after this cleanup; used
   *     to skip target_dir wipe when a co-installed platform shares the dir.
   * @returns {Array} Results array
   */
  async cleanupByList(projectDir, ideList, options = {}) {
    if (!ideList || ideList.length === 0) {
      return this.cleanup(projectDir, options);
    }

    await this.ensureInitialized();
    const results = [];

    // Build lowercase lookup for case-insensitive matching
    const lowercaseHandlers = new Map([...this.handlers.entries()].map(([k, v]) => [k.toLowerCase(), v]));

    // Resolve target_dirs for IDEs that will remain installed after this cleanup
    const remainingTargets = new Set();
    if (Array.isArray(options.remainingIdes)) {
      for (const remaining of options.remainingIdes) {
        const h = lowercaseHandlers.get(String(remaining).toLowerCase());
        const t = h?.installerConfig?.target_dir;
        if (t) remainingTargets.add(t);
      }
    }

    for (const ideName of ideList) {
      const handler = lowercaseHandlers.get(ideName.toLowerCase());
      if (!handler) continue;

      const target = handler.installerConfig?.target_dir || null;
      const skipTarget = target && remainingTargets.has(target);
      const cleanupOptions = skipTarget ? { ...options, skipTarget: true } : options;

      try {
        await handler.cleanup(projectDir, cleanupOptions);
        results.push({ ide: ideName, success: true, skippedTarget: !!skipTarget });
      } catch (error) {
        results.push({ ide: ideName, success: false, error: error.message });
      }
    }

    return results;
  }

  /**
   * Detect installed IDEs
   * @param {string} projectDir - Project directory
   * @returns {Array} List of detected IDEs
   */
  async detectInstalledIdes(projectDir) {
    const detected = [];

    for (const [name, handler] of this.handlers) {
      if (typeof handler.detect === 'function' && (await handler.detect(projectDir))) {
        detected.push(name);
      }
    }

    return detected;
  }
}

module.exports = { IdeManager };
