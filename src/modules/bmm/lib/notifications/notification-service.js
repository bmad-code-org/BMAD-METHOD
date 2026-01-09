/**
 * Notification Service - Multi-channel notification orchestration
 *
 * Coordinates notifications across GitHub, Slack, and Email channels.
 * GitHub @mentions are always used as baseline; Slack and Email are optional.
 */

const { GitHubNotifier } = require('./github-notifier');
const { SlackNotifier } = require('./slack-notifier');
const { EmailNotifier } = require('./email-notifier');

/**
 * Notification event types and their default channels
 */
const NOTIFICATION_EVENTS = {
  feedback_round_opened: {
    description: 'PRD/Epic is open for feedback',
    defaultChannels: ['github', 'slack', 'email'],
    priority: 'normal',
  },
  feedback_submitted: {
    description: 'New feedback submitted',
    defaultChannels: ['github', 'slack'],
    priority: 'normal',
  },
  synthesis_complete: {
    description: 'Feedback synthesis completed',
    defaultChannels: ['github', 'slack'],
    priority: 'normal',
  },
  signoff_requested: {
    description: 'Sign-off requested from stakeholders',
    defaultChannels: ['github', 'slack', 'email'],
    priority: 'high',
  },
  signoff_received: {
    description: 'Sign-off decision received',
    defaultChannels: ['github', 'slack'],
    priority: 'normal',
  },
  document_approved: {
    description: 'Document fully approved',
    defaultChannels: ['github', 'slack', 'email'],
    priority: 'high',
  },
  document_blocked: {
    description: 'Document blocked by stakeholder',
    defaultChannels: ['github', 'slack', 'email'],
    priority: 'urgent',
  },
  reminder: {
    description: 'Reminder for pending action',
    defaultChannels: ['github', 'slack', 'email'],
    priority: 'normal',
  },
  deadline_extended: {
    description: 'Deadline has been extended',
    defaultChannels: ['github'],
    priority: 'low',
  },
};

/**
 * Priority levels and their behavior
 */
const PRIORITY_BEHAVIOR = {
  urgent: {
    retryOnFailure: true,
    maxRetries: 3,
    allChannels: true, // Send on all available channels
  },
  high: {
    retryOnFailure: true,
    maxRetries: 2,
    allChannels: false,
  },
  normal: {
    retryOnFailure: false,
    maxRetries: 1,
    allChannels: false,
  },
  low: {
    retryOnFailure: false,
    maxRetries: 1,
    allChannels: false,
  },
};

class NotificationService {
  /**
   * Create a new NotificationService
   * @param {Object} config - Configuration object
   * @param {Object} config.github - GitHub notifier config (required)
   * @param {Object} config.slack - Slack notifier config (optional)
   * @param {Object} config.email - Email notifier config (optional)
   */
  constructor(config) {
    // GitHub is always required and enabled
    this.channels = {
      github: new GitHubNotifier(config.github),
    };

    // Optional channels
    if (config.slack?.enabled && config.slack?.webhookUrl) {
      this.channels.slack = new SlackNotifier(config.slack);
    }

    if (config.email?.enabled && (config.email?.smtp || config.email?.apiKey)) {
      this.channels.email = new EmailNotifier(config.email);
    }

    this.config = config;
  }

  /**
   * Get available notification channels
   * @returns {string[]} Array of channel names
   */
  getAvailableChannels() {
    return Object.keys(this.channels);
  }

  /**
   * Check if a channel is available
   * @param {string} channel - Channel name
   * @returns {boolean}
   */
  isChannelAvailable(channel) {
    return !!this.channels[channel];
  }

  /**
   * Send a notification across configured channels
   * @param {string} eventType - Type of notification event
   * @param {Object} data - Event data
   * @param {Object} options - Additional options
   * @returns {Object} Results from all channels
   */
  async notify(eventType, data, options = {}) {
    const eventConfig = NOTIFICATION_EVENTS[eventType];
    if (!eventConfig) {
      throw new Error(`Unknown notification event type: ${eventType}`);
    }

    // Determine which channels to use
    let channels = options.channels || eventConfig.defaultChannels;

    // Filter to only available channels
    channels = channels.filter((ch) => this.isChannelAvailable(ch));

    // For urgent priority, use all available channels
    const priority = options.priority || eventConfig.priority;
    const priorityBehavior = PRIORITY_BEHAVIOR[priority];

    if (priorityBehavior.allChannels) {
      channels = this.getAvailableChannels();
    }

    // Ensure GitHub is always included (baseline)
    if (!channels.includes('github')) {
      channels.unshift('github');
    }

    // Send to all channels
    const results = await Promise.all(
      channels.map(async (channel) => {
        return await this._sendToChannel(channel, eventType, data, options, priorityBehavior);
      }),
    );

    // Aggregate results
    const aggregated = {
      success: results.some((r) => r.success),
      eventType,
      results: results.reduce((acc, r) => {
        acc[r.channel] = r;
        return acc;
      }, {}),
    };

    return aggregated;
  }

  /**
   * Send a reminder to specific users
   * @param {string} documentType - 'prd' or 'epic'
   * @param {string} documentKey - Document key
   * @param {string[]} users - Users to remind
   * @param {Object} reminderData - Reminder data
   * @returns {Object} Notification results
   */
  async sendReminder(documentType, documentKey, users, reminderData) {
    const data = {
      document_type: documentType,
      document_key: documentKey,
      mentions: users.map((u) => `@${u}`).join(' '),
      users,
      ...reminderData,
    };

    return await this.notify('reminder', data);
  }

