const path = require('node:path');
const fs = require('fs-extra');
const chalk = require('chalk');
const ora = require('ora');
const inquirer = require('inquirer');
const fileManager = require('./file-manager');
const configLoader = require('./config-loader');
const ideSetup = require('./ide-setup');
const { extractYamlFromAgent } = require('../../lib/yaml-utils');
const resourceLocator = require('./resource-locator');

class Installer {
  async getCoreVersion() {
    try {
      // Always use package.json version
      const packagePath = path.join(__dirname, '..', '..', '..', 'package.json');
      const packageJson = require(packagePath);
      return packageJson.version;
    } catch {
      console.warn("Could not read version from package.json, using 'unknown'");
      return 'unknown';
    }
  }

  async install(config) {
    const spinner = ora('Analyzing installation directory...').start();

    try {
      // Store the original CWD where npx was executed
      const originalCwd = process.env.INIT_CWD || process.env.PWD || process.cwd();

      // Resolve installation directory relative to where the user ran the command
      let installDir = path.isAbsolute(config.directory)
        ? config.directory
        : path.resolve(originalCwd, config.directory);

      if (path.basename(installDir) === '.bmad-core') {
        // If user points directly to .bmad-core, treat its parent as the project root
        installDir = path.dirname(installDir);
      }

      // Log resolved path for clarity
      if (!path.isAbsolute(config.directory)) {
        spinner.text = `Resolving "${config.directory}" to: ${installDir}`;
      }

      // Check if directory exists and handle non-existent directories
      if (!(await fileManager.pathExists(installDir))) {
        spinner.stop();
        console.log(`\nThe directory ${installDir} does not exist.`);

        const { action } = await inquirer.prompt([
          {
            type: 'list',
            name: 'action',
            message: 'What would you like to do?',
            choices: [
              {
                name: 'Create the directory and continue',
                value: 'create',
              },
              {
                name: 'Choose a different directory',
                value: 'change',
              },
              {
                name: 'Cancel installation',
                value: 'cancel',
              },
            ],
          },
        ]);

        switch (action) {
          case 'cancel': {
            console.log('Installation cancelled.');
            process.exit(0);

            break;
          }
          case 'change': {
            const { newDirectory } = await inquirer.prompt([
              {
                type: 'input',
                name: 'newDirectory',
                message: 'Enter the new directory path:',
                validate: (input) => {
                  if (!input.trim()) {
                    return 'Please enter a valid directory path';
                  }
                  return true;
                },
              },
            ]);
            // Preserve the original CWD for the recursive call
            config.directory = newDirectory;
            return await this.install(config); // Recursive call with new directory
          }
          case 'create': {
            try {
              await fileManager.ensureDirectory(installDir);
              console.log(`✓ Created directory: ${installDir}`);
            } catch (error) {
              console.error(`Failed to create directory: ${error.message}`);
              console.error('You may need to check permissions or use a different path.');
              process.exit(1);
            }

            break;
          }
          // No default
        }

        spinner.start('Analyzing installation directory...');
      }

      // If this is an update request from early detection, handle it directly
      if (config.installType === 'update') {
        const state = await this.detectInstallationState(installDir);
        if (state.type === 'v4_existing') {
          return await this.performUpdate(config, installDir, state.manifest, spinner);
        } else {
          spinner.fail('No existing v4 installation found to update');
          throw new Error('No existing v4 installation found');
        }
      }

      // Detect current state
      const state = await this.detectInstallationState(installDir);

      // Handle different states
      switch (state.type) {
        case 'clean': {
          return await this.performFreshInstall(config, installDir, spinner);
        }

        case 'v4_existing': {
          return await this.handleExistingV4Installation(config, installDir, state, spinner);
        }

        case 'v3_existing': {
          return await this.handleV3Installation(config, installDir, state, spinner);
        }

        case 'unknown_existing': {
          return await this.handleUnknownInstallation(config, installDir, state, spinner);
        }
      }
    } catch (error) {
      // Check if modules were initialized
      if (spinner) {
        spinner.fail('Installation failed');
      } else {
        console.error('Installation failed:', error.message);
      }
      throw error;
    }
  }

  async detectInstallationState(installDir) {
    const state = {
      type: 'clean',
      hasV4Manifest: false,
      hasV3Structure: false,
      hasBmadCore: false,
      hasOtherFiles: false,
      manifest: null,
      expansionPacks: {},
    };

    // Check if directory exists
    if (!(await fileManager.pathExists(installDir))) {
      return state; // clean install
    }

    // Check for V4 installation (has .bmad-core with manifest)
    const bmadCorePath = path.join(installDir, '.bmad-core');
    const manifestPath = path.join(bmadCorePath, 'install-manifest.yaml');

    if (await fileManager.pathExists(manifestPath)) {
      state.type = 'v4_existing';
      state.hasV4Manifest = true;
      state.hasBmadCore = true;
      state.manifest = await fileManager.readManifest(installDir);
      return state;
    }

    // Check for V3 installation (has bmad-agent directory)
    const bmadAgentPath = path.join(installDir, 'bmad-agent');
    if (await fileManager.pathExists(bmadAgentPath)) {
      state.type = 'v3_existing';
      state.hasV3Structure = true;
      return state;
    }

    // Check for .bmad-core without manifest (broken V4 or manual copy)
    if (await fileManager.pathExists(bmadCorePath)) {
      state.type = 'unknown_existing';
      state.hasBmadCore = true;
      return state;
    }

    // Check if directory has other files
    const files = await resourceLocator.findFiles('**/*', {
      cwd: installDir,
      nodir: true,
      ignore: ['**/.git/**', '**/node_modules/**'],
    });

    if (files.length > 0) {
      // Directory has other files, but no BMad installation.
      // Treat as clean install but record that it isn't empty.
      state.hasOtherFiles = true;
    }

    // Check for expansion packs (folders starting with .)
    const expansionPacks = await this.detectExpansionPacks(installDir);
    state.expansionPacks = expansionPacks;

    return state; // clean install
  }

