# BMAD Custom Module Installer - Implementation Plan

**Document Version**: 1.0
**Date**: 2025-10-19
**Status**: Planning Phase
**Owner**: CLI Chief (Scott) + BMad

---

## Executive Summary

This document outlines the architecture and implementation plan for a new BMAD CLI tool that enables installation of **custom modules from any location**. This tool is critical for the future of BMAD as an extensible framework where module authors can create and distribute modules independently of the core BMAD repository.

### The Vision

- **Core as npm package**: Future state where `@bmad/core` is an npm package with CLI tools
- **Custom modules**: Module authors use BMad Builder (BMB) to create standalone modules
- **Universal installer**: A CLI tool that can install any valid BMAD module from any path
- **IDE integration**: Compiled agents work with 14+ IDE environments (Codex, Cursor, Windsurf, etc.)

---

## Problem Statement

### Current Limitations

The existing `bmad install` command (tools/cli/commands/install.js) is hardcoded to:

- Discover modules ONLY from `src/modules/` directory
- Install bundled modules (BMM, BMB, CIS) that ship with the framework
- Cannot handle external/custom modules from arbitrary filesystem locations

**Code Reference**: `tools/cli/installers/lib/modules/manager.js:27`

```javascript
this.modulesSourcePath = getSourcePath('modules'); // Hardcoded to src/modules/
```

### Real-World Use Case

- User has a custom foo module at `/Users/username/dev/foo` (standalone folder)
- Module has agents that need compilation (YAML → Markdown with XML)
- Module needs IDE integration (generate commands for Claude Code, etc.)
- Current installer cannot handle this - module must be in `src/modules/foo` to be discovered

---

## Critical Architectural Understanding

### Module Structure (SOURCE - What Authors Create)

**CORRECT STRUCTURE:**

```
my-custom-module/
├── agents/
│   └── my-agent.agent.yaml           ← Required: At least one agent
├── workflows/                        ← Optional: Workflow definitions
│   └── my-workflow/
│       ├── README.md
│       └── workflow.yaml
└── _module-installer/                ← Required: Installation configuration
    ├── install-config.yaml           ← REQUIRED: Defines config questions
    └── installer.js                  ← OPTIONAL: Custom install hooks
```

**CRITICAL: NO config.yaml in source!**

- The `config.yaml` is GENERATED at install time from user answers
- Source modules use `_module-installer/install-config.yaml` to define questions
- The legacy pattern of having `config.yaml` in source is being deprecated

### Module Structure (INSTALLED - What Gets Generated)

```
{target-project}/bmad/my-custom-module/
├── agents/
│   └── my-agent.md                  ← Compiled from .agent.yaml
├── workflows/
│   └── my-workflow/
└── config.yaml                       ← GENERATED from user answers during install
```

**Key Points:**

- `_module-installer/` directory is NOT copied to target (only used during install)
- Agents are compiled from YAML to Markdown with XML
- `config.yaml` is generated fresh for each installation

### Example: install-config.yaml

**Reference**: `/src/modules/bmm/_module-installer/install-config.yaml`

```yaml
# Module metadata
code: bmm
name: 'BMM: BMad Method Agile-AI Driven-Development'
default_selected: true

# Optional welcome message
prompt:
  - 'Thank you for choosing the BMAD™ Method...'
  - 'All paths are relative to project root, with no leading slash.'

# Configuration questions
project_name:
  prompt: 'What is the title of your project?'
  default: '{directory_name}'
  result: '{value}'

user_skill_level:
  prompt:
    - 'What is your technical experience level?'
  default: 'intermediate'
  result: '{value}'
  single-select:
    - value: 'beginner'
      label: 'Beginner - New to development'
    - value: 'intermediate'
      label: 'Intermediate - Familiar with development'
    - value: 'expert'
      label: 'Expert - Deep technical knowledge'

tech_docs:
  prompt: 'Where is Technical Documentation located?'
  default: 'docs'
  result: '{project-root}/{value}'
```

**How ConfigCollector Uses This:**

1. Reads `install-config.yaml` from source module
2. Builds interactive prompts for each config item
3. Collects user answers
4. Processes answers with variable substitution (`{value}`, `{project-root}`, etc.)
5. Generates `config.yaml` in installed module location

**Code Reference**: `tools/cli/installers/lib/core/config-collector.js:108-122`

---

## Current CLI Architecture

### Installation Flow (Existing System)

