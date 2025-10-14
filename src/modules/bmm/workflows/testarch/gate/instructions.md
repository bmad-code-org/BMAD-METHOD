# Quality Gate Decision - Instructions v4.0

**Workflow:** `testarch-gate`
**Purpose:** Make deterministic quality gate decision (PASS/CONCERNS/FAIL/WAIVED) for story/epic/release based on test results, risk assessment, and non-functional validation
**Agent:** Test Architect (TEA)
**Format:** Pure Markdown v4.0 (no XML blocks)

---

## Overview

This workflow evaluates all quality evidence (test results, traceability, NFRs, risk assessment) and makes a deterministic gate decision following predefined rules. It ensures that releases meet quality standards and provides an audit trail for decision-making.

**Key Capabilities:**

- Deterministic decision rules (PASS/CONCERNS/FAIL/WAIVED)
- Evidence-based validation (test results, coverage, NFRs, risks)
- P0-P3 risk framework integration
- Waiver management (business-approved exceptions)
- Audit trail with history tracking
- Stakeholder notification generation
- Gate YAML output for CI/CD integration

---

## Prerequisites

**Required:**

- Test execution results (CI/CD pipeline, local test runs)
- Story or epic being gated
- Completed quality workflows (at minimum test-design OR trace)

**Recommended:**

- `test-design.md` - Risk assessment with P0-P3 prioritization
- `traceability-matrix.md` - Requirements-to-tests coverage analysis
- `nfr-assessment.md` - Non-functional requirements validation
- Code coverage report
- Burn-in test results (flakiness validation)

**Halt Conditions:**

- If critical assessments are missing AND user doesn't waive requirement, halt and request them
- If assessments are stale (>7 days old) AND `validate_evidence_freshness: true`, warn user
- If test results are unavailable, halt and request test execution

---

## Workflow Steps

### Step 1: Load Context and Knowledge Base

**Actions:**

1. Load relevant knowledge fragments from `{project-root}/bmad/bmm/testarch/tea-index.csv`:
   - `risk-governance.md` - Risk-based quality gate criteria
   - `probability-impact.md` - Risk scoring framework
   - `test-quality.md` - Definition of Done for tests
   - `test-priorities.md` - P0/P1/P2/P3 priority framework
   - `ci-burn-in.md` - Flakiness detection validation

2. Read gate configuration from workflow variables:
   - Gate type (story/epic/release/hotfix)
   - Decision thresholds (pass rates, coverage minimums)
   - Risk tolerance (allow P2/P3 failures, escalate P1)
   - Waiver policy

3. Identify gate target:
   - Extract story ID, epic number, or release version
   - Determine scope (single story vs full epic vs release)

**Output:** Complete understanding of gate criteria and target scope

---

### Step 2: Gather Quality Evidence

**Actions:**

1. **Auto-discover assessment files** (if not explicitly provided):
   - Search for `test-design-epic-{epic_num}.md` or `test-design-story-{story_id}.md`
   - Search for `traceability-matrix-{story_id}.md` or `traceability-matrix-epic-{epic_num}.md`
   - Search for `nfr-assessment-{story_id}.md` or `nfr-assessment-epic-{epic_num}.md`
   - Search for story file: `story-{story_id}.md`

2. **Validate evidence freshness** (if `validate_evidence_freshness: true`):
   - Check file modification dates
   - Warn if any assessment is >7 days old
   - Recommend re-running stale workflows

3. **Parse test execution results**:
   - CI/CD pipeline results (GitHub Actions, GitLab CI, Jenkins)
   - Test framework reports (Playwright HTML report, Jest JSON, JUnit XML)
   - Extract metrics: total tests, passed, failed, skipped, duration
   - Extract burn-in results: flaky test count, stability score

4. **Parse quality assessments**:
   - **test-design.md**: Extract P0/P1/P2/P3 scenarios, risk scores, mitigation status
   - **traceability-matrix.md**: Extract coverage percentages, gaps, unmapped criteria
   - **nfr-assessment.md**: Extract NFR status (PASS/CONCERNS/FAIL per category)

5. **Parse code coverage** (if available):
   - Line coverage, branch coverage, function coverage
   - Coverage by file/directory
   - Identify uncovered critical paths

**Output:** Comprehensive evidence package with all quality metrics

---

### Step 3: Apply Decision Rules (Deterministic Mode)

**Actions:**

