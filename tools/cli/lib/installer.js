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
const { writeIdeConfig } = require('./ide-configs');

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
    const { projectDir, wdsFolder, ides, project_type, design_experience } = config;
    const wdsDir = path.join(projectDir, wdsFolder);

    // Check if already installed
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

    // Step 4: Create docs folder structure
    const docsSpinner = ora('Creating project folders...').start();
    let detectedOutputFolder = 'docs';
    try {
      detectedOutputFolder = await this.createDocsFolders(projectDir, config);
      docsSpinner.succeed(`Project folders created in ${detectedOutputFolder}/`);
    } catch (error) {
      docsSpinner.fail('Failed to create project folders');
      throw error;
    }

    // Update config.yaml with detected output folder (if different from default)
    if (detectedOutputFolder !== 'docs') {
      const configPath = path.join(wdsDir, 'config.yaml');
      let configContent = await fs.readFile(configPath, 'utf8');
      configContent = configContent.replace(/output_folder:\s*docs/, `output_folder: ${detectedOutputFolder}`);
      await fs.writeFile(configPath, configContent, 'utf8');
    }

    // Step 5: Set up IDEs
    const ideList = ides || (config.ide ? [config.ide] : []);
    const ideSpinner = ora(`Setting up ${ideList.length} IDE(s)...`).start();
    try {
      const labels = [];
      for (const ide of ideList) {
        const result = await writeIdeConfig(projectDir, ide, wdsFolder);
        labels.push(result.label);
      }
      ideSpinner.succeed(`Configured: ${labels.join(', ')}`);
    } catch (error) {
      ideSpinner.fail('Failed to set up IDEs');
      throw error;
    }

    // Step 6: Copy learning & reference material (optional)
    if (config.include_learning) {
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

    const configData = {
      user_name: config.user_name || 'Designer',
      communication_language: config.communication_language || 'en',
      document_output_language: config.document_output_language || 'en',
      output_folder: 'docs',
      wds_folder: config.wdsFolder,
      project_type: config.project_type,
      design_experience: config.design_experience,
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
    const learningDirs = ['getting-started', 'learn-wds', 'method', 'models', 'tools'];
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
   * Create the WDS docs folder structure
   * FIXED: Detects existing folders, doesn't overwrite files
   */
  async createDocsFolders(projectDir, config) {
    // Check if user already has a deliverables folder with WDS content
    const possibleFolders = ['design-process', 'docs', 'deliverables', 'wds-deliverables'];
    let existingFolder = null;

    for (const folderName of possibleFolders) {
      const folderPath = path.join(projectDir, folderName);
      if (await fs.pathExists(folderPath)) {
        // Check if it has WDS structure (A-Product-Brief, B-Trigger-Map, etc.)
        const hasProductBrief = await fs.pathExists(path.join(folderPath, 'A-Product-Brief'));
        const hasTriggerMap = await fs.pathExists(path.join(folderPath, 'B-Trigger-Map'));
        if (hasProductBrief || hasTriggerMap) {
          existingFolder = folderName;
          break;
        }
      }
    }

    // Use existing folder if found, otherwise default to 'docs'
    const outputFolder = existingFolder || 'docs';
    const docsPath = path.join(projectDir, outputFolder);

    const folders = [
      'A-Product-Brief',
      'B-Trigger-Map',
      'C-UX-Scenarios',
      'D-Design-System',
      'E-PRD',
      'E-PRD/Design-Deliveries',
      'F-Testing',
      'G-Product-Development',
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

    // Create 00 guide files in each folder (if they don't exist)
    await this.createFolderGuides(docsPath, config);

    // Return the detected/used folder name so config.yaml can be updated
    return outputFolder;
  }

  /**
   * Create 00 guide files in each folder from templates
   */
  async createFolderGuides(docsPath, config) {
    const templateDir = path.join(this.srcDir, 'workflows', '0-project-setup', 'templates', 'folder-guides');

    // Mapping: template filename → destination folder & filename
    const guides = [
      { template: '00-product-brief.template.md', folder: 'A-Product-Brief', filename: '00-product-brief.md' },
      { template: '00-trigger-map.template.md', folder: 'B-Trigger-Map', filename: '00-trigger-map.md' },
      { template: '00-ux-scenarios.template.md', folder: 'C-UX-Scenarios', filename: '00-ux-scenarios.md' },
      { template: '00-design-system.template.md', folder: 'D-Design-System', filename: '00-design-system.md' },
    ];

    // Common placeholder replacements
    const replacements = {
      '{{project_name}}': config.project_name || 'Untitled Project',
      '{{date}}': new Date().toISOString().split('T')[0],
      '{{project_type}}': config.project_type || 'digital_product',
      '{{design_experience}}': config.design_experience || 'intermediate',
      '{{user_name}}': config.user_name || 'Designer',
      '{{communication_language}}': config.communication_language || 'en',
      '{{document_output_language}}': config.document_output_language || 'en',
      '{{output_folder}}': path.relative(config.projectDir, docsPath) || 'docs',
      '{{wds_folder}}': config.wdsFolder || '_wds',
    };

    // Create each folder guide
    for (const guide of guides) {
      const templatePath = path.join(templateDir, guide.template);
      const destPath = path.join(docsPath, guide.folder, guide.filename);

      // Skip if file exists (never overwrite) or template doesn't exist
      if (await fs.pathExists(destPath)) continue;
      if (!(await fs.pathExists(templatePath))) continue;

      // Read template
      let content = await fs.readFile(templatePath, 'utf8');

      // Replace all placeholders
      for (const [placeholder, value] of Object.entries(replacements)) {
        content = content.split(placeholder).join(value);
      }

      // Write file
      await fs.writeFile(destPath, content, 'utf8');
    }

    // Also create 00-project-info.md in A-Product-Brief (project settings home)
    await this.createProjectInfoFile(docsPath, config);
  }

  /**
   * Create 00-project-info.md in A-Product-Brief from template
   */
  async createProjectInfoFile(docsPath, config) {
    const productBriefPath = path.join(docsPath, 'A-Product-Brief');
    const projectInfoPath = path.join(productBriefPath, '00-project-info.md');

    // Only create if it doesn't exist (never overwrite)
    if (await fs.pathExists(projectInfoPath)) {
      return;
    }

    const templatePath = path.join(this.srcDir, 'workflows', '1-project-brief', 'templates', '00-project-info.template.md');

    // Check if template exists
    if (!(await fs.pathExists(templatePath))) {
      // Skip if template not found (backward compatibility)
      return;
    }

    // Read template
    let template = await fs.readFile(templatePath, 'utf8');

    // Replace placeholders
    const replacements = {
      '{{project_name}}': config.project_name || 'Untitled Project',
      '{{date}}': new Date().toISOString().split('T')[0],
      '{{project_type}}': config.project_type || 'digital_product',
      '{{design_experience}}': config.design_experience || 'intermediate',
      '{{user_name}}': config.user_name || 'Designer',
      '{{communication_language}}': config.communication_language || 'en',
      '{{document_output_language}}': config.document_output_language || 'en',
      '{{output_folder}}': path.relative(config.projectDir, docsPath) || 'docs',
      '{{wds_folder}}': config.wdsFolder || '_wds',
    };

    for (const [placeholder, value] of Object.entries(replacements)) {
      template = template.split(placeholder).join(value);
    }

    // Write the file
    await fs.writeFile(projectInfoPath, template, 'utf8');
  }
}

module.exports = { Installer };
