/**
 * Slack Notifier - Optional Slack webhook integration
 *
 * Sends notifications to Slack channels via incoming webhooks.
 * This is an optional notification channel that can be enabled in config.
 */

const SLACK_TEMPLATES = {
  feedback_round_opened: {
    color: '#36a64f', // Green
    title: '📣 Feedback Round Open',
    blocks: (data) => [
      {
        type: 'header',
        text: { type: 'plain_text', text: '📣 Feedback Round Open', emoji: true },
      },
      {
        type: 'section',
        fields: [
          { type: 'mrkdwn', text: `*Document:*\n${data.document_type}:${data.document_key}` },
          { type: 'mrkdwn', text: `*Version:*\nv${data.version}` },
          { type: 'mrkdwn', text: `*Deadline:*\n${data.deadline}` },
          { type: 'mrkdwn', text: `*Stakeholders:*\n${data.stakeholder_count}` },
        ],
      },
      {
        type: 'section',
        text: { type: 'mrkdwn', text: `Please review and provide feedback by *${data.deadline}*.` },
      },
      {
        type: 'actions',
        elements: [
          {
            type: 'button',
            text: { type: 'plain_text', text: 'View Document', emoji: true },
            url: data.document_url,
            style: 'primary',
          },
        ],
      },
    ],
  },

  feedback_submitted: {
    color: '#1e90ff', // Blue
    title: '💬 New Feedback Submitted',
    blocks: (data) => [
      {
        type: 'header',
        text: { type: 'plain_text', text: '💬 New Feedback', emoji: true },
      },
      {
        type: 'section',
        fields: [
          { type: 'mrkdwn', text: `*From:*\n${data.user}` },
          { type: 'mrkdwn', text: `*Document:*\n${data.document_type}:${data.document_key}` },
          { type: 'mrkdwn', text: `*Type:*\n${data.feedback_type}` },
          { type: 'mrkdwn', text: `*Section:*\n${data.section}` },
        ],
      },
      {
        type: 'section',
        text: { type: 'mrkdwn', text: `> ${data.summary.substring(0, 200)}${data.summary.length > 200 ? '...' : ''}` },
      },
      {
        type: 'actions',
        elements: [
          {
            type: 'button',
            text: { type: 'plain_text', text: 'View Feedback', emoji: true },
            url: data.feedback_url,
          },
        ],
      },
    ],
  },

  synthesis_complete: {
    color: '#9932cc', // Purple
    title: '🔄 Synthesis Complete',
    blocks: (data) => [
      {
        type: 'header',
        text: { type: 'plain_text', text: '🔄 Synthesis Complete', emoji: true },
      },
      {
        type: 'section',
        fields: [
          { type: 'mrkdwn', text: `*Document:*\n${data.document_type}:${data.document_key}` },
          { type: 'mrkdwn', text: `*Version:*\nv${data.old_version} → v${data.new_version}` },
          { type: 'mrkdwn', text: `*Feedback Processed:*\n${data.feedback_count} items` },
          { type: 'mrkdwn', text: `*Conflicts Resolved:*\n${data.conflicts_resolved || 0}` },
        ],
      },
      {
        type: 'section',
        text: { type: 'mrkdwn', text: data.summary.substring(0, 500) },
      },
      {
        type: 'actions',
        elements: [
          {
            type: 'button',
            text: { type: 'plain_text', text: 'View Document', emoji: true },
            url: data.document_url,
            style: 'primary',
          },
        ],
      },
    ],
  },

  signoff_requested: {
    color: '#ffa500', // Orange
    title: '✍️ Sign-off Requested',
    blocks: (data) => [
      {
        type: 'header',
        text: { type: 'plain_text', text: '✍️ Sign-off Requested', emoji: true },
      },
      {
        type: 'section',
        fields: [
          { type: 'mrkdwn', text: `*Document:*\n${data.document_type}:${data.document_key}` },
          { type: 'mrkdwn', text: `*Version:*\nv${data.version}` },
          { type: 'mrkdwn', text: `*Deadline:*\n${data.deadline}` },
          { type: 'mrkdwn', text: `*Approvals Needed:*\n${data.approvals_needed}` },
        ],
      },
      {
        type: 'section',
        text: { type: 'mrkdwn', text: 'Please review and provide your sign-off decision.' },
      },
      {
        type: 'actions',
        elements: [
          {
            type: 'button',
            text: { type: 'plain_text', text: 'View Document', emoji: true },
            url: data.document_url,
            style: 'primary',
          },
          {
            type: 'button',
            text: { type: 'plain_text', text: 'Sign Off', emoji: true },
            url: data.signoff_url,
          },
        ],
      },
    ],
  },

  signoff_received: {
    color: (data) => (data.decision === 'blocked' ? '#dc3545' : '#28a745'),
    title: (data) => `${data.emoji} Sign-off from ${data.user}`,
    blocks: (data) => [
      {
        type: 'header',
        text: { type: 'plain_text', text: `${data.emoji} Sign-off Received`, emoji: true },
      },
      {
        type: 'section',
        fields: [
          { type: 'mrkdwn', text: `*From:*\n${data.user}` },
          { type: 'mrkdwn', text: `*Decision:*\n${data.decision}` },
          { type: 'mrkdwn', text: `*Document:*\n${data.document_type}:${data.document_key}` },
          { type: 'mrkdwn', text: `*Progress:*\n${data.progress_current}/${data.progress_total}` },
        ],
      },
      ...(data.note
        ? [
            {
              type: 'section',
              text: { type: 'mrkdwn', text: `*Note:* ${data.note}` },
            },
          ]
        : []),
      {
        type: 'actions',
        elements: [
          {
            type: 'button',
            text: { type: 'plain_text', text: 'View Progress', emoji: true },
            url: data.review_url,
          },
        ],
      },
    ],
  },

  document_approved: {
    color: '#28a745', // Green
    title: '✅ Document Approved!',
    blocks: (data) => [
      {
        type: 'header',
        text: { type: 'plain_text', text: '✅ Document Approved!', emoji: true },
      },
      {
        type: 'section',
        fields: [
          { type: 'mrkdwn', text: `*Document:*\n${data.document_type}:${data.document_key}` },
          { type: 'mrkdwn', text: `*Title:*\n${data.title}` },
          { type: 'mrkdwn', text: `*Version:*\nv${data.version}` },
          { type: 'mrkdwn', text: `*Approvals:*\n${data.approval_count}/${data.stakeholder_count}` },
        ],
      },
      {
        type: 'section',
        text: { type: 'mrkdwn', text: '🎉 All required sign-offs received. Ready for implementation!' },
      },
      {
        type: 'actions',
        elements: [
          {
            type: 'button',
            text: { type: 'plain_text', text: 'View Document', emoji: true },
            url: data.document_url,
            style: 'primary',
          },
        ],
      },
    ],
  },

  document_blocked: {
    color: '#dc3545', // Red
    title: '🚫 Document Blocked',
    blocks: (data) => [
      {
        type: 'header',
        text: { type: 'plain_text', text: '🚫 Document Blocked', emoji: true },
      },
      {
        type: 'section',
        fields: [
          { type: 'mrkdwn', text: `*Document:*\n${data.document_type}:${data.document_key}` },
          { type: 'mrkdwn', text: `*Blocked by:*\n${data.user}` },
        ],
      },
      {
        type: 'section',
        text: { type: 'mrkdwn', text: `*Reason:*\n${data.reason}` },
      },
      {
        type: 'section',
        text: { type: 'mrkdwn', text: '⚠️ This blocking concern must be resolved before approval.' },
      },
      ...(data.feedback_url
        ? [
            {
              type: 'actions',
              elements: [
                {
                  type: 'button',
                  text: { type: 'plain_text', text: 'View Issue', emoji: true },
                  url: data.feedback_url,
                  style: 'danger',
                },
              ],
            },
          ]
        : []),
    ],
  },

  reminder: {
    color: '#ffc107', // Yellow
    title: '⏰ Reminder: Action Needed',
    blocks: (data) => [
      {
        type: 'header',
        text: { type: 'plain_text', text: '⏰ Reminder: Action Needed', emoji: true },
      },
      {
        type: 'section',
        fields: [
          { type: 'mrkdwn', text: `*Document:*\n${data.document_type}:${data.document_key}` },
          { type: 'mrkdwn', text: `*Action:*\n${data.action_needed}` },
          { type: 'mrkdwn', text: `*Deadline:*\n${data.deadline}` },
          { type: 'mrkdwn', text: `*Time Remaining:*\n${data.time_remaining}` },
        ],
      },
      {
        type: 'section',
        text: { type: 'mrkdwn', text: `Pending: ${data.pending_users?.join(', ') || 'Unknown'}` },
      },
      {
        type: 'actions',
        elements: [
          {
            type: 'button',
            text: { type: 'plain_text', text: 'View Document', emoji: true },
            url: data.document_url,
            style: 'primary',
          },
        ],
      },
    ],
  },
};

