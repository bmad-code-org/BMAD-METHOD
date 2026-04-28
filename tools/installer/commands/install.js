const path = require('node:path');
const prompts = require('../prompts');
const { Installer } = require('../core/installer');
const { UI } = require('../ui');

const installer = new Installer();
const ui = new UI();

module.exports = {
  command: 'install',
  description: 'Install BMAD Core agents and tools',
  options: [
    ['-d, --debug', 'Enable debug output for manifest generation'],
    ['--directory <path>', 'Installation directory (default: current directory)'],
    ['--modules <modules>', 'Comma-separated list of module IDs to install (e.g., "bmm,bmb")'],
    [
      '--tools <tools>',
      'Comma-separated list of tool/IDE IDs to configure (e.g., "claude-code,cursor"). Required for fresh non-interactive (--yes) installs. Run with --list-tools to see all valid IDs.',
    ],
    ['--list-tools', 'Print all supported tool/IDE IDs (with target directories) and exit.'],
    ['--action <type>', 'Action type for existing installations: install, update, or quick-update'],
    ['--user-name <name>', 'Name for agents to use (default: system username)'],
    ['--communication-language <lang>', 'Language for agent communication (default: English)'],
    ['--document-output-language <lang>', 'Language for document output (default: English)'],
    ['--output-folder <path>', 'Output folder path relative to project root (default: _bmad-output)'],
    ['--custom-source <sources>', 'Comma-separated Git URLs or local paths to install custom modules from'],
    ['-y, --yes', 'Accept all defaults and skip prompts where possible'],
    [
      '--channel <channel>',
      'Apply channel (stable|next) to all external modules being installed. --all-stable and --all-next are aliases.',
    ],
    ['--all-stable', 'Alias for --channel=stable. Resolves externals to the highest stable release tag.'],
    ['--all-next', 'Alias for --channel=next. Resolves externals to main HEAD.'],
    ['--next <code>', 'Install module <code> from main HEAD (next channel). Repeatable.', (value, prev) => [...(prev || []), value], []],
    [
      '--pin <spec>',
      'Pin module to a specific tag: --pin CODE=TAG (e.g. --pin bmb=v1.7.0). Repeatable.',
      (value, prev) => [...(prev || []), value],
      [],
    ],
  ],
  action: async (options) => {
    try {
      if (options.listTools) {
        const { formatPlatformList } = require('../ide/platform-codes');
        process.stdout.write((await formatPlatformList()) + '\n');
        process.exit(0);
      }

      // Set debug flag as environment variable for all components
      if (options.debug) {
        process.env.BMAD_DEBUG_MANIFEST = 'true';
        await prompts.log.info('Debug mode enabled');
      }

      const config = await ui.promptInstall(options);

      // Handle cancel
      if (config.actionType === 'cancel') {
        await prompts.log.warn('Installation cancelled.');
        process.exit(0);
      }

      // Handle quick update separately
      if (config.actionType === 'quick-update') {
        const result = await installer.quickUpdate(config);
        await prompts.log.success('Quick update complete!');
        await prompts.log.info(`Updated ${result.moduleCount} modules with preserved settings (${result.modules.join(', ')})`);
        process.exit(0);
      }

      // Regular install/update flow
      const result = await installer.install(config);

      // Check if installation was cancelled
      if (result && result.cancelled) {
        process.exit(0);
      }

      // Check if installation succeeded
      if (result && result.success) {
        process.exit(0);
      }
    } catch (error) {
      try {
        if (error.fullMessage) {
          await prompts.log.error(error.fullMessage);
        } else {
          await prompts.log.error(`Installation failed: ${error.message}`);
        }
        if (error.stack && !error.expected) {
          await prompts.log.message(error.stack);
        }
      } catch {
        console.error(error.fullMessage || error.message || error);
      }
      process.exit(1);
    }
  },
};
