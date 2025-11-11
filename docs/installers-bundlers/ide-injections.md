# IDE Content Injection Standard

## Overview

This document defines the standard for IDE-specific content injection in BMAD modules. Each IDE can inject its own specific content into BMAD templates during installation without polluting the source files with IDE-specific code. The installation process is interactive, allowing users to choose what IDE-specific features they want to install.

## Architecture

### 1. Injection Points

Files that support IDE-specific content define injection points using HTML comments:

```xml
<!-- IDE-INJECT-POINT: unique-point-name -->
```

### 2. Module Structure

Each module that needs IDE-specific content creates a sub-module folder:

```
src/modules/{module-name}/sub-modules/{ide-name}/
  ├── injections.yaml    # Injection configuration
  ├── sub-agents/        # IDE-specific subagents (if applicable)
  └── config.yaml        # Other IDE-specific config
```

### 3. Injection Configuration Format

The `injections.yaml` file defines what content to inject where:

```yaml
# injections.yaml structure
injections:
  - file: 'relative/path/to/file.md' # Path relative to installation root
    point: 'injection-point-name' # Must match IDE-INJECT-POINT name
    requires: 'subagent-name' # Which subagent must be selected (or "any")
    content: | # Content to inject (preserves formatting)
      <llm>
        <i>Instructions specific to this IDE</i>
      </llm>

# Subagents available for installation
subagents:
  source: 'sub-agents' # Source folder relative to this config
  target: '.claude/agents' # Claude's expected location (don't change)
  files:
    - 'agent1.md'
    - 'agent2.md'
```

### 4. Interactive Installation Process

For Claude Code specifically, the installer will:

1. **Detect available subagents** from the module's `injections.yaml`
2. **Ask the user** about subagent installation:
   - Install all subagents (default)
   - Select specific subagents
   - Skip subagent installation
3. **Ask installation location** (if subagents selected):
   - Project level: `.claude/agents/`
   - User level: `~/.claude/agents/`
4. **Copy selected subagents** to the chosen location
5. **Inject only relevant content** based on selected subagents

Other IDEs can implement their own installation logic appropriate to their architecture.

## Implementation

### IDE Installer Responsibilities

Each IDE installer (e.g., `claude-code.js`) must:

1. **Check for sub-modules**: Look for `sub-modules/{ide-name}/` in each installed module
2. **Load injection config**: Parse `injections.yaml` if present
3. **Process injections**: Replace injection points with configured content
4. **Copy additional files**: Handle subagents or other IDE-specific files

### Example Implementation (Claude Code)

```javascript
async processModuleInjections(projectDir, bmadDir, options) {
  for (const moduleName of options.selectedModules) {
    const configPath = path.join(
      bmadDir, 'src/modules', moduleName,
      'sub-modules/claude-code/injections.yaml'
    );

    if (exists(configPath)) {
      const config = yaml.load(configPath);

      // Interactive: Ask user about subagent installation
      const choices = await this.promptSubagentInstallation(config.subagents);

      if (choices.install !== 'none') {
        // Ask where to install
        const location = await this.promptInstallLocation();

        // Process injections based on selections
        for (const injection of config.injections) {
          if (this.shouldInject(injection, choices)) {
            await this.injectContent(projectDir, injection, choices);
          }
        }

        // Copy selected subagents
        await this.copySelectedSubagents(projectDir, config.subagents, choices, location);
      }
    }
  }
}
```

## Benefits

1. **Clean Source Files**: No IDE-specific conditionals in source
2. **Modular**: Each IDE manages its own injections
3. **Scalable**: Easy to add support for new IDEs
4. **Maintainable**: IDE-specific content lives with IDE config
5. **Flexible**: Different modules can inject different content

## Adding Support for a New IDE

1. Create sub-module folder: `src/modules/{module}/sub-modules/{new-ide}/`
2. Add `injections.yaml` with IDE-specific content
3. Update IDE installer to process injections using this standard
4. Test installation with and without the IDE selected

## Example: BMM Module with Claude Code

### File Structure

```
src/modules/bmm/
├── agents/pm.md                         # Has injection point
├── templates/prd.md                     # Has multiple injection points
└── sub-modules/
    └── claude-code/
        ├── injections.yaml              # Defines what to inject
        └── sub-agents/                  # Claude Code specific subagents
            ├── market-researcher.md
            ├── requirements-analyst.md
            └── ...
```

### Injection Point in pm.md

```xml
<agent>
  <persona>...</persona>
  <!-- IDE-INJECT-POINT: pm-agent-instructions -->
  <cmds>...</cmds>
</agent>
```

### Injection Configuration

```yaml
injections:
  - file: '{bmad_folder}/bmm/agents/pm.md'
    point: 'pm-agent-instructions'
    requires: 'any' # Injected if ANY subagent is selected
    content: |
      <llm critical="true">
        <i>Use 'market-researcher' subagent for analysis</i>
      </llm>

  - file: '{bmad_folder}/bmm/templates/prd.md'
    point: 'prd-goals-context-delegation'
    requires: 'market-researcher' # Only if this specific subagent selected
    content: |
      <i>DELEGATE: Use 'market-researcher' subagent...</i>
```

### Result After Installation

```xml
<agent>
  <persona>...</persona>
  <llm critical="true">
    <i>Use 'market-researcher' subagent for analysis</i>
  </llm>
  <cmds>...</cmds>
</agent>
```
