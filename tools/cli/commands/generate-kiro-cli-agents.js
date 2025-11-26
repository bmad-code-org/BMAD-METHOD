const chalk = require('chalk');
const { KiroCLIGenerator } = require('../lib/kiro-cli-generator');

const kiroGenerator = new KiroCLIGenerator();

module.exports = {
  command: 'generate-kiro-cli-agents',
  description: 'Generate Kiro CLI agent files from BMAD agent manifest',
  options: [
    ['-o, --output <path>', 'Output directory (default: .kiro/agents)'],
    ['-f, --force', 'Overwrite existing files'],
  ],
  action: async (options) => {
    try {
      console.log(chalk.cyan('\n🤖 Kiro CLI Agent Generator\n'));

      const result = await kiroGenerator.generateWithOutput(process.cwd(), {
        outputDir: options.output,
        force: options.force,
      });

      console.log(chalk.cyan(`\n📊 Generation Summary:`));
      console.log(chalk.green(`✅ Generated: ${result.generated} agents`));
      console.log(chalk.yellow(`⏭️  Skipped: ${result.skipped} agents`));
      console.log(chalk.dim(`📁 Output: ${result.outputDir}`));

      if (result.generated > 0) {
        console.log(chalk.cyan('\n🎉 Kiro CLI agents ready! You can now use them in Kiro CLI.'));
      }
    } catch (error) {
      console.error(chalk.red('❌ Error generating Kiro CLI agents:'), error.message);
      process.exit(1);
    }
  },
};
