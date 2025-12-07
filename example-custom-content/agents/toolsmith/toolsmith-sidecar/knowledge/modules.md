# Modules Domain

## File Index

### Module Source Locations

- @/src/modules/bmb/ - BMAD Builder module
- @/src/modules/bmgd/ - BMAD Game Development module
- @/src/modules/bmm/ - BMAD Method module (flagship)
- @/src/modules/cis/ - Creative Innovation Studio module
- @/src/modules/core/ - Core module (always installed)

### Module Structure Pattern

```
src/modules/{module-name}/
├── agents/                    # Agent YAML files
├── workflows/                 # Workflow directories
├── tasks/                     # Task definitions
├── tools/                     # Tool definitions
├── templates/                 # Document templates
├── teams/                     # Team definitions
├── _module-installer/         # Custom installer (optional)
│   └── installer.js
├── sub-modules/               # IDE-specific customizations
│   └── {ide-name}/
│       ├── injections.yaml
│       ├── config.yaml
│       └── sub-agents/
├── install-config.yaml        # Module install configuration
└── README.md                  # Module documentation
```

### BMM Sub-modules (Example)

- @/src/modules/bmm/sub-modules/claude-code/
  - README.md - Sub-module documentation
  - config.yaml - Configuration
  - injections.yaml - Content injection definitions
  - sub-agents/ - Claude Code specific agents

## Module Installer Pattern

### Custom Installer Location

`src/modules/{module-name}/_module-installer/installer.js`

### Installer Function Signature

```javascript
async function install(options) {
  const { projectRoot, config, installedIDEs, logger } = options;
  // Custom installation logic
  return true; // success
}
module.exports = { install };
```

### What Module Installers Can Do

- Create project directories (output_folder, tech_docs, etc.)
- Copy assets and templates
- Configure IDE-specific features
- Run platform-specific handlers

## Sub-module Pattern (IDE Customization)

### injections.yaml Structure

```yaml
name: module-claude-code
description: Claude Code features for module

injections:
  - file: .bmad/bmm/agents/pm.md
    point: pm-agent-instructions
    content: |
      Injected content...
    when:
      subagents: all # or 'selective'

subagents:
  source: sub-agents
  files:
    - market-researcher.md
    - requirements-analyst.md
```

### How Sub-modules Work

1. Installer detects sub-module exists
2. Loads injections.yaml
3. Prompts user for options (subagent installation)
4. Applies injections to installed files
5. Copies sub-agents to IDE locations

## IDE Handler Requirements

### Creating New IDE Handler

1. Create file: `tools/cli/installers/lib/ide/{ide-name}.js`
2. Extend BaseIdeSetup
3. Implement required methods

```javascript
const { BaseIdeSetup } = require('./_base-ide');

class NewIdeSetup extends BaseIdeSetup {
  constructor() {
    super('new-ide', 'New IDE Name', false); // name, display, preferred
    this.configDir = '.new-ide';
  }

  async setup(projectDir, bmadDir, options = {}) {
    // Installation logic
  }

  async cleanup(projectDir) {
    // Cleanup logic
  }
}

module.exports = { NewIdeSetup };
```

### IDE-Specific Formats

| IDE            | Config Pattern            | File Extension |
| -------------- | ------------------------- | -------------- |
| Claude Code    | .claude/commands/bmad/    | .md            |
| Cursor         | .cursor/rules/bmad/       | .mdc           |
| Windsurf       | .windsurf/workflows/bmad/ | .md            |
| GitHub Copilot | .github/                  | .md            |

## Platform Codes

Defined in @/tools/cli/lib/platform-codes.js

- Used for IDE identification
- Maps codes to display names
- Validates platform selections

## Common Tasks

- Create new module installer: Add \_module-installer/installer.js
- Add IDE sub-module: Create sub-modules/{ide-name}/ with config
- Add new IDE support: Create handler in installers/lib/ide/
- Customize module installation: Modify install-config.yaml

## Relationships

- Module installers use core installer infrastructure
- Sub-modules may need bundler support for web
- New patterns need documentation in docs/
- Platform codes must match IDE handlers

---

## Domain Memories

<!-- Vexor appends module-specific learnings here -->
