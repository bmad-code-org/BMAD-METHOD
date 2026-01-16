---
title: "How to Install BMad"
description: Step-by-step guide to installing BMad in your project
---

Use the `npx bmad-method install` command to set up BMad in your project with your choice of modules and AI tools.

## When to Use This

- Starting a new project with BMad
- Adding BMad to an existing codebase
- Update the existing BMad Installation

:::note[Prerequisites]
- **Node.js** 20+ (required for the installer)
- **Git** (recommended)
- **AI-powered IDE** (Claude Code, Cursor, Windsurf, or similar)
:::

## Steps

### 1. Run the Installer

```bash
npx bmad-method install
```

### 2. Choose Installation Location

The installer will ask where to install BMad files:

- Current directory (recommended for new projects if you created the directory yourself and ran from within the directory)
- Custom path

### 3. Select Your AI Tools

Choose which AI tools you'll be using:

- Claude Code
- Cursor
- Windsurf
-  Many others to choose from

The installer configures BMad for your selected tools by setting up commands that will call the ui.

### 4. Choose Modules

Select which modules to install:

| Module   | Purpose                                   |
| -------- | ----------------------------------------- |
| **BMM**  | Core methodology for software development |
| **BMGD** | Game development workflows                |
| **CIS**  | Creative intelligence and facilitation    |
| **BMB**  | Building custom agents and workflows      |

### 5. Add Custom Content (Optional)

If you have custom agents, workflows, or modules, point to their location and the installer will integrate them.

### 6. Configure Settings

For each module, either accept recommended defaults (faster) or customize settings (more control).

## What You Get

```
your-project/
├── _bmad/
│   ├── bmm/            # Method module
│   │   ├── agents/     # Agent files
│   │   ├── workflows/  # Workflow files
│   │   └── config.yaml # Module config
│   ├── core/           # Core utilities
│   └── ...
├── _bmad-output/       # Generated artifacts
└── .claude/            # IDE configuration
```

## Verify Installation

1. Check the `_bmad/` directory exists
2. Load an agent in your AI tool
3. Run `/workflow-init`  which will autocomplete to the full command to see available commands

## Configuration

Edit `_bmad/[module]/config.yaml` to customize. For example these could be changed:

```yaml
output_folder: ./_bmad-output
user_name: Your Name
communication_language: english
```

## Troubleshooting

**"Command not found: npx"** — Install Node.js 20+:
```bash
brew install node
```

**"Permission denied"** — Check npm permissions:
```bash
npm config set prefix ~/.npm-global
```

**Installer hangs** — Try running with verbose output:
```bash
npx bmad-method install --verbose
```
