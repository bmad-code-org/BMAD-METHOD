/**
 * Email Notifier - Optional email notification integration
 *
 * Sends email notifications for important events.
 * Supports SMTP and common email service providers.
 */

const EMAIL_TEMPLATES = {
  feedback_round_opened: {
    subject: '📣 [{{document_type}}:{{document_key}}] Feedback Requested',
    html: `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: #4CAF50; color: white; padding: 20px; border-radius: 8px 8px 0 0; }
    .content { background: #f9f9f9; padding: 20px; border: 1px solid #ddd; border-top: none; }
    .footer { padding: 15px; font-size: 12px; color: #666; text-align: center; }
    .button { display: inline-block; padding: 12px 24px; background: #4CAF50; color: white; text-decoration: none; border-radius: 4px; }
    .meta { background: #fff; padding: 15px; border-radius: 4px; margin: 15px 0; }
    .meta-item { margin: 8px 0; }
    .label { font-weight: bold; color: #555; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1 style="margin:0;">📣 Feedback Requested</h1>
    </div>
    <div class="content">
      <div class="meta">
        <div class="meta-item"><span class="label">Document:</span> {{document_type}}:{{document_key}}</div>
        <div class="meta-item"><span class="label">Version:</span> v{{version}}</div>
        <div class="meta-item"><span class="label">Deadline:</span> {{deadline}}</div>
      </div>

      <p>Please review the document and provide your feedback by <strong>{{deadline}}</strong>.</p>

      <p style="text-align:center; margin: 25px 0;">
        <a href="{{document_url}}" class="button">View Document</a>
      </p>
    </div>
    <div class="footer">
      <p>PRD Crowdsourcing System | <a href="{{unsubscribe_url}}">Unsubscribe</a></p>
    </div>
  </div>
</body>
</html>
`,
    text: `
📣 FEEDBACK REQUESTED

Document: {{document_type}}:{{document_key}}
Version: v{{version}}
Deadline: {{deadline}}

Please review the document and provide your feedback by {{deadline}}.

View Document: {{document_url}}

---
PRD Crowdsourcing System
`
  },

  signoff_requested: {
    subject: '✍️ [{{document_type}}:{{document_key}}] Sign-off Requested',
    html: `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: #FF9800; color: white; padding: 20px; border-radius: 8px 8px 0 0; }
    .content { background: #f9f9f9; padding: 20px; border: 1px solid #ddd; border-top: none; }
    .footer { padding: 15px; font-size: 12px; color: #666; text-align: center; }
    .button { display: inline-block; padding: 12px 24px; background: #FF9800; color: white; text-decoration: none; border-radius: 4px; }
    .meta { background: #fff; padding: 15px; border-radius: 4px; margin: 15px 0; }
    .meta-item { margin: 8px 0; }
    .label { font-weight: bold; color: #555; }
    .signoff-options { background: #fff; padding: 15px; border-radius: 4px; margin: 15px 0; }
    .option { margin: 10px 0; padding: 10px; border-left: 3px solid #ddd; }
    .option.approve { border-color: #4CAF50; }
    .option.block { border-color: #f44336; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1 style="margin:0;">✍️ Sign-off Requested</h1>
    </div>
    <div class="content">
      <div class="meta">
        <div class="meta-item"><span class="label">Document:</span> {{document_type}}:{{document_key}}</div>
        <div class="meta-item"><span class="label">Version:</span> v{{version}}</div>
        <div class="meta-item"><span class="label">Deadline:</span> {{deadline}}</div>
      </div>

      <p>Please review the document and provide your sign-off decision by <strong>{{deadline}}</strong>.</p>

      <div class="signoff-options">
        <h3>Sign-off Options:</h3>
        <div class="option approve">
          <strong>✅ Approve</strong> - Sign off without concerns
        </div>
        <div class="option approve">
          <strong>✅📝 Approve with Note</strong> - Sign off with a minor note
        </div>
        <div class="option block">
          <strong>🚫 Block</strong> - Cannot approve, has blocking concern
        </div>
      </div>

      <p style="text-align:center; margin: 25px 0;">
        <a href="{{document_url}}" class="button">Review & Sign Off</a>
      </p>
    </div>
    <div class="footer">
      <p>PRD Crowdsourcing System | <a href="{{unsubscribe_url}}">Unsubscribe</a></p>
    </div>
  </div>
</body>
</html>
`,
    text: `
✍️ SIGN-OFF REQUESTED

Document: {{document_type}}:{{document_key}}
Version: v{{version}}
Deadline: {{deadline}}

Please review the document and provide your sign-off decision by {{deadline}}.

Sign-off Options:
- ✅ Approve - Sign off without concerns
- ✅📝 Approve with Note - Sign off with a minor note
- 🚫 Block - Cannot approve, has blocking concern

Review & Sign Off: {{document_url}}

---
PRD Crowdsourcing System
`
  },

  document_approved: {
    subject: '✅ [{{document_type}}:{{document_key}}] Document Approved!',
    html: `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: #4CAF50; color: white; padding: 20px; border-radius: 8px 8px 0 0; }
    .content { background: #f9f9f9; padding: 20px; border: 1px solid #ddd; border-top: none; }
    .footer { padding: 15px; font-size: 12px; color: #666; text-align: center; }
    .button { display: inline-block; padding: 12px 24px; background: #4CAF50; color: white; text-decoration: none; border-radius: 4px; }
    .meta { background: #fff; padding: 15px; border-radius: 4px; margin: 15px 0; }
    .meta-item { margin: 8px 0; }
    .label { font-weight: bold; color: #555; }
    .celebration { text-align: center; font-size: 48px; margin: 20px 0; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1 style="margin:0;">✅ Document Approved!</h1>
    </div>
    <div class="content">
      <div class="celebration">🎉</div>

      <div class="meta">
        <div class="meta-item"><span class="label">Document:</span> {{document_type}}:{{document_key}}</div>
        <div class="meta-item"><span class="label">Title:</span> {{title}}</div>
        <div class="meta-item"><span class="label">Final Version:</span> v{{version}}</div>
        <div class="meta-item"><span class="label">Approvals:</span> {{approval_count}}/{{stakeholder_count}}</div>
      </div>

      <p>All required sign-offs have been received. This document is now <strong>approved</strong> and ready for implementation!</p>

      <p style="text-align:center; margin: 25px 0;">
        <a href="{{document_url}}" class="button">View Approved Document</a>
      </p>
    </div>
    <div class="footer">
      <p>PRD Crowdsourcing System | <a href="{{unsubscribe_url}}">Unsubscribe</a></p>
    </div>
  </div>
</body>
</html>
`,
    text: `
✅ DOCUMENT APPROVED! 🎉

Document: {{document_type}}:{{document_key}}
Title: {{title}}
Final Version: v{{version}}
Approvals: {{approval_count}}/{{stakeholder_count}}

All required sign-offs have been received. This document is now approved and ready for implementation!

View Approved Document: {{document_url}}

---
PRD Crowdsourcing System
`
  },

  document_blocked: {
    subject: '🚫 [{{document_type}}:{{document_key}}] Document Blocked',
    html: `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: #f44336; color: white; padding: 20px; border-radius: 8px 8px 0 0; }
    .content { background: #f9f9f9; padding: 20px; border: 1px solid #ddd; border-top: none; }
    .footer { padding: 15px; font-size: 12px; color: #666; text-align: center; }
    .button { display: inline-block; padding: 12px 24px; background: #f44336; color: white; text-decoration: none; border-radius: 4px; }
    .meta { background: #fff; padding: 15px; border-radius: 4px; margin: 15px 0; }
    .meta-item { margin: 8px 0; }
    .label { font-weight: bold; color: #555; }
    .reason { background: #ffebee; padding: 15px; border-radius: 4px; border-left: 4px solid #f44336; margin: 15px 0; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1 style="margin:0;">🚫 Document Blocked</h1>
    </div>
    <div class="content">
      <div class="meta">
        <div class="meta-item"><span class="label">Document:</span> {{document_type}}:{{document_key}}</div>
        <div class="meta-item"><span class="label">Blocked by:</span> {{user}}</div>
      </div>

      <div class="reason">
        <strong>Blocking Reason:</strong>
        <p>{{reason}}</p>
      </div>

      <p>⚠️ This blocking concern must be resolved before the document can be approved.</p>

      <p style="text-align:center; margin: 25px 0;">
        <a href="{{feedback_url}}" class="button">View Blocking Issue</a>
      </p>
    </div>
    <div class="footer">
      <p>PRD Crowdsourcing System | <a href="{{unsubscribe_url}}">Unsubscribe</a></p>
    </div>
  </div>
</body>
</html>
`,
    text: `
🚫 DOCUMENT BLOCKED

Document: {{document_type}}:{{document_key}}
Blocked by: {{user}}

Blocking Reason:
{{reason}}

⚠️ This blocking concern must be resolved before the document can be approved.

View Blocking Issue: {{feedback_url}}

---
PRD Crowdsourcing System
`
  },

  reminder: {
    subject: '⏰ [{{document_type}}:{{document_key}}] Reminder: {{action_needed}}',
    html: `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: #FFC107; color: #333; padding: 20px; border-radius: 8px 8px 0 0; }
    .content { background: #f9f9f9; padding: 20px; border: 1px solid #ddd; border-top: none; }
    .footer { padding: 15px; font-size: 12px; color: #666; text-align: center; }
    .button { display: inline-block; padding: 12px 24px; background: #FFC107; color: #333; text-decoration: none; border-radius: 4px; }
    .meta { background: #fff; padding: 15px; border-radius: 4px; margin: 15px 0; }
    .meta-item { margin: 8px 0; }
    .label { font-weight: bold; color: #555; }
    .urgency { background: #fff3cd; padding: 10px 15px; border-radius: 4px; border-left: 4px solid #FFC107; margin: 15px 0; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1 style="margin:0;">⏰ Reminder: Action Needed</h1>
    </div>
    <div class="content">
      <div class="urgency">
        <strong>{{time_remaining}}</strong> remaining until deadline
      </div>

      <div class="meta">
        <div class="meta-item"><span class="label">Document:</span> {{document_type}}:{{document_key}}</div>
        <div class="meta-item"><span class="label">Action:</span> {{action_needed}}</div>
        <div class="meta-item"><span class="label">Deadline:</span> {{deadline}}</div>
      </div>

      <p>Please complete your {{action_needed}} by <strong>{{deadline}}</strong>.</p>

      <p style="text-align:center; margin: 25px 0;">
        <a href="{{document_url}}" class="button">Take Action</a>
      </p>
    </div>
    <div class="footer">
      <p>PRD Crowdsourcing System | <a href="{{unsubscribe_url}}">Unsubscribe</a></p>
    </div>
  </div>
</body>
</html>
`,
    text: `
⏰ REMINDER: ACTION NEEDED

{{time_remaining}} remaining until deadline

Document: {{document_type}}:{{document_key}}
Action: {{action_needed}}
Deadline: {{deadline}}

Please complete your {{action_needed}} by {{deadline}}.

Take Action: {{document_url}}

---
PRD Crowdsourcing System
`
  }
};

