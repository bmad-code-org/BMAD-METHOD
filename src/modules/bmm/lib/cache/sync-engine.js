/**
 * BMAD Enterprise Sync Engine
 *
 * Handles synchronization between GitHub Issues (source of truth)
 * and local cache (performance optimization).
 *
 * Features:
 * - Incremental sync (only fetch changed stories)
 * - Epic pre-fetch (batch load for context)
 * - Retry with exponential backoff
 * - Write verification
 *
 * @module sync-engine
 */

const { CacheManager } = require('./cache-manager');

/**
 * Retry configuration matching migrate-to-github patterns
 */
const RETRY_BACKOFF_MS = [1000, 3000, 9000]; // 1s, 3s, 9s
const MAX_RETRIES = 3;

/**
 * SyncEngine class - handles GitHub <-> Cache synchronization
 */
class SyncEngine {
  /**
   * @param {Object} config - Configuration object
   * @param {CacheManager} config.cacheManager - Cache manager instance
   * @param {Object} config.github - GitHub configuration
   * @param {string} config.github.owner - Repository owner
   * @param {string} config.github.repo - Repository name
   * @param {Function} config.githubClient - GitHub MCP client function
   */
  constructor(config) {
    this.cache = config.cacheManager;
    this.github = config.github;
    this.githubClient = config.githubClient;
    this.syncInProgress = false;
  }

  /**
   * Sleep utility for retry backoff
   * @private
   */
  async _sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Retry operation with exponential backoff
   * @private
   */
  async _retryWithBackoff(operation, operationName = 'operation') {
    let lastError;

    for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
      try {
        return await operation();
      } catch (error) {
        lastError = error;

        if (attempt < MAX_RETRIES) {
          const backoffMs = RETRY_BACKOFF_MS[attempt];
          console.log(`⚠️ ${operationName} failed, retry ${attempt + 1}/${MAX_RETRIES} in ${backoffMs}ms: ${error.message}`);
          await this._sleep(backoffMs);
        }
      }
    }

