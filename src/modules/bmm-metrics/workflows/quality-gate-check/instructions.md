# Quality Gate Check Instructions

## Objective
Validate a story or release candidate against defined quality gates. This is a critical workflow that determines whether code can proceed to release.

## Prerequisites
- Story ID or release candidate ID to validate
- Quality gate definitions in module config
- Access to story context and test results

---

<step n="1" goal="Identify validation target">

### Identify What We're Validating

<ask>What would you like to validate?
- Provide a **story ID** (e.g., STORY-123)
- Or a **release candidate ID** if validating a batch

Story/Release ID: </ask>

<action>Store response as {{target_id}}</action>
<action>Determine if this is a single story or release candidate</action>

</step>

---

<step n="2" goal="Load quality gate definitions">

### Load Quality Gate Configuration

<action>Load quality gates from {config_source}:quality_gates</action>

**Configured Quality Gates:**

| Gate | Threshold | Blocking |
|------|-----------|----------|
| Test Coverage | {quality_gates.test_coverage.threshold}% | {quality_gates.test_coverage.blocking} |
| Test Pass Rate | {quality_gates.test_pass_rate.threshold}% | {quality_gates.test_pass_rate.blocking} |
| Code Review | Required: {quality_gates.code_review.required} | {quality_gates.code_review.blocking} |
| No Critical Issues | Required: {quality_gates.no_critical_issues.required} | {quality_gates.no_critical_issues.blocking} |
| No Security Vulns | Required: {quality_gates.no_security_vulnerabilities.required} | {quality_gates.no_security_vulnerabilities.blocking} |
| Documentation | Required: {quality_gates.documentation_complete.required} | {quality_gates.documentation_complete.blocking} |

<ask>Check all gates or specific ones?
[a] All gates
[s] Select specific gates

Choice: </ask>

</step>

---

<step n="3" goal="Gather current values for each gate">

### Gather Quality Data

For each gate, we need to gather the current value:

#### 3.1 Test Coverage
<action>Query test coverage for {{target_id}}</action>
<ask>What is the current test coverage percentage?
(Enter number, e.g., 85): </ask>
<action>Store as {{test_coverage_actual}}</action>

#### 3.2 Test Pass Rate
<action>Query test results for {{target_id}}</action>
<ask>Test results:
- Total tests:
- Passed:
- Failed:

Or enter pass rate directly (e.g., 100): </ask>
<action>Calculate or store as {{test_pass_rate_actual}}</action>

#### 3.3 Code Review Status
<ask>Has the code been reviewed and approved?
[y] Yes - approved
[n] No - not yet reviewed
[c] Changes requested (not approved)

Status: </ask>
<action>Store as {{code_review_actual}}</action>

#### 3.4 Critical Issues
<ask>Are there any open critical or blocker issues?
[n] No critical issues
[y] Yes - list them

Status: </ask>
<action>Store as {{critical_issues_actual}}</action>

#### 3.5 Security Vulnerabilities
<ask>Are there any high or critical security vulnerabilities?
[n] No vulnerabilities found
[y] Yes - describe them

Status: </ask>
<action>Store as {{security_vulns_actual}}</action>

#### 3.6 Documentation (if applicable)
<check if="quality_gates.documentation_complete.required == true">
<ask>Is required documentation complete?
[y] Yes - documentation updated
[n] No - documentation pending

Status: </ask>
<action>Store as {{docs_actual}}</action>
</check>

</step>

---

<step n="4" goal="Evaluate each gate">

### Evaluate Quality Gates

<action>For each gate, compare actual value against threshold</action>

**Gate Evaluation Results:**

