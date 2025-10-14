# Quality Gate Decision Workflow

The Quality Gate workflow makes deterministic release decisions (PASS/CONCERNS/FAIL/WAIVED) based on comprehensive quality evidence including test results, risk assessment, traceability, and non-functional requirements validation.

## Overview

This workflow is the final checkpoint before deploying a story, epic, or release to production. It evaluates all quality evidence against predefined criteria and makes a transparent, rule-based decision with complete audit trail.

**Key Features:**

- **Deterministic Decision Rules**: Clear, objective criteria eliminate bias
- **Four Decision States**: PASS (ready), CONCERNS (deploy with monitoring), FAIL (blocked), WAIVED (business override)
- **P0-P3 Risk Framework**: Prioritized evaluation of critical vs nice-to-have features
- **Evidence-Based**: Never guess - requires test results, coverage, NFR validation
- **Waiver Management**: Business-approved exceptions with remediation plans
- **Audit Trail**: Complete history of decisions with rationale
- **CI/CD Integration**: Gate YAML snippets for pipeline automation
- **Stakeholder Communication**: Auto-generated notifications with decision summary

---

## Usage

```bash
bmad tea *gate
```

The TEA agent runs this workflow when:

- Story is complete and ready for release (after `*dev story-approved`)
- Epic is complete and needs quality validation before deployment
- Release candidate needs final go/no-go decision
- Hotfix requires expedited quality assessment
- User explicitly requests gate decision: `bmad tea *gate`

**Typical workflow sequence:**

1. `*test-design` → Risk assessment with P0-P3 prioritization
2. `*atdd` → Generate failing tests before implementation
3. `*dev story` → Implement feature with tests passing
4. `*automate` → Expand regression suite
5. `*trace` → Verify requirements-to-tests coverage
6. `*nfr-assess` → Validate non-functional requirements
7. **`*gate`** → Make final release decision ⬅️ YOU ARE HERE

---

## Inputs

### Required Context Files

- **Test Results**: CI/CD pipeline results, test framework reports (Playwright HTML, Jest JSON, JUnit XML)
- **Story/Epic File**: The feature being gated (e.g., `story-1.3.md`, `epic-2.md`)

### Recommended Context Files

- **test-design.md**: Risk assessment with P0/P1/P2/P3 scenario prioritization
- **traceability-matrix.md**: Requirements-to-tests coverage analysis with gap identification
- **nfr-assessment.md**: Non-functional requirements validation (security, performance, reliability, maintainability)
- **Code Coverage Report**: Line/branch/function coverage metrics
- **Burn-in Results**: 10-iteration flakiness detection from CI pipeline

### Workflow Variables

Key variables that control gate behavior (configured in `workflow.yaml`):

- **gate_type**: `story` | `epic` | `release` | `hotfix` (default: `story`)
- **decision_mode**: `deterministic` | `manual` (default: `deterministic`)
- **min_p0_pass_rate**: Threshold for P0 tests (default: `100` - must be perfect)
- **min_p1_pass_rate**: Threshold for P1 tests (default: `95%`)
- **min_overall_pass_rate**: Overall test threshold (default: `90%`)
- **min_coverage**: Code coverage minimum (default: `80%`)
- **allow_waivers**: Enable business-approved waivers (default: `true`)
- **require_evidence**: Require links to test results/reports (default: `true`)
- **validate_evidence_freshness**: Warn if assessments >7 days old (default: `true`)

---

## Outputs

### Primary Deliverable

**Gate Decision Document** (`gate-decision-{type}-{id}.md`):

- **Decision**: PASS / CONCERNS / FAIL / WAIVED with clear rationale
- **Evidence Summary**: Test results, coverage, NFRs, flakiness validation
- **Rationale**: Explanation of decision based on criteria
- **Residual Risks**: Unresolved issues (for CONCERNS/WAIVED)
- **Waiver Details**: Approver, expiry, remediation plan (for WAIVED)
- **Critical Issues**: Top blockers with owners and due dates (for FAIL)
- **Recommendations**: Next steps for each decision type
- **Audit Trail**: Complete history for compliance/review

### Secondary Outputs

- **Gate YAML**: Machine-readable snippet for CI/CD integration
- **Status Update**: Appends decision to `bmm-workflow-status.md` history
- **Stakeholder Notification**: Auto-generated message with decision summary

### Validation Safeguards

- ✅ All required evidence sources discovered or explicitly provided
- ✅ Evidence freshness validated (warns if >7 days old)
- ✅ P0 criteria evaluated first (immediate FAIL if not met)
- ✅ Decision rules applied deterministically (no human bias)
- ✅ Waivers require business justification and remediation plan
- ✅ Audit trail maintained for transparency

---

## Decision Logic

### PASS Decision

**All criteria met:**

- ✅ P0 test pass rate = 100%
- ✅ P1 test pass rate ≥ 95%
- ✅ Overall test pass rate ≥ 90%
- ✅ Code coverage ≥ 80%
- ✅ Security issues = 0
- ✅ Critical NFR failures = 0
- ✅ Flaky tests = 0

**Action:** Deploy to production with standard monitoring

---

### CONCERNS Decision

