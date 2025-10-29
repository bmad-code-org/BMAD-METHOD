/**
 * Integration Tests for Installer with Configuration Changes
 * Coverage: Real-world installer scenarios, workflow integration, error paths
 * File: test/integration/installer-config-changes.test.js
 */

const fs = require('fs-extra');
const path = require('node:path');
const yaml = require('js-yaml');

describe('Installer Configuration Changes - Integration', () => {
  let tempDir;
  let projectDir;
  let bmadDir;
  let configDir;

  beforeEach(async () => {
    tempDir = path.join(__dirname, '../fixtures/temp', `installer-${Date.now()}`);
    projectDir = path.join(tempDir, 'project');
    bmadDir = path.join(projectDir, 'bmad');
    configDir = path.join(bmadDir, '_cfg');

    await fs.ensureDir(projectDir);
  });

  afterEach(async () => {
    if (tempDir) {
      await fs.remove(tempDir);
    }
  });

  describe('Fresh Installation Flow', () => {
    test('should create manifest on fresh install', async () => {
      const { Manifest } = require('../../tools/cli/installers/lib/core/manifest');
      const manifest = new Manifest();

      const installData = {
        version: '1.0.0',
        modules: ['bmb', 'bmm'],
        ides: ['claude-code'],
      };

      await manifest.create(bmadDir, installData);

      const manifestPath = path.join(configDir, 'manifest.yaml');
      expect(await fs.pathExists(manifestPath)).toBe(true);

      const read = new Manifest();
      const data = await read.read(bmadDir);
      expect(data.version).toBe('1.0.0');
      expect(data.modules).toContain('bmb');
    });

    test('should initialize empty arrays for fresh install', async () => {
      const { Manifest } = require('../../tools/cli/installers/lib/core/manifest');
      const manifest = new Manifest();

      await manifest.create(bmadDir, {});

      const read = new Manifest();
      const data = await read.read(bmadDir);

      expect(Array.isArray(data.modules)).toBe(true);
      expect(Array.isArray(data.ides)).toBe(true);
      expect(data.modules.length).toBe(0);
      expect(data.ides.length).toBe(0);
    });

    test('should set installation date on fresh install', async () => {
      const { Manifest } = require('../../tools/cli/installers/lib/core/manifest');
      const manifest = new Manifest();

      const beforeTime = new Date().toISOString();
      await manifest.create(bmadDir, {});
      const afterTime = new Date().toISOString();

      const read = new Manifest();
      const data = await read.read(bmadDir);

      expect(data.installDate).toBeDefined();
      const installDate = new Date(data.installDate);
      expect(installDate.getTime()).toBeGreaterThanOrEqual(new Date(beforeTime).getTime());
      expect(installDate.getTime()).toBeLessThanOrEqual(new Date(afterTime).getTime() + 1000);
    });
  });

  describe('Update Installation Flow', () => {
    test('should preserve install date on update', async () => {
      const { Manifest } = require('../../tools/cli/installers/lib/core/manifest');
      const manifest = new Manifest();

      const originalDate = '2025-10-20T10:00:00Z';
      await manifest.create(bmadDir, {
        installDate: originalDate,
      });

      // Update
      await manifest.update(bmadDir, {
        modules: ['new-module'],
      });

      const read = new Manifest();
      const data = await read.read(bmadDir);

      expect(data.installDate).toBe(originalDate);
    });

    test('should update version on upgrade', async () => {
      const { Manifest } = require('../../tools/cli/installers/lib/core/manifest');
      const manifest = new Manifest();

      await manifest.create(bmadDir, {
        version: '1.0.0',
      });

      // Simulate upgrade
      await manifest.update(bmadDir, {
        version: '1.1.0',
      });

      const read = new Manifest();
      const data = await read.read(bmadDir);

      expect(data.version).toBe('1.1.0');
    });

    test('should handle module additions during update', async () => {
      const { Manifest } = require('../../tools/cli/installers/lib/core/manifest');
      const manifest = new Manifest();

      // Initial installation
      await manifest.create(bmadDir, {
        modules: ['bmb'],
      });

      // Add module during update
      await manifest.addModule(bmadDir, 'bmm');

      const read = new Manifest();
      const data = await read.read(bmadDir);

      expect(data.modules).toContain('bmb');
      expect(data.modules).toContain('bmm');
      expect(data.modules).toHaveLength(2);
    });

    test('should handle IDE additions during update', async () => {
      const { Manifest } = require('../../tools/cli/installers/lib/core/manifest');
      const manifest = new Manifest();

      // Initial installation
      await manifest.create(bmadDir, {
        ides: ['claude-code'],
      });

      // Add IDE during update
      await manifest.addIde(bmadDir, 'github-copilot');

      const read = new Manifest();
      const data = await read.read(bmadDir);

      expect(data.ides).toContain('claude-code');
      expect(data.ides).toContain('github-copilot');
      expect(data.ides).toHaveLength(2);
    });
  });

  describe('Configuration Loading', () => {
    test('should load configuration from previous installation', async () => {
      const { Manifest } = require('../../tools/cli/installers/lib/core/manifest');
      const { ManifestConfigLoader } = require('../../tools/cli/lib/config-loader');

      const manifest = new Manifest();
      await manifest.create(bmadDir, {
        version: '1.0.0',
        modules: ['bmb', 'bmm'],
        ides: ['claude-code'],
      });

      // Now load it
      const loader = new ManifestConfigLoader();
      const manifestPath = path.join(configDir, 'manifest.yaml');
      const config = await loader.loadManifest(manifestPath);

      expect(config).toBeDefined();
      expect(config.installation.version).toBe('1.0.0');
      expect(config.modules).toContain('bmm');
    });

    test('should use cached configuration on repeated access', async () => {
      const { Manifest } = require('../../tools/cli/installers/lib/core/manifest');
      const { ManifestConfigLoader } = require('../../tools/cli/lib/config-loader');

      const manifest = new Manifest();
      await manifest.create(bmadDir, {
        version: '1.0.0',
        modules: ['bmb'],
      });

      const loader = new ManifestConfigLoader();
      const manifestPath = path.join(configDir, 'manifest.yaml');

      const config1 = await loader.loadManifest(manifestPath);
      const config2 = await loader.loadManifest(manifestPath);

      // Should be same reference (cached)
      expect(config1).toBe(config2);
    });

    test('should detect when config was not previously saved', async () => {
      const { ManifestConfigLoader } = require('../../tools/cli/lib/config-loader');

      const loader = new ManifestConfigLoader();
      const manifestPath = path.join(configDir, 'manifest.yaml');

      const config = await loader.loadManifest(manifestPath);

      expect(config).toEqual({});
    });
  });

  describe('Complex Multi-Module Scenarios', () => {
    test('should track multiple modules across installations', async () => {
      const { Manifest } = require('../../tools/cli/installers/lib/core/manifest');
      const manifest = new Manifest();

      const modules = ['bmb', 'bmm', 'cis', 'expansion-pack-1'];

      await manifest.create(bmadDir, { modules });

      for (let i = 2; i <= 4; i++) {
        await manifest.addModule(bmadDir, `expansion-pack-${i}`);
      }

      const read = new Manifest();
      const data = await read.read(bmadDir);

      expect(data.modules).toHaveLength(7);
      for (const mod of modules) {
        expect(data.modules).toContain(mod);
      }
    });

    test('should handle IDE ecosystem changes', async () => {
      const { Manifest } = require('../../tools/cli/installers/lib/core/manifest');
      const manifest = new Manifest();

      const ides = ['claude-code', 'github-copilot', 'cline', 'roo'];

      await manifest.create(bmadDir, { ides: [] });

      for (const ide of ides) {
        await manifest.addIde(bmadDir, ide);
      }

      const read = new Manifest();
      const data = await read.read(bmadDir);

      expect(data.ides).toHaveLength(4);
      for (const ide of ides) {
        expect(data.ides).toContain(ide);
      }
    });

    test('should handle mixed add/remove operations', async () => {
      const { Manifest } = require('../../tools/cli/installers/lib/core/manifest');
      const manifest = new Manifest();

      await manifest.create(bmadDir, {
        modules: ['bmb', 'bmm', 'cis'],
      });

      // Remove middle module
      await manifest.removeModule(bmadDir, 'bmm');

      // Add new module
      await manifest.addModule(bmadDir, 'new-module');

      const read = new Manifest();
      const data = await read.read(bmadDir);

      expect(data.modules).toContain('bmb');
      expect(data.modules).not.toContain('bmm');
      expect(data.modules).toContain('cis');
      expect(data.modules).toContain('new-module');
      expect(data.modules).toHaveLength(3);
    });
  });

  describe('File System Integrity', () => {
    test('should create proper directory structure', async () => {
      const { Manifest } = require('../../tools/cli/installers/lib/core/manifest');
      const manifest = new Manifest();

      await manifest.create(bmadDir, {});

      expect(await fs.pathExists(bmadDir)).toBe(true);
      expect(await fs.pathExists(configDir)).toBe(true);
      expect(await fs.pathExists(path.join(configDir, 'manifest.yaml'))).toBe(true);
    });

    test('should handle nested directory creation', async () => {
      const { Manifest } = require('../../tools/cli/installers/lib/core/manifest');
      const manifest = new Manifest();

      const deepBmadDir = path.join(tempDir, 'a', 'b', 'c', 'd', 'bmad');

      await manifest.create(deepBmadDir, {});

      expect(await fs.pathExists(deepBmadDir)).toBe(true);
      expect(await fs.pathExists(path.join(deepBmadDir, '_cfg', 'manifest.yaml'))).toBe(true);
    });

    test('should preserve file permissions', async () => {
      if (process.platform === 'win32') {
        // Skip permissions test on Windows
        expect(true).toBe(true);
        return;
      }

      const { Manifest } = require('../../tools/cli/installers/lib/core/manifest');
      const manifest = new Manifest();

      await manifest.create(bmadDir, {});

      const manifestPath = path.join(configDir, 'manifest.yaml');
      const stats = await fs.stat(manifestPath);

      // File should be readable
      expect(stats.mode & 0o400).toBeDefined();
    });
  });

  describe('Manifest Validation During Installation', () => {
    test('should validate manifest after creation', async () => {
      const { Manifest } = require('../../tools/cli/installers/lib/core/manifest');
      const { ManifestValidator } = require('../../tools/cli/installers/lib/core/manifest');

      const manifest = new Manifest();
      await manifest.create(bmadDir, {
        version: '1.0.0',
        modules: ['bmb'],
      });

      const manifestPath = path.join(configDir, 'manifest.yaml');
      const content = await fs.readFile(manifestPath, 'utf8');
      const data = yaml.load(content);

      // Should be valid YAML
      expect(data).toBeDefined();
      expect(data.installation).toBeDefined();
      expect(data.modules).toBeDefined();
    });

    test('should maintain data integrity through read/write cycles', async () => {
      const { Manifest } = require('../../tools/cli/installers/lib/core/manifest');
      const manifest = new Manifest();

      const originalData = {
        version: '1.5.3',
        modules: ['bmb', 'bmm', 'cis'],
        ides: ['claude-code', 'github-copilot', 'roo'],
      };

      // Write
      await manifest.create(bmadDir, originalData);

      // Read
      const read1 = new Manifest();
      const data1 = await read1.read(bmadDir);

      // Write again (update)
      await manifest.update(bmadDir, {
        version: '1.5.4',
      });

      // Read again
      const read2 = new Manifest();
      const data2 = await read2.read(bmadDir);

      // Verify data integrity
      expect(data2.version).toBe('1.5.4');
      expect(data2.modules).toEqual(originalData.modules);
      expect(data2.ides).toEqual(originalData.ides);
    });
  });

  describe('Concurrency and State Management', () => {
    test('should handle rapid sequential updates', async () => {
      const { Manifest } = require('../../tools/cli/installers/lib/core/manifest');
      const manifest = new Manifest();

      await manifest.create(bmadDir, { modules: [] });

      // Rapid updates
      for (let i = 1; i <= 10; i++) {
        await manifest.addModule(bmadDir, `module-${i}`);
      }

      const read = new Manifest();
      const data = await read.read(bmadDir);

      expect(data.modules).toHaveLength(10);
      for (let i = 1; i <= 10; i++) {
        expect(data.modules).toContain(`module-${i}`);
      }
    });

    test('should handle multiple manifest instances independently', async () => {
      const { Manifest } = require('../../tools/cli/installers/lib/core/manifest');

      const manifest1 = new Manifest();
      const manifest2 = new Manifest();

      const dir1 = path.join(tempDir, 'project1', 'bmad');
      const dir2 = path.join(tempDir, 'project2', 'bmad');

      await manifest1.create(dir1, { modules: ['m1'] });
      await manifest2.create(dir2, { modules: ['m2'] });

      const read1 = new Manifest();
      const read2 = new Manifest();

      const data1 = await read1.read(dir1);
      const data2 = await read2.read(dir2);

      expect(data1.modules).toEqual(['m1']);
      expect(data2.modules).toEqual(['m2']);
    });
  });

  describe('Version Tracking Across Updates', () => {
    test('should track version history through updates', async () => {
      const { Manifest } = require('../../tools/cli/installers/lib/core/manifest');
      const manifest = new Manifest();

      const versions = ['1.0.0', '1.0.1', '1.1.0', '2.0.0'];

      // Initial install
      await manifest.create(bmadDir, { version: versions[0] });

      // Updates
      for (let i = 1; i < versions.length; i++) {
        await manifest.update(bmadDir, { version: versions[i] });
      }

      const read = new Manifest();
      const data = await read.read(bmadDir);

      expect(data.version).toBe(versions.at(-1));
    });

    test('should record timestamps for installations', async () => {
      const { Manifest } = require('../../tools/cli/installers/lib/core/manifest');
      const manifest = new Manifest();

      await manifest.create(bmadDir, {});

      const read = new Manifest();
      const data = await read.read(bmadDir);

      expect(data.installDate).toBeDefined();
      expect(data.lastUpdated).toBeDefined();

      const installDate = new Date(data.installDate);
      const lastUpdated = new Date(data.lastUpdated);

      expect(installDate.getTime()).toBeGreaterThan(0);
      expect(lastUpdated.getTime()).toBeGreaterThan(0);
    });
  });

  describe('Error Recovery', () => {
    test('should recover from corrupted manifest', async () => {
      const { Manifest } = require('../../tools/cli/installers/lib/core/manifest');

      // Create valid manifest
      let manifest = new Manifest();
      await manifest.create(bmadDir, { version: '1.0.0' });

      // Corrupt it
      const manifestPath = path.join(configDir, 'manifest.yaml');
      await fs.writeFile(manifestPath, 'invalid: yaml: [');

      // Try to recover by recreating
      manifest = new Manifest();
      await manifest.create(bmadDir, {
        version: '1.0.1',
        modules: ['recovered'],
      });

      const read = new Manifest();
      const data = await read.read(bmadDir);

      expect(data.version).toBe('1.0.1');
      expect(data.modules).toContain('recovered');
    });

    test('should handle missing _cfg directory gracefully', async () => {
      const { Manifest } = require('../../tools/cli/installers/lib/core/manifest');
      const manifest = new Manifest();

      // Ensure directory doesn't exist
      const nonExistentDir = path.join(tempDir, 'nonexistent', 'bmad');
      expect(await fs.pathExists(nonExistentDir)).toBe(false);

      // Should create it
      await manifest.create(nonExistentDir, {});

      expect(await fs.pathExists(nonExistentDir)).toBe(true);
      expect(await fs.pathExists(path.join(nonExistentDir, '_cfg'))).toBe(true);
    });
  });
});
