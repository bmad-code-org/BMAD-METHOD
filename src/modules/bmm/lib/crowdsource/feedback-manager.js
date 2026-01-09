/**
 * Feedback Manager - Generic feedback operations for PRD and Epic crowdsourcing
 *
 * Handles creation, querying, and status updates of feedback issues.
 * Works with both PRDs and Epics through a common interface.
 */

const FEEDBACK_TYPES = {
  clarification: {
    label: 'feedback-type:clarification',
    emoji: '📋',
    description: 'Something is unclear or needs more detail'
  },
  concern: {
    label: 'feedback-type:concern',
    emoji: '⚠️',
    description: 'Potential issue, risk, or problem'
  },
  suggestion: {
    label: 'feedback-type:suggestion',
    emoji: '💡',
    description: 'Improvement idea or alternative approach'
  },
  addition: {
    label: 'feedback-type:addition',
    emoji: '➕',
    description: 'Missing requirement or feature'
  },
  priority: {
    label: 'feedback-type:priority',
    emoji: '🔢',
    description: 'Disagree with prioritization or ordering'
  },
  // Epic-specific types
  scope: {
    label: 'feedback-type:scope',
    emoji: '📐',
    description: 'Epic scope is too large or should be split'
  },
  dependency: {
    label: 'feedback-type:dependency',
    emoji: '🔗',
    description: 'Dependency or blocking relationship'
  },
  technical_risk: {
    label: 'feedback-type:technical-risk',
    emoji: '🔧',
    description: 'Technical or architectural concern'
  },
  story_split: {
    label: 'feedback-type:story-split',
    emoji: '✂️',
    description: 'Suggest different story breakdown'
  }
};

const FEEDBACK_STATUS = {
  new: 'feedback-status:new',
  reviewed: 'feedback-status:reviewed',
  incorporated: 'feedback-status:incorporated',
  deferred: 'feedback-status:deferred'
};

const PRIORITY_LEVELS = {
  high: 'priority:high',
  medium: 'priority:medium',
  low: 'priority:low'
};

class FeedbackManager {
  constructor(githubConfig) {
    this.owner = githubConfig.owner;
    this.repo = githubConfig.repo;
  }

  /**
   * Create a new feedback issue linked to a review round
   */
  async createFeedback({
    reviewIssueNumber,
    documentKey,        // prd:user-auth or epic:2
    documentType,       // 'prd' or 'epic'
    section,            // e.g., 'User Stories', 'FR-3'
    feedbackType,       // 'clarification', 'concern', etc.
    priority,           // 'high', 'medium', 'low'
    title,              // Brief title
    content,            // Detailed feedback
    suggestedChange,    // Optional proposed change
    rationale,          // Why this matters
    submittedBy         // @username
  }) {
    const typeConfig = FEEDBACK_TYPES[feedbackType];
    if (!typeConfig) {
      throw new Error(`Unknown feedback type: ${feedbackType}`);
    }

    const labels = [
      `type:${documentType}-feedback`,
      `${documentType}:${documentKey.split(':')[1]}`,
      `linked-review:${reviewIssueNumber}`,
      `feedback-section:${section.toLowerCase().replace(/\s+/g, '-')}`,
      typeConfig.label,
      FEEDBACK_STATUS.new,
      PRIORITY_LEVELS[priority] || PRIORITY_LEVELS.medium
    ];

    const body = this._formatFeedbackBody({
      reviewIssueNumber,
      documentKey,
      section,
      feedbackType,
      typeConfig,
      priority,
      content,
      suggestedChange,
      rationale,
      submittedBy
    });

    // Create the feedback issue
    const issue = await this._createIssue({
      title: `${typeConfig.emoji} Feedback: ${title}`,
      body,
      labels
    });

    // Add comment to review issue linking to this feedback
    await this._addLinkComment(reviewIssueNumber, issue.number, title, feedbackType, submittedBy);

    return {
      feedbackId: issue.number,
      url: issue.html_url,
      documentKey,
      section,
      feedbackType,
      status: 'new'
    };
  }

