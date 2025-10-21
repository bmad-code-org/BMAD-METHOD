# Requirements Traceability & Quality Gate Workflow

**Workflow ID:** `testarch-trace`
**Agent:** Test Architect (TEA)
**Command:** `bmad tea *trace`

---

## Overview

The **trace** workflow operates in two sequential phases to validate test coverage and deployment readiness:

**PHASE 1 - REQUIREMENTS TRACEABILITY:** Generates comprehensive requirements-to-tests traceability matrix that maps acceptance criteria to implemented tests, identifies coverage gaps, and provides actionable recommendations.

**PHASE 2 - QUALITY GATE DECISION:** Makes deterministic release decisions (PASS/CONCERNS/FAIL/WAIVED) based on traceability results, test execution evidence, and non-functional requirements validation.

**Key Features:**

- Maps acceptance criteria to specific test cases across all levels (E2E, API, Component, Unit)
- Classifies coverage status (FULL, PARTIAL, NONE, UNIT-ONLY, INTEGRATION-ONLY)
- Prioritizes gaps by risk level (P0/P1/P2/P3)
- Applies deterministic decision rules for deployment readiness
- Generates gate decisions with evidence and rationale
- Supports waivers for business-approved exceptions
- Updates workflow status and notifies stakeholders
- Creates CI/CD-ready YAML snippets for quality gates
- Detects duplicate coverage across test levels
- Verifies test quality (assertions, structure, performance)

---

## When to Use This Workflow

Use `*trace` when you need to:

### Phase 1 - Traceability

- ✅ Validate that all acceptance criteria have test coverage
- ✅ Identify coverage gaps before release or PR merge
- ✅ Generate traceability documentation for compliance or audits
- ✅ Ensure critical paths (P0/P1) are fully tested
- ✅ Detect duplicate coverage across test levels
- ✅ Assess test quality across your suite

### Phase 2 - Gate Decision (Optional)

- ✅ Make final go/no-go deployment decision
- ✅ Validate test execution results against thresholds
- ✅ Evaluate non-functional requirements (security, performance)
- ✅ Generate audit trail for release approval
- ✅ Handle business waivers for critical deadlines
- ✅ Notify stakeholders of gate decision

**Typical Timing:**

- After tests are implemented (post-ATDD or post-development)
- Before merging a PR (validate P0/P1 coverage)
- Before release (validate full coverage and make gate decision)
- During sprint retrospectives (assess test quality)

---

## Prerequisites

### Phase 1 - Traceability (Required)

- Acceptance criteria (from story file OR inline)
- Implemented test suite (or acknowledged gaps)

### Phase 2 - Gate Decision (Required if `enable_gate_decision: true`)

- Test execution results (CI/CD test reports, pass/fail rates)
- Test design with risk priorities (P0/P1/P2/P3)

### Recommended

- `test-design.md` - Risk assessment and test priorities
- `nfr-assessment.md` - Non-functional requirements validation (for release gates)
- `tech-spec.md` - Technical implementation details
- Test framework configuration (playwright.config.ts, jest.config.js)

**Halt Conditions:**

- Story lacks any tests AND gaps are not acknowledged → Run `*atdd` first
- Acceptance criteria are completely missing → Provide criteria or story file
- Phase 2 enabled but test execution results missing → Warn and skip gate decision

---

## Usage

### Basic Usage (Both Phases)

```bash
bmad tea *trace
```

The workflow will:

1. **Phase 1**: Read story file, extract acceptance criteria, auto-discover tests, generate traceability matrix
2. **Phase 2**: Load test execution results, apply decision rules, generate gate decision document
3. Save traceability matrix to `bmad/output/traceability-matrix.md`
4. Save gate decision to `bmad/output/gate-decision-story-X.X.md`

### Phase 1 Only (Skip Gate Decision)

```bash
bmad tea *trace --enable-gate-decision false
```

### Custom Configuration

