# Installers Domain

## File Index

### Core CLI

- @/tools/cli/bmad-cli.js - Main CLI entry (uses Commander.js, auto-loads commands)
- @/tools/cli/README.md - CLI documentation

### Commands Directory

- @/tools/cli/commands/install.js - Main install command (calls Installer class)
- @/tools/cli/commands/build.js - Build operations
- @/tools/cli/commands/list.js - List resources
- @/tools/cli/commands/update.js - Update operations
- @/tools/cli/commands/status.js - Status checks
- @/tools/cli/commands/agent-install.js - Custom agent installation
- @/tools/cli/commands/uninstall.js - Uninstall operations

### Core Installer Logic

- @/tools/cli/installers/lib/core/installer.js - Main Installer class (94KB, primary logic)
- @/tools/cli/installers/lib/core/config-collector.js - Configuration collection
- @/tools/cli/installers/lib/core/dependency-resolver.js - Dependency resolution
- @/tools/cli/installers/lib/core/detector.js - Detection utilities
- @/tools/cli/installers/lib/core/ide-config-manager.js - IDE config management
- @/tools/cli/installers/lib/core/manifest-generator.js - Manifest generation
- @/tools/cli/installers/lib/core/manifest.js - Manifest utilities

### IDE Manager & Base

- @/tools/cli/installers/lib/ide/manager.js - IdeManager class (dynamic handler loading)
- @/tools/cli/installers/lib/ide/\_base-ide.js - BaseIdeSetup class (all handlers extend this)

### Shared Utilities

- @/tools/cli/installers/lib/ide/shared/agent-command-generator.js
- @/tools/cli/installers/lib/ide/shared/workflow-command-generator.js
- @/tools/cli/installers/lib/ide/shared/task-tool-command-generator.js
- @/tools/cli/installers/lib/ide/shared/module-injections.js
- @/tools/cli/installers/lib/ide/shared/bmad-artifacts.js

### CLI Library Files

- @/tools/cli/lib/ui.js - User interface prompts
- @/tools/cli/lib/config.js - Configuration utilities
- @/tools/cli/lib/project-root.js - Project root detection
- @/tools/cli/lib/platform-codes.js - Platform code definitions
- @/tools/cli/lib/xml-handler.js - XML processing
- @/tools/cli/lib/yaml-format.js - YAML formatting
- @/tools/cli/lib/file-ops.js - File operations
- @/tools/cli/lib/agent/compiler.js - Agent YAML to XML compilation
- @/tools/cli/lib/agent/installer.js - Agent installation
- @/tools/cli/lib/agent/template-engine.js - Template processing

## IDE Handler Registry (16 IDEs)

### Preferred IDEs (shown first in installer)

| IDE            | Name           | Config Location           | File Format                   |
| -------------- | -------------- | ------------------------- | ----------------------------- |
| claude-code    | Claude Code    | .claude/commands/         | .md with frontmatter          |
| codex          | Codex          | (varies)                  | .md                           |
| cursor         | Cursor         | .cursor/rules/bmad/       | .mdc with MDC frontmatter     |
| github-copilot | GitHub Copilot | .github/                  | .md                           |
| opencode       | OpenCode       | .opencode/                | .md                           |
| windsurf       | Windsurf       | .windsurf/workflows/bmad/ | .md with workflow frontmatter |

### Other IDEs

| IDE         | Name               | Config Location       |
| ----------- | ------------------ | --------------------- |
| antigravity | Google Antigravity | .agent/               |
| auggie      | Auggie CLI         | .augment/             |
| cline       | Cline              | .clinerules/          |
| crush       | Crush              | .crush/               |
| gemini      | Gemini CLI         | .gemini/              |
| iflow       | iFlow CLI          | .iflow/               |
| kilo        | Kilo Code          | .kilocodemodes (file) |
| qwen        | Qwen Code          | .qwen/                |
| roo         | Roo Code           | .roomodes (file)      |
| trae        | Trae               | .trae/                |

## Architecture Patterns

### IDE Handler Interface

Each handler must implement:

- `constructor()` - Call super(name, displayName, preferred)
- `setup(projectDir, bmadDir, options)` - Main installation
- `cleanup(projectDir)` - Remove old installation
- `installCustomAgentLauncher(...)` - Custom agent support

### Module Installer Pattern

Modules can have custom installers at:
`src/modules/{module-name}/_module-installer/installer.js`

Export: `async function install(options)` with:

- options.projectRoot
- options.config
- options.installedIDEs
- options.logger

### Sub-module Pattern (IDE-specific customizations)

Location: `src/modules/{module-name}/sub-modules/{ide-name}/`
Contains:

- injections.yaml - Content injections
- config.yaml - Configuration
- sub-agents/ - IDE-specific agents

## Common Tasks

- Add new IDE handler: Create file in /tools/cli/installers/lib/ide/, extend BaseIdeSetup
- Fix installer bug: Check installer.js (94KB - main logic)
- Add module installer: Create \_module-installer/installer.js in module
- Update shared generators: Modify files in /shared/ directory

## Relationships

- Installers may trigger bundlers for web output
- Installers create files that tests validate
- Changes here often need docs updates
- IDE handlers use shared generators

---

## Domain Memories

<!-- Vexor appends installer-specific learnings here -->
