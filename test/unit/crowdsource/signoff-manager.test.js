/**
 * Tests for SignoffManager - Configurable sign-off logic for PRDs and Epics
 *
 * Tests cover:
 * - Constants and default configuration
 * - Sign-off request creation
 * - Sign-off submission with various decisions
 * - Three threshold types: count, percentage, required_approvers
 * - Status calculation with blocking logic
 * - Progress tracking and summaries
 * - Reminder and deadline extension
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  SignoffManager,
  SIGNOFF_STATUS,
  THRESHOLD_TYPES,
  DEFAULT_CONFIG,
} from '../../../src/modules/bmm/lib/crowdsource/signoff-manager.js';

// Create a testable subclass that allows injecting mock implementations
class TestableSignoffManager extends SignoffManager {
  constructor(githubConfig, mocks = {}) {
    super(githubConfig);
    this.mocks = mocks;
  }

  async _getIssue(issueNumber) {
    if (this.mocks.getIssue) {
      return this.mocks.getIssue(issueNumber);
    }
    throw new Error('Mock not provided for _getIssue');
  }

  async _updateIssue(issueNumber, updates) {
    if (this.mocks.updateIssue) {
      return this.mocks.updateIssue(issueNumber, updates);
    }
    throw new Error('Mock not provided for _updateIssue');
  }

  async _addComment(issueNumber, body) {
    if (this.mocks.addComment) {
      return this.mocks.addComment(issueNumber, body);
    }
    throw new Error('Mock not provided for _addComment');
  }
}

describe('SignoffManager', () => {
  // ============ Constants Tests ============

  describe('SIGNOFF_STATUS', () => {
    it('should define all status values', () => {
      expect(SIGNOFF_STATUS.pending).toBe('signoff:pending');
      expect(SIGNOFF_STATUS.approved).toBe('signoff:approved');
      expect(SIGNOFF_STATUS.approved_with_note).toBe('signoff:approved-with-note');
      expect(SIGNOFF_STATUS.blocked).toBe('signoff:blocked');
    });
  });

  describe('THRESHOLD_TYPES', () => {
    it('should define all threshold types', () => {
      expect(THRESHOLD_TYPES.count).toBe('count');
      expect(THRESHOLD_TYPES.percentage).toBe('percentage');
      expect(THRESHOLD_TYPES.required_approvers).toBe('required_approvers');
    });
  });

  describe('DEFAULT_CONFIG', () => {
    it('should have sensible defaults', () => {
      expect(DEFAULT_CONFIG.threshold_type).toBe('count');
      expect(DEFAULT_CONFIG.minimum_approvals).toBe(2);
      expect(DEFAULT_CONFIG.approval_percentage).toBe(66);
      expect(DEFAULT_CONFIG.required).toEqual([]);
      expect(DEFAULT_CONFIG.optional).toEqual([]);
      expect(DEFAULT_CONFIG.minimum_optional).toBe(0);
      expect(DEFAULT_CONFIG.allow_blocks).toBe(true);
      expect(DEFAULT_CONFIG.block_threshold).toBe(1);
    });
  });

  // ============ Constructor Tests ============

  describe('constructor', () => {
    it('should initialize with github config', () => {
      const manager = new SignoffManager({
        owner: 'test-org',
        repo: 'test-repo',
      });

      expect(manager.owner).toBe('test-org');
      expect(manager.repo).toBe('test-repo');
    });
  });

  // ============ requestSignoff Tests ============

  describe('requestSignoff', () => {
    let manager;
    let mockAddComment;

    beforeEach(() => {
      mockAddComment = vi.fn().mockResolvedValue({});

      manager = new TestableSignoffManager({ owner: 'test-org', repo: 'test-repo' }, { addComment: mockAddComment });
    });

    it('should create sign-off request with stakeholder checklist', async () => {
      const result = await manager.requestSignoff({
        documentKey: 'prd:user-auth',
        documentType: 'prd',
        reviewIssueNumber: 100,
        stakeholders: ['alice', 'bob', 'charlie'],
        deadline: '2026-01-15',
      });

      expect(mockAddComment).toHaveBeenCalledTimes(1);
      const comment = mockAddComment.mock.calls[0][1];

      expect(comment).toContain('✍️ Sign-off Requested');
      expect(comment).toContain('`prd:user-auth`');
      expect(comment).toContain('PRD');
      expect(comment).toContain('2026-01-15');
      expect(comment).toContain('@alice');
      expect(comment).toContain('@bob');
      expect(comment).toContain('@charlie');
      expect(comment).toContain('⏳ Pending');

      expect(result.reviewIssueNumber).toBe(100);
      expect(result.stakeholders).toHaveLength(3);
      expect(result.status).toBe('signoff_requested');
    });

    it('should merge custom config with defaults', async () => {
      const result = await manager.requestSignoff({
        documentKey: 'prd:test',
        documentType: 'prd',
        reviewIssueNumber: 100,
        stakeholders: ['alice', 'bob', 'charlie', 'dave', 'eve'],
        deadline: '2026-01-15',
        config: {
          minimum_approvals: 5,
          block_threshold: 2,
        },
      });

      expect(result.config.minimum_approvals).toBe(5);
      expect(result.config.block_threshold).toBe(2);
      // Default values preserved
      expect(result.config.threshold_type).toBe('count');
      expect(result.config.allow_blocks).toBe(true);
    });

    it('should format threshold description for count type', async () => {
      await manager.requestSignoff({
        documentKey: 'prd:test',
        documentType: 'prd',
        reviewIssueNumber: 100,
        stakeholders: ['alice', 'bob', 'charlie'],
        deadline: '2026-01-15',
        config: { threshold_type: 'count', minimum_approvals: 2 },
      });

      const comment = mockAddComment.mock.calls[0][1];
      expect(comment).toContain('2 approval(s) required');
    });

    it('should format threshold description for percentage type', async () => {
      await manager.requestSignoff({
        documentKey: 'prd:test',
        documentType: 'prd',
        reviewIssueNumber: 100,
        stakeholders: ['alice', 'bob', 'charlie'],
        deadline: '2026-01-15',
        config: { threshold_type: 'percentage', approval_percentage: 75 },
      });

      const comment = mockAddComment.mock.calls[0][1];
      expect(comment).toContain('75% must approve');
    });

    it('should format threshold description for required_approvers type', async () => {
      await manager.requestSignoff({
        documentKey: 'prd:test',
        documentType: 'prd',
        reviewIssueNumber: 100,
        stakeholders: ['alice', 'bob', 'charlie', 'dave'],
        deadline: '2026-01-15',
        config: {
          threshold_type: 'required_approvers',
          required: ['alice', 'bob'],
          optional: ['charlie', 'dave'],
          minimum_optional: 1,
        },
      });

      const comment = mockAddComment.mock.calls[0][1];
      expect(comment).toContain('Required: alice, bob');
      expect(comment).toContain('1 optional');
    });

    it('should include sign-off instructions', async () => {
      await manager.requestSignoff({
        documentKey: 'prd:test',
        documentType: 'prd',
        reviewIssueNumber: 100,
        stakeholders: ['alice', 'bob'],
        deadline: '2026-01-15',
      });

      const comment = mockAddComment.mock.calls[0][1];
      expect(comment).toContain('/signoff approve');
      expect(comment).toContain('/signoff approve-note');
      expect(comment).toContain('/signoff block');
    });

    it('should validate count threshold against stakeholder list', async () => {
      await expect(
        manager.requestSignoff({
          documentKey: 'prd:test',
          documentType: 'prd',
          reviewIssueNumber: 100,
          stakeholders: ['alice', 'bob'],
          deadline: '2026-01-15',
          config: { threshold_type: 'count', minimum_approvals: 5 },
        }),
      ).rejects.toThrow('minimum_approvals (5) cannot exceed stakeholder count (2)');
    });

    it('should validate required approvers are in stakeholder list', async () => {
      await expect(
        manager.requestSignoff({
          documentKey: 'prd:test',
          documentType: 'prd',
          reviewIssueNumber: 100,
          stakeholders: ['alice', 'bob'],
          deadline: '2026-01-15',
          config: {
            threshold_type: 'required_approvers',
            required: ['alice', 'charlie'], // charlie not in stakeholders
          },
        }),
      ).rejects.toThrow('All required approvers must be in stakeholder list');
    });

    it('should handle @ prefix in stakeholder names', async () => {
      await manager.requestSignoff({
        documentKey: 'prd:test',
        documentType: 'prd',
        reviewIssueNumber: 100,
        stakeholders: ['@alice', '@bob'],
        deadline: '2026-01-15',
      });

      const comment = mockAddComment.mock.calls[0][1];
      expect(comment).toContain('@alice');
      expect(comment).toContain('@bob');
      expect(comment).not.toContain('@@'); // Should not double the @
    });
  });

  // ============ submitSignoff Tests ============

  describe('submitSignoff', () => {
    let manager;
    let mockAddComment;
    let mockGetIssue;
    let mockUpdateIssue;

    beforeEach(() => {
      mockAddComment = vi.fn().mockResolvedValue({});
      mockGetIssue = vi.fn().mockResolvedValue({
        labels: [{ name: 'type:prd-review' }, { name: 'review-status:signoff' }],
      });
      mockUpdateIssue = vi.fn().mockResolvedValue({});

      manager = new TestableSignoffManager(
        { owner: 'test-org', repo: 'test-repo' },
        {
          addComment: mockAddComment,
          getIssue: mockGetIssue,
          updateIssue: mockUpdateIssue,
        },
      );
    });

    it('should submit approved sign-off', async () => {
      const result = await manager.submitSignoff({
        reviewIssueNumber: 100,
        documentKey: 'prd:user-auth',
        documentType: 'prd',
        user: 'alice',
        decision: 'approved',
      });

      expect(mockAddComment).toHaveBeenCalledTimes(1);
      const comment = mockAddComment.mock.calls[0][1];

      expect(comment).toContain('✅');
      expect(comment).toContain('@alice');
      expect(comment).toContain('Approved');

      expect(result.decision).toBe('approved');
      expect(result.user).toBe('alice');
      expect(result.timestamp).toBeDefined();
    });

    it('should submit approved with note', async () => {
      await manager.submitSignoff({
        reviewIssueNumber: 100,
        documentKey: 'prd:test',
        documentType: 'prd',
        user: 'bob',
        decision: 'approved_with_note',
        note: 'Please update docs before implementation',
      });

      const comment = mockAddComment.mock.calls[0][1];

      expect(comment).toContain('✅📝');
      expect(comment).toContain('Approved with Note');
      expect(comment).toContain('Please update docs before implementation');
    });

    it('should submit blocked sign-off with reason', async () => {
      await manager.submitSignoff({
        reviewIssueNumber: 100,
        documentKey: 'prd:test',
        documentType: 'prd',
        user: 'security',
        decision: 'blocked',
        note: 'Security review required',
        feedbackIssueNumber: 42,
      });

      const comment = mockAddComment.mock.calls[0][1];

      expect(comment).toContain('🚫');
      expect(comment).toContain('Blocked');
      expect(comment).toContain('Security review required');
      expect(comment).toContain('#42');
    });

    it('should add signoff label to issue', async () => {
      await manager.submitSignoff({
        reviewIssueNumber: 100,
        documentKey: 'prd:test',
        documentType: 'prd',
        user: 'alice',
        decision: 'approved',
      });

      expect(mockUpdateIssue).toHaveBeenCalledTimes(1);
      const updateCall = mockUpdateIssue.mock.calls[0];

      expect(updateCall[0]).toBe(100);
      expect(updateCall[1].labels).toContain('signoff-alice-approved');
    });

    it('should replace existing signoff label for user', async () => {
      mockGetIssue.mockResolvedValue({
        labels: [
          { name: 'type:prd-review' },
          { name: 'signoff-alice-pending' }, // Previous status
        ],
      });

      await manager.submitSignoff({
        reviewIssueNumber: 100,
        documentKey: 'prd:test',
        documentType: 'prd',
        user: 'alice',
        decision: 'approved',
      });

      const updateCall = mockUpdateIssue.mock.calls[0];

      expect(updateCall[1].labels).not.toContain('signoff-alice-pending');
      expect(updateCall[1].labels).toContain('signoff-alice-approved');
    });

    it('should normalize user name for label', async () => {
      await manager.submitSignoff({
        reviewIssueNumber: 100,
        documentKey: 'prd:test',
        documentType: 'prd',
        user: '@alice',
        decision: 'approved',
      });

      const updateCall = mockUpdateIssue.mock.calls[0];
      expect(updateCall[1].labels).toContain('signoff-alice-approved');
    });

    it('should throw error for invalid decision', async () => {
      await expect(
        manager.submitSignoff({
          reviewIssueNumber: 100,
          documentKey: 'prd:test',
          documentType: 'prd',
          user: 'alice',
          decision: 'invalid',
        }),
      ).rejects.toThrow('Invalid decision: invalid');
    });
  });

  // ============ getSignoffs Tests ============

  describe('getSignoffs', () => {
    let manager;
    let mockGetIssue;

    beforeEach(() => {
      mockGetIssue = vi.fn();

      manager = new TestableSignoffManager({ owner: 'test-org', repo: 'test-repo' }, { getIssue: mockGetIssue });
    });

    it('should parse signoff labels from issue', async () => {
      mockGetIssue.mockResolvedValue({
        labels: [
          { name: 'type:prd-review' },
          { name: 'signoff-alice-approved' },
          { name: 'signoff-bob-approved-with-note' },
          { name: 'signoff-charlie-blocked' },
          { name: 'signoff-dave-pending' },
        ],
      });

      const signoffs = await manager.getSignoffs(100);

      expect(signoffs).toHaveLength(4);
      expect(signoffs).toContainEqual({
        user: 'alice',
        status: 'approved',
        label: 'signoff-alice-approved',
      });
      expect(signoffs).toContainEqual({
        user: 'bob',
        status: 'approved_with_note',
        label: 'signoff-bob-approved-with-note',
      });
      expect(signoffs).toContainEqual({
        user: 'charlie',
        status: 'blocked',
        label: 'signoff-charlie-blocked',
      });
      expect(signoffs).toContainEqual({
        user: 'dave',
        status: 'pending',
        label: 'signoff-dave-pending',
      });
    });

    it('should return empty array when no signoff labels', async () => {
      mockGetIssue.mockResolvedValue({
        labels: [{ name: 'type:prd-review' }, { name: 'review-status:signoff' }],
      });

      const signoffs = await manager.getSignoffs(100);

      expect(signoffs).toHaveLength(0);
    });

    it('should ignore non-signoff labels', async () => {
      mockGetIssue.mockResolvedValue({
        labels: [{ name: 'signoff-alice-approved' }, { name: 'priority:high' }, { name: 'type:prd-feedback' }],
      });

      const signoffs = await manager.getSignoffs(100);

      expect(signoffs).toHaveLength(1);
      expect(signoffs[0].user).toBe('alice');
    });
  });

  // ============ calculateStatus Tests - Count Threshold ============

  describe('calculateStatus - count threshold', () => {
    let manager;

    beforeEach(() => {
      manager = new SignoffManager({ owner: 'test', repo: 'test' });
    });

    it('should return approved when minimum approvals reached', () => {
      const signoffs = [
        { user: 'alice', status: 'approved' },
        { user: 'bob', status: 'approved' },
      ];
      const stakeholders = ['alice', 'bob', 'charlie'];
      const config = { ...DEFAULT_CONFIG, minimum_approvals: 2 };

      const status = manager.calculateStatus(signoffs, stakeholders, config);

      expect(status.status).toBe('approved');
      expect(status.message).toContain('Minimum approvals reached');
    });

    it('should return pending when more approvals needed', () => {
      const signoffs = [{ user: 'alice', status: 'approved' }];
      const stakeholders = ['alice', 'bob', 'charlie'];
      const config = { ...DEFAULT_CONFIG, minimum_approvals: 2 };

      const status = manager.calculateStatus(signoffs, stakeholders, config);

      expect(status.status).toBe('pending');
      expect(status.needed).toBe(1);
      expect(status.message).toContain('Need 1 more approval');
    });

    it('should count approved_with_note as approval', () => {
      const signoffs = [
        { user: 'alice', status: 'approved' },
        { user: 'bob', status: 'approved_with_note' },
      ];
      const stakeholders = ['alice', 'bob', 'charlie'];
      const config = { ...DEFAULT_CONFIG, minimum_approvals: 2 };

      const status = manager.calculateStatus(signoffs, stakeholders, config);

      expect(status.status).toBe('approved');
    });

    it('should return blocked when block threshold reached', () => {
      const signoffs = [
        { user: 'alice', status: 'approved' },
        { user: 'bob', status: 'blocked' },
      ];
      const stakeholders = ['alice', 'bob', 'charlie'];
      const config = { ...DEFAULT_CONFIG, minimum_approvals: 2, block_threshold: 1 };

      const status = manager.calculateStatus(signoffs, stakeholders, config);

      expect(status.status).toBe('blocked');
      expect(status.blockers).toContain('bob');
    });

    it('should not block when allow_blocks is false', () => {
      const signoffs = [
        { user: 'alice', status: 'approved' },
        { user: 'bob', status: 'approved' },
        { user: 'charlie', status: 'blocked' },
      ];
      const stakeholders = ['alice', 'bob', 'charlie'];
      const config = { ...DEFAULT_CONFIG, minimum_approvals: 2, allow_blocks: false };

      const status = manager.calculateStatus(signoffs, stakeholders, config);

      expect(status.status).toBe('approved'); // Blocks ignored
    });

    it('should respect higher block_threshold', () => {
      const signoffs = [
        { user: 'alice', status: 'approved' },
        { user: 'bob', status: 'approved' },
        { user: 'charlie', status: 'blocked' },
      ];
      const stakeholders = ['alice', 'bob', 'charlie', 'dave'];
      const config = { ...DEFAULT_CONFIG, minimum_approvals: 2, block_threshold: 2 };

      const status = manager.calculateStatus(signoffs, stakeholders, config);

      expect(status.status).toBe('approved'); // Only 1 block, threshold is 2
    });
  });

  // ============ calculateStatus Tests - Percentage Threshold ============

  describe('calculateStatus - percentage threshold', () => {
    let manager;

    beforeEach(() => {
      manager = new SignoffManager({ owner: 'test', repo: 'test' });
    });

    it('should return approved when percentage threshold met', () => {
      const signoffs = [
        { user: 'alice', status: 'approved' },
        { user: 'bob', status: 'approved' },
      ];
      const stakeholders = ['alice', 'bob', 'charlie']; // 2/3 = 66.67%
      const config = {
        ...DEFAULT_CONFIG,
        threshold_type: 'percentage',
        approval_percentage: 66,
      };

      const status = manager.calculateStatus(signoffs, stakeholders, config);

      expect(status.status).toBe('approved');
      expect(status.message).toContain('67%');
      expect(status.message).toContain('66%');
    });

    it('should return pending when percentage not met', () => {
      const signoffs = [{ user: 'alice', status: 'approved' }];
      const stakeholders = ['alice', 'bob', 'charlie', 'dave']; // 1/4 = 25%
      const config = {
        ...DEFAULT_CONFIG,
        threshold_type: 'percentage',
        approval_percentage: 50,
      };

      const status = manager.calculateStatus(signoffs, stakeholders, config);

      expect(status.status).toBe('pending');
      expect(status.current_percent).toBe(25);
      expect(status.needed_percent).toBe(50);
      expect(status.needed).toBe(1); // Need 1 more to reach 50%
    });

    it('should calculate correctly for 100% threshold', () => {
      const signoffs = [
        { user: 'alice', status: 'approved' },
        { user: 'bob', status: 'approved' },
      ];
      const stakeholders = ['alice', 'bob', 'charlie'];
      const config = {
        ...DEFAULT_CONFIG,
        threshold_type: 'percentage',
        approval_percentage: 100,
      };

      const status = manager.calculateStatus(signoffs, stakeholders, config);

      expect(status.status).toBe('pending');
      expect(status.needed).toBe(1);
    });
  });

  // ============ calculateStatus Tests - Required Approvers Threshold ============

  describe('calculateStatus - required_approvers threshold', () => {
    let manager;

    beforeEach(() => {
      manager = new SignoffManager({ owner: 'test', repo: 'test' });
    });

    it('should return approved when all required + minimum optional approved', () => {
      const signoffs = [
        { user: 'alice', status: 'approved' },
        { user: 'bob', status: 'approved' },
        { user: 'charlie', status: 'approved' },
      ];
      const stakeholders = ['alice', 'bob', 'charlie', 'dave'];
      const config = {
        ...DEFAULT_CONFIG,
        threshold_type: 'required_approvers',
        required: ['alice', 'bob'],
        optional: ['charlie', 'dave'],
        minimum_optional: 1,
      };

      const status = manager.calculateStatus(signoffs, stakeholders, config);

      expect(status.status).toBe('approved');
      expect(status.message).toContain('All required + minimum optional');
    });

    it('should return pending when required approver missing', () => {
      const signoffs = [
        { user: 'alice', status: 'approved' },
        { user: 'charlie', status: 'approved' },
      ];
      const stakeholders = ['alice', 'bob', 'charlie', 'dave'];
      const config = {
        ...DEFAULT_CONFIG,
        threshold_type: 'required_approvers',
        required: ['alice', 'bob'],
        optional: ['charlie', 'dave'],
        minimum_optional: 1,
      };

      const status = manager.calculateStatus(signoffs, stakeholders, config);

      expect(status.status).toBe('pending');
      expect(status.missing_required).toContain('bob');
      expect(status.message).toContain('bob');
    });

    it('should return pending when optional threshold not met', () => {
      const signoffs = [
        { user: 'alice', status: 'approved' },
        { user: 'bob', status: 'approved' },
        // No optional approvers
      ];
      const stakeholders = ['alice', 'bob', 'charlie', 'dave'];
      const config = {
        ...DEFAULT_CONFIG,
        threshold_type: 'required_approvers',
        required: ['alice', 'bob'],
        optional: ['charlie', 'dave'],
        minimum_optional: 1,
      };

      const status = manager.calculateStatus(signoffs, stakeholders, config);

      expect(status.status).toBe('pending');
      expect(status.optional_needed).toBe(1);
      expect(status.message).toContain('optional approver');
    });

    it('should handle @ prefix in required list', () => {
      const signoffs = [
        { user: 'alice', status: 'approved' },
        { user: 'bob', status: 'approved' },
      ];
      const stakeholders = ['@alice', '@bob'];
      const config = {
        ...DEFAULT_CONFIG,
        threshold_type: 'required_approvers',
        required: ['@alice', '@bob'],
        optional: [],
        minimum_optional: 0,
      };

      const status = manager.calculateStatus(signoffs, stakeholders, config);

      expect(status.status).toBe('approved');
    });
  });

  // ============ isApproved Tests ============

  describe('isApproved', () => {
    let manager;

    beforeEach(() => {
      manager = new SignoffManager({ owner: 'test', repo: 'test' });
    });

    it('should return true when approved', () => {
      const signoffs = [
        { user: 'alice', status: 'approved' },
        { user: 'bob', status: 'approved' },
      ];

      const approved = manager.isApproved(signoffs, ['alice', 'bob', 'charlie'], {
        ...DEFAULT_CONFIG,
        minimum_approvals: 2,
      });

      expect(approved).toBe(true);
    });

    it('should return false when pending', () => {
      const signoffs = [{ user: 'alice', status: 'approved' }];

      const approved = manager.isApproved(signoffs, ['alice', 'bob', 'charlie'], {
        ...DEFAULT_CONFIG,
        minimum_approvals: 2,
      });

      expect(approved).toBe(false);
    });

    it('should return false when blocked', () => {
      const signoffs = [
        { user: 'alice', status: 'approved' },
        { user: 'bob', status: 'blocked' },
      ];

      const approved = manager.isApproved(signoffs, ['alice', 'bob'], {
        ...DEFAULT_CONFIG,
        minimum_approvals: 1,
      });

      expect(approved).toBe(false);
    });
  });

  // ============ getProgressSummary Tests ============

  describe('getProgressSummary', () => {
    let manager;

    beforeEach(() => {
      manager = new SignoffManager({ owner: 'test', repo: 'test' });
    });

    it('should calculate progress summary', () => {
      const signoffs = [
        { user: 'alice', status: 'approved' },
        { user: 'bob', status: 'approved_with_note' },
        { user: 'charlie', status: 'blocked' },
      ];
      const stakeholders = ['alice', 'bob', 'charlie', 'dave', 'eve'];

      const summary = manager.getProgressSummary(signoffs, stakeholders, DEFAULT_CONFIG);

      expect(summary.total_stakeholders).toBe(5);
      expect(summary.approved_count).toBe(2);
      expect(summary.blocked_count).toBe(1);
      expect(summary.pending_count).toBe(2);
      expect(summary.pending_users).toContain('dave');
      expect(summary.pending_users).toContain('eve');
      expect(summary.progress_percent).toBe(40); // 2/5 = 40%
    });

    it('should include status info from calculateStatus', () => {
      const signoffs = [
        { user: 'alice', status: 'approved' },
        { user: 'bob', status: 'approved' },
      ];
      const stakeholders = ['alice', 'bob', 'charlie'];

      const summary = manager.getProgressSummary(signoffs, stakeholders, {
        ...DEFAULT_CONFIG,
        minimum_approvals: 2,
      });

      expect(summary.status).toBe('approved');
      expect(summary.message).toBeDefined();
    });

    it('should handle @ prefix in stakeholder names', () => {
      const signoffs = [{ user: 'alice', status: 'approved' }];
      const stakeholders = ['@alice', '@bob'];

      const summary = manager.getProgressSummary(signoffs, stakeholders, DEFAULT_CONFIG);

      expect(summary.pending_users).toContain('@bob');
      expect(summary.pending_count).toBe(1);
    });
  });

  // ============ sendReminder Tests ============

  describe('sendReminder', () => {
    let manager;
    let mockAddComment;

    beforeEach(() => {
      mockAddComment = vi.fn().mockResolvedValue({});

      manager = new TestableSignoffManager({ owner: 'test-org', repo: 'test-repo' }, { addComment: mockAddComment });
    });

    it('should send reminder to pending users', async () => {
      const result = await manager.sendReminder(100, ['alice', 'bob'], '2026-01-15');

      expect(mockAddComment).toHaveBeenCalledTimes(1);
      const comment = mockAddComment.mock.calls[0][1];

      expect(comment).toContain('⏰ Reminder');
      expect(comment).toContain('@alice');
      expect(comment).toContain('@bob');
      expect(comment).toContain('2026-01-15');

      expect(result.reminded).toEqual(['alice', 'bob']);
      expect(result.deadline).toBe('2026-01-15');
    });

    it('should handle @ prefix in user names', async () => {
      await manager.sendReminder(100, ['@charlie'], '2026-01-20');

      const comment = mockAddComment.mock.calls[0][1];
      expect(comment).toContain('@charlie');
      expect(comment).not.toContain('@@');
    });
  });

  // ============ extendDeadline Tests ============

  describe('extendDeadline', () => {
    let manager;
    let mockAddComment;

    beforeEach(() => {
      mockAddComment = vi.fn().mockResolvedValue({});

      manager = new TestableSignoffManager({ owner: 'test-org', repo: 'test-repo' }, { addComment: mockAddComment });
    });

    it('should post deadline extension comment', async () => {
      const result = await manager.extendDeadline(100, '2026-01-20');

      expect(mockAddComment).toHaveBeenCalledTimes(1);
      const comment = mockAddComment.mock.calls[0][1];

      expect(comment).toContain('📅 Deadline Extended');
      expect(comment).toContain('2026-01-20');

      expect(result.reviewIssueNumber).toBe(100);
      expect(result.newDeadline).toBe('2026-01-20');
    });

    it('should include reason when provided', async () => {
      await manager.extendDeadline(100, '2026-01-25', 'Holiday period');

      const comment = mockAddComment.mock.calls[0][1];

      expect(comment).toContain('Holiday period');
    });
  });

  // ============ Private Method Tests ============

  describe('_getDecisionEmoji', () => {
    let manager;

    beforeEach(() => {
      manager = new SignoffManager({ owner: 'test', repo: 'test' });
    });

    it('should return correct emoji for each decision', () => {
      expect(manager._getDecisionEmoji('approved')).toBe('✅');
      expect(manager._getDecisionEmoji('approved_with_note')).toBe('✅📝');
      expect(manager._getDecisionEmoji('blocked')).toBe('🚫');
      expect(manager._getDecisionEmoji('pending')).toBe('⏳');
      expect(manager._getDecisionEmoji('unknown')).toBe('⏳');
    });
  });

  describe('_getDecisionText', () => {
    let manager;

    beforeEach(() => {
      manager = new SignoffManager({ owner: 'test', repo: 'test' });
    });

    it('should return correct text for each decision', () => {
      expect(manager._getDecisionText('approved')).toBe('Approved');
      expect(manager._getDecisionText('approved_with_note')).toBe('Approved with Note');
      expect(manager._getDecisionText('blocked')).toBe('Blocked');
      expect(manager._getDecisionText('pending')).toBe('Pending');
    });
  });

  describe('_formatThreshold', () => {
    let manager;

    beforeEach(() => {
      manager = new SignoffManager({ owner: 'test', repo: 'test' });
    });

    it('should format count threshold', () => {
      const config = { threshold_type: 'count', minimum_approvals: 3 };
      expect(manager._formatThreshold(config)).toBe('3 approval(s) required');
    });

    it('should format percentage threshold', () => {
      const config = { threshold_type: 'percentage', approval_percentage: 75 };
      expect(manager._formatThreshold(config)).toBe('75% must approve');
    });

    it('should format required_approvers threshold', () => {
      const config = {
        threshold_type: 'required_approvers',
        required: ['alice', 'bob'],
        minimum_optional: 2,
      };
      expect(manager._formatThreshold(config)).toBe('Required: alice, bob + 2 optional');
    });

    it('should return Unknown for invalid threshold type', () => {
      const config = { threshold_type: 'invalid' };
      expect(manager._formatThreshold(config)).toBe('Unknown');
    });
  });

  // ============ Error Handling Tests ============

  describe('error handling', () => {
    it('should throw when GitHub methods not implemented', async () => {
      const manager = new SignoffManager({ owner: 'test', repo: 'test' });

      await expect(manager._getIssue(1)).rejects.toThrow('_getIssue must be implemented by caller via GitHub MCP');

      await expect(manager._addComment(1, 'test')).rejects.toThrow('_addComment must be implemented by caller via GitHub MCP');
    });

    it('should throw for unknown threshold type in calculateStatus', () => {
      const manager = new SignoffManager({ owner: 'test', repo: 'test' });

      expect(() => {
        manager.calculateStatus([], ['alice'], { threshold_type: 'invalid' });
      }).toThrow('Unknown threshold type: invalid');
    });
  });
});