```bash
bmad tea *trace \
  --story-file "bmad/output/story-1.3.md" \
  --test-results "ci-artifacts/test-report.xml" \
  --min-p0-coverage 100 \
  --min-p1-coverage 90 \
  --min-p0-pass-rate 100 \
  --min-p1-pass-rate 95
```

### Standalone Mode (No Story File)

```bash
bmad tea *trace --acceptance-criteria "AC-1: User can login with email..."
```

---

## Workflow Steps

### PHASE 1: Requirements Traceability

1. **Load Context** - Read story, test design, tech spec, knowledge base
2. **Discover Tests** - Auto-find tests related to story (by ID, describe blocks, file paths)
3. **Map Criteria** - Link acceptance criteria to specific test cases
4. **Analyze Gaps** - Identify missing coverage and prioritize by risk
5. **Verify Quality** - Check test quality (assertions, structure, performance)
6. **Generate Deliverables** - Create traceability matrix, gate YAML, coverage badge

### PHASE 2: Quality Gate Decision (if `enable_gate_decision: true`)

7. **Gather Evidence** - Load traceability results, test execution reports, NFR assessments
8. **Apply Decision Rules** - Evaluate against thresholds (PASS/CONCERNS/FAIL/WAIVED)
9. **Document Decision** - Create gate decision document with evidence and rationale
10. **Update Status & Notify** - Append to bmm-workflow-status.md, notify stakeholders

---

## Outputs

### Phase 1: Traceability Matrix (`traceability-matrix.md`)

Comprehensive markdown file with:

- Coverage summary table (by priority)
- Detailed criterion-to-test mapping
- Gap analysis with recommendations
- Quality assessment for each test
- Gate YAML snippet

**Example:**

```markdown
# Traceability Matrix - Story 1.3

## Coverage Summary

| Priority | Total | FULL | Coverage % | Status  |
| -------- | ----- | ---- | ---------- | ------- |
| P0       | 3     | 3    | 100%       | ✅ PASS |
| P1       | 5     | 4    | 80%        | ⚠️ WARN |

Gate Status: CONCERNS ⚠️ (P1 coverage below 90%)
```

### Phase 2: Gate Decision Document (`gate-decision-{type}-{id}.md`)

**Decision Document** with:

- **Decision**: PASS / CONCERNS / FAIL / WAIVED with clear rationale
- **Evidence Summary**: Test results, coverage, NFRs, quality validation
- **Decision Criteria Table**: Each criterion with threshold, actual, status
- **Rationale**: Explanation of decision based on evidence
- **Residual Risks**: Unresolved issues (for CONCERNS/WAIVED)
- **Waiver Details**: Approver, justification, remediation plan (for WAIVED)
- **Next Steps**: Action items for each decision type

**Example:**

```markdown
# Quality Gate Decision: Story 1.3 - User Login

**Decision**: ⚠️ CONCERNS
**Date**: 2025-10-15

## Decision Criteria

| Criterion    | Threshold | Actual | Status  |
| ------------ | --------- | ------ | ------- |
| P0 Coverage  | ≥100%     | 100%   | ✅ PASS |
| P1 Coverage  | ≥90%      | 88%    | ⚠️ FAIL |
| Overall Pass | ≥90%      | 96%    | ✅ PASS |

**Decision**: CONCERNS (P1 coverage 88% below 90% threshold)

## Next Steps

- Deploy with monitoring
- Create follow-up story for AC-5 test
```

### Secondary Outputs

- **Gate YAML**: Machine-readable snippet for CI/CD integration
- **Status Update**: Appends decision to `bmm-workflow-status.md` history
- **Stakeholder Notification**: Auto-generated summary message
- **Updated Story File**: Traceability section added (optional)

---

## Decision Logic (Phase 2)

### PASS Decision ✅

**All criteria met:**

- ✅ P0 coverage ≥ 100%
- ✅ P1 coverage ≥ 90%
- ✅ Overall coverage ≥ 80%
- ✅ P0 test pass rate = 100%
- ✅ P1 test pass rate ≥ 95%
- ✅ Overall test pass rate ≥ 90%
- ✅ Security issues = 0
- ✅ Critical NFR failures = 0

