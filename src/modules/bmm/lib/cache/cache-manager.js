/**
 * BMAD Enterprise Cache Manager
 *
 * Provides fast local caching for BMAD stories with GitHub as source of truth.
 * Enables instant LLM Read tool access (<100ms vs 2-3s API calls).
 *
 * Architecture:
 * - GitHub Issues = source of truth (coordination)
 * - Local cache = performance optimization
 * - Git repository = audit trail
 *
 * @module cache-manager
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

/**
 * Cache metadata structure stored in .bmad-cache-meta.json
 * Tracks sync state, staleness, and lock information per story, PRD, and Epic
 */
const CACHE_META_FILENAME = '.bmad-cache-meta.json';
const DEFAULT_STALENESS_THRESHOLD_MINUTES = 5;

/**
 * Document types supported by the cache
 */
const DOCUMENT_TYPES = {
  story: 'story',
  prd: 'prd',
  epic: 'epic',
};

/**
 * CacheManager class - handles local story caching with GitHub sync
 */
class CacheManager {
  /**
   * @param {Object} config - Configuration object
   * @param {string} config.cacheDir - Directory for cached story files
   * @param {number} config.stalenessThresholdMinutes - Minutes before cache is considered stale
   * @param {Object} config.github - GitHub configuration (owner, repo)
   */
  constructor(config) {
    this.cacheDir = config.cacheDir;
    this.stalenessThresholdMinutes = config.stalenessThresholdMinutes || DEFAULT_STALENESS_THRESHOLD_MINUTES;
    this.github = config.github || {};
    this.metaPath = path.join(this.cacheDir, CACHE_META_FILENAME);

    // Ensure cache directory exists
    this._ensureCacheDir();
  }

