/**
 * Tests for FeedbackManager - Generic feedback operations for PRD/Epic crowdsourcing
 *
 * Tests cover:
 * - Constants and type definitions
 * - Feedback creation with proper label generation
 * - Feedback querying with various filters
 * - Grouping by section and type
 * - Conflict detection
 * - Status updates and issue closing
 * - Statistics generation
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  FeedbackManager,
  FEEDBACK_TYPES,
  FEEDBACK_STATUS,
  PRIORITY_LEVELS,
} from '../../../src/modules/bmm/lib/crowdsource/feedback-manager.js';

// Create a testable subclass that allows injecting mock implementations
class TestableFeedbackManager extends FeedbackManager {
  constructor(githubConfig, mocks = {}) {
    super(githubConfig);
    this.mocks = mocks;
  }

  async _createIssue(params) {
    if (this.mocks.createIssue) {
      return this.mocks.createIssue(params);
    }
    throw new Error('Mock not provided for _createIssue');
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

  async _closeIssue(issueNumber, reason) {
    if (this.mocks.closeIssue) {
      return this.mocks.closeIssue(issueNumber, reason);
    }
    throw new Error('Mock not provided for _closeIssue');
  }

  async _addComment(issueNumber, body) {
    if (this.mocks.addComment) {
      return this.mocks.addComment(issueNumber, body);
    }
    throw new Error('Mock not provided for _addComment');
  }

  async _searchIssues(query) {
    if (this.mocks.searchIssues) {
      return this.mocks.searchIssues(query);
    }
    throw new Error('Mock not provided for _searchIssues');
  }
}

describe('FeedbackManager', () => {
  // ============ Constants Tests ============

  describe('FEEDBACK_TYPES', () => {
    it('should define all standard feedback types', () => {
      const expectedTypes = ['clarification', 'concern', 'suggestion', 'addition', 'priority'];

      for (const type of expectedTypes) {
        expect(FEEDBACK_TYPES[type]).toBeDefined();
        expect(FEEDBACK_TYPES[type].label).toMatch(/^feedback-type:/);
        expect(FEEDBACK_TYPES[type].emoji).toBeTruthy();
        expect(FEEDBACK_TYPES[type].description).toBeTruthy();
      }
    });

    it('should define epic-specific feedback types', () => {
      const epicTypes = ['scope', 'dependency', 'technical_risk', 'story_split'];

      for (const type of epicTypes) {
        expect(FEEDBACK_TYPES[type]).toBeDefined();
        expect(FEEDBACK_TYPES[type].label).toMatch(/^feedback-type:/);
      }
    });

    it('should have correct label formats', () => {
      expect(FEEDBACK_TYPES.clarification.label).toBe('feedback-type:clarification');
      expect(FEEDBACK_TYPES.concern.label).toBe('feedback-type:concern');
      expect(FEEDBACK_TYPES.technical_risk.label).toBe('feedback-type:technical-risk');
      expect(FEEDBACK_TYPES.story_split.label).toBe('feedback-type:story-split');
    });

    it('should have descriptive emojis for visual identification', () => {
      expect(FEEDBACK_TYPES.clarification.emoji).toBe('📋');
      expect(FEEDBACK_TYPES.concern.emoji).toBe('⚠️');
      expect(FEEDBACK_TYPES.suggestion.emoji).toBe('💡');
      expect(FEEDBACK_TYPES.scope.emoji).toBe('📐');
    });
  });

  describe('FEEDBACK_STATUS', () => {
    it('should define all status values', () => {
      expect(FEEDBACK_STATUS.new).toBe('feedback-status:new');
      expect(FEEDBACK_STATUS.reviewed).toBe('feedback-status:reviewed');
      expect(FEEDBACK_STATUS.incorporated).toBe('feedback-status:incorporated');
      expect(FEEDBACK_STATUS.deferred).toBe('feedback-status:deferred');
    });
  });

  describe('PRIORITY_LEVELS', () => {
    it('should define all priority levels', () => {
      expect(PRIORITY_LEVELS.high).toBe('priority:high');
      expect(PRIORITY_LEVELS.medium).toBe('priority:medium');
      expect(PRIORITY_LEVELS.low).toBe('priority:low');
    });
  });

  // ============ Constructor Tests ============

  describe('constructor', () => {
    it('should initialize with github config', () => {
      const manager = new FeedbackManager({
        owner: 'test-org',
        repo: 'test-repo',
      });

      expect(manager.owner).toBe('test-org');
      expect(manager.repo).toBe('test-repo');
    });
  });

  // ============ createFeedback Tests ============

  describe('createFeedback', () => {
    let manager;
    let mockCreateIssue;
    let mockAddComment;

    beforeEach(() => {
      mockCreateIssue = vi.fn().mockResolvedValue({
        number: 42,
        html_url: 'https://github.com/test-org/test-repo/issues/42',
      });
      mockAddComment = vi.fn().mockResolvedValue({});

      manager = new TestableFeedbackManager(
        { owner: 'test-org', repo: 'test-repo' },
        { createIssue: mockCreateIssue, addComment: mockAddComment },
      );
    });

    it('should create feedback with correct labels for PRD', async () => {
      const result = await manager.createFeedback({
        reviewIssueNumber: 100,
        documentKey: 'prd:user-auth',
        documentType: 'prd',
        section: 'User Stories',
        feedbackType: 'clarification',
        priority: 'high',
        title: 'Unclear login flow',
        content: 'The login flow description is ambiguous',
        submittedBy: 'alice',
      });

      expect(mockCreateIssue).toHaveBeenCalledTimes(1);
      const createCall = mockCreateIssue.mock.calls[0][0];

      expect(createCall.title).toBe('📋 Feedback: Unclear login flow');
      expect(createCall.labels).toContain('type:prd-feedback');
      expect(createCall.labels).toContain('prd:user-auth');
      expect(createCall.labels).toContain('linked-review:100');
      expect(createCall.labels).toContain('feedback-section:user-stories');
      expect(createCall.labels).toContain('feedback-type:clarification');
      expect(createCall.labels).toContain('feedback-status:new');
      expect(createCall.labels).toContain('priority:high');

      expect(result.feedbackId).toBe(42);
      expect(result.status).toBe('new');
    });

    it('should create feedback with correct labels for Epic', async () => {
      const result = await manager.createFeedback({
        reviewIssueNumber: 200,
        documentKey: 'epic:2',
        documentType: 'epic',
        section: 'Story Breakdown',
        feedbackType: 'scope',
        priority: 'medium',
        title: 'Epic too large',
        content: 'Should be split into smaller epics',
        submittedBy: 'bob',
      });

      const createCall = mockCreateIssue.mock.calls[0][0];

      expect(createCall.title).toBe('📐 Feedback: Epic too large');
      expect(createCall.labels).toContain('type:epic-feedback');
      expect(createCall.labels).toContain('epic:2');
      expect(createCall.labels).toContain('feedback-type:scope');
    });

    it('should add link comment to review issue', async () => {
      await manager.createFeedback({
        reviewIssueNumber: 100,
        documentKey: 'prd:user-auth',
        documentType: 'prd',
        section: 'User Stories',
        feedbackType: 'concern',
        priority: 'high',
        title: 'Security risk',
        content: 'Missing security consideration',
        submittedBy: 'security-team',
      });

      expect(mockAddComment).toHaveBeenCalledTimes(1);
      const commentCall = mockAddComment.mock.calls[0];

      expect(commentCall[0]).toBe(100); // review issue number
      expect(commentCall[1]).toContain('@security-team');
      expect(commentCall[1]).toContain('Security risk');
      expect(commentCall[1]).toContain('#42'); // feedback issue number
    });

    it('should include suggested change and rationale in body when provided', async () => {
      await manager.createFeedback({
        reviewIssueNumber: 100,
        documentKey: 'prd:payments',
        documentType: 'prd',
        section: 'FR-3',
        feedbackType: 'suggestion',
        priority: 'medium',
        title: 'Better error handling',
        content: 'Need better error messages',
        suggestedChange: 'Add user-friendly error codes',
        rationale: 'Improves debugging for support team',
        submittedBy: 'dev-lead',
      });

      const createCall = mockCreateIssue.mock.calls[0][0];

      expect(createCall.body).toContain('## Suggested Change');
      expect(createCall.body).toContain('Add user-friendly error codes');
      expect(createCall.body).toContain('## Context/Rationale');
      expect(createCall.body).toContain('Improves debugging for support team');
    });

    it('should throw error for unknown feedback type', async () => {
      await expect(
        manager.createFeedback({
          reviewIssueNumber: 100,
          documentKey: 'prd:test',
          documentType: 'prd',
          section: 'Test',
          feedbackType: 'invalid-type',
          priority: 'medium',
          title: 'Test',
          content: 'Test',
          submittedBy: 'user',
        }),
      ).rejects.toThrow('Unknown feedback type: invalid-type');
    });

    it('should default to medium priority when invalid priority provided', async () => {
      await manager.createFeedback({
        reviewIssueNumber: 100,
        documentKey: 'prd:test',
        documentType: 'prd',
        section: 'Test',
        feedbackType: 'clarification',
        priority: 'invalid',
        title: 'Test',
        content: 'Test',
        submittedBy: 'user',
      });

      const createCall = mockCreateIssue.mock.calls[0][0];
      expect(createCall.labels).toContain('priority:medium');
    });

    it('should normalize section name for labels', async () => {
      await manager.createFeedback({
        reviewIssueNumber: 100,
        documentKey: 'prd:test',
        documentType: 'prd',
        section: 'Non Functional Requirements',
        feedbackType: 'clarification',
        priority: 'low',
        title: 'Test',
        content: 'Test',
        submittedBy: 'user',
      });

      const createCall = mockCreateIssue.mock.calls[0][0];
      expect(createCall.labels).toContain('feedback-section:non-functional-requirements');
    });
  });

  // ============ getFeedback Tests ============

  describe('getFeedback', () => {
    let manager;
    let mockSearchIssues;

    beforeEach(() => {
      mockSearchIssues = vi.fn().mockResolvedValue([
        {
          number: 1,
          html_url: 'https://github.com/test/repo/issues/1',
          title: '📋 Feedback: Test feedback',
          labels: [
            { name: 'type:prd-feedback' },
            { name: 'prd:user-auth' },
            { name: 'feedback-section:user-stories' },
            { name: 'feedback-type:clarification' },
            { name: 'feedback-status:new' },
            { name: 'priority:high' },
          ],
          user: { login: 'alice' },
          created_at: '2026-01-01T00:00:00Z',
          updated_at: '2026-01-02T00:00:00Z',
          body: 'Test body',
        },
      ]);

      manager = new TestableFeedbackManager({ owner: 'test-org', repo: 'test-repo' }, { searchIssues: mockSearchIssues });
    });

    it('should query feedback with document key filter', async () => {
      await manager.getFeedback({
        documentKey: 'prd:user-auth',
        documentType: 'prd',
      });

      expect(mockSearchIssues).toHaveBeenCalledTimes(1);
      const query = mockSearchIssues.mock.calls[0][0];

      expect(query).toContain('repo:test-org/test-repo');
      expect(query).toContain('type:issue');
      expect(query).toContain('is:open');
      expect(query).toContain('label:type:prd-feedback');
      expect(query).toContain('label:prd:user-auth');
    });

    it('should query feedback with review issue filter', async () => {
      await manager.getFeedback({
        reviewIssueNumber: 100,
        documentType: 'prd',
      });

      const query = mockSearchIssues.mock.calls[0][0];
      expect(query).toContain('label:linked-review:100');
    });

    it('should query feedback with status filter', async () => {
      await manager.getFeedback({
        documentType: 'prd',
        status: 'incorporated',
      });

      const query = mockSearchIssues.mock.calls[0][0];
      expect(query).toContain('label:feedback-status:incorporated');
    });

    it('should query feedback with section filter', async () => {
      await manager.getFeedback({
        documentType: 'epic',
        section: 'Story Breakdown',
      });

      const query = mockSearchIssues.mock.calls[0][0];
      expect(query).toContain('label:feedback-section:story-breakdown');
    });

    it('should query feedback with type filter', async () => {
      await manager.getFeedback({
        documentType: 'prd',
        feedbackType: 'concern',
      });

      const query = mockSearchIssues.mock.calls[0][0];
      expect(query).toContain('label:feedback-type:concern');
    });

    it('should parse feedback issues correctly', async () => {
      const results = await manager.getFeedback({
        documentType: 'prd',
        documentKey: 'prd:user-auth',
      });

      expect(results).toHaveLength(1);
      expect(results[0]).toMatchObject({
        id: 1,
        url: 'https://github.com/test/repo/issues/1',
        title: 'Test feedback',
        section: 'user-stories',
        feedbackType: 'clarification',
        status: 'new',
        priority: 'high',
        submittedBy: 'alice',
      });
    });

    it('should handle document key with colon', async () => {
      await manager.getFeedback({
        documentKey: 'prd:complex-key',
        documentType: 'prd',
      });

      const query = mockSearchIssues.mock.calls[0][0];
      expect(query).toContain('label:prd:complex-key');
    });
  });

  // ============ getFeedbackBySection Tests ============

  describe('getFeedbackBySection', () => {
    let manager;
    let mockSearchIssues;

    beforeEach(() => {
      mockSearchIssues = vi.fn().mockResolvedValue([
        {
          number: 1,
          html_url: 'url1',
          title: '📋 Feedback: FB1',
          labels: [
            { name: 'feedback-section:user-stories' },
            { name: 'feedback-type:clarification' },
            { name: 'feedback-status:new' },
            { name: 'priority:high' },
          ],
          user: { login: 'alice' },
          created_at: '2026-01-01',
          updated_at: '2026-01-01',
        },
        {
          number: 2,
          html_url: 'url2',
          title: '💡 Feedback: FB2',
          labels: [
            { name: 'feedback-section:user-stories' },
            { name: 'feedback-type:suggestion' },
            { name: 'feedback-status:new' },
            { name: 'priority:medium' },
          ],
          user: { login: 'bob' },
          created_at: '2026-01-01',
          updated_at: '2026-01-01',
        },
        {
          number: 3,
          html_url: 'url3',
          title: '⚠️ Feedback: FB3',
          labels: [
            { name: 'feedback-section:fr-3' },
            { name: 'feedback-type:concern' },
            { name: 'feedback-status:new' },
            { name: 'priority:high' },
          ],
          user: { login: 'charlie' },
          created_at: '2026-01-01',
          updated_at: '2026-01-01',
        },
      ]);

      manager = new TestableFeedbackManager({ owner: 'test-org', repo: 'test-repo' }, { searchIssues: mockSearchIssues });
    });

    it('should group feedback by section', async () => {
      const bySection = await manager.getFeedbackBySection('prd:user-auth', 'prd');

      expect(Object.keys(bySection)).toHaveLength(2);
      expect(bySection['user-stories']).toHaveLength(2);
      expect(bySection['fr-3']).toHaveLength(1);
    });

    it('should preserve feedback details in grouped results', async () => {
      const bySection = await manager.getFeedbackBySection('prd:user-auth', 'prd');

      expect(bySection['user-stories'][0].submittedBy).toBe('alice');
      expect(bySection['user-stories'][1].submittedBy).toBe('bob');
    });
  });

  // ============ getFeedbackByType Tests ============

  describe('getFeedbackByType', () => {
    let manager;
    let mockSearchIssues;

    beforeEach(() => {
      mockSearchIssues = vi.fn().mockResolvedValue([
        {
          number: 1,
          html_url: 'url1',
          title: '📋 Feedback: FB1',
          labels: [
            { name: 'feedback-section:test' },
            { name: 'feedback-type:clarification' },
            { name: 'feedback-status:new' },
            { name: 'priority:high' },
          ],
          user: { login: 'alice' },
        },
        {
          number: 2,
          html_url: 'url2',
          title: '📋 Feedback: FB2',
          labels: [
            { name: 'feedback-section:test2' },
            { name: 'feedback-type:clarification' },
            { name: 'feedback-status:new' },
            { name: 'priority:medium' },
          ],
          user: { login: 'bob' },
        },
        {
          number: 3,
          html_url: 'url3',
          title: '⚠️ Feedback: FB3',
          labels: [
            { name: 'feedback-section:test' },
            { name: 'feedback-type:concern' },
            { name: 'feedback-status:new' },
            { name: 'priority:high' },
          ],
          user: { login: 'charlie' },
        },
      ]);

      manager = new TestableFeedbackManager({ owner: 'test-org', repo: 'test-repo' }, { searchIssues: mockSearchIssues });
    });

    it('should group feedback by type', async () => {
      const byType = await manager.getFeedbackByType('prd:user-auth', 'prd');

      expect(Object.keys(byType)).toHaveLength(2);
      expect(byType['clarification']).toHaveLength(2);
      expect(byType['concern']).toHaveLength(1);
    });
  });

  // ============ detectConflicts Tests ============

  describe('detectConflicts', () => {
    let manager;
    let mockSearchIssues;

    it('should detect conflicts when multiple concerns on same section', async () => {
      mockSearchIssues = vi.fn().mockResolvedValue([
        {
          number: 1,
          html_url: 'url1',
          title: '⚠️ Feedback: Timeout too short',
          labels: [
            { name: 'feedback-section:fr-5' },
            { name: 'feedback-type:concern' },
            { name: 'feedback-status:new' },
            { name: 'priority:high' },
          ],
          user: { login: 'security' },
        },
        {
          number: 2,
          html_url: 'url2',
          title: '⚠️ Feedback: Timeout too long',
          labels: [
            { name: 'feedback-section:fr-5' },
            { name: 'feedback-type:concern' },
            { name: 'feedback-status:new' },
            { name: 'priority:medium' },
          ],
          user: { login: 'ux-team' },
        },
      ]);

      manager = new TestableFeedbackManager({ owner: 'test-org', repo: 'test-repo' }, { searchIssues: mockSearchIssues });

      const conflicts = await manager.detectConflicts('prd:user-auth', 'prd');

      expect(conflicts).toHaveLength(1);
      expect(conflicts[0].section).toBe('fr-5');
      expect(conflicts[0].conflictType).toBe('multiple_opinions');
      expect(conflicts[0].feedbackItems).toHaveLength(2);
    });

    it('should detect conflicts when concern and suggestion on same section', async () => {
      mockSearchIssues = vi.fn().mockResolvedValue([
        {
          number: 1,
          html_url: 'url1',
          title: '⚠️ Feedback: Risk',
          labels: [
            { name: 'feedback-section:security' },
            { name: 'feedback-type:concern' },
            { name: 'feedback-status:new' },
            { name: 'priority:high' },
          ],
          user: { login: 'security' },
        },
        {
          number: 2,
          html_url: 'url2',
          title: '💡 Feedback: Improvement',
          labels: [
            { name: 'feedback-section:security' },
            { name: 'feedback-type:suggestion' },
            { name: 'feedback-status:new' },
            { name: 'priority:medium' },
          ],
          user: { login: 'dev' },
        },
      ]);

      manager = new TestableFeedbackManager({ owner: 'test-org', repo: 'test-repo' }, { searchIssues: mockSearchIssues });

      const conflicts = await manager.detectConflicts('prd:test', 'prd');

      expect(conflicts).toHaveLength(1);
      expect(conflicts[0].section).toBe('security');
    });

    it('should not detect conflicts for single feedback on section', async () => {
      mockSearchIssues = vi.fn().mockResolvedValue([
        {
          number: 1,
          html_url: 'url1',
          title: '⚠️ Feedback: Single concern',
          labels: [
            { name: 'feedback-section:fr-1' },
            { name: 'feedback-type:concern' },
            { name: 'feedback-status:new' },
            { name: 'priority:high' },
          ],
          user: { login: 'user1' },
        },
      ]);

      manager = new TestableFeedbackManager({ owner: 'test-org', repo: 'test-repo' }, { searchIssues: mockSearchIssues });

      const conflicts = await manager.detectConflicts('prd:test', 'prd');

      expect(conflicts).toHaveLength(0);
    });

    it('should not detect conflicts for multiple clarifications (not opposing)', async () => {
      mockSearchIssues = vi.fn().mockResolvedValue([
        {
          number: 1,
          html_url: 'url1',
          title: '📋 Feedback: Question 1',
          labels: [
            { name: 'feedback-section:fr-1' },
            { name: 'feedback-type:clarification' },
            { name: 'feedback-status:new' },
            { name: 'priority:medium' },
          ],
          user: { login: 'user1' },
        },
        {
          number: 2,
          html_url: 'url2',
          title: '📋 Feedback: Question 2',
          labels: [
            { name: 'feedback-section:fr-1' },
            { name: 'feedback-type:clarification' },
            { name: 'feedback-status:new' },
            { name: 'priority:low' },
          ],
          user: { login: 'user2' },
        },
      ]);

      manager = new TestableFeedbackManager({ owner: 'test-org', repo: 'test-repo' }, { searchIssues: mockSearchIssues });

      const conflicts = await manager.detectConflicts('prd:test', 'prd');

      expect(conflicts).toHaveLength(0);
    });
  });

  // ============ updateFeedbackStatus Tests ============

  describe('updateFeedbackStatus', () => {
    let manager;
    let mockGetIssue;
    let mockUpdateIssue;
    let mockAddComment;
    let mockCloseIssue;

    beforeEach(() => {
      mockGetIssue = vi.fn().mockResolvedValue({
        number: 42,
        labels: [{ name: 'type:prd-feedback' }, { name: 'feedback-status:new' }, { name: 'priority:high' }],
      });
      mockUpdateIssue = vi.fn().mockResolvedValue({});
      mockAddComment = vi.fn().mockResolvedValue({});
      mockCloseIssue = vi.fn().mockResolvedValue({});

      manager = new TestableFeedbackManager(
        { owner: 'test-org', repo: 'test-repo' },
        {
          getIssue: mockGetIssue,
          updateIssue: mockUpdateIssue,
          addComment: mockAddComment,
          closeIssue: mockCloseIssue,
        },
      );
    });

    it('should update status labels correctly', async () => {
      await manager.updateFeedbackStatus(42, 'reviewed');

      expect(mockUpdateIssue).toHaveBeenCalledTimes(1);
      const updateCall = mockUpdateIssue.mock.calls[0];

      expect(updateCall[0]).toBe(42);
      expect(updateCall[1].labels).toContain('feedback-status:reviewed');
      expect(updateCall[1].labels).not.toContain('feedback-status:new');
      expect(updateCall[1].labels).toContain('type:prd-feedback');
      expect(updateCall[1].labels).toContain('priority:high');
    });

    it('should add resolution comment when provided', async () => {
      await manager.updateFeedbackStatus(42, 'incorporated', 'Added to PRD v2');

      expect(mockAddComment).toHaveBeenCalledTimes(1);
      expect(mockAddComment.mock.calls[0][0]).toBe(42);
      expect(mockAddComment.mock.calls[0][1]).toContain('incorporated');
      expect(mockAddComment.mock.calls[0][1]).toContain('Added to PRD v2');
    });

    it('should close issue when status is incorporated', async () => {
      await manager.updateFeedbackStatus(42, 'incorporated');

      expect(mockCloseIssue).toHaveBeenCalledTimes(1);
      expect(mockCloseIssue.mock.calls[0][0]).toBe(42);
      expect(mockCloseIssue.mock.calls[0][1]).toBe('completed');
    });

    it('should close issue when status is deferred', async () => {
      await manager.updateFeedbackStatus(42, 'deferred');

      expect(mockCloseIssue).toHaveBeenCalledTimes(1);
      expect(mockCloseIssue.mock.calls[0][0]).toBe(42);
      expect(mockCloseIssue.mock.calls[0][1]).toBe('not_planned');
    });

    it('should not close issue for reviewed status', async () => {
      await manager.updateFeedbackStatus(42, 'reviewed');

      expect(mockCloseIssue).not.toHaveBeenCalled();
    });

    it('should throw error for unknown status', async () => {
      await expect(manager.updateFeedbackStatus(42, 'invalid-status')).rejects.toThrow('Unknown status: invalid-status');
    });

    it('should return updated status info', async () => {
      const result = await manager.updateFeedbackStatus(42, 'reviewed');

      expect(result).toEqual({
        feedbackId: 42,
        status: 'reviewed',
      });
    });
  });

  // ============ getStats Tests ============

  describe('getStats', () => {
    let manager;
    let mockSearchIssues;

    beforeEach(() => {
      mockSearchIssues = vi.fn().mockResolvedValue([
        {
          number: 1,
          html_url: 'url1',
          title: '📋 Feedback: FB1',
          labels: [
            { name: 'feedback-section:user-stories' },
            { name: 'feedback-type:clarification' },
            { name: 'feedback-status:new' },
            { name: 'priority:high' },
          ],
          user: { login: 'alice' },
        },
        {
          number: 2,
          html_url: 'url2',
          title: '⚠️ Feedback: FB2',
          labels: [
            { name: 'feedback-section:user-stories' },
            { name: 'feedback-type:concern' },
            { name: 'feedback-status:reviewed' },
            { name: 'priority:high' },
          ],
          user: { login: 'bob' },
        },
        {
          number: 3,
          html_url: 'url3',
          title: '💡 Feedback: FB3',
          labels: [
            { name: 'feedback-section:fr-3' },
            { name: 'feedback-type:suggestion' },
            { name: 'feedback-status:new' },
            { name: 'priority:medium' },
          ],
          user: { login: 'alice' },
        },
      ]);

      manager = new TestableFeedbackManager({ owner: 'test-org', repo: 'test-repo' }, { searchIssues: mockSearchIssues });
    });

    it('should calculate total feedback count', async () => {
      const stats = await manager.getStats('prd:user-auth', 'prd');

      expect(stats.total).toBe(3);
    });

    it('should group stats by type', async () => {
      const stats = await manager.getStats('prd:user-auth', 'prd');

      expect(stats.byType).toEqual({
        clarification: 1,
        concern: 1,
        suggestion: 1,
      });
    });

    it('should group stats by status', async () => {
      const stats = await manager.getStats('prd:user-auth', 'prd');

      expect(stats.byStatus).toEqual({
        new: 2,
        reviewed: 1,
      });
    });

    it('should group stats by section', async () => {
      const stats = await manager.getStats('prd:user-auth', 'prd');

      expect(stats.bySection).toEqual({
        'user-stories': 2,
        'fr-3': 1,
      });
    });

    it('should group stats by priority', async () => {
      const stats = await manager.getStats('prd:user-auth', 'prd');

      expect(stats.byPriority).toEqual({
        high: 2,
        medium: 1,
      });
    });

    it('should count unique submitters', async () => {
      const stats = await manager.getStats('prd:user-auth', 'prd');

      expect(stats.submitterCount).toBe(2);
      expect(stats.submitters).toContain('alice');
      expect(stats.submitters).toContain('bob');
    });
  });

  // ============ Private Method Tests ============

  describe('_formatFeedbackBody', () => {
    let manager;

    beforeEach(() => {
      manager = new FeedbackManager({ owner: 'test', repo: 'test' });
    });

    it('should format body with all required sections', () => {
      const body = manager._formatFeedbackBody({
        reviewIssueNumber: 100,
        documentKey: 'prd:test',
        section: 'User Stories',
        feedbackType: 'clarification',
        typeConfig: FEEDBACK_TYPES.clarification,
        priority: 'high',
        content: 'This is unclear',
        submittedBy: 'alice',
      });

      expect(body).toContain('# 📋 Feedback: Clarification');
      expect(body).toContain('**Review:** #100');
      expect(body).toContain('**Document:** `prd:test`');
      expect(body).toContain('**Section:** User Stories');
      expect(body).toContain('**Priority:** high');
      expect(body).toContain('## Feedback');
      expect(body).toContain('This is unclear');
      expect(body).toContain('@alice');
    });

    it('should include suggested change when provided', () => {
      const body = manager._formatFeedbackBody({
        reviewIssueNumber: 100,
        documentKey: 'prd:test',
        section: 'FR-1',
        feedbackType: 'suggestion',
        typeConfig: FEEDBACK_TYPES.suggestion,
        priority: 'medium',
        content: 'Could be improved',
        suggestedChange: 'Use async/await pattern',
        submittedBy: 'bob',
      });

      expect(body).toContain('## Suggested Change');
      expect(body).toContain('Use async/await pattern');
    });

    it('should include rationale when provided', () => {
      const body = manager._formatFeedbackBody({
        reviewIssueNumber: 100,
        documentKey: 'prd:test',
        section: 'NFR-1',
        feedbackType: 'concern',
        typeConfig: FEEDBACK_TYPES.concern,
        priority: 'high',
        content: 'Security risk',
        rationale: 'OWASP Top 10 vulnerability',
        submittedBy: 'security',
      });

      expect(body).toContain('## Context/Rationale');
      expect(body).toContain('OWASP Top 10 vulnerability');
    });
  });

  describe('_parseFeedbackIssue', () => {
    let manager;

    beforeEach(() => {
      manager = new FeedbackManager({ owner: 'test', repo: 'test' });
    });

    it('should parse issue into feedback object', () => {
      const issue = {
        number: 42,
        html_url: 'https://github.com/test/repo/issues/42',
        title: '📋 Feedback: Test feedback title',
        labels: [
          { name: 'feedback-section:user-stories' },
          { name: 'feedback-type:clarification' },
          { name: 'feedback-status:new' },
          { name: 'priority:high' },
        ],
        user: { login: 'alice' },
        created_at: '2026-01-01T00:00:00Z',
        updated_at: '2026-01-02T00:00:00Z',
        body: 'Test body content',
      };

      const parsed = manager._parseFeedbackIssue(issue);

      expect(parsed).toEqual({
        id: 42,
        url: 'https://github.com/test/repo/issues/42',
        title: 'Test feedback title',
        section: 'user-stories',
        feedbackType: 'clarification',
        status: 'new',
        priority: 'high',
        submittedBy: 'alice',
        createdAt: '2026-01-01T00:00:00Z',
        updatedAt: '2026-01-02T00:00:00Z',
        body: 'Test body content',
      });
    });

    it('should strip emoji prefix from title', () => {
      const issue = {
        number: 1,
        html_url: 'url',
        title: '⚠️ Feedback: Important concern',
        labels: [],
        user: null,
      };

      const parsed = manager._parseFeedbackIssue(issue);
      expect(parsed.title).toBe('Important concern');
    });

    it('should handle missing labels gracefully', () => {
      const issue = {
        number: 1,
        html_url: 'url',
        title: 'Feedback: Missing labels',
        labels: [],
        user: { login: 'user' },
      };

      const parsed = manager._parseFeedbackIssue(issue);

      expect(parsed.section).toBeNull();
      expect(parsed.feedbackType).toBeNull();
      expect(parsed.status).toBeNull();
      expect(parsed.priority).toBeNull();
    });
  });

  describe('_extractLabel', () => {
    let manager;

    beforeEach(() => {
      manager = new FeedbackManager({ owner: 'test', repo: 'test' });
    });

    it('should extract value from label with prefix', () => {
      const labels = ['type:prd-feedback', 'feedback-type:concern', 'priority:high'];

      expect(manager._extractLabel(labels, 'feedback-type:')).toBe('concern');
      expect(manager._extractLabel(labels, 'priority:')).toBe('high');
    });

    it('should return null when label not found', () => {
      const labels = ['type:prd-feedback'];

      expect(manager._extractLabel(labels, 'feedback-type:')).toBeNull();
    });
  });

  // ============ Error Handling Tests ============

  describe('error handling', () => {
    it('should throw when GitHub methods not implemented', async () => {
      const manager = new FeedbackManager({ owner: 'test', repo: 'test' });

      await expect(manager._createIssue({})).rejects.toThrow('_createIssue must be implemented by caller via GitHub MCP');

      await expect(manager._getIssue(1)).rejects.toThrow('_getIssue must be implemented by caller via GitHub MCP');

      await expect(manager._searchIssues('')).rejects.toThrow('_searchIssues must be implemented by caller via GitHub MCP');
    });
  });
});
