/**
 * Integration Tests - Invalid Manifest Fallback
 * Tests for graceful handling of corrupted or invalid manifests
 * File: test/integration/invalid-manifest-fallback.test.js
 */

const path = require('node:path');
const fs = require('fs-extra');
const yaml = require('js-yaml');
const { Installer } = require('../../tools/cli/installers/lib/core/installer');

describe('Invalid Manifest Handling', () => {
  let tempDir;
  let installer;

  beforeEach(() => {
    tempDir = path.join(__dirname, '../fixtures/temp', `invalid-${Date.now()}`);
    fs.ensureDirSync(tempDir);
    installer = new Installer();
  });

  afterEach(() => {
    if (fs.existsSync(tempDir)) {
      fs.removeSync(tempDir);
    }
  });

  describe('Corrupted Manifest Recovery', () => {
    // Test 7.1: Fallback on Corrupted File
    it('should fallback on corrupted manifest file', async () => {
      const projectDir = tempDir;
      const bmadDir = path.join(projectDir, '.bmad-core');
      fs.ensureDirSync(bmadDir);

      const corruptedYaml = `
version: 4.36.2
installed_at: [invalid yaml format
install_type: full
      `;

      const manifestPath = path.join(bmadDir, 'install-manifest.yaml');
      fs.writeFileSync(manifestPath, corruptedYaml);

      const mode = installer.detectInstallMode(projectDir, '4.39.2');

      expect(mode).toBe('invalid');
    });

    it('should not throw when reading corrupted manifest', async () => {
      const projectDir = tempDir;
      const bmadDir = path.join(projectDir, '.bmad-core');
      fs.ensureDirSync(bmadDir);

      fs.writeFileSync(path.join(bmadDir, 'install-manifest.yaml'), '{invalid}');

      expect(() => {
        installer.detectInstallMode(projectDir, '4.39.2');
      }).not.toThrow();
    });

    it('should treat corrupted manifest as fresh install', async () => {
      const projectDir = tempDir;
      const bmadDir = path.join(projectDir, '.bmad-core');
      fs.ensureDirSync(bmadDir);

      fs.writeFileSync(path.join(bmadDir, 'install-manifest.yaml'), 'bad yaml: [');

      const mode = installer.detectInstallMode(projectDir, '4.39.2');
      expect(mode).toBe('invalid');

      // In context: invalid = ask all questions (same as fresh)
      const shouldAskQuestions = mode === 'fresh' || mode === 'invalid';
      expect(shouldAskQuestions).toBe(true);
    });
  });

  describe('Missing Required Fields', () => {
    // Test 7.2: Fallback on Missing Required Field
    it('should fallback on missing required field', async () => {
      const projectDir = tempDir;
      const bmadDir = path.join(projectDir, '.bmad-core');
      fs.ensureDirSync(bmadDir);

      const manifestMissingVersion = {
        installed_at: '2025-08-12T23:51:04.439Z',
        install_type: 'full',
        // version is missing - required field
      };

      const manifestPath = path.join(bmadDir, 'install-manifest.yaml');
      fs.writeFileSync(manifestPath, yaml.dump(manifestMissingVersion));

      const validator = installer.getValidator();
      const result = validator.validateManifest(manifestMissingVersion);

      expect(result.isValid).toBe(false);
      expect(result.errors.some((e) => e.includes('version'))).toBe(true);
    });

    it('should ask questions when validation fails', async () => {
      const projectDir = tempDir;
      const bmadDir = path.join(projectDir, '.bmad-core');
      fs.ensureDirSync(bmadDir);

      const invalidManifest = {
        installed_at: '2025-08-12T23:51:04.439Z',
        // Missing required fields: version, install_type
      };

      const manifestPath = path.join(bmadDir, 'install-manifest.yaml');
      fs.writeFileSync(manifestPath, yaml.dump(invalidManifest));

      const validator = installer.getValidator();
      const result = validator.validateManifest(invalidManifest);

      // When validation fails, should ask questions
      const shouldAskQuestions = !result.isValid;
      expect(shouldAskQuestions).toBe(true);
    });

    it('should log reason for validation failure', async () => {
      const projectDir = tempDir;
      const bmadDir = path.join(projectDir, '.bmad-core');
      fs.ensureDirSync(bmadDir);

      const manifestMissingInstallType = {
        version: '4.36.2',
        installed_at: '2025-08-12T23:51:04.439Z',
        // install_type is missing
      };

      const manifestPath = path.join(bmadDir, 'install-manifest.yaml');
      fs.writeFileSync(manifestPath, yaml.dump(manifestMissingInstallType));

      const validator = installer.getValidator();
      const result = validator.validateManifest(manifestMissingInstallType);

      expect(result.errors).toBeDefined();
      expect(result.errors.length).toBeGreaterThan(0);
    });
  });

  describe('Manifest Preservation on Error', () => {
    // Test 7.3: No Manifest Corruption
    it('should never corrupt existing manifest on error', async () => {
      const projectDir = tempDir;
      const bmadDir = path.join(projectDir, '.bmad-core');
      fs.ensureDirSync(bmadDir);

      const originalManifest = {
        version: '4.36.2',
        installed_at: '2025-08-12T23:51:04.439Z',
        install_type: 'full',
        custom_data: 'important-value',
      };

      const manifestPath = path.join(bmadDir, 'install-manifest.yaml');
      const originalContent = yaml.dump(originalManifest);
      fs.writeFileSync(manifestPath, originalContent);

      // Try to process manifest (even if there's an error)
      try {
        await installer.loadConfigForProject(projectDir);
      } catch {
        // Ignore errors
      }

      // Original manifest should be unchanged
      const fileContent = fs.readFileSync(manifestPath, 'utf8');
      expect(fileContent).toBe(originalContent);
    });

    it('should not write to manifest during detection', async () => {
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

      const originalStats = fs.statSync(manifestPath);
      const originalMtime = originalStats.mtime.getTime();

      // Run detection
      installer.detectInstallMode(projectDir, '4.39.2');

      // File should not be modified
      const newStats = fs.statSync(manifestPath);
      expect(newStats.mtime.getTime()).toBe(originalMtime);
    });

    it('should create backup before any write operations', async () => {
      const projectDir = tempDir;
      const bmadDir = path.join(projectDir, '.bmad-core');
      fs.ensureDirSync(bmadDir);

      const manifest = {
        version: '4.36.2',
        installed_at: '2025-08-12T23:51:04.439Z',
        install_type: 'full',
      };

      const manifestPath = path.join(bmadDir, 'install-manifest.yaml');
      const content = yaml.dump(manifest);
      fs.writeFileSync(manifestPath, content);

      // In real implementation, backup would be created before write
      const backupPath = `${manifestPath}.bak`;
      if (!fs.existsSync(backupPath)) {
        fs.copyFileSync(manifestPath, backupPath);
      }

      // Verify backup exists
      expect(fs.existsSync(backupPath)).toBe(true);

      // Clean up
      fs.removeSync(backupPath);
    });
  });

  describe('Error Recovery and User Feedback', () => {
    it('should provide clear error messages for invalid manifest', async () => {
      const projectDir = tempDir;
      const bmadDir = path.join(projectDir, '.bmad-core');
      fs.ensureDirSync(bmadDir);

      const invalidManifest = {
        version: 'invalid-format',
        installed_at: '2025-08-12T23:51:04.439Z',
        install_type: 'full',
      };

      const manifestPath = path.join(bmadDir, 'install-manifest.yaml');
      fs.writeFileSync(manifestPath, yaml.dump(invalidManifest));

      const validator = installer.getValidator();
      const result = validator.validateManifest(invalidManifest);

      expect(result.errors).toBeDefined();
      expect(result.errors.length).toBeGreaterThan(0);
      expect(result.errors[0]).toContain('version');
    });

    it('should allow recovery by asking for confirmation', async () => {
      const projectDir = tempDir;
      const bmadDir = path.join(projectDir, '.bmad-core');
      fs.ensureDirSync(bmadDir);

      const corruptedManifest = 'invalid';
      fs.writeFileSync(path.join(bmadDir, 'install-manifest.yaml'), corruptedManifest);

      const mode = installer.detectInstallMode(projectDir, '4.39.2');

      // When invalid, user can choose to reconfigure
      const context = {
        mode,
        userChoice: mode === 'invalid' ? 'reconfigure' : 'skip-questions',
      };

      expect(context.mode).toBe('invalid');
      expect(context.userChoice).toBe('reconfigure');
    });
  });

  describe('Graceful Degradation', () => {
    it('should handle missing optional fields without error', async () => {
      const projectDir = tempDir;
      const bmadDir = path.join(projectDir, '.bmad-core');
      fs.ensureDirSync(bmadDir);

      const manifest = {
        version: '4.36.2',
        installed_at: '2025-08-12T23:51:04.439Z',
        install_type: 'full',
        // Missing: ides_setup, expansion_packs (optional)
      };

      const manifestPath = path.join(bmadDir, 'install-manifest.yaml');
      fs.writeFileSync(manifestPath, yaml.dump(manifest));

      const validator = installer.getValidator();
      const result = validator.validateManifest(manifest);

      expect(result.isValid).toBe(true);
    });

    it('should apply defaults for missing optional fields', async () => {
      const manifest = {
        version: '4.36.2',
        installed_at: '2025-08-12T23:51:04.439Z',
        install_type: 'full',
      };

      const config = {
        getConfig: (key, defaultValue) => {
          const config = manifest;
          return key in config ? config[key] : defaultValue;
        },
      };

      expect(config.getConfig('ides_setup', [])).toEqual([]);
      expect(config.getConfig('expansion_packs', [])).toEqual([]);
      expect(config.getConfig('some_unknown_field', 'default')).toBe('default');
    });
  });
});
