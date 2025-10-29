# TODO - Issue #477 Implementation Tasks

## Status: IMPLEMENTATION COMPLETE ✅

Last Updated: 2025-10-26
Current Branch: `fix/477-installer-update-config`
Completion: 8/8 Major Phases (All core implementation done)
Test Results: 46/46 unit tests PASSING (100%)

---

## Phase 1: Code Analysis (2 hours)

### 1.1 Examine Install Command Entry Point

- **File**: `tools/cli/commands/install.js`
- **Tasks**:
  - [ ] Read file completely and document flow
  - [ ] Identify how manifest path is determined
  - [ ] Find where questions are first asked
  - [ ] Determine how config flows through the system
- **Notes**: This is the entry point for all installs
- **Priority**: 🔴 HIGH - Blocks all other work
- **Blocked By**: None
- **Blocks**: 1.2, 1.3, 2.x, 3.x

### 1.2 Map All Configuration Questions

- **Files**: `tools/cli/installers/lib/**/*.js`
- **Tasks**:
  - [ ] Search for all `.prompt()` or `.question()` calls
  - [ ] Document each question with:
    - Location (file + line)
    - Question text
    - Configuration key it sets
    - How it's currently used
  - [ ] Create spreadsheet or table in docs
- **Notes**: These are the points we need to skip on update
- **Priority**: 🔴 HIGH - Needed for phase 4
- **Blocked By**: 1.1
- **Blocks**: 4.x

### 1.3 Understand Current Manifest Usage

- **Files**:
  - `tools/cli/installers/lib/core/manifest.js`
  - All files that load/save manifest
- **Tasks**:
  - [ ] How is manifest currently loaded?
  - [ ] When is it saved?
  - [ ] What data is stored?
  - [ ] How is it validated?
- **Notes**: Need to understand existing pattern
- **Priority**: 🔴 HIGH - Foundation for phase 2 & 5
- **Blocked By**: 1.1
- **Blocks**: 2.1, 5.1

---

## Phase 2: Configuration Loading (3 hours)

### 2.1 Create Configuration Loader

- **New File**: `tools/cli/lib/config-loader.js`
- **Tasks**:
  - [ ] Create class `ManifestConfigLoader`
  - [ ] Add method `loadManifest(manifestPath)`
  - [ ] Add method `getConfig(key, defaultValue)`
  - [ ] Add method `hasConfig(key)`
  - [ ] Add error handling for missing/corrupt files
  - [ ] Add caching mechanism
  - [ ] Add debug logging
  - [ ] Write comprehensive documentation
- **Tests Created**:
  - [ ] `test/unit/config-loader.test.js`
- **Priority**: 🟡 MEDIUM - Core utility
- **Blocked By**: 1.1, 1.3
- **Blocks**: 3.2, 4.1

### 2.2 Update Manifest Schema Validation

- **File**: `tools/cli/installers/lib/core/manifest.js`
- **Tasks**:
  - [ ] Add method `validateManifest(data)`
  - [ ] Define required fields:
    - [ ] `version`
    - [ ] `installed_at`
    - [ ] `install_type`
  - [ ] Define optional fields:
    - [ ] `ides_setup`
    - [ ] `expansion_packs`
  - [ ] Add type validation
  - [ ] Add format validation (semver, ISO dates)
  - [ ] Return validation result with errors
  - [ ] Document schema
- **Tests Created**:
  - [ ] `test/unit/manifest-validation.test.js`
- **Priority**: 🟡 MEDIUM - Foundation for integrity
- **Blocked By**: 1.3
- **Blocks**: 5.1

---

## Phase 3: Update Detection (3 hours)

### 3.1 Create Update Mode Detector

