# Test Specifications - Issue #477

## Overview

This document specifies the complete test strategy for issue #477 fix:
"Installer asks configuration questions during update instead of using existing settings"

Tests are organized by category and follow TDD principles. Tests should be created BEFORE implementation.

---

## Test Infrastructure Setup

### Test Framework

- **Framework**: Jest (Node.js standard)
- **Location**: `test/` directory
- **Configuration**: `jest.config.js` (or similar)

### Test Fixtures Directory

```
test/
├── fixtures/
│   ├── manifests/
│   │   ├── valid-manifest.yaml
│   │   ├── minimal-manifest.yaml
│   │   ├── full-manifest.yaml
│   │   ├── old-version-manifest.yaml
│   │   ├── corrupted-manifest.yaml
│   │   ├── missing-required-field.yaml
│   │   └── missing-optional-field.yaml
│   ├── projects/
│   │   ├── fresh-install/
│   │   ├── with-manifest/
│   │   └── with-old-manifest/
│   └── configs/
│       └── sample-configs.js
├── unit/
├── integration/
└── scenarios/
```

---

## Unit Tests

### Test Suite 1: Configuration Loader (File: `test/unit/config-loader.test.js`)

#### Test 1.1: Load Valid Manifest

```javascript
describe('ManifestConfigLoader', () => {
  describe('loadManifest', () => {
    it('should load a valid manifest file', async () => {
      // Given: Valid manifest file exists
      // When: loadManifest called
      // Then: Config loaded successfully
      //   AND all fields accessible
      //   AND no errors thrown
    });
  });
});
```

**Acceptance Criteria**:

- [ ] File read successfully
- [ ] YAML parsed without errors
- [ ] All fields accessible via getConfig()
- [ ] No exceptions thrown

#### Test 1.2: Handle Missing Manifest

```javascript
it('should return empty config for missing manifest', async () => {
  // Given: Manifest file doesn't exist
  // When: loadManifest called with non-existent path
  // Then: Returns empty config object
  //   AND hasConfig() returns false for all keys
  //   AND no error thrown (graceful failure)
});
```

**Acceptance Criteria**:

- [ ] No FileNotFound exception
- [ ] Empty config returned
- [ ] Graceful handling

#### Test 1.3: Handle Corrupted Manifest

```javascript
it('should throw error for corrupted YAML', async () => {
  // Given: Corrupted YAML file
  // When: loadManifest called
  // Then: Error thrown with helpful message
  //   AND Error indicates YAML parse failure
});
```

**Acceptance Criteria**:

- [ ] Error thrown with clear message
- [ ] Message indicates YAML parsing issue
- [ ] Helpful context provided

#### Test 1.4: Cache Configuration

```javascript
it('should cache loaded configuration', async () => {
  // Given: Manifest loaded
  // When: getConfig called multiple times
  // Then: File read only once (verified via spy)
  //   AND Same cached object returned
});
```

**Acceptance Criteria**:

- [ ] File system accessed only once
- [ ] Subsequent calls return cached data
- [ ] Performance verified (< 1ms second access)

#### Test 1.5: Get Specific Configuration Value

```javascript
it('should return specific config value by key', async () => {
  // Given: Manifest with known values
  // When: getConfig('version') called
  // Then: Correct version string returned
  //   AND Type is string
});
```

**Acceptance Criteria**:

- [ ] Correct value returned
- [ ] Correct data type
- [ ] Key access working

#### Test 1.6: Get Configuration with Default

```javascript
it('should return default when config key missing', async () => {
  // Given: Config without 'ides_setup' field
  // When: getConfig('ides_setup', ['default-ide'])
  // Then: Returns default value
  //   AND Default is array ['default-ide']
});
```

**Acceptance Criteria**:

- [ ] Default returned when missing
- [ ] Default has correct type
- [ ] Original config unchanged

---

### Test Suite 2: Manifest Validation (File: `test/unit/manifest-validation.test.js`)

