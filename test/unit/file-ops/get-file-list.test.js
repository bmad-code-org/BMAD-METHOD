import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { FileOps } from '../../../tools/cli/lib/file-ops.js';
import { createTempDir, cleanupTempDir, createTestFile, createTestDirs } from '../../helpers/temp-dir.js';
import path from 'node:path';

describe('FileOps', () => {
  describe('getFileList()', () => {
    const fileOps = new FileOps();
    let tmpDir;

    beforeEach(async () => {
      tmpDir = await createTempDir();
    });

    afterEach(async () => {
      await cleanupTempDir(tmpDir);
    });

    describe('basic functionality', () => {
      it('should return empty array for empty directory', async () => {
        const files = await fileOps.getFileList(tmpDir);
        expect(files).toEqual([]);
      });

      it('should return single file in directory', async () => {
        await createTestFile(tmpDir, 'test.txt', 'content');

        const files = await fileOps.getFileList(tmpDir);

        expect(files).toHaveLength(1);
        expect(files[0]).toBe('test.txt');
      });

      it('should return multiple files in directory', async () => {
        await createTestFile(tmpDir, 'file1.txt', 'content1');
        await createTestFile(tmpDir, 'file2.md', 'content2');
        await createTestFile(tmpDir, 'file3.json', 'content3');

        const files = await fileOps.getFileList(tmpDir);

        expect(files).toHaveLength(3);
        expect(files).toContain('file1.txt');
        expect(files).toContain('file2.md');
        expect(files).toContain('file3.json');
      });
    });

    describe('recursive directory walking', () => {
      it('should recursively find files in nested directories', async () => {
        await createTestFile(tmpDir, 'root.txt', 'root');
        await createTestFile(tmpDir, 'level1/file1.txt', 'level1');
        await createTestFile(tmpDir, 'level1/level2/file2.txt', 'level2');
        await createTestFile(tmpDir, 'level1/level2/level3/file3.txt', 'level3');

        const files = await fileOps.getFileList(tmpDir);

        expect(files).toHaveLength(4);
        expect(files).toContain('root.txt');
        expect(files).toContain(path.join('level1', 'file1.txt'));
        expect(files).toContain(path.join('level1', 'level2', 'file2.txt'));
        expect(files).toContain(path.join('level1', 'level2', 'level3', 'file3.txt'));
      });

      it('should handle multiple subdirectories at same level', async () => {
        await createTestFile(tmpDir, 'dir1/file1.txt', 'content');
        await createTestFile(tmpDir, 'dir2/file2.txt', 'content');
        await createTestFile(tmpDir, 'dir3/file3.txt', 'content');

        const files = await fileOps.getFileList(tmpDir);

        expect(files).toHaveLength(3);
        expect(files).toContain(path.join('dir1', 'file1.txt'));
        expect(files).toContain(path.join('dir2', 'file2.txt'));
        expect(files).toContain(path.join('dir3', 'file3.txt'));
      });

      it('should not include empty directories in results', async () => {
        await createTestDirs(tmpDir, ['empty1', 'empty2', 'has-file']);
        await createTestFile(tmpDir, 'has-file/file.txt', 'content');

        const files = await fileOps.getFileList(tmpDir);

        expect(files).toHaveLength(1);
        expect(files[0]).toBe(path.join('has-file', 'file.txt'));
      });
    });

    describe('ignore filtering', () => {
      it('should ignore .git directories', async () => {
        await createTestFile(tmpDir, 'normal.txt', 'content');
        await createTestFile(tmpDir, '.git/config', 'git config');
        await createTestFile(tmpDir, '.git/hooks/pre-commit', 'hook');

        const files = await fileOps.getFileList(tmpDir);

        expect(files).toHaveLength(1);
        expect(files[0]).toBe('normal.txt');
      });

      it('should ignore node_modules directories', async () => {
        await createTestFile(tmpDir, 'package.json', '{}');
        await createTestFile(tmpDir, 'node_modules/package/index.js', 'code');
        await createTestFile(tmpDir, 'node_modules/package/lib/util.js', 'util');

        const files = await fileOps.getFileList(tmpDir);

        expect(files).toHaveLength(1);
        expect(files[0]).toBe('package.json');
      });

      it('should ignore .DS_Store files', async () => {
        await createTestFile(tmpDir, 'file.txt', 'content');
        await createTestFile(tmpDir, '.DS_Store', 'mac metadata');
        await createTestFile(tmpDir, 'subdir/.DS_Store', 'mac metadata');

        const files = await fileOps.getFileList(tmpDir);

        expect(files).toHaveLength(1);
        expect(files[0]).toBe('file.txt');
      });

      it('should ignore *.swp and *.tmp files', async () => {
        await createTestFile(tmpDir, 'document.txt', 'content');
        await createTestFile(tmpDir, 'document.txt.swp', 'vim swap');
        await createTestFile(tmpDir, 'temp.tmp', 'temporary');

        const files = await fileOps.getFileList(tmpDir);

        expect(files).toHaveLength(1);
        expect(files[0]).toBe('document.txt');
      });

      it('should ignore multiple ignored patterns together', async () => {
        await createTestFile(tmpDir, 'src/index.js', 'source code');
        await createTestFile(tmpDir, 'node_modules/lib/code.js', 'dependency');
        await createTestFile(tmpDir, '.git/config', 'git config');
        await createTestFile(tmpDir, '.DS_Store', 'mac file');
        await createTestFile(tmpDir, 'file.swp', 'swap file');
        await createTestFile(tmpDir, '.idea/workspace.xml', 'ide');

        const files = await fileOps.getFileList(tmpDir);

        expect(files).toHaveLength(1);
        expect(files[0]).toBe(path.join('src', 'index.js'));
      });
    });

    describe('relative path handling', () => {
      it('should return paths relative to base directory', async () => {
        await createTestFile(tmpDir, 'a/b/c/deep.txt', 'deep');

        const files = await fileOps.getFileList(tmpDir);

        expect(files[0]).toBe(path.join('a', 'b', 'c', 'deep.txt'));
        expect(path.isAbsolute(files[0])).toBe(false);
      });

      it('should handle subdirectory as base', async () => {
        await createTestFile(tmpDir, 'root.txt', 'root');
        await createTestFile(tmpDir, 'sub/file1.txt', 'sub1');
        await createTestFile(tmpDir, 'sub/file2.txt', 'sub2');

        const subDir = path.join(tmpDir, 'sub');
        const files = await fileOps.getFileList(subDir);

        expect(files).toHaveLength(2);
        expect(files).toContain('file1.txt');
        expect(files).toContain('file2.txt');
        // Should not include root.txt
        expect(files).not.toContain('root.txt');
      });
    });

    describe('edge cases', () => {
      it('should handle directory with special characters', async () => {
        await createTestFile(tmpDir, 'folder with spaces/file.txt', 'content');
        await createTestFile(tmpDir, 'special-chars!@#/data.json', 'data');

        const files = await fileOps.getFileList(tmpDir);

        expect(files).toHaveLength(2);
        expect(files).toContain(path.join('folder with spaces', 'file.txt'));
        expect(files).toContain(path.join('special-chars!@#', 'data.json'));
      });

      it('should handle Unicode filenames', async () => {
        await createTestFile(tmpDir, '文档/测试.txt', 'chinese');
        await createTestFile(tmpDir, 'файл/данные.json', 'russian');
        await createTestFile(tmpDir, 'ファイル/データ.yaml', 'japanese');

        const files = await fileOps.getFileList(tmpDir);

        expect(files).toHaveLength(3);
        expect(files.some((f) => f.includes('测试.txt'))).toBe(true);
        expect(files.some((f) => f.includes('данные.json'))).toBe(true);
        expect(files.some((f) => f.includes('データ.yaml'))).toBe(true);
      });

      it('should return empty array for non-existent directory', async () => {
        const nonExistent = path.join(tmpDir, 'does-not-exist');

        const files = await fileOps.getFileList(nonExistent);

        expect(files).toEqual([]);
      });

      it('should handle very deep directory nesting', async () => {
        // Create a deeply nested structure (10 levels)
        const deepPath = Array.from({ length: 10 }, (_, i) => `level${i}`).join('/');
        await createTestFile(tmpDir, `${deepPath}/deep.txt`, 'very deep');

        const files = await fileOps.getFileList(tmpDir);

        expect(files).toHaveLength(1);
        expect(files[0]).toBe(path.join(...deepPath.split('/'), 'deep.txt'));
      });

      it('should handle directory with many files', async () => {
        // Create 100 files
        const promises = Array.from({ length: 100 }, (_, i) => createTestFile(tmpDir, `file${i}.txt`, `content ${i}`));
        await Promise.all(promises);

        const files = await fileOps.getFileList(tmpDir);

        expect(files).toHaveLength(100);
        expect(files.every((f) => f.startsWith('file') && f.endsWith('.txt'))).toBe(true);
      });

      it('should handle mixed ignored and non-ignored files', async () => {
        await createTestFile(tmpDir, 'src/main.js', 'code');
        await createTestFile(tmpDir, 'src/main.js.swp', 'swap');
        await createTestFile(tmpDir, 'lib/utils.js', 'utils');
        await createTestFile(tmpDir, 'node_modules/dep/index.js', 'dep');
        await createTestFile(tmpDir, 'test/test.js', 'test');

        const files = await fileOps.getFileList(tmpDir);

        expect(files).toHaveLength(3);
        expect(files).toContain(path.join('src', 'main.js'));
        expect(files).toContain(path.join('lib', 'utils.js'));
        expect(files).toContain(path.join('test', 'test.js'));
      });
    });

    describe('file types', () => {
      it('should include files with no extension', async () => {
        await createTestFile(tmpDir, 'README', 'readme content');
        await createTestFile(tmpDir, 'LICENSE', 'license text');
        await createTestFile(tmpDir, 'Makefile', 'make commands');

        const files = await fileOps.getFileList(tmpDir);

        expect(files).toHaveLength(3);
        expect(files).toContain('README');
        expect(files).toContain('LICENSE');
        expect(files).toContain('Makefile');
      });

      it('should include dotfiles (except ignored ones)', async () => {
        await createTestFile(tmpDir, '.gitignore', 'ignore patterns');
        await createTestFile(tmpDir, '.env', 'environment');
        await createTestFile(tmpDir, '.eslintrc', 'eslint config');

        const files = await fileOps.getFileList(tmpDir);

        expect(files).toHaveLength(3);
        expect(files).toContain('.gitignore');
        expect(files).toContain('.env');
        expect(files).toContain('.eslintrc');
      });

      it('should include files with multiple extensions', async () => {
        await createTestFile(tmpDir, 'archive.tar.gz', 'archive');
        await createTestFile(tmpDir, 'backup.sql.bak', 'backup');
        await createTestFile(tmpDir, 'config.yaml.sample', 'sample config');

        const files = await fileOps.getFileList(tmpDir);

        expect(files).toHaveLength(3);
      });
    });
  });
});
