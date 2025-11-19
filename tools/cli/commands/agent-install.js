const chalk = require('chalk');
const path = require('node:path');
const fs = require('node:fs');
const readline = require('node:readline');
const {
  findBmadConfig,
  resolvePath,
  discoverAgents,
  loadAgentConfig,
  promptInstallQuestions,
  detectBmadProject,
  addToManifest,
  extractManifestData,
  checkManifestForPath,
  updateManifestEntry,
  saveAgentSource,
  createIdeSlashCommands,
  updateManifestYaml,
} = require('../lib/agent/installer');

module.exports = {
  command: 'agent-install',
  description: 'Install and compile BMAD agents with personalization',
  options: [
    ['-p, --path <path>', 'Path to specific agent YAML file or folder'],
    ['-d, --defaults', 'Use default values without prompting'],
    ['-t, --target <path>', 'Target installation directory (default: .bmad/agents)'],
  ],
  action: async (options) => {
    try {
      console.log(chalk.cyan('\n🔧 BMAD Agent Installer\n'));

      // Find BMAD config
      const config = findBmadConfig();
      if (!config) {
        console.log(chalk.yellow('No BMAD installation found in current directory.'));
        console.log(chalk.dim('Looking for .bmad/bmb/config.yaml...'));
        console.log(chalk.red('\nPlease run this command from a project with BMAD installed.'));
        process.exit(1);
      }

      console.log(chalk.dim(`Found BMAD at: ${config.bmadFolder}`));

      let selectedAgent = null;

      // If path provided, use it directly
      if (options.path) {
        const providedPath = path.resolve(options.path);

        if (!fs.existsSync(providedPath)) {
          console.log(chalk.red(`Path not found: ${providedPath}`));
          process.exit(1);
        }

        const stat = fs.statSync(providedPath);
        if (stat.isFile() && providedPath.endsWith('.agent.yaml')) {
          selectedAgent = {
            type: 'simple',
            name: path.basename(providedPath, '.agent.yaml'),
            path: providedPath,
            yamlFile: providedPath,
          };
        } else if (stat.isDirectory()) {
          const yamlFiles = fs.readdirSync(providedPath).filter((f) => f.endsWith('.agent.yaml'));
          if (yamlFiles.length === 1) {
            selectedAgent = {
              type: 'expert',
              name: path.basename(providedPath),
              path: providedPath,
              yamlFile: path.join(providedPath, yamlFiles[0]),
              hasSidecar: true,
            };
          } else {
            console.log(chalk.red('Directory must contain exactly one .agent.yaml file'));
            process.exit(1);
          }
        } else {
          console.log(chalk.red('Path must be an .agent.yaml file or a folder containing one'));
          process.exit(1);
        }
      } else {
        // Discover agents from custom location
        const customAgentLocation = config.custom_agent_location
          ? resolvePath(config.custom_agent_location, config)
          : path.join(config.bmadFolder, 'custom', 'agents');

        console.log(chalk.dim(`Searching for agents in: ${customAgentLocation}\n`));

        const agents = discoverAgents(customAgentLocation);

        if (agents.length === 0) {
          console.log(chalk.yellow('No agents found in custom agent location.'));
          console.log(chalk.dim(`Expected location: ${customAgentLocation}`));
          console.log(chalk.dim('\nCreate agents using the BMad Builder workflow or place .agent.yaml files there.'));
          process.exit(0);
        }

        // List available agents
        console.log(chalk.cyan('Available Agents:\n'));
        for (const [idx, agent] of agents.entries()) {
          const typeIcon = agent.type === 'expert' ? '📚' : '📄';
          console.log(`  ${idx + 1}. ${typeIcon} ${chalk.bold(agent.name)} ${chalk.dim(`(${agent.type})`)}`);
        }

        // Prompt for selection
        const rl = readline.createInterface({
          input: process.stdin,
          output: process.stdout,
        });

        const selection = await new Promise((resolve) => {
          rl.question('\nSelect agent to install (number): ', resolve);
        });
        rl.close();

        const selectedIdx = parseInt(selection, 10) - 1;
        if (isNaN(selectedIdx) || selectedIdx < 0 || selectedIdx >= agents.length) {
          console.log(chalk.red('Invalid selection'));
          process.exit(1);
        }

        selectedAgent = agents[selectedIdx];
      }

      console.log(chalk.cyan(`\nSelected: ${chalk.bold(selectedAgent.name)}`));

      // Load agent configuration
      const agentConfig = loadAgentConfig(selectedAgent.yamlFile);

      if (agentConfig.metadata.name) {
        console.log(chalk.dim(`Agent Name: ${agentConfig.metadata.name}`));
      }
      if (agentConfig.metadata.title) {
        console.log(chalk.dim(`Title: ${agentConfig.metadata.title}`));
      }

      // Get the agent type (source name)
      const agentType = selectedAgent.name; // e.g., "commit-poet"

      // Confirm/customize agent persona name
      const rl1 = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
      });

      const defaultPersonaName = agentConfig.metadata.name || agentType;
      console.log(chalk.cyan('\n📛 Agent Persona Name\n'));
      console.log(chalk.dim(`   Agent type: ${agentType}`));
      console.log(chalk.dim(`   Default persona: ${defaultPersonaName}`));
      console.log(chalk.dim('   Leave blank to use default, or provide a custom name.'));
      console.log(chalk.dim('   Examples:'));
      console.log(chalk.dim(`     - (blank) → "${defaultPersonaName}" as ${agentType}.md`));
      console.log(chalk.dim(`     - "Fred" → "Fred" as fred-${agentType}.md`));
      console.log(chalk.dim(`     - "Captain Code" → "Captain Code" as captain-code-${agentType}.md`));

      const customPersonaName = await new Promise((resolve) => {
        rl1.question(`\n   Custom name (or Enter for default): `, resolve);
      });
      rl1.close();

      // Determine final agent file name based on persona name
      let finalAgentName;
      let personaName;
      if (customPersonaName.trim()) {
        personaName = customPersonaName.trim();
        const namePrefix = personaName.toLowerCase().replaceAll(/\s+/g, '-');
        finalAgentName = `${namePrefix}-${agentType}`;
      } else {
        personaName = defaultPersonaName;
        finalAgentName = agentType;
      }

      console.log(chalk.dim(`   Persona: ${personaName}`));
      console.log(chalk.dim(`   File: ${finalAgentName}.md`));

      // Get answers (prompt or use defaults)
      let presetAnswers = {};

      // If custom persona name provided, inject it as custom_name for template processing
      if (customPersonaName.trim()) {
        presetAnswers.custom_name = personaName;
      }

      let answers;
      if (agentConfig.installConfig && !options.defaults) {
        answers = await promptInstallQuestions(agentConfig.installConfig, agentConfig.defaults, presetAnswers);
      } else if (agentConfig.installConfig && options.defaults) {
        console.log(chalk.dim('\nUsing default configuration values.'));
        answers = { ...agentConfig.defaults, ...presetAnswers };
      } else {
        answers = { ...agentConfig.defaults, ...presetAnswers };
      }

      // Determine target directory
      let targetDir = options.target ? path.resolve(options.target) : null;

      // If no target specified, prompt for it
      if (targetDir) {
        // If target provided via --target, check if it's a project root and adjust
        const otherProject = detectBmadProject(targetDir);
        if (otherProject && !targetDir.includes('agents')) {
          // User specified project root, redirect to custom agents folder
          targetDir = path.join(otherProject.bmadFolder, 'custom', 'agents');
          console.log(chalk.dim(`   Auto-selecting custom agents folder: ${targetDir}`));
        }
      } else {
        const rl = readline.createInterface({
          input: process.stdin,
          output: process.stdout,
        });

        console.log(chalk.cyan('\n📂 Installation Target\n'));

        // Option 1: Current project's custom agents folder
        const currentCustom = path.join(config.bmadFolder, 'custom', 'agents');
        console.log(`   1. Current project: ${chalk.dim(currentCustom)}`);

        // Option 2: Specify another project path
        console.log(`   2. Another project (enter path)`);

        const choice = await new Promise((resolve) => {
          rl.question('\n   Select option (1 or path): ', resolve);
        });

        if (choice.trim() === '1' || choice.trim() === '') {
          targetDir = currentCustom;
        } else if (choice.trim() === '2') {
          const projectPath = await new Promise((resolve) => {
            rl.question('   Project path: ', resolve);
          });

          // Detect if it's a BMAD project and use its custom folder
          const otherProject = detectBmadProject(path.resolve(projectPath));
          if (otherProject) {
            targetDir = path.join(otherProject.bmadFolder, 'custom', 'agents');
            console.log(chalk.dim(`   Found BMAD project, using: ${targetDir}`));
          } else {
            targetDir = path.resolve(projectPath);
          }
        } else {
          // User entered a path directly
          const otherProject = detectBmadProject(path.resolve(choice));
          if (otherProject) {
            targetDir = path.join(otherProject.bmadFolder, 'custom', 'agents');
            console.log(chalk.dim(`   Found BMAD project, using: ${targetDir}`));
          } else {
            targetDir = path.resolve(choice);
          }
        }

        rl.close();
      }

      if (!fs.existsSync(targetDir)) {
        fs.mkdirSync(targetDir, { recursive: true });
      }

      console.log(chalk.dim(`\nInstalling to: ${targetDir}`));

      // Detect if target is within a BMAD project
      const targetProject = detectBmadProject(targetDir);
      if (targetProject) {
        console.log(chalk.cyan(`   Detected BMAD project at: ${targetProject.projectRoot}`));
      }

      // Check for duplicate in manifest by path (not by type)
      let shouldUpdateExisting = false;
      let existingEntry = null;

      if (targetProject) {
        // Check if this exact installed name already exists
        const expectedPath = `.bmad/custom/agents/${finalAgentName}/${finalAgentName}.md`;
        existingEntry = checkManifestForPath(targetProject.manifestFile, expectedPath);

        if (existingEntry) {
          const rl2 = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
          });

          console.log(chalk.yellow(`\n⚠️  Agent "${finalAgentName}" already installed`));
          console.log(chalk.dim(`   Type: ${agentType}`));
          console.log(chalk.dim(`   Path: ${existingEntry.path}`));

          const overwrite = await new Promise((resolve) => {
            rl2.question('   Overwrite existing installation? [Y/n]: ', resolve);
          });
          rl2.close();

          if (overwrite.toLowerCase() === 'n') {
            console.log(chalk.yellow('Installation cancelled.'));
            process.exit(0);
          }

          shouldUpdateExisting = true;
        }
      }

      // Install the agent with custom name
      // Override the folder name with finalAgentName
      const agentTargetDir = path.join(targetDir, finalAgentName);

      if (!fs.existsSync(agentTargetDir)) {
        fs.mkdirSync(agentTargetDir, { recursive: true });
      }

      // Compile and install
      const { compileAgent } = require('../lib/agent/compiler');

      // Calculate target path for agent ID
      const projectRoot = targetProject ? targetProject.projectRoot : config.projectRoot;
      const compiledFileName = `${finalAgentName}.md`;
      const compiledPath = path.join(agentTargetDir, compiledFileName);
      const relativePath = path.relative(projectRoot, compiledPath);

      // Compile with proper name and path
      const { xml, metadata, processedYaml } = compileAgent(
        fs.readFileSync(selectedAgent.yamlFile, 'utf8'),
        answers,
        finalAgentName,
        relativePath,
      );

      // Write compiled XML (.md) with custom name
      fs.writeFileSync(compiledPath, xml, 'utf8');

      const result = {
        success: true,
        agentName: finalAgentName,
        targetDir: agentTargetDir,
        compiledFile: compiledPath,
        sidecarCopied: false,
      };

      // Copy sidecar files for expert agents
      if (selectedAgent.hasSidecar && selectedAgent.type === 'expert') {
        const { copySidecarFiles } = require('../lib/agent/installer');
        const sidecarFiles = copySidecarFiles(selectedAgent.path, agentTargetDir, selectedAgent.yamlFile);
        result.sidecarCopied = true;
        result.sidecarFiles = sidecarFiles;
      }

      console.log(chalk.green('\n✨ Agent installed successfully!'));
      console.log(chalk.cyan(`   Name: ${result.agentName}`));
      console.log(chalk.cyan(`   Location: ${result.targetDir}`));
      console.log(chalk.cyan(`   Compiled: ${path.basename(result.compiledFile)}`));

      if (result.sidecarCopied) {
        console.log(chalk.cyan(`   Sidecar files: ${result.sidecarFiles.length} files copied`));
      }

      // Save source YAML to _cfg/custom/agents/ and register in manifest
      if (targetProject) {
        // Save source for reinstallation with embedded answers
        console.log(chalk.dim(`\nSaving source to: ${targetProject.cfgFolder}/custom/agents/`));
        saveAgentSource(selectedAgent, targetProject.cfgFolder, finalAgentName, answers);
        console.log(chalk.green(`   ✓ Source saved for reinstallation`));

        // Register/update in manifest
        console.log(chalk.dim(`Registering in manifest: ${targetProject.manifestFile}`));

        const manifestData = extractManifestData(xml, { ...metadata, name: finalAgentName }, relativePath, 'custom');
        // Use finalAgentName as the manifest name field (unique identifier)
        manifestData.name = finalAgentName;
        // Use compiled metadata.name (persona name after template processing), not source agentConfig
        manifestData.displayName = metadata.name || agentType;
        // Store the actual installed path/name
        manifestData.path = relativePath;

        if (shouldUpdateExisting && existingEntry) {
          updateManifestEntry(targetProject.manifestFile, manifestData, existingEntry._lineNumber);
          console.log(chalk.green(`   ✓ Updated existing entry in agent-manifest.csv`));
        } else {
          addToManifest(targetProject.manifestFile, manifestData);
          console.log(chalk.green(`   ✓ Added to agent-manifest.csv`));
        }

        // Create IDE slash commands
        const ideResults = await createIdeSlashCommands(targetProject.projectRoot, finalAgentName, relativePath, metadata);
        if (Object.keys(ideResults).length > 0) {
          console.log(chalk.green(`   ✓ Created IDE commands:`));
          for (const [ideName, result] of Object.entries(ideResults)) {
            console.log(chalk.dim(`      ${ideName}: ${result.command}`));
          }
        }

        // Update manifest.yaml with custom_agents tracking
        const manifestYamlPath = path.join(targetProject.cfgFolder, 'manifest.yaml');
        if (updateManifestYaml(manifestYamlPath, finalAgentName, agentType)) {
          console.log(chalk.green(`   ✓ Updated manifest.yaml custom_agents`));
        }
      }

      console.log(chalk.dim(`\nAgent ID: ${relativePath}`));

      if (targetProject) {
        console.log(chalk.yellow('\nAgent is now registered and available in the target project!'));
      } else {
        console.log(chalk.yellow('\nTo use this agent, reference it in your manifest or load it directly.'));
      }

      process.exit(0);
    } catch (error) {
      console.error(chalk.red('Agent installation failed:'), error.message);
      console.error(chalk.dim(error.stack));
      process.exit(1);
    }
  },
};