  async performFreshInstall(config, installDir, spinner, options = {}) {
    spinner.text = 'Installing BMad Method...';

    let files = [];

    switch (config.installType) {
      case 'full': {
        // Full installation - copy entire .bmad-core folder as a subdirectory
        spinner.text = 'Copying complete .bmad-core folder...';
        const sourceDir = resourceLocator.getBmadCorePath();
        const bmadCoreDestDir = path.join(installDir, '.bmad-core');
        await fileManager.copyDirectoryWithRootReplacement(
          sourceDir,
          bmadCoreDestDir,
          '.bmad-core',
        );

        // Copy common/ items to .bmad-core
        spinner.text = 'Copying common utilities...';
        await this.copyCommonItems(installDir, '.bmad-core', spinner);

        // Copy documentation files from docs/ to .bmad-core
        spinner.text = 'Copying documentation files...';
        await this.copyDocsItems(installDir, '.bmad-core', spinner);

        // Get list of all files for manifest
        const foundFiles = await resourceLocator.findFiles('**/*', {
          cwd: bmadCoreDestDir,
          nodir: true,
          ignore: ['**/.git/**', '**/node_modules/**'],
        });
        files = foundFiles.map((file) => path.join('.bmad-core', file));

        break;
      }
      case 'single-agent': {
        // Single agent installation
        spinner.text = `Installing ${config.agent} agent...`;

        // Copy agent file with {root} replacement
        const agentPath = configLoader.getAgentPath(config.agent);
        const destinationAgentPath = path.join(
          installDir,
          '.bmad-core',
          'agents',
          `${config.agent}.md`,
        );
        await fileManager.copyFileWithRootReplacement(
          agentPath,
          destinationAgentPath,
          '.bmad-core',
        );
        files.push(`.bmad-core/agents/${config.agent}.md`);

        // Copy dependencies
        const { all: dependencies } = await resourceLocator.getAgentDependencies(config.agent);
        const sourceBase = resourceLocator.getBmadCorePath();

        for (const dep of dependencies) {
          spinner.text = `Copying dependency: ${dep}`;

          if (dep.includes('*')) {
            // Handle glob patterns with {root} replacement
            const copiedFiles = await fileManager.copyGlobPattern(
              dep.replace('.bmad-core/', ''),
              sourceBase,
              path.join(installDir, '.bmad-core'),
              '.bmad-core',
            );
            files.push(...copiedFiles.map((f) => `.bmad-core/${f}`));
          } else {
            // Handle single files with {root} replacement if needed
            const sourcePath = path.join(sourceBase, dep.replace('.bmad-core/', ''));
            const destinationPath = path.join(installDir, dep);

            const needsRootReplacement =
              dep.endsWith('.md') || dep.endsWith('.yaml') || dep.endsWith('.yml');
            let success = false;

            success = await (needsRootReplacement
              ? fileManager.copyFileWithRootReplacement(sourcePath, destinationPath, '.bmad-core')
              : fileManager.copyFile(sourcePath, destinationPath));

            if (success) {
              files.push(dep);
            }
          }
        }

        // Copy common/ items to .bmad-core
        spinner.text = 'Copying common utilities...';
        const commonFiles = await this.copyCommonItems(installDir, '.bmad-core', spinner);
        files.push(...commonFiles);

        // Copy documentation files from docs/ to .bmad-core
        spinner.text = 'Copying documentation files...';
        const documentFiles = await this.copyDocsItems(installDir, '.bmad-core', spinner);
        files.push(...documentFiles);

        break;
      }
      case 'team': {
        // Team installation
        spinner.text = `Installing ${config.team} team...`;

        // Get team dependencies
        const teamDependencies = await configLoader.getTeamDependencies(config.team);
        const sourceBase = resourceLocator.getBmadCorePath();

        // Install all team dependencies
        for (const dep of teamDependencies) {
          spinner.text = `Copying team dependency: ${dep}`;

          if (dep.includes('*')) {
            // Handle glob patterns with {root} replacement
            const copiedFiles = await fileManager.copyGlobPattern(
              dep.replace('.bmad-core/', ''),
              sourceBase,
              path.join(installDir, '.bmad-core'),
              '.bmad-core',
            );
            files.push(...copiedFiles.map((f) => `.bmad-core/${f}`));
          } else {
            // Handle single files with {root} replacement if needed
            const sourcePath = path.join(sourceBase, dep.replace('.bmad-core/', ''));
            const destinationPath = path.join(installDir, dep);

            const needsRootReplacement =
              dep.endsWith('.md') || dep.endsWith('.yaml') || dep.endsWith('.yml');
            let success = false;

            success = await (needsRootReplacement
              ? fileManager.copyFileWithRootReplacement(sourcePath, destinationPath, '.bmad-core')
              : fileManager.copyFile(sourcePath, destinationPath));

            if (success) {
              files.push(dep);
            }
          }
        }

        // Copy common/ items to .bmad-core
        spinner.text = 'Copying common utilities...';
        const commonFiles = await this.copyCommonItems(installDir, '.bmad-core', spinner);
        files.push(...commonFiles);

        // Copy documentation files from docs/ to .bmad-core
        spinner.text = 'Copying documentation files...';
        const documentFiles = await this.copyDocsItems(installDir, '.bmad-core', spinner);
        files.push(...documentFiles);

        break;
      }
      case 'expansion-only': {
        // Expansion-only installation - DO NOT create .bmad-core
        // Only install expansion packs
        spinner.text = 'Installing expansion packs only...';

        break;
      }
      // No default
    }

    // Install expansion packs if requested
    const expansionFiles = await this.installExpansionPacks(
      installDir,
      config.expansionPacks,
      spinner,
      config,
    );
    files.push(...expansionFiles);

    // Install web bundles if requested
    if (config.includeWebBundles && config.webBundlesDirectory) {
      spinner.text = 'Installing web bundles...';
      // Resolve web bundles directory using the same logic as the main installation directory
      const originalCwd = process.env.INIT_CWD || process.env.PWD || process.cwd();
      let resolvedWebBundlesDir = path.isAbsolute(config.webBundlesDirectory)
        ? config.webBundlesDirectory
        : path.resolve(originalCwd, config.webBundlesDirectory);
      await this.installWebBundles(resolvedWebBundlesDir, config, spinner);
    }

    // Set up IDE integration if requested
    const ides = config.ides || (config.ide ? [config.ide] : []);
    if (ides.length > 0) {
      for (const ide of ides) {
        spinner.text = `Setting up ${ide} integration...`;
        let preConfiguredSettings = null;
        switch (ide) {
          case 'github-copilot': {
            preConfiguredSettings = config.githubCopilotConfig;
            break;
          }
          case 'auggie-cli': {
            preConfiguredSettings = config.augmentCodeConfig;
            break;
          }
          case 'opencode': {
            preConfiguredSettings = config.openCodeConfig;
            break;
          }
          default: {
            // no pre-configured settings
            break;
          }
        }
        await ideSetup.setup(ide, installDir, config.agent, spinner, preConfiguredSettings);
      }
    }

    // Modify core-config.yaml if sharding preferences were provided
    if (
      config.installType !== 'expansion-only' &&
      (config.prdSharded !== undefined || config.architectureSharded !== undefined)
    ) {
      spinner.text = 'Configuring document sharding settings...';
      await fileManager.modifyCoreConfig(installDir, config);
    }

    // Create manifest (skip for expansion-only installations)
    if (config.installType !== 'expansion-only') {
      spinner.text = 'Creating installation manifest...';
      await fileManager.createManifest(installDir, config, files);
    }

    spinner.succeed('Installation complete!');
    this.showSuccessMessage(config, installDir, options);
  }

