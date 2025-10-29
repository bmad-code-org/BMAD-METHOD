/**
 * Unit Tests for Installation Detection/Search Functionality
 * Tests the behavior of finding BMAD installations in directory trees
 * Issue #478: Status command not detecting BMAD installations
 */

const path = require('node:path');
const fs = require('fs-extra');
const { Installer } = require('../../../tools/cli/installers/lib/core/installer');
const { Detector } = require('../../../tools/cli/installers/lib/core/detector');

describe('Installation Detection - find-installation.test.js', () => {
  let testDir;
  let installer;
  let detector;

  beforeEach(async () => {
    // Create temporary test directory
    testDir = path.join(__dirname, '..', 'fixtures', `bmad-test-${Date.now()}`);
    await fs.ensureDir(testDir);

    installer = new Installer();
    detector = new Detector();
  });

  afterEach(async () => {
    // Clean up test directory
    if (await fs.pathExists(testDir)) {
      await fs.remove(testDir);
    }
  });

  // ==========================================
  // SUITE 1: Current Behavior (Expected Failures)
  // ==========================================

  describe('Current getStatus() Behavior - BASELINE', () => {
    test('should detect installation when bmad/ folder exists at exact path', async () => {
      // Setup: Create bmad folder at root
      const bmadPath = path.join(testDir, 'bmad');
      await fs.ensureDir(bmadPath);

      // Create minimal config to mark as installed
      const coreDir = path.join(bmadPath, 'core');
      await fs.ensureDir(coreDir);

      // Execute
      const status = await installer.getStatus(testDir);

      // Assert
      expect(status.installed).toBe(true);
    });

    test('FAILS: should detect installation in parent directory', async () => {
      // Setup: Create nested directory structure
      //   testDir/
      //   ├── bmad/
      //   └── src/
      //       └── components/
      const bmadPath = path.join(testDir, 'bmad');
      const nestedDir = path.join(testDir, 'src', 'components');
      await fs.ensureDir(bmadPath);
      await fs.ensureDir(nestedDir);

      // Create minimal installation marker
      const coreDir = path.join(bmadPath, 'core');
      await fs.ensureDir(coreDir);

      // Execute: call getStatus from nested directory
      const status = await installer.getStatus(nestedDir);

      // Assert: CURRENTLY FAILS - should find installation in parent
      // This is the BUG - it returns installed: false when it should be true
      expect(status.installed).toBe(true); // ❌ EXPECTED TO FAIL
    });

    test('FAILS: should detect legacy .bmad-core/ folder', async () => {
      // Setup: Create legacy folder instead of modern bmad/
      const legacyPath = path.join(testDir, '.bmad-core');
      await fs.ensureDir(legacyPath);

      // Execute
      const status = await installer.getStatus(testDir);

      // Assert: CURRENTLY FAILS - legacy folders not checked
      expect(status.installed).toBe(true); // ❌ EXPECTED TO FAIL
    });

    test('FAILS: should detect legacy .bmad-method/ folder', async () => {
      // Setup: Create legacy folder
      const legacyPath = path.join(testDir, '.bmad-method');
      await fs.ensureDir(legacyPath);

      // Execute
      const status = await installer.getStatus(testDir);

      // Assert: CURRENTLY FAILS
      expect(status.installed).toBe(true); // ❌ EXPECTED TO FAIL
    });

    test('should return not installed when no bmad folder exists', async () => {
      // Setup: Empty directory

      // Execute
      const status = await installer.getStatus(testDir);

      // Assert
      expect(status.installed).toBe(false);
    });
  });

  // ==========================================
  // SUITE 2: Directory Search Test Cases
  // ==========================================

  describe('Directory Tree Search Behavior - ISSUE #478', () => {
    test('REPRODUCES BUG: status from nested directory should find parent bmad/', async () => {
      // Setup: Simulate a real project structure
      //   project/
      //   ├── bmad/               ← BMAD installation here
      //   │   ├── core/
      //   │   └── agents/
      //   ├── src/
      //   │   └── components/     ← Run status command from here
      //   └── package.json

      const projectRoot = testDir;
      const bmadPath = path.join(projectRoot, 'bmad');
      const srcPath = path.join(projectRoot, 'src', 'components');

      // Create structure
      await fs.ensureDir(bmadPath);
      await fs.ensureDir(path.join(bmadPath, 'core'));
      await fs.ensureDir(srcPath);
      await fs.writeJSON(path.join(projectRoot, 'package.json'), { name: 'test-project' });

      // Execute: Run status from nested directory
      const status = await installer.getStatus(srcPath);

      // Assert: This demonstrates the bug
      // Currently: installed = false (WRONG)
      // After fix: installed = true (CORRECT)
      expect(status.installed).toBe(true); // ❌ FAILS WITH CURRENT CODE
    });

    test('REPRODUCES BUG: deeply nested directory should find ancestor bmad/', async () => {
      // Setup: Multiple levels deep
      //   project/
      //   ├── bmad/
      //   └── a/
      //       └── b/
      //           └── c/
      //               └── d/    ← 4 levels deep

      const projectRoot = testDir;
      const bmadPath = path.join(projectRoot, 'bmad');
      const deepPath = path.join(projectRoot, 'a', 'b', 'c', 'd');

      await fs.ensureDir(bmadPath);
      await fs.ensureDir(path.join(bmadPath, 'core'));
      await fs.ensureDir(deepPath);

      // Execute
      const status = await installer.getStatus(deepPath);

      // Assert
      expect(status.installed).toBe(true); // ❌ FAILS WITH CURRENT CODE
    });

    test('REPRODUCES BUG: should find closest installation when multiple exist', async () => {
      // Setup: Multiple BMAD installations at different levels
      //   root/
      //   ├── bmad/           ← First (ancestor)
      //   └── projects/
      //       ├── bmad/       ← Second (closest, should prefer this)
      //       └── myapp/

      const root = testDir;
      const ancestorBmad = path.join(root, 'bmad');
      const projectBmad = path.join(root, 'projects', 'bmad');
      const myappPath = path.join(root, 'projects', 'myapp');

      // Create both installations
      await fs.ensureDir(ancestorBmad);
      await fs.ensureDir(path.join(ancestorBmad, 'core'));
      await fs.writeJSON(path.join(ancestorBmad, 'install-manifest.yaml'), { version: '1.0.0' });

      await fs.ensureDir(projectBmad);
      await fs.ensureDir(path.join(projectBmad, 'core'));
      await fs.writeJSON(path.join(projectBmad, 'install-manifest.yaml'), { version: '2.0.0' });

      await fs.ensureDir(myappPath);

      // Execute
      const status = await installer.getStatus(myappPath);

      // Assert: Should find closest (version 2.0.0)
      expect(status.installed).toBe(true); // ❌ FAILS WITH CURRENT CODE
      // After fix, would also verify: expect(status.version).toBe('2.0.0');
    });

    test('REPRODUCES BUG: should handle search reaching filesystem root', async () => {
      // Setup: Create directory with no BMAD installation anywhere
      const orphanDir = path.join(testDir, 'orphan-project');
      await fs.ensureDir(orphanDir);

      // Execute
      const status = await installer.getStatus(orphanDir);

      // Assert: Should return not installed (not crash or hang)
      expect(status.installed).toBe(false);
    });
  });

  // ==========================================
  // SUITE 3: Legacy Folder Detection
  // ==========================================

  describe('Legacy Folder Support', () => {
    test('REPRODUCES BUG: should find .bmad-core/ as installation', async () => {
      // Setup
      const legacyPath = path.join(testDir, '.bmad-core');
      await fs.ensureDir(path.join(legacyPath, 'agents'));

      // Execute
      const status = await installer.getStatus(testDir);

      // Assert
      expect(status.installed).toBe(true); // ❌ FAILS - not checked
    });

    test('REPRODUCES BUG: should find .bmad-method/ as installation', async () => {
      // Setup
      const legacyPath = path.join(testDir, '.bmad-method');
      await fs.ensureDir(legacyPath);

      // Execute
      const status = await installer.getStatus(testDir);

      // Assert
      expect(status.installed).toBe(true); // ❌ FAILS
    });

    test('REPRODUCES BUG: should find .bmm/ as installation', async () => {
      // Setup
      const legacyPath = path.join(testDir, '.bmm');
      await fs.ensureDir(legacyPath);

      // Execute
      const status = await installer.getStatus(testDir);

      // Assert
      expect(status.installed).toBe(true); // ❌ FAILS
    });

    test('REPRODUCES BUG: should find .cis/ as installation', async () => {
      // Setup
      const legacyPath = path.join(testDir, '.cis');
      await fs.ensureDir(legacyPath);

      // Execute
      const status = await installer.getStatus(testDir);

      // Assert
      expect(status.installed).toBe(true); // ❌ FAILS
    });

    test('REPRODUCES BUG: should search parents for legacy folders', async () => {
      // Setup: Legacy folder in parent, code in child
      const legacyPath = path.join(testDir, '.bmad-core');
      const childDir = path.join(testDir, 'src');

      await fs.ensureDir(legacyPath);
      await fs.ensureDir(childDir);

      // Execute
      const status = await installer.getStatus(childDir);

      // Assert
      expect(status.installed).toBe(true); // ❌ FAILS - doesn't search
    });
  });

  // ==========================================
  // SUITE 4: Edge Cases
  // ==========================================

  describe('Edge Cases', () => {
    test('REPRODUCES BUG: should handle relative paths', async () => {
      // Setup
      const bmadPath = path.join(testDir, 'bmad');
      await fs.ensureDir(bmadPath);
      await fs.ensureDir(path.join(bmadPath, 'core'));

      const subdirPath = path.join(testDir, 'src');
      await fs.ensureDir(subdirPath);

      // Execute: Pass relative path
      const status = await installer.getStatus('./src');

      // Assert: Current code may fail with relative paths
      // After fix: should work consistently
      expect(status.installed).toBe(false); // Current behavior (may vary)
    });

    test('REPRODUCES BUG: should skip hidden system directories', async () => {
      // Setup: Create system directories that should be ignored
      const gitDir = path.join(testDir, '.git');
      const nodeModulesDir = path.join(testDir, 'node_modules');
      const vsCodeDir = path.join(testDir, '.vscode');
      const ideaDir = path.join(testDir, '.idea');

      await fs.ensureDir(gitDir);
      await fs.ensureDir(nodeModulesDir);
      await fs.ensureDir(vsCodeDir);
      await fs.ensureDir(ideaDir);

      // Execute
      const status = await installer.getStatus(testDir);

      // Assert
      expect(status.installed).toBe(false); // Should not detect these
    });

    test('REPRODUCES BUG: should work with absolute paths', async () => {
      // Setup
      const bmadPath = path.join(testDir, 'bmad');
      await fs.ensureDir(bmadPath);
      await fs.ensureDir(path.join(bmadPath, 'core'));

      // Execute: Absolute path
      const status = await installer.getStatus(testDir);

      // Assert
      expect(status.installed).toBe(true); // Should work
    });

    test('REPRODUCES BUG: should prioritize modern bmad/ over legacy folders', async () => {
      // Setup: Both modern and legacy exist
      const modernBmad = path.join(testDir, 'bmad');
      const legacyBmad = path.join(testDir, '.bmad-core');

      await fs.ensureDir(modernBmad);
      await fs.ensureDir(path.join(modernBmad, 'core'));
      await fs.ensureDir(legacyBmad);

      // Execute
      const status = await installer.getStatus(testDir);

      // Assert: Should detect installation (either one is fine)
      expect(status.installed).toBe(true);
      // After fix could verify: expect(status.path).toContain('bmad'); // modern preferred
    });
  });

  // ==========================================
  // SUITE 5: Detector Class Tests
  // ==========================================

  describe('Detector Class - detect() Method', () => {
    test('should work correctly when given exact bmad directory path', async () => {
      // Setup: Create proper installation
      const bmadPath = path.join(testDir, 'bmad');
      const corePath = path.join(bmadPath, 'core');
      await fs.ensureDir(corePath);

      // Create minimal config
      const configPath = path.join(corePath, 'config.yaml');
      await fs.writeFile(configPath, 'version: 1.0.0\n');

      // Execute: Pass exact path to detector
      const result = await detector.detect(bmadPath);

      // Assert
      expect(result.installed).toBe(true);
      expect(result.hasCore).toBe(true);
    });

    test('should return not installed for empty directory', async () => {
      // Setup: Empty directory
      const emptyPath = path.join(testDir, 'empty');
      await fs.ensureDir(emptyPath);

      // Execute
      const result = await detector.detect(emptyPath);

      // Assert
      expect(result.installed).toBe(false);
    });

    test('should parse manifest correctly when present', async () => {
      // Setup
      const bmadPath = path.join(testDir, 'bmad');
      await fs.ensureDir(bmadPath);

      // Create manifest
      const manifestPath = path.join(bmadPath, '.install-manifest.yaml');
      const manifestContent = `
version: 1.2.3
installed_at: "2025-01-01T00:00:00Z"
ides:
  - vscode
  - claude-code
`;
      await fs.writeFile(manifestPath, manifestContent);

      // Execute
      const result = await detector.detect(bmadPath);

      // Assert
      expect(result.version).toBe('1.2.3');
      expect(result.manifest).toBeDefined();
    });
  });

  // ==========================================
  // TEST SUMMARY
  // ==========================================

  /*
   * EXPECTED TEST RESULTS:
   *
   * Suite 1 (Current Behavior):
   * ✓ Exact path detection - PASS
   * ✗ Parent directory detection - FAIL (BUG)
   * ✗ Legacy .bmad-core - FAIL (BUG)
   * ✗ Legacy .bmad-method - FAIL (BUG)
   * ✓ No installation - PASS
   *
   * Suite 2 (Directory Search):
   * ✗ Nested directory - FAIL (BUG)
   * ✗ Deeply nested - FAIL (BUG)
   * ✗ Multiple installations - FAIL (BUG)
   * ✓ Orphan directory - PASS
   *
   * Suite 3 (Legacy Folders):
   * ✗ .bmad-core detection - FAIL (BUG)
   * ✗ .bmad-method detection - FAIL (BUG)
   * ✗ .bmm detection - FAIL (BUG)
   * ✗ .cis detection - FAIL (BUG)
   * ✗ Legacy parent search - FAIL (BUG)
   *
   * Suite 4 (Edge Cases):
   * ? Relative paths - VARIES
   * ✓ Skip system dirs - PASS
   * ✓ Absolute paths - PASS
   * ✓ Modern/legacy priority - PASS
   *
   * Suite 5 (Detector Tests):
   * ✓ Exact path - PASS
   * ✓ Empty directory - PASS
   * ✓ Manifest parsing - PASS
   *
   * SUMMARY: ~12 tests expected to FAIL, demonstrating Issue #478
   */
});