    throw new Error(`${operationName} failed after ${MAX_RETRIES} retries: ${lastError.message}`);
  }

  /**
   * Parse story key from GitHub issue
   * @private
   */
  _extractStoryKey(issue) {
    // Look for story: label first
    const storyLabel = issue.labels?.find(l =>
      (typeof l === 'string' ? l : l.name)?.startsWith('story:')
    );

    if (storyLabel) {
      const labelName = typeof storyLabel === 'string' ? storyLabel : storyLabel.name;
      return labelName.replace('story:', '');
    }

    // Fallback: extract from title "Story X-Y-name: ..."
    const titleMatch = issue.title?.match(/Story\s+(\d+-\d+-[a-zA-Z0-9-]+)/i);
    if (titleMatch) {
      return titleMatch[1];
    }

    return null;
  }

  /**
   * Convert GitHub issue to story file content
   * @private
   */
  _convertIssueToStoryContent(issue) {
    const storyKey = this._extractStoryKey(issue);
    const lines = [];

    // Extract sections from issue body
    lines.push(`# Story ${storyKey}: ${issue.title.replace(/Story\s+[\d-]+[a-zA-Z-]+:\s*/i, '')}`);
    lines.push('');
    lines.push(`**GitHub Issue:** #${issue.number}`);
    lines.push(`**Status:** ${this._extractStatus(issue)}`);
    lines.push(`**Assignee:** ${issue.assignee?.login || 'Unassigned'}`);
    lines.push(`**Last Updated:** ${issue.updated_at}`);
    lines.push('');

    // Include original body
    if (issue.body) {
      lines.push(issue.body);
    }

    lines.push('');
    lines.push('---');
    lines.push(`_Synced from GitHub at ${new Date().toISOString()}_`);

    return lines.join('\n');
  }

  /**
   * Extract status from issue labels
   * @private
   */
  _extractStatus(issue) {
    const statusLabel = issue.labels?.find(l => {
      const name = typeof l === 'string' ? l : l.name;
      return name?.startsWith('status:');
    });

    if (statusLabel) {
      const name = typeof statusLabel === 'string' ? statusLabel : statusLabel.name;
      return name.replace('status:', '');
    }

    return issue.state === 'closed' ? 'done' : 'backlog';
  }

  /**
   * Incremental sync - fetch only stories changed since last sync
   * This is the primary sync method, called every 5 minutes or on-demand
   *
   * @param {Object} options - Sync options
   * @param {boolean} options.force - Force full sync even if cache is fresh
   * @returns {Object} Sync result { updated: [], unchanged: [], errors: [] }
   */
  async incrementalSync(options = {}) {
    if (this.syncInProgress) {
      console.log('⏳ Sync already in progress, skipping...');
      return { skipped: true, reason: 'sync_in_progress' };
    }

    this.syncInProgress = true;
    const result = { updated: [], unchanged: [], errors: [], startTime: new Date() };

    try {
      const lastSync = options.force ? null : this.cache.getLastSync();

      console.log(`🔄 Starting incremental sync...`);
      console.log(`   Last sync: ${lastSync || 'never'}`);

      // Build search query for changed stories
      let query = `repo:${this.github.owner}/${this.github.repo} label:type:story`;

      if (lastSync) {
        // Only fetch stories updated since last sync
        const since = new Date(lastSync).toISOString().split('T')[0];
        query += ` updated:>=${since}`;
      }

      // Search for updated stories (single API call)
      const searchResult = await this._retryWithBackoff(
        async () => this.githubClient('search_issues', { query }),
        'Search for updated stories'
      );

      const issues = searchResult.items || [];
      console.log(`   Found ${issues.length} stories to sync`);

      // Sync each updated story
      for (const issue of issues) {
        const storyKey = this._extractStoryKey(issue);

        if (!storyKey) {
          console.log(`   ⚠️ Skipping issue #${issue.number} - no story key found`);
          result.errors.push({ issue: issue.number, error: 'No story key' });
          continue;
        }

        try {
          await this.syncStory(storyKey, issue);
          result.updated.push(storyKey);
        } catch (error) {
          console.log(`   ❌ Failed to sync ${storyKey}: ${error.message}`);
          result.errors.push({ storyKey, error: error.message });
        }
      }

      // Update last sync timestamp
      this.cache.updateLastSync();

      result.endTime = new Date();
      result.duration = result.endTime - result.startTime;

      console.log(`✅ Sync complete: ${result.updated.length} updated, ${result.errors.length} errors`);

      return result;

    } finally {
      this.syncInProgress = false;
    }
  }

  /**
   * Full sync - fetch all stories (initial cache population)
   *
   * @returns {Object} Sync result
   */
  async fullSync() {
    console.log('🔄 Starting full sync (initial cache population)...');

    // Invalidate all and force sync
    this.cache.invalidateAll();
    return this.incrementalSync({ force: true });
  }

  /**
   * Sync a single story from GitHub to cache
   *
   * @param {string} storyKey - Story identifier
   * @param {Object} issue - Optional pre-fetched issue object
   * @returns {Object} Sync result
   */
  async syncStory(storyKey, issue = null) {
    // Fetch issue if not provided
    if (!issue) {
      const searchResult = await this._retryWithBackoff(
        async () => this.githubClient('search_issues', {
          query: `repo:${this.github.owner}/${this.github.repo} label:story:${storyKey}`
        }),
        `Fetch story ${storyKey}`
      );

      const issues = searchResult.items || [];
      if (issues.length === 0) {
        throw new Error(`Story ${storyKey} not found in GitHub`);
      }

      issue = issues[0];
    }

    // Convert to story content
    const content = this._convertIssueToStoryContent(issue);

    // Check if content actually changed
    if (!this.cache.hasContentChanged(storyKey, content)) {
      console.log(`   ⏭️ ${storyKey} unchanged`);
      return { storyKey, status: 'unchanged' };
    }

    // Write to cache
    const writeResult = this.cache.writeStory(storyKey, content, {
      github_issue: issue.number,
      github_updated_at: issue.updated_at,
      locked_by: issue.assignee?.login || null,
      locked_until: issue.assignee ? this._calculateLockExpiry() : null
    });

    console.log(`   ✅ ${storyKey} synced (Issue #${issue.number})`);

    return { storyKey, status: 'updated', issue: issue.number };
  }

  /**
   * Calculate lock expiry (8 hours from now)
   * @private
   */
  _calculateLockExpiry() {
    const expiry = new Date();
    expiry.setHours(expiry.getHours() + 8);
    return expiry.toISOString();
  }

  /**
   * Pre-fetch all stories in an epic (batch operation for context)
   * Called on story checkout to give LLM full epic context
   *
   * @param {string|number} epicNumber - Epic number to pre-fetch
   * @returns {Object} Pre-fetch result
   */
  async preFetchEpic(epicNumber) {
    console.log(`📦 Pre-fetching Epic ${epicNumber} for context...`);

    const result = { epicNumber, stories: [], errors: [] };

    // Single API call for all stories in epic
    const searchResult = await this._retryWithBackoff(
      async () => this.githubClient('search_issues', {
        query: `repo:${this.github.owner}/${this.github.repo} label:epic:${epicNumber} label:type:story`
      }),
      `Pre-fetch Epic ${epicNumber}`
    );

    const issues = searchResult.items || [];
    console.log(`   Found ${issues.length} stories in Epic ${epicNumber}`);

    // Cache all stories in epic
    for (const issue of issues) {
      const storyKey = this._extractStoryKey(issue);

      if (!storyKey) {
        continue;
      }

      try {
        await this.syncStory(storyKey, issue);
        result.stories.push(storyKey);
      } catch (error) {
        result.errors.push({ storyKey, error: error.message });
      }
    }

    console.log(`✅ Epic ${epicNumber} pre-fetched: ${result.stories.length} stories cached`);

    return result;
  }

  /**
   * Push local changes to GitHub (write-through)
   * Used after task completion to update GitHub issue
   *
   * @param {string} storyKey - Story identifier
   * @param {Object} update - Update data
   * @param {string} update.comment - Comment to add
   * @param {string[]} update.addLabels - Labels to add
   * @param {string[]} update.removeLabels - Labels to remove
   * @param {string} update.assignee - New assignee (optional)
   * @returns {Object} Update result
   */
  async pushToGitHub(storyKey, update) {
    const meta = this.cache.loadMeta();
    const storyMeta = meta.stories[storyKey];

    if (!storyMeta || !storyMeta.github_issue) {
      throw new Error(`Story ${storyKey} not synced - no GitHub issue number`);
    }

    const issueNumber = storyMeta.github_issue;

    // Add comment if provided
    if (update.comment) {
      await this._retryWithBackoff(
        async () => this.githubClient('add_issue_comment', {
          owner: this.github.owner,
          repo: this.github.repo,
          issue_number: issueNumber,
          body: update.comment
        }),
        `Add comment to issue #${issueNumber}`
      );
    }

    // Update labels if provided
    if (update.addLabels || update.removeLabels) {
      // First get current issue
      const issue = await this.githubClient('issue_read', {
        method: 'get',
        owner: this.github.owner,
        repo: this.github.repo,
        issue_number: issueNumber
      });

      let labels = issue.labels?.map(l => typeof l === 'string' ? l : l.name) || [];

      // Remove labels
      if (update.removeLabels) {
        labels = labels.filter(l => !update.removeLabels.includes(l));
      }

      // Add labels
      if (update.addLabels) {
        for (const label of update.addLabels) {
          if (!labels.includes(label)) {
            labels.push(label);
          }
        }
      }

      await this._retryWithBackoff(
        async () => this.githubClient('issue_write', {
          method: 'update',
          owner: this.github.owner,
          repo: this.github.repo,
          issue_number: issueNumber,
          labels
        }),
        `Update labels on issue #${issueNumber}`
      );
    }

    // Verify write succeeded
    await this._sleep(1000); // GitHub eventual consistency

    const verify = await this.githubClient('issue_read', {
      method: 'get',
      owner: this.github.owner,
      repo: this.github.repo,
      issue_number: issueNumber
    });

    console.log(`✅ GitHub issue #${issueNumber} updated and verified`);

    return {
      storyKey,
      issueNumber,
      verified: true
    };
  }

  /**
   * Sync progress update to GitHub
   * Called after each task completion in dev-story workflow
   *
   * @param {string} storyKey - Story identifier
   * @param {Object} progress - Progress data
   * @param {number} progress.taskNum - Current task number
   * @param {number} progress.totalTasks - Total tasks
   * @param {string} progress.taskDescription - Task description
   * @param {number} progress.percentage - Completion percentage
   */
  async syncProgress(storyKey, progress) {
    const comment =
      `📊 **Task ${progress.taskNum}/${progress.totalTasks} complete** (${progress.percentage}%)\n\n` +
      `> ${progress.taskDescription}\n\n` +
      `_Progress synced at ${new Date().toISOString()}_`;

    return this.pushToGitHub(storyKey, { comment });
  }

  /**
   * Assign story to user (lock acquisition)
   *
   * @param {string} storyKey - Story identifier
   * @param {string} username - GitHub username
   * @returns {Object} Assignment result
   */
  async assignStory(storyKey, username) {
    const meta = this.cache.loadMeta();
    const storyMeta = meta.stories[storyKey];

    if (!storyMeta || !storyMeta.github_issue) {
      // Need to find the issue first
      const searchResult = await this.githubClient('search_issues', {
        query: `repo:${this.github.owner}/${this.github.repo} label:story:${storyKey}`
      });

      if (!searchResult.items?.length) {
        throw new Error(`Story ${storyKey} not found in GitHub`);
      }

      storyMeta.github_issue = searchResult.items[0].number;
    }

    const issueNumber = storyMeta.github_issue;

    // Assign user and update status label
    await this._retryWithBackoff(
      async () => this.githubClient('issue_write', {
        method: 'update',
        owner: this.github.owner,
        repo: this.github.repo,
        issue_number: issueNumber,
        assignees: [username]
      }),
      `Assign issue #${issueNumber} to ${username}`
    );

    // Update status label to in-progress
    await this.pushToGitHub(storyKey, {
      addLabels: ['status:in-progress'],
      removeLabels: ['status:backlog', 'status:ready-for-dev'],
      comment: `🔒 **Story locked by @${username}**\n\nLock expires in 8 hours.`
    });

    // Update cache
    const lockExpiry = this._calculateLockExpiry();
    this.cache.updateLock(storyKey, {
      locked_by: username,
      locked_until: lockExpiry
    });

    // Verify assignment
    await this._sleep(1000);

    const verify = await this.githubClient('issue_read', {
      method: 'get',
      owner: this.github.owner,
      repo: this.github.repo,
      issue_number: issueNumber
    });

    if (!verify.assignees?.some(a => a.login === username)) {
      throw new Error('Assignment verification failed');
    }

    console.log(`✅ Story ${storyKey} assigned to @${username}`);

    return {
      storyKey,
      issueNumber,
      assignee: username,
      lockExpiry
    };
  }

  /**
   * Unassign story (lock release)
   *
   * @param {string} storyKey - Story identifier
   * @param {string} reason - Reason for unlock (optional)
   * @returns {Object} Unassignment result
   */
  async unassignStory(storyKey, reason = null) {
    const meta = this.cache.loadMeta();
    const storyMeta = meta.stories[storyKey];

    if (!storyMeta || !storyMeta.github_issue) {
      throw new Error(`Story ${storyKey} not synced - cannot unassign`);
    }

    const issueNumber = storyMeta.github_issue;

    // Remove assignees
    await this._retryWithBackoff(
      async () => this.githubClient('issue_write', {
        method: 'update',
        owner: this.github.owner,
        repo: this.github.repo,
        issue_number: issueNumber,
        assignees: []
      }),
      `Unassign issue #${issueNumber}`
    );

    // Update status label
    await this.pushToGitHub(storyKey, {
      addLabels: ['status:ready-for-dev'],
      removeLabels: ['status:in-progress'],
      comment: `🔓 **Story unlocked**${reason ? `\n\nReason: ${reason}` : ''}`
    });

    // Clear cache lock
    this.cache.clearLock(storyKey);

    console.log(`✅ Story ${storyKey} unlocked`);

    return { storyKey, issueNumber, unlocked: true };
  }

  /**
   * Check if story is available (not locked by another user)
   *
   * @param {string} storyKey - Story identifier
   * @param {string} currentUser - Current user's username
   * @returns {Object} Availability info
   */
  async checkAvailability(storyKey, currentUser) {
    // First check cache (fast)
    const cacheLock = this.cache.getLockStatus(storyKey);

    if (cacheLock && !cacheLock.expired && cacheLock.locked_by !== currentUser) {
      return {
        available: false,
        locked_by: cacheLock.locked_by,
        locked_until: cacheLock.locked_until,
        source: 'cache'
      };
    }

    // Verify with GitHub (source of truth)
    const searchResult = await this.githubClient('search_issues', {
      query: `repo:${this.github.owner}/${this.github.repo} label:story:${storyKey}`
    });

    if (!searchResult.items?.length) {
      return { available: false, error: 'Story not found in GitHub' };
    }

    const issue = searchResult.items[0];

    if (issue.assignee && issue.assignee.login !== currentUser) {
      // Update cache with GitHub truth
      this.cache.updateLock(storyKey, {
        locked_by: issue.assignee.login,
        locked_until: this._calculateLockExpiry()
      });

      return {
        available: false,
        locked_by: issue.assignee.login,
        github_issue: issue.number,
        source: 'github'
      };
    }

    return {
      available: true,
      github_issue: issue.number
    };
  }

  /**
   * Get all available (unlocked) stories
   *
   * @param {Object} options - Filter options
   * @param {string} options.epicNumber - Filter by epic
   * @param {string} options.status - Filter by status
   * @returns {Object[]} Array of available stories
   */
  async getAvailableStories(options = {}) {
    let query = `repo:${this.github.owner}/${this.github.repo} label:type:story no:assignee`;

    if (options.epicNumber) {
      query += ` label:epic:${options.epicNumber}`;
    }

    if (options.status) {
      query += ` label:status:${options.status}`;
    } else {
      // Default: ready-for-dev or backlog
      query += ` (label:status:ready-for-dev OR label:status:backlog)`;
    }

    const searchResult = await this._retryWithBackoff(
      async () => this.githubClient('search_issues', { query }),
      'Search for available stories'
    );

    const stories = (searchResult.items || []).map(issue => ({
      storyKey: this._extractStoryKey(issue),
      title: issue.title,
      issueNumber: issue.number,
      status: this._extractStatus(issue),
      labels: issue.labels?.map(l => typeof l === 'string' ? l : l.name) || [],
      url: issue.html_url
    })).filter(s => s.storyKey); // Filter out any without valid story keys

    return stories;
  }
}

module.exports = { SyncEngine, RETRY_BACKOFF_MS, MAX_RETRIES };