```
User runs: npm run install:bmad

1. Command Handler (commands/install.js)
   ├── Prompts for target directory, modules, IDEs
   └── Calls Installer.install(config)

2. Installer (installers/lib/core/installer.js)
   ├── Validates target directory
   ├── Resolves module dependencies
   ├── Calls ModuleManager.install() for each module
   ├── Calls IdeManager.setup() for each IDE
   └── Generates manifests

3. ModuleManager (installers/lib/modules/manager.js)
   ├── Discovers modules from src/modules/ ONLY
   ├── Copies module files to {target}/bmad/{module}/
   ├── Compiles agents using YamlXmlBuilder
   └── Runs module-specific installer if exists

4. ConfigCollector (installers/lib/core/config-collector.js)
   ├── Reads _module-installer/install-config.yaml
   ├── Prompts user for configuration
   ├── Generates config.yaml in target

5. IdeManager (installers/lib/ide/manager.js)
   ├── For each selected IDE (codex, windsurf, cursor, etc.)
   ├── Creates IDE-specific artifacts
   │   - Claude Code: .claude/commands/*.md
   │   - Windsurf: .windsurf/workflows/*.yaml
   │   - Cursor: .cursor/rules/*.txt
   └── Runs platform-specific hooks

6. ManifestGenerator (installers/lib/core/manifest-generator.js)
   ├── manifest.yaml (installation metadata)
   ├── workflow-manifest.csv (workflow catalog)
   ├── agent-manifest.csv (agent metadata)
   └── files-manifest.csv (file integrity hashes)
```

### Key Components (Reusable for Custom Installer)

**Agent Compilation Engine:**

- `tools/cli/lib/yaml-xml-builder.js` - YamlXmlBuilder class
- `tools/cli/lib/activation-builder.js` - Generates activation blocks
- `tools/cli/lib/agent-analyzer.js` - Detects required handlers
- `src/utility/models/fragments/*.xml` - Reusable XML fragments

**Installation Infrastructure:**

- `tools/cli/installers/lib/core/config-collector.js` - ConfigCollector class
- `tools/cli/installers/lib/ide/manager.js` - IdeManager class
- `tools/cli/installers/lib/core/manifest-generator.js` - ManifestGenerator class
- `tools/cli/installers/lib/modules/manager.js` - ModuleManager class (needs adaptation)

**Key Insight**: 80% of the code we need already exists! We just need to:

1. Create a new command handler
2. Adapt ModuleManager to accept external paths
3. Wire everything together

---

## Proposed Architecture

### New Command: `install-module`

**Purpose**: Install a custom module from any filesystem location

**Usage:**

```bash
# Interactive mode
install-module
```

### System Architecture

```
┌──────────────────────────────────────────────────────────────┐
│ NEW: install-module Command                                  │
│ File: tools/cli/commands/install-module.js                   │
│                                                              │
│ Responsibilities:                                            │
│ - Parse command-line flags                                   │
│ - Prompt for missing information (interactive mode)          │
│ - Validate inputs                                            │
│ - Call CustomModuleInstaller                                 │
└──────────────────────────────────────────────────────────────┘
                    ↓
┌───────────────────────────────────────────────────────────────┐
│ NEW: CustomModuleInstaller Class                              │
│ File: tools/cli/installers/lib/core/custom-module-installer.js│
│                                                               │
│ Responsibilities:                                             │
│ 1. Validate source module structure (ModuleValidator)         │
│ 2. Ensure core is installed in target                         │
│ 3. Collect module configuration (ConfigCollector)             │
│ 4. Install module files (ModuleManager)                       │
│ 5. Compile agents (YamlXmlBuilder)                            │
│ 6. Generate IDE artifacts (IdeManager)                        │
│ 7. Update manifests (ManifestGenerator)                       │
│ 8. Run custom installer hooks (if exists)                     │
└───────────────────────────────────────────────────────────────┘
                    ↓
┌──────────────────────────────────────────────────────────────┐
│ NEW: ModuleValidator Class                                   │
│ File: tools/cli/installers/lib/core/module-validator.js     │
│                                                              │
│ Validates:                                                   │
│ ✓ _module-installer/install-config.yaml exists         │
│ ✓ At least one agents/*.agent.yaml exists                   │
│ ✓ Module metadata is valid                                  │
│ ⚠ Warns if legacy config.yaml found in source              │
│ ✗ Fails if required structure missing                       │
└──────────────────────────────────────────────────────────────┘
                    ↓
┌──────────────────────────────────────────────────────────────┐
│ REUSED: Existing Infrastructure                              │
│                                                              │
│ - ConfigCollector (configuration prompts)                    │
│ - YamlXmlBuilder (agent compilation)                         │
│ - IdeManager (IDE integration)                               │
│ - ManifestGenerator (tracking)                               │
│ - ModuleManager (file operations)                            │
└──────────────────────────────────────────────────────────────┘
```

