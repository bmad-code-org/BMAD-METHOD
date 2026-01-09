/**
 * GitHub Notifier - Baseline notification via GitHub @mentions
 *
 * This is the primary notification channel that's always available.
 * Uses GitHub Issues and comments to notify stakeholders via @mentions.
 */

const NOTIFICATION_TEMPLATES = {
  feedback_round_opened: {
    subject: '📣 Feedback Requested',
    template: `## 📣 Feedback Round Open

{{mentions}}

**Document:** {{document_type}}:{{document_key}}
**Version:** v{{version}}
**Deadline:** {{deadline}}

Please review and provide your feedback by {{deadline}}.

---

[View Document]({{document_url}})
{{#if actions}}
**Quick Actions:**
{{actions}}
{{/if}}

_Notification from PRD Crowdsourcing System_`,
  },

  feedback_submitted: {
    subject: '💬 New Feedback',
    template: `## 💬 New Feedback Submitted

**From:** @{{user}}
**Document:** {{document_type}}:{{document_key}}
**Type:** {{feedback_type}}
**Section:** {{section}}

---

{{summary}}

---

[View Feedback #{{feedback_issue}}]({{feedback_url}})

_Notification from PRD Crowdsourcing System_`,
  },

  synthesis_complete: {
    subject: '🔄 Synthesis Complete',
    template: `## 🔄 Synthesis Complete

**Document:** {{document_type}}:{{document_key}}
**Version:** v{{old_version}} → v{{new_version}}
**Feedback Processed:** {{feedback_count}} items

---

### Summary of Changes

{{summary}}

---

[View Updated Document]({{document_url}})

_Notification from PRD Crowdsourcing System_`,
  },

  signoff_requested: {
    subject: '✍️ Sign-off Requested',
    template: `## ✍️ Sign-off Requested

{{mentions}}

**Document:** {{document_type}}:{{document_key}}
**Version:** v{{version}}
**Deadline:** {{deadline}}

Please review and provide your sign-off decision by {{deadline}}.

### How to Sign Off

- ✅ **Approve**: Comment with \`/signoff approve\`
- ✅📝 **Approve with Note**: Comment with \`/signoff approve-note: [your note]\`
- 🚫 **Block**: Comment with \`/signoff block: [reason]\`

---

[View Document]({{document_url}})

_Notification from PRD Crowdsourcing System_`,
  },

  signoff_received: {
    subject: '{{emoji}} Sign-off Received',
    template: `## {{emoji}} Sign-off from @{{user}}

**Decision:** {{decision}}
**Document:** {{document_type}}:{{document_key}}
**Progress:** {{progress_current}}/{{progress_total}} approvals

{{#if note}}
**Note:**
{{note}}
{{/if}}

---

[View Review Issue #{{review_issue}}]({{review_url}})

_Notification from PRD Crowdsourcing System_`,
  },

  document_approved: {
    subject: '✅ Document Approved',
    template: `## ✅ Document Approved!

**Document:** {{document_type}}:{{document_key}}
**Title:** {{title}}
**Final Version:** v{{version}}
**Approvals:** {{approval_count}}/{{stakeholder_count}}

All required sign-offs have been received. This document is now approved and ready for implementation.

---

[View Approved Document]({{document_url}})

_Notification from PRD Crowdsourcing System_`,
  },

  document_blocked: {
    subject: '🚫 Document Blocked',
    template: `## 🚫 Document Blocked

**Document:** {{document_type}}:{{document_key}}
**Blocked by:** @{{user}}

### Blocking Reason

{{reason}}

---

This blocking concern must be resolved before the document can be approved.

{{#if feedback_issue}}
[View Blocking Issue #{{feedback_issue}}]({{feedback_url}})
{{/if}}

_Notification from PRD Crowdsourcing System_`,
  },

  reminder: {
    subject: '⏰ Reminder',
    template: `## ⏰ Reminder: Action Needed

{{mentions}}

**Document:** {{document_type}}:{{document_key}}
**Action:** {{action_needed}}
**Deadline:** {{deadline}} ({{time_remaining}})

Please complete your {{action_needed}} by {{deadline}}.

---

[View Document]({{document_url}})

_Notification from PRD Crowdsourcing System_`,
  },

  deadline_extended: {
    subject: '📅 Deadline Extended',
    template: `## 📅 Deadline Extended

**Document:** {{document_type}}:{{document_key}}
**Previous Deadline:** {{old_deadline}}
**New Deadline:** {{new_deadline}}

{{#if reason}}
**Reason:** {{reason}}
{{/if}}

---

[View Document]({{document_url}})

_Notification from PRD Crowdsourcing System_`,
  },
};

