const prompts = require('../prompts');

const WSL_UNC_PATTERN = /^\\\\wsl(?:\.localhost|\$)?\\/i;

function normalizePath(value) {
  return typeof value === 'string' ? value.replaceAll('/', '\\').toLowerCase() : '';
}

function isLinuxStylePath(value) {
  return (
    typeof value === 'string' &&
    value.startsWith('/') &&
    !value.startsWith('//') &&
    !/^\/[a-z](?:\/|$)/i.test(value) &&
    !/^\/cygdrive\/[a-z](?:\/|$)/i.test(value)
  );
}

function isWslUncPath(value) {
  return WSL_UNC_PATTERN.test(value || '');
}

/**
 * Detect the broken interop case where WSL resolved node/npx to Windows.
 * @param {Object} [runtime]
 * @param {string} [runtime.platform]
 * @param {Object} [runtime.env]
 * @param {string} [runtime.cwd]
 * @param {string} [runtime.execPath]
 * @returns {{isMismatch: boolean, reason: string|null, execPath: string}}
 */
function detectWindowsNodeFromWsl(runtime = {}) {
  const platform = runtime.platform || process.platform;
  const env = runtime.env || process.env;
  const cwd = runtime.cwd || safeCwd();
  const execPath = runtime.execPath || process.execPath || '';

  if (platform !== 'win32') {
    return { isMismatch: false, reason: null, execPath };
  }

  if (env.WSL_DISTRO_NAME) {
    return { isMismatch: true, reason: 'WSL_DISTRO_NAME is set', execPath };
  }

  if (env.WSL_INTEROP) {
    return { isMismatch: true, reason: 'WSL_INTEROP is set', execPath };
  }

  if (isLinuxStylePath(env.PWD)) {
    return { isMismatch: true, reason: 'PWD is a Linux path', execPath };
  }

  if (isWslUncPath(cwd)) {
    return { isMismatch: true, reason: 'current directory is a WSL UNC path', execPath };
  }

  const normalizedExecPath = normalizePath(execPath);
  if (normalizedExecPath.includes('\\wsl$\\') || normalizedExecPath.includes('\\wsl.localhost\\')) {
    return { isMismatch: true, reason: 'Node executable path is under a WSL UNC path', execPath };
  }

  return { isMismatch: false, reason: null, execPath };
}

function safeCwd() {
  try {
    return process.cwd();
  } catch {
    return '';
  }
}

function formatWindowsNodeFromWslMessage(detection) {
  const lines = [
    'Windows Node.js was launched from a WSL shell.',
    '',
    'This usually means Node.js is not installed inside the WSL distro, so WSL resolved `node`/`npx` to Windows.',
    'The installer cannot safely continue because Linux paths may be interpreted as Windows paths.',
    '',
    'Install Node.js inside WSL, then rerun the same command from the WSL terminal.',
  ];

  if (detection.execPath) {
    lines.push('', `Detected Node executable: ${detection.execPath}`);
  }

  if (detection.reason) {
    lines.push(`Detection signal: ${detection.reason}`);
  }

  return lines.join('\n');
}

async function checkWindowsNodeFromWsl() {
  const detection = module.exports.detectWindowsNodeFromWsl();
  if (!detection.isMismatch) {
    return detection;
  }

  await prompts.log.error(formatWindowsNodeFromWslMessage(detection));
  process.exit(1);
}

module.exports = {
  checkWindowsNodeFromWsl,
  detectWindowsNodeFromWsl,
  formatWindowsNodeFromWslMessage,
};
