/**
 * Tests for SlackNotifier - Slack webhook integration
 *
 * Tests cover:
 * - Slack block templates for all event types
 * - Dynamic color and title functions
 * - Payload building with blocks and attachments
 * - Enable/disable behavior
 * - Custom message sending
 * - Webhook error handling
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  SlackNotifier,
  SLACK_TEMPLATES
} from '../../../src/modules/bmm/lib/notifications/slack-notifier.js';

// Mock global fetch
global.fetch = vi.fn();

describe('SlackNotifier', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    global.fetch.mockResolvedValue({ ok: true });
  });

  // ============ SLACK_TEMPLATES Tests ============

  describe('SLACK_TEMPLATES', () => {
    it('should define all required event types', () => {
      const expectedTypes = [
        'feedback_round_opened',
        'feedback_submitted',
        'synthesis_complete',
        'signoff_requested',
        'signoff_received',
        'document_approved',
        'document_blocked',
        'reminder'
      ];

      for (const type of expectedTypes) {
        expect(SLACK_TEMPLATES[type]).toBeDefined();
        expect(SLACK_TEMPLATES[type].title).toBeTruthy();
        expect(SLACK_TEMPLATES[type].blocks).toBeInstanceOf(Function);
      }
    });

    it('should generate blocks for feedback_round_opened', () => {
      const data = {
        document_type: 'prd',
        document_key: 'user-auth',
        version: 1,
        deadline: '2026-01-15',
        stakeholder_count: 5,
        document_url: 'https://example.com/doc'
      };

      const blocks = SLACK_TEMPLATES.feedback_round_opened.blocks(data);

      expect(blocks).toBeInstanceOf(Array);
      expect(blocks.length).toBeGreaterThan(0);

      // Check header block
      const header = blocks.find(b => b.type === 'header');
      expect(header).toBeDefined();
      expect(header.text.text).toContain('Feedback');

      // Check section with fields
      const section = blocks.find(b => b.type === 'section' && b.fields);
      expect(section).toBeDefined();

      // Check actions block
      const actions = blocks.find(b => b.type === 'actions');
      expect(actions).toBeDefined();
      expect(actions.elements[0].url).toBe('https://example.com/doc');
    });

    it('should have static color values where appropriate', () => {
      expect(SLACK_TEMPLATES.feedback_round_opened.color).toBe('#36a64f');
      expect(SLACK_TEMPLATES.document_blocked.color).toBe('#dc3545');
      expect(SLACK_TEMPLATES.reminder.color).toBe('#ffc107');
    });

    it('should have dynamic color for signoff_received', () => {
      expect(typeof SLACK_TEMPLATES.signoff_received.color).toBe('function');

      const approvedColor = SLACK_TEMPLATES.signoff_received.color({ decision: 'approved' });
      const blockedColor = SLACK_TEMPLATES.signoff_received.color({ decision: 'blocked' });

      expect(approvedColor).toBe('#28a745'); // Green
      expect(blockedColor).toBe('#dc3545'); // Red
    });

    it('should have dynamic title for signoff_received', () => {
      expect(typeof SLACK_TEMPLATES.signoff_received.title).toBe('function');

      const title = SLACK_TEMPLATES.signoff_received.title({
        emoji: '✅',
        user: 'alice'
      });

      expect(title).toContain('✅');
      expect(title).toContain('alice');
    });

    it('should handle optional note in signoff_received blocks', () => {
      const dataWithNote = {
        emoji: '✅📝',
        user: 'bob',
        decision: 'approved',
        document_type: 'prd',
        document_key: 'test',
        progress_current: 2,
        progress_total: 3,
        note: 'Minor concern noted',
        review_url: 'https://example.com'
      };

      const dataWithoutNote = { ...dataWithNote, note: null };

      const blocksWithNote = SLACK_TEMPLATES.signoff_received.blocks(dataWithNote);
      const blocksWithoutNote = SLACK_TEMPLATES.signoff_received.blocks(dataWithoutNote);

      // With note should have more blocks
      expect(blocksWithNote.length).toBeGreaterThan(blocksWithoutNote.length);
    });

    it('should truncate long summaries in feedback_submitted', () => {
      const longSummary = 'A'.repeat(300);
      const data = {
        user: 'alice',
        document_type: 'prd',
        document_key: 'test',
        feedback_type: 'concern',
        section: 'FR-1',
        summary: longSummary,
        feedback_url: 'https://example.com'
      };

      const blocks = SLACK_TEMPLATES.feedback_submitted.blocks(data);
      const summaryBlock = blocks.find(b =>
        b.type === 'section' && b.text?.text?.startsWith('>')
      );

      expect(summaryBlock.text.text.length).toBeLessThan(250);
      expect(summaryBlock.text.text).toContain('...');
    });
  });

  // ============ Constructor Tests ============

  describe('constructor', () => {
    it('should initialize with webhook URL', () => {
      const notifier = new SlackNotifier({
        webhookUrl: 'https://hooks.slack.com/services/xxx',
        channel: '#prd-updates'
      });

      expect(notifier.webhookUrl).toBe('https://hooks.slack.com/services/xxx');
      expect(notifier.channel).toBe('#prd-updates');
      expect(notifier.enabled).toBe(true);
    });

    it('should use default values', () => {
      const notifier = new SlackNotifier({
        webhookUrl: 'https://hooks.slack.com/services/xxx'
      });

      expect(notifier.username).toBe('PRD Crowdsource Bot');
      expect(notifier.iconEmoji).toBe(':clipboard:');
    });

    it('should be disabled without webhook URL', () => {
      const notifier = new SlackNotifier({});

      expect(notifier.enabled).toBe(false);
    });
  });

  // ============ isEnabled Tests ============

  describe('isEnabled', () => {
    it('should return true when webhook configured', () => {
      const notifier = new SlackNotifier({
        webhookUrl: 'https://hooks.slack.com/services/xxx'
      });

      expect(notifier.isEnabled()).toBe(true);
    });

    it('should return false when not configured', () => {
      const notifier = new SlackNotifier({});

      expect(notifier.isEnabled()).toBe(false);
    });
  });

  // ============ send Tests ============

  describe('send', () => {
    let notifier;

    beforeEach(() => {
      notifier = new SlackNotifier({
        webhookUrl: 'https://hooks.slack.com/services/xxx',
        channel: '#prd-updates'
      });
    });

    it('should return error when not enabled', async () => {
      const disabledNotifier = new SlackNotifier({});

      const result = await disabledNotifier.send('feedback_round_opened', {});

      expect(result.success).toBe(false);
      expect(result.error).toContain('not enabled');
    });

    it('should return error for unknown event type', async () => {
      const result = await notifier.send('unknown_event', {});

      expect(result.success).toBe(false);
      expect(result.error).toContain('Unknown notification event type');
    });

    it('should send webhook with correct payload', async () => {
      const data = {
        document_type: 'prd',
        document_key: 'user-auth',
        version: 1,
        deadline: '2026-01-15',
        stakeholder_count: 5,
        document_url: 'https://example.com/doc'
      };

      const result = await notifier.send('feedback_round_opened', data);

      expect(global.fetch).toHaveBeenCalledTimes(1);
      expect(global.fetch).toHaveBeenCalledWith(
        'https://hooks.slack.com/services/xxx',
        expect.objectContaining({
          method: 'POST',
          headers: { 'Content-Type': 'application/json' }
        })
      );

      const payload = JSON.parse(global.fetch.mock.calls[0][1].body);

      expect(payload.channel).toBe('#prd-updates');
      expect(payload.username).toBe('PRD Crowdsource Bot');
      expect(payload.attachments).toHaveLength(1);
      expect(payload.attachments[0].color).toBe('#36a64f');
      expect(payload.attachments[0].blocks).toBeInstanceOf(Array);

      expect(result.success).toBe(true);
      expect(result.channel).toBe('slack');
    });

    it('should handle webhook error', async () => {
      global.fetch.mockResolvedValue({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error'
      });

      const result = await notifier.send('document_approved', {
        document_type: 'prd',
        document_key: 'test',
        title: 'Test',
        version: 1,
        approval_count: 3,
        stakeholder_count: 3,
        document_url: 'https://example.com'
      });

      expect(result.success).toBe(false);
      expect(result.error).toContain('500');
    });

    it('should use custom channel from options', async () => {
      await notifier.send('reminder', {
        document_type: 'prd',
        document_key: 'test',
        action_needed: 'feedback',
        deadline: '2026-01-15',
        time_remaining: '2 days',
        document_url: 'https://example.com'
      }, { channel: '#urgent-prd' });

      const payload = JSON.parse(global.fetch.mock.calls[0][1].body);
      expect(payload.channel).toBe('#urgent-prd');
    });
  });

  // ============ sendCustom Tests ============

  describe('sendCustom', () => {
    let notifier;

    beforeEach(() => {
      notifier = new SlackNotifier({
        webhookUrl: 'https://hooks.slack.com/services/xxx',
        channel: '#general'
      });
    });

    it('should return error when not enabled', async () => {
      const disabledNotifier = new SlackNotifier({});

      const result = await disabledNotifier.sendCustom('Hello');

      expect(result.success).toBe(false);
      expect(result.error).toContain('not enabled');
    });

    it('should send custom message', async () => {
      const result = await notifier.sendCustom('Custom notification message');

      expect(global.fetch).toHaveBeenCalledTimes(1);

      const payload = JSON.parse(global.fetch.mock.calls[0][1].body);
      expect(payload.text).toBe('Custom notification message');
      expect(payload.channel).toBe('#general');

      expect(result.success).toBe(true);
    });

    it('should allow channel override', async () => {
      await notifier.sendCustom('Test', { channel: '#testing' });

      const payload = JSON.parse(global.fetch.mock.calls[0][1].body);
      expect(payload.channel).toBe('#testing');
    });

    it('should handle webhook error', async () => {
      global.fetch.mockRejectedValue(new Error('Network error'));

      const result = await notifier.sendCustom('Test');

      expect(result.success).toBe(false);
      expect(result.error).toBe('Network error');
    });
  });

  // ============ _buildPayload Tests ============

  describe('_buildPayload', () => {
    let notifier;

    beforeEach(() => {
      notifier = new SlackNotifier({
        webhookUrl: 'https://hooks.slack.com/services/xxx',
        channel: '#default',
        username: 'TestBot',
        iconEmoji: ':robot:'
      });
    });

    it('should build payload with static color', () => {
      const template = SLACK_TEMPLATES.feedback_round_opened;
      const data = {
        document_type: 'prd',
        document_key: 'test',
        version: 1,
        deadline: '2026-01-15',
        stakeholder_count: 3,
        document_url: 'https://example.com'
      };

      const payload = notifier._buildPayload(template, data, {});

      expect(payload.channel).toBe('#default');
      expect(payload.username).toBe('TestBot');
      expect(payload.icon_emoji).toBe(':robot:');
      expect(payload.text).toBe('📣 Feedback Round Open');
      expect(payload.attachments[0].color).toBe('#36a64f');
    });

    it('should build payload with dynamic color', () => {
      const template = SLACK_TEMPLATES.signoff_received;
      const data = {
        emoji: '🚫',
        user: 'alice',
        decision: 'blocked',
        document_type: 'prd',
        document_key: 'test',
        progress_current: 2,
        progress_total: 5,
        review_url: 'https://example.com'
      };

      const payload = notifier._buildPayload(template, data, {});

      expect(payload.attachments[0].color).toBe('#dc3545'); // Red for blocked
    });

    it('should build payload with dynamic title', () => {
      const template = SLACK_TEMPLATES.signoff_received;
      const data = {
        emoji: '✅',
        user: 'bob',
        decision: 'approved',
        document_type: 'prd',
        document_key: 'test',
        progress_current: 3,
        progress_total: 3,
        review_url: 'https://example.com'
      };

      const payload = notifier._buildPayload(template, data, {});

      expect(payload.text).toContain('bob');
      expect(payload.attachments[0].fallback).toContain('bob');
    });
  });

  // ============ Integration Tests ============

  describe('integration', () => {
    let notifier;

    beforeEach(() => {
      notifier = new SlackNotifier({
        webhookUrl: 'https://hooks.slack.com/services/xxx',
        channel: '#prd-notifications'
      });
    });

    it('should send document_blocked notification', async () => {
      await notifier.send('document_blocked', {
        document_type: 'prd',
        document_key: 'payments-v2',
        user: 'legal-team',
        reason: 'Compliance review required',
        feedback_url: 'https://example.com/feedback/123'
      });

      const payload = JSON.parse(global.fetch.mock.calls[0][1].body);

      expect(payload.attachments[0].color).toBe('#dc3545');
      expect(payload.attachments[0].blocks).toBeInstanceOf(Array);

      // Find blocking reason in blocks
      const reasonBlock = payload.attachments[0].blocks.find(
        b => b.type === 'section' && b.text?.text?.includes('Compliance')
      );
      expect(reasonBlock).toBeDefined();
    });

    it('should send synthesis_complete notification', async () => {
      await notifier.send('synthesis_complete', {
        document_type: 'prd',
        document_key: 'user-auth',
        old_version: 1,
        new_version: 2,
        feedback_count: 12,
        conflicts_resolved: 3,
        summary: 'Incorporated 12 feedback items including session timeout resolution',
        document_url: 'https://example.com/doc'
      });

      const payload = JSON.parse(global.fetch.mock.calls[0][1].body);

      expect(payload.attachments[0].color).toBe('#9932cc'); // Purple
      expect(payload.text).toContain('Synthesis Complete');
    });
  });
});
