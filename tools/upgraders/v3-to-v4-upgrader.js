const fs = require('node:fs').promises;
const path = require('node:path');
const { glob } = require('glob');

// Dynamic imports for ES modules
let chalk, ora, inquirer;

// Initialize ES modules
async function initializeModules() {
  chalk = (await import('chalk')).default;
  ora = (await import('ora')).default;
  inquirer = (await import('inquirer')).default;
}

class V3ToV4Upgrader {
  constructor() {
    // Constructor remains empty
  }

  async upgrade(options = {}) {
    try {
      // Initialize ES modules
      await initializeModules();
      // Keep readline open throughout the process
      process.stdin.resume();

      // 1. Welcome message
      console.log(chalk.bold('\nWelcome to BMad-Method V3 to V4 Upgrade Tool\n'));
      console.log('This tool will help you upgrade your BMad-Method V3 project to V4.\n');
      console.log(chalk.cyan('What this tool does:'));
      console.log('- Creates a backup of your V3 files (.bmad-v3-backup/)');
      console.log('- Installs the new V4 .bmad-core structure');
      console.log('- Preserves your PRD, Architecture, and Stories in the new format\n');
      console.log(chalk.yellow('What this tool does NOT do:'));
      console.log('- Modify your document content (use doc-migration-task after upgrade)');
      console.log('- Touch any files outside bmad-agent/ and docs/\n');

      // 2. Get project path
      const projectPath = await this.getProjectPath(options.projectPath);

      // 3. Validate V3 structure
      const validation = await this.validateV3Project(projectPath);
      if (!validation.isValid) {
        console.error(chalk.red("\nError: This doesn't appear to be a V3 project."));
        console.error('Expected to find:');
        console.error('- bmad-agent/ directory');
        console.error('- docs/ directory\n');
        console.error("Please check you're in the correct directory and try again.");
        return;
      }

      // 4. Pre-flight check
      const analysis = await this.analyzeProject(projectPath);
      await this.showPreflightCheck(analysis, options);

      if (!options.dryRun) {
        const { confirm } = await inquirer.prompt([
          {
            type: 'confirm',
            name: 'confirm',
            message: 'Continue with upgrade?',
            default: true,
          },
        ]);

        if (!confirm) {
          console.log('Upgrade cancelled.');
          return;
        }
      }

      // 5. Create backup
      if (options.backup !== false && !options.dryRun) {
        await this.createBackup(projectPath);
      }

      // 6. Install V4 structure
      if (!options.dryRun) {
        await this.installV4Structure(projectPath);
      }

      // 7. Migrate documents
      if (!options.dryRun) {
        await this.migrateDocuments(projectPath, analysis);
      }

      // 8. Setup IDE
      if (!options.dryRun) {
        await this.setupIDE(projectPath, options.ides);
      }

      // 9. Show completion report
      this.showCompletionReport(projectPath, analysis);

      process.exit(0);
    } catch (error) {
      console.error(chalk.red('\nUpgrade error:'), error.message);
      process.exit(1);
    }
  }

  async getProjectPath(providedPath) {
    if (providedPath) {
      return path.resolve(providedPath);
    }

    const { projectPath } = await inquirer.prompt([
      {
        type: 'input',
        name: 'projectPath',
        message: 'Please enter the path to your V3 project:',
        default: process.cwd(),
      },
    ]);

    return path.resolve(projectPath);
  }

  async validateV3Project(projectPath) {
    const spinner = ora('Validating project structure...').start();

    try {
      const bmadAgentPath = path.join(projectPath, 'bmad-agent');
      const docsPath = path.join(projectPath, 'docs');

      const hasBmadAgent = await this.pathExists(bmadAgentPath);
      const hasDocs = await this.pathExists(docsPath);

      if (hasBmadAgent) {
        spinner.text = '✓ Found bmad-agent/ directory';
        console.log(chalk.green('\n✓ Found bmad-agent/ directory'));
      }

      if (hasDocs) {
        console.log(chalk.green('✓ Found docs/ directory'));
      }

      const isValid = hasBmadAgent && hasDocs;

      if (isValid) {
        spinner.succeed('This appears to be a valid V3 project');
      } else {
        spinner.fail('Invalid V3 project structure');
      }

      return { isValid, hasBmadAgent, hasDocs };
    } catch (error) {
      spinner.fail('Validation failed');
      throw error;
    }
  }

