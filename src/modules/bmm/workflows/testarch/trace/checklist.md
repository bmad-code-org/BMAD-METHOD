# Requirements Traceability - Validation Checklist

**Workflow:** `testarch-trace`
**Purpose:** Ensure complete and accurate traceability matrix with actionable gap analysis

---

## Prerequisites Validation

- [ ] Acceptance criteria are available (from story file OR inline)
- [ ] Test suite exists (or gaps are acknowledged and documented)
- [ ] Test directory path is correct (`test_dir` variable)
- [ ] Story file is accessible (if using BMad mode)
- [ ] Knowledge base is loaded (test-priorities, traceability, risk-governance)

---

## Context Loading

- [ ] Story file read successfully (if applicable)
- [ ] Acceptance criteria extracted correctly
- [ ] Story ID identified (e.g., 1.3)
- [ ] `test-design.md` loaded (if available)
- [ ] `tech-spec.md` loaded (if available)
- [ ] `PRD.md` loaded (if available)
- [ ] Relevant knowledge fragments loaded from `tea-index.csv`

---

## Test Discovery and Cataloging

- [ ] Tests auto-discovered using multiple strategies (test IDs, describe blocks, file paths)
- [ ] Tests categorized by level (E2E, API, Component, Unit)
- [ ] Test metadata extracted:
  - [ ] Test IDs (e.g., 1.3-E2E-001)
  - [ ] Describe/context blocks
  - [ ] It blocks (individual test cases)
  - [ ] Given-When-Then structure (if BDD)
  - [ ] Priority markers (P0/P1/P2/P3)
- [ ] All relevant test files found (no tests missed due to naming conventions)

---

## Criteria-to-Test Mapping

- [ ] Each acceptance criterion mapped to tests (or marked as NONE)
- [ ] Explicit references found (test IDs, describe blocks mentioning criterion)
- [ ] Test level documented (E2E, API, Component, Unit)
- [ ] Given-When-Then narrative verified for alignment
- [ ] Traceability matrix table generated:
  - [ ] Criterion ID
  - [ ] Description
  - [ ] Test ID
  - [ ] Test File
  - [ ] Test Level
  - [ ] Coverage Status

---

## Coverage Classification

- [ ] Coverage status classified for each criterion:
  - [ ] **FULL** - All scenarios validated at appropriate level(s)
  - [ ] **PARTIAL** - Some coverage but missing edge cases or levels
  - [ ] **NONE** - No test coverage at any level
  - [ ] **UNIT-ONLY** - Only unit tests (missing integration/E2E validation)
  - [ ] **INTEGRATION-ONLY** - Only API/Component tests (missing unit confidence)
- [ ] Classification justifications provided
- [ ] Edge cases considered in FULL vs PARTIAL determination

---

## Duplicate Coverage Detection

- [ ] Duplicate coverage checked across test levels
- [ ] Acceptable overlap identified (defense in depth for critical paths)
- [ ] Unacceptable duplication flagged (same validation at multiple levels)
- [ ] Recommendations provided for consolidation
- [ ] Selective testing principles applied

---

## Gap Analysis

- [ ] Coverage gaps identified:
  - [ ] Criteria with NONE status
  - [ ] Criteria with PARTIAL status
  - [ ] Criteria with UNIT-ONLY status
  - [ ] Criteria with INTEGRATION-ONLY status
- [ ] Gaps prioritized by risk level using test-priorities framework:
  - [ ] **CRITICAL** - P0 criteria without FULL coverage (BLOCKER)
  - [ ] **HIGH** - P1 criteria without FULL coverage (PR blocker)
  - [ ] **MEDIUM** - P2 criteria without FULL coverage (nightly gap)
  - [ ] **LOW** - P3 criteria without FULL coverage (acceptable)
- [ ] Specific test recommendations provided for each gap:
  - [ ] Suggested test level (E2E, API, Component, Unit)
  - [ ] Test description (Given-When-Then)
  - [ ] Recommended test ID (e.g., 1.3-E2E-004)
  - [ ] Explanation of why test is needed

---

## Coverage Metrics

- [ ] Overall coverage percentage calculated (FULL coverage / total criteria)
- [ ] P0 coverage percentage calculated
- [ ] P1 coverage percentage calculated
- [ ] P2 coverage percentage calculated (if applicable)
- [ ] Coverage by level calculated:
  - [ ] E2E coverage %
  - [ ] API coverage %
  - [ ] Component coverage %
  - [ ] Unit coverage %

---

## Quality Gate Validation

- [ ] P0 coverage >= 100% (required) ✅ or BLOCKER documented ❌
- [ ] P1 coverage >= 90% (recommended) ✅ or HIGH priority gap documented ⚠️
- [ ] Overall coverage >= 80% (recommended) ✅ or MEDIUM priority gap documented ⚠️
- [ ] Gate status determined: PASS / WARN / FAIL

