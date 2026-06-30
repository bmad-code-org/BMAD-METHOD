/**
 * Focused coverage for the bmad-code-review-auto automation surface.
 *
 * Usage: node test/test-bmad-code-review-auto.js
 */

const fs = require('node:fs');
const path = require('node:path');
const { discoverSkillDirs, validateSkill } = require('../tools/validate-skills.js');

const colors = {
  reset: '\u001B[0m',
  green: '\u001B[32m',
  red: '\u001B[31m',
  cyan: '\u001B[36m',
};

const REPO_ROOT = path.resolve(__dirname, '..');
const AUTO_DIR = path.join(REPO_ROOT, 'src/bmm-skills/4-implementation/bmad-code-review-auto');
const REVIEW_DIR = path.join(REPO_ROOT, 'src/bmm-skills/4-implementation/bmad-code-review');
const PACKAGE_PATH = path.join(REPO_ROOT, 'package.json');
const QUALITY_WORKFLOW_PATH = path.join(REPO_ROOT, '.github/workflows/quality.yaml');
const HELP_PATH = path.join(REPO_ROOT, 'src/bmm-skills/module-help.csv');
const AUTO_STEP1_PATH = path.join(AUTO_DIR, 'steps/step-01-collect-inputs.md');
const AUTO_STEP2_PATH = path.join(AUTO_DIR, 'steps/step-02-run-review.md');

let totalTests = 0;
let passedTests = 0;
const failures = [];

