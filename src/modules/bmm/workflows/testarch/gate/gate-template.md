# Gate Decision: {target_id} ({feature_name})

**Decision:** {PASS | CONCERNS | FAIL | WAIVED}
**Date:** {YYYY-MM-DD}
**Evaluator:** {user_name or TEA Agent}
**Gate Type:** {story | epic | release | hotfix}

---

## Story/Epic/Release Information

- **ID**: {story_id | epic_num | release_version}
- **Title**: {feature_name}
- **Description**: {brief_description}
- **Links**:
  - Story/Epic File: `{file_path}`
  - Test Design: `{test_design_file_path}` (if available)
  - Traceability Matrix: `{trace_file_path}` (if available)
  - NFR Assessment: `{nfr_file_path}` (if available)

---

## Evidence Summary

### Test Results

- **Total Tests**: {total_count}
- **Passed**: {passed_count} ({pass_percentage}%)
- **Failed**: {failed_count} ({fail_percentage}%)
- **Skipped**: {skipped_count} ({skip_percentage}%)
- **Duration**: {total_duration}

**Priority Breakdown:**

- **P0 Tests**: {p0_passed}/{p0_total} passed ({p0_pass_rate}%) {✅ | ❌}
- **P1 Tests**: {p1_passed}/{p1_total} passed ({p1_pass_rate}%) {✅ | ⚠️ | ❌}
- **P2 Tests**: {p2_passed}/{p2_total} passed ({p2_pass_rate}%) {informational}
- **P3 Tests**: {p3_passed}/{p3_total} passed ({p3_pass_rate}%) {informational}

**Overall Pass Rate**: {overall_pass_rate}% {✅ | ⚠️ | ❌}

**Test Results Source**: {CI_run_id | test_report_url | local_run}

---

### Coverage Summary

**Requirements Coverage:**

- **P0 Acceptance Criteria**: {p0_covered}/{p0_total} covered ({p0_coverage}%) {✅ | ❌}
- **P1 Acceptance Criteria**: {p1_covered}/{p1_total} covered ({p1_coverage}%) {✅ | ⚠️ | ❌}
- **P2 Acceptance Criteria**: {p2_covered}/{p2_total} covered ({p2_coverage}%) {informational}
- **Overall Coverage**: {overall_coverage}%

**Code Coverage** (if available):

- **Line Coverage**: {line_coverage}% {✅ | ⚠️ | ❌}
- **Branch Coverage**: {branch_coverage}% {✅ | ⚠️ | ❌}
- **Function Coverage**: {function_coverage}% {✅ | ⚠️ | ❌}

**Coverage Gaps**: {gap_count} gaps identified

- {list_of_critical_gaps}

**Coverage Source**: {coverage_report_url | coverage_file_path}

---

### Non-Functional Requirements (NFRs)

**Security**: {PASS | CONCERNS | FAIL | NOT_ASSESSED} {✅ | ⚠️ | ❌}

- Security Issues: {security_issue_count}
- {details_if_issues}

**Performance**: {PASS | CONCERNS | FAIL | NOT_ASSESSED} {✅ | ⚠️ | ❌}

- {performance_metrics_summary}

**Reliability**: {PASS | CONCERNS | FAIL | NOT_ASSESSED} {✅ | ⚠️ | ❌}

- {reliability_metrics_summary}

**Maintainability**: {PASS | CONCERNS | FAIL | NOT_ASSESSED} {✅ | ⚠️ | ❌}

- {maintainability_metrics_summary}

**NFR Source**: {nfr_assessment_file_path | not_assessed}

---

### Flakiness Validation

**Burn-in Results** (if available):

- **Burn-in Iterations**: {iteration_count} (e.g., 10)
- **Flaky Tests Detected**: {flaky_test_count} {✅ if 0 | ❌ if >0}
- **Stability Score**: {stability_percentage}%

**Flaky Tests List** (if any):

- {flaky_test_1_name} - {failure_rate}
- {flaky_test_2_name} - {failure_rate}
- {flaky_test_3_name} - {failure_rate}

**Burn-in Source**: {CI_burn_in_run_id | not_available}

---

