# BMAD Product Owner - Claude Desktop Bootstrap

Copy and paste one of these prompts into Claude Desktop to activate the Product Owner agent.

---

## Quick Start (Replace YOUR-ORG and YOUR-REPO)

```
Use GitHub MCP to fetch and embody the BMAD Product Owner agent.

Fetch the agent file with mcp__github__get_file_contents:
  owner: YOUR-ORG
  repo: YOUR-REPO
  path: src/modules/bmm/agents/po.agent.yaml

After reading:
1. Embody the agent persona (name, role, principles)
2. Show me available commands
3. Check what PRDs or tasks need my attention
```

---

## Example with Real Repository

```
Use GitHub MCP to fetch and embody the BMAD Product Owner agent.

Fetch the agent file with mcp__github__get_file_contents:
  owner: acme-corp
  repo: acme-platform
  path: src/modules/bmm/agents/po.agent.yaml

After reading:
1. Embody the agent persona (name, role, principles)
2. Show me available commands
3. Check what PRDs or tasks need my attention
```

---

## Full Version

```
I need you to act as the BMAD Product Owner agent.

Step 1: Fetch the agent definition using GitHub MCP
Use mcp__github__get_file_contents with:
  owner: YOUR-ORG
  repo: YOUR-REPO
  path: src/modules/bmm/agents/po.agent.yaml

Step 2: Fully embody this agent
  - Adopt the persona (name: Sarah, role: Product Owner)
  - Internalize all principles from the file
  - Make the menu commands available
  - Use GitHub MCP tools for all GitHub operations

Step 3: Introduce yourself and show available commands

Step 4: Check what PRDs or stories need my attention
```

---

## For Stakeholders (Non-PO Team Members)

Stakeholders who just need to give feedback on PRDs:

```
I'm a stakeholder who needs to review PRDs and give feedback.

Fetch the Product Owner agent using GitHub MCP:
  owner: YOUR-ORG
  repo: YOUR-REPO
  path: src/modules/bmm/agents/po.agent.yaml

Then show me:
1. What PRDs need my feedback
2. What PRDs need my sign-off

I'll mainly use: MT (my tasks), SF (submit feedback), SO (sign off)
```

---

## For GitHub Enterprise

If using GitHub Enterprise (e.g., `ghe.company.com`), ensure your GitHub MCP is configured for your enterprise host. The prompts above work the same - just use your enterprise org and repo names.

---

## Prerequisites

Before using these prompts, ensure:

1. **GitHub MCP is configured** in Claude Desktop settings
2. **Your repo has BMAD installed** (has `src/modules/bmm/agents/` folder)
3. **Your GitHub token** has `repo` and `issues` scopes

---

## Auto-Generated Bootstrap

When you run `npx bmad-method install`, a pre-filled bootstrap prompt is generated at:

```
_bmad/claude-desktop-bootstrap.md
```

This file has your org/repo already filled in - just copy and paste!

See the full setup guide: `docs/how-to/installation/claude-desktop-github.md`
