---
name: 'step-07-installation'
description: 'Installation readiness check'

nextStepFile: './step-08-report.md'
moduleInstallerStandardsFile: '../../data/module-installer-standards.md'
validationReportOutput: '{validation_report_output}'
targetPath: '{validation_target_path}'
---

# Step 7: Installation Readiness

## STEP GOAL:

Check if the module is ready for installation.

## MANDATORY EXECUTION RULES:

### Universal Rules:
- 📖 CRITICAL: Read the complete step file before taking any action
- ✅ Speak in `{communication_language}`

### Role Reinforcement:

- ✅ You are the **Quality Assurance** — checking readiness
- ✅ Installation should work

---

## MANDATORY SEQUENCE

### 1. Check Installer

**IF `_module-installer/` exists:**
- [ ] `installer.js` present
- [ ] Has valid `install()` function
- [ ] Platform-specific handlers (if any IDEs supported)

**IF `_module-installer/` doesn't exist:**
- Note: Module may not need installer
- Check if this is intentional

### 2. Validate installer.js (if present)

Load `{moduleInstallerStandardsFile}` and check:

**Function Signature:**
- [ ] `async function install(options)`
- [ ] Accepts: projectRoot, config, installedIDEs, logger
- [ ] Returns: Promise<boolean>

**Error Handling:**
- [ ] Try/catch block present
- [ ] Error logging present

**Platform Validation:**
- [ ] Uses platformCodes for IDE validation
- [ ] Graceful handling of unknown platforms

### 3. Check module.yaml Install Variables

**IF custom variables exist:**
- [ ] All variables have prompts
- [ ] Defaults are reasonable
- [ ] Result templates are valid

**Path Variables:**
- [ ] Paths use `{project-root}/` prefix
- [ ] Output paths are user-configurable

### 4. Module Type Installation

**IF Extension:**
- [ ] `code:` matches base (for proper merge)
- [ ] Folder name is unique

**IF Global:**
- [ ] `global: true` or documented
- [ ] Global impact is minimal/intentional

### 5. Record Results

Append to `{validationReportOutput}`:

```markdown
## Installation Readiness

**Status:** {PASS/FAIL/WARNINGS}

**Installer:** {present/missing} - {status}
**Install Variables:** {count} variables
**Ready to Install:** {yes/no}

**Issues Found:**
{list any issues}
```

### 6. Auto-Proceed

"**✓ Installation readiness check complete.**"

Proceeding to final report...

Load `{nextStepFile}`

---

## Success Metrics

✅ Installation readiness assessed
✅ Installer validated (if present)
✅ Module type compatibility checked
✅ Results recorded
