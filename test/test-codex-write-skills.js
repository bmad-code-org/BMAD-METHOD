/**
 * Tests for CodexSetup.writeSkillArtifacts
 *
 * Validates directory creation, SKILL.md file writing, type filtering,
 * and integration with transformToSkillFormat.
 *
 * Usage: node test/test-codex-write-skills.js
 */

const path = require('node:path');
const fs = require('fs-extra');
const os = require('node:os');
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

// Import the class under test
const { CodexSetup } = require(path.join(__dirname, '..', 'tools', 'cli', 'installers', 'lib', 'ide', 'codex.js'));

const setup = new CodexSetup();

// Create a temp directory for each test run
let tmpDir;

async function createTmpDir() {
  tmpDir = path.join(os.tmpdir(), `bmad-test-skills-${Date.now()}`);
  await fs.ensureDir(tmpDir);
  return tmpDir;
}

async function cleanTmpDir() {
  if (tmpDir) {
    await fs.remove(tmpDir);
  }
}

async function runTests() {
  console.log(`\n${colors.cyan}CodexSetup.writeSkillArtifacts tests${colors.reset}\n`);

  // --- Writes a single artifact as a skill directory with SKILL.md ---
  {
    const destDir = await createTmpDir();
    const artifacts = [
      {
        type: 'task',
        relativePath: 'bmm/tasks/create-story.md',
        content: '---\ndescription: Create a user story\n---\n\nStory creation instructions.',
      },
    ];
    const count = await setup.writeSkillArtifacts(destDir, artifacts, 'task');
    assert(count === 1, 'single artifact returns count 1');

    const skillDir = path.join(destDir, 'bmad-bmm-create-story');
    assert(await fs.pathExists(skillDir), 'skill directory created');

    const skillFile = path.join(skillDir, 'SKILL.md');
    assert(await fs.pathExists(skillFile), 'SKILL.md file created');

    const content = await fs.readFile(skillFile, 'utf8');
    const fmMatch = content.match(/^---\n([\s\S]*?)\n---/);
    assert(fmMatch !== null, 'SKILL.md has frontmatter');

    const parsed = yaml.parse(fmMatch[1]);
    assert(parsed.name === 'bmad-bmm-create-story', 'name matches skill directory name', `got: ${parsed.name}`);
    assert(parsed.description === 'Create a user story', 'description preserved', `got: ${parsed.description}`);
    assert(content.includes('Story creation instructions.'), 'body content preserved');
    await cleanTmpDir();
  }

  // --- Filters artifacts by type ---
  {
    const destDir = await createTmpDir();
    const artifacts = [
      {
        type: 'task',
        relativePath: 'bmm/tasks/create-story.md',
        content: '---\ndescription: A task\n---\n\nTask body.',
      },
      {
        type: 'workflow-command',
        relativePath: 'bmm/workflows/plan-project.md',
        content: '---\ndescription: A workflow\n---\n\nWorkflow body.',
      },
      {
        type: 'agent-launcher',
        relativePath: 'bmm/agents/pm.md',
        content: '---\ndescription: An agent\n---\n\nAgent body.',
      },
    ];
    const count = await setup.writeSkillArtifacts(destDir, artifacts, 'task');
    assert(count === 1, 'only matching type is written when filtering for task');

    const entries = await fs.readdir(destDir);
    assert(entries.length === 1, 'only one skill directory created', `got ${entries.length}: ${entries.join(', ')}`);
    assert(entries[0] === 'bmad-bmm-create-story', 'correct artifact was written', `got: ${entries[0]}`);
    await cleanTmpDir();
  }

  // --- Writes multiple artifacts of the same type ---
  {
    const destDir = await createTmpDir();
    const artifacts = [
      {
        type: 'workflow-command',
        relativePath: 'bmm/workflows/plan-project.md',
        content: '---\ndescription: Plan\n---\n\nPlan body.',
      },
      {
        type: 'workflow-command',
        relativePath: 'core/workflows/review.md',
        content: '---\ndescription: Review\n---\n\nReview body.',
      },
    ];
    const count = await setup.writeSkillArtifacts(destDir, artifacts, 'workflow-command');
    assert(count === 2, 'two artifacts written');

    const entries = new Set((await fs.readdir(destDir)).sort());
    assert(entries.has('bmad-bmm-plan-project'), 'first skill directory exists');
    assert(entries.has('bmad-review'), 'second skill directory exists (core module)');
    await cleanTmpDir();
  }

  // --- Returns 0 when no artifacts match type ---
  {
    const destDir = await createTmpDir();
    const artifacts = [
      {
        type: 'agent-launcher',
        relativePath: 'bmm/agents/pm.md',
        content: '---\ndescription: An agent\n---\n\nBody.',
      },
    ];
    const count = await setup.writeSkillArtifacts(destDir, artifacts, 'task');
    assert(count === 0, 'returns 0 when no types match');

    const entries = await fs.readdir(destDir);
    assert(entries.length === 0, 'no directories created when no types match');
    await cleanTmpDir();
  }

  // --- Handles empty artifacts array ---
  {
    const destDir = await createTmpDir();
    const count = await setup.writeSkillArtifacts(destDir, [], 'task');
    assert(count === 0, 'returns 0 for empty artifacts array');
    await cleanTmpDir();
  }

  // --- Artifacts without type field are always written ---
  {
    const destDir = await createTmpDir();
    const artifacts = [
      {
        relativePath: 'bmm/tasks/no-type.md',
        content: '---\ndescription: No type field\n---\n\nBody.',
      },
    ];
    const count = await setup.writeSkillArtifacts(destDir, artifacts, 'task');
    assert(count === 1, 'artifact without type field is written (no filtering)');
    await cleanTmpDir();
  }

  // --- Content without frontmatter gets minimal frontmatter added ---
  {
    const destDir = await createTmpDir();
    const artifacts = [
      {
        type: 'task',
        relativePath: 'bmm/tasks/bare.md',
        content: 'Just plain content, no frontmatter.',
      },
    ];
    const count = await setup.writeSkillArtifacts(destDir, artifacts, 'task');
    assert(count === 1, 'bare content artifact written');

    const skillFile = path.join(destDir, 'bmad-bmm-bare', 'SKILL.md');
    const content = await fs.readFile(skillFile, 'utf8');
    const fmMatch = content.match(/^---\n([\s\S]*?)\n---/);
    assert(fmMatch !== null, 'frontmatter added to bare content');

    const parsed = yaml.parse(fmMatch[1]);
    assert(parsed.name === 'bmad-bmm-bare', 'name set for bare content', `got: ${parsed.name}`);
    assert(content.includes('Just plain content, no frontmatter.'), 'original content preserved');
    await cleanTmpDir();
  }

  // --- Summary ---
  console.log(`\n${passed} passed, ${failed} failed\n`);
  process.exit(failed > 0 ? 1 : 0);
}

runTests().catch((error) => {
  console.error('Test runner error:', error);
  process.exit(1);
});
