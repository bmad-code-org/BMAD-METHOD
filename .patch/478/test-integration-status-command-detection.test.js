/**
 * Integration Tests for Status Command with Installation Detection
 * Tests the end-to-end behavior of the status command
 * Issue #478: Status command not detecting BMAD installations
 */

const path = require('node:path');
const fs = require('fs-extra');
const { execSync } = require('node:child_process');

describe('Status Command Integration Tests - status-command-detection.test.js', () => {
  let testProjectRoot;
  let originalCwd;

  beforeEach(async () => {
    // Save original working directory
    originalCwd = process.cwd();

    // Create test project
    testProjectRoot = path.join(__dirname, '..', 'fixtures', `status-test-${Date.now()}`);
    await fs.ensureDir(testProjectRoot);
  });

  afterEach(async () => {
    // Restore original working directory
    process.chdir(originalCwd);

    // Clean up test project
    if (await fs.pathExists(testProjectRoot)) {
      await fs.remove(testProjectRoot);
    }
  });

  // ==========================================
  // SUITE 1: Status Command from Project Root
  // ==========================================

  describe('Status Command from Project Root', () => {
    test('REPRODUCES BUG: should detect status when run from project root', async () => {
      // Setup: Create project with BMAD installation
      const bmadPath = path.join(testProjectRoot, 'bmad');
      await fs.ensureDir(bmadPath);
      await fs.ensureDir(path.join(bmadPath, 'core'));

      // Create minimal install manifest
      const manifestPath = path.join(bmadPath, '.install-manifest.yaml');
      await fs.writeFile(manifestPath, 'version: 1.0.0\ninstalled_at: "2025-01-01T00:00:00Z"\n');

      // Change to project root
      process.chdir(testProjectRoot);

      // Execute: Run status command from project root
      // Simulating: npx bmad-method status
      const { Installer } = require('../../../tools/cli/installers/lib/core/installer');
      const installer = new Installer();
      const status = await installer.getStatus('.');

      // Assert: Should detect installation
      expect(status.installed).toBe(true);
      // This might work or fail depending on cwd handling
    });

    test('should detect with explicit current directory', async () => {
      // Setup
      const bmadPath = path.join(testProjectRoot, 'bmad');
      await fs.ensureDir(bmadPath);
      await fs.ensureDir(path.join(bmadPath, 'core'));

      process.chdir(testProjectRoot);

      // Execute: Explicit current directory
      const { Installer } = require('../../../tools/cli/installers/lib/core/installer');
      const installer = new Installer();
      const status = await installer.getStatus(process.cwd());

      // Assert
      expect(status.installed).toBe(true);
    });

    test('should work with absolute path to project root', async () => {
      // Setup
      const bmadPath = path.join(testProjectRoot, 'bmad');
      await fs.ensureDir(bmadPath);
      await fs.ensureDir(path.join(bmadPath, 'core'));

      // Execute: Absolute path
      const { Installer } = require('../../../tools/cli/installers/lib/core/installer');
      const installer = new Installer();
      const status = await installer.getStatus(testProjectRoot);

      // Assert
      expect(status.installed).toBe(true);
    });
  });

  // ==========================================
  // SUITE 2: Status Command from Subdirectory
  // ==========================================

  describe('Status Command from Subdirectory (Issue #478)', () => {
    test('REPRODUCES BUG: should search up to find parent BMAD installation', async () => {
      // Setup: Create typical project structure
      //   project/
      //   ├── bmad/          ← BMAD installed here
      //   ├── src/
      //   │   └── components/
      //   └── package.json

      const bmadPath = path.join(testProjectRoot, 'bmad');
      const srcPath = path.join(testProjectRoot, 'src', 'components');

      await fs.ensureDir(bmadPath);
      await fs.ensureDir(path.join(bmadPath, 'core'));
      await fs.ensureDir(srcPath);
      await fs.writeJSON(path.join(testProjectRoot, 'package.json'), { name: 'test-project' });

      // Change to subdirectory
      process.chdir(srcPath);

      // Execute: Run status from subdirectory
      const { Installer } = require('../../../tools/cli/installers/lib/core/installer');
      const installer = new Installer();
      const status = await installer.getStatus('.');

      // Assert: Should find installation in parent directory
      expect(status.installed).toBe(true); // ❌ FAILS - BUG #478
    });

    test('REPRODUCES BUG: should find installation 2 levels up', async () => {
      // Setup: More deeply nested
      //   project/
      //   ├── bmad/
      //   └── src/
      //       └── app/
      //           └── utils/

      const bmadPath = path.join(testProjectRoot, 'bmad');
      const deepPath = path.join(testProjectRoot, 'src', 'app', 'utils');

      await fs.ensureDir(bmadPath);
      await fs.ensureDir(path.join(bmadPath, 'core'));
      await fs.ensureDir(deepPath);

      process.chdir(deepPath);

      // Execute
      const { Installer } = require('../../../tools/cli/installers/lib/core/installer');
      const installer = new Installer();
      const status = await installer.getStatus('.');

      // Assert
      expect(status.installed).toBe(true); // ❌ FAILS - BUG #478
    });

    test('REPRODUCES BUG: should find installation 3 levels up', async () => {
      // Setup: Very deeply nested
      const bmadPath = path.join(testProjectRoot, 'bmad');
      const veryDeepPath = path.join(testProjectRoot, 'a', 'b', 'c', 'd');

      await fs.ensureDir(bmadPath);
      await fs.ensureDir(path.join(bmadPath, 'core'));
      await fs.ensureDir(veryDeepPath);

      process.chdir(veryDeepPath);

      // Execute
      const { Installer } = require('../../../tools/cli/installers/lib/core/installer');
      const installer = new Installer();
      const status = await installer.getStatus('.');

      // Assert
      expect(status.installed).toBe(true); // ❌ FAILS - BUG #478
    });

    test('REPRODUCES BUG: should work with relative paths from subdirectory', async () => {
      // Setup
      const bmadPath = path.join(testProjectRoot, 'bmad');
      const srcPath = path.join(testProjectRoot, 'src');

      await fs.ensureDir(bmadPath);
      await fs.ensureDir(path.join(bmadPath, 'core'));
      await fs.ensureDir(srcPath);

      process.chdir(srcPath);

      // Execute: Use relative path ..
      const { Installer } = require('../../../tools/cli/installers/lib/core/installer');
      const installer = new Installer();
      const status = await installer.getStatus('..');

      // Assert
      expect(status.installed).toBe(true); // ❌ FAILS
    });
  });

  // ==========================================
  // SUITE 3: Status Command with Legacy Folders
  // ==========================================

  describe('Status Command with Legacy Folders', () => {
    test('REPRODUCES BUG: should detect legacy .bmad-core installation', async () => {
      // Setup: Legacy project structure
      const legacyPath = path.join(testProjectRoot, '.bmad-core');
      const agentsPath = path.join(legacyPath, 'agents');

      await fs.ensureDir(agentsPath);

      // Execute
      const { Installer } = require('../../../tools/cli/installers/lib/core/installer');
      const installer = new Installer();
      const status = await installer.getStatus(testProjectRoot);

      // Assert
      expect(status.installed).toBe(true); // ❌ FAILS - BUG
    });

    test('REPRODUCES BUG: should detect legacy .bmad-method installation', async () => {
      // Setup
      const legacyPath = path.join(testProjectRoot, '.bmad-method');
      await fs.ensureDir(legacyPath);

      // Execute
      const { Installer } = require('../../../tools/cli/installers/lib/core/installer');
      const installer = new Installer();
      const status = await installer.getStatus(testProjectRoot);

      // Assert
      expect(status.installed).toBe(true); // ❌ FAILS - BUG
    });

    test('REPRODUCES BUG: should search parents for legacy .bmad-core/', async () => {
      // Setup
      const legacyPath = path.join(testProjectRoot, '.bmad-core');
      const childPath = path.join(testProjectRoot, 'src');

      await fs.ensureDir(legacyPath);
      await fs.ensureDir(childPath);

      process.chdir(childPath);

      // Execute
      const { Installer } = require('../../../tools/cli/installers/lib/core/installer');
      const installer = new Installer();
      const status = await installer.getStatus('.');

      // Assert
      expect(status.installed).toBe(true); // ❌ FAILS - BUG
    });

    test('REPRODUCES BUG: should prefer modern bmad/ over legacy folders', async () => {
      // Setup: Both exist
      const modernPath = path.join(testProjectRoot, 'bmad');
      const legacyPath = path.join(testProjectRoot, '.bmad-core');

      await fs.ensureDir(modernPath);
      await fs.ensureDir(path.join(modernPath, 'core'));
      await fs.ensureDir(legacyPath);

      // Execute
      const { Installer } = require('../../../tools/cli/installers/lib/core/installer');
      const installer = new Installer();
      const status = await installer.getStatus(testProjectRoot);

      // Assert
      expect(status.installed).toBe(true);
      // After fix: expect(status.path).toContain('bmad'); // prefer modern
    });
  });

  // ==========================================
  // SUITE 4: Status Command Output
  // ==========================================

  describe('Status Command Output Validation', () => {
    test('should output correct installation info when found', async () => {
      // Setup: Create installation with metadata
      const bmadPath = path.join(testProjectRoot, 'bmad');
      const corePath = path.join(bmadPath, 'core');

      await fs.ensureDir(corePath);

      // Create manifest with version and IDEs
      const manifestPath = path.join(bmadPath, '.install-manifest.yaml');
      await fs.writeFile(
        manifestPath,
        `
version: 1.2.3
installed_at: "2025-01-01T00:00:00Z"
ides:
  - vscode
  - claude-code
`,
      );

      // Execute
      const { Installer } = require('../../../tools/cli/installers/lib/core/installer');
      const installer = new Installer();
      const status = await installer.getStatus(testProjectRoot);

      // Assert: Verify returned status object has expected fields
      expect(status).toHaveProperty('installed');
      expect(status).toHaveProperty('path');
      expect(status).toHaveProperty('version');
      expect(status).toHaveProperty('hasCore');
      expect(status.installed).toBe(true);
      expect(status.version).toBe('1.2.3');
      expect(status.hasCore).toBe(true);
    });

    test('should include IDE info in status output', async () => {
      // Setup
      const bmadPath = path.join(testProjectRoot, 'bmad');
      await fs.ensureDir(bmadPath);

      const manifestPath = path.join(bmadPath, '.install-manifest.yaml');
      await fs.writeFile(
        manifestPath,
        `
version: 1.0.0
ides:
  - vscode
  - claude-code
  - github-copilot
`,
      );

      // Execute
      const { Installer } = require('../../../tools/cli/installers/lib/core/installer');
      const installer = new Installer();
      const status = await installer.getStatus(testProjectRoot);

      // Assert
      expect(status.ides).toBeDefined();
      expect(status.ides.length).toBeGreaterThan(0);
    });

    test('should return sensible defaults when manifest missing', async () => {
      // Setup: Installation folder exists but no manifest
      const bmadPath = path.join(testProjectRoot, 'bmad');
      const corePath = path.join(bmadPath, 'core');

      await fs.ensureDir(corePath);

      // Execute
      const { Installer } = require('../../../tools/cli/installers/lib/core/installer');
      const installer = new Installer();
      const status = await installer.getStatus(testProjectRoot);

      // Assert: Should still detect as installed, with defaults
      expect(status.installed).toBe(true);
      expect(status.version).toBeDefined(); // or null, but not undefined
    });
  });

  // ==========================================
  // SUITE 5: Error Handling
  // ==========================================

  describe('Status Command Error Handling', () => {
    test('should return installed=false for non-existent directory', async () => {
      // Setup: Directory doesn't exist
      const nonExistent = path.join(testProjectRoot, 'does-not-exist');

      // Execute: Should handle gracefully
      const { Installer } = require('../../../tools/cli/installers/lib/core/installer');
      const installer = new Installer();
      const status = await installer.getStatus(nonExistent);

      // Assert
      expect(status.installed).toBe(false);
    });

    test('should not crash with permission denied', async () => {
      // Setup: This test may be OS-specific
      // Skip on systems where we can't set permissions

      if (process.platform === 'win32') {
        // Skip on Windows - permission model is different
        expect(true).toBe(true);
        return;
      }

      // Create protected directory
      const protectedDir = path.join(testProjectRoot, 'protected');
      await fs.ensureDir(protectedDir);

      try {
        // Remove read permissions
        fs.chmodSync(protectedDir, 0o000);

        // Execute: Should handle permission error gracefully
        const { Installer } = require('../../../tools/cli/installers/lib/core/installer');
        const installer = new Installer();

        // Should not throw
        const status = await installer.getStatus(protectedDir);
        expect(status).toBeDefined();
      } finally {
        // Restore permissions for cleanup
        fs.chmodSync(protectedDir, 0o755);
      }
    });

    test('should handle symlinked directories', async () => {
      // Setup: Create real directory and symlink
      const realBmad = path.join(testProjectRoot, 'real-bmad');
      const symlinkBmad = path.join(testProjectRoot, 'link-bmad');

      await fs.ensureDir(realBmad);
      await fs.ensureDir(path.join(realBmad, 'core'));

      try {
        fs.symlinkSync(realBmad, symlinkBmad, 'dir');

        // Execute: Use symlink path
        const { Installer } = require('../../../tools/cli/installers/lib/core/installer');
        const installer = new Installer();
        const status = await installer.getStatus(path.join(testProjectRoot, 'link-bmad'));

        // Assert: Should resolve symlink and detect installation
        expect(status.installed).toBe(true);
      } catch (error) {
        // Skip if symlinks not supported (Windows without admin)
        if (error.code === 'EEXIST' || error.code === 'EACCES') {
          expect(true).toBe(true);
        } else {
          throw error;
        }
      }
    });
  });

  // ==========================================
  // TEST SUMMARY
  // ==========================================

  /*
   * EXPECTED TEST RESULTS:
   *
   * Suite 1 (From Project Root):
   * ? Root detection - UNCLEAR (may work or fail)
   * ✓ Explicit cwd - PASS (if passed correctly)
   * ✓ Absolute path - PASS
   *
   * Suite 2 (From Subdirectory):
   * ✗ Find parent 1 level - FAIL (BUG #478)
   * ✗ Find parent 2 levels - FAIL (BUG #478)
   * ✗ Find parent 3 levels - FAIL (BUG #478)
   * ✗ Relative path .. - FAIL (BUG #478)
   *
   * Suite 3 (Legacy Folders):
   * ✗ .bmad-core detection - FAIL (BUG)
   * ✗ .bmad-method detection - FAIL (BUG)
   * ✗ Legacy parent search - FAIL (BUG)
   * ✓ Modern preference - PASS
   *
   * Suite 4 (Output Validation):
   * ✓ Correct info output - PASS (if detected)
   * ✓ IDE info - PASS
   * ✓ Sensible defaults - PASS
   *
   * Suite 5 (Error Handling):
   * ✓ Non-existent dir - PASS
   * ? Permission denied - OS-DEPENDENT
   * ? Symlinks - PLATFORM-DEPENDENT
   *
   * SUMMARY: ~8-10 tests expected to FAIL
   */
});
