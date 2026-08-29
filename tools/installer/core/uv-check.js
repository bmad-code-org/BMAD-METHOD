const { spawnSync } = require('node:child_process');
const prompts = require('../prompts');

// `uv` (https://docs.astral.sh/uv/) is how BMAD runs the Python scripts its
// skills shell out to: `uv run <script>` resolves the interpreter and any
// dependencies on demand from the script's own `requires-python` metadata, so
// skills don't have to assume a particular `python3` is on PATH.
//
// As of v6.11.0 this is a requirement, not a preference: the rendered skills
// (`bmad-build`, `bmad-build-auto`) render through `render_skill.py` and HALT
// on activation if `uv` is unavailable — there is no interpreter fallback.
//
// The check still never blocks the install. Core-only, docs-only, and CI
// installs are legitimate and never touch a rendered skill, so a missing `uv`
// must not fail the run. What it does is tell the truth about what will and
// will not work afterwards, here and again in the post-install summary.
const RUNTIME_COMMAND = 'uv';

// Probed only when `uv` is absent. Some skills still invoke the interpreter
// directly (`python3 .../resolve_customization.py`), and those scripts declare
// `requires-python = ">=3.11"` — `resolve_config.py` hard-exits below it
// because `tomllib` is a 3.11 stdlib addition. When `uv` is present it
// provisions its own interpreter and whatever `python3` resolves to on PATH is
// irrelevant, so probing it then would report a problem that doesn't exist.
const PYTHON_COMMAND = 'python3';
const MIN_PYTHON = { major: 3, minor: 11 };

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
 * Parse `python3 --version` output into version parts.
 * Example outputs: "Python 3.11.7", "Python 3.13.0rc1".
 * @param {string} output - stdout/stderr from `python3 --version`
 * @returns {{major: number, minor: number, patch: number, raw: string}|null}
 */
function parsePythonVersion(output) {
  if (!output) return null;
  const match = output.match(/Python\s+(\d+)\.(\d+)(?:\.(\d+))?/i);
  if (!match) return null;
  return {
    major: Number(match[1]),
    minor: Number(match[2]),
    patch: Number(match[3] || 0),
    raw: `${match[1]}.${match[2]}.${match[3] || 0}`,
  };
}

/**
 * Whether a parsed Python version satisfies the 3.11+ floor the scripts declare.
 * @param {{major: number, minor: number}|null} version
 * @returns {boolean}
 */
function pythonMeetsMinimum(version) {
  if (!version) return false;
  if (version.major !== MIN_PYTHON.major) return version.major > MIN_PYTHON.major;
  return version.minor >= MIN_PYTHON.minor;
}

/**
 * Run `<command> --version` and hand the combined output to a parser.
 * @param {string} command
 * @param {(output: string) => Object|null} parse
 * @returns {{version: Object}|null}
 */
function probeVersion(command, parse) {
  let result;
  try {
    result = spawnSync(command, ['--version'], {
      encoding: 'utf8',
      timeout: 5000,
      windowsHide: true,
    });
  } catch {
    return null;
  }
  if (!result || result.error) return null;
  const version = parse(`${result.stdout || ''}\n${result.stderr || ''}`);
  return version ? { version } : null;
}

/**
 * Probe the local environment for `uv`.
 * @returns {{version: {major: number, minor: number, patch: number, raw: string}}|null}
 */
function detectUv() {
  return probeVersion(RUNTIME_COMMAND, parseUvVersion);
}

/**
 * Probe the local environment for `python3`.
 * @returns {{version: {major: number, minor: number, patch: number, raw: string}}|null}
 */
function detectPython3() {
  return probeVersion(PYTHON_COMMAND, parsePythonVersion);
}

function setupHints() {
  return [
    '`uv run` provisions the interpreter and dependencies for you — no manual',
    'venv or pip, and no need for a particular python3 on PATH.',
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
 * Describe what a missing `uv` leaves working, based on the `python3` fallback.
 *
 * With `uv` gone the rendered skills are lost either way; the only question is
 * whether the skills that invoke the interpreter directly still run, and that
 * turns on `python3` being 3.11+.
 *
 * @param {{version: Object}|null} python - result of detectPython3()
 * @returns {string}
 */
function pythonFallbackNote(python) {
  if (!python) {
    return 'No python3 on PATH either, so no Python-backed skill will run.';
  }
  if (pythonMeetsMinimum(python.version)) {
    return (
      `python3 ${python.version.raw} is present, so skills that call the interpreter ` +
      'directly still work — but the rendered skills above stay unavailable.'
    );
  }
  return (
    `python3 ${python.version.raw} is present but below the required ` +
    `${MIN_PYTHON.major}.${MIN_PYTHON.minor}, so no Python-backed skill will run.`
  );
}

/**
 * Check whether `uv` is available and inform the user.
 *
 * Warn-don't-block: a missing `uv` never stops or fails the install, because
 * core-only and CI installs are legitimate and never render a skill. But the
 * warning names the concrete consequence — `bmad-build` and `bmad-build-auto`
 * halt — rather than describing `uv` as a nice-to-have, and `installer.js`
 * repeats it in the post-install summary so it isn't lost in the scrollback.
 *
 * @returns {Promise<{status: 'found'|'missing', detected: Object|null, python: Object|null}>}
 */
async function checkUvEnvironment() {
  // Called via module.exports so tests can stub detection.
  const detected = module.exports.detectUv();

  if (detected) {
    await prompts.log.success(`✅ Python UV check pass (uv ${detected.version.raw} detected).`);
    return { status: 'found', detected, python: null };
  }

  const python = module.exports.detectPython3();

  await prompts.log.warn(
    'uv not found on PATH. BMAD requires it to run the Python scripts its skills\n' +
      'shell out to: bmad-build and bmad-build-auto render through `uv run` and will\n' +
      'HALT on activation without it — there is no interpreter fallback.\n' +
      `${pythonFallbackNote(python)}\n` +
      'The install itself completes either way.',
  );
  await prompts.note(setupHints(), 'uv required');
  return { status: 'missing', detected: null, python };
}

module.exports = {
  checkUvEnvironment,
  detectUv,
  detectPython3,
  parseUvVersion,
  parsePythonVersion,
  pythonMeetsMinimum,
  MIN_PYTHON,
};