#### Test 2.1: Validate Complete Manifest

```javascript
describe('Manifest Validation', () => {
  describe('validateManifest', () => {
    it('should validate complete valid manifest', () => {
      // Given: Valid manifest with all fields
      // When: validateManifest called
      // Then: Returns { isValid: true, errors: [] }
    });
  });
});
```

**Acceptance Criteria**:

- [ ] isValid === true
- [ ] errors array empty
- [ ] All fields validated

#### Test 2.2: Reject Missing Required Fields

```javascript
it('should reject manifest missing "version"', () => {
  // Given: Manifest without version field
  // When: validateManifest called
  // Then: Returns isValid: false
  //   AND errors includes "version required"
});
```

**Acceptance Criteria**:

- [ ] isValid === false
- [ ] Error message clear
- [ ] Field name identified

#### Test 2.3: Reject Invalid Version Format

```javascript
it('should reject invalid semver version', () => {
  // Given: Manifest with version "not-semver"
  // When: validateManifest called
  // Then: Returns isValid: false
  //   AND errors includes version format issue
});
```

**Acceptance Criteria**:

- [ ] Invalid semver rejected
- [ ] Error message clear
- [ ] Expected format shown

#### Test 2.4: Reject Invalid Date Format

```javascript
it('should reject invalid ISO date', () => {
  // Given: installed_at = "2025-13-45"
  // When: validateManifest called
  // Then: Returns isValid: false
  //   AND errors indicates date issue
});
```

**Acceptance Criteria**:

- [ ] Invalid date rejected
- [ ] Error message clear
- [ ] ISO 8601 requirement noted

#### Test 2.5: Accept Optional Fields Missing

```javascript
it('should allow missing optional fields', () => {
  // Given: Manifest without ides_setup
  // When: validateManifest called with only required fields
  // Then: Returns isValid: true
  //   AND no error for missing optional field
});
```

**Acceptance Criteria**:

- [ ] Optional fields truly optional
- [ ] isValid === true
- [ ] No false errors

#### Test 2.6: Validate Array Fields

```javascript
it('should validate ides_setup is array of strings', () => {
  // Given: ides_setup with non-string elements
  // When: validateManifest called
  // Then: Returns isValid: false if type wrong
});
```

**Acceptance Criteria**:

- [ ] Array type enforced
- [ ] String elements required
- [ ] Invalid structures rejected

#### Test 2.7: Type Validation for All Fields

```javascript
it('should validate field types', () => {
  // Given: install_type = 123 (number, not string)
  // When: validateManifest called
  // Then: Returns isValid: false
  //   AND error message clear
});
```

**Acceptance Criteria**:

- [ ] Type validation working
- [ ] All field types checked
- [ ] Error messages clear

---

### Test Suite 3: Update Mode Detection (File: `test/unit/install-mode-detection.test.js`)

#### Test 3.1: Detect Fresh Install

```javascript
describe('Installer', () => {
  describe('detectInstallMode', () => {
    it('should detect fresh install when no manifest', () => {
      // Given: Project directory without manifest
      // When: detectInstallMode called
      // Then: Returns 'fresh'
    });
  });
});
```

**Acceptance Criteria**:

- [ ] Returns exactly 'fresh'
- [ ] No errors thrown
- [ ] Verified with spy (no file read attempted)

#### Test 3.2: Detect Update Install

```javascript
it('should detect update when version differs', () => {
  // Given: Manifest v4.36.2, Current v4.39.2
  // When: detectInstallMode called
  // Then: Returns 'update'
});
```

**Acceptance Criteria**:

- [ ] Returns exactly 'update'
- [ ] Version comparison working
- [ ] Both versions parsed correctly

#### Test 3.3: Detect Reinstall

```javascript
it('should detect reinstall when same version', () => {
  // Given: Manifest v4.36.2, Current v4.36.2
  // When: detectInstallMode called
  // Then: Returns 'reinstall'
});
```