**P0 criteria met, but P1 criteria degraded:**

- ✅ P0 test pass rate = 100%
- ⚠️ P1 test pass rate 90-94% (below 95% threshold)
- ⚠️ Code coverage 75-79% (below 80% threshold)
- ✅ No security issues
- ✅ No critical NFR failures
- ✅ No flaky tests

**Residual Risks:** Minor P1 issues, edge cases, non-critical gaps

**Action:** Deploy with enhanced monitoring, create backlog stories for fixes

---

### FAIL Decision

**Any P0 criterion failed:**

- ❌ P0 test pass rate <100%
- OR ❌ Security issues >0
- OR ❌ Critical NFR failures >0
- OR ❌ Flaky tests detected

**Critical Blockers:** P0 test failures, security vulnerabilities, critical NFRs

**Action:** Block deployment, fix critical issues, re-run gate after fixes

---

### WAIVED Decision

**FAIL status + business-approved waiver:**

- ❌ Original decision: FAIL
- 🔓 Waiver approved by: {VP Engineering / CTO / Product Owner}
- 📋 Business justification: {regulatory deadline, contractual obligation, etc.}
- 📅 Waiver expiry: {date - does NOT apply to future releases}
- 🔧 Remediation plan: {fix in next release, due date}

**Action:** Deploy with business approval, aggressive monitoring, fix ASAP

---

## Integration with Other Workflows

### Before Gate

1. **test-design** (recommended) - Provides P0-P3 risk framework
2. **atdd** (recommended) - Ensures acceptance criteria have tests
3. **automate** (recommended) - Expands regression suite
4. **trace** (recommended) - Verifies requirements coverage
5. **nfr-assess** (recommended) - Validates non-functional requirements

### After Gate

- **PASS**: Proceed to deployment workflow
- **CONCERNS**: Deploy with monitoring, create remediation backlog stories
- **FAIL**: Block deployment, fix issues, re-run gate
- **WAIVED**: Deploy with business approval, escalate monitoring

### Coordinates With

- **bmm-workflow-status.md**: Appends gate decision to history
- **CI/CD Pipeline**: Gate YAML used for automated gates
- **PM/SM**: Notification of decision and next steps

---

## Example Scenarios

### Scenario 1: Ideal Release (PASS)

```
Evidence:
- P0 tests: 15/15 passed (100%) ✅
- P1 tests: 28/29 passed (96.5%) ✅
- Overall: 98% pass rate ✅
- Coverage: 87% ✅
- Security: 0 issues ✅
- Flakiness: 0 flaky tests ✅

Decision: ✅ PASS

Rationale: All criteria exceeded thresholds. Feature ready for production.

Next Steps:
1. Deploy to staging
2. Monitor for 24 hours
3. Deploy to production
```

---

### Scenario 2: Minor Issues (CONCERNS)

```
Evidence:
- P0 tests: 12/12 passed (100%) ✅
- P1 tests: 21/24 passed (87.5%) ⚠️
- Overall: 91% pass rate ✅
- Coverage: 78% ⚠️
- Security: 0 issues ✅
- Flakiness: 0 flaky tests ✅

Decision: ⚠️ CONCERNS

Rationale: P0 criteria met, but P1 pass rate (87.5%) below threshold (95%).
Coverage (78%) slightly below target (80%). Issues are edge cases in
international date handling - low probability, workaround exists.

Residual Risks:
- P1: Date formatting edge case for Japan/Korea timezones
- Coverage: Missing tests for admin override flow

Next Steps:
1. Deploy with enhanced monitoring on date formatting
2. Create backlog story: "Fix date formatting for Asia Pacific"
3. Add admin override tests in next sprint
```

---

### Scenario 3: Critical Blocker (FAIL)

```
Evidence:
- P0 tests: 9/12 passed (75%) ❌
- Security: 1 SQL injection in search filter ❌
- Coverage: 68% ❌

Decision: ❌ FAIL

Rationale: CRITICAL BLOCKERS:
1. P0 test failures in core search functionality
2. Unresolved SQL injection vulnerability (CRITICAL)
3. Coverage below minimum threshold

Critical Issues:
| Priority | Issue | Owner | Due Date |
|----------|-------|-------|----------|
| P0 | Fix SQL injection in search filter | Backend | 2025-10-16 |
| P0 | Fix search pagination crash | Backend | 2025-10-16 |
| P0 | Fix search timeout for large datasets | Backend | 2025-10-17 |

Next Steps:
1. BLOCK DEPLOYMENT IMMEDIATELY
2. Fix P0 issues listed above
3. Re-run full test suite
4. Re-run gate after fixes verified
```

---

### Scenario 4: Business Override (WAIVED)

