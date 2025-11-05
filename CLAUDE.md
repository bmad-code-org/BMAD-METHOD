# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Overview

**BMad-CORE** is a universal human-AI collaboration framework powering multiple modules for AI-driven development, creative work, and custom solutions. The repository contains the core framework plus three official modules (BMM, BMB, CIS).

**Current version:** v6.0.0-alpha.6 (near-beta quality)

---

## Development Commands

### Testing & Validation

```bash
# Run ALL quality checks (comprehensive - use before pushing)
npm test

# Individual test suites
npm run test:schemas     # Agent schema validation (fixture-based)
npm run test:install     # Installation component tests (compilation)
npm run validate:schemas # YAML schema validation
npm run validate:bundles # Web bundle integrity

# Coverage
npm run test:coverage    # Run schema tests with coverage report
```

**Note:** Requires Node.js 22+ (see .nvmrc). Run `nvm use` to switch to correct version.

### Code Quality

```bash
# Lint check
npm run lint

# Auto-fix linting issues
npm run lint:fix

# Format check (Prettier)
npm run format:check

# Auto-format all files
npm run format:fix
```

### Building & Bundling

```bash
# Bundle all modules for web deployment
npm run bundle

# Rebundle (updates existing bundles)
npm run rebundle

# Install BMAD locally (test installer)
npm run install:bmad
```

### Releases (GitHub Actions)

```bash
# Trigger manual releases (requires gh CLI)
npm run release:patch
npm run release:minor
npm run release:major
npm run release:watch  # Watch release workflow status
```

---

## High-Level Architecture

### 1. Agent Compilation System (YAML → XML/Markdown)

**Two compilation targets with different outputs:**

**IDE Installation (filesystem-aware):**

- Source: `src/modules/{module}/agents/*.agent.yaml`
- Output: `bmad/{module}/agents/{name}.md` (Markdown with XML)
- Features: File paths, customization via `bmad/_cfg/agents/`, IDE slash commands
- Compiled by: `tools/cli/bmad-cli.js install`

**Web Bundles (self-contained):**

- Source: Same YAML files
- Output: `src/modules/{module}/sub-modules/{platform}/sub-agents/{name}.md`
- Features: All dependencies embedded, no file I/O, platform-specific (claude-code, cursor, etc.)
- Compiled by: `npm run bundle`

**Key difference:** `forWebBundle: true/false` flag changes compilation behavior (paths vs inline content).

### 2. Workflow Execution Engine

**All workflows are governed by:** `src/core/tasks/workflow.xml`

**Workflow definition structure:**

```yaml
# Example: src/modules/bmm/workflows/2-plan-workflows/prd/workflow.yaml
name: 'prd'
config_source: '{project-root}/bmad/bmm/config.yaml'
instructions: '{installed_path}/instructions.md'
template: '{installed_path}/prd-template.md'
default_output_file: '{output_folder}/PRD.md'
```

**Execution flow:**

1. Load workflow.yaml and resolve all variables (`{config_source}`, `{project-root}`, `{installed_path}`)
2. Read instructions.md (XML/Markdown with `<step>`, `<action>`, `<template-output>` tags)
3. Execute steps sequentially, prompting user at `<template-output>` tags
4. Write/edit output file after each template section
5. Run checklist.md validation if exists

**Special tags in instructions:**

- `<step n="X">` - Define workflow steps (execute in numerical order)
- `<action>` - Perform an action
- `<template-output>section_name</template-output>` - Save content to file and show user for approval
- `<invoke-workflow>` - Call another workflow
- `<check if="condition">` - Conditional execution

### 3. Module System Architecture

**Directory structure:**

