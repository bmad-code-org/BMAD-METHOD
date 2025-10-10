const { WebBundler } = require('./web-bundler');
const chalk = require('chalk');
const { program } = require('commander');
const path = require('node:path');
const fs = require('fs-extra');

program.name('bundle-web').description('Generate web bundles for BMAD agents and teams').version('1.0.0');

program
  .command('all')
  .description('Bundle all modules')
  .option('-o, --output <path>', 'Output directory', 'web-bundles')
  .action(async (options) => {
    try {
      const bundler = new WebBundler(null, options.output);
      await bundler.bundleAll();
    } catch (error) {
      console.error(chalk.red('Error:'), error.message);
      process.exit(1);
    }
  });

program
  .command('rebundle')
  .description('Clean and rebundle all modules')
  .option('-o, --output <path>', 'Output directory', 'web-bundles')
  .action(async (options) => {
    try {
      // Clean output directory first
      const outputDir = path.isAbsolute(options.output) ? options.output : path.join(process.cwd(), options.output);

      if (await fs.pathExists(outputDir)) {
        console.log(chalk.cyan(`🧹 Cleaning ${options.output}...`));
        await fs.emptyDir(outputDir);
      }

      // Bundle all
      const bundler = new WebBundler(null, options.output);
      await bundler.bundleAll();
    } catch (error) {
      console.error(chalk.red('Error:'), error.message);
      process.exit(1);
    }
  });

program
  .command('module <name>')
  .description('Bundle a specific module')
  .option('-o, --output <path>', 'Output directory', 'web-bundles')
  .action(async (moduleName, options) => {
    try {
      const bundler = new WebBundler(null, options.output);
      const result = await bundler.bundleModule(moduleName);

      if (result.agents.length === 0 && result.teams.length === 0) {
        console.log(chalk.yellow(`No agents or teams found in module: ${moduleName}`));
      } else {
        console.log(chalk.green(`\n✨ Successfully bundled ${result.agents.length} agents and ${result.teams.length} teams`));
      }
    } catch (error) {
      console.error(chalk.red('Error:'), error.message);
      process.exit(1);
    }
  });

program
  .command('agent <module> <agent>')
  .description('Bundle a specific agent')
  .option('-o, --output <path>', 'Output directory', 'web-bundles')
  .action(async (moduleName, agentFile, options) => {
    try {
      const bundler = new WebBundler(null, options.output);

      // Ensure .md extension
      if (!agentFile.endsWith('.md')) {
        agentFile += '.md';
      }

      // Pre-discover module for complete manifests
      await bundler.preDiscoverModule(moduleName);

      await bundler.bundleAgent(moduleName, agentFile, false);
      console.log(chalk.green(`\n✨ Successfully bundled agent: ${agentFile}`));
    } catch (error) {
      console.error(chalk.red('Error:'), error.message);
      process.exit(1);
    }
  });

program
  .command('team <module> <team>')
  .description('Bundle a specific team')
  .option('-o, --output <path>', 'Output directory', 'web-bundles')
  .action(async (moduleName, teamFile, options) => {
    try {
      const bundler = new WebBundler(null, options.output);

      // Ensure .yaml or .yml extension
      if (!teamFile.endsWith('.yaml') && !teamFile.endsWith('.yml')) {
        teamFile += '.yaml';
      }

      // Pre-discover module for complete manifests
      await bundler.preDiscoverModule(moduleName);

      await bundler.bundleTeam(moduleName, teamFile);
      console.log(chalk.green(`\n✨ Successfully bundled team: ${teamFile}`));
    } catch (error) {
      console.error(chalk.red('Error:'), error.message);
      process.exit(1);
    }
  });

program
  .command('list')
  .description('List available modules and agents')
  .action(async () => {
    try {
      const bundler = new WebBundler();
      const modules = await bundler.discoverModules();

      console.log(chalk.cyan.bold('\n📦 Available Modules:\n'));

      for (const module of modules) {
        console.log(chalk.bold(`  ${module}/`));

        const modulePath = path.join(bundler.modulesPath, module);
        const agents = await bundler.discoverAgents(modulePath);
        const teams = await bundler.discoverTeams(modulePath);

        if (agents.length > 0) {
          console.log(chalk.gray('    agents/'));
          for (const agent of agents) {
            console.log(chalk.gray(`      - ${agent}`));
          }
        }

        if (teams.length > 0) {
          console.log(chalk.gray('    teams/'));
          for (const team of teams) {
            console.log(chalk.gray(`      - ${team}`));
          }
        }
      }

      console.log('');
    } catch (error) {
      console.error(chalk.red('Error:'), error.message);
      process.exit(1);
    }
  });

program
  .command('clean')
  .description('Remove all web bundles')
  .action(async () => {
    try {
      const fs = require('fs-extra');
      const outputDir = path.join(process.cwd(), 'web-bundles');

      if (await fs.pathExists(outputDir)) {
        await fs.remove(outputDir);
        console.log(chalk.green('✓ Web bundles directory cleaned'));
      } else {
        console.log(chalk.yellow('Web bundles directory does not exist'));
      }
    } catch (error) {
      console.error(chalk.red('Error:'), error.message);
      process.exit(1);
    }
  });

// Parse command line arguments
program.parse(process.argv);

// Show help if no command provided
if (process.argv.slice(2).length === 0) {
  program.outputHelp();
}
