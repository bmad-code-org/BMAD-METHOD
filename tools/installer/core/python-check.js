const { spawnSync } = require('node:child_process');
const prompts = require('../prompts');

// Python 3.11 added stdlib `tomllib` (PEP 680), which the shared scripts in
// src/scripts/ (resolve_config.py, resolve_customization.py) require to read
// BMAD's TOML config files. memlog.py is more lenient and runs on 3.8+.
const PYTHON_FULL_SUPPORT = { major: 3, minor: 11 };
const PYTHON_PARTIAL_SUPPORT = { major: 3, minor: 8 };

// Every runtime call site (skill steps, on_complete hooks) invokes a literal
// `python3`, so only that command's version vouches for BMAD features. The
// fallback probes exist to tell the user "Python is installed, but not under
// the name BMAD uses" instead of a misleading "No Python found".
const RUNTIME_COMMAND = 'python3';
const PROBE_CANDIDATES =
  process.platform === 'win32'
    ? [
        { command: 'python3', args: ['--version'] },
        { command: 'py', args: ['-3', '--version'] },
        { command: 'python', args: ['--version'] },
      ]
    : [
        { command: 'python3', args: ['--version'] },
        { command: 'python', args: ['--version'] },
      ];

/**
 * Parse a `python --version` output line into version parts.
 * Python 3 prints to stdout; Python 2 printed to stderr — callers pass both.
 * @param {string} output - Combined stdout/stderr from `python --version`
 * @returns {{major: number, minor: number, patch: number, raw: string}|null}
 */
function parsePythonVersion(output) {
  if (!output) return null;
  const match = output.match(/Python\s+(\d+)\.(\d+)(?:\.(\d+))?/);
  if (!match) return null;
  return {
    major: Number(match[1]),
    minor: Number(match[2]),
    patch: Number(match[3] || 0),
    raw: `${match[1]}.${match[2]}.${match[3] || 0}`,
  };
}

/**
 * Classify a detected Python version against BMAD's feature requirements.
 * @param {{major: number, minor: number}|null} version
 * @returns {'full'|'partial'|'unsupported'|'none'}
 */
function classifyPython(version) {
  if (!version) return 'none';
  const { major, minor } = version;
  if (major > PYTHON_FULL_SUPPORT.major || (major === PYTHON_FULL_SUPPORT.major && minor >= PYTHON_FULL_SUPPORT.minor)) {
    return 'full';
  }
  if (major === PYTHON_PARTIAL_SUPPORT.major && minor >= PYTHON_PARTIAL_SUPPORT.minor) {
    return 'partial';
  }
  return 'unsupported';
}

/**
 * Run one probe candidate and return its parsed version, or null.
 * @param {{command: string, args: string[]}} candidate
 * @returns {{major: number, minor: number, patch: number, raw: string}|null}
 */
function probeVersion(candidate) {
  const run = (extra = {}) =>
    spawnSync(candidate.command, candidate.args, {
      encoding: 'utf8',
      timeout: 5000,
      windowsHide: true,
      ...extra,
    });
  let result = run();
  // Node >=18.20/20.12 refuses to spawn .bat/.cmd without a shell
  // (CVE-2024-27980 hardening) and reports EINVAL — pyenv-win ships its
  // python shims as .bat. Args here are static literals, so a shell retry
  // is injection-safe.
  if (result.error && result.error.code === 'EINVAL' && process.platform === 'win32') {
    result = run({ shell: true });
  }
  if (result.error) return null;
  return parsePythonVersion(`${result.stdout || ''}\n${result.stderr || ''}`);
}

/**
 * Probe the local environment for a Python interpreter.
 * Tries each candidate command and returns the first that reports a version.
 * `isRuntimeCommand` is true only when the match is `python3` — the command
 * BMAD scripts actually invoke.
 * @returns {{command: string, version: {major: number, minor: number, patch: number, raw: string}, isRuntimeCommand: boolean}|null}
 */
