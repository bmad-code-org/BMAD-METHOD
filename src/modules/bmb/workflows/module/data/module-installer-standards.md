# Module Installer Standards

**Purpose:** How the `_module-installer` folder works, including installer.js patterns and platform-specific configuration.

---

## Overview

The `_module-installer` folder contains optional installation logic for your module. It runs AFTER the IDE installations and can:
- Create directories specified in module.yaml
- Copy assets or templates
- Configure IDE-specific settings
- Set up platform-specific integrations

---

## When Do You Need an Installer?

### Use an Installer When:

- Creating directories based on user configuration
- Copying template files to the user's project
- IDE-specific setup (Claude Code, Windsurf, Cursor, etc.)
- Platform-specific integrations

### Skip the Installer When:

- Module only provides agents and workflows
- No file operations needed
- No IDE-specific configuration

---

## Folder Structure

```
_module-installer/
├── installer.js                 # Main installer (REQUIRED if folder exists)
└── platform-specifics/          # IDE-specific handlers (optional)
    ├── claude-code.js
    ├── windsurf.js
    ├── cursor.js
    └── ...
```

---

## installer.js Pattern

### Function Signature

```javascript
/**
 * Module Installer
 *
 * @param {Object} options - Installation options
 * @param {string} options.projectRoot - The root directory of the target project
 * @param {Object} options.config - Module configuration from module.yaml (resolved variables)
 * @param {Array<string>} options.installedIDEs - Array of IDE codes that were installed
 * @param {Object} options.logger - Logger instance for output
 * @returns {Promise<boolean>} - Success status (true = success, false = failure)
 */
async function install(options) {
  const { projectRoot, config, installedIDEs, logger } = options;

  try {
    // Installation logic here
    logger.log(chalk.blue('Installing {Module Name}...'));

    // ... your logic ...

    logger.log(chalk.green('✓ {Module Name} installation complete'));
    return true;
  } catch (error) {
    logger.error(chalk.red(`Error installing module: ${error.message}`));
    return false;
  }
}

module.exports = { install };
```

---

### What You Receive

| Parameter | Type | Description |
|-----------|------|-------------|
| `projectRoot` | string | Absolute path to the user's project root |
| `config` | object | Resolved module.yaml variables |
| `installedIDEs` | array | List of IDE codes installed (e.g., `['claude-code', 'windsurf']`) |
| `logger` | object | Logger with `.log()`, `.warn()`, `.error()` methods |

The `config` object contains your module.yaml variables **after** user input:

```javascript
// If module.yaml defined:
// project_name:
//   prompt: "What is your project name?"
//   result: "{value}"

config.project_name  // = user's input
config.planning_artifacts  // = resolved path
```

---

## Common Installation Tasks

### 1. Create Directories

```javascript
const fs = require('fs-extra');
const path = require('node:path');

// Create directory from config
if (config['planning_artifacts']) {
  const dirConfig = config['planning_artifacts'].replace('{project-root}/', '');
  const dirPath = path.join(projectRoot, dirConfig);

  if (!(await fs.pathExists(dirPath))) {
    logger.log(chalk.yellow(`Creating directory: ${dirConfig}`));
    await fs.ensureDir(dirPath);
  }
}
```

### 2. Copy Assets

```javascript
const assetsSource = path.join(__dirname, 'assets');
const assetsDest = path.join(projectRoot, 'docs');

if (await fs.pathExists(assetsSource)) {
  await fs.copy(assetsSource, assetsDest);
  logger.log(chalk.green('✓ Copied assets to docs/'));
}
```

### 3. IDE-Specific Configuration

```javascript
// Handle IDE-specific configurations
if (installedIDEs && installedIDEs.length > 0) {
  logger.log(chalk.cyan(`Configuring for IDEs: ${installedIDEs.join(', ')}`));

  for (const ide of installedIDEs) {
    await configureForIDE(ide, projectRoot, config, logger);
  }
}
```

---

## Platform-Specific Handlers

### Pattern

Create files in `platform-specifics/{ide-code}.js`:

```javascript
// platform-specifics/claude-code.js

/**
 * Configure module for Claude Code
 */
async function install(options) {
  const { projectRoot, config, logger, platformInfo } = options;

  try {
    // Claude Code specific configuration
    logger.log(chalk.dim('  Configuring Claude Code integration...'));

    // Your logic here

    return true;
  } catch (error) {
    logger.warn(chalk.yellow(`  Warning: ${error.message}`));
    return false;
  }
}

module.exports = { install };
```

### Load from Main Installer

