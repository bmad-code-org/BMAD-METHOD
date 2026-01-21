const path = require('node:path');
const fs = require('fs-extra');
const yaml = require('yaml');
const { StateLock } = require('./state-lock');

/**
 * Logs and tracks events across scopes
 * Handles event logging and subscription notifications
 *
 * @class EventLogger
 * @requires fs-extra
 * @requires yaml
 * @requires StateLock
 *
 * @example
 * const logger = new EventLogger({ projectRoot: '/path/to/project' });
 * await logger.logEvent('artifact_created', 'auth', { artifact: 'prd.md' });
 */
class EventLogger {
  constructor(options = {}) {
    this.projectRoot = options.projectRoot || process.cwd();
    this.bmadPath = path.join(this.projectRoot, '_bmad');
    this.eventsPath = path.join(this.bmadPath, '_events');
    this.eventLogPath = path.join(this.eventsPath, 'event-log.yaml');
    this.subscriptionsPath = path.join(this.eventsPath, 'subscriptions.yaml');
    this.stateLock = new StateLock();
    this.maxEvents = options.maxEvents || 1000; // Rotate after this many events
  }

  /**
   * Set the project root directory
   * @param {string} projectRoot - The project root path
   */
  setProjectRoot(projectRoot) {
    this.projectRoot = projectRoot;
    this.bmadPath = path.join(projectRoot, '_bmad');
    this.eventsPath = path.join(this.bmadPath, '_events');
    this.eventLogPath = path.join(this.eventsPath, 'event-log.yaml');
    this.subscriptionsPath = path.join(this.eventsPath, 'subscriptions.yaml');
  }

  /**
   * Initialize event system
   * Creates event directories and files if they don't exist
   */
  async initialize() {
    await fs.ensureDir(this.eventsPath);

    // Create event-log.yaml if not exists
    if (!(await fs.pathExists(this.eventLogPath))) {
      const eventLog = {
        version: 1,
        events: [],
      };
      await fs.writeFile(this.eventLogPath, yaml.stringify(eventLog), 'utf8');
    }

    // Create subscriptions.yaml if not exists
    if (!(await fs.pathExists(this.subscriptionsPath))) {
      const subscriptions = {
        version: 1,
        subscriptions: {},
      };
      await fs.writeFile(this.subscriptionsPath, yaml.stringify(subscriptions), 'utf8');
    }
  }

