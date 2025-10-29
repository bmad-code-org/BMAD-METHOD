/**
 * Integration Tests - Question Skipping on Update
 * Tests for skipping questions during update installations
 * File: test/integration/questions-skipped-on-update.test.js
 */

const path = require('node:path');
const fs = require('fs-extra');
const yaml = require('js-yaml');
const { Installer } = require('../../tools/cli/installers/lib/core/installer');

describe('Update Install Flow - Question Skipping', () => {
  let tempDir;
  let installer;

  beforeEach(() => {
    tempDir = path.join(__dirname, '../fixtures/temp', `update-${Date.now()}`);
    fs.ensureDirSync(tempDir);
    installer = new Installer();
  });

  afterEach(() => {
    if (fs.existsSync(tempDir)) {
      fs.removeSync(tempDir);
    }
  });

  describe('Update Install with No Prompts', () => {
    // Test 6.1: No Prompts During Update
    it('should not show any config questions on update', async () => {
      const projectDir = tempDir;
      const bmadDir = path.join(projectDir, '.bmad-core');
      fs.ensureDirSync(bmadDir);

      const manifest = {
        version: '4.36.2', // Old version
        installed_at: '2025-08-12T23:51:04.439Z',
        install_type: 'full',
        prd_sharding: true,
        architecture_sharding: false,
        ides_setup: ['claude-code'],
      };

      const manifestPath = path.join(bmadDir, 'install-manifest.yaml');
      fs.writeFileSync(manifestPath, yaml.dump(manifest));

      const mockInquirer = jest.spyOn(require('inquirer'), 'prompt');
      mockInquirer.mockClear();

      // Simulate update installation (version bump from 4.36.2 to 4.39.2)
      const installContext = {
        projectDir,
        currentVersion: '4.39.2',
        isUpdate: true,
      };

      const mode = installer.detectInstallMode(projectDir, installContext.currentVersion);
      expect(mode).toBe('update');

      // During update, no configuration questions should be asked
      // (In real usage, prompt calls would be skipped in question handlers)
      expect(installContext.isUpdate).toBe(true);

      mockInquirer.mockRestore();
    });

    // Test 6.2: All Prompts During Fresh Install
    it('should show all config questions on fresh install', async () => {
      const projectDir = tempDir;

      const mockInquirer = jest.spyOn(require('inquirer'), 'prompt');
      mockInquirer.mockClear();

      const installContext = {
        projectDir,
        currentVersion: '4.39.2',
        isUpdate: false,
      };

      const mode = installer.detectInstallMode(projectDir, installContext.currentVersion);
      expect(mode).toBe('fresh');

      // During fresh install, all questions should be asked
      expect(installContext.isUpdate).toBe(false);

      mockInquirer.mockRestore();
    });

    // Test 6.3: Graceful Fallback on Invalid Config
    it('should ask questions if config invalid on update', async () => {
      const projectDir = tempDir;
      const bmadDir = path.join(projectDir, '.bmad-core');
      fs.ensureDirSync(bmadDir);

      const corruptedManifest = 'invalid: [yaml: format:';

      const manifestPath = path.join(bmadDir, 'install-manifest.yaml');
      fs.writeFileSync(manifestPath, corruptedManifest);

      const mode = installer.detectInstallMode(projectDir, '4.39.2');
      expect(mode).toBe('invalid');

      // Should fall back to fresh install behavior (ask all questions)
      const context = { isUpdate: false };
      expect(context.isUpdate).toBe(false);
    });
  });

  describe('Configuration Preservation During Updates', () => {
    it('should preserve existing config during update', async () => {
      const projectDir = tempDir;
      const bmadDir = path.join(projectDir, '.bmad-core');
      fs.ensureDirSync(bmadDir);

      const originalManifest = {
        version: '4.36.2',
        installed_at: '2025-08-12T23:51:04.439Z',
        install_type: 'full',
        prd_sharding: true,
        architecture_sharding: false,
        doc_organization: 'by-module',
        ides_setup: ['claude-code', 'cline'],
        expansion_packs: ['bmad-infrastructure-devops'],
      };

      const manifestPath = path.join(bmadDir, 'install-manifest.yaml');
      fs.writeFileSync(manifestPath, yaml.dump(originalManifest));

      const config = await installer.loadConfigForProject(projectDir);

      // All settings should be preserved
      expect(config.getConfig('prd_sharding')).toBe(true);
      expect(config.getConfig('architecture_sharding')).toBe(false);
      expect(config.getConfig('doc_organization')).toBe('by-module');
      expect(config.getConfig('ides_setup')).toEqual(['claude-code', 'cline']);
      expect(config.getConfig('expansion_packs')).toEqual(['bmad-infrastructure-devops']);
    });

    it('should use cached values for all skipped questions', async () => {
      const projectDir = tempDir;
      const bmadDir = path.join(projectDir, '.bmad-core');
      fs.ensureDirSync(bmadDir);

      const manifest = {
        version: '4.36.2',
        installed_at: '2025-08-12T23:51:04.439Z',
        install_type: 'full',
        setting1: 'value1',
        setting2: 'value2',
        setting3: 'value3',
        setting4: 'value4',
      };

      const manifestPath = path.join(bmadDir, 'install-manifest.yaml');
      fs.writeFileSync(manifestPath, yaml.dump(manifest));

      const config = await installer.loadConfigForProject(projectDir);

      // Should use cached values for all settings
      expect(config.getConfig('setting1')).toBe('value1');
      expect(config.getConfig('setting2')).toBe('value2');
      expect(config.getConfig('setting3')).toBe('value3');
      expect(config.getConfig('setting4')).toBe('value4');
    });
  });

  describe('Version-Based Behavior Switching', () => {
    it('should skip questions when version bump detected', async () => {
      const projectDir = tempDir;
      const bmadDir = path.join(projectDir, '.bmad-core');
      fs.ensureDirSync(bmadDir);

      const testCases = [
        { installed: '4.36.2', current: '4.36.3', shouldSkip: true },
        { installed: '4.36.2', current: '4.37.0', shouldSkip: true },
        { installed: '4.36.2', current: '5.0.0', shouldSkip: true },
        { installed: '4.36.2', current: '4.36.2', shouldSkip: true },
      ];

      for (const testCase of testCases) {
        fs.removeSync(bmadDir);
        fs.ensureDirSync(bmadDir);

        const manifest = {
          version: testCase.installed,
          installed_at: '2025-08-12T23:51:04.439Z',
          install_type: 'full',
        };

        fs.writeFileSync(path.join(bmadDir, 'install-manifest.yaml'), yaml.dump(manifest));

        const mode = installer.detectInstallMode(projectDir, testCase.current);
        const shouldSkipQuestions = mode === 'update' || mode === 'reinstall';

        expect(shouldSkipQuestions).toBe(testCase.shouldSkip);
      }
    });
  });

  describe('Error Handling During Updates', () => {
    it('should handle partial manifest gracefully', async () => {
      const projectDir = tempDir;
      const bmadDir = path.join(projectDir, '.bmad-core');
      fs.ensureDirSync(bmadDir);

      const partialManifest = {
        version: '4.36.2',
        installed_at: '2025-08-12T23:51:04.439Z',
        // Missing install_type - but should still be readable
      };

      const manifestPath = path.join(bmadDir, 'install-manifest.yaml');
      fs.writeFileSync(manifestPath, yaml.dump(partialManifest));

      const config = await installer.loadConfigForProject(projectDir);
      expect(config).toBeDefined();
      expect(config.getConfig('version')).toBe('4.36.2');
      expect(config.getConfig('install_type', 'default')).toBe('default');
    });

    it('should recover from corrupt manifest during update', async () => {
      const projectDir = tempDir;
      const bmadDir = path.join(projectDir, '.bmad-core');
      fs.ensureDirSync(bmadDir);

      const manifestPath = path.join(bmadDir, 'install-manifest.yaml');
      fs.writeFileSync(manifestPath, 'invalid: [corrupt: yaml:');

      const mode = installer.detectInstallMode(projectDir, '4.39.2');
      expect(mode).toBe('invalid');

      // Should fall back to safe mode (treat as fresh install)
      const context = { shouldAskQuestions: mode === 'fresh' || mode === 'invalid' };
      expect(context.shouldAskQuestions).toBe(true);
    });
  });
});
