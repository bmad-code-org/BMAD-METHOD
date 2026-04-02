---
title: Skills
description: Reference for BMad skills — what they are, how they work, and where to find them.
sidebar:
  order: 3
---

Skills are pre-built prompts that load agents, run workflows, or execute tasks inside your IDE. The BMad installer generates them from your installed modules at install time. If you later add, remove, or change modules, re-run the installer to keep skills in sync (see [Troubleshooting](#troubleshooting)).

## Skills vs. Agent Menu Triggers

BMad offers two ways to start work, and they serve different purposes.

| Mechanism | How you invoke it | What happens |
| --- | --- | --- |
| **Skill** | Type the skill name (e.g. `bmad-help`) in your IDE | Directly loads an agent, runs a workflow, or executes a task |
| **Agent menu trigger** | Load an agent first, then type a short code (e.g. `DS`) | The agent interprets the code and starts the matching workflow while staying in character |

Agent menu triggers require an active agent session. Use skills when you know which workflow you want. Use triggers when you are already working with an agent and want to switch tasks without leaving the conversation.

## How Skills Are Generated

When you run `npx bmad-method install`, the installer reads the manifests for every selected module and writes one skill per agent, workflow, task, and tool. Each skill is a directory containing a `SKILL.md` file that instructs the AI to load the corresponding source file and follow its instructions.

The installer uses templates for each skill type:

| Skill type | What the generated file does |
| --- | --- |
| **Agent launcher** | Loads the agent persona file, activates its menu, and stays in character |
| **Workflow skill** | Loads the workflow config and follows its steps |
| **Task skill** | Loads a standalone task file and follows its instructions |
| **Tool skill** | Loads a standalone tool file and follows its instructions |

:::note[Re-running the installer]
If you add or remove modules, run the installer again. It regenerates all skill files to match your current module selection.
:::

## Where Skill Files Live

The installer writes skill files into an IDE-specific directory inside your project. The exact path depends on which IDE you selected during installation.

| IDE / CLI | Skills directory |
| --- | --- |
| Claude Code | `.claude/skills/` |
| Cursor | `.cursor/skills/` |
| Windsurf | `.windsurf/skills/` |
| Other IDEs | See the installer output for the target path |

Each skill is a directory containing a `SKILL.md` file. For example, a Claude Code installation looks like:

```text
.claude/skills/
├── bmad-help/
│   └── SKILL.md
├── bmad-create-prd/
│   └── SKILL.md
├── bmad-agent-dev/
│   └── SKILL.md
└── ...
```

The directory name determines the skill name in your IDE. For example, the directory `bmad-agent-dev/` registers the skill `bmad-agent-dev`.

## How to Discover Your Skills

Type the skill name in your IDE to invoke it. Some platforms require you to enable skills in settings before they appear.

Run `bmad-help` for context-aware guidance on your next step.

:::tip[Quick discovery]
The generated skill directories in your project are the canonical list. Open them in your file explorer to see every skill with its description.
:::

## Skill Categories

### Agent Skills

Agent skills load a specialized AI persona with a defined role, communication style, and menu of workflows. Once loaded, the agent stays in character and responds to menu triggers.

| Example skill | Agent | Role |
| --- | --- | --- |
| `bmad-agent-dev` | Amelia (Developer) | Implements stories with strict adherence to specs |
| `bmad-pm` | John (Product Manager) | Creates and validates PRDs |
| `bmad-architect` | Winston (Architect) | Designs system architecture |

See [Agents](./agents.md) for the full list of default agents and their triggers.

### Workflow Skills

Workflow skills run a structured, multi-step process without loading an agent persona first. They load a workflow configuration and follow its steps.

| Example skill | Purpose |
| --- | --- |
| `bmad-product-brief` | Create a product brief — guided discovery when your concept is clear |
| `bmad-prfaq` | Working Backwards PRFAQ challenge to stress-test your product concept |
| `bmad-create-prd` | Create a Product Requirements Document |
| `bmad-create-architecture` | Design system architecture |
| `bmad-create-epics-and-stories` | Create epics and stories |
| `bmad-dev-story` | Implement a story |
| `bmad-code-review` | Run a code review |
| `bmad-quick-dev` | Unified quick flow — clarify intent, plan, implement, review, present |

See [Workflow Map](./workflow-map.md) for the complete workflow reference organized by phase.

### Task and Tool Skills

Tasks and tools are standalone operations that do not require an agent or workflow context.

**BMad-Help: Your Intelligent Guide**

`bmad-help` is your primary interface for discovering what to do next. It inspects your project, understands natural language queries, and recommends the next required or optional step based on your installed modules.

:::note[Example]
```
bmad-help
bmad-help I have a SaaS idea and know all the features. Where do I start?
bmad-help What are my options for UX design?
```
:::

**Other Core Tasks and Tools**

The core module includes 11 built-in tools — reviews, compression, brainstorming, document management, and more. See [Core Tools](./core-tools.md) for the complete reference.

## Naming Convention

All skills use the `bmad-` prefix followed by a descriptive name (e.g., `bmad-agent-dev`, `bmad-create-prd`, `bmad-help`). See [Modules](./modules.md) for available modules.

## Troubleshooting

**Skills not appearing after install.** Some platforms require skills to be explicitly enabled in settings. Check your IDE's documentation or ask your AI assistant how to enable skills. You may also need to restart your IDE or reload the window.

**Expected skills are missing.** The installer only generates skills for modules you selected. Run `npx bmad-method install` again and verify your module selection. Check that the skill files exist in the expected directory.

**Skills from a removed module still appear.** The installer does not delete old skill files automatically. Remove the stale directories from your IDE's skills directory, or delete the entire skills directory and re-run the installer for a clean set.
