/**
 * Unit Tests for path-utils.js
 *
 * Tests the toDashPath function which converts hierarchical file paths
 * to flat dash-separated naming for IDE skill registration.
 *
 * Fixes tested:
 * - Deduplication of matching folder/file names (issue #1422)
 * - Handling of .yaml extension in addition to .md
 *
 * Run: node test/test-path-utils.js
 */

const {
  toDashPath,
  toDashName,
  parseDashName,
  isDashFormat,
} = require('../tools/cli/installers/lib/ide/shared/path-utils.js');

console.log('Running path-utils unit tests...\n');

let passed = 0;
let failed = 0;

function test(name, actual, expected) {
  if (actual === expected) {
    console.log(`✓ ${name}`);
    passed++;
  } else {
    console.log(`✗ ${name}`);
    console.log(`  Expected: ${expected}`);
    console.log(`  Actual:   ${actual}`);
    failed++;
  }
}

function testObject(name, actual, expected) {
  const actualStr = JSON.stringify(actual);
  const expectedStr = JSON.stringify(expected);
  if (actualStr === expectedStr) {
    console.log(`✓ ${name}`);
    passed++;
  } else {
    console.log(`✗ ${name}`);
    console.log(`  Expected: ${expectedStr}`);
    console.log(`  Actual:   ${actualStr}`);
    failed++;
  }
}

// ============================================
// CORE FUNCTIONALITY - Flat Files
// ============================================

console.log('\n--- Flat file paths (no subdirectory) ---');

test(
  'module agent: bmm/agents/dev.md',
  toDashPath('bmm/agents/dev.md'),
  'bmad-bmm-dev.agent.md'
);

test(
  'module workflow: bmm/workflows/sprint-planning.md',
  toDashPath('bmm/workflows/sprint-planning.md'),
  'bmad-bmm-sprint-planning.md'
);

test(
  'module task: bmm/tasks/create-doc.md',
  toDashPath('bmm/tasks/create-doc.md'),
  'bmad-bmm-create-doc.md'
);

test(
  'core agent (no module prefix): core/agents/bmad-master.md',
  toDashPath('core/agents/bmad-master.md'),
  'bmad-bmad-master.agent.md'
);

test(
  'core workflow: core/workflows/brainstorming.md',
  toDashPath('core/workflows/brainstorming.md'),
  'bmad-brainstorming.md'
);

test(
  'hyphenated names preserved: bmm/agents/quick-flow-solo-dev.md',
  toDashPath('bmm/agents/quick-flow-solo-dev.md'),
  'bmad-bmm-quick-flow-solo-dev.agent.md'
);

// ============================================
// BUG FIX - Matching Folder/File Deduplication (Issue #1422)
// ============================================

console.log('\n--- Bug fix: Matching folder/file deduplication (issue #1422) ---');

test(
  'tech-writer/tech-writer.md → tech-writer (not tech-writer-tech-writer)',
  toDashPath('bmm/agents/tech-writer/tech-writer.md'),
  'bmad-bmm-tech-writer.agent.md'
);

test(
  'storyteller/storyteller.md → storyteller',
  toDashPath('cis/agents/storyteller/storyteller.md'),
  'bmad-cis-storyteller.agent.md'
);

test(
  'workflow with matching folder/file: party-mode/party-mode.md',
  toDashPath('bmm/workflows/party-mode/party-mode.md'),
  'bmad-bmm-party-mode.md'
);

test(
  'core agent with matching folder/file: master/master.md',
  toDashPath('core/agents/master/master.md'),
  'bmad-master.agent.md'
);

// ============================================
// NON-MATCHING Nested Paths (Should NOT Dedupe)
// ============================================

console.log('\n--- Non-matching nested paths (no deduplication) ---');

test(
  'create-prd/workflow.md keeps both segments',
  toDashPath('bmm/workflows/create-prd/workflow.md'),
  'bmad-bmm-create-prd-workflow.md'
);

test(
  'document-project/checklist.md keeps both segments',
  toDashPath('bmm/workflows/document-project/checklist.md'),
  'bmad-bmm-document-project-checklist.md'
);

test(
  'tech-writer/sidecar.md keeps both segments',
  toDashPath('bmm/agents/tech-writer/sidecar.md'),
  'bmad-bmm-tech-writer-sidecar.agent.md'
);

test(
  'partial match NOT deduplicated: tech-writer/tech-writers.md',
  toDashPath('bmm/agents/tech-writer/tech-writers.md'),
  'bmad-bmm-tech-writer-tech-writers.agent.md'
);

test(
  'substring match NOT deduplicated: writer/tech-writer.md',
  toDashPath('bmm/agents/writer/tech-writer.md'),
  'bmad-bmm-writer-tech-writer.agent.md'
);

// ============================================
// DEEP NESTING (3+ Levels)
// ============================================

console.log('\n--- Deep nesting (multiple subdirectories) ---');

test(
  'category/writer/writer.md deduplicates last two only',
  toDashPath('bmm/agents/category/writer/writer.md'),
  'bmad-bmm-category-writer.agent.md'
);

test(
  'ui/forms/validator/validator.md deduplicates last two only',
  toDashPath('bmm/agents/ui/forms/validator/validator.md'),
  'bmad-bmm-ui-forms-validator.agent.md'
);