function detectPython() {
  for (const candidate of PROBE_CANDIDATES) {
    try {
      const version = probeVersion(candidate);
      if (version) {
        const display = candidate.args.length > 1 ? `${candidate.command} ${candidate.args.slice(0, -1).join(' ')}` : candidate.command;
        return { command: display, version, isRuntimeCommand: candidate.command === RUNTIME_COMMAND };
      }
    } catch {
      // Candidate not runnable — try the next one.
    }
  }
  return null;
}

function upgradeHints() {
  return [
    'How to get Python 3.11+ (as `python3`):',
    '  macOS:        brew install python3',
    '  Windows:      winget install Python.Python.3.12  (then ensure `python3` resolves, e.g. enable the python3 alias)',
    '  Linux/WSL:    sudo apt install python3  (Ubuntu 24.04+ ships 3.12; older distros: use pyenv or deadsnakes)',
    '  Docker:       add python3 to your image (e.g. apk add python3 / apt-get install -y python3)',
  ].join('\n');
}

/**
 * Check the local Python environment and warn about degraded BMAD features.
 *
 * Warn-don't-block: most of BMAD works without Python, so the install always
 * may proceed — but the user must explicitly acknowledge the warning so it
 * can't scroll past unseen. In non-interactive runs (--yes, or stdin is not
 * a TTY) the warning is logged and the install continues without a prompt.
 *
 * @param {Object} [options]
 * @param {boolean} [options.nonInteractive=false] - Skip the ack prompt (--yes, or no TTY)
 * @returns {Promise<{status: string, detected: Object|null}>}
 */
async function checkPythonEnvironment({ nonInteractive = false } = {}) {
  // Called via module.exports so tests can stub detection.
  const detected = module.exports.detectPython();
  const status = classifyPython(detected ? detected.version : null);

  if (status === 'full' && detected.isRuntimeCommand) {
    await prompts.log.success(`Python ${detected.version.raw} detected (${detected.command}) — all BMAD features supported.`);
    return { status, detected };
  }

  if (detected && !detected.isRuntimeCommand) {
    await prompts.log.warn(
      `Python ${detected.version.raw} found via \`${detected.command}\`, but BMAD scripts invoke \`python3\`, which is not on PATH.\n` +
        `Python-powered features (memlog session memory, TOML config resolution) won't run until \`python3\` resolves —\n` +
        `add a python3 alias/shim, or reinstall Python with the python3 launcher enabled.`,
    );
  } else if (status === 'partial') {
    await prompts.log.warn(
      `Python ${detected.version.raw} detected (${detected.command}) — BMAD's TOML config tools need Python 3.11+ (stdlib tomllib).\n` +
        `Works: memlog session memory. Won't work: config/customization resolution scripts.`,
    );
  } else {
    const found =
      status === 'unsupported' ? `Python ${detected.version.raw} detected (${detected.command}) — too old.` : 'No Python found on PATH.';
    await prompts.log.warn(
      `${found} BMAD installs fine without it, but Python-powered features\n` +
        `(memlog session memory, TOML config resolution) won't run until Python 3.11+ is available.`,
    );
  }
  await prompts.note(upgradeHints(), 'Python 3.11+ recommended');

  if (nonInteractive) {
    await prompts.log.info('Continuing anyway (non-interactive run). You can fix Python later — no reinstall needed.');
    return { status, detected };
  }

  const choice = await prompts.select({
    message: "BMAD's Python-powered features won't work yet. How do you want to proceed?",
    choices: [
      {
        name: 'Continue install',
        value: 'continue',
        hint: 'BMAD works without Python — you can fix Python later, no reinstall needed',
      },
      {
        name: 'Quit and fix Python first',
        value: 'quit',
        hint: 'make Python 3.11+ available as python3, then re-run the installer',
      },
    ],
    default: 'continue',
  });

  if (choice === 'quit') {
    await prompts.cancel('Make Python 3.11+ available as `python3` (see hints above), then re-run the installer.');
    process.exit(0);
  }

  return { status, detected };
}

module.exports = {
  checkPythonEnvironment,
  detectPython,
  parsePythonVersion,
  classifyPython,
  PYTHON_FULL_SUPPORT,
  PYTHON_PARTIAL_SUPPORT,
};