---

## Detailed Installation Flow

### Phase 1: Validation

```
Input: --source /path/to/custom-module

1. ModuleValidator.validate(sourcePath)
   ├── Check: _module-installer/install-config.yaml exists
   ├── Check: agents/ directory exists
   ├── Check: At least one *.agent.yaml in agents/
   ├── Parse: install-config.yaml for metadata
   │   - Extract: code, name, version
   │   - Extract: dependencies (if any)
   │   - Extract: core_version requirement
   ├── Warn: If legacy config.yaml found in source
   └── Return: { valid: true/false, errors: [], warnings: [], metadata: {} }

2. If invalid:
   ├── Display all errors clearly
   └── Exit with helpful message + link to module authoring guide
```

### Phase 2: Core Dependency Check

```
Input: --target /path/to/project

1. Check if core installed:
   ├── Look for: {target}/bmad/core/
   ├── Validate: core/config.yaml exists
   └── Check version compatibility

2. If core NOT installed:
   ├── Display message: "Core framework required but not found"
   ├── Prompt: "Install core framework now? (Y/n)"
   ├── If yes: Run core installer
   │   └── Use existing Installer.installCore() or similar
   ├── If no: Exit with error
   └── After core install: Continue to Phase 3

3. If core installed but incompatible version:
   ├── Display warning with version mismatch details
   ├── Prompt: "Continue anyway? (may cause issues)"
   └── Respect user choice
```

### Phase 3: Configuration Collection

```
Input: Module's install-config.yaml

1. ConfigCollector.collectModuleConfig(moduleName, projectDir)
   ├── Read: {source}/_module-installer/install-config.yaml
   ├── Display: Module welcome prompt (if defined)
   ├── Build questions:
   │   - Text inputs
   │   - Single-select (radio)
   │   - Multi-select (checkboxes)
   │   - Confirmations
   ├── Check for existing values:
   │   - If module already installed, load existing config
   │   - Prompt: "Use existing value or change?"
   ├── Prompt user interactively (or use --config-file in non-interactive mode)
   └── Return: { key: value } answers object

2. Process answers with variable substitution:
   ├── {value} → actual answer
   ├── {project-root} → absolute target path
   ├── {directory_name} → basename of target directory
   ├── {value:other_key} → reference another config value
   └── Return: Final configuration object

3. Store configuration (will be written in Phase 5)
```

### Phase 4: File Installation

```
Input: Source module path, Target bmad directory

1. ModuleManager.installFromPath(sourcePath, bmadDir, fileTrackingCallback)
   ├── Determine module name from metadata
   ├── Create target directory: {bmadDir}/{module-name}/
   ├── Copy files with filtering:
   │   ├── COPY: agents/ (all files)
   │   ├── COPY: workflows/ (strip web_bundle sections from workflow.yaml)
   │   ├── SKIP: _module-installer/ (not needed in target)
   │   ├── SKIP: config.yaml from source (if exists - legacy)
   │   ├── SKIP: *.bak files
   │   └── SKIP: Agents with localskip="true" (web-only agents)
   └── Track all copied files for manifest generation

2. File tracking callback:
   └── Store: { path, hash } for each file (for files-manifest.csv)
```

### Phase 5: Agent Compilation

```
Input: Installed module path

1. For each agents/*.agent.yaml:
   ├── Read YAML file
   ├── Check for customize.yaml (sidecar file)
   ├── Merge if exists: agent.yaml + customize.yaml
   ├── YamlXmlBuilder.build(agentData, options)
   │   - forWebBundle: false (IDE mode)
   │   - includeMetadata: true
   │   - skipActivation: false
   ├── AgentAnalyzer.analyze(agentData)
   │   - Detect: Which handlers are used (workflow, exec, tmpl, data, action)
   ├── ActivationBuilder.build(handlers)
   │   - Load: activation-steps.xml (base)
   │   - Inject: Only needed handler fragments
   ├── Generate: Markdown file with XML
   └── Write: {bmadDir}/{module}/agents/{name}.md

2. Result:
   └── Compiled agents ready for IDE consumption
```

### Phase 6: Configuration File Generation

