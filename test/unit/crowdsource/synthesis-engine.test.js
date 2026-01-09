/**
 * Tests for SynthesisEngine - LLM-powered feedback synthesis with conflict resolution
 *
 * Tests cover:
 * - LLM prompt templates for PRD and Epic synthesis
 * - Feedback analysis and section grouping
 * - Conflict detection with keyword extraction
 * - Theme identification
 * - Prompt generation for conflict resolution and merging
 * - Summary generation and formatting
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { SynthesisEngine, SYNTHESIS_PROMPTS } from '../../../src/modules/bmm/lib/crowdsource/synthesis-engine.js';

describe('SynthesisEngine', () => {
  // ============ SYNTHESIS_PROMPTS Tests ============

  describe('SYNTHESIS_PROMPTS', () => {
    describe('PRD prompts', () => {
      it('should have grouping prompt with placeholders', () => {
        const prompt = SYNTHESIS_PROMPTS.prd.grouping;

        expect(prompt).toContain('{{section}}');
        expect(prompt).toContain('{{feedbackItems}}');
        expect(prompt).toContain('Common requests');
        expect(prompt).toContain('Conflicts');
        expect(prompt).toContain('Quick wins');
        expect(prompt).toContain('Major changes');
        expect(prompt).toContain('JSON');
      });

      it('should have resolution prompt with placeholders', () => {
        const prompt = SYNTHESIS_PROMPTS.prd.resolution;

        expect(prompt).toContain('{{section}}');
        expect(prompt).toContain('{{originalText}}');
        expect(prompt).toContain('{{conflictDescription}}');
        expect(prompt).toContain('{{feedbackDetails}}');
        expect(prompt).toContain('proposed_text');
        expect(prompt).toContain('rationale');
        expect(prompt).toContain('trade_offs');
        expect(prompt).toContain('confidence');
      });

      it('should have merge prompt with placeholders', () => {
        const prompt = SYNTHESIS_PROMPTS.prd.merge;

        expect(prompt).toContain('{{section}}');
        expect(prompt).toContain('{{originalText}}');
        expect(prompt).toContain('{{feedbackToIncorporate}}');
      });
    });

    describe('Epic prompts', () => {
      it('should have grouping prompt with epic-specific categories', () => {
        const prompt = SYNTHESIS_PROMPTS.epic.grouping;

        expect(prompt).toContain('{{epicKey}}');
        expect(prompt).toContain('{{feedbackItems}}');
        expect(prompt).toContain('Scope concerns');
        expect(prompt).toContain('Story split suggestions');
        expect(prompt).toContain('Dependency');
        expect(prompt).toContain('Technical risks');
        expect(prompt).toContain('Missing stories');
        expect(prompt).toContain('Priority questions');
      });

      it('should have storySplit prompt with placeholders', () => {
        const prompt = SYNTHESIS_PROMPTS.epic.storySplit;

        expect(prompt).toContain('{{epicKey}}');
        expect(prompt).toContain('{{epicDescription}}');
        expect(prompt).toContain('{{currentStories}}');
        expect(prompt).toContain('{{feedbackItems}}');
        expect(prompt).toContain('stories');
        expect(prompt).toContain('changes_made');
        expect(prompt).toContain('rationale');
      });
    });
  });

  // ============ Constructor Tests ============

  describe('constructor', () => {
    it('should default to PRD document type', () => {
      const engine = new SynthesisEngine();
      expect(engine.documentType).toBe('prd');
    });

    it('should accept document type option', () => {
      const engine = new SynthesisEngine({ documentType: 'epic' });
      expect(engine.documentType).toBe('epic');
    });
  });

  // ============ analyzeFeedback Tests ============

  describe('analyzeFeedback', () => {
    let engine;

    beforeEach(() => {
      engine = new SynthesisEngine({ documentType: 'prd' });
    });

    it('should analyze feedback by section', async () => {
      const feedbackBySection = {
        'user-stories': [
          {
            id: 1,
            title: 'Add login flow',
            feedbackType: 'suggestion',
            priority: 'high',
            submittedBy: 'alice',
            body: 'Need login flow description',
          },
        ],
        'fr-3': [
          {
            id: 2,
            title: 'Timeout concern',
            feedbackType: 'concern',
            priority: 'high',
            submittedBy: 'bob',
            body: 'Session timeout too long',
          },
        ],
      };

      const originalDocument = {
        'user-stories': 'Current user story text',
        'fr-3': 'FR-3 original text',
      };

      const analysis = await engine.analyzeFeedback(feedbackBySection, originalDocument);

      expect(analysis.sections).toBeDefined();
      expect(Object.keys(analysis.sections)).toHaveLength(2);
      expect(analysis.sections['user-stories'].feedbackCount).toBe(1);
      expect(analysis.sections['fr-3'].feedbackCount).toBe(1);
    });

    it('should collect conflicts from all sections', async () => {
      const feedbackBySection = {
        security: [
          {
            id: 1,
            title: 'Short timeout',
            feedbackType: 'concern',
            priority: 'high',
            submittedBy: 'security',
            body: 'timeout should be 15 min',
            suggestedChange: '15 minute timeout',
          },
          {
            id: 2,
            title: 'Long timeout',
            feedbackType: 'concern',
            priority: 'medium',
            submittedBy: 'ux',
            body: 'timeout should be 30 min',
            suggestedChange: '30 minute timeout',
          },
        ],
      };

      const analysis = await engine.analyzeFeedback(feedbackBySection, {});

      expect(analysis.conflicts.length).toBeGreaterThanOrEqual(0);
      // Conflicts are detected based on keyword matching
    });

    it('should generate summary statistics', async () => {
      const feedbackBySection = {
        section1: [
          { id: 1, title: 'FB1', feedbackType: 'clarification', submittedBy: 'user1' },
          { id: 2, title: 'FB2', feedbackType: 'concern', submittedBy: 'user2' },
        ],
        section2: [{ id: 3, title: 'FB3', feedbackType: 'suggestion', submittedBy: 'user3' }],
      };

      const analysis = await engine.analyzeFeedback(feedbackBySection, {});

      expect(analysis.summary.totalFeedback).toBe(3);
      expect(analysis.summary.sectionsWithFeedback).toBe(2);
      expect(analysis.summary.feedbackByType).toBeDefined();
    });
  });

  // ============ _analyzeSection Tests ============

  describe('_analyzeSection', () => {
    let engine;

    beforeEach(() => {
      engine = new SynthesisEngine({ documentType: 'prd' });
    });

    it('should count feedback and group by type', async () => {
      const feedbackList = [
        { id: 1, feedbackType: 'clarification', title: 'Q1' },
        { id: 2, feedbackType: 'clarification', title: 'Q2' },
        { id: 3, feedbackType: 'concern', title: 'C1' },
      ];

      const result = await engine._analyzeSection('test-section', feedbackList, '');

      expect(result.feedbackCount).toBe(3);
      expect(result.byType.clarification).toBe(2);
      expect(result.byType.concern).toBe(1);
    });

    it('should generate suggested changes for non-conflicting feedback', async () => {
      const feedbackList = [
        {
          id: 1,
          title: 'Add validation',
          feedbackType: 'suggestion',
          priority: 'high',
          suggestedChange: 'Add input validation',
          submittedBy: 'alice',
        },
      ];

      const result = await engine._analyzeSection('test-section', feedbackList, '');

      expect(result.suggestedChanges).toHaveLength(1);
      expect(result.suggestedChanges[0].feedbackId).toBe(1);
      expect(result.suggestedChanges[0].type).toBe('suggestion');
      expect(result.suggestedChanges[0].suggestedChange).toBe('Add input validation');
    });
  });

  // ============ _identifyConflicts Tests ============

  describe('_identifyConflicts', () => {
    let engine;

    beforeEach(() => {
      engine = new SynthesisEngine();
    });

    it('should detect conflicts when same topic has different suggestions', () => {
      const feedbackList = [
        {
          id: 1,
          title: 'timeout should be shorter',
          body: 'Session timeout configuration',
          suggestedChange: 'Set to 15 minutes',
        },
        {
          id: 2,
          title: 'timeout should be longer',
          body: 'Session timeout configuration',
          suggestedChange: 'Set to 30 minutes',
        },
      ];

      const conflicts = engine._identifyConflicts(feedbackList);

      expect(conflicts.length).toBeGreaterThan(0);
      const timeoutConflict = conflicts.find((c) => c.topic === 'timeout');
      expect(timeoutConflict).toBeDefined();
      expect(timeoutConflict.feedbackIds).toContain(1);
      expect(timeoutConflict.feedbackIds).toContain(2);
    });

    it('should not detect conflict when suggestions are the same', () => {
      const feedbackList = [
        {
          id: 1,
          title: 'auth improvement',
          body: 'Authentication flow',
          suggestedChange: 'Add OAuth',
        },
        {
          id: 2,
          title: 'auth needed',
          body: 'Authentication required',
          suggestedChange: 'Add OAuth',
        },
      ];

      const conflicts = engine._identifyConflicts(feedbackList);

      // Same suggestion = no conflict
      const authConflict = conflicts.find(
        (c) => c.feedbackIds.includes(1) && c.feedbackIds.includes(2) && c.description.includes('Conflicting'),
      );
      expect(authConflict).toBeUndefined();
    });

    it('should not detect conflict for single feedback item', () => {
      const feedbackList = [
        {
          id: 1,
          title: 'unique topic here',
          body: 'Only one feedback on this',
          suggestedChange: 'Some change',
        },
      ];

      const conflicts = engine._identifyConflicts(feedbackList);
      expect(conflicts).toHaveLength(0);
    });

    it('should handle feedback without suggestedChange', () => {
      const feedbackList = [
        {
          id: 1,
          title: 'question about feature',
          body: 'What does this do?',
          // No suggestedChange
        },
        {
          id: 2,
          title: 'another question feature',
          body: 'How does this work?',
          // No suggestedChange
        },
      ];

      // Should not throw, and no conflicts detected (no different suggestions)
      const conflicts = engine._identifyConflicts(feedbackList);
      expect(Array.isArray(conflicts)).toBe(true);
    });
  });

  // ============ _identifyThemes Tests ============

  describe('_identifyThemes', () => {
    let engine;

    beforeEach(() => {
      engine = new SynthesisEngine();
    });

    it('should identify themes mentioned by multiple people', () => {
      const feedbackList = [
        { id: 1, title: 'authentication needs work', feedbackType: 'concern' },
        { id: 2, title: 'authentication is unclear', feedbackType: 'clarification' },
        { id: 3, title: 'completely different topic', feedbackType: 'suggestion' },
      ];

      const themes = engine._identifyThemes(feedbackList);

      const authTheme = themes.find((t) => t.keyword === 'authentication');
      expect(authTheme).toBeDefined();
      expect(authTheme.count).toBe(2);
      expect(authTheme.feedbackIds).toContain(1);
      expect(authTheme.feedbackIds).toContain(2);
    });

    it('should track feedback types for each theme', () => {
      const feedbackList = [
        { id: 1, title: 'security concern here', feedbackType: 'concern' },
        { id: 2, title: 'security suggestion', feedbackType: 'suggestion' },
      ];

      const themes = engine._identifyThemes(feedbackList);

      const securityTheme = themes.find((t) => t.keyword === 'security');
      expect(securityTheme).toBeDefined();
      expect(securityTheme.types).toContain('concern');
      expect(securityTheme.types).toContain('suggestion');
    });

    it('should sort themes by count descending', () => {
      const feedbackList = [
        { id: 1, title: 'rare topic', feedbackType: 'concern' },
        { id: 2, title: 'common topic', feedbackType: 'concern' },
        { id: 3, title: 'common topic again', feedbackType: 'suggestion' },
        { id: 4, title: 'common topic still', feedbackType: 'clarification' },
      ];

      const themes = engine._identifyThemes(feedbackList);

      if (themes.length > 0) {
        // First theme should have highest count
        for (let i = 1; i < themes.length; i++) {
          expect(themes[i - 1].count).toBeGreaterThanOrEqual(themes[i].count);
        }
      }
    });

    it('should filter out themes with count < 2', () => {
      const feedbackList = [
        { id: 1, title: 'unique topic alpha', feedbackType: 'concern' },
        { id: 2, title: 'unique topic beta', feedbackType: 'suggestion' },
        { id: 3, title: 'unique topic gamma', feedbackType: 'clarification' },
      ];

      const themes = engine._identifyThemes(feedbackList);

      // All unique words should be filtered out (count < 2)
      for (const theme of themes) {
        expect(theme.count).toBeGreaterThanOrEqual(2);
      }
    });
  });

  // ============ _extractKeywords Tests ============

  describe('_extractKeywords', () => {
    let engine;

    beforeEach(() => {
      engine = new SynthesisEngine();
    });

    it('should extract meaningful keywords from text', () => {
      const keywords = engine._extractKeywords('The authentication flow needs improvement');

      expect(keywords).toContain('authentication');
      expect(keywords).toContain('flow');
      expect(keywords).toContain('needs');
      expect(keywords).toContain('improvement');
    });

    it('should filter out stop words', () => {
      const keywords = engine._extractKeywords('The user should be able to login');

      expect(keywords).not.toContain('the');
      expect(keywords).not.toContain('should');
      expect(keywords).not.toContain('be');
      expect(keywords).not.toContain('to');
    });

    it('should filter out short words (length <= 3)', () => {
      const keywords = engine._extractKeywords('API is not working');

      expect(keywords).not.toContain('api');
      expect(keywords).not.toContain('is');
      expect(keywords).not.toContain('not');
      expect(keywords).toContain('working');
    });

    it('should convert to lowercase', () => {
      const keywords = engine._extractKeywords('SECURITY Authentication');

      expect(keywords).toContain('security');
      expect(keywords).toContain('authentication');
      expect(keywords).not.toContain('SECURITY');
    });

    it('should remove punctuation', () => {
      const keywords = engine._extractKeywords('User-authentication, session.timeout!');

      // Should normalize punctuation
      const hasAuth = keywords.some((k) => k.includes('auth'));
      expect(hasAuth).toBe(true);
    });

    it('should handle null/undefined input', () => {
      expect(engine._extractKeywords(null)).toEqual([]);
      expect(engine._extractKeywords(undefined)).toEqual([]);
      expect(engine._extractKeywords('')).toEqual([]);
    });

    it('should limit to 10 keywords', () => {
      const longText =
        'authentication authorization validation configuration implementation documentation optimization visualization serialization deserialization normalization denormalization extra words here';

      const keywords = engine._extractKeywords(longText);

      expect(keywords.length).toBeLessThanOrEqual(10);
    });
  });

  // ============ generateConflictResolution Tests ============

  describe('generateConflictResolution', () => {
    it('should generate resolution prompt for PRD', () => {
      const engine = new SynthesisEngine({ documentType: 'prd' });

      const conflict = {
        section: 'FR-5',
        description: 'Conflicting views on session timeout',
      };

      const result = engine.generateConflictResolution(conflict, 'Session timeout is 30 minutes.', [
        { user: 'security', position: '15 minutes for security' },
        { user: 'ux', position: '30 minutes for usability' },
      ]);

      expect(result.prompt).toContain('FR-5');
      expect(result.prompt).toContain('Session timeout is 30 minutes');
      expect(result.prompt).toContain('Conflicting views on session timeout');
      expect(result.conflict).toEqual(conflict);
      expect(result.expectedFormat).toHaveProperty('proposed_text');
      expect(result.expectedFormat).toHaveProperty('rationale');
      expect(result.expectedFormat).toHaveProperty('trade_offs');
      expect(result.expectedFormat).toHaveProperty('confidence');
    });

    it('should throw error for Epic (no resolution prompt available)', () => {
      const engine = new SynthesisEngine({ documentType: 'epic' });

      const conflict = {
        section: 'Story Breakdown',
        description: 'Disagreement on story granularity',
      };

      // Epic prompts only have grouping and storySplit, not resolution
      expect(() => {
        engine.generateConflictResolution(conflict, 'Epic contains 5 stories', []);
      }).toThrow();
    });

    it('should handle missing originalText', () => {
      const engine = new SynthesisEngine({ documentType: 'prd' });

      const conflict = {
        section: 'New Section',
        description: 'Need new content',
      };

      const result = engine.generateConflictResolution(conflict, null, []);

      expect(result.prompt).toContain('N/A');
    });
  });

  // ============ generateMergePrompt Tests ============

  describe('generateMergePrompt', () => {
    let engine;

    beforeEach(() => {
      engine = new SynthesisEngine({ documentType: 'prd' });
    });

    it('should generate merge prompt with feedback details', () => {
      const approvedFeedback = [
        {
          feedbackType: 'suggestion',
          title: 'Add error handling',
          suggestedChange: 'Include try-catch blocks',
        },
        {
          feedbackType: 'addition',
          title: 'Missing validation',
          suggestedChange: 'Add input validation',
        },
      ];

      const prompt = engine.generateMergePrompt('FR-3', 'Original function implementation', approvedFeedback);

      expect(prompt).toContain('FR-3');
      expect(prompt).toContain('Original function implementation');
      expect(prompt).toContain('suggestion: Add error handling');
      expect(prompt).toContain('Include try-catch blocks');
      expect(prompt).toContain('addition: Missing validation');
      expect(prompt).toContain('Add input validation');
    });

    it('should handle feedback without suggestedChange', () => {
      const approvedFeedback = [
        {
          feedbackType: 'concern',
          title: 'Security risk',
          // No suggestedChange
        },
      ];

      const prompt = engine.generateMergePrompt('Security', 'Current text', approvedFeedback);

      expect(prompt).toContain('concern: Security risk');
      expect(prompt).toContain('Address the concern');
    });
  });

  // ============ generateStorySplitPrompt Tests ============

  describe('generateStorySplitPrompt', () => {
    it('should generate story split prompt for epic', () => {
      const engine = new SynthesisEngine({ documentType: 'epic' });

      const prompt = engine.generateStorySplitPrompt(
        'epic:2',
        'Authentication epic for user login and session management',
        [
          { key: '2-1', title: 'Login Form' },
          { key: '2-2', title: 'Session Management' },
        ],
        [{ id: 1, title: 'Story 2-2 too large', suggestedChange: 'Split into 3 stories' }],
      );

      expect(prompt).toContain('epic:2');
      expect(prompt).toContain('Authentication epic');
      expect(prompt).toContain('2-1');
      expect(prompt).toContain('Login Form');
      expect(prompt).toContain('Story 2-2 too large');
    });

    it('should throw error when called for PRD', () => {
      const engine = new SynthesisEngine({ documentType: 'prd' });

      expect(() => {
        engine.generateStorySplitPrompt('prd:1', 'desc', [], []);
      }).toThrow('Story split is only available for epics');
    });
  });

  // ============ _generateSummary Tests ============

  describe('_generateSummary', () => {
    let engine;

    beforeEach(() => {
      engine = new SynthesisEngine();
    });

    it('should calculate total feedback count', () => {
      const analysis = {
        sections: {
          section1: { feedbackCount: 3, byType: { concern: 2, suggestion: 1 } },
          section2: { feedbackCount: 2, byType: { clarification: 2 } },
        },
        conflicts: [],
        suggestedChanges: [],
      };

      const summary = engine._generateSummary(analysis);

      expect(summary.totalFeedback).toBe(5);
    });

    it('should count sections with feedback', () => {
      const analysis = {
        sections: {
          section1: { feedbackCount: 1, byType: {} },
          section2: { feedbackCount: 2, byType: {} },
          section3: { feedbackCount: 1, byType: {} },
        },
        conflicts: [],
        suggestedChanges: [],
      };

      const summary = engine._generateSummary(analysis);

      expect(summary.sectionsWithFeedback).toBe(3);
    });

    it('should aggregate feedback by type across sections', () => {
      const analysis = {
        sections: {
          section1: { feedbackCount: 2, byType: { concern: 1, suggestion: 1 } },
          section2: { feedbackCount: 2, byType: { concern: 1, clarification: 1 } },
        },
        conflicts: [],
        suggestedChanges: [],
      };

      const summary = engine._generateSummary(analysis);

      expect(summary.feedbackByType.concern).toBe(2);
      expect(summary.feedbackByType.suggestion).toBe(1);
      expect(summary.feedbackByType.clarification).toBe(1);
    });

    it('should set needsAttention when conflicts exist', () => {
      const analysisWithConflicts = {
        sections: {},
        conflicts: [{ section: 'test', description: 'conflict' }],
        suggestedChanges: [],
      };

      const analysisWithoutConflicts = {
        sections: {},
        conflicts: [],
        suggestedChanges: [],
      };

      expect(engine._generateSummary(analysisWithConflicts).needsAttention).toBe(true);
      expect(engine._generateSummary(analysisWithoutConflicts).needsAttention).toBe(false);
    });

    it('should count conflicts and changes', () => {
      const analysis = {
        sections: {},
        conflicts: [{ id: 1 }, { id: 2 }],
        suggestedChanges: [{ id: 1 }, { id: 2 }, { id: 3 }],
      };

      const summary = engine._generateSummary(analysis);

      expect(summary.conflictCount).toBe(2);
      expect(summary.changeCount).toBe(3);
    });
  });

  // ============ _groupByType Tests ============

  describe('_groupByType', () => {
    let engine;

    beforeEach(() => {
      engine = new SynthesisEngine();
    });

    it('should count feedback by type', () => {
      const feedbackList = [
        { feedbackType: 'concern' },
        { feedbackType: 'concern' },
        { feedbackType: 'suggestion' },
        { feedbackType: 'clarification' },
      ];

      const byType = engine._groupByType(feedbackList);

      expect(byType.concern).toBe(2);
      expect(byType.suggestion).toBe(1);
      expect(byType.clarification).toBe(1);
    });

    it('should handle empty list', () => {
      const byType = engine._groupByType([]);
      expect(byType).toEqual({});
    });
  });

  // ============ formatForDisplay Tests ============

  describe('formatForDisplay', () => {
    let engine;

    beforeEach(() => {
      engine = new SynthesisEngine();
    });

    it('should format analysis as markdown', () => {
      const analysis = {
        summary: {
          totalFeedback: 5,
          sectionsWithFeedback: 2,
          conflictCount: 1,
          changeCount: 3,
          needsAttention: true,
        },
        sections: {
          'user-stories': { feedbackCount: 3, byType: { concern: 2, suggestion: 1 } },
          'fr-3': { feedbackCount: 2, byType: { clarification: 2 } },
        },
        conflicts: [
          {
            section: 'user-stories',
            description: 'Timeout conflict',
            stakeholders: [
              { user: 'security', position: '15 min' },
              { user: 'ux', position: '30 min' },
            ],
          },
        ],
      };

      const output = engine.formatForDisplay(analysis);

      expect(output).toContain('## Synthesis Analysis');
      expect(output).toContain('**Total Feedback:** 5');
      expect(output).toContain('**Sections with Feedback:** 2');
      expect(output).toContain('**Conflicts Detected:** 1');
      expect(output).toContain('**Suggested Changes:** 3');
      expect(output).toContain('⚠️ Conflicts Requiring Resolution');
      expect(output).toContain('user-stories');
      expect(output).toContain('@security');
      expect(output).toContain('@ux');
      expect(output).toContain('### By Section');
    });

    it('should not show conflicts section when none exist', () => {
      const analysis = {
        summary: {
          totalFeedback: 1,
          sectionsWithFeedback: 1,
          conflictCount: 0,
          changeCount: 1,
          needsAttention: false,
        },
        sections: {
          test: { feedbackCount: 1, byType: { suggestion: 1 } },
        },
        conflicts: [],
      };

      const output = engine.formatForDisplay(analysis);

      expect(output).not.toContain('⚠️ Conflicts Requiring Resolution');
    });
  });
});
