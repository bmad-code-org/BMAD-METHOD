/**
 * Skill Validation Test Runner
 *
 * Tests validateSkill() from validate-skills.js against fixtures, focused on
 * SKILL-06 (description quality) and its deprecated-skill exemption.
 *
 * Usage: node test/test-validate-skills.js
 * Exit codes: 0 = all tests pass, 1 = test failures
 */

const path = require('node:path');
const { validateSkill } = require('../tools/validate-skills.js');

// ANSI color codes
const colors = {
  reset: '\u001B[0m',
  green: '\u001B[32m',
  red: '\u001B[31m',
  cyan: '\u001B[36m',
  dim: '\u001B[2m',
};

const FIXTURES = path.join(__dirname, 'fixtures/validate-skills');

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
    console.log(`  ${colors.green}✓${colors.reset} ${name}`);
  } catch (error) {
    console.log(`  ${colors.red}✗${colors.reset} ${name} ${colors.red}${error.message}${colors.reset}`);
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
 * Whether validateSkill emitted the SKILL-06 "Use when/Use if" trigger finding
 * for the given fixture skill directory.
 * @param {string} skillName - Fixture subdirectory name under FIXTURES.
 * @returns {boolean} True if the trigger-phrase finding was reported.
 */
function hasTriggerFinding(skillName) {
  const findings = validateSkill(path.join(FIXTURES, skillName));
  return findings.some((f) => f.rule === 'SKILL-06' && /trigger phrase/i.test(f.detail));
}

console.log(`\n${colors.cyan}Skill Validation — SKILL-06 trigger phrase${colors.reset}\n`);

test('deprecated skill is exempt from the trigger-phrase requirement', () => {
  assert(hasTriggerFinding('deprecated-shim') === false, 'Expected no SKILL-06 trigger finding for a DEPRECATED skill');
});

test('active skill missing a trigger phrase is still flagged', () => {
  assert(
    hasTriggerFinding('missing-trigger') === true,
    'Expected a SKILL-06 trigger finding for a non-deprecated skill without "Use when"',
  );
});

test('active skill with a "Use when" trigger is not flagged', () => {
  assert(hasTriggerFinding('with-trigger') === false, 'Expected no SKILL-06 trigger finding when description contains "Use when"');
});

// --- Summary ---
console.log(`\n${colors.cyan}${'═'.repeat(55)}${colors.reset}`);
console.log(`${colors.cyan}Test Results:${colors.reset}`);
console.log(`  Total:  ${totalTests}`);
console.log(`  Passed: ${colors.green}${passedTests}${colors.reset}`);
console.log(`  Failed: ${passedTests === totalTests ? colors.green : colors.red}${totalTests - passedTests}${colors.reset}`);
console.log(`${colors.cyan}${'═'.repeat(55)}${colors.reset}\n`);

if (failures.length > 0) {
  console.log(`${colors.red}FAILED TESTS:${colors.reset}\n`);
  for (const failure of failures) {
    console.log(`${colors.red}✗${colors.reset} ${failure.name}`);
    console.log(`  ${failure.message}\n`);
  }
  process.exit(1);
}

console.log(`${colors.green}All tests passed!${colors.reset}\n`);
process.exit(0);