  async handleExistingV4Installation(config, installDir, state, spinner) {
    spinner.stop();

    const currentVersion = state.manifest.version;
    const newVersion = await this.getCoreVersion();
    const versionCompare = this.compareVersions(currentVersion, newVersion);

    console.log(chalk.yellow('\n🔍 Found existing BMad v4 installation'));
    console.log(`   Directory: ${installDir}`);
    console.log(`   Current version: ${currentVersion}`);
    console.log(`   Available version: ${newVersion}`);
    console.log(`   Installed: ${new Date(state.manifest.installed_at).toLocaleDateString()}`);

    // Check file integrity
    spinner.start('Checking installation integrity...');
    const integrity = await fileManager.checkFileIntegrity(installDir, state.manifest);
    spinner.stop();

    const hasMissingFiles = integrity.missing.length > 0;
    const hasModifiedFiles = integrity.modified.length > 0;
    const hasIntegrityIssues = hasMissingFiles || hasModifiedFiles;

    if (hasIntegrityIssues) {
      console.log(chalk.red('\n⚠️  Installation issues detected:'));
      if (hasMissingFiles) {
        console.log(chalk.red(`   Missing files: ${integrity.missing.length}`));
        if (integrity.missing.length <= 5) {
          for (const file of integrity.missing) console.log(chalk.dim(`     - ${file}`));
        }
      }
      if (hasModifiedFiles) {
        console.log(chalk.yellow(`   Modified files: ${integrity.modified.length}`));
        if (integrity.modified.length <= 5) {
          for (const file of integrity.modified) console.log(chalk.dim(`     - ${file}`));
        }
      }
    }

    // Show existing expansion packs
    if (Object.keys(state.expansionPacks).length > 0) {
      console.log(chalk.cyan('\n📦 Installed expansion packs:'));
      for (const [packId, packInfo] of Object.entries(state.expansionPacks)) {
        if (packInfo.hasManifest && packInfo.manifest) {
          console.log(`   - ${packId} (v${packInfo.manifest.version || 'unknown'})`);
        } else {
          console.log(`   - ${packId} (no manifest)`);
        }
      }
    }

    let choices = [];

    if (versionCompare < 0) {
      console.log(chalk.cyan('\n⬆️  Upgrade available for BMad core'));
      choices.push({
        name: `Upgrade BMad core (v${currentVersion} → v${newVersion})`,
        value: 'upgrade',
      });
    } else if (versionCompare === 0) {
      if (hasIntegrityIssues) {
        // Offer repair option when files are missing or modified
        choices.push({
          name: 'Repair installation (restore missing/modified files)',
          value: 'repair',
        });
      }
      console.log(chalk.yellow('\n⚠️  Same version already installed'));
      choices.push({
        name: `Force reinstall BMad core (v${currentVersion} - reinstall)`,
        value: 'reinstall',
      });
    } else {
      console.log(chalk.yellow('\n⬇️  Installed version is newer than available'));
      choices.push({
        name: `Downgrade BMad core (v${currentVersion} → v${newVersion})`,
        value: 'reinstall',
      });
    }

    choices.push(
      { name: 'Add/update expansion packs only', value: 'expansions' },
      { name: 'Cancel', value: 'cancel' },
    );

    const { action } = await inquirer.prompt([
      {
        type: 'list',
        name: 'action',
        message: 'What would you like to do?',
        choices: choices,
      },
    ]);

    switch (action) {
      case 'upgrade': {
        return await this.performUpdate(config, installDir, state.manifest, spinner);
      }
      case 'repair': {
        // For repair, restore missing/modified files while backing up modified ones
        return await this.performRepair(config, installDir, state.manifest, integrity, spinner);
      }
      case 'reinstall': {
        // For reinstall, don't check for modifications - just overwrite
        return await this.performReinstall(config, installDir, spinner);
      }
      case 'expansions': {
        // Ask which expansion packs to install
        const availableExpansionPacks = await resourceLocator.getExpansionPacks();

        if (availableExpansionPacks.length === 0) {
          console.log(chalk.yellow('No expansion packs available.'));
          return;
        }

        const { selectedPacks } = await inquirer.prompt([
          {
            type: 'checkbox',
            name: 'selectedPacks',
            message: 'Select expansion packs to install/update:',
            choices: availableExpansionPacks.map((pack) => ({
              name: `${pack.name} (v${pack.version}) .${pack.id}`,
              value: pack.id,
              checked: state.expansionPacks[pack.id] !== undefined,
            })),
          },
        ]);

        if (selectedPacks.length === 0) {
          console.log(chalk.yellow('No expansion packs selected.'));
          return;
        }

        spinner.start('Installing expansion packs...');
        const expansionFiles = await this.installExpansionPacks(
          installDir,
          selectedPacks,
          spinner,
          { ides: config.ides || [] },
        );
        spinner.succeed('Expansion packs installed successfully!');

        console.log(chalk.green('\n✓ Installation complete!'));
        console.log(chalk.green(`✓ Expansion packs installed/updated:`));
        for (const packId of selectedPacks) {
          console.log(chalk.green(`  - ${packId} → .${packId}/`));
        }
        return;
      }
      case 'cancel': {
        console.log('Installation cancelled.');
        return;
      }
    }
  }

  async handleV3Installation(config, installDir, state, spinner) {
    spinner.stop();

    console.log(chalk.yellow('\n🔍 Found BMad v3 installation (bmad-agent/ directory)'));
    console.log(`   Directory: ${installDir}`);

    const { action } = await inquirer.prompt([
      {
        type: 'list',
        name: 'action',
        message: 'What would you like to do?',
        choices: [
          { name: 'Upgrade from v3 to v4 (recommended)', value: 'upgrade' },
          { name: 'Install v4 alongside v3', value: 'alongside' },
          { name: 'Cancel', value: 'cancel' },
        ],
      },
    ]);

    switch (action) {
      case 'upgrade': {
        console.log(chalk.cyan('\n📦 Starting v3 to v4 upgrade process...'));
        const V3ToV4Upgrader = require('../../upgraders/v3-to-v4-upgrader');
        const upgrader = new V3ToV4Upgrader();
        return await upgrader.upgrade({
          projectPath: installDir,
          ides: config.ides || [], // Pass IDE selections from initial config
        });
      }
      case 'alongside': {
        return await this.performFreshInstall(config, installDir, spinner);
      }
      case 'cancel': {
        console.log('Installation cancelled.');
        return;
      }
    }
  }

  async handleUnknownInstallation(config, installDir, state, spinner) {
    spinner.stop();

    console.log(chalk.yellow('\n⚠️  Directory contains existing files'));
    console.log(`   Directory: ${installDir}`);

    if (state.hasBmadCore) {
      console.log('   Found: .bmad-core directory (but no manifest)');
    }
    if (state.hasOtherFiles) {
      console.log('   Found: Other files in directory');
    }

    const { action } = await inquirer.prompt([
      {
        type: 'list',
        name: 'action',
        message: 'What would you like to do?',
        choices: [
          { name: 'Install anyway (may overwrite files)', value: 'force' },
          { name: 'Choose different directory', value: 'different' },
          { name: 'Cancel', value: 'cancel' },
        ],
      },
    ]);

    switch (action) {
      case 'force': {
        return await this.performFreshInstall(config, installDir, spinner);
      }
      case 'different': {
        const { newDir } = await inquirer.prompt([
          {
            type: 'input',
            name: 'newDir',
            message: 'Enter new installation directory:',
            default: path.join(path.dirname(installDir), 'bmad-project'),
          },
        ]);
        config.directory = newDir;
        return await this.install(config);
      }
      case 'cancel': {
        console.log('Installation cancelled.');
        return;
      }
    }
  }

  async performUpdate(newConfig, installDir, manifest, spinner) {
    spinner.start('Checking for updates...');

    try {
      // Get current and new versions
      const currentVersion = manifest.version;
      const newVersion = await this.getCoreVersion();
      const versionCompare = this.compareVersions(currentVersion, newVersion);

      // Only check for modified files if it's an actual version upgrade
      let modifiedFiles = [];
      if (versionCompare !== 0) {
        spinner.text = 'Checking for modified files...';
        modifiedFiles = await fileManager.checkModifiedFiles(installDir, manifest);
      }

      if (modifiedFiles.length > 0) {
        spinner.warn('Found modified files');
        console.log(chalk.yellow('\nThe following files have been modified:'));
        for (const file of modifiedFiles) {
          console.log(`  - ${file}`);
        }

        const { action } = await inquirer.prompt([
          {
            type: 'list',
            name: 'action',
            message: 'How would you like to proceed?',
            choices: [
              { name: 'Backup and overwrite modified files', value: 'backup' },
              { name: 'Skip modified files', value: 'skip' },
              { name: 'Cancel update', value: 'cancel' },
            ],
          },
        ]);

        if (action === 'cancel') {
          console.log('Update cancelled.');
          return;
        }

        if (action === 'backup') {
          spinner.start('Backing up modified files...');
          for (const file of modifiedFiles) {
            const filePath = path.join(installDir, file);
            const backupPath = await fileManager.backupFile(filePath);
            console.log(chalk.dim(`  Backed up: ${file} → ${path.basename(backupPath)}`));
          }
        }
      }

      // Perform update by re-running installation
      spinner.text = versionCompare === 0 ? 'Reinstalling files...' : 'Updating files...';
      const config = {
        installType: manifest.install_type,
        agent: manifest.agent,
        directory: installDir,
        ides: newConfig?.ides || manifest.ides_setup || [],
      };

      await this.performFreshInstall(config, installDir, spinner, { isUpdate: true });

      // Clean up .yml files that now have .yaml counterparts
      spinner.text = 'Cleaning up legacy .yml files...';
      await this.cleanupLegacyYmlFiles(installDir, spinner);
    } catch (error) {
      spinner.fail('Update failed');
      throw error;
    }
  }

