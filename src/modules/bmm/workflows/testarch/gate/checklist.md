# Quality Gate Decision - Validation Checklist

Use this checklist to validate that the gate decision workflow completed successfully and all criteria were properly evaluated.

---

## Prerequisites

### Evidence Gathering

- [ ] Test execution results obtained (CI/CD pipeline, test framework reports)
- [ ] Story/epic/release file identified and read
- [ ] Test design document discovered or explicitly provided (if available)
- [ ] Traceability matrix discovered or explicitly provided (if available)
- [ ] NFR assessment discovered or explicitly provided (if available)
- [ ] Code coverage report discovered or explicitly provided (if available)
- [ ] Burn-in results discovered or explicitly provided (if available)

### Evidence Validation

- [ ] Evidence freshness validated (warn if >7 days old, recommend re-running workflows)
- [ ] All required assessments available or user acknowledged gaps
- [ ] Test results are complete (not partial or interrupted runs)
- [ ] Test results match current codebase (not from outdated branch)

### Knowledge Base Loading

- [ ] `risk-governance.md` loaded successfully
- [ ] `probability-impact.md` loaded successfully
- [ ] `test-quality.md` loaded successfully
- [ ] `test-priorities.md` loaded successfully
- [ ] `ci-burn-in.md` loaded (if burn-in results available)

---

## Process Steps

### Step 1: Context Loading

- [ ] Gate type identified (story/epic/release/hotfix)
- [ ] Target ID extracted (story_id, epic_num, or release_version)
- [ ] Decision thresholds loaded from workflow variables
- [ ] Risk tolerance configuration loaded
- [ ] Waiver policy loaded

### Step 2: Evidence Parsing

**Test Results:**

- [ ] Total test count extracted
- [ ] Passed test count extracted
- [ ] Failed test count extracted
- [ ] Skipped test count extracted
- [ ] Test duration extracted
- [ ] P0 test pass rate calculated
- [ ] P1 test pass rate calculated
- [ ] Overall test pass rate calculated

**Quality Assessments:**

- [ ] P0/P1/P2/P3 scenarios extracted from test-design.md (if available)
- [ ] Risk scores extracted from test-design.md (if available)
- [ ] Coverage percentages extracted from traceability-matrix.md (if available)
- [ ] Coverage gaps extracted from traceability-matrix.md (if available)
- [ ] NFR status extracted from nfr-assessment.md (if available)
- [ ] Security issues count extracted from nfr-assessment.md (if available)

**Code Coverage:**

- [ ] Line coverage percentage extracted (if available)
- [ ] Branch coverage percentage extracted (if available)
- [ ] Function coverage percentage extracted (if available)
- [ ] Critical path coverage validated (if available)

**Burn-in Results:**

- [ ] Burn-in iterations count extracted (if available)
- [ ] Flaky tests count extracted (if available)
- [ ] Stability score calculated (if available)

### Step 3: Decision Rules Application

**P0 Criteria Evaluation:**

- [ ] P0 test pass rate evaluated (must be 100%)
- [ ] P0 acceptance criteria coverage evaluated (must be 100%)
- [ ] Security issues count evaluated (must be 0)
- [ ] Critical NFR failures evaluated (must be 0)
- [ ] Flaky tests evaluated (must be 0 if burn-in enabled)
- [ ] P0 decision recorded: PASS or FAIL

**P1 Criteria Evaluation:**

- [ ] P1 test pass rate evaluated (threshold: min_p1_pass_rate)
- [ ] P1 acceptance criteria coverage evaluated (threshold: 95%)
- [ ] Overall test pass rate evaluated (threshold: min_overall_pass_rate)
- [ ] Code coverage evaluated (threshold: min_coverage)
- [ ] P1 decision recorded: PASS or CONCERNS

**P2/P3 Criteria Evaluation:**