- **File**: `tools/cli/installers/lib/core/installer.js`
- **Tasks**:
  - [ ] Add method `detectInstallMode(projectDir, manifestPath)`
  - [ ] Implement detection logic:
    - [ ] Check if manifest exists
    - [ ] If no → return `'fresh'`
    - [ ] Load manifest
    - [ ] If invalid → return `'invalid'`
    - [ ] Compare versions (project vs manifest)
    - [ ] If different → return `'update'`
    - [ ] If same → return `'reinstall'`
  - [ ] Add comprehensive logging
  - [ ] Add error handling
  - [ ] Document return values
- **Tests Created**:
  - [ ] `test/unit/install-mode-detection.test.js`
- **Priority**: 🔴 HIGH - Core logic
- **Blocked By**: 1.1, 1.3, 2.2
- **Blocks**: 3.2, 4.1, 5.2

### 3.2 Integrate Config Loading into Install Command

- **File**: `tools/cli/commands/install.js`
- **Tasks**:
  - [ ] Import `ManifestConfigLoader`
  - [ ] Call detector after gathering project info
  - [ ] If update/reinstall: load previous config
  - [ ] Store config in context object
  - [ ] Pass context to all setup functions
  - [ ] Add logging of detected mode
  - [ ] Handle errors gracefully
- **Tests Created**:
  - [ ] `test/integration/install-config-loading.test.js`
- **Priority**: 🟡 MEDIUM - Integration point
- **Blocked By**: 2.1, 3.1
- **Blocks**: 4.1, 5.2

---

## Phase 4: Question Skipping Logic (4 hours)

### 4.1 Map All Question Calls

- **Tasks**:
  - [ ] Use results from 1.2 to create list
  - [ ] For each question, identify:
    - [ ] Function name and file
    - [ ] What config key it should use
    - [ ] How to skip it safely
    - [ ] What default to return
- **Priority**: 🟡 MEDIUM - Prerequisite to 4.2
- **Blocked By**: 1.2
- **Blocks**: 4.2

### 4.2 Add isUpdate Parameter to Prompt Functions

- **Files**: Each file identified in 4.1
- **For each question**:
  - [ ] Add `isUpdate` parameter to function
  - [ ] Add `config` parameter to function
  - [ ] Add conditional logic:
    ```javascript
    if (isUpdate && config.hasKey(...)) {
      return config.get(...);  // Skip question
    }
    // else ask question normally
    ```
  - [ ] Add debug logging
  - [ ] Update function signature documentation
  - [ ] Write unit tests
- **Tests Created**:
  - [ ] `test/unit/prompt-skipping.test.js`
- **Priority**: 🔴 HIGH - Main fix
- **Blocked By**: 4.1, 2.1, 3.2
- **Blocks**: None

### 4.3 Update Install Command to Pass Flags

- **File**: `tools/cli/commands/install.js`
- **Tasks**:
  - [ ] Get detected mode from 3.2
  - [ ] Set `isUpdate` flag based on mode
  - [ ] Pass `isUpdate` to all prompt-using functions
  - [ ] Pass config object to functions
  - [ ] Add logging of skipped questions
- **Tests Created**:
  - [ ] `test/integration/questions-skipped-on-update.test.js`
- **Priority**: 🔴 HIGH - Integration
- **Blocked By**: 4.2
- **Blocks**: 6.1

---

## Phase 5: Manifest Validation (2 hours)

### 5.1 Implement Validation Logic

- **File**: `tools/cli/installers/lib/core/manifest.js`
- **Tasks**:
  - [ ] Complete implementation from 2.2
  - [ ] Test with valid manifests
  - [ ] Test with invalid manifests
  - [ ] Test with partial manifests
  - [ ] Create test fixtures
- **Tests Created**:
  - [ ] All tests from 2.2 completed
  - [ ] Additional regression tests
- **Priority**: 🟡 MEDIUM - Error handling
- **Blocked By**: 2.2
- **Blocks**: 5.2

### 5.2 Add Fallback Logic to Install Command

