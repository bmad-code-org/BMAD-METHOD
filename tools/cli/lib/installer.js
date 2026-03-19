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
    const action = config._action || 'fresh';

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

      // Also remove legacy _wds-learn/ (will be recreated if learning material is selected)
      const legacyLearnDir = path.join(projectDir, '_wds-learn');
      if (await fs.pathExists(legacyLearnDir)) {
        await fs.remove(legacyLearnDir);
      }

      migrateSpinner.succeed(`Legacy _wds/ removed — installing fresh at ${wdsFolder}/`);
    }

    // Handle update vs fresh for existing target path
    if (action === 'update' && (await fs.pathExists(wdsDir))) {
      // Preserve config.yaml during update
      const configPath = path.join(wdsDir, 'config.yaml');
      if (!config._savedConfigYaml && (await fs.pathExists(configPath))) {
        config._savedConfigYaml = await fs.readFile(configPath, 'utf8');
      }

      const removeSpinner = ora('Updating WDS files...').start();
      await fs.remove(wdsDir);
      removeSpinner.succeed('Old files cleared');
    } else if (action === 'fresh' && (await fs.pathExists(wdsDir))) {
      const removeSpinner = ora('Removing existing WDS installation...').start();
      await fs.remove(wdsDir);
      removeSpinner.succeed('Old installation removed');
    }

    // On update, extract ides and root_folder from saved config
    if (action === 'update' && config._savedConfigYaml) {
      try {
        const savedData = yaml.load(config._savedConfigYaml);
        if (!config.ides && savedData.ides) config.ides = savedData.ides;
        if (!config.root_folder && savedData.output_folder) config.root_folder = savedData.output_folder;
      } catch {
        /* ignore parse errors, defaults will apply */
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

        const results = await ideManager.setup(projectDir, wdsDir, config.ides, {
          logger: {
            log: (msg) => {}, // Suppress detailed logs during spinner
            warn: (msg) => console.log(msg),
          },
          wdsFolderName: wdsFolder,
        });

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

    // Step 5: Install Design Space (optional)
    if (config.install_design_space) {
      const dsSpinner = ora(`Setting up ${config.ds_name || 'design-space'}...`).start();
      try {
        await this.installDesignSpace(projectDir, config);
        dsSpinner.succeed(`${config.ds_name || 'Design Space'} configured at _bmad/${config.ds_name || 'design-space'}/`);
      } catch (error) {
        dsSpinner.fail('Failed to set up Design Space');
        throw error;
      }
    }

    // Step 6: Copy learning & reference material (optional)
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
        const { execSync } = require('node:child_process');
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
   * Install Design Space module
   */
  async installDesignSpace(projectDir, config) {
    const dsName = config.ds_name || 'design-space';
    const dsDir = path.join(projectDir, '_bmad', dsName);
    await fs.ensureDir(dsDir);

    // Write Design Space config
    const dsConfig = {
      name: dsName,
      backend: config.ds_backend || 'sqlite',
    };

    if (config.ds_backend === 'supabase') {
      if (config.ds_mode === 'connect') {
        dsConfig.supabase_url = config.ds_url;
        dsConfig.supabase_anon_key = config.ds_key;
      } else {
        dsConfig.supabase_url = '# Run: npx supabase init && npx supabase start';
        dsConfig.supabase_anon_key = '# Get from Supabase dashboard → Settings → API';
      }
      dsConfig.base_url = config.ds_url
        ? `${config.ds_url}/functions/v1`
        : '# Set after Supabase project is created';
    } else {
      // SQLite
      dsConfig.db_path = config.ds_db_path || `./${dsName}.db`;
      dsConfig.base_url = 'http://localhost:3141';
      dsConfig.note = 'Run: cd _bmad/' + dsName + ' && npm install && node server.js';
    }

    const yamlStr = yaml.dump(dsConfig, { lineWidth: -1 });
    await fs.writeFile(
      path.join(dsDir, 'config.yaml'),
      `# Design Space Configuration - Generated by WDS installer\n${yamlStr}`,
      'utf8'
    );

    // Copy the Design Space skill into the module
    const dsSkillSrc = path.join(this.srcDir, 'skills', 'design-space');
    if (await fs.pathExists(dsSkillSrc)) {
      await fs.copy(dsSkillSrc, path.join(dsDir, 'skill'));
    }

    // For SQLite: copy the lite-server files
    if (config.ds_backend === 'sqlite') {
      const liteServerSrc = path.resolve(this.srcDir, '..', '..', 'design-space', 'lite-server');
      // If lite-server exists in the design-space repo (dev environment), copy it
      if (await fs.pathExists(liteServerSrc)) {
        const filesToCopy = ['server.js', 'package.json'];
        for (const file of filesToCopy) {
          const src = path.join(liteServerSrc, file);
          if (await fs.pathExists(src)) {
            await fs.copy(src, path.join(dsDir, file));
          }
        }
      } else {
        // Create a minimal package.json that points to the npm package
        await fs.writeFile(
          path.join(dsDir, 'package.json'),
          JSON.stringify(
            {
              name: dsName,
              private: true,
              type: 'module',
              dependencies: { 'better-sqlite3': '^11.0.0', 'sqlite-vec': '^0.1.7' },
              scripts: { start: 'node server.js' },
            },
            null,
            2
          ),
          'utf8'
        );

        // Write a note about getting the server
        await fs.writeFile(
          path.join(dsDir, 'README.md'),
          `# ${dsName}\n\nDesign Space — local SQLite backend.\n\nGet the server:\n\`\`\`bash\nnpm install\n# Copy server.js from https://github.com/whiteport-collective/design-space/tree/master/lite-server\nnpm start\n\`\`\`\n`,
          'utf8'
        );
      }
    }

    // For Supabase with create mode: write setup instructions
    if (config.ds_backend === 'supabase' && config.ds_mode === 'create') {
      await fs.writeFile(
        path.join(dsDir, 'SETUP.md'),
        `# ${dsName} — Supabase Setup\n\n1. Create a project at https://supabase.com\n2. Get your project URL and anon key from Settings → API\n3. Update config.yaml with the URL and key\n4. Deploy edge functions:\n   \`\`\`bash\n   git clone https://github.com/whiteport-collective/design-space.git /tmp/ds\n   cd /tmp/ds && ./setup.sh YOUR-PROJECT-REF\n   \`\`\`\n5. Set OPENROUTER_API_KEY in Supabase → Edge Functions → Secrets (for semantic search)\n`,
        'utf8'
      );
    }

    // Store DS config reference in WDS config
    const wdsConfigPath = path.join(projectDir, config.wdsFolder, 'config.yaml');
    if (await fs.pathExists(wdsConfigPath)) {
      let wdsConfig = await fs.readFile(wdsConfigPath, 'utf8');
      wdsConfig += `\n# Design Space\ndesign_space:\n  name: ${dsName}\n  path: _bmad/${dsName}\n  backend: ${config.ds_backend}\n`;
      await fs.writeFile(wdsConfigPath, wdsConfig, 'utf8');
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
    const folders = ['A-Product-Brief', 'B-Trigger-Map', 'C-UX-Scenarios', 'D-Design-System'];

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
