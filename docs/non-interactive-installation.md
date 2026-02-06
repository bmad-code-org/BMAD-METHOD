---
title: Non-Interactive Installation
description: Install BMAD using command-line flags for CI/CD pipelines and automated deployments
---

# Non-Interactive Installation

BMAD now supports non-interactive installation through command-line flags. This is particularly useful for:

- Automated deployments and CI/CD pipelines
- Scripted installations
- Batch installations across multiple projects
- Quick installations with known configurations

## Installation Modes

### 1. Fully Interactive (Default)

Run without any flags to use the traditional interactive prompts:

```bash
npx bmad-method install
```

### 2. Fully Non-Interactive

Provide all required flags to skip all prompts:

```bash
npx bmad-method install \
  --directory /path/to/project \
  --modules bmm,bmb \
  --tools claude-code,cursor \
  --user-name "John Doe" \
  --communication-language English \
  --document-output-language English \
  --output-folder _bmad-output
```

### 3. Semi-Interactive (Graceful Fallback)

Provide some flags and let BMAD prompt for the rest:

```bash
npx bmad-method install \
  --directory /path/to/project \
  --modules bmm
```

In this case, BMAD will:
- Use the provided directory and modules
- Prompt for tool selection
- Prompt for core configuration

### 4. Quick Install with Defaults

Use the `-y` or `--yes` flag to accept all defaults:

```bash
npx bmad-method install --yes
```

This will:
- Install to the current directory
- Skip custom content prompts
- Use default values for all configuration
- Use previously configured tools (or skip tool configuration if none exist)

### 5. Install Without Tools

To skip tool/IDE configuration entirely:

**Option 1: Use --tools none**
```bash
npx bmad-method install --directory ~/myapp --modules bmm --tools none
```

**Option 2: Use --yes flag (if no tools were previously configured)**
```bash
npx bmad-method install --yes
```

**Option 3: Omit --tools and select "None" in the interactive prompt**
```bash
npx bmad-method install --directory ~/myapp --modules bmm
# Then select "⚠ None - I am not installing any tools" when prompted
```

## Available Flags

### Installation Options

| Flag | Description | Example |
|------|-------------|---------|
| `--directory <path>` | Installation directory | `--directory ~/projects/myapp` |
| `--modules <modules>` | Comma-separated module IDs | `--modules bmm,bmb` |
| `--tools <tools>` | Comma-separated tool/IDE IDs (use "none" to skip) | `--tools claude-code,cursor` or `--tools none` |
| `--custom-content <paths>` | Comma-separated paths to custom modules | `--custom-content ~/my-module,~/another-module` |
| `--action <type>` | Action for existing installations | `--action quick-update` |

### Core Configuration

| Flag | Description | Default |
|------|-------------|---------|
| `--user-name <name>` | Name for agents to use | System username |
| `--communication-language <lang>` | Agent communication language | English |
| `--document-output-language <lang>` | Document output language | English |
| `--output-folder <path>` | Output folder path | _bmad-output |

### Other Options

| Flag | Description |
|------|-------------|
| `-y, --yes` | Accept all defaults and skip prompts |
| `-d, --debug` | Enable debug output for manifest generation |

## Action Types

When working with existing installations, use the `--action` flag:

- `install` - Fresh installation (default for new directories)
- `update` - Modify existing installation (change modules/config)
- `quick-update` - Refresh installation without changing configuration
- `compile-agents` - Recompile agents with customizations only

Example:

```bash
npx bmad-method install --action quick-update
```

## Module IDs

Available module IDs for the `--modules` flag:

### Core Modules
- `bmm` - BMad Method Master
- `bmb` - BMad Builder

