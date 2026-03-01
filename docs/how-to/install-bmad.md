---
title: "How to Install BMad"
description: Step-by-step guide to installing BMad in your project
sidebar:
  order: 1
---

Use the `npx bmad-method install` command to set up BMad in your project with your choice of modules and AI tools.

If you want to use a non interactive installer and provide all install options on the command line, see [this guide](./non-interactive-installation.md).

## When to Use This

- Starting a new project with BMad
- Adding BMad to an existing codebase
- Update the existing BMad Installation

:::note[Prerequisites]
- **Node.js** 20+ (required for the installer)
- **Git** (recommended)
- **AI tool** (Claude Code, Cursor, or similar)
:::

## Steps

### 1. Run the Installer

```bash
npx bmad-method install
```

:::tip[Bleeding edge]
To install the latest from the main branch (may be unstable):
```bash
npx github:bmad-code-org/BMAD-METHOD install
```
:::

### 2. Choose Installation Location

The installer will ask where to install BMad files:

- Current directory (recommended for new projects if you created the directory yourself and ran from within the directory)
- Custom path

### 3. Select Your AI Tools

Pick which AI tools you use:

- Claude Code
- Cursor
- Others

Each tool has its own way of integrating commands. The installer creates tiny prompt files to activate workflows and agents — it just puts them where your tool expects to find them.

### 4. Choose Modules

The installer shows available modules. Select whichever ones you need — most users just want **BMad Method** (the software development module).

### 5. Configure Settings

The installer prompts you for core settings that control how agents behave:

| Setting | Default | Description |
| ------- | ------- | ----------- |
| **User Name** | `BMad` | What agents call you — use your name or a team name |
| **Communication Language** | `English` | Language agents use when chatting with you |
| **Document Output Language** | `English` | Language for generated documents and artifacts |
| **Output Folder** | `_bmad-output` | Where agents save generated files |
| **Interaction Style** | `structured` | How agents ask you questions (see below) |

**Interaction Style** controls how agents present choices:

- **Structured** (recommended) — Agents present numbered option lists for every question, using your IDE's native question tool when available. This keeps conversations focused and reduces ambiguity.
- **Open** — Agents ask natural conversational questions. More flexible but can lead to longer back-and-forth.

These settings are saved to `_bmad/<module>/config.yaml` and can be changed later by editing that file and rerunning the installer.

## What You Get

```text
your-project/
├── _bmad/
│   ├── bmm/            # Your selected modules
│   │   └── config.yaml # Module settings (if you ever need to change them)
│   ├── core/           # Required core module
│   └── ...
├── _bmad-output/       # Generated artifacts
├── .claude/            # Claude Code commands (if using Claude Code)
└── .kiro/              # Kiro steering files (if using Kiro)
```

## Verify Installation

Run `/bmad-help` to verify everything works and see what to do next.

**BMad-Help is your intelligent guide** that will:
- Confirm your installation is working
- Show what's available based on your installed modules
- Recommend your first step

You can also ask it questions:
```
/bmad-help I just installed, what should I do first?
/bmad-help What are my options for a SaaS project?
```

## Troubleshooting

**Installer throws an error** — Copy-paste the output into your AI assistant and let it figure it out.

**Installer worked but something doesn't work later** — Your AI needs BMad context to help. See [How to Get Answers About BMad](./get-answers-about-bmad.md) for how to point your AI at the right sources.