## Decision Criteria Evaluation

### P0 Criteria (Must ALL Pass)

| Criterion             | Threshold | Actual                    | Status   |
| --------------------- | --------- | ------------------------- | -------- | -------- |
| P0 Test Pass Rate     | 100%      | {p0_pass_rate}%           | {✅ PASS | ❌ FAIL} |
| P0 Criteria Coverage  | 100%      | {p0_coverage}%            | {✅ PASS | ❌ FAIL} |
| Security Issues       | 0         | {security_issue_count}    | {✅ PASS | ❌ FAIL} |
| Critical NFR Failures | 0         | {critical_nfr_fail_count} | {✅ PASS | ❌ FAIL} |
| Flaky Tests           | 0         | {flaky_test_count}        | {✅ PASS | ❌ FAIL} |

**P0 Evaluation**: {✅ ALL PASS | ❌ ONE OR MORE FAILED}

---

### P1 Criteria (Required for PASS, May Accept for CONCERNS)

| Criterion              | Threshold                 | Actual               | Status   |
| ---------------------- | ------------------------- | -------------------- | -------- | ----------- | -------- |
| P1 Test Pass Rate      | ≥{min_p1_pass_rate}%      | {p1_pass_rate}%      | {✅ PASS | ⚠️ CONCERNS | ❌ FAIL} |
| P1 Criteria Coverage   | ≥95%                      | {p1_coverage}%       | {✅ PASS | ⚠️ CONCERNS | ❌ FAIL} |
| Overall Test Pass Rate | ≥{min_overall_pass_rate}% | {overall_pass_rate}% | {✅ PASS | ⚠️ CONCERNS | ❌ FAIL} |
| Code Coverage          | ≥{min_coverage}%          | {code_coverage}%     | {✅ PASS | ⚠️ CONCERNS | ❌ FAIL} |

**P1 Evaluation**: {✅ ALL PASS | ⚠️ SOME CONCERNS | ❌ FAILED}

---

### P2/P3 Criteria (Informational, Don't Block)

| Criterion         | Actual          | Notes                                                        |
| ----------------- | --------------- | ------------------------------------------------------------ |
| P2 Test Pass Rate | {p2_pass_rate}% | {allow_p2_failures ? "Tracked, doesn't block" : "Evaluated"} |
| P3 Test Pass Rate | {p3_pass_rate}% | {allow_p3_failures ? "Tracked, doesn't block" : "Evaluated"} |

---

## Rationale

{Explain decision based on criteria evaluation}

{Highlight key evidence that drove decision}

{Note any assumptions or caveats}

**Example (PASS):**

> All P0 criteria met with 100% pass rates across critical tests. All P1 criteria exceeded thresholds with 98% overall pass rate and 87% code coverage. No security issues detected. No flaky tests in burn-in validation. Feature is ready for production deployment with standard monitoring.

**Example (CONCERNS):**

> All P0 criteria met, ensuring critical user journeys are protected. However, P1 pass rate (89%) falls below threshold (95%) due to edge cases in international currency handling. Code coverage (78%) is slightly below target (80%) due to missing tests for admin override flow. Issues are non-critical and have acceptable workarounds. Risk is low enough to deploy with enhanced monitoring.

**Example (FAIL):**

> CRITICAL BLOCKERS DETECTED:
>
> 1. P0 test failures (80% pass rate) in core search functionality prevent safe deployment
> 2. Unresolved SQL injection vulnerability in search filter poses CRITICAL security risk
> 3. Code coverage (68%) significantly below minimum threshold (80%)
>
> Release MUST BE BLOCKED until P0 issues are resolved. Security vulnerability cannot be waived.

**Example (WAIVED):**

> Original decision was FAIL due to P0 test failure in legacy Excel 2007 export module (affects <1% of users). However, release contains critical GDPR compliance features required by regulatory deadline (Oct 15). Business has approved waiver given:
>
> - Regulatory priority overrides legacy module risk
> - Workaround available (use Excel 2010+)
> - Issue will be fixed in v2.4.1 hotfix (due Oct 20)
> - Enhanced monitoring in place

---

## {Section: Delete if not applicable}

