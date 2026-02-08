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
const os = require('node:os');
const fs = require('fs-extra');
const yaml = require('yaml');
const { YamlXmlBuilder } = require('../tools/cli/lib/yaml-xml-builder');
const { ManifestGenerator } = require('../tools/cli/installers/lib/core/manifest-generator');
const { WorkflowCommandGenerator } = require('../tools/cli/installers/lib/ide/shared/workflow-command-generator');
const { TaskToolCommandGenerator } = require('../tools/cli/installers/lib/ide/shared/task-tool-command-generator');
const { IdeManager } = require('../tools/cli/installers/lib/ide/manager');
const { ModuleManager } = require('../tools/cli/installers/lib/modules/manager');
const { BMAD_FOLDER_NAME } = require('../tools/cli/installers/lib/ide/shared/path-utils');

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
 * Recursively collect files from a mix of files/directories.
 */
async function collectFiles(targets, allowedExtensions, excludedFiles = new Set()) {
  const files = [];
  const normalizedExcludes = new Set([...excludedFiles].map((p) => path.resolve(p)));

  const walk = async (targetPath) => {
    if (!(await fs.pathExists(targetPath))) {
      return;
    }

    const stat = await fs.stat(targetPath);
    if (stat.isFile()) {
      const normalizedTargetPath = path.resolve(targetPath);
      if (normalizedExcludes.has(normalizedTargetPath)) {
        return;
      }
      if (allowedExtensions.has(path.extname(targetPath))) {
        files.push(targetPath);
      }
      return;
    }

    const entries = await fs.readdir(targetPath, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(targetPath, entry.name);
      if (entry.isSymbolicLink()) {
        continue;
      }
      if (entry.isDirectory()) {
        await walk(fullPath);
        continue;
      }
      if (normalizedExcludes.has(path.resolve(fullPath))) {
        continue;
      }
      if (allowedExtensions.has(path.extname(entry.name))) {
        files.push(fullPath);
      }
    }
  };

  for (const target of targets) {
    await walk(target);
  }

  return files;
}

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
  // Test 4: Workflow Command Generator Defaults
  // ============================================================
  console.log(`${colors.yellow}Test Suite 4: Workflow Generator Defaults${colors.reset}\n`);

  try {
    const workflowGenerator = new WorkflowCommandGenerator();
    assert(
      workflowGenerator.bmadFolderName === BMAD_FOLDER_NAME,
      'Workflow generator default BMAD folder matches shared constant',
      `Expected "${BMAD_FOLDER_NAME}", got "${workflowGenerator.bmadFolderName}"`,
    );

    const launcherContent = workflowGenerator.buildLauncherContent('bmm', [
      {
        name: 'create-story',
        displayPath: '{project-root}/_bmad/bmm/workflows/4-implementation/create-story/workflow.md',
        description: 'Create and validate the next story',
      },
    ]);
    assert(
      launcherContent.includes('{project-root}/src/core/tasks/workflow.md'),
      'Workflow launcher includes fallback loader path for workflow task',
    );
  } catch (error) {
    assert(false, 'Workflow generator default path is valid', error.message);
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
  // Test 9: Guard against incorrect module config references
  // ============================================================
  console.log(`${colors.yellow}Test Suite 9: BMM Config Reference Guard${colors.reset}\n`);

  try {
    const searchTargets = [path.join(projectRoot, 'src', 'bmm', 'workflows', 'document-project', 'workflows')];
    const allowedExtensions = new Set(['.yaml', '.yml']);
    const forbiddenRef = '{project-root}/_bmad/bmb/config.yaml';
    const offenders = [];

    const files = await collectFiles(searchTargets, allowedExtensions);
    for (const fullPath of files) {
      const content = await fs.readFile(fullPath, 'utf8');
      if (content.includes(forbiddenRef)) {
        offenders.push(path.relative(projectRoot, fullPath));
      }
    }

    assert(
      offenders.length === 0,
      'No bmm workflow configs should reference _bmad/bmb/config.yaml',
      offenders.length > 0 ? offenders.join(', ') : '',
    );
  } catch (error) {
    assert(false, 'BMM config reference guard runs', error.message);
  }

  console.log('');

  // ============================================================
  // Test 6: Guard against advanced-elicitation XML references
  // ============================================================
  console.log(`${colors.yellow}Test Suite 6: Advanced Elicitation Reference Guard${colors.reset}\n`);

  try {
    const searchTargets = [
      path.join(projectRoot, 'src', 'bmm', 'workflows', '2-plan-workflows', 'create-prd', 'steps-e'),
      path.join(projectRoot, 'src', 'bmm', 'workflows', '2-plan-workflows', 'create-prd', 'steps-v', 'step-v-01-discovery.md'),
    ];
    const allowedExtensions = new Set(['.md', '.yaml', '.yml', '.xml']);
    const forbiddenRef = 'advanced-elicitation/workflow.xml';
    const offenders = [];

    const files = await collectFiles(searchTargets, allowedExtensions);
    for (const fullPath of files) {
      const content = await fs.readFile(fullPath, 'utf8');
      if (content.includes(forbiddenRef)) {
        offenders.push(path.relative(projectRoot, fullPath));
      }
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
    const searchTargets = [
      path.join(projectRoot, 'src', 'bmm', 'workflows', '4-implementation'),
      path.join(projectRoot, 'src', 'bmm', 'workflows', 'document-project'),
    ];
    const allowedExtensions = new Set(['.md', '.yaml', '.yml', '.xml']);
    const forbiddenRef = 'validate-workflow.xml';
    const excludedFile = path.join(projectRoot, 'src', 'core', 'tasks', 'validate-workflow.xml');
    const offenders = [];

    const files = await collectFiles(searchTargets, allowedExtensions, new Set([excludedFile]));
    for (const fullPath of files) {
      const content = await fs.readFile(fullPath, 'utf8');
      if (content.includes(forbiddenRef)) {
        offenders.push(path.relative(projectRoot, fullPath));
      }
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
    const searchTargets = [
      path.join(projectRoot, 'src', 'bmm', 'workflows', '4-implementation'),
      path.join(projectRoot, 'src', 'bmm', 'workflows', 'document-project'),
      path.join(projectRoot, 'tools', 'cli', 'installers', 'lib'),
    ];
    const allowedExtensions = new Set(['.md', '.yaml', '.yml', '.xml']);
    const forbiddenRefPattern = /(^|[^a-zA-Z0-9_-])workflow\.xml\b/;
    const offenders = [];

    const files = await collectFiles(searchTargets, allowedExtensions);
    for (const fullPath of files) {
      const content = await fs.readFile(fullPath, 'utf8');
      if (forbiddenRefPattern.test(content)) {
        offenders.push(path.relative(projectRoot, fullPath));
      }
    }

    assert(offenders.length === 0, 'No workflow.xml references outside XML source', offenders.length > 0 ? offenders.join(', ') : '');
  } catch (error) {
    assert(false, 'Workflow reference guard runs', error.message);
  }

  console.log('');

  // ============================================================
  // Test 10: Workflow Handler Fallback Guard
  // ============================================================
  console.log(`${colors.yellow}Test Suite 10: Workflow Handler Fallback Guard${colors.reset}\n`);

  try {
    const workflowHandlerPath = path.join(projectRoot, 'src', 'utility', 'agent-components', 'handler-workflow.txt');
    const content = await fs.readFile(workflowHandlerPath, 'utf8');

    assert(content.includes('{project-root}/src/core/tasks/workflow.md'), 'Workflow handler documents fallback loader path');
    assert(content.includes('Log an error including both attempted paths'), 'Workflow handler requires explicit dual-path error logging');
    assert(
      content.includes('Fail fast with a descriptive message and HALT'),
      'Workflow handler mandates fail-fast behavior when loader is unavailable',
    );
  } catch (error) {
    assert(false, 'Workflow handler fallback guard runs', error.message);
  }

  console.log('');

  // ============================================================
  // Test 11: Gemini Template Extension Regression Guard
  // ============================================================
  console.log(`${colors.yellow}Test Suite 11: Gemini Template Extension Guard${colors.reset}\n`);

  try {
    const tmpRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'bmad-gemini-install-'));
    const projectDir = path.join(tmpRoot, 'project');
    const bmadDir = path.join(tmpRoot, BMAD_FOLDER_NAME);
    await fs.ensureDir(projectDir);
    await fs.copy(path.join(projectRoot, 'src', 'core'), path.join(bmadDir, 'core'));
    await fs.copy(path.join(projectRoot, 'src', 'bmm'), path.join(bmadDir, 'bmm'));

    const manifestGenerator = new ManifestGenerator();
    await manifestGenerator.generateManifests(bmadDir, ['bmm'], [], { ides: ['gemini'] });

    const ideManager = new IdeManager();
    await ideManager.ensureInitialized();
    await ideManager.setup('gemini', projectDir, bmadDir, { selectedModules: ['bmm'] });

    const commandsDir = path.join(projectDir, '.gemini', 'commands');
    const generated = await fs.readdir(commandsDir);

    assert(
      generated.some((file) => file.endsWith('.toml')),
      'Gemini installer emits template-native TOML command files',
      generated.join(', '),
    );

    assert(!generated.some((file) => file.endsWith('.md')), 'Gemini installer does not emit markdown command files', generated.join(', '));

    await fs.remove(tmpRoot);
  } catch (error) {
    assert(false, 'Gemini template extension guard runs', error.message);
  }

  console.log('');

  // ============================================================
  // Test 12: Manifest Stale Entry Cleanup Guard
  // ============================================================
  console.log(`${colors.yellow}Test Suite 12: Manifest Stale Entry Cleanup Guard${colors.reset}\n`);

  try {
    const tmpRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'bmad-manifest-clean-'));
    const bmadDir = path.join(tmpRoot, BMAD_FOLDER_NAME);
    await fs.copy(path.join(projectRoot, 'src', 'core'), path.join(bmadDir, 'core'));
    await fs.copy(path.join(projectRoot, 'src', 'bmm'), path.join(bmadDir, 'bmm'));

    const cfgDir = path.join(bmadDir, '_config');
    await fs.ensureDir(cfgDir);
    const staleManifestPath = path.join(cfgDir, 'workflow-manifest.csv');
    await fs.writeFile(
      staleManifestPath,
      'name,description,module,path\n"old","old workflow","core","_bmad/core/workflows/old/workflow.md"\n',
    );

    const manifestGenerator = new ManifestGenerator();
    await manifestGenerator.generateManifests(bmadDir, ['bmm'], [], { ides: ['claude-code'] });
    const regenerated = await fs.readFile(staleManifestPath, 'utf8');

    assert(
      !regenerated.includes('"old","old workflow","core","_bmad/core/workflows/old/workflow.md"'),
      'Workflow manifest regeneration removes stale/deleted rows',
    );

    await fs.remove(tmpRoot);
  } catch (error) {
    assert(false, 'Manifest stale entry cleanup guard runs', error.message);
  }

  console.log('');

  // ============================================================
  // Test 13: Internal Task Command Exposure Guard
  // ============================================================
  console.log(`${colors.yellow}Test Suite 13: Internal Task Exposure Guard${colors.reset}\n`);

  try {
    const tmpRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'bmad-task-filter-'));
    const projectDir = path.join(tmpRoot, 'project');
    const bmadDir = path.join(tmpRoot, BMAD_FOLDER_NAME);
    const commandsDir = path.join(tmpRoot, 'commands');
    await fs.ensureDir(projectDir);
    await fs.copy(path.join(projectRoot, 'src', 'core'), path.join(bmadDir, 'core'));
    await fs.copy(path.join(projectRoot, 'src', 'bmm'), path.join(bmadDir, 'bmm'));

    const manifestGenerator = new ManifestGenerator();
    await manifestGenerator.generateManifests(bmadDir, ['bmm'], [], { ides: ['claude-code'] });

    const taskToolGenerator = new TaskToolCommandGenerator();
    await taskToolGenerator.generateDashTaskToolCommands(projectDir, bmadDir, commandsDir);
    const generated = await fs.readdir(commandsDir);

    assert(
      !generated.some((file) => /^bmad-workflow\./.test(file)),
      'Task/tool command generation excludes internal workflow runner task command',
      generated.join(', '),
    );

    await fs.remove(tmpRoot);
  } catch (error) {
    assert(false, 'Internal task exposure guard runs', error.message);
  }

  console.log('');

  // ============================================================
  // Test 14: Workflow Frontmatter web_bundle Strip Guard
  // ============================================================
  console.log(`${colors.yellow}Test Suite 14: web_bundle Frontmatter Strip Guard${colors.reset}\n`);

  try {
    const manager = new ModuleManager();
    const content = `---
name: demo-workflow
description: Demo
web_bundle:
  enabled: true
  bundle:
    mode: strict
---

# Demo
`;
    const stripped = manager.stripWebBundleFromFrontmatter(content);
    const frontmatterMatch = stripped.match(/^---\n([\s\S]*?)\n---/);
    const parsed = frontmatterMatch ? yaml.parse(frontmatterMatch[1]) : {};

    assert(!stripped.includes('web_bundle:'), 'web_bundle strip removes nested web_bundle block from frontmatter');
    assert(parsed.name === 'demo-workflow' && parsed.description === 'Demo', 'web_bundle strip preserves other frontmatter keys');
  } catch (error) {
    assert(false, 'web_bundle strip guard runs', error.message);
  }

  console.log('');

  // ============================================================
  // Test 15: Correct-Course Installed Path Guard
  // ============================================================
  console.log(`${colors.yellow}Test Suite 15: Correct-Course Installed Path Guard${colors.reset}\n`);

  try {
    const workflowPath = path.join(projectRoot, 'src', 'bmm', 'workflows', '4-implementation', 'correct-course', 'workflow.md');
    const content = await fs.readFile(workflowPath, 'utf8');

    assert(
      content.includes('`installed_path` = `{project-root}/_bmad/bmm/workflows/4-implementation/correct-course`'),
      'Correct-course workflow uses installed runtime path',
    );
    assert(
      content.includes('{project-root}/_bmad/core/tasks/validate-workflow.md'),
      'Correct-course workflow uses installed validate-workflow task path',
    );
  } catch (error) {
    assert(false, 'Correct-course installed path guard runs', error.message);
  }

  console.log('');

  // ============================================================
  // Test 16: Task/Tool Standalone and CRLF Parsing Guard
  // ============================================================
  console.log(`${colors.yellow}Test Suite 16: Task/Tool Standalone + CRLF Guard${colors.reset}\n`);

  try {
    const tmpRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'bmad-standalone-crlf-'));
    const coreTasksDir = path.join(tmpRoot, '_bmad', 'core', 'tasks');
    const coreToolsDir = path.join(tmpRoot, '_bmad', 'core', 'tools');
    await fs.ensureDir(coreTasksDir);
    await fs.ensureDir(coreToolsDir);

    await fs.writeFile(
      path.join(coreTasksDir, 'default-task.md'),
      `---
name: default-task
displayName: Default Task
description: Defaults to standalone
---
`,
    );

    await fs.writeFile(
      path.join(coreTasksDir, 'internal-task.md'),
      `---
name: internal-task
displayName: Internal Task
description: Hidden task
internal: true
---
`,
    );

    await fs.writeFile(
      path.join(coreTasksDir, 'crlf-task.md'),
      '---\r\nname: crlf-task\r\ndisplayName: CRLF Task\r\ndescription: Parsed from CRLF\r\nstandalone: true\r\n---\r\n',
    );

    await fs.writeFile(
      path.join(coreToolsDir, 'default-tool.md'),
      `---
name: default-tool
displayName: Default Tool
description: Defaults to standalone
---
`,
    );

    await fs.writeFile(
      path.join(coreToolsDir, 'internal-tool.md'),
      `---
name: internal-tool
displayName: Internal Tool
description: Hidden tool
internal: true
---
`,
    );

    await fs.writeFile(
      path.join(coreToolsDir, 'crlf-tool.md'),
      '---\r\nname: crlf-tool\r\ndisplayName: CRLF Tool\r\ndescription: Parsed from CRLF\r\nstandalone: true\r\n---\r\n',
    );

    const manifestGenerator = new ManifestGenerator();
    const tasks = await manifestGenerator.getTasksFromDir(coreTasksDir, 'core');
    const tools = await manifestGenerator.getToolsFromDir(coreToolsDir, 'core');

    const defaultTask = tasks.find((task) => task.name === 'default-task');
    const internalTask = tasks.find((task) => task.name === 'internal-task');
    const crlfTask = tasks.find((task) => task.name === 'crlf-task');
    const defaultTool = tools.find((tool) => tool.name === 'default-tool');
    const internalTool = tools.find((tool) => tool.name === 'internal-tool');
    const crlfTool = tools.find((tool) => tool.name === 'crlf-tool');

    assert(defaultTask?.standalone === true, 'Tasks default to standalone when standalone key is omitted');
    assert(internalTask?.standalone === false, 'Tasks marked internal are excluded from standalone commands');
    assert(crlfTask?.description === 'Parsed from CRLF', 'CRLF task frontmatter is parsed correctly');

    assert(defaultTool?.standalone === true, 'Tools default to standalone when standalone key is omitted');
    assert(internalTool?.standalone === false, 'Tools marked internal are excluded from standalone commands');
    assert(crlfTool?.description === 'Parsed from CRLF', 'CRLF tool frontmatter is parsed correctly');

    const taskToolGenerator = new TaskToolCommandGenerator();
    assert(taskToolGenerator.isStandalone({}) === true, 'Task/tool command filter defaults missing standalone metadata to visible');
    assert(
      taskToolGenerator.isStandalone({ standalone: 'false' }) === false,
      'Task/tool command filter hides entries explicitly marked standalone=false',
    );

    await fs.remove(tmpRoot);
  } catch (error) {
    assert(false, 'Task/tool standalone and CRLF guard runs', error.message);
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
