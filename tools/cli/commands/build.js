const chalk = require('chalk');
const path = require('node:path');
const fs = require('fs-extra');
const { YamlXmlBuilder } = require('../lib/agent/yaml-xml-builder');
const { getProjectRoot } = require('../lib/project-root');

const builder = new YamlXmlBuilder();

/**
 * Find .claude directory by searching up from current directory
 */
async function findClaudeDir(startDir) {
  let currentDir = startDir;
  const root = path.parse(currentDir).root;

  while (currentDir !== root) {
    const claudeDir = path.join(currentDir, '.claude');
    if (await fs.pathExists(claudeDir)) {
      return claudeDir;
    }
    currentDir = path.dirname(currentDir);
  }

  return null;
}

module.exports = {
  command: 'build [agent]',
  description: 'Build agent XML files from YAML sources',
  options: [
    ['-a, --all', 'Build all agents'],
    ['-d, --directory <path>', 'Project directory', '.'],
  ],
  action: async (agentName, options) => {
    try {
      let projectDir = path.resolve(options.directory);

      // Auto-detect .claude directory (search up from current dir)
      const claudeDir = await findClaudeDir(projectDir);
      if (!claudeDir) {
        console.log(chalk.yellow('\n⚠️  No .claude directory found'));
        console.log(chalk.dim('Run this command from your project directory or'));
        console.log(chalk.dim('use --directory flag to specify location'));
        console.log(chalk.dim('\nExample: npx bmad-method build pm --directory /path/to/project'));
        process.exit(1);
      }

      // Use the directory containing .claude
      projectDir = path.dirname(claudeDir);
      console.log(chalk.dim(`Using project: ${projectDir}\n`));

      console.log(chalk.cyan('🔨 Building Agent Files\n'));

      if (options.all) {
        // Build all agents
        await buildAllAgents(projectDir);
      } else if (agentName) {
        // Build specific agent
        await buildAgent(projectDir, agentName);
      } else {
        // No agent specified, list available agents
        console.log(chalk.yellow('No agent specified. Use --all to build all agents or specify an agent name.'));
        console.log(chalk.dim('\nAvailable agents:'));
        await listAvailableAgents(projectDir);
      }

      process.exit(0);
    } catch (error) {
      console.error(chalk.red('\nError:'), error.message);
      if (process.env.DEBUG) {
        console.error(error.stack);
      }
      process.exit(1);
    }
  },
};

/**
 * Build a specific agent
 */
async function buildAgent(projectDir, agentName) {
  // First check standalone agents in bmad/agents/{agentname}/
  const standaloneAgentDir = path.join(projectDir, '_bmad', 'agents', agentName);
  let standaloneYamlPath = path.join(standaloneAgentDir, `${agentName}.agent.yaml`);

  // If exact match doesn't exist, look for any .agent.yaml file in the directory
  if (!(await fs.pathExists(standaloneYamlPath)) && (await fs.pathExists(standaloneAgentDir))) {
    const files = await fs.readdir(standaloneAgentDir);
    const agentFile = files.find((f) => f.endsWith('.agent.yaml'));
    if (agentFile) {
      standaloneYamlPath = path.join(standaloneAgentDir, agentFile);
    }
  }

  if (await fs.pathExists(standaloneYamlPath)) {
    const yamlFileName = path.basename(standaloneYamlPath, '.agent.yaml');
    const outputPath = path.join(standaloneAgentDir, `${yamlFileName}.md`);

    // Build the standalone agent
    console.log(chalk.cyan(`  Building standalone agent ${agentName}...`));

    const customizePath = path.join(projectDir, '_bmad', '_config', 'agents', `${agentName}.customize.yaml`);
    const customizeExists = await fs.pathExists(customizePath);

    await builder.buildAgent(standaloneYamlPath, customizeExists ? customizePath : null, outputPath, { includeMetadata: true });

    console.log(chalk.green(`  ✓ ${agentName} built successfully (standalone)`));
    return;
  }

  // Find the agent YAML file in .claude/commands/bmad/
  const bmadCommandsDir = path.join(projectDir, '.claude', 'commands', '_bmad');

  // Search all module directories for the agent
  const modules = await fs.readdir(bmadCommandsDir);
  let found = false;

  for (const module of modules) {
    const agentYamlPath = path.join(bmadCommandsDir, module, 'agents', `${agentName}.agent.yaml`);
    const outputPath = path.join(bmadCommandsDir, module, 'agents', `${agentName}.md`);

    if (await fs.pathExists(agentYamlPath)) {
      found = true;

      // Build the agent
      console.log(chalk.cyan(`  Building ${agentName}...`));

      const customizePath = path.join(projectDir, '.claude', '_config', 'agents', `${agentName}.customize.yaml`);
      const customizeExists = await fs.pathExists(customizePath);

      await builder.buildAgent(agentYamlPath, customizeExists ? customizePath : null, outputPath, { includeMetadata: true });

      console.log(chalk.green(`  ✓ ${agentName} built successfully`));
      return;
    }
  }

  if (!found) {
    console.log(chalk.yellow(`  ⚠️  Agent '${agentName}' not found`));
    console.log(chalk.dim('     Available agents:'));
    await listAvailableAgents(projectDir);
  }
}

