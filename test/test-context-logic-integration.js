/**
 * Context Logic Integration Tests
 *
 * Validates the centralized monorepo context logic deduplication:
 * 1. context-logic.js exports a valid XML block
 * 2. All workflow templates that need it use the {{monorepo_context_logic}} placeholder
 * 3. No stale hardcoded <monorepo-context-check> blocks exist in templates
 * 4. src/core/tasks/workflow.xml uses the placeholder (not a hardcoded block)
 * 5. All JS consumers correctly import context-logic.js
 * 6. MONOREPO_CONTEXT_LOGIC string integrity (key fields are present)
 */

const fs = require('fs-extra');
const path = require('node:path');

// ANSI colors
const c = {
  reset: '\u001B[0m',
  green: '\u001B[32m',
  red: '\u001B[31m',
  yellow: '\u001B[33m',
  cyan: '\u001B[36m',
  dim: '\u001B[2m',
};

let passed = 0;
let failed = 0;

function ok(condition, testName, detail = '') {
  if (condition) {
    console.log(`${c.green}✓${c.reset} ${testName}`);
    passed++;
  } else {
    console.log(`${c.red}✗${c.reset} ${testName}`);
    if (detail) console.log(`  ${c.dim}${detail}${c.reset}`);
    failed++;
  }
}

async function readFile(p) {
  return fs.readFile(p, 'utf8');
}

async function exists(p) {
  return fs.pathExists(p);
}

