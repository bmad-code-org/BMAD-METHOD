/**
 * Sanitized environment for spawning git subprocesses.
 *
 * When the installer runs inside a git hook (e.g. `npm test` from a
 * pre-commit hook), git exports repo-targeting variables — GIT_DIR,
 * GIT_INDEX_FILE, GIT_WORK_TREE, etc. — into the hook's environment. A
 * spawned `git` inherits them and silently operates on the hook's repository
 * instead of the cwd passed to execSync (GIT_DIR overrides directory
 * discovery, and the cwd then becomes its work tree). In a worktree checkout
 * this let a cache refresh shallow-fetch and hard-reset the developer's own
 * repo. Strip these variables so cache-directory git commands can only ever
 * act on the repository at their cwd.
 */

const REPO_TARGETING_VARS = [
  'GIT_DIR',
  'GIT_WORK_TREE',
  'GIT_INDEX_FILE',
  'GIT_COMMON_DIR',
  'GIT_OBJECT_DIRECTORY',
  'GIT_ALTERNATE_OBJECT_DIRECTORIES',
  'GIT_PREFIX',
  'GIT_NAMESPACE',
  // `git -c key=val` exports its overrides to hook subprocesses through these;
  // a core.worktree override can retarget the work tree just like GIT_WORK_TREE.
  'GIT_CONFIG_PARAMETERS',
  'GIT_CONFIG_COUNT',
];

// GIT_CONFIG_KEY_0 / GIT_CONFIG_VALUE_0 ... — the enumerated form of the same mechanism.
const CONFIG_PAIR_VAR = /^GIT_CONFIG_(KEY|VALUE)_\d+$/;

/**
 * Build the environment for a git child process.
 * @param {Object} [extra] - Additional variables to set (e.g. GIT_TERMINAL_PROMPT)
 * @returns {Object} process.env minus repo-targeting GIT_* vars, plus extras
 */
function gitEnv(extra = {}) {
  const env = { ...process.env, ...extra };
  for (const name of REPO_TARGETING_VARS) delete env[name];
  for (const name of Object.keys(env)) {
    if (CONFIG_PAIR_VAR.test(name)) delete env[name];
  }
  return env;
}

module.exports = { gitEnv };
