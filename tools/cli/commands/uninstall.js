const path = require('node:path');
const fs = require('fs-extra');
const prompts = require('../lib/prompts');
const { Installer } = require('../installers/lib/core/installer');

const installer = new Installer();

module.exports = {
  command: 'uninstall',
  description: 'Remove BMAD installation from the current project',
  options: [
    ['-y, --yes', 'Remove all BMAD components without prompting (preserves user artifacts)'],
    ['--directory <path>', 'Project directory (default: current directory)'],
  ],
  action: async (options) => {
    try {
      let projectDir;

      if (options.directory) {
        // Explicit --directory flag takes precedence
        projectDir = path.resolve(options.directory);
      } else if (options.yes) {
        // Non-interactive mode: use current directory
        projectDir = process.cwd();
      } else {
        // Interactive: ask user which directory to uninstall from
        // select() handles cancellation internally (exits process)
        const dirChoice = await prompts.select({
          message: 'Where do you want to uninstall BMAD from?',
          choices: [
            { value: 'cwd', name: `Current directory (${process.cwd()})` },
            { value: 'other', name: 'Another directory...' },
          ],
        });

        if (dirChoice === 'other') {
          // text() handles cancellation internally (exits process)
          const customDir = await prompts.text({
            message: 'Enter the project directory path:',
            placeholder: process.cwd(),
            validate: (value) => {
              if (!value || value.trim().length === 0) return 'Directory path is required';
            },
          });

          projectDir = path.resolve(customDir.trim());
        } else {
          projectDir = process.cwd();
        }
      }

      if (!(await fs.pathExists(projectDir))) {
        await prompts.log.error(`Directory does not exist: ${projectDir}`);
        process.exit(1);
      }

      const { bmadDir } = await installer.findBmadDir(projectDir);

      if (!(await fs.pathExists(bmadDir))) {
        await prompts.log.warn('No BMAD installation found.');
        process.exit(0);
      }

      const existingInstall = await installer.getStatus(projectDir);
      const version = existingInstall.version || 'unknown';
      const modules = (existingInstall.modules || []).map((m) => m.id || m.name).join(', ');
      const ides = (existingInstall.ides || []).join(', ');

      const outputFolder = await installer.getOutputFolder(projectDir);

      await prompts.intro('BMAD Uninstall');
      await prompts.note(`Version: ${version}\nModules: ${modules}\nIDE integrations: ${ides}`, 'Current Installation');

      let removeModules = true;
      let removeIdeConfigs = true;
      let removeOutputFolder = false;

      if (!options.yes) {
        // multiselect() handles cancellation internally (exits process)
        const selected = await prompts.multiselect({
          message: 'Select components to remove:',
          options: [
            {
              value: 'modules',
              label: `BMAD Modules & data (${installer.bmadFolderName}/)`,
              hint: 'Core installation, agents, workflows, config',
            },
            { value: 'ide', label: 'IDE integrations', hint: ides || 'No IDEs configured' },
            { value: 'output', label: `User artifacts (${outputFolder}/)`, hint: 'WARNING: Contains your work products' },
          ],
          initialValues: ['modules', 'ide'],
          required: true,
        });

        removeModules = selected.includes('modules');
        removeIdeConfigs = selected.includes('ide');
        removeOutputFolder = selected.includes('output');

        const red = (s) => `\u001B[31m${s}\u001B[0m`;
        await prompts.note(
          red('💀 This action is IRREVERSIBLE! Removed files cannot be recovered!') +
            '\n' +
            red('💀 IDE configurations and modules will need to be reinstalled.') +
            '\n' +
            red('💀 User artifacts are preserved unless explicitly selected.'),
          '!! DESTRUCTIVE ACTION !!',
        );

        const confirmed = await prompts.confirm({
          message: 'Proceed with uninstall?',
          default: false,
        });

        if (!confirmed) {
          await prompts.outro('Uninstall cancelled.');
          process.exit(0);
        }
      }

      // Phase 1: IDE integrations
      if (removeIdeConfigs) {
        const s = await prompts.spinner();
        s.start('Removing IDE integrations...');
        await installer.uninstallIdeConfigs(projectDir, existingInstall, { silent: true });
        s.stop(`Removed IDE integrations (${ides || 'none'})`);
      }

      // Phase 2: User artifacts
      if (removeOutputFolder) {
        const s = await prompts.spinner();
        s.start(`Removing user artifacts (${outputFolder}/)...`);
        await installer.uninstallOutputFolder(projectDir, outputFolder);
        s.stop('User artifacts removed');
      }

      // Phase 3: BMAD modules & data (last — other phases may need _bmad/)
      if (removeModules) {
        const s = await prompts.spinner();
        s.start(`Removing BMAD modules & data (${installer.bmadFolderName}/)...`);
        await installer.uninstallModules(projectDir);
        s.stop('Modules & data removed');
      }

      const summary = [];
      if (removeIdeConfigs) summary.push('IDE integrations cleaned');
      if (removeModules) summary.push('Modules & data removed');
      if (removeOutputFolder) summary.push('User artifacts removed');
      if (!removeOutputFolder) summary.push(`User artifacts preserved in ${outputFolder}/`);

      await prompts.note(summary.join('\n'), 'Summary');
      await prompts.outro('To reinstall, run: npx bmad-method install');

      process.exit(0);
    } catch (error) {
      try {
        const errorMessage = error instanceof Error ? error.message : String(error);
        await prompts.log.error(`Uninstall failed: ${errorMessage}`);
        if (error instanceof Error && error.stack) {
          await prompts.log.message(error.stack);
        }
      } catch {
        console.error(error instanceof Error ? error.message : error);
      }
      process.exit(1);
    }
  },
};