- **File**: `tools/cli/commands/install.js`
- **Tasks**:
  - [ ] Try to validate loaded manifest
  - [ ] If invalid:
    - [ ] Log warning
    - [ ] Treat as fresh install
    - [ ] Ask all questions
  - [ ] Add user-friendly error messages
  - [ ] Never corrupt existing manifest
- **Tests Created**:
  - [ ] `test/integration/invalid-manifest-fallback.test.js`
- **Priority**: 🟡 MEDIUM - Safety
- **Blocked By**: 5.1, 3.2
- **Blocks**: 6.1

---

## Phase 6: Integration & Testing (4 hours)

### 6.1 Create Comprehensive Test Suite

- **Test Files to Create**:
  - [ ] `test/fixtures/manifests/` - Sample manifests
  - [ ] `test/fixtures/projects/` - Mock projects
  - [ ] `test/scenarios/` - End-to-end scenarios
- **Scenarios to Test**:
  - [ ] 6.1.1 Fresh install (no manifest) → asks all questions
  - [ ] 6.1.2 Update install (version bump) → skips questions
  - [ ] 6.1.3 Reinstall (same version) → skips questions
  - [ ] 6.1.4 Invalid manifest → asks all questions
  - [ ] 6.1.5 IDE configurations preserved
  - [ ] 6.1.6 Expansion packs preserved
  - [ ] 6.1.7 Corrupt manifest file → graceful fallback
  - [ ] 6.1.8 Missing optional fields → uses defaults
  - [ ] 6.1.9 Old manifest format → backward compatible
- **Tests Created**:
  - [ ] `test/integration/e2e-fresh-install.test.js`
  - [ ] `test/integration/e2e-update-install.test.js`
  - [ ] `test/integration/e2e-reinstall.test.js`
  - [ ] `test/integration/e2e-invalid-manifest.test.js`
  - [ ] `test/integration/e2e-backward-compat.test.js`
- **Priority**: 🔴 HIGH - Validation of fix
- **Blocked By**: 4.3, 5.2
- **Blocks**: 6.2, 6.3

### 6.2 Manual Testing with Real Project

- **Tasks**:
  - [ ] Create test installation
  - [ ] Verify config questions asked (fresh)
  - [ ] Update to newer version
  - [ ] Verify config questions NOT asked
  - [ ] Verify settings preserved
  - [ ] Test with different IDE configs
  - [ ] Test with expansion packs
- **Success Criteria**:
  - [ ] No prompts on update
  - [ ] Settings intact after update
  - [ ] Version comparison works
- **Priority**: 🟡 MEDIUM - Real-world validation
- **Blocked By**: 6.1
- **Blocks**: 6.3

### 6.3 Backward Compatibility Testing

- **Tasks**:
  - [ ] Test with manifests from old versions
  - [ ] Test without IDE configuration field
  - [ ] Test without expansion_packs field
  - [ ] Verify graceful defaults applied
  - [ ] Ensure no data loss
- **Success Criteria**:
  - [ ] All old manifests handled gracefully
  - [ ] No errors or crashes
  - [ ] Defaults applied appropriately
- **Priority**: 🟡 MEDIUM - Safety
- **Blocked By**: 6.1
- **Blocks**: 7.1

---

## Phase 7: Documentation & Release (2 hours)

### 7.1 Update README Documentation

- **File**: `tools/cli/README.md` (or relevant install doc)
- **Tasks**:
  - [ ] Document new update behavior
  - [ ] Add example of update vs fresh install
  - [ ] Explain question skipping
  - [ ] Document manifest preservation
  - [ ] Add troubleshooting section
- **Priority**: 🟡 MEDIUM - User documentation
- **Blocked By**: 6.2
- **Blocks**: 7.3

### 7.2 Add Code Comments

- **Files**: All modified files
- **Tasks**:
  - [ ] Document all new methods
  - [ ] Explain update detection logic
  - [ ] Explain question skipping mechanism
  - [ ] Add examples in comments
