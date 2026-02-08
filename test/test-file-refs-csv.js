/**
 * CSV File Reference Extraction Test Runner
 *
 * Tests extractCsvRefs() from validate-file-refs.js against fixtures.
 * Verifies correct extraction of workflow-file references from CSV files.
 *
 * Usage: node test/test-file-refs-csv.js
 * Exit codes: 0 = all tests pass, 1 = test failures
 */

const fs = require('node:fs');
const path = require('node:path');
const { extractCsvRefs } = require('../tools/validate-file-refs.js');

// ANSI color codes
const colors = {
  reset: '\u001B[0m',
  green: '\u001B[32m',
  red: '\u001B[31m',
  cyan: '\u001B[36m',
  dim: '\u001B[2m',
};

const FIXTURES = path.join(__dirname, 'fixtures/file-refs-csv');

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

function loadFixture(relativePath) {
  const fullPath = path.join(FIXTURES, relativePath);
  const content = fs.readFileSync(fullPath, 'utf-8');
  return { fullPath, content };
}

// --- Valid fixtures ---

console.log(`\n${colors.cyan}CSV File Reference Extraction Tests${colors.reset}\n`);
console.log(`${colors.cyan}Valid fixtures${colors.reset}`);

test('bmm-style.csv: extracts workflow-file refs with trailing commas', () => {
  const { fullPath, content } = loadFixture('valid/bmm-style.csv');
  const refs = extractCsvRefs(fullPath, content);
  assert(refs.length === 2, `Expected 2 refs, got ${refs.length}`);
  assert(refs[0].raw === '_bmad/bmm/workflows/document-project/workflow.yaml', `Wrong raw[0]: ${refs[0].raw}`);
  assert(refs[1].raw === '_bmad/core/workflows/brainstorming/workflow.md', `Wrong raw[1]: ${refs[1].raw}`);
  assert(refs[0].type === 'project-root', `Wrong type: ${refs[0].type}`);
  assert(refs[0].line === 2, `Wrong line for row 0: ${refs[0].line}`);
  assert(refs[1].line === 3, `Wrong line for row 1: ${refs[1].line}`);
  assert(refs[0].file === fullPath, 'Wrong file path');
});

test('core-style.csv: extracts refs from core module-help format', () => {
  const { fullPath, content } = loadFixture('valid/core-style.csv');
  const refs = extractCsvRefs(fullPath, content);
  assert(refs.length === 2, `Expected 2 refs, got ${refs.length}`);
  assert(refs[0].raw === '_bmad/core/workflows/brainstorming/workflow.md', `Wrong raw[0]: ${refs[0].raw}`);
  assert(refs[1].raw === '_bmad/core/workflows/party-mode/workflow.md', `Wrong raw[1]: ${refs[1].raw}`);
});

test('minimal.csv: extracts refs from minimal 3-column CSV', () => {
  const { fullPath, content } = loadFixture('valid/minimal.csv');
  const refs = extractCsvRefs(fullPath, content);
  assert(refs.length === 1, `Expected 1 ref, got ${refs.length}`);
  assert(refs[0].raw === '_bmad/core/tasks/help.md', `Wrong raw: ${refs[0].raw}`);
  assert(refs[0].line === 2, `Wrong line: ${refs[0].line}`);
});

// --- Invalid fixtures ---

console.log(`\n${colors.cyan}Invalid fixtures (expect 0 refs)${colors.reset}`);

test('no-workflow-column.csv: returns 0 refs when workflow-file column missing', () => {
  const { fullPath, content } = loadFixture('invalid/no-workflow-column.csv');
  const refs = extractCsvRefs(fullPath, content);
  assert(refs.length === 0, `Expected 0 refs, got ${refs.length}`);
});

test('empty-data.csv: returns 0 refs when CSV has header only', () => {
  const { fullPath, content } = loadFixture('invalid/empty-data.csv');
  const refs = extractCsvRefs(fullPath, content);
  assert(refs.length === 0, `Expected 0 refs, got ${refs.length}`);
});

test('all-empty-workflow.csv: returns 0 refs when all workflow-file cells empty', () => {
  const { fullPath, content } = loadFixture('invalid/all-empty-workflow.csv');
  const refs = extractCsvRefs(fullPath, content);
  assert(refs.length === 0, `Expected 0 refs, got ${refs.length}`);
});

test('unresolvable-vars.csv: filters out template variables, keeps normal refs', () => {
  const { fullPath, content } = loadFixture('invalid/unresolvable-vars.csv');
  const refs = extractCsvRefs(fullPath, content);
  assert(refs.length === 1, `Expected 1 ref, got ${refs.length}`);
  assert(refs[0].raw === '_bmad/core/tasks/help.md', `Wrong raw: ${refs[0].raw}`);
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
    console.log(`${colors.red}\u2717${colors.reset} ${failure.name}`);
    console.log(`  ${failure.message}\n`);
  }
  process.exit(1);
}

console.log(`${colors.green}All tests passed!${colors.reset}\n`);
process.exit(0);
