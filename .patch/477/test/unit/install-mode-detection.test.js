/**
 * Update Mode Detection Unit Tests
 * Tests for detecting fresh install, update, reinstall, and invalid modes
 * File: test/unit/install-mode-detection.test.js
 */

const path = require('node:path');
const fs = require('fs-extra');
const yaml = require('js-yaml');
const { InstallModeDetector } = require('../../tools/cli/installers/lib/core/installer');

describe('Installer - Update Mode Detection', () => {
  let tempDir;
  let detector;
  let currentVersion = '4.39.2'; // Simulating current installed version

  beforeEach(() => {
    tempDir = path.join(__dirname, '../fixtures/temp', `detector-${Date.now()}`);
    fs.ensureDirSync(tempDir);
    detector = new InstallModeDetector();
  });

  afterEach(() => {
    if (fs.existsSync(tempDir)) {
      fs.removeSync(tempDir);
    }
  });

  describe('detectInstallMode', () => {
    // Test 3.1: Detect Fresh Install
    it('should detect fresh install when no manifest', () => {
      const projectDir = tempDir;
      const manifestPath = path.join(projectDir, '.bmad-core', 'install-manifest.yaml');

      const mode = detector.detectInstallMode(projectDir, currentVersion);

      expect(mode).toBe('fresh');
    });

    // Test 3.2: Detect Update Install
    it('should detect update when version differs', () => {
      const projectDir = tempDir;
      const bmadDir = path.join(projectDir, '.bmad-core');
      fs.ensureDirSync(bmadDir);

      const manifest = {
        version: '4.36.2', // Older version
        installed_at: '2025-08-12T23:51:04.439Z',
        install_type: 'full',
      };

      const manifestPath = path.join(bmadDir, 'install-manifest.yaml');
      fs.writeFileSync(manifestPath, yaml.dump(manifest));

      const mode = detector.detectInstallMode(projectDir, currentVersion);

      expect(mode).toBe('update');
    });

    // Test 3.3: Detect Reinstall
    it('should detect reinstall when same version', () => {
      const projectDir = tempDir;
      const bmadDir = path.join(projectDir, '.bmad-core');
      fs.ensureDirSync(bmadDir);

      const manifest = {
        version: currentVersion, // Same version
        installed_at: '2025-08-12T23:51:04.439Z',
        install_type: 'full',
      };

      const manifestPath = path.join(bmadDir, 'install-manifest.yaml');
      fs.writeFileSync(manifestPath, yaml.dump(manifest));

      const mode = detector.detectInstallMode(projectDir, currentVersion);

      expect(mode).toBe('reinstall');
    });

    // Test 3.4: Detect Invalid Manifest
    it('should detect invalid manifest', () => {
      const projectDir = tempDir;
      const bmadDir = path.join(projectDir, '.bmad-core');
      fs.ensureDirSync(bmadDir);

      const corruptedContent = `
version: 4.36.2
installed_at: [invalid yaml
      `;

      const manifestPath = path.join(bmadDir, 'install-manifest.yaml');
      fs.writeFileSync(manifestPath, corruptedContent);

      const mode = detector.detectInstallMode(projectDir, currentVersion);

      expect(mode).toBe('invalid');
    });

    // Test 3.5: Version Comparison Edge Cases
    it('should handle version comparison edge cases', () => {
      const testCases = [
        { installed: '4.36.2', current: '4.36.3', expected: 'update' }, // patch bump
        { installed: '4.36.2', current: '5.0.0', expected: 'update' }, // major bump
        { installed: '4.36.2', current: '4.37.0', expected: 'update' }, // minor bump
        { installed: '4.36.2', current: '4.36.2', expected: 'reinstall' }, // same version
        { installed: '4.36.2', current: '4.36.2-beta', expected: 'update' }, // pre-release
      ];

      for (const { installed, current, expected } of testCases) {
        // Clean directory
        fs.removeSync(tempDir);
        const projectDir = tempDir;
        const bmadDir = path.join(projectDir, '.bmad-core');
        fs.ensureDirSync(bmadDir);

        const manifest = {
          version: installed,
          installed_at: '2025-08-12T23:51:04.439Z',
          install_type: 'full',
        };

        const manifestPath = path.join(bmadDir, 'install-manifest.yaml');
        fs.writeFileSync(manifestPath, yaml.dump(manifest));

        const mode = detector.detectInstallMode(projectDir, current);
        expect(mode).toBe(expected);
      }
    });

    // Test 3.6: Logging in Detection
    it('should log detection results', () => {
      const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();

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

      detector.detectInstallMode(projectDir, currentVersion);

      // Should have logged something about the detection
      expect(consoleLogSpy).toHaveBeenCalled();

      consoleLogSpy.mockRestore();
    });
  });

  describe('compareVersions', () => {
    it('should correctly compare semver versions', () => {
      const testCases = [
        { v1: '4.36.2', v2: '4.39.2', expected: -1 }, // v1 < v2
        { v1: '4.39.2', v2: '4.36.2', expected: 1 }, // v1 > v2
        { v1: '4.36.2', v2: '4.36.2', expected: 0 }, // v1 === v2
        { v1: '5.0.0', v2: '4.36.2', expected: 1 }, // major > minor
        { v1: '4.36.2', v2: '4.40.0', expected: -1 }, // minor bump
      ];

      for (const { v1, v2, expected } of testCases) {
        const result = detector.compareVersions(v1, v2);
        expect(result).toBe(expected);
      }
    });
  });

  describe('isValidVersion', () => {
    it('should validate semver format', () => {
      const validVersions = ['4.36.2', '1.0.0', '10.20.30', '0.0.1', '4.36.2-beta'];
      const invalidVersions = ['not-version', '4.36', '4', '4.36.2.1', 'v4.36.2'];

      for (const v of validVersions) {
        expect(detector.isValidVersion(v)).toBe(true);
      }

      for (const v of invalidVersions) {
        expect(detector.isValidVersion(v)).toBe(false);
      }
    });
  });

  describe('getManifestPath', () => {
    it('should return correct manifest path', () => {
      const projectDir = tempDir;
      const manifestPath = detector.getManifestPath(projectDir);

      expect(manifestPath).toBe(path.join(projectDir, '.bmad-core', 'install-manifest.yaml'));
    });
  });
});
