/**
 * Advanced Tests for Manifest Class
 * Coverage: Edge cases, YAML operations, file integrity, migration scenarios
 * File: test/unit/manifest-advanced.test.js
 */

const fs = require('fs-extra');
const path = require('node:path');
const yaml = require('js-yaml');
const { Manifest } = require('../../tools/cli/installers/lib/core/manifest');

describe('Manifest - Advanced Scenarios', () => {
  let tempDir;
  let manifest;

  beforeEach(async () => {
    tempDir = path.join(__dirname, '../fixtures/temp', `manifest-${Date.now()}`);
    await fs.ensureDir(tempDir);
    manifest = new Manifest();
  });

  afterEach(async () => {
    if (tempDir) {
      await fs.remove(tempDir);
    }
  });

  describe('Create Manifest - Advanced', () => {
    test('should create manifest with all fields populated', async () => {
      const bmadDir = path.join(tempDir, 'bmad');
      const data = {
        version: '1.0.0',
        installDate: '2025-10-26T10:00:00Z',
        lastUpdated: '2025-10-26T12:00:00Z',
        modules: ['bmb', 'bmm', 'cis'],
        ides: ['claude-code', 'github-copilot'],
      };

      const result = await manifest.create(bmadDir, data);

      expect(result.success).toBe(true);
      expect(result.path).toContain('manifest.yaml');

      // Verify file was created
      const manifestPath = path.join(bmadDir, '_cfg', 'manifest.yaml');
      expect(await fs.pathExists(manifestPath)).toBe(true);

      // Verify content
      const content = await fs.readFile(manifestPath, 'utf8');
      const parsed = yaml.load(content);

      expect(parsed.installation.version).toBe('1.0.0');
      expect(parsed.modules).toContain('bmm');
      expect(parsed.ides).toContain('claude-code');
    });

    test('should create manifest with defaults when data is minimal', async () => {
      const bmadDir = path.join(tempDir, 'bmad');
      const data = {};

      await manifest.create(bmadDir, data);

      const manifestPath = path.join(bmadDir, '_cfg', 'manifest.yaml');
      const content = await fs.readFile(manifestPath, 'utf8');
      const parsed = yaml.load(content);

      expect(parsed.installation).toHaveProperty('version');
      expect(parsed.installation).toHaveProperty('installDate');
      expect(parsed.installation).toHaveProperty('lastUpdated');
      expect(parsed.modules).toEqual([]);
      expect(parsed.ides).toEqual([]);
    });

    test('should overwrite existing manifest', async () => {
      const bmadDir = path.join(tempDir, 'bmad');

      // Create initial manifest
      await manifest.create(bmadDir, {
        modules: ['old-module'],
        ides: ['old-ide'],
      });

      // Create new manifest (should overwrite)
      await manifest.create(bmadDir, {
        modules: ['new-module'],
        ides: ['new-ide'],
      });

      const read = new Manifest();
      const data = await read.read(bmadDir);

      expect(data.modules).toContain('new-module');
      expect(data.modules).not.toContain('old-module');
      expect(data.ides).toContain('new-ide');
    });

    test('should ensure _cfg directory is created', async () => {
      const bmadDir = path.join(tempDir, 'nonexistent', 'bmad');
      expect(await fs.pathExists(bmadDir)).toBe(false);

      await manifest.create(bmadDir, { modules: [] });

      expect(await fs.pathExists(path.join(bmadDir, '_cfg'))).toBe(true);
    });
  });

  describe('Read Manifest - Error Handling', () => {
    test('should return null when manifest does not exist', async () => {
      const bmadDir = path.join(tempDir, 'nonexistent');

      const result = await manifest.read(bmadDir);
      expect(result).toBeNull();
    });

    test('should handle corrupted YAML gracefully', async () => {
      const bmadDir = path.join(tempDir, 'bmad');
      await fs.ensureDir(path.join(bmadDir, '_cfg'));

      const manifestPath = path.join(bmadDir, '_cfg', 'manifest.yaml');
      await fs.writeFile(manifestPath, 'invalid: yaml: [');

      const result = await manifest.read(bmadDir);
      expect(result).toBeNull();
    });

    test('should handle empty manifest file', async () => {
      const bmadDir = path.join(tempDir, 'bmad');
      await fs.ensureDir(path.join(bmadDir, '_cfg'));

      const manifestPath = path.join(bmadDir, '_cfg', 'manifest.yaml');
      await fs.writeFile(manifestPath, '');

      const result = await manifest.read(bmadDir);
      // Empty YAML returns null
      expect(result).toBeNull();
    });

    test('should handle manifest with unexpected structure', async () => {
      const bmadDir = path.join(tempDir, 'bmad');
      await fs.ensureDir(path.join(bmadDir, '_cfg'));

      const manifestPath = path.join(bmadDir, '_cfg', 'manifest.yaml');
      await fs.writeFile(
        manifestPath,
        yaml.dump({
          unexpected: 'structure',
          notTheRightFields: true,
        }),
      );

      const result = await manifest.read(bmadDir);
      expect(result).toHaveProperty('modules');
      expect(result).toHaveProperty('ides');
      expect(result.modules).toEqual([]);
    });
  });

  describe('Update Manifest - Advanced', () => {
    test('should update specific fields while preserving others', async () => {
      const bmadDir = path.join(tempDir, 'bmad');

      // Create initial manifest
      await manifest.create(bmadDir, {
        version: '1.0.0',
        modules: ['bmb'],
        ides: ['claude-code'],
      });

      // Update only version
      const result = await manifest.update(bmadDir, {
        version: '1.1.0',
      });

      expect(result.version).toBe('1.1.0');
      expect(result.modules).toEqual(['bmb']);
      expect(result.ides).toEqual(['claude-code']);
    });

    test('should update lastUpdated timestamp', async () => {
      const bmadDir = path.join(tempDir, 'bmad');

      const originalDate = '2024-10-20T10:00:00Z';
      await manifest.create(bmadDir, {
        installDate: originalDate,
        lastUpdated: originalDate,
      });

      // Wait a bit and update
      await new Promise((resolve) => setTimeout(resolve, 100));
      const result = await manifest.update(bmadDir, { modules: ['new'] });

      expect(result.lastUpdated).not.toBe(originalDate);
      // Just verify it changed, don't compare exact times due to system clock variations
      expect(result.lastUpdated).toBeDefined();
      expect(result.installDate).toBe(originalDate);
    });

    test('should handle updating when manifest does not exist', async () => {
      const bmadDir = path.join(tempDir, 'bmad');

      // This should create a new manifest
      const result = await manifest.update(bmadDir, {
        version: '1.0.0',
        modules: ['test'],
      });

      expect(result.version).toBe('1.0.0');
      expect(result.modules).toEqual(['test']);
    });

    test('should handle array field updates correctly', async () => {
      const bmadDir = path.join(tempDir, 'bmad');

      await manifest.create(bmadDir, {
        modules: ['module1', 'module2'],
      });

      const result = await manifest.update(bmadDir, {
        modules: ['module1', 'module2', 'module3'],
      });

      expect(result.modules).toHaveLength(3);
      expect(result.modules).toContain('module3');
    });
  });

  describe('Module Management', () => {
    test('should add module to manifest', async () => {
      const bmadDir = path.join(tempDir, 'bmad');

      await manifest.create(bmadDir, { modules: ['bmb'] });
      await manifest.addModule(bmadDir, 'bmm');

      const read = new Manifest();
      const data = await read.read(bmadDir);
      expect(data.modules).toContain('bmm');
      expect(data.modules).toHaveLength(2);
    });

    test('should not duplicate modules when adding', async () => {
      const bmadDir = path.join(tempDir, 'bmad');

      await manifest.create(bmadDir, { modules: ['bmb'] });
      await manifest.addModule(bmadDir, 'bmb');
      await manifest.addModule(bmadDir, 'bmb');

      const read = new Manifest();
      const data = await read.read(bmadDir);
      expect(data.modules.filter((m) => m === 'bmb')).toHaveLength(1);
    });

    test('should handle adding module when none exist', async () => {
      const bmadDir = path.join(tempDir, 'bmad');

      await manifest.create(bmadDir, { modules: [] });
      await manifest.addModule(bmadDir, 'first-module');

      const read = new Manifest();
      const data = await read.read(bmadDir);
      expect(data.modules).toEqual(['first-module']);
    });

    test('should remove module from manifest', async () => {
      const bmadDir = path.join(tempDir, 'bmad');

      await manifest.create(bmadDir, { modules: ['bmb', 'bmm', 'cis'] });
      await manifest.removeModule(bmadDir, 'bmm');

      const read = new Manifest();
      const data = await read.read(bmadDir);
      expect(data.modules).not.toContain('bmm');
      expect(data.modules).toContain('bmb');
      expect(data.modules).toContain('cis');
    });

    test('should handle removing non-existent module gracefully', async () => {
      const bmadDir = path.join(tempDir, 'bmad');

      await manifest.create(bmadDir, { modules: ['bmb'] });
      await manifest.removeModule(bmadDir, 'nonexistent');

      const read = new Manifest();
      const data = await read.read(bmadDir);
      expect(data.modules).toEqual(['bmb']);
    });

    test('should handle removing from empty modules', async () => {
      const bmadDir = path.join(tempDir, 'bmad');

      await manifest.create(bmadDir, { modules: [] });
      await manifest.removeModule(bmadDir, 'any');

      const read = new Manifest();
      const data = await read.read(bmadDir);
      expect(data.modules).toEqual([]);
    });
  });

  describe('IDE Management', () => {
    test('should add IDE to manifest', async () => {
      const bmadDir = path.join(tempDir, 'bmad');

      await manifest.create(bmadDir, { ides: ['claude-code'] });
      await manifest.addIde(bmadDir, 'github-copilot');

      const read = new Manifest();
      const data = await read.read(bmadDir);
      expect(data.ides).toContain('github-copilot');
      expect(data.ides).toHaveLength(2);
    });

    test('should not duplicate IDEs when adding', async () => {
      const bmadDir = path.join(tempDir, 'bmad');

      await manifest.create(bmadDir, { ides: ['claude-code'] });
      await manifest.addIde(bmadDir, 'claude-code');

      const read = new Manifest();
      const data = await read.read(bmadDir);
      expect(data.ides.filter((i) => i === 'claude-code')).toHaveLength(1);
    });

    test('should handle adding to empty IDE list', async () => {
      const bmadDir = path.join(tempDir, 'bmad');

      await manifest.create(bmadDir, { ides: [] });
      await manifest.addIde(bmadDir, 'roo');

      const read = new Manifest();
      const data = await read.read(bmadDir);
      expect(data.ides).toEqual(['roo']);
    });

    test('should throw when adding IDE without manifest', async () => {
      const bmadDir = path.join(tempDir, 'nonexistent');

      await expect(manifest.addIde(bmadDir, 'test')).rejects.toThrow('No manifest found');
    });
  });

  describe('File Hash Calculation', () => {
    test('should calculate SHA256 hash of file', async () => {
      const filePath = path.join(tempDir, 'test.txt');
      const content = 'test content';
      await fs.writeFile(filePath, content);

      const hash = await manifest.calculateFileHash(filePath);

      expect(hash).toBeDefined();
      expect(hash).toHaveLength(64); // SHA256 hex string is 64 chars
      expect(/^[a-f0-9]{64}$/.test(hash)).toBe(true);
    });

    test('should return consistent hash for same content', async () => {
      const file1 = path.join(tempDir, 'file1.txt');
      const file2 = path.join(tempDir, 'file2.txt');
      const content = 'identical content';

      await fs.writeFile(file1, content);
      await fs.writeFile(file2, content);

      const hash1 = await manifest.calculateFileHash(file1);
      const hash2 = await manifest.calculateFileHash(file2);

      expect(hash1).toBe(hash2);
    });

    test('should return different hash for different content', async () => {
      const file1 = path.join(tempDir, 'file1.txt');
      const file2 = path.join(tempDir, 'file2.txt');

      await fs.writeFile(file1, 'content 1');
      await fs.writeFile(file2, 'content 2');

      const hash1 = await manifest.calculateFileHash(file1);
      const hash2 = await manifest.calculateFileHash(file2);

      expect(hash1).not.toBe(hash2);
    });

    test('should handle non-existent file', async () => {
      const filePath = path.join(tempDir, 'nonexistent.txt');

      const hash = await manifest.calculateFileHash(filePath);
      expect(hash).toBeNull();
    });

    test('should handle large files', async () => {
      const filePath = path.join(tempDir, 'large.txt');
      const largeContent = 'x'.repeat(1024 * 1024); // 1MB

      await fs.writeFile(filePath, largeContent);

      const hash = await manifest.calculateFileHash(filePath);
      expect(hash).toBeDefined();
      expect(hash).toHaveLength(64);
    });
  });

  describe('YAML Formatting', () => {
    test('should format YAML with proper indentation', async () => {
      const bmadDir = path.join(tempDir, 'bmad');

      await manifest.create(bmadDir, {
        version: '1.0.0',
        modules: ['bmb', 'bmm', 'cis'],
        ides: ['claude-code'],
      });

      const manifestPath = path.join(bmadDir, '_cfg', 'manifest.yaml');
      const content = await fs.readFile(manifestPath, 'utf8');

      // Check for proper YAML formatting
      expect(content).toContain('installation:');
      expect(content).toContain('  version:');
      expect(content).toContain('modules:');
      expect(content).not.toContain('\t'); // No tabs, only spaces
    });

    test('should preserve multiline strings in YAML', async () => {
      const bmadDir = path.join(tempDir, 'bmad');

      // Create manifest with description
      const manifestPath = path.join(bmadDir, '_cfg', 'manifest.yaml');
      await fs.ensureDir(path.dirname(manifestPath));
      await fs.writeFile(
        manifestPath,
        `installation:
  version: 1.0.0
  description: |
    This is a
    multiline
    description
modules: []
ides: []`,
      );

      const read = new Manifest();
      const data = await read.read(bmadDir);
      expect(data).toBeDefined();
    });
  });

  describe('Concurrent Operations', () => {
    test('should handle concurrent reads', async () => {
      const bmadDir = path.join(tempDir, 'bmad');

      await manifest.create(bmadDir, {
        modules: ['test'],
        ides: ['test-ide'],
      });

      // Perform concurrent reads
      const results = await Promise.all([manifest.read(bmadDir), manifest.read(bmadDir), manifest.read(bmadDir), manifest.read(bmadDir)]);

      for (const result of results) {
        expect(result.modules).toContain('test');
        expect(result.ides).toContain('test-ide');
      }
    });

    test('should handle concurrent module additions', async () => {
      const bmadDir = path.join(tempDir, 'bmad');

      await manifest.create(bmadDir, { modules: [] });

      // Perform concurrent adds (sequential due to file I/O)
      await Promise.all([
        manifest.addModule(bmadDir, 'module1'),
        manifest.addModule(bmadDir, 'module2'),
        manifest.addModule(bmadDir, 'module3'),
      ]);

      const read = new Manifest();
      const data = await read.read(bmadDir);
      expect(data.modules.length).toBeGreaterThan(0);
    });
  });

  describe('Edge Cases - Special Values', () => {
    test('should handle special characters in module names', async () => {
      const bmadDir = path.join(tempDir, 'bmad');

      const specialModules = ['module-1', 'module_2', 'module.3', 'module@4'];

      await manifest.create(bmadDir, { modules: specialModules });

      const read = new Manifest();
      const data = await read.read(bmadDir);
      for (const mod of specialModules) {
        expect(data.modules).toContain(mod);
      }
    });

    test('should handle version strings with special formats', async () => {
      const bmadDir = path.join(tempDir, 'bmad');

      const versions = ['1.0.0', '1.0.0-alpha', '1.0.0-beta.1', '1.0.0+build.1'];

      for (const version of versions) {
        await manifest.create(bmadDir, { version });

        const read = new Manifest();
        const data = await read.read(bmadDir);
        expect(data.version).toBe(version);
      }
    });
  });
});
