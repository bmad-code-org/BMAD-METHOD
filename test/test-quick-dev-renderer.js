/**
 * Smoke test for bmad-quick-dev render.py
 *
 * Sets up a temp project with a base _bmad/config.toml and an override
 * _bmad/custom/config.user.toml, runs render.py, and asserts:
 *   1. The override wins (workflow.md contains "Japanese").
 *   2. sprint_status is an absolute path rooted at the temp project dir.
 *
 * Usage: node test/test-quick-dev-renderer.js
 * Exit codes: 0 = all tests pass, 1 = test failures
 */

'use strict';

const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { spawnSync } = require('node:child_process');

// ANSI color codes (same as other test files)
const colors = {
  reset: '\u001B[0m',
  green: '\u001B[32m',
  red: '\u001B[31m',
  cyan: '\u001B[36m',
};

let totalTests = 0;
let passedTests = 0;
const failures = [];

function test(name, fn) {
  totalTests++;
  try {
    fn();
    passedTests++;
    console.log(`  ${colors.green}\u2713${colors.reset} ${name}`);
  } catch (error) {
    console.log(`  ${colors.red}\u2717${colors.reset} ${name} ${colors.red}${error.message}${colors.reset}`);
    failures.push({ name, message: error.message });
  }
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const SKILL_SRC = path.join(__dirname, '..', 'src', 'bmm-skills', '4-implementation', 'bmad-quick-dev');

/**
 * Recursively copy a directory (stdlib only, no fs.cp to stay >=20 compat).
 */
function copyDirSync(src, dst) {
  fs.mkdirSync(dst, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const srcPath = path.join(src, entry.name);
    const dstPath = path.join(dst, entry.name);
    if (entry.isDirectory()) {
      copyDirSync(srcPath, dstPath);
    } else {
      fs.copyFileSync(srcPath, dstPath);
    }
  }
}

// ---------------------------------------------------------------------------
// Test fixture setup
// ---------------------------------------------------------------------------

const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'bmad-renderer-test-'));

try {
  // _bmad/config.toml — base layer
  fs.mkdirSync(path.join(tmpDir, '_bmad'), { recursive: true });
  fs.writeFileSync(
    path.join(tmpDir, '_bmad', 'config.toml'),
    [
      '[core]',
      'communication_language = "French"',
      '',
      '[modules.bmm]',
      'planning_artifacts = "{project-root}/plan"',
      'implementation_artifacts = "{project-root}/impl"',
    ].join('\n'),
    'utf-8',
  );

  // _bmad/custom/config.user.toml — override layer (should win)
  fs.mkdirSync(path.join(tmpDir, '_bmad', 'custom'), { recursive: true });
  fs.writeFileSync(
    path.join(tmpDir, '_bmad', 'custom', 'config.user.toml'),
    ['[core]', 'communication_language = "Japanese"'].join('\n'),
    'utf-8',
  );

  // Copy skill dir into <tmpDir>/bmad-quick-dev/ so find_project_root() walks
  // up and finds <tmpDir>/_bmad/, and os.path.basename(script_dir) resolves
  // to the real skill name so the render output lands at
  // _bmad/render/bmad-quick-dev/workflow.md.
  const skillDst = path.join(tmpDir, 'bmad-quick-dev');
  copyDirSync(SKILL_SRC, skillDst);

  // ---------------------------------------------------------------------------
  // Run render.py
  // ---------------------------------------------------------------------------

  console.log(`\n${colors.cyan}Quick-dev renderer smoke tests${colors.reset}\n`);

  const result = spawnSync('python3', [path.join(skillDst, 'render.py')], {
    cwd: skillDst,
    encoding: 'utf-8',
  });

  // ---------------------------------------------------------------------------
  // Tests
  // ---------------------------------------------------------------------------

  test('render.py exits with code 0', () => {
    assert(result.status === 0, `exit code ${result.status}\nstdout: ${result.stdout}\nstderr: ${result.stderr}`);
  });

  test('workflow.md exists in render output', () => {
    const rendered = path.join(tmpDir, '_bmad', 'render', 'bmad-quick-dev', 'workflow.md');
    assert(fs.existsSync(rendered), `workflow.md not found at ${rendered}`);
  });

  test('custom override wins — workflow.md contains "Japanese"', () => {
    const rendered = path.join(tmpDir, '_bmad', 'render', 'bmad-quick-dev', 'workflow.md');
    const content = fs.readFileSync(rendered, 'utf-8');
    assert(content.includes('Japanese'), `"Japanese" not found in workflow.md (communication_language override did not win)`);
  });

  test('sprint_status is an absolute path rooted at temp project dir', () => {
    const rendered = path.join(tmpDir, '_bmad', 'render', 'bmad-quick-dev', 'workflow.md');
    const content = fs.readFileSync(rendered, 'utf-8');
    // Normalize to forward slashes for cross-platform matching
    const normalizedTmp = tmpDir.replaceAll('\\', '/');
    // sprint_status should appear as <tmpDir>/impl/sprint-status.yaml
    const expected = `${normalizedTmp}/impl/sprint-status.yaml`;
    assert(
      content.includes(expected),
      `sprint_status path not found.\nExpected substring: ${expected}\n` +
        `workflow.md excerpt (first 2000 chars):\n${content.slice(0, 2000)}`,
    );
  });
} finally {
  fs.rmSync(tmpDir, { recursive: true, force: true });
}

// ---------------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------------

console.log(`\n${colors.cyan}${'═'.repeat(55)}${colors.reset}`);
console.log(`${colors.cyan}Test Results:${colors.reset}`);
console.log(`  Total:  ${totalTests}`);
console.log(`  Passed: ${colors.green}${passedTests}${colors.reset}`);
console.log(`  Failed: ${passedTests === totalTests ? colors.green : colors.red}${totalTests - passedTests}${colors.reset}`);
console.log(`${colors.cyan}${'═'.repeat(55)}${colors.reset}\n`);

if (failures.length > 0) {
  console.log(`${colors.red}FAILED TESTS:${colors.reset}\n`);
  for (const failure of failures) {
    console.log(`${colors.red}\u2717${colors.reset} ${failure.name}`);
    console.log(`  ${failure.message}\n`);
  }
  process.exit(1);
}

console.log(`${colors.green}All tests passed!${colors.reset}\n`);
process.exit(0);
