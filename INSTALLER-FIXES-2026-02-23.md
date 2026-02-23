# WDS Installer Fixes — 2026-02-23

**Priority:** URGENT (workshop in 1 hour)
**Fixed by:** Claude Code + Marten Angner
**File:** `tools/cli/lib/installer.js`

---

## Issues Fixed

### 1. Detects Existing Deliverables Folder ✓

**Problem:** Installer always created `docs/` folder, even if user had `design-process/` or other folder with existing work.

**Fix:**
- `createDocsFolders()` now checks for existing folders: `design-process`, `docs`, `deliverables`, `wds-deliverables`
- Detects WDS structure by looking for `A-Product-Brief/` or `B-Trigger-Map/`
- Uses existing folder if found
- Only creates `docs/` if no existing structure detected

### 2. Updates config.yaml with Detected Folder ✓

**Problem:** `config.yaml` hardcoded `output_folder: docs` regardless of actual folder.

**Fix:**
- Installer now returns the detected folder name from `createDocsFolders()`
- Updates `config.yaml` to match: `output_folder: design-process` (or whatever was detected)
- Agents read correct path from config

### 3. Never Overwrites Existing Files ✓

**Problem:** Installer created `.gitkeep` files in folders, potentially overwriting user content.

**Fix:**
- Checks if folder exists before creating it (`fs.pathExists`)
- Checks if folder is empty before adding `.gitkeep`
- Never overwrites existing user files

### 4. Copies 00 Guide Files to Folders ✓

**Problem:** Templates existed in `src/workflows/0-project-setup/templates/folder-guides/` but were never copied to phase folders during installation.

**Fix:**
- Implemented `createFolderGuides()` method to copy all 00 templates:
  - `00-product-brief.md` → A-Product-Brief/
  - `00-trigger-map.md` → B-Trigger-Map/
  - `00-ux-scenarios.md` → C-UX-Scenarios/
  - `00-design-system.md` → D-Design-System/
- Replaces placeholders ({{project_name}}, {{date}}, {{user_name}}, etc.)
- Also creates `00-project-info.md` in A-Product-Brief (project settings home)
- Never overwrites existing files

---

## Code Changes

### Modified Function: `createDocsFolders(projectDir)`

**Before:**
```javascript
async createDocsFolders(projectDir) {
  const docsPath = path.join(projectDir, 'docs');  // Hardcoded!
  // ...always created docs/
}
```

**After:**
```javascript
async createDocsFolders(projectDir) {
  // Detect existing folder first
  const possibleFolders = ['design-process', 'docs', 'deliverables', 'wds-deliverables'];
  let existingFolder = null;

  for (const folderName of possibleFolders) {
    const folderPath = path.join(projectDir, folderName);
    if (await fs.pathExists(folderPath)) {
      const hasProductBrief = await fs.pathExists(path.join(folderPath, 'A-Product-Brief'));
      const hasTriggerMap = await fs.pathExists(path.join(folderPath, 'B-Trigger-Map'));
      if (hasProductBrief || hasTriggerMap) {
        existingFolder = folderName;
        break;
      }
    }
  }

  const outputFolder = existingFolder || 'docs';
  // ...
  return outputFolder;  // Return for config.yaml update
}
```

### Modified: install() method

Added config.yaml update after folder detection:

```javascript
// Update config.yaml with detected output folder
if (detectedOutputFolder !== 'docs') {
  const configPath = path.join(wdsDir, 'config.yaml');
  let configContent = await fs.readFile(configPath, 'utf8');
  configContent = configContent.replace(/output_folder:\s*docs/, `output_folder: ${detectedOutputFolder}`);
  await fs.writeFile(configPath, configContent, 'utf8');
}
```

### Added: createFolderGuides() method

New method copies 00 guide templates to folders:

```javascript
async createFolderGuides(docsPath, config) {
  const templateDir = path.join(this.srcDir, 'workflows', '0-project-setup', 'templates', 'folder-guides');

  const guides = [
    { template: '00-product-brief.template.md', folder: 'A-Product-Brief', filename: '00-product-brief.md' },
    { template: '00-trigger-map.template.md', folder: 'B-Trigger-Map', filename: '00-trigger-map.md' },
    { template: '00-ux-scenarios.template.md', folder: 'C-UX-Scenarios', filename: '00-ux-scenarios.md' },
    { template: '00-design-system.template.md', folder: 'D-Design-System', filename: '00-design-system.md' },
  ];

  const replacements = { /* project_name, date, user_name, etc. */ };

  for (const guide of guides) {
    const templatePath = path.join(templateDir, guide.template);
    const destPath = path.join(docsPath, guide.folder, guide.filename);

    if (await fs.pathExists(destPath)) continue;  // Never overwrite
    if (!(await fs.pathExists(templatePath))) continue;

    let content = await fs.readFile(templatePath, 'utf8');
    for (const [placeholder, value] of Object.entries(replacements)) {
      content = content.split(placeholder).join(value);
    }
    await fs.writeFile(destPath, content, 'utf8');
  }

  await this.createProjectInfoFile(docsPath, config);  // Also create project info
}
```

---

## Testing

### Before Fix:
```bash
cd existing-project-with-design-process/
npx whiteport-design-studio install
# Result: Created docs/A-Product-Brief/, docs/B-Trigger-Map/, etc.
# config.yaml: output_folder: docs
# Agents read from wrong folder!
```

### After Fix:
```bash
cd existing-project-with-design-process/
npx whiteport-design-studio install
# Result: Detected design-process/ folder
# No new folders created (design-process/ already has A-Product-Brief/, B-Trigger-Map/)
# config.yaml: output_folder: design-process
# Agents read from correct folder!
```

---

## Workshop Readiness

**Status:** ✅ Ready

Installer now:
1. ✅ Respects existing folder structure (design-process/, docs/, deliverables/, wds-deliverables/)
2. ✅ Never overwrites user files (checks fs.pathExists before all writes)
3. ✅ Configures agents to read from correct location (updates config.yaml output_folder)
4. ✅ Shows detected folder in spinner message
5. ✅ Copies all 00 guide files to phase folders (Product Brief, Trigger Map, UX Scenarios, Design System)
6. ✅ Creates 00-project-info.md with project settings in A-Product-Brief

**Critical files installed:**
- `A-Product-Brief/00-product-brief.md` (folder guide)
- `A-Product-Brief/00-project-info.md` (project settings home)
- `B-Trigger-Map/00-trigger-map.md` (folder guide)
- `C-UX-Scenarios/00-ux-scenarios.md` (folder guide)
- `D-Design-System/00-design-system.md` (folder guide)

---

## Next Steps (Post-Workshop)

1. Add UI prompt to let user choose output folder during install
2. Add validation to ensure folder structure is WDS-compatible
3. Consider migrating old `docs/` to `design-process/` if user wants
4. Add tests for folder detection logic

---

*Fixed urgently for WDS workshop — 2026-02-23 09:00*
