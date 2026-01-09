/**
 * Tests for CacheManager PRD and Epic Extensions
 *
 * Tests cover:
 * - PRD read/write operations
 * - Epic read/write operations with PRD lineage
 * - Status updates and filtering
 * - User task queries (getPrdsNeedingAttention, getEpicsNeedingAttention)
 * - Extended statistics
 * - Document staleness checking
 * - Atomic file operations
 *
 * Uses real temporary directory for testing actual file I/O operations.
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import fs from 'fs';
import path from 'path';
import os from 'os';

// Import the CacheManager (CommonJS module)
const { CacheManager, DOCUMENT_TYPES, CACHE_META_FILENAME } = await import('../../../src/modules/bmm/lib/cache/cache-manager.js');

describe('CacheManager PRD/Epic Extensions', () => {
  let cacheManager;
  let testCacheDir;

  beforeEach(() => {
    // Create a real temporary directory for each test
    testCacheDir = fs.mkdtempSync(path.join(os.tmpdir(), 'bmad-cache-test-'));

    cacheManager = new CacheManager({
      cacheDir: testCacheDir,
      stalenessThresholdMinutes: 5,
      github: { owner: 'test-org', repo: 'test-repo' },
    });
  });

  afterEach(() => {
    // Clean up the temporary directory
    if (testCacheDir && fs.existsSync(testCacheDir)) {
      fs.rmSync(testCacheDir, { recursive: true, force: true });
    }
  });

  // ============ DOCUMENT_TYPES Tests ============

  describe('DOCUMENT_TYPES', () => {
    it('should define all document types', () => {
      expect(DOCUMENT_TYPES.story).toBe('story');
      expect(DOCUMENT_TYPES.prd).toBe('prd');
      expect(DOCUMENT_TYPES.epic).toBe('epic');
    });
  });

  // ============ Directory Initialization Tests ============

  describe('directory initialization', () => {
    it('should create subdirectories for all document types', () => {
      expect(fs.existsSync(path.join(testCacheDir, 'stories'))).toBe(true);
      expect(fs.existsSync(path.join(testCacheDir, 'prds'))).toBe(true);
      expect(fs.existsSync(path.join(testCacheDir, 'epics'))).toBe(true);
    });

    it('should create meta file on first access', () => {
      cacheManager.loadMeta();
      expect(fs.existsSync(path.join(testCacheDir, CACHE_META_FILENAME))).toBe(true);
    });
  });

  // ============ Metadata Migration Tests ============

  describe('metadata migration', () => {
    it('should migrate v1 metadata to v2', () => {
      // Write v1 metadata directly
      const v1Meta = {
        version: '1.0.0',
        stories: { 'story-1': { github_issue: 10 } },
      };
      fs.writeFileSync(path.join(testCacheDir, CACHE_META_FILENAME), JSON.stringify(v1Meta), 'utf8');

      // Create new manager to trigger migration
      const manager = new CacheManager({
        cacheDir: testCacheDir,
        github: {},
      });

      const meta = manager.loadMeta();

      expect(meta.version).toBe('2.0.0');
      expect(meta.prds).toBeDefined();
      expect(meta.epics).toBeDefined();
      expect(meta.stories).toEqual({ 'story-1': { github_issue: 10 } });
    });

    it('should not migrate already v2 metadata', () => {
      // Write v2 metadata directly
      const v2Meta = {
        version: '2.0.0',
        prds: { 'existing-prd': { status: 'approved' } },
        epics: { 'existing-epic': { status: 'draft' } },
        stories: {},
      };
      fs.writeFileSync(path.join(testCacheDir, CACHE_META_FILENAME), JSON.stringify(v2Meta), 'utf8');

      const manager = new CacheManager({
        cacheDir: testCacheDir,
        github: {},
      });

      const meta = manager.loadMeta();

      expect(meta.prds['existing-prd'].status).toBe('approved');
      expect(meta.epics['existing-epic'].status).toBe('draft');
    });
  });

  // ============ PRD Methods Tests ============

  describe('PRD operations', () => {
    describe('getPrdPath', () => {
      it('should return correct path for PRD', () => {
        const prdPath = cacheManager.getPrdPath('user-auth');
        expect(prdPath).toBe(path.join(testCacheDir, 'prds', 'user-auth.md'));
      });
    });

    describe('writePrd', () => {
      it('should write PRD content and update metadata', () => {
        const content = '# PRD: User Authentication\n\nThis is the content.';
        const prdMeta = {
          review_issue: 100,
          version: 1,
          status: 'draft',
          stakeholders: ['@alice', '@bob'],
          owner: '@sarah',
        };

        const result = cacheManager.writePrd('user-auth', content, prdMeta);

        expect(result.prdKey).toBe('user-auth');
        expect(result.hash).toBeDefined();
        expect(result.hash.length).toBe(64); // SHA-256 hex

        // Verify file was written
        const prdPath = cacheManager.getPrdPath('user-auth');
        expect(fs.existsSync(prdPath)).toBe(true);
        expect(fs.readFileSync(prdPath, 'utf8')).toBe(content);

        // Verify metadata was updated
        const meta = cacheManager.loadMeta();
        expect(meta.prds['user-auth'].status).toBe('draft');
        expect(meta.prds['user-auth'].stakeholders).toEqual(['@alice', '@bob']);
      });

      it('should preserve existing metadata when not provided', () => {
        // First write with full metadata
        cacheManager.writePrd('user-auth', 'Content v1', {
          review_issue: 100,
          version: 2,
          status: 'feedback',
          stakeholders: ['@alice'],
        });

        // Write with partial metadata
        cacheManager.writePrd('user-auth', 'Content v2', { version: 3 });

        // Verify metadata was merged
        const meta = cacheManager.loadMeta();
        expect(meta.prds['user-auth'].version).toBe(3);
        expect(meta.prds['user-auth'].review_issue).toBe(100);
        expect(meta.prds['user-auth'].stakeholders).toEqual(['@alice']);
      });
    });

    describe('readPrd', () => {
      it('should return null for non-existent PRD', () => {
        const result = cacheManager.readPrd('non-existent');
        expect(result).toBeNull();
      });

      it('should return PRD content with metadata', () => {
        const content = '# PRD: User Auth';
        cacheManager.writePrd('user-auth', content, {
          version: 1,
          status: 'draft',
        });

        const result = cacheManager.readPrd('user-auth');

        expect(result.content).toBe(content);
        expect(result.meta.version).toBe(1);
        expect(result.isStale).toBe(false);
      });

      it('should mark stale PRDs with warning', () => {
        // Write PRD first
        cacheManager.writePrd('user-auth', '# PRD Content', { status: 'draft' });

        // Manually set old timestamp
        const meta = cacheManager.loadMeta();
        meta.prds['user-auth'].cache_timestamp = '2020-01-01T00:00:00Z';
        cacheManager.saveMeta(meta);

        const result = cacheManager.readPrd('user-auth');

        expect(result.isStale).toBe(true);
        expect(result.warning).toContain('stale');
      });

      it('should ignore staleness when option set', () => {
        // Write PRD first
        cacheManager.writePrd('user-auth', '# PRD Content', { status: 'draft' });

        // Manually set old timestamp
        const meta = cacheManager.loadMeta();
        meta.prds['user-auth'].cache_timestamp = '2020-01-01T00:00:00Z';
        cacheManager.saveMeta(meta);

        const result = cacheManager.readPrd('user-auth', { ignoreStale: true });

        expect(result.isStale).toBe(true);
        expect(result.warning).toBeUndefined();
      });
    });

    describe('updatePrdStatus', () => {
      it('should update PRD status', () => {
        cacheManager.writePrd('user-auth', '# PRD', { status: 'draft' });

        cacheManager.updatePrdStatus('user-auth', 'feedback');

        const meta = cacheManager.loadMeta();
        expect(meta.prds['user-auth'].status).toBe('feedback');
      });

      it('should throw error for non-existent PRD', () => {
        expect(() => {
          cacheManager.updatePrdStatus('non-existent', 'feedback');
        }).toThrow('PRD not found in cache: non-existent');
      });
    });

    describe('listCachedPrds', () => {
      it('should return all cached PRD keys', () => {
        cacheManager.writePrd('user-auth', '# PRD 1', { status: 'draft' });
        cacheManager.writePrd('payments', '# PRD 2', { status: 'approved' });
        cacheManager.writePrd('mobile', '# PRD 3', { status: 'feedback' });

        const prds = cacheManager.listCachedPrds();

        expect(prds).toContain('user-auth');
        expect(prds).toContain('payments');
        expect(prds).toContain('mobile');
        expect(prds.length).toBe(3);
      });
    });

    describe('getPrdsByStatus', () => {
      it('should filter PRDs by status', () => {
        cacheManager.writePrd('user-auth', '# PRD 1', { status: 'feedback' });
        cacheManager.writePrd('payments', '# PRD 2', { status: 'approved' });
        cacheManager.writePrd('mobile', '# PRD 3', { status: 'feedback' });

        const feedbackPrds = cacheManager.getPrdsByStatus('feedback');

        expect(feedbackPrds).toHaveLength(2);
        expect(feedbackPrds.map((p) => p.prdKey)).toContain('user-auth');
        expect(feedbackPrds.map((p) => p.prdKey)).toContain('mobile');
      });
    });

    describe('getPrdsNeedingAttention', () => {
      it('should find PRDs needing feedback from user', () => {
        cacheManager.writePrd('user-auth', '# PRD 1', {
          status: 'feedback',
          stakeholders: ['@alice', '@bob'],
        });
        cacheManager.writePrd('payments', '# PRD 2', {
          status: 'signoff',
          stakeholders: ['@alice', '@charlie'],
        });
        cacheManager.writePrd('mobile', '# PRD 3', {
          status: 'feedback',
          stakeholders: ['@charlie'],
        });

        const tasks = cacheManager.getPrdsNeedingAttention('alice');

        expect(tasks.pendingFeedback).toHaveLength(1);
        expect(tasks.pendingFeedback[0].prdKey).toBe('user-auth');
        expect(tasks.pendingSignoff).toHaveLength(1);
        expect(tasks.pendingSignoff[0].prdKey).toBe('payments');
      });

      it('should handle @ prefix in username', () => {
        cacheManager.writePrd('user-auth', '# PRD 1', {
          status: 'feedback',
          stakeholders: ['alice', 'bob'],
        });

        const tasks = cacheManager.getPrdsNeedingAttention('@alice');

        expect(tasks.pendingFeedback).toHaveLength(1);
      });
    });

    describe('deletePrd', () => {
      it('should delete PRD file and metadata', () => {
        cacheManager.writePrd('user-auth', '# PRD', { status: 'draft' });
        const prdPath = cacheManager.getPrdPath('user-auth');

        expect(fs.existsSync(prdPath)).toBe(true);

        cacheManager.deletePrd('user-auth');

        expect(fs.existsSync(prdPath)).toBe(false);
        expect(cacheManager.loadMeta().prds['user-auth']).toBeUndefined();
      });
    });
  });

  // ============ Epic Methods Tests ============

  describe('Epic operations', () => {
    describe('getEpicPath', () => {
      it('should return correct path for Epic', () => {
        const epicPath = cacheManager.getEpicPath('2');
        expect(epicPath).toBe(path.join(testCacheDir, 'epics', 'epic-2.md'));
      });
    });

    describe('writeEpic', () => {
      it('should write Epic content with PRD lineage', () => {
        const content = '# Epic 2: Core Authentication';
        const epicMeta = {
          github_issue: 50,
          prd_key: 'user-auth',
          version: 1,
          status: 'draft',
          stories: ['2-1-login', '2-2-logout'],
        };

        const result = cacheManager.writeEpic('2', content, epicMeta);

        expect(result.epicKey).toBe('2');
        expect(result.hash).toBeDefined();
        expect(result.hash.length).toBe(64);

        // Verify file was written
        const epicPath = cacheManager.getEpicPath('2');
        expect(fs.existsSync(epicPath)).toBe(true);
        expect(fs.readFileSync(epicPath, 'utf8')).toBe(content);
      });

      it('should track PRD lineage in metadata', () => {
        cacheManager.writeEpic('2', 'Epic content', {
          prd_key: 'user-auth',
          status: 'draft',
        });

        const meta = cacheManager.loadMeta();
        expect(meta.epics['2'].prd_key).toBe('user-auth');
      });
    });

    describe('readEpic', () => {
      it('should return null for non-existent Epic', () => {
        const result = cacheManager.readEpic('999');
        expect(result).toBeNull();
      });

      it('should return Epic content with metadata', () => {
        const content = '# Epic 2: Auth';
        cacheManager.writeEpic('2', content, {
          prd_key: 'user-auth',
          version: 1,
          status: 'draft',
        });

        const result = cacheManager.readEpic('2');

        expect(result.content).toBe(content);
        expect(result.meta.prd_key).toBe('user-auth');
        expect(result.isStale).toBe(false);
      });
    });

    describe('updateEpicStatus', () => {
      it('should update Epic status', () => {
        cacheManager.writeEpic('2', '# Epic', { status: 'draft' });

        cacheManager.updateEpicStatus('2', 'feedback');

        const meta = cacheManager.loadMeta();
        expect(meta.epics['2'].status).toBe('feedback');
      });

      it('should throw error for non-existent Epic', () => {
        expect(() => {
          cacheManager.updateEpicStatus('999', 'feedback');
        }).toThrow('Epic not found in cache: 999');
      });
    });

    describe('listCachedEpics', () => {
      it('should return all cached Epic keys', () => {
        cacheManager.writeEpic('1', '# Epic 1', { status: 'approved' });
        cacheManager.writeEpic('2', '# Epic 2', { status: 'draft' });
        cacheManager.writeEpic('3', '# Epic 3', { status: 'feedback' });

        const epics = cacheManager.listCachedEpics();

        expect(epics).toContain('1');
        expect(epics).toContain('2');
        expect(epics).toContain('3');
        expect(epics.length).toBe(3);
      });
    });

    describe('getEpicsByPrd', () => {
      it('should filter Epics by source PRD', () => {
        cacheManager.writeEpic('1', '# Epic 1', { prd_key: 'user-auth', status: 'approved' });
        cacheManager.writeEpic('2', '# Epic 2', { prd_key: 'user-auth', status: 'draft' });
        cacheManager.writeEpic('3', '# Epic 3', { prd_key: 'payments', status: 'draft' });

        const authEpics = cacheManager.getEpicsByPrd('user-auth');

        expect(authEpics).toHaveLength(2);
        expect(authEpics.map((e) => e.epicKey)).toContain('1');
        expect(authEpics.map((e) => e.epicKey)).toContain('2');
      });
    });

    describe('getEpicsNeedingAttention', () => {
      it('should find Epics needing feedback from user', () => {
        cacheManager.writeEpic('1', '# Epic 1', {
          status: 'feedback',
          stakeholders: ['@alice', '@bob'],
        });
        cacheManager.writeEpic('2', '# Epic 2', {
          status: 'draft',
          stakeholders: ['@alice'],
        });
        cacheManager.writeEpic('3', '# Epic 3', {
          status: 'feedback',
          stakeholders: ['@charlie'],
        });

        const tasks = cacheManager.getEpicsNeedingAttention('alice');

        expect(tasks.pendingFeedback).toHaveLength(1);
        expect(tasks.pendingFeedback[0].epicKey).toBe('1');
      });
    });

    describe('deleteEpic', () => {
      it('should delete Epic file and metadata', () => {
        cacheManager.writeEpic('2', '# Epic', { status: 'draft' });
        const epicPath = cacheManager.getEpicPath('2');

        expect(fs.existsSync(epicPath)).toBe(true);

        cacheManager.deleteEpic('2');

        expect(fs.existsSync(epicPath)).toBe(false);
        expect(cacheManager.loadMeta().epics['2']).toBeUndefined();
      });
    });
  });

  // ============ Unified Task Query Tests ============

  describe('getMyTasks', () => {
    it('should return combined PRD and Epic tasks', () => {
      cacheManager.writePrd('user-auth', '# PRD 1', {
        status: 'feedback',
        stakeholders: ['@alice'],
      });
      cacheManager.writePrd('payments', '# PRD 2', {
        status: 'signoff',
        stakeholders: ['@alice'],
      });
      cacheManager.writeEpic('2', '# Epic 2', {
        status: 'feedback',
        stakeholders: ['@alice'],
      });

      const tasks = cacheManager.getMyTasks('alice');

      expect(tasks.prds.pendingFeedback).toHaveLength(1);
      expect(tasks.prds.pendingSignoff).toHaveLength(1);
      expect(tasks.epics.pendingFeedback).toHaveLength(1);
    });

    it('should return empty arrays when user has no tasks', () => {
      cacheManager.writePrd('user-auth', '# PRD 1', {
        status: 'feedback',
        stakeholders: ['@bob'],
      });

      const tasks = cacheManager.getMyTasks('alice');

      expect(tasks.prds.pendingFeedback).toHaveLength(0);
      expect(tasks.prds.pendingSignoff).toHaveLength(0);
      expect(tasks.epics.pendingFeedback).toHaveLength(0);
    });
  });

  // ============ Extended Statistics Tests ============

  describe('getExtendedStats', () => {
    it('should return comprehensive statistics', () => {
      cacheManager.writeStory('2-1-login', '# Story', { github_issue: 10 });
      cacheManager.writePrd('user-auth', '# PRD 1', { status: 'feedback' });
      cacheManager.writePrd('payments', '# PRD 2', { status: 'approved' });
      cacheManager.writePrd('mobile', '# PRD 3', { status: 'feedback' });
      cacheManager.writeEpic('1', '# Epic 1', { status: 'approved' });
      cacheManager.writeEpic('2', '# Epic 2', { status: 'draft' });

      const stats = cacheManager.getExtendedStats();

      expect(stats.story_count).toBe(1);
      expect(stats.prd_count).toBe(3);
      expect(stats.prds_by_status).toEqual({
        feedback: 2,
        approved: 1,
      });
      expect(stats.epic_count).toBe(2);
      expect(stats.epics_by_status).toEqual({
        approved: 1,
        draft: 1,
      });
      expect(stats.prd_size_kb).toBeGreaterThanOrEqual(0);
      expect(stats.epic_size_kb).toBeGreaterThanOrEqual(0);
    });
  });

  // ============ Document Staleness Tests ============

  describe('_isDocumentStale', () => {
    it('should return true for missing metadata', () => {
      expect(cacheManager._isDocumentStale(null)).toBe(true);
      expect(cacheManager._isDocumentStale({})).toBe(true);
    });

    it('should return true for old cache timestamp', () => {
      const oldMeta = {
        cache_timestamp: '2020-01-01T00:00:00Z',
      };

      expect(cacheManager._isDocumentStale(oldMeta)).toBe(true);
    });

    it('should return false for recent cache timestamp', () => {
      const recentMeta = {
        cache_timestamp: new Date().toISOString(),
      };

      expect(cacheManager._isDocumentStale(recentMeta)).toBe(false);
    });
  });

  // ============ Atomic Write Tests ============

  describe('atomic writes', () => {
    it('should write PRD atomically (no temp files left)', () => {
      cacheManager.writePrd('user-auth', '# Content', { status: 'draft' });

      const prdPath = cacheManager.getPrdPath('user-auth');
      const tempPath = `${prdPath}.tmp`;

      expect(fs.existsSync(prdPath)).toBe(true);
      expect(fs.existsSync(tempPath)).toBe(false);
    });

    it('should write Epic atomically (no temp files left)', () => {
      cacheManager.writeEpic('2', '# Content', { status: 'draft' });

      const epicPath = cacheManager.getEpicPath('2');
      const tempPath = `${epicPath}.tmp`;

      expect(fs.existsSync(epicPath)).toBe(true);
      expect(fs.existsSync(tempPath)).toBe(false);
    });

    it('should save metadata atomically (no temp files left)', () => {
      cacheManager.writePrd('user-auth', '# Content', { status: 'draft' });

      const metaPath = path.join(testCacheDir, CACHE_META_FILENAME);
      const tempPath = `${metaPath}.tmp`;

      expect(fs.existsSync(metaPath)).toBe(true);
      expect(fs.existsSync(tempPath)).toBe(false);
    });
  });

  // ============ Edge Cases ============

  describe('edge cases', () => {
    it('should handle empty stakeholder arrays', () => {
      cacheManager.writePrd('user-auth', '# PRD', {
        status: 'feedback',
        stakeholders: [],
      });

      const tasks = cacheManager.getPrdsNeedingAttention('alice');

      expect(tasks.pendingFeedback).toHaveLength(0);
    });

    it('should handle missing stakeholders property', () => {
      cacheManager.writePrd('user-auth', '# PRD', { status: 'feedback' });

      const tasks = cacheManager.getPrdsNeedingAttention('alice');

      expect(tasks.pendingFeedback).toHaveLength(0);
    });

    it('should handle PRDs with no status', () => {
      cacheManager.writePrd('user-auth', '# PRD', { version: 1 });

      // Status defaults to 'draft' in writePrd
      const feedbackPrds = cacheManager.getPrdsByStatus('feedback');
      expect(feedbackPrds).toHaveLength(0);

      const draftPrds = cacheManager.getPrdsByStatus('draft');
      expect(draftPrds).toHaveLength(1);
    });

    it('should handle special characters in content', () => {
      const content = '# PRD: Auth\n\n## Special chars: "quotes", <tags>, & ampersands';
      cacheManager.writePrd('user-auth', content, { status: 'draft' });

      const result = cacheManager.readPrd('user-auth');
      expect(result.content).toBe(content);
    });

    it('should handle unicode content', () => {
      const content = '# PRD: 认证系统\n\nUnicode: 日本語, 한국어, emoji 🚀';
      cacheManager.writePrd('unicode-prd', content, { status: 'draft' });

      const result = cacheManager.readPrd('unicode-prd');
      expect(result.content).toBe(content);
    });

    it('should handle concurrent writes to different PRDs', () => {
      // Write multiple PRDs in sequence (simulating concurrent writes)
      for (let i = 0; i < 10; i++) {
        cacheManager.writePrd(`prd-${i}`, `# PRD ${i}`, { status: 'draft' });
      }

      const prds = cacheManager.listCachedPrds();
      expect(prds.length).toBe(10);

      // Verify all are readable
      for (let i = 0; i < 10; i++) {
        const result = cacheManager.readPrd(`prd-${i}`);
        expect(result.content).toBe(`# PRD ${i}`);
      }
    });
  });

  // ============ Content Hash Tests ============

  describe('content hashing', () => {
    it('should generate consistent hash for same content', () => {
      const content = '# PRD Content';
      const result1 = cacheManager.writePrd('prd-1', content, { status: 'draft' });
      const result2 = cacheManager.writePrd('prd-2', content, { status: 'draft' });

      expect(result1.hash).toBe(result2.hash);
    });

    it('should generate different hash for different content', () => {
      const result1 = cacheManager.writePrd('prd-1', '# Content A', { status: 'draft' });
      const result2 = cacheManager.writePrd('prd-2', '# Content B', { status: 'draft' });

      expect(result1.hash).not.toBe(result2.hash);
    });

    it('should detect content changes via hasContentChanged (story method)', () => {
      cacheManager.writeStory('story-1', '# Original', { github_issue: 10 });

      expect(cacheManager.hasContentChanged('story-1', '# Original')).toBe(false);
      expect(cacheManager.hasContentChanged('story-1', '# Modified')).toBe(true);
    });
  });
});
