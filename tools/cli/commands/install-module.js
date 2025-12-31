const chalk = require('chalk');
const path = require('node:path');
const fs = require('fs-extra');
const yaml = require('yaml');
const ora = require('ora');

const { Installer } = require('../installers/lib/core/installer');
const { ModuleManager } = require('../installers/lib/modules/manager');
const { Manifest } = require('../installers/lib/core/manifest');
const { ManifestGenerator } = require('../installers/lib/core/manifest-generator');

module.exports = {
  command: 'install-module <path>',
  description: 'Install a custom BMAD module from local path',
  options: [['-f, --force', 'Force reinstall if module already exists']],
  action: async (modulePath, options) => {
    const spinner = ora();

    try {
      // Step 1: Validate module path exists
      const absolutePath = path.resolve(modulePath);
      if (!(await fs.pathExists(absolutePath))) {
        console.error(chalk.red(`Error: Path does not exist: ${absolutePath}`));
        process.exit(1);
      }

      const moduleYamlPath = path.join(absolutePath, 'module.yaml');
      if (!(await fs.pathExists(moduleYamlPath))) {
        console.error(chalk.red(`Error: Invalid module - module.yaml not found at ${absolutePath}`));
        process.exit(1);
      }

      // Read module.yaml to get module code
      const moduleYamlContent = await fs.readFile(moduleYamlPath, 'utf8');
      const moduleConfig = yaml.parse(moduleYamlContent);
      const moduleCode = moduleConfig.code;

      if (!moduleCode) {
        console.error(chalk.red('Error: module.yaml must have a "code" field'));
        process.exit(1);
      }

      console.log(chalk.cyan(`\n📦 Installing module: ${moduleConfig.name || moduleCode}`));
      if (moduleConfig.version) {
        console.log(chalk.dim(`   Version: ${moduleConfig.version}`));
      }

      // Step 2: Find BMAD installation
      const installer = new Installer();
      const { bmadDir } = await installer.findBmadDir(process.cwd());

      // Check if manifest exists (confirms BMAD is actually installed)
      const manifest = new Manifest();
      const manifestData = await manifest.read(bmadDir);

      if (!manifestData) {
        console.error(chalk.red('\nError: No BMAD installation found.'));
        console.log(chalk.yellow('Run `npx bmad-method install` first to set up BMAD.'));
        process.exit(1);
      }

      console.log(chalk.green(`✓ Found BMAD installation at ${bmadDir}`));

      // Step 3: Check if already installed
      if (manifestData.modules && manifestData.modules.includes(moduleCode) && !options.force) {
        console.error(chalk.red(`\nError: Module '${moduleCode}' is already installed.`));
        console.log(chalk.yellow('Use --force to reinstall.'));
        process.exit(1);
      }

      // Step 4: Install module using ModuleManager
      spinner.start('Installing module files...');

      const moduleManager = new ModuleManager();
      moduleManager.setCustomModulePaths(new Map([[moduleCode, absolutePath]]));
      moduleManager.setBmadFolderName(path.basename(bmadDir));

      await moduleManager.install(moduleCode, bmadDir, null, {
        skipModuleInstaller: false,
        moduleConfig: moduleConfig,
      });

      spinner.succeed('Module files installed');

      // Step 5: Regenerate manifests
      spinner.start('Regenerating manifests...');

      const manifestGen = new ManifestGenerator();
      // Get all modules including the new one
      const allModules = [...(manifestData.modules || [])];
      if (!allModules.includes(moduleCode)) {
        allModules.push(moduleCode);
      }

      await manifestGen.generateManifests(bmadDir, allModules, [], {
        ides: manifestData.ides || [],
      });

      spinner.succeed('Manifests regenerated');

      // Step 6: Regenerate IDE commands
      const projectDir = path.dirname(bmadDir);
      const installedIDEs = manifestData.ides || [];

      if (installedIDEs.includes('claude-code')) {
        spinner.start('Generating Claude Code commands...');

        const { WorkflowCommandGenerator } = require('../installers/lib/ide/shared/workflow-command-generator');
        const { AgentCommandGenerator } = require('../installers/lib/ide/shared/agent-command-generator');
        const { TaskToolCommandGenerator } = require('../installers/lib/ide/shared/task-tool-command-generator');

        const bmadFolderName = path.basename(bmadDir);
        const bmadCommandsDir = path.join(projectDir, '.claude', 'commands', 'bmad');

        // Generate agent launchers
        const agentGen = new AgentCommandGenerator(bmadFolderName);
        const { artifacts: agentArtifacts } = await agentGen.collectAgentArtifacts(bmadDir, allModules);

        // Create module directories
        await fs.ensureDir(path.join(bmadCommandsDir, moduleCode, 'agents'));
        await fs.ensureDir(path.join(bmadCommandsDir, moduleCode, 'workflows'));

        // Write agent launchers
        await agentGen.writeAgentLaunchers(bmadCommandsDir, agentArtifacts);

        // Generate workflow commands
        const wfGen = new WorkflowCommandGenerator(bmadFolderName);
        const { artifacts: workflowArtifacts } = await wfGen.collectWorkflowArtifacts(bmadDir);

        // Write workflow commands
        for (const artifact of workflowArtifacts) {
          if (artifact.type === 'workflow-command') {
            const moduleWorkflowsDir = path.join(bmadCommandsDir, artifact.module, 'workflows');
            await fs.ensureDir(moduleWorkflowsDir);
            const commandPath = path.join(moduleWorkflowsDir, path.basename(artifact.relativePath));
            await fs.writeFile(commandPath, artifact.content);
          }
        }

        // Generate task/tool commands
        const taskGen = new TaskToolCommandGenerator();
        await taskGen.generateTaskToolCommands(projectDir, bmadDir);

        spinner.succeed('Claude Code commands generated');
      }

      // Step 7: Update manifest
      await manifest.addModule(bmadDir, moduleCode);

      // Success message
      console.log(chalk.green(`\n✨ Module '${moduleCode}' installed successfully!`));

      // Show available commands
      const commandsDir = path.join(projectDir, '.claude', 'commands', 'bmad', moduleCode);
      if (await fs.pathExists(commandsDir)) {
        console.log(chalk.cyan('\nAvailable commands:'));

        const agentsDir = path.join(commandsDir, 'agents');
        const workflowsDir = path.join(commandsDir, 'workflows');

        if (await fs.pathExists(agentsDir)) {
          const agents = await fs.readdir(agentsDir);
          for (const agent of agents.filter((f) => f.endsWith('.md') && f !== 'README.md')) {
            console.log(chalk.dim(`  /${moduleCode}:${path.basename(agent, '.md')}`));
          }
        }

        if (await fs.pathExists(workflowsDir)) {
          const workflows = await fs.readdir(workflowsDir);
          for (const wf of workflows.filter((f) => f.endsWith('.md') && f !== 'README.md')) {
            console.log(chalk.dim(`  /${moduleCode}:${path.basename(wf, '.md')}`));
          }
        }
      }

      process.exit(0);
    } catch (error) {
      spinner.fail('Installation failed');

      if (error.fullMessage) {
        console.error(error.fullMessage);
      } else {
        console.error(chalk.red('Error:'), error.message);
      }

      if (process.env.BMAD_VERBOSE_INSTALL === 'true') {
        console.error(chalk.dim(error.stack));
      }

      process.exit(1);
    }
  },
};