  async performRepair(config, installDir, manifest, integrity, spinner) {
    spinner.start('Preparing to repair installation...');

    try {
      // Back up modified files
      if (integrity.modified.length > 0) {
        spinner.text = 'Backing up modified files...';
        for (const file of integrity.modified) {
          const filePath = path.join(installDir, file);
          if (await fileManager.pathExists(filePath)) {
            const backupPath = await fileManager.backupFile(filePath);
            console.log(chalk.dim(`  Backed up: ${file} → ${path.basename(backupPath)}`));
          }
        }
      }

      // Restore missing and modified files
      spinner.text = 'Restoring files...';
      const sourceBase = resourceLocator.getBmadCorePath();
      const filesToRestore = [...integrity.missing, ...integrity.modified];

      for (const file of filesToRestore) {
        // Skip the manifest file itself
        if (file.endsWith('install-manifest.yaml')) continue;

        const relativePath = file.replace('.bmad-core/', '');
        const destinationPath = path.join(installDir, file);

        // Check if this is a common/ file that needs special processing
        const commonBase = path.dirname(path.dirname(path.dirname(path.dirname(__filename))));
        const commonSourcePath = path.join(commonBase, 'common', relativePath);

        if (await fileManager.pathExists(commonSourcePath)) {
          // This is a common/ file - needs template processing
          const fs = require('node:fs').promises;
          const content = await fs.readFile(commonSourcePath, 'utf8');
          const updatedContent = content.replaceAll('{root}', '.bmad-core');
          await fileManager.ensureDirectory(path.dirname(destinationPath));
          await fs.writeFile(destinationPath, updatedContent, 'utf8');
          spinner.text = `Restored: ${file}`;
        } else {
          // Regular file from bmad-core
          const sourcePath = path.join(sourceBase, relativePath);
          if (await fileManager.pathExists(sourcePath)) {
            await fileManager.copyFile(sourcePath, destinationPath);
            spinner.text = `Restored: ${file}`;

            // If this is a .yaml file, check for and remove corresponding .yml file
            if (file.endsWith('.yaml')) {
              const ymlFile = file.replace(/\.yaml$/, '.yml');
              const ymlPath = path.join(installDir, ymlFile);
              if (await fileManager.pathExists(ymlPath)) {
                const fs = require('node:fs').promises;
                await fs.unlink(ymlPath);
                console.log(chalk.dim(`  Removed legacy: ${ymlFile} (replaced by ${file})`));
              }
            }
          } else {
            console.warn(chalk.yellow(`  Warning: Source file not found: ${file}`));
          }
        }
      }

      // Clean up .yml files that now have .yaml counterparts
      spinner.text = 'Cleaning up legacy .yml files...';
      await this.cleanupLegacyYmlFiles(installDir, spinner);

      spinner.succeed('Repair completed successfully!');

      // Show summary
      console.log(chalk.green('\n✓ Installation repaired!'));
      if (integrity.missing.length > 0) {
        console.log(chalk.green(`  Restored ${integrity.missing.length} missing files`));
      }
      if (integrity.modified.length > 0) {
        console.log(
          chalk.green(`  Restored ${integrity.modified.length} modified files (backups created)`),
        );
      }

      // Warning for Cursor custom modes if agents were repaired
      const ides = manifest.ides_setup || [];
      if (ides.includes('cursor')) {
        console.log(chalk.yellow.bold('\n⚠️  IMPORTANT: Cursor Custom Modes Update Required'));
        console.log(
          chalk.yellow(
            'Since agent files have been repaired, you need to update any custom agent modes configured in the Cursor custom agent GUI per the Cursor docs.',
          ),
        );
      }
    } catch (error) {
      spinner.fail('Repair failed');
      throw error;
    }
  }

  async performReinstall(config, installDir, spinner) {
    spinner.start('Preparing to reinstall BMad Method...');

    // Remove existing .bmad-core
    const bmadCorePath = path.join(installDir, '.bmad-core');
    if (await fileManager.pathExists(bmadCorePath)) {
      spinner.text = 'Removing existing installation...';
      await fileManager.removeDirectory(bmadCorePath);
    }

    spinner.text = 'Installing fresh copy...';
    const result = await this.performFreshInstall(config, installDir, spinner, { isUpdate: true });

    // Clean up .yml files that now have .yaml counterparts
    spinner.text = 'Cleaning up legacy .yml files...';
    await this.cleanupLegacyYmlFiles(installDir, spinner);

    return result;
  }

  showSuccessMessage(config, installDir, options = {}) {
    console.log(chalk.green('\n✓ BMad Method installed successfully!\n'));

    const ides = config.ides || (config.ide ? [config.ide] : []);
    if (ides.length > 0) {
      for (const ide of ides) {
        const ideConfig = configLoader.getIdeConfiguration(ide);
        if (ideConfig?.instructions) {
          console.log(chalk.bold(`To use BMad agents in ${ideConfig.name}:`));
          console.log(ideConfig.instructions);
        }
      }
    } else {
      console.log(chalk.yellow('No IDE configuration was set up.'));
      console.log('You can manually configure your IDE using the agent files in:', installDir);
    }

    // Information about installation components
    console.log(chalk.bold('\n🎯 Installation Summary:'));
    if (config.installType !== 'expansion-only') {
      console.log(chalk.green('✓ .bmad-core framework installed with all agents and workflows'));
    }

    if (config.expansionPacks && config.expansionPacks.length > 0) {
      console.log(chalk.green(`✓ Expansion packs installed:`));
      for (const packId of config.expansionPacks) {
        console.log(chalk.green(`  - ${packId} → .${packId}/`));
      }
    }

    if (config.includeWebBundles && config.webBundlesDirectory) {
      const bundleInfo = this.getWebBundleInfo(config);
      // Resolve the web bundles directory for display
      const originalCwd = process.env.INIT_CWD || process.env.PWD || process.cwd();
      const resolvedWebBundlesDir = path.isAbsolute(config.webBundlesDirectory)
        ? config.webBundlesDirectory
        : path.resolve(originalCwd, config.webBundlesDirectory);
      console.log(
        chalk.green(`✓ Web bundles (${bundleInfo}) installed to: ${resolvedWebBundlesDir}`),
      );
    }

    if (ides.length > 0) {
      const ideNames = ides
        .map((ide) => {
          const ideConfig = configLoader.getIdeConfiguration(ide);
          return ideConfig?.name || ide;
        })
        .join(', ');
      console.log(chalk.green(`✓ IDE rules and configurations set up for: ${ideNames}`));
    }

    // Information about web bundles
    if (!config.includeWebBundles) {
      console.log(chalk.bold('\n📦 Web Bundles Available:'));
      console.log('Pre-built web bundles are available and can be added later:');
      console.log(chalk.cyan('  Run the installer again to add them to your project'));
      console.log('These bundles work independently and can be shared, moved, or used');
      console.log('in other projects as standalone files.');
    }

    if (config.installType === 'single-agent') {
      console.log(chalk.dim('\nNeed other agents? Run: npx bmad-method install --agent=<name>'));
      console.log(chalk.dim('Need everything? Run: npx bmad-method install --full'));
    }

    // Warning for Cursor custom modes if agents were updated
    if (options.isUpdate && ides.includes('cursor')) {
      console.log(chalk.yellow.bold('\n⚠️  IMPORTANT: Cursor Custom Modes Update Required'));
      console.log(
        chalk.yellow(
          'Since agents have been updated, you need to update any custom agent modes configured in the Cursor custom agent GUI per the Cursor docs.',
        ),
      );
    }

    // Important notice to read the user guide
    console.log(
      chalk.red.bold(
        '\n📖 IMPORTANT: Please read the user guide at docs/user-guide.md (also installed at .bmad-core/user-guide.md)',
      ),
    );
    console.log(
      chalk.red(
        'This guide contains essential information about the BMad workflow and how to use the agents effectively.',
      ),
    );
  }

  // Legacy method for backward compatibility
  async update() {
    console.log(chalk.yellow('The "update" command is deprecated.'));
    console.log(
      'Please use "install" instead - it will detect and offer to update existing installations.',
    );

    const installDir = await this.findInstallation();
    if (installDir) {
      const config = {
        installType: 'full',
        directory: path.dirname(installDir),
        ide: null,
      };
      return await this.install(config);
    }
    console.log(chalk.red('No BMad installation found.'));
  }

  async listAgents() {
    const agents = await resourceLocator.getAvailableAgents();

    console.log(chalk.bold('\nAvailable BMad Agents:\n'));

    for (const agent of agents) {
      console.log(chalk.cyan(`  ${agent.id.padEnd(20)}`), agent.description);
    }

    console.log(chalk.dim('\nInstall with: npx bmad-method install --agent=<id>\n'));
  }

