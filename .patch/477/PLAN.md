# Fix #477: Installer Configuration Questions on Update# Fix #477: Installer Configuration Questions on Update

## Issue Summary## Issue Summary

When running `npx bmad-method install` on an existing BMAD installation, the installer asks configuration questions again instead of reading from the existing `install-manifest.yaml`.When running `npx bmad-method install` on an existing BMAD installation, the installer asks configuration questions again instead of reading from the existing `install-manifest.yaml`.

## Root Cause## Root Cause

The installer's update detection logic doesn't properly load and use the existing configuration before prompting for new values.

The installer's update detection logic doesn't properly load and use the existing configuration before prompting for new values.

## Solution Strategy

### 1. Configuration Loading (Priority: HIGH)

### 1. Configuration Loading (Priority: HIGH)- **File**: `tools/cli/lib/config.js` (or equivalent configuration loader)

- **Change**: Add method to load existing configuration from `install-manifest.yaml`

- **File**: `tools/cli/lib/config.js` (or equivalent configuration loader)- **Implementation**:

- **Change**: Add method to load existing configuration from `install-manifest.yaml` - Check if `.bmad-core/install-manifest.yaml` exists

- **Implementation**: - Parse and cache existing configuration
  - Check if `.bmad-core/install-manifest.yaml` exists - Use cached values as defaults when prompting

  - Parse and cache existing configuration

  - Use cached values as defaults when prompting### 2. Update Detection (Priority: HIGH)

- **File**: `tools/cli/installers/lib/core/installer.js` (or main install logic)

### 2. Update Detection (Priority: HIGH)- **Change**: Skip configuration questions if running as update (not fresh install)

- **Logic**:

- **File**: `tools/cli/installers/lib/core/installer.js` (or main install logic) - Detect if `install-manifest.yaml` exists

- **Change**: Skip configuration questions if running as update (not fresh install) - If exists + version differs: RUN AS UPDATE (skip questions)

- **Logic**: - If exists + version same: RUN AS REINSTALL (skip questions)
  - Detect if `install-manifest.yaml` exists - If not exists: RUN AS FRESH INSTALL (ask questions)

  - If exists + version differs: RUN AS UPDATE (skip questions)

  - If exists + version same: RUN AS REINSTALL (skip questions)### 3. Question Skipping (Priority: HIGH)

  - If not exists: RUN AS FRESH INSTALL (ask questions)- **Files**: Interactive prompt functions

- **Change**: Add condition to skip questions during update

### 3. Question Skipping (Priority: HIGH)- **Implementation**

- Pass `isUpdate` flag through prompt pipeline
- **Files**: Interactive prompt functions - Check flag before displaying configuration questions
- **Change**: Add condition to skip questions during update - Questions to skip:
- **Implementation**: - "Will the PRD be sharded?"
  - Pass `isUpdate` flag through prompt pipeline - "Will the Architecture be sharded?"
  - Check flag before displaying configuration questions - Other bootstrap/configuration questions
  - Questions to skip:
    - "Will the PRD be sharded?"### 4. Manifest Validation (Priority: MEDIUM)
    - "Will the Architecture be sharded?"- **File**: `tools/cli/installers/lib/core/installer.js`
    - Other bootstrap/configuration questions- **Change**: Validate `install-manifest.yaml` structure

- **Implementation**:

### 4. Manifest Validation (Priority: MEDIUM)

- Check required fields: `version`, `installed_at`, `install_type`
  - Fallback to fresh install if manifest is invalid
- **File**: `tools/cli/installers/lib/core/installer.js` - Log warnings for any schema mismatches
- **Change**: Validate `install-manifest.yaml` structure
- **Implementation**:### 5. Testing (Priority: HIGH)
  - Check required fields: `version`, `installed_at`, `install_type`- Update mode detection (fresh vs update vs reinstall)
  - Fallback to fresh install if manifest is invalid- Configuration loading from manifest
  - Log warnings for any schema mismatches- Question skipping during update

- Manifest validation

### 5. Testing (Priority: HIGH)- IDE detection integration with config loading

- Update mode detection (fresh vs update vs reinstall)## Files to Modify
- Configuration loading from manifest1. `tools/cli/installers/lib/core/installer.js` - Main installer logic
- Question skipping during update2. `tools/cli/lib/config.js` - Configuration management
- Manifest validation3. `tools/cli/installers/lib/core/manifest.js` - Manifest handling
- IDE detection integration with config loading4. `tools/cli/commands/install.js` - Install command entry point

5. Test files to validate changes

## Files to Modify

## Acceptance Criteria

1. `tools/cli/installers/lib/core/installer.js` - Main installer logic- [ ] Running install on existing setup doesn't ask config questions

2. `tools/cli/lib/config.js` - Configuration management- [ ] Existing settings are preserved from `install-manifest.yaml`

3. `tools/cli/installers/lib/core/manifest.js` - Manifest handling- [ ] Version detection still works (shows update available)

4. `tools/cli/commands/install.js` - Install command entry point- [ ] Files are properly updated without re-asking questions

5. Test files to validate changes- [ ] All IDE configurations are preserved

- [ ] Backward compatible with existing installations

## Acceptance Criteria

## Branch

- [ ] Running install on existing setup doesn't ask config questions`fix/477-installer-update-config`

- [ ] Existing settings are preserved from `install-manifest.yaml`
- [ ] Version detection still works (shows update available)
- [ ] Files are properly updated without re-asking questions
- [ ] All IDE configurations are preserved
- [ ] Backward compatible with existing installations

## Branch

`fix/477-installer-update-config`