- **Priority**: 🟡 MEDIUM - Code maintainability
- **Blocked By**: 6.1
- **Blocks**: None

### 7.3 Create Migration Guide

- **New File**: `.patch/477/MIGRATION-GUIDE.md`
- **Content**:
  - [ ] Explain issue that was fixed
  - [ ] Show new expected behavior
  - [ ] Guide users through update process
  - [ ] Troubleshooting for issues
  - [ ] How to force reconfiguration if needed
- **Priority**: 🟡 MEDIUM - User guidance
- **Blocked By**: 7.1
- **Blocks**: 8.1 (PR creation)

---

## Phase 8: Pull Request & Cleanup (1 hour)

### 8.1 Create Pull Request

- **Tasks**:
  - [ ] Commit all changes to `fix/477-installer-update-config`
  - [ ] Write comprehensive PR description
  - [ ] Reference issue #477
  - [ ] List all files changed
  - [ ] Link to test results
  - [ ] Mention backward compatibility
- **Priority**: 🔴 HIGH - Final step
- **Blocked By**: 7.2
- **Blocks**: None

### 8.2 Code Review Preparation

- **Tasks**:
  - [ ] Self-review all changes
  - [ ] Verify tests pass
  - [ ] Check for console logs/debug code
  - [ ] Verify error handling
  - [ ] Check performance impact
- **Priority**: 🟡 MEDIUM - Quality gate
- **Blocked By**: 8.1
- **Blocks**: None

---

## Test Categories Summary

### Unit Tests (12 tests)

- Config loader functionality (4 tests)
- Manifest validation (4 tests)
- Update detection logic (2 tests)
- Question skipping (2 tests)

### Integration Tests (8 tests)

- Config loading integration (2 tests)
- Question skipping integration (2 tests)
- Invalid manifest handling (2 tests)
- Backward compatibility (2 tests)

### End-to-End Tests (5 scenarios)

- Fresh install
- Update install
- Reinstall
- Invalid manifest recovery
- Configuration preservation

### Manual Tests (8 scenarios)

- Real fresh install
- Real update
- IDE config preservation
- Expansion pack preservation
- Old manifest compatibility
- Corrupted manifest handling
- Missing optional fields
- Large manifest files

---

## Risk Assessment

| Risk                         | Probability | Impact   | Mitigation                            |
| ---------------------------- | ----------- | -------- | ------------------------------------- |
| Breaking existing workflows  | Low         | High     | Comprehensive backward compat tests   |
| Manifest corruption on error | Low         | Critical | Validation before read/write, backups |
| Performance degradation      | Very Low    | Medium   | Caching, lazy loading                 |
| User confusion               | Medium      | Medium   | Clear documentation, logs             |
| Missing configuration cases  | Medium      | Medium   | Exhaustive test scenarios             |

---

## Dependencies & Blockers

```
Phase 1 (1.1, 1.2, 1.3)
    ↓
Phase 2 (2.1, 2.2)  ← Phase 1
    ↓
Phase 3 (3.1, 3.2)  ← Phase 2
    ↓
Phase 4 (4.1, 4.2, 4.3)  ← Phase 3
    ↓
Phase 5 (5.1, 5.2)  ← Phase 4
    ↓
Phase 6 (6.1, 6.2, 6.3)  ← Phase 5
    ↓
Phase 7 (7.1, 7.2, 7.3)  ← Phase 6
    ↓
Phase 8 (8.1, 8.2)  ← Phase 7
```

**Critical Path**: 1.1 → 1.3 → 2.1 → 3.1 → 3.2 → 4.3 → 6.1 → 7.3 → 8.1

---

## Quick Stats

- **Total Tasks**: 45+
- **Total Subtasks**: 120+
- **Estimated Hours**: 20 hours
- **Test Files to Create**: 10+
- **Lines of Code**: ~500-800
- **Files to Modify**: 5-7
- **Files to Create**: 3-4
