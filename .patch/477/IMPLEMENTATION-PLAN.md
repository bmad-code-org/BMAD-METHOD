# Detailed Implementation Plan - Issue #477

## Overview

Fix the installer to skip configuration questions during updates and preserve existing settings from `install-manifest.yaml`.

## Phase 1: Analysis & Preparation

### Task 1.1: Understand Current Installer Flow

- **File**: `tools/cli/commands/install.js`
- **Objective**: Map the current installation flow
- **Deliverable**: Document showing:
  - Entry point for install command
  - How it decides between fresh install vs update
  - Where configuration questions are asked
  - How manifest is currently used (if at all)

### Task 1.2: Identify Question Points

- **Files to scan**:
  - `tools/cli/installers/lib/` (all files)
  - `tools/cli/lib/` (all configuration-related files)
- **Objective**: Find all places where user is prompted for config
- **Deliverable**: List of all prompt locations with context

### Task 1.3: Test Environment Setup

- **Create test fixtures**:
  - Mock existing `.bmad-core/install-manifest.yaml`
  - Mock project structure
  - Create test scenarios for each install type

## Phase 2: Configuration Loading

### Task 2.1: Create Config Loader

- **File**: `tools/cli/lib/config-loader.js` (new)
- **Responsibilities**:
  - Load `install-manifest.yaml` if exists
  - Parse YAML safely with error handling
  - Cache loaded configuration
  - Provide getter methods for each config field
- **Tests Required**:
  - Load valid manifest
  - Handle missing manifest (fresh install)
  - Handle corrupted manifest
  - Handle partial manifest (missing fields)
  - Verify caching behavior

### Task 2.2: Update Manifest Schema

- **File**: `tools/cli/installers/lib/core/manifest.js`
- **Changes**:
  - Add schema validation
  - Document required fields
  - Add field defaults
  - Add version migration logic
- **Tests Required**:
  - Validate complete manifest
  - Validate partial manifest
  - Test field migrations

## Phase 3: Update Detection Logic

### Task 3.1: Create Update Mode Detector

- **File**: `tools/cli/installers/lib/core/installer.js`
- **Add method**: `detectInstallMode(projectDir, manifestPath)`
- **Returns**: One of:
  - `'fresh'` - No manifest, new installation
  - `'update'` - Manifest exists, different version
  - `'reinstall'` - Manifest exists, same version
  - `'invalid'` - Manifest corrupted or invalid
- **Tests Required**:
  - Fresh install detection
  - Update detection with version difference
  - Reinstall detection (same version)
  - Invalid manifest detection
  - Missing manifest detection

### Task 3.2: Load Previous Configuration

- **File**: `tools/cli/commands/install.js`
- **Add logic**:
  - Call config loader when update detected
  - Store config in installer context
  - Pass to all prompt functions
- **Tests Required**:
  - Configuration loaded correctly
  - Configuration available to prompts
  - Defaults applied properly

## Phase 4: Question Skipping

### Task 4.1: Add Update Flag to Prompts

- **Files**: All prompt functions in `tools/cli/installers/lib/`
- **Changes**:
  - Add `isUpdate` parameter to prompt functions
  - Skip questions if `isUpdate === true` and config exists
  - Return cached config value
  - Log what was skipped (debug mode)
- **Prompts to Skip**:
  1. "Will the PRD be sharded?" → Use `config.prd_sharding`
  2. "Will the Architecture be sharded?" → Use `config.architecture_sharding`
  3. "Document Organization Settings" → Use `config.doc_organization`
  4. "Bootstrap questions" → Use corresponding config values

### Task 4.2: Test Question Skipping

- **Tests Required**:
  - Each question skipped during update
  - Correct default value returned
  - Questions asked during fresh install
  - Questions asked during reinstall (optional flag)

## Phase 5: Manifest Validation

### Task 5.1: Add Validation Logic

- **File**: `tools/cli/installers/lib/core/manifest.js`
- **Add method**: `validateManifest(manifestData)`
- **Checks**:
  - Required fields present: `version`, `installed_at`, `install_type`
  - Field types correct
  - Version format valid (semver)
  - Dates valid ISO format
  - IDEs array valid (if present)
- **Tests Required**:
  - Valid manifest passes
  - Missing required field fails
  - Invalid version format fails
  - Invalid date format fails
  - Extra fields ignored gracefully

### Task 5.2: Add Fallback Logic

- **File**: `tools/cli/commands/install.js`
- **Logic**:
  - If validation fails, treat as fresh install
  - Log warning about invalid manifest
  - Proceed with questions
- **Tests Required**:
  - Fallback on invalid manifest
  - User warned appropriately
  - No crash or corruption

## Phase 6: Integration & Testing

### Task 6.1: End-to-End Tests

- **Test Scenarios**:
  1. Fresh install (no manifest) → asks all questions
  2. Update install (manifest v4.36.2 → v4.39.2) → skips questions
  3. Reinstall (manifest v4.36.2 → v4.36.2) → skips questions (optional)
  4. Invalid manifest → asks all questions
  5. IDE configuration preserved
  6. Expansion packs preserved

### Task 6.2: Backward Compatibility

- **Tests**:
  - Works with old manifest format
  - Works without IDE configuration field
  - Works without expansion_packs field
  - Graceful degradation

### Task 6.3: CLI Flag Options

- **Add optional flags** (future enhancement):
  - `--reconfigure` - Force questions even on update
  - `--skip-questions` - Skip all questions (use all defaults)
  - `--manifest-path` - Custom manifest location

## Phase 7: Documentation & Release

### Task 7.1: Update README

- Document update behavior
- Show examples of update vs fresh install
- Explain question skipping

### Task 7.2: Add Code Comments

- Document new methods
- Explain update detection logic
- Explain question skipping

### Task 7.3: Create Migration Guide

- For users experiencing the issue
- Show new expected behavior

## Implementation Order

1. **Start with tests** (TDD approach)
2. Create test fixtures and scenarios
3. Create configuration loader
4. Create update mode detector
5. Integrate into install command
6. Add question skipping logic
7. Add validation logic
8. Run all tests
9. Manual testing with real project
10. Documentation updates

## Estimated Effort

- Phase 1: 2 hours (analysis)
- Phase 2: 3 hours (config loading)
- Phase 3: 3 hours (update detection)
- Phase 4: 4 hours (question skipping)
- Phase 5: 2 hours (validation)
- Phase 6: 4 hours (integration & testing)
- Phase 7: 2 hours (documentation)

**Total: ~20 hours of implementation**

## Dependencies

- No external dependencies (uses existing libraries)
- Depends on understanding current installer architecture
- Requires test infrastructure setup

## Risks & Mitigations

| Risk                             | Mitigation                                       |
| -------------------------------- | ------------------------------------------------ |
| Breaking existing workflows      | Comprehensive backward compatibility tests       |
| Data loss from invalid manifest  | Validation before use, fallback to safe defaults |
| Confused users with new behavior | Clear documentation and example output           |
| Performance impact               | Cache configuration, lazy loading                |

## Success Criteria

All acceptance criteria from issue must pass:

- [ ] Running install on existing setup doesn't ask config questions
- [ ] Existing settings are preserved from `install-manifest.yaml`
- [ ] Version detection still works (shows update available)
- [ ] Files are properly updated without re-asking questions
- [ ] All IDE configurations are preserved
- [ ] Backward compatible with existing installations