  async listExpansionPacks() {
    const expansionPacks = await resourceLocator.getExpansionPacks();

    console.log(chalk.bold('\nAvailable BMad Expansion Packs:\n'));

    if (expansionPacks.length === 0) {
      console.log(chalk.yellow('No expansion packs found.'));
      return;
    }

    for (const pack of expansionPacks) {
      console.log(chalk.cyan(`  ${pack.id.padEnd(20)}`), `${pack.name} v${pack.version}`);
      console.log(chalk.dim(`  ${' '.repeat(22)}${pack.description}`));
      if (pack.author && pack.author !== 'Unknown') {
        console.log(chalk.dim(`  ${' '.repeat(22)}by ${pack.author}`));
      }
      console.log();
    }

    console.log(chalk.dim('Install with: npx bmad-method install --full --expansion-packs <id>\n'));
  }

  async showStatus() {
    const installDir = await this.findInstallation();

    if (!installDir) {
      console.log(chalk.yellow('No BMad installation found in current directory tree'));
      return;
    }

    const manifest = await fileManager.readManifest(installDir);

    if (!manifest) {
      console.log(chalk.red('Invalid installation - manifest not found'));
      return;
    }

    console.log(chalk.bold('\nBMad Installation Status:\n'));
    console.log(`  Directory:      ${installDir}`);
    console.log(`  Version:        ${manifest.version}`);
    console.log(`  Installed:      ${new Date(manifest.installed_at).toLocaleDateString()}`);
    console.log(`  Type:           ${manifest.install_type}`);

    if (manifest.agent) {
      console.log(`  Agent:          ${manifest.agent}`);
    }

    if (manifest.ides_setup && manifest.ides_setup.length > 0) {
      console.log(`  IDE Setup:      ${manifest.ides_setup.join(', ')}`);
    }

    console.log(`  Total Files:    ${manifest.files.length}`);

    // Check for modifications
    const modifiedFiles = await fileManager.checkModifiedFiles(installDir, manifest);
    if (modifiedFiles.length > 0) {
      console.log(chalk.yellow(`  Modified Files: ${modifiedFiles.length}`));
    }

    console.log('');
  }

  async getAvailableAgents() {
    return resourceLocator.getAvailableAgents();
  }

  async getAvailableExpansionPacks() {
    return resourceLocator.getExpansionPacks();
  }

  async getAvailableTeams() {
    return configLoader.getAvailableTeams();
  }

  async installExpansionPacks(installDir, selectedPacks, spinner, config = {}) {
    if (!selectedPacks || selectedPacks.length === 0) {
      return [];
    }

    const installedFiles = [];

    for (const packId of selectedPacks) {
      spinner.text = `Installing expansion pack: ${packId}...`;

      try {
        const expansionPacks = await resourceLocator.getExpansionPacks();
        const pack = expansionPacks.find((p) => p.id === packId);

        if (!pack) {
          console.warn(`Expansion pack ${packId} not found, skipping...`);
          continue;
        }

        // Check if expansion pack already exists
        let expansionDotFolder = path.join(installDir, `.${packId}`);
        const existingManifestPath = path.join(expansionDotFolder, 'install-manifest.yaml');

        if (await fileManager.pathExists(existingManifestPath)) {
          spinner.stop();
          const existingManifest = await fileManager.readExpansionPackManifest(installDir, packId);

          console.log(chalk.yellow(`\n🔍 Found existing ${pack.name} installation`));
          console.log(`   Current version: ${existingManifest.version || 'unknown'}`);
          console.log(`   New version: ${pack.version}`);

          // Check integrity of existing expansion pack
          const packIntegrity = await fileManager.checkFileIntegrity(installDir, existingManifest);
          const hasPackIntegrityIssues =
            packIntegrity.missing.length > 0 || packIntegrity.modified.length > 0;

          if (hasPackIntegrityIssues) {
            console.log(chalk.red('   ⚠️  Installation issues detected:'));
            if (packIntegrity.missing.length > 0) {
              console.log(chalk.red(`     Missing files: ${packIntegrity.missing.length}`));
            }
            if (packIntegrity.modified.length > 0) {
              console.log(chalk.yellow(`     Modified files: ${packIntegrity.modified.length}`));
            }
          }

          const versionCompare = this.compareVersions(
            existingManifest.version || '0.0.0',
            pack.version,
          );

          if (versionCompare === 0) {
            console.log(chalk.yellow('   ⚠️  Same version already installed'));

            const choices = [];
            if (hasPackIntegrityIssues) {
              choices.push({ name: 'Repair (restore missing/modified files)', value: 'repair' });
            }
            choices.push(
              { name: 'Force reinstall (overwrite)', value: 'overwrite' },
              { name: 'Skip this expansion pack', value: 'skip' },
              { name: 'Cancel installation', value: 'cancel' },
            );

            const { action } = await inquirer.prompt([
              {
                type: 'list',
                name: 'action',
                message: `${pack.name} v${pack.version} is already installed. What would you like to do?`,
                choices: choices,
              },
            ]);

            switch (action) {
              case 'skip': {
                spinner.start();
                continue;

                break;
              }
              case 'cancel': {
                console.log('Installation cancelled.');
                process.exit(0);

                break;
              }
              case 'repair': {
                // Repair the expansion pack
                await this.repairExpansionPack(installDir, packId, pack, packIntegrity, spinner);
                continue;

                break;
              }
              // No default
            }
          } else if (versionCompare < 0) {
            console.log(chalk.cyan('   ⬆️  Upgrade available'));

            const { proceed } = await inquirer.prompt([
              {
                type: 'confirm',
                name: 'proceed',
                message: `Upgrade ${pack.name} from v${existingManifest.version} to v${pack.version}?`,
                default: true,
              },
            ]);

            if (!proceed) {
              spinner.start();
              continue;
            }
          } else {
            console.log(chalk.yellow('   ⬇️  Installed version is newer than available version'));

            const { action } = await inquirer.prompt([
              {
                type: 'list',
                name: 'action',
                message: 'What would you like to do?',
                choices: [
                  { name: 'Keep current version', value: 'skip' },
                  { name: 'Downgrade to available version', value: 'downgrade' },
                  { name: 'Cancel installation', value: 'cancel' },
                ],
              },
            ]);

            if (action === 'skip') {
              spinner.start();
              continue;
            } else if (action === 'cancel') {
              console.log('Installation cancelled.');
              process.exit(0);
            }
          }

          // If we get here, we're proceeding with installation
          spinner.start(`Removing old ${pack.name} installation...`);
          await fileManager.removeDirectory(expansionDotFolder);
        }

        const expansionPackDir = pack.path;

        // Ensure dedicated dot folder exists for this expansion pack
        expansionDotFolder = path.join(installDir, `.${packId}`);
        await fileManager.ensureDirectory(expansionDotFolder);

        // Define the folders to copy from expansion packs
        const foldersToSync = [
          'agents',
          'agent-teams',
          'templates',
          'tasks',
          'checklists',
          'workflows',
          'data',
          'utils',
          'schemas',
        ];

        // Copy each folder if it exists
        for (const folder of foldersToSync) {
          const sourceFolder = path.join(expansionPackDir, folder);

          // Check if folder exists in expansion pack
          if (await fileManager.pathExists(sourceFolder)) {
            // Get all files in this folder
            const files = await resourceLocator.findFiles('**/*', {
              cwd: sourceFolder,
              nodir: true,
            });

            // Copy each file to the expansion pack's dot folder with {root} replacement
            for (const file of files) {
              const sourcePath = path.join(sourceFolder, file);
              const destinationPath = path.join(expansionDotFolder, folder, file);

              const needsRootReplacement =
                file.endsWith('.md') || file.endsWith('.yaml') || file.endsWith('.yml');
              let success = false;

              success = await (needsRootReplacement
                ? fileManager.copyFileWithRootReplacement(sourcePath, destinationPath, `.${packId}`)
                : fileManager.copyFile(sourcePath, destinationPath));

              if (success) {
                installedFiles.push(path.join(`.${packId}`, folder, file));
              }
            }
          }
        }

        // Copy config.yaml with {root} replacement
        const configPath = path.join(expansionPackDir, 'config.yaml');
        if (await fileManager.pathExists(configPath)) {
          const configDestinationPath = path.join(expansionDotFolder, 'config.yaml');
          if (
            await fileManager.copyFileWithRootReplacement(
              configPath,
              configDestinationPath,
              `.${packId}`,
            )
          ) {
            installedFiles.push(path.join(`.${packId}`, 'config.yaml'));
          }
        }

        // Copy README if it exists with {root} replacement
        const readmePath = path.join(expansionPackDir, 'README.md');
        if (await fileManager.pathExists(readmePath)) {
          const readmeDestinationPath = path.join(expansionDotFolder, 'README.md');
          if (
            await fileManager.copyFileWithRootReplacement(
              readmePath,
              readmeDestinationPath,
              `.${packId}`,
            )
          ) {
            installedFiles.push(path.join(`.${packId}`, 'README.md'));
          }
        }

        // Copy common/ items to expansion pack folder
        spinner.text = `Copying common utilities to ${packId}...`;
        await this.copyCommonItems(installDir, `.${packId}`, spinner);

        // Check and resolve core dependencies
        await this.resolveExpansionPackCoreDependencies(
          installDir,
          expansionDotFolder,
          packId,
          pack,
          spinner,
        );

        // Check and resolve core agents referenced by teams
        await this.resolveExpansionPackCoreAgents(installDir, expansionDotFolder, packId, spinner);

        // Create manifest for this expansion pack
        spinner.text = `Creating manifest for ${packId}...`;
        const expansionConfig = {
          installType: 'expansion-pack',
          expansionPackId: packId,
          expansionPackName: pack.name,
          expansionPackVersion: pack.version,
          ides: config.ides || [], // Use ides_setup instead of ide_setup
        };

        // Get all files installed in this expansion pack
        const foundFiles = await resourceLocator.findFiles('**/*', {
          cwd: expansionDotFolder,
          nodir: true,
        });
        const expansionPackFiles = foundFiles.map((f) => path.join(`.${packId}`, f));

        await fileManager.createExpansionPackManifest(
          installDir,
          packId,
          expansionConfig,
          expansionPackFiles,
        );

        console.log(chalk.green(`✓ Installed expansion pack: ${pack.name} to ${`.${packId}`}`));
      } catch (error) {
        console.error(`Failed to install expansion pack ${packId}: ${error.message}`);
        console.error(`Stack trace: ${error.stack}`);
      }
    }

    return installedFiles;
  }

