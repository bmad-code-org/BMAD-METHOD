import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { FileOps } from '../../../tools/cli/lib/file-ops.js';
import { createTempDir, cleanupTempDir, createTestFile } from '../../helpers/temp-dir.js';
import fs from 'fs-extra';
import path from 'node:path';

describe('FileOps', () => {
  const fileOps = new FileOps();
  let tmpDir;

  beforeEach(async () => {
    tmpDir = await createTempDir();
  });

  afterEach(async () => {
    await cleanupTempDir(tmpDir);
  });

  describe('ensureDir()', () => {
    it('should create directory if it does not exist', async () => {
      const newDir = path.join(tmpDir, 'new-directory');

      await fileOps.ensureDir(newDir);

      expect(await fs.pathExists(newDir)).toBe(true);
    });

    it('should not fail if directory already exists', async () => {
      const existingDir = path.join(tmpDir, 'existing');
      await fs.ensureDir(existingDir);

      await expect(fileOps.ensureDir(existingDir)).resolves.not.toThrow();
    });

    it('should create nested directories', async () => {
      const nestedDir = path.join(tmpDir, 'level1', 'level2', 'level3');

      await fileOps.ensureDir(nestedDir);

      expect(await fs.pathExists(nestedDir)).toBe(true);
    });
  });

  describe('remove()', () => {
    it('should remove a file', async () => {
      const filePath = await createTestFile(tmpDir, 'test.txt', 'content');

      await fileOps.remove(filePath);

      expect(await fs.pathExists(filePath)).toBe(false);
    });

    it('should remove a directory', async () => {
      const dirPath = path.join(tmpDir, 'test-dir');
      await fs.ensureDir(dirPath);
      await createTestFile(dirPath, 'file.txt', 'content');

      await fileOps.remove(dirPath);

      expect(await fs.pathExists(dirPath)).toBe(false);
    });

    it('should not fail if path does not exist', async () => {
      const nonExistent = path.join(tmpDir, 'does-not-exist');

      await expect(fileOps.remove(nonExistent)).resolves.not.toThrow();
    });

    it('should remove nested directories', async () => {
      const nested = path.join(tmpDir, 'a', 'b', 'c');
      await fs.ensureDir(nested);
      await createTestFile(nested, 'file.txt', 'content');

      await fileOps.remove(path.join(tmpDir, 'a'));

      expect(await fs.pathExists(path.join(tmpDir, 'a'))).toBe(false);
    });
  });

  describe('readFile()', () => {
    it('should read file content', async () => {
      const content = 'test content';
      const filePath = await createTestFile(tmpDir, 'test.txt', content);

      const result = await fileOps.readFile(filePath);

      expect(result).toBe(content);
    });

    it('should read UTF-8 content', async () => {
      const content = 'Hello 世界 🌍';
      const filePath = await createTestFile(tmpDir, 'utf8.txt', content);

      const result = await fileOps.readFile(filePath);

      expect(result).toBe(content);
    });

    it('should read empty file', async () => {
      const filePath = await createTestFile(tmpDir, 'empty.txt', '');

      const result = await fileOps.readFile(filePath);

      expect(result).toBe('');
    });

    it('should reject for non-existent file', async () => {
      const nonExistent = path.join(tmpDir, 'does-not-exist.txt');

      await expect(fileOps.readFile(nonExistent)).rejects.toThrow();
    });
  });

  describe('writeFile()', () => {
    it('should write file content', async () => {
      const filePath = path.join(tmpDir, 'new-file.txt');
      const content = 'test content';

      await fileOps.writeFile(filePath, content);

      expect(await fs.readFile(filePath, 'utf8')).toBe(content);
    });

    it('should create parent directories if they do not exist', async () => {
      const filePath = path.join(tmpDir, 'level1', 'level2', 'file.txt');

      await fileOps.writeFile(filePath, 'content');

      expect(await fs.pathExists(filePath)).toBe(true);
      expect(await fs.readFile(filePath, 'utf8')).toBe('content');
    });

    it('should overwrite existing file', async () => {
      const filePath = await createTestFile(tmpDir, 'test.txt', 'old content');

      await fileOps.writeFile(filePath, 'new content');

      expect(await fs.readFile(filePath, 'utf8')).toBe('new content');
    });

    it('should handle UTF-8 content', async () => {
      const content = '测试 Тест 🎉';
      const filePath = path.join(tmpDir, 'unicode.txt');

      await fileOps.writeFile(filePath, content);

      expect(await fs.readFile(filePath, 'utf8')).toBe(content);
    });
  });

  describe('exists()', () => {
    it('should return true for existing file', async () => {
      const filePath = await createTestFile(tmpDir, 'test.txt', 'content');

      const result = await fileOps.exists(filePath);

      expect(result).toBe(true);
    });

    it('should return true for existing directory', async () => {
      const dirPath = path.join(tmpDir, 'test-dir');
      await fs.ensureDir(dirPath);

      const result = await fileOps.exists(dirPath);

      expect(result).toBe(true);
    });

    it('should return false for non-existent path', async () => {
      const nonExistent = path.join(tmpDir, 'does-not-exist');

      const result = await fileOps.exists(nonExistent);

      expect(result).toBe(false);
    });
  });

  describe('stat()', () => {
    it('should return stats for file', async () => {
      const filePath = await createTestFile(tmpDir, 'test.txt', 'content');

      const stats = await fileOps.stat(filePath);

      expect(stats.isFile()).toBe(true);
      expect(stats.isDirectory()).toBe(false);
      expect(stats.size).toBeGreaterThan(0);
    });

    it('should return stats for directory', async () => {
      const dirPath = path.join(tmpDir, 'test-dir');
      await fs.ensureDir(dirPath);

      const stats = await fileOps.stat(dirPath);

      expect(stats.isDirectory()).toBe(true);
      expect(stats.isFile()).toBe(false);
    });

    it('should reject for non-existent path', async () => {
      const nonExistent = path.join(tmpDir, 'does-not-exist');

      await expect(fileOps.stat(nonExistent)).rejects.toThrow();
    });

    it('should return modification time', async () => {
      const filePath = await createTestFile(tmpDir, 'test.txt', 'content');

      const stats = await fileOps.stat(filePath);

      expect(stats.mtime).toBeInstanceOf(Date);
      // Allow 10ms tolerance for race conditions in fast test execution
      expect(stats.mtime.getTime()).toBeLessThanOrEqual(Date.now() + 10);
    });
  });
});
