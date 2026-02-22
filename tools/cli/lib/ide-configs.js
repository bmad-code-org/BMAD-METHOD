/**
 * IDE Configuration - Maps IDEs to their config file paths.
 * For each IDE, we write a WDS agent activation instructions file.
 */

const path = require('node:path');
const fs = require('fs-extra');

// IDE definitions: where each IDE expects its instructions/rules file
const IDE_MAP = {
  'claude-code': { dir: '.claude', file: 'instructions.md', label: 'Claude Code', append: true },
  cursor: { dir: '.cursor/rules', file: 'wds.mdc', label: 'Cursor' },
  windsurf: { dir: '.windsurf', file: 'rules/wds.md', label: 'Windsurf' },
  cline: { dir: '.clinerules', file: 'wds.md', label: 'Cline' },
  'github-copilot': { dir: '.github', file: 'copilot-instructions.md', label: 'GitHub Copilot', append: true },
  roo: { dir: '.roo', file: 'commands/wds.md', label: 'Roo Code' },
  codex: { dir: '.codex', file: 'prompts/wds.md', label: 'Codex' },
  gemini: { dir: '.gemini', file: 'commands/wds.md', label: 'Gemini' },
  qwen: { dir: '.qwen', file: 'commands/wds.md', label: 'Qwen' },
  trae: { dir: '.trae', file: 'rules/wds.md', label: 'Trae' },
  'kiro-cli': { dir: '.kiro', file: 'wds-instructions.md', label: 'Kiro CLI' },
  'rovo-dev': { dir: '.rovodev', file: 'subagents/wds.md', label: 'Rovo Dev' },
  crush: { dir: '.crush', file: 'commands/wds.md', label: 'Crush' },
  auggie: { dir: '.augment', file: 'commands/wds.md', label: 'Auggie' },
  antigravity: { dir: '.agent', file: 'workflows/wds.md', label: 'Antigravity' },
  iflow: { dir: '.iflow', file: 'commands/wds.md', label: 'iFlow' },
  opencode: { dir: '.opencode', file: 'agent/wds.md', label: 'OpenCode' },
};

/**
 * Get list of IDE choices for the prompt
 */
function getIdeChoices() {
  return Object.entries(IDE_MAP).map(([value, config]) => ({
    name: config.label,
    value,
  }));
}

/**
 * Generate the WDS instructions content
 */
function generateInstructions(wdsFolder) {
  return `
# Whiteport Design Studio (WDS) Agents

This project uses the Whiteport Design Studio methodology with AI agents.
WDS files are installed in the \`${wdsFolder}/\` directory.

## Available Agents

To activate a WDS agent, load and follow the instructions in the agent file:

- **Mimir** (Orchestrator & Guide): Read \`${wdsFolder}/agents/mimir-orchestrator.md\` - Start here if you're new to WDS
- **Saga** (Analyst): Read \`${wdsFolder}/agents/saga-analyst.md\` - Product Brief & Trigger Mapping (Phases 1-2)
- **Idunn** (Product Manager): Read \`${wdsFolder}/agents/idunn-pm.md\` - Platform Requirements & Design Deliveries (Phases 3, 6)
- **Freya** (UX Designer): Read \`${wdsFolder}/agents/freya-ux.md\` - UX Design, Design System & Testing (Phases 4-5, 7-8)

## How to Activate

Tell the AI: "Read and activate the agent in \`${wdsFolder}/agents/[agent-name].md\`"

The agent will load its persona, read the project config, greet you, and show its menu.

## Project Configuration

Project settings are stored in \`${wdsFolder}/config.yaml\`. Agents load this automatically on activation.
`.trim();
}

/**
 * Write IDE config file for the selected IDE
 */
async function writeIdeConfig(projectDir, ide, wdsFolder) {
  const config = IDE_MAP[ide];
  if (!config) {
    throw new Error(`Unknown IDE: ${ide}`);
  }

  const content = generateInstructions(wdsFolder);
  const filePath = path.join(projectDir, config.dir, config.file);

  // Ensure parent directory exists
  await fs.ensureDir(path.dirname(filePath));

  // If append mode and file exists, append with separator
  if (config.append && (await fs.pathExists(filePath))) {
    const existing = await fs.readFile(filePath, 'utf8');
    if (!existing.includes('Whiteport Design Studio')) {
      await fs.writeFile(filePath, existing + '\n\n' + content + '\n', 'utf8');
    }
  } else {
    await fs.writeFile(filePath, content + '\n', 'utf8');
  }

  return { filePath, label: config.label };
}

module.exports = {
  IDE_MAP,
  getIdeChoices,
  generateInstructions,
  writeIdeConfig,
};