  async resolveExpansionPackCoreDependencies(
    installDir,
    expansionDotFolder,
    packId,
    pack,
    spinner,
  ) {
    const yaml = require('js-yaml');
    const fs = require('node:fs').promises;

    // Find all agent files in the expansion pack
    const agentFiles = await resourceLocator.findFiles('agents/*.md', {
      cwd: expansionDotFolder,
    });

    for (const agentFile of agentFiles) {
      const agentPath = path.join(expansionDotFolder, agentFile);
      const agentContent = await fs.readFile(agentPath, 'utf8');

      // Extract YAML frontmatter to check dependencies
      const yamlContent = extractYamlFromAgent(agentContent);
      if (yamlContent) {
        try {
          const agentConfig = yaml.load(yamlContent);
          const dependencies = agentConfig.dependencies || {};

          // Check for core dependencies (those that don't exist in the expansion pack)
          for (const depType of [
            'tasks',
            'templates',
            'checklists',
            'workflows',
            'utils',
            'data',
          ]) {
            const deps = dependencies[depType] || [];

            for (const dep of deps) {
              const depFileName =
                dep.endsWith('.md') || dep.endsWith('.yaml')
                  ? dep
                  : depType === 'templates'
                    ? `${dep}.yaml`
                    : `${dep}.md`;
              const expansionDepPath = path.join(expansionDotFolder, depType, depFileName);

              // Check if dependency exists in expansion pack dot folder
              if (!(await fileManager.pathExists(expansionDepPath))) {
                // Try to find it in expansion pack source
                const sourceDepPath = path.join(pack.path, depType, depFileName);

                if (await fileManager.pathExists(sourceDepPath)) {
                  // Copy from expansion pack source
                  spinner.text = `Copying ${packId} dependency ${dep}...`;
                  const destinationPath = path.join(expansionDotFolder, depType, depFileName);
                  await fileManager.copyFileWithRootReplacement(
                    sourceDepPath,
                    destinationPath,
                    `.${packId}`,
                  );
                  console.log(chalk.dim(`  Added ${packId} dependency: ${depType}/${depFileName}`));
                } else {
                  // Try to find it in core
                  const coreDepPath = path.join(
                    resourceLocator.getBmadCorePath(),
                    depType,
                    depFileName,
                  );

                  if (await fileManager.pathExists(coreDepPath)) {
                    spinner.text = `Copying core dependency ${dep} for ${packId}...`;

                    // Copy from core to expansion pack dot folder with {root} replacement
                    const destinationPath = path.join(expansionDotFolder, depType, depFileName);
                    await fileManager.copyFileWithRootReplacement(
                      coreDepPath,
                      destinationPath,
                      `.${packId}`,
                    );

                    console.log(chalk.dim(`  Added core dependency: ${depType}/${depFileName}`));
                  } else {
                    console.warn(
                      chalk.yellow(
                        `  Warning: Dependency ${depType}/${dep} not found in core or expansion pack`,
                      ),
                    );
                  }
                }
              }
            }
          }
        } catch (error) {
          console.warn(`  Warning: Could not parse agent dependencies: ${error.message}`);
        }
      }
    }
  }

