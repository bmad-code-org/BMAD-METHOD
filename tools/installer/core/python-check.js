const { spawnSync } = require('node:child_process');
const prompts = require('../prompts');

// Python 3.11 added stdlib `tomllib` (PEP 680), which the shared scripts in
// src/scripts/ (resolve_config.py, resolve_customization.py) require to read
// BMAD's TOML config files. memlog.py is more lenient and runs on 3.8+.
const PYTHON_FULL_SUPPORT = { major: 3, minor: 11 };
const PYTHON_PARTIAL_SUPPORT = { major: 3, minor: 8 };

// Probe order matters: on Windows the `py` launcher is the most reliable way
// to find Python 3 (a bare `python` is often the Microsoft Store alias that
// exits without printing a version). On POSIX, `python3` is canonical.
const PROBE_CANDIDATES =
  process.platform === 'win32'
    ? [
        { command: 'py', args: ['-3', '--version'] },
        { command: 'python3', args: ['--version'] },
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
 * Probe the local environment for a Python interpreter.
 * Tries each candidate command and returns the first that reports a version.
 * @returns {{command: string, version: {major: number, minor: number, patch: number, raw: string}}|null}
 */
function detectPython() {
  for (const candidate of PROBE_CANDIDATES) {
    try {
      const result = spawnSync(candidate.command, candidate.args, {
        encoding: 'utf8',
        timeout: 5000,
        windowsHide: true,
      });
      if (result.error) continue;
      const version = parsePythonVersion(`${result.stdout || ''}\n${result.stderr || ''}`);
      if (version) {
        const display = candidate.args.length > 1 ? `${candidate.command} ${candidate.args.slice(0, -1).join(' ')}` : candidate.command;
        return { command: display, version };
      }
    } catch {
      // Candidate not runnable — try the next one.
    }
  }
  return null;
}

function upgradeHints() {
  return [
    'How to get Python 3.11+:',
    '  macOS:        brew install python3',
    '  Windows:      winget install Python.Python.3.12',
    '  Linux/WSL:    sudo apt install python3  (Ubuntu 24.04+ ships 3.12; older distros: use pyenv or deadsnakes)',
    '  Docker:       add python3 to your image (e.g. apk add python3 / apt-get install -y python3)',
  ].join('\n');
}

/**
 * Check the local Python environment and warn about degraded BMAD features.
 *
 * Warn-don't-block: most of BMAD works without Python, so the install always
 * may proceed — but the user must explicitly acknowledge the warning so it
 * can't scroll past unseen. In non-interactive mode (--yes) the warning is
 * logged and the install continues without a prompt.
 *
 * @param {Object} [options]
 * @param {boolean} [options.nonInteractive=false] - Skip the ack prompt (--yes mode)
 * @returns {Promise<{status: string, detected: Object|null}>}
 */
async function checkPythonEnvironment({ nonInteractive = false } = {}) {
  const detected = detectPython();
  const status = classifyPython(detected ? detected.version : null);

  if (status === 'full') {
    await prompts.log.success(`Python ${detected.version.raw} detected (${detected.command}) — all BMAD features supported.`);
    return { status, detected };
  }

  if (status === 'partial') {
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
    await prompts.log.info('Continuing without Python 3.11+ (--yes mode). You can install Python later — no reinstall needed.');
    return { status, detected };
  }

  const choice = await prompts.select({
    message: 'Python 3.11+ was not found. How do you want to proceed?',
    choices: [
      {
        name: 'Continue install',
        value: 'continue',
        hint: 'BMAD works without Python — you can add Python 3.11+ later, no reinstall needed',
      },
      {
        name: 'Quit and fix Python first',
        value: 'quit',
        hint: 'install Python 3.11+, then re-run the installer',
      },
    ],
    default: 'continue',
  });

  if (choice === 'quit') {
    await prompts.cancel('Install Python 3.11+ (see hints above), then re-run the installer.');
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
