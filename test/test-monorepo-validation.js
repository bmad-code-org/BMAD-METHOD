/**
 * Monorepo Support Validation Tests
 *
 * Verifies that:
 * 1. The set-project workflow is correctly registered.
 * 2. All core and BMM workflows contain the monorepo context logic.
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

  // 2. Verify context logic in workflows
  console.log(`${colors.yellow}Test Suite 2: Workflow Context Logic${colors.reset}\n`);

  const workflowFiles = glob.sync('src/{core,bmm}/workflows/**/*.{md,xml}', { cwd: projectRoot });

  // Workflows that MUST have the check
  const requiredWorkflows = [
    'brainstorming',
    'party-mode',
    'create-product-brief',
    'create-prd',
    'create-architecture',
    'code-review',
    'create-story',
    'dev-story',
    'set-project', // Should not have the check itself, but let's exclude it
  ];

  for (const file of workflowFiles) {
    const basename = path.basename(path.dirname(file));
    if (basename === 'set-project' || basename === '0-context') continue;

    const content = await fs.readFile(path.join(projectRoot, file), 'utf8');
    const isXml = file.endsWith('.xml');

    if (isXml) {
      assert(content.includes('_bmad/.current_project'), `XML workflow contains context check: ${file}`);
    } else {
      // Only check Markdown files that look like main workflow/instruction files
      const filename = path.basename(file);
      if (filename.includes('workflow') || filename.includes('instructions')) {
        assert(content.includes('_bmad/.current_project'), `Markdown workflow contains context check: ${file}`);
      }
    }
  }

  console.log('');

  // 3. Verify set-project implementation
  console.log(`${colors.yellow}Test Suite 3: set-project Implementation${colors.reset}\n`);
  try {
    const setProjectPath = path.join(projectRoot, 'src/bmm/workflows/0-context/set-project/workflow.md');
    const exists = await fs.pathExists(setProjectPath);
    assert(exists, 'set-project workflow file exists');
    if (exists) {
      const content = await fs.readFile(setProjectPath, 'utf8');
      assert(content.includes('_bmad/.current_project'), 'set-project implementation manages .current_project');
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
