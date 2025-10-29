# TODO List for PR #827 Investigation

**PR:** #827 - Fix: Update references to 'v5' to be 'v6'  
**Created:** 2025-10-28  
**Type:** Incomplete documentation update - requires expansion

---

## Phase 1: Comprehensive Search & Categorization

### 1.1 Gather PR Context

- [x] **1.1.1** Download PR #827 details from GitHub API
- [x] **1.1.2** Create PR-827-Summary.md with basic info
- [x] **1.1.3** Save PR conversation (currently empty)
- [x] **1.1.4** Download PR patch file (.patch) for offline analysis
- [x] **1.1.5** Review PR description and contributor's testing notes

### 1.2 Apply and Analyze PR Changes

- [x] **1.2.1** Create test branch from v6-alpha (pr-827-test)
- [x] **1.2.2** Apply PR #827 patch to test branch (FAILED - outdated)
- [x] **1.2.3** Review exact files modified by the patch (658 files discovered)
- [x] **1.2.4** Document what the PR successfully changes (patch-analysis.md created)
- [x] **1.2.5** Identify scope of PR's changes vs claims (COMPLETE - comprehensive but outdated)

### 1.3 Comprehensive Codebase Search

- [x] **1.3.1** Search entire codebase for `\bv5\b` pattern (443 matches in 44 files)
- [x] **1.3.2** Export grep results to structured format (CSV created)
- [x] **1.3.3** Group results by file type (.md=432, .js=9, .yaml=2)
- [x] **1.3.4** Group results by directory (documented in inventory)
- [x] **1.3.5** Count total v5 references per file (443 total)

### 1.4 Categorize Each v5 Reference

- [x] **1.4.1** Create v5-references-inventory.md template
- [x] **1.4.2** Review each v5 reference and categorize:
  - [x] Type A: Intentional version markers (CHANGELOG - keep as-is)
  - [x] Type B: Documentation needing v6 update (~432 refs)
  - [x] Type C: Already fixed by PR #827 (N/A - PR outdated)
  - [x] Type D: Code/config requiring special handling (11 refs: 9 JS + 2 YAML)
- [x] **1.4.3** Document reasoning for each categorization (in inventory)
- [x] **1.4.4** Flag any ambiguous cases for manual review (Type D flagged)

### 1.5 Analyze bmad/ vs src/ Duplication

- [x] **1.5.1** Identify which files exist in both bmad/ and src/
- [x] **1.5.2** Verify if v5 references are identical in duplicates
- [x] **1.5.3** Determine if duplication is intentional (appears to be mirrors)
- [x] **1.5.4** Document synchronization requirements (both need updates)

**Phase 1 Completion Criteria:**

- [x] Complete inventory of all v5 references with categories
- [x] Clear understanding of PR scope vs total scope (PR: 658 files Oct 2025, Current: 44 files)
- [x] Documentation of bmad/src relationship (mirrors - both need fixing)

---

## Phase 2: Pattern Analysis & Test Design

### 2.1 Extract Common Patterns

- [ ] **2.1.1** List all unique v5 reference patterns found
- [ ] **2.1.2** Group by context (conversion, compliance, versioning, footers)
- [ ] **2.1.3** Identify regex patterns for each type
- [ ] **2.1.4** Document edge cases (v5.0.0 vs v5 compliant)

### 2.2 Design Detection Tests

- [ ] **2.2.1** Create grep test for "v4 to v5" pattern
- [ ] **2.2.2** Create grep test for "v5 compliant" pattern
- [ ] **2.2.3** Create grep test for "v5 architecture/conventions/patterns"
- [ ] **2.2.4** Create grep test for footer "Part of BMad Method v5"
- [ ] **2.2.5** Create grep test for version "v5.0.0"
- [ ] **2.2.6** Create grep test for "v5-specific" references

### 2.3 Design Validation Tests

