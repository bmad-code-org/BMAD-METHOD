# Requirements Traceability Workflow

**Workflow ID:** `testarch-trace`
**Agent:** Test Architect (TEA)
**Command:** `bmad tea *trace`

---

## Overview

The **trace** workflow generates a comprehensive requirements-to-tests traceability matrix that maps acceptance criteria to implemented tests, identifies coverage gaps, and provides actionable recommendations for improving test coverage.

**Key Features:**

- Maps acceptance criteria to specific test cases across all levels (E2E, API, Component, Unit)
- Classifies coverage status (FULL, PARTIAL, NONE, UNIT-ONLY, INTEGRATION-ONLY)
- Prioritizes gaps by risk level (P0/P1/P2/P3)
- Generates CI/CD-ready YAML snippets for quality gates
- Detects duplicate coverage across test levels
- Verifies test quality (assertions, structure, performance)

---

## When to Use This Workflow

Use `*trace` when you need to:

- ✅ Validate that all acceptance criteria have test coverage
- ✅ Identify coverage gaps before release or PR merge
- ✅ Generate traceability documentation for compliance or audits
- ✅ Ensure critical paths (P0/P1) are fully tested
- ✅ Detect duplicate coverage across test levels
- ✅ Assess test quality across your suite
- ✅ Create gate-ready metrics for CI/CD pipelines

**Typical Timing:**

- After tests are implemented (post-ATDD or post-development)
- Before merging a PR (validate P0/P1 coverage)
- Before release (validate full coverage)
- During sprint retrospectives (assess test quality)

---

## Prerequisites

**Required:**

- Acceptance criteria (from story file OR inline)
- Implemented test suite (or acknowledged gaps)

**Recommended:**

- `test-design.md` - Risk assessment and test priorities
- `tech-spec.md` - Technical implementation details
- Test framework configuration (playwright.config.ts, jest.config.js)

**Halt Conditions:**

- Story lacks any tests AND gaps are not acknowledged → Run `*atdd` first
- Acceptance criteria are completely missing → Provide criteria or story file

---

## Usage

### Basic Usage (BMad Mode)

```bash
bmad tea *trace
```

The workflow will:

1. Read story file from `bmad/output/story-X.X.md`
2. Extract acceptance criteria
3. Auto-discover tests for this story
4. Generate traceability matrix
5. Save to `bmad/output/traceability-matrix.md`

### Standalone Mode (No Story File)

```bash
bmad tea *trace --acceptance-criteria "AC-1: User can login with email..."
```

### Custom Configuration

```bash
bmad tea *trace \
  --story-file "bmad/output/story-1.3.md" \
  --output-file "docs/qa/trace-1.3.md" \
  --min-p0-coverage 100 \
  --min-p1-coverage 90
```

---

## Workflow Steps

1. **Load Context** - Read story, test design, tech spec, knowledge base
2. **Discover Tests** - Auto-find tests related to story (by ID, describe blocks, file paths)
3. **Map Criteria** - Link acceptance criteria to specific test cases
4. **Analyze Gaps** - Identify missing coverage and prioritize by risk
5. **Verify Quality** - Check test quality (assertions, structure, performance)
6. **Generate Deliverables** - Create traceability matrix, gate YAML, coverage badge

---

## Outputs

### Traceability Matrix (`traceability-matrix.md`)

Comprehensive markdown file with:

- Coverage summary table (by priority)
- Detailed criterion-to-test mapping
- Gap analysis with recommendations
- Quality assessment for each test
- Gate YAML snippet

### Gate YAML Snippet

```yaml
traceability:
  story_id: '1.3'
  coverage:
    overall: 85%
    p0: 100%
    p1: 90%
  gaps:
    critical: 0
    high: 1
  status: 'PASS'
```

### Updated Story File (Optional)

Adds "Traceability" section to story markdown with:

- Link to traceability matrix
- Coverage summary
- Gate status

---

## Coverage Classifications

- **FULL** ✅ - All scenarios validated at appropriate level(s)
- **PARTIAL** ⚠️ - Some coverage but missing edge cases or levels
- **NONE** ❌ - No test coverage at any level
- **UNIT-ONLY** ⚠️ - Only unit tests (missing integration/E2E validation)
- **INTEGRATION-ONLY** ⚠️ - Only API/Component tests (missing unit confidence)

---

## Quality Gates