  async analyzeProject(projectPath) {
    const docsPath = path.join(projectPath, 'docs');
    const bmadAgentPath = path.join(projectPath, 'bmad-agent');

    // Find PRD
    const prdCandidates = ['prd.md', 'PRD.md', 'product-requirements.md'];
    let prdFile = null;
    for (const candidate of prdCandidates) {
      const candidatePath = path.join(docsPath, candidate);
      if (await this.pathExists(candidatePath)) {
        prdFile = candidate;
        break;
      }
    }

    // Find Architecture
    const archCandidates = ['architecture.md', 'Architecture.md', 'technical-architecture.md'];
    let archFile = null;
    for (const candidate of archCandidates) {
      const candidatePath = path.join(docsPath, candidate);
      if (await this.pathExists(candidatePath)) {
        archFile = candidate;
        break;
      }
    }

    // Find Front-end Architecture (V3 specific)
    const frontEndCandidates = [
      'front-end-architecture.md',
      'frontend-architecture.md',
      'ui-architecture.md',
    ];
    let frontEndArchFile = null;
    for (const candidate of frontEndCandidates) {
      const candidatePath = path.join(docsPath, candidate);
      if (await this.pathExists(candidatePath)) {
        frontEndArchFile = candidate;
        break;
      }
    }

    // Find UX/UI spec
    const uxSpecCandidates = [
      'ux-ui-spec.md',
      'ux-ui-specification.md',
      'ui-spec.md',
      'ux-spec.md',
    ];
    let uxSpecFile = null;
    for (const candidate of uxSpecCandidates) {
      const candidatePath = path.join(docsPath, candidate);
      if (await this.pathExists(candidatePath)) {
        uxSpecFile = candidate;
        break;
      }
    }

    // Find v0 prompt or UX prompt
    const uxPromptCandidates = ['v0-prompt.md', 'ux-prompt.md', 'ui-prompt.md', 'design-prompt.md'];
    let uxPromptFile = null;
    for (const candidate of uxPromptCandidates) {
      const candidatePath = path.join(docsPath, candidate);
      if (await this.pathExists(candidatePath)) {
        uxPromptFile = candidate;
        break;
      }
    }

    // Find epic files
    const epicFiles = await glob('epic*.md', { cwd: docsPath });

    // Find story files
    const storiesPath = path.join(docsPath, 'stories');
    let storyFiles = [];
    if (await this.pathExists(storiesPath)) {
      storyFiles = await glob('*.md', { cwd: storiesPath });
    }

    // Count custom files in bmad-agent
    const bmadAgentFiles = await glob('**/*.md', {
      cwd: bmadAgentPath,
      ignore: ['node_modules/**'],
    });

    return {
      prdFile,
      archFile,
      frontEndArchFile,
      uxSpecFile,
      uxPromptFile,
      epicFiles,
      storyFiles,
      customFileCount: bmadAgentFiles.length,
    };
  }

  async showPreflightCheck(analysis, options) {
    console.log(chalk.bold('\nProject Analysis:'));
    console.log(
      `- PRD found: ${analysis.prdFile ? `docs/${analysis.prdFile}` : chalk.yellow('Not found')}`,
    );
    console.log(
      `- Architecture found: ${
        analysis.archFile ? `docs/${analysis.archFile}` : chalk.yellow('Not found')
      }`,
    );
    if (analysis.frontEndArchFile) {
      console.log(`- Front-end Architecture found: docs/${analysis.frontEndArchFile}`);
    }
    console.log(
      `- UX/UI Spec found: ${
        analysis.uxSpecFile ? `docs/${analysis.uxSpecFile}` : chalk.yellow('Not found')
      }`,
    );
    console.log(
      `- UX/Design Prompt found: ${
        analysis.uxPromptFile ? `docs/${analysis.uxPromptFile}` : chalk.yellow('Not found')
      }`,
    );
    console.log(`- Epic files found: ${analysis.epicFiles.length} files (epic*.md)`);
    console.log(`- Stories found: ${analysis.storyFiles.length} files in docs/stories/`);
    console.log(`- Custom files in bmad-agent/: ${analysis.customFileCount}`);

    if (!options.dryRun) {
      console.log('\nThe following will be backed up to .bmad-v3-backup/:');
      console.log('- bmad-agent/ (entire directory)');
      console.log('- docs/ (entire directory)');

      if (analysis.epicFiles.length > 0) {
        console.log(
          chalk.green(
            '\nNote: Epic files found! They will be placed in docs/prd/ with an index.md file.',
          ),
        );
        console.log(
          chalk.green("Since epic files exist, you won't need to shard the PRD after upgrade."),
        );
      }
    }
  }

