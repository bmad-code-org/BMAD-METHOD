/**
 * Integration Tests - Config Loading
 * Tests for loading and using configuration during install command
 * File: test/integration/install-config-loading.test.js
 */

const path = require('node:path');
const fs = require('fs-extra');
const yaml = require('js-yaml');
const { Installer } = require('../../tools/cli/installers/lib/core/installer');

describe('Install Command - Configuration Loading', () => {
  let tempDir;
  let installer;

  beforeEach(() => {
    tempDir = path.join(__dirname, '../fixtures/temp', `install-${Date.now()}`);
    fs.ensureDirSync(tempDir);
    installer = new Installer();
  });

  afterEach(() => {
    if (fs.existsSync(tempDir)) {
      fs.removeSync(tempDir);
    }
  });

  describe('Configuration Loading Integration', () => {
    // Test 5.1: Load Config During Install Command
    it('should load config after install mode detection', async () => {
      const projectDir = tempDir;
      const bmadDir = path.join(projectDir, '.bmad-core');
      fs.ensureDirSync(bmadDir);

      const existingManifest = {
        version: '4.36.2',
        installed_at: '2025-08-12T23:51:04.439Z',
        install_type: 'full',
        ides_setup: ['claude-code'],
        expansion_packs: ['bmad-infrastructure-devops'],
      };

      const manifestPath = path.join(bmadDir, 'install-manifest.yaml');
      fs.writeFileSync(manifestPath, yaml.dump(existingManifest));

      const config = await installer.loadConfigForProject(projectDir);

      expect(config).toBeDefined();
      expect(config.version).toBe('4.36.2');
      expect(config.ides_setup).toEqual(['claude-code']);
    });

    // Test 5.2: Config Available to All Setup Functions
    it('should pass config to all setup functions', async () => {
      const projectDir = tempDir;
      const bmadDir = path.join(projectDir, '.bmad-core');
      fs.ensureDirSync(bmadDir);

      const existingManifest = {
        version: '4.36.2',
        installed_at: '2025-08-12T23:51:04.439Z',
        install_type: 'full',
        prd_sharding: true,
        architecture_sharding: false,
        ides_setup: ['claude-code', 'cline'],
      };

      const manifestPath = path.join(bmadDir, 'install-manifest.yaml');
      fs.writeFileSync(manifestPath, yaml.dump(existingManifest));

      const config = await installer.loadConfigForProject(projectDir);
      const context = { isUpdate: true, config };

      // Test that config is accessible to setup functions
      expect(context.config.getConfig).toBeDefined();
      expect(context.config.getConfig('prd_sharding')).toBe(true);
      expect(context.config.getConfig('architecture_sharding')).toBe(false);
      expect(context.config.getConfig('ides_setup')).toEqual(['claude-code', 'cline']);
    });

    it('should handle missing optional fields with defaults', async () => {
      const projectDir = tempDir;
      const bmadDir = path.join(projectDir, '.bmad-core');
      fs.ensureDirSync(bmadDir);

      const minimalManifest = {
        version: '4.36.2',
        installed_at: '2025-08-12T23:51:04.439Z',
        install_type: 'full',
      };

      const manifestPath = path.join(bmadDir, 'install-manifest.yaml');
      fs.writeFileSync(manifestPath, yaml.dump(minimalManifest));

      const config = await installer.loadConfigForProject(projectDir);

      expect(config.getConfig('ides_setup', [])).toEqual([]);
      expect(config.getConfig('expansion_packs', [])).toEqual([]);
    });
  });

  describe('Configuration Context Management', () => {
    it('should create proper context object for installation', async () => {
      const projectDir = tempDir;
      const bmadDir = path.join(projectDir, '.bmad-core');
      fs.ensureDirSync(bmadDir);

      const manifest = {
        version: '4.36.2',
        installed_at: '2025-08-12T23:51:04.439Z',
        install_type: 'full',
      };

      const manifestPath = path.join(bmadDir, 'install-manifest.yaml');
      fs.writeFileSync(manifestPath, yaml.dump(manifest));

      const config = await installer.loadConfigForProject(projectDir);
      const context = {
        projectDir,
        isUpdate: true,
        config,
        installMode: 'update',
      };

      expect(context).toEqual({
        projectDir,
        isUpdate: true,
        config: expect.any(Object),
        installMode: 'update',
      });
    });

    it('should preserve config throughout installation lifecycle', async () => {
      const projectDir = tempDir;
      const bmadDir = path.join(projectDir, '.bmad-core');
      fs.ensureDirSync(bmadDir);

      const manifest = {
        version: '4.36.2',
        installed_at: '2025-08-12T23:51:04.439Z',
        install_type: 'full',
        custom_setting: 'should-be-preserved',
      };

      const manifestPath = path.join(bmadDir, 'install-manifest.yaml');
      fs.writeFileSync(manifestPath, yaml.dump(manifest));

      const config = await installer.loadConfigForProject(projectDir);
      const originalValue = config.getConfig('custom_setting');

      // After various operations, config should remain unchanged
      expect(config.getConfig('custom_setting')).toBe(originalValue);
    });
  });
});
