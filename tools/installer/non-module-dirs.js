// Reserved directories that live under `_bmad/` but are not module installs.
// Anything that iterates `_bmad/`'s children to find installed modules must
// exclude these. Single-sourced here because a drifted copy is silent breakage:
// a future reserved dir that happens to contain a `config.yaml` would start
// receiving core `--set` patches (set-overrides.js) or being treated as a
// module by config generation/cleanup (core/installer.js) and the legacy
// config loader (modules/official-modules.js).
const NON_MODULE_DIRS = new Set(['_config', '_memory', 'memory', 'docs', 'scripts', 'custom']);

module.exports = { NON_MODULE_DIRS };
