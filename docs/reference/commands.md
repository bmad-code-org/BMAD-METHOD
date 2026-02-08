---
title: Commands
description: Reference for BMad slash commands — what they are, how they work, and where to find them.
sidebar:
  order: 3
---

Slash commands are pre-built prompts that load agents, run workflows, or execute tasks inside your IDE. The BMad installer generates them from your installed modules at install time. If you later add, remove, or change modules, re-run the installer to keep commands in sync (see [Troubleshooting](#troubleshooting)).

## Commands vs. Agent Menu Triggers

BMad offers two ways to start work, and they serve different purposes.

| Mechanism | How you invoke it | What happens |
| --- | --- | --- |
| **Slash command** | Type `/bmad-...` in your IDE | Directly loads an agent, runs a workflow, or executes a task |
| **Agent menu trigger** | Load an agent first, then type a short code (e.g. `DS`) | The agent interprets the code and starts the matching workflow while staying in character |

Agent menu triggers require an active agent session. Use slash commands when you know which workflow you want. Use triggers when you are already working with an agent and want to switch tasks without leaving the conversation.

## How Commands Are Generated

When you run `npx bmad-method install`, the installer reads the manifests for every selected module and writes one command file per agent, workflow, task, and tool. Each file is a short markdown prompt that instructs the AI to load the corresponding source file and follow its instructions.

The installer uses templates for each command type:

| Command type | What the generated file does |
| --- | --- |
| **Agent launcher** | Loads the agent persona file, activates its menu, and stays in character |
| **Workflow command** | Loads the workflow engine (`workflow.xml`) and passes the workflow config |
| **Task command** | Loads a standalone task file and follows its instructions |
| **Tool command** | Loads a standalone tool file and follows its instructions |

:::note[Re-running the installer]
If you add or remove modules, run the installer again. It regenerates all command files to match your current module selection.
:::

## Where Command Files Live

The installer writes command files into an IDE-specific directory inside your project. The exact path depends on which IDE you selected during installation.

| IDE / CLI | Command directory |
| --- | --- |
| Claude Code | `.claude/commands/` |
| Cursor | `.cursor/commands/` |
| Windsurf | `.windsurf/workflows/` |
| Other IDEs | See the installer output for the target path |

All IDEs receive a flat set of command files in their command directory. For example, a Claude Code installation looks like:

```text
.claude/commands/
├── bmad-agent-bmm-dev.md
├── bmad-agent-bmm-pm.md
├── bmad-bmm-create-prd.md
├── bmad-editorial-review-prose.md
├── bmad-help.md
└── ...
```

The filename determines the slash command name in your IDE. For example, the file `bmad-agent-bmm-dev.md` registers the command `/bmad-agent-bmm-dev`.

## How to Discover Your Commands

Type `/bmad` in your IDE and use autocomplete to browse available commands.

Run `/bmad-help` for context-aware guidance on your next step.

:::tip[Quick discovery]
The generated command folders in your project are the canonical list. Open them in your file explorer to see every command with its description.
:::

## Command Categories

### Agent Commands

Agent commands load a specialized AI persona with a defined role, communication style, and menu of workflows. Once loaded, the agent stays in character and responds to menu triggers.

| Example command | Agent | Role |
| --- | --- | --- |
| `/bmad-agent-bmm-dev` | Amelia (Developer) | Implements stories with strict adherence to specs |
| `/bmad-agent-bmm-pm` | John (Product Manager) | Creates and validates PRDs |
| `/bmad-agent-bmm-architect` | Winston (Architect) | Designs system architecture |
| `/bmad-agent-bmm-sm` | Bob (Scrum Master) | Manages sprints and stories |

See [Agents](./agents.md) for the full list of default agents and their triggers.

### Workflow Commands

Workflow commands run a structured, multi-step process without loading an agent persona first. They load the workflow engine and pass a specific workflow configuration.

| Example command | Purpose |
| --- | --- |
| `/bmad-bmm-create-prd` | Create a Product Requirements Document |
| `/bmad-bmm-create-architecture` | Design system architecture |
| `/bmad-bmm-dev-story` | Implement a story |
| `/bmad-bmm-code-review` | Run a code review |
| `/bmad-bmm-quick-spec` | Define an ad-hoc change (Quick Flow) |

See [Workflow Map](./workflow-map.md) for the complete workflow reference organized by phase.

### Task and Tool Commands

Tasks and tools are standalone operations that do not require an agent or workflow context.

| Example command | Purpose |
| --- | --- |
| `/bmad-help` | Context-aware guidance and next-step recommendations |
| `/bmad-shard-doc` | Split a large markdown file into smaller sections |
| `/bmad-index-docs` | Index project documentation |
| `/bmad-editorial-review-prose` | Review document prose quality |

## Naming Convention

Command names follow a predictable pattern.

| Pattern | Meaning | Example |
| --- | --- | --- |
| `bmad-agent-<module>-<name>` | Agent launcher | `bmad-agent-bmm-dev` |
| `bmad-<module>-<workflow>` | Workflow command | `bmad-bmm-create-prd` |
| `bmad-<name>` | Core task or tool | `bmad-help` |

Module codes: `bmm` (Agile suite), `bmb` (Builder), `tea` (Test Architect), `cis` (Creative Intelligence), `gds` (Game Dev Studio). See [Modules](./modules.md) for descriptions.

## Troubleshooting

**Commands not appearing after install.** Restart your IDE or reload the window. Some IDEs cache the command list and require a refresh to pick up new files.

**Expected commands are missing.** The installer only generates commands for modules you selected. Run `npx bmad-method install` again and verify your module selection. Check that the command files exist in the expected directory.

**Commands from a removed module still appear.** The installer does not delete old command files automatically. Remove the stale files from your IDE's command directory, or delete the entire command directory and re-run the installer for a clean set.