### Residual Risks (For CONCERNS or WAIVED)

List unresolved P1/P2 issues that don't block release but should be tracked:

1. **{Risk Description}**
   - **Priority**: P1 | P2
   - **Probability**: Low | Medium | High
   - **Impact**: Low | Medium | High
   - **Risk Score**: {probability × impact}
   - **Mitigation**: {workaround or monitoring plan}
   - **Remediation**: {fix in next sprint/release}

2. **{Risk Description}**
   - **Priority**: P1 | P2
   - **Probability**: Low | Medium | High
   - **Impact**: Low | Medium | High
   - **Risk Score**: {probability × impact}
   - **Mitigation**: {workaround or monitoring plan}
   - **Remediation**: {fix in next sprint/release}

**Overall Residual Risk**: {LOW | MEDIUM | HIGH}

---

### Waiver Details (For WAIVED only)

**Original Decision**: ❌ FAIL

**Reason for Failure**:

- {list_of_blocking_issues}

**Waiver Information**:

- **Waiver Reason**: {business_justification}
- **Waiver Approver**: {name}, {role} (e.g., Jane Doe, VP Engineering)
- **Approval Date**: {YYYY-MM-DD}
- **Waiver Expiry**: {YYYY-MM-DD} (**NOTE**: Does NOT apply to next release)

**Monitoring Plan**:

- {enhanced_monitoring_1}
- {enhanced_monitoring_2}
- {escalation_criteria}

**Remediation Plan**:

- **Fix Target**: {next_release_version} (e.g., v2.4.1 hotfix)
- **Due Date**: {YYYY-MM-DD}
- **Owner**: {team_or_person}
- **Verification**: {how_fix_will_be_verified}

**Business Justification**:
{detailed_explanation_of_why_waiver_is_acceptable}

---

### Critical Issues (For FAIL or CONCERNS)

Top blockers requiring immediate attention:

| Priority | Issue         | Description         | Owner        | Due Date     | Status             |
| -------- | ------------- | ------------------- | ------------ | ------------ | ------------------ |
| P0       | {issue_title} | {brief_description} | {owner_name} | {YYYY-MM-DD} | {OPEN/IN_PROGRESS} |
| P0       | {issue_title} | {brief_description} | {owner_name} | {YYYY-MM-DD} | {OPEN/IN_PROGRESS} |
| P1       | {issue_title} | {brief_description} | {owner_name} | {YYYY-MM-DD} | {OPEN/IN_PROGRESS} |
| P1       | {issue_title} | {brief_description} | {owner_name} | {YYYY-MM-DD} | {OPEN/IN_PROGRESS} |

**Blocking Issues Count**: {p0_blocker_count} P0 blockers, {p1_blocker_count} P1 issues

---

## Recommendations

### For PASS Decision

1. **Proceed to deployment**
   - Deploy to staging environment
   - Validate with smoke tests
   - Monitor key metrics for 24-48 hours
   - Deploy to production with standard monitoring

2. **Post-Deployment Monitoring**
   - {metric_1_to_monitor}
   - {metric_2_to_monitor}
   - {alert_thresholds}

3. **Success Criteria**
   - {success_criterion_1}
   - {success_criterion_2}

---

### For CONCERNS Decision

1. **Deploy with Enhanced Monitoring**
   - Deploy to staging with extended validation period
   - Enable enhanced logging/monitoring for known risk areas:
     - {risk_area_1}
     - {risk_area_2}
   - Set aggressive alerts for potential issues
   - Deploy to production with caution

2. **Create Remediation Backlog**
   - Create story: "{fix_title_1}" (Priority: {priority})
   - Create story: "{fix_title_2}" (Priority: {priority})
   - Target sprint: {next_sprint}

3. **Post-Deployment Actions**
   - Monitor {specific_areas} closely for {time_period}
   - Weekly status updates on remediation progress
   - Re-assess after fixes deployed

---

### For FAIL Decision

1. **Block Deployment Immediately**
   - Do NOT deploy to any environment
   - Notify stakeholders of blocking issues
   - Escalate to tech lead and PM

