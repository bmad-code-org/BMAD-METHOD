# BMad v4 to v6 Upgrade Guide

## Overview

BMad v6 represents a complete ground-up rewrite with significant architectural changes. This guide will help you migrate your v4 project to v6.

---

## Automatic V4 Detection

When you run `npm run install:bmad` on a project with v4 installed, the installer automatically detects:

- **Legacy folders**: Any folders starting with `.bmad`, `bmad` (lowercase), or `Bmad`
- **IDE command artifacts**: Legacy bmad folders in IDE configuration directories (`.claude/commands/`, `.cursor/commands/`, etc.)

### What Happens During Detection

1. **Automatic Backup of v4 Modules**: All `.bmad-*` folders are moved to `v4-backup/` in your project root
   - If a backup already exists, a timestamp is added to avoid conflicts
   - Example: `.bmad-core` → `v4-backup/.bmad-core`
   - Your project files and data are NOT affected

2. **IDE Command Cleanup Recommended**: Legacy v4 IDE commands should be manually removed
   - Located in IDE config folders: `.claude/commands/`, `.cursor/commands/`, etc.
   - These old commands would still reference v4 folder structure if left in place
   - The installer provides copy/paste terminal commands for your platform
   - You can proceed without cleanup, but removing them prevents confusion with old v4 commands

---

## Module Migration

### Deprecated Modules

| v4 Module                     | v6 Status                                        |
| ----------------------------- | ------------------------------------------------ |
| `.bmad-2d-phaser-game-dev`    | Integrated into BMM                              |
| `.bmad-2d-unity-game-dev`     | Integrated into BMM                              |
| `.bmad-godot-game-dev`        | Integrated into BMM                              |
| `.bmad-*-game-dev` (any)      | Integrated into BMM                              |
| `.bmad-infrastructure-devops` | Deprecated - New core devops agent coming in BMM |
| `.bmad-creative-writing`      | Not adapted - New module releasing soon          |

**Game Development**: All game development functionality has been consolidated and expanded within the BMM (BMad Method) module. Game-specific workflows now adapt to your game type and engine.

---

## Architecture Changes

### Folder Structure

**v4 "Expansion Packs" Structure:**

```
your-project/
├── .bmad-core/           # Was actually the BMad Method
├── .bmad-game-dev/       # Separate expansion packs
├── .bmad-creative-writing/
└── .bmad-infrastructure-devops/
```

**v6 Unified Structure:**

```
your-project/
└── {bmad_folder}/       # Single installation folder, default .bmad
    ├── core/            # Real core framework (applies to all modules)
    ├── bmm/             # BMad Method (software/game dev)
    ├── bmb/             # BMad Builder (create agents/workflows)
    ├── cis/             # Creative Intelligence Suite
    └── _cfg/            # Your customizations
        └── agents/      # Agent customization files
```

### Key Concept Changes

- **v4 `.bmad-core`**: Was actually the BMad Method
- **v6 `{bmad_folder}/core/`**: Is the real universal core framework
- **v6 `{bmad_folder}/bmm/`**: Is the BMad Method module
- **Module identification**: All modules now have a `config.yaml` file

---

## Project Progress Migration

### If You've Completed Planning Phase (PRD/Architecture) with the BMad Method:

After running the v6 installer:

1. **Run `workflow-init`** workflow to set up the guided workflow system
2. **Specify your project level** when prompted:
   - If you followed v4's full workflow (PRD → Architecture → Stories), select **Level 3 or 4**
   - This tells v6 you've already completed planning and solutioning phases
3. **Document paths**: Keep your existing paths during installation
   - Default PRD/Architecture location: `docs/`
   - Default stories location: `docs/sprint-artifacts/`
   - **Accept these defaults** if you're already using them in v4

> **Important**: v6 workflows can handle both sharded and unsharded documents. You don't need to restructure your existing PRD or architecture files.

### If You're Mid-Development (Stories Created/Implemented)

1. Complete the v6 installation as above
2. Run `workflow-init` and specify Level 3 or 4
3. When ready to continue development, run the **`sprint-planning`** workflow (Phase 4)

---

## Agent Customization Migration

### v4 Agent Customization

In v4, you may have modified agent files directly in `.bmad-*` folders.

### v6 Agent Customization

**All customizations** now go in `{bmad_folder}/_cfg/agents/` using customize files:

**Example: Renaming an agent and changing communication style**

File: `{bmad_folder}/_cfg/agents/bmm-pm.customize.yaml`

```yaml
# Customize the PM agent
persona:
  name: 'Captain Jack' # Override agent name
  role: 'Swashbuckling Product Owner'
  communication_style: |
    - Talk like a pirate
    - Use nautical metaphors for software concepts
    - Always upbeat and adventurous
```

**How it works:**

- Base agent: `{bmad_folder}/bmm/agents/pm.md`
- Customization: `{bmad_folder}/_cfg/agents/bmm-pm.customize.yaml`
- Result: Agent uses your custom name and style, but updates don't overwrite your changes

---

## Document Compatibility

### Sharded vs Unsharded Documents

**Good news**: Unlike v4, v6 workflows are **fully flexible** with document structure:

- ✅ Sharded documents (split into multiple files)
- ✅ Unsharded documents (single file per section)
- ✅ Custom sections for your project type
- ✅ Mixed approaches

All workflow files are scanned automatically. No manual configuration needed.

---

## Installation Steps

### 1. Clone Repository

```bash
git clone https://github.com/bmad-code-org/BMAD-METHOD
cd BMAD-METHOD
npm install
```

### 2. Run Installer on Your v4 Project

```bash
npx bmad-method install
```

**Enter the full path to your v4 project** when prompted.

### 3. Follow Interactive Prompts

The installer will:

1. Detect v4 installation and offer to backup `.bmad-*` folders
2. Prompt for recommended cleanup (you can skip)
3. Let you select modules (recommend: BMM for software and or game development)
4. Configure core settings (name, language, etc.)
5. Configure module-specific options
6. Configure IDE integrations

### 4. Accept Default Paths

If you're using:

- `docs/` for PRD and architecture
- `docs/sprint-artifacts/` for story files

**Accept these defaults** during installation.

### 5. Initialize Workflow

After installation:

1. **Load the Analyst agent** - See your IDE-specific instructions in [docs/ide-info](./ide-info/) for how to activate agents:
   - [Claude Code](./ide-info/claude-code.md)
   - [Cursor](./ide-info/cursor.md)
   - [VS Code/Windsurf](./ide-info/) - Check your IDE folder

2. **Wait for the agent's menu** to appear

3. **Tell the agent**: `*workflow-init` - v6 supports excellent natural language fuzzy matching, so you could also say "workflow init" or "please init the workflow"

Since you are migrating an existing project from v4, it's most likely **Level 3 or 4** you will want to suggest when asked - if you've already completed PRD/architecture in v4.

---

## Post-Migration Checklist

- [ ] v4 folders backed up to `v4-backup/`
- [ ] v6 installed to `{bmad_folder}/` folder
- [ ] `workflow-init` run with correct project level selected
- [ ] Agent customizations migrated to `{bmad_folder}/_cfg/agents/` if needed
- [ ] IDE integration working (test by listing agents)
- [ ] For active development: `sprint-planning` workflow executed

---

## Getting Help

- **Discord**: [Join the BMad Community](https://discord.gg/gk8jAdXWmj)
- **Issues**: [GitHub Issue Tracker](https://github.com/bmad-code-org/BMAD-METHOD/issues)
- **Docs**: Check `{bmad_folder}/docs/` in your installation for IDE-specific instructions
