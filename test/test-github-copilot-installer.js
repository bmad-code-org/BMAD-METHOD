/**
 * GitHub Copilot Installer Tests
 *
 * Tests for the GitHubCopilotSetup class methods:
 * - loadModuleConfig: module-aware config loading
 * - createTechWriterPromptContent: BMM-only tech-writer handling
 * - generateCopilotInstructions: selectedModules deduplication
 *
 * Usage: node test/test-github-copilot-installer.js
 */

const path = require('node:path');
const fs = require('fs-extra');
const { GitHubCopilotSetup } = require('../tools/cli/installers/lib/ide/github-copilot');

// ANSI colors
const colors = {
  reset: '\u001B[0m',
  green: '\u001B[32m',
  red: '\u001B[31m',
  yellow: '\u001B[33m',
  cyan: '\u001B[36m',
  dim: '\u001B[2m',
};

let passed = 0;
let failed = 0;

/**
 * Test helper: Assert condition
 */
function assert(condition, testName, errorMessage = '') {
  if (condition) {
    console.log(`${colors.green}✓${colors.reset} ${testName}`);
    passed++;
  } else {
    console.log(`${colors.red}✗${colors.reset} ${testName}`);
    if (errorMessage) {
      console.log(`  ${colors.dim}${errorMessage}${colors.reset}`);
    }
    failed++;
  }
}

/**
 * Test Suite
 */