2. **Fix Critical Issues**
   - Address P0 blockers listed in Critical Issues section
   - Owner assignments confirmed
   - Due dates agreed upon
   - Daily standup on blocker resolution

3. **Re-Run Gate After Fixes**
   - Re-run full test suite after fixes
   - Re-run affected quality workflows:
     - `bmad tea *trace` (if coverage was issue)
     - `bmad tea *nfr-assess` (if NFRs were issue)
   - Re-run gate workflow: `bmad tea *gate`
   - Verify decision is PASS before deploying

---

### For WAIVED Decision

1. **Deploy with Business Approval**
   - Confirm waiver approver has signed off
   - Document waiver in release notes
   - Notify all stakeholders of waived risks

2. **Aggressive Monitoring**
   - {enhanced_monitoring_plan}
   - {escalation_procedures}
   - Daily checks on waived risk areas

3. **Mandatory Remediation**
   - Fix MUST be completed by {due_date}
   - Issue CANNOT be waived in next release
   - Track remediation progress weekly
   - Verify fix in next gate

---

## Next Steps

**Immediate Actions** (next 24-48 hours):

1. {action_1}
2. {action_2}
3. {action_3}

**Follow-up Actions** (next sprint/release):

1. {action_1}
2. {action_2}
3. {action_3}

**Stakeholder Communication**:

- Notify PM: {decision_summary}
- Notify SM: {decision_summary}
- Notify DEV lead: {decision_summary}
- Notify stakeholders: {decision_summary}

---

## Gate Decision YAML (CI/CD Integration)

```yaml
gate_decision:
  target: '{target_id}'
  type: '{story | epic | release | hotfix}'
  decision: '{PASS | CONCERNS | FAIL | WAIVED}'
  date: '{YYYY-MM-DD}'
  evaluator: '{user_name or TEA Agent}'

  criteria:
    p0_pass_rate: { p0_pass_rate }
    p1_pass_rate: { p1_pass_rate }
    overall_pass_rate: { overall_pass_rate }
    code_coverage: { code_coverage }
    security_issues: { security_issue_count }
    critical_nfrs_fail: { critical_nfr_fail_count }
    flaky_tests: { flaky_test_count }

  thresholds:
    min_p0_pass_rate: 100
    min_p1_pass_rate: { min_p1_pass_rate }
    min_overall_pass_rate: { min_overall_pass_rate }
    min_coverage: { min_coverage }

  evidence:
    test_results: '{CI_run_id | test_report_url}'
    traceability: '{trace_file_path}'
    nfr_assessment: '{nfr_file_path}'
    code_coverage: '{coverage_report_url}'
    burn_in: '{burn_in_run_id}'

  next_steps: '{brief_summary_of_recommendations}'

  waiver: # Only if WAIVED
    reason: '{business_justification}'
    approver: '{name}, {role}'
    expiry: '{YYYY-MM-DD}'
    remediation_due: '{YYYY-MM-DD}'
```

---

## Audit Trail

**Created**: {YYYY-MM-DD HH:MM:SS}
**Modified**: {YYYY-MM-DD HH:MM:SS} (if updated)
**Version**: 1.0
**Document ID**: gate-decision-{target_id}-{YYYYMMDD}
**Workflow**: testarch-gate v4.0

---

## Appendices

### Evidence Files Referenced

- Story/Epic: `{file_path}`
- Test Design: `{test_design_file_path}`
- Traceability Matrix: `{trace_file_path}`
- NFR Assessment: `{nfr_file_path}`
- Test Results: `{test_results_path}`
- Code Coverage: `{coverage_report_path}`
- Burn-in Results: `{burn_in_results_path}`

### Knowledge Base Fragments Consulted

- `risk-governance.md` - Risk-based quality gate criteria
- `probability-impact.md` - Risk scoring framework
- `test-quality.md` - Definition of Done for tests
- `test-priorities.md` - P0/P1/P2/P3 priority framework
- `ci-burn-in.md` - Flakiness detection patterns

### Related Documents

- PRD: `{prd_file_path}` (if applicable)
- Tech Spec: `{tech_spec_file_path}` (if applicable)
- Architecture: `{architecture_file_path}` (if applicable)
