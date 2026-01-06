---
name: 'step-04-installer'
description: 'Setup _module-installer folder and installer.js'

nextStepFile: './step-05-agents.md'
moduleInstallerStandardsFile: '../../data/module-installer-standards.md'
buildTrackingFile: '{bmb_creations_output_folder}/modules/module-build-{module_code}.md'
targetLocation: '{build_tracking_targetLocation}'
---

# Step 4: Module Installer

## STEP GOAL:

Setup the _module-installer folder and create installer.js if needed.

## MANDATORY EXECUTION RULES:

### Universal Rules:

- 🛑 NEVER generate content without user input
- 📖 CRITICAL: Read the complete step file before taking any action
- 🔄 CRITICAL: When loading next with 'C', ensure entire file is read
- 📋 YOU ARE A FACILITATOR, not a content generator
- ✅ Speak in `{communication_language}`

### Role Reinforcement:

- ✅ You are the **Module Builder** — installer expert
- ✅ Not all modules need installers
- ✅ Follow installer patterns

---

## MANDATORY SEQUENCE

### 1. Assess Need for Installer

Load `{moduleInstallerStandardsFile}` and ask:

"**Does your module need an installer?**"

Installers are needed when:
- Creating directories from config variables
- Copying template/assets
- IDE-specific configuration
- Platform-specific setup

**If NO installer needed:**

Skip to step 5. Folder structure already exists.

**If YES:** Continue to step 4.2

### 2. Determine Installer Requirements

"**What should the installer do?**"

- Create directories? (which variables)
- Copy assets? (from where)
- IDE configuration? (which IDEs)
- Platform-specific setup?

### 3. Create installer.js

Create `{targetLocation}/_module-installer/installer.js`:

```javascript
const fs = require('fs-extra');
const path = require('node:path');
const chalk = require('chalk');
const platformCodes = require(path.join(__dirname, '../../../../tools/cli/lib/platform-codes'));

/**
 * {module_name} Module Installer
 */
async function install(options) {
  const { projectRoot, config, installedIDEs, logger } = options;

  try {
    logger.log(chalk.blue('Installing {module_name}...'));

    // Create directories
    if (config['{variable_name}']) {
      const dirConfig = config['{variable_name}'].replace('{project-root}/', '');
      const dirPath = path.join(projectRoot, dirConfig);
      if (!(await fs.pathExists(dirPath))) {
        logger.log(chalk.yellow(`Creating directory: ${dirConfig}`));
        await fs.ensureDir(dirPath);
      }
    }

    // IDE-specific configuration
    if (installedIDEs && installedIDEs.length > 0) {
      for (const ide of installedIDEs) {
        await configureForIDE(ide, projectRoot, config, logger);
      }
    }

    logger.log(chalk.green('✓ {module_name} installation complete'));
    return true;
  } catch (error) {
    logger.error(chalk.red(`Error installing module: ${error.message}`));
    return false;
  }
}

async function configureForIDE(ide, projectRoot, config, logger) {
  if (!platformCodes.isValidPlatform(ide)) {
    logger.warn(chalk.yellow(`Unknown platform: '${ide}'. Skipping.`));
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
    logger.warn(chalk.yellow(`Warning: Could not configure ${ide}: ${error.message}`));
  }
}

module.exports = { install };
```

Customize based on module requirements.

### 4. Platform-Specific Handlers (Optional)

If IDE-specific setup needed, ask which IDEs and create:
- `{targetLocation}/_module-installer/platform-specifics/claude-code.js`
- `{targetLocation}/_module-installer/platform-specifics/windsurf.js`
- etc.

### 5. Update Build Tracking

Update `{buildTrackingFile}`:
- Add 'step-04-installer' to stepsCompleted
- Note: installer created or skipped

### 6. MENU OPTIONS

**Select an Option:** [C] Continue

- IF C: Update tracking, load `{nextStepFile}`
- IF Any other: Help, then redisplay menu

---

## Success Metrics

✅ Assessed installer need
✅ installer.js created (if needed)
✅ Platform handlers created (if needed)
✅ Build tracking updated
