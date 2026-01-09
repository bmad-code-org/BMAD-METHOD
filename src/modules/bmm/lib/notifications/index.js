/**
 * Notifications Module
 *
 * Multi-channel notification system for PRD/Epic crowdsourcing.
 * Supports GitHub @mentions (baseline), Slack webhooks, and Email.
 *
 * Usage:
 * ```javascript
 * const { NotificationService } = require('./notifications');
 *
 * const notifier = new NotificationService({
 *   github: {
 *     owner: 'myorg',
 *     repo: 'myrepo',
 *     github: githubMcpClient
 *   },
 *   slack: {
 *     enabled: true,
 *     webhookUrl: 'https://hooks.slack.com/...',
 *     channel: '#prd-updates'
 *   },
 *   email: {
 *     enabled: true,
 *     provider: 'smtp',
 *     smtp: { host: 'smtp.example.com', port: 587, ... },
 *     fromAddress: 'prd-bot@example.com'
 *   }
 * });
 *
 * // Send notification
 * await notifier.notifyFeedbackRoundOpened(document, stakeholders, deadline);
 * ```
 */

const { NotificationService, NOTIFICATION_EVENTS, PRIORITY_BEHAVIOR } = require('./notification-service');
const { GitHubNotifier, NOTIFICATION_TEMPLATES: GITHUB_TEMPLATES } = require('./github-notifier');
const { SlackNotifier, SLACK_TEMPLATES } = require('./slack-notifier');
const { EmailNotifier, EMAIL_TEMPLATES } = require('./email-notifier');

module.exports = {
  // Main service
  NotificationService,

  // Individual notifiers (for custom usage)
  GitHubNotifier,
  SlackNotifier,
  EmailNotifier,

  // Constants
  NOTIFICATION_EVENTS,
  PRIORITY_BEHAVIOR,

  // Templates (for customization)
  GITHUB_TEMPLATES,
  SLACK_TEMPLATES,
  EMAIL_TEMPLATES,
};