  /**
   * Query all feedback for a document or review round
   */
  async getFeedback({
    documentKey,        // Optional: filter by document
    reviewIssueNumber,  // Optional: filter by review round
    documentType,       // 'prd' or 'epic'
    status,             // Optional: filter by status
    section,            // Optional: filter by section
    feedbackType        // Optional: filter by type
  }) {
    let query = `repo:${this.owner}/${this.repo} type:issue is:open`;
    query += ` label:type:${documentType}-feedback`;

    if (documentKey) {
      const key = documentKey.includes(':') ? documentKey.split(':')[1] : documentKey;
      query += ` label:${documentType}:${key}`;
    }

    if (reviewIssueNumber) {
      query += ` label:linked-review:${reviewIssueNumber}`;
    }

    if (status) {
      query += ` label:${FEEDBACK_STATUS[status] || status}`;
    }

    if (section) {
      query += ` label:feedback-section:${section.toLowerCase().replace(/\s+/g, '-')}`;
    }

    if (feedbackType) {
      const typeConfig = FEEDBACK_TYPES[feedbackType];
      if (typeConfig) {
        query += ` label:${typeConfig.label}`;
      }
    }

    const results = await this._searchIssues(query);

    return results.map(issue => this._parseFeedbackIssue(issue));
  }

  /**
   * Group feedback by section for synthesis
   */
  async getFeedbackBySection(documentKey, documentType) {
    const allFeedback = await this.getFeedback({ documentKey, documentType });

    const bySection = {};
    for (const fb of allFeedback) {
      if (!bySection[fb.section]) {
        bySection[fb.section] = [];
      }
      bySection[fb.section].push(fb);
    }

    return bySection;
  }

  /**
   * Group feedback by type for analysis
   */
  async getFeedbackByType(documentKey, documentType) {
    const allFeedback = await this.getFeedback({ documentKey, documentType });

    const byType = {};
    for (const fb of allFeedback) {
      if (!byType[fb.feedbackType]) {
        byType[fb.feedbackType] = [];
      }
      byType[fb.feedbackType].push(fb);
    }

    return byType;
  }

  /**
   * Detect conflicts (multiple feedback on same section with different opinions)
   */
  async detectConflicts(documentKey, documentType) {
    const bySection = await this.getFeedbackBySection(documentKey, documentType);
    const conflicts = [];

    for (const [section, feedbackList] of Object.entries(bySection)) {
      if (feedbackList.length < 2) continue;

      // Check for opposing views on the same topic
      const concerns = feedbackList.filter(f => f.feedbackType === 'concern');
      const suggestions = feedbackList.filter(f => f.feedbackType === 'suggestion');

      if (concerns.length > 1 || (concerns.length >= 1 && suggestions.length >= 1)) {
        conflicts.push({
          section,
          feedbackItems: feedbackList,
          conflictType: 'multiple_opinions',
          summary: `${feedbackList.length} stakeholders have input on ${section}`
        });
      }
    }

    return conflicts;
  }

  /**
   * Update feedback status
   */
  async updateFeedbackStatus(feedbackIssueNumber, newStatus, resolution = null) {
    const statusLabel = FEEDBACK_STATUS[newStatus];
    if (!statusLabel) {
      throw new Error(`Unknown status: ${newStatus}`);
    }

    // Get current labels
    const issue = await this._getIssue(feedbackIssueNumber);
    const currentLabels = issue.labels.map(l => l.name);

    // Remove old status labels, add new one
    const newLabels = currentLabels
      .filter(l => !l.startsWith('feedback-status:'))
      .concat([statusLabel]);

    await this._updateIssue(feedbackIssueNumber, { labels: newLabels });

    // Add resolution comment if provided
    if (resolution) {
      await this._addComment(feedbackIssueNumber,
        `**Status Updated: ${newStatus}**\n\n${resolution}`
      );
    }

    // Close issue if incorporated or deferred
    if (newStatus === 'incorporated' || newStatus === 'deferred') {
      await this._closeIssue(feedbackIssueNumber,
        newStatus === 'incorporated' ? 'completed' : 'not_planned'
      );
    }

    return { feedbackId: feedbackIssueNumber, status: newStatus };
  }

