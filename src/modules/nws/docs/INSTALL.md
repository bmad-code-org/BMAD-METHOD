# NWS Installation Guide

## How It Works

NWS lives inside the `bmad-novel-suite` fork of BMAD-METHOD at `src/modules/nws/`. The BMAD installer compiles the agent YAML files, copies all module files into your novel project's `_bmad/nws/` directory, and generates the AI tool slash commands.

## Prerequisites

- Node.js 18+
- The `bmad-novel-suite` repository cloned locally
- A novel project directory to install into

```bash
git clone https://github.com/YOUR_USERNAME/bmad-novel-suite.git
cd bmad-novel-suite
npm install
```

## Installing NWS into a Project

Run the installer from the `bmad-novel-suite` root — **not** `npx bmad-method install`, which uses the published npm package and won't find your local module:

```bash
node tools/bmad-npx-wrapper.js install
```

When prompted:
1. Enter your novel project path (e.g. `/Users/you/my-novel`)
2. Select **Novel Writing Suite** from the module list
3. Select your AI tool (Claude Code, Cursor, etc.)
4. Complete setup

## What Gets Installed

```
your-novel-project/
├── _bmad/
│   ├── nws/
│   │   ├── agents/           # Compiled agent files (6 agents)
│   │   ├── workflows/        # 5 workflow definitions
│   │   ├── knowledge/        # Writing craft reference
│   │   └── docs/             # This documentation
│   └── _memory/
│       └── librarian-sidecar/ # Librarian's persistent knowledge base
└── .claude/
    └── commands/
        ├── bmad-agent-nws-atlas.md
        ├── bmad-agent-nws-editor.md
        ├── bmad-agent-nws-librarian.md
        ├── bmad-agent-nws-muse.md
        ├── bmad-agent-nws-sage.md
        └── bmad-agent-nws-scribe.md
```

## Accessing the Agents (Claude Code)

After installation, agents appear as slash commands. In Claude Code, type `/` and search for `nws`:

| Command | Agent |
|---|---|
| `/bmad-agent-nws-librarian` | The Librarian — text analysis |
| `/bmad-agent-nws-sage` | The Sage — story discovery |
| `/bmad-agent-nws-atlas` | Atlas — story architecture |
| `/bmad-agent-nws-muse` | The Muse — narrative voice |
| `/bmad-agent-nws-scribe` | The Scribe — chapter drafting |
| `/bmad-agent-nws-editor` | The Editor — revision |

## Verify Installation

```bash
# Agents compiled
ls _bmad/nws/agents/

# Workflows present
ls _bmad/nws/workflows/

# Claude Code commands created
ls .claude/commands/bmad-agent-nws-*.md

# Librarian sidecar initialized
ls _bmad/_memory/librarian-sidecar/
```

## Troubleshooting

### Agent not appearing as slash command

- Verify `.claude/commands/bmad-agent-nws-*.md` files exist in your novel project
- Restart Claude Code (commands are loaded at startup)
- Re-run the installer from the `bmad-novel-suite` directory

### Module not listed during install

- Confirm you are running `node tools/bmad-npx-wrapper.js install` from the `bmad-novel-suite` root, **not** `npx bmad-method install`
- Verify `src/modules/nws/module.yaml` exists

### Agent compiles but doesn't respond correctly

- Check the compiled agent: `cat _bmad/nws/agents/muse.md`
- It should contain an `<agent>` XML block with persona and menu
- Re-run the installer to recompile

### Librarian sidecar missing

- In `src/modules/nws/agents/librarian.agent.yaml`, verify `hasSidecar: true` is set in `agent.metadata`
- Re-run the installer

## Updating NWS

When you change agent or workflow files in `src/modules/nws/`, re-run the installer to recompile and redeploy:

```bash
# From bmad-novel-suite root
node tools/bmad-npx-wrapper.js install
# Choose "Update" when prompted, select your novel project
```

## Development Workflow

```bash
# 1. Edit agent YAML
vim src/modules/nws/agents/muse.agent.yaml

# 2. Re-run installer to compile and install
node tools/bmad-npx-wrapper.js install

# 3. Open Claude Code in your novel project and test
/bmad-agent-nws-muse
```

### Adding a New Agent

1. Create `src/modules/nws/agents/newagent.agent.yaml` following the structure of existing agents
2. If the agent needs persistent storage, create `src/modules/nws/agents/newagent-sidecar/` and set `hasSidecar: true` in metadata
3. Re-run the installer

### Adding a New Workflow

1. Create `src/modules/nws/workflows/new-workflow/workflow.yaml`
2. Optionally add `workflow.md` for user documentation
3. Reference the workflow in an agent's menu items
4. Re-run the installer

## Module Source Structure

```
src/modules/nws/
├── module.yaml                     # Module config (name, version, code: "nws")
├── agents/
│   ├── librarian.agent.yaml
│   ├── librarian-sidecar/          # Librarian's persistent storage template
│   │   ├── instructions.md
│   │   ├── memories.md
│   │   └── knowledge/
│   │       ├── analyzed-texts/
│   │       ├── technique-patterns/
│   │       └── genre-databases/
│   ├── sage.agent.yaml
│   ├── atlas.agent.yaml
│   ├── muse.agent.yaml
│   ├── scribe.agent.yaml
│   └── editor.agent.yaml
├── workflows/
│   ├── analyze-text/
│   ├── create-story-brief/
│   ├── create-character-profiles/
│   ├── design-plot-structure/
│   └── write-chapter/
├── knowledge/
│   ├── narrative-techniques.md
│   └── genre-conventions.md
└── docs/
    ├── README.md
    ├── INSTALL.md                  # This file
    └── QUICKSTART.md
```