```
Evidence:
- P0 tests: 10/11 passed (90.9%) ❌
- Issue: Legacy report export fails for Excel 2007

Original Decision: ❌ FAIL

Waiver Details:
- Approver: Jane Doe, VP Engineering
- Reason: GDPR compliance deadline (regulatory requirement, Oct 15)
- Expiry: 2025-10-15 (does NOT apply to v2.5.0)
- Monitoring: Enhanced error tracking on report export
- Remediation: Fix in v2.4.1 hotfix (due Oct 20)

Decision: 🔓 WAIVED

Business Justification:
Release contains critical GDPR features required by law on Oct 15. Failed
test affects legacy Excel 2007 export used by <1% of users. Workaround
available (use Excel 2010+). Risk acceptable given regulatory priority.

Next Steps:
1. Deploy v2.4.0 with waiver approval
2. Monitor error rates on report export
3. Fix Excel 2007 export in v2.4.1 (Oct 20)
4. Notify affected users of workaround
```

---

## Important Notes

### Deterministic vs Manual Mode

- **Deterministic mode** (recommended): Rule-based decisions using predefined thresholds
  - Eliminates bias and ensures consistency
  - Clear audit trail of criteria evaluation
  - Faster decisions for routine releases

- **Manual mode**: Human judgment with guidance from criteria
  - Use for edge cases, unusual situations
  - Still requires evidence documentation
  - TEA provides recommendation, user makes final call

### P0 is Sacred

**P0 failures ALWAYS result in FAIL** (no exceptions except waivers):

- P0 = Critical user journeys, security, data integrity
- Cannot deploy with P0 failures - too risky
- Waivers require VP/CTO approval + business justification

### Waivers are Temporary

- Waiver applies ONLY to specific release
- Issue must be fixed in next release
- Waiver expiry date enforced
- Never waive: security, data corruption, compliance violations

### Evidence Freshness Matters

- Assessments >7 days old may be stale
- Code changes since assessment may invalidate conclusions
- Re-run workflows if evidence is outdated

### Security Never Compromised

- Security issues ALWAYS block release
- No waivers for security vulnerabilities
- Fix security issues immediately, then re-gate

---

## Knowledge Base References

This workflow automatically consults:

- **risk-governance.md** - Risk-based quality gate criteria and decision framework
- **probability-impact.md** - Risk scoring (probability × impact) for residual risks
- **test-quality.md** - Definition of Done for tests, quality standards
- **test-priorities.md** - P0/P1/P2/P3 priority classification framework
- **ci-burn-in.md** - Flakiness detection and burn-in validation patterns

See `tea-index.csv` for complete knowledge fragment mapping.

---

## Troubleshooting

### Problem: No test results found

**Solution:**

- Check CI/CD pipeline for test execution
- Verify `test_results` variable points to correct path
- Run tests locally and provide results explicitly

---

### Problem: Assessments are stale (>7 days old)

**Solution:**

- Re-run `*test-design` workflow
- Re-run `*trace` workflow
- Re-run `*nfr-assess` workflow
- Update evidence files before gate decision

---

### Problem: Unclear decision (edge case)

**Solution:**

- Switch to manual mode: `decision_mode: manual`
- Document assumptions and rationale clearly
- Escalate to tech lead or architect for guidance
- Consider waiver if business-critical

---

### Problem: Waiver requested but not justified

**Solution:**

- Require written business justification from stakeholder
- Ensure approver is appropriate authority (VP/CTO/PO)
- Verify remediation plan exists with concrete due date
- Document monitoring plan for waived risk
- Confirm waiver expiry date (must be fixed in next release)

---

## Integration with BMad Status File

This workflow updates `bmm-workflow-status.md` with gate decisions:

```markdown
### Quality & Testing Progress (TEA Agent)

**Gate Decisions:**

- [2025-10-14] ✅ PASS - Story 1.3 (User Auth) - All criteria met, 98% pass rate
- [2025-10-14] ⚠️ CONCERNS - Epic 2 (Payments) - P1 pass rate 89%, deploy with monitoring
- [2025-10-14] ❌ FAIL - Story 3.2 (Export) - SQL injection blocking release
- [2025-10-15] 🔓 WAIVED - Release v2.4.0 - GDPR deadline, VP approved
```

---

## Configuration Examples

### Strict Gate (Zero Tolerance)

```yaml
min_p0_pass_rate: 100
min_p1_pass_rate: 100
min_overall_pass_rate: 95
min_coverage: 90
allow_waivers: false
max_security_issues: 0
max_critical_nfrs_fail: 0
```

Use for: Financial systems, healthcare, security-critical features

---

### Balanced Gate (Production Standard)

```yaml
min_p0_pass_rate: 100
min_p1_pass_rate: 95
min_overall_pass_rate: 90
min_coverage: 80
allow_waivers: true
max_security_issues: 0
max_critical_nfrs_fail: 0
```

Use for: Most production releases (default configuration)

---

### Relaxed Gate (Early Development)

```yaml
min_p0_pass_rate: 100
min_p1_pass_rate: 85
min_overall_pass_rate: 80
min_coverage: 70
allow_waivers: true
allow_p2_failures: true
allow_p3_failures: true
```

Use for: Alpha/beta releases, internal tools, proof-of-concept

---

## Related Commands

- `bmad tea *test-design` - Risk assessment before implementation
- `bmad tea *trace` - Verify requirements-to-tests coverage
- `bmad tea *nfr-assess` - Validate non-functional requirements
- `bmad tea *automate` - Expand regression suite
- `bmad sm story-approved` - Mark story as complete (triggers gate)