- [ ] **2.3.1** Write script to find all remaining v5 references
- [ ] **2.3.2** Write script to verify bmad/ and src/ synchronization
- [ ] **2.3.3** Write script to check for broken references after replacement
- [ ] **2.3.4** Design test for CHANGELOG.md historical accuracy
- [ ] **2.3.5** Create checklist for manual validation

### 2.4 Create Test Scripts

- [ ] **2.4.1** Create validate-v5-references.ps1 (PowerShell)
- [ ] **2.4.2** Add function: Find-V5References
- [ ] **2.4.3** Add function: Test-CategoryA-Preserved (intentional markers)
- [ ] **2.4.4** Add function: Test-CategoryB-Fixed (documentation)
- [ ] **2.4.5** Add function: Test-BmadSrcSync
- [ ] **2.4.6** Add comprehensive test output formatting

### 2.5 Document Edge Cases

- [ ] **2.5.1** Document CHANGELOG.md "[v5.0.0] - SKIPPED" (keep)
- [ ] **2.5.2** Document any code comments referencing v5 historically
- [ ] **2.5.3** Document version history entries (context-dependent)
- [ ] **2.5.4** Flag any external references or URLs with v5

**Phase 2 Completion Criteria:**

- [ ] Test script created and functional
- [ ] All patterns documented with regex
- [ ] Edge cases clearly identified

---

## Phase 3: Fix Development

### 3.1 Create Fix Strategy

- [ ] **3.1.1** Decide on fix method (automated script vs manual vs patch)
- [ ] **3.1.2** Create fix execution plan with file-by-file approach
- [ ] **3.1.3** Identify files requiring manual review
- [ ] **3.1.4** Plan bmad/ and src/ synchronization approach

### 3.2 Handle Category A (Keep As-Is)

- [ ] **3.2.1** Document CHANGELOG.md "[v5.0.0] - SKIPPED" preservation
- [ ] **3.2.2** Verify no accidental changes to intentional markers
- [ ] **3.2.3** Create whitelist of approved v5 references

### 3.3 Fix Category B (Documentation Updates)

- [ ] **3.3.1** Fix all "v4 to v5" → "v4 to v6" in convert-legacy
- [ ] **3.3.2** Fix all "v5 compliant" → "v6 compliant"
- [ ] **3.3.3** Fix all "v5 architecture" → "v6 architecture"
- [ ] **3.3.4** Fix all "v5 conventions" → "v6 conventions"
- [ ] **3.3.5** Fix all "v5 patterns" → "v6 patterns"
- [ ] **3.3.6** Fix all "v5 structure" → "v6 structure"
- [ ] **3.3.7** Fix all footers "Part of BMad Method v5" → "v6"
- [ ] **3.3.8** Fix version history "v5.0.0" → "v6.0.0" (where appropriate)

### 3.4 Fix Specific Files

- [ ] **3.4.1** CHANGELOG.md line 19: Fix "from v5 to modules in v5"
- [ ] **3.4.2** bmad/bmb/workflows/convert-legacy/README.md (all v5 refs)
- [ ] **3.4.3** bmad/bmb/workflows/convert-legacy/checklist.md (all v5 refs)
- [ ] **3.4.4** bmad/bmb/workflows/convert-legacy/instructions.md (all v5 refs)
- [ ] **3.4.5** bmad/bmb/workflows/convert-legacy/workflow.yaml
- [ ] **3.4.6** src/ mirrors of above files (maintain sync)
- [ ] **3.4.7** All module README footers still showing v5
- [ ] **3.4.8** Any other files identified in inventory

### 3.5 Create Fix Artifacts

- [ ] **3.5.1** Generate complete-v5-to-v6.patch file
- [ ] **3.5.2** Create before/after diff summary
- [ ] **3.5.3** Document all changes made
- [ ] **3.5.4** Verify bmad/ and src/ receive identical changes

**Phase 3 Completion Criteria:**

- [ ] All Category B references fixed
- [ ] Category A references preserved
- [ ] Patch file created
- [ ] bmad/ and src/ synchronized