async function runTests() {
  console.log(`${c.cyan}============================================================`);
  console.log('  Context Logic Integration Tests');
  console.log(`============================================================${c.reset}\n`);

  const root = path.join(__dirname, '..');
  const sharedDir = path.join(root, 'tools/cli/installers/lib/ide/shared');
  const templatesDir = path.join(root, 'tools/cli/installers/lib/ide/templates');
  const combinedDir = path.join(templatesDir, 'combined');

  // ────────────────────────────────────────────────────────────
  // Suite 1: context-logic.js module integrity
  // ────────────────────────────────────────────────────────────
  console.log(`${c.yellow}Suite 1: context-logic.js module integrity${c.reset}\n`);

  const contextLogicPath = path.join(sharedDir, 'context-logic.js');
  ok(await exists(contextLogicPath), 'context-logic.js file exists');

  let MONOREPO_CONTEXT_LOGIC;
  try {
    const mod = require(contextLogicPath);
    ok(typeof mod.MONOREPO_CONTEXT_LOGIC === 'string', 'exports MONOREPO_CONTEXT_LOGIC as a string');
    ok(mod.MONOREPO_CONTEXT_LOGIC.length > 0, 'MONOREPO_CONTEXT_LOGIC is non-empty');
    MONOREPO_CONTEXT_LOGIC = mod.MONOREPO_CONTEXT_LOGIC;
  } catch (error) {
    ok(false, 'context-logic.js is require()-able', error.message);
    MONOREPO_CONTEXT_LOGIC = '';
  }

  // Key content checks
  ok(MONOREPO_CONTEXT_LOGIC.includes('<monorepo-context-check'), 'has opening <monorepo-context-check> tag');
  ok(MONOREPO_CONTEXT_LOGIC.includes('</monorepo-context-check>'), 'has closing </monorepo-context-check> tag');
  ok(MONOREPO_CONTEXT_LOGIC.includes('#project:NAME'), 'documents #project:NAME syntax');
  ok(MONOREPO_CONTEXT_LOGIC.includes('#p:NAME'), 'documents #p:NAME short alias');
  ok(MONOREPO_CONTEXT_LOGIC.includes('.current_project'), 'includes .current_project fallback logic');
  ok(MONOREPO_CONTEXT_LOGIC.includes('path traversal'), 'includes path traversal security check');
  ok(MONOREPO_CONTEXT_LOGIC.includes('output_folder'), 'overrides output_folder path variable');
  ok(MONOREPO_CONTEXT_LOGIC.includes('planning_artifacts'), 'overrides planning_artifacts path variable');
  ok(MONOREPO_CONTEXT_LOGIC.includes('HALT'), 'halts on security violation');
  console.log('');

  // ────────────────────────────────────────────────────────────
  // Suite 2: JS consumers import context-logic.js correctly
  // ────────────────────────────────────────────────────────────
  console.log(`${c.yellow}Suite 2: JS consumers import context-logic.js${c.reset}\n`);

  const consumers = [
    {
      file: 'tools/cli/installers/lib/core/installer.js',
      expectedImport: "require('../ide/shared/context-logic')",
    },
    {
      file: 'tools/cli/installers/lib/ide/_config-driven.js',
      expectedImport: "require('./shared/context-logic')",
    },
    {
      file: 'tools/cli/installers/lib/ide/shared/workflow-command-generator.js',
      expectedImport: "require('./context-logic')",
    },
  ];

  for (const { file, expectedImport } of consumers) {
    const fullPath = path.join(root, file);
    try {
      const content = await readFile(fullPath);
      ok(content.includes(expectedImport), `${path.basename(file)} imports context-logic correctly`);
      ok(content.includes("replaceAll('{{monorepo_context_logic}}'"), `${path.basename(file)} uses replaceAll for placeholder`);
    } catch (error) {
      ok(false, `File not found or unreadable: ${fullPath} - ${error.message}`);
    }
  }
  console.log('');

  // ────────────────────────────────────────────────────────────
  // Suite 3: Templates use placeholder, not hardcoded blocks
  // ────────────────────────────────────────────────────────────
  console.log(`${c.yellow}Suite 3: Templates use {{monorepo_context_logic}} placeholder${c.reset}\n`);

  // These templates MUST have the placeholder (they are rendered directly as IDE workflow commands)
  const mustHavePlaceholder = [
    path.join(templatesDir, 'workflow-command-template.md'),
    path.join(templatesDir, 'workflow-commander.md'),
    path.join(combinedDir, 'antigravity.md'),
    path.join(combinedDir, 'claude-workflow.md'),
    path.join(combinedDir, 'claude-workflow-yaml.md'),
    path.join(combinedDir, 'default-workflow.md'),
    path.join(combinedDir, 'default-workflow-yaml.md'),
    path.join(combinedDir, 'kiro-workflow.md'),
    path.join(combinedDir, 'opencode-workflow.md'),
    path.join(combinedDir, 'windsurf-workflow.md'),
  ];

  for (const filePath of mustHavePlaceholder) {
    const rel = path.relative(root, filePath);
    try {
      const content = await readFile(filePath);
      ok(content.includes('{{monorepo_context_logic}}'), `${path.basename(filePath)} has {{monorepo_context_logic}} placeholder`);
      // Must NOT have raw hardcoded block (only the shared module should have it)
      ok(!content.includes('<monorepo-context-check'), `${path.basename(filePath)} has NO hardcoded <monorepo-context-check> block`);
    } catch (error) {
      ok(false, `File not found or unreadable: ${filePath} - ${error.message}`);
    }
  }
  console.log('');

  // ────────────────────────────────────────────────────────────
  // Suite 4: No rogue hardcoded blocks anywhere in templates dir
  // ────────────────────────────────────────────────────────────
  console.log(`${c.yellow}Suite 4: No hardcoded blocks in templates directory${c.reset}\n`);

  const walkDir = async (dir) => {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    const files = [];
    for (const e of entries) {
      const full = path.join(dir, e.name);
      if (e.isDirectory()) files.push(...(await walkDir(full)));
      else if (e.isFile()) files.push(full);
    }
    return files;
  };

  const allTemplateFiles = await walkDir(templatesDir);
  const rogueFiles = [];
  for (const f of allTemplateFiles) {
    const content = await readFile(f);
    if (content.includes('<monorepo-context-check') && !f.includes('context-logic.js')) {
      rogueFiles.push(path.relative(root, f));
    }
  }
  ok(
    rogueFiles.length === 0,
    `No hardcoded <monorepo-context-check> blocks in templates (found ${rogueFiles.length})`,
    rogueFiles.length > 0 ? `Rogue files: ${rogueFiles.join(', ')}` : '',
  );
  console.log('');

  // ────────────────────────────────────────────────────────────
  // Suite 5: src/core/tasks/workflow.xml uses placeholder
  // ────────────────────────────────────────────────────────────
  console.log(`${c.yellow}Suite 5: src/core/tasks/workflow.xml uses placeholder${c.reset}\n`);

  const srcWorkflowXml = path.join(root, 'src/core/tasks/workflow.xml');
  ok(await exists(srcWorkflowXml), 'src/core/tasks/workflow.xml exists');
  const srcXmlContent = await readFile(srcWorkflowXml);
  ok(srcXmlContent.includes('{{monorepo_context_logic}}'), 'workflow.xml (src) uses {{monorepo_context_logic}} placeholder');
  ok(!srcXmlContent.includes('<monorepo-context-check'), 'workflow.xml (src) has NO hardcoded <monorepo-context-check> block');

  // ────────────────────────────────────────────────────────────
  // Results
  // ────────────────────────────────────────────────────────────
  console.log(`\n${c.cyan}============================================================`);
  console.log(`  Results: ${c.green}${passed} passed${c.reset}${c.cyan}, ${c.red}${failed} failed${c.reset}${c.cyan}`);
  console.log(`============================================================${c.reset}\n`);

  if (failed === 0) {
    console.log(`${c.green}✨ All context-logic integration tests passed!${c.reset}\n`);
    process.exit(0);
  } else {
    console.log(`${c.red}❌ ${failed} test(s) failed${c.reset}\n`);
    process.exit(1);
  }
}

runTests().catch((error) => {
  console.error(error);
  process.exit(1);
});
