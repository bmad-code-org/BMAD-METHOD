---
title: "Using BMAD with Claude Desktop + GitHub"
description: Use BMAD agents in Claude Desktop without local installation
---

Use BMAD agents directly in Claude Desktop by reading agent files from GitHub. Perfect for Product Owners, stakeholders, and team members who don't need a full local development setup.

## Prerequisites

- **Claude Desktop** with GitHub MCP configured
- **GitHub repository** with BMAD installed (has `_bmad/` folder)
- **GitHub Personal Access Token** with `repo` and `issues` scopes

## Step 1: Configure GitHub MCP

Open Claude Desktop settings and add the GitHub MCP server:

1. Go to **Settings** → **Developer** → **Model Context Protocol**
2. Add this configuration:

```json
{
  "mcpServers": {
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "your-token-here"
      }
    }
  }
}
```

3. Create a token at: https://github.com/settings/tokens
   - Required scopes: `repo`, `issues`, `read:org`
4. Restart Claude Desktop

## Step 2: Load a BMAD Agent

In a new Claude Desktop conversation, ask Claude to load an agent from your repo:

```
Please read and embody the Product Owner agent from my repository.
Fetch the file from: github.com/YOUR-ORG/YOUR-REPO at path
src/modules/bmm/agents/po.agent.yaml

After reading it, introduce yourself and show me the available commands.
```

Claude will:
1. Use `mcp__github__get_file_contents` to fetch the agent definition
2. Parse the persona, menu, and prompts
3. Embody the agent and present the menu

## Step 3: Start Using Team Features

Once the agent is loaded, you can use all the team collaboration features:

### Check Your Tasks
```
What needs my attention?
```
or just type `MT`

### Create a PRD
```
Create a new PRD for user authentication
```
or type `CP`

### View PRD Dashboard
```
Show me all PRDs
```
or type `PD`

## Available Agents

| Agent | Path | Purpose |
|-------|------|---------|
| **Product Owner** | `src/modules/bmm/agents/po.agent.yaml` | PRD management, stories, stakeholder coordination |
| **Analyst** | `src/modules/bmm/agents/analyst.agent.yaml` | Project initialization, workflow guidance |
| **PM** | `src/modules/bmm/agents/pm.agent.yaml` | Requirements, epics, story creation |
| **Architect** | `src/modules/bmm/agents/architect.agent.yaml` | Architecture decisions, technical design |

## How It Works

```
┌─────────────────────────────────────────────────────────────┐
│                    CLAUDE DESKTOP                           │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  User: "Load the PO agent from my repo"                     │
│                    │                                        │
│                    ▼                                        │
│  ┌─────────────────────────────────────┐                    │
│  │     GitHub MCP                      │                    │
│  │     mcp__github__get_file_contents  │                    │
│  │     → Fetches po.agent.yaml         │                    │
│  └─────────────────────────────────────┘                    │
│                    │                                        │
│                    ▼                                        │
│  Claude embodies the agent persona                          │
│                    │                                        │
│                    ▼                                        │
│  User: "MT" (my tasks)                                      │
│                    │                                        │
│                    ▼                                        │
│  ┌─────────────────────────────────────┐                    │
│  │     GitHub MCP                      │                    │
│  │     mcp__github__search_issues      │                    │
│  │     → Finds PRDs needing attention  │                    │
│  └─────────────────────────────────────┘                    │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## Tips for Best Results

### Start Each Session Fresh
Load the agent at the beginning of each conversation:
```
Load the PO agent from github.com/myorg/myrepo
```

### Use Natural Language
The agent understands natural language, not just commands:
- "What PRDs are waiting for feedback?"
- "Create a story for the login epic"
- "Who's working on authentication?"

### Combine with Project Knowledge
For even better context, you can also upload the `llms-full.txt` file to your Claude Project:
```
curl https://bmad-code-org.github.io/BMAD-METHOD/llms-full.txt
```

This gives Claude the full BMAD methodology documentation.

## Comparison: Local Install vs GitHub MCP

| Feature | Local Install | GitHub MCP Only |
|---------|--------------|-----------------|
| Requires Node.js | ✅ Yes | ❌ No |
| `/agent-name` commands | ✅ Yes | ❌ Manual load |
| Agent files | Local in `_bmad/` | Fetched from GitHub |
| GitHub Issues | ✅ Works | ✅ Works |
| PRD Crowdsourcing | ✅ Works | ✅ Works |
| Story Locking | ✅ Works | ✅ Works |
| Best for | Developers | POs, Stakeholders |

## Troubleshooting

### "Agent file not found"
- Verify the repository has BMAD installed
- Check the file path is correct
- Ensure your token has `repo` access

### "GitHub API errors"
- Check your token hasn't expired
- Verify the token has required scopes
- Try: "Can you call mcp__github__get_me?"

### "Agent doesn't understand commands"
- Make sure Claude fully read and embodied the agent
- Try asking Claude to "show the menu" to verify
- Start a fresh conversation and reload the agent

## Quick Start - Bootstrap Prompts

Copy and paste this into Claude Desktop to get started immediately:

### Minimal Version
```
Load the Product Owner agent from github.com/YOUR-ORG/YOUR-REPO
(path: src/modules/bmm/agents/po.agent.yaml) and enter PO mode.
Show me what needs my attention.
```

### Full Version
```
Fetch and embody the BMAD Product Owner agent.

1. Read the agent definition from GitHub:
   - Repository: YOUR-ORG/YOUR-REPO
   - Path: src/modules/bmm/agents/po.agent.yaml

2. After reading, fully embody this agent:
   - Adopt the persona (name, role, communication style)
   - Internalize all principles
   - Make the menu commands available

3. Introduce yourself and show the available commands.

4. Then check: what PRDs or stories need my attention?

Use GitHub MCP tools (mcp__github__*) for all GitHub operations.
```

Replace `YOUR-ORG` and `YOUR-REPO` with your actual repository details.

For more bootstrap prompts (including stakeholder-specific versions), see:
`resources/prompts/claude-desktop-po-bootstrap.md`

---

## Related

- [Install BMAD Locally](./install-bmad.md) - Full local installation
- [Team Collaboration Features](../../../docs/TEAM-COLLABORATION-FEATURES.md) - PRD crowdsourcing overview
- [Getting Started](../../tutorials/getting-started/getting-started-bmadv6.md) - Full tutorial
