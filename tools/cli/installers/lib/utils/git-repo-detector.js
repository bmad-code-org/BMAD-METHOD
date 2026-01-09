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
  // For GitHub Enterprise, note it may require different MCP config
  const enterpriseNote = repoInfo.isEnterprise
    ? `

> **Note:** This is a GitHub Enterprise repository (${repoInfo.host}).
> Ensure your GitHub MCP is configured for this host.`
    : '';

  return `# BMAD Product Owner - Claude Desktop Bootstrap

This prompt is pre-configured for your repository.${enterpriseNote}

---

## Quick Start

Copy and paste this into Claude Desktop:

\`\`\`
Use GitHub MCP to fetch and embody the BMAD Product Owner agent.

Fetch the agent file with mcp__github__get_file_contents:
  owner: ${repoInfo.owner}
  repo: ${repoInfo.repo}
  path: ${agentPath}

After reading:
1. Embody the agent persona (name, role, principles)
2. Show me available commands
3. Check what PRDs or tasks need my attention
\`\`\`

---

## Full Version

\`\`\`
I need you to act as the BMAD Product Owner agent.

Step 1: Fetch the agent definition using GitHub MCP
Use mcp__github__get_file_contents with:
  owner: ${repoInfo.owner}
  repo: ${repoInfo.repo}
  path: ${agentPath}

Step 2: Fully embody this agent
  - Adopt the persona (name: Sarah, role: Product Owner)
  - Internalize all principles from the file
  - Make the menu commands available
  - Use GitHub MCP tools for all GitHub operations

Step 3: Introduce yourself and show available commands

Step 4: Check what PRDs or stories need my attention
\`\`\`

---

## For Stakeholders

\`\`\`
I'm a stakeholder who needs to review PRDs and give feedback.

Fetch the Product Owner agent using GitHub MCP:
  owner: ${repoInfo.owner}
  repo: ${repoInfo.repo}
  path: ${agentPath}

Then show me:
1. What PRDs need my feedback
2. What PRDs need my sign-off

I'll mainly use: MT (my tasks), SF (submit feedback), SO (sign off)
\`\`\`

---

## Repository Details

| Field | Value |
|-------|-------|
| Owner | \`${repoInfo.owner}\` |
| Repo | \`${repoInfo.repo}\` |
| Host | \`${repoInfo.host}\` |
| Enterprise | ${repoInfo.isEnterprise ? 'Yes' : 'No'} |

---

## GitHub MCP Reference

All operations use these GitHub MCP tools:
- \`mcp__github__get_file_contents\` - Read files from repo
- \`mcp__github__search_issues\` - Find PRDs and stories
- \`mcp__github__issue_write\` - Create/update issues
- \`mcp__github__add_issue_comment\` - Add feedback

Generated during BMAD installation.
`;
}

module.exports = {
  parseGitRemoteUrl,
  detectGitRepo,
  generateBootstrapPrompt,
};
