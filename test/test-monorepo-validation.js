/**
 * Monorepo Support Validation Tests
 *
 * Architecture after deduplication:
 * - Monorepo context logic lives ONLY in context-logic.js
 * - workflow.xml (src) uses {{monorepo_context_logic}} placeholder → injected at install time
 * - Individual source workflow files do NOT have inline checks (that's the deduplication!)
 * - Only code-review/instructions.xml, dev-story/instructions.xml, create-story/instructions.xml
 *   and advanced-elicitation/workflow.xml are XML workflows checked; XML workflows that go through
 *   workflow.xml no longer need inline checks.
 *
 * Verifies:
 * 1. The set-project workflow is correctly registered.
 * 2. No source workflow file has a stale inline "Monorepo Context Check" block.
 * 3. Only the canonical SINGLE source (context-logic.js) defines the check.
 * 4. set-project implementation still manages .current_project.
 */

const fs = require('fs-extra');
const path = require('node:path');
const glob = require('glob');

// ANSI colors
const colors = {
  reset: '\u001B[0m',
  green: '\u001B[32m',
  red: '\u001B[31m',
  yellow: '\u001B[33m',
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

async function runTests() {
  console.log(`${colors.cyan}========================================`);
  console.log('Monorepo Support Validation Tests');
  console.log(`========================================${colors.reset}\n`);

  const projectRoot = path.join(__dirname, '..');

  // 1. Verify set-project registration
  console.log(`${colors.yellow}Test Suite 1: Workflow Registration${colors.reset}\n`);
  try {
    const csvPath = path.join(projectRoot, 'src/bmm/module-help.csv');
    const content = await fs.readFile(csvPath, 'utf8');
    assert(content.includes('set-project'), 'set-project workflow is registered in module-help.csv');
  } catch (error) {
    assert(false, 'Registration check failed', error.message);
  }

  console.log('');

  // 2. Verify NO stale inline "Monorepo Context Check" blocks in source workflow files
  //    These are redundant since workflow.xml now handles context injection via context-logic.js
  console.log(`${colors.yellow}Test Suite 2: No Stale Inline Monorepo Context Checks${colors.reset}\n`);
  console.log(`  ${colors.dim}(Inline checks were moved to workflow.xml via context-logic.js)${colors.reset}\n`);

  const workflowFiles = glob.sync('src/{core,bmm}/workflows/**/*.{md,xml}', { cwd: projectRoot });

  for (const file of workflowFiles) {
    // skip the context-logic source itself (it's the canonical source)
    if (file.includes('context-logic')) continue;

    const content = await fs.readFile(path.join(projectRoot, file), 'utf8');

    assert(!content.includes('**Monorepo Context Check:**'), `No stale inline check block in: ${file}`);
  }

  console.log('');

  // 3. Verify canonical source is context-logic.js (single source of truth)
  console.log(`${colors.yellow}Test Suite 3: Single Source of Truth${colors.reset}\n`);

  const contextLogicPath = path.join(projectRoot, 'tools/cli/installers/lib/ide/shared/context-logic.js');
  assert(await fs.pathExists(contextLogicPath), 'context-logic.js exists as canonical source');

  const srcWorkflowXml = path.join(projectRoot, 'src/core/tasks/workflow.xml');
  const xmlContent = await fs.readFile(srcWorkflowXml, 'utf8');
  assert(xmlContent.includes('{{monorepo_context_logic}}'), 'workflow.xml uses {{monorepo_context_logic}} placeholder');
  assert(!xmlContent.includes('**Monorepo Context Check:**'), 'workflow.xml has no stale inline check');

  console.log('');

  // 4. Verify set-project implementation
  console.log(`${colors.yellow}Test Suite 4: set-project Implementation${colors.reset}\n`);
  try {
    const setProjectPath = path.join(projectRoot, 'src/bmm/workflows/0-context/set-project/workflow.md');
    const exists = await fs.pathExists(setProjectPath);
    assert(exists, 'set-project workflow file exists');
    if (exists) {
      const content = await fs.readFile(setProjectPath, 'utf8');
      assert(content.includes('_bmad/.current_project'), 'set-project implementation manages .current_project');
      assert(content.includes('my-app'), 'set-project examples use generic public-friendly names');
    }
  } catch (error) {
    assert(false, 'set-project check failed', error.message);
  }

  console.log('\n');
  console.log(`${colors.cyan}========================================`);
  console.log('Test Results:');
  console.log(`  Passed: ${colors.green}${passed}${colors.reset}`);
  console.log(`  Failed: ${colors.red}${failed}${colors.reset}`);
  console.log(`========================================${colors.reset}\n`);

  if (failed === 0) {
    console.log(`${colors.green}✨ All monorepo validation tests passed!${colors.reset}\n`);
    process.exit(0);
  } else {
    console.log(`${colors.red}❌ Some monorepo validation tests failed${colors.reset}\n`);
    process.exit(1);
  }
}

runTests().catch((error) => {
  console.error(error);
  process.exit(1);
});
