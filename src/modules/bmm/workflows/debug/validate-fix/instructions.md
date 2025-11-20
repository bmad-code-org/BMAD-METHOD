# Fix Validation Workflow

Verify proposed fix addresses root cause without introducing side effects.

## Context

This workflow systematically validates that a proposed fix actually addresses the root cause and doesn't introduce new issues or regressions.

## Prerequisites

- Identified root cause
- Proposed fix (code, configuration, or process change)
- Understanding of system architecture
- Access to test suite

## Instructions

### Step 1: Root Cause Alignment

1. Review the identified root cause from analysis
2. Examine the proposed fix in detail
3. Verify fix directly addresses root cause (not just symptoms)
4. Check if fix is complete or requires additional changes
5. Document alignment assessment

### Step 2: Side Effect Analysis

1. Identify all components affected by the fix
2. Analyze potential ripple effects
3. Check for dependency impacts
4. Review similar code patterns that might be affected
5. Assess performance implications
6. Document potential side effects

### Step 3: Regression Risk Assessment

Rate regression risk for each category:

- **Code Changes:** Lines changed, complexity, critical paths
- **Test Coverage:** Existing test coverage of affected areas
- **Integration Points:** Number of integration points affected
- **Deployment Risk:** Configuration or infrastructure changes needed

Risk Levels:

- **High:** Critical paths, low test coverage, many integration points
- **Medium:** Moderate complexity, good test coverage, some integration points
- **Low:** Simple changes, high test coverage, isolated changes

### Step 4: Test Strategy Validation

1. Review existing tests covering affected areas
2. Identify gaps in test coverage
3. Recommend new tests needed to validate fix
4. Suggest regression tests to prevent recurrence
5. Verify test strategy is comprehensive

### Step 5: Validation Recommendations

Provide structured recommendations:

1. **Fix Assessment:** Does fix address root cause? (Yes/No/Partial)
2. **Regression Risk:** High/Medium/Low with justification
3. **Required Tests:** List specific tests needed
4. **Additional Changes:** Any complementary changes needed
5. **Monitoring:** Metrics or logs to watch post-deployment
6. **Approval:** Recommend approval status (Approved/Needs Work/Rejected)

## Output Requirements

Generate validation report containing:

- Root cause alignment assessment
- Side effect analysis with affected components
- Regression risk matrix by category
- Test strategy recommendations
- Monitoring and rollback plan
- Final recommendation with justification

## Completion Criteria

- [ ] Root cause alignment verified
- [ ] Side effects identified and documented
- [ ] Regression risk assessed by category
- [ ] Test strategy validated and gaps identified
- [ ] Monitoring recommendations provided
- [ ] Final approval recommendation given

## Elicitation Points

<elicit required="true">
Proposed Fix: Ask user to provide:
- What is the proposed fix? (code changes, configuration, process)
- What root cause does it address?
- What testing has been done?
</elicit>

<elicit required="false">
Additional Context: Ask if available:
- Why was this approach chosen?
- Are there alternative approaches considered?
- What is the rollback plan?
</elicit>
