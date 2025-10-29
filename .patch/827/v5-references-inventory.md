# v5 References Inventory - Current v6-alpha Branch

**Analysis Date:** 2025-01-22  
**Branch:** v6-alpha  
**Total References:** 443  
**Unique Files:** 44

---

## Summary Statistics

### By File Type

- **Markdown (.md):** 432 references (97.5%)
- **JavaScript (.js):** 9 references (2.0%)
- **YAML (.yaml):** 2 references (0.5%)

### Distribution

- **High Concentration:** A few files have many v5 references
- **Patterns:** Primarily in convert-legacy workflow documentation
- **File Count:** Only 44 files contain v5 references (vs PR's 658 files)

---

## Critical Observations

### 1. PR #827 Scope vs Current State

**PR #827 (October 2025):**

- Files changed: 658
- Approach: Comprehensive automated v5→v6 replacement

**Current v6-alpha (January 2025):**

- Files with v5: 44
- References: 443
- Status: Many new/changed files since PR was created

### 2. Key Discrepancy

The fact that current v6-alpha has only 44 files with v5 references, while PR #827 touched 658 files, suggests:

**Possibility A:** PR #827 was already merged partially

- Some files were fixed in other PRs
- Current v5 refs are from new files added since PR

**Possibility B:** PR #827 made changes beyond just v5→v6

- Touched many files without v5 references
- Possibly formatted or reorganized files

**Possibility C:** Current v6-alpha has evolved significantly

- Files renamed, moved, or deleted
- Many of PR's 658 files no longer exist

---

## File-by-File Categorization

### Type A: KEEP (Intentional Version Markers)

These v5 references should NOT be changed - they are historical markers or intentional version indicators.

#### CHANGELOG.md

- **Count:** 2 references
- **Context:** `## [v5.0.0] - SKIPPED` and `expansion packs from v5 to modules in v5`
- **Reason:** Version history documentation
- **Action:** KEEP AS-IS

---

### Type B: FIX (Documentation Needing v6 Update)

These v5 references are documentation that should say v6 to match current version.

#### Convert-Legacy Workflow Documentation

**Primary Files (High Concentration):**

1. **src/modules/bmb/workflows/convert-legacy/README.md**
   - Estimated references: 25+
   - Patterns: "v5 compliant", "v5 architecture", "v5 conventions"
   - Action: Replace all with v6

2. **src/modules/bmb/workflows/convert-legacy/instructions.md**
   - Estimated references: 40+
   - Patterns: "v4 to v5 conversion", "v5 equivalents", "v5 format"
   - Action: Replace all with v6

3. **src/modules/bmb/workflows/convert-legacy/checklist.md**
   - Estimated references: 12+
   - Patterns: "v5 Compliance", "v5 structure", "v5 patterns"
   - Action: Replace all with v6

4. **bmad/bmb/workflows/convert-legacy/\*** (Mirror of src/)
   - Same files, likely identical content
   - Action: Replace all with v6 (may be build artifact)

#### Module Footers

**Files with "Part of the BMad Method v5" footers:**

- bmad/bmb/workflows/module-brief/README.md
- bmad/bmb/workflows/create-workflow/README.md
- bmad/core/workflows/brainstorming/README.md
- src/ mirrors of the above

**Action:** Replace with "Part of the BMad Method v6"

#### Other Documentation Files

**Pending detailed review** - Need to examine each file's context:

- Module READMEs
- Workflow instructions
- Agent configurations

---

### Type C: ALREADY FIXED (May be in PR but not in current base)

Files that PR #827 would have fixed but current v6-alpha still has v5 references suggests:

- PR hasn't been merged
- OR other changes re-introduced v5 references
- OR these are different instances than PR caught

**Investigation needed** to determine if these are new references or ones PR missed.

---

### Type D: SPECIAL HANDLING (Code/Config)

#### JavaScript Files (9 references in .js files)

**Need careful review:**

- tools/cli/installers/lib/core/detector.js
- tools/cli/installers/lib/ide/claude-code.js
- tools/cli/installers/lib/ide/qwen.js
- tools/cli/lib/ui.js

**Considerations:**

- May be code logic that references v5 intentionally
- Could be string literals in error messages
- Might be file path constants
- Requires contextual code review

**Action:** Manual review required before any changes

#### YAML Files (2 references)

**Files to review:**

- Check if these are configuration values
- Determine if they affect runtime behavior
- Validate change won't break functionality

**Action:** Test after any changes

---

## Next Steps for Categorization

### Immediate Actions

1. **Read 5-10 sample files** from Type B to confirm pattern
2. **Examine JavaScript files** to understand code context
3. **Compare bmad/ vs src/** to verify if they're duplicates
4. **Create automated replacement script** for Type B files
5. **Design validation tests** to prevent regressions

### Decision Points

**Question 1:** Should we fix all Type B references ourselves or ask PR author to rebase?

- **Option A:** Close PR #827, create fresh comprehensive fix
- **Option B:** Request PR author rebase (significant work)
- **Option C:** Partial merge (if possible)

**Question 2:** Are bmad/ and src/ intentional duplicates?

- If YES: Both need synchronized updates
- If NO: Determine which is source of truth

**Question 3:** What's the testing strategy?

- Automated pattern validation
- Manual spot-checks
- Full npm test suite
- Contributor validation

---

## Categorization Progress

- [x] **Phase 1.3.1:** Complete codebase search (443 refs in 44 files)
- [x] **Phase 1.3.2:** Export to structured format (CSV created)
- [x] **Phase 1.3.3:** Group by file type (.md=432, .js=9, .yaml=2)
- [ ] **Phase 1.3.4:** Detailed categorization (IN PROGRESS)
- [ ] **Phase 1.3.5:** Count per file with context

**Status:** Initial inventory COMPLETE - Detailed categorization IN PROGRESS

---

## Raw Data

**CSV Export:** .patch/827/v5-references-raw.csv  
**File Count:** 44 files  
**Reference Count:** 443 instances  
**Top File Types:**

1. Markdown: 97.5%
2. JavaScript: 2.0%
3. YAML: 0.5%

**High-Concentration Files (estimate):**

- convert-legacy/\* files: ~150-200 references
- Various READMEs: ~100-150 references
- Other documentation: ~100 references
- Code/config: ~10 references
