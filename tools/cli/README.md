# BMad CLI Tool

The BMad CLI handles installation and web bundling for the BMAD-METHOD framework. It compiles YAML agents into two distinct formats: **IDE-integrated agents** (filesystem-aware, customizable) and **web bundles** (self-contained, dependency-embedded).

## Table of Contents

- [BMad CLI Tool](#bmad-cli-tool)
  - [Table of Contents](#table-of-contents)
  - [Overview](#overview)
  - [Commands](#commands)
    - [Installation](#installation)
    - [Bundling](#bundling)
    - [Utilities](#utilities)
  - [Installation System](#installation-system)
    - [Installation Flow](#installation-flow)
    - [IDE Support](#ide-support)
    - [Custom Module Configuration](#custom-module-configuration)
    - [Platform Specifics](#platform-specifics)
    - [Manifest System](#manifest-system)
    - [Advanced Features](#advanced-features)
  - [Bundling System](#bundling-system)
    - [Bundling Flow](#bundling-flow)
  - [Agent Compilation](#agent-compilation)
    - [Compilation Engine](#compilation-engine)
    - [Fragment System](#fragment-system)
    - [Input: Agent YAML](#input-agent-yaml)
    - [Output: IDE (Markdown with XML)](#output-ide-markdown-with-xml)
  - [Architecture](#architecture)
    - [Directory Structure](#directory-structure)
    - [Fragment Library](#fragment-library)
  - [Key Differences: Installation vs Bundling](#key-differences-installation-vs-bundling)
  - [Development Workflows](#development-workflows)
    - [Testing Compilation](#testing-compilation)
    - [Adding New Menu Handlers](#adding-new-menu-handlers)
    - [Regenerating Manifests](#regenerating-manifests)
  - [Related Documentation](#related-documentation)
  - [Support](#support)

---

## Overview

The CLI provides two primary functions:

1. **Installation**: Compiles agents from YAML and installs to IDE environments with full customization support
2. **Bundling**: Packages agents and dependencies into standalone web-ready XML files

Both use the same YAML→XML compilation engine but produce different outputs optimized for their environments.

---

## Commands

### Installation

```bash
# Interactive installation
npm run install:bmad

# Direct CLI usage
node tools/cli/bmad-cli.js install --target /path/to/project --modules bmm,bmb --ides codex

# Flags:
#   --target <path>        Target project directory
#   --modules <list>       Comma-separated: bmm, bmb, cis
#   --ides <list>          Comma-separated IDE codes (see IDE Support)
#   --non-interactive      Skip all prompts
```

### Bundling

```bash
# Bundle all modules
npm run bundle

# Bundle specific items
node tools/cli/bundlers/bundle-web.js all              # Everything
node tools/cli/bundlers/bundle-web.js module bmm       # One module
node tools/cli/bundlers/bundle-web.js agent bmm pm     # One agent
```

### Utilities

```bash
npm run bmad:status              # Installation status
npm run validate:bundles         # Validate web bundles
node tools/cli/regenerate-manifests.js    # Regenerate agent-manifest.csv files
```

---

## Installation System

The installer is a multi-stage system that handles agent compilation, IDE integration, module configuration, platform-specific behaviors, and manifest generation.

### Installation Flow

```
1. Collect User Input
   - Target directory, modules, IDEs
   - Custom module configuration (via install-config.yaml)

2. Pre-Installation
   - Validate target, check conflicts, backup existing installations
   - Resolve module dependencies (4-pass system)

3. Install Core + Modules
   - Copy files to {target}/{bmad_folder}/
   - Compile agents: YAML → Markdown/XML (forWebBundle: false)
   - Merge customize.yaml files if they exist
   - Inject activation blocks based on agent capabilities

4. IDE Integration
   - Initialize selected IDE handlers
   - Generate IDE-specific artifacts (commands/rules/workflows)
   - Execute platform-specific hooks (IDE+module combinations)

5. Generate Manifests
   - manifest.yaml (installation metadata)
   - workflow-manifest.csv (workflow catalog)
   - agent-manifest.csv (agent metadata)
   - task-manifest.csv (legacy)
   - files-manifest.csv (all files with SHA256 hashes)

6. Validate & Finalize
   - Verify file integrity, agent compilation, IDE artifacts
   - Display summary and next steps
```

**Output Structure**:

```
{target}/
├── {bmad_folder}/
│   ├── core/              # Always installed
│   ├── {module}/          # Selected modules
│   │   ├── agents/        # Compiled .md files
│   │   ├── workflows/
│   │   └── config.yaml
│   └── _cfg/              # Manifests
└── .{ide}/                # IDE-specific artifacts
    └── ...                # Format varies by IDE
```

### IDE Support

The installer supports **15 IDE environments** through a base-derived architecture. Each IDE handler extends `BaseIDE` and implements IDE-specific artifact generation.

**Supported IDEs** (as of v6-alpha):

| Code             | Name              | Artifact Location        |
| ---------------- | ----------------- | ------------------------ |
| `codex`          | Claude Code       | `.claude/commands/`      |
| `claude-code`    | Claude Code (alt) | `.claude/commands/`      |
| `opencode`       | OpenCode          | `.opencode`              |
| `windsurf`       | Windsurf          | `.windsurf/workflows/`   |
| `cursor`         | Cursor            | `.cursor/rules/`         |
| `cline`          | Cline             | `.clinerules/workflows/` |
| `github-copilot` | GitHub Copilot    | `.github/copilot/`       |
| `crush`          | Crush             | `.crush/`                |
| `auggie`         | Auggie            | `.auggie/`               |
| `gemini`         | Google Gemini     | `.gemini/`               |
| `qwen`           | Qwen              | `.qwen/`                 |
| `roo`            | Roo               | `.roo/`                  |
| `trae`           | Trae              | `.trae/`                 |
| `iflow`          | iFlow             | `.iflow/`                |
| `kilo`           | Kilo              | `.kilo/`                 |

**Handler Architecture**:

- Base class: `tools/cli/installers/lib/ide/_base-ide.js`
- Handler implementations: `tools/cli/installers/lib/ide/{ide-code}.js`
- Dynamic discovery: IDE manager scans directory and auto-registers handlers
- Each handler implements: `setup()`, `createArtifacts()`, `cleanup()`, `getAgentsFromBmad()`

**Adding New IDE Support**:

1. Create handler file: `tools/cli/installers/lib/ide/your-ide.js`
2. Extend `BaseIDE`, set `ideCode`, `ideName`, `artifactType`
3. Implement artifact generation methods
4. IDE auto-discovered on next run

### Custom Module Configuration

Modules define interactive configuration menus via `install-config.yaml` files in their `_module-installer/` directories.

**Config File Location**:

- Core: `src/core/_module-installer/install-config.yaml`
- Modules: `src/modules/{module}/_module-installer/install-config.yaml`

**Configuration Types**:

- `select`: Radio button choices
- `multiselect`: Checkboxes
- `input`: Text input with validation
- `confirm`: Yes/no

**Variable Substitution**:

- `{project-root}` → Absolute target path
- `{directory_name}` → Project directory basename
- `{module}` → Current module name
- `{value:config_id}` → Reference another config value

**Config Persistence**:

- Values saved to module's `config.yaml`
- Existing values detected on reinstall
- User prompted: "Use existing or change?"

**Processor**: `tools/cli/installers/lib/core/config-collector.js`

### Platform Specifics

Platform specifics are **IDE+module combination hooks** that execute custom logic when specific IDE and module are installed together.

**Two-Layer Architecture**:

1. **Module-Level**: `src/modules/{module}/_module-installer/platform-specifics/{ide}.js`
   - Module provides custom behavior for specific IDEs
   - Example: BMM creates subagents when installed with Claude Code

2. **IDE-Level**: Embedded in IDE handler's `createArtifacts()` method
   - IDE provides custom handling for specific modules
   - Example: Windsurf configures cascade workflows for BMM

**Execution Timing**: After standard installation, before validation

**Common Use Cases**:

- Creating subagent variations (PM-technical, PM-market)
- Configuring IDE-specific workflow integrations
- Adding custom commands or rules based on module features
- Adjusting UI/UX for module-specific patterns

**Platform Registry**: `tools/cli/installers/lib/ide/shared/platform-codes.js`

### Manifest System

The installer generates **5 manifest files** in `{target}/{bmad_folder}/_cfg/`:

**1. Installation Manifest** (`manifest.yaml`)

- Installation metadata: version, timestamps, target directory
- Installed modules and versions
- Integrated IDEs and their configurations
- User configuration values

**2. Workflow Manifest** (`workflow-manifest.csv`)

- Columns: module, workflow_path, workflow_name, description, scale_level
- Used by workflow command generators
- RFC 4180 compliant CSV format

**3. Agent Manifest** (`agent-manifest.csv`)

- Columns: module, agent_path, agent_name, role, identity_summary, communication_style, expertise, approach, responsibilities, workflows
- 10-column metadata for each agent
- Used by IDE integrations and documentation

**4. Task Manifest** (`task-manifest.csv`)

- Legacy compatibility (deprecated in v6)
- Columns: module, task_path, task_name, objective, agent

**5. Files Manifest** (`files-manifest.csv`)

- Complete file tracking with SHA256 hashes
- Columns: file_path, file_type, module, hash
- Enables integrity validation and change detection

**Generator**: `tools/cli/installers/lib/core/manifest-generator.js`

**Use Cases**:

- Update detection (compare current vs manifest hashes)
- Workflow command generation for IDEs
- Installation validation and integrity checks
- Rollback capability

### Advanced Features

**Dependency Resolution** (4-Pass System):

- Pass 1: Explicit dependencies from module metadata
- Pass 2: Template references in workflows
- Pass 3: Cross-module workflow/agent references
- Pass 4: Transitive dependencies

**Agent Activation Injection**:

- Detects which handlers each agent uses (workflow, exec, tmpl, data, action)
- Injects only needed handler fragments from `src/utility/models/fragments/`
- Keeps compiled agents lean and purpose-built

**Module Injection System**:

- Conditional content injection based on user config
- Can inject menu items, text blocks, workflow steps
- File: `tools/cli/installers/lib/ide/shared/module-injections.js`

**Conflict Resolution**:

- Detects existing installations
- Options: Update (preserve customizations), Backup (timestamp), Cancel
- Auto-backup to `.bmad-backup-{timestamp}` if selected

**Workflow Command Auto-Generation**:

- Reads workflow-manifest.csv
- Generates IDE commands for each workflow
- IDE-specific formatting (Claude Code .md, Windsurf YAML, etc.)

**Validation & Integrity**:

- Verifies all manifest files exist
- Validates file hashes against files-manifest.csv
- Checks agent compilation completeness
- Confirms IDE artifacts created

---

## Bundling System

Web bundling creates self-contained XML packages with all dependencies embedded for web deployment.

### Bundling Flow

```
1. Discover modules and agents from src/modules/
2. For each agent:
   - Compile with YamlXmlBuilder (forWebBundle: true)
   - Use web-bundle-activation-steps.xml fragment
   - Resolve ALL dependencies recursively:
     - Scan menu items for workflow references
     - Load workflows → extract web_bundle section
     - Find all file references (templates, data, sub-workflows)
     - Wrap each in <file id="path"><![CDATA[...]]></file>
   - Build consolidated bundle: agent + all deps
3. Output to: web-bundles/{module}/agents/{name}.xml
```

**Key Differences from Installation**:

- No customize.yaml merging (base agents only)
- No metadata (reduces file size)
- All dependencies bundled inline (no filesystem access)
- Uses web-specific activation fragment
- Output: Standalone XML files

**Output Structure**:

```
web-bundles/
├── bmm/
│   ├── agents/
│   │   ├── pm.xml
│   │   ├── architect.xml
│   │   ├── sm.xml
│   │   └── dev.xml
│   └── teams/
│       └── dev-team.xml
├── bmb/
│   └── agents/
│       └── bmad-builder.xml
└── cis/
    └── agents/
        └── creative-director.xml
```

**Bundler**: `tools/cli/bundlers/web-bundler.js`

---

## Agent Compilation

Both installation and bundling use the same YAML→XML compiler with different configurations.

### Compilation Engine

**Core File**: `tools/cli/lib/yaml-xml-builder.js`

**Process**:

1. Load YAML agent definition
2. Merge with customize.yaml (installation only)
3. Analyze agent to detect required handlers
4. Build activation block:
   - IDE: Uses `activation-steps.xml` (filesystem-aware)
   - Web: Uses `web-bundle-activation-steps.xml` (bundled files)
5. Convert to XML structure
6. Output as markdown (IDE) or standalone XML (web)

**Key Option Flags**:

- `forWebBundle: true` - Use web activation, omit metadata
- `includeMetadata: true` - Include build hash (IDE only)
- `skipActivation: true` - Omit activation (team bundles)

### Fragment System

Reusable XML fragments in `src/utility/models/fragments/`:

- `activation-steps.xml` - IDE activation (loads config.yaml at runtime)
- `web-bundle-activation-steps.xml` - Web activation (uses bundled files)
- `activation-rules.xml` - Validation rules (IDE only)
- `menu-handlers.xml` - Menu handler wrapper
- `handler-workflow.xml` - Workflow handler
- `handler-exec.xml` - Exec command handler
- `handler-tmpl.xml` - Template handler
- `handler-data.xml` - Data handler
- `handler-action.xml` - Action handler

**Dynamic Injection**: Agent analyzer detects which handlers are used, activation builder injects only those fragments.

### Input: Agent YAML

```yaml
agent:
  metadata:
    id: 'bmad/bmm/agents/pm.md'
    name: 'PM'
    title: 'Product Manager'
  persona:
    role: 'Product Manager'
    identity: 'You are an experienced PM...'
  menu:
    - trigger: '*create-brief'
      workflow: '{project-root}/{bmad_folder}/bmm/workflows/.../workflow.yaml'
```

### Output: IDE (Markdown with XML)

````markdown
<!-- Powered by BMAD-CORE™ -->

# Product Manager

```xml
<agent id="..." name="PM">
  <activation critical="MANDATORY">
    <step n="2">Load {project-root}/{bmad_folder}/bmm/config.yaml at runtime</step>
    ...
  </activation>
  <persona>...</persona>
  <menu>...</menu>
</agent>
```
````

````

### Output: Web (Standalone XML)

```xml
<agent id="..." name="PM">
  <activation critical="MANDATORY">
    <step n="2">All dependencies bundled inline below</step>
    ...
  </activation>
  <persona>...</persona>
  <menu>...</menu>
  <bundled-files>
    <file id="bmad/bmm/config.yaml"><![CDATA[...]]></file>
    <file id="bmad/bmm/workflows/.../workflow.yaml"><![CDATA[...]]></file>
    ...
  </bundled-files>
</agent>
````

---

## Architecture

### Directory Structure

```
tools/cli/
├── bmad-cli.js                 # Main CLI entry
├── commands/                   # CLI command handlers
│   ├── install.js
│   ├── status.js
│   ├── list.js
│   ├── update.js
│   └── uninstall.js
├── bundlers/                   # Web bundling
│   ├── bundle-web.js          # CLI entry
│   └── web-bundler.js         # WebBundler class
├── installers/
│   └── lib/
│       ├── core/              # Core installer logic
│       │   ├── installer.js
│       │   ├── manifest-generator.js
│       │   ├── manifest.js
│       │   ├── dependency-resolver.js
│       │   ├── config-collector.js
│       │   └── csv-parser.js
│       ├── modules/           # Module processing
│       │   └── manager.js
│       └── ide/               # IDE integrations
│           ├── _base-ide.js
│           ├── {14 IDE handlers}.js
│           ├── manager.js
│           └── shared/
│               ├── bmad-artifacts.js
│               ├── platform-codes.js
│               ├── module-injections.js
│               └── workflow-command-generator.js
├── lib/                       # Shared compilation
│   ├── yaml-xml-builder.js   # YAML→XML compiler
│   ├── activation-builder.js # Activation generator
│   ├── agent-analyzer.js     # Handler detection
│   ├── xml-handler.js        # Builder wrapper
│   └── paths.js
├── regenerate-manifests.js
└── test-yaml-builder.js
```

### Fragment Library

```
src/utility/models/fragments/
├── activation-steps.xml
├── web-bundle-activation-steps.xml
├── activation-rules.xml
├── menu-handlers.xml
└── handler-*.xml              # 5 handler types
```

---

## Key Differences: Installation vs Bundling

| Aspect                  | Installation (IDE)                   | Bundling (Web)                    |
| ----------------------- | ------------------------------------ | --------------------------------- |
| **Trigger**             | `npm run install:bmad`               | `npm run bundle`                  |
| **Entry Point**         | `commands/install.js`                | `bundlers/bundle-web.js`          |
| **Compiler Flag**       | `forWebBundle: false`                | `forWebBundle: true`              |
| **Output Format**       | Markdown `.md`                       | Standalone XML `.xml`             |
| **Output Location**     | `{target}/{bmad_folder}/` + IDE dirs | `web-bundles/`                    |
| **Customization**       | Merges `customize.yaml`              | Base agents only                  |
| **Dependencies**        | Referenced by path                   | Bundled inline (CDATA)            |
| **Activation Fragment** | `activation-steps.xml`               | `web-bundle-activation-steps.xml` |
| **Filesystem Access**   | Required                             | Not needed                        |
| **Build Metadata**      | Included (hash)                      | Excluded                          |
| **Path Format**         | `{project-root}` placeholders        | Stripped, wrapped as `<file>`     |
| **Use Case**            | Local IDE development                | Web deployment                    |

**Activation Differences**:

- **IDE**: Loads config.yaml at runtime from filesystem
- **Web**: Accesses bundled content via `<file id>` references

---

## Development Workflows

### Testing Compilation

```bash
# Test YAML→XML compiler
node tools/cli/test-yaml-builder.js

# Test installation
node tools/cli/bmad-cli.js install --target ./test-project --modules bmm --ides codex

# Test bundling
node tools/cli/bundlers/bundle-web.js agent bmm pm

# Validate bundles
npm run validate:bundles
```

### Adding New Menu Handlers

To add a new handler type (e.g., `validate-workflow`):

1. Create fragment: `src/utility/models/fragments/handler-validate-workflow.xml`
2. Update `agent-analyzer.js` to detect the new attribute
3. Update `activation-builder.js` to load/inject the fragment
4. Test with an agent using the handler

### Regenerating Manifests

```bash
# Regenerate agent-manifest.csv for all modules
node tools/cli/regenerate-manifests.js

# Location: src/modules/{module}/agents/agent-manifest.csv
```

---

## Related Documentation

- **Project Guide**: `CLAUDE.md`
- **BMM Workflows**: `src/modules/bmm/workflows/README.md`
- **Module Structure**: `src/modules/bmb/workflows/create-module/module-structure.md`
- **Agent Creation**: `src/modules/bmb/workflows/create-agent/README.md`

---

## Support

- **Issues**: https://github.com/bmad-code-org/BMAD-METHOD/issues
- **Discord**: https://discord.gg/gk8jAdXWmj (#general-dev, #bugs-issues)
- **YouTube**: https://www.youtube.com/@BMadCode