---

## Test Quality Verification

For each mapped test, verify:

- [ ] Explicit assertions are present (not hidden in helpers)
- [ ] Test follows Given-When-Then structure
- [ ] No hard waits or sleeps (deterministic waiting only)
- [ ] Self-cleaning (test cleans up its data)
- [ ] File size < 300 lines
- [ ] Test duration < 90 seconds

Quality issues flagged:

- [ ] **BLOCKER** issues identified (missing assertions, hard waits, flaky patterns)
- [ ] **WARNING** issues identified (large files, slow tests, unclear structure)
- [ ] **INFO** issues identified (style inconsistencies, missing documentation)

Knowledge fragments referenced:

- [ ] `test-quality.md` for Definition of Done
- [ ] `fixture-architecture.md` for self-cleaning patterns
- [ ] `network-first.md` for Playwright best practices
- [ ] `data-factories.md` for test data patterns

---

## Deliverables Generated

### Traceability Matrix Markdown

- [ ] File created at `{output_folder}/traceability-matrix.md`
- [ ] Template from `trace-template.md` used
- [ ] Full mapping table included
- [ ] Coverage status section included
- [ ] Gap analysis section included
- [ ] Quality assessment section included
- [ ] Recommendations section included

### Gate YAML Snippet (if enabled)

- [ ] YAML snippet generated
- [ ] Story ID included
- [ ] Coverage metrics included (overall, p0, p1, p2)
- [ ] Gap counts included (critical, high, medium, low)
- [ ] Status included (PASS / WARN / FAIL)
- [ ] Recommendations included

### Coverage Badge/Metric (if enabled)

- [ ] Badge markdown generated
- [ ] Metrics exported to JSON for CI/CD integration

### Updated Story File (if enabled)

- [ ] "Traceability" section added to story markdown
- [ ] Link to traceability matrix included
- [ ] Coverage summary included
- [ ] Gate status included

---

## Quality Assurance

### Accuracy Checks

- [ ] All acceptance criteria accounted for (none skipped)
- [ ] Test IDs correctly formatted (e.g., 1.3-E2E-001)
- [ ] File paths are correct and accessible
- [ ] Coverage percentages calculated correctly
- [ ] No false positives (tests incorrectly mapped to criteria)
- [ ] No false negatives (existing tests missed in mapping)

### Completeness Checks

- [ ] All test levels considered (E2E, API, Component, Unit)
- [ ] All priorities considered (P0, P1, P2, P3)
- [ ] All coverage statuses used appropriately (FULL, PARTIAL, NONE, UNIT-ONLY, INTEGRATION-ONLY)
- [ ] All gaps have recommendations
- [ ] All quality issues have severity and remediation guidance

### Actionability Checks

- [ ] Recommendations are specific (not generic)
- [ ] Test IDs suggested for new tests
- [ ] Given-When-Then provided for recommended tests
- [ ] Impact explained for each gap
- [ ] Priorities clear (CRITICAL, HIGH, MEDIUM, LOW)

---

## Non-Prescriptive Validation

- [ ] Traceability format adapted to team needs (not rigid template)
- [ ] Examples are minimal and focused on patterns
- [ ] Teams can extend with custom classifications
- [ ] Integration with external systems supported (JIRA, Azure DevOps)
- [ ] Compliance requirements considered (if applicable)

---

## Documentation and Communication

- [ ] Traceability matrix is readable and well-formatted
- [ ] Tables render correctly in markdown
- [ ] Code blocks have proper syntax highlighting
- [ ] Links are valid and accessible
- [ ] Recommendations are clear and prioritized
- [ ] Gate status is prominent and unambiguous

---

## Final Validation

- [ ] All prerequisites met
- [ ] All acceptance criteria mapped or gaps documented
- [ ] P0 coverage is 100% OR documented as BLOCKER
- [ ] Gap analysis is complete and prioritized
- [ ] Test quality issues identified and flagged
- [ ] Deliverables generated and saved
- [ ] Gate YAML ready for CI/CD integration (if enabled)
- [ ] Story file updated (if enabled)
- [ ] Workflow completed successfully

---

## Sign-Off

**Traceability Status:**

- [ ] ✅ PASS - All quality gates met, no critical gaps
- [ ] ⚠️ WARN - P1 gaps exist, address before PR merge
- [ ] ❌ FAIL - P0 gaps exist, BLOCKER for release

**Next Actions:**

- If PASS: Proceed to `*gate` workflow or PR merge
- If WARN: Address HIGH priority gaps, re-run `*trace`
- If FAIL: Run `*atdd` to generate missing P0 tests, re-run `*trace`

---

<!-- Powered by BMAD-CORE™ -->
