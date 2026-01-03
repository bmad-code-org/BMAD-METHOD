---
sidebar_label: Installation
description: Getting started with BMAD installation
---

# Installation Tutorial

Get BMAD up and running in your project with this step-by-step guide.

---

## Prerequisites

Before you begin, ensure you have:

- **Node.js** 20+ (for the installer)
- **Git** (recommended for version control)
- An **AI-powered IDE** or access to Claude/ChatGPT/Gemini

---

## Quick Install

Run the interactive installer:

```bash
npx bmad-method install
```

This will guide you through the installation process interactively.

---

## What the Installer Does

The interactive installer will:

1. **Choose location** - Where to install BMAD files
2. **Select AI tools** - Claude Code, Cursor, Windsurf, etc.
3. **Choose modules** - BMad Method, Creative Intelligence, BMad Builder
4. **Add custom content** - Your own agents, workflows, or modules
5. **Configure settings** - Accept defaults or customize each module

---

## Module Options

During installation, choose which modules to install:

| Module   | Description          | Best For                                              |
| -------- | -------------------- | ----------------------------------------------------- |
| **BMM**  | BMAD Method Core     | Software development projects                         |
| **BMGD** | Game Development     | Game projects with specialized workflows              |
| **CIS**  | Creative Intel Suite | Creativity unlocking, not software dev specific       |
| **BMB**  | Builder              | Creating custom agents and workflows                  |

---

## Post-Installation Structure

After installation, your project will have:

```
your-project/
├── _bmad/              # BMAD configuration and agents
│   ├── bmm/            # Method module (if installed)
│   ├── bmgd/           # Game dev module (if installed)
│   ├── core/           # Core utilities (always installed)
│   └── {others}/       # Additional modules
├── _bmad-output/       # Default output folder
├── .claude/            # IDE-specific setup (varies)
└── ... your code
```

---

## Upgrading?

If you're upgrading from a previous version, see the [Upgrade Guide](../../how-to/installation/upgrade-to-v6.md).

---

## Next Steps

After installation:

1. **[Quick Start Guide](./quick-start-bmm.md)** - Build your first feature
2. **[Understanding Workflows](../../explanation/core-concepts/what-are-workflows.md)** - Learn the methodology
3. **[Understanding Agents](../../explanation/core-concepts/what-are-agents.md)** - BMAD's core building blocks

---

## Troubleshooting

**"Command not found: npx"**
Install Node.js 20+ from [nodejs.org](https://nodejs.org)

**"Permission denied"**
Run with appropriate permissions or check your npm configuration

For more help, see [Install BMAD](../../how-to/installation/install-bmad.md) or join our [Discord](https://discord.gg/bmad).
