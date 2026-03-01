/**
 * WDS Installer - Core orchestrator
 * Copies WDS source files, compiles agents, creates folder structure, sets up IDE.
 */

const path = require('node:path');
const fs = require('fs-extra');
const chalk = require('chalk');
const ora = require('ora');
const yaml = require('js-yaml');
const inquirer = require('inquirer').default || require('inquirer');
const { compileAgentFile } = require('./compiler');

class Installer {
  constructor() {
    // Resolve directories relative to this file (tools/cli/lib/ -> up 3 levels)
    const repoRoot = path.resolve(__dirname, '..', '..', '..');
    this.srcDir = path.join(repoRoot, 'src');
    this.docsDir = path.join(repoRoot, 'docs');
  }

  /**
   * Main installation flow
   * @param {Object} config - Configuration from UI prompts
   */
  async install(config) {
    const { projectDir, wdsFolder, root_folder } = config;
    const wdsDir = path.join(projectDir, wdsFolder);
    const detection = config._detection || { type: 'fresh' };

    // Handle legacy _wds/ → _bmad/wds/ migration
    if (detection.type === 'legacy' && wdsFolder !== '_wds') {
      const legacyDir = path.join(projectDir, '_wds');
      const legacyConfigPath = path.join(legacyDir, 'config.yaml');

      // Save config from legacy location
      if (await fs.pathExists(legacyConfigPath)) {
        let savedConfig = await fs.readFile(legacyConfigPath, 'utf8');
        // Update wds_folder in saved config to new path
        savedConfig = savedConfig.replace(/wds_folder:.*/, `wds_folder: ${wdsFolder}`);
        config._savedConfigYaml = savedConfig;
      }

      const migrateSpinner = ora(`Migrating _wds/ → ${wdsFolder}/...`).start();
      await fs.ensureDir(path.dirname(wdsDir));
      await fs.remove(legacyDir);
      migrateSpinner.succeed(`Legacy _wds/ removed — installing fresh at ${wdsFolder}/`);
    }

    // Check if already installed at target path
    if (await fs.pathExists(wdsDir)) {
      console.log(chalk.yellow(`\n  ${wdsFolder}/ already exists.`));
      const { action } = await inquirer.prompt([
        {
          type: 'list',
          name: 'action',
          message: 'What would you like to do?',
          choices: [
            { name: 'Update - Replace WDS files, keep config.yaml', value: 'update' },
            { name: 'Fresh install - Remove everything and start over', value: 'fresh' },
            { name: 'Cancel', value: 'cancel' },
          ],
        },
      ]);

      if (action === 'cancel') {
        return { success: false };
      }

      if (action === 'fresh') {
        const removeSpinner = ora('Removing existing WDS installation...').start();
        await fs.remove(wdsDir);
        removeSpinner.succeed('Old installation removed');
      } else if (action === 'update') {
        // Preserve config.yaml during update
        const configPath = path.join(wdsDir, 'config.yaml');
        let savedConfig = null;
        if (await fs.pathExists(configPath)) {
          savedConfig = await fs.readFile(configPath, 'utf8');
        }

        const removeSpinner = ora('Updating WDS files...').start();
        await fs.remove(wdsDir);
        removeSpinner.succeed('Old files cleared');

        // Will be restored after copy
        config._savedConfigYaml = savedConfig;
      }
    }

    // Ensure parent directory exists (for _bmad/wds/)
    await fs.ensureDir(path.dirname(wdsDir));

    console.log('');

    // Step 1: Copy source files
    const spinner = ora('Copying WDS files...').start();
    try {
      await this.copySrcFiles(wdsDir);
      spinner.succeed('WDS files copied');
    } catch (error) {
      spinner.fail('Failed to copy WDS files');
      throw error;
    }

    // Step 2: Write config.yaml
    const configSpinner = ora('Writing configuration...').start();
    try {
      await this.writeConfig(wdsDir, config);
      configSpinner.succeed('Configuration saved');
    } catch (error) {
      configSpinner.fail('Failed to write configuration');
      throw error;
    }

    // Step 3: Compile agents
    const agentSpinner = ora('Compiling agents...').start();
    try {
      const agents = await this.compileAgents(wdsDir, wdsFolder);
      agentSpinner.succeed(`Compiled ${agents.length} agents`);
    } catch (error) {
      agentSpinner.fail('Failed to compile agents');
      throw error;
    }

    // Step 3.5: Setup IDE integrations
    if (config.ides && config.ides.length > 0) {
      const ideSpinner = ora('Setting up IDE integrations...').start();
      try {
        const { IdeManager } = require('../installers/lib/ide/manager');
        const ideManager = new IdeManager();

        const results = await ideManager.setup(
          projectDir,
          wdsDir,
          config.ides,
          {
            logger: {
              log: (msg) => {}, // Suppress detailed logs during spinner
              warn: (msg) => console.log(msg),
            },
            wdsFolderName: wdsFolder,
          }
        );

        const successCount = results.success.length;
        const failedCount = results.failed.length;
        const skippedCount = results.skipped.length;

        if (successCount > 0) {
          ideSpinner.succeed(`IDE integrations configured (${successCount} IDE${successCount > 1 ? 's' : ''})`);
        } else if (failedCount > 0 || skippedCount > 0) {
          ideSpinner.warn(`IDE setup completed with ${failedCount} failed, ${skippedCount} skipped`);
        } else {
          ideSpinner.succeed('IDE integrations configured');
        }
      } catch (error) {
        ideSpinner.warn(`IDE setup encountered issues: ${error.message}`);
        console.log(chalk.dim('  You can still use WDS by manually activating agents'));
      }
    }

    // Step 4: Create work products folder structure
    const rootFolder = root_folder || 'design-process';
    const docsSpinner = ora(`Creating project folders in ${rootFolder}/...`).start();
    try {
      await this.createDocsFolders(projectDir, rootFolder, config);
      docsSpinner.succeed(`Project folders created in ${rootFolder}/`);
    } catch (error) {
      docsSpinner.fail('Failed to create project folders');
      throw error;
    }

    // Step 5: Copy learning & reference material (optional)
    if (config.install_learning !== false) {
      const learnSpinner = ora('Copying learning & reference material...').start();
      try {
        await this.copyLearningMaterial(projectDir);
        learnSpinner.succeed('Learning material added to _wds-learn/ (safe to remove when no longer needed)');
      } catch (error) {
        learnSpinner.fail('Failed to copy learning material');
        throw error;
      }
    }

    return { success: true, wdsDir, projectDir };
  }

