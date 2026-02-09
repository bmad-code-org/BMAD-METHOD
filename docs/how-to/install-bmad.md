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
- **AI tool** (Claude Code, Cursor, Windsurf, or similar)
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
- Windsurf
- Kiro
- Others

Each tool has its own way of integrating commands. The installer creates tiny prompt files to activate workflows and agents — it just puts them where your tool expects to find them.

### 4. Choose Modules

The installer shows available modules. Select whichever ones you need — most users just want **BMad Method** (the software development module).

### 5. Follow the Prompts

The installer guides you through the rest — custom content, settings, etc.

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

Run the `help` workflow (`/bmad-help` on most platforms) to verify everything works and see what to do next.

## Troubleshooting

**Installer throws an error** — Copy-paste the output into your AI assistant and let it figure it out.

**Installer worked but something doesn't work later** — Your AI needs BMad context to help. See [How to Get Answers About BMad](./get-answers-about-bmad.md) for how to point your AI at the right sources.