```
Input: Collected configuration from Phase 3

1. Build config.yaml content:
   ├── Add: Module metadata (code, name, version)
   ├── Add: All configuration values from user answers
   ├── Add: Installation metadata
   │   - installed_date
   │   - installed_version
   └── Add: User info from core config
       - user_name
       - communication_language
       - output_folder

2. Write config.yaml:
   └── {bmadDir}/{module}/config.yaml

3. This is the ONLY config.yaml that exists after installation
```

### Phase 7: IDE Integration

```
Input: Selected IDEs (codex, windsurf, cursor, etc.)

1. IdeManager.setup(selectedIdes, bmadDir, projectRoot)
   ├── For each IDE:
   │   ├── Load IDE handler: ide/{ide-code}.js
   │   ├── Call: handler.setup()
   │   ├── Call: handler.createArtifacts()
   │   │   └── Generate IDE-specific files
   │   └── Run: Platform-specific hooks if defined
   │       - Check: {source}/_module-installer/platform-specifics/{ide}.js
   │       - Execute if exists
   └── Examples:
       - Claude Code: .claude/commands/bmad/{module}/agents/*.md
       - Windsurf: .windsurf/workflows/bmad-{module}-*.yaml
       - Cursor: .cursor/rules/bmad-{module}.txt

2. Workflow Command Generation:
   ├── Read: workflow-manifest.csv (from Phase 8)
   ├── For each workflow in module:
   │   └── Generate: IDE command to launch workflow
   └── Format varies by IDE
```

### Phase 8: Manifest Updates

```
Input: Installation details, installed files, module metadata

1. ManifestGenerator.update(bmadDir, installData)
   ├── Update: {bmadDir}/_cfg/manifest.yaml
   │   - Add module to installed_modules[]
   │   - Add custom_modules[] section (track source path)
   │   - Update: last_modified timestamp
   │
   ├── Update: {bmadDir}/_cfg/agent-manifest.csv
   │   - Add row for each agent
   │   - Columns: module, agent_path, agent_name, role, identity_summary,
   │               communication_style, expertise, approach, responsibilities, workflows
   │
   ├── Update: {bmadDir}/_cfg/workflow-manifest.csv
   │   - Add row for each workflow
   │   - Columns: module, workflow_path, workflow_name, description, scale_level
   │
   ├── Update: {bmadDir}/_cfg/files-manifest.csv
   │   - Add row for each installed file
   │   - Columns: file_path, file_type, module, hash (SHA256)
   │
   └── Update: {bmadDir}/_cfg/task-manifest.csv (if tasks exist - legacy)

2. Manifest purposes:
   - Update detection (compare file hashes)
   - Installation integrity validation
   - Rollback capability
   - IDE artifact generation
   - Documentation generation
```

### Phase 9: Custom Installer Hooks

```
Input: Module's _module-installer/installer.js (if exists)

1. Check for custom installer:
   └── {source}/_module-installer/installer.js

2. If exists:
   ├── Load module: require(installerPath)
   ├── Validate: exports.install is a function
   ├── Prepare context:
   │   {
   │     projectRoot: '/path/to/project',
   │     config: { collected user configuration },
   │     installedIDEs: ['codex', 'windsurf'],
   │     logger: { log, error, warn }
   │   }
   ├── Execute: await installer.install(context)
   └── Handle errors gracefully

3. Custom installer use cases:
   - Create subagent variations
   - Set up additional project files
   - Run initialization scripts
   - Configure external dependencies
```

### Phase 10: Validation & Completion

```
1. Validate installation:
   ├── Check: All manifest files exist
   ├── Verify: Agent files compiled successfully
   ├── Verify: IDE artifacts created
   ├── Validate: File hashes match manifest
   └── Check: No errors during installation

2. Display success message:
   ├── Show: Module name and version
   ├── Show: Installation location
   ├── Show: Installed agents count
   ├── Show: IDE integrations configured
   └── Show: Next steps

3. Next steps message:
   - How to use the module
   - How to verify IDE integration
   - Link to module documentation
   - How to update or uninstall
```

---

## Implementation Checklist

### New Files to Create

1. **`tools/cli/commands/install-module.js`**
   - Command handler for `bmad install-module`
   - CLI argument parsing
   - Interactive prompts for missing info
   - Call CustomModuleInstaller

2. **`tools/cli/installers/lib/core/custom-module-installer.js`**
   - CustomModuleInstaller class
   - Main orchestration logic
   - Coordinate all phases (1-10)
   - Error handling and rollback

3. **`tools/cli/installers/lib/core/module-validator.js`**
   - ModuleValidator class
   - Validate module structure
   - Check required files
   - Parse and validate metadata
   - Return detailed validation results