```
src/
├── core/                          # Framework foundation
│   ├── agents/                    # BMad Master orchestrator
│   ├── tasks/                     # Shared task definitions (workflow.xml)
│   ├── workflows/                 # Core workflows (party-mode, brainstorming)
│   └── _module-installer/         # Module installation infrastructure
└── modules/                       # Three official modules
    ├── bmm/                       # BMad Method (software development)
    │   ├── agents/                # 12 agent YAML definitions
    │   ├── workflows/             # 34 workflows across 4 phases
    │   ├── testarch/              # TEA knowledge base (21 fragments, tea-index.csv)
    │   └── docs/                  # User-facing documentation
    ├── bmb/                       # BMad Builder (create custom solutions)
    └── cis/                       # Creative Intelligence Suite
```

**Installation creates:**

```
{target-project}/bmad/
├── core/                          # Compiled core framework
├── bmm/                           # Compiled BMM module
├── bmb/                           # Compiled BMB module
├── cis/                           # Compiled CIS module
└── _cfg/                          # User customizations (survives updates)
    └── agents/                    # Agent customization files
```

### 4. BMM Planning Tracks & Phase System

**3 Planning Tracks (scale-adaptive):**

- **Quick Flow**: Tech-spec only (Phase 2 → Phase 4) - bug fixes, simple features
- **BMad Method**: PRD + Architecture (Phases 1→2→3→4) - products, platforms
- **Enterprise Method**: BMad Method + extended planning (all phases) - compliance, security

**4-Phase Methodology:**

- **Phase 0** (Optional): Documentation - `*document-project` (brownfield prerequisite)
- **Phase 1** (Optional): Analysis - `*brainstorm`, `*research`, `*product-brief`
- **Phase 2** (Required): Planning - `*prd` or `*tech-spec` (creates epics)
- **Phase 3** (Track-dependent): Solutioning - `*architecture` (BMad Method/Enterprise only)
- **Phase 4** (Required): Implementation - Story-centric development

**Matrix of possibilities:**

- 3 tracks × 2 field types (greenfield/brownfield) = 6 combinations
- Tracked via YAML files: `src/modules/bmm/workflows/workflow-status/paths/*.yaml`

**Important:** Phase numbering in YAML is 0-indexed, documentation is user-facing:

- YAML `phase: 0` = Docs "Phase 1 (Analysis)"
- YAML `phase: 1` = Docs "Phase 2 (Planning)"
- YAML `phase: 2` = Docs "Phase 3 (Solutioning)"
- YAML `phase: 3` = Docs "Phase 4 (Implementation)"

### 5. Test Architect (TEA) Special Architecture

**TEA is unique:** Only BMM agent with dedicated knowledge base.

**Structure:**

```
src/modules/bmm/testarch/
├── knowledge/              # 21 production-ready test pattern fragments
│   ├── fixture-architecture.md
│   ├── network-first.md
│   ├── data-factories.md
│   └── [18 more...]
└── tea-index.csv           # Fragment lookup index (21 rows)
```

**TEA execution model:**

- **Phase 2** (once per project): `*framework`, `*ci` - test infrastructure setup
- **Phase 4** (per epic): `*test-design` - creates `test-design-epic-N.md`
- **Phase 4** (per story): `*atdd`, `*automate`, `*test-review`, `*trace`
- **Release Gate**: `*nfr-assess`, `*trace` (Phase 2 mode)

**Critical actions:** TEA agents must consult `tea-index.csv` and load relevant knowledge fragments from `knowledge/` before giving recommendations.

### 6. Document Sharding (Token Optimization)

**Problem:** Large PRDs/Architecture docs (1000+ lines) consume massive context in Phase 4.

**Solution:** Split by level-2 headings into separate files:

```
# Whole document
docs/PRD.md  (2000 lines)

# Sharded version
docs/PRD/
├── index.md              # Table of contents
├── section-1.md          # First ## heading
├── section-2.md          # Second ## heading
└── ...
```

**Workflow support:** All BMM workflows automatically detect and handle both formats using fuzzy matching.

**Tool:** Use `/bmad:core:tools:shard-doc` to split large documents.

### 7. Workflow Status Tracking

**Two status systems:**

**workflow-status.yaml** (Phases 0-3 + Phase 4 start):

