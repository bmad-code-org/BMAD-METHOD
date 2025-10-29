/**
 * Config Loader Unit Tests
 * Tests for loading and caching manifest configuration
 * File: test/unit/config-loader.test.js
 */

const path = require('node:path');
const fs = require('fs-extra');
const yaml = require('js-yaml');
const { ManifestConfigLoader } = require('../../tools/cli/lib/config-loader');

describe('ManifestConfigLoader', () => {
  let tempDir;
  let loader;

  beforeEach(() => {
    // Create temporary directory for test fixtures
    tempDir = path.join(__dirname, '../fixtures/temp', `loader-${Date.now()}`);
    fs.ensureDirSync(tempDir);
    loader = new ManifestConfigLoader();
  });

  afterEach(() => {
    // Clean up temporary files
    if (fs.existsSync(tempDir)) {
      fs.removeSync(tempDir);
    }
  });

  describe('loadManifest', () => {
    // Test 1.1: Load Valid Manifest
    it('should load a valid manifest file', async () => {
      const validManifest = {
        version: '4.36.2',
        installed_at: '2025-08-12T23:51:04.439Z',
        install_type: 'full',
        ides_setup: ['claude-code'],
        expansion_packs: ['bmad-infrastructure-devops'],
      };

      const manifestPath = path.join(tempDir, 'install-manifest.yaml');
      fs.writeFileSync(manifestPath, yaml.dump(validManifest));

      const config = await loader.loadManifest(manifestPath);

      expect(config).toBeDefined();
      expect(config.version).toBe('4.36.2');
      expect(config.installed_at).toBe('2025-08-12T23:51:04.439Z');
      expect(config.install_type).toBe('full');
      expect(config.ides_setup).toEqual(['claude-code']);
      expect(config.expansion_packs).toEqual(['bmad-infrastructure-devops']);
    });

    // Test 1.2: Handle Missing Manifest
    it('should return empty config for missing manifest', async () => {
      const manifestPath = path.join(tempDir, 'nonexistent-manifest.yaml');

      const config = await loader.loadManifest(manifestPath);

      expect(config).toBeDefined();
      expect(Object.keys(config).length).toBe(0);
    });

    // Test 1.3: Handle Corrupted Manifest
    it('should throw error for corrupted YAML', async () => {
      const corruptedContent = `
version: 4.36.2
installed_at: [invalid yaml content
install_type: full
      `;

      const manifestPath = path.join(tempDir, 'corrupted-manifest.yaml');
      fs.writeFileSync(manifestPath, corruptedContent);

      await expect(loader.loadManifest(manifestPath)).rejects.toThrow();
    });

    // Test 1.4: Cache Configuration
    it('should cache loaded configuration', async () => {
      const validManifest = {
        version: '4.36.2',
        installed_at: '2025-08-12T23:51:04.439Z',
        install_type: 'full',
      };

      const manifestPath = path.join(tempDir, 'install-manifest.yaml');
      fs.writeFileSync(manifestPath, yaml.dump(validManifest));

      const config1 = await loader.loadManifest(manifestPath);
      const config2 = await loader.loadManifest(manifestPath);

      // Both should reference the same cached object
      expect(config1).toBe(config2);
    });

    // Test 1.5: Get Specific Configuration Value
    it('should return specific config value by key', async () => {
      const validManifest = {
        version: '4.36.2',
        installed_at: '2025-08-12T23:51:04.439Z',
        install_type: 'full',
      };

      const manifestPath = path.join(tempDir, 'install-manifest.yaml');
      fs.writeFileSync(manifestPath, yaml.dump(validManifest));

      await loader.loadManifest(manifestPath);
      const version = loader.getConfig('version');

      expect(version).toBe('4.36.2');
      expect(typeof version).toBe('string');
    });

    // Test 1.6: Get Configuration with Default
    it('should return default when config key missing', async () => {
      const validManifest = {
        version: '4.36.2',
        installed_at: '2025-08-12T23:51:04.439Z',
        install_type: 'full',
        // Note: ides_setup is intentionally missing
      };

      const manifestPath = path.join(tempDir, 'install-manifest.yaml');
      fs.writeFileSync(manifestPath, yaml.dump(validManifest));

      await loader.loadManifest(manifestPath);
      const ides = loader.getConfig('ides_setup', ['default-ide']);

      expect(ides).toEqual(['default-ide']);
    });
  });

  describe('getConfig', () => {
    it('should return undefined for unloaded config', () => {
      const result = loader.getConfig('version');
      expect(result).toBeUndefined();
    });

    it('should handle nested config keys', async () => {
      const validManifest = {
        version: '4.36.2',
        nested: {
          key: 'value',
        },
      };

      const manifestPath = path.join(tempDir, 'install-manifest.yaml');
      fs.writeFileSync(manifestPath, yaml.dump(validManifest));

      await loader.loadManifest(manifestPath);
      const value = loader.getConfig('nested.key');

      expect(value).toBe('value');
    });
  });

  describe('hasConfig', () => {
    it('should return true if config key exists', async () => {
      const validManifest = {
        version: '4.36.2',
        installed_at: '2025-08-12T23:51:04.439Z',
      };

      const manifestPath = path.join(tempDir, 'install-manifest.yaml');
      fs.writeFileSync(manifestPath, yaml.dump(validManifest));

      await loader.loadManifest(manifestPath);
      const hasVersion = loader.hasConfig('version');

      expect(hasVersion).toBe(true);
    });

    it('should return false if config key missing', async () => {
      const validManifest = {
        version: '4.36.2',
      };

      const manifestPath = path.join(tempDir, 'install-manifest.yaml');
      fs.writeFileSync(manifestPath, yaml.dump(validManifest));

      await loader.loadManifest(manifestPath);
      const hasIdes = loader.hasConfig('ides_setup');

      expect(hasIdes).toBe(false);
    });
  });

  describe('clearCache', () => {
    it('should clear cached configuration', async () => {
      const validManifest = {
        version: '4.36.2',
        installed_at: '2025-08-12T23:51:04.439Z',
      };

      const manifestPath = path.join(tempDir, 'install-manifest.yaml');
      fs.writeFileSync(manifestPath, yaml.dump(validManifest));

      await loader.loadManifest(manifestPath);
      expect(loader.hasConfig('version')).toBe(true);

      loader.clearCache();

      expect(loader.hasConfig('version')).toBe(false);
    });
  });
});
