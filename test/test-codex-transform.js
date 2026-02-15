/**
 * Tests for CodexSetup.transformToSkillFormat
 *
 * Validates that descriptions round-trip correctly through parse/stringify,
 * producing valid YAML regardless of input quoting style.
 *
 * Usage: node test/test-codex-transform.js
 */

const path = require('node:path');
const yaml = require('yaml');

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

/**
 * Parse the output frontmatter and return the description value.
 * Validates the output is well-formed YAML that parses back correctly.
 */
function parseOutputDescription(output) {
  const match = output.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return null;
  const parsed = yaml.parse(match[1]);
  return parsed?.description;
}

// Import the class under test
const { CodexSetup } = require(path.join(__dirname, '..', 'tools', 'cli', 'installers', 'lib', 'ide', 'codex.js'));

const setup = new CodexSetup();

console.log(`\n${colors.cyan}CodexSetup.transformToSkillFormat tests${colors.reset}\n`);

// --- Simple description, no quotes ---
{
  const input = `---\ndescription: A simple description\n---\n\nBody content here.`;
  const result = setup.transformToSkillFormat(input, 'my-skill');
  const desc = parseOutputDescription(result);
  assert(desc === 'A simple description', 'simple description round-trips', `got description: ${JSON.stringify(desc)}`);
  assert(result.includes('\nBody content here.'), 'body preserved for simple description');
}

// --- Description with embedded single quotes (from double-quoted YAML input) ---
{
  const input = `---\ndescription: "can't stop won't stop"\n---\n\nBody content here.`;
  const result = setup.transformToSkillFormat(input, 'my-skill');
  const desc = parseOutputDescription(result);
  assert(desc === "can't stop won't stop", 'description with apostrophes round-trips', `got description: ${JSON.stringify(desc)}`);
  assert(result.includes('\nBody content here.'), 'body preserved for quoted description');
}

// --- Description with embedded single quote ---
{
  const input = `---\ndescription: "it's a test"\n---\n\nBody.`;
  const result = setup.transformToSkillFormat(input, 'test-skill');
  const desc = parseOutputDescription(result);
  assert(desc === "it's a test", 'description with apostrophe round-trips', `got description: ${JSON.stringify(desc)}`);
}

// --- Single-quoted input with pre-escaped apostrophe (YAML '' escape) ---
{
  const input = `---\ndescription: 'don''t panic'\n---\n\nBody.`;
  const result = setup.transformToSkillFormat(input, 'test-skill');
  const desc = parseOutputDescription(result);
  assert(desc === "don't panic", 'single-quoted escaped apostrophe round-trips', `got description: ${JSON.stringify(desc)}`);
}

// --- Verify name is set correctly ---
{
  const input = `---\ndescription: test\n---\n\nBody.`;
  const result = setup.transformToSkillFormat(input, 'my-custom-skill');
  const match = result.match(/^---\n([\s\S]*?)\n---/);
  const parsed = yaml.parse(match[1]);
  assert(parsed.name === 'my-custom-skill', 'name field matches skillName argument', `got name: ${JSON.stringify(parsed.name)}`);
}

// --- No frontmatter wraps content ---
{
  const input = 'Just some content without frontmatter.';
  const result = setup.transformToSkillFormat(input, 'bare-skill');
  const desc = parseOutputDescription(result);
  assert(desc === 'bare-skill', 'no-frontmatter fallback uses skillName as description', `got description: ${JSON.stringify(desc)}`);
  assert(result.includes('Just some content without frontmatter.'), 'body preserved when no frontmatter');
}

// --- Summary ---
console.log(`\n${passed} passed, ${failed} failed\n`);
process.exit(failed > 0 ? 1 : 0);