4. **`tools/cli/installers/lib/core/core-installer.js`** (optional)
   - CoreInstaller class
   - Install just the core framework
   - Can be extracted from existing Installer class

### Files to Modify

5. **`tools/cli/installers/lib/modules/manager.js`**
   - Add: `installFromPath(sourcePath, bmadDir, ...)` method
   - Adapt existing `install()` logic to work with external paths
   - Keep existing functionality intact (backward compatibility)

6. **`tools/cli/installers/lib/core/manifest-generator.js`**
   - Add: Support for tracking custom module source paths
   - Add: `custom_modules` section in manifest.yaml
   - Format:
     ```yaml
     custom_modules:
       - name: my-module
         source_path: /path/to/source/my-module
         installed_date: 2025-10-19
         version: 1.0.0
     ```

7. **`tools/cli/bmad-cli.js`**
   - Already dynamically loads commands, no changes needed
   - New command will be auto-discovered

### Files to Document

8. **`docs/custom-module-authoring-guide.md`** (new)
   - How to create a custom module
   - Required structure and files
   - install-config.yaml format
   - Best practices
   - Testing your module
   - Distribution strategies

9. **`tools/cli/README.md`** (update)
   - Add documentation for `install-module` command
   - Update architecture diagrams
   - Add examples

### Testing Strategy

10. **Test with existing BMD module**
    - Source: `/Users/brianmadison/dev/BMAD-METHOD/bmd`
    - Target: Test project
    - Validate: All phases work correctly

11. **Create test fixtures**
    - Minimal valid module
    - Module with all optional features
    - Invalid modules (for error testing)

12. **IDE integration tests**
    - Test with Claude Code
    - Test with Windsurf
    - Verify artifact generation

---

## Code Examples

### Example: ModuleValidator.validate()

```javascript
// tools/cli/installers/lib/core/module-validator.js

const path = require('node:path');
const fs = require('fs-extra');
const yaml = require('js-yaml');

class ModuleValidator {
  async validate(sourcePath) {
    const result = {
      valid: false,
      errors: [],
      warnings: [],
      metadata: null,
    };

    // 1. Check _module-installer/install-config.yaml
    const installConfigPath = path.join(sourcePath, '_module-installer', 'install-config.yaml');

    if (!(await fs.pathExists(installConfigPath))) {
      result.errors.push('Missing required file: _module-installer/install-config.yaml');
    } else {
      // Parse and validate
      try {
        const content = await fs.readFile(installConfigPath, 'utf8');
        const config = yaml.load(content);

        // Extract metadata
        result.metadata = {
          code: config.code,
          name: config.name,
          version: config.version || '1.0.0',
          dependencies: config.dependencies || [],
          core_version: config.core_version,
        };

        // Validate required metadata
        if (!config.code) {
          result.errors.push('install-config.yaml missing required field: code');
        }
        if (!config.name) {
          result.errors.push('install-config.yaml missing required field: name');
        }
      } catch (error) {
        result.errors.push(`Invalid install-config.yaml: ${error.message}`);
      }
    }

    // 2. Check agents/ directory
    const agentsPath = path.join(sourcePath, 'agents');
    if (!(await fs.pathExists(agentsPath))) {
      result.errors.push('Missing required directory: agents/');
    } else {
      const agentFiles = await fs.readdir(agentsPath);
      const yamlAgents = agentFiles.filter((f) => f.endsWith('.agent.yaml'));

      if (yamlAgents.length === 0) {
        result.errors.push('No agent YAML files found in agents/ directory');
      } else {
        result.metadata = result.metadata || {};
        result.metadata.agent_count = yamlAgents.length;
      }
    }

    // 3. Warn about legacy config.yaml
    const legacyConfigPath = path.join(sourcePath, 'config.yaml');
    if (await fs.pathExists(legacyConfigPath)) {
      result.warnings.push(
        'Found config.yaml in module source. This is legacy and will be ignored. ' +
          'The installer will generate config.yaml from user input. ' +
          'Use _module-installer/install-config.yaml instead.',
      );
    }

    // 4. Check for workflows (optional but log if missing)
    const workflowsPath = path.join(sourcePath, 'workflows');
    if (!(await fs.pathExists(workflowsPath))) {
      result.warnings.push('No workflows/ directory found (optional but recommended)');
    }

    // Set valid flag
    result.valid = result.errors.length === 0;

    return result;
  }
}

module.exports = { ModuleValidator };
```

### Example: CustomModuleInstaller.install()

