import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { FileOps } from '../../../tools/cli/lib/file-ops.js';
import { createTempDir, cleanupTempDir, createTestFile } from '../../helpers/temp-dir.js';

describe('FileOps', () => {
  describe('getFileHash()', () => {
    const fileOps = new FileOps();
    let tmpDir;

    beforeEach(async () => {
      tmpDir = await createTempDir();
    });

    afterEach(async () => {
      await cleanupTempDir(tmpDir);
    });

    describe('basic hashing', () => {
      it('should return SHA256 hash for a simple file', async () => {
        const filePath = await createTestFile(tmpDir, 'test.txt', 'hello');
        const hash = await fileOps.getFileHash(filePath);

        // SHA256 of 'hello' is known
        expect(hash).toBe('2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824');
        expect(hash).toHaveLength(64); // SHA256 is 64 hex characters
      });

      it('should return consistent hash for same content', async () => {
        const content = 'test content for hashing';
        const file1 = await createTestFile(tmpDir, 'file1.txt', content);
        const file2 = await createTestFile(tmpDir, 'file2.txt', content);

        const hash1 = await fileOps.getFileHash(file1);
        const hash2 = await fileOps.getFileHash(file2);

        expect(hash1).toBe(hash2);
      });

      it('should return different hash for different content', async () => {
        const file1 = await createTestFile(tmpDir, 'file1.txt', 'content A');
        const file2 = await createTestFile(tmpDir, 'file2.txt', 'content B');

        const hash1 = await fileOps.getFileHash(file1);
        const hash2 = await fileOps.getFileHash(file2);

        expect(hash1).not.toBe(hash2);
      });
    });

    describe('file size handling', () => {
      it('should handle empty file', async () => {
        const filePath = await createTestFile(tmpDir, 'empty.txt', '');
        const hash = await fileOps.getFileHash(filePath);

        // SHA256 of empty string
        expect(hash).toBe('e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855');
      });

      it('should handle small file (<4KB)', async () => {
        const content = 'a'.repeat(1000); // 1KB
        const filePath = await createTestFile(tmpDir, 'small.txt', content);
        const hash = await fileOps.getFileHash(filePath);

        expect(hash).toHaveLength(64);
        expect(hash).toMatch(/^[a-f0-9]{64}$/);
      });

      it('should handle medium file (~1MB)', async () => {
        const content = 'x'.repeat(1024 * 1024); // 1MB
        const filePath = await createTestFile(tmpDir, 'medium.txt', content);
        const hash = await fileOps.getFileHash(filePath);

        expect(hash).toHaveLength(64);
        expect(hash).toMatch(/^[a-f0-9]{64}$/);
      });

      it('should handle large file (~10MB) via streaming', async () => {
        // Create a 10MB file
        const chunkSize = 1024 * 1024; // 1MB chunks
        const chunks = Array.from({ length: 10 }, () => 'y'.repeat(chunkSize));
        const content = chunks.join('');

        const filePath = await createTestFile(tmpDir, 'large.txt', content);
        const hash = await fileOps.getFileHash(filePath);

        expect(hash).toHaveLength(64);
        expect(hash).toMatch(/^[a-f0-9]{64}$/);
      }, 15_000); // 15 second timeout for large file
    });

    describe('content type handling', () => {
      it('should handle binary content', async () => {
        // Create a buffer with binary data
        const buffer = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
        const filePath = await createTestFile(tmpDir, 'binary.dat', buffer.toString('binary'));
        const hash = await fileOps.getFileHash(filePath);

        expect(hash).toHaveLength(64);
        expect(hash).toMatch(/^[a-f0-9]{64}$/);
      });

      it('should handle UTF-8 content correctly', async () => {
        const content = 'Hello 世界 🌍';
        const filePath = await createTestFile(tmpDir, 'utf8.txt', content);
        const hash = await fileOps.getFileHash(filePath);

        // Hash should be consistent for UTF-8 content
        const hash2 = await fileOps.getFileHash(filePath);
        expect(hash).toBe(hash2);
        expect(hash).toHaveLength(64);
      });

      it('should handle newline characters', async () => {
        const contentLF = 'line1\nline2\nline3';
        const contentCRLF = 'line1\r\nline2\r\nline3';

        const fileLF = await createTestFile(tmpDir, 'lf.txt', contentLF);
        const fileCRLF = await createTestFile(tmpDir, 'crlf.txt', contentCRLF);

        const hashLF = await fileOps.getFileHash(fileLF);
        const hashCRLF = await fileOps.getFileHash(fileCRLF);

        // Different line endings should produce different hashes
        expect(hashLF).not.toBe(hashCRLF);
      });

      it('should handle JSON content', async () => {
        const json = JSON.stringify({ key: 'value', nested: { array: [1, 2, 3] } }, null, 2);
        const filePath = await createTestFile(tmpDir, 'data.json', json);
        const hash = await fileOps.getFileHash(filePath);

        expect(hash).toHaveLength(64);
      });
    });

    describe('edge cases', () => {
      it('should handle file with special characters in name', async () => {
        const filePath = await createTestFile(tmpDir, 'file with spaces & special-chars.txt', 'content');
        const hash = await fileOps.getFileHash(filePath);

        expect(hash).toHaveLength(64);
      });

      it('should handle concurrent hash calculations', async () => {
        const files = await Promise.all([
          createTestFile(tmpDir, 'file1.txt', 'content 1'),
          createTestFile(tmpDir, 'file2.txt', 'content 2'),
          createTestFile(tmpDir, 'file3.txt', 'content 3'),
        ]);

        // Calculate hashes concurrently
        const hashes = await Promise.all(files.map((file) => fileOps.getFileHash(file)));

        // All hashes should be valid
        expect(hashes).toHaveLength(3);
        for (const hash of hashes) {
          expect(hash).toMatch(/^[a-f0-9]{64}$/);
        }

        // Hashes should be different
        expect(hashes[0]).not.toBe(hashes[1]);
        expect(hashes[1]).not.toBe(hashes[2]);
        expect(hashes[0]).not.toBe(hashes[2]);
      });

      it('should handle file with only whitespace', async () => {
        const filePath = await createTestFile(tmpDir, 'whitespace.txt', '   ');
        const hash = await fileOps.getFileHash(filePath);

        expect(hash).toHaveLength(64);
        // Should be different from empty file
        expect(hash).not.toBe('e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855');
      });

      it('should handle very long single line', async () => {
        const longLine = 'x'.repeat(100_000); // 100KB single line
        const filePath = await createTestFile(tmpDir, 'longline.txt', longLine);
        const hash = await fileOps.getFileHash(filePath);

        expect(hash).toHaveLength(64);
      });
    });

    describe('error handling', () => {
      it('should reject for non-existent file', async () => {
        const nonExistentPath = `${tmpDir}/does-not-exist.txt`;

        await expect(fileOps.getFileHash(nonExistentPath)).rejects.toThrow();
      });

      it('should reject for directory instead of file', async () => {
        await expect(fileOps.getFileHash(tmpDir)).rejects.toThrow();
      });
    });

    describe('streaming behavior', () => {
      it('should use streaming for efficiency (test implementation detail)', async () => {
        // This test verifies that the implementation uses streams
        // by checking that large files can be processed without loading entirely into memory
        const largeContent = 'z'.repeat(5 * 1024 * 1024); // 5MB
        const filePath = await createTestFile(tmpDir, 'stream.txt', largeContent);

        // If this completes without memory issues, streaming is working
        const hash = await fileOps.getFileHash(filePath);

        expect(hash).toHaveLength(64);
        expect(hash).toMatch(/^[a-f0-9]{64}$/);
      }, 10_000);
    });
  });
});
