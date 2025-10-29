# PR #827 Investigation Plan

**Created:** 2025-10-28  
**PR:** https://github.com/bmad-code-org/BMAD-METHOD/pull/827  
**Issue:** Incomplete v5 to v6 reference updates

---

## Objective

Validate and complete the v5 → v6 reference updates started in PR #827, ensuring all incorrect v5 references are changed to v6 while preserving intentional version markers.

---

## Problem Statement

**Current State:**

- PR #827 claims to change "all references to v5 to instead be v6"
- PR only modifies 15 files (138 line changes)
- Codebase search reveals 100+ v5 references remain
- Contributor tested convert-legacy workflow and found v5 references in output

**Root Cause:**

- Incomplete find/replace operation
- Some files were missed in the original search
- Possible scope limitation not communicated

**Expected State:**

- All documentation v5 references → v6 (except intentional version markers)
- Consistent versioning across bmad/ and src/ directories
- CHANGELOG.md preserved for historical accuracy where appropriate

---

## Investigation Strategy

### Phase 1: Comprehensive Search & Categorization (1 hour)

**Goal:** Identify ALL v5 references and categorize them

**Tasks:**

1. Download PR #827 patch file for offline analysis
2. Apply patch to test branch to see exact changes
3. Search entire codebase for `\bv5\b` pattern
4. Categorize each v5 reference:
   - **Type A:** Intentional version markers (CHANGELOG.md `[v5.0.0] - SKIPPED`)
   - **Type B:** Documentation that should be v6 (conversion guides, footers)
   - **Type C:** Already fixed by PR (verify patch application)
   - **Type D:** Code/config requiring different handling
5. Create comprehensive inventory spreadsheet

**Success Criteria:**

- Complete list of all v5 references with file paths and line numbers
- Each reference categorized by type
- Clear distinction between "needs fixing" vs "keep as-is"

---

### Phase 2: Pattern Analysis & Test Design (1 hour)

**Goal:** Understand patterns and design tests to validate changes

**Tasks:**

1. Analyze common v5 reference patterns:
   - `v4 to v5` (should be `v4 to v6`)
   - `v5 compliant` (should be `v6 compliant`)
   - `v5 architecture` (should be `v6 architecture`)
   - `Part of the BMad Method v5` (should be `v6`)
   - `v5.0.0` (context-dependent - CHANGELOG vs version history)
2. Design grep-based tests to find each pattern
3. Create validation script to verify no unintended v5 references remain
4. Design test for bmad/ and src/ synchronization
5. Document edge cases requiring manual review

**Success Criteria:**

- Test script that can find all v5 references by pattern
- Validation logic for intentional vs accidental v5 references
- Clear test cases for post-fix validation

---

### Phase 3: Fix Development (2 hours)

**Goal:** Create comprehensive fix covering all missed references

**Tasks:**

1. **Create fix script or manual change list:**
   - Option A: Automated sed/PowerShell script for bulk replacement
   - Option B: Manual git patch file with all changes
   - Option C: File-by-file replacement with verification

2. **Handle each category:**
   - **Type A (Keep):** Document why these remain (CHANGELOG version marker)
   - **Type B (Fix):** Apply v5 → v6 replacement
   - **Type C (Verify):** Confirm PR already handles these
   - **Type D (Manual):** Case-by-case assessment

3. **Address specific files:**
   - CHANGELOG.md: Keep `[v5.0.0] - SKIPPED` but fix accidental v5 in line 19
   - convert-legacy/\*: Comprehensive v5 → v6 in all documentation
   - Module footers: Update all "Part of BMad Method v5" → "v6"
   - Version history: Change `v5.0.0` → `v6.0.0` where appropriate

4. **Maintain bmad/ and src/ synchronization:**
   - Ensure both directories receive identical updates
   - Verify no drift between the two

**Success Criteria:**

- All Type B references converted to v6
- Type A references documented and preserved
- bmad/ and src/ remain synchronized
- Changes ready for testing

---

### Phase 4: Test Execution (1 hour)

**Goal:** Validate fix completeness and correctness

**Tasks:**

1. **Run automated tests:**
   - Execute grep search for remaining `\bv5\b` references
   - Verify only intentional v5 references remain
   - Check bmad/ and src/ synchronization
   - Validate no broken references introduced

2. **Manual validation:**
   - Review CHANGELOG.md for historical accuracy
   - Check convert-legacy workflow documentation
   - Verify module footers updated
   - Confirm version history entries