  /**
   * Get feedback statistics for a document
   */
  async getStats(documentKey, documentType) {
    const allFeedback = await this.getFeedback({ documentKey, documentType });

    const stats = {
      total: allFeedback.length,
      byType: {},
      byStatus: {},
      bySection: {},
      byPriority: {},
      submitters: new Set()
    };

    for (const fb of allFeedback) {
      // By type
      stats.byType[fb.feedbackType] = (stats.byType[fb.feedbackType] || 0) + 1;

      // By status
      stats.byStatus[fb.status] = (stats.byStatus[fb.status] || 0) + 1;

      // By section
      stats.bySection[fb.section] = (stats.bySection[fb.section] || 0) + 1;

      // By priority
      stats.byPriority[fb.priority] = (stats.byPriority[fb.priority] || 0) + 1;

      // Unique submitters
      stats.submitters.add(fb.submittedBy);
    }

    stats.submitterCount = stats.submitters.size;
    stats.submitters = Array.from(stats.submitters);

    return stats;
  }

  // ============ Private Methods ============

  _formatFeedbackBody({ reviewIssueNumber, documentKey, section, feedbackType, typeConfig, priority, content, suggestedChange, rationale, submittedBy }) {
    let body = `# ${typeConfig.emoji} Feedback: ${feedbackType.charAt(0).toUpperCase() + feedbackType.slice(1)}\n\n`;
    body += `**Review:** #${reviewIssueNumber}\n`;
    body += `**Document:** \`${documentKey}\`\n`;
    body += `**Section:** ${section}\n`;
    body += `**Type:** ${typeConfig.description}\n`;
    body += `**Priority:** ${priority}\n\n`;
    body += `---\n\n`;
    body += `## Feedback\n\n${content}\n\n`;

    if (suggestedChange) {
      body += `## Suggested Change\n\n${suggestedChange}\n\n`;
    }

    if (rationale) {
      body += `## Context/Rationale\n\n${rationale}\n\n`;
    }

    body += `---\n\n`;
    body += `_Submitted by @${submittedBy} on ${new Date().toISOString().split('T')[0]}_\n`;

    return body;
  }

  _parseFeedbackIssue(issue) {
    const labels = issue.labels.map(l => l.name);

    return {
      id: issue.number,
      url: issue.html_url,
      title: issue.title.replace(/^[^\s]+\s+Feedback:\s*/, ''),
      section: this._extractLabel(labels, 'feedback-section:'),
      feedbackType: this._extractLabel(labels, 'feedback-type:'),
      status: this._extractLabel(labels, 'feedback-status:'),
      priority: this._extractLabel(labels, 'priority:'),
      submittedBy: issue.user?.login,
      createdAt: issue.created_at,
      updatedAt: issue.updated_at,
      body: issue.body
    };
  }

  _extractLabel(labels, prefix) {
    const label = labels.find(l => l.startsWith(prefix));
    return label ? label.replace(prefix, '') : null;
  }

  async _addLinkComment(reviewIssueNumber, feedbackIssueNumber, title, feedbackType, submittedBy) {
    const typeConfig = FEEDBACK_TYPES[feedbackType];
    const comment = `${typeConfig.emoji} **New Feedback** from @${submittedBy}\n\n` +
      `**${title}** → #${feedbackIssueNumber}\n` +
      `Type: ${feedbackType}`;

    await this._addComment(reviewIssueNumber, comment);
  }

  // GitHub API wrappers (to be called via MCP)
  async _createIssue({ title, body, labels }) {
    // This would be: mcp__github__issue_write({ method: 'create', ... })
    throw new Error('_createIssue must be implemented by caller via GitHub MCP');
  }

  async _getIssue(issueNumber) {
    // This would be: mcp__github__issue_read({ method: 'get', ... })
    throw new Error('_getIssue must be implemented by caller via GitHub MCP');
  }

  async _updateIssue(issueNumber, updates) {
    // This would be: mcp__github__issue_write({ method: 'update', ... })
    throw new Error('_updateIssue must be implemented by caller via GitHub MCP');
  }

  async _closeIssue(issueNumber, reason) {
    // This would be: mcp__github__issue_write({ method: 'update', state: 'closed', ... })
    throw new Error('_closeIssue must be implemented by caller via GitHub MCP');
  }

  async _addComment(issueNumber, body) {
    // This would be: mcp__github__add_issue_comment({ ... })
    throw new Error('_addComment must be implemented by caller via GitHub MCP');
  }

  async _searchIssues(query) {
    // This would be: mcp__github__search_issues({ query })
    throw new Error('_searchIssues must be implemented by caller via GitHub MCP');
  }
}

module.exports = {
  FeedbackManager,
  FEEDBACK_TYPES,
  FEEDBACK_STATUS,
  PRIORITY_LEVELS
};
