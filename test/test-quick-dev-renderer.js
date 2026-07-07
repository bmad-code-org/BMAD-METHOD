/**
 * Smoke test for bmad-quick-dev render.py
 *
 * Sets up a temp project with base + override config layers and a
 * _bmad/custom/bmad-quick-dev.user.toml [workflow] override, runs render.py,
 * and asserts:
 *   1. The central-config override wins (step files' language line contains "Japanese").
 *   2. sprint_status is an absolute path rooted at the temp project dir.
 *   3. [workflow] customization is self-resolved and inlined: prepend bullet,
 *      persistent_facts append (base kept), empty list -> _None._, on_complete
 *      scalar baked into step-05/step-oneshot.
 *   4. Review layers materialize as direct invocation blocks: default layers
 *      become #### sections in step-04, an override replacing a layer by id
 *      wins, an empty-instruction override drops its layer, a `when` renders
 *      as a run-time guard, runtime placeholders like {diff_output} survive,
 *      and disabling every layer renders the HALT instruction.
 *   5. No {workflow.*} placeholder or resolve_customization.py call survives
 *      in any rendered file.
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

// Extra one-off temp projects created by makeProject(); cleaned up in finally.
const extraTmpDirs = [];

/**
 * Spin up an isolated temp project with the given _bmad/config.toml body and a
 * copy of the skill dir, so a single bad-config scenario can be rendered in
 * isolation. Returns { dir, skillDst }; the caller runs render.py against it.
 */