class GitHubNotifier {
  /**
   * Create a new GitHubNotifier
   * @param {Object} config - Configuration object
   * @param {string} config.owner - Repository owner
   * @param {string} config.repo - Repository name
   * @param {Object} config.github - GitHub MCP client
   */
  constructor(config) {
    this.owner = config.owner;
    this.repo = config.repo;
    this.github = config.github;
  }

  /**
   * Send a notification via GitHub
   * @param {string} eventType - Type of notification event
   * @param {Object} data - Event data
   * @param {Object} options - Additional options
   * @returns {Object} Notification result
   */
  async send(eventType, data, options = {}) {
    const template = NOTIFICATION_TEMPLATES[eventType];
    if (!template) {
      throw new Error(`Unknown notification event type: ${eventType}`);
    }

    const message = this._renderTemplate(template.template, data);

    // Determine where to post the notification
    if (options.issueNumber) {
      // Post as comment on existing issue
      return await this._postComment(options.issueNumber, message);
    } else if (options.createIssue) {
      // Create a new issue
      return await this._createIssue(this._renderTemplate(template.subject, data), message, options.labels || []);
    } else if (data.review_issue) {
      // Default to review issue if available
      return await this._postComment(data.review_issue, message);
    }

    // If no target specified, return the message for manual handling
    return {
      success: true,
      channel: 'github',
      message,
      note: 'No target issue specified, message returned for manual handling',
    };
  }

  /**
   * Send a reminder to pending users
   * @param {number} issueNumber - Issue to post reminder on
   * @param {string[]} users - Users to remind
   * @param {Object} data - Reminder data
   * @returns {Object} Notification result
   */
  async sendReminder(issueNumber, users, data) {
    const reminderData = {
      ...data,
      mentions: users.map((u) => `@${u}`).join(' '),
    };

    return await this.send('reminder', reminderData, { issueNumber });
  }

  /**
   * Notify stakeholders via @mentions in issue body or comment
   * @param {string[]} users - Users to notify
   * @param {string} message - Notification message
   * @param {number} issueNumber - Issue to post on
   * @returns {Object} Notification result
   */
  async notifyStakeholders(users, message, issueNumber) {
    const mentions = users.map((u) => `@${u}`).join(' ');
    const fullMessage = `${mentions}\n\n${message}`;

    return await this._postComment(issueNumber, fullMessage);
  }

  /**
   * Post a comment on an issue
   * @private
   */
  async _postComment(issueNumber, body) {
    try {
      const result = await this.github.addIssueComment({
        owner: this.owner,
        repo: this.repo,
        issue_number: issueNumber,
        body,
      });

      return {
        success: true,
        channel: 'github',
        type: 'comment',
        issueNumber,
        commentId: result.id,
      };
    } catch (error) {
      return {
        success: false,
        channel: 'github',
        error: error.message,
      };
    }
  }

  /**
   * Create a new issue
   * @private
   */
  async _createIssue(title, body, labels) {
    try {
      const result = await this.github.createIssue({
        owner: this.owner,
        repo: this.repo,
        title,
        body,
        labels,
      });

      return {
        success: true,
        channel: 'github',
        type: 'issue',
        issueNumber: result.number,
      };
    } catch (error) {
      return {
        success: false,
        channel: 'github',
        error: error.message,
      };
    }
  }

  /**
   * Render a template with data
   * @private
   */
  _renderTemplate(template, data) {
    let result = template;

    // Simple mustache-like replacement
    // Replace {{variable}}
    result = result.replace(/\{\{(\w+)\}\}/g, (match, key) => {
      return data[key] !== undefined ? String(data[key]) : match;
    });

    // Handle {{#if condition}}...{{/if}}
    result = result.replace(/\{\{#if\s+(\w+)\}\}([\s\S]*?)\{\{\/if\}\}/g, (match, key, content) => {
      return data[key] ? content : '';
    });

    // Handle {{#each array}}...{{/each}}
    result = result.replace(/\{\{#each\s+(\w+)\}\}([\s\S]*?)\{\{\/each\}\}/g, (match, key, content) => {
      const arr = data[key];
      if (!Array.isArray(arr)) return '';
      return arr
        .map((item, index) => {
          let itemContent = content;
          if (typeof item === 'object') {
            Object.entries(item).forEach(([k, v]) => {
              itemContent = itemContent.replace(new RegExp(`\\{\\{${k}\\}\\}`, 'g'), String(v));
            });
          } else {
            itemContent = itemContent.replace(/\{\{this\}\}/g, String(item));
          }
          itemContent = itemContent.replace(/\{\{@index\}\}/g, String(index));
          return itemContent;
        })
        .join('');
    });

    return result;
  }
}

module.exports = {
  GitHubNotifier,
  NOTIFICATION_TEMPLATES,
};