3. **Regression testing:**
   - Run `npm run format:check` to verify no style issues
   - Run `npm run lint` to check for any broken references
   - Run `npm test` if applicable
   - Verify no unintended changes to code files

4. **Documentation review:**
   - Ensure all v6 references make contextual sense
   - Verify no v4 → v5 → v6 inconsistencies
   - Check that "skipping v5" narrative is consistent

**Success Criteria:**

- Zero unintended v5 references found
- All intentional v5 references documented
- All tests pass
- No regressions introduced

---

### Phase 5: PR Review & Recommendation (30 minutes)

**Goal:** Formulate clear recommendation for PR #827

**Tasks:**

1. **Assess PR completeness:**
   - Compare PR changes vs. our comprehensive fix
   - Identify what PR got right
   - Document what PR missed

2. **Formulate recommendation:**
   - **Option A:** Request changes - list all missed references
   - **Option B:** Approve with follow-up - suggest companion PR
   - **Option C:** Offer to expand - propose taking over completion

3. **Draft PR review comment:**
   - Thank contributor for finding the issue
   - Acknowledge the work done (15 files is significant)
   - Explain the gap (100+ references, only 15 files addressed)
   - Provide complete list of remaining v5 references
   - Offer specific fix recommendations or patch file
   - Address testing documentation concern raised by contributor

4. **Prepare artifacts:**
   - Complete v5 reference inventory
   - Patch file with all needed changes (if offering to complete)
   - Test validation script
   - Updated PR summary

**Success Criteria:**

- Clear, constructive PR review comment
- Specific list of all missed references
- Actionable recommendations for contributor
- Option to complete the work if contributor prefers

---

### Phase 6: Application & Cleanup (30 minutes)

**Goal:** Apply fix and clean up workspace

**Tasks:**

1. **If applying fix ourselves:**
   - Commit all changes to patch-827 branch
   - Run final validation tests
   - Push to fork or create patch file
   - Post as PR comment or new PR

2. **If requesting contributor changes:**
   - Post review comment with complete list
   - Offer to assist or take over if needed
   - Monitor for contributor response

3. **Workspace cleanup:**
   - Document all findings in `.patch/827/`
   - Archive test scripts and validation results
   - Revert to v6-alpha branch
   - Preserve all investigation artifacts

**Success Criteria:**

- Fix applied (ourselves or by contributor)
- All artifacts preserved in `.patch/827/`
- Workspace clean and on v6-alpha
- PR #827 has clear path forward

---

## Resource Estimates

| Phase     | Description                           | Estimated Time |
| --------- | ------------------------------------- | -------------- |
| 1         | Comprehensive Search & Categorization | 1 hour         |
| 2         | Pattern Analysis & Test Design        | 1 hour         |
| 3         | Fix Development                       | 2 hours        |
| 4         | Test Execution                        | 1 hour         |
| 5         | PR Review & Recommendation            | 30 minutes     |
| 6         | Application & Cleanup                 | 30 minutes     |
| **Total** |                                       | **6 hours**    |

---

## Risk Assessment

### Low Risk

- Text-only changes in documentation files
- No code logic affected
- Easily reversible changes
- Clear pattern matching

### Medium Risk

- Large number of files to modify (potentially 50+ files)
- bmad/ and src/ synchronization complexity
- Contributor may have scope limitation we're not aware of

### Mitigation Strategies

- Comprehensive testing before application
- Preserve original PR scope in review (don't just take over)
- Offer collaboration rather than replacement
- Document every change for transparency

---

## Success Metrics

1. **Completeness:** 100% of unintentional v5 references converted to v6
2. **Accuracy:** 100% of intentional v5 references preserved (CHANGELOG markers)
3. **Consistency:** bmad/ and src/ remain synchronized
4. **Quality:** All tests pass, no regressions
5. **Collaboration:** Contributor feels supported, not undermined

---

## Deliverables

1. **Complete v5 reference inventory** (`.patch/827/v5-references-inventory.md`)
2. **Test validation script** (`.patch/827/validate-v5-fix.ps1` or similar)
3. **Comprehensive fix patch** (`.patch/827/complete-v5-to-v6.patch`)
4. **PR review comment** (`.patch/827/PR-827-review-comment.md`)
5. **Final investigation report** (`.patch/827/final-summary.md`)

---

## Next Steps

1. Begin Phase 1: Download patch and run comprehensive search
2. Create v5 reference inventory with categorization
3. Proceed through phases systematically
4. Make decision on PR recommendation at Phase 5

---

**Status:** PLAN CREATED - Ready to begin Phase 1
