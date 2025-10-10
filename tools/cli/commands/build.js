const chalk = require('chalk');
const path = require('node:path');
const fs = require('fs-extra');
const { YamlXmlBuilder } = require('../lib/yaml-xml-builder');
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
    ['-a, --all', 'Rebuild all agents'],
    ['-d, --directory <path>', 'Project directory', '.'],
    ['--force', 'Force rebuild even if up to date'],
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
        await buildAllAgents(projectDir, options.force);
      } else if (agentName) {
        // Build specific agent
        await buildAgent(projectDir, agentName, options.force);
      } else {
        // No agent specified, check what needs rebuilding
        await checkBuildStatus(projectDir);
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
async function buildAgent(projectDir, agentName, force = false) {
  // First check standalone agents in bmad/agents/{agentname}/
  const standaloneAgentDir = path.join(projectDir, 'bmad', 'agents', agentName);
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

    // Check if rebuild needed
    if (!force && (await fs.pathExists(outputPath))) {
      const needsRebuild = await checkIfNeedsRebuild(standaloneYamlPath, outputPath, projectDir, agentName);
      if (!needsRebuild) {
        console.log(chalk.dim(`  ${agentName}: already up to date`));
        return;
      }
    }

    // Build the standalone agent
    console.log(chalk.cyan(`  Building standalone agent ${agentName}...`));

    const customizePath = path.join(projectDir, 'bmad', '_cfg', 'agents', `${agentName}.customize.yaml`);
    const customizeExists = await fs.pathExists(customizePath);

    await builder.buildAgent(standaloneYamlPath, customizeExists ? customizePath : null, outputPath, { includeMetadata: true });

    console.log(chalk.green(`  ✓ ${agentName} built successfully (standalone)`));
    return;
  }

  // Find the agent YAML file in .claude/commands/bmad/
  const bmadCommandsDir = path.join(projectDir, '.claude', 'commands', 'bmad');

  // Search all module directories for the agent
  const modules = await fs.readdir(bmadCommandsDir);
  let found = false;

  for (const module of modules) {
    const agentYamlPath = path.join(bmadCommandsDir, module, 'agents', `${agentName}.agent.yaml`);
    const outputPath = path.join(bmadCommandsDir, module, 'agents', `${agentName}.md`);

    if (await fs.pathExists(agentYamlPath)) {
      found = true;

      // Check if rebuild needed
      if (!force && (await fs.pathExists(outputPath))) {
        const needsRebuild = await checkIfNeedsRebuild(agentYamlPath, outputPath, projectDir, agentName);
        if (!needsRebuild) {
          console.log(chalk.dim(`  ${agentName}: already up to date`));
          return;
        }
      }

      // Build the agent
      console.log(chalk.cyan(`  Building ${agentName}...`));

      const customizePath = path.join(projectDir, '.claude', '_cfg', 'agents', `${agentName}.customize.yaml`);
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
async function buildAllAgents(projectDir, force = false) {
  let builtCount = 0;
  let skippedCount = 0;

  // First, build standalone agents in bmad/agents/
  const standaloneAgentsDir = path.join(projectDir, 'bmad', 'agents');
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

      // Check if rebuild needed
      if (!force && (await fs.pathExists(outputPath))) {
        const needsRebuild = await checkIfNeedsRebuild(agentYamlPath, outputPath, projectDir, agentName);
        if (!needsRebuild) {
          console.log(chalk.dim(`  ${agentName}: up to date`));
          skippedCount++;
          continue;
        }
      }

      console.log(chalk.cyan(`  Building standalone agent ${agentName}...`));

      const customizePath = path.join(projectDir, 'bmad', '_cfg', 'agents', `${agentName}.customize.yaml`);
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

        // Check if rebuild needed
        if (!force && (await fs.pathExists(outputPath))) {
          const needsRebuild = await checkIfNeedsRebuild(agentYamlPath, outputPath, projectDir, agentName);
          if (!needsRebuild) {
            console.log(chalk.dim(`  ${agentName}: up to date`));
            skippedCount++;
            continue;
          }
        }

        console.log(chalk.cyan(`  Building ${agentName}...`));

        const customizePath = path.join(projectDir, '.claude', '_cfg', 'agents', `${agentName}.customize.yaml`);
        const customizeExists = await fs.pathExists(customizePath);

        await builder.buildAgent(agentYamlPath, customizeExists ? customizePath : null, outputPath, { includeMetadata: true });

        console.log(chalk.green(`  ✓ ${agentName} (${module})`));
        builtCount++;
      }
    }
  }

  console.log(chalk.green(`\n✓ Built ${builtCount} agent(s)`));
  if (skippedCount > 0) {
    console.log(chalk.dim(`  Skipped ${skippedCount} (already up to date)`));
  }
}