- Tracks planning workflows (PRD, architecture, sprint-planning)
- Generated by `*workflow-init`, updated by `*workflow-status`
- Lives in `{output_folder}/bmm-workflow-status.yaml`

**sprint-status.yaml** (Phase 4 execution):

- Tracks per-epic and per-story development
- Generated by `*sprint-planning`
- Lives in `{output_folder}/bmm-sprint-status.yaml`

**Status values:**

- Initial: `required`, `optional`, `recommended`, `conditional`
- Completed: File path (e.g., `docs/PRD.md`)
- Skipped: `skipped`

### 8. Agent Customization System

**Override agent properties without modifying core files:**

```yaml
# bmad/_cfg/agents/pm-overrides.yaml
name: 'Sarah' # Override PM agent name
icon: '📊' # Override icon
persona:
  communication_style: 'Concise and data-driven'
```

**Merging behavior:** User configs override core agent definitions during installation.

**Survives updates:** `bmad/_cfg/` directory persists through all module updates.

---

## Working with Workflows

### Finding Workflow Paths

**Agent menu triggers → workflow paths:**

```yaml
# In agent YAML definition
menu:
  - trigger: prd
    workflow: '{project-root}/bmad/bmm/workflows/2-plan-workflows/prd/workflow.yaml'
```

**Slash command format:**

```
/bmad:{module}:workflows:{workflow-name}

Examples:
/bmad:bmm:workflows:prd
/bmad:bmm:workflows:dev-story
/bmad:core:workflows:party-mode
```

### Workflow Components

Every workflow directory contains:

- `workflow.yaml` - Configuration and metadata
- `instructions.md` - Step-by-step execution guide (XML/Markdown)
- `template.md` (optional) - Output document template
- `checklist.md` (optional) - Validation criteria
- Additional data files (CSV, YAML) referenced in instructions

### Creating New Workflows

Use BMad Builder module:

```
Load bmb agent → *create-workflow
```

Follows BMAD v6 conventions:

- YAML-based configuration
- XML-tagged instructions
- Template-driven or action-based
- Validation checklists

---

## Module Development

### Adding a New Module

1. Create directory: `src/modules/{your-module}/`
2. Required structure:
   ```
   {module}/
   ├── agents/           # Agent YAML definitions
   ├── workflows/        # Workflow directories
   ├── _module-installer/
   │   └── installer-manifest.yaml
   └── README.md
   ```
3. Register in `tools/cli/modules/` for installation support

### Agent YAML Schema

Required fields:

```yaml
agent:
  metadata:
    id: 'bmad/{module}/agents/{name}.md'
    name: 'Agent Name'
    title: 'Agent Title'
    icon: '🎯'
    module: '{module}'

  persona:
    role: 'Role description'
    identity: 'Background and expertise'
    communication_style: 'How agent communicates'
    principles:
      - 'Core principle 1'
      - 'Core principle 2'

  menu:
    - trigger: workflow-name
      workflow: '{project-root}/bmad/{module}/workflows/{path}/workflow.yaml'
      description: 'Workflow description'
```

**Validation:** Run `npm run validate:schemas` to check agent YAML compliance.

---

## Critical Implementation Notes

### When Editing TEA Workflows

1. **Always consult tea-index.csv** before modifying knowledge fragments
2. **21 fragments total** - don't break the index
3. **TEA operates in Phase 2 and Phase 4 only** (no Phase 3 workflows)
4. **test-design is per-epic** - outputs `test-design-epic-{N}.md`

### When Editing Workflow Status Paths

**Location:** `src/modules/bmm/workflows/workflow-status/paths/*.yaml`

**Only include phase-level gates:**

- ✅ Include: `*prd`, `*architecture`, `*sprint-planning` (once per project)
- ❌ Don't include: `*test-design`, `*create-story`, `*atdd`, `*automate` (per-epic/per-story)

