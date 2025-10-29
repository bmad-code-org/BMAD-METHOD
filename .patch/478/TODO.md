# TODO List: Issue #478 - Fix Status Command Installation Detection

## Project: Fix v6 for #478 - No BMad installation found in current directory tree

**Status**: Not Started
**Priority**: High
**Issue URL**: https://github.com/bmad-code-org/BMAD-METHOD/issues/478

---

## PHASE 1: ISSUE DETECTION & ANALYSIS

**Goal**: Understand the root cause and current behavior

### Task 1.1: Locate Key Source Files

- [ ] Find `findInstallation()` function location
  - Check: `tools/cli/lib/detector.js`
  - Check: `tools/cli/installers/lib/core/detector.js`
  - Check: `tools/cli/commands/status.js`
- [ ] Document function signature and parameters
- [ ] Identify where `originalCwd` is available

### Task 1.2: Understand Current Implementation

- [ ] Review how status command invokes findInstallation()
- [ ] Check if originalCwd is being captured anywhere
- [ ] Review how `.bmad-*` folders are searched
- [ ] Identify the working directory at each step
- [ ] Document current flow in detection report

### Task 1.3: Create Detection Report

- [ ] Document current behavior (bug reproduction)
- [ ] Show code snippets of problematic areas
- [ ] Explain why bug occurs (cwd vs originalCwd mismatch)
- [ ] Propose initial fix approach
- [ ] **Deliverable**: `DETECTION-REPORT.md`

**Time Estimate**: 45-60 minutes
**Difficulty**: Low
**Owner**: TBD

---

## PHASE 2: CREATE DETECTION TESTS

**Goal**: Create tests that reproduce the bug and identify exact failure points

### Task 2.1: Create Unit Tests for findInstallation()

**File**: `test/unit/find-installation.test.js` (NEW)

- [ ] Test suite: "findInstallation() with originalCwd"
  - [ ] Should find `.bmad-core/` in current directory
  - [ ] Should find `.bmad-core/` in parent directory
  - [ ] Should NOT find installation when it doesn't exist
  - [ ] Should find closest installation in directory tree
  - [ ] Should respect originalCwd parameter over process.cwd()

- [ ] Test suite: "findInstallation() directory search behavior"
  - [ ] Verify search starts from originalCwd
  - [ ] Verify search traverses up directory tree
  - [ ] Verify hidden folders are detected
  - [ ] Verify multiple installations pick closest one
  - [ ] Verify returns null when no installation found

- [ ] Test suite: "findInstallation() with mocked filesystem"
  - [ ] Mock different project structures
  - [ ] Test with nested BMAD installations
  - [ ] Test with various folder names (`.bmad-`, `.bmad-core`, etc.)

**Time Estimate**: 60-75 minutes
**Difficulty**: Medium

### Task 2.2: Create Integration Tests for Status Command

**File**: `test/integration/status-command-detection.test.js` (NEW)

- [ ] Test suite: "Status command in project with BMAD installation"
  - [ ] Create fixture: project with `.bmad-core/` folder
  - [ ] Run status command, verify it detects installation
  - [ ] Run status from subdirectory, verify detection
  - [ ] Run status via npx, verify detection

- [ ] Test suite: "Status command current directory handling"
  - [ ] Test from project root
  - [ ] Test from nested subdirectory
  - [ ] Test from sibling directory
  - [ ] Test with symlinked folders

**Time Estimate**: 45-60 minutes
**Difficulty**: Medium

### Task 2.3: Create Test Fixtures

**Folder**: `test/fixtures/bmad-project-478/`

- [ ] Create project structure:
  ```
  test/fixtures/bmad-project-478/
  ├── .bmad-core/
  │   ├── config.yaml
  │   └── agents/
  ├── src/
  │   └── index.js
  └── package.json
  ```
- [ ] Create nested subdirectory structure for testing
- [ ] Create multiple installations for edge case testing

**Time Estimate**: 15-20 minutes
**Difficulty**: Low

