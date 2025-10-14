<!-- Powered by BMAD-CORE™ -->

# Test Design and Risk Assessment

**Workflow ID**: `bmad/bmm/testarch/test-design`
**Version**: 4.0 (BMad v6)

---

## Overview

Plans comprehensive test coverage strategy with risk assessment, priority classification, and execution ordering. This workflow generates a test design document that identifies high-risk areas, maps requirements to test levels, prioritizes scenarios (P0-P3), and provides resource estimates for the testing effort.

---

## Preflight Requirements

**Critical:** Verify these requirements before proceeding. If any fail, HALT and notify the user.

- ✅ Story markdown with acceptance criteria available
- ✅ PRD or epic documentation exists for context
- ✅ Architecture documents available (optional but recommended)
- ✅ Requirements are clear and testable

---

## Step 1: Load Context and Requirements

### Actions

1. **Read Requirements Documentation**
   - Load PRD.md for high-level product requirements
   - Read epics.md or specific epic for feature scope
   - Read story markdown for detailed acceptance criteria
   - Identify all testable requirements

2. **Load Architecture Context**
   - Read solution-architecture.md for system design
   - Read tech-spec for implementation details
   - Identify technical constraints and dependencies
   - Note integration points and external systems

3. **Analyze Existing Test Coverage**
   - Search for existing test files in `{test_dir}`
   - Identify coverage gaps
   - Note areas with insufficient testing
   - Check for flaky or outdated tests

4. **Load Knowledge Base Fragments**

   **Critical:** Consult `{project-root}/bmad/bmm/testarch/tea-index.csv` to load:
   - `risk-governance.md` - Risk classification framework
   - `probability-impact.md` - Risk scoring methodology
   - `test-levels-framework.md` - Test level selection guidance
   - `test-priorities-matrix.md` - P0-P3 prioritization criteria

**Halt Condition:** If story data or acceptance criteria are missing, HALT with message: "Test design requires clear requirements and acceptance criteria"

---

## Step 2: Assess and Classify Risks

### Actions

1. **Identify Genuine Risks**

   Filter requirements to isolate actual risks (not just features):
   - Unresolved technical gaps
   - Security vulnerabilities
   - Performance bottlenecks
   - Data loss or corruption potential
   - Business impact failures
   - Operational deployment issues

2. **Classify Risks by Category**

   Use these standard risk categories:

   **TECH** (Technical/Architecture):
   - Architecture flaws
   - Integration failures
   - Scalability issues
   - Technical debt

   **SEC** (Security):
   - Missing access controls
   - Authentication bypass
   - Data exposure
   - Injection vulnerabilities

   **PERF** (Performance):
   - SLA violations
   - Response time degradation
   - Resource exhaustion
   - Scalability limits

   **DATA** (Data Integrity):
   - Data loss
   - Data corruption
   - Inconsistent state
   - Migration failures

   **BUS** (Business Impact):
   - User experience degradation
   - Business logic errors
   - Revenue impact
   - Compliance violations

   **OPS** (Operations):
   - Deployment failures
   - Configuration errors
   - Monitoring gaps
   - Rollback issues

3. **Score Risk Probability**

   Rate likelihood (1-3):
   - **1 (Unlikely)**: <10% chance, edge case
   - **2 (Possible)**: 10-50% chance, known scenario
   - **3 (Likely)**: >50% chance, common occurrence

4. **Score Risk Impact**

   Rate severity (1-3):
   - **1 (Minor)**: Cosmetic, workaround exists, limited users
   - **2 (Degraded)**: Feature impaired, workaround difficult, affects many users
   - **3 (Critical)**: System failure, data loss, no workaround, blocks usage

5. **Calculate Risk Score**

   ```
   Risk Score = Probability × Impact

   Scores:
   1-2: Low risk (monitor)
   3-4: Medium risk (plan mitigation)
   6-9: High risk (immediate mitigation required)
   ```

6. **Highlight High-Priority Risks**

   Flag all risks with score ≥6 for immediate attention.

7. **Request Clarification**

   If evidence is missing or assumptions required:
   - Document assumptions clearly
   - Request user clarification
   - Do NOT speculate on business impact

