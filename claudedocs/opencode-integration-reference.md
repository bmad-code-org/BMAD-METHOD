# OpenCode Integration - Fork Modification Reference

## Overview

This document serves as the authoritative reference for preserving the OpenCode integration during upstream merges. OpenCode support is a **fork-specific feature** not present in the upstream BMAD-METHOD repository.

## ⚠️ CRITICAL: Fork-Only Feature

**OpenCode integration exists ONLY in this fork and will NEVER be published to npm.**

- The published npm package `bmad-method@6.0.0-alpha.0` does NOT include OpenCode
- Running `npx bmad-method install` will download the published version WITHOUT OpenCode
- You MUST use local development commands to access OpenCode functionality

**See**: `docs/V6_LOCAL_DEVELOPMENT.md` for complete local development instructions.

## Critical Information

- **Modification Type**: Additive (new files + dependency)
- **Risk Level**: Low-Medium (new files unlikely to conflict, dependency may need verification)
- **Recovery Method**: Restore from backup branch
- **Serena Memory**: `CRITICAL-opencode-fork-integration`
- **Development Requirement**: Must use local CLI execution (not npx)

## Files Affected

### 1. New Files (Additive)

#### `tools/cli/installers/lib/ide/opencode.js`

- **Lines**: 602 (entire file)
- **Purpose**: OpenCode IDE installer implementation
- **Status**: Must be present for OpenCode functionality

**Verification**:

```bash
test -f tools/cli/installers/lib/ide/opencode.js && echo "✅ Present" || echo "❌ MISSING"
```

**Recovery**:

```bash
git checkout <backup-branch> -- tools/cli/installers/lib/ide/opencode.js
```

#### `OPENCODE_INTEGRATION_SUMMARY.md`

- **Lines**: 231 (entire file)
- **Purpose**: Implementation documentation and architecture details
- **Status**: Documentation only (optional but recommended to preserve)

**Recovery**:

```bash
git checkout <backup-branch> -- OPENCODE_INTEGRATION_SUMMARY.md
```

### 2. Modified Files

#### `package.json`

- **Modification**: Added `comment-json` dependency
- **Location**: `dependencies` section
- **Code**:
  ```json
  "comment-json": "^4.2.5",
  ```
- **Purpose**: Required for parsing JSONC files with comments

**Verification**:

```bash
grep -q '"comment-json"' package.json && echo "✅ Present" || echo "❌ MISSING"
```

**Manual Recovery** (if needed):

```json
{
  "dependencies": {
    // ... other dependencies ...
    "comment-json": "^4.2.5"
    // ... more dependencies ...
  }
}
```

Then run:

```bash
npm install
```

## Verification Checklist

Run these commands **after every upstream merge**:

### ✅ Quick Verification (30 seconds)

```bash
# 1. File existence
test -f tools/cli/installers/lib/ide/opencode.js && echo "✅ opencode.js" || echo "❌ opencode.js MISSING"

# 2. Dependency check
grep -q '"comment-json"' package.json && echo "✅ comment-json" || echo "❌ comment-json MISSING"
```

### ✅ Thorough Verification (1 minute)

```bash
# 3. Runtime IDE discovery check
node -e "
const {IdeManager} = require('./tools/cli/installers/lib/ide/manager');
const manager = new IdeManager();
const ides = manager.getAvailableIdes();
const opencode = ides.find(i => i.value === 'opencode');
if (opencode) {
  console.log('✅ OpenCode discoverable:', opencode.name);
  console.log('   Preferred:', opencode.preferred ? 'Yes' : 'No');
} else {
  console.log('❌ OpenCode NOT in IDE list');
  console.log('Available IDEs:', ides.map(i => i.value).join(', '));
}
"

# 4. Dependency installation check
npm list comment-json 2>/dev/null && echo "✅ comment-json installed" || echo "⚠️  Run: npm install"
```

### ✅ Full Integration Test (2 minutes)

```bash
# 5. Test OpenCode installer can be instantiated
node -e "
const {OpenCodeSetup} = require('./tools/cli/installers/lib/ide/opencode');
const setup = new OpenCodeSetup();
console.log('✅ OpenCode installer instantiated');
console.log('   Name:', setup.name);
console.log('   Display Name:', setup.displayName);
"
```

## Recovery Procedures

### Scenario 1: opencode.js Missing

**Symptoms**:

- File check fails
- IDE manager doesn't list OpenCode
- Error when trying to install with OpenCode

**Recovery**:

```bash
# 1. Find latest backup branch
BACKUP=$(git branch -a | grep backup-before | tail -1 | xargs)

# 2. Restore the file
git checkout $BACKUP -- tools/cli/installers/lib/ide/opencode.js

# 3. Verify
test -f tools/cli/installers/lib/ide/opencode.js && echo "✅ Restored"

# 4. Stage and commit
git add tools/cli/installers/lib/ide/opencode.js
git commit -m "chore: restore OpenCode integration after upstream merge"
```

### Scenario 2: comment-json Dependency Missing

**Symptoms**:

- OpenCode installer throws "Cannot find module 'comment-json'" error
- IDE manager shows warning about loading OpenCode

**Recovery**:

```bash
# Option A: Restore from backup
BACKUP=$(git branch -a | grep backup-before | tail -1 | xargs)
git checkout $BACKUP -- package.json

# Option B: Manual edit
# Add to package.json dependencies:
#   "comment-json": "^4.2.5",

# Then install
npm install

# Verify
npm list comment-json
```

### Scenario 3: Both Files Missing (Complete Loss)

**Recovery**:

```bash
# 1. Find backup branch
BACKUP=$(git branch -a | grep backup-before | tail -1 | xargs)
echo "Using backup: $BACKUP"

# 2. Restore all OpenCode files
git checkout $BACKUP -- \
  tools/cli/installers/lib/ide/opencode.js \
  OPENCODE_INTEGRATION_SUMMARY.md \
  package.json

# 3. Install dependencies
npm install

# 4. Verify everything
bash -c '
test -f tools/cli/installers/lib/ide/opencode.js && echo "✅ opencode.js" || echo "❌ Failed"
grep -q comment-json package.json && echo "✅ dependency" || echo "❌ Failed"
npm list comment-json >/dev/null 2>&1 && echo "✅ installed" || echo "❌ Failed"
'

# 5. Stage and commit
git add tools/cli/installers/lib/ide/opencode.js OPENCODE_INTEGRATION_SUMMARY.md package.json package-lock.json
git commit -m "chore: restore complete OpenCode integration after upstream merge

- Restored tools/cli/installers/lib/ide/opencode.js
- Restored comment-json dependency
- Restored documentation

Fork-specific feature not present in upstream."
```

## Integration with Merge Workflow

### Pre-Merge Checklist

Before merging upstream changes:

1. ✅ Run quick verification to confirm OpenCode is present
2. ✅ Verify backup branch will be created
3. ✅ Note current commit hash for reference

### Post-Merge Checklist

After merging upstream changes:

1. ✅ Run quick verification
2. ✅ If any checks fail, run recovery procedures
3. ✅ Run thorough verification
4. ✅ Test basic functionality (optional)

### Testing OpenCode After Merge

**CRITICAL**: Do NOT use `npx bmad-method` to test - it downloads the published version!

```bash
# ✅ CORRECT - Test with local version
cd /path/to/test/project
node /path/to/BMAD-METHOD/tools/cli/bmad-cli.js install

# Or use npm script from BMAD-METHOD directory
npm run dev:install

# Verify OpenCode appears in IDE selection menu
# Verify opencode.json/opencode.jsonc is created correctly
```

**See**: `docs/V6_LOCAL_DEVELOPMENT.md` for complete testing guide. 5. ✅ Update Serena memory with merge date

### Workflow Integration

The `bmad/workflows/merge-upstream/` workflow includes OpenCode checks:

**Step 7.5** (added to existing workflow):

```yaml
- name: 'Verify OpenCode Integration'
  action: 'Run OpenCode verification commands'
  verification:
    - 'File existence check'
    - 'Dependency check'
    - 'IDE manager discovery check'
  on_failure:
    - 'Alert about missing OpenCode integration'
    - 'Provide recovery instructions'
    - 'Link to this reference document'
```

## Architecture Details

### How OpenCode Integration Works

1. **Auto-Discovery**: IDE manager scans `tools/cli/installers/lib/ide/` for `.js` files
2. **Class Instantiation**: Each file exports a class extending `BaseIdeSetup`
3. **Registration**: Manager calls constructor which sets `this.name = 'opencode'`
4. **Availability**: OpenCode appears in IDE selection list

### Why It's Low-Risk

- **New file**: Doesn't modify existing upstream code
- **Self-contained**: All logic in one file
- **Auto-discovery**: No manual registration needed
- **Dependency**: Only one new dependency, isolated in package.json

### Potential Conflicts

⚠️ **Unlikely but possible**:

1. **Upstream adds OpenCode**: Compare implementations, merge if needed
2. **package.json conflicts**: Manually preserve `comment-json` entry
3. **IDE manager changes**: Verify auto-discovery still works

## Testing Commands

### Quick Functionality Test

```bash
# Create a test project and verify OpenCode can be selected
mkdir -p /tmp/opencode-test
cd /tmp/opencode-test
npm init -y

# Note: Full interactive install test would require user input
# So we just verify the installer can be loaded
node -e "
const {OpenCodeSetup} = require('$PWD/tools/cli/installers/lib/ide/opencode');
const setup = new OpenCodeSetup();
console.log('✅ OpenCode installer loads successfully');
console.log('Name:', setup.name);
"
```

## Maintenance Notes

### When to Update This Document

- After any changes to OpenCode implementation
- After successful upstream merges (update "Last Verified" in Serena memory)
- If recovery procedures change
- If new verification methods are discovered

### Version History

- **2025-10-20**: Initial creation with OpenCode integration
- **Commit**: b3975f6

## Quick Reference Card

**Files to Watch**:

- ✅ `tools/cli/installers/lib/ide/opencode.js` (must exist)
- ✅ `"comment-json": "^4.2.5"` in package.json

**Quick Check**:

```bash
test -f tools/cli/installers/lib/ide/opencode.js && \
grep -q comment-json package.json && \
echo "✅ All good" || echo "❌ Needs recovery"
```

**Quick Recovery**:

```bash
BACKUP=$(git branch -a | grep backup-before | tail -1 | xargs)
git checkout $BACKUP -- tools/cli/installers/lib/ide/opencode.js package.json
npm install
```

## Related Documentation

- **Serena Memory**: `.serena/memories/CRITICAL-opencode-fork-integration.md`
- **Implementation Details**: `OPENCODE_INTEGRATION_SUMMARY.md`
- **Merge Workflow**: `bmad/workflows/merge-upstream/instructions.md`
- **User Documentation**: `docs/opencode-integration.md` (if exists)

---

**Last Updated**: 2025-10-20
**Maintained By**: Fork maintainers
**Upstream Status**: Not present in upstream BMAD-METHOD