class EmailNotifier {
  /**
   * Create a new EmailNotifier
   * @param {Object} config - Configuration object
   * @param {string} config.provider - Email provider ('smtp', 'sendgrid', 'ses', etc.)
   * @param {Object} config.smtp - SMTP configuration (if provider is 'smtp')
   * @param {string} config.apiKey - API key (for sendgrid, ses, etc.)
   * @param {string} config.fromAddress - Sender email address
   * @param {string} config.fromName - Sender name
   */
  constructor(config) {
    this.provider = config.provider || 'smtp';
    this.smtp = config.smtp;
    this.apiKey = config.apiKey;
    this.fromAddress = config.fromAddress || 'noreply@example.com';
    this.fromName = config.fromName || 'PRD Crowdsourcing';
    this.enabled = !!(config.smtp || config.apiKey);

    // User email lookup (should be configured externally)
    this.userEmails = config.userEmails || {};
  }

  /**
   * Check if email notifications are enabled
   * @returns {boolean}
   */
  isEnabled() {
    return this.enabled;
  }

  /**
   * Send a notification via email
   * @param {string} eventType - Type of notification event
   * @param {Object} data - Event data
   * @param {Object} options - Additional options
   * @returns {Object} Notification result
   */
  async send(eventType, data, options = {}) {
    if (!this.enabled) {
      return {
        success: false,
        channel: 'email',
        error: 'Email notifications not enabled'
      };
    }

    const template = EMAIL_TEMPLATES[eventType];
    if (!template) {
      return {
        success: false,
        channel: 'email',
        error: `Unknown notification event type: ${eventType}`
      };
    }

    // Get recipient emails
    const recipients = options.recipients || [];
    if (data.users) {
      recipients.push(...data.users.map(u => this.userEmails[u]).filter(Boolean));
    }

    if (recipients.length === 0) {
      return {
        success: false,
        channel: 'email',
        error: 'No recipients specified'
      };
    }

    const subject = this._renderTemplate(template.subject, data);
    const html = this._renderTemplate(template.html, data);
    const text = this._renderTemplate(template.text, data);

    try {
      await this._sendEmail({
        to: recipients,
        subject,
        html,
        text
      });

      return {
        success: true,
        channel: 'email',
        recipientCount: recipients.length
      };
    } catch (error) {
      return {
        success: false,
        channel: 'email',
        error: error.message
      };
    }
  }