| Priority | Coverage Requirement | Severity | Action             |
| -------- | -------------------- | -------- | ------------------ |
| P0       | 100%                 | BLOCKER  | Do not release     |
| P1       | 90%                  | HIGH     | Block PR merge     |
| P2       | 80% (recommended)    | MEDIUM   | Address in nightly |
| P3       | No requirement       | LOW      | Optional           |

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

  # Quality gates
  min_p0_coverage: 100
  min_p1_coverage: 90
  min_overall_coverage: 80
```

---

## Knowledge Base Integration

This workflow automatically loads relevant knowledge fragments:

- `traceability.md` - Requirements mapping patterns
- `test-priorities.md` - P0/P1/P2/P3 risk framework
- `risk-governance.md` - Risk-based testing approach
- `test-quality.md` - Definition of Done for tests
- `selective-testing.md` - Duplicate coverage patterns

---

## Examples

### Example 1: Full Coverage Validation

```bash
# Validate P0/P1 coverage before PR merge
bmad tea *trace --story-file "bmad/output/story-1.3.md"
```

**Output:**

```markdown
# Traceability Matrix - Story 1.3

## Coverage Summary

| Priority | Total | FULL | Coverage % | Status  |
| -------- | ----- | ---- | ---------- | ------- |
| P0       | 3     | 3    | 100%       | ✅ PASS |
| P1       | 5     | 5    | 100%       | ✅ PASS |

Gate Status: PASS ✅
```

### Example 2: Gap Identification

```bash
# Find coverage gaps for existing feature
bmad tea *trace --target-feature "user-authentication"
```

**Output:**

```markdown
## Gap Analysis

### Critical Gaps (BLOCKER)

- None ✅

### High Priority Gaps (PR BLOCKER)

1. **AC-3: Password reset email edge cases**
   - Recommend: Add 1.3-API-001 (email service integration)
   - Impact: Users may not recover accounts in error scenarios
```

### Example 3: Duplicate Coverage Detection

```bash
# Check for redundant tests
bmad tea *trace --check-duplicate-coverage true
```

**Output:**

```markdown
## Duplicate Coverage Detected

⚠️ AC-1 (login validation) is tested at multiple levels:

- 1.3-E2E-001 (full user journey) ✅ Appropriate
- 1.3-UNIT-001 (business logic) ✅ Appropriate
- 1.3-COMPONENT-001 (form validation) ⚠️ Redundant with UNIT-001

Recommendation: Remove 1.3-COMPONENT-001 or consolidate with UNIT-001
```

---

## Troubleshooting

### "No tests found for this story"

- Run `*atdd` workflow first to generate failing acceptance tests
- Check test file naming conventions (may not match story ID pattern)
- Verify test directory path is correct (`test_dir` variable)

### "Cannot determine coverage status"

- Tests may lack explicit mapping (no test IDs, unclear describe blocks)
- Add test IDs: `{STORY_ID}-{LEVEL}-{SEQ}` (e.g., `1.3-E2E-001`)
- Use Given-When-Then narrative in test descriptions

### "P0 coverage below 100%"

- This is a **BLOCKER** - do not release
- Identify missing P0 tests in gap analysis
- Run `*atdd` workflow to generate missing tests
- Verify P0 classification is correct with stakeholders

### "Duplicate coverage detected"

- Review `selective-testing.md` knowledge fragment
- Determine if overlap is acceptable (defense in depth) or wasteful
- Consolidate tests at appropriate level (logic → unit, journey → E2E)

---

## Integration with Other Workflows

- **testarch-test-design** → `*trace` - Define priorities, then trace coverage
- **testarch-atdd** → `*trace` - Generate tests, then validate coverage
- `*trace` → **testarch-automate** - Identify gaps, then automate regression
- `*trace` → **testarch-gate** - Generate metrics, then apply quality gates
- `*trace` → **testarch-test-review** - Flag quality issues, then review tests

---

## Best Practices

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

5. **Generate Gate-Ready Artifacts**
   - Enable `generate_gate_yaml` for CI/CD integration
   - Use YAML snippets in pipeline quality gates
   - Export metrics for dashboard visualization

---

## Related Commands

- `bmad tea *test-design` - Define test priorities and risk assessment
- `bmad tea *atdd` - Generate failing acceptance tests for gaps
- `bmad tea *automate` - Expand regression suite based on gaps
- `bmad tea *gate` - Apply quality gates using traceability metrics
- `bmad tea *test-review` - Review test quality issues flagged by trace

---

## Resources

- [Instructions](./instructions.md) - Detailed workflow steps
- [Checklist](./checklist.md) - Validation checklist
- [Template](./trace-template.md) - Traceability matrix template
- [Knowledge Base](../../testarch/knowledge/) - Testing best practices

---

<!-- Powered by BMAD-CORE™ -->