**Acceptance Criteria**:

- [ ] Returns exactly 'reinstall'
- [ ] Version comparison accurate
- [ ] Same version detected correctly

#### Test 3.4: Detect Invalid Manifest

```javascript
it('should detect invalid manifest', () => {
  // Given: Corrupted manifest file
  // When: detectInstallMode called
  // Then: Returns 'invalid'
});
```

**Acceptance Criteria**:

- [ ] Returns exactly 'invalid'
- [ ] No crash on corruption
- [ ] Graceful error handling

#### Test 3.5: Version Comparison Edge Cases

```javascript
it('should handle version comparison edge cases', () => {
  // Test cases:
  // - v4.36.2 → v4.36.3 (patch bump) = update
  // - v4.36.2 → v5.0.0 (major bump) = update
  // - v4.36.2 → v4.36.2 (same) = reinstall
  // - v4.36.2 → v4.36.2-beta = different format
});
```

**Acceptance Criteria**:

- [ ] Correct detection for all version patterns
- [ ] Semver rules followed
- [ ] Pre-release versions handled

#### Test 3.6: Logging in Detection

```javascript
it('should log detection results', () => {
  // Given: detectInstallMode called
  // When: Execution completes
  // Then: Debug log shows:
  //   - Mode detected
  //   - Version info
  //   - Decision logic
});
```

**Acceptance Criteria**:

- [ ] Logs helpful debug info
- [ ] No console errors
- [ ] Aids troubleshooting

---

### Test Suite 4: Question Skipping (File: `test/unit/prompt-skipping.test.js`)

#### Test 4.1: Skip Question When Update with Config

```javascript
describe('Question Skipping', () => {
  describe('when isUpdate=true and config exists', () => {
    it('should skip question and return config value', () => {
      // Given: isUpdate=true, config has value
      // When: Prompt function called
      // Then: Returns config value immediately
      //   AND prompt NOT displayed
      //   AND prompt library never called
    });
  });
});
```

**Acceptance Criteria**:

- [ ] Config value returned
- [ ] Prompt library not invoked
- [ ] Verified via spy

#### Test 4.2: Ask Question When Fresh Install

```javascript
it('should ask question on fresh install', () => {
  // Given: isUpdate=false, no prior config
  // When: Prompt function called
  // Then: Prompt displayed
  //   AND User input collected
  //   AND User value returned
});
```

**Acceptance Criteria**:

- [ ] Prompt shown to user
- [ ] Input collected normally
- [ ] Fresh install unaffected

#### Test 4.3: Ask Question When Config Missing

```javascript
it('should ask question if config missing on update', () => {
  // Given: isUpdate=true BUT config missing that field
  // When: Prompt function called
  // Then: Prompt displayed as fallback
  //   AND User input collected
  //   AND New value stored
});
```

**Acceptance Criteria**:

- [ ] Fallback to prompt working
- [ ] No silent failures
- [ ] User can provide value

#### Test 4.4: Log Skipped Questions

```javascript
it('should log when question is skipped', () => {
  // Given: isUpdate=true, config exists
  // When: Prompt function called
  // Then: Debug log shows:
  //   - Question skipped
  //   - Value used
  //   - Source (previous config)
});
```

**Acceptance Criteria**:

- [ ] Debug logs useful
- [ ] Aids troubleshooting
- [ ] Shows what was skipped

#### Test 4.5: Multiple Questions Skipped

```javascript
it('should skip all applicable questions on update', () => {
  // Given: All required config fields present
  // When: All prompt functions called with isUpdate=true
  // Then: All return config values
  //   AND No prompts displayed
  //   AND All log entries created
});
```

**Acceptance Criteria**:

- [ ] Multiple questions skipped
- [ ] Consistent behavior
- [ ] No partial skipping

---

## Integration Tests

### Test Suite 5: Configuration Loading Integration (File: `test/integration/install-config-loading.test.js`)