function test(name, fn) {
  totalTests++;
  try {
    fn();
    passedTests++;
    console.log(`  ${colors.green}PASS${colors.reset} ${name}`);
  } catch (error) {
    console.log(`  ${colors.red}FAIL${colors.reset} ${name} ${colors.red}${error.message}${colors.reset}`);
    failures.push({ name, message: error.message });
  }
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function readText(filePath) {
  return fs.readFileSync(filePath, 'utf8');
}

function collectMarkdown(dir) {
  const files = [];

  function walk(currentDir) {
    for (const entry of fs.readdirSync(currentDir, { withFileTypes: true })) {
      const fullPath = path.join(currentDir, entry.name);
      if (entry.isDirectory()) {
        walk(fullPath);
      } else if (entry.isFile() && entry.name.endsWith('.md')) {
        files.push(readText(fullPath));
      }
    }
  }

  walk(dir);
  return files.join('\n');
}

function assertNoValidatorFindings(skillDir) {
  const findings = validateSkill(skillDir);
  assert(findings.length === 0, `Expected no validator findings, got ${JSON.stringify(findings, null, 2)}`);
}

function assertIncludesAll(content, values, label) {
  for (const value of values) {
    assert(content.includes(value), `${label} is missing ${value}`);
  }
}

function assertExcludesAll(content, values, label) {
  for (const value of values) {
    assert(!content.includes(value), `${label} must not include ${value}`);
  }
}

console.log(`\n${colors.cyan}bmad-code-review-auto surface${colors.reset}\n`);

test('interactive bmad-code-review remains valid', () => {
  assert(fs.existsSync(REVIEW_DIR), 'Missing bmad-code-review source directory');
  assertNoValidatorFindings(REVIEW_DIR);
});

test('bmad-code-review-auto source directory exists and validates', () => {
  assert(fs.existsSync(AUTO_DIR), 'Missing bmad-code-review-auto source directory');
  assert(fs.existsSync(path.join(AUTO_DIR, 'SKILL.md')), 'Missing SKILL.md');
  assert(fs.existsSync(path.join(AUTO_DIR, 'customize.toml')), 'Missing customize.toml');
  assert(fs.existsSync(path.join(AUTO_DIR, 'steps')), 'Missing steps directory');
  assertNoValidatorFindings(AUTO_DIR);
});

test('both review surfaces are discoverable from source skills', () => {
  const discovered = discoverSkillDirs([path.join(REPO_ROOT, 'src')]);
  assert(discovered.includes(REVIEW_DIR), 'bmad-code-review was not discovered');
  assert(discovered.includes(AUTO_DIR), 'bmad-code-review-auto was not discovered');
});

test('bmad-code-review-auto avoids interactive patch handling', () => {
  assert(fs.existsSync(AUTO_DIR), 'Missing bmad-code-review-auto source directory');
  const content = collectMarkdown(AUTO_DIR).toLowerCase();

  for (const required of ['structured failure', 'does not apply patches', 'does not present interactive choices']) {
    assert(content.includes(required), `Missing required automation phrase: ${required}`);
  }

  for (const forbidden of [
    'apply every patch',
    'leave as action items',
    'walk through each patch',
    'reply with only',
    'numbered choice',
    'what would you like to do next',
  ]) {
    assert(!content.includes(forbidden), `Automation skill contains interactive phrase: ${forbidden}`);
  }
});

test('BMM help catalog exposes a distinct CRA automation row', () => {
  const help = readText(HELP_PATH);
  assert(help.includes('BMad Method,bmad-code-review,Code Review,CR,'), 'Existing bmad-code-review row changed or missing');
  assert(help.includes('BMad Method,bmad-code-review-auto,Code Review Auto,CRA,'), 'Missing CRA help catalog row');
  assert(help.includes('Writes findings and contracts only'), 'CRA row must describe write-only automation behavior');
  assert(help.includes('does not apply patches'), 'CRA row must state that patches are not applied');
  assert(help.includes('does not present interactive choices'), 'CRA row must state that interactive choices are not presented');
});

test('quality gate runs the code-review-auto focused regression test', () => {
  const packageJson = JSON.parse(readText(PACKAGE_PATH));
  const workflow = readText(QUALITY_WORKFLOW_PATH);

  assert(packageJson.scripts.quality.includes('npm run test:code-review-auto'), 'quality script must run test:code-review-auto');
  assert(workflow.includes('npm run test:code-review-auto'), 'quality workflow must run test:code-review-auto');
});

test('bmad-code-review-auto validates review input source selection', () => {
  const step1 = readText(AUTO_STEP1_PATH).toLowerCase();

  assert(step1.includes('`failure_type: "missing_diff_input"`'), 'Missing diff input must be structured');
  assert(step1.includes('`failure_type: "ambiguous_review_input"`'), 'Ambiguous diff input must be structured');
  assert(step1.includes('detected source names'), 'Ambiguous input must report detected sources');
  assert(
    step1.includes('staged, unstaged, and untracked existing files'),
    'Uncommitted reviews must include staged, unstaged, and untracked changes',
  );
  assert(step1.includes('tracked file deletions'), 'Uncommitted reviews must include tracked deletions');
  assert(step1.includes('resolve every listed path against `{project-root}`'), 'File-list paths must resolve from the project root');
  assert(step1.includes('absolute paths outside `{project-root}`'), 'File-list reviews must reject paths outside the project root');
  assert(step1.includes('parent-directory traversal'), 'File-list reviews must reject traversal outside the project root');
  assert(step1.includes('staged changes, unstaged changes'), 'Explicit file-list reviews must include index and worktree changes');
  assert(step1.includes('untracked existing files'), 'Explicit file-list reviews must include untracked files');
  assert(step1.includes('tracked file deletions'), 'Explicit file-list reviews must include tracked deletions');
  assert(step1.includes('`/dev/null` unified diff'), 'Untracked files must be represented as new-file diffs');
  assert(step1.includes('new files cannot be omitted'), 'Input collection must protect new-file review evidence');
  assert(step1.includes('include the deletion diff'), 'Tracked deleted files must be represented as deletion diffs');
});

test('bmad-code-review-auto preserves BMAD review layers in full mode', () => {
  const content = collectMarkdown(AUTO_DIR);
  const lower = content.toLowerCase();

  assertIncludesAll(content, ['Blind Hunter', 'Edge Case Hunter', 'Acceptance Auditor'], 'review layer contract');
  assert(lower.includes('story or spec context'), 'Acceptance Auditor must depend on story or spec context');
  assert(lower.includes('loaded context docs'), 'Acceptance Auditor must receive loaded context docs');
  assert(lower.includes('incomplete review evidence'), 'Failed or empty layers must be recorded as incomplete review evidence');
  assert(!lower.includes('archon owns review semantics'), 'Archon must not own review semantics');
});

test('bmad-code-review-auto treats clean layer results as successful', () => {
  const step2 = readText(AUTO_STEP2_PATH).toLowerCase();

  assert(
    step2.includes("automation_result_file: '{implementation_artifacts}/code-review-auto-result.json'"),
    'Step 2 failure paths must have a result file target',
  );
  assert(step2.includes('parseable empty finding set'), 'Empty finding arrays must be recognized');
  assert(step2.includes('empty `findings` array'), 'Empty findings field must be recognized');
  assert(step2.includes('explicit no-findings response'), 'Explicit no-findings responses must be recognized');
  assert(step2.includes('successful completed layer with zero findings'), 'Clean layers must remain successful');
  assert(
    step2.includes('do not record a successful zero-finding layer as incomplete review evidence'),
    'Clean layers must not become incomplete review evidence',
  );
});

test('bmad-code-review-auto formalizes the automated finding model', () => {
  const step2 = readText(AUTO_STEP2_PATH).toLowerCase();

  assertIncludesAll(
    step2,
    ['`id`', '`source`', '`title`', '`detail`', '`location`', '`evidence`', '`reason`', '`source_context`'],
    'finding model',
  );
  assert(step2.includes('deduplicate'), 'Finding model must describe deduplication');
  assert(step2.includes('merged source identity'), 'Deduplicated findings must preserve merged source identity');
  assert(step2.includes('report, gate, and decision-needed'), 'Findings must preserve evidence for later artifacts');
});

test('bmad-code-review-auto uses only BMAD triage categories', () => {
  const content = collectMarkdown(AUTO_DIR).toLowerCase();

  assertIncludesAll(content, ['`patch`', '`decision_needed`', '`defer`', '`dismiss`'], 'triage vocabulary');
  assert(content.includes('exactly one'), 'Every non-dismissed finding must be classified into exactly one category');
  assert(content.includes('dismiss count'), 'Dismissed findings must preserve a dismiss count');
  assertExcludesAll(
    content,
    ['`intent_gap`', '`bad_spec`', '`reject`', '`converted_to_patch`', '`needs_archon`', '`archon_decision`'],
    'triage vocabulary',
  );
});

test('bmad-code-review-auto keeps decision and patch routing non-interactive', () => {
  const content = collectMarkdown(AUTO_DIR).toLowerCase();

  assert(content.includes('human product, design, operator, or policy judgment'), 'decision_needed rule is incomplete');
  assert(
    content.includes('classify a finding as `decision_needed` when'),
    'decision_needed triage must have a positive classification rule',
  );
  assert(content.includes('human-judgment reason'), 'decision_needed findings must preserve a human-judgment reason');
  assert(content.includes('classify a finding as `patch` when'), 'patch triage must have a positive classification rule');
  assert(content.includes('unambiguous development fix'), 'patch rule must require an unambiguous development fix');
  assert(
    content.includes('use `defer` when a finding is real but pre-existing'),
    'defer triage must preserve the BMAD deferred-work meaning',
  );
  assert(content.includes('when `review_mode` is `no-spec`'), 'no-spec triage must be explicit');
  assert(content.includes('do not emit `decision_needed` findings'), 'no-spec triage must not emit decision_needed findings');
  assert(content.includes('otherwise classify it as `defer`'), 'no-spec triage must reclassify ambiguous findings to defer');
  assert(content.includes('location and evidence'), 'patch findings must preserve location and evidence');
  assert(content.includes('do not ask the human to resolve'), 'decision_needed must not be resolved interactively');
  assert(content.includes('do not convert `decision_needed` to `patch`'), 'decision_needed must not become patch');
  assert(content.includes('do not apply code changes'), 'patch routing must not apply code changes');
});

console.log(`\n${colors.cyan}${'='.repeat(55)}${colors.reset}`);
console.log(`${colors.cyan}Test Results:${colors.reset}`);
console.log(`  Total:  ${totalTests}`);
console.log(`  Passed: ${colors.green}${passedTests}${colors.reset}`);
console.log(`  Failed: ${passedTests === totalTests ? colors.green : colors.red}${totalTests - passedTests}${colors.reset}`);
console.log(`${colors.cyan}${'='.repeat(55)}${colors.reset}\n`);

if (failures.length > 0) {
  console.log(`${colors.red}FAILED TESTS:${colors.reset}\n`);
  for (const failure of failures) {
    console.log(`${colors.red}FAIL${colors.reset} ${failure.name}`);
    console.log(`  ${failure.message}\n`);
  }
  process.exit(1);
}

console.log(`${colors.green}All tests passed!${colors.reset}\n`);
process.exit(0);
