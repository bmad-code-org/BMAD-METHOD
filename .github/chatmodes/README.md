# Agent to Chat Mode Conversion

## Overview

This document explains the automated conversion process from BMAD agent YAML files to GitHub Copilot chat mode files.

## What Are Chat Modes?

GitHub Copilot chat modes allow you to activate specialized AI agent personas directly within GitHub Copilot. Each chat mode:

- Loads a specific agent persona with defined role, identity, and communication style
- Provides a menu-driven interface for workflows and tasks
- Maintains context and configuration throughout the session
- Follows the BMAD core framework architecture

## Conversion Script

### Location

`tools/convert-agents-to-chatmodes.js`

### Usage

```bash
# Run the conversion script
npm run convert:chatmodes

# Or directly with node
node tools/convert-agents-to-chatmodes.js
```

### What It Does

The script automatically:

1. **Scans** all agent YAML files in `src/modules/*/agents/`
2. **Parses** the YAML structure (metadata, persona, menu, critical_actions)
3. **Generates** corresponding `.chatmode.md` files in `.github/chatmodes/`
4. **Formats** the content with proper frontmatter and XML structure
5. **Reports** conversion statistics and lists all created files

### Supported Modules

- **BMM** (BMAD Method Module) - 10 agents
- **CIS** (Creative Intelligence Suite) - 5 agents
- **BMB** (BMAD Builder) - 1 agent
- **BMD** (BMAD Developer) - 3 agents
- **Core** - 1 agent

## Chat Mode Structure

Each generated chat mode file contains:

### 1. Frontmatter (YAML)

```yaml
---
description: 'Activates the [Agent Title] agent persona.'
tools: [
    'changes',
    'codebase',
    # ... GitHub Copilot tools
  ]
---
```

### 2. Agent Metadata

```markdown
# [Agent Title] Agent

---

name: "agent-id"
description: "Agent Description"

---
```

### 3. Persona Enforcement

```markdown
You must fully embody this agent's persona and follow all activation instructions exactly as specified.
NEVER break character until given an exit command.
```

### 4. Agent XML Definition

```xml
<agent id="..." name="..." title="..." icon="...">
  <activation>...</activation>
  <persona>...</persona>
  <menu>...</menu>
</agent>
```

## Generated Files

### Complete List (24 files)

#### Core Module (1)

- `core-bmad-master.chatmode.md` - BMad Master orchestrator

#### BMB Module (1)

- `bmb-bmad-builder.chatmode.md` - BMAD Builder agent

#### BMD Module (8)

- `bmd-cli-chief.chatmode.md` - CLI Chief
- `bmd-doc-keeper.chatmode.md` - Documentation Keeper
- `bmd-release-chief.chatmode.md` - Release Officer
- `bmd-README.chatmode.md`
- `bmd-cli-reference.chatmode.md`
- `bmd-instructions.chatmode.md`
- `bmd-memories.chatmode.md`

#### BMM Module (10)

- `bmm-analyst.chatmode.md` - Mary (Business Analyst)
- `bmm-pm.chatmode.md` - John (Product Manager)
- `bmm-architect.chatmode.md` - Winston (Architect)
- `bmm-dev.chatmode.md` - Amelia (Developer)
- `bmm-sm.chatmode.md` - Bob (Scrum Master)
- `bmm-tea.chatmode.md` - Murat (Test Architect)
- `bmm-ux-expert.chatmode.md` - Sally (UX Expert)
- `bmm-game-dev.chatmode.md` - Link Freeman (Game Developer)
- `bmm-game-architect.chatmode.md` - Cloud Dragonborn (Game Architect)
- `bmm-game-designer.chatmode.md` - Samus Shepard (Game Designer)

#### CIS Module (5)

- `cis-brainstorming-coach.chatmode.md` - Carson (Brainstorming Specialist)
- `cis-creative-problem-solver.chatmode.md`
- `cis-design-thinking-coach.chatmode.md`
- `cis-innovation-strategist.chatmode.md`
- `cis-storyteller.chatmode.md`

## Usage in GitHub Copilot

To use a chat mode in GitHub Copilot:

1. **Activate** the chat mode by typing the agent name
2. **Follow** the numbered menu that appears
3. **Select** an option by number or by typing the trigger word
4. **Execute** workflows and tasks as directed by the agent

Example:

```
User: @bmm-pm
Agent: Hello! I'm John, your Product Manager. Here's what I can help you with:
       1. *workflow-status - Check workflow status
       2. *prd - Create Product Requirements Document
       ...
User: 1
Agent: [Executes workflow-status workflow]
```

## Maintenance

### When to Re-run

Re-run the conversion script when:

- New agents are added to any module
- Agent YAML files are updated
- Menu items or workflows are modified
- Persona definitions change

### Verification

After conversion, verify:

1. ✅ All expected files are created
2. ✅ Frontmatter is properly formatted
3. ✅ Agent metadata is complete
4. ✅ Menu items are correctly converted
5. ✅ File count matches agent count

## Technical Details

### Dependencies

- `js-yaml` - YAML parsing
- `node:fs` - File system operations
- `node:path` - Path manipulation

### Error Handling

The script:

- ✅ Skips files without agent definitions
- ✅ Reports errors with file paths
- ✅ Continues processing remaining files
- ✅ Provides summary statistics

### Output Format

- **Encoding:** UTF-8
- **Line Endings:** LF (Unix style)
- **Indentation:** 2 spaces
- **Extension:** `.chatmode.md`

## Future Enhancements

Potential improvements:

- [ ] Validate generated XML structure
- [ ] Support for custom tool lists per agent
- [ ] Incremental updates (only changed files)
- [ ] Dry-run mode for preview
- [ ] Backup existing files before overwrite
- [ ] Integration with BMAD CLI installer

## Related Documentation

- [GitHub Copilot Chat Modes](../../docs/ide-info/github-copilot.md)
- [BMAD Agent Schema](../../src/utility/models/README.md)
- [Workflow System](../../docs/bmm-workflows.md)

---

**Last Updated:** November 8, 2025
**Version:** 6.0.0-alpha.0