/**
 * Check what needs rebuilding
 */
async function checkBuildStatus(projectDir) {
  const needsRebuild = [];
  const upToDate = [];

  // Check standalone agents in bmad/agents/
  const standaloneAgentsDir = path.join(projectDir, 'bmad', 'agents');
  if (await fs.pathExists(standaloneAgentsDir)) {
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

      if (!(await fs.pathExists(outputPath))) {
        needsRebuild.push(`${agentName} (standalone)`);
      } else if (await checkIfNeedsRebuild(agentYamlPath, outputPath, projectDir, agentName)) {
        needsRebuild.push(`${agentName} (standalone)`);
      } else {
        upToDate.push(`${agentName} (standalone)`);
      }
    }
  }

  // Check module agents in .claude/commands/bmad/
  const bmadCommandsDir = path.join(projectDir, '.claude', 'commands', 'bmad');
  if (await fs.pathExists(bmadCommandsDir)) {
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

        if (!(await fs.pathExists(outputPath))) {
          needsRebuild.push(`${agentName} (${module})`);
        } else if (await checkIfNeedsRebuild(agentYamlPath, outputPath, projectDir, agentName)) {
          needsRebuild.push(`${agentName} (${module})`);
        } else {
          upToDate.push(`${agentName} (${module})`);
        }
      }
    }
  }

  if (needsRebuild.length === 0) {
    console.log(chalk.green('✓ All agents are up to date'));
  } else {
    console.log(chalk.yellow(`${needsRebuild.length} agent(s) need rebuilding:`));
    for (const agent of needsRebuild) {
      console.log(chalk.dim(`  - ${agent}`));
    }
    console.log(chalk.dim('\nRun "bmad build --all" to rebuild all agents'));
  }

  if (upToDate.length > 0) {
    console.log(chalk.dim(`\n${upToDate.length} agent(s) up to date`));
  }
}

/**
 * Check if an agent needs rebuilding by comparing hashes
 */
async function checkIfNeedsRebuild(yamlPath, outputPath, projectDir, agentName) {
  // Read the output file to check its metadata
  const outputContent = await fs.readFile(outputPath, 'utf8');

  // Extract hash from BUILD-META comment
  const metaMatch = outputContent.match(/source:.*\(hash: ([a-f0-9]+)\)/);
  if (!metaMatch) {
    // No metadata, needs rebuild
    return true;
  }

  const storedHash = metaMatch[1];

  // Calculate current hash
  const currentHash = await builder.calculateFileHash(yamlPath);

  if (storedHash !== currentHash) {
    return true;
  }

  // Check customize file if it exists
  const customizePath = path.join(projectDir, '.claude', '_cfg', 'agents', `${agentName}.customize.yaml`);
  if (await fs.pathExists(customizePath)) {
    const customizeMetaMatch = outputContent.match(/customize:.*\(hash: ([a-f0-9]+)\)/);
    if (!customizeMetaMatch) {
      return true;
    }

    const storedCustomizeHash = customizeMetaMatch[1];
    const currentCustomizeHash = await builder.calculateFileHash(customizePath);

    if (storedCustomizeHash !== currentCustomizeHash) {
      return true;
    }
  }

  return false;
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
