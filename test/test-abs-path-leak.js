/**
 * Absolute Path Leak Detection Test Runner
 *
 * Tests checkAbsolutePathLeaks() from validate-file-refs.js. Focused on Windows
 * drive paths, which use a single separator (C:\Users) and were previously missed.
 *
 * Usage: node test/test-abs-path-leak.js
 * Exit codes: 0 = all tests pass, 1 = test failures
 */

const { checkAbsolutePathLeaks } = require('../tools/validate-file-refs.js');

// ANSI color codes
const colors = {
  reset: '[0m',
  green: '[32m',
  red: '[31m',
  cyan: '[36m',
};

let totalTests = 0;
let passedTests = 0;
const failures = [];

/**
 * Run a single named test case, recording the result and printing a status line.
 * @param {string} name - Human-readable test description.
 * @param {Function} fn - Test body; throw to signal failure.
 */
function test(name, fn) {
  totalTests++;
  try {
    fn();
    passedTests++;
    console.log(`  ${colors.green}OK${colors.reset} ${name}`);
  } catch (error) {
    console.log(`  ${colors.red}XX${colors.reset} ${name} ${colors.red}${error.message}${colors.reset}`);
    failures.push({ name, message: error.message });
  }
}

/**
 * Throw an Error with `message` when `condition` is falsy.
 * @param {boolean} condition - Expression that must hold.
 * @param {string} message - Failure message.
 */
function assert(condition, message) {
  if (!condition) throw new Error(message);
}

/**
 * Count the leak lines detected in a content string.
 * @param {string} content - File content to scan (filePath is only used for labelling).
 * @returns {number} Number of lines flagged as absolute-path leaks.
 */
function leakCount(content) {
  return checkAbsolutePathLeaks('fixture.md', content).length;
}

console.log(`\n${colors.cyan}Absolute Path Leak Detection${colors.reset}\n`);

test('Windows single-backslash drive path is detected', () => {
  assert(leakCount(String.raw`See C:\Users\alex\notes.md for details.`) === 1, String.raw`C:\Users... not detected`);
});

test('Windows forward-slash drive path is detected', () => {
  assert(leakCount('See C:/Users/alex/notes.md for details.') === 1, 'C:/Users... not detected');
});

test('Unix /Users path is detected', () => {
  assert(leakCount('open /Users/alex/secret.md') === 1, '/Users path not detected');
});

test('Unix /home path is detected', () => {
  assert(leakCount('open /home/alex/secret.md') === 1, '/home path not detected');
});

test('relative paths are not flagged', () => {
  assert(leakCount('load `./workflow.md` and ../shared/util.md') === 0, 'relative path falsely flagged');
});

test('leaks inside fenced code blocks are ignored', () => {
  const content = ['```bash', String.raw`cat C:\Users\alex\secret.md`, '```'].join('\n');
  assert(leakCount(content) === 0, 'leak inside code block should be stripped');
});

// --- Summary ---
console.log(`\n${colors.cyan}${'='.repeat(55)}${colors.reset}`);
console.log(`Total: ${totalTests}  Passed: ${colors.green}${passedTests}${colors.reset}  Failed: ${totalTests - passedTests}`);
console.log(`${colors.cyan}${'='.repeat(55)}${colors.reset}\n`);

if (failures.length > 0) {
  for (const failure of failures) console.log(`${colors.red}XX${colors.reset} ${failure.name}: ${failure.message}`);
  process.exit(1);
}

console.log(`${colors.green}All tests passed!${colors.reset}\n`);
process.exit(0);