#### Test 5.1: Load Config During Install Command

```javascript
describe('Install Command Configuration Loading', () => {
  it('should load config after install mode detection', () => {
    // Given: Project with existing manifest
    // When: Install command initialization completes
    // Then: Config loaded and available to handlers
    //   AND No errors during loading
    //   AND Manifest validated
  });
});
```

**Acceptance Criteria**:

- [ ] Config loaded without errors
- [ ] Available to all handlers
- [ ] Validation passed

#### Test 5.2: Config Available to All Setup Functions

```javascript
it('should pass config to all setup functions', () => {
  // Given: Update detected, config loaded
  // When: Setup functions called
  // Then: Each function receives config object
  //   AND Can access values
  //   AND Each function can skip questions
});
```

**Acceptance Criteria**:

- [ ] Config threaded through pipeline
- [ ] All functions receive it
- [ ] Accessible and usable

---

### Test Suite 6: Question Skipping Integration (File: `test/integration/questions-skipped-on-update.test.js`)

#### Test 6.1: No Prompts During Update

```javascript
describe('Update Install Flow', () => {
  it('should not show any config questions on update', () => {
    // Given: Update installation (manifest exists, version bump)
    // When: Install command runs
    // Then: No prompts displayed
    //   AND Process completes quickly
    //   AND Manifest read and used
  });
});
```

**Acceptance Criteria**:

- [ ] Zero prompts shown
- [ ] Fast execution
- [ ] Manifest values used

#### Test 6.2: All Prompts During Fresh Install

```javascript
it('should show all config questions on fresh install', () => {
  // Given: Fresh installation (no manifest)
  // When: Install command runs
  // Then: All questions displayed
  //   AND User can answer
  //   AND Responses stored
});
```

**Acceptance Criteria**:

- [ ] All expected prompts shown
- [ ] Normal flow maintained
- [ ] No regression

#### Test 6.3: Graceful Fallback on Invalid Config

```javascript
it('should ask questions if config invalid on update', () => {
  // Given: Update with invalid/corrupted manifest
  // When: Install command runs
  // Then: Validation fails
  //   AND Falls back to fresh install flow
  //   AND Asks all questions
  //   AND User warned about issue
});
```

**Acceptance Criteria**:

- [ ] Graceful fallback
- [ ] User warned
- [ ] Questions asked
- [ ] No data loss

---

### Test Suite 7: Invalid Manifest Fallback (File: `test/integration/invalid-manifest-fallback.test.js`)

#### Test 7.1: Fallback on Corrupted File

```javascript
describe('Invalid Manifest Handling', () => {
  it('should fallback on corrupted manifest file', () => {
    // Given: Corrupted YAML in manifest
    // When: Install command runs
    // Then: Parse error caught
    //   AND Not thrown
    //   AND Fallback to fresh install
    //   AND User notified
  });
});
```

**Acceptance Criteria**:

- [ ] No crash on corruption
- [ ] Error caught gracefully
- [ ] User feedback provided

#### Test 7.2: Fallback on Missing Required Fields

```javascript
it('should fallback on missing required field', () => {
  // Given: Manifest missing 'version'
  // When: Install command runs
  // Then: Validation fails
  //   AND Treated as fresh install
  //   AND Questions asked
  //   AND Log shows reason
});
```

**Acceptance Criteria**:

- [ ] Missing fields detected
- [ ] Fresh install behavior
- [ ] Helpful logging

#### Test 7.3: No Manifest Corruption

```javascript
it('should never corrupt existing manifest on error', () => {
  // Given: Error during install with existing manifest
  // When: Install command errors
  // Then: Original manifest unchanged
  //   AND File not modified
  //   AND Backup not needed
});
```

**Acceptance Criteria**:

- [ ] Original preserved
- [ ] Read-only during detection
- [ ] Safe error handling

---

### Test Suite 8: Backward Compatibility (File: `test/integration/backward-compatibility.test.js`)