  async createBackup(projectPath) {
    const spinner = ora('Creating backup...').start();

    try {
      const backupPath = path.join(projectPath, '.bmad-v3-backup');

      // Check if backup already exists
      if (await this.pathExists(backupPath)) {
        spinner.fail('Backup directory already exists');
        console.error(chalk.red('\nError: Backup directory .bmad-v3-backup/ already exists.'));
        console.error('\nThis might mean an upgrade was already attempted.');
        console.error('Please remove or rename the existing backup and try again.');
        throw new Error('Backup already exists');
      }

      // Create backup directory
      await fs.mkdir(backupPath, { recursive: true });
      spinner.text = '✓ Created .bmad-v3-backup/';
      console.log(chalk.green('\n✓ Created .bmad-v3-backup/'));

      // Move bmad-agent
      const bmadAgentSource = path.join(projectPath, 'bmad-agent');
      const bmadAgentDestination = path.join(backupPath, 'bmad-agent');
      await fs.rename(bmadAgentSource, bmadAgentDestination);
      console.log(chalk.green('✓ Moved bmad-agent/ to backup'));

      // Move docs
      const docsSrc = path.join(projectPath, 'docs');
      const docsDest = path.join(backupPath, 'docs');
      await fs.rename(docsSrc, docsDest);
      console.log(chalk.green('✓ Moved docs/ to backup'));

      spinner.succeed('Backup created successfully');
    } catch (error) {
      spinner.fail('Backup failed');
      throw error;
    }
  }

  async installV4Structure(projectPath) {
    const spinner = ora('Installing V4 structure...').start();

    try {
      // Get the source bmad-core directory (without dot prefix)
      const sourcePath = path.join(__dirname, '..', '..', 'bmad-core');
      const destinationPath = path.join(projectPath, '.bmad-core');

      // Copy .bmad-core
      await this.copyDirectory(sourcePath, destinationPath);
      spinner.text = '✓ Copied fresh .bmad-core/ directory from V4';
      console.log(chalk.green('\n✓ Copied fresh .bmad-core/ directory from V4'));

      // Create docs directory
      const docsPath = path.join(projectPath, 'docs');
      await fs.mkdir(docsPath, { recursive: true });
      console.log(chalk.green('✓ Created new docs/ directory'));

      // Create install manifest for future updates
      await this.createInstallManifest(projectPath);
      console.log(chalk.green('✓ Created install manifest'));

      console.log(
        chalk.yellow('\nNote: Your V3 bmad-agent content has been backed up and NOT migrated.'),
      );
      console.log(
        chalk.yellow(
          'The new V4 agents are completely different and look for different file structures.',
        ),
      );

      spinner.succeed('V4 structure installed successfully');
    } catch (error) {
      spinner.fail('V4 installation failed');
      throw error;
    }
  }

