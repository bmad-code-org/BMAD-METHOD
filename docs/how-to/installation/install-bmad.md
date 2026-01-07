---
title: "How to Install BMAD"
description: Step-by-step guide to installing BMAD in your project
---


Complete guide to installing BMAD in your project.

---

## Prerequisites

- **Node.js** 20+ (required for the installer)
- **Git** (recommended)
- **AI-powered IDE** (Claude Code, Cursor, Windsurf, or similar)

---

## Steps

### 1. Run the Installer

```bash
npx bmad-method install
```

### 2. Choose Installation Location

The installer will ask where to install BMAD files. Options:
- Current directory (recommended for new projects)
- Subdirectory
- Custom path

### 3. Select Your AI Tools

Choose which AI tools you'll be using:
- Claude Code
- Cursor
- Windsurf
- Other

The installer configures BMAD for your selected tools.

### 4. Choose Modules

Select which modules to install:

| Module | Purpose |
|--------|---------|
| **BMM** | Core methodology for software development |
| **BMGD** | Game development workflows |
| **CIS** | Creative intelligence and facilitation |
| **BMB** | Building custom agents and workflows |

### 5. Add Custom Content (Optional)

If you have custom agents, workflows, or modules:
- Point to their location
- The installer will integrate them

### 6. Configure Settings

For each module, either:
- Accept recommended defaults (faster)
- Customize settings (more control)

---

## Verify Installation

After installation, verify by:

1. Checking the `_bmad/` directory exists
2. Loading an agent in your AI tool
3. Running `*menu` to see available commands

---

## Directory Structure

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

---

## Configuration

Edit `_bmad/[module]/config.yaml` to customize:

```yaml
output_folder: ./_bmad-output
user_name: Your Name
communication_language: english
```

---

## Troubleshooting

### "Command not found: npx"

Install Node.js 20+:
```bash
brew install node

```

### "Permission denied"

Check npm permissions:
```bash
npm config set prefix ~/.npm-global
```

### Installer hangs

Try running with verbose output:
```bash
npx bmad-method install --verbose
```

---

## Related

- [Quick Start Guide](../../tutorials/getting-started/getting-started-bmadv6.md) - Getting started with BMM
- [Upgrade to V6](./upgrade-to-v6.md) - Upgrading from previous versions
- [Install Custom Modules](./install-custom-modules.md) - Adding custom content
