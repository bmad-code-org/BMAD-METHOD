# Issue #477 - Complete Planning Package

## Executive Summary

This package contains comprehensive documentation for fixing issue #477: **"Installer asks configuration questions during update instead of using existing settings"**

**Current Status**: Planning Phase Complete
**Branch**: `fix/477-installer-update-config`
**Estimated Effort**: 20 hours
**Current Date**: 2025-01-15

---

## Quick Navigation

1. **[IMPLEMENTATION-PLAN.md](./IMPLEMENTATION-PLAN.md)** - Detailed 7-phase implementation roadmap
2. **[TODO.md](./TODO.md)** - Actionable task list with priorities and dependencies
3. **[TEST-SPECIFICATIONS.md](./TEST-SPECIFICATIONS.md)** - Comprehensive test strategy
4. **[issue-desc-477.md](./issue-desc-477.md)** - Original issue context from GitHub

---

## Problem Statement

### What's Wrong

When users run `npx bmad-method install` on an existing installation with a different version, the installer asks all configuration questions again instead of using the settings stored in `install-manifest.yaml`.

### Example

```bash
# First installation (Fresh Install)
$ npx bmad-method install
? Will the PRD be sharded? (Y/n) Y
? Will the Architecture be sharded? (Y/n) Y
? Document Organization Settings? (Y/n) Y
[...installation proceeds...]
✓ Installation complete

# Later: New version released (v4.36.2 → v4.39.2)
$ npx bmad-method install
? Will the PRD be sharded? (Y/n) Y        ← SHOULD NOT ASK!
? Will the Architecture be sharded? (Y/n) Y  ← SHOULD NOT ASK!
? Document Organization Settings? (Y/n) Y   ← SHOULD NOT ASK!
[...should reuse answers from first install...]
```

### Root Cause

- The installer doesn't load the existing `install-manifest.yaml` file
- Update detection logic is missing or not functional
- No mechanism to pass cached config to question prompts
- Questions are asked unconditionally for all installations

### Impact

- **Frustration**: Users have to re-answer questions they answered before
- **Inconsistency**: Contradicts documented behavior (update should be idempotent)
- **Risk**: Users might answer differently and create inconsistent configurations
- **Time**: Wastes user time on every update

---

## Solution Overview

### 5-Component Architecture

1. **Configuration Loader**
   - Reads `install-manifest.yaml`
   - Parses YAML safely with error handling
   - Caches configuration in memory
   - Gracefully handles missing/corrupted files

2. **Update Detection System**
   - Detects fresh install (no manifest → ask questions)
   - Detects update (manifest exists, different version → skip questions)
   - Detects reinstall (manifest exists, same version → skip questions)
   - Handles invalid/corrupted manifest → ask questions

3. **Question Skipping Logic**
   - Adds `isUpdate` flag to all prompt functions
   - Checks if configuration exists before prompting
   - Returns cached value if available
   - Falls back to prompting if needed

4. **Manifest Validation**
   - Validates manifest structure and fields
   - Ensures data integrity
   - Provides helpful error messages
   - Enables graceful fallback on errors

5. **Backward Compatibility**
   - Handles old manifest formats
   - Gracefully handles missing optional fields
   - Works with existing installations
   - No breaking changes

---

## Key Files to Modify

| File                                                | Type   | Changes                                           | Priority  |
| --------------------------------------------------- | ------ | ------------------------------------------------- | --------- |
| `tools/cli/commands/install.js`                     | Modify | Add update detection, config loading, integration | 🔴 HIGH   |
| `tools/cli/lib/config.js`                           | Modify | Add manifest loading methods                      | 🔴 HIGH   |
| `tools/cli/installers/lib/core/installer.js`        | Modify | Add detectInstallMode() method                    | 🔴 HIGH   |
| `tools/cli/installers/lib/core/manifest.js`         | Modify | Add validation logic                              | 🟡 MEDIUM |
| All prompt functions in `tools/cli/installers/lib/` | Modify | Add isUpdate flag and config params               | 🔴 HIGH   |
| `tools/cli/lib/config-loader.js`                    | Create | New configuration loader class                    | 🟡 MEDIUM |

---

## Implementation Phases

### Phase 1: Code Analysis (2 hours)

- Examine installer entry point
- Map all configuration questions
- Understand current manifest usage
- **Dependency**: None

### Phase 2: Configuration Loading (3 hours)

- Create configuration loader utility
- Update manifest schema with validation
- **Dependency**: Phase 1

### Phase 3: Update Detection (3 hours)

- Create update mode detector
- Integrate config loading into install command
- **Dependency**: Phase 2

### Phase 4: Question Skipping (4 hours)

- Map all question calls
- Add isUpdate parameter to functions
- Update install command to pass flags
- **Dependency**: Phase 3

### Phase 5: Manifest Validation (2 hours)

- Implement validation logic
- Add fallback logic for errors
- **Dependency**: Phase 2

### Phase 6: Integration & Testing (4 hours)

- Create comprehensive test suite
- Perform manual testing
- Test backward compatibility
- **Dependency**: Phase 5

### Phase 7: Documentation & Release (2 hours)

- Update README documentation
- Add code comments
- Create migration guide
- **Dependency**: Phase 6

---

## Success Criteria

All of these must be met for the fix to be considered complete:

- [ ] No configuration questions asked during update
- [ ] Existing settings preserved from `install-manifest.yaml`
- [ ] Version detection still works (shows update available)
- [ ] Files properly updated without re-asking questions
- [ ] All IDE configurations preserved
- [ ] All expansion packs preserved
- [ ] Backward compatible with existing installations
- [ ] Graceful fallback on corrupted manifest
- [ ] Comprehensive test coverage (unit + integration + e2e)
- [ ] No performance degradation
- [ ] Clear error messages when issues occur
- [ ] Documentation updated

---

## Testing Strategy

### Test Coverage by Category

**Unit Tests** (12 tests)

- Configuration loader (4 tests)
- Manifest validation (4 tests)
- Update detection (2 tests)
- Question skipping (2 tests)

**Integration Tests** (8 tests)

- Config loading integration (2 tests)
- Question skipping integration (2 tests)
- Invalid manifest handling (2 tests)
- Backward compatibility (2 tests)

**End-to-End Scenarios** (6 scenarios)

- Fresh install
- Update install
- Reinstall
- Invalid manifest recovery
- IDE configuration preservation
- Expansion packs preservation

**Manual Tests** (8 scenarios)

- Real fresh install
- Real update install
- Settings preservation verification
- Large manifest handling
- Corrupted manifest recovery
- Upgrade from old version
- Performance testing
- CLI flag testing (future)

---

## Task Breakdown

### High Priority Tasks (Critical Path)

1. **Examine Install Command** (2h)
   - Read `tools/cli/commands/install.js` completely
   - Document how manifest path is determined
   - Find where questions are first asked

2. **Create Configuration Loader** (3h)
   - Create `tools/cli/lib/config-loader.js`
   - Implement manifest loading with error handling
   - Add caching mechanism

3. **Create Update Mode Detector** (3h)
   - Add `detectInstallMode()` method
   - Implement version comparison logic
   - Add comprehensive logging

4. **Integrate Config Loading** (2h)
   - Modify install command
   - Pass config to all handlers
   - Add debug logging

5. **Add Question Skipping** (4h)
   - Modify all prompt functions
   - Add isUpdate and config parameters
   - Implement skip logic

### Supporting Tasks

6. **Implement Manifest Validation** (2h)
7. **Create Comprehensive Tests** (4h)
8. **Manual Testing** (2h)
9. **Documentation Updates** (2h)
10. **Pull Request Creation** (1h)

---

## Risk Mitigation

| Risk                     | Likelihood | Severity | Mitigation                                         |
| ------------------------ | ---------- | -------- | -------------------------------------------------- |
| Break existing workflows | Low        | High     | Comprehensive backward compat tests before release |
| Manifest corruption      | Low        | Critical | Validation logic, read-only during detection       |
| Performance impact       | Very Low   | Medium   | Caching strategy, lazy loading, performance tests  |
| User confusion           | Medium     | Medium   | Clear error messages, updated documentation        |
| Missing config cases     | Medium     | Medium   | Exhaustive test scenarios covering all cases       |

---

## Timeline & Effort Estimate

```
Phase 1: Analysis          2 hours  |████                    |
Phase 2: Config Loading    3 hours  |██████                  |
Phase 3: Update Detection  3 hours  |██████                  |
Phase 4: Question Skipping 4 hours  |████████                |
Phase 5: Validation        2 hours  |████                    |
Phase 6: Testing           4 hours  |████████                |
Phase 7: Documentation     2 hours  |████                    |
─────────────────────────────────────────────────────────────
TOTAL:                    20 hours  |████████████████████    |
```

**Recommended Approach**:

- Sprints of 2-4 hours each
- Focus on one phase per session
- Test immediately after each phase
- Commit after each phase

---

## Getting Started

### Next Steps

1. **Open TODO.md**
   - Start with Phase 1, Task 1.1
   - Follow checkboxes in order
   - Mark items complete as you go

2. **Refer to IMPLEMENTATION-PLAN.md**
   - Detailed guidance for each phase
   - Files to modify and code structure
   - Expected outcomes for each task

3. **Use TEST-SPECIFICATIONS.md**
   - Create tests before implementing
   - Follow TDD approach
   - Use test scenarios as acceptance criteria

4. **Maintain this Branch**
   - All work in `fix/477-installer-update-config`
   - Commit after each phase
   - Push when phase complete

### Useful Commands

```bash
# Check current branch
git branch --show-current

# View changes made
git status

# View specific changes
git diff tools/cli/commands/install.js

# Run tests
npm test -- test/unit/ --verbose

# Create commit for phase
git commit -m "feat(#477): Phase X - [phase-name]"

# Push to remote
git push origin fix/477-installer-update-config
```

---

## Files in This Package

```
.patch/477/
├── README.md                      ← This file
├── IMPLEMENTATION-PLAN.md         ← Detailed 7-phase roadmap
├── TODO.md                        ← Actionable task list
├── TEST-SPECIFICATIONS.md         ← Comprehensive test strategy
├── issue-desc-477.md              ← Original GitHub issue context
└── PLAN.md                        ← Original outline (superseded by above)
```

---

## Contact & Questions

If you have questions about:

- **Implementation details**: See IMPLEMENTATION-PLAN.md
- **Task breakdown**: See TODO.md
- **Testing approach**: See TEST-SPECIFICATIONS.md
- **Issue context**: See issue-desc-477.md

---

## Conclusion

This is a straightforward fix with a well-defined scope and clear success criteria. The systematic approach (Phase 1-7) ensures thorough implementation with minimal risk of breaking existing functionality. Comprehensive testing and backward compatibility validation provide confidence in the solution.

**Status**: Ready to begin Phase 1: Code Analysis

**Start Time**: [When you begin implementation]
**Estimated Completion**: [When you finish all phases]
