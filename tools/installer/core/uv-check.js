const { spawnSync } = require('node:child_process');
const prompts = require('../prompts');

// `uv` (https://docs.astral.sh/uv/) is becoming the de facto standard for
// running the Python scripts BMAD workflows shell out to: `uv run <script>`
// resolves the interpreter and any dependencies on demand, so skills don't
// have to assume a particular `python3` is on PATH. The ecosystem is mid-
// migration — some skills still call `python3` directly — so a missing `uv`
// is a warning, not a blocker: BMAD installs and runs either way.
const RUNTIME_COMMAND = 'uv';

/**
 * Parse `uv --version` output into version parts.
 * Example outputs: "uv 0.5.31", "uv 0.5.31 (Homebrew 2025-02-12)".
 * @param {string} output - stdout/stderr from `uv --version`
 * @returns {{major: number, minor: number, patch: number, raw: string}|null}
 */
function parseUvVersion(output) {
  if (!output) return null;
  const match = output.match(/uv\s+(\d+)\.(\d+)(?:\.(\d+))?/i);
  if (!match) return null;
  return {
    major: Number(match[1]),
    minor: Number(match[2]),
    patch: Number(match[3] || 0),
    raw: `${match[1]}.${match[2]}.${match[3] || 0}`,
  };
}

/**
 * Probe the local environment for `uv`.
 * @returns {{version: {major: number, minor: number, patch: number, raw: string}}|null}
 */
function detectUv() {
  let result;
  try {
    result = spawnSync(RUNTIME_COMMAND, ['--version'], {
      encoding: 'utf8',
      timeout: 5000,
      windowsHide: true,
    });
  } catch {
    return null;
  }
  if (!result || result.error) return null;
  const version = parseUvVersion(`${result.stdout || ''}\n${result.stderr || ''}`);
  return version ? { version } : null;
}

function setupHints() {
  return [
    'BMAD workflows increasingly run Python scripts via `uv run`, which manages',
    'the interpreter and dependencies for you — no manual venv or pip needed.',
    '',
    'Easiest path: ask your AI agent to "install and set up uv for me".',
    '',
    'Or install it yourself:',
    '  macOS/Linux:  curl -LsSf https://astral.sh/uv/install.sh | sh',
    '  Windows:      powershell -c "irm https://astral.sh/uv/install.ps1 | iex"',
    '  Homebrew:     brew install uv',
    '  Docs:         https://docs.astral.sh/uv/getting-started/installation/',
  ].join('\n');
}

/**
 * Check whether `uv` is available and inform the user.
 *
 * Warn-don't-block, and no acknowledgement prompt: `uv` is on its way to being
 * the standard runner for BMAD's Python scripts, but the migration is still in
 * progress, so the install never stops on its account. The note tells the user
 * how to set it up (preferably by asking their agent).
 *
 * @returns {Promise<{status: 'found'|'missing', detected: Object|null}>}
 */
async function checkUvEnvironment() {
  // Called via module.exports so tests can stub detection.
  const detected = module.exports.detectUv();

  if (detected) {
    await prompts.log.success(`uv ${detected.version.raw} detected — ready to run BMAD's Python-powered scripts via \`uv run\`.`);
    return { status: 'found', detected };
  }

  await prompts.log.warn(
    "uv not found on PATH. uv is becoming the de facto standard for running BMAD's Python\n" +
      'scripts (`uv run <script>`), and it provisions the interpreter for you. BMAD installs\n' +
      'fine without it, but setting up uv now keeps you ahead as workflows adopt it.',
  );
  await prompts.note(setupHints(), 'uv recommended');
  return { status: 'missing', detected: null };
}

module.exports = {
  checkUvEnvironment,
  detectUv,
  parseUvVersion,
};