class SlackNotifier {
  /**
   * Create a new SlackNotifier
   * @param {Object} config - Configuration object
   * @param {string} config.webhookUrl - Slack incoming webhook URL
   * @param {string} config.channel - Default channel (optional, webhook may have default)
   * @param {string} config.username - Bot username (optional)
   * @param {string} config.iconEmoji - Bot icon emoji (optional)
   */
  constructor(config) {
    this.webhookUrl = config.webhookUrl;
    this.channel = config.channel;
    this.username = config.username || 'PRD Crowdsource Bot';
    this.iconEmoji = config.iconEmoji || ':clipboard:';
    this.enabled = !!config.webhookUrl;
  }

  /**
   * Check if Slack notifications are enabled
   * @returns {boolean}
   */
  isEnabled() {
    return this.enabled;
  }

  /**
   * Send a notification via Slack
   * @param {string} eventType - Type of notification event
   * @param {Object} data - Event data
   * @param {Object} options - Additional options
   * @returns {Object} Notification result
   */
  async send(eventType, data, options = {}) {
    if (!this.enabled) {
      return {
        success: false,
        channel: 'slack',
        error: 'Slack notifications not enabled',
      };
    }

    const template = SLACK_TEMPLATES[eventType];
    if (!template) {
      return {
        success: false,
        channel: 'slack',
        error: `Unknown notification event type: ${eventType}`,
      };
    }

    const payload = this._buildPayload(template, data, options);

    try {
      const response = await this._sendWebhook(payload);
      return {
        success: true,
        channel: 'slack',
        eventType,
      };
    } catch (error) {
      return {
        success: false,
        channel: 'slack',
        error: error.message,
      };
    }
  }