- [ ] P2 failures tracked (informational, don't block if allow_p2_failures: true)
- [ ] P3 failures tracked (informational, don't block if allow_p3_failures: true)
- [ ] Residual risks documented

**Final Decision:**

- [ ] Decision determined: PASS / CONCERNS / FAIL / WAIVED
- [ ] Decision rationale documented
- [ ] Decision is deterministic (follows rules, not arbitrary)

### Step 4: Documentation

**Gate Decision Document Created:**

- [ ] Story/epic/release info section complete (ID, title, description, links)
- [ ] Decision clearly stated (PASS / CONCERNS / FAIL / WAIVED)
- [ ] Decision date recorded
- [ ] Evaluator recorded (user or agent name)

**Evidence Summary Documented:**

- [ ] Test results summary complete (total, passed, failed, pass rates)
- [ ] Coverage summary complete (P0/P1 criteria, code coverage)
- [ ] NFR validation summary complete (security, performance, reliability, maintainability)
- [ ] Flakiness summary complete (burn-in iterations, flaky test count)

**Rationale Documented:**

- [ ] Decision rationale clearly explained
- [ ] Key evidence highlighted
- [ ] Assumptions and caveats noted (if any)

**Residual Risks Documented (if CONCERNS or WAIVED):**

- [ ] Unresolved P1/P2 issues listed
- [ ] Probability × impact estimated for each risk
- [ ] Mitigations or workarounds described

**Waivers Documented (if WAIVED):**

- [ ] Waiver reason documented (business justification)
- [ ] Waiver approver documented (name, role)
- [ ] Waiver expiry date documented
- [ ] Remediation plan documented (fix in next release, due date)
- [ ] Monitoring plan documented

**Critical Issues Documented (if FAIL or CONCERNS):**

- [ ] Top 5-10 critical issues listed
- [ ] Priority assigned to each issue (P0/P1/P2)
- [ ] Owner assigned to each issue
- [ ] Due date assigned to each issue

**Recommendations Documented:**

- [ ] Next steps clearly stated for decision type
- [ ] Deployment recommendation provided
- [ ] Monitoring recommendations provided (if applicable)
- [ ] Remediation recommendations provided (if applicable)

### Step 5: Status Updates and Notifications

**Status File Updated:**

- [ ] Gate decision appended to bmm-workflow-status.md (if append_to_history: true)
- [ ] Format correct: `[DATE] Gate Decision: DECISION - Target {ID} - {rationale}`
- [ ] Status file committed or staged for commit

**Gate YAML Created:**

- [ ] Gate YAML snippet generated with decision and criteria
- [ ] Evidence references included in YAML
- [ ] Next steps included in YAML
- [ ] YAML file saved to output folder

**Stakeholder Notification Generated:**

- [ ] Notification subject line created
- [ ] Notification body created with summary
- [ ] Recipients identified (PM, SM, DEV lead, stakeholders)
- [ ] Notification ready for delivery (if notify_stakeholders: true)

**Outputs Saved:**

- [ ] Gate decision document saved to `{output_file}`
- [ ] Gate YAML saved to `{output_folder}/gate-decision-{target}.yaml`
- [ ] All outputs are valid and readable

---

## Output Validation

### Gate Decision Document

**Completeness:**

- [ ] All required sections present (info, decision, evidence, rationale, next steps)
- [ ] No placeholder text or TODOs left in document
- [ ] All evidence references are accurate and complete
- [ ] All links to artifacts are valid

**Accuracy:**

- [ ] Decision matches applied criteria rules
- [ ] Test results match CI/CD pipeline output
- [ ] Coverage percentages match reports
- [ ] NFR status matches assessment document
- [ ] No contradictions or inconsistencies

**Clarity:**

- [ ] Decision rationale is clear and unambiguous
- [ ] Technical jargon is explained or avoided
- [ ] Stakeholders can understand next steps
- [ ] Recommendations are actionable

### Gate YAML

**Format:**

- [ ] YAML is valid (no syntax errors)
- [ ] All required fields present (target, decision, date, evaluator, criteria, evidence)
- [ ] Field values are correct data types (numbers, strings, dates)

**Content:**

- [ ] Criteria values match decision document
- [ ] Evidence references are accurate
- [ ] Next steps align with decision type

---

## Quality Checks

### Decision Integrity

- [ ] Decision is deterministic (follows rules, not arbitrary)
- [ ] P0 failures result in FAIL decision (unless waived)
- [ ] Security issues result in FAIL decision (unless waived - but should never be waived)
- [ ] Waivers have business justification and approver (if WAIVED)
- [ ] Residual risks are documented (if CONCERNS or WAIVED)

### Evidence-Based

- [ ] Decision is based on actual test results (not guesses)
- [ ] All claims are supported by evidence
- [ ] No assumptions without documentation
- [ ] Evidence sources are cited (CI run IDs, report URLs)

### Transparency

- [ ] Decision rationale is transparent and auditable
- [ ] Criteria evaluation is documented step-by-step
- [ ] Any deviations from standard process are explained
- [ ] Waiver justifications are clear (if applicable)

### Consistency

- [ ] Decision aligns with risk-governance knowledge fragment
- [ ] Priority framework (P0/P1/P2/P3) applied consistently
- [ ] Terminology consistent with test-quality knowledge fragment
- [ ] Decision matrix followed correctly

---

## Integration Points

### BMad Workflow Status

- [ ] Gate decision added to `bmm-workflow-status.md`
- [ ] Format matches existing gate history entries
- [ ] Timestamp is accurate
- [ ] Decision summary is concise (<80 chars)

### CI/CD Pipeline

- [ ] Gate YAML is CI/CD-compatible
- [ ] YAML can be parsed by pipeline automation
- [ ] Decision can be used to block/allow deployments
- [ ] Evidence references are accessible to pipeline

### Stakeholders

- [ ] Notification message is clear and actionable
- [ ] Decision is explained in non-technical terms
- [ ] Next steps are specific and time-bound
- [ ] Recipients are appropriate for decision type

---

## Compliance and Audit

### Audit Trail

- [ ] Decision date and time recorded
- [ ] Evaluator identified (user or agent)
- [ ] All evidence sources cited
- [ ] Decision criteria documented
- [ ] Rationale clearly explained

### Traceability

- [ ] Gate decision traceable to story/epic/release
- [ ] Evidence traceable to specific test runs
- [ ] Assessments traceable to workflows that created them
- [ ] Waiver traceable to approver (if applicable)

### Compliance

- [ ] Security requirements validated (no unresolved vulnerabilities)
- [ ] Quality standards met or waived with justification
- [ ] Regulatory requirements addressed (if applicable)
- [ ] Documentation sufficient for external audit

---

## Edge Cases and Exceptions

### Missing Evidence

- [ ] If test-design.md missing, decision still possible with test results + trace
- [ ] If traceability-matrix.md missing, decision still possible with test results
- [ ] If nfr-assessment.md missing, NFR validation marked as NOT ASSESSED
- [ ] If code coverage missing, coverage criterion marked as NOT ASSESSED
- [ ] User acknowledged gaps in evidence or provided alternative proof

### Stale Evidence

- [ ] Evidence freshness checked (if validate_evidence_freshness: true)
- [ ] Warnings issued for assessments >7 days old
- [ ] User acknowledged stale evidence or re-ran workflows
- [ ] Decision document notes any stale evidence used

### Conflicting Evidence

- [ ] Conflicts between test results and assessments resolved
- [ ] Most recent/authoritative source identified
- [ ] Conflict resolution documented in decision rationale
- [ ] User consulted if conflict cannot be resolved

### Waiver Scenarios

- [ ] Waiver only used for FAIL decision (not PASS or CONCERNS)
- [ ] Waiver has business justification (not technical convenience)
- [ ] Waiver has named approver with authority (VP/CTO/PO)
- [ ] Waiver has expiry date (does NOT apply to future releases)
- [ ] Waiver has remediation plan with concrete due date
- [ ] Security vulnerabilities are NOT waived (enforced)

---

## Final Validation

### Document Review

- [ ] Gate decision document reviewed for accuracy
- [ ] Gate YAML reviewed for correctness
- [ ] Notification message reviewed for clarity
- [ ] Status file update reviewed for format

### Stakeholder Communication

- [ ] Decision communicated to PM (if applicable)
- [ ] Decision communicated to SM (if applicable)
- [ ] Decision communicated to DEV lead (if applicable)
- [ ] Decision communicated to stakeholders (if notify_stakeholders: true)

### Next Steps Identified

- [ ] **For PASS**: Deployment steps documented, monitoring plan identified
- [ ] **For CONCERNS**: Monitoring plan documented, remediation backlog created
- [ ] **For FAIL**: Blockers documented, fix assignments confirmed, re-gate planned
- [ ] **For WAIVED**: Business approval confirmed, monitoring escalated, remediation scheduled

### Workflow Complete

- [ ] All checklist items completed
- [ ] All outputs validated and saved
- [ ] All stakeholders notified
- [ ] Gate decision is final and documented
- [ ] Ready to proceed to next phase (deploy, fix, or escalate)

---

## Notes

Record any issues, deviations, or important observations during workflow execution:

- **Evidence Issues**: [Note any missing, stale, or conflicting evidence]
- **Decision Rationale**: [Document any nuanced reasoning or edge cases]
- **Waiver Details**: [Document waiver negotiations or approvals]
- **Follow-up Actions**: [List any actions required after gate decision]