| Gate | Threshold | Actual | Status | Blocking |
|------|-----------|--------|--------|----------|
| Test Coverage | ≥{quality_gates.test_coverage.threshold}% | {{test_coverage_actual}}% | {{coverage_status}} | {quality_gates.test_coverage.blocking} |
| Test Pass Rate | ={quality_gates.test_pass_rate.threshold}% | {{test_pass_rate_actual}}% | {{tests_status}} | {quality_gates.test_pass_rate.blocking} |
| Code Review | Approved | {{code_review_actual}} | {{review_status}} | {quality_gates.code_review.blocking} |
| Critical Issues | None | {{critical_issues_actual}} | {{issues_status}} | {quality_gates.no_critical_issues.blocking} |
| Security Vulns | None | {{security_vulns_actual}} | {{security_status}} | {quality_gates.no_security_vulnerabilities.blocking} |
| Documentation | Complete | {{docs_actual}} | {{docs_status}} | {quality_gates.documentation_complete.blocking} |

<action>Calculate overall_score as percentage of gates passed</action>
<action>Determine if any BLOCKING gates failed</action>

</step>

---

<step n="5" goal="Determine overall result">

### Overall Quality Gate Result

<check if="all blocking gates passed">
  <action>Set result = PASS</action>
  <action>Set blocking = false</action>

  ## ✅ QUALITY GATES PASSED

  All blocking quality gates have been validated successfully.

  **Overall Score:** {{overall_score}}%
  **Blocking Gates Failed:** 0
  **Non-Blocking Warnings:** {{warning_count}}

  This story/release is **cleared for deployment**.

  <check if="warning_count > 0">
  **Warnings (non-blocking):**
  {{warnings_list}}
  </check>
</check>

<check if="any blocking gate failed">
  <action>Set result = FAIL</action>
  <action>Set blocking = true</action>

  ## ❌ QUALITY GATES FAILED

  One or more blocking quality gates have failed.

  **Overall Score:** {{overall_score}}%
  **Blocking Gates Failed:** {{blocking_failures_count}}

  This story/release is **NOT cleared for deployment**.

  **Failed Gates:**
  {{failed_gates_list}}

  **Remediation Steps:**
  {{remediation_steps}}
</check>

</step>

---

<step n="6" goal="Publish quality gate event" critical="true">

### Publish Quality Gate Result

<check if="result == PASS">
  <publish event="metrics.quality.pass">
    <payload>
      <story_id>{{target_id}}</story_id>
      <release_candidate_id>{{release_candidate_id}}</release_candidate_id>
      <gates_checked>{{gates_checked_list}}</gates_checked>
      <gate_results>{{gate_results_array}}</gate_results>
      <overall_score>{{overall_score}}</overall_score>
      <timestamp>{{current_timestamp}}</timestamp>
    </payload>
  </publish>

  <action>Log: "Quality gates PASSED for {{target_id}} - event published to bmm-release"</action>
</check>

<check if="result == FAIL">
  <publish event="metrics.quality.fail">
    <payload>
      <story_id>{{target_id}}</story_id>
      <release_candidate_id>{{release_candidate_id}}</release_candidate_id>
      <failed_gates>{{failed_gates_array}}</failed_gates>
      <blocking>{{blocking}}</blocking>
      <remediation_steps>{{remediation_steps_array}}</remediation_steps>
      <timestamp>{{current_timestamp}}</timestamp>
    </payload>
  </publish>

  <action>Log: "Quality gates FAILED for {{target_id}} - release blocked"</action>
</check>

</step>

---

<step n="7" goal="Generate report">

### Generate Quality Gate Report

<template-output section="quality-gate-report">
Generate a detailed quality gate report including:
- Target validated (story/release ID)
- Timestamp of validation
- Each gate checked with actual vs threshold
- Overall pass/fail status
- Recommendations if any gates failed
- Link to detailed test/coverage reports if available
</template-output>

</step>

---

## Completion

Quality gate validation complete for **{{target_id}}**.

**Result:** {{result}}
**Event Published:** metrics.quality.{{result_lower}}
**Report Saved:** {{output_file_path}}

<check if="result == PASS">
The bmm-release module will receive the `metrics.quality.pass` event and can proceed with release planning.
</check>

<check if="result == FAIL">
Address the failed gates and run quality-gate-check again when ready.
</check>