function makeProject(configText) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'bmad-renderer-halt-'));
  extraTmpDirs.push(dir);
  fs.mkdirSync(path.join(dir, '_bmad'), { recursive: true });
  fs.writeFileSync(path.join(dir, '_bmad', 'config.toml'), configText, 'utf-8');
  const skillDst = path.join(dir, 'bmad-quick-dev');
  copyDirSync(SKILL_SRC, skillDst);
  return { dir, skillDst };
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
      'document_output_language = "Klingon"',
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

  // _bmad/custom/bmad-quick-dev.user.toml — [workflow] customization override.
  // Exercises render.py's self-resolution: array append (persistent_facts),
  // list inlining (activation_steps_prepend), and scalar override (on_complete),
  // all baked into the rendered output with no runtime resolve_customization.py.
  fs.writeFileSync(
    path.join(tmpDir, '_bmad', 'custom', 'bmad-quick-dev.user.toml'),
    [
      '[workflow]',
      'activation_steps_prepend = ["TEST_PREPEND_STEP"]',
      'persistent_facts = ["TEST_EXTRA_FACT"]',
      'on_complete = "TEST_ON_COMPLETE_INSTRUCTION"',
      '',
      '[[workflow.review_layers]]',
      'id = "edge-case-hunter"',
      'name = "Replaced Layer"',
      'when = "TEST_WHEN_CONDITION"',
      'instruction = "TEST_REPLACED_LAYER_INSTRUCTION"',
      '',
      '[[workflow.review_layers]]',
      'id = "verification-gap"',
      'instruction = ""',
    ].join('\n'),
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

  const renderDir = path.join(tmpDir, '_bmad', 'render', 'bmad-quick-dev');
  const readRendered = (name) => fs.readFileSync(path.join(renderDir, name), 'utf-8');
  const renderedMdFiles = () => fs.readdirSync(renderDir).filter((f) => f.endsWith('.md'));

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

  test('custom override wins — communication_language baked into step files', () => {
    const content = readRendered('step-01-clarify-and-route.md');
    assert(content.includes('Japanese'), 'communication_language override (Japanese) did not win in the step-01 language line');
  });

  test('document_output_language bakes into the per-step language line', () => {
    const content = readRendered('step-01-clarify-and-route.md');
    assert(content.includes('Klingon'), 'document_output_language not baked into the step-01 language line');
  });

  test('sprint_status is an absolute path rooted at temp project dir', () => {
    const content = readRendered('sync-sprint-status.md');
    // Normalize to forward slashes for cross-platform matching
    const normalizedTmp = tmpDir.replaceAll('\\', '/');
    // sprint_status should appear as <tmpDir>/impl/sprint-status.yaml
    const expected = `${normalizedTmp}/impl/sprint-status.yaml`;
    assert(
      content.includes(expected),
      `sprint_status path not found.\nExpected substring: ${expected}\n` +
        `sync-sprint-status.md excerpt (first 2000 chars):\n${content.slice(0, 2000)}`,
    );
  });

  test('workflow override — prepend step inlined as a bullet', () => {
    const content = readRendered('workflow.md');
    assert(content.includes('- TEST_PREPEND_STEP'), 'activation_steps_prepend not inlined as a bullet');
  });

  test('workflow override — persistent_facts append (base kept, override added)', () => {
    const content = readRendered('workflow.md');
    assert(content.includes('- TEST_EXTRA_FACT'), 'override persistent_fact not inlined');
    assert(content.includes('project-context.md'), 'base persistent_fact dropped — append semantics broken');
  });

  test('empty activation_steps_append renders the _None._ sentinel', () => {
    const content = readRendered('workflow.md');
    assert(content.includes('_None._'), '_None._ sentinel missing for empty list');
  });

  test('on_complete scalar inlined into step-05 and step-oneshot', () => {
    for (const file of ['step-05-present.md', 'step-oneshot.md']) {
      assert(readRendered(file).includes('TEST_ON_COMPLETE_INSTRUCTION'), `on_complete not inlined into ${file}`);
    }
  });

  test('review layers materialize as invocation blocks in step-04', () => {
    const content = readRendered('step-04-review.md');
    assert(content.includes('#### Blind Hunter'), 'default review layer not rendered as a #### invocation block');
    assert(!content.includes('- id:'), 'layer table data leaked into the rendered output');
    assert(content.includes('{diff_output}'), 'runtime {diff_output} placeholder did not survive rendering');
  });

  test('review layer override replaces the matching default by id', () => {
    const content = readRendered('step-04-review.md');
    assert(content.includes('#### Replaced Layer'), 'override layer name not used as block title');
    assert(content.includes('TEST_REPLACED_LAYER_INSTRUCTION'), 'override layer instruction not inlined');
    assert(!content.includes('bmad-review-edge-case-hunter'), 'replaced default layer instruction still present');
    assert(content.includes('bmad-review-adversarial-general'), 'untouched default layer dropped by keyed merge');
  });

  test('empty-instruction override drops its layer entirely', () => {
    const content = readRendered('step-04-review.md');
    assert(!content.includes('verification-gap'), 'disabled layer id still present in rendered output');
    assert(!content.includes('Verification Gap Reviewer'), 'disabled layer name still present in rendered output');
  });

  test('when condition renders as a run-time guard line', () => {
    const content = readRendered('step-04-review.md');
    assert(
      content.includes('Run this layer only if the following holds in the current context: `TEST_WHEN_CONDITION`'),
      'when condition not rendered as a guard line',
    );
  });

  test('disabling every layer renders the HALT instruction', () => {
    // Second render pass: replace the override file so every default layer
    // (and the oneshot route's only layer) is disabled, then re-render.
    fs.writeFileSync(
      path.join(tmpDir, '_bmad', 'custom', 'bmad-quick-dev.user.toml'),
      [
        '[workflow]',
        '',
        '[[workflow.review_layers]]',
        'id = "blind-hunter"',
        'instruction = ""',
        '',
        '[[workflow.review_layers]]',
        'id = "edge-case-hunter"',
        'instruction = ""',
        '',
        '[[workflow.review_layers]]',
        'id = "verification-gap"',
        'instruction = ""',
        '',
        '[[workflow.oneshot_review_layers]]',
        'id = "blind-hunter"',
        'instruction = ""',
      ].join('\n'),
      'utf-8',
    );
    const rerun = spawnSync('python3', [path.join(skillDst, 'render.py')], {
      cwd: skillDst,
      encoding: 'utf-8',
    });
    assert(rerun.status === 0, `re-render exit code ${rerun.status}\nstderr: ${rerun.stderr}`);
    const halt = 'No review layers are active. HALT with status `blocked` and blocking condition `no active review layers`.';
    for (const file of ['step-04-review.md', 'step-oneshot.md']) {
      assert(readRendered(file).includes(halt), `HALT instruction missing from ${file}`);
    }
  });

  test('no {workflow.*} placeholder survives in any rendered file', () => {
    const leaks = renderedMdFiles().filter((f) => readRendered(f).includes('{workflow.'));
    assert(leaks.length === 0, `{workflow.*} leaked in: ${leaks.join(', ')}`);
  });

  test('no resolve_customization.py reference survives in any rendered file', () => {
    const leaks = renderedMdFiles().filter((f) => readRendered(f).includes('resolve_customization.py'));
    assert(leaks.length === 0, `resolve_customization.py still referenced in: ${leaks.join(', ')}`);
  });

  test('no main_config reference survives in any rendered file', () => {
    const leaks = renderedMdFiles().filter((f) => readRendered(f).includes('main_config'));
    assert(leaks.length === 0, `main_config still referenced in: ${leaks.join(', ')} (the runtime config re-read was removed)`);
  });

  // ---------------------------------------------------------------------------
  // Bad-config HALTs cleanly (never a raw Python traceback)
  // ---------------------------------------------------------------------------

  test('missing implementation_artifacts HALTs cleanly (no traceback)', () => {
    const { skillDst: dst } = makeProject(['[core]', 'communication_language = "French"'].join('\n'));
    const res = spawnSync('python3', [path.join(dst, 'render.py')], { cwd: dst, encoding: 'utf-8' });
    assert(res.status === 1, `expected exit 1, got ${res.status}\nstdout: ${res.stdout}\nstderr: ${res.stderr}`);
    assert(
      res.stdout.includes('HALT and report to the user: config is missing `implementation_artifacts`'),
      `stdout missing the implementation_artifacts HALT directive.\nstdout: ${res.stdout}`,
    );
    assert(!res.stderr.includes('Traceback'), `renderer crashed with a traceback instead of HALTing:\n${res.stderr}`);
  });

  test('non-table [modules] does not crash the renderer', () => {
    const { dir, skillDst: dst } = makeProject(
      ['modules = "oops-not-a-table"', '', '[core]', 'implementation_artifacts = "{project-root}/impl"'].join('\n'),
    );
    const res = spawnSync('python3', [path.join(dst, 'render.py')], { cwd: dst, encoding: 'utf-8' });
    assert(res.status === 0, `expected exit 0, got ${res.status}\nstdout: ${res.stdout}\nstderr: ${res.stderr}`);
    assert(!res.stderr.includes('Traceback'), `renderer crashed on non-table modules:\n${res.stderr}`);
    assert(
      fs.existsSync(path.join(dir, '_bmad', 'render', 'bmad-quick-dev', 'workflow.md')),
      'workflow.md not rendered when [modules] was a non-table scalar',
    );
  });
} finally {
  fs.rmSync(tmpDir, { recursive: true, force: true });
  for (const dir of extraTmpDirs) {
    fs.rmSync(dir, { recursive: true, force: true });
  }
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