8. **Plan Mitigations**

   For each high-priority risk:
   - Define mitigation strategy
   - Assign owner (dev, QA, ops)
   - Set timeline
   - Update residual risk expectation

---

## Step 3: Design Test Coverage

### Actions

1. **Break Down Acceptance Criteria**

   Convert each acceptance criterion into atomic test scenarios:
   - One scenario per testable behavior
   - Scenarios are independent
   - Scenarios are repeatable
   - Scenarios tie back to risk mitigations

2. **Select Appropriate Test Levels**

   **Knowledge Base Reference**: `test-levels-framework.md`

   Map requirements to optimal test levels (avoid duplication):

   **E2E (End-to-End)**:
   - Critical user journeys
   - Multi-system integration
   - Production-like environment
   - Highest confidence, slowest execution

   **API (Integration)**:
   - Service contracts
   - Business logic validation
   - Fast feedback
   - Good for complex scenarios

   **Component**:
   - UI component behavior
   - Interaction testing
   - Visual regression
   - Fast, isolated

   **Unit**:
   - Business logic
   - Edge cases
   - Error handling
   - Fastest, most granular

   **Avoid duplicate coverage**: Don't test same behavior at multiple levels unless necessary.

3. **Assign Priority Levels**

   **Knowledge Base Reference**: `test-priorities-matrix.md`

   **P0 (Critical)**:
   - Blocks core user journey
   - High-risk areas (score ≥6)
   - Revenue-impacting
   - Security-critical
   - **Run on every commit**

   **P1 (High)**:
   - Important user features
   - Medium-risk areas (score 3-4)
   - Common workflows
   - **Run on PR to main**

   **P2 (Medium)**:
   - Secondary features
   - Low-risk areas (score 1-2)
   - Edge cases
   - **Run nightly or weekly**

   **P3 (Low)**:
   - Nice-to-have
   - Exploratory
   - Performance benchmarks
   - **Run on-demand**

4. **Outline Data and Tooling Prerequisites**

   For each test scenario, identify:
   - Test data requirements (factories, fixtures)
   - External services (mocks, stubs)
   - Environment setup
   - Tools and dependencies

5. **Define Execution Order**

   Recommend test execution sequence:
   1. **Smoke tests** (P0 subset, <5 min)
   2. **P0 tests** (critical paths, <10 min)
   3. **P1 tests** (important features, <30 min)
   4. **P2/P3 tests** (full regression, <60 min)

---

## Step 4: Generate Deliverables

### Actions

1. **Create Risk Assessment Matrix**

   Use template structure:

   ```markdown
   | Risk ID | Category | Description | Probability | Impact | Score | Mitigation      |
   | ------- | -------- | ----------- | ----------- | ------ | ----- | --------------- |
   | R-001   | SEC      | Auth bypass | 2           | 3      | 6     | Add authz check |
   ```

2. **Create Coverage Matrix**

   ```markdown
   | Requirement | Test Level | Priority | Risk Link | Test Count | Owner |
   | ----------- | ---------- | -------- | --------- | ---------- | ----- |
   | Login flow  | E2E        | P0       | R-001     | 3          | QA    |
   ```

3. **Document Execution Order**

   ```markdown
   ### Smoke Tests (<5 min)

   - Login successful
   - Dashboard loads

   ### P0 Tests (<10 min)

   - [Full P0 list]

   ### P1 Tests (<30 min)

   - [Full P1 list]
   ```

4. **Include Resource Estimates**

   ```markdown
   ### Test Effort Estimates

   - P0 scenarios: 15 tests × 2 hours = 30 hours
   - P1 scenarios: 25 tests × 1 hour = 25 hours
   - P2 scenarios: 40 tests × 0.5 hour = 20 hours
   - **Total:** 75 hours (~10 days)
   ```

5. **Add Gate Criteria**

   ```markdown
   ### Quality Gate Criteria

   - All P0 tests pass (100%)
   - P1 tests pass rate ≥95%
   - No high-risk (score ≥6) items unmitigated
   - Test coverage ≥80% for critical paths
   ```

6. **Write to Output File**

   Save to `{output_folder}/test-design-epic-{epic_num}.md` using template structure.

---

## Important Notes

### Risk Category Definitions