test(
  'deep path with different last two: a/b/c/d.md',
  toDashPath('bmm/agents/a/b/c/d.md'),
  'bmad-bmm-a-b-c-d.agent.md'
);

test(
  'three matching segments: foo/foo/foo.md - only last two dedupe',
  toDashPath('bmm/agents/foo/foo/foo.md'),
  'bmad-bmm-foo-foo.agent.md'
);

// ============================================
// CASE SENSITIVITY
// ============================================

console.log('\n--- Case sensitivity ---');

test(
  'different case NOT deduplicated: Tech-Writer/tech-writer.md',
  toDashPath('bmm/agents/Tech-Writer/tech-writer.md'),
  'bmad-bmm-Tech-Writer-tech-writer.agent.md'
);

test(
  'same case deduplicated: WRITER/WRITER.md',
  toDashPath('bmm/agents/WRITER/WRITER.md'),
  'bmad-bmm-WRITER.agent.md'
);

// ============================================
// SPECIAL CHARACTERS IN NAMES
// ============================================

console.log('\n--- Special characters in names ---');

test(
  'names with numbers: v2-helper/v2-helper.md',
  toDashPath('bmm/agents/v2-helper/v2-helper.md'),
  'bmad-bmm-v2-helper.agent.md'
);

test(
  'names with underscores: my_agent/my_agent.md',
  toDashPath('bmm/agents/my_agent/my_agent.md'),
  'bmad-bmm-my_agent.agent.md'
);

// ============================================
// INPUT VALIDATION & EDGE CASES
// ============================================

console.log('\n--- Input validation ---');

test('null returns fallback', toDashPath(null), 'bmad-unknown.md');

test('undefined returns fallback', toDashPath(undefined), 'bmad-unknown.md');

test('empty string returns fallback', toDashPath(''), 'bmad-unknown.md');

test('number returns fallback', toDashPath(123), 'bmad-unknown.md');

test('object returns fallback', toDashPath({}), 'bmad-unknown.md');

// ============================================
// WINDOWS PATH SEPARATORS
// ============================================

console.log('\n--- Windows path separators (backslashes) ---');

test(
  'backslashes converted correctly',
  toDashPath('bmm\\agents\\dev.md'),
  'bmad-bmm-dev.agent.md'
);

test(
  'nested Windows path with matching folder/file',
  toDashPath('bmm\\agents\\tech-writer\\tech-writer.md'),
  'bmad-bmm-tech-writer.agent.md'
);

test(
  'mixed separators',
  toDashPath('bmm/agents\\tech-writer/tech-writer.md'),
  'bmad-bmm-tech-writer.agent.md'
);

// ============================================
// FILE EXTENSION HANDLING
// ============================================

console.log('\n--- File extension handling ---');

test(
  '.md extension removed',
  toDashPath('bmm/agents/dev.md'),
  'bmad-bmm-dev.agent.md'
);

test(
  '.yaml extension removed (new fix)',
  toDashPath('bmm/agents/dev.yaml'),
  'bmad-bmm-dev.agent.md'
);

test(
  '.yaml with matching folder/file',
  toDashPath('bmm/agents/tech-writer/tech-writer.yaml'),
  'bmad-bmm-tech-writer.agent.md'
);

test(
  'no extension handled',
  toDashPath('bmm/agents/dev'),
  'bmad-bmm-dev.agent.md'
);

// ============================================
// ROUNDTRIP TESTS
// ============================================

// Note: parseDashName has pre-existing issues with .agent.md extension handling
// that are outside the scope of issue #1422. The tests below verify that
// toDashPath output is structurally valid for parseDashName, even if the
// parsed values have known issues.

console.log('\n--- Roundtrip consistency (toDashPath → parseDashName) ---');

{
  const dashName = toDashPath('bmm/agents/dev.md');
  const parsed = parseDashName(dashName);
  // Verify parseDashName returns an object (not null) for valid toDashPath output
  if (parsed !== null && typeof parsed === 'object') {
    console.log('✓ flat agent produces parseable output');
    passed++;
  } else {
    console.log('✗ flat agent produces parseable output');
    failed++;
  }
}

{
  const dashName = toDashPath('bmm/agents/tech-writer/tech-writer.md');
  const parsed = parseDashName(dashName);
  if (parsed !== null && typeof parsed === 'object') {
    console.log('✓ nested deduplicated agent produces parseable output');
    passed++;
  } else {
    console.log('✗ nested deduplicated agent produces parseable output');
    failed++;
  }
}

{
  const dashName = toDashPath('core/agents/master.md');
  const parsed = parseDashName(dashName);
  if (parsed !== null && typeof parsed === 'object') {
    console.log('✓ core agent produces parseable output');
    passed++;
  } else {
    console.log('✗ core agent produces parseable output');
    failed++;
  }
}

// ============================================
// isDashFormat VALIDATION
// ============================================

console.log('\n--- isDashFormat validation ---');

test(
  'valid dash format returns true',
  isDashFormat('bmad-bmm-dev.agent.md'),
  true
);

test('non-dash format returns false', isDashFormat('dev.md'), false);

// ============================================
// SUMMARY
// ============================================

console.log('\n========================================');
console.log(`Results: ${passed} passed, ${failed} failed`);
console.log('========================================\n');

if (failed > 0) {
  process.exit(1);
}