/**
 * Build all agents
 */
async function buildAllAgents(projectDir) {
  let builtCount = 0;

  // First, build standalone agents in bmad/agents/
  const standaloneAgentsDir = path.join(projectDir, '_bmad', 'agents');
  if (await fs.pathExists(standaloneAgentsDir)) {
    console.log(chalk.cyan('\nBuilding standalone agents...'));
    const agentDirs = await fs.readdir(standaloneAgentsDir);

    for (const agentDirName of agentDirs) {
      const agentDir = path.join(standaloneAgentsDir, agentDirName);

      // Skip if not a directory
      const stat = await fs.stat(agentDir);
      if (!stat.isDirectory()) {
        continue;
      }

      // Find any .agent.yaml file in the directory
      const files = await fs.readdir(agentDir);
      const agentFile = files.find((f) => f.endsWith('.agent.yaml'));

      if (!agentFile) {
        continue;
      }

      const agentYamlPath = path.join(agentDir, agentFile);
      const agentName = path.basename(agentFile, '.agent.yaml');
      const outputPath = path.join(agentDir, `${agentName}.md`);

      console.log(chalk.cyan(`  Building standalone agent ${agentName}...`));

      const customizePath = path.join(projectDir, '_bmad', '_config', 'agents', `${agentName}.customize.yaml`);
      const customizeExists = await fs.pathExists(customizePath);

      await builder.buildAgent(agentYamlPath, customizeExists ? customizePath : null, outputPath, { includeMetadata: true });

      console.log(chalk.green(`  ✓ ${agentName} (standalone)`));
      builtCount++;
    }
  }

  // Then, build module agents in .claude/commands/bmad/
  const bmadCommandsDir = path.join(projectDir, '.claude', 'commands', 'bmad');
  if (await fs.pathExists(bmadCommandsDir)) {
    console.log(chalk.cyan('\nBuilding module agents...'));
    const modules = await fs.readdir(bmadCommandsDir);

    for (const module of modules) {
      const agentsDir = path.join(bmadCommandsDir, module, 'agents');

      if (!(await fs.pathExists(agentsDir))) {
        continue;
      }

      const files = await fs.readdir(agentsDir);

      for (const file of files) {
        if (!file.endsWith('.agent.yaml')) {
          continue;
        }

        const agentName = file.replace('.agent.yaml', '');
        const agentYamlPath = path.join(agentsDir, file);
        const outputPath = path.join(agentsDir, `${agentName}.md`);

        console.log(chalk.cyan(`  Building ${agentName}...`));

        const customizePath = path.join(projectDir, '.claude', '_config', 'agents', `${agentName}.customize.yaml`);
        const customizeExists = await fs.pathExists(customizePath);

        await builder.buildAgent(agentYamlPath, customizeExists ? customizePath : null, outputPath, { includeMetadata: true });

        console.log(chalk.green(`  ✓ ${agentName} (${module})`));
        builtCount++;
      }
    }
  }

  console.log(chalk.green(`\n✓ Built ${builtCount} agent(s)`));
}

/**
 * List available agents
 */
async function listAvailableAgents(projectDir) {
  // List standalone agents first
  const standaloneAgentsDir = path.join(projectDir, 'bmad', 'agents');
  if (await fs.pathExists(standaloneAgentsDir)) {
    console.log(chalk.dim('     Standalone agents:'));
    const agentDirs = await fs.readdir(standaloneAgentsDir);

    for (const agentDirName of agentDirs) {
      const agentDir = path.join(standaloneAgentsDir, agentDirName);

      // Skip if not a directory
      const stat = await fs.stat(agentDir);
      if (!stat.isDirectory()) {
        continue;
      }

      // Find any .agent.yaml file in the directory
      const files = await fs.readdir(agentDir);
      const agentFile = files.find((f) => f.endsWith('.agent.yaml'));

      if (agentFile) {
        const agentName = path.basename(agentFile, '.agent.yaml');
        console.log(chalk.dim(`       - ${agentName} (in ${agentDirName}/)`));
      }
    }
  }

  // List module agents
  const bmadCommandsDir = path.join(projectDir, '.claude', 'commands', 'bmad');
  if (await fs.pathExists(bmadCommandsDir)) {
    console.log(chalk.dim('     Module agents:'));
    const modules = await fs.readdir(bmadCommandsDir);

    for (const module of modules) {
      const agentsDir = path.join(bmadCommandsDir, module, 'agents');

      if (!(await fs.pathExists(agentsDir))) {
        continue;
      }

      const files = await fs.readdir(agentsDir);

      for (const file of files) {
        if (file.endsWith('.agent.yaml')) {
          const agentName = file.replace('.agent.yaml', '');
          console.log(chalk.dim(`       - ${agentName} (${module})`));
        }
      }
    }
  }
}
