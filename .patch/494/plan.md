# GitHub Issue #494 Fix Plan: bmad-master Dependency Resolution Bug

## Issue Summary

The bmad-master agent incorrectly resolves dependency paths due to missing variable interpolation syntax in the IDE-FILE-RESOLUTION documentation. Line 14 shows `Dependencies map to root/type/name` instead of `Dependencies map to {root}/{type}/{name}`, causing the agent to treat "root" as a literal directory name rather than a variable placeholder.

## Root Cause Analysis

- **File**: `bmad-core/agents/bmad-master.md:14`
- **Problem**: Missing curly braces in variable interpolation syntax
- **Current**: `Dependencies map to root/type/name`
- **Expected**: `Dependencies map to {root}/{type}/{name}`
- **Impact**: Agent resolves paths like `bmad/tasks/create-doc.md` instead of `.bmad/tasks/create-doc.md`

## Fix Strategy

### Phase 1: Detection and Analysis

1. **Locate the problematic file** - Find `bmad-core/agents/bmad-master.md`
2. **Identify the exact line** - Line 14 with the incorrect path format
3. **Analyze dependency resolution logic** - Understand how paths are processed
4. **Document current behavior** - Create test cases showing the bug

### Phase 2: Test Development

1. **Create detection tests** - Tests that reproduce the bug
2. **Create validation tests** - Tests that verify the fix works
3. **Create regression tests** - Ensure fix doesn't break other functionality
4. **Test path resolution logic** - Verify variable interpolation works correctly

### Phase 3: Implementation

1. **Fix the documentation** - Add proper curly braces `{root}/{type}/{name}`
2. **Update any related code** - Ensure path resolution logic handles variables correctly
3. **Validate file references** - Check if other files have similar issues
4. **Update examples** - Ensure documentation examples are consistent

### Phase 4: Testing and Validation

1. **Run detection tests** - Confirm they fail before fix, pass after fix
2. **Run validation tests** - Verify correct path resolution
3. **Run regression tests** - Ensure no side effects
4. **Test with real scenarios** - Use actual bmad-master agent tasks

### Phase 5: Deployment

1. **Apply the fix** - Implement the corrected syntax
2. **Verify in different environments** - Test across different IDEs and setups
3. **Document the change** - Update any related documentation
4. **Close the issue** - Confirm resolution and update GitHub issue

## Files to Investigate

- `bmad-core/agents/bmad-master.md` - Primary file with the bug
- Any path resolution utilities or modules
- Test files related to bmad-master agent
- Configuration files that might use similar syntax
- Documentation files with dependency mapping examples

## Success Criteria

1. ✅ Bug is detected and reproduced with tests
2. ✅ Fix corrects variable interpolation syntax
3. ✅ All tests pass after fix implementation
4. ✅ Path resolution works correctly (`{root}` → `.bmad`)
5. ✅ No regression in existing functionality
6. ✅ Agent can successfully locate project dependencies

## Risk Assessment

- **Low Risk**: Documentation fix with minimal code impact
- **Testing Required**: Ensure variable interpolation works across all use cases
- **Compatibility**: Verify fix works with all supported IDEs and models