  /**
   * Send a custom email
   * @param {string[]} recipients - Email addresses
   * @param {string} subject - Email subject
   * @param {string} body - Email body (HTML or text)
   * @param {Object} options - Additional options
   * @returns {Object} Notification result
   */
  async sendCustom(recipients, subject, body, options = {}) {
    if (!this.enabled) {
      return {
        success: false,
        channel: 'email',
        error: 'Email notifications not enabled'
      };
    }

    try {
      await this._sendEmail({
        to: recipients,
        subject,
        html: options.html ? body : undefined,
        text: options.html ? undefined : body
      });

      return {
        success: true,
        channel: 'email',
        recipientCount: recipients.length
      };
    } catch (error) {
      return {
        success: false,
        channel: 'email',
        error: error.message
      };
    }
  }

  /**
   * Get email address for a username
   * @param {string} username - GitHub username
   * @returns {string|null} Email address or null if not found
   */
  getEmailForUser(username) {
    return this.userEmails[username] || null;
  }

  /**
   * Set email address for a username
   * @param {string} username - GitHub username
   * @param {string} email - Email address
   */
  setEmailForUser(username, email) {
    this.userEmails[username] = email;
  }

  /**
   * Send email via configured provider
   * @private
   */
  async _sendEmail({ to, subject, html, text }) {
    // Note: In a real implementation, this would use nodemailer, sendgrid, ses, etc.
    // For the workflow engine, this will be handled by the runtime

    const emailPayload = {
      from: {
        name: this.fromName,
        address: this.fromAddress
      },
      to: Array.isArray(to) ? to : [to],
      subject,
      html,
      text
    };

    switch (this.provider) {
      case 'smtp':
        return await this._sendViaSMTP(emailPayload);
      case 'sendgrid':
        return await this._sendViaSendGrid(emailPayload);
      case 'ses':
        return await this._sendViaSES(emailPayload);
      default:
        throw new Error(`Unknown email provider: ${this.provider}`);
    }
  }

