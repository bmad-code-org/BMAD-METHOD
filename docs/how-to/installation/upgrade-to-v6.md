---
title: "How to Upgrade to v6"
description: Migrate from BMad v4 to v6
---

Use the BMad installer to upgrade from v4 to v6, which includes automatic detection of legacy installations and migration assistance.

## When to Use This

- You have BMad v4 installed (`.bmad-method` folder)
- You want to migrate to the new v6 architecture
- You have existing planning artifacts to preserve

:::note[Prerequisites]
- Node.js 20+
- Existing BMad v4 installation
:::

## Steps

### 1. Run the Installer

```bash
npx bmad-method install
```

The installer automatically detects:

- **Legacy v4 folder**: `.bmad-method`
- **IDE command artifacts**: Legacy bmad folders in `.claude/commands/`, `.cursor/commands/`, etc.

### 2. Handle Legacy Installation

When v4 is detected, you can:

- Allow the installer to back up and remove `.bmad-method`
- Exit and handle cleanup manually
- Keep both (not recommended for same project)

### 3. Clean Up IDE Commands

Manually remove legacy v4 IDE commands:

- `.claude/commands/BMad/agents`
- `.claude/commands/BMad/tasks`

New v6 commands will be at `.claude/commands/bmad/<module>/agents|workflows`.

:::tip[Accidentally Deleted Commands?]
If you delete the wrong commands, rerun the installer and choose "quick update" to restore them.
:::

### 4. Migrate Planning Artifacts

**If you have planning documents (Brief/PRD/UX/Architecture):**

Move them to `_bmad-output/planning-artifacts/` with descriptive names:

- Include `PRD` in filename for PRD documents
- Include `brief`, `architecture`, or `ux-design` accordingly
- Sharded documents can be in named subfolders

**If you're mid-planning:** Consider restarting with v6 workflows. Use your existing documents as inputs—the new progressive discovery workflows with web search and IDE plan mode produce better results.

### 5. Migrate In-Progress Development

If you have stories created or implemented:

1. Complete the v6 installation
2. Place `epics.md` or `epics/epic*.md` in `_bmad-output/planning-artifacts/`
3. Run the Scrum Master's `sprint-planning` workflow
4. Tell the SM which epics/stories are already complete

### 6. Migrate Agent Customizations

**v4:** Modified agent files directly in `_bmad-*` folders

**v6:** All customizations go in `_bmad/_config/agents/` using customize files:

```yaml
# _bmad/_config/agents/bmm-pm.customize.yaml
persona:
  name: 'Captain Jack'
  role: 'Swashbuckling Product Owner'
  communication_style: |
    - Talk like a pirate
    - Use nautical metaphors
```

After modifying customization files, rerun the installer and choose "rebuild all agents" or "quick update".

## What You Get

**v6 unified structure:**

```
your-project/
└── _bmad/               # Single installation folder
    ├── _config/         # Your customizations
    │   └── agents/      # Agent customization files
    ├── core/            # Universal core framework
    ├── bmm/             # BMad Method module
    ├── bmb/             # BMad Builder
    └── cis/             # Creative Intelligence Suite
├── _bmad-output/        # Output folder (was doc folder in v4)
```

## Module Migration

| v4 Module | v6 Status |
|-----------|-----------|
| `_bmad-2d-phaser-game-dev` | Integrated into BMGD Module |
| `_bmad-2d-unity-game-dev` | Integrated into BMGD Module |
| `_bmad-godot-game-dev` | Integrated into BMGD Module |
| `_bmad-infrastructure-devops` | Deprecated — new DevOps agent coming soon |
| `_bmad-creative-writing` | Not adapted — new v6 module coming soon |

## Key Changes

| Concept | v4 | v6 |
|---------|----|----|
| **Core** | `_bmad-core` was actually BMad Method | `_bmad/core/` is universal framework |
| **Method** | `_bmad-method` | `_bmad/bmm/` |
| **Config** | Modified files directly | `config.yaml` per module |
| **Documents** | Sharded or unsharded required setup | Fully flexible, auto-scanned |

## Tips

- **Back up first** — Keep your v4 installation until you verify v6 works
- **Use v6 workflows** — Even partial planning docs benefit from v6's improved discovery
- **Rebuild after customizing** — Always run the installer after changing customize files
