/**
 * Workflow Path Regex Tests
 *
 * Tests that the source and install workflow path regexes in ModuleManager
 * extract the correct capture groups (module name and workflow sub-path).
 *
 * Usage: node test/test-workflow-path-regex.js
 */

// ANSI colors
const colors = {
  reset: '\u001B[0m',
  green: '\u001B[32m',
  red: '\u001B[31m',
  cyan: '\u001B[36m',
  dim: '\u001B[2m',
};

let passed = 0;
let failed = 0;

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

// ---------------------------------------------------------------------------
// These regexes are extracted from ModuleManager.vendorWorkflowDependencies()
// in tools/cli/installers/lib/modules/manager.js
// ---------------------------------------------------------------------------

// Source regex (line ~1081) — uses non-capturing group for _bmad
const SOURCE_REGEX = /\{project-root\}\/(?:_bmad)\/([^/]+)\/workflows\/(.+)/;

// Install regex (line ~1091) — uses non-capturing group for _bmad,
// consistent with source regex
const INSTALL_REGEX = /\{project-root\}\/(?:_bmad)\/([^/]+)\/workflows\/(.+)/;

// ---------------------------------------------------------------------------
// Test data
// ---------------------------------------------------------------------------
const sourcePath = '{project-root}/_bmad/bmm/workflows/4-implementation/create-story/workflow.md';
const installPath = '{project-root}/_bmad/bmgd/workflows/4-production/create-story/workflow.md';

console.log(`\n${colors.cyan}Workflow Path Regex Tests${colors.reset}\n`);

// --- Source regex tests (these should pass — source regex is correct) ---

const sourceMatch = sourcePath.match(SOURCE_REGEX);

assert(sourceMatch !== null, 'Source regex matches source path');
assert(
  sourceMatch && sourceMatch[1] === 'bmm',
  'Source regex group [1] is the module name',
  `Expected "bmm", got "${sourceMatch && sourceMatch[1]}"`,
);
assert(
  sourceMatch && sourceMatch[2] === '4-implementation/create-story/workflow.md',
  'Source regex group [2] is the workflow sub-path',
  `Expected "4-implementation/create-story/workflow.md", got "${sourceMatch && sourceMatch[2]}"`,
);

// --- Install regex tests (group [2] returns module name, not sub-path) ---

const installMatch = installPath.match(INSTALL_REGEX);

assert(installMatch !== null, 'Install regex matches install path');

// This is the critical test: installMatch[2] should be the workflow sub-path,
// because the code uses it as `installWorkflowSubPath`.
// With the bug, installMatch[2] is "bmgd" (module name) instead of the sub-path.
assert(
  installMatch && installMatch[2] === '4-production/create-story/workflow.md',
  'Install regex group [2] is the workflow sub-path (used as installWorkflowSubPath)',
  `Expected "4-production/create-story/workflow.md", got "${installMatch && installMatch[2]}"`,
);

// --- Summary ---
console.log(`\n${passed} passed, ${failed} failed\n`);
process.exit(failed > 0 ? 1 : 0);
