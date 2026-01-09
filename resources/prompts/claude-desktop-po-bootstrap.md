# BMAD Product Owner - Claude Desktop Bootstrap

Copy and paste this entire prompt into Claude Desktop to activate the Product Owner agent.

---

## Quick Start (Replace YOUR-ORG/YOUR-REPO)

```
Fetch and embody the BMAD Product Owner agent.

1. Read the agent definition from GitHub:
   - Repository: YOUR-ORG/YOUR-REPO
   - Path: src/modules/bmm/agents/po.agent.yaml

2. After reading, fully embody this agent:
   - Adopt the persona (name, role, communication style)
   - Internalize all principles
   - Make the menu commands available
   - Load any prompts defined in the file

3. Introduce yourself and show the available commands.

4. Then check: what PRDs or stories need my attention?

Use GitHub MCP tools (mcp__github__*) for all GitHub operations.
```

---

## Example with Real Repository

```
Fetch and embody the BMAD Product Owner agent.

1. Read the agent definition from GitHub:
   - Repository: acme-corp/acme-platform
   - Path: src/modules/bmm/agents/po.agent.yaml

2. After reading, fully embody this agent:
   - Adopt the persona (name, role, communication style)
   - Internalize all principles
   - Make the menu commands available
   - Load any prompts defined in the file

3. Introduce yourself and show the available commands.

4. Then check: what PRDs or stories need my attention?

Use GitHub MCP tools (mcp__github__*) for all GitHub operations.
```

---

## Minimal Version

If you just want the shortest possible bootstrap:

```
Load the Product Owner agent from github.com/YOUR-ORG/YOUR-REPO
(path: src/modules/bmm/agents/po.agent.yaml) and enter PO mode.
Show me what needs my attention.
```

---

## For Stakeholders (Non-PO Team Members)

Stakeholders who just need to give feedback on PRDs can use a lighter prompt:

```
I'm a stakeholder who needs to review PRDs and give feedback.

Load the Product Owner agent from github.com/YOUR-ORG/YOUR-REPO
(path: src/modules/bmm/agents/po.agent.yaml)

Then show me:
1. What PRDs need my feedback
2. What PRDs need my sign-off

I'll mainly use these commands:
- MT (my tasks)
- SF (submit feedback)
- SO (sign off)
- VF (view feedback)
```

---

## Prerequisites

Before using these prompts, ensure:

1. **GitHub MCP is configured** in Claude Desktop settings
2. **Your repo has BMAD installed** (has `src/modules/bmm/agents/` folder)
3. **Your GitHub token** has `repo` and `issues` scopes

See the full setup guide: `docs/how-to/installation/claude-desktop-github.md`