**Reason:** workflow-status tracks planning phases. Per-epic/per-story workflows tracked in sprint-status.yaml.

### Phase vs Track vs Field Type

**Don't confuse these three dimensions:**

**3 Planning Tracks** (how much planning):

- Quick Flow (tech-spec only)
- BMad Method (PRD + Architecture)
- Enterprise Method (BMad Method + extended)

**2 Field Types** (project state):

- Greenfield (new project)
- Brownfield (existing codebase)

**4 Phases** (when):

- Phase 1: Analysis (optional)
- Phase 2: Planning (required)
- Phase 3: Solutioning (track-dependent)
- Phase 4: Implementation (required)

**Example:** "Enterprise Method Track for Brownfield" = Track (Enterprise) + Field Type (Brownfield) spanning Phases 0-4.

### Document Editing Conventions

**When updating phase-related documentation:**

- Use consistent phase numbering (Phase 1-4, not Level 0-4)
- Reference the 3 tracks (Quick Flow, BMad Method, Enterprise)
- For TEA: Always show `*test-design` as per-epic in Phase 4

**Key documents:**

- `src/modules/bmm/docs/test-architecture.md` - TEA agent guide
- `src/modules/bmm/docs/scale-adaptive-system.md` - 3-track explanation
- `src/modules/bmm/docs/workflows-*.md` - Phase-specific workflow guides

---

## Installation System Architecture

### Compilation Flow

```
1. User runs: npx bmad-method@alpha install
   ↓
2. CLI prompts: module selection, IDE choice, user preferences
   ↓
3. For each module:
   - Copy files from src/modules/{module}/ to {target}/bmad/{module}/
   - Compile agents: YAML → Markdown (using tools/cli/compiler/)
   - Merge customization files if exist
   - Generate manifests (agent-manifest.csv, workflow-manifest.csv)
   ↓
4. IDE Integration:
   - Generate slash commands for selected IDE
   - Create IDE-specific config files
   - Execute platform hooks (if defined)
   ↓
5. Post-install:
   - Display success message with next steps
   - Create bmad/_cfg/ structure for future customizations
```

### Module Manifests

**agent-manifest.csv:**

- Lists all agents for a module
- Format: `name,title,icon,description,agent_file_path`
- Auto-generated during installation
- Used by party-mode to discover agents

**workflow-manifest.csv:**

- Lists all workflows with their commands
- Format: `command,workflow_path,description`
- Powers slash command discovery

### Cross-Module Dependencies

**Example:** BMM's `*brainstorm-project` uses CIS's brainstorming workflow.

**Resolution:** 4-pass dependency system in installer:

1. Direct dependencies declared in installer-manifest.yaml
2. Workflow invocations parsed from instructions.md
3. Shared task references resolved
4. Circular dependency detection

---

## Testing Patterns in This Repo

### Agent Schema Tests

**Location:** `test/fixtures/agent-schema/`

**Structure:**

```
valid/          # Should pass validation
├── critical-actions/
├── menu-items/
└── ...

invalid/        # Should fail validation
├── missing-required-fields/
├── invalid-types/
└── ...
```

**Test metadata in YAML comments:**

```yaml
# Expected: FAIL
# Error code: INVALID_TYPE
# Error path: agent.metadata.name
```

**Runner:** `test/test-agent-schema.js` parses metadata and validates expectations.

### Adding Test Cases

1. Create YAML file in appropriate directory (valid/ or invalid/)
2. Add metadata comments for expected behavior
3. Run `npm test` to verify

---

## Common Development Scenarios

### Updating an Agent

1. Edit source: `src/modules/{module}/agents/{name}.agent.yaml`
2. Test locally: `npm run install:bmad` (installs to ./bmad/)
3. Validate: `npm run validate:schemas`
4. Bundle for web: `npm run bundle` (if agent has `forWebBundle: true`)

### Creating a New Workflow

**Use BMB module:**

```
Load bmb agent → *create-workflow
```

**Manual creation:**

