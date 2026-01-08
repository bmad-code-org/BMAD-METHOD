import { describe, it, expect } from 'vitest';
import { FileOps } from '../../../tools/cli/lib/file-ops.js';

describe('FileOps', () => {
  describe('shouldIgnore()', () => {
    const fileOps = new FileOps();

    describe('exact matches', () => {
      it('should ignore .git directory', () => {
        expect(fileOps.shouldIgnore('.git')).toBe(true);
        expect(fileOps.shouldIgnore('/path/to/.git')).toBe(true);
        // Note: basename of '/project/.git/hooks' is 'hooks', not '.git'
        expect(fileOps.shouldIgnore('/project/.git/hooks')).toBe(false);
      });

      it('should ignore .DS_Store files', () => {
        expect(fileOps.shouldIgnore('.DS_Store')).toBe(true);
        expect(fileOps.shouldIgnore('/path/to/.DS_Store')).toBe(true);
      });

      it('should ignore node_modules directory', () => {
        expect(fileOps.shouldIgnore('node_modules')).toBe(true);
        expect(fileOps.shouldIgnore('/path/to/node_modules')).toBe(true);
        // Note: basename of '/project/node_modules/package' is 'package', not 'node_modules'
        expect(fileOps.shouldIgnore('/project/node_modules/package')).toBe(false);
      });

      it('should ignore .idea directory', () => {
        expect(fileOps.shouldIgnore('.idea')).toBe(true);
        expect(fileOps.shouldIgnore('/path/to/.idea')).toBe(true);
      });

      it('should ignore .vscode directory', () => {
        expect(fileOps.shouldIgnore('.vscode')).toBe(true);
        expect(fileOps.shouldIgnore('/path/to/.vscode')).toBe(true);
      });

      it('should ignore __pycache__ directory', () => {
        expect(fileOps.shouldIgnore('__pycache__')).toBe(true);
        expect(fileOps.shouldIgnore('/path/to/__pycache__')).toBe(true);
      });
    });

    describe('glob pattern matches', () => {
      it('should ignore *.swp files (Vim swap files)', () => {
        expect(fileOps.shouldIgnore('file.swp')).toBe(true);
        expect(fileOps.shouldIgnore('.config.yaml.swp')).toBe(true);
        expect(fileOps.shouldIgnore('/path/to/document.txt.swp')).toBe(true);
      });

      it('should ignore *.tmp files (temporary files)', () => {
        expect(fileOps.shouldIgnore('file.tmp')).toBe(true);
        expect(fileOps.shouldIgnore('temp_data.tmp')).toBe(true);
        expect(fileOps.shouldIgnore('/path/to/cache.tmp')).toBe(true);
      });

      it('should ignore *.pyc files (Python compiled)', () => {
        expect(fileOps.shouldIgnore('module.pyc')).toBe(true);
        expect(fileOps.shouldIgnore('__init__.pyc')).toBe(true);
        expect(fileOps.shouldIgnore('/path/to/script.pyc')).toBe(true);
      });
    });

    describe('files that should NOT be ignored', () => {
      it('should not ignore normal files', () => {
        expect(fileOps.shouldIgnore('README.md')).toBe(false);
        expect(fileOps.shouldIgnore('package.json')).toBe(false);
        expect(fileOps.shouldIgnore('index.js')).toBe(false);
      });

      it('should not ignore .gitignore itself', () => {
        expect(fileOps.shouldIgnore('.gitignore')).toBe(false);
        expect(fileOps.shouldIgnore('/path/to/.gitignore')).toBe(false);
      });

      it('should not ignore files with similar but different names', () => {
        expect(fileOps.shouldIgnore('git-file.txt')).toBe(false);
        expect(fileOps.shouldIgnore('node_modules.backup')).toBe(false);
        expect(fileOps.shouldIgnore('swap-file.txt')).toBe(false);
      });

      it('should not ignore files with ignored patterns in parent directory', () => {
        // The pattern matches basename, not full path
        expect(fileOps.shouldIgnore('/project/src/utils.js')).toBe(false);
        expect(fileOps.shouldIgnore('/code/main.py')).toBe(false);
      });

      it('should not ignore directories with dot prefix (except specific ones)', () => {
        expect(fileOps.shouldIgnore('.github')).toBe(false);
        expect(fileOps.shouldIgnore('.husky')).toBe(false);
        expect(fileOps.shouldIgnore('.npmrc')).toBe(false);
      });
    });

    describe('edge cases', () => {
      it('should handle empty string', () => {
        expect(fileOps.shouldIgnore('')).toBe(false);
      });

      it('should handle paths with multiple segments', () => {
        // basename of '/very/deep/path/to/node_modules/package' is 'package'
        expect(fileOps.shouldIgnore('/very/deep/path/to/node_modules/package')).toBe(false);
        expect(fileOps.shouldIgnore('/very/deep/path/to/file.swp')).toBe(true);
        expect(fileOps.shouldIgnore('/very/deep/path/to/normal.js')).toBe(false);
        // But the directory itself would be ignored
        expect(fileOps.shouldIgnore('/very/deep/path/to/node_modules')).toBe(true);
      });

      it('should handle Windows-style paths', () => {
        // Note: path.basename() on Unix doesn't recognize backslashes
        // On Unix: basename('C:\\project\\file.tmp') = 'C:\\project\\file.tmp'
        // So we test cross-platform path handling
        expect(fileOps.shouldIgnore(String.raw`C:\project\file.tmp`)).toBe(true); // .tmp matches
        expect(fileOps.shouldIgnore(String.raw`test\file.swp`)).toBe(true); // .swp matches
        // These won't be ignored because they don't match the patterns on Unix
        expect(fileOps.shouldIgnore(String.raw`C:\project\node_modules\pkg`)).toBe(false);
        expect(fileOps.shouldIgnore(String.raw`C:\project\src\main.js`)).toBe(false);
      });

      it('should handle relative paths', () => {
        // basename of './node_modules/package' is 'package'
        expect(fileOps.shouldIgnore('./node_modules/package')).toBe(false);
        // basename of '../.git/hooks' is 'hooks'
        expect(fileOps.shouldIgnore('../.git/hooks')).toBe(false);
        expect(fileOps.shouldIgnore('./src/index.js')).toBe(false);
        // But the directories themselves would be ignored
        expect(fileOps.shouldIgnore('./node_modules')).toBe(true);
        expect(fileOps.shouldIgnore('../.git')).toBe(true);
      });

      it('should handle files with multiple extensions', () => {
        expect(fileOps.shouldIgnore('file.tar.tmp')).toBe(true);
        expect(fileOps.shouldIgnore('backup.sql.swp')).toBe(true);
        expect(fileOps.shouldIgnore('data.json.gz')).toBe(false);
      });

      it('should be case-sensitive for exact matches', () => {
        expect(fileOps.shouldIgnore('Node_Modules')).toBe(false);
        expect(fileOps.shouldIgnore('NODE_MODULES')).toBe(false);
        expect(fileOps.shouldIgnore('node_modules')).toBe(true);
      });

      it('should handle files starting with ignored patterns', () => {
        expect(fileOps.shouldIgnore('.git-credentials')).toBe(false);
        expect(fileOps.shouldIgnore('.gitattributes')).toBe(false);
        expect(fileOps.shouldIgnore('.git')).toBe(true);
      });

      it('should handle Unicode filenames', () => {
        expect(fileOps.shouldIgnore('文档.swp')).toBe(true);
        expect(fileOps.shouldIgnore('файл.tmp')).toBe(true);
        expect(fileOps.shouldIgnore('ドキュメント.txt')).toBe(false);
      });
    });

    describe('pattern matching behavior', () => {
      it('should match patterns based on basename only', () => {
        // shouldIgnore uses path.basename(), so only the last segment matters
        expect(fileOps.shouldIgnore('/home/user/.git/config')).toBe(false); // basename is 'config'
        expect(fileOps.shouldIgnore('/home/user/project/node_modules')).toBe(true); // basename is 'node_modules'
      });

      it('should handle trailing slashes', () => {
        // path.basename() returns the directory name, not empty string for trailing slash
        expect(fileOps.shouldIgnore('node_modules/')).toBe(true);
        expect(fileOps.shouldIgnore('.git/')).toBe(true);
      });

      it('should treat patterns as partial regex matches', () => {
        // The *.swp pattern becomes /.*\.swp/ regex
        expect(fileOps.shouldIgnore('test.swp')).toBe(true);
        expect(fileOps.shouldIgnore('swp')).toBe(false); // doesn't match .*\.swp
        expect(fileOps.shouldIgnore('.swp')).toBe(true); // matches .*\.swp (. before swp)
      });
    });
  });
});