  async resolveExpansionPackCoreAgents(installDir, expansionDotFolder, packId, spinner) {
    const yaml = require('js-yaml');
    const fs = require('node:fs').promises;

    // Find all team files in the expansion pack
    const teamFiles = await resourceLocator.findFiles('agent-teams/*.yaml', {
      cwd: expansionDotFolder,
    });

    // Also get existing agents in the expansion pack
    const existingAgents = new Set();
    const agentFiles = await resourceLocator.findFiles('agents/*.md', {
      cwd: expansionDotFolder,
    });
    for (const agentFile of agentFiles) {
      const agentName = path.basename(agentFile, '.md');
      existingAgents.add(agentName);
    }

    // Process each team file
    for (const teamFile of teamFiles) {
      const teamPath = path.join(expansionDotFolder, teamFile);
      const teamContent = await fs.readFile(teamPath, 'utf8');

      try {
        const teamConfig = yaml.load(teamContent);
        const agents = teamConfig.agents || [];

        // Add bmad-orchestrator if not present (required for all teams)
        if (!agents.includes('bmad-orchestrator')) {
          agents.unshift('bmad-orchestrator');
        }

        // Check each agent in the team
        for (const agentId of agents) {
          if (!existingAgents.has(agentId)) {
            // Agent not in expansion pack, try to get from core
            const coreAgentPath = path.join(
              resourceLocator.getBmadCorePath(),
              'agents',
              `${agentId}.md`,
            );

            if (await fileManager.pathExists(coreAgentPath)) {
              spinner.text = `Copying core agent ${agentId} for ${packId}...`;

              // Copy agent file with {root} replacement
              const destinationPath = path.join(expansionDotFolder, 'agents', `${agentId}.md`);
              await fileManager.copyFileWithRootReplacement(
                coreAgentPath,
                destinationPath,
                `.${packId}`,
              );
              existingAgents.add(agentId);

              console.log(chalk.dim(`  Added core agent: ${agentId}`));

              // Now resolve this agent's dependencies too
              const agentContent = await fs.readFile(coreAgentPath, 'utf8');
              const yamlContent = extractYamlFromAgent(agentContent, true);

              if (yamlContent) {
                try {
                  const agentConfig = yaml.load(yamlContent);
                  const dependencies = agentConfig.dependencies || {};

                  // Copy all dependencies for this agent
                  for (const depType of [
                    'tasks',
                    'templates',
                    'checklists',
                    'workflows',
                    'utils',
                    'data',
                  ]) {
                    const deps = dependencies[depType] || [];

                    for (const dep of deps) {
                      const depFileName =
                        dep.endsWith('.md') || dep.endsWith('.yaml')
                          ? dep
                          : depType === 'templates'
                            ? `${dep}.yaml`
                            : `${dep}.md`;
                      const expansionDepPath = path.join(expansionDotFolder, depType, depFileName);

                      // Check if dependency exists in expansion pack
                      if (!(await fileManager.pathExists(expansionDepPath))) {
                        // Try to find it in core
                        const coreDepPath = path.join(
                          resourceLocator.getBmadCorePath(),
                          depType,
                          depFileName,
                        );

                        if (await fileManager.pathExists(coreDepPath)) {
                          const destinationDepPath = path.join(
                            expansionDotFolder,
                            depType,
                            depFileName,
                          );
                          await fileManager.copyFileWithRootReplacement(
                            coreDepPath,
                            destinationDepPath,
                            `.${packId}`,
                          );
                          console.log(
                            chalk.dim(`    Added agent dependency: ${depType}/${depFileName}`),
                          );
                        } else {
                          // Try common folder
                          const sourceBase = path.dirname(
                            path.dirname(path.dirname(path.dirname(__filename))),
                          ); // Go up to project root
                          const commonDepPath = path.join(
                            sourceBase,
                            'common',
                            depType,
                            depFileName,
                          );
                          if (await fileManager.pathExists(commonDepPath)) {
                            const destinationDepPath = path.join(
                              expansionDotFolder,
                              depType,
                              depFileName,
                            );
                            await fileManager.copyFile(commonDepPath, destinationDepPath);
                            console.log(
                              chalk.dim(
                                `    Added agent dependency from common: ${depType}/${depFileName}`,
                              ),
                            );
                          }
                        }
                      }
                    }
                  }
                } catch (error) {
                  console.warn(
                    `  Warning: Could not parse agent ${agentId} dependencies: ${error.message}`,
                  );
                }
              }
            } else {
              console.warn(
                chalk.yellow(
                  `  Warning: Core agent ${agentId} not found for team ${path.basename(teamFile, '.yaml')}`,
                ),
              );
            }
          }
        }
      } catch (error) {
        console.warn(`  Warning: Could not parse team file ${teamFile}: ${error.message}`);
      }
    }
  }

  getWebBundleInfo(config) {
    const webBundleType = config.webBundleType || 'all';

    switch (webBundleType) {
      case 'all': {
        return 'all bundles';
      }
      case 'agents': {
        return 'individual agents only';
      }
      case 'teams': {
        return config.selectedWebBundleTeams
          ? `teams: ${config.selectedWebBundleTeams.join(', ')}`
          : 'selected teams';
      }
      case 'custom': {
        const parts = [];
        if (config.selectedWebBundleTeams && config.selectedWebBundleTeams.length > 0) {
          parts.push(`teams: ${config.selectedWebBundleTeams.join(', ')}`);
        }
        if (config.includeIndividualAgents) {
          parts.push('individual agents');
        }
        return parts.length > 0 ? parts.join(' + ') : 'custom selection';
      }
      default: {
        return 'selected bundles';
      }
    }
  }

  async installWebBundles(webBundlesDirectory, config, spinner) {
    try {
      // Find the dist directory in the BMad installation
      const distDir = configLoader.getDistPath();

      if (!(await fileManager.pathExists(distDir))) {
        console.warn('Web bundles not found. Run "npm run build" to generate them.');
        return;
      }

      // Ensure web bundles directory exists
      await fileManager.ensureDirectory(webBundlesDirectory);

      const webBundleType = config.webBundleType || 'all';

      if (webBundleType === 'all') {
        // Copy the entire dist directory structure
        await fileManager.copyDirectory(distDir, webBundlesDirectory);
        console.log(chalk.green(`✓ Installed all web bundles to: ${webBundlesDirectory}`));
      } else {
        let copiedCount = 0;

        // Copy specific selections based on type
        if (
          webBundleType === 'agents' ||
          (webBundleType === 'custom' && config.includeIndividualAgents)
        ) {
          const agentsSource = path.join(distDir, 'agents');
          const agentsTarget = path.join(webBundlesDirectory, 'agents');
          if (await fileManager.pathExists(agentsSource)) {
            await fileManager.copyDirectory(agentsSource, agentsTarget);
            console.log(chalk.green(`✓ Copied individual agent bundles`));
            copiedCount += 10; // Approximate count for agents
          }
        }

        if (
          (webBundleType === 'teams' || webBundleType === 'custom') &&
          config.selectedWebBundleTeams &&
          config.selectedWebBundleTeams.length > 0
        ) {
          const teamsSource = path.join(distDir, 'teams');
          const teamsTarget = path.join(webBundlesDirectory, 'teams');
          await fileManager.ensureDirectory(teamsTarget);

          for (const teamId of config.selectedWebBundleTeams) {
            const teamFile = `${teamId}.txt`;
            const sourcePath = path.join(teamsSource, teamFile);
            const targetPath = path.join(teamsTarget, teamFile);

            if (await fileManager.pathExists(sourcePath)) {
              await fileManager.copyFile(sourcePath, targetPath);
              copiedCount++;
              console.log(chalk.green(`✓ Copied team bundle: ${teamId}`));
            }
          }
        }

        // Always copy expansion packs if they exist
        const expansionSource = path.join(distDir, 'expansion-packs');
        const expansionTarget = path.join(webBundlesDirectory, 'expansion-packs');
        if (await fileManager.pathExists(expansionSource)) {
          await fileManager.copyDirectory(expansionSource, expansionTarget);
          console.log(chalk.green(`✓ Copied expansion pack bundles`));
        }

        console.log(
          chalk.green(`✓ Installed ${copiedCount} selected web bundles to: ${webBundlesDirectory}`),
        );
      }
    } catch (error) {
      console.error(`Failed to install web bundles: ${error.message}`);
    }
  }

  async copyCommonItems(installDir, targetSubdir, spinner) {
    const fs = require('node:fs').promises;
    const sourceBase = path.dirname(path.dirname(path.dirname(path.dirname(__filename)))); // Go up to project root
    const commonPath = path.join(sourceBase, 'common');
    const targetPath = path.join(installDir, targetSubdir);
    const copiedFiles = [];

    // Check if common/ exists
    if (!(await fileManager.pathExists(commonPath))) {
      console.warn('Warning: common/ folder not found');
      return copiedFiles;
    }

    // Copy all items from common/ to target
    const commonItems = await resourceLocator.findFiles('**/*', {
      cwd: commonPath,
      nodir: true,
    });

    for (const item of commonItems) {
      const sourcePath = path.join(commonPath, item);
      const destinationPath = path.join(targetPath, item);

      // Read the file content
      const content = await fs.readFile(sourcePath, 'utf8');

      // Replace {root} with the target subdirectory
      const updatedContent = content.replaceAll('{root}', targetSubdir);

      // Ensure directory exists
      await fileManager.ensureDirectory(path.dirname(destinationPath));

      // Write the updated content
      await fs.writeFile(destinationPath, updatedContent, 'utf8');
      copiedFiles.push(path.join(targetSubdir, item));
    }

    console.log(chalk.dim(`  Added ${commonItems.length} common utilities`));
    return copiedFiles;
  }

