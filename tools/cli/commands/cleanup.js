const chalk = require('chalk');
const nodePath = require('node:path');
const { Installer } = require('../installers/lib/core/installer');

module.exports = {
  command: 'cleanup',
  description: 'Clean up obsolete files from BMAD installation',
  options: [
    ['-d, --dry-run', 'Show what would be deleted without actually deleting'],
    ['-a, --auto-delete', 'Automatically delete non-retained files without prompts'],
    ['-l, --list-retained', 'List currently retained files'],
    ['-c, --clear-retained', 'Clear retained files list'],
  ],
  action: async (options) => {
    try {
      // Create installer and let it find the BMAD directory
      const installer = new Installer();
      const bmadDir = await installer.findBmadDir(process.cwd());

      if (!bmadDir) {
        console.error(chalk.red('❌ BMAD installation not found'));
        process.exit(1);
      }

      const retentionPath = nodePath.join(bmadDir, '_cfg', 'user-retained-files.yaml');

      // Handle list-retained option
      if (options.listRetained) {
        const fs = require('fs-extra');
        const yaml = require('js-yaml');

        if (await fs.pathExists(retentionPath)) {
          const retentionContent = await fs.readFile(retentionPath, 'utf8');
          const retentionData = yaml.load(retentionContent) || { retainedFiles: [] };

          if (retentionData.retainedFiles.length > 0) {
            console.log(chalk.cyan('\n📋 Retained Files:\n'));
            for (const file of retentionData.retainedFiles) {
              console.log(chalk.dim(`  - ${file}`));
            }
            console.log();
          } else {
            console.log(chalk.yellow('\n✨ No retained files found\n'));
          }
        } else {
          console.log(chalk.yellow('\n✨ No retained files found\n'));
        }

        return;
      }

      // Handle clear-retained option
      if (options.clearRetained) {
        const fs = require('fs-extra');

        if (await fs.pathExists(retentionPath)) {
          await fs.remove(retentionPath);
          console.log(chalk.green('\n✅ Cleared retained files list\n'));
        } else {
          console.log(chalk.yellow('\n✨ No retained files list to clear\n'));
        }

        return;
      }

      // Handle cleanup operations
      if (options.dryRun) {
        console.log(chalk.cyan('\n🔍 Legacy File Scan (Dry Run)\n'));

        const legacyFiles = await installer.scanForLegacyFiles(bmadDir);
        const allLegacyFiles = [
          ...legacyFiles.backup,
          ...legacyFiles.documentation,
          ...legacyFiles.deprecated_task,
          ...legacyFiles.unknown,
        ];

        if (allLegacyFiles.length === 0) {
          console.log(chalk.green('✨ No legacy files found\n'));
          return;
        }

        // Group files by category
        const categories = [];
        if (legacyFiles.backup.length > 0) {
          categories.push({ name: 'Backup Files (.bak)', files: legacyFiles.backup });
        }
        if (legacyFiles.documentation.length > 0) {
          categories.push({ name: 'Documentation', files: legacyFiles.documentation });
        }
        if (legacyFiles.deprecated_task.length > 0) {
          categories.push({ name: 'Deprecated Task Files', files: legacyFiles.deprecated_task });
        }
        if (legacyFiles.unknown.length > 0) {
          categories.push({ name: 'Unknown Files', files: legacyFiles.unknown });
        }

        for (const category of categories) {
          console.log(chalk.yellow(`${category.name}:`));
          for (const file of category.files) {
            const size = (file.size / 1024).toFixed(1);
            const date = file.mtime.toLocaleDateString();
            let line = `  - ${file.relativePath} (${size}KB, ${date})`;
            if (file.suggestedAlternative) {
              line += chalk.dim(` → ${file.suggestedAlternative}`);
            }
            console.log(chalk.dim(line));
          }
          console.log();
        }

        console.log(chalk.cyan(`Found ${allLegacyFiles.length} legacy file(s) that could be cleaned up.\n`));
        console.log(chalk.dim('Run "bmad cleanup" to actually delete these files.\n'));

        return;
      }

      // Perform actual cleanup
      console.log(chalk.cyan('\n🧹 Cleaning up legacy files...\n'));

      const result = await installer.performCleanup(bmadDir, options.autoDelete);

      if (result.message) {
        console.log(chalk.dim(result.message));
      } else {
        if (result.deleted > 0) {
          console.log(chalk.green(`✅ Deleted ${result.deleted} legacy file(s)`));
        }
        if (result.retained > 0) {
          console.log(chalk.yellow(`⏭️  Retained ${result.retained} file(s)`));
          console.log(chalk.dim('Run "bmad cleanup --list-retained" to see retained files\n'));
        }
      }

      console.log();
    } catch (error) {
      console.error(chalk.red(`❌ Error: ${error.message}`));
      process.exit(1);
    }
  },
};