  /**
   * Generate unique event ID
   * @returns {string} Event ID
   */
  generateEventId() {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).slice(2, 8);
    return `evt_${timestamp}_${random}`;
  }

  /**
   * Log an event
   * @param {string} type - Event type
   * @param {string} scopeId - Source scope ID
   * @param {object} data - Event data
   * @returns {Promise<object>} Created event
   */
  async logEvent(type, scopeId, data = {}) {
    const event = {
      id: this.generateEventId(),
      type,
      scope: scopeId,
      timestamp: new Date().toISOString(),
      data,
    };

    return this.stateLock.withLock(this.eventLogPath, async () => {
      const content = await fs.readFile(this.eventLogPath, 'utf8');
      const log = yaml.parse(content);

      // Add event
      log.events.push(event);

      // Rotate if needed
      if (log.events.length > this.maxEvents) {
        // Keep only recent events
        log.events = log.events.slice(-this.maxEvents);
      }

      await fs.writeFile(this.eventLogPath, yaml.stringify(log), 'utf8');
      return event;
    });
  }

  /**
   * Get events for a scope
   * @param {string} scopeId - Scope ID
   * @param {object} options - Filter options
   * @returns {Promise<object[]>} Array of events
   */
  async getEvents(scopeId = null, options = {}) {
    try {
      const content = await fs.readFile(this.eventLogPath, 'utf8');
      const log = yaml.parse(content);
      let events = log.events || [];

      // Filter by scope
      if (scopeId) {
        events = events.filter((e) => e.scope === scopeId);
      }

      // Filter by type
      if (options.type) {
        events = events.filter((e) => e.type === options.type);
      }

      // Filter by time range
      if (options.since) {
        const sinceDate = new Date(options.since);
        events = events.filter((e) => new Date(e.timestamp) >= sinceDate);
      }

      if (options.until) {
        const untilDate = new Date(options.until);
        events = events.filter((e) => new Date(e.timestamp) <= untilDate);
      }

      // Limit results
      if (options.limit) {
        events = events.slice(-options.limit);
      }

      return events;
    } catch {
      return [];
    }
  }

  /**
   * Subscribe a scope to events from other scopes
   * @param {string} subscriberScope - Scope that wants to receive events
   * @param {string} watchScope - Scope to watch
   * @param {string[]} patterns - Artifact patterns to watch
   * @param {object} options - Subscription options
   */
  async subscribe(subscriberScope, watchScope, patterns = ['*'], options = {}) {
    return this.stateLock.withLock(this.subscriptionsPath, async () => {
      const content = await fs.readFile(this.subscriptionsPath, 'utf8');
      const subs = yaml.parse(content);

      // Initialize subscriber if not exists
      if (!subs.subscriptions[subscriberScope]) {
        subs.subscriptions[subscriberScope] = {
          watch: [],
          notify: true,
        };
      }

      // Add or update watch entry
      const existingWatch = subs.subscriptions[subscriberScope].watch.find((w) => w.scope === watchScope);

      if (existingWatch) {
        existingWatch.patterns = patterns;
      } else {
        subs.subscriptions[subscriberScope].watch.push({
          scope: watchScope,
          patterns,
        });
      }

      if (options.notify !== undefined) {
        subs.subscriptions[subscriberScope].notify = options.notify;
      }

      await fs.writeFile(this.subscriptionsPath, yaml.stringify(subs), 'utf8');
    });
  }

  /**
   * Unsubscribe from a scope
   * @param {string} subscriberScope - Subscriber scope
   * @param {string} watchScope - Scope to stop watching
   */
  async unsubscribe(subscriberScope, watchScope) {
    return this.stateLock.withLock(this.subscriptionsPath, async () => {
      const content = await fs.readFile(this.subscriptionsPath, 'utf8');
      const subs = yaml.parse(content);

      if (subs.subscriptions[subscriberScope]) {
        subs.subscriptions[subscriberScope].watch = subs.subscriptions[subscriberScope].watch.filter((w) => w.scope !== watchScope);
      }

      await fs.writeFile(this.subscriptionsPath, yaml.stringify(subs), 'utf8');
    });
  }

  /**
   * Get subscriptions for a scope
   * @param {string} scopeId - Scope ID
   * @returns {Promise<object>} Subscription data
   */
  async getSubscriptions(scopeId) {
    try {
      const content = await fs.readFile(this.subscriptionsPath, 'utf8');
      const subs = yaml.parse(content);
      return subs.subscriptions[scopeId] || { watch: [], notify: true };
    } catch {
      return { watch: [], notify: true };
    }
  }

  /**
   * Get pending notifications for a scope
   * Events from watched scopes since last activity
   * @param {string} scopeId - Scope ID
   * @param {string} since - ISO timestamp to check from
   * @returns {Promise<object[]>} Array of relevant events
   */
  async getPendingNotifications(scopeId, since = null) {
    try {
      const subs = await this.getSubscriptions(scopeId);

      if (!subs.notify || subs.watch.length === 0) {
        return [];
      }

      const notifications = [];

      for (const watch of subs.watch) {
        const events = await this.getEvents(watch.scope, {
          since: since || new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // Last 24h default
        });

        for (const event of events) {
          // Check if event matches any pattern
          const matches = watch.patterns.some((pattern) => this.matchesPattern(event.data?.artifact, pattern));

          if (matches || watch.patterns.includes('*')) {
            notifications.push({
              ...event,
              watchedBy: scopeId,
              pattern: watch.patterns,
            });
          }
        }
      }

      // Sort by timestamp
      notifications.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

      return notifications;
    } catch {
      return [];
    }
  }

  /**
   * Check if artifact matches pattern
   * @param {string} artifact - Artifact path
   * @param {string} pattern - Pattern to match
   * @returns {boolean} True if matches
   */
  matchesPattern(artifact, pattern) {
    if (!artifact) return false;
    if (pattern === '*') return true;

    const regexPattern = pattern.replaceAll('.', String.raw`\.`).replaceAll('*', '.*');
    const regex = new RegExp(regexPattern);
    return regex.test(artifact);
  }

  /**
   * Common event types
   */
  static EventTypes = {
    ARTIFACT_CREATED: 'artifact_created',
    ARTIFACT_UPDATED: 'artifact_updated',
    ARTIFACT_DELETED: 'artifact_deleted',
    ARTIFACT_PROMOTED: 'artifact_promoted',
    SCOPE_CREATED: 'scope_created',
    SCOPE_ARCHIVED: 'scope_archived',
    SCOPE_ACTIVATED: 'scope_activated',
    SYNC_UP: 'sync_up',
    SYNC_DOWN: 'sync_down',
    WORKFLOW_STARTED: 'workflow_started',
    WORKFLOW_COMPLETED: 'workflow_completed',
  };

  /**
   * Log artifact creation event
   * @param {string} scopeId - Scope ID
   * @param {string} artifact - Artifact path
   * @param {object} metadata - Additional metadata
   */
  async logArtifactCreated(scopeId, artifact, metadata = {}) {
    return this.logEvent(EventLogger.EventTypes.ARTIFACT_CREATED, scopeId, {
      artifact,
      ...metadata,
    });
  }

  /**
   * Log artifact update event
   * @param {string} scopeId - Scope ID
   * @param {string} artifact - Artifact path
   * @param {object} metadata - Additional metadata
   */
  async logArtifactUpdated(scopeId, artifact, metadata = {}) {
    return this.logEvent(EventLogger.EventTypes.ARTIFACT_UPDATED, scopeId, {
      artifact,
      ...metadata,
    });
  }

  /**
   * Log artifact promotion event
   * @param {string} scopeId - Scope ID
   * @param {string} artifact - Artifact path
   * @param {string} sharedPath - Path in shared layer
   */
  async logArtifactPromoted(scopeId, artifact, sharedPath) {
    return this.logEvent(EventLogger.EventTypes.ARTIFACT_PROMOTED, scopeId, {
      artifact,
      shared_path: sharedPath,
    });
  }

  /**
   * Log sync operation
   * @param {string} type - 'up' or 'down'
   * @param {string} scopeId - Scope ID
   * @param {object} result - Sync result
   */
  async logSync(type, scopeId, result) {
    const eventType = type === 'up' ? EventLogger.EventTypes.SYNC_UP : EventLogger.EventTypes.SYNC_DOWN;

    return this.logEvent(eventType, scopeId, {
      files_count: result.promoted?.length || result.pulled?.length || 0,
      conflicts_count: result.conflicts?.length || 0,
      errors_count: result.errors?.length || 0,
    });
  }

  /**
   * Get event statistics
   * @param {string} scopeId - Optional scope filter
   * @returns {Promise<object>} Event statistics
   */
  async getStats(scopeId = null) {
    const events = await this.getEvents(scopeId);

    const stats = {
      total: events.length,
      byType: {},
      byScope: {},
      last24h: 0,
      lastEvent: null,
    };

    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

    for (const event of events) {
      // Count by type
      stats.byType[event.type] = (stats.byType[event.type] || 0) + 1;

      // Count by scope
      stats.byScope[event.scope] = (stats.byScope[event.scope] || 0) + 1;

      // Count recent
      if (new Date(event.timestamp) >= oneDayAgo) {
        stats.last24h++;
      }
    }

    if (events.length > 0) {
      stats.lastEvent = events.at(-1);
    }

    return stats;
  }
}

module.exports = { EventLogger };
