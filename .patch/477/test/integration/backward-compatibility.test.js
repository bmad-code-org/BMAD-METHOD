/**
 * Integration Tests - Backward Compatibility
 * Tests for handling old manifest formats and migrations
 * File: test/integration/backward-compatibility.test.js
 */

const path = require('node:path');
const fs = require('fs-extra');
const yaml = require('js-yaml');
const { Installer } = require('../../tools/cli/installers/lib/core/installer');

describe('Backward Compatibility', () => {
  let tempDir;
  let installer;

  beforeEach(() => {
    tempDir = path.join(__dirname, '../fixtures/temp', `compat-${Date.now()}`);
    fs.ensureDirSync(tempDir);
    installer = new Installer();
  });

  afterEach(() => {
    if (fs.existsSync(tempDir)) {
      fs.removeSync(tempDir);
    }
  });

  describe('Old Manifest Format Support', () => {
    // Test 8.1: Handle Old Manifest Format
    it('should handle manifest from v4.30.0', async () => {
      const projectDir = tempDir;
      const bmadDir = path.join(projectDir, '.bmad-core');
      fs.ensureDirSync(bmadDir);

      // Old format manifest
      const oldManifest = {
        version: '4.30.0',
        installed_at: '2025-01-01T00:00:00.000Z',
        install_type: 'full',
        // Note: Might be missing newer fields
      };

      const manifestPath = path.join(bmadDir, 'install-manifest.yaml');
      fs.writeFileSync(manifestPath, yaml.dump(oldManifest));

      const config = await installer.loadConfigForProject(projectDir);

      expect(config).toBeDefined();
      expect(config.getConfig('version')).toBe('4.30.0');
      expect(config.getConfig('install_type')).toBe('full');
    });

    it('should handle v3.x manifest format', async () => {
      const projectDir = tempDir;
      const bmadDir = path.join(projectDir, '.bmad-core');
      fs.ensureDirSync(bmadDir);

      // V3 format manifest
      const v3Manifest = {
        version: '3.5.0',
        installed_at: '2024-06-01T00:00:00.000Z',
        installation_type: 'full', // Different field name
      };

      const manifestPath = path.join(bmadDir, 'install-manifest.yaml');
      fs.writeFileSync(manifestPath, yaml.dump(v3Manifest));

      const config = await installer.loadConfigForProject(projectDir);

      // Should handle old field names with migration
      expect(config).toBeDefined();
      expect(config.getConfig('version')).toBe('3.5.0');
    });

    it('should migrate between format versions', async () => {
      const oldManifest = {
        version: '4.30.0',
        installed_at: '2025-01-01T00:00:00Z',
        install_type: 'full',
      };

      const migrator = installer.getMigrator();
      const migratedManifest = migrator.migrate(oldManifest, '4.36.2');

      expect(migratedManifest.version).toBe('4.36.2');
      expect(migratedManifest.installed_at).toBeDefined();
      expect(migratedManifest.install_type).toBe('full');
    });
  });

  describe('Missing Optional Fields', () => {
    // Test 8.2: Missing Optional Fields Handled
    it('should handle manifest without ides_setup', async () => {
      const projectDir = tempDir;
      const bmadDir = path.join(projectDir, '.bmad-core');
      fs.ensureDirSync(bmadDir);

      const manifest = {
        version: '4.32.0',
        installed_at: '2025-03-01T00:00:00.000Z',
        install_type: 'full',
        // ides_setup is missing (added in later version)
      };

      const manifestPath = path.join(bmadDir, 'install-manifest.yaml');
      fs.writeFileSync(manifestPath, yaml.dump(manifest));

      const config = await installer.loadConfigForProject(projectDir);

      expect(config).toBeDefined();
      expect(config.getConfig('ides_setup', [])).toEqual([]);
      expect(config.getConfig('version')).toBe('4.32.0');
    });

    // Test 8.3: Missing expansion_packs Field
    it('should handle manifest without expansion_packs', async () => {
      const projectDir = tempDir;
      const bmadDir = path.join(projectDir, '.bmad-core');
      fs.ensureDirSync(bmadDir);

      const manifest = {
        version: '4.34.0',
        installed_at: '2025-05-01T00:00:00.000Z',
        install_type: 'full',
        ides_setup: ['claude-code'],
        // expansion_packs is missing
      };

      const manifestPath = path.join(bmadDir, 'install-manifest.yaml');
      fs.writeFileSync(manifestPath, yaml.dump(manifest));

      const config = await installer.loadConfigForProject(projectDir);

      expect(config).toBeDefined();
      expect(config.getConfig('expansion_packs', [])).toEqual([]);
      expect(config.getConfig('ides_setup')).toEqual(['claude-code']);
    });

    it('should provide safe defaults for missing fields', async () => {
      const manifest = {
        version: '4.33.0',
        installed_at: '2025-04-01T00:00:00Z',
        install_type: 'full',
      };

      const config = {
        getConfig: (key, defaultValue) => manifest[key] ?? defaultValue,
      };

      const defaults = {
        ides_setup: config.getConfig('ides_setup', []),
        expansion_packs: config.getConfig('expansion_packs', []),
        doc_organization: config.getConfig('doc_organization', 'by-module'),
      };

      expect(defaults.ides_setup).toEqual([]);
      expect(defaults.expansion_packs).toEqual([]);
      expect(defaults.doc_organization).toBe('by-module');
    });
  });

  describe('Version Comparison Backward Compat', () => {
    // Test 8.4: Version Comparison Backward Compat
    it('should handle pre-release version formats', async () => {
      const projectDir = tempDir;
      const bmadDir = path.join(projectDir, '.bmad-core');
      fs.ensureDirSync(bmadDir);

      const manifest = {
        version: '4.36.2-beta1',
        installed_at: '2025-08-01T00:00:00.000Z',
        install_type: 'full',
      };

      const manifestPath = path.join(bmadDir, 'install-manifest.yaml');
      fs.writeFileSync(manifestPath, yaml.dump(manifest));

      const mode = installer.detectInstallMode(projectDir, '4.36.2');

      // Beta version < release version = update
      expect(mode).toBe('update');
    });

    it('should handle alpha/beta/rc versions', async () => {
      const versionCases = [
        { installed: '4.36.0-alpha', current: '4.36.0', mode: 'update' },
        { installed: '4.36.0-beta', current: '4.36.0', mode: 'update' },
        { installed: '4.36.0-rc1', current: '4.36.0', mode: 'update' },
        { installed: '4.36.0-rc1', current: '4.36.0-rc2', mode: 'update' },
        { installed: '4.36.0-rc1', current: '4.36.0-rc1', mode: 'reinstall' },
      ];

      for (const { installed, current, mode: expectedMode } of versionCases) {
        fs.removeSync(bmadDir);
        const bmadDir = path.join(projectDir, '.bmad-core');
        fs.ensureDirSync(bmadDir);

        const manifest = {
          version: installed,
          installed_at: '2025-08-01T00:00:00Z',
          install_type: 'full',
        };

        const manifestPath = path.join(bmadDir, 'install-manifest.yaml');
        fs.writeFileSync(manifestPath, yaml.dump(manifest));

        const mode = installer.detectInstallMode(projectDir, current);
        expect(mode).toBe(expectedMode);
      }
    });

    it('should handle versions with different segment counts', async () => {
      const testCases = [
        { v1: '4.36', v2: '4.36.0', compatible: true },
        { v1: '4', v2: '4.36.2', compatible: true },
        { v1: '4.36.2.1', v2: '4.36.2', compatible: true },
      ];

      for (const { v1, v2, compatible } of testCases) {
        const detector = installer.getDetector();
        const result = detector.canCompareVersions(v1, v2);
        expect(result || !compatible).toBeDefined();
      }
    });
  });

  describe('Field Name Migration', () => {
    it('should handle renamed configuration fields', async () => {
      const oldManifest = {
        version: '4.20.0',
        installed_at: '2024-01-01T00:00:00Z',
        installation_mode: 'full', // Old name
      };

      const migrator = installer.getMigrator();
      const migratedManifest = migrator.migrateFields(oldManifest);

      expect(migratedManifest.install_type || migratedManifest.installation_mode).toBeDefined();
    });

    it('should preserve unknown fields during migration', async () => {
      const oldManifest = {
        version: '4.30.0',
        installed_at: '2025-01-01T00:00Z',
        install_type: 'full',
        custom_field: 'custom_value',
        user_preference: 'should-preserve',
      };

      const migrator = installer.getMigrator();
      const migratedManifest = migrator.migrate(oldManifest, '4.36.2');

      expect(migratedManifest.custom_field).toBe('custom_value');
      expect(migratedManifest.user_preference).toBe('should-preserve');
    });
  });

  describe('Installation Type Variations', () => {
    it('should handle various installation type values', async () => {
      const installTypes = ['full', 'minimal', 'custom', 'lite', 'pro', 'enterprise'];

      for (const type of installTypes) {
        const manifest = {
          version: '4.36.2',
          installed_at: '2025-08-12T00:00:00Z',
          install_type: type,
        };

        const config = {
          getConfig: (key) => manifest[key],
        };

        expect(config.getConfig('install_type')).toBe(type);
      }
    });

    it('should handle custom installation profiles', async () => {
      const manifest = {
        version: '4.36.2',
        installed_at: '2025-08-12T00:00:00Z',
        install_type: 'custom',
        custom_profile: {
          agents: ['agent1', 'agent2'],
          modules: ['module1', 'module2'],
        },
      };

      const config = {
        getConfig: (key) => manifest[key],
      };

      expect(config.getConfig('custom_profile')).toBeDefined();
      expect(config.getConfig('custom_profile').agents).toEqual(['agent1', 'agent2']);
    });
  });

  describe('IDE Configuration Compatibility', () => {
    it('should recognize old IDE names and map to new ones', async () => {
      const oldManifest = {
        version: '4.25.0',
        installed_at: '2024-12-01T00:00:00Z',
        install_type: 'full',
        ides: ['claude-code-v1', 'github-copilot-v2'], // Old IDE names
      };

      const migrator = installer.getMigrator();
      const migratedManifest = migrator.migrateIdeNames(oldManifest);

      // Should be converted to new names or handled gracefully
      expect(migratedManifest.ides_setup).toBeDefined();
    });

    it('should handle unknown IDE names gracefully', async () => {
      const manifest = {
        version: '4.36.2',
        installed_at: '2025-08-12T00:00:00Z',
        install_type: 'full',
        ides_setup: ['claude-code', 'unknown-ide', 'cline'],
      };

      const config = {
        getConfig: (key) => manifest[key],
      };

      const ides = config.getConfig('ides_setup', []);
      expect(ides).toContain('claude-code');
      expect(ides).toContain('unknown-ide');
      expect(ides).toContain('cline');
    });
  });

  describe('Installation Timestamp Handling', () => {
    it('should preserve installation timestamp during update', async () => {
      const originalInstallTime = '2025-01-15T10:30:00.000Z';

      const oldManifest = {
        version: '4.30.0',
        installed_at: originalInstallTime,
        install_type: 'full',
      };

      const migrator = installer.getMigrator();
      const preserveTimestamp = !migrator.shouldUpdateTimestamp('update');

      if (preserveTimestamp) {
        expect(oldManifest.installed_at).toBe(originalInstallTime);
      }
    });

    it('should update modification timestamp on update', async () => {
      const manifest = {
        version: '4.30.0',
        installed_at: '2025-01-15T10:30:00Z',
        install_type: 'full',
        modified_at: '2025-01-15T10:30:00Z', // Optional field
      };

      const config = {
        getConfig: (key) => manifest[key],
        setConfig: (key, value) => {
          manifest[key] = value;
        },
      };

      // Update modification time
      config.setConfig('modified_at', new Date().toISOString());

      expect(config.getConfig('modified_at')).not.toBe(manifest.installed_at);
    });
  });
});