```javascript
// installer.js
const platformCodes = require(path.join(__dirname, '../../../../tools/cli/lib/platform-codes'));

async function configureForIDE(ide, projectRoot, config, logger) {
  // Validate platform code
  if (!platformCodes.isValidPlatform(ide)) {
    logger.warn(chalk.yellow(`  Unknown platform: '${ide}'. Skipping.`));
    return;
  }

  const platformName = platformCodes.getDisplayName(ide);
  const platformSpecificPath = path.join(__dirname, 'platform-specifics', `${ide}.js`);

  try {
    if (await fs.pathExists(platformSpecificPath)) {
      const platformHandler = require(platformSpecificPath);

      if (typeof platformHandler.install === 'function') {
        await platformHandler.install({ projectRoot, config, logger });
        logger.log(chalk.green(`  ✓ Configured for ${platformName}`));
      }
    }
  } catch (error) {
    logger.warn(chalk.yellow(`  Warning: Could not configure ${platformName}: ${error.message}`));
  }
}
```

---

## Complete Example: BMM Installer

```javascript
const fs = require('fs-extra');
const path = require('node:path');
const chalk = require('chalk');
const platformCodes = require(path.join(__dirname, '../../../../tools/cli/lib/platform-codes'));

/**
 * BMM Module Installer
 */
async function install(options) {
  const { projectRoot, config, installedIDEs, logger } = options;

  try {
    logger.log(chalk.blue('🚀 Installing BMM Module...'));

    // Create output directory
    if (config['output_folder']) {
      const outputConfig = config['output_folder'].replace('{project-root}/', '');
      const outputPath = path.join(projectRoot, outputConfig);
      if (!(await fs.pathExists(outputPath))) {
        logger.log(chalk.yellow(`Creating output directory: ${outputConfig}`));
        await fs.ensureDir(outputPath);
      }
    }

    // Create implementation artifacts directory
    if (config['implementation_artifacts']) {
      const storyConfig = config['implementation_artifacts'].replace('{project-root}/', '');
      const storyPath = path.join(projectRoot, storyConfig);
      if (!(await fs.pathExists(storyPath))) {
        logger.log(chalk.yellow(`Creating story directory: ${storyConfig}`));
        await fs.ensureDir(storyPath);
      }
    }

    // IDE-specific configuration
    if (installedIDEs && installedIDEs.length > 0) {
      logger.log(chalk.cyan(`Configuring BMM for IDEs: ${installedIDEs.join(', ')}`));

      for (const ide of installedIDEs) {
        await configureForIDE(ide, projectRoot, config, logger);
      }
    }

    logger.log(chalk.green('✓ BMM Module installation complete'));
    return true;
  } catch (error) {
    logger.error(chalk.red(`Error installing BMM: ${error.message}`));
    return false;
  }
}

async function configureForIDE(ide, projectRoot, config, logger) {
  if (!platformCodes.isValidPlatform(ide)) {
    logger.warn(chalk.yellow(`  Warning: Unknown platform '${ide}'. Skipping.`));
    return;
  }

  const platformSpecificPath = path.join(__dirname, 'platform-specifics', `${ide}.js`);

  try {
    if (await fs.pathExists(platformSpecificPath)) {
      const platformHandler = require(platformSpecificPath);

      if (typeof platformHandler.install === 'function') {
        await platformHandler.install({ projectRoot, config, logger });
      }
    }
  } catch (error) {
    logger.warn(chalk.yellow(`  Warning: Could not load handler for ${ide}: ${error.message}`));
  }
}

module.exports = { install };
```

---

## Best Practices

### DO:
- Return `true` for success, `false` for failure
- Use chalk for colored output
- Log what you're doing (create, copy, configure)
- Handle errors gracefully with try/catch
- Validate paths before creating directories

### DON'T:
- Assume paths exist — check with `fs.pathExists()`
- Overwrite user files without asking
- Fail silently — log errors
- Use absolute paths — build from `projectRoot`

---

## Available Platform Codes

Common IDE codes:
- `claude-code` — Anthropic's Claude Code
- `windsurf` — Windsurf IDE
- `cursor` — Cursor AI IDE
- `vscode` — Visual Studio Code

Use `platformCodes.isValidPlatform(ide)` to validate.

---

## Testing Your Installer

1. Create a test project
2. Run `bmad install {your-module}`
3. Verify directories are created
4. Check that config variables are resolved correctly
5. Test platform-specific handlers

---

## Quick Reference

| Task | Code Pattern |
|------|--------------|
| Create directory | `await fs.ensureDir(path)` |
| Check if exists | `await fs.pathExists(path)` |
| Copy files | `await fs.copy(src, dest)` |
| Log info | `logger.log(chalk.blue('message'))` |
| Log success | `logger.log(chalk.green('✓ message'))` |
| Log warning | `logger.warn(chalk.yellow('warning'))` |
| Log error | `logger.error(chalk.red('error'))` |
