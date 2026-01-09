/**
 * Tests for EmailNotifier - Email notification integration
 *
 * Tests cover:
 * - Email templates with HTML and text formats
 * - Template rendering
 * - Enable/disable behavior based on config
 * - Recipient lookup from userEmails mapping
 * - Multiple email providers (SMTP, SendGrid, SES)
 * - Error handling
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { EmailNotifier, EMAIL_TEMPLATES } from '../../../src/modules/bmm/lib/notifications/email-notifier.js';

describe('EmailNotifier', () => {
  // ============ EMAIL_TEMPLATES Tests ============

  describe('EMAIL_TEMPLATES', () => {
    it('should define all required event types', () => {
      const expectedTypes = ['feedback_round_opened', 'signoff_requested', 'document_approved', 'document_blocked', 'reminder'];

      for (const type of expectedTypes) {
        expect(EMAIL_TEMPLATES[type]).toBeDefined();
        expect(EMAIL_TEMPLATES[type].subject).toBeTruthy();
        expect(EMAIL_TEMPLATES[type].html).toBeTruthy();
        expect(EMAIL_TEMPLATES[type].text).toBeTruthy();
      }
    });

    it('should have placeholders in subject lines', () => {
      expect(EMAIL_TEMPLATES.feedback_round_opened.subject).toContain('{{document_type}}');
      expect(EMAIL_TEMPLATES.feedback_round_opened.subject).toContain('{{document_key}}');
    });

    it('should have matching placeholders in HTML and text', () => {
      const template = EMAIL_TEMPLATES.document_approved;

      // Both should contain key placeholders
      expect(template.html).toContain('{{document_type}}');
      expect(template.html).toContain('{{document_key}}');
      expect(template.html).toContain('{{title}}');
      expect(template.html).toContain('{{version}}');

      expect(template.text).toContain('{{document_type}}');
      expect(template.text).toContain('{{document_key}}');
      expect(template.text).toContain('{{title}}');
      expect(template.text).toContain('{{version}}');
    });

    it('should have valid HTML structure', () => {
      const template = EMAIL_TEMPLATES.signoff_requested;

      expect(template.html).toContain('<!DOCTYPE html>');
      expect(template.html).toContain('<html>');
      expect(template.html).toContain('</html>');
      expect(template.html).toContain('<body>');
      expect(template.html).toContain('</body>');
    });

    it('should have styled content in HTML templates', () => {
      const template = EMAIL_TEMPLATES.feedback_round_opened;

      expect(template.html).toContain('<style>');
      expect(template.html).toContain('class="button"');
      expect(template.html).toContain('class="container"');
    });

    it('should have plain text format in text templates', () => {
      const template = EMAIL_TEMPLATES.reminder;

      // Text template should not contain HTML tags
      expect(template.text).not.toContain('<div');
      expect(template.text).not.toContain('<style');
      expect(template.text).toContain('REMINDER');
    });
  });

  // ============ Constructor Tests ============

  describe('constructor', () => {
    it('should initialize with SMTP config', () => {
      const notifier = new EmailNotifier({
        provider: 'smtp',
        smtp: {
          host: 'smtp.example.com',
          port: 587,
        },
        fromAddress: 'noreply@example.com',
        fromName: 'PRD System',
      });

      expect(notifier.provider).toBe('smtp');
      expect(notifier.smtp).toEqual({ host: 'smtp.example.com', port: 587 });
      expect(notifier.fromAddress).toBe('noreply@example.com');
      expect(notifier.fromName).toBe('PRD System');
      expect(notifier.enabled).toBe(true);
    });

    it('should initialize with API key config', () => {
      const notifier = new EmailNotifier({
        provider: 'sendgrid',
        apiKey: 'SG.xxx',
        fromAddress: 'noreply@example.com',
      });

      expect(notifier.provider).toBe('sendgrid');
      expect(notifier.apiKey).toBe('SG.xxx');
      expect(notifier.enabled).toBe(true);
    });

    it('should use default values', () => {
      const notifier = new EmailNotifier({
        smtp: { host: 'localhost' },
      });

      expect(notifier.provider).toBe('smtp');
      expect(notifier.fromAddress).toBe('noreply@example.com');
      expect(notifier.fromName).toBe('PRD Crowdsourcing');
    });

    it('should be disabled without SMTP or API key', () => {
      const notifier = new EmailNotifier({});

      expect(notifier.enabled).toBe(false);
    });

    it('should accept userEmails mapping', () => {
      const notifier = new EmailNotifier({
        smtp: { host: 'localhost' },
        userEmails: {
          alice: 'alice@example.com',
          bob: 'bob@example.com',
        },
      });

      expect(notifier.userEmails['alice']).toBe('alice@example.com');
      expect(notifier.userEmails['bob']).toBe('bob@example.com');
    });
  });

  // ============ isEnabled Tests ============

  describe('isEnabled', () => {
    it('should return true when SMTP configured', () => {
      const notifier = new EmailNotifier({
        smtp: { host: 'localhost' },
      });

      expect(notifier.isEnabled()).toBe(true);
    });

    it('should return true when API key configured', () => {
      const notifier = new EmailNotifier({
        apiKey: 'xxx',
      });

      expect(notifier.isEnabled()).toBe(true);
    });

    it('should return false when not configured', () => {
      const notifier = new EmailNotifier({});

      expect(notifier.isEnabled()).toBe(false);
    });
  });

  // ============ send Tests ============

  describe('send', () => {
    let notifier;
    let consoleSpy;

    beforeEach(() => {
      notifier = new EmailNotifier({
        provider: 'smtp',
        smtp: { host: 'localhost', port: 587 },
        fromAddress: 'noreply@example.com',
        userEmails: {
          alice: 'alice@example.com',
          bob: 'bob@example.com',
        },
      });

      consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    });

    it('should return error when not enabled', async () => {
      const disabledNotifier = new EmailNotifier({});

      const result = await disabledNotifier.send('feedback_round_opened', {});

      expect(result.success).toBe(false);
      expect(result.error).toContain('not enabled');
    });

    it('should return error for unknown event type', async () => {
      const result = await notifier.send(
        'unknown_event',
        {},
        {
          recipients: ['test@example.com'],
        },
      );

      expect(result.success).toBe(false);
      expect(result.error).toContain('Unknown notification event type');
    });

    it('should return error when no recipients', async () => {
      const result = await notifier.send('feedback_round_opened', {
        document_type: 'prd',
        document_key: 'test',
      });

      expect(result.success).toBe(false);
      expect(result.error).toContain('No recipients');
    });

    it('should send email with direct recipients', async () => {
      const result = await notifier.send(
        'feedback_round_opened',
        {
          document_type: 'prd',
          document_key: 'user-auth',
          version: 1,
          deadline: '2026-01-15',
          document_url: 'https://example.com/doc',
        },
        {
          recipients: ['direct@example.com'],
        },
      );

      expect(result.success).toBe(true);
      expect(result.channel).toBe('email');
      expect(result.recipientCount).toBe(1);

      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('[EMAIL]'),
        expect.stringContaining('Feedback Requested'),
        expect.any(String),
        expect.stringContaining('direct@example.com'),
      );
    });

    it('should lookup user emails from data.users', async () => {
      const result = await notifier.send('signoff_requested', {
        document_type: 'prd',
        document_key: 'test',
        version: 1,
        deadline: '2026-01-15',
        document_url: 'https://example.com/doc',
        users: ['alice', 'bob'],
      });

      expect(result.success).toBe(true);
      expect(result.recipientCount).toBe(2);

      expect(consoleSpy).toHaveBeenCalledWith(
        expect.anything(),
        expect.anything(),
        expect.anything(),
        expect.stringContaining('alice@example.com'),
      );
    });

    it('should filter out unknown users', async () => {
      const result = await notifier.send('document_approved', {
        document_type: 'prd',
        document_key: 'test',
        title: 'Test PRD',
        version: 2,
        approval_count: 3,
        stakeholder_count: 3,
        document_url: 'https://example.com/doc',
        users: ['alice', 'unknown-user'], // unknown-user not in mapping
      });

      expect(result.success).toBe(true);
      expect(result.recipientCount).toBe(1); // Only alice
    });

    it('should render template with data', async () => {
      await notifier.send(
        'document_blocked',
        {
          document_type: 'prd',
          document_key: 'payments',
          user: 'legal',
          reason: 'Compliance review needed',
          feedback_url: 'https://example.com/feedback/1',
        },
        {
          recipients: ['test@example.com'],
        },
      );

      expect(consoleSpy).toHaveBeenCalledWith(
        expect.anything(),
        expect.stringContaining('[prd:payments]'),
        expect.anything(),
        expect.anything(),
      );
    });
  });

  // ============ sendCustom Tests ============

  describe('sendCustom', () => {
    let notifier;
    let consoleSpy;

    beforeEach(() => {
      notifier = new EmailNotifier({
        provider: 'smtp',
        smtp: { host: 'localhost' },
      });

      consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    });

    it('should return error when not enabled', async () => {
      const disabledNotifier = new EmailNotifier({});

      const result = await disabledNotifier.sendCustom(['test@example.com'], 'Subject', 'Body');

      expect(result.success).toBe(false);
      expect(result.error).toContain('not enabled');
    });

    it('should send custom email', async () => {
      const result = await notifier.sendCustom(['user1@example.com', 'user2@example.com'], 'Custom Subject', 'Custom body content');

      expect(result.success).toBe(true);
      expect(result.recipientCount).toBe(2);

      expect(consoleSpy).toHaveBeenCalledWith(
        expect.anything(),
        expect.stringContaining('Custom Subject'),
        expect.anything(),
        expect.stringContaining('user1@example.com, user2@example.com'),
      );
    });

    it('should handle HTML option', async () => {
      const result = await notifier.sendCustom(['test@example.com'], 'HTML Email', '<h1>Hello</h1>', { html: true });

      expect(result.success).toBe(true);
    });
  });

  // ============ getEmailForUser / setEmailForUser Tests ============

  describe('user email management', () => {
    let notifier;

    beforeEach(() => {
      notifier = new EmailNotifier({
        smtp: { host: 'localhost' },
        userEmails: {
          existing: 'existing@example.com',
        },
      });
    });

    it('should get email for known user', () => {
      expect(notifier.getEmailForUser('existing')).toBe('existing@example.com');
    });

    it('should return null for unknown user', () => {
      expect(notifier.getEmailForUser('unknown')).toBeNull();
    });

    it('should set email for user', () => {
      notifier.setEmailForUser('new-user', 'new@example.com');

      expect(notifier.getEmailForUser('new-user')).toBe('new@example.com');
    });

    it('should update existing user email', () => {
      notifier.setEmailForUser('existing', 'updated@example.com');

      expect(notifier.getEmailForUser('existing')).toBe('updated@example.com');
    });
  });

  // ============ _renderTemplate Tests ============

  describe('_renderTemplate', () => {
    let notifier;

    beforeEach(() => {
      notifier = new EmailNotifier({ smtp: { host: 'localhost' } });
    });

    it('should replace simple variables', () => {
      const template = 'Hello {{name}}, your order is {{status}}';
      const result = notifier._renderTemplate(template, {
        name: 'Alice',
        status: 'complete',
      });

      expect(result).toBe('Hello Alice, your order is complete');
    });

    it('should keep placeholder when variable not found', () => {
      const template = 'Document: {{document_key}}, Version: {{version}}';
      const result = notifier._renderTemplate(template, {
        document_key: 'test',
      });

      expect(result).toBe('Document: test, Version: {{version}}');
    });

    it('should handle HTML content', () => {
      const template = '<div class="title">{{title}}</div><p>{{content}}</p>';
      const result = notifier._renderTemplate(template, {
        title: 'Welcome',
        content: 'This is the body',
      });

      expect(result).toBe('<div class="title">Welcome</div><p>This is the body</p>');
    });
  });

  // ============ Provider Tests ============

  describe('email providers', () => {
    let consoleSpy;

    beforeEach(() => {
      consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    });

    it('should use SMTP provider', async () => {
      const notifier = new EmailNotifier({
        provider: 'smtp',
        smtp: { host: 'smtp.example.com' },
      });

      await notifier.sendCustom(['test@example.com'], 'Test', 'Body');

      expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('SMTP'), expect.anything(), expect.anything(), expect.anything());
    });

    it('should use SendGrid provider', async () => {
      const notifier = new EmailNotifier({
        provider: 'sendgrid',
        apiKey: 'SG.xxx',
      });

      await notifier.sendCustom(['test@example.com'], 'Test', 'Body');

      expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('SendGrid'), expect.anything(), expect.anything(), expect.anything());
    });

    it('should use SES provider', async () => {
      const notifier = new EmailNotifier({
        provider: 'ses',
        apiKey: 'aws-key',
      });

      await notifier.sendCustom(['test@example.com'], 'Test', 'Body');

      expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('SES'), expect.anything(), expect.anything(), expect.anything());
    });

    it('should throw for unknown provider', async () => {
      const notifier = new EmailNotifier({
        provider: 'unknown-provider',
        apiKey: 'xxx',
      });

      const result = await notifier.sendCustom(['test@example.com'], 'Test', 'Body');

      expect(result.success).toBe(false);
      expect(result.error).toContain('Unknown email provider');
    });
  });

  // ============ Integration Tests ============

  describe('integration', () => {
    let notifier;
    let consoleSpy;

    beforeEach(() => {
      notifier = new EmailNotifier({
        provider: 'smtp',
        smtp: { host: 'localhost' },
        fromAddress: 'prd-bot@company.com',
        fromName: 'PRD System',
        userEmails: {
          po: 'po@company.com',
          'tech-lead': 'tech@company.com',
          security: 'security@company.com',
        },
      });

      consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    });

    it('should send feedback_round_opened to stakeholders', async () => {
      const result = await notifier.send('feedback_round_opened', {
        document_type: 'prd',
        document_key: 'user-auth',
        version: 1,
        deadline: '2026-01-15',
        document_url: 'https://example.com/doc',
        unsubscribe_url: 'https://example.com/unsubscribe',
        users: ['po', 'tech-lead', 'security'],
      });

      expect(result.success).toBe(true);
      expect(result.recipientCount).toBe(3);
    });

    it('should send document_blocked with blocking details', async () => {
      const result = await notifier.send(
        'document_blocked',
        {
          document_type: 'prd',
          document_key: 'payments-v2',
          user: 'security',
          reason: 'PCI DSS compliance verification required before approval',
          feedback_url: 'https://example.com/issues/42',
          unsubscribe_url: 'https://example.com/unsubscribe',
        },
        {
          recipients: ['po@company.com'],
        },
      );

      expect(result.success).toBe(true);

      // Verify the subject was rendered
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.anything(),
        expect.stringContaining('[prd:payments-v2]'),
        expect.anything(),
        expect.anything(),
      );
    });

    it('should send reminder with urgency', async () => {
      const result = await notifier.send('reminder', {
        document_type: 'prd',
        document_key: 'mobile-app',
        action_needed: 'sign-off',
        deadline: '2026-01-10',
        time_remaining: '24 hours',
        document_url: 'https://example.com/doc',
        unsubscribe_url: 'https://example.com/unsubscribe',
        users: ['tech-lead'],
      });

      expect(result.success).toBe(true);
    });
  });
});
