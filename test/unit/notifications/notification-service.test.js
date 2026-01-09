/**
 * Tests for NotificationService - Multi-channel notification orchestration
 *
 * Tests cover:
 * - Channel initialization based on config
 * - Event routing with default channels
 * - Priority-based behavior (retry, all channels)
 * - Convenience methods for specific notification types
 * - Error handling and aggregation
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  NotificationService,
  NOTIFICATION_EVENTS,
  PRIORITY_BEHAVIOR
} from '../../../src/modules/bmm/lib/notifications/notification-service.js';

// Mock the notifier modules
vi.mock('../../../src/modules/bmm/lib/notifications/github-notifier.js', () => ({
  GitHubNotifier: vi.fn().mockImplementation(() => ({
    send: vi.fn().mockResolvedValue({ success: true, channel: 'github' })
  }))
}));

vi.mock('../../../src/modules/bmm/lib/notifications/slack-notifier.js', () => ({
  SlackNotifier: vi.fn().mockImplementation(() => ({
    send: vi.fn().mockResolvedValue({ success: true, channel: 'slack' })
  }))
}));

vi.mock('../../../src/modules/bmm/lib/notifications/email-notifier.js', () => ({
  EmailNotifier: vi.fn().mockImplementation(() => ({
    send: vi.fn().mockResolvedValue({ success: true, channel: 'email' })
  }))
}));

describe('NotificationService', () => {
  // ============ Constants Tests ============

  describe('NOTIFICATION_EVENTS', () => {
    it('should define all event types', () => {
      const expectedEvents = [
        'feedback_round_opened',
        'feedback_submitted',
        'synthesis_complete',
        'signoff_requested',
        'signoff_received',
        'document_approved',
        'document_blocked',
        'reminder',
        'deadline_extended'
      ];

      for (const event of expectedEvents) {
        expect(NOTIFICATION_EVENTS[event]).toBeDefined();
        expect(NOTIFICATION_EVENTS[event].description).toBeTruthy();
        expect(NOTIFICATION_EVENTS[event].defaultChannels).toBeInstanceOf(Array);
        expect(NOTIFICATION_EVENTS[event].priority).toBeTruthy();
      }
    });

    it('should have appropriate priorities for different events', () => {
      expect(NOTIFICATION_EVENTS.document_blocked.priority).toBe('urgent');
      expect(NOTIFICATION_EVENTS.signoff_requested.priority).toBe('high');
      expect(NOTIFICATION_EVENTS.feedback_submitted.priority).toBe('normal');
      expect(NOTIFICATION_EVENTS.deadline_extended.priority).toBe('low');
    });

    it('should include all channels for important events', () => {
      expect(NOTIFICATION_EVENTS.feedback_round_opened.defaultChannels).toContain('github');
      expect(NOTIFICATION_EVENTS.feedback_round_opened.defaultChannels).toContain('slack');
      expect(NOTIFICATION_EVENTS.feedback_round_opened.defaultChannels).toContain('email');
    });

    it('should have minimal channels for low-priority events', () => {
      expect(NOTIFICATION_EVENTS.deadline_extended.defaultChannels).toEqual(['github']);
    });
  });

  describe('PRIORITY_BEHAVIOR', () => {
    it('should define all priority levels', () => {
      expect(PRIORITY_BEHAVIOR.urgent).toBeDefined();
      expect(PRIORITY_BEHAVIOR.high).toBeDefined();
      expect(PRIORITY_BEHAVIOR.normal).toBeDefined();
      expect(PRIORITY_BEHAVIOR.low).toBeDefined();
    });

    it('should have retry settings based on priority', () => {
      expect(PRIORITY_BEHAVIOR.urgent.retryOnFailure).toBe(true);
      expect(PRIORITY_BEHAVIOR.urgent.maxRetries).toBe(3);

      expect(PRIORITY_BEHAVIOR.high.retryOnFailure).toBe(true);
      expect(PRIORITY_BEHAVIOR.high.maxRetries).toBe(2);

      expect(PRIORITY_BEHAVIOR.normal.retryOnFailure).toBe(false);
      expect(PRIORITY_BEHAVIOR.normal.maxRetries).toBe(1);

      expect(PRIORITY_BEHAVIOR.low.retryOnFailure).toBe(false);
    });

    it('should use all channels for urgent priority', () => {
      expect(PRIORITY_BEHAVIOR.urgent.allChannels).toBe(true);
      expect(PRIORITY_BEHAVIOR.high.allChannels).toBe(false);
      expect(PRIORITY_BEHAVIOR.normal.allChannels).toBe(false);
    });
  });

  // ============ Constructor Tests ============

  describe('constructor', () => {
    it('should always initialize GitHub channel', () => {
      const service = new NotificationService({
        github: { owner: 'test', repo: 'test' }
      });

      expect(service.channels.github).toBeDefined();
      expect(service.isChannelAvailable('github')).toBe(true);
    });

    it('should initialize Slack when enabled with webhook', () => {
      const service = new NotificationService({
        github: { owner: 'test', repo: 'test' },
        slack: {
          enabled: true,
          webhookUrl: 'https://hooks.slack.com/xxx'
        }
      });

      expect(service.channels.slack).toBeDefined();
      expect(service.isChannelAvailable('slack')).toBe(true);
    });

    it('should not initialize Slack without webhook', () => {
      const service = new NotificationService({
        github: { owner: 'test', repo: 'test' },
        slack: { enabled: true } // No webhookUrl
      });

      expect(service.channels.slack).toBeUndefined();
      expect(service.isChannelAvailable('slack')).toBe(false);
    });

    it('should initialize Email when enabled with SMTP', () => {
      const service = new NotificationService({
        github: { owner: 'test', repo: 'test' },
        email: {
          enabled: true,
          smtp: { host: 'localhost' }
        }
      });

      expect(service.channels.email).toBeDefined();
      expect(service.isChannelAvailable('email')).toBe(true);
    });

    it('should initialize Email when enabled with API key', () => {
      const service = new NotificationService({
        github: { owner: 'test', repo: 'test' },
        email: {
          enabled: true,
          apiKey: 'SG.xxx'
        }
      });

      expect(service.channels.email).toBeDefined();
    });

    it('should not initialize Email without config', () => {
      const service = new NotificationService({
        github: { owner: 'test', repo: 'test' },
        email: { enabled: true } // No smtp or apiKey
      });

      expect(service.channels.email).toBeUndefined();
    });
  });

  // ============ getAvailableChannels Tests ============

  describe('getAvailableChannels', () => {
    it('should return only GitHub when minimal config', () => {
      const service = new NotificationService({
        github: { owner: 'test', repo: 'test' }
      });

      expect(service.getAvailableChannels()).toEqual(['github']);
    });

    it('should return all channels when fully configured', () => {
      const service = new NotificationService({
        github: { owner: 'test', repo: 'test' },
        slack: { enabled: true, webhookUrl: 'https://xxx' },
        email: { enabled: true, smtp: { host: 'localhost' } }
      });

      const channels = service.getAvailableChannels();
      expect(channels).toContain('github');
      expect(channels).toContain('slack');
      expect(channels).toContain('email');
    });
  });

  // ============ notify Tests ============

  describe('notify', () => {
    let service;
    let mockGithubSend;
    let mockSlackSend;
    let mockEmailSend;

    beforeEach(() => {
      mockGithubSend = vi.fn().mockResolvedValue({ success: true, channel: 'github' });
      mockSlackSend = vi.fn().mockResolvedValue({ success: true, channel: 'slack' });
      mockEmailSend = vi.fn().mockResolvedValue({ success: true, channel: 'email' });

      service = new NotificationService({
        github: { owner: 'test', repo: 'test' },
        slack: { enabled: true, webhookUrl: 'https://xxx' },
        email: { enabled: true, smtp: { host: 'localhost' } }
      });

      service.channels.github.send = mockGithubSend;
      service.channels.slack.send = mockSlackSend;
      service.channels.email.send = mockEmailSend;
    });

    it('should throw for unknown event type', async () => {
      await expect(
        service.notify('unknown_event', {})
      ).rejects.toThrow('Unknown notification event type: unknown_event');
    });

    it('should send to default channels for event', async () => {
      await service.notify('feedback_round_opened', {
        document_type: 'prd',
        document_key: 'test'
      });

      expect(mockGithubSend).toHaveBeenCalled();
      expect(mockSlackSend).toHaveBeenCalled();
      expect(mockEmailSend).toHaveBeenCalled();
    });

    it('should filter to available channels only', async () => {
      // Service with only GitHub
      const minimalService = new NotificationService({
        github: { owner: 'test', repo: 'test' }
      });
      minimalService.channels.github.send = mockGithubSend;

      await minimalService.notify('feedback_round_opened', {});

      expect(mockGithubSend).toHaveBeenCalled();
      expect(mockSlackSend).not.toHaveBeenCalled();
      expect(mockEmailSend).not.toHaveBeenCalled();
    });

    it('should always include GitHub as baseline', async () => {
      await service.notify('feedback_submitted', {
        document_type: 'prd',
        document_key: 'test'
      }, { channels: ['slack'] }); // Explicitly only slack

      // GitHub should still be included
      expect(mockGithubSend).toHaveBeenCalled();
      expect(mockSlackSend).toHaveBeenCalled();
    });

    it('should use all channels for urgent priority', async () => {
      await service.notify('document_blocked', {
        document_type: 'prd',
        document_key: 'test',
        user: 'security',
        reason: 'Blocked'
      });

      // document_blocked is urgent, should use all available channels
      expect(mockGithubSend).toHaveBeenCalled();
      expect(mockSlackSend).toHaveBeenCalled();
      expect(mockEmailSend).toHaveBeenCalled();
    });

    it('should respect custom channels option', async () => {
      await service.notify('deadline_extended', {
        document_type: 'prd',
        document_key: 'test'
      }, { channels: ['github', 'slack'] });

      expect(mockGithubSend).toHaveBeenCalled();
      expect(mockSlackSend).toHaveBeenCalled();
      expect(mockEmailSend).not.toHaveBeenCalled();
    });

    it('should aggregate results from all channels', async () => {
      const result = await service.notify('signoff_requested', {
        document_type: 'prd',
        document_key: 'test'
      });

      expect(result.success).toBe(true);
      expect(result.eventType).toBe('signoff_requested');
      expect(result.results.github).toBeDefined();
      expect(result.results.slack).toBeDefined();
      expect(result.results.email).toBeDefined();
    });

    it('should report success if any channel succeeds', async () => {
      mockGithubSend.mockResolvedValue({ success: true, channel: 'github' });
      mockSlackSend.mockResolvedValue({ success: false, channel: 'slack', error: 'Failed' });
      mockEmailSend.mockResolvedValue({ success: false, channel: 'email', error: 'Failed' });

      const result = await service.notify('feedback_round_opened', {});

      expect(result.success).toBe(true);
    });

    it('should report failure if all channels fail', async () => {
      mockGithubSend.mockResolvedValue({ success: false, error: 'Failed' });
      mockSlackSend.mockResolvedValue({ success: false, error: 'Failed' });
      mockEmailSend.mockResolvedValue({ success: false, error: 'Failed' });

      const result = await service.notify('feedback_round_opened', {});

      expect(result.success).toBe(false);
    });
  });

  // ============ sendReminder Tests ============

  describe('sendReminder', () => {
    let service;
    let notifySpy;

    beforeEach(() => {
      service = new NotificationService({
        github: { owner: 'test', repo: 'test' }
      });

      notifySpy = vi.spyOn(service, 'notify').mockResolvedValue({ success: true });
    });

    it('should format users as mentions', async () => {
      await service.sendReminder('prd', 'user-auth', ['alice', 'bob'], {
        action_needed: 'feedback',
        deadline: '2026-01-15'
      });

      expect(notifySpy).toHaveBeenCalledWith('reminder', expect.objectContaining({
        mentions: '@alice @bob',
        users: ['alice', 'bob'],
        document_type: 'prd',
        document_key: 'user-auth'
      }));
    });
  });

  // ============ notifyFeedbackRoundOpened Tests ============

  describe('notifyFeedbackRoundOpened', () => {
    let service;
    let notifySpy;

    beforeEach(() => {
      service = new NotificationService({
        github: { owner: 'test', repo: 'test' }
      });

      notifySpy = vi.spyOn(service, 'notify').mockResolvedValue({ success: true });
    });

    it('should format document data correctly', async () => {
      await service.notifyFeedbackRoundOpened(
        {
          type: 'prd',
          key: 'user-auth',
          title: 'User Authentication',
          version: 1,
          url: 'https://example.com/doc',
          reviewIssue: 100
        },
        ['alice', 'bob', 'charlie'],
        '2026-01-15'
      );

      expect(notifySpy).toHaveBeenCalledWith('feedback_round_opened', expect.objectContaining({
        document_type: 'prd',
        document_key: 'user-auth',
        title: 'User Authentication',
        version: 1,
        deadline: '2026-01-15',
        stakeholder_count: 3,
        mentions: '@alice @bob @charlie',
        users: ['alice', 'bob', 'charlie'],
        document_url: 'https://example.com/doc',
        review_issue: 100
      }));
    });
  });

  // ============ notifyFeedbackSubmitted Tests ============

  describe('notifyFeedbackSubmitted', () => {
    let service;
    let notifySpy;

    beforeEach(() => {
      service = new NotificationService({
        github: { owner: 'test', repo: 'test' }
      });

      notifySpy = vi.spyOn(service, 'notify').mockResolvedValue({ success: true });
    });

    it('should format feedback data correctly', async () => {
      await service.notifyFeedbackSubmitted(
        {
          submittedBy: 'security',
          type: 'concern',
          section: 'FR-3',
          summary: 'Security vulnerability identified',
          issueNumber: 42,
          url: 'https://example.com/issues/42'
        },
        {
          type: 'prd',
          key: 'payments',
          owner: 'product-owner',
          reviewIssue: 100
        }
      );

      expect(notifySpy).toHaveBeenCalledWith(
        'feedback_submitted',
        expect.objectContaining({
          document_type: 'prd',
          document_key: 'payments',
          user: 'security',
          feedback_type: 'concern',
          section: 'FR-3',
          feedback_issue: 42
        }),
        expect.objectContaining({
          notifyOnly: ['product-owner']
        })
      );
    });
  });

  // ============ notifySynthesisComplete Tests ============

  describe('notifySynthesisComplete', () => {
    let service;
    let notifySpy;

    beforeEach(() => {
      service = new NotificationService({
        github: { owner: 'test', repo: 'test' }
      });

      notifySpy = vi.spyOn(service, 'notify').mockResolvedValue({ success: true });
    });

    it('should format synthesis data correctly', async () => {
      await service.notifySynthesisComplete(
        {
          type: 'prd',
          key: 'user-auth',
          url: 'https://example.com/doc',
          reviewIssue: 100
        },
        {
          oldVersion: 1,
          newVersion: 2,
          feedbackCount: 12,
          conflictsResolved: 3,
          summary: 'Incorporated security feedback and clarified auth flow'
        }
      );

      expect(notifySpy).toHaveBeenCalledWith('synthesis_complete', expect.objectContaining({
        document_type: 'prd',
        document_key: 'user-auth',
        old_version: 1,
        new_version: 2,
        feedback_count: 12,
        conflicts_resolved: 3,
        summary: expect.stringContaining('security feedback')
      }));
    });
  });

  // ============ notifySignoffRequested Tests ============

  describe('notifySignoffRequested', () => {
    let service;
    let notifySpy;

    beforeEach(() => {
      service = new NotificationService({
        github: { owner: 'test', repo: 'test' }
      });

      notifySpy = vi.spyOn(service, 'notify').mockResolvedValue({ success: true });
    });

    it('should format signoff request correctly', async () => {
      await service.notifySignoffRequested(
        {
          type: 'prd',
          key: 'payments',
          title: 'Payments V2',
          version: 2,
          url: 'https://example.com/doc',
          signoffUrl: 'https://example.com/signoff',
          reviewIssue: 200
        },
        ['alice', 'bob', 'charlie'],
        '2026-01-20',
        { minimum_approvals: 2 }
      );

      expect(notifySpy).toHaveBeenCalledWith('signoff_requested', expect.objectContaining({
        document_type: 'prd',
        document_key: 'payments',
        title: 'Payments V2',
        version: 2,
        deadline: '2026-01-20',
        approvals_needed: 2,
        mentions: '@alice @bob @charlie',
        users: ['alice', 'bob', 'charlie']
      }));
    });

    it('should calculate approvals_needed from stakeholder count when not specified', async () => {
      await service.notifySignoffRequested(
        {
          type: 'prd',
          key: 'test',
          title: 'Test',
          version: 1
        },
        ['a', 'b', 'c', 'd', 'e'],
        '2026-01-20',
        {} // No minimum_approvals
      );

      expect(notifySpy).toHaveBeenCalledWith('signoff_requested', expect.objectContaining({
        approvals_needed: 3 // ceil(5 * 0.5) = 3
      }));
    });
  });

  // ============ notifySignoffReceived Tests ============

  describe('notifySignoffReceived', () => {
    let service;
    let notifySpy;

    beforeEach(() => {
      service = new NotificationService({
        github: { owner: 'test', repo: 'test' }
      });

      notifySpy = vi.spyOn(service, 'notify').mockResolvedValue({ success: true });
    });

    it('should format approved signoff correctly', async () => {
      await service.notifySignoffReceived(
        {
          user: 'alice',
          decision: 'approved',
          note: null
        },
        {
          type: 'prd',
          key: 'test',
          reviewIssue: 100,
          reviewUrl: 'https://example.com/issues/100'
        },
        { current: 2, total: 3 }
      );

      expect(notifySpy).toHaveBeenCalledWith('signoff_received', expect.objectContaining({
        document_type: 'prd',
        document_key: 'test',
        user: 'alice',
        decision: 'approved',
        emoji: '✅',
        progress_current: 2,
        progress_total: 3
      }));
    });

    it('should format blocked signoff with correct emoji', async () => {
      await service.notifySignoffReceived(
        {
          user: 'security',
          decision: 'blocked',
          note: 'Security concern'
        },
        {
          type: 'prd',
          key: 'test',
          reviewIssue: 100
        },
        { current: 1, total: 3 }
      );

      expect(notifySpy).toHaveBeenCalledWith('signoff_received', expect.objectContaining({
        decision: 'blocked',
        emoji: '🚫',
        note: 'Security concern'
      }));
    });

    it('should format approved-with-note signoff correctly', async () => {
      await service.notifySignoffReceived(
        {
          user: 'bob',
          decision: 'approved-with-note',
          note: 'Minor concern'
        },
        {
          type: 'prd',
          key: 'test',
          reviewIssue: 100
        },
        { current: 2, total: 3 }
      );

      expect(notifySpy).toHaveBeenCalledWith('signoff_received', expect.objectContaining({
        emoji: '✅📝',
        note: 'Minor concern'
      }));
    });
  });

  // ============ notifyDocumentApproved Tests ============

  describe('notifyDocumentApproved', () => {
    let service;
    let notifySpy;

    beforeEach(() => {
      service = new NotificationService({
        github: { owner: 'test', repo: 'test' }
      });

      notifySpy = vi.spyOn(service, 'notify').mockResolvedValue({ success: true });
    });

    it('should format approval data correctly', async () => {
      await service.notifyDocumentApproved(
        {
          type: 'prd',
          key: 'user-auth',
          title: 'User Authentication',
          version: 2,
          url: 'https://example.com/doc'
        },
        3,
        3
      );

      expect(notifySpy).toHaveBeenCalledWith('document_approved', expect.objectContaining({
        document_type: 'prd',
        document_key: 'user-auth',
        title: 'User Authentication',
        version: 2,
        approval_count: 3,
        stakeholder_count: 3,
        document_url: 'https://example.com/doc'
      }));
    });
  });

  // ============ notifyDocumentBlocked Tests ============

  describe('notifyDocumentBlocked', () => {
    let service;
    let notifySpy;

    beforeEach(() => {
      service = new NotificationService({
        github: { owner: 'test', repo: 'test' }
      });

      notifySpy = vi.spyOn(service, 'notify').mockResolvedValue({ success: true });
    });

    it('should format block data correctly', async () => {
      await service.notifyDocumentBlocked(
        {
          type: 'prd',
          key: 'payments'
        },
        {
          user: 'legal',
          reason: 'GDPR compliance review required',
          feedbackIssue: 42,
          feedbackUrl: 'https://example.com/issues/42'
        }
      );

      expect(notifySpy).toHaveBeenCalledWith('document_blocked', expect.objectContaining({
        document_type: 'prd',
        document_key: 'payments',
        user: 'legal',
        reason: 'GDPR compliance review required',
        feedback_issue: 42,
        feedback_url: 'https://example.com/issues/42'
      }));
    });
  });

  // ============ Retry Logic Tests ============

  describe('retry logic', () => {
    let service;
    let mockGithubSend;

    beforeEach(() => {
      mockGithubSend = vi.fn();

      service = new NotificationService({
        github: { owner: 'test', repo: 'test' }
      });

      service.channels.github.send = mockGithubSend;
    });

    it('should retry on failure for urgent priority', async () => {
      let attempts = 0;
      mockGithubSend.mockImplementation(() => {
        attempts++;
        if (attempts < 3) {
          return Promise.resolve({ success: false, error: 'Temporary failure' });
        }
        return Promise.resolve({ success: true, channel: 'github' });
      });

      const result = await service.notify('document_blocked', {
        document_type: 'prd',
        document_key: 'test',
        user: 'blocker',
        reason: 'Issue'
      });

      expect(result.success).toBe(true);
      expect(mockGithubSend).toHaveBeenCalledTimes(3);
    }, 10000);

    it('should not retry for normal priority', async () => {
      mockGithubSend.mockResolvedValue({ success: false, error: 'Failed' });

      const result = await service.notify('deadline_extended', {
        document_type: 'prd',
        document_key: 'test'
      });

      expect(result.results.github.success).toBe(false);
      expect(mockGithubSend).toHaveBeenCalledTimes(1);
    });
  });
});