---

## Phase 4: Test Execution

### 4.1 Run Automated Tests

- [ ] **4.1.1** Execute validate-v5-references.ps1 script
- [ ] **4.1.2** Verify only whitelisted v5 references remain
- [ ] **4.1.3** Check bmad/ and src/ synchronization
- [ ] **4.1.4** Grep for any new v5 references accidentally introduced
- [ ] **4.1.5** Verify no broken internal links (v5 → v6 paths)

### 4.2 Run Repository Tests

- [ ] **4.2.1** Run `npm run format:check` for style compliance
- [ ] **4.2.2** Run `npm run lint` for any issues
- [ ] **4.2.3** Run `npm test` if applicable
- [ ] **4.2.4** Run `npm run validate:schemas` for YAML validation

### 4.3 Manual Validation

- [ ] **4.3.1** Review CHANGELOG.md - verify historical accuracy maintained
- [ ] **4.3.2** Review convert-legacy workflow docs - check all v5 → v6
- [ ] **4.3.3** Review module footers - verify all updated to v6
- [ ] **4.3.4** Check version history entries - ensure consistency
- [ ] **4.3.5** Spot check 5-10 files for contextual accuracy

### 4.4 Regression Testing

- [ ] **4.4.1** Verify no code files accidentally modified
- [ ] **4.4.2** Check no config files broken
- [ ] **4.4.3** Ensure no agent YAML files affected
- [ ] **4.4.4** Confirm documentation formatting preserved

### 4.5 Document Test Results

- [ ] **4.5.1** Create test-results.md with pass/fail for each test
- [ ] **4.5.2** Document any remaining v5 references with justification
- [ ] **4.5.3** List any edge cases requiring manual review
- [ ] **4.5.4** Summarize regression test results

**Phase 4 Completion Criteria:**

- [ ] All automated tests pass
- [ ] All manual validation complete
- [ ] Zero unintended v5 references
- [ ] No regressions introduced

---

## Phase 5: PR Review & Recommendation

### 5.1 Assess PR Completeness

- [ ] **5.1.1** Compare PR #827 changes vs our comprehensive fix
- [ ] **5.1.2** List what PR got right (15 files successfully updated)
- [ ] **5.1.3** List what PR missed (remaining v5 references)
- [ ] **5.1.4** Calculate coverage: PR changes / total needed changes
- [ ] **5.1.5** Assess if PR scope was intentionally limited

### 5.2 Formulate Recommendation

- [ ] **5.2.1** Decide on recommendation type:
  - [ ] Option A: REQUEST CHANGES with complete list
  - [ ] Option B: APPROVE with follow-up companion PR
  - [ ] Option C: COMMENT with offer to complete
- [ ] **5.2.2** Draft rationale for chosen recommendation
- [ ] **5.2.3** Prepare list of specific changes needed
- [ ] **5.2.4** Consider contributor's time/expertise

### 5.3 Draft PR Review Comment

- [ ] **5.3.1** Thank contributor for finding and addressing v5 issue
- [ ] **5.3.2** Acknowledge work done (15 files is significant effort)
- [ ] **5.3.3** Explain gap diplomatically (100+ refs, 15 files addressed)
- [ ] **5.3.4** Provide complete inventory of remaining v5 references
- [ ] **5.3.5** Offer specific fix recommendations or patch file
- [ ] **5.3.6** Address contributor's testing documentation concern
- [ ] **5.3.7** Offer to help complete if contributor prefers

### 5.4 Prepare Supporting Artifacts

- [ ] **5.4.1** Attach v5-references-inventory.md
- [ ] **5.4.2** Attach complete-v5-to-v6.patch (if offering)
- [ ] **5.4.3** Attach validate-v5-references.ps1 script
- [ ] **5.4.4** Create PR-827-review-comment.md

### 5.5 Address Testing Documentation Issue

