/**
 * Tests for GitHubNotifier - Baseline notification via GitHub @mentions
 *
 * Tests cover:
 * - Notification templates for all event types
 * - Template rendering with variable substitution
 * - Conditional rendering ({{#if}})
 * - Array rendering ({{#each}})
 * - Comment and issue creation
 * - Error handling
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GitHubNotifier, NOTIFICATION_TEMPLATES } from '../../../src/modules/bmm/lib/notifications/github-notifier.js';

describe('GitHubNotifier', () => {
  // ============ NOTIFICATION_TEMPLATES Tests ============

  describe('NOTIFICATION_TEMPLATES', () => {
    it('should define all required event types', () => {
      const expectedTypes = [
        'feedback_round_opened',
        'feedback_submitted',
        'synthesis_complete',
        'signoff_requested',
        'signoff_received',
        'document_approved',
        'document_blocked',
        'reminder',
        'deadline_extended',
      ];

      for (const type of expectedTypes) {
        expect(NOTIFICATION_TEMPLATES[type]).toBeDefined();
        expect(NOTIFICATION_TEMPLATES[type].subject).toBeTruthy();
        expect(NOTIFICATION_TEMPLATES[type].template).toBeTruthy();
      }
    });

    it('should have placeholders in templates', () => {
      const template = NOTIFICATION_TEMPLATES.feedback_round_opened.template;

      expect(template).toContain('{{mentions}}');
      expect(template).toContain('{{document_type}}');
      expect(template).toContain('{{document_key}}');
      expect(template).toContain('{{deadline}}');
    });

    it('should have conditional blocks in relevant templates', () => {
      const template = NOTIFICATION_TEMPLATES.signoff_received.template;

      expect(template).toContain('{{#if note}}');
      expect(template).toContain('{{/if}}');
    });
  });

  // ============ Constructor Tests ============

  describe('constructor', () => {
    it('should initialize with config', () => {
      const mockGithub = { addIssueComment: vi.fn() };
      const notifier = new GitHubNotifier({
        owner: 'test-org',
        repo: 'test-repo',
        github: mockGithub,
      });

      expect(notifier.owner).toBe('test-org');
      expect(notifier.repo).toBe('test-repo');
      expect(notifier.github).toBe(mockGithub);
    });
  });

  // ============ send Tests ============

  describe('send', () => {
    let notifier;
    let mockGithub;

    beforeEach(() => {
      mockGithub = {
        addIssueComment: vi.fn().mockResolvedValue({ id: 123 }),
        createIssue: vi.fn().mockResolvedValue({ number: 456 }),
      };

      notifier = new GitHubNotifier({
        owner: 'test-org',
        repo: 'test-repo',
        github: mockGithub,
      });
    });

    it('should throw for unknown event type', async () => {
      await expect(notifier.send('unknown_event', {})).rejects.toThrow('Unknown notification event type: unknown_event');
    });

    it('should post comment when issueNumber provided', async () => {
      const result = await notifier.send(
        'feedback_round_opened',
        {
          mentions: '@alice @bob',
          document_type: 'prd',
          document_key: 'user-auth',
          version: 1,
          deadline: '2026-01-15',
          document_url: 'https://example.com/doc',
        },
        { issueNumber: 100 },
      );

      expect(mockGithub.addIssueComment).toHaveBeenCalledTimes(1);
      expect(mockGithub.addIssueComment).toHaveBeenCalledWith({
        owner: 'test-org',
        repo: 'test-repo',
        issue_number: 100,
        body: expect.stringContaining('Feedback Round Open'),
      });

      expect(result.success).toBe(true);
      expect(result.channel).toBe('github');
      expect(result.type).toBe('comment');
      expect(result.commentId).toBe(123);
    });

    it('should create issue when createIssue option provided', async () => {
      const result = await notifier.send(
        'document_approved',
        {
          document_type: 'prd',
          document_key: 'user-auth',
          title: 'User Authentication',
          version: 2,
          approval_count: 5,
          stakeholder_count: 5,
          document_url: 'https://example.com/doc',
        },
        { createIssue: true, labels: ['notification', 'approved'] },
      );

      expect(mockGithub.createIssue).toHaveBeenCalledTimes(1);
      expect(mockGithub.createIssue).toHaveBeenCalledWith({
        owner: 'test-org',
        repo: 'test-repo',
        title: expect.stringContaining('Document Approved'),
        body: expect.stringContaining('User Authentication'),
        labels: ['notification', 'approved'],
      });

      expect(result.success).toBe(true);
      expect(result.type).toBe('issue');
      expect(result.issueNumber).toBe(456);
    });

    it('should use review_issue from data when no options specified', async () => {
      await notifier.send('feedback_submitted', {
        user: 'alice',
        document_type: 'prd',
        document_key: 'test',
        feedback_type: 'concern',
        section: 'FR-3',
        summary: 'Security issue found',
        feedback_issue: 42,
        feedback_url: 'https://example.com/feedback/42',
        review_issue: 100,
      });

      expect(mockGithub.addIssueComment).toHaveBeenCalledTimes(1);
      expect(mockGithub.addIssueComment.mock.calls[0][0].issue_number).toBe(100);
    });

    it('should return message when no target specified', async () => {
      const result = await notifier.send('deadline_extended', {
        document_type: 'prd',
        document_key: 'test',
        old_deadline: '2026-01-10',
        new_deadline: '2026-01-20',
        document_url: 'https://example.com/doc',
      });

      expect(result.success).toBe(true);
      expect(result.message).toBeTruthy();
      expect(result.note).toContain('No target issue specified');
    });

    it('should handle GitHub API error', async () => {
      mockGithub.addIssueComment.mockRejectedValue(new Error('API rate limit'));

      const result = await notifier.send(
        'reminder',
        {
          mentions: '@alice',
          document_type: 'prd',
          document_key: 'test',
          action_needed: 'feedback',
          deadline: '2026-01-15',
          time_remaining: '2 days',
          document_url: 'https://example.com/doc',
        },
        { issueNumber: 100 },
      );

      expect(result.success).toBe(false);
      expect(result.error).toBe('API rate limit');
    });
  });

  // ============ sendReminder Tests ============

  describe('sendReminder', () => {
    let notifier;
    let mockGithub;

    beforeEach(() => {
      mockGithub = {
        addIssueComment: vi.fn().mockResolvedValue({ id: 123 }),
      };

      notifier = new GitHubNotifier({
        owner: 'test-org',
        repo: 'test-repo',
        github: mockGithub,
      });
    });

    it('should format mentions and send reminder', async () => {
      await notifier.sendReminder(100, ['alice', 'bob'], {
        document_type: 'prd',
        document_key: 'test',
        action_needed: 'sign-off',
        deadline: '2026-01-15',
        time_remaining: '24 hours',
        document_url: 'https://example.com/doc',
      });

      expect(mockGithub.addIssueComment).toHaveBeenCalledTimes(1);
      const body = mockGithub.addIssueComment.mock.calls[0][0].body;

      expect(body).toContain('@alice @bob');
      expect(body).toContain('Reminder');
      expect(body).toContain('sign-off');
    });
  });

  // ============ notifyStakeholders Tests ============

  describe('notifyStakeholders', () => {
    let notifier;
    let mockGithub;

    beforeEach(() => {
      mockGithub = {
        addIssueComment: vi.fn().mockResolvedValue({ id: 123 }),
      };

      notifier = new GitHubNotifier({
        owner: 'test-org',
        repo: 'test-repo',
        github: mockGithub,
      });
    });

    it('should format mentions and post message', async () => {
      await notifier.notifyStakeholders(['alice', 'bob', 'charlie'], 'Please review the updated document', 100);

      expect(mockGithub.addIssueComment).toHaveBeenCalledTimes(1);
      const body = mockGithub.addIssueComment.mock.calls[0][0].body;

      expect(body).toContain('@alice @bob @charlie');
      expect(body).toContain('Please review the updated document');
    });
  });

  // ============ _renderTemplate Tests ============

  describe('_renderTemplate', () => {
    let notifier;

    beforeEach(() => {
      notifier = new GitHubNotifier({
        owner: 'test',
        repo: 'test',
        github: {},
      });
    });

    it('should replace simple variables', () => {
      const template = 'Hello {{name}}, welcome to {{place}}!';
      const result = notifier._renderTemplate(template, {
        name: 'Alice',
        place: 'Wonderland',
      });

      expect(result).toBe('Hello Alice, welcome to Wonderland!');
    });

    it('should keep placeholder when variable not found', () => {
      const template = 'Hello {{name}}, your id is {{id}}';
      const result = notifier._renderTemplate(template, { name: 'Bob' });

      expect(result).toBe('Hello Bob, your id is {{id}}');
    });

    it('should handle conditional blocks - true', () => {
      const template = 'Start{{#if show}} visible{{/if}} end';
      const result = notifier._renderTemplate(template, { show: true });

      expect(result).toBe('Start visible end');
    });

    it('should handle conditional blocks - false', () => {
      const template = 'Start{{#if show}} hidden{{/if}} end';
      const result = notifier._renderTemplate(template, { show: false });

      expect(result).toBe('Start end');
    });

    it('should handle conditional blocks - undefined', () => {
      const template = 'Start{{#if show}} hidden{{/if}} end';
      const result = notifier._renderTemplate(template, {});

      expect(result).toBe('Start end');
    });

    it('should handle each blocks with objects', () => {
      const template = 'Items:{{#each items}} {{name}}={{value}};{{/each}}';
      const result = notifier._renderTemplate(template, {
        items: [
          { name: 'a', value: 1 },
          { name: 'b', value: 2 },
        ],
      });

      expect(result).toBe('Items: a=1; b=2;');
    });

    it('should handle each blocks with primitives', () => {
      const template = 'List:{{#each items}} {{this}}{{/each}}';
      const result = notifier._renderTemplate(template, {
        items: ['apple', 'banana', 'cherry'],
      });

      expect(result).toBe('List: apple banana cherry');
    });

    it('should handle each with @index', () => {
      const template = '{{#each items}}{{@index}}.{{this}} {{/each}}';
      const result = notifier._renderTemplate(template, {
        items: ['a', 'b', 'c'],
      });

      expect(result).toBe('0.a 1.b 2.c ');
    });

    it('should handle each with non-array', () => {
      const template = 'Items:{{#each items}} item{{/each}}';
      const result = notifier._renderTemplate(template, {
        items: 'not an array',
      });

      expect(result).toBe('Items:');
    });

    it('should handle complex template', () => {
      const template = `
## {{title}}

**From:** @{{user}}
**Status:** {{status}}

{{#if note}}
**Note:** {{note}}
{{/if}}

Items:
{{#each items}}
- {{name}}: {{value}}
{{/each}}
`;

      const result = notifier._renderTemplate(template, {
        title: 'Test',
        user: 'alice',
        status: 'approved',
        note: 'Great work!',
        items: [
          { name: 'Item 1', value: 'Value 1' },
          { name: 'Item 2', value: 'Value 2' },
        ],
      });

      expect(result).toContain('## Test');
      expect(result).toContain('@alice');
      expect(result).toContain('approved');
      expect(result).toContain('Great work!');
      expect(result).toContain('Item 1: Value 1');
      expect(result).toContain('Item 2: Value 2');
    });
  });

  // ============ Integration Tests ============

  describe('integration', () => {
    let notifier;
    let mockGithub;

    beforeEach(() => {
      mockGithub = {
        addIssueComment: vi.fn().mockResolvedValue({ id: 123 }),
        createIssue: vi.fn().mockResolvedValue({ number: 456 }),
      };

      notifier = new GitHubNotifier({
        owner: 'test-org',
        repo: 'test-repo',
        github: mockGithub,
      });
    });

    it('should send feedback_round_opened notification', async () => {
      await notifier.send(
        'feedback_round_opened',
        {
          mentions: '@alice @bob @charlie',
          document_type: 'prd',
          document_key: 'user-auth',
          version: 1,
          deadline: '2026-01-15',
          document_url: 'https://github.com/org/repo/docs/prd/user-auth.md',
        },
        { issueNumber: 100 },
      );

      const body = mockGithub.addIssueComment.mock.calls[0][0].body;

      expect(body).toContain('📣 Feedback Round Open');
      expect(body).toContain('@alice @bob @charlie');
      expect(body).toContain('prd:user-auth');
      expect(body).toContain('v1');
      expect(body).toContain('2026-01-15');
    });

    it('should send signoff_received notification with note', async () => {
      await notifier.send(
        'signoff_received',
        {
          emoji: '✅📝',
          user: 'security-lead',
          decision: 'Approved with Note',
          document_type: 'prd',
          document_key: 'payments',
          progress_current: 3,
          progress_total: 5,
          note: 'Please update PCI compliance section before implementation',
          review_issue: 200,
          review_url: 'https://github.com/org/repo/issues/200',
        },
        { issueNumber: 200 },
      );

      const body = mockGithub.addIssueComment.mock.calls[0][0].body;

      expect(body).toContain('✅📝');
      expect(body).toContain('@security-lead');
      expect(body).toContain('Approved with Note');
      expect(body).toContain('3/5');
      expect(body).toContain('PCI compliance');
    });

    it('should send document_blocked notification', async () => {
      await notifier.send(
        'document_blocked',
        {
          document_type: 'prd',
          document_key: 'data-migration',
          user: 'legal',
          reason: 'GDPR compliance review required before proceeding',
          feedback_issue: 42,
          feedback_url: 'https://github.com/org/repo/issues/42',
        },
        { issueNumber: 100 },
      );

      const body = mockGithub.addIssueComment.mock.calls[0][0].body;

      expect(body).toContain('🚫 Document Blocked');
      expect(body).toContain('@legal');
      expect(body).toContain('GDPR compliance');
      expect(body).toContain('#42');
    });
  });
});