1. **Evaluate P0 criteria** (must ALL pass for gate to PASS):
   - ✅ P0 test pass rate = 100%
   - ✅ P0 acceptance criteria coverage = 100%
   - ✅ No critical security issues (max_security_issues = 0)
   - ✅ No critical NFR failures (max_critical_nfrs_fail = 0)
   - ✅ No flaky tests in burn-in (if burn-in enabled)

   **If ANY P0 criterion fails → Decision = FAIL**

2. **Evaluate P1 criteria** (required for PASS, may be waived for CONCERNS):
   - ✅ P1 test pass rate ≥ min_p1_pass_rate (default: 95%)
   - ✅ P1 acceptance criteria coverage ≥ 95%
   - ✅ Overall test pass rate ≥ min_overall_pass_rate (default: 90%)
   - ✅ Code coverage ≥ min_coverage (default: 80%)

   **If ANY P1 criterion fails → Decision = CONCERNS (may escalate to FAIL)**

3. **Evaluate P2/P3 criteria** (informational, don't block):
   - P2 failures tracked but don't affect gate decision (if allow_p2_failures: true)
   - P3 failures tracked but don't affect gate decision (if allow_p3_failures: true)
   - Document as residual risk

4. **Determine final decision**:
   - **PASS**: All P0 criteria met, all P1 criteria met, no critical blockers
   - **CONCERNS**: All P0 criteria met, some P1 criteria missed, residual risk acceptable
   - **FAIL**: Any P0 criterion missed, critical blockers present
   - **WAIVED**: FAIL status with business-approved waiver (if allow_waivers: true)

**Output:** Gate decision with deterministic justification

---

### Step 4: Document Decision and Evidence

**Actions:**

1. **Create gate decision document** using `gate-template.md`:
   - **Story/Epic/Release Info**: ID, title, description, links
   - **Decision**: PASS / CONCERNS / FAIL / WAIVED
   - **Decision Date**: Timestamp of gate evaluation
   - **Evaluator**: User or agent who made decision

2. **Document evidence**:
   - **Test Results Summary**:
     - Total tests: X
     - Passed: Y (Z%)
     - Failed: N (M%)
     - P0 pass rate: 100% ✅ / <100% ❌
     - P1 pass rate: X% ✅ / <95% ⚠️
   - **Coverage Summary**:
     - P0 criteria: X/Y covered (Z%)
     - P1 criteria: X/Y covered (Z%)
     - Code coverage: X%
   - **NFR Validation**:
     - Security: PASS / CONCERNS / FAIL
     - Performance: PASS / CONCERNS / FAIL
     - Reliability: PASS / CONCERNS / FAIL
     - Maintainability: PASS / CONCERNS / FAIL
   - **Flakiness**:
     - Burn-in iterations: 10
     - Flaky tests detected: 0 ✅ / >0 ❌

3. **Document rationale**:
   - Explain decision based on criteria
   - Highlight key evidence that drove decision
   - Note any assumptions or caveats

4. **Document residual risks** (if CONCERNS or WAIVED):
   - List unresolved P1/P2 issues
   - Estimate probability × impact
   - Describe mitigations or workarounds

5. **Document waivers** (if WAIVED):
   - Waiver reason (business justification)
   - Waiver approver (name, role)
   - Waiver expiry date
   - Remediation plan

6. **List critical issues** (if FAIL or CONCERNS):
   - Top 5-10 issues blocking gate
   - Priority (P0/P1/P2)
   - Owner
   - Due date

7. **Provide recommendations**:
   - **For PASS**: Proceed to deployment, monitor post-release
   - **For CONCERNS**: Deploy with monitoring, address issues in next sprint
   - **For FAIL**: Block deployment, fix critical issues, re-run gate
   - **For WAIVED**: Deploy with business approval, aggressive monitoring

**Output:** Complete gate decision document ready for review

---

### Step 5: Update Status Tracking and Notify

**Actions:**

1. **Append to bmm-workflow-status.md** (if `append_to_history: true`):
   - Add gate decision to history section
   - Format: `[DATE] Gate Decision: DECISION - Story/Epic/Release {ID} - {brief rationale}`
   - Example: `[2025-10-14] Gate Decision: PASS - Story 1.3 - All P0/P1 criteria met, 98% pass rate`

2. **Generate stakeholder notification** (if `notify_stakeholders: true`):
   - **Subject**: Gate Decision: DECISION - {Story/Epic/Release ID}
   - **Body**: Summary of decision, key metrics, next steps
   - **Recipients**: PM, SM, DEV lead, stakeholders

3. **Generate gate YAML snippet** for CI/CD integration:

```yaml
gate_decision:
  target: 'story-1.3'
  decision: 'PASS' # or CONCERNS / FAIL / WAIVED
  date: '2025-10-14'
  evaluator: 'TEA Agent'
  criteria:
    p0_pass_rate: 100
    p1_pass_rate: 98
    overall_pass_rate: 96
    code_coverage: 85
    security_issues: 0
    critical_nfrs_fail: 0
    flaky_tests: 0
  evidence:
    test_results: 'CI Run #456'
    traceability: 'traceability-matrix-1.3.md'
    nfr_assessment: 'nfr-assessment-1.3.md'
  next_steps: 'Deploy to staging, monitor metrics'
```

4. **Save outputs**:
   - Write gate decision document to `{output_file}`
   - Write gate YAML to `{output_folder}/gate-decision-{target}.yaml`
   - Update status file

**Output:** Gate decision documented, tracked, and communicated

---

## Decision Matrix (Quick Reference)

| Scenario          | P0 Pass Rate | P1 Pass Rate | Security Issues | Critical NFRs | Decision     | Action                 |
| ----------------- | ------------ | ------------ | --------------- | ------------- | ------------ | ---------------------- |
| Ideal             | 100%         | ≥95%         | 0               | 0             | **PASS**     | Deploy                 |
| Minor issues      | 100%         | 90-94%       | 0               | 0             | **CONCERNS** | Deploy with monitoring |
| P1 degradation    | 100%         | <90%         | 0               | 0             | **CONCERNS** | Fix in next sprint     |
| P0 failure        | <100%        | any          | any             | any           | **FAIL**     | Block release          |
| Security issue    | any          | any          | >0              | any           | **FAIL**     | Fix immediately        |
| Critical NFR fail | any          | any          | any             | >0            | **FAIL**     | Remediate first        |
| Business waiver   | <100%        | any          | any             | any           | **WAIVED**   | Deploy with approval   |

---

## Waiver Management

**When to waive:**

- Business-critical deadline (e.g., regulatory requirement, contractual obligation)
- Issue is low-probability edge case with acceptable risk
- Workaround exists for known issue
- Fix is in progress but can be deployed post-release

**Waiver requirements:**

- Named approver (VP Engineering, CTO, Product Owner)
- Business justification documented
- Remediation plan with due date
- Expiry date (waiver does NOT apply to future releases)
- Monitoring plan for waived risk

**Never waive:**

- Security vulnerabilities
- Data corruption risks
- Critical user journey failures
- Compliance violations

---

## Example Gate Decisions

### Example 1: PASS Decision

```markdown
# Gate Decision: story-1.3 (User Authentication Flow)

**Decision:** ✅ PASS
**Date:** 2025-10-14
**Evaluator:** TEA Agent

## Evidence Summary

- **P0 Tests:** 12/12 passed (100%) ✅
- **P1 Tests:** 24/25 passed (96%) ✅
- **Overall Pass Rate:** 98% ✅
- **Code Coverage:** 87% ✅
- **Security Issues:** 0 ✅
- **Flaky Tests:** 0 ✅

## Rationale

All P0 criteria met. All P1 criteria exceeded thresholds. No critical issues detected. Feature is ready for production deployment.

## Next Steps

1. Deploy to staging environment
2. Monitor authentication metrics for 24 hours
3. Deploy to production if no issues
```

### Example 2: CONCERNS Decision

```markdown
# Gate Decision: epic-2 (Payment Processing)

**Decision:** ⚠️ CONCERNS
**Date:** 2025-10-14
**Evaluator:** TEA Agent

## Evidence Summary

- **P0 Tests:** 28/28 passed (100%) ✅
- **P1 Tests:** 42/47 passed (89%) ⚠️
- **Overall Pass Rate:** 91% ✅
- **Code Coverage:** 78% ⚠️
- **Security Issues:** 0 ✅
- **Flaky Tests:** 0 ✅

## Rationale

All P0 criteria met, but P1 pass rate (89%) below threshold (95%). Coverage (78%) slightly below target (80%). Issues are non-critical and can be addressed post-release.

## Residual Risks

1. **P1 Issue**: Edge case in refund flow for international currencies (low probability)
2. **Coverage Gap**: Missing tests for admin cancel flow (workaround exists)

## Next Steps

1. Deploy with enhanced monitoring on refund flows
2. Create backlog stories for P1 fixes
3. Add missing tests in next sprint
```

### Example 3: FAIL Decision

```markdown
# Gate Decision: story-3.2 (Data Export)

**Decision:** ❌ FAIL
**Date:** 2025-10-14
**Evaluator:** TEA Agent

## Evidence Summary

- **P0 Tests:** 8/10 passed (80%) ❌
- **P1 Tests:** 18/22 passed (82%) ❌
- **Security Issues:** 1 (SQL injection in export filter) ❌
- **Code Coverage:** 65% ❌

## Rationale

**CRITICAL BLOCKERS:**

1. P0 test failures in core export functionality
2. Unresolved SQL injection vulnerability (CRITICAL security issue)
3. Coverage below minimum threshold

Release BLOCKED until critical issues are resolved.

## Critical Issues

| Priority | Issue                                 | Owner        | Due Date   |
| -------- | ------------------------------------- | ------------ | ---------- |
| P0       | Fix SQL injection in export filter    | Backend Team | 2025-10-16 |
| P0       | Fix export pagination bug             | Backend Team | 2025-10-16 |
| P0       | Fix export timeout for large datasets | Backend Team | 2025-10-17 |

## Next Steps

1. **Block deployment immediately**
2. Fix P0 issues listed above
3. Re-run full test suite
4. Re-run gate workflow after fixes
```

### Example 4: WAIVED Decision

```markdown
# Gate Decision: release-v2.4.0

**Decision:** 🔓 WAIVED
**Date:** 2025-10-14
**Evaluator:** TEA Agent

## Original Decision: ❌ FAIL

**Reason for failure:**

- P0 test failure in legacy reporting module
- Issue affects <1% of users (specific browser configuration)

## Waiver Details

- **Waiver Reason:** Regulatory deadline for GDPR compliance features (Oct 15)
- **Waiver Approver:** Jane Doe, VP Engineering
- **Waiver Expiry:** 2025-10-15 (does NOT apply to v2.4.1)
- **Monitoring Plan:** Enhanced error tracking on reporting module
- **Remediation Plan:** Fix in v2.4.1 hotfix (due Oct 20)

## Business Justification

Release contains critical GDPR compliance features required by regulatory deadline. Failed test affects legacy reporting module used by <1% of users in specific edge case (IE11 + Windows 7). Workaround available (use Chrome). Risk acceptable given regulatory priority.

## Next Steps

1. Deploy v2.4.0 with waiver
2. Monitor error rates on reporting module
3. Fix legacy module in v2.4.1 (Oct 20)
4. Notify affected users of workaround
```

---

## Integration with BMad Status File

This workflow updates `bmm-workflow-status.md` with gate decisions for tracking:

```markdown
### Quality & Testing Progress (TEA Agent)

**Gate Decisions:**

- [2025-10-14] ✅ PASS - Story 1.3 (User Auth) - All criteria met
- [2025-10-14] ⚠️ CONCERNS - Epic 2 (Payments) - P1 pass rate 89%
- [2025-10-14] ❌ FAIL - Story 3.2 (Export) - Security issue blocking
- [2025-10-15] 🔓 WAIVED - Release v2.4.0 - GDPR deadline waiver
```

---

## Important Notes

1. **Deterministic > Manual**: Use rule-based decisions to reduce bias and ensure consistency
2. **Evidence Required**: Never make decisions without test results and assessments
3. **P0 is Sacred**: P0 failures ALWAYS result in FAIL (no exceptions except waivers)
4. **Waivers are Temporary**: Waiver does NOT apply to future releases - issue must be fixed
5. **Security Never Waived**: Security vulnerabilities should never be waived
6. **Transparency**: Document rationale clearly for audit trail
7. **Freshness Matters**: Stale assessments (>7 days) should be re-run
8. **Burn-in Counts**: Flaky tests detected in burn-in should block gate

---

## Troubleshooting

**Problem: No test results found**

- Check CI/CD pipeline for test execution
- Verify test results path in workflow variables
- Run tests locally and provide results

**Problem: Assessments are stale**

- Re-run `*test-design`, `*trace`, `*nfr-assess` workflows
- Update evidence files before gate decision

**Problem: Unclear decision (edge case)**

- Escalate to manual review
- Document assumptions and rationale
- Consider waiver if business-critical

**Problem: Waiver requested but not justified**

- Require business justification from stakeholder
- Ensure named approver is appropriate authority
- Verify remediation plan exists with due date
