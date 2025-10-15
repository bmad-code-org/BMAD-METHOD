# Non-Functional Requirements Assessment Workflow

**Workflow ID:** `testarch-nfr`
**Agent:** Test Architect (TEA)
**Command:** `bmad tea *nfr-assess`

---

## Overview

The **nfr-assess** workflow performs a comprehensive assessment of non-functional requirements (NFRs) to validate that the implementation meets performance, security, reliability, and maintainability standards before release. It uses evidence-based validation with deterministic PASS/CONCERNS/FAIL rules and provides actionable recommendations for remediation.

**Key Features:**

- Assess multiple NFR categories (performance, security, reliability, maintainability, custom)
- Validate NFRs against defined thresholds from tech specs, PRD, or defaults
- Classify status deterministically (PASS/CONCERNS/FAIL) based on evidence
- Never guess thresholds - mark as CONCERNS if unknown
- Generate CI/CD-ready YAML snippets for quality gates
- Provide quick wins and recommended actions for remediation
- Create evidence checklists for gaps

---

## When to Use This Workflow

Use `*nfr-assess` when you need to:

- ✅ Validate non-functional requirements before release
- ✅ Assess performance against defined thresholds
- ✅ Verify security requirements are met
- ✅ Validate reliability and error handling
- ✅ Check maintainability standards (coverage, quality, documentation)
- ✅ Generate NFR assessment reports for stakeholders
- ✅ Create gate-ready metrics for CI/CD pipelines

**Typical Timing:**

- Before release (validate all NFRs)
- Before PR merge (validate critical NFRs)
- During sprint retrospectives (assess maintainability)
- After performance testing (validate performance NFRs)
- After security audit (validate security NFRs)

---

## Prerequisites

**Required:**

- Implementation deployed locally or accessible for evaluation
- Evidence sources available (test results, metrics, logs, CI results)

**Recommended:**

- NFR requirements defined in tech-spec.md, PRD.md, or story
- Test results from performance, security, reliability tests
- Application metrics (response times, error rates, throughput)
- CI/CD pipeline results for burn-in validation

**Halt Conditions:**

- NFR targets are undefined and cannot be obtained → Halt and request definition
- Implementation is not accessible for evaluation → Halt and request deployment

---

## Usage

### Basic Usage (BMad Mode)

```bash
bmad tea *nfr-assess
```

The workflow will:

1. Read tech-spec.md for NFR requirements
2. Gather evidence from test results, metrics, logs
3. Assess each NFR category against thresholds
4. Generate NFR assessment report
5. Save to `bmad/output/nfr-assessment.md`

### Standalone Mode (No Tech Spec)

```bash
bmad tea *nfr-assess --feature-name "User Authentication"
```

### Custom Configuration

```bash
bmad tea *nfr-assess \
  --assess-performance true \
  --assess-security true \
  --assess-reliability true \
  --assess-maintainability true \
  --performance-response-time-ms 500 \
  --security-score-min 85
```

---

## Workflow Steps

1. **Load Context** - Read tech spec, PRD, knowledge base fragments
2. **Identify NFRs** - Determine categories and thresholds
3. **Gather Evidence** - Read test results, metrics, logs, CI results
4. **Assess NFRs** - Apply deterministic PASS/CONCERNS/FAIL rules
5. **Identify Actions** - Quick wins, recommended actions, monitoring hooks
6. **Generate Deliverables** - NFR assessment report, gate YAML, evidence checklist

---

## Outputs

### NFR Assessment Report (`nfr-assessment.md`)

Comprehensive markdown file with:

- Executive summary (overall status, critical issues)
- Assessment by category (performance, security, reliability, maintainability)
- Evidence for each NFR (test results, metrics, thresholds)
- Status classification (PASS/CONCERNS/FAIL)
- Quick wins section
- Recommended actions section
- Evidence gaps checklist

### Gate YAML Snippet (Optional)

```yaml
nfr_assessment:
  date: '2025-10-14'
  categories:
    performance: 'PASS'
    security: 'CONCERNS'
    reliability: 'PASS'
    maintainability: 'PASS'
  overall_status: 'CONCERNS'
  critical_issues: 0
  high_priority_issues: 1
  concerns: 1
  blockers: false
```

### Evidence Checklist (Optional)

- List of NFRs with missing or incomplete evidence
- Owners for evidence collection
- Suggested evidence sources
- Deadlines for evidence collection