**Action:** Deploy to production with standard monitoring

---

### CONCERNS Decision ⚠️

**P0 criteria met, but P1 criteria degraded:**

- ✅ P0 coverage = 100%
- ⚠️ P1 coverage 80-89% (below 90% threshold)
- ⚠️ P1 test pass rate 90-94% (below 95% threshold)
- ✅ No security issues
- ✅ No critical NFR failures

**Residual Risks:** Minor P1 issues, edge cases, non-critical gaps

**Action:** Deploy with enhanced monitoring, create backlog stories for fixes

**Note:** CONCERNS does NOT block deployment but requires acknowledgment

---

### FAIL Decision ❌

**Any P0 criterion failed:**

- ❌ P0 coverage <100% (missing critical tests)
- OR ❌ P0 test pass rate <100% (failing critical tests)
- OR ❌ P1 coverage <80% (significant gap)
- OR ❌ Security issues >0
- OR ❌ Critical NFR failures >0

**Critical Blockers:** P0 test failures, security vulnerabilities, critical NFRs

**Action:** Block deployment, fix critical issues, re-run gate after fixes

---

### WAIVED Decision 🔓

**FAIL status + business-approved waiver:**

- ❌ Original decision: FAIL
- 🔓 Waiver approved by: {VP Engineering / CTO / Product Owner}
- 📋 Business justification: {regulatory deadline, contractual obligation}
- 📅 Waiver expiry: {date - does NOT apply to future releases}
- 🔧 Remediation plan: {fix in next release, due date}

**Action:** Deploy with business approval, aggressive monitoring, fix ASAP

**Important:** Waivers NEVER apply to P0 security issues or data corruption risks

---

## Coverage Classifications (Phase 1)

- **FULL** ✅ - All scenarios validated at appropriate level(s)
- **PARTIAL** ⚠️ - Some coverage but missing edge cases or levels
- **NONE** ❌ - No test coverage at any level
- **UNIT-ONLY** ⚠️ - Only unit tests (missing integration/E2E validation)
- **INTEGRATION-ONLY** ⚠️ - Only API/Component tests (missing unit confidence)

---

## Quality Gates

| Priority | Coverage Requirement | Pass Rate Requirement | Severity | Action             |
| -------- | -------------------- | --------------------- | -------- | ------------------ |
| P0       | 100%                 | 100%                  | BLOCKER  | Do not release     |
| P1       | 90%                  | 95%                   | HIGH     | Block PR merge     |
| P2       | 80% (recommended)    | 85% (recommended)     | MEDIUM   | Address in nightly |
| P3       | No requirement       | No requirement        | LOW      | Optional           |

---

## Configuration

### workflow.yaml Variables

```yaml
variables:
  # Target specification
  story_file: '' # Path to story markdown
  acceptance_criteria: '' # Inline criteria if no story

  # Test discovery
  test_dir: '{project-root}/tests'
  auto_discover_tests: true

  # Traceability configuration
  coverage_levels: 'e2e,api,component,unit'
  map_by_test_id: true
  map_by_describe: true
  map_by_filename: true

  # Gap analysis
  prioritize_by_risk: true
  suggest_missing_tests: true
  check_duplicate_coverage: true

  # Output configuration
  output_file: '{output_folder}/traceability-matrix.md'
  generate_gate_yaml: true
  generate_coverage_badge: true
  update_story_file: true

  # Quality gates (Phase 1 recommendations)
  min_p0_coverage: 100
  min_p1_coverage: 90
  min_overall_coverage: 80

  # PHASE 2: Gate Decision Variables
  enable_gate_decision: true # Run gate decision after traceability

  # Gate target specification
  gate_type: 'story' # story | epic | release | hotfix

  # Gate decision configuration
  decision_mode: 'deterministic' # deterministic | manual
  allow_waivers: true
  require_evidence: true

  # Input sources for gate
  nfr_file: '' # Path to nfr-assessment.md (optional)
  test_results: '' # Path to test execution results (required for Phase 2)

  # Decision criteria thresholds
  min_p0_pass_rate: 100
  min_p1_pass_rate: 95
  min_overall_pass_rate: 90
  max_critical_nfrs_fail: 0
  max_security_issues: 0

  # Risk tolerance
  allow_p2_failures: true
  allow_p3_failures: true
  escalate_p1_failures: true

  # Gate output configuration
  gate_output_file: '{output_folder}/gate-decision-{gate_type}-{story_id}.md'
  append_to_history: true
  notify_stakeholders: true

  # Advanced gate options
  check_all_workflows_complete: true
  validate_evidence_freshness: true
  require_sign_off: false
```