  /**
   * Notify about feedback round opening
   * @param {Object} document - Document data
   * @param {string[]} stakeholders - Stakeholders to notify
   * @param {string} deadline - Deadline date
   * @returns {Object} Notification results
   */
  async notifyFeedbackRoundOpened(document, stakeholders, deadline) {
    const data = {
      document_type: document.type,
      document_key: document.key,
      title: document.title,
      version: document.version,
      deadline,
      stakeholder_count: stakeholders.length,
      mentions: stakeholders.map((s) => `@${s}`).join(' '),
      users: stakeholders,
      document_url: document.url,
      review_issue: document.reviewIssue,
    };

    return await this.notify('feedback_round_opened', data);
  }

  /**
   * Notify about new feedback submission
   * @param {Object} feedback - Feedback data
   * @param {Object} document - Document data
   * @returns {Object} Notification results
   */
  async notifyFeedbackSubmitted(feedback, document) {
    const data = {
      document_type: document.type,
      document_key: document.key,
      user: feedback.submittedBy,
      feedback_type: feedback.type,
      section: feedback.section,
      summary: feedback.summary || feedback.title,
      feedback_issue: feedback.issueNumber,
      feedback_url: feedback.url,
      review_issue: document.reviewIssue,
    };

    // Only notify PO (not all stakeholders)
    return await this.notify('feedback_submitted', data, {
      notifyOnly: [document.owner],
    });
  }

  /**
   * Notify about synthesis completion
   * @param {Object} document - Document data
   * @param {Object} synthesis - Synthesis results
   * @returns {Object} Notification results
   */
  async notifySynthesisComplete(document, synthesis) {
    const data = {
      document_type: document.type,
      document_key: document.key,
      old_version: synthesis.oldVersion,
      new_version: synthesis.newVersion,
      feedback_count: synthesis.feedbackCount,
      conflicts_resolved: synthesis.conflictsResolved,
      summary: synthesis.summary,
      document_url: document.url,
      review_issue: document.reviewIssue,
    };

    return await this.notify('synthesis_complete', data);
  }

  /**
   * Notify about sign-off request
   * @param {Object} document - Document data
   * @param {string[]} stakeholders - Stakeholders to request sign-off from
   * @param {string} deadline - Sign-off deadline
   * @param {Object} config - Sign-off configuration
   * @returns {Object} Notification results
   */
  async notifySignoffRequested(document, stakeholders, deadline, config) {
    const data = {
      document_type: document.type,
      document_key: document.key,
      title: document.title,
      version: document.version,
      deadline,
      approvals_needed: config.minimum_approvals || Math.ceil(stakeholders.length * 0.5),
      mentions: stakeholders.map((s) => `@${s}`).join(' '),
      users: stakeholders,
      document_url: document.url,
      signoff_url: document.signoffUrl,
      review_issue: document.reviewIssue,
    };

    return await this.notify('signoff_requested', data);
  }

  /**
   * Notify about sign-off received
   * @param {Object} signoff - Sign-off data
   * @param {Object} document - Document data
   * @param {Object} progress - Current progress
   * @returns {Object} Notification results
   */
  async notifySignoffReceived(signoff, document, progress) {
    const emojis = {
      approved: '✅',
      'approved-with-note': '✅📝',
      blocked: '🚫',
    };

    const data = {
      document_type: document.type,
      document_key: document.key,
      user: signoff.user,
      decision: signoff.decision,
      emoji: emojis[signoff.decision] || '❓',
      note: signoff.note,
      progress_current: progress.current,
      progress_total: progress.total,
      review_issue: document.reviewIssue,
      review_url: document.reviewUrl,
    };

    return await this.notify('signoff_received', data);
  }

  /**
   * Notify about document approval
   * @param {Object} document - Document data
   * @param {number} approvalCount - Number of approvals
   * @param {number} stakeholderCount - Total stakeholders
   * @returns {Object} Notification results
   */
  async notifyDocumentApproved(document, approvalCount, stakeholderCount) {
    const data = {
      document_type: document.type,
      document_key: document.key,
      title: document.title,
      version: document.version,
      approval_count: approvalCount,
      stakeholder_count: stakeholderCount,
      document_url: document.url,
    };

    return await this.notify('document_approved', data);
  }

  /**
   * Notify about document being blocked
   * @param {Object} document - Document data
   * @param {Object} block - Block data
   * @returns {Object} Notification results
   */
  async notifyDocumentBlocked(document, block) {
    const data = {
      document_type: document.type,
      document_key: document.key,
      user: block.user,
      reason: block.reason,
      feedback_issue: block.feedbackIssue,
      feedback_url: block.feedbackUrl,
    };

    return await this.notify('document_blocked', data);
  }

  /**
   * Send to a specific channel with retry logic
   * @private
   */
  async _sendToChannel(channel, eventType, data, options, priorityBehavior) {
    const notifier = this.channels[channel];
    if (!notifier) {
      return {
        success: false,
        channel,
        error: 'Channel not available',
      };
    }

    let lastError = null;
    const maxRetries = priorityBehavior.retryOnFailure ? priorityBehavior.maxRetries : 1;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        const result = await notifier.send(eventType, data, options);
        result.channel = channel;
        result.attempt = attempt;

        if (result.success) {
          return result;
        }

        lastError = result.error;
      } catch (error) {
        lastError = error.message;
      }

      // Wait before retry (exponential backoff)
      if (attempt < maxRetries) {
        await new Promise((resolve) => setTimeout(resolve, 1000 * Math.pow(2, attempt - 1)));
      }
    }

    return {
      success: false,
      channel,
      error: lastError,
      attempts: maxRetries,
    };
  }
}

module.exports = {
  NotificationService,
  NOTIFICATION_EVENTS,
  PRIORITY_BEHAVIOR,
};