#### Test 8.1: Handle Old Manifest Format

```javascript
describe('Backward Compatibility', () => {
  it('should handle manifest from v4.30.0', () => {
    // Given: Manifest from old version with different format
    // When: Install command runs on update
    // Then: Old format understood
    //   AND Migrated gracefully
    //   AND Questions skipped if possible
    //   AND Asked if field missing
  });
});
```

**Acceptance Criteria**:

- [ ] Old format read without error
- [ ] Fields mapped correctly
- [ ] No data loss

#### Test 8.2: Missing Optional Fields Handled

```javascript
it('should handle manifest without ides_setup', () => {
  // Given: Manifest predating ides_setup field
  // When: Install command runs
  // Then: Default value applied
  //   AND No error thrown
  //   AND Process continues normally
});
```

**Acceptance Criteria**:

- [ ] Default applied
- [ ] No crashes
- [ ] Correct type

#### Test 8.3: Missing expansion_packs Field

```javascript
it('should handle manifest without expansion_packs', () => {
  // Given: Old manifest without expansion_packs
  // When: Install command runs
  // Then: Empty array assumed
  //   AND No error
  //   AND Normal flow continues
});
```

**Acceptance Criteria**:

- [ ] Safe default
- [ ] No errors
- [ ] Backward compatible

#### Test 8.4: Version Comparison Backward Compat

```javascript
it('should handle pre-release version formats', () => {
  // Given: Old manifest with "4.36.2-beta1"
  // When: detectInstallMode runs
  // Then: Correctly parsed
  //   AND Compared to current version
  //   AND Correct mode detected
});
```

**Acceptance Criteria**:

- [ ] Pre-release handled
- [ ] Comparison accurate
- [ ] Mode correct

---

## End-to-End Scenarios

### Scenario 1: Fresh Installation (File: `test/scenarios/e2e-fresh-install.test.js`)

**Setup**: Empty project directory

**Execution Steps**:

1. User runs `npx bmad-method install`
2. System detects no manifest
3. All configuration questions displayed
4. User answers questions
5. Installation proceeds
6. Manifest created with answers

**Expected Results**:

- [ ] All questions displayed
- [ ] Manifest created
- [ ] Manifest valid
- [ ] All settings saved
- [ ] Installation completes

**Test Code Structure**:

```javascript
it('should complete fresh install with all prompts', async () => {
  // Setup: Create temp directory
  // Execute: Run install command
  // Verify: Questions shown
  // Verify: Manifest created
  // Verify: Contents correct
});
```

---

### Scenario 2: Update Installation (File: `test/scenarios/e2e-update-install.test.js`)

**Setup**:

- Project with manifest (v4.36.2)
- Same settings as original install
- Version bumped to v4.39.2

**Execution Steps**:

1. User runs `npx bmad-method install`
2. System detects manifest exists
3. System detects version bump (update)
4. Loads previous configuration
5. NO questions displayed
6. Installation proceeds with cached config
7. Manifest updated with new version

**Expected Results**:

- [ ] No prompts shown
- [ ] Config loaded from manifest
- [ ] Installation uses cached config
- [ ] Version updated in manifest
- [ ] Settings preserved
- [ ] Fast execution (< 30 seconds)

**Test Code Structure**:

```javascript
it('should skip questions on update and preserve config', async () => {
  // Setup: Create manifest v4.36.2
  // Execute: Run install with v4.39.2
  // Verify: No prompts shown
  // Verify: Old config used
  // Verify: Version updated
  // Verify: Settings preserved
});
```

---

### Scenario 3: Reinstall with Same Version (File: `test/scenarios/e2e-reinstall.test.js`)

**Setup**:

- Project with manifest (v4.36.2)
- Same version being installed again

**Execution Steps**:

1. User runs `npx bmad-method install`
2. System detects manifest exists
3. System detects same version (reinstall)
4. Loads configuration
5. Skips questions
6. Reinstalls with same config
7. Manifest timestamp updated