  /**
   * Ensure cache directory exists
   * @private
   */
  _ensureCacheDir() {
    if (!fs.existsSync(this.cacheDir)) {
      fs.mkdirSync(this.cacheDir, { recursive: true });
    }

    // Create subdirectories for each document type
    const subdirs = ['stories', 'prds', 'epics'];
    for (const subdir of subdirs) {
      const dirPath = path.join(this.cacheDir, subdir);
      if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
      }
    }
  }

  /**
   * Load cache metadata
   * @returns {Object} Cache metadata object
   */
  loadMeta() {
    if (!fs.existsSync(this.metaPath)) {
      return this._initializeMeta();
    }

    try {
      const content = fs.readFileSync(this.metaPath, 'utf8');
      const meta = JSON.parse(content);
      return this._migrateMeta(meta);
    } catch (error) {
      console.error(`Warning: Failed to parse cache meta, reinitializing: ${error.message}`);
      return this._initializeMeta();
    }
  }

  /**
   * Initialize empty cache metadata
   * @private
   * @returns {Object} Fresh metadata object
   */
  _initializeMeta() {
    const meta = {
      version: '2.0.0',
      last_sync: null,
      github_owner: this.github.owner || null,
      github_repo: this.github.repo || null,
      stories: {},
      prds: {},
      epics: {},
    };
    this.saveMeta(meta);
    return meta;
  }

  /**
   * Migrate metadata from v1 to v2 if needed
   * @private
   * @param {Object} meta - Metadata object to migrate
   * @returns {Object} Migrated metadata
   */
  _migrateMeta(meta) {
    // If already v2 or higher, no migration needed
    if (meta.version && meta.version.startsWith('2.')) {
      return meta;
    }

    // Add PRD and Epic sections if missing
    if (!meta.prds) {
      meta.prds = {};
    }
    if (!meta.epics) {
      meta.epics = {};
    }
    meta.version = '2.0.0';

    this.saveMeta(meta);
    return meta;
  }

  /**
   * Save cache metadata atomically
   * @param {Object} meta - Metadata object to save
   */
  saveMeta(meta) {
    const tempPath = `${this.metaPath}.tmp`;

    // Atomic write: write to temp file, then rename
    fs.writeFileSync(tempPath, JSON.stringify(meta, null, 2), 'utf8');
    fs.renameSync(tempPath, this.metaPath);
  }

  /**
   * Get path for a cached story file
   * @param {string} storyKey - Story identifier (e.g., "2-5-auth")
   * @returns {string} Full path to cached story file
   */
  getStoryPath(storyKey) {
    return path.join(this.cacheDir, 'stories', `${storyKey}.md`);
  }

  /**
   * Read story from cache with staleness check
   * @param {string} storyKey - Story identifier
   * @param {Object} options - Options
   * @param {boolean} options.ignoreStale - Return content even if stale
   * @returns {Object|null} { content, meta, isStale } or null if not cached
   */
  readStory(storyKey, options = {}) {
    const storyPath = this.getStoryPath(storyKey);
    const meta = this.loadMeta();
    const storyMeta = meta.stories[storyKey];

    if (!fs.existsSync(storyPath)) {
      return null;
    }

    const content = fs.readFileSync(storyPath, 'utf8');
    const isStale = this.isStale(storyKey);

    if (isStale && !options.ignoreStale) {
      return {
        content,
        meta: storyMeta,
        isStale: true,
        warning: `Story cache is stale (>${this.stalenessThresholdMinutes} min old). Sync recommended.`,
      };
    }

    return {
      content,
      meta: storyMeta,
      isStale,
    };
  }

  /**
   * Write story to cache with metadata update
   * @param {string} storyKey - Story identifier
   * @param {string} content - Story file content
   * @param {Object} storyMeta - Metadata from GitHub issue
   * @param {number} storyMeta.github_issue - Issue number
   * @param {string} storyMeta.github_updated_at - Last update timestamp from GitHub
   * @param {string} storyMeta.locked_by - Username who has the story locked (optional)
   * @param {string} storyMeta.locked_until - Lock expiration timestamp (optional)
   */
  writeStory(storyKey, content, storyMeta = {}) {
    const storyPath = this.getStoryPath(storyKey);
    const tempPath = `${storyPath}.tmp`;

    // Calculate content hash for change detection
    const contentHash = crypto.createHash('sha256').update(content).digest('hex');

    // Atomic write
    fs.writeFileSync(tempPath, content, 'utf8');
    fs.renameSync(tempPath, storyPath);

    // Update metadata
    const meta = this.loadMeta();
    meta.stories[storyKey] = {
      github_issue: storyMeta.github_issue || meta.stories[storyKey]?.github_issue,
      github_updated_at: storyMeta.github_updated_at || new Date().toISOString(),
      cache_timestamp: new Date().toISOString(),
      local_hash: contentHash,
      locked_by: storyMeta.locked_by || null,
      locked_until: storyMeta.locked_until || null,
    };

    this.saveMeta(meta);

    return {
      storyKey,
      path: storyPath,
      hash: contentHash,
      timestamp: meta.stories[storyKey].cache_timestamp,
    };
  }

  /**
   * Invalidate cache for a story (force refresh on next access)
   * @param {string} storyKey - Story identifier
   */
  invalidate(storyKey) {
    const meta = this.loadMeta();

    if (meta.stories[storyKey]) {
      // Mark as stale by setting old timestamp
      meta.stories[storyKey].cache_timestamp = '1970-01-01T00:00:00Z';
      this.saveMeta(meta);
    }
  }

  /**
   * Invalidate all cached stories
   */
  invalidateAll() {
    const meta = this.loadMeta();

    for (const storyKey of Object.keys(meta.stories)) {
      meta.stories[storyKey].cache_timestamp = '1970-01-01T00:00:00Z';
    }

    meta.last_sync = null;
    this.saveMeta(meta);
  }

  /**
   * Check if a story's cache is stale
   * @param {string} storyKey - Story identifier
   * @returns {boolean} True if cache is stale or missing
   */
  isStale(storyKey) {
    const meta = this.loadMeta();
    const storyMeta = meta.stories[storyKey];

    if (!storyMeta || !storyMeta.cache_timestamp) {
      return true;
    }

    const cacheTime = new Date(storyMeta.cache_timestamp);
    const now = new Date();
    const ageMinutes = (now - cacheTime) / (1000 * 60);

    return ageMinutes > this.stalenessThresholdMinutes;
  }

  /**
   * Get cache age in minutes
   * @param {string} storyKey - Story identifier
   * @returns {number|null} Age in minutes or null if not cached
   */
  getCacheAge(storyKey) {
    const meta = this.loadMeta();
    const storyMeta = meta.stories[storyKey];

    if (!storyMeta || !storyMeta.cache_timestamp) {
      return null;
    }

    const cacheTime = new Date(storyMeta.cache_timestamp);
    const now = new Date();
    return Math.floor((now - cacheTime) / (1000 * 60));
  }

  /**
   * Get last global sync timestamp
   * @returns {string|null} ISO timestamp of last sync
   */
  getLastSync() {
    const meta = this.loadMeta();
    return meta.last_sync;
  }

  /**
   * Update last sync timestamp
   * @param {string} timestamp - ISO timestamp (defaults to now)
   */
  updateLastSync(timestamp = new Date().toISOString()) {
    const meta = this.loadMeta();
    meta.last_sync = timestamp;
    this.saveMeta(meta);
  }

  /**
   * Get all cached story keys
   * @returns {string[]} Array of story keys
   */
  listCachedStories() {
    const meta = this.loadMeta();
    return Object.keys(meta.stories);
  }

  /**
   * Get stories that need refresh (stale or missing)
   * @returns {string[]} Array of stale story keys
   */
  getStaleStories() {
    const meta = this.loadMeta();
    return Object.keys(meta.stories).filter((key) => this.isStale(key));
  }

  /**
   * Update lock information for a story
   * @param {string} storyKey - Story identifier
   * @param {Object} lockInfo - Lock information
   * @param {string} lockInfo.locked_by - Username
   * @param {string} lockInfo.locked_until - Expiration timestamp
   */
  updateLock(storyKey, lockInfo) {
    const meta = this.loadMeta();

    if (!meta.stories[storyKey]) {
      meta.stories[storyKey] = {};
    }

    meta.stories[storyKey].locked_by = lockInfo.locked_by;
    meta.stories[storyKey].locked_until = lockInfo.locked_until;

    this.saveMeta(meta);
  }

  /**
   * Clear lock information for a story
   * @param {string} storyKey - Story identifier
   */
  clearLock(storyKey) {
    const meta = this.loadMeta();

    if (meta.stories[storyKey]) {
      meta.stories[storyKey].locked_by = null;
      meta.stories[storyKey].locked_until = null;
      this.saveMeta(meta);
    }
  }

  /**
   * Get lock status for a story
   * @param {string} storyKey - Story identifier
   * @returns {Object|null} Lock info or null if not locked
   */
  getLockStatus(storyKey) {
    const meta = this.loadMeta();
    const storyMeta = meta.stories[storyKey];

    if (!storyMeta || !storyMeta.locked_by) {
      return null;
    }

    // Check if lock expired
    if (storyMeta.locked_until) {
      const expiry = new Date(storyMeta.locked_until);
      if (expiry < new Date()) {
        return { expired: true, previously_locked_by: storyMeta.locked_by };
      }
    }

    return {
      locked_by: storyMeta.locked_by,
      locked_until: storyMeta.locked_until,
      expired: false,
    };
  }

  /**
   * Get all locked stories
   * @returns {Object[]} Array of { storyKey, locked_by, locked_until }
   */
  getLockedStories() {
    const meta = this.loadMeta();
    const locked = [];

    for (const [storyKey, storyMeta] of Object.entries(meta.stories)) {
      if (storyMeta.locked_by) {
        const expiry = storyMeta.locked_until ? new Date(storyMeta.locked_until) : null;
        const expired = expiry && expiry < new Date();

        locked.push({
          storyKey,
          locked_by: storyMeta.locked_by,
          locked_until: storyMeta.locked_until,
          expired,
        });
      }
    }

    return locked;
  }

  /**
   * Check if content has changed from cached version
   * @param {string} storyKey - Story identifier
   * @param {string} newContent - New content to compare
   * @returns {boolean} True if content differs
   */
  hasContentChanged(storyKey, newContent) {
    const meta = this.loadMeta();
    const storyMeta = meta.stories[storyKey];

    if (!storyMeta || !storyMeta.local_hash) {
      return true;
    }

    const newHash = crypto.createHash('sha256').update(newContent).digest('hex');
    return newHash !== storyMeta.local_hash;
  }

  /**
   * Delete a story from cache
   * @param {string} storyKey - Story identifier
   */
  deleteStory(storyKey) {
    const storyPath = this.getStoryPath(storyKey);

    if (fs.existsSync(storyPath)) {
      fs.unlinkSync(storyPath);
    }

    const meta = this.loadMeta();
    delete meta.stories[storyKey];
    this.saveMeta(meta);
  }

  /**
   * Get cache statistics
   * @returns {Object} Cache statistics
   */
  getStats() {
    const meta = this.loadMeta();
    const storyCount = Object.keys(meta.stories).length;
    const staleCount = this.getStaleStories().length;
    const lockedCount = this.getLockedStories().filter((s) => !s.expired).length;

    let totalSize = 0;
    const storiesDir = path.join(this.cacheDir, 'stories');

    if (fs.existsSync(storiesDir)) {
      const files = fs.readdirSync(storiesDir);
      for (const file of files) {
        const stats = fs.statSync(path.join(storiesDir, file));
        totalSize += stats.size;
      }
    }

    return {
      story_count: storyCount,
      stale_count: staleCount,
      locked_count: lockedCount,
      fresh_count: storyCount - staleCount,
      total_size_bytes: totalSize,
      total_size_kb: Math.round(totalSize / 1024),
      last_sync: meta.last_sync,
      staleness_threshold_minutes: this.stalenessThresholdMinutes,
    };
  }

  // ============ PRD Methods ============

  /**
   * Get path for a cached PRD file
   * @param {string} prdKey - PRD identifier (e.g., "user-auth")
   * @returns {string} Full path to cached PRD file
   */
  getPrdPath(prdKey) {
    return path.join(this.cacheDir, 'prds', `${prdKey}.md`);
  }

  /**
   * Read PRD from cache with staleness check
   * @param {string} prdKey - PRD identifier
   * @param {Object} options - Options
   * @param {boolean} options.ignoreStale - Return content even if stale
   * @returns {Object|null} { content, meta, isStale } or null if not cached
   */
  readPrd(prdKey, options = {}) {
    const prdPath = this.getPrdPath(prdKey);
    const meta = this.loadMeta();
    const prdMeta = meta.prds[prdKey];

    if (!fs.existsSync(prdPath)) {
      return null;
    }

    const content = fs.readFileSync(prdPath, 'utf8');
    const isStale = this._isDocumentStale(prdMeta);

    if (isStale && !options.ignoreStale) {
      return {
        content,
        meta: prdMeta,
        isStale: true,
        warning: `PRD cache is stale (>${this.stalenessThresholdMinutes} min old). Sync recommended.`,
      };
    }

    return { content, meta: prdMeta, isStale };
  }

  /**
   * Write PRD to cache with metadata update
   * @param {string} prdKey - PRD identifier
   * @param {string} content - PRD markdown content
   * @param {Object} prdMeta - Metadata
   * @param {number} prdMeta.review_issue - Review round issue number
   * @param {number} prdMeta.version - PRD version number
   * @param {string} prdMeta.status - PRD status (draft, feedback, synthesis, signoff, approved)
   * @param {string[]} prdMeta.stakeholders - Array of stakeholder usernames
   */
  writePrd(prdKey, content, prdMeta = {}) {
    const prdPath = this.getPrdPath(prdKey);
    const tempPath = `${prdPath}.tmp`;

    const contentHash = crypto.createHash('sha256').update(content).digest('hex');

    // Atomic write
    fs.writeFileSync(tempPath, content, 'utf8');
    fs.renameSync(tempPath, prdPath);

    // Update metadata
    const meta = this.loadMeta();
    meta.prds[prdKey] = {
      review_issue: prdMeta.review_issue || meta.prds[prdKey]?.review_issue,
      version: prdMeta.version || meta.prds[prdKey]?.version || 1,
      status: prdMeta.status || meta.prds[prdKey]?.status || 'draft',
      stakeholders: prdMeta.stakeholders || meta.prds[prdKey]?.stakeholders || [],
      owner: prdMeta.owner || meta.prds[prdKey]?.owner,
      feedback_deadline: prdMeta.feedback_deadline || meta.prds[prdKey]?.feedback_deadline,
      signoff_deadline: prdMeta.signoff_deadline || meta.prds[prdKey]?.signoff_deadline,
      cache_timestamp: new Date().toISOString(),
      local_hash: contentHash,
    };

    this.saveMeta(meta);

    return {
      prdKey,
      path: prdPath,
      hash: contentHash,
      timestamp: meta.prds[prdKey].cache_timestamp,
    };
  }

  /**
   * Update PRD status
   * @param {string} prdKey - PRD identifier
   * @param {string} status - New status
   */
  updatePrdStatus(prdKey, status) {
    const meta = this.loadMeta();

    if (!meta.prds[prdKey]) {
      throw new Error(`PRD not found in cache: ${prdKey}`);
    }

    meta.prds[prdKey].status = status;
    meta.prds[prdKey].cache_timestamp = new Date().toISOString();
    this.saveMeta(meta);
  }

  /**
   * Get all cached PRD keys
   * @returns {string[]} Array of PRD keys
   */
  listCachedPrds() {
    const meta = this.loadMeta();
    return Object.keys(meta.prds);
  }

  /**
   * Get PRDs by status
   * @param {string} status - Filter by status (draft, feedback, synthesis, signoff, approved)
   * @returns {Object[]} Array of { prdKey, meta }
   */
  getPrdsByStatus(status) {
    const meta = this.loadMeta();
    return Object.entries(meta.prds)
      .filter(([_, prdMeta]) => prdMeta.status === status)
      .map(([prdKey, prdMeta]) => ({ prdKey, meta: prdMeta }));
  }

  /**
   * Get PRDs needing attention from a user
   * @param {string} username - GitHub username
   * @returns {Object} { pendingFeedback: [], pendingSignoff: [] }
   */
  getPrdsNeedingAttention(username) {
    const meta = this.loadMeta();
    const normalizedUser = username.replace('@', '');

    const pendingFeedback = [];
    const pendingSignoff = [];

    for (const [prdKey, prdMeta] of Object.entries(meta.prds)) {
      const isStakeholder = prdMeta.stakeholders?.some((s) => s.replace('@', '') === normalizedUser);

      if (!isStakeholder) continue;

      if (prdMeta.status === 'feedback') {
        pendingFeedback.push({ prdKey, meta: prdMeta });
      } else if (prdMeta.status === 'signoff') {
        pendingSignoff.push({ prdKey, meta: prdMeta });
      }
    }

    return { pendingFeedback, pendingSignoff };
  }

  /**
   * Delete a PRD from cache
   * @param {string} prdKey - PRD identifier
   */
  deletePrd(prdKey) {
    const prdPath = this.getPrdPath(prdKey);

    if (fs.existsSync(prdPath)) {
      fs.unlinkSync(prdPath);
    }

    const meta = this.loadMeta();
    delete meta.prds[prdKey];
    this.saveMeta(meta);
  }

  // ============ Epic Methods ============

  /**
   * Get path for a cached Epic file
   * @param {string} epicKey - Epic identifier (e.g., "2")
   * @returns {string} Full path to cached Epic file
   */
  getEpicPath(epicKey) {
    return path.join(this.cacheDir, 'epics', `epic-${epicKey}.md`);
  }

  /**
   * Read Epic from cache with staleness check
   * @param {string} epicKey - Epic identifier
   * @param {Object} options - Options
   * @param {boolean} options.ignoreStale - Return content even if stale
   * @returns {Object|null} { content, meta, isStale } or null if not cached
   */
  readEpic(epicKey, options = {}) {
    const epicPath = this.getEpicPath(epicKey);
    const meta = this.loadMeta();
    const epicMeta = meta.epics[epicKey];

    if (!fs.existsSync(epicPath)) {
      return null;
    }

    const content = fs.readFileSync(epicPath, 'utf8');
    const isStale = this._isDocumentStale(epicMeta);

    if (isStale && !options.ignoreStale) {
      return {
        content,
        meta: epicMeta,
        isStale: true,
        warning: `Epic cache is stale (>${this.stalenessThresholdMinutes} min old). Sync recommended.`,
      };
    }

    return { content, meta: epicMeta, isStale };
  }

  /**
   * Write Epic to cache with metadata update
   * @param {string} epicKey - Epic identifier
   * @param {string} content - Epic markdown content
   * @param {Object} epicMeta - Metadata
   * @param {number} epicMeta.github_issue - Epic GitHub issue number
   * @param {string} epicMeta.prd_key - Source PRD key (lineage)
   * @param {number} epicMeta.version - Epic version number
   * @param {string} epicMeta.status - Epic status
   * @param {string[]} epicMeta.stories - Array of story keys in this epic
   */
  writeEpic(epicKey, content, epicMeta = {}) {
    const epicPath = this.getEpicPath(epicKey);
    const tempPath = `${epicPath}.tmp`;

    const contentHash = crypto.createHash('sha256').update(content).digest('hex');

    // Atomic write
    fs.writeFileSync(tempPath, content, 'utf8');
    fs.renameSync(tempPath, epicPath);

    // Update metadata
    const meta = this.loadMeta();
    meta.epics[epicKey] = {
      github_issue: epicMeta.github_issue || meta.epics[epicKey]?.github_issue,
      prd_key: epicMeta.prd_key || meta.epics[epicKey]?.prd_key,
      version: epicMeta.version || meta.epics[epicKey]?.version || 1,
      status: epicMeta.status || meta.epics[epicKey]?.status || 'draft',
      stories: epicMeta.stories || meta.epics[epicKey]?.stories || [],
      review_issue: epicMeta.review_issue || meta.epics[epicKey]?.review_issue,
      stakeholders: epicMeta.stakeholders || meta.epics[epicKey]?.stakeholders || [],
      feedback_deadline: epicMeta.feedback_deadline || meta.epics[epicKey]?.feedback_deadline,
      cache_timestamp: new Date().toISOString(),
      local_hash: contentHash,
    };

    this.saveMeta(meta);

    return {
      epicKey,
      path: epicPath,
      hash: contentHash,
      timestamp: meta.epics[epicKey].cache_timestamp,
    };
  }

  /**
   * Update Epic status
   * @param {string} epicKey - Epic identifier
   * @param {string} status - New status
   */
  updateEpicStatus(epicKey, status) {
    const meta = this.loadMeta();

    if (!meta.epics[epicKey]) {
      throw new Error(`Epic not found in cache: ${epicKey}`);
    }

    meta.epics[epicKey].status = status;
    meta.epics[epicKey].cache_timestamp = new Date().toISOString();
    this.saveMeta(meta);
  }

  /**
   * Get all cached Epic keys
   * @returns {string[]} Array of Epic keys
   */
  listCachedEpics() {
    const meta = this.loadMeta();
    return Object.keys(meta.epics);
  }

  /**
   * Get Epics by PRD (lineage tracking)
   * @param {string} prdKey - PRD key to filter by
   * @returns {Object[]} Array of { epicKey, meta }
   */
  getEpicsByPrd(prdKey) {
    const meta = this.loadMeta();
    return Object.entries(meta.epics)
      .filter(([_, epicMeta]) => epicMeta.prd_key === prdKey)
      .map(([epicKey, epicMeta]) => ({ epicKey, meta: epicMeta }));
  }

  /**
   * Get Epics needing attention from a user
   * @param {string} username - GitHub username
   * @returns {Object} { pendingFeedback: [] }
   */
  getEpicsNeedingAttention(username) {
    const meta = this.loadMeta();
    const normalizedUser = username.replace('@', '');

    const pendingFeedback = [];

    for (const [epicKey, epicMeta] of Object.entries(meta.epics)) {
      const isStakeholder = epicMeta.stakeholders?.some((s) => s.replace('@', '') === normalizedUser);

      if (!isStakeholder) continue;

      if (epicMeta.status === 'feedback') {
        pendingFeedback.push({ epicKey, meta: epicMeta });
      }
    }

    return { pendingFeedback };
  }

  /**
   * Delete an Epic from cache
   * @param {string} epicKey - Epic identifier
   */
  deleteEpic(epicKey) {
    const epicPath = this.getEpicPath(epicKey);

    if (fs.existsSync(epicPath)) {
      fs.unlinkSync(epicPath);
    }

    const meta = this.loadMeta();
    delete meta.epics[epicKey];
    this.saveMeta(meta);
  }

  // ============ Generic Document Methods ============

  /**
   * Check if a document's cache is stale
   * @private
   * @param {Object} docMeta - Document metadata
   * @returns {boolean} True if stale or missing
   */
  _isDocumentStale(docMeta) {
    if (!docMeta || !docMeta.cache_timestamp) {
      return true;
    }

    const cacheTime = new Date(docMeta.cache_timestamp);
    const now = new Date();
    const ageMinutes = (now - cacheTime) / (1000 * 60);

    return ageMinutes > this.stalenessThresholdMinutes;
  }

  /**
   * Get unified "my tasks" for a user across PRDs and Epics
   * @param {string} username - GitHub username
   * @returns {Object} { prds: { pendingFeedback, pendingSignoff }, epics: { pendingFeedback } }
   */
  getMyTasks(username) {
    return {
      prds: this.getPrdsNeedingAttention(username),
      epics: this.getEpicsNeedingAttention(username),
    };
  }

  /**
   * Get extended cache statistics including PRDs and Epics
   * @returns {Object} Extended cache statistics
   */
  getExtendedStats() {
    const meta = this.loadMeta();
    const baseStats = this.getStats();

    // Calculate PRD stats
    const prdCount = Object.keys(meta.prds).length;
    const prdsByStatus = {};
    for (const prdMeta of Object.values(meta.prds)) {
      prdsByStatus[prdMeta.status] = (prdsByStatus[prdMeta.status] || 0) + 1;
    }

    // Calculate Epic stats
    const epicCount = Object.keys(meta.epics).length;
    const epicsByStatus = {};
    for (const epicMeta of Object.values(meta.epics)) {
      epicsByStatus[epicMeta.status] = (epicsByStatus[epicMeta.status] || 0) + 1;
    }

    // Calculate total size including PRDs and Epics
    let prdSize = 0;
    let epicSize = 0;

    const prdsDir = path.join(this.cacheDir, 'prds');
    if (fs.existsSync(prdsDir)) {
      const files = fs.readdirSync(prdsDir);
      for (const file of files) {
        const stats = fs.statSync(path.join(prdsDir, file));
        prdSize += stats.size;
      }
    }

    const epicsDir = path.join(this.cacheDir, 'epics');
    if (fs.existsSync(epicsDir)) {
      const files = fs.readdirSync(epicsDir);
      for (const file of files) {
        const stats = fs.statSync(path.join(epicsDir, file));
        epicSize += stats.size;
      }
    }

    return {
      ...baseStats,
      prd_count: prdCount,
      prds_by_status: prdsByStatus,
      prd_size_kb: Math.round(prdSize / 1024),
      epic_count: epicCount,
      epics_by_status: epicsByStatus,
      epic_size_kb: Math.round(epicSize / 1024),
      total_size_kb: baseStats.total_size_kb + Math.round(prdSize / 1024) + Math.round(epicSize / 1024),
    };
  }
}

module.exports = { CacheManager, CACHE_META_FILENAME, DOCUMENT_TYPES };