---

## Knowledge Base Integration

This workflow automatically loads relevant knowledge fragments:

**Phase 1 (Traceability):**

- `traceability.md` - Requirements mapping patterns
- `test-priorities.md` - P0/P1/P2/P3 risk framework
- `risk-governance.md` - Risk-based testing approach
- `test-quality.md` - Definition of Done for tests
- `selective-testing.md` - Duplicate coverage patterns

**Phase 2 (Gate Decision):**

- `risk-governance.md` - Quality gate criteria and decision framework
- `probability-impact.md` - Risk scoring for residual risks
- `test-quality.md` - Quality standards validation
- `test-priorities.md` - Priority classification framework

---

## Example Scenarios

### Example 1: Full Coverage with Gate PASS

```bash
# Validate coverage and make gate decision
bmad tea *trace --story-file "bmad/output/story-1.3.md" \
  --test-results "ci-artifacts/test-report.xml"
```

**Phase 1 Output:**

```markdown
# Traceability Matrix - Story 1.3

## Coverage Summary

| Priority | Total | FULL | Coverage % | Status  |
| -------- | ----- | ---- | ---------- | ------- |
| P0       | 3     | 3    | 100%       | ✅ PASS |
| P1       | 5     | 5    | 100%       | ✅ PASS |

Gate Status: Ready for Phase 2 ✅
```

**Phase 2 Output:**

```markdown
# Quality Gate Decision: Story 1.3

**Decision**: ✅ PASS

Evidence:

- P0 Coverage: 100% ✅
- P1 Coverage: 100% ✅
- P0 Pass Rate: 100% (12/12 tests) ✅
- P1 Pass Rate: 98% (45/46 tests) ✅
- Overall Pass Rate: 96% ✅

Next Steps:

1. Deploy to staging
2. Monitor for 24 hours
3. Deploy to production
```

---

### Example 2: Gap Identification with CONCERNS Decision

```bash
# Find gaps and evaluate readiness
bmad tea *trace --story-file "bmad/output/story-2.1.md" \
  --test-results "ci-artifacts/test-report.xml"
```

**Phase 1 Output:**

```markdown
## Gap Analysis

### Critical Gaps (BLOCKER)

- None ✅

### High Priority Gaps (PR BLOCKER)

1. **AC-3: Password reset email edge cases**
   - Recommend: Add 1.3-API-001 (email service integration)
   - Impact: Users may not recover accounts in error scenarios
```

**Phase 2 Output:**

```markdown
# Quality Gate Decision: Story 2.1

**Decision**: ⚠️ CONCERNS

Evidence:

- P0 Coverage: 100% ✅
- P1 Coverage: 88% ⚠️ (below 90%)
- Test Pass Rate: 96% ✅

Residual Risks:

- AC-3 missing E2E test for email error handling

Next Steps:

- Deploy with monitoring
- Create follow-up story for AC-3 test
- Monitor production for edge cases
```

---

### Example 3: Critical Blocker with FAIL Decision

```bash
# Critical issues detected
bmad tea *trace --story-file "bmad/output/story-3.2.md" \
  --test-results "ci-artifacts/test-report.xml"
```

**Phase 1 Output:**

```markdown
## Gap Analysis

### Critical Gaps (BLOCKER)

1. **AC-2: Invalid login security validation**
   - Priority: P0
   - Status: NONE (no tests)
   - Impact: Security vulnerability - users can bypass login
```

