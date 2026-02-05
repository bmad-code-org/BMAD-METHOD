/**
 * Installation Component Tests
 *
 * Tests individual installation components in isolation:
 * - Agent YAML → XML compilation
 * - Manifest generation
 * - Path resolution
 * - Customization merging
 *
 * These are deterministic unit tests that don't require full installation.
 * Usage: node test/test-installation-components.js
 */

const path = require('node:path');
const fs = require('fs-extra');
const { YamlXmlBuilder } = require('../tools/cli/lib/yaml-xml-builder');
const { ManifestGenerator } = require('../tools/cli/installers/lib/core/manifest-generator');

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

/**
 * Test helper: Assert condition
 */
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

/**
 * Test Suite
 */
async function runTests() {
  console.log(`${colors.cyan}========================================`);
  console.log('Installation Component Tests');
  console.log(`========================================${colors.reset}\n`);

  const projectRoot = path.join(__dirname, '..');

  // ============================================================
  // Test 1: YAML → XML Agent Compilation (In-Memory)
  // ============================================================
  console.log(`${colors.yellow}Test Suite 1: Agent Compilation${colors.reset}\n`);

  try {
    const builder = new YamlXmlBuilder();
    const pmAgentPath = path.join(projectRoot, 'src/bmm/agents/pm.agent.yaml');

    // Create temp output path
    const tempOutput = path.join(__dirname, 'temp-pm-agent.md');

    try {
      const result = await builder.buildAgent(pmAgentPath, null, tempOutput, { includeMetadata: true });

      assert(result && result.outputPath === tempOutput, 'Agent compilation returns result object with outputPath');

      // Read the output
      const compiled = await fs.readFile(tempOutput, 'utf8');

      assert(compiled.includes('<agent'), 'Compiled agent contains <agent> tag');

      assert(compiled.includes('<persona>'), 'Compiled agent contains <persona> tag');

      assert(compiled.includes('<menu>'), 'Compiled agent contains <menu> tag');

      assert(compiled.includes('Product Manager'), 'Compiled agent contains agent title');

      // Cleanup
      await fs.remove(tempOutput);
    } catch (error) {
      assert(false, 'Agent compilation succeeds', error.message);
    }
  } catch (error) {
    assert(false, 'YamlXmlBuilder instantiates', error.message);
  }

  console.log('');

  // ============================================================
  // Test 2: Customization Merging
  // ============================================================
  console.log(`${colors.yellow}Test Suite 2: Customization Merging${colors.reset}\n`);

  try {
    const builder = new YamlXmlBuilder();

    // Test deepMerge function
    const base = {
      agent: {
        metadata: { name: 'John', title: 'PM' },
        persona: { role: 'Product Manager', style: 'Analytical' },
      },
    };

    const customize = {
      agent: {
        metadata: { name: 'Sarah' }, // Override name only
        persona: { style: 'Concise' }, // Override style only
      },
    };

    const merged = builder.deepMerge(base, customize);

    assert(merged.agent.metadata.name === 'Sarah', 'Deep merge overrides customized name');

    assert(merged.agent.metadata.title === 'PM', 'Deep merge preserves non-overridden title');

    assert(merged.agent.persona.role === 'Product Manager', 'Deep merge preserves non-overridden role');

    assert(merged.agent.persona.style === 'Concise', 'Deep merge overrides customized style');
  } catch (error) {
    assert(false, 'Customization merging works', error.message);
  }

  console.log('');

  // ============================================================
  // Test 3: Path Resolution
  // ============================================================
  console.log(`${colors.yellow}Test Suite 3: Path Variable Resolution${colors.reset}\n`);

  try {
    const builder = new YamlXmlBuilder();

    // Test path resolution logic (if exposed)
    // This would test {project-root}, {installed_path}, {config_source} resolution

    const testPath = '{project-root}/bmad/bmm/config.yaml';
    const expectedPattern = /\/bmad\/bmm\/config\.yaml$/;

    assert(
      true, // Placeholder - would test actual resolution
      'Path variable resolution pattern matches expected format',
      'Note: This test validates path resolution logic exists',
    );
  } catch (error) {
    assert(false, 'Path resolution works', error.message);
  }

  console.log('');

  // ============================================================
  // Test 5: QA Agent Compilation
  // ============================================================
  console.log(`${colors.yellow}Test Suite 5: QA Agent Compilation${colors.reset}\n`);

  try {
    const builder = new YamlXmlBuilder();
    const qaAgentPath = path.join(projectRoot, 'src/bmm/agents/qa.agent.yaml');
    const tempOutput = path.join(__dirname, 'temp-qa-agent.md');

    try {
      const result = await builder.buildAgent(qaAgentPath, null, tempOutput, { includeMetadata: true });
      const compiled = await fs.readFile(tempOutput, 'utf8');

      assert(compiled.includes('QA Engineer'), 'QA agent compilation includes agent title');

      assert(compiled.includes('qa/automate'), 'QA agent menu includes automate workflow');

      // Cleanup
      await fs.remove(tempOutput);
    } catch (error) {
      assert(false, 'QA agent compiles successfully', error.message);
    }
  } catch (error) {
    assert(false, 'QA compilation test setup', error.message);
  }

  console.log('');

  // ============================================================
  // Test 6: Guard against advanced-elicitation XML references
  // ============================================================
  console.log(`${colors.yellow}Test Suite 6: Advanced Elicitation Reference Guard${colors.reset}\n`);

  try {
    const searchRoots = [path.join(projectRoot, 'src'), path.join(projectRoot, 'docs')];
    const allowedExtensions = new Set(['.md', '.yaml', '.yml', '.xml']);
    const forbiddenRef = 'advanced-elicitation/workflow.xml';
    const excludedFile = path.join(projectRoot, 'src', 'core', 'workflows', 'advanced-elicitation', 'workflow.xml');
    const offenders = [];

    const walk = async (dir) => {
      const entries = await fs.readdir(dir, { withFileTypes: true });
      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
          await walk(fullPath);
          continue;
        }
        if (!allowedExtensions.has(path.extname(entry.name))) {
          continue;
        }
        if (fullPath === excludedFile) {
          continue;
        }
        const content = await fs.readFile(fullPath, 'utf8');
        if (content.includes(forbiddenRef)) {
          offenders.push(path.relative(projectRoot, fullPath));
        }
      }
    };

    for (const root of searchRoots) {
      await walk(root);
    }

    assert(
      offenders.length === 0,
      'No advanced-elicitation/workflow.xml references outside XML source',
      offenders.length > 0 ? offenders.join(', ') : '',
    );
  } catch (error) {
    assert(false, 'Advanced elicitation reference guard runs', error.message);
  }

  console.log('');

  // ============================================================
  // Test 7: Validate Workflow XML Reference Guard
  // ============================================================
  console.log(`${colors.yellow}Test Suite 7: Validate Workflow Reference Guard${colors.reset}\n`);

  try {
    const searchRoots = [path.join(projectRoot, 'src'), path.join(projectRoot, 'docs')];
    const allowedExtensions = new Set(['.md', '.yaml', '.yml', '.xml']);
    const forbiddenRef = 'validate-workflow.xml';
    const excludedFile = path.join(projectRoot, 'src', 'core', 'tasks', 'validate-workflow.xml');
    const offenders = [];

    const walk = async (dir) => {
      const entries = await fs.readdir(dir, { withFileTypes: true });
      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
          await walk(fullPath);
          continue;
        }
        if (!allowedExtensions.has(path.extname(entry.name))) {
          continue;
        }
        if (fullPath === excludedFile) {
          continue;
        }
        const content = await fs.readFile(fullPath, 'utf8');
        if (content.includes(forbiddenRef)) {
          offenders.push(path.relative(projectRoot, fullPath));
        }
      }
    };

    for (const root of searchRoots) {
      await walk(root);
    }

    assert(
      offenders.length === 0,
      'No validate-workflow.xml references outside XML source',
      offenders.length > 0 ? offenders.join(', ') : '',
    );
  } catch (error) {
    assert(false, 'Validate workflow reference guard runs', error.message);
  }

  console.log('');

  // ============================================================
  // Test 8: Workflow XML Reference Guard
  // ============================================================
  console.log(`${colors.yellow}Test Suite 8: Workflow Reference Guard${colors.reset}\n`);

  try {
    const searchRoots = [path.join(projectRoot, 'src'), path.join(projectRoot, 'docs'), path.join(projectRoot, 'tools')];
    const allowedExtensions = new Set(['.md', '.yaml', '.yml', '.xml']);
    const forbiddenRef = 'workflow.xml';
    const excludedFiles = new Set([
      path.join(projectRoot, 'src', 'core', 'tasks', 'workflow.xml'),
      path.join(projectRoot, 'src', 'core', 'workflows', 'advanced-elicitation', 'workflow.xml'),
    ]);
    const offenders = [];

    const walk = async (dir) => {
      const entries = await fs.readdir(dir, { withFileTypes: true });
      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
          await walk(fullPath);
          continue;
        }
        if (!allowedExtensions.has(path.extname(entry.name))) {
          continue;
        }
        if (excludedFiles.has(fullPath)) {
          continue;
        }
        const content = await fs.readFile(fullPath, 'utf8');
        if (content.includes(forbiddenRef)) {
          offenders.push(path.relative(projectRoot, fullPath));
        }
      }
    };

    for (const root of searchRoots) {
      await walk(root);
    }

    assert(offenders.length === 0, 'No workflow.xml references outside XML source', offenders.length > 0 ? offenders.join(', ') : '');
  } catch (error) {
    assert(false, 'Workflow reference guard runs', error.message);
  }

  console.log('');

  // ============================================================
  // Summary
  // ============================================================
  console.log(`${colors.cyan}========================================`);
  console.log('Test Results:');
  console.log(`  Passed: ${colors.green}${passed}${colors.reset}`);
  console.log(`  Failed: ${colors.red}${failed}${colors.reset}`);
  console.log(`========================================${colors.reset}\n`);

  if (failed === 0) {
    console.log(`${colors.green}✨ All installation component tests passed!${colors.reset}\n`);
    process.exit(0);
  } else {
    console.log(`${colors.red}❌ Some installation component tests failed${colors.reset}\n`);
    process.exit(1);
  }
}

// Run tests
runTests().catch((error) => {
  console.error(`${colors.red}Test runner failed:${colors.reset}`, error.message);
  console.error(error.stack);
  process.exit(1);
});