```javascript
// tools/cli/installers/lib/core/custom-module-installer.js

const chalk = require('chalk');
const ora = require('ora');
const { ModuleValidator } = require('./module-validator');
const { ConfigCollector } = require('./config-collector');
const { ModuleManager } = require('../modules/manager');
const { IdeManager } = require('../ide/manager');
const { ManifestGenerator } = require('./manifest-generator');

class CustomModuleInstaller {
  constructor() {
    this.validator = new ModuleValidator();
    this.configCollector = new ConfigCollector();
    this.moduleManager = new ModuleManager();
    this.ideManager = new IdeManager();
    this.manifestGenerator = new ManifestGenerator();
  }

  async install(options) {
    const { sourcePath, targetPath, selectedIdes } = options;

    console.log(chalk.cyan('\n🔧 BMAD Custom Module Installer\n'));

    // PHASE 1: Validate source module
    console.log(chalk.bold('Phase 1: Validating module structure...'));
    const validation = await this.validator.validate(sourcePath);

    if (!validation.valid) {
      console.error(chalk.red('\n❌ Module validation failed:\n'));
      validation.errors.forEach((err) => console.error(chalk.red(`  - ${err}`)));
      throw new Error('Invalid module structure');
    }

    if (validation.warnings.length > 0) {
      console.log(chalk.yellow('\n⚠️  Warnings:'));
      validation.warnings.forEach((warn) => console.log(chalk.yellow(`  - ${warn}`)));
    }

    console.log(chalk.green('✓ Module structure valid'));
    console.log(chalk.dim(`  Module: ${validation.metadata.name}`));
    console.log(chalk.dim(`  Code: ${validation.metadata.code}`));
    console.log(chalk.dim(`  Agents: ${validation.metadata.agent_count}`));

    // PHASE 2: Check core dependency
    console.log(chalk.bold('\nPhase 2: Checking core framework...'));
    const bmadDir = path.join(targetPath, 'bmad');
    const coreInstalled = await this.checkCoreInstalled(bmadDir);

    if (!coreInstalled) {
      // Prompt to install core
      const shouldInstall = await this.promptInstallCore();
      if (shouldInstall) {
        await this.installCore(targetPath);
      } else {
        throw new Error('Core framework required for module installation');
      }
    }

    console.log(chalk.green('✓ Core framework available'));

    // PHASE 3: Collect configuration
    console.log(chalk.bold('\nPhase 3: Collecting module configuration...'));
    const config = await this.configCollector.collectModuleConfigFromPath(sourcePath, validation.metadata.code, targetPath);
    console.log(chalk.green('✓ Configuration collected'));

    // PHASE 4-6: Install module files and compile agents
    console.log(chalk.bold('\nPhase 4-6: Installing module and compiling agents...'));
    const spinner = ora('Installing module files...').start();

    const installResult = await this.moduleManager.installFromPath(sourcePath, bmadDir, (file) => this.trackFile(file), {
      moduleConfig: config,
      installedIDEs: selectedIdes,
    });

    spinner.succeed('Module files installed and agents compiled');

    // PHASE 7: IDE integration
    if (selectedIdes && selectedIdes.length > 0) {
      console.log(chalk.bold('\nPhase 7: Configuring IDE integrations...'));
      await this.ideManager.setup(selectedIdes, bmadDir, targetPath);
      console.log(chalk.green(`✓ Configured ${selectedIdes.length} IDE(s)`));
    }

    // PHASE 8: Update manifests
    console.log(chalk.bold('\nPhase 8: Updating manifests...'));
    await this.manifestGenerator.updateForCustomModule({
      bmadDir,
      moduleName: validation.metadata.code,
      sourcePath,
      metadata: validation.metadata,
      installedFiles: this.trackedFiles,
    });
    console.log(chalk.green('✓ Manifests updated'));

    // PHASE 9: Run custom installer
    const customInstallerPath = path.join(sourcePath, '_module-installer', 'installer.js');
    if (await fs.pathExists(customInstallerPath)) {
      console.log(chalk.bold('\nPhase 9: Running custom installer hooks...'));
      await this.runCustomInstaller(customInstallerPath, {
        projectRoot: targetPath,
        config,
        installedIDEs: selectedIdes,
      });
      console.log(chalk.green('✓ Custom installer completed'));
    }

    // PHASE 10: Success
    console.log(chalk.green('\n✨ Module installation complete!\n'));
    console.log(chalk.cyan('Module:'), chalk.bold(validation.metadata.name));
    console.log(chalk.cyan('Location:'), path.join(bmadDir, validation.metadata.code));
    console.log(chalk.cyan('Agents:'), validation.metadata.agent_count);

    if (selectedIdes && selectedIdes.length > 0) {
      console.log(chalk.cyan('IDE Integration:'), selectedIdes.join(', '));
    }

    return { success: true };
  }

  trackFile(filePath) {
    if (!this.trackedFiles) this.trackedFiles = [];
    this.trackedFiles.push(filePath);
  }

  // ... other helper methods
}

module.exports = { CustomModuleInstaller };
```

