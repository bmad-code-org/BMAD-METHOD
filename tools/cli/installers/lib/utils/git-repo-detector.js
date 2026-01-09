/**
 * Git Repository Detector
 * Detects and parses git remote URLs to extract repository information
 */

const { execSync } = require('node:child_process');
const path = require('node:path');

/**
 * Parse a git remote URL into its components
 * Handles SSH, HTTPS, and GitHub Enterprise formats
 *
 * @param {string} remoteUrl - The git remote URL
 * @returns {Object|null} Parsed repo info or null if unparseable
 */
function parseGitRemoteUrl(remoteUrl) {
  if (!remoteUrl) return null;

  // Clean up the URL
  const url = remoteUrl.trim();

  // SSH format: git@github.com:owner/repo.git
  const sshMatch = url.match(/^git@([^:]+):([^/]+)\/(.+?)(?:\.git)?$/);
  if (sshMatch) {
    return {
      host: sshMatch[1],
      owner: sshMatch[2],
      repo: sshMatch[3],
      fullUrl: `https://${sshMatch[1]}/${sshMatch[2]}/${sshMatch[3]}`,
      isEnterprise: sshMatch[1] !== 'github.com',
    };
  }

  // HTTPS format: https://github.com/owner/repo.git
  // Also handles: http://ghe.company.com/owner/repo
  const httpsMatch = url.match(/^https?:\/\/([^/]+)\/([^/]+)\/(.+?)(?:\.git)?$/);
  if (httpsMatch) {
    return {
      host: httpsMatch[1],
      owner: httpsMatch[2],
      repo: httpsMatch[3],
      fullUrl: `https://${httpsMatch[1]}/${httpsMatch[2]}/${httpsMatch[3]}`,
      isEnterprise: httpsMatch[1] !== 'github.com',
    };
  }

  return null;
}

/**
 * Detect the git remote URL for a project directory
 *
 * @param {string} projectDir - The project directory path
 * @returns {Object|null} Parsed repo info or null if not a git repo
 */
function detectGitRepo(projectDir) {
  try {
    const remoteUrl = execSync('git config --get remote.origin.url', {
      cwd: projectDir,
      encoding: 'utf8',
      stdio: ['pipe', 'pipe', 'pipe'],
    });

    return parseGitRemoteUrl(remoteUrl);
  } catch {
    // Not a git repo or no remote configured
    return null;
  }
}

/**
 * Generate the bootstrap prompt content with repo details filled in
 *
 * @param {Object} repoInfo - Repository info from detectGitRepo
 * @param {string} agentPath - Path to the agent file in the repo
 * @returns {string} The bootstrap prompt content
 */
function generateBootstrapPrompt(repoInfo, agentPath = 'src/modules/bmm/agents/po.agent.yaml') {
  const repoRef = repoInfo.isEnterprise
    ? `${repoInfo.host}/${repoInfo.owner}/${repoInfo.repo}`
    : `${repoInfo.owner}/${repoInfo.repo}`;

  return `# BMAD Product Owner - Claude Desktop Bootstrap

This prompt is pre-configured for your repository.

---

## Quick Start

Copy and paste this into Claude Desktop:

\`\`\`
Load the Product Owner agent from ${repoInfo.fullUrl}
(path: ${agentPath}) and enter PO mode.
Show me what needs my attention.
\`\`\`

---

## Full Version

\`\`\`
Fetch and embody the BMAD Product Owner agent.

1. Read the agent definition from GitHub:
   - Host: ${repoInfo.host}
   - Repository: ${repoInfo.owner}/${repoInfo.repo}
   - Path: ${agentPath}

2. After reading, fully embody this agent:
   - Adopt the persona (name, role, communication style)
   - Internalize all principles
   - Make the menu commands available

3. Introduce yourself and show the available commands.

4. Then check: what PRDs or stories need my attention?

Use GitHub MCP tools (mcp__github__*) for all GitHub operations.
\`\`\`

---

## For Stakeholders

\`\`\`
I'm a stakeholder who needs to review PRDs and give feedback.

Load the Product Owner agent from ${repoInfo.fullUrl}
(path: ${agentPath})

Then show me:
1. What PRDs need my feedback
2. What PRDs need my sign-off

I'll mainly use: MT (my tasks), SF (submit feedback), SO (sign off)
\`\`\`

---

## Repository Details

| Field | Value |
|-------|-------|
| Host | ${repoInfo.host} |
| Owner | ${repoInfo.owner} |
| Repo | ${repoInfo.repo} |
| Enterprise | ${repoInfo.isEnterprise ? 'Yes' : 'No'} |

Generated during BMAD installation.
`;
}

module.exports = {
  parseGitRemoteUrl,
  detectGitRepo,
  generateBootstrapPrompt,
};
