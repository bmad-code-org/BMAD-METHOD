# Issue #478 Fix Plan: Status Command Not Detecting BMAD Installations

## Problem Statement

The `npx bmad-method status` command fails to detect existing BMAD installations (e.g., `.bmad-core/` folders) in the project directory tree, even though they exist and were created during installation.

## Root Cause

The `findInstallation()` function does not properly handle the original working directory (`originalCwd`). When the command is run via `npx`, the current working directory may be different from where the command was originally invoked, causing the search to look in the wrong location.

## Solution Overview

1. **Identify the issue** in the codebase by locating `findInstallation()` function
2. **Create detection tests** to reproduce the bug
3. **Implement the fix** by properly using `originalCwd`
4. **Create validation tests** to ensure the fix works
5. **Execute full test suite** to verify no regressions

---

## Phase 1: Issue Detection & Analysis

### 1.1 Locate Key Functions

- [ ] Find `findInstallation()` function in codebase
- [ ] Find `status` command implementation
- [ ] Identify where `originalCwd` is captured/available
- [ ] Check how current working directory is used in search logic

### 1.2 Code Review

- [ ] Review how `.bmad-*` folders are created during installation
- [ ] Review how status command searches for installations
- [ ] Identify the disconnect between creation path and search path
- [ ] Document the flow: install → create folder → status → search

### 1.3 Reproduce the Bug

- [ ] Create test project structure with `.bmad-core/` folder
- [ ] Run status command from different directories
- [ ] Confirm the bug: status fails to detect nearby BMAD installations
- [ ] Document exact failure scenarios

---

## Phase 2: Create Detection Tests

### 2.1 Unit Tests for findInstallation()

- [ ] Test `findInstallation()` with `.bmad-core/` in current directory
- [ ] Test `findInstallation()` with `.bmad-*` in parent directories
- [ ] Test `findInstallation()` with `.bmad-*` in deeply nested directories
- [ ] Test `findInstallation()` when no installation exists
- [ ] Test `findInstallation()` with multiple BMAD installations in tree
- [ ] Test `findInstallation()` with correct `originalCwd` parameter
- [ ] Test `findInstallation()` with different `originalCwd` vs current working directory

### 2.2 Integration Tests for Status Command

- [ ] Test status command in project with `.bmad-core/` folder
- [ ] Test status command in subdirectory of BMAD project
- [ ] Test status command via `npx` (simulating real usage)
- [ ] Test status command with hidden folders
- [ ] Test status command output format

### 2.3 Test File Location

- `test/unit/find-installation.test.js` (new)
- `test/integration/status-command.test.js` (new or enhance existing)

---

## Phase 3: Implement the Fix

### 3.1 Code Changes Required

**File**: `tools/cli/commands/status.js` (or similar)

- Ensure `originalCwd` is passed to `findInstallation()`
- Verify working directory handling

**File**: `tools/cli/lib/detector.js` (or find-installation module)

- Update `findInstallation()` to accept and use `originalCwd`
- Change search logic to start from `originalCwd` instead of `process.cwd()`
- Handle relative path resolution correctly

### 3.2 Implementation Checklist

- [ ] Modify function signature to include `originalCwd` parameter
- [ ] Update search algorithm to use `originalCwd` as starting point
- [ ] Handle path resolution correctly (relative vs absolute)
- [ ] Test with trailing slashes, symlinks, etc.
- [ ] Ensure backward compatibility if function is called elsewhere
- [ ] Update all callers of `findInstallation()` to pass `originalCwd`

---

## Phase 4: Create Validation Tests

### 4.1 Fix Verification Tests

- [ ] Test that status detects `.bmad-core/` in current directory
- [ ] Test that status detects `.bmad-*` in parent directories
- [ ] Test that status works via `npx bmad-method status`
- [ ] Test that status works from subdirectories
- [ ] Test that fix doesn't break existing functionality

### 4.2 Regression Tests

- [ ] Ensure all existing tests still pass
- [ ] Ensure other commands (install, list, etc.) still work
- [ ] Verify no performance degradation

### 4.3 Edge Case Tests

- [ ] Test with `.bmad-` prefixed folders at different nesting levels
- [ ] Test with multiple BMAD installations (select correct one)
- [ ] Test with symlinked directories
- [ ] Test on different OS (Windows path handling)
- [ ] Test with spaces in directory names

---

## Phase 5: Execute & Validate

### 5.1 Run Test Suite

```bash
npm test
```

- [ ] All unit tests pass
- [ ] All integration tests pass
- [ ] No linting errors
- [ ] No formatting issues

### 5.2 Manual Testing

- [ ] Create fresh test project
- [ ] Run installer to create `.bmad-core/`
- [ ] Run `npx bmad-method status` from project root
- [ ] Verify status output shows "BMad installation found"
- [ ] Test from subdirectories
- [ ] Test with multiple installations

### 5.3 Full Validation

- [ ] Run `npm run validate:schemas`
- [ ] Run `npm run lint`
- [ ] Run `npm run format:check`
- [ ] Run `npm test`
- [ ] Run `npm run test:coverage`

---

## Files to Modify

### Production Code

- `tools/cli/lib/detector.js` - Update `findInstallation()` function
- `tools/cli/commands/status.js` - Pass `originalCwd` to finder
- `tools/cli/installers/lib/core/detector.js` - If separate instance exists

### Test Code (New/Modified)

- `test/unit/find-installation.test.js` - NEW
- `test/integration/status-command.test.js` - NEW or ENHANCE
- `test/fixtures/bmad-project/` - Test fixtures with `.bmad-*` folders

---

## Success Criteria

✅ **All of the following must be true:**

1. Status command detects BMAD installations in project directory
2. Status command works via `npx bmad-method status`
3. Status command works from subdirectories of BMAD project
4. All existing tests pass
5. New tests validate the fix
6. No linting or formatting issues
7. Documentation updated if needed

---

## Estimated Effort

| Phase                  | Time           | Complexity |
| ---------------------- | -------------- | ---------- |
| Detection & Analysis   | 30-45 min      | Low        |
| Create Tests           | 45-60 min      | Medium     |
| Implement Fix          | 30-45 min      | Low-Medium |
| Validation Tests       | 45-60 min      | Medium     |
| Execution & Validation | 30-45 min      | Low        |
| **TOTAL**              | **~3-4 hours** | **Medium** |

---

## Related Issues/PRs

- Issue #478: Status command not detecting installations
- PR #480: Honor original working directory (related context)
- Comments by: @dracic, @manjaroblack, @moyger

---

## Notes

- The core issue is the use of `process.cwd()` vs the actual directory where the command was invoked
- `originalCwd` should be captured at CLI entry point and passed through the call chain
- Consider using Node.js `__dirname` and relative path resolution patterns
- May need to normalize paths for cross-platform compatibility