**Cumulative Time**: ~2-2.5 hours
**Milestone**: Tests that fail and demonstrate the bug

---

## PHASE 3: IMPLEMENT THE FIX

**Goal**: Fix the root cause - ensure originalCwd is properly used

### Task 3.1: Analyze Current findInstallation() Implementation

- [ ] Read full implementation of findInstallation()
- [ ] Identify all places using process.cwd()
- [ ] Check function call signature
- [ ] Verify parameter handling
- [ ] Document analysis in code comments

### Task 3.2: Update findInstallation() Function

**File**: `tools/cli/lib/detector.js` (or identified location)

- [ ] Modify function signature to require `originalCwd` parameter
- [ ] Replace `process.cwd()` with `originalCwd` in search logic
- [ ] Ensure path.resolve() uses originalCwd as base
- [ ] Add JSDoc comments explaining originalCwd parameter
- [ ] Validate path resolution on Windows and Unix

**Code Change Checklist**:

- [ ] Function accepts originalCwd parameter
- [ ] Search logic uses originalCwd
- [ ] Relative paths resolved from originalCwd
- [ ] Path normalization handled correctly
- [ ] Backward compatibility considered

### Task 3.3: Update Status Command

**File**: `tools/cli/commands/status.js` (or identified location)

- [ ] Capture originalCwd at command entry point
- [ ] Pass originalCwd to findInstallation()
- [ ] Verify all callers of findInstallation() are updated
- [ ] Add error handling for missing originalCwd

### Task 3.4: Review All Callers

- [ ] Find all places where findInstallation() is called
- [ ] Update each caller to pass originalCwd
- [ ] Ensure originalCwd is available at each call site
- [ ] Add comments explaining the parameter

### Task 3.5: Code Review & Testing

- [ ] Run linting on modified files
- [ ] Run formatting check
- [ ] Verify syntax correctness
- [ ] Check for any new linting violations

**Time Estimate**: 45-60 minutes
**Difficulty**: Low-Medium

**Cumulative Time**: ~2.5-3.5 hours
**Milestone**: Fix implemented and linted

---

## PHASE 4: VALIDATION TESTS

**Goal**: Create comprehensive tests to verify the fix works

### Task 4.1: Enhance Existing Tests

- [ ] Update/enhance any existing detection tests
- [ ] Ensure tests pass with the fix in place
- [ ] Add comments explaining what each test validates

### Task 4.2: Create Fix Validation Test Suite

**File**: `test/integration/status-fix-validation.test.js` (NEW)

- [ ] Test suite: "Status command AFTER fix"
  - [ ] Verify status detects `.bmad-core/` correctly
  - [ ] Verify status works via npx
  - [ ] Verify status works from subdirectories
  - [ ] Verify status output is correct
  - [ ] Verify error handling when no installation

- [ ] Test suite: "Status command with originalCwd"
  - [ ] Test with explicit originalCwd parameter
  - [ ] Test with different originalCwd vs process.cwd()
  - [ ] Verify correct installation is found

**Time Estimate**: 60-75 minutes
**Difficulty**: Medium

### Task 4.3: Regression Test Suite

**File**: Add to `test/integration/regression-tests.test.js` (NEW or existing)

- [ ] Test that other commands still work:
  - [ ] `npx bmad-method install`
  - [ ] `npx bmad-method list`
  - [ ] `npx bmad-method status` (various scenarios)
- [ ] Verify no changes to existing command behavior
- [ ] Ensure performance not degraded

**Time Estimate**: 45-60 minutes
**Difficulty**: Medium

**Cumulative Time**: ~3.5-4.5 hours
**Milestone**: All validation tests created and passing

---

## PHASE 5: EXECUTION & VALIDATION

**Goal**: Run full test suite and verify everything works

### Task 5.1: Run Unit Tests

```bash
npm test -- test/unit/find-installation.test.js
```

- [ ] All tests pass
- [ ] No errors or warnings
- [ ] Test coverage adequate (80%+)

**Time**: 10-15 minutes

### Task 5.2: Run Integration Tests