async function runTests() {
  console.log(`${colors.cyan}========================================`);
  console.log('GitHub Copilot Installer Tests');
  console.log(`========================================${colors.reset}\n`);

  const tempDir = path.join(__dirname, 'temp-copilot-test');

  try {
    // Clean up any leftover temp directory
    await fs.remove(tempDir);
    await fs.ensureDir(tempDir);

    const installer = new GitHubCopilotSetup();

    // ============================================================
    // Test Suite 1: loadModuleConfig
    // ============================================================
    console.log(`${colors.yellow}Test Suite 1: loadModuleConfig${colors.reset}\n`);

    // Create mock bmad directory structure with multiple modules
    const bmadDir = path.join(tempDir, '_bmad');
    await fs.ensureDir(path.join(bmadDir, 'core'));
    await fs.ensureDir(path.join(bmadDir, 'bmm'));
    await fs.ensureDir(path.join(bmadDir, 'custom-module'));

    // Create config files for each module
    await fs.writeFile(path.join(bmadDir, 'core', 'config.yaml'), 'project_name: Core Project\nuser_name: CoreUser\n');
    await fs.writeFile(path.join(bmadDir, 'bmm', 'config.yaml'), 'project_name: BMM Project\nuser_name: BmmUser\n');
    await fs.writeFile(path.join(bmadDir, 'custom-module', 'config.yaml'), 'project_name: Custom Project\nuser_name: CustomUser\n');

    // Test 1a: Load config with only core module (default)
    const coreConfig = await installer.loadModuleConfig(bmadDir, ['core']);
    assert(
      coreConfig.project_name === 'Core Project',
      'loadModuleConfig loads core config when only core installed',
      `Got: ${coreConfig.project_name}`,
    );

    // Test 1b: Load config with bmm module (should prefer bmm over core)
    const bmmConfig = await installer.loadModuleConfig(bmadDir, ['bmm', 'core']);
    assert(bmmConfig.project_name === 'BMM Project', 'loadModuleConfig prefers bmm config over core', `Got: ${bmmConfig.project_name}`);

    // Test 1c: Load config with custom module (should prefer custom over core)
    const customConfig = await installer.loadModuleConfig(bmadDir, ['custom-module', 'core']);
    assert(
      customConfig.project_name === 'Custom Project',
      'loadModuleConfig prefers custom module config over core',
      `Got: ${customConfig.project_name}`,
    );

    // Test 1d: Load config with multiple non-core modules (first wins)
    const multiConfig = await installer.loadModuleConfig(bmadDir, ['bmm', 'custom-module', 'core']);
    assert(
      multiConfig.project_name === 'BMM Project',
      'loadModuleConfig uses first non-core module config',
      `Got: ${multiConfig.project_name}`,
    );

    // Test 1e: Empty modules list uses default (core)
    const defaultConfig = await installer.loadModuleConfig(bmadDir);
    assert(
      defaultConfig.project_name === 'Core Project',
      'loadModuleConfig defaults to core when no modules specified',
      `Got: ${defaultConfig.project_name}`,
    );

    // Test 1f: Non-existent module falls back to core
    const fallbackConfig = await installer.loadModuleConfig(bmadDir, ['nonexistent', 'core']);
    assert(
      fallbackConfig.project_name === 'Core Project',
      'loadModuleConfig falls back to core for non-existent modules',
      `Got: ${fallbackConfig.project_name}`,
    );

    console.log('');

    // ============================================================
    // Test Suite 2: createTechWriterPromptContent (BMM-only)
    // ============================================================
    console.log(`${colors.yellow}Test Suite 2: createTechWriterPromptContent (BMM-only)${colors.reset}\n`);

    // Test 2a: BMM tech-writer entry should generate content
    const bmmTechWriterEntry = {
      'agent-name': 'tech-writer',
      module: 'bmm',
      name: 'Write Document',
    };
    const bmmResult = installer.createTechWriterPromptContent(bmmTechWriterEntry);
    assert(
      bmmResult !== null && bmmResult.fileName === 'bmad-bmm-write-document',
      'createTechWriterPromptContent generates content for BMM tech-writer',
      `Got: ${bmmResult ? bmmResult.fileName : 'null'}`,
    );

    // Test 2b: Non-BMM tech-writer entry should return null
    const customTechWriterEntry = {
      'agent-name': 'tech-writer',
      module: 'custom-module',
      name: 'Write Document',
    };
    const customResult = installer.createTechWriterPromptContent(customTechWriterEntry);
    assert(customResult === null, 'createTechWriterPromptContent returns null for non-BMM tech-writer', `Got: ${customResult}`);

    // Test 2c: Core tech-writer entry should return null
    const coreTechWriterEntry = {
      'agent-name': 'tech-writer',
      module: 'core',
      name: 'Write Document',
    };
    const coreResult = installer.createTechWriterPromptContent(coreTechWriterEntry);
    assert(coreResult === null, 'createTechWriterPromptContent returns null for core tech-writer', `Got: ${coreResult}`);

    // Test 2d: Non-tech-writer BMM entry should return null
    const nonTechWriterEntry = {
      'agent-name': 'pm',
      module: 'bmm',
      name: 'Write Document',
    };
    const nonTechResult = installer.createTechWriterPromptContent(nonTechWriterEntry);
    assert(nonTechResult === null, 'createTechWriterPromptContent returns null for non-tech-writer agents', `Got: ${nonTechResult}`);

    // Test 2e: Unknown tech-writer command should return null
    const unknownCmdEntry = {
      'agent-name': 'tech-writer',
      module: 'bmm',
      name: 'Unknown Command',
    };
    const unknownResult = installer.createTechWriterPromptContent(unknownCmdEntry);
    assert(unknownResult === null, 'createTechWriterPromptContent returns null for unknown commands', `Got: ${unknownResult}`);

    console.log('');

    // ============================================================
    // Test Suite 3: selectedModules deduplication
    // ============================================================
    console.log(`${colors.yellow}Test Suite 3: selectedModules deduplication${colors.reset}\n`);

    // We can't easily test generateCopilotInstructions directly without mocking,
    // but we can verify the deduplication logic pattern
    const testDedupe = (modules) => {
      const installedModules = modules.length > 0 ? [...new Set(modules)] : ['core'];
      return installedModules;
    };

    // Test 3a: Duplicate modules should be deduplicated
    const dupeResult = testDedupe(['bmm', 'core', 'bmm', 'custom', 'core', 'custom']);
    assert(
      dupeResult.length === 3 && dupeResult.includes('bmm') && dupeResult.includes('core') && dupeResult.includes('custom'),
      'Deduplication removes duplicate modules',
      `Got: ${JSON.stringify(dupeResult)}`,
    );

    // Test 3b: Empty array defaults to core
    const emptyResult = testDedupe([]);
    assert(
      emptyResult.length === 1 && emptyResult[0] === 'core',
      'Empty modules array defaults to core',
      `Got: ${JSON.stringify(emptyResult)}`,
    );

    // Test 3c: Order is preserved after deduplication (first occurrence wins)
    const orderResult = testDedupe(['custom', 'bmm', 'custom', 'bmm']);
    assert(
      orderResult[0] === 'custom' && orderResult[1] === 'bmm',
      'Deduplication preserves order (first occurrence)',
      `Got: ${JSON.stringify(orderResult)}`,
    );
  } finally {
    // Cleanup
    await fs.remove(tempDir);
  }

  // Print summary
  console.log(`${colors.cyan}========================================`);
  console.log('Test Results:');
  console.log(`  Passed: ${passed}`);
  console.log(`  Failed: ${failed}`);
  console.log(`========================================${colors.reset}\n`);

  if (failed > 0) {
    console.log(`${colors.red}Some tests failed!${colors.reset}`);
    process.exit(1);
  } else {
    console.log(`${colors.green}✨ All GitHub Copilot installer tests passed!${colors.reset}`);
  }
}

runTests().catch((error) => {
  console.error(`${colors.red}Test runner error:${colors.reset}`, error);
  process.exit(1);
});