  /**
   * Send a custom message to Slack
   * @param {string} text - Message text
   * @param {Object} options - Additional options (channel, attachments, blocks)
   * @returns {Object} Notification result
   */
  async sendCustom(text, options = {}) {
    if (!this.enabled) {
      return {
        success: false,
        channel: 'slack',
        error: 'Slack notifications not enabled',
      };
    }

    const payload = {
      text,
      channel: options.channel || this.channel,
      username: this.username,
      icon_emoji: this.iconEmoji,
      ...options,
    };

    try {
      await this._sendWebhook(payload);
      return {
        success: true,
        channel: 'slack',
      };
    } catch (error) {
      return {
        success: false,
        channel: 'slack',
        error: error.message,
      };
    }
  }

  /**
   * Build Slack payload from template
   * @private
   */
  _buildPayload(template, data, options) {
    const color = typeof template.color === 'function' ? template.color(data) : template.color;

    const title = typeof template.title === 'function' ? template.title(data) : template.title;

    const blocks = template.blocks(data);

    return {
      channel: options.channel || this.channel,
      username: this.username,
      icon_emoji: this.iconEmoji,
      text: title, // Fallback for notifications
      attachments: [
        {
          color,
          fallback: title,
          blocks,
        },
      ],
    };
  }

  /**
   * Send webhook request
   * @private
   */
  async _sendWebhook(payload) {
    // Note: In a real implementation, this would use fetch or axios
    // For the workflow engine, this will be handled by the runtime
    const response = await fetch(this.webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`Slack webhook failed: ${response.status} ${response.statusText}`);
    }

    return response;
  }
}

module.exports = {
  SlackNotifier,
  SLACK_TEMPLATES,
};
