/**
 * BMAD Enterprise Cache System
 *
 * Provides fast local caching for BMAD stories with GitHub as source of truth.
 *
 * Usage:
 * ```javascript
 * const { CacheManager, SyncEngine } = require('./lib/cache');
 *
 * const cache = new CacheManager({
 *   cacheDir: '/path/to/cache',
 *   stalenessThresholdMinutes: 5,
 *   github: { owner: 'myorg', repo: 'myrepo' }
 * });
 *
 * const sync = new SyncEngine({
 *   cacheManager: cache,
 *   github: { owner: 'myorg', repo: 'myrepo' },
 *   githubClient: async (method, params) => { ... }
 * });
 *
 * // Incremental sync
 * await sync.incrementalSync();
 *
 * // Read story from cache
 * const story = cache.readStory('2-5-auth');
 *
 * // Pre-fetch epic context
 * await sync.preFetchEpic(2);
 * ```
 *
 * @module cache
 */

const { CacheManager, CACHE_META_FILENAME } = require('./cache-manager');
const { SyncEngine, RETRY_BACKOFF_MS, MAX_RETRIES } = require('./sync-engine');

module.exports = {
  CacheManager,
  SyncEngine,
  CACHE_META_FILENAME,
  RETRY_BACKOFF_MS,
  MAX_RETRIES,
};
