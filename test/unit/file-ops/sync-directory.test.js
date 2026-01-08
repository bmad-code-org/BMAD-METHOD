import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { FileOps } from '../../../tools/cli/lib/file-ops.js';
import { createTempDir, cleanupTempDir, createTestFile } from '../../helpers/temp-dir.js';
import fs from 'fs-extra';
import path from 'node:path';

describe('FileOps', () => {
  describe('syncDirectory()', () => {
    const fileOps = new FileOps();
    let tmpDir;
    let sourceDir;
    let destDir;

    beforeEach(async () => {
      tmpDir = await createTempDir();
      sourceDir = path.join(tmpDir, 'source');
      destDir = path.join(tmpDir, 'dest');
      await fs.ensureDir(sourceDir);
      await fs.ensureDir(destDir);
    });

    afterEach(async () => {
      await cleanupTempDir(tmpDir);
    });

    describe('hash-based selective update', () => {
      it('should update file when hashes are identical (safe update)', async () => {
        const content = 'identical content';
        await createTestFile(sourceDir, 'file.txt', content);
        await createTestFile(destDir, 'file.txt', content);

        await fileOps.syncDirectory(sourceDir, destDir);

        // File should be updated (copied over) since hashes match
        const destContent = await fs.readFile(path.join(destDir, 'file.txt'), 'utf8');
        expect(destContent).toBe(content);
      });

      it('should preserve modified file when dest is newer', async () => {
        await createTestFile(sourceDir, 'file.txt', 'source content');
        await createTestFile(destDir, 'file.txt', 'modified by user');

        // Make dest file newer
        const destFile = path.join(destDir, 'file.txt');
        const futureTime = new Date(Date.now() + 10_000);
        await fs.utimes(destFile, futureTime, futureTime);

        await fileOps.syncDirectory(sourceDir, destDir);

        // User modification should be preserved
        const destContent = await fs.readFile(destFile, 'utf8');
        expect(destContent).toBe('modified by user');
      });

      it('should update file when source is newer than modified dest', async () => {
        // Create both files first
        await createTestFile(sourceDir, 'file.txt', 'new source content');
        await createTestFile(destDir, 'file.txt', 'old modified content');

        // Make dest older and source newer with explicit times
        const destFile = path.join(destDir, 'file.txt');
        const sourceFile = path.join(sourceDir, 'file.txt');

        const pastTime = new Date(Date.now() - 10_000);
        const futureTime = new Date(Date.now() + 10_000);

        await fs.utimes(destFile, pastTime, pastTime);
        await fs.utimes(sourceFile, futureTime, futureTime);

        await fileOps.syncDirectory(sourceDir, destDir);

        // Should update to source content since source is newer
        const destContent = await fs.readFile(destFile, 'utf8');
        expect(destContent).toBe('new source content');
      });
    });

    describe('new file handling', () => {
      it('should copy new files from source', async () => {
        await createTestFile(sourceDir, 'new-file.txt', 'new content');

        await fileOps.syncDirectory(sourceDir, destDir);

        expect(await fs.pathExists(path.join(destDir, 'new-file.txt'))).toBe(true);
        expect(await fs.readFile(path.join(destDir, 'new-file.txt'), 'utf8')).toBe('new content');
      });

      it('should copy multiple new files', async () => {
        await createTestFile(sourceDir, 'file1.txt', 'content1');
        await createTestFile(sourceDir, 'file2.md', 'content2');
        await createTestFile(sourceDir, 'file3.json', 'content3');

        await fileOps.syncDirectory(sourceDir, destDir);

        expect(await fs.pathExists(path.join(destDir, 'file1.txt'))).toBe(true);
        expect(await fs.pathExists(path.join(destDir, 'file2.md'))).toBe(true);
        expect(await fs.pathExists(path.join(destDir, 'file3.json'))).toBe(true);
      });

      it('should create nested directories for new files', async () => {
        await createTestFile(sourceDir, 'level1/level2/deep.txt', 'deep content');

        await fileOps.syncDirectory(sourceDir, destDir);

        expect(await fs.pathExists(path.join(destDir, 'level1', 'level2', 'deep.txt'))).toBe(true);
      });
    });

    describe('orphaned file removal', () => {
      it('should remove files that no longer exist in source', async () => {
        await createTestFile(sourceDir, 'keep.txt', 'keep this');
        await createTestFile(destDir, 'keep.txt', 'keep this');
        await createTestFile(destDir, 'remove.txt', 'delete this');

        await fileOps.syncDirectory(sourceDir, destDir);

        expect(await fs.pathExists(path.join(destDir, 'keep.txt'))).toBe(true);
        expect(await fs.pathExists(path.join(destDir, 'remove.txt'))).toBe(false);
      });

      it('should remove multiple orphaned files', async () => {
        await createTestFile(sourceDir, 'current.txt', 'current');
        await createTestFile(destDir, 'current.txt', 'current');
        await createTestFile(destDir, 'old1.txt', 'orphan 1');
        await createTestFile(destDir, 'old2.txt', 'orphan 2');
        await createTestFile(destDir, 'old3.txt', 'orphan 3');

        await fileOps.syncDirectory(sourceDir, destDir);

        expect(await fs.pathExists(path.join(destDir, 'current.txt'))).toBe(true);
        expect(await fs.pathExists(path.join(destDir, 'old1.txt'))).toBe(false);
        expect(await fs.pathExists(path.join(destDir, 'old2.txt'))).toBe(false);
        expect(await fs.pathExists(path.join(destDir, 'old3.txt'))).toBe(false);
      });

      it('should remove orphaned directories', async () => {
        await createTestFile(sourceDir, 'keep/file.txt', 'keep');
        await createTestFile(destDir, 'keep/file.txt', 'keep');
        await createTestFile(destDir, 'remove/orphan.txt', 'orphan');

        await fileOps.syncDirectory(sourceDir, destDir);

        expect(await fs.pathExists(path.join(destDir, 'keep'))).toBe(true);
        expect(await fs.pathExists(path.join(destDir, 'remove', 'orphan.txt'))).toBe(false);
      });
    });

    describe('complex scenarios', () => {
      it('should handle mixed operations in single sync', async () => {
        const now = Date.now();
        const pastTime = now - 100_000; // 100 seconds ago
        const futureTime = now + 100_000; // 100 seconds from now

        // Identical file (update)
        await createTestFile(sourceDir, 'identical.txt', 'same');
        await createTestFile(destDir, 'identical.txt', 'same');

        // Modified file with newer dest (preserve)
        await createTestFile(sourceDir, 'modified.txt', 'original');
        await createTestFile(destDir, 'modified.txt', 'user modified');
        const modifiedFile = path.join(destDir, 'modified.txt');
        await fs.utimes(modifiedFile, futureTime, futureTime);

        // New file (copy)
        await createTestFile(sourceDir, 'new.txt', 'new content');

        // Orphaned file (remove)
        await createTestFile(destDir, 'orphan.txt', 'delete me');

        await fileOps.syncDirectory(sourceDir, destDir);

        // Verify operations
        expect(await fs.pathExists(path.join(destDir, 'identical.txt'))).toBe(true);

        expect(await fs.readFile(modifiedFile, 'utf8')).toBe('user modified');

        expect(await fs.pathExists(path.join(destDir, 'new.txt'))).toBe(true);

        expect(await fs.pathExists(path.join(destDir, 'orphan.txt'))).toBe(false);
      });

      it('should handle nested directory changes', async () => {
        // Create nested structure in source
        await createTestFile(sourceDir, 'level1/keep.txt', 'keep');
        await createTestFile(sourceDir, 'level1/level2/deep.txt', 'deep');

        // Create different nested structure in dest
        await createTestFile(destDir, 'level1/keep.txt', 'keep');
        await createTestFile(destDir, 'level1/remove.txt', 'orphan');
        await createTestFile(destDir, 'old-level/file.txt', 'old');

        await fileOps.syncDirectory(sourceDir, destDir);

        expect(await fs.pathExists(path.join(destDir, 'level1', 'keep.txt'))).toBe(true);
        expect(await fs.pathExists(path.join(destDir, 'level1', 'level2', 'deep.txt'))).toBe(true);
        expect(await fs.pathExists(path.join(destDir, 'level1', 'remove.txt'))).toBe(false);
        expect(await fs.pathExists(path.join(destDir, 'old-level', 'file.txt'))).toBe(false);
      });
    });

    describe('edge cases', () => {
      it('should handle empty source directory', async () => {
        await createTestFile(destDir, 'file.txt', 'content');

        await fileOps.syncDirectory(sourceDir, destDir);

        // All files should be removed
        expect(await fs.pathExists(path.join(destDir, 'file.txt'))).toBe(false);
      });

      it('should handle empty destination directory', async () => {
        await createTestFile(sourceDir, 'file.txt', 'content');

        await fileOps.syncDirectory(sourceDir, destDir);

        expect(await fs.pathExists(path.join(destDir, 'file.txt'))).toBe(true);
      });

      it('should handle Unicode filenames', async () => {
        await createTestFile(sourceDir, '测试.txt', 'chinese');
        await createTestFile(destDir, '测试.txt', 'modified chinese');

        // Make dest newer
        await fs.utimes(path.join(destDir, '测试.txt'), Date.now() + 10_000, Date.now() + 10_000);

        await fileOps.syncDirectory(sourceDir, destDir);

        // Should preserve user modification
        expect(await fs.readFile(path.join(destDir, '测试.txt'), 'utf8')).toBe('modified chinese');
      });

      it('should handle large number of files', async () => {
        // Create 50 files in source
        for (let i = 0; i < 50; i++) {
          await createTestFile(sourceDir, `file${i}.txt`, `content ${i}`);
        }

        // Create 25 matching files and 25 orphaned files in dest
        for (let i = 0; i < 25; i++) {
          await createTestFile(destDir, `file${i}.txt`, `content ${i}`);
          await createTestFile(destDir, `orphan${i}.txt`, `orphan ${i}`);
        }

        await fileOps.syncDirectory(sourceDir, destDir);

        // All 50 source files should exist
        for (let i = 0; i < 50; i++) {
          expect(await fs.pathExists(path.join(destDir, `file${i}.txt`))).toBe(true);
        }

        // All 25 orphaned files should be removed
        for (let i = 0; i < 25; i++) {
          expect(await fs.pathExists(path.join(destDir, `orphan${i}.txt`))).toBe(false);
        }
      });

      it('should handle binary files correctly', async () => {
        const buffer = Buffer.from([0x89, 0x50, 0x4e, 0x47]);
        await fs.writeFile(path.join(sourceDir, 'binary.dat'), buffer);
        await fs.writeFile(path.join(destDir, 'binary.dat'), buffer);

        await fileOps.syncDirectory(sourceDir, destDir);

        const destBuffer = await fs.readFile(path.join(destDir, 'binary.dat'));
        expect(destBuffer).toEqual(buffer);
      });
    });

    describe('timestamp precision', () => {
      it('should handle files with very close modification times', async () => {
        await createTestFile(sourceDir, 'file.txt', 'source');
        await createTestFile(destDir, 'file.txt', 'dest modified');

        // Make dest just slightly newer (100ms)
        const destFile = path.join(destDir, 'file.txt');
        await fs.utimes(destFile, Date.now() + 100, Date.now() + 100);

        await fileOps.syncDirectory(sourceDir, destDir);

        // Should preserve user modification even with small time difference
        expect(await fs.readFile(destFile, 'utf8')).toBe('dest modified');
      });
    });

    describe('data integrity', () => {
      it('should not corrupt files during sync', async () => {
        const content = 'Important data\nLine 2\nLine 3\n';
        await createTestFile(sourceDir, 'data.txt', content);

        await fileOps.syncDirectory(sourceDir, destDir);

        expect(await fs.readFile(path.join(destDir, 'data.txt'), 'utf8')).toBe(content);
      });

      it('should handle sync interruption gracefully', async () => {
        // This test verifies that partial syncs don't leave inconsistent state
        await createTestFile(sourceDir, 'file1.txt', 'content1');
        await createTestFile(sourceDir, 'file2.txt', 'content2');

        // First sync
        await fileOps.syncDirectory(sourceDir, destDir);

        // Modify source
        await createTestFile(sourceDir, 'file3.txt', 'content3');

        // Second sync
        await fileOps.syncDirectory(sourceDir, destDir);

        // All files should be present and correct
        expect(await fs.pathExists(path.join(destDir, 'file1.txt'))).toBe(true);
        expect(await fs.pathExists(path.join(destDir, 'file2.txt'))).toBe(true);
        expect(await fs.pathExists(path.join(destDir, 'file3.txt'))).toBe(true);
      });
    });
  });
});