### Example: ModuleManager.installFromPath()

```javascript
// Addition to tools/cli/installers/lib/modules/manager.js

/**
 * Install a module from an external path (not from src/modules/)
 * @param {string} sourcePath - Absolute path to module source
 * @param {string} bmadDir - Target bmad directory
 * @param {Function} fileTrackingCallback - Optional callback to track files
 * @param {Object} options - Installation options
 */
async installFromPath(sourcePath, bmadDir, fileTrackingCallback = null, options = {}) {
  // Read module metadata from install-config.yaml
  const installConfigPath = path.join(
    sourcePath,
    '_module-installer',
    'install-config.yaml'
  );

  const configContent = await fs.readFile(installConfigPath, 'utf8');
  const config = yaml.load(configContent);
  const moduleName = config.code;

  const targetPath = path.join(bmadDir, moduleName);

  // Check if already installed
  if (await fs.pathExists(targetPath)) {
    console.log(chalk.yellow(`Module '${moduleName}' already installed, updating...`));
    await fs.remove(targetPath);
  }

  // Copy module files with filtering (reuse existing method)
  await this.copyModuleWithFiltering(sourcePath, targetPath, fileTrackingCallback);

  // Process agent files to inject activation block (reuse existing method)
  await this.processAgentFiles(targetPath, moduleName);

  // Write generated config.yaml
  if (options.moduleConfig) {
    const configYamlPath = path.join(targetPath, 'config.yaml');
    const configYaml = yaml.dump(options.moduleConfig);
    await fs.writeFile(configYamlPath, configYaml, 'utf8');

    if (fileTrackingCallback) {
      fileTrackingCallback(configYamlPath);
    }
  }

  // Call module-specific installer if it exists
  if (!options.skipModuleInstaller) {
    await this.runModuleInstallerFromPath(sourcePath, bmadDir, options);
  }

  return {
    success: true,
    module: moduleName,
    path: targetPath,
  };
}

/**
 * Run module-specific installer from external path
 */
async runModuleInstallerFromPath(sourcePath, bmadDir, options = {}) {
  const installerPath = path.join(sourcePath, '_module-installer', 'installer.js');

  if (!(await fs.pathExists(installerPath))) {
    return; // No custom installer
  }

  try {
    const moduleInstaller = require(installerPath);

    if (typeof moduleInstaller.install === 'function') {
      const projectRoot = path.dirname(bmadDir);
      const logger = options.logger || {
        log: console.log,
        error: console.error,
        warn: console.warn,
      };

      const result = await moduleInstaller.install({
        projectRoot,
        config: options.moduleConfig || {},
        installedIDEs: options.installedIDEs || [],
        logger,
      });

      if (!result) {
        console.warn(chalk.yellow(`Module installer returned false`));
      }
    }
  } catch (error) {
    console.error(chalk.red(`Error running module installer: ${error.message}`));
  }
}
```

---

## Command-Line Interface Design

### Interactive Mode

```bash
$ bmad install-module

🔧 BMAD Custom Module Installer

? Module source path: /Users/brianmadison/dev/my-custom-module
? Target project path: /Users/brianmadison/dev/my-app
? Select IDEs to integrate with: (Use arrows, space to select)
  ◉ codex (Claude Code)
  ◯ windsurf (Windsurf)
  ◯ cursor (Cursor)
  ◯ cline (Cline)

Validating module structure...
✓ Module structure valid
  Module: My Custom Module
  Code: my-module
  Agents: 3

... (rest of installation)
```

### Non-Interactive Mode

```bash
bmad install-module \
  --source /path/to/module \
  --target /path/to/project \
  --ides codex,windsurf \
  --non-interactive
```

### With Config File (CI/CD)

```bash
# Create config file: module-config.json
{
  "project_name": "My Project",
  "user_skill_level": "intermediate",
  "tech_docs": "docs"
}

# Install with config
bmad install-module \
  --source ./my-module \
  --target . \
  --ides codex \
  --config-file ./module-config.json \
  --non-interactive
```

