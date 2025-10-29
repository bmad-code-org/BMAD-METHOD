# PR #648 Implementation Plan - Fix: Wrong Setup of Cursor Rules

**Date**: October 26, 2025  
**Branch**: `feature/cursor-rule-setup-648`  
**PR**: [#648 - Wrong setup of Cursor rules](https://github.com/bmad-code-org/BMAD-METHOD/pull/648)

---

## 📋 Issue Summary

The Cursor rules setup was incorrectly configured with `description:` and `globs: []` fields that were not being used and causing the rules to not apply automatically.

**Fix**: Changed `alwaysApply` from `true` to `false` and removed the empty `description` and `globs` fields so rules must be manually referenced via `@<agent-name>` in the chat window (similar to Claude Code).

**Files Changed**: 1

- `tools/installer/lib/ide-base-setup.js` (-2 lines)

**Impact**: Minimal - only removes unused fields from Cursor rule template

---

## 🎯 Implementation Strategy

### Phase 1: Setup ✅ COMPLETE

- [x] Create feature branch: `feature/cursor-rule-setup-648`
- [x] Create .patch/648 directory for documentation
- [x] Retrieve PR #648 details from GitHub

### Phase 2: Implementation ✅ COMPLETE

- [x] Read and analyze `tools/installer/lib/ide-base-setup.js`
- [x] Remove line: `content += 'description: \n';`
- [x] Remove line: `content += 'globs: []\n';`
- [x] Verify change is minimal and correct

### Phase 3: Validation ⏳ PENDING

- [ ] Run `npm run validate`
- [ ] Run `npm run lint`
- [ ] Verify no new errors introduced
- [ ] Check file syntax

### Phase 4: Documentation ⏳ PENDING

- [ ] Create comprehensive diff documentation
- [ ] Create test results report
- [ ] Store in .patch/648/

### Phase 5: Commit & Integration ⏳ PENDING

- [ ] Commit changes with proper message
- [ ] Prepare GitHub comment
- [ ] Verify ready for merge

---

## 📝 Todo List

```
PHASE 1: SETUP
  ✅ Create feature branch 'feature/cursor-rule-setup-648'
  ✅ Create .patch/648 directory
  ✅ Fetch PR #648 details

PHASE 2: IMPLEMENTATION
  ✅ Remove 'description: \n' line
  ✅ Remove 'globs: []\n' line
  ✅ Verify changes

PHASE 3: TESTING
  ⏳ Run npm validate
  ⏳ Run npm lint
  ⏳ Check for regressions

PHASE 4: DOCUMENTATION
  ⏳ Create diff file
  ⏳ Create test report
  ⏳ Document findings

PHASE 5: FINALIZATION
  ⏳ Commit with message
  ⏳ Create GitHub comment
  ⏳ Ready for merge
```

---

## 📊 Change Details

### File: `tools/installer/lib/ide-base-setup.js`

**Location**: Lines 189-197 (Cursor MDC format section)

**Before**:

```javascript
if (format === 'mdc') {
  // MDC format for Cursor
  content = '---\n';
  content += 'description: \n';
  content += 'globs: []\n';
  content += 'alwaysApply: false\n';
  content += '---\n\n';
```

**After**:

```javascript
if (format === 'mdc') {
  // MDC format for Cursor
  content = '---\n';
  content += 'alwaysApply: false\n';
  content += '---\n\n';
```

**Changes**:

- Removed: `content += 'description: \n';` (line 192)
- Removed: `content += 'globs: []\n';` (line 193)
- Kept: All other lines including `alwaysApply: false\n`

**Impact**:

- Simplifies Cursor rule template
- Rules now require manual reference via `@<agent-name>`
- More consistent with Claude Code approach
- No functional code impact

---

## 🔍 Rationale

The PR description states:

> "After testing BMAD Method in Cursor rules with the existing setup of the rule I have noticed that it was not actually using the right prompt... The fix was to change to 'Apply Manually' so the rule `@<agent-name>` has to be referenced from the chat window, similar to what you do with Claude Code."

**Why this fix works**:

1. Empty `description:` field was unused
2. Empty `globs: []` field was not filtering files
3. Removing these fields simplifies the template
4. `alwaysApply: false` makes rules manual (matching intended behavior)
5. Users reference agents via `@agent-name` directly

---

## ✅ Validation Plan

### Test 1: File Syntax ✅

- [ ] Read file to verify changes
- [ ] Check for syntax errors
- [ ] Verify formatting

### Test 2: npm validate ⏳

- [ ] Should pass all existing validations
- [ ] No new schema errors
- [ ] No dependency issues

### Test 3: npm lint ⏳

- [ ] Should pass all linting rules
- [ ] No new warnings
- [ ] Code formatting correct

### Test 4: No Regressions ⏳

- [ ] Core agents unaffected
- [ ] Core teams unaffected
- [ ] No conflicts with other code

### Test 5: Logic Verification ⏳

- [ ] Rule generation logic still works
- [ ] Other format options (claude) unaffected
- [ ] Template variables still correct

---

## 📈 Risk Assessment

**Risk Level**: ✅ **MINIMAL**

**Reasons**:

1. Only 2 lines removed from 1 file
2. Removed lines were unused/empty fields
3. Core logic unchanged
4. No API changes
5. No dependency changes
6. Backward compatible

**Impact Areas**:

- Cursor IDE rule generation (IMPROVED)
- No impact on other IDEs
- No impact on agents
- No impact on core system

---

## 🎯 Expected Outcomes

After implementing this fix:

- ✅ Cursor rules template simplified
- ✅ Rules require manual activation via `@agent-name`
- ✅ Consistent with Claude Code behavior
- ✅ No validation errors
- ✅ No lint errors
- ✅ Ready for production

---

## 📚 References

- **PR #648**: https://github.com/bmad-code-org/BMAD-METHOD/pull/648
- **File**: `tools/installer/lib/ide-base-setup.js`
- **Related**: IDE setup configuration for Cursor and other editors
- **Cursor Docs**: https://cursor.com/docs

---

**Status**: ✅ Implementation complete, ready for testing phase