**Expected Results**:

- [ ] No prompts shown
- [ ] Config reused
- [ ] Installation completes
- [ ] Settings unchanged
- [ ] Version unchanged (same)
- [ ] Timestamp updated

**Test Code Structure**:

```javascript
it('should skip questions on reinstall', async () => {
  // Setup: Create manifest v4.36.2
  // Execute: Run install with v4.36.2
  // Verify: No prompts shown
  // Verify: Settings reused
  // Verify: Version unchanged
});
```

---

### Scenario 4: Invalid Manifest Recovery (File: `test/scenarios/e2e-invalid-manifest.test.js`)

**Setup**:

- Project with corrupted manifest
- Invalid YAML or missing required fields

**Execution Steps**:

1. User runs `npx bmad-method install`
2. System detects manifest exists
3. System validates manifest
4. Validation fails
5. Falls back to fresh install flow
6. Questions displayed
7. User answers
8. New valid manifest created

**Expected Results**:

- [ ] Manifest error detected
- [ ] Graceful fallback
- [ ] User warned with message
- [ ] All questions asked
- [ ] New manifest created
- [ ] No data corruption
- [ ] Clear error message in logs

**Test Code Structure**:

```javascript
it('should recover from invalid manifest', async () => {
  // Setup: Create corrupted manifest
  // Execute: Run install command
  // Verify: Error detected
  // Verify: Questions asked
  // Verify: New manifest created
});
```

---

### Scenario 5: IDE Configuration Preservation (File: `test/scenarios/e2e-ide-preservation.test.js`)

**Setup**:

- Manifest with IDE configurations:
  ```yaml
  ides_setup:
    - claude-code
    - cline
  ```

**Execution Steps**:

1. User runs update with existing manifest
2. System loads manifest
3. Skips IDE configuration questions
4. Uses previous IDE selections
5. Installation applies same IDEs

**Expected Results**:

- [ ] IDE list loaded from manifest
- [ ] Same IDEs configured
- [ ] No prompts about IDEs
- [ ] Configurations preserved
- [ ] All IDE files intact

**Test Code Structure**:

```javascript
it('should preserve IDE configurations on update', async () => {
  // Setup: Manifest with 2 IDEs
  // Execute: Run update install
  // Verify: IDEs loaded from manifest
  // Verify: Same IDEs installed
  // Verify: No prompts for IDEs
});
```

---

### Scenario 6: Expansion Packs Preservation (File: `test/scenarios/e2e-expansion-packs.test.js`)

**Setup**:

- Manifest with expansion packs:
  ```yaml
  expansion_packs:
    - bmad-infrastructure-devops
    - custom-pack-1
  ```

**Execution Steps**:

1. User runs update with existing manifest
2. System loads manifest
3. Skips expansion pack questions
4. Uses previous selections
5. Installation applies same packs

**Expected Results**:

- [ ] Pack list loaded from manifest
- [ ] Same packs configured
- [ ] No prompts about packs
- [ ] Configurations preserved
- [ ] All pack files intact

**Test Code Structure**:

```javascript
it('should preserve expansion packs on update', async () => {
  // Setup: Manifest with 2 packs
  // Execute: Run update install
  // Verify: Packs loaded from manifest
  // Verify: Same packs installed
  // Verify: No prompts for packs
});
```

---

## Manual Testing Scenarios

### Manual Test 1: Real Fresh Install

```
Steps:
1. Create new project directory
2. Run: npx bmad-method install
3. Observe: All questions asked
4. Answer: All questions with sample data
5. Verify: Installation completes
6. Verify: install-manifest.yaml created with answers

Success Criteria:
- All questions displayed
- Manifest created and valid
- Answers stored correctly
- Installation successful
```

### Manual Test 2: Real Update Install