```bash
npm test -- test/integration/status-command-detection.test.js
npm test -- test/integration/status-fix-validation.test.js
```

- [ ] All tests pass
- [ ] Status command works correctly
- [ ] originalCwd handling verified

**Time**: 10-15 minutes

### Task 5.3: Run Full Test Suite

```bash
npm test
```

- [ ] All tests pass
- [ ] No regressions
- [ ] 0 failures

**Time**: 15-20 minutes

### Task 5.4: Linting & Formatting

```bash
npm run lint
npm run format:check
```

- [ ] 0 linting errors
- [ ] All files properly formatted

**Time**: 5-10 minutes

### Task 5.5: Schema Validation

```bash
npm run validate:schemas
```

- [ ] All schemas valid
- [ ] No validation errors

**Time**: 5 minutes

### Task 5.6: Manual Testing

- [ ] Create test project directory
- [ ] Create `.bmad-core/` folder manually
- [ ] Run `npx bmad-method status`
- [ ] Verify output shows installation found
- [ ] Test from subdirectory
- [ ] Test from different directory levels

**Time**: 20-30 minutes

### Task 5.7: Documentation Updates

- [ ] Update issue #478 with fix description
- [ ] Add comments to modified code
- [ ] Create COMPLETION-REPORT.md
- [ ] Document any breaking changes (if any)

**Time**: 15-20 minutes

**Cumulative Time**: ~1.5-2 hours
**Milestone**: All validation complete, issue resolved

---

## SUMMARY CHECKLIST

### Before Starting

- [ ] Branch created: `fix/478-status-detection`
- [ ] Issue #478 assigned
- [ ] Team notified of work start

### Phase 1: Analysis

- [ ] ✓ Key files identified
- [ ] ✓ Root cause understood
- [ ] ✓ Detection report created

### Phase 2: Testing (Bug Reproduction)

- [ ] ✓ Unit tests created (currently failing)
- [ ] ✓ Integration tests created (currently failing)
- [ ] ✓ Test fixtures created
- [ ] ✓ Bug verified via tests

### Phase 3: Fix Implementation

- [ ] ✓ findInstallation() updated
- [ ] ✓ Status command updated
- [ ] ✓ All callers updated
- [ ] ✓ Code linted
- [ ] ✓ Formatted correctly

### Phase 4: Fix Validation

- [ ] ✓ Unit tests now pass
- [ ] ✓ Integration tests now pass
- [ ] ✓ Regression tests pass
- [ ] ✓ All validation tests pass

### Phase 5: Final Verification

- [ ] ✓ Full test suite passes
- [ ] ✓ Linting clean
- [ ] ✓ No formatting issues
- [ ] ✓ Schema validation passes
- [ ] ✓ Manual testing successful

### After Completion

- [ ] Code review completed
- [ ] PR created and merged
- [ ] Issue #478 closed
- [ ] Release notes updated

---

## TOTAL ESTIMATED TIME: 6-8 hours

| Phase                | Time      | Status          |
| -------------------- | --------- | --------------- |
| Detection & Analysis | 1-1.5h    | Not Started     |
| Create Tests         | 2-2.5h    | Not Started     |
| Implement Fix        | 1-1.5h    | Not Started     |
| Validation Tests     | 1.5-2h    | Not Started     |
| Execute & Validate   | 1.5-2h    | Not Started     |
| **TOTAL**            | **~7-9h** | **Not Started** |

---

## PRIORITY TASKS (Do First)

1. **URGENT**: Locate and understand findInstallation() function
2. **HIGH**: Create detection tests that fail (proves bug)
3. **HIGH**: Implement fix to make tests pass
4. **MEDIUM**: Add validation tests
5. **MEDIUM**: Run full test suite

---

## DECISION LOG

- [ ] Confirmed: Use originalCwd parameter approach
- [ ] Confirmed: No breaking changes to API
- [ ] Pending: Approve implementation approach

---

**Created**: 2025-10-26
**Last Updated**: 2025-10-26
**Status**: Ready to begin Phase 1