  async migrateDocuments(projectPath, analysis) {
    const spinner = ora('Migrating your project documents...').start();

    try {
      const backupDocsPath = path.join(projectPath, '.bmad-v3-backup', 'docs');
      const newDocsPath = path.join(projectPath, 'docs');
      let copiedCount = 0;

      // Copy PRD
      if (analysis.prdFile) {
        const source = path.join(backupDocsPath, analysis.prdFile);
        const destination = path.join(newDocsPath, analysis.prdFile);
        await fs.copyFile(source, destination);
        console.log(chalk.green(`\n✓ Copied PRD to docs/${analysis.prdFile}`));
        copiedCount++;
      }

      // Copy Architecture
      if (analysis.archFile) {
        const source = path.join(backupDocsPath, analysis.archFile);
        const destination = path.join(newDocsPath, analysis.archFile);
        await fs.copyFile(source, destination);
        console.log(chalk.green(`✓ Copied Architecture to docs/${analysis.archFile}`));
        copiedCount++;
      }

      // Copy Front-end Architecture if exists
      if (analysis.frontEndArchFile) {
        const source = path.join(backupDocsPath, analysis.frontEndArchFile);
        const destination = path.join(newDocsPath, analysis.frontEndArchFile);
        await fs.copyFile(source, destination);
        console.log(
          chalk.green(`✓ Copied Front-end Architecture to docs/${analysis.frontEndArchFile}`),
        );
        console.log(
          chalk.yellow(
            'Note: V4 uses a single full-stack-architecture.md - use doc-migration-task to merge',
          ),
        );
        copiedCount++;
      }

      // Copy UX/UI Spec if exists
      if (analysis.uxSpecFile) {
        const source = path.join(backupDocsPath, analysis.uxSpecFile);
        const destination = path.join(newDocsPath, analysis.uxSpecFile);
        await fs.copyFile(source, destination);
        console.log(chalk.green(`✓ Copied UX/UI Spec to docs/${analysis.uxSpecFile}`));
        copiedCount++;
      }

      // Copy UX/Design Prompt if exists
      if (analysis.uxPromptFile) {
        const source = path.join(backupDocsPath, analysis.uxPromptFile);
        const destination = path.join(newDocsPath, analysis.uxPromptFile);
        await fs.copyFile(source, destination);
        console.log(chalk.green(`✓ Copied UX/Design Prompt to docs/${analysis.uxPromptFile}`));
        copiedCount++;
      }

      // Copy stories
      if (analysis.storyFiles.length > 0) {
        const storiesDir = path.join(newDocsPath, 'stories');
        await fs.mkdir(storiesDir, { recursive: true });

        for (const storyFile of analysis.storyFiles) {
          const source = path.join(backupDocsPath, 'stories', storyFile);
          const destination = path.join(storiesDir, storyFile);
          await fs.copyFile(source, destination);
        }
        console.log(
          chalk.green(`✓ Copied ${analysis.storyFiles.length} story files to docs/stories/`),
        );
        copiedCount += analysis.storyFiles.length;
      }

      // Copy epic files to prd subfolder
      if (analysis.epicFiles.length > 0) {
        const prdDir = path.join(newDocsPath, 'prd');
        await fs.mkdir(prdDir, { recursive: true });

        for (const epicFile of analysis.epicFiles) {
          const source = path.join(backupDocsPath, epicFile);
          const destination = path.join(prdDir, epicFile);
          await fs.copyFile(source, destination);
        }
        console.log(
          chalk.green(`✓ Found and copied ${analysis.epicFiles.length} epic files to docs/prd/`),
        );

        // Create index.md for the prd folder
        await this.createPrdIndex(projectPath, analysis);
        console.log(chalk.green('✓ Created index.md in docs/prd/'));

        console.log(
          chalk.green(
            '\nNote: Epic files detected! These are compatible with V4 and have been copied.',
          ),
        );
        console.log(chalk.green("You won't need to shard the PRD since epics already exist."));
        copiedCount += analysis.epicFiles.length;
      }

      spinner.succeed(`Migrated ${copiedCount} documents successfully`);
    } catch (error) {
      spinner.fail('Document migration failed');
      throw error;
    }
  }

  async setupIDE(projectPath, selectedIdes) {
    // Use the IDE selections passed from the installer
    if (!selectedIdes || selectedIdes.length === 0) {
      console.log(chalk.dim('No IDE setup requested - skipping'));
      return;
    }

    const ideSetup = require('../installer/lib/ide-setup');
    const spinner = ora('Setting up IDE rules for all agents...').start();

    try {
      const ideMessages = {
        cursor: 'Rules created in .cursor/rules/bmad/',
        'claude-code': 'Commands created in .claude/commands/BMad/',
        'iflow-cli': 'Commands created in .iflow/commands/BMad/',
        windsurf: 'Rules created in .windsurf/workflows/',
        trae: 'Rules created in.trae/rules/',
        roo: 'Custom modes created in .roomodes',
        cline: 'Rules created in .clinerules/',
      };

      // Setup each selected IDE
      for (const ide of selectedIdes) {
        spinner.text = `Setting up ${ide}...`;
        await ideSetup.setup(ide, projectPath);
        console.log(chalk.green(`\n✓ ${ideMessages[ide]}`));
      }

      spinner.succeed(`IDE setup complete for ${selectedIdes.length} IDE(s)!`);
    } catch {
      spinner.fail('IDE setup failed');
      console.error(chalk.yellow('IDE setup failed, but upgrade is complete.'));
    }
  }

