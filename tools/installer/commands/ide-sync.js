const { runIdeSync } = require('../core/ide-sync');

// `bmad ide-sync` — distribute the skills recorded in _config/skill-manifest.csv
// to every coding assistant listed under `ides:` in _config/manifest.yaml, then
// reach the canonical end-state (skills in IDE dirs, removed from _bmad/).
//
// Non-interactive by design: it reads the existing manifest rather than
// prompting, so it is safe to run from scripts and without a TTY. It is the same
// distribution the full `bmad install` performs (both route through
// core/ide-sync.js → IdeManager.setupBatch), exposed as a standalone step. The
// bmad-module skill invokes the bundled equivalent after install/update/remove.
module.exports = {
  command: 'ide-sync',
  description: "Sync installed skills to the coding assistants configured in this project's manifest",
  options: [
    ['-d, --directory <path>', 'Project directory containing _bmad/', '.'],
    ['--prune <ids>', 'Comma-separated canonicalIds to remove from IDE directories'],
    ['-v, --verbose', 'Verbose output'],
  ],
  action: async (options) => {
    try {
      const code = await runIdeSync({
        directory: options.directory || '.',
        prune: options.prune || '',
        verbose: !!options.verbose,
      });
      process.exit(code);
    } catch (error) {
      process.stderr.write(`[ide-sync] failed: ${error.message}\n`);
      if (process.env.BMAD_DEBUG) process.stderr.write(`${error.stack}\n`);
      process.exit(1);
    }
  },
};