### External Modules
Check the [BMad registry](https://github.com/bmad-code-org) for available external modules.

## Tool/IDE IDs

Available tool IDs for the `--tools` flag:

- `claude-code` - Claude Code CLI
- `cursor` - Cursor IDE
- `windsurf` - Windsurf IDE
- `vscode` - Visual Studio Code
- `jetbrains` - JetBrains IDEs
- And more...

Run the interactive installer once to see all available tools.

## Examples

### Basic Installation

Install BMM module with Claude Code:

```bash
npx bmad-method install \
  --directory ~/projects/myapp \
  --modules bmm \
  --tools claude-code \
  --user-name "Development Team"
```

### Installation Without Tools

Install without configuring any tools/IDEs:

```bash
npx bmad-method install \
  --directory ~/projects/myapp \
  --modules bmm \
  --tools none \
  --user-name "Development Team"
```

### Full Installation with Multiple Modules

```bash
npx bmad-method install \
  --directory ~/projects/myapp \
  --modules bmm,bmb \
  --tools claude-code,cursor \
  --user-name "John Doe" \
  --communication-language English \
  --document-output-language English \
  --output-folder _output
```

### Update Existing Installation

```bash
npx bmad-method install \
  --directory ~/projects/myapp \
  --action update \
  --modules bmm,bmb,custom-module
```

### Quick Update (Preserve Settings)

```bash
npx bmad-method install \
  --directory ~/projects/myapp \
  --action quick-update
```

### Installation with Custom Content

```bash
npx bmad-method install \
  --directory ~/projects/myapp \
  --modules bmm \
  --custom-content ~/my-custom-module,~/another-module \
  --tools claude-code
```

### CI/CD Pipeline Installation

```bash
#!/bin/bash
# install-bmad.sh

npx bmad-method install \
  --directory "${GITHUB_WORKSPACE}" \
  --modules bmm \
  --tools claude-code \
  --user-name "CI Bot" \
  --communication-language English \
  --document-output-language English \
  --output-folder _bmad-output \
  --yes
```

## Environment-Specific Installations

### Development Environment

```bash
npx bmad-method install \
  --directory . \
  --modules bmm,bmb \
  --tools claude-code,cursor \
  --user-name "${USER}"
```

### Production Environment

```bash
npx bmad-method install \
  --directory /opt/app \
  --modules bmm \
  --tools claude-code \
  --user-name "Production Team" \
  --output-folder /var/bmad-output
```

## Validation and Error Handling

BMAD validates all provided flags:

- **Directory**: Must be a valid path with write permissions
- **Modules**: Will warn about invalid module IDs (but won't fail)
- **Tools**: Will warn about invalid tool IDs (but won't fail)
- **Custom Content**: Each path must contain a valid `module.yaml` file
- **Action**: Must be one of: install, update, quick-update, compile-agents

Invalid values will either:
1. Show an error and exit (for critical options like directory)
2. Show a warning and skip (for optional items like custom content)
3. Fall back to interactive prompts (for missing required values)

## Tips and Best Practices

1. **Use absolute paths** for `--directory` to avoid ambiguity
2. **Test flags locally** before using in CI/CD pipelines
3. **Combine with `-y`** for truly unattended installations
4. **Check module availability** by running the interactive installer once
5. **Use `--debug`** flag if you encounter issues during installation
6. **Skip tool configuration** with `--tools none` for server/CI environments where IDEs aren't needed
7. **Partial flags are OK** - Omit flags and let BMAD prompt for missing values interactively

## Troubleshooting

### Installation fails with "Invalid directory"

Check that:
- The directory path exists or its parent exists
- You have write permissions
- The path is absolute or correctly relative to current directory

### Module not found

- Verify the module ID is correct (check available modules in interactive mode)
- External modules may need to be available in the registry

### Custom content path invalid

Ensure each custom content path:
- Points to a directory
- Contains a `module.yaml` file in the root
- Has a `code` field in the `module.yaml`

## Feedback and Issues

If you encounter any issues with non-interactive installation:

1. Run with `--debug` flag for detailed output
2. Try the interactive mode to verify the issue
3. Report issues on GitHub: <https://github.com/bmad-code-org/BMAD-METHOD/issues>