---

## NFR Categories

### Performance

**Criteria:** Response time, throughput, resource usage, scalability
**Thresholds (Default):**

- Response time p95: 500ms
- Throughput: 100 RPS
- CPU usage: < 70%
- Memory usage: < 80%

**Evidence Sources:** Load test results, APM data, Lighthouse reports, Playwright traces

---

### Security

**Criteria:** Authentication, authorization, data protection, vulnerability management
**Thresholds (Default):**

- Security score: >= 85/100
- Critical vulnerabilities: 0
- High vulnerabilities: < 3
- MFA enabled

**Evidence Sources:** SAST results, DAST results, dependency scanning, pentest reports

---

### Reliability

**Criteria:** Availability, error handling, fault tolerance, disaster recovery
**Thresholds (Default):**

- Uptime: >= 99.9%
- Error rate: < 0.1%
- MTTR: < 15 minutes
- CI burn-in: 100 consecutive runs

**Evidence Sources:** Uptime monitoring, error logs, CI burn-in results, chaos tests

---

### Maintainability

**Criteria:** Code quality, test coverage, documentation, technical debt
**Thresholds (Default):**

- Test coverage: >= 80%
- Code quality: >= 85/100
- Technical debt: < 5%
- Documentation: >= 90%

**Evidence Sources:** Coverage reports, static analysis, documentation audit, test review

---

## Assessment Rules

### PASS ✅

- Evidence exists AND meets or exceeds threshold
- No concerns flagged in evidence
- Quality is acceptable

### CONCERNS ⚠️

- Threshold is UNKNOWN (not defined)
- Evidence is MISSING or INCOMPLETE
- Evidence is close to threshold (within 10%)
- Evidence shows intermittent issues

### FAIL ❌

- Evidence exists BUT does not meet threshold
- Critical evidence is MISSING
- Evidence shows consistent failures
- Quality is unacceptable

---

## Configuration

### workflow.yaml Variables

```yaml
variables:
  # NFR categories to assess
  assess_performance: true
  assess_security: true
  assess_reliability: true
  assess_maintainability: true

  # Custom NFR categories
  custom_nfr_categories: '' # e.g., "accessibility,compliance"

  # Evidence sources
  test_results_dir: '{project-root}/test-results'
  metrics_dir: '{project-root}/metrics'
  logs_dir: '{project-root}/logs'
  include_ci_results: true

  # Thresholds
  performance_response_time_ms: 500
  performance_throughput_rps: 100
  security_score_min: 85
  reliability_uptime_pct: 99.9
  maintainability_coverage_pct: 80

  # Assessment configuration
  use_deterministic_rules: true
  never_guess_thresholds: true
  require_evidence: true
  suggest_monitoring: true

  # Output configuration
  output_file: '{output_folder}/nfr-assessment.md'
  generate_gate_yaml: true
  generate_evidence_checklist: true
```

---

## Knowledge Base Integration

This workflow automatically loads relevant knowledge fragments:

- `nfr-criteria.md` - Non-functional requirements criteria
- `ci-burn-in.md` - CI/CD burn-in patterns for reliability
- `test-quality.md` - Test quality expectations (maintainability)
- `playwright-config.md` - Performance configuration patterns

---

## Examples

### Example 1: Full NFR Assessment Before Release

```bash
bmad tea *nfr-assess
```

**Output:**

```markdown
# NFR Assessment - Story 1.3

**Overall Status:** PASS ✅ (No blockers)

## Performance Assessment

- Response Time p95: PASS ✅ (320ms < 500ms threshold)
- Throughput: PASS ✅ (250 RPS > 100 RPS threshold)

## Security Assessment

- Authentication: PASS ✅ (MFA enforced)
- Data Protection: PASS ✅ (AES-256 + TLS 1.3)

## Reliability Assessment

- Uptime: PASS ✅ (99.95% > 99.9% threshold)
- Error Rate: PASS ✅ (0.05% < 0.1% threshold)

## Maintainability Assessment

- Test Coverage: PASS ✅ (87% > 80% threshold)
- Code Quality: PASS ✅ (92/100 > 85/100 threshold)

Gate Status: PASS ✅ - Ready for release
```

### Example 2: NFR Assessment with Concerns

```bash
bmad tea *nfr-assess --feature-name "User Authentication"
```

