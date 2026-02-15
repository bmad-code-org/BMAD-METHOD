/**
 * Tests for CodexSetup.transformToSkillFormat
 *
 * Demonstrates that the description regex mangles descriptions containing quotes.
 *
 * Usage: node test/test-codex-transform.js
 */

const path = require('node:path');

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

function assert(condition, testName, detail) {
  if (condition) {
    console.log(`  ${colors.green}PASS${colors.reset} ${testName}`);
    passed++;
  } else {
    console.log(`  ${colors.red}FAIL${colors.reset} ${testName}`);
    if (detail) console.log(`       ${colors.dim}${detail}${colors.reset}`);
    failed++;
  }
}

// Import the class under test
const { CodexSetup } = require(path.join(__dirname, '..', 'tools', 'cli', 'installers', 'lib', 'ide', 'codex.js'));

const setup = new CodexSetup();

console.log(`\n${colors.cyan}CodexSetup.transformToSkillFormat tests${colors.reset}\n`);

// --- Passing case: simple description, no quotes ---
{
  const input = `---\ndescription: A simple description\n---\n\nBody content here.`;
  const result = setup.transformToSkillFormat(input, 'my-skill');
  const expected = `---\nname: my-skill\ndescription: 'A simple description'\n---\n\nBody content here.`;
  assert(result === expected, 'simple description without quotes', `got: ${JSON.stringify(result)}`);
}

// --- Description with embedded single quotes (from double-quoted YAML input) ---
{
  const input = `---\ndescription: "can't stop won't stop"\n---\n\nBody content here.`;
  const result = setup.transformToSkillFormat(input, 'my-skill');

  // Output should have properly escaped YAML single-quoted scalar: '' for each '
  const expected = `---\nname: my-skill\ndescription: 'can''t stop won''t stop'\n---\n\nBody content here.`;
  assert(result === expected, 'description with embedded single quotes produces valid escaped YAML', `got: ${JSON.stringify(result)}`);
}

// --- Description with embedded single quote produces valid YAML ---
{
  const input = `---\ndescription: "it's a test"\n---\n\nBody.`;
  const result = setup.transformToSkillFormat(input, 'test-skill');
  const expected = `---\nname: test-skill\ndescription: 'it''s a test'\n---\n\nBody.`;
  assert(result === expected, 'description with apostrophe produces valid YAML', `got: ${JSON.stringify(result)}`);
}

// --- Single-quoted input with pre-escaped apostrophe (YAML '' escape) ---
{
  const input = `---\ndescription: 'don''t panic'\n---\n\nBody.`;
  const result = setup.transformToSkillFormat(input, 'test-skill');
  // Input has don''t (YAML-escaped). Should round-trip to don''t in output.
  const expected = `---\nname: test-skill\ndescription: 'don''t panic'\n---\n\nBody.`;
  assert(result === expected, 'single-quoted description with escaped apostrophe round-trips correctly', `got: ${JSON.stringify(result)}`);
}

// --- Summary ---
console.log(`\n${passed} passed, ${failed} failed\n`);
process.exit(failed > 0 ? 1 : 0);