  showCompletionReport(projectPath, analysis) {
    console.log(chalk.bold.green('\n✓ Upgrade Complete!\n'));
    console.log(chalk.bold('Summary:'));
    console.log(`- V3 files backed up to: .bmad-v3-backup/`);
    console.log(`- V4 structure installed: .bmad-core/ (fresh from V4)`);

    const totalDocs =
      (analysis.prdFile ? 1 : 0) +
      (analysis.archFile ? 1 : 0) +
      (analysis.frontEndArchFile ? 1 : 0) +
      (analysis.uxSpecFile ? 1 : 0) +
      (analysis.uxPromptFile ? 1 : 0) +
      analysis.storyFiles.length;
    console.log(
      `- Documents migrated: ${totalDocs} files${
        analysis.epicFiles.length > 0 ? ` + ${analysis.epicFiles.length} epics` : ''
      }`,
    );

    console.log(chalk.bold('\nImportant Changes:'));
    console.log('- The V4 agents (sm, dev, etc.) expect different file structures than V3');
    console.log("- Your V3 bmad-agent content was NOT migrated (it's incompatible)");
    if (analysis.epicFiles.length > 0) {
      console.log('- Epic files were found and copied - no PRD sharding needed!');
    }
    if (analysis.frontEndArchFile) {
      console.log(
        '- Front-end architecture found - V4 uses full-stack-architecture.md, migration needed',
      );
    }
    if (analysis.uxSpecFile || analysis.uxPromptFile) {
      console.log('- UX/UI design files found and copied - ready for use with V4');
    }

    console.log(chalk.bold('\nNext Steps:'));
    console.log('1. Review your documents in the new docs/ folder');
    console.log(
      '2. Use @bmad-master agent to run the doc-migration-task to align your documents with V4 templates',
    );
    if (analysis.epicFiles.length === 0) {
      console.log('3. Use @bmad-master agent to shard the PRD to create epic files');
    }

    console.log(
      chalk.dim('\nYour V3 backup is preserved in .bmad-v3-backup/ and can be restored if needed.'),
    );
  }

  async pathExists(filePath) {
    try {
      await fs.access(filePath);
      return true;
    } catch {
      return false;
    }
  }

  async copyDirectory(source, destination) {
    await fs.mkdir(destination, { recursive: true });
    const entries = await fs.readdir(source, { withFileTypes: true });

    for (const entry of entries) {
      const sourcePath = path.join(source, entry.name);
      const destinationPath = path.join(destination, entry.name);

      await (entry.isDirectory()
        ? this.copyDirectory(sourcePath, destinationPath)
        : fs.copyFile(sourcePath, destinationPath));
    }
  }

  async createPrdIndex(projectPath, analysis) {
    const prdIndexPath = path.join(projectPath, 'docs', 'prd', 'index.md');
    const prdPath = path.join(projectPath, 'docs', analysis.prdFile || 'prd.md');

    let indexContent = '# Product Requirements Document\n\n';

    // Try to read the PRD to get the title and intro content
    if (analysis.prdFile && (await this.pathExists(prdPath))) {
      try {
        const prdContent = await fs.readFile(prdPath, 'utf8');
        const lines = prdContent.split('\n');

        // Find the first heading
        const titleMatch = lines.find((line) => line.startsWith('# '));
        if (titleMatch) {
          indexContent = titleMatch + '\n\n';
        }

        // Get any content before the first ## section
        let introContent = '';
        let foundFirstSection = false;
        for (const line of lines) {
          if (line.startsWith('## ')) {
            foundFirstSection = true;
            break;
          }
          if (!line.startsWith('# ')) {
            introContent += line + '\n';
          }
        }

        if (introContent.trim()) {
          indexContent += introContent.trim() + '\n\n';
        }
      } catch {
        // If we can't read the PRD, just use default content
      }
    }

    // Add sections list
    indexContent += '## Sections\n\n';

    // Sort epic files for consistent ordering
    const sortedEpics = [...analysis.epicFiles].sort();

    for (const epicFile of sortedEpics) {
      // Extract epic name from filename
      const epicName = epicFile
        .replace(/\.md$/, '')
        .replace(/^epic-?/i, '')
        .replaceAll('-', ' ')
        .replace(/^\d+\s*/, '') // Remove leading numbers
        .trim();

      const displayName = epicName.charAt(0).toUpperCase() + epicName.slice(1);
      indexContent += `- [${displayName || epicFile.replace('.md', '')}](./${epicFile})\n`;
    }

    await fs.writeFile(prdIndexPath, indexContent);
  }

  async createInstallManifest(projectPath) {
    const fileManager = require('../installer/lib/file-manager');
    const { glob } = require('glob');

    // Get all files in .bmad-core for the manifest
    const bmadCorePath = path.join(projectPath, '.bmad-core');
    const files = await glob('**/*', {
      cwd: bmadCorePath,
      nodir: true,
      ignore: ['**/.git/**', '**/node_modules/**'],
    });

    // Prepend .bmad-core/ to file paths for manifest
    const manifestFiles = files.map((file) => path.join('.bmad-core', file));

    const config = {
      installType: 'full',
      agent: null,
      ide: null, // Will be set if IDE setup is done later
    };

    await fileManager.createManifest(projectPath, config, manifestFiles);
  }
}

module.exports = V3ToV4Upgrader;
