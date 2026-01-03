# BMad v4 to v6 Upgrade Guide

## Overview

BMad v6 represents a complete ground-up rewrite with significant architectural changes. This guide will help you migrate your v4 project to v6.

---

## Automatic V4 Detection

When you run `npm run install:bmad` on a project, the installer automatically detects:

- **Legacy v4 installation folder**: `.bmad-method`
- **IDE command artifacts**: Legacy bmad folders in IDE configuration directories (`.claude/commands/`, `.cursor/commands/`, etc.)

### What Happens During Detection

1. **Automatic Detection of v4 Modules**
   1. Installer will suggest removal or backup of your .bmad-method folder. You can choose to exit the installer and handle this cleanup, or allow the install to continue. Technically you can have both v4 and v6 installed, but it is not recommended. All BMad content and modules will be installed under a .bmad folder, fully segregated.

2. **IDE Command Cleanup Recommended**: Legacy v4 IDE commands should be manually removed
   - Located in IDE config folders, for example claude: `.claude/commands/BMad/agents`, `.claude/commands/BMad/tasks`, etc.
   - NOTE: if the upgrade and install of v6 finished, the new commands will be under `.claude/commands/bmad/<module>/agents|workflows`
   - Note 2: If you accidentally delete the wrong/new bmad commands - you can easily restore them by rerunning the installer, and choose quick update option, and all will be reapplied properly.

## Module Migration

### Deprecated Modules from v4

| v4 Module                     | v6 Status                                      |
| ----------------------------- | ---------------------------------------------- |
| `_bmad-2d-phaser-game-dev`    | Integrated into new BMGD Module                |
| `_bmad-2d-unity-game-dev`     | Integrated into new BMGD Module                |
| `_bmad-godot-game-dev`        | Integrated into new BMGD Module                |
| `_bmad-*-game-dev` (any)      | Integrated into new BMGD Module                |
| `_bmad-infrastructure-devops` | Deprecated - New core devops agent coming soon |
| `_bmad-creative-writing`      | Not adapted - New v6 module coming soon        |

Aside from .bmad-method - if you have any of these others installed also, again its recommended to remove them and use the V6 equivalents, but its also fine if you decide to keep both. But it is not recommended to use both on the same project long term.

## Architecture Changes

### Folder Structure

**v4 "Expansion Packs" Structure:**

```
your-project/
├── .bmad-method/         
├── .bmad-game-dev/       
├── .bmad-creative-writing/
└── .bmad-infrastructure-devops/
```

**v6 Unified Structure:**

```
your-project/
└── _bmad/               # Single installation folder is _bmad
    └── _config/         # Your customizations
    |  └── agents/       # Agent customization files
    ├── core/            # Real core framework (applies to all modules)
    ├── bmm/             # BMad Method (software/game dev)
    ├── bmb/             # BMad Builder (create agents/workflows)
    ├── cis/             # Creative Intelligence Suite
├── _bmad_output         # Default bmad output folder (was doc folder in v4)

```

### Key Concept Changes

- **v4 `_bmad-core and _bmad-method`**: Was actually the BMad Method
- **v6 `_bmad/core/`**: Is the real universal core framework
- **v6 `_bmad/bmm/`**: Is the BMad Method module
- **Module identification**: All modules now have a `config.yaml` file once installed at the root of the modules installed folder

## Project Progress Migration

### If You've Completed Some or all Planning Phases (Brief/PRD/UX/Architecture) with the BMad Method:

After running the v6 installer, if you kept the paths the same as the installation suggested, you will need to move a few files, or run the installer again. It is recommended to stick with these defaults as it will be easier to adapt if things change in the future.

If you have any planning artifacts, put them in a folder called _bmad-output/planning-artifacts at the root of your project, ensuring that:
PRD has PRD in the file name or folder name if sharded.
Similar for 'brief', 'architecture', 'ux-design'.

If you have other long term docs that will not be as ephemeral as these project docs, you can put them in the /docs folder, ideally with a index.md file.

HIGHLY RECOMMENDED NOTE: If you are only partway through planning, its highly recommended to restart and do the PRD, UX and ARCHITECTURE steps. You could even use your existing documents as inputs letting the agent know you want to redo them with the new workflows. These optimized v6 progressive discovery workflows that also will utilize web search at key moments, while offering better advanced elicitation and part mode in the IDE will produce superior results. And then once all are complete, an epics with stories is generated after the architecture step now - ensuring it uses input from all planing documents.

### If You're Mid-Development (Stories Created/Implemented)

1. Complete the v6 installation as above
2. Ensure you have a file called epics.md or epics/epic*.md - these need to be located under the _bmad-output/planning-artifacts folder.
3. Run the scrum masters `sprint-planning` workflow to generate the implementation tracking plan in _bmad-output/implementation-artifacts.
4. Inform the SM after the output is complete which epics and stories were completed already and should be parked properly in the file.

## Agent Customization Migration

### v4 Agent Customization

In v4, you may have modified agent files directly in `_bmad-*` folders.

### v6 Agent Customization

**All customizations** now go in `_bmad/_config/agents/` using customize files:

**Example: Renaming an agent and changing communication style**

File: `_bmad/_config/agents/bmm-pm.customize.yaml`

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

There is a lot more that is possible with agent customization, which is covered in detail in the [Agent Customization Guide](../bmad-customization/agents.md)

CRITICAL NOTE: After you modify the customization file, you need to run the npx installer against your installed location, and choose the option to rebuild all agents, or just do a quick update again. This always builds agents fresh and applies customizations.

**How it works:**

- Base agent: `_bmad/bmm/agents/pm.md`
- Customization: `_bmad/_config/agents/bmm-pm.customize.yaml`
- Rebuild all agents -> Result: Agent uses your custom name and style

## Document Compatibility

### Sharded vs Unsharded Documents

**Good news**: Unlike v4, v6 workflows are **fully flexible** with document structure:

- ✅ Sharded documents (split into multiple files)
- ✅ Unsharded documents (single file per section)
- ✅ Custom sections for your project type
- ✅ Mixed approaches

All workflow files are scanned automatically. No manual configuration needed.