  /**
   * Send via SMTP
   * @private
   */
  async _sendViaSMTP(payload) {
    // Placeholder - would use nodemailer in real implementation
    console.log('[EMAIL] Would send via SMTP:', payload.subject, 'to', payload.to.join(', '));
    return { messageId: `smtp-${Date.now()}` };
  }

  /**
   * Send via SendGrid
   * @private
   */
  async _sendViaSendGrid(payload) {
    // Placeholder - would use @sendgrid/mail in real implementation
    console.log('[EMAIL] Would send via SendGrid:', payload.subject, 'to', payload.to.join(', '));
    return { messageId: `sg-${Date.now()}` };
  }

  /**
   * Send via AWS SES
   * @private
   */
  async _sendViaSES(payload) {
    // Placeholder - would use @aws-sdk/client-ses in real implementation
    console.log('[EMAIL] Would send via SES:', payload.subject, 'to', payload.to.join(', '));
    return { messageId: `ses-${Date.now()}` };
  }

  /**
   * Render a template with data
   * @private
   */
  _renderTemplate(template, data) {
    let result = template;

    // Simple mustache-like replacement
    result = result.replace(/\{\{(\w+)\}\}/g, (match, key) => {
      return data[key] !== undefined ? String(data[key]) : match;
    });

    return result;
  }
}

module.exports = {
  EmailNotifier,
  EMAIL_TEMPLATES
};