1. Create directory: `src/modules/{module}/workflows/{category}/{name}/`
2. Required files:
   - `workflow.yaml` - Configuration
   - `instructions.md` - Step-by-step execution
   - `template.md` (if template-based workflow)
3. Add to parent agent's menu in `agents/{agent}.agent.yaml`
4. Test by running workflow in IDE

### Modifying TEA Knowledge Base

1. Edit fragment: `src/modules/bmm/testarch/knowledge/{fragment}.md`
2. Update index: `src/modules/bmm/testarch/tea-index.csv` (if adding/removing)
3. Reference in TEA critical_actions or workflow instructions
4. Test by loading TEA agent and running workflows that use the fragment

---

## Documentation Maintenance

### Key Documentation Files

**Module-level:**

- `src/modules/bmm/docs/README.md` - Documentation hub (index to all BMM guides)
- `src/modules/bmm/docs/agents-guide.md` - All 12 agents (45 min read)
- `src/modules/bmm/docs/test-architecture.md` - TEA comprehensive guide
- `src/modules/bmm/docs/workflows-{phase}.md` - Phase-specific workflow guides

**Project-level:**

- `README.md` - Main project overview
- `docs/index.md` - Complete documentation map
- `CONTRIBUTING.md` - Contribution guidelines

### Redoc System

**BMB has automated documentation workflow:**

```
/bmad:bmb:workflows:redoc
```

Uses reverse-tree approach (leaf folders first, then parents) to maintain module documentation.

### When to Update Documentation

**After changing:**

- Agent definitions → Update `agents-guide.md`
- Workflow behavior → Update phase-specific `workflows-*.md`
- Phase structure → Update `scale-adaptive-system.md`, `test-architecture.md`
- TEA knowledge → Update `tea-index.csv` and `test-architecture.md`

**After new features:**

- Update relevant README.md files
- Consider adding FAQ entries
- Update glossary if new terminology

---

## Git Workflow

**Main branch:** `main` - Production-ready code
**Development:** Feature branches with descriptive names

**Commit message format (auto-enforced by hooks):**

```
type: brief description

Detailed explanation if needed
Related to #123
```

**Git Hooks (via Husky):**

- **Pre-commit:** `.husky/pre-commit` - Two-stage validation
  1. `lint-staged` - Auto-fixes changed files and stages them (linting + formatting)
  2. `npm test` - Validates everything (schemas, compilation, bundles, lint, format)

**Why lint-staged?** It automatically stages the auto-fixed files so they're included in the commit. Without it, fixes would be made but not committed.

**CI Workflow:** `.github/workflows/quality.yaml` runs all quality checks in parallel on PRs (6 jobs: prettier, eslint, schema-validation, agent-schema-tests, installation-components, bundle-validation)

**Release process:** GitHub Actions workflows (triggered by npm run release:\* commands)

---

## IDE-Specific Notes

**Slash command format varies:**

- **Claude Code:** `/bmad:bmm:workflows:prd`
- **Cursor/Windsurf:** May use different syntax
- **VS Code:** Check IDE-specific docs

**Configuration location:**

- Claude Code: `.claude/` directory
- Cursor: `.cursor/` or `.cursorrules`
- See `docs/ide-info/` for IDE-specific setup

---

## Troubleshooting Development Issues

**Agent not showing in menu:**

- Check `bmad/{module}/agents/agent-manifest.csv` was generated
- Verify agent YAML compiles: `npm run validate:schemas`
- Reinstall: `npm run install:bmad`

**Workflow not executing:**

- Verify workflow.yaml has all required fields
- Check instructions.md syntax (XML tags must close)
- Ensure config_source points to valid config.yaml

**Bundle validation fails:**

- Run `npm run validate:bundles` for detailed errors
- Check web_bundle: true in workflow.yaml if bundling workflow
- Verify all dependencies are embedded (no file paths in bundles)

---

**Repository Documentation:** Complete guides in `src/modules/bmm/docs/README.md`
