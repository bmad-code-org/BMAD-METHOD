# Learn-WDS Course Structure Audit

**Date:** 2025-12-31  
**Status:** Issues Identified - Needs Major Cleanup

---

## Critical Issues Found

### 1. Module Numbering Conflicts

**Module 04 appears TWICE:**
- `module-04-product-brief/` (Phase 1: Project Brief)
- Listed in overview as "Module 04: Identify Target Groups" (Phase 2)

**Actual folders don't match overview listing:**
- Overview lists: Module 04-12
- Folders show: module-01 through module-12, but with gaps and conflicts

### 2. Massive Duplication in Module 02

**Module 02 has multiple duplicate lesson folders:**
- `lesson-01-git-setup/`
- `lesson-01-github-and-ide-setup/`
- `lesson-01-setting-up-github/`
- `lesson-02-git-configuration/`
- `lesson-02-ide-installation/`
- `lesson-02-install-ide/`
- `lesson-03-git-cloning/`
- `lesson-03-git-setup/`
- `lesson-04-clone-and-wds/`
- `lesson-04-wds-initialization/`
- `lesson-05-initiate-mimir/`

**Looks like:** Multiple attempts at organizing the same content, never cleaned up.

### 3. Inconsistent Folder Structure

**Some modules have structure:**
- module-01: Has lessons + overview ✅
- module-02: Has lessons + overview (but duplicated) ⚠️
- module-03: Has lessons + overview ✅

**Some modules only have tutorial:**
- module-04: Only `tutorial-04.md`
- module-05: Only `tutorial-04.md` (wrong number!)
- module-06: Only `tutorial-06.md`
- module-08: Only `tutorial-08.md`
- module-09: Only `tutorial-09.md`
- module-10: Only `tutorial-10.md`
- module-12: Only `tutorial-12.md`

**Missing modules:**
- module-07: Doesn't exist
- module-11: Doesn't exist

### 4. Missing VTC Integration

**Course doesn't mention:**
- VTC creation in Module 04 (Product Brief)
- VTC workshop in scenario initialization

---

## Recommended Actions

### Immediate (Critical):

1. **Fix Module Numbering**
   - Rename folders to match correct phase structure
   - Update course overview to match actual folders

2. **Clean Module 02 Duplicates**
   - Identify canonical lesson structure
   - Delete duplicate folders
   - Keep only one clear path

3. **Complete Missing Modules**
   - Add lesson content to modules 04-12
   - Or mark as "Tutorial Only" if intended

4. **Add VTC to Course**
   - Module 04: Add VTC creation step
   - Module on Scenario Init: Add VTC workshop

### Longer Term (Enhancement):

5. **Standardize Module Structure**
   - Every module should have:
     - `module-XX-overview.md`
     - `lesson-XX-YYY.md` files
     - `tutorial-XX.md` (if practical module)

6. **Cross-Reference Verification**
   - Check all links in course overview
   - Verify tutorial paths
   - Update any broken references

---

## Impact Assessment

**Current State:**
- ❌ Course structure is confusing
- ❌ Major duplications waste space
- ❌ Module numbering doesn't match content
- ❌ Missing key content (VTC)
- ⚠️ Some modules incomplete

**Estimated Cleanup Time:** 4-6 hours

**Priority:** HIGH - Course is user-facing educational content

---

## Decision Point

**Options:**

**A) Full Cleanup Now**
- Pros: Course becomes usable, consistent
- Cons: Takes 4-6 hours
- When: If course is active/being used

**B) Document & Defer**
- Pros: Move forward with other audits
- Cons: Course remains messy
- When: If course is not yet active

**C) Partial Cleanup**
- Fix: Module numbering, obvious duplicates
- Defer: Content completion
- Time: 1-2 hours

---

**Recommendation:** Option C (Partial Cleanup) - fix structural issues, defer content completion.

*Audit complete - awaiting decision*