  /**
   * Copy src/ content into the target WDS directory
   */
  async copySrcFiles(wdsDir) {
    const contentDirs = ['agents', 'data', 'gems', 'skills', 'workflows'];

    for (const dir of contentDirs) {
      const src = path.join(this.srcDir, dir);
      const dest = path.join(wdsDir, dir);
      if (await fs.pathExists(src)) {
        await fs.copy(src, dest);
      }
    }

    // Copy module.yaml and module-help.csv
    const moduleYaml = path.join(this.srcDir, 'module.yaml');
    if (await fs.pathExists(moduleYaml)) {
      await fs.copy(moduleYaml, path.join(wdsDir, 'module.yaml'));
    }
    const moduleHelp = path.join(this.srcDir, 'module-help.csv');
    if (await fs.pathExists(moduleHelp)) {
      await fs.copy(moduleHelp, path.join(wdsDir, 'module-help.csv'));
    }
  }

  /**
   * Write config.yaml from user answers (or restore saved config on update)
   */
  async writeConfig(wdsDir, config) {
    // On update, restore the user's existing config
    if (config._savedConfigYaml) {
      await fs.writeFile(path.join(wdsDir, 'config.yaml'), config._savedConfigYaml, 'utf8');
      return;
    }

    // Get user name from git or system
    const getUserName = () => {
      try {
        const { execSync } = require('child_process');
        const gitName = execSync('git config user.name', { encoding: 'utf8' }).trim();
        return gitName || 'Designer';
      } catch {
        return 'Designer';
      }
    };

    const configData = {
      user_name: getUserName(),
      project_name: config.project_name || 'Untitled Project',
      starting_point: config.starting_point || 'brief',
      communication_language: 'en',
      document_output_language: 'en',
      output_folder: config.root_folder || 'design-process',
      wds_folder: config.wdsFolder,
      ides: config.ides || ['windsurf'],
    };

    const yamlStr = yaml.dump(configData, { lineWidth: -1 });
    await fs.writeFile(path.join(wdsDir, 'config.yaml'), `# WDS Configuration - Generated by installer\n${yamlStr}`, 'utf8');
  }

  /**
   * Compile all .agent.yaml files in the agents directory
   */
  async compileAgents(wdsDir, wdsFolder) {
    const agentsDir = path.join(wdsDir, 'agents');
    const files = await fs.readdir(agentsDir);
    const agentFiles = files.filter((f) => f.endsWith('.agent.yaml'));
    const results = [];

    for (const file of agentFiles) {
      const yamlPath = path.join(agentsDir, file);
      const result = compileAgentFile(yamlPath, { wdsFolder });
      results.push(result);
    }

    return results;
  }

  /**
   * Copy learning & reference material into _wds-learn/ at project root.
   * Users can safely delete this folder without affecting agents or workflows.
   */
  async copyLearningMaterial(projectDir) {
    const learnDir = path.join(projectDir, '_wds-learn');
    const learningDirs = ['getting-started', 'learn', 'method', 'models', 'tools'];
    const excludeDirs = new Set(['course-explainers', 'Webinars']);

    for (const dir of learningDirs) {
      const src = path.join(this.docsDir, dir);
      const dest = path.join(learnDir, dir);
      if (await fs.pathExists(src)) {
        await fs.copy(src, dest, {
          filter: (srcPath) => {
            const relative = path.relative(src, srcPath);
            const topDir = relative.split(path.sep)[0];
            return !excludeDirs.has(topDir);
          },
        });
      }
    }
  }

  /**
   * Create the WDS work products folder structure
   * @param {string} projectDir - Project root directory
   * @param {string} rootFolder - Root folder name (design-process)
   * @param {Object} config - Configuration object
   */
  async createDocsFolders(projectDir, rootFolder, config) {
    const docsPath = path.join(projectDir, rootFolder);

    // Simplified 4-phase structure
    const folders = [
      'A-Product-Brief',
      'B-Trigger-Map',
      'C-UX-Scenarios',
      'D-Design-System',
    ];

    for (const folder of folders) {
      const folderPath = path.join(docsPath, folder);

      // Only create folder if it doesn't exist
      if (!(await fs.pathExists(folderPath))) {
        await fs.ensureDir(folderPath);

        // Add .gitkeep to preserve empty directories (only if folder is empty)
        const gitkeepPath = path.join(folderPath, '.gitkeep');
        const existingFiles = await fs.readdir(folderPath);
        if (existingFiles.length === 0) {
          await fs.writeFile(gitkeepPath, '# This file ensures the directory is tracked by git\n');
        }
      }
    }

    // Create _progress folder for agent tracking
    const progressPath = path.join(docsPath, '_progress');
    await fs.ensureDir(progressPath);
    await fs.ensureDir(path.join(progressPath, 'agent-experiences'));
  }

}

module.exports = { Installer };