**Phase 2 Output:**

```markdown
# Quality Gate Decision: Story 3.2

**Decision**: ❌ FAIL

Critical Blockers:

- P0 Coverage: 80% ❌ (AC-2 missing)
- Security Risk: Login bypass vulnerability

Next Steps:

1. BLOCK DEPLOYMENT IMMEDIATELY
2. Add P0 test for AC-2: 1.3-E2E-004
3. Re-run full test suite
4. Re-run gate after fixes verified
```

---

### Example 4: Business Override with WAIVED Decision

```bash
# FAIL with business waiver
bmad tea *trace --story-file "bmad/output/release-2.4.0.md" \
  --test-results "ci-artifacts/test-report.xml" \
  --allow-waivers true
```

**Phase 2 Output:**

```markdown
# Quality Gate Decision: Release 2.4.0

**Original Decision**: ❌ FAIL
**Final Decision**: 🔓 WAIVED

Waiver Details:

- Approver: Jane Doe, VP Engineering
- Reason: GDPR compliance deadline (regulatory, Oct 15)
- Expiry: 2025-10-15 (does NOT apply to v2.5.0)
- Monitoring: Enhanced error tracking
- Remediation: Fix in v2.4.1 hotfix (due Oct 20)

Business Justification:
Release contains critical GDPR features required by law. Failed
test affects legacy feature used by <1% of users. Workaround available.

Next Steps:

1. Deploy v2.4.0 with waiver approval
2. Monitor error rates aggressively
3. Fix issue in v2.4.1 (Oct 20)
```

---

## Troubleshooting

### Phase 1 Issues

#### "No tests found for this story"

- Run `*atdd` workflow first to generate failing acceptance tests
- Check test file naming conventions (may not match story ID pattern)
- Verify test directory path is correct (`test_dir` variable)

#### "Cannot determine coverage status"

- Tests may lack explicit mapping (no test IDs, unclear describe blocks)
- Add test IDs: `{STORY_ID}-{LEVEL}-{SEQ}` (e.g., `1.3-E2E-001`)
- Use Given-When-Then narrative in test descriptions

#### "P0 coverage below 100%"

- This is a **BLOCKER** - do not release
- Identify missing P0 tests in gap analysis
- Run `*atdd` workflow to generate missing tests
- Verify P0 classification is correct with stakeholders

#### "Duplicate coverage detected"

- Review `selective-testing.md` knowledge fragment
- Determine if overlap is acceptable (defense in depth) or wasteful
- Consolidate tests at appropriate level (logic → unit, journey → E2E)

### Phase 2 Issues

#### "Test execution results missing"

- Phase 2 gate decision requires `test_results` (CI/CD test reports)
- If missing, Phase 2 will be skipped with warning
- Provide JUnit XML, TAP, or JSON test report path via `test_results` variable

#### "Gate decision is FAIL but deployment needed urgently"

- Request business waiver (if `allow_waivers: true`)
- Document approver, justification, mitigation plan
- Create follow-up stories to address gaps
- Use WAIVED decision only for non-P0 gaps
- **Never waive**: Security issues, data corruption risks

#### "Assessments are stale (>7 days old)"

- Re-run `*test-design` workflow
- Re-run traceability (Phase 1)
- Re-run `*nfr-assess` workflow
- Update evidence files before gate decision

#### "Unclear decision (edge case)"

- Switch to manual mode: `decision_mode: manual`
- Document assumptions and rationale clearly
- Escalate to tech lead or architect for guidance
- Consider waiver if business-critical

---

## Integration with Other Workflows

### Before Trace

1. **testarch-test-design** - Define test priorities (P0/P1/P2/P3)
2. **testarch-atdd** - Generate failing acceptance tests
3. **testarch-automate** - Expand regression suite

### After Trace (Phase 2 Decision)

- **PASS**: Proceed to deployment workflow
- **CONCERNS**: Deploy with monitoring, create remediation backlog stories
- **FAIL**: Block deployment, fix issues, re-run trace workflow
- **WAIVED**: Deploy with business approval, escalate monitoring