**TECH** (Technical/Architecture):

- Architecture flaws or technical debt
- Integration complexity
- Scalability concerns

**SEC** (Security):

- Missing security controls
- Authentication/authorization gaps
- Data exposure risks

**PERF** (Performance):

- SLA risk or performance degradation
- Resource constraints
- Scalability bottlenecks

**DATA** (Data Integrity):

- Data loss or corruption potential
- State consistency issues
- Migration risks

**BUS** (Business Impact):

- User experience harm
- Business logic errors
- Revenue or compliance impact

**OPS** (Operations):

- Deployment or runtime failures
- Configuration issues
- Monitoring/observability gaps

### Risk Scoring Methodology

**Probability × Impact = Risk Score**

Examples:

- High likelihood (3) × Critical impact (3) = **Score 9** (highest priority)
- Possible (2) × Critical (3) = **Score 6** (high priority threshold)
- Unlikely (1) × Minor (1) = **Score 1** (low priority)

**Threshold**: Scores ≥6 require immediate mitigation.

### Test Level Selection Strategy

**Avoid duplication:**

- Don't test same behavior at E2E and API level
- Use E2E for critical paths only
- Use API tests for complex business logic
- Use unit tests for edge cases

**Tradeoffs:**

- E2E: High confidence, slow execution, brittle
- API: Good balance, fast, stable
- Unit: Fastest feedback, narrow scope

### Priority Assignment Guidelines

**P0 criteria** (all must be true):

- Blocks core functionality
- High-risk (score ≥6)
- No workaround exists
- Affects majority of users

**P1 criteria**:

- Important feature
- Medium risk (score 3-5)
- Workaround exists but difficult

**P2/P3**: Everything else, prioritized by value

### Knowledge Base Integration

**Auto-load enabled:**

- `risk-governance.md` - Risk framework
- `probability-impact.md` - Scoring guide
- `test-levels-framework.md` - Level selection
- `test-priorities-matrix.md` - Priority assignment

**Manual reference:**

- Use `tea-index.csv` to find additional fragments
- Load `selective-testing.md` for execution strategy
- Load `fixture-architecture.md` for data setup patterns

### Evidence-Based Assessment

**Critical principle:** Base risk assessment on evidence, not speculation.

**Evidence sources:**

- PRD and user research
- Architecture documentation
- Historical bug data
- User feedback
- Security audit results

**Avoid:**

- Guessing business impact
- Assuming user behavior
- Inventing requirements

**When uncertain:** Document assumptions and request clarification from user.

---

## Output Summary

After completing this workflow, provide a summary:

```markdown
## Test Design Complete

**Epic**: {epic_num}
**Scope**: {design_level}

**Risk Assessment**:

- Total risks identified: {count}
- High-priority risks (≥6): {high_count}
- Categories: {categories}

**Coverage Plan**:

- P0 scenarios: {p0_count} ({p0_hours} hours)
- P1 scenarios: {p1_count} ({p1_hours} hours)
- P2/P3 scenarios: {p2p3_count} ({p2p3_hours} hours)
- **Total effort**: {total_hours} hours (~{total_days} days)

**Test Levels**:

- E2E: {e2e_count}
- API: {api_count}
- Component: {component_count}
- Unit: {unit_count}

**Quality Gate Criteria**:

- P0 pass rate: 100%
- P1 pass rate: ≥95%
- High-risk mitigations: 100%
- Coverage: ≥80%

**Output File**: {output_file}

**Next Steps**:

1. Review risk assessment with team
2. Prioritize mitigation for high-risk items (score ≥6)
3. Run `atdd` workflow to generate failing tests for P0 scenarios
4. Allocate resources per effort estimates
5. Set up test data factories and fixtures
```

---

## Validation

After completing all steps, verify:

- [ ] Risk assessment complete with all categories
- [ ] All risks scored (probability × impact)
- [ ] High-priority risks (≥6) flagged
- [ ] Coverage matrix maps requirements to test levels
- [ ] Priority levels assigned (P0-P3)
- [ ] Execution order defined
- [ ] Resource estimates provided
- [ ] Quality gate criteria defined
- [ ] Output file created and formatted correctly

Refer to `checklist.md` for comprehensive validation criteria.