- [ ] **5.5.1** Investigate contributor's claim about missing pre-release script
- [ ] **5.5.2** Check CONTRIBUTING.md for outdated testing instructions
- [ ] **5.5.3** Verify current testing process in package.json
- [ ] **5.5.4** Consider separate issue for documentation update

**Phase 5 Completion Criteria:**

- [ ] Clear recommendation formulated
- [ ] Constructive review comment drafted
- [ ] All supporting artifacts prepared
- [ ] Testing documentation issue addressed

---

## Phase 6: Application & Cleanup

### 6.1 Apply Fix (If Doing It Ourselves)

- [ ] **6.1.1** Commit all changes to patch-827 branch
- [ ] **6.1.2** Write comprehensive commit message
- [ ] **6.1.3** Run final validation tests
- [ ] **6.1.4** Create patch file for PR comment
- [ ] **6.1.5** Decide: push to fork vs attach to comment

### 6.2 Post Review (If Requesting Contributor Changes)

- [ ] **6.2.1** Post review comment to PR #827
- [ ] **6.2.2** Attach inventory and patch file
- [ ] **6.2.3** Set review status (REQUEST CHANGES, COMMENT, or APPROVE)
- [ ] **6.2.4** Monitor for contributor response

### 6.3 Archive Investigation Artifacts

- [ ] **6.3.1** Save all created files to `.patch/827/`
- [ ] **6.3.2** Save test scripts and validation results
- [ ] **6.3.3** Create final-summary.md with complete investigation
- [ ] **6.3.4** Document lessons learned

### 6.4 Workspace Cleanup

- [ ] **6.4.1** Delete pr-827-test branch (if created)
- [ ] **6.4.2** Checkout v6-alpha branch
- [ ] **6.4.3** Verify .patch/827/ preserved
- [ ] **6.4.4** Run git status to ensure clean workspace

### 6.5 Follow-up Actions

- [ ] **6.5.1** Create issue for CONTRIBUTING.md testing docs update (if needed)
- [ ] **6.5.2** Monitor PR #827 for contributor response
- [ ] **6.5.3** Offer additional help if contributor has questions
- [ ] **6.5.4** Re-review when changes applied

**Phase 6 Completion Criteria:**

- [ ] Fix applied or review posted
- [ ] All artifacts archived
- [ ] Workspace clean
- [ ] Follow-up plan established

---

## Quick Reference

**Current Status:** Phase 1 partially complete

- [x] PR details gathered
- [x] Initial codebase search complete (100+ v5 refs found)
- [ ] Patch not yet downloaded/applied
- [ ] Inventory not yet categorized

**Next Immediate Tasks:**

1. Download and apply PR #827 patch
2. Create complete v5 reference inventory
3. Categorize each reference (A/B/C/D)

**Key Files to Create:**

- [ ] `.patch/827/v5-references-inventory.md`
- [ ] `.patch/827/validate-v5-references.ps1`
- [ ] `.patch/827/complete-v5-to-v6.patch`
- [ ] `.patch/827/PR-827-review-comment.md`
- [ ] `.patch/827/test-results.md`
- [ ] `.patch/827/final-summary.md`

**Decision Points:**

- [ ] Phase 2: Automated vs manual fix approach
- [ ] Phase 5: REQUEST CHANGES vs APPROVE vs COMMENT
- [ ] Phase 6: Complete ourselves vs guide contributor

---

## Notes

- **Contributor Insight:** @davedittrich tested convert-legacy workflow and found v5 refs in output - good testing approach
- **Testing Gap:** Contributor couldn't validate using CONTRIBUTING.md instructions (pre-release script missing) - separate issue?
- **PR Intent:** Contributor used Claude Code for find/replace - may not have caught all instances
- **Scope Clarity:** PR description says "all references" but only changed 15 files - need to clarify if scope was intentional

---

**Status:** TODO LIST CREATED - Ready to begin Phase 1.4 (Categorization)