---

## Future Enhancements

### npm Package Integration

When core becomes `@bmad/core`:

```bash
# Install globally
npm install -g @bmad/core

# Use anywhere
bmad install-module --source ~/modules/my-module --target ./project

# Or as project dependency
npm install --save-dev @bmad/core
npx bmad install-module --source ./custom-module --target .
```

### Module Registry

Future consideration: BMAD module registry

```bash
# Publish to registry
bmad publish-module --source ./my-module

# Install from registry
bmad install-module my-module  # Looks up in registry

# Search registry
bmad search-module testing
```

### Update Detection

```bash
# Check for updates to custom modules
bmad check-updates

# Update specific module
bmad update-module my-module --from-source /path/to/latest
```

---

## Testing Plan

### Unit Tests

1. **ModuleValidator tests**
   - Valid module structure
   - Missing required files
   - Invalid metadata
   - Legacy warnings

2. **ConfigCollector tests**
   - Read install-config.yaml
   - Variable substitution
   - Multi-select handling

3. **ModuleManager.installFromPath tests**
   - File copying
   - Filtering logic
   - Agent compilation

### Integration Tests

1. **End-to-end installation**
   - Install BMD module
   - Verify all files copied
   - Verify agents compiled
   - Verify IDE artifacts created
   - Verify manifests updated

2. **Error scenarios**
   - Invalid module structure
   - Missing core
   - Installation failures
   - Rollback behavior

### Manual Testing

1. **Test with BMD module**
   - Source: `/Users/brianmadison/dev/BMAD-METHOD/bmd`
   - Various IDEs
   - Verify functionality

2. **Test with minimal module**
   - Create simple test module
   - Verify basic flow works

---

## Key Insights & Decisions

### Why This Approach?

1. **Reuses 80% of existing code**: YamlXmlBuilder, IdeManager, ConfigCollector, ManifestGenerator all work as-is

2. **Clean separation**: New CustomModuleInstaller doesn't interfere with existing Installer

3. **Backward compatible**: Existing `bmad install` continues to work unchanged

4. **Future-proof**: Architecture supports npm packaging and module registry

5. **Extensible**: Easy to add new features like update detection, module search, etc.

### Critical Design Principles

1. **Source modules NEVER have config.yaml** - it's generated at install time
2. **install-config.yaml is the source of truth** for module configuration
3. **\_module-installer/ is transient** - used during install, not copied to target
4. **Core is always required** - custom modules extend core functionality
5. **IDE integration is modular** - easy to add new IDE support

### Common Pitfalls to Avoid

1. ❌ Don't copy config.yaml from source
2. ❌ Don't skip validation - always validate module structure first
3. ❌ Don't ignore legacy warnings - help users modernize
4. ❌ Don't forget to update manifests - critical for integrity
5. ❌ Don't hardcode paths - use {project-root} placeholders

---

## References

### Key Files to Study

1. **tools/cli/commands/install.js** - Current installer command
2. **tools/cli/installers/lib/core/installer.js** - Main installer orchestration
3. **tools/cli/installers/lib/modules/manager.js** - Module management logic
4. **tools/cli/installers/lib/core/config-collector.js** - Configuration collection
5. **tools/cli/lib/yaml-xml-builder.js** - Agent compilation engine
6. **tools/cli/installers/lib/ide/manager.js** - IDE integration
7. **src/modules/bmm/\_module-installer/install-config.yaml** - Example config

### Documentation

1. **tools/cli/README.md** - CLI documentation
2. **CLAUDE.md** - Project conventions and architecture
3. **src/modules/bmm/workflows/README.md** - BMM workflow guide

---

## Next Steps (When Building)

1. **Read this document completely**
2. **Study the referenced key files** to understand existing patterns
3. **Start with ModuleValidator** - it's the simplest and most isolated
4. **Then CustomModuleInstaller** - wire everything together
5. **Then command handler** - user interface
6. **Test incrementally** - validate each phase works before moving on
7. **Test with BMD module** - real-world validation
8. **Update documentation** - CLI README and create authoring guide

---

## Contact & Support

- **Owner**: BMad (user_name from config)
- **Agent**: Scott - Chief CLI Tooling Officer
- **Primary Domain**: tools/cli/
- **Discord**: https://discord.gg/gk8jAdXWmj (#general-dev)
- **GitHub Issues**: https://github.com/bmad-code-org/BMAD-METHOD/issues

---

**Document Status**: Ready for implementation
**Last Updated**: 2025-10-19
**Version**: 1.0