  async copyDocsItems(installDir, targetSubdir, spinner) {
    const fs = require('node:fs').promises;
    const sourceBase = path.dirname(path.dirname(path.dirname(path.dirname(__filename)))); // Go up to project root
    const docsPath = path.join(sourceBase, 'docs');
    const targetPath = path.join(installDir, targetSubdir);
    const copiedFiles = [];

    // Specific documentation files to copy
    const documentFiles = [
      'enhanced-ide-development-workflow.md',
      'user-guide.md',
      'working-in-the-brownfield.md',
    ];

    // Check if docs/ exists
    if (!(await fileManager.pathExists(docsPath))) {
      console.warn('Warning: docs/ folder not found');
      return copiedFiles;
    }

    // Copy specific documentation files from docs/ to target
    for (const documentFile of documentFiles) {
      const sourcePath = path.join(docsPath, documentFile);
      const destinationPath = path.join(targetPath, documentFile);

      // Check if the source file exists
      if (await fileManager.pathExists(sourcePath)) {
        // Read the file content
        const content = await fs.readFile(sourcePath, 'utf8');

        // Replace {root} with the target subdirectory
        const updatedContent = content.replaceAll('{root}', targetSubdir);

        // Ensure directory exists
        await fileManager.ensureDirectory(path.dirname(destinationPath));

        // Write the updated content
        await fs.writeFile(destinationPath, updatedContent, 'utf8');
        copiedFiles.push(path.join(targetSubdir, documentFile));
      }
    }

    if (copiedFiles.length > 0) {
      console.log(chalk.dim(`  Added ${copiedFiles.length} documentation files`));
    }
    return copiedFiles;
  }

  async detectExpansionPacks(installDir) {
    const expansionPacks = {};
    const glob = require('glob');

    // Find all dot folders that might be expansion packs
    const dotFolders = glob.sync('.*', {
      cwd: installDir,
      ignore: ['.git', '.git/**', '.bmad-core', '.bmad-core/**'],
    });

    for (const folder of dotFolders) {
      const folderPath = path.join(installDir, folder);
      const stats = await fileManager.pathExists(folderPath);

      if (stats) {
        // Check if it has a manifest
        const manifestPath = path.join(folderPath, 'install-manifest.yaml');
        if (await fileManager.pathExists(manifestPath)) {
          const manifest = await fileManager.readExpansionPackManifest(installDir, folder.slice(1));
          if (manifest) {
            expansionPacks[folder.slice(1)] = {
              path: folderPath,
              manifest: manifest,
              hasManifest: true,
            };
          }
        } else {
          // Check if it has a config.yaml (expansion pack without manifest)
          const configPath = path.join(folderPath, 'config.yaml');
          if (await fileManager.pathExists(configPath)) {
            expansionPacks[folder.slice(1)] = {
              path: folderPath,
              manifest: null,
              hasManifest: false,
            };
          }
        }
      }
    }

    return expansionPacks;
  }

  async repairExpansionPack(installDir, packId, pack, integrity, spinner) {
    spinner.start(`Repairing ${pack.name}...`);

    try {
      const expansionDotFolder = path.join(installDir, `.${packId}`);

      // Back up modified files
      if (integrity.modified.length > 0) {
        spinner.text = 'Backing up modified files...';
        for (const file of integrity.modified) {
          const filePath = path.join(installDir, file);
          if (await fileManager.pathExists(filePath)) {
            const backupPath = await fileManager.backupFile(filePath);
            console.log(chalk.dim(`  Backed up: ${file} → ${path.basename(backupPath)}`));
          }
        }
      }

      // Restore missing and modified files
      spinner.text = 'Restoring files...';
      const filesToRestore = [...integrity.missing, ...integrity.modified];

      for (const file of filesToRestore) {
        // Skip the manifest file itself
        if (file.endsWith('install-manifest.yaml')) continue;

        const relativePath = file.replace(`.${packId}/`, '');
        const sourcePath = path.join(pack.path, relativePath);
        const destinationPath = path.join(installDir, file);

        // Check if this is a common/ file that needs special processing
        const commonBase = path.dirname(path.dirname(path.dirname(path.dirname(__filename))));
        const commonSourcePath = path.join(commonBase, 'common', relativePath);

        if (await fileManager.pathExists(commonSourcePath)) {
          // This is a common/ file - needs template processing
          const fs = require('node:fs').promises;
          const content = await fs.readFile(commonSourcePath, 'utf8');
          const updatedContent = content.replaceAll('{root}', `.${packId}`);
          await fileManager.ensureDirectory(path.dirname(destinationPath));
          await fs.writeFile(destinationPath, updatedContent, 'utf8');
          spinner.text = `Restored: ${file}`;
        } else if (await fileManager.pathExists(sourcePath)) {
          // Regular file from expansion pack
          await fileManager.copyFile(sourcePath, destinationPath);
          spinner.text = `Restored: ${file}`;
        } else {
          console.warn(chalk.yellow(`  Warning: Source file not found: ${file}`));
        }
      }

      spinner.succeed(`${pack.name} repaired successfully!`);

      // Show summary
      console.log(chalk.green(`\n✓ ${pack.name} repaired!`));
      if (integrity.missing.length > 0) {
        console.log(chalk.green(`  Restored ${integrity.missing.length} missing files`));
      }
      if (integrity.modified.length > 0) {
        console.log(
          chalk.green(`  Restored ${integrity.modified.length} modified files (backups created)`),
        );
      }
    } catch (error) {
      if (spinner) spinner.fail(`Failed to repair ${pack.name}`);
      console.error(`Error: ${error.message}`);
    }
  }

  compareVersions(v1, v2) {
    // Simple semver comparison
    const parts1 = v1.split('.').map(Number);
    const parts2 = v2.split('.').map(Number);

    for (let index = 0; index < 3; index++) {
      const part1 = parts1[index] || 0;
      const part2 = parts2[index] || 0;

      if (part1 > part2) return 1;
      if (part1 < part2) return -1;
    }

    return 0;
  }

  async cleanupLegacyYmlFiles(installDir, spinner) {
    const glob = require('glob');
    const fs = require('node:fs').promises;

    try {
      // Find all .yml files in the installation directory
      const ymlFiles = glob.sync('**/*.yml', {
        cwd: installDir,
        ignore: ['**/node_modules/**', '**/.git/**'],
      });

      let deletedCount = 0;

      for (const ymlFile of ymlFiles) {
        // Check if corresponding .yaml file exists
        const yamlFile = ymlFile.replace(/\.yml$/, '.yaml');
        const ymlPath = path.join(installDir, ymlFile);
        const yamlPath = path.join(installDir, yamlFile);

        if (await fileManager.pathExists(yamlPath)) {
          // .yaml counterpart exists, delete the .yml file
          await fs.unlink(ymlPath);
          deletedCount++;
          console.log(chalk.dim(`  Removed legacy: ${ymlFile} (replaced by ${yamlFile})`));
        }
      }

      if (deletedCount > 0) {
        console.log(chalk.green(`✓ Cleaned up ${deletedCount} legacy .yml files`));
      }
    } catch (error) {
      console.warn(`Warning: Could not cleanup legacy .yml files: ${error.message}`);
    }
  }

  async findInstallation() {
    // Look for .bmad-core in current directory or parent directories
    let currentDir = process.cwd();

    while (currentDir !== path.dirname(currentDir)) {
      const bmadDir = path.join(currentDir, '.bmad-core');
      const manifestPath = path.join(bmadDir, 'install-manifest.yaml');

      if (await fileManager.pathExists(manifestPath)) {
        return currentDir; // Return parent directory, not .bmad-core itself
      }

      currentDir = path.dirname(currentDir);
    }

    // Also check if we're inside a .bmad-core directory
    if (path.basename(process.cwd()) === '.bmad-core') {
      const manifestPath = path.join(process.cwd(), 'install-manifest.yaml');
      if (await fileManager.pathExists(manifestPath)) {
        return path.dirname(process.cwd()); // Return parent directory
      }
    }

    return null;
  }

  async flatten(options) {
    const { spawn } = require('node:child_process');
    const flattenerPath = path.join(__dirname, '..', '..', 'flattener', 'main.js');

    const arguments_ = [];
    if (options.input) {
      arguments_.push('--input', options.input);
    }
    if (options.output) {
      arguments_.push('--output', options.output);
    }

    const child = spawn('node', [flattenerPath, ...arguments_], {
      stdio: 'inherit',
      cwd: process.cwd(),
    });

    child.on('exit', (code) => {
      process.exit(code);
    });
  }
}

module.exports = new Installer();
