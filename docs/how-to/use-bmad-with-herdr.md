---
title: 'Use BMAD with Herdr'
description: Run BMAD agents inside Herdr terminal panes, install BMAD skills via the open skills CLI, and orchestrate multi-agent workflows with the Herdr sidebar.
sidebar:
  order: 14
---

Herdr is a terminal multiplexer built for AI coding agents. It detects GitHub Copilot CLI, Claude Code, Codex, and other agents running inside panes, surfaces their state in a sidebar, and lets you drive them through its CLI. BMAD skills install directly into whichever agent you are running — Herdr sees the agent; BMAD shapes how that agent thinks.

## Install Herdr

```bash
curl -fsSL https://herdr.dev/install.sh | sh
herdr
```

Install the GitHub Copilot CLI integration so Herdr can report native session identity and restore your session after a restart:

```bash
herdr integration install copilot
```

## Install BMAD skills via the open skills CLI

BMAD publishes all its skills in the open skills format. Install them into your current agent with one command:

```bash
npx skills add bmad-code-org/BMAD-METHOD
```

The CLI discovers all 35+ BMAD skills — analysis, planning, architecture, implementation, and persona agents — and presents a picker. Use `--global` (`-g`) to install at the user level so every project inherits them:

```bash
npx skills add bmad-code-org/BMAD-METHOD -g
```

To install without an interactive prompt:

```bash
npx skills add bmad-code-org/BMAD-METHOD --yes -g
```

:::note[Skill locations]
The skills CLI places BMAD skills where your agent reads them. For GitHub Copilot CLI that is `~/.agents/skills/` (global) or `.agents/skills/` (project). For Claude Code it is `~/.claude/skills/` or `.claude/skills/`. The path matches the agent you are running inside Herdr.
:::

## Start a BMAD agent inside Herdr

Open a Herdr pane, start Copilot CLI (or any supported agent), then invoke a BMAD persona:

```bash
# In a Herdr pane
copilot-cli chat

# In the chat, invoke a persona
/skill bmad-agent-dev
```

Herdr detects the agent state automatically. The sidebar shows the persona as `working`, `blocked`, or `done`.

## Orchestrate multiple BMAD agents with Herdr

Herdr's CLI lets one agent drive others. If you are running inside a Herdr pane (`HERDR_ENV=1`), install the Herdr skill into the running agent so it knows how to control panes:

```bash
npx skills add ogulcancelik/herdr --skill herdr -g
```

Then prompt your agent to coordinate:

```
Start a reviewer agent in a sibling pane, give it the bmad-code-review skill,
and have it review the current diff while I continue in this pane.
```

The agent uses the Herdr CLI (`herdr pane split`, `herdr agent start`, `herdr agent prompt`) to open a second pane, start another Copilot CLI instance as `reviewer`, load the `bmad-code-review` skill, and submit the review task — all without interrupting your flow.

## Assign BMAD persona agents to GitHub PRs inside Herdr

If you have run `npx bmad-method install` for the `github-copilot` platform, the installer created `.github/agents/*.agent.md` files for each persona. Open a PR in GitHub and select one of those agents from the Custom Agents picker. The agent reads its SKILL.md and follows BMAD methodology for the full PR lifecycle.

You can trigger the same agent from a Herdr pane by starting Copilot CLI and passing the PR URL:

```bash
copilot-cli chat --pr https://github.com/org/repo/pull/123
```

Herdr tracks the agent state while it reviews, waits for `blocked` (when the agent needs your input), and scrolls back to show the results when `done`.

:::tip[Recommended workflow]
Use `npx bmad-method install` for the full per-project skill installation (creates `.agents/skills/`, custom agent pointers, etc.). Use `npx skills add bmad-code-org/BMAD-METHOD -g` for a lightweight global install that travels with you across all Herdr sessions on the machine.
:::
