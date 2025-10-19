# Critical Installer Modification Reference

**Date**: 2025-10-19
**File**: `tools/cli/installers/lib/core/installer.js`
**Lines**: 913-916
**Backup Branch**: backup-before-pull-20251019-021553

## Modification Code

```javascript
// Skip workflow instructions.md files to preserve user customizations
if (file.includes('workflows/') && file.endsWith('instructions.md')) {
  continue;
}
```

## Insertion Point

This code MUST be inserted in the `copyDirectoryWithFiltering()` method, immediately after the config.yaml skip block:

```javascript
// Skip config.yaml templates - we'll generate clean ones with actual values
if (file === 'config.yaml' || file.endsWith('/config.yaml')) {
  continue;
}

// ← INSERT THE 4-LINE MODIFICATION HERE

const sourceFile = path.join(sourcePath, file);
```

## Purpose

- Prevents workflow instructions.md files from being overwritten during updates
- Essential for teachflow module to be detected by ModuleManager.listAvailable()
- Without this, user customizations in workflow instructions are lost

## Verification Command

```bash
grep -A 2 "Skip workflow instructions" tools/cli/installers/lib/core/installer.js
```

Expected output:

```
// Skip workflow instructions.md files to preserve user customizations
if (file.includes('workflows/') && file.endsWith('instructions.md')) {
  continue;
```