### Complements

- `*trace` → **testarch-nfr-assess** - Use NFR validation in gate decision
- `*trace` → **testarch-test-review** - Flag quality issues for review
- **CI/CD Pipeline** - Use gate YAML for automated quality gates

---

## Best Practices

### Phase 1 - Traceability

1. **Run Trace After Test Implementation**
   - Don't run `*trace` before tests exist (run `*atdd` first)
   - Trace is most valuable after initial test suite is written

2. **Prioritize by Risk**
   - P0 gaps are BLOCKERS (must fix before release)
   - P1 gaps are HIGH priority (block PR merge)
   - P3 gaps are acceptable (fix if time permits)

3. **Explicit Mapping**
   - Use test IDs (`1.3-E2E-001`) for clear traceability
   - Reference criteria in describe blocks
   - Use Given-When-Then narrative

4. **Avoid Duplicate Coverage**
   - Test each behavior at appropriate level only
   - Unit tests for logic, E2E for journeys
   - Only overlap for defense in depth on critical paths

### Phase 2 - Gate Decision

5. **Evidence is King**
   - Never make gate decisions without fresh test results
   - Validate evidence freshness (<7 days old)
   - Link to all evidence sources (reports, logs, artifacts)

6. **P0 is Sacred**
   - P0 failures ALWAYS result in FAIL (no exceptions except waivers)
   - P0 = Critical user journeys, security, data integrity
   - Waivers require VP/CTO approval + business justification

7. **Waivers are Temporary**
   - Waiver applies ONLY to specific release
   - Issue must be fixed in next release
   - Never waive: security, data corruption, compliance violations

8. **CONCERNS is Not PASS**
   - CONCERNS means "deploy with monitoring"
   - Create follow-up stories for issues
   - Do not ignore CONCERNS repeatedly

9. **Automate Gate Integration**
   - Enable `generate_gate_yaml` for CI/CD integration
   - Use YAML snippets in pipeline quality gates
   - Export metrics for dashboard visualization

---

## Configuration Examples

### Strict Gate (Zero Tolerance)

```yaml
min_p0_coverage: 100
min_p1_coverage: 100
min_overall_coverage: 90
min_p0_pass_rate: 100
min_p1_pass_rate: 100
min_overall_pass_rate: 95
allow_waivers: false
max_security_issues: 0
max_critical_nfrs_fail: 0
```

Use for: Financial systems, healthcare, security-critical features

---

### Balanced Gate (Production Standard - Default)

```yaml
min_p0_coverage: 100
min_p1_coverage: 90
min_overall_coverage: 80
min_p0_pass_rate: 100
min_p1_pass_rate: 95
min_overall_pass_rate: 90
allow_waivers: true
max_security_issues: 0
max_critical_nfrs_fail: 0
```

Use for: Most production releases

---

### Relaxed Gate (Early Development)

```yaml
min_p0_coverage: 100
min_p1_coverage: 80
min_overall_coverage: 70
min_p0_pass_rate: 100
min_p1_pass_rate: 85
min_overall_pass_rate: 80
allow_waivers: true
allow_p2_failures: true
allow_p3_failures: true
```

Use for: Alpha/beta releases, internal tools, proof-of-concept

---

## Related Commands

- `bmad tea *test-design` - Define test priorities and risk assessment
- `bmad tea *atdd` - Generate failing acceptance tests for gaps
- `bmad tea *automate` - Expand regression suite based on gaps
- `bmad tea *nfr-assess` - Validate non-functional requirements (for gate)
- `bmad tea *test-review` - Review test quality issues flagged by trace
- `bmad sm story-done` - Mark story as complete (triggers gate)

---

## Resources

- [Instructions](./instructions.md) - Detailed workflow steps (both phases)
- [Checklist](./checklist.md) - Validation checklist
- [Template](./trace-template.md) - Traceability matrix template
- [Knowledge Base](../../testarch/knowledge/) - Testing best practices

---

<!-- Powered by BMAD-CORE™ -->