```
Steps:
1. Using project from Manual Test 1
2. Update to new version
3. Run: npx bmad-method install
4. Observe: NO questions asked
5. Verify: Old settings used
6. Verify: Version updated in manifest

Success Criteria:
- No configuration questions
- Old settings preserved
- Fast execution (< 30 sec)
- Version updated
- All files intact
```

### Manual Test 3: Verify Settings Preserved

```
Steps:
1. Using project from Manual Test 2
2. Check install-manifest.yaml
3. Verify:
   - Original answers still there
   - Only version/timestamp updated
   - IDEs unchanged
   - Expansion packs unchanged

Success Criteria:
- Settings completely preserved
- Only version/timestamp changed
- File structure intact
- No settings reset
```

### Manual Test 4: Large Manifest Test

```
Steps:
1. Create manifest with many fields
2. Add multiple IDEs (5+)
3. Add multiple packs (5+)
4. Run update install
5. Verify all fields preserved

Success Criteria:
- All fields handled
- No truncation
- Large file size OK
- Fast loading
```

### Manual Test 5: Corrupted Manifest Recovery

```
Steps:
1. Create valid installation
2. Manually corrupt manifest (invalid YAML)
3. Run install command
4. Observe: Error detected
5. Observe: Questions asked
6. Answer questions
7. Verify: New manifest created

Success Criteria:
- Error detected
- Graceful recovery
- Questions asked
- New manifest valid
- No crash
```

### Manual Test 6: Upgrade Scenario

```
Steps:
1. Install old version (v4.30.0 format)
2. Upgrade to current version
3. Run install command
4. Verify: Old manifest understood
5. Verify: No questions asked
6. Verify: Settings preserved

Success Criteria:
- Old format handled
- Backward compatible
- Questions skipped
- Settings preserved
```

### Manual Test 7: Performance Test

```
Steps:
1. Install with all options
2. Run update install 10 times
3. Measure total time
4. Measure per-install time

Success Criteria:
- Total: < 5 minutes
- Per install: < 30 seconds
- Consistent timing
- No slowdown over multiple runs
```

### Manual Test 8: CLI Flags (Future)

```
Steps:
1. Run: bmad install --reconfigure
   Verify: Questions asked despite manifest
2. Run: bmad install --skip-questions
   Verify: No questions, all defaults used
3. Run: bmad install --manifest-path ./custom/path
   Verify: Custom manifest path used

Success Criteria:
- Flags work correctly
- Behavior matches flag intent
- Error handling if flag conflicts
```

---

## Test Execution Strategy

### Phase 1: Unit Tests (Run First)

```bash
npm test -- test/unit/ --verbose
```

Expected: All pass
Time: ~2-3 minutes
Success: 100% coverage of new functions

### Phase 2: Integration Tests

```bash
npm test -- test/integration/ --verbose
```

Expected: All pass
Time: ~3-5 minutes
Success: All workflows tested

### Phase 3: End-to-End Scenarios

```bash
npm test -- test/scenarios/ --verbose
```

Expected: All pass
Time: ~5-10 minutes
Success: Real-world workflows work

### Phase 4: Manual Tests

- Performed by developer
- Using actual CLI commands
- Real project directories
- Time: ~1-2 hours

### Phase 5: Regression Tests (Continuous)

- Run with each commit
- Verify no breaking changes
- Ensure backward compatibility

---

## Test Coverage Goals

| Category          | Target | Current |
| ----------------- | ------ | ------- |
| Unit Tests        | 95%    | TBD     |
| Integration Tests | 90%    | TBD     |
| Edge Cases        | 100%   | TBD     |
| Error Paths       | 100%   | TBD     |
| Backward Compat   | 100%   | TBD     |

---

## Success Criteria

All tests passing AND:

- [ ] No prompts during update
- [ ] Settings preserved from manifest
- [ ] Fresh install unaffected
- [ ] Old manifests handled gracefully
- [ ] Performance acceptable
- [ ] Error messages helpful
- [ ] No data corruption
- [ ] Backward compatible
