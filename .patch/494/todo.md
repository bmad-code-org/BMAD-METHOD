# GitHub Issue #494 Todo List: bmad-master Dependency Resolution Bug

## Status: 🚀 Ready to Start

**Priority**: High - Affects all projects using bmad-master agent

---

## 📋 Phase 1: Detection and Analysis

### 🔍 TODO-001: Locate and Analyze the Problematic File

- [ ] **Find bmad-core/agents/bmad-master.md file**
  - Search for the file in the repository
  - Confirm it exists and is the correct file
- [ ] **Examine line 14 specifically**
  - Locate the dependency mapping documentation
  - Confirm the syntax `Dependencies map to root/type/name`
- [ ] **Document current behavior**
  - Take screenshot/copy of current incorrect syntax
  - Note any other similar issues in the same file

### 🔍 TODO-002: Search for Related Path Resolution Logic

- [ ] **Find path resolution utilities**
  - Search codebase for files that process dependency paths
  - Look for variable interpolation logic (`{root}`, `{type}`, `{name}`)
- [ ] **Identify similar patterns**
  - Search for other occurrences of `root/type/name` syntax
  - Check if other agent files have similar issues
- [ ] **Map dependency flow**
  - Understand how bmad-master processes dependencies
  - Document the path resolution workflow

---

## 🧪 Phase 2: Test Development

### 🧪 TODO-003: Create Detection Tests

- [ ] **Build path resolution test**
  - Create test that reproduces the bug
  - Test should show paths resolve to `bmad/tasks/` instead of `.bmad/tasks/`
- [ ] **Create bmad-master agent test**
  - Test agent's dependency loading functionality
  - Verify it fails to find files in correct location
- [ ] **Document expected vs actual behavior**
  - Test should clearly show the difference
  - Include specific file paths that fail

### 🧪 TODO-004: Create Validation Tests

- [ ] **Build corrected path resolution test**
  - Test that verifies `{root}/{type}/{name}` works correctly
  - Should resolve to proper `.bmad/` directory structure
- [ ] **Create integration test**
  - Test full bmad-master workflow with correct paths
  - Verify agent can load core-config.yaml and dependencies
- [ ] **Test variable interpolation**
  - Verify `{root}` resolves to actual project root
  - Test `{type}` and `{name}` substitution

### 🧪 TODO-005: Create Regression Tests

- [ ] **Test existing functionality**
  - Ensure fix doesn't break other agent features
  - Test non-dependency-related bmad-master functions
- [ ] **Cross-agent compatibility**
  - Verify fix doesn't affect other agents
  - Test agents that might use similar syntax

---

## 🔧 Phase 3: Implementation

### 🔧 TODO-006: Apply the Documentation Fix

- [ ] **Update bmad-master.md line 14**
  - Change `Dependencies map to root/type/name`
  - To `Dependencies map to {root}/{type}/{name}`
- [ ] **Verify syntax consistency**
  - Check entire file for other instances
  - Ensure all path references use proper variable syntax

### 🔧 TODO-007: Update Related Code (if needed)

- [ ] **Check path resolution logic**
  - Verify code properly handles `{variable}` syntax
  - Update if code expects literal `root/type/name`
- [ ] **Update examples and documentation**
  - Fix any code examples in documentation
  - Update README or other reference materials

### 🔧 TODO-008: Validate File References

- [ ] **Search entire codebase**
  - Find any other files with `root/type/name` pattern
  - Update to use proper `{root}/{type}/{name}` syntax
- [ ] **Check configuration files**
  - Verify config files use correct variable syntax
  - Update any hardcoded path patterns

---

## ✅ Phase 4: Testing and Validation

### ✅ TODO-009: Run Detection Tests

- [ ] **Execute bug reproduction tests**
  - Run tests that should fail with current code
  - Document test failures showing the bug
- [ ] **Verify test accuracy**
  - Confirm tests actually reproduce the reported issue
  - Check that failures match GitHub issue description

### ✅ TODO-010: Run Fix Validation Tests

- [ ] **Execute corrected path tests**
  - Run tests with the fix applied
  - Verify all tests now pass
- [ ] **Test real-world scenarios**
  - Use actual bmad-master agent tasks
  - Verify agent can find and load dependencies
- [ ] **Test different environments**
  - Test across different IDE implementations
  - Verify fix works with various project structures

### ✅ TODO-011: Run Regression Tests

- [ ] **Execute full test suite**
  - Run all existing tests to ensure no breakage
  - Pay special attention to path-related functionality
- [ ] **Test other agents**
  - Verify other agents still work correctly
  - Check for any unexpected side effects

---

## 🚀 Phase 5: Deployment

### 🚀 TODO-012: Apply and Validate Fix

- [ ] **Implement final fix**
  - Apply all necessary changes
  - Double-check all modified files
- [ ] **Final validation**
  - Run complete test suite one more time
  - Test manually with bmad-master agent
- [ ] **Document changes**
  - Update CHANGELOG if applicable
  - Note fix in commit message

### 🚀 TODO-013: Verify Resolution

- [ ] **Confirm bug is fixed**
  - Test original reproduction steps
  - Verify they now work correctly
- [ ] **Update GitHub issue**
  - Comment with fix details and test results
  - Close issue when confirmed resolved
- [ ] **Consider additional improvements**
  - Look for similar issues in codebase
  - Suggest preventive measures for future

---

## 📊 Progress Tracking

**Total Tasks**: 13 major todos with multiple subtasks each  
**Estimated Time**: 4-6 hours  
**Priority Order**: TODO-001 → TODO-002 → TODO-003 → TODO-006 → TODO-009 → TODO-010

**Next Action**: Start with TODO-001 to locate and analyze the problematic file.

---

## 🎯 Success Metrics

- [ ] All detection tests fail before fix, pass after fix
- [ ] bmad-master agent successfully loads dependencies
- [ ] Paths resolve correctly to `.bmad/` directory structure
- [ ] No regression in existing functionality
- [ ] GitHub issue #494 can be closed as resolved
