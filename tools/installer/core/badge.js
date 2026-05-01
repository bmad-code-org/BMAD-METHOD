const path = require('node:path');
const { execSync } = require('node:child_process');
const fs = require('../fs-native');

const BADGE_URL = 'https://bmad-badge.vercel.app';
const escapedBadgeUrl = BADGE_URL.replaceAll(/[.*+?^${}()|[\]\\]/g, String.raw`\$&`);
const BADGE_PATTERN = new RegExp(`\\[!\\[BMAD\\]\\(${escapedBadgeUrl}/[^)]+\\)\\]\\(https://github\\.com/bmad-code-org/BMAD-METHOD\\)`);
const README_NAMES = ['README.md', 'readme.md', 'README', 'readme'];

/**
 * Resolve owner and repo from the project's git remote origin URL.
 * Supports HTTPS and SSH formats.
 * @param {string} projectDir - Project root directory
 * @returns {{ owner: string, repo: string } | null} Parsed owner/repo or null
 */
function resolveGitRemote(projectDir) {
  try {
    const raw = execSync('git remote get-url origin', {
      cwd: projectDir,
      encoding: 'utf8',
      stdio: ['pipe', 'pipe', 'pipe'],
    }).trim();

    const httpsMatch = raw.match(/github\.com[:/]([^/]+)\/([^/]+?)(?:\.git)?\/?$/i);
    if (httpsMatch) {
      return { owner: httpsMatch[1], repo: httpsMatch[2] };
    }
  } catch {
    // no git remote
  }
  return null;
}

/**
 * Find the first README file in the project directory.
 * Checks common README naming variants (case-insensitive).
 * @param {string} projectDir - Project root directory
 * @returns {Promise<string | null>} Absolute path to README or null
 */
async function findReadme(projectDir) {
  for (const name of README_NAMES) {
    const fullPath = path.join(projectDir, name);
    if (await fs.pathExists(fullPath)) {
      return fullPath;
    }
  }
  return null;
}

/**
 * Check whether the content already contains a BMAD badge.
 * @param {string} content - README file content
 * @returns {boolean} True if badge is present
 */
function hasBadge(content) {
  return BADGE_PATTERN.test(content);
}

/**
 * Generate the BMAD badge markdown line.
 * @param {string} owner - Repository owner
 * @param {string} repo - Repository name
 * @returns {string} Badge markdown string
 */
function generateBadgeMarkdown(owner, repo) {
  return `[![BMAD](${BADGE_URL}/${owner}/${repo}.svg)](https://github.com/bmad-code-org/BMAD-METHOD)`;
}

/**
 * Inject the BMAD badge into README content.
 * Places the badge after the first heading, alongside any existing badges.
 * @param {string} content - Original README content
 * @param {string} owner - Repository owner
 * @param {string} repo - Repository name
 * @returns {string} Updated README content with badge
 */
function injectBadge(content, owner, repo) {
  const badgeLine = generateBadgeMarkdown(owner, repo);

  const lines = content.split('\n');

  // Find the first heading (# title)
  let headingEnd = 0;
  for (const [i, line] of lines.entries()) {
    headingEnd = i + 1;
    if (line.startsWith('#')) break;
  }

  // Check if there are existing badges right after the heading
  let insertAt = headingEnd;
  while (insertAt < lines.length && /^\[!\[.*?\]\(.*?\)\]\(.*?\)/.test(lines[insertAt].trim())) {
    insertAt++;
  }

  lines.splice(insertAt, 0, badgeLine);
  return lines.join('\n');
}

/**
 * Remove the BMAD badge from README content.
 * @param {string} content - README file content
 * @returns {string} Cleaned README content without the badge line
 */
function removeBadge(content) {
  return content
    .split('\n')
    .filter((line) => !BADGE_PATTERN.test(line.trim()))
    .join('\n');
}

/**
 * Create a minimal README.md content with project heading and BMAD badge.
 * @param {string} owner - Repository owner
 * @param {string} repo - Repository name
 * @param {string} projectName - Project name for the heading
 * @returns {string} New README content
 */
function createReadmeWithBadge(owner, repo, projectName) {
  const badgeLine = generateBadgeMarkdown(owner, repo);
  return `# ${projectName}\n\n${badgeLine}\n`;
}

module.exports = {
  resolveGitRemote,
  findReadme,
  hasBadge,
  generateBadgeMarkdown,
  injectBadge,
  removeBadge,
  createReadmeWithBadge,
};
