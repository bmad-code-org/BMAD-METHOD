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
    [
      '--set <spec>',
      'Set a module config option non-interactively. Spec format: <module>.<key>=<value> (e.g. bmm.project_knowledge=research). Repeatable. Run --list-options to see available keys.',
      (value, prev) => [...(prev || []), value],
      [],
    ],
    [
      '--list-options [module]',
      'List available --set keys for all locally-known official modules, or for a single module by code, then exit.',
    ],
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

      if (options.listOptions !== undefined) {
        const { formatOptionsList } = require('../list-options');
        const moduleArg = options.listOptions === true ? null : options.listOptions;
        const { text, ok } = await formatOptionsList(moduleArg);
        const stream = ok ? process.stdout : process.stderr;
        // process.exit() forces immediate termination and can truncate the
        // buffered write when stdout/stderr is piped or captured by CI. Wait
        // for the write to flush, then set process.exitCode and return so the
        // event loop drains naturally. Non-zero exit when a single-module
        // lookup misses so a CI typo like `--list-options bmn` doesn't look
        // successful in scripts.
        await new Promise((resolve, reject) => {
          stream.write(text + '\n', (error) => (error ? reject(error) : resolve()));
        });
        process.exitCode = ok ? 0 : 1;
        return;
      }

      // Set debug flag as environment variable for all components
      if (options.debug) {
        process.env.BMAD_DEBUG_MANIFEST = 'true';
        await prompts.log.info('Debug mode enabled');
      }

      // Validate --set syntax up-front so malformed entries fail fast,
      // before we touch the network or filesystem. Parsed entries are
      // re-derived inside ui.js where overrides are seeded.
      if (options.set && options.set.length > 0) {
        const { parseSetEntries } = require('../set-overrides');
        try {
          parseSetEntries(options.set);
        } catch (error) {
          await prompts.log.error(error.message);
          process.exit(1);
        }
      }

      const config = await ui.promptInstall(options);

      // Handle cancel
      if (config.actionType === 'cancel') {
        await prompts.log.warn('Installation cancelled.');
        process.exit(0);
      }

      // Handle quick update separately. --set is a post-install TOML patch so
      // it works the same way for quick-update as for a regular install — the
      // installer runs, then `applySetOverrides` patches the central config
      // files. Pass the parsed overrides through.
      if (config.actionType === 'quick-update') {
        const { parseSetEntries } = require('../set-overrides');
        config.setOverrides = parseSetEntries(options.set || []);
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