**Output:**

```markdown
# NFR Assessment - User Authentication

**Overall Status:** CONCERNS ⚠️ (1 HIGH issue)

## Security Assessment

### Authentication Strength

- **Status:** CONCERNS ⚠️
- **Threshold:** MFA enabled for all users
- **Actual:** MFA optional (not enforced)
- **Evidence:** Security audit (security-audit-2025-10-14.md)
- **Recommendation:** HIGH - Enforce MFA for all new accounts

## Quick Wins

1. **Enforce MFA (Security)** - HIGH - 4 hours
   - Add configuration flag to enforce MFA
   - No code changes needed

Gate Status: CONCERNS ⚠️ - Address HIGH priority issues before release
```

### Example 3: Performance-Only Assessment

```bash
bmad tea *nfr-assess \
  --assess-performance true \
  --assess-security false \
  --assess-reliability false \
  --assess-maintainability false
```

---

## Troubleshooting

### "NFR thresholds not defined"

- Check tech-spec.md for NFR requirements
- Check PRD.md for product-level SLAs
- Check story file for feature-specific requirements
- If thresholds truly unknown, mark as CONCERNS and recommend defining them

### "No evidence found"

- Check evidence directories (test-results, metrics, logs)
- Check CI/CD pipeline for test results
- If evidence truly missing, mark NFR as "NO EVIDENCE" and recommend generating it

### "CONCERNS status but no threshold exceeded"

- CONCERNS is correct when threshold is UNKNOWN or evidence is MISSING/INCOMPLETE
- CONCERNS is also correct when evidence is close to threshold (within 10%)
- Document why CONCERNS was assigned in assessment report

### "FAIL status blocks release"

- This is intentional - FAIL means critical NFR not met
- Recommend remediation actions with specific steps
- Re-run assessment after remediation

---

## Integration with Other Workflows

- **testarch-test-design** → `*nfr-assess` - Define NFR requirements, then assess
- **testarch-framework** → `*nfr-assess` - Set up frameworks, then validate NFRs
- **testarch-ci** → `*nfr-assess` - Configure CI, then assess reliability with burn-in
- `*nfr-assess` → **testarch-trace (Phase 2)** - Assess NFRs, then apply quality gates
- `*nfr-assess` → **testarch-test-review** - Assess maintainability, then review tests

---

## Best Practices

1. **Never Guess Thresholds**
   - If threshold is unknown, mark as CONCERNS
   - Recommend defining threshold in tech-spec.md
   - Don't infer thresholds from similar features

2. **Evidence-Based Assessment**
   - Every assessment must be backed by evidence
   - Mark NFRs without evidence as "NO EVIDENCE"
   - Don't assume or infer - require explicit evidence

3. **Deterministic Rules**
   - Apply PASS/CONCERNS/FAIL consistently
   - Document reasoning for each classification
   - Use same rules across all NFR categories

4. **Actionable Recommendations**
   - Provide specific steps, not generic advice
   - Include priority, effort estimate, owner suggestion
   - Focus on quick wins first

5. **Gate Integration**
   - Enable `generate_gate_yaml` for CI/CD integration
   - Use YAML snippets in pipeline quality gates
   - Export metrics for dashboard visualization

---

## Quality Gates

| Status      | Criteria                     | Action                      |
| ----------- | ---------------------------- | --------------------------- |
| PASS ✅     | All NFRs have PASS status    | Ready for release           |
| CONCERNS ⚠️ | Any NFR has CONCERNS status  | Address before next release |
| FAIL ❌     | Critical NFR has FAIL status | Do not release - BLOCKER    |

---

## Related Commands

- `bmad tea *test-design` - Define NFR requirements and test plan
- `bmad tea *framework` - Set up performance/security testing frameworks
- `bmad tea *ci` - Configure CI/CD for NFR validation
- `bmad tea *trace` (Phase 2) - Apply quality gates using NFR assessment metrics
- `bmad tea *test-review` - Review test quality (maintainability NFR)

---

## Resources

- [Instructions](./instructions.md) - Detailed workflow steps
- [Checklist](./checklist.md) - Validation checklist
- [Template](./nfr-report-template.md) - NFR assessment report template
- [Knowledge Base](../../testarch/knowledge/) - NFR criteria and best practices

---

<!-- Powered by BMAD-CORE™ -->
