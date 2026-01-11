import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { FileOps } from '../../../tools/cli/lib/file-ops.js';
import { createTempDir, cleanupTempDir, createTestFile } from '../../helpers/temp-dir.js';
import fs from 'fs-extra';
import path from 'node:path';

describe('FileOps', () => {
  describe('copyDirectory()', () => {
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

    describe('basic copying', () => {
      it('should copy a single file', async () => {
        await createTestFile(sourceDir, 'test.txt', 'content');

        await fileOps.copyDirectory(sourceDir, destDir);

        const destFile = path.join(destDir, 'test.txt');
        expect(await fs.pathExists(destFile)).toBe(true);
        expect(await fs.readFile(destFile, 'utf8')).toBe('content');
      });

      it('should copy multiple files', async () => {
        await createTestFile(sourceDir, 'file1.txt', 'content1');
        await createTestFile(sourceDir, 'file2.md', 'content2');
        await createTestFile(sourceDir, 'file3.json', '{}');

        await fileOps.copyDirectory(sourceDir, destDir);

        expect(await fs.pathExists(path.join(destDir, 'file1.txt'))).toBe(true);
        expect(await fs.pathExists(path.join(destDir, 'file2.md'))).toBe(true);
        expect(await fs.pathExists(path.join(destDir, 'file3.json'))).toBe(true);
      });

      it('should copy nested directory structure', async () => {
        await createTestFile(sourceDir, 'root.txt', 'root');
        await createTestFile(sourceDir, 'level1/file.txt', 'level1');
        await createTestFile(sourceDir, 'level1/level2/deep.txt', 'deep');

        await fileOps.copyDirectory(sourceDir, destDir);

        expect(await fs.pathExists(path.join(destDir, 'root.txt'))).toBe(true);
        expect(await fs.pathExists(path.join(destDir, 'level1', 'file.txt'))).toBe(true);
        expect(await fs.pathExists(path.join(destDir, 'level1', 'level2', 'deep.txt'))).toBe(true);
      });

      it('should create destination directory if it does not exist', async () => {
        const newDest = path.join(tmpDir, 'new-dest');
        await createTestFile(sourceDir, 'test.txt', 'content');

        await fileOps.copyDirectory(sourceDir, newDest);

        expect(await fs.pathExists(newDest)).toBe(true);
        expect(await fs.pathExists(path.join(newDest, 'test.txt'))).toBe(true);
      });
    });

    describe('overwrite behavior', () => {
      it('should overwrite existing files by default', async () => {
        await createTestFile(sourceDir, 'file.txt', 'new content');
        await createTestFile(destDir, 'file.txt', 'old content');

        await fileOps.copyDirectory(sourceDir, destDir);

        const content = await fs.readFile(path.join(destDir, 'file.txt'), 'utf8');
        expect(content).toBe('new content');
      });

      it('should preserve file content when overwriting', async () => {
        await createTestFile(sourceDir, 'data.json', '{"new": true}');
        await createTestFile(destDir, 'data.json', '{"old": true}');
        await createTestFile(destDir, 'keep.txt', 'preserve this');

        await fileOps.copyDirectory(sourceDir, destDir);

        expect(await fs.readFile(path.join(destDir, 'data.json'), 'utf8')).toBe('{"new": true}');
        // Files not in source should be preserved
        expect(await fs.pathExists(path.join(destDir, 'keep.txt'))).toBe(true);
      });
    });

    describe('filtering with shouldIgnore', () => {
      it('should filter out .git directories', async () => {
        await createTestFile(sourceDir, 'file.txt', 'content');
        await createTestFile(sourceDir, '.git/config', 'git config');

        await fileOps.copyDirectory(sourceDir, destDir);

        expect(await fs.pathExists(path.join(destDir, 'file.txt'))).toBe(true);
        expect(await fs.pathExists(path.join(destDir, '.git'))).toBe(false);
      });

      it('should filter out node_modules directories', async () => {
        await createTestFile(sourceDir, 'package.json', '{}');
        await createTestFile(sourceDir, 'node_modules/lib/code.js', 'code');

        await fileOps.copyDirectory(sourceDir, destDir);

        expect(await fs.pathExists(path.join(destDir, 'package.json'))).toBe(true);
        expect(await fs.pathExists(path.join(destDir, 'node_modules'))).toBe(false);
      });

      it('should filter out *.swp and *.tmp files', async () => {
        await createTestFile(sourceDir, 'document.txt', 'content');
        await createTestFile(sourceDir, 'document.txt.swp', 'vim swap');
        await createTestFile(sourceDir, 'temp.tmp', 'temporary');

        await fileOps.copyDirectory(sourceDir, destDir);

        expect(await fs.pathExists(path.join(destDir, 'document.txt'))).toBe(true);
        expect(await fs.pathExists(path.join(destDir, 'document.txt.swp'))).toBe(false);
        expect(await fs.pathExists(path.join(destDir, 'temp.tmp'))).toBe(false);
      });

      it('should filter out .DS_Store files', async () => {
        await createTestFile(sourceDir, 'file.txt', 'content');
        await createTestFile(sourceDir, '.DS_Store', 'mac metadata');

        await fileOps.copyDirectory(sourceDir, destDir);

        expect(await fs.pathExists(path.join(destDir, 'file.txt'))).toBe(true);
        expect(await fs.pathExists(path.join(destDir, '.DS_Store'))).toBe(false);
      });
    });

    describe('edge cases', () => {
      it('should handle empty source directory', async () => {
        await fileOps.copyDirectory(sourceDir, destDir);

        const files = await fs.readdir(destDir);
        expect(files).toHaveLength(0);
      });

      it('should handle Unicode filenames', async () => {
        await createTestFile(sourceDir, '测试.txt', 'chinese');
        await createTestFile(sourceDir, 'файл.json', 'russian');

        await fileOps.copyDirectory(sourceDir, destDir);

        expect(await fs.pathExists(path.join(destDir, '测试.txt'))).toBe(true);
        expect(await fs.pathExists(path.join(destDir, 'файл.json'))).toBe(true);
      });

      it('should handle filenames with special characters', async () => {
        await createTestFile(sourceDir, 'file with spaces.txt', 'content');
        await createTestFile(sourceDir, 'special-chars!@#.md', 'content');

        await fileOps.copyDirectory(sourceDir, destDir);

        expect(await fs.pathExists(path.join(destDir, 'file with spaces.txt'))).toBe(true);
        expect(await fs.pathExists(path.join(destDir, 'special-chars!@#.md'))).toBe(true);
      });

      it('should handle very deep directory nesting', async () => {
        const deepPath = Array.from({ length: 10 }, (_, i) => `level${i}`).join('/');
        await createTestFile(sourceDir, `${deepPath}/deep.txt`, 'very deep');

        await fileOps.copyDirectory(sourceDir, destDir);

        expect(await fs.pathExists(path.join(destDir, ...deepPath.split('/'), 'deep.txt'))).toBe(true);
      });

      it('should preserve file permissions', async () => {
        const execFile = path.join(sourceDir, 'script.sh');
        await fs.writeFile(execFile, '#!/bin/bash\necho "test"');
        await fs.chmod(execFile, 0o755); // Make executable

        await fileOps.copyDirectory(sourceDir, destDir);

        const destFile = path.join(destDir, 'script.sh');
        const stats = await fs.stat(destFile);
        // Check if file is executable (user execute bit)
        expect((stats.mode & 0o100) !== 0).toBe(true);
      });

      it('should handle large number of files', async () => {
        // Create 50 files
        const promises = Array.from({ length: 50 }, (_, i) => createTestFile(sourceDir, `file${i}.txt`, `content ${i}`));
        await Promise.all(promises);

        await fileOps.copyDirectory(sourceDir, destDir);

        const destFiles = await fs.readdir(destDir);
        expect(destFiles).toHaveLength(50);
      });
    });

    describe('content integrity', () => {
      it('should preserve file content exactly', async () => {
        const content = 'Line 1\nLine 2\nLine 3\n';
        await createTestFile(sourceDir, 'file.txt', content);

        await fileOps.copyDirectory(sourceDir, destDir);

        const copiedContent = await fs.readFile(path.join(destDir, 'file.txt'), 'utf8');
        expect(copiedContent).toBe(content);
      });

      it('should preserve binary file content', async () => {
        const buffer = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
        await fs.writeFile(path.join(sourceDir, 'binary.dat'), buffer);

        await fileOps.copyDirectory(sourceDir, destDir);

        const copiedBuffer = await fs.readFile(path.join(destDir, 'binary.dat'));
        expect(copiedBuffer).toEqual(buffer);
      });

      it('should preserve UTF-8 content', async () => {
        const utf8Content = 'Hello 世界 🌍';
        await createTestFile(sourceDir, 'utf8.txt', utf8Content);

        await fileOps.copyDirectory(sourceDir, destDir);

        const copied = await fs.readFile(path.join(destDir, 'utf8.txt'), 'utf8');
        expect(copied).toBe(utf8Content);
      });

      it('should preserve empty files', async () => {
        await createTestFile(sourceDir, 'empty.txt', '');

        await fileOps.copyDirectory(sourceDir, destDir);

        const content = await fs.readFile(path.join(destDir, 'empty.txt'), 'utf8');
        expect(content).toBe('');
      });
    });
  });
});
