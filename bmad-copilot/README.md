# BMAD Copilot

> BMAD-METHOD integration for VS Code GitHub Copilot Chat.

Brings the full BMAD agent and workflow experience into Copilot Chat via the `@bmad` participant. Commands, agents, and workflows are discovered dynamically from your BMAD installation — no manual configuration required.

## Commands

| Command | Description |
|---------|-------------|
| `@bmad /help` | Show available commands and installed items |
| `@bmad /doctor` | Diagnose BMAD installation status |
| `@bmad /list agents` | List all registered agents with metadata |
| `@bmad /list workflows` | List all registered workflows with metadata |
| `@bmad /run agent <name> "<task>"` | Execute task with agent persona |
| `@bmad /run workflow <name> "<task>"` | Execute task in workflow |
| `@bmad /run <name> "<task>"` | Auto-resolve: tries agent first, then workflow |
| `@bmad /agents` | List agents (shorthand for /list agents) |
| `@bmad /agents <name> "<task>"` | Run agent (shorthand for /run agent) |
| `@bmad /workflows` | List workflows (shorthand for /list workflows) |
| `@bmad /workflows <name> "<task>"` | Run workflow (shorthand for /run workflow) |

### Alias & Shorthand Patterns

The parser recognizes multiple forms to match Cloud Code BMAD experience:

```
@bmad /run agent analyst "Generate PRD"        # explicit agent
@bmad /run workflow create-prd "Build PRD"     # explicit workflow
@bmad /run analyst "Generate PRD"              # auto-resolve (agent match)
@bmad /run create-prd "Build PRD"              # auto-resolve (workflow match)
@bmad /run a analyst "Generate PRD"            # shorthand 'a' for agent
@bmad /run w create-prd "Build PRD"            # shorthand 'w' for workflow
@bmad /agents analyst "Generate PRD"           # direct agent command
@bmad /workflows create-prd "Build PRD"        # direct workflow command
@bmad /run bmm agents analyst "Generate PRD"   # namespaced by module
@bmad /run core workflows brainstorming "Go"   # namespaced by module
```

## Dynamic Command Discovery

The extension automatically scans your BMAD installation for agents and workflows:

1. **Agent files** — any `*.agent.yaml` or `*.agent.md` file under the BMAD root
2. **Workflow files** — any `workflow.yaml`, `workflow.md`, or `workflow-*.md`/`workflow-*.yaml` file

For each file found, the extension extracts:

- **Name** — from filename or YAML `name:` field
- **Title** — from agent `metadata.title` (agents only)
- **Description** — from `persona.role` (agents) or `description:` key (workflows)
- **Icon** — from `metadata.icon` (agents only)
- **Module** — inferred from directory structure (e.g. `bmm`, `core`)

The index is rebuilt automatically when files change (via FileSystemWatcher).

### Detection Paths

The extension searches for BMAD in this order:

1. `bmad.rootPath` setting (explicit override)
2. `_bmad/` in workspace root
3. `.bmad-core/` or `_bmad-core/` in workspace root
4. `src/` with `bmm/` or `core/` subdirs (BMAD-METHOD repo layout)

### Copilot Chat Autocomplete

All registered slash commands (`/help`, `/doctor`, `/list`, `/run`, `/agents`, `/workflows`) appear in the Copilot Chat autocomplete when you type `@bmad /`.

## Development (F5)

### Prerequisites

- VS Code 1.93+
- GitHub Copilot + Copilot Chat installed and signed in
- Node.js 20+

### Setup

```bash
cd bmad-copilot
npm install
```

### Launch Extension Development Host

1. Open the `bmad-copilot` folder in VS Code
2. Press **F5** (or Run > Start Debugging)
3. Select **Run Extension** configuration
4. In the Extension Development Host window, open a project with BMAD installed

### Smoke Tests

#### Workspace without BMAD

```
@bmad /doctor     → Shows "BMAD Root: Not found"
```

#### Workspace with BMAD (`_bmad/` present)

```
@bmad /help                                           → Command table + installed items
@bmad /doctor                                         → Detected paths, agent/workflow counts
@bmad /list agents                                    → Table with name, title, module, path
@bmad /list workflows                                 → Table with name, description, module, path
@bmad /run agent analyst "Generate PRD outline"       → Copilot responds as analyst
@bmad /run analyst "Generate PRD outline"             → Same (auto-resolved)
@bmad /agents pm "Plan sprints"                       → Copilot responds as PM
@bmad /run workflow create-prd "Build requirements"   → Copilot runs workflow
@bmad /workflows                                      → Lists all workflows
```

#### BMAD-METHOD repo itself

The extension detects the source layout (`src/bmm/`, `src/core/`) and indexes agents and workflows from `src/`.

## Settings

| Setting | Default | Description |
|---------|---------|-------------|
| `bmad.rootPath` | `""` | Explicit BMAD root directory path |
| `bmad.autoDetect` | `true` | Auto-detect BMAD installation in workspace |

## Architecture

```
src/
├── extension.ts      # Entry point: activation, participant registration
├── chatHandler.ts    # Chat request handler: routes all commands
├── bmadIndex.ts      # BMAD directory detection, metadata extraction, indexing
├── commandParser.ts  # Token parser, alias resolution, fuzzy matching
└── logger.ts         # OutputChannel logging
```

## Limitations

- The VS Code Language Model API requires Copilot Chat authorization. If unavailable, the extension falls back to a copyable assembled prompt with a copy button.
- This extension only reads BMAD files. It does not modify any BMAD content.
- Workflow files using `.xml` format (e.g. `advanced-elicitation`) are not currently indexed.
