<!-- Powered by BMAD™ Core -->

# TDD Quality Gates Template

Quality gate criteria and checkpoints for Test-Driven Development workflows.

## Gate Structure

Each TDD phase has specific quality gates that must be met before progression to the next phase.

## Red Phase Gates

### Prerequisites for Red Phase Entry

- [ ] Story has clear acceptance criteria
- [ ] Test runner detected or configured
- [ ] Story status is 'ready' or 'inprogress'
- [ ] TDD enabled in core-config.yaml

### Red Phase Completion Gates

**PASS Criteria:**

- [ ] At least one test written and failing
- [ ] Tests fail for correct reasons (missing implementation, not syntax errors)
- [ ] All external dependencies properly mocked
- [ ] Test data is deterministic (no random values, current time)
- [ ] Test names clearly describe expected behavior
- [ ] Story TDD metadata updated (status='red', test list populated)
- [ ] Test files follow project naming conventions

**FAIL Criteria:**

- [ ] No tests written
- [ ] Tests pass unexpectedly (implementation may already exist)
- [ ] Tests fail due to syntax errors or configuration issues
- [ ] External dependencies not mocked (network calls, file system, etc.)
- [ ] Non-deterministic tests (random data, time-dependent)

**Gate Decision:**

```yaml
red_phase_gate:
  status: PASS|FAIL
  failing_tests_count: { number }
  tests_fail_correctly: true|false
  mocking_complete: true|false
  deterministic_tests: true|false
  metadata_updated: true|false
  ready_for_green_phase: true|false
```

## Green Phase Gates

### Prerequisites for Green Phase Entry

- [ ] Red phase gate passed
- [ ] Story tdd.status = 'red'
- [ ] Failing tests exist and documented
- [ ] Test runner confirmed working

### Green Phase Completion Gates

**PASS Criteria:**

- [ ] All previously failing tests now pass
- [ ] No new tests added during implementation
- [ ] Implementation is minimal (only what's needed for tests)
- [ ] No feature creep beyond test requirements
- [ ] All existing tests remain green (no regressions)
- [ ] Code follows basic quality standards
- [ ] Story TDD metadata updated (status='green')

**CONCERNS Criteria:**

- [ ] Implementation seems overly complex for test requirements
- [ ] Additional functionality added without corresponding tests
- [ ] Code quality significantly below project standards
- [ ] Performance implications not addressed

**FAIL Criteria:**

- [ ] Tests still failing after implementation attempt
- [ ] New regressions introduced (previously passing tests now fail)
- [ ] Implementation missing for some failing tests
- [ ] Significant feature creep detected

**Gate Decision:**

```yaml
green_phase_gate:
  status: PASS|CONCERNS|FAIL
  all_tests_passing: true|false
  no_regressions: true|false
  minimal_implementation: true|false
  feature_creep_detected: false|true
  code_quality_acceptable: true|false
  ready_for_refactor_phase: true|false
```

## Refactor Phase Gates

### Prerequisites for Refactor Phase Entry

- [ ] Green phase gate passed
- [ ] Story tdd.status = 'green'
- [ ] All tests consistently passing
- [ ] Code quality issues identified

### Refactor Phase Completion Gates

**PASS Criteria:**

- [ ] All tests remain green throughout refactoring
- [ ] Code quality measurably improved
- [ ] No behavior changes introduced
- [ ] Refactoring changes committed incrementally
- [ ] Technical debt reduced in story scope
- [ ] Story TDD metadata updated (status='refactor' or 'done')

**CONCERNS Criteria:**

- [ ] Some code smells remain unaddressed
- [ ] Refactoring introduced minor complexity
- [ ] Test execution time increased significantly
- [ ] Marginal quality improvements

**FAIL Criteria:**

- [ ] Tests broken by refactoring changes
- [ ] Behavior changed during refactoring
- [ ] Code quality degraded
- [ ] Large, risky refactoring attempts

**Gate Decision:**

```yaml
refactor_phase_gate:
  status: PASS|CONCERNS|FAIL
  tests_remain_green: true|false
  code_quality_improved: true|false
  behavior_preserved: true|false
  technical_debt_reduced: true|false
  safe_incremental_changes: true|false
  ready_for_completion: true|false
```

## Story Completion Gates

### TDD Story Completion Criteria

**Must Have:**

- [ ] All TDD phases completed (Red → Green → Refactor)
- [ ] Final test suite passes consistently
- [ ] Code quality meets project standards
- [ ] All acceptance criteria covered by tests
- [ ] TDD-specific DoD checklist completed

**Quality Metrics:**

- [ ] Test coverage meets story target
- [ ] No obvious code smells remain
- [ ] Test execution time reasonable (< 2x baseline)
- [ ] All TDD artifacts documented in story

**Documentation:**

- [ ] TDD cycle progression tracked in story
- [ ] Test-to-requirement traceability clear
- [ ] Refactoring decisions documented
- [ ] Lessons learned captured

## Gate Failure Recovery

### Red Phase Recovery

```yaml
red_phase_failures:
  no_failing_tests:
    action: 'Review acceptance criteria, create simpler test cases'
    escalation: 'Consult SM for requirement clarification'

  tests_pass_unexpectedly:
    action: 'Check if implementation already exists, adjust test scope'
    escalation: 'Review story scope with PO'

  mocking_issues:
    action: 'Review external dependencies, implement proper mocks'
    escalation: 'Consult with Dev agent on architecture'
```

### Green Phase Recovery

```yaml
green_phase_failures:
  tests_still_failing:
    action: 'Break down implementation into smaller steps'
    escalation: 'Review test expectations vs implementation approach'

  regressions_introduced:
    action: 'Revert changes, identify conflicting logic'
    escalation: 'Architectural review with team'

  feature_creep_detected:
    action: 'Remove features not covered by tests'
    escalation: 'Return to Red phase for additional tests'
```

### Refactor Phase Recovery

```yaml
refactor_phase_failures:
  tests_broken:
    action: 'Immediately revert breaking changes'
    escalation: 'Use smaller refactoring steps'

  behavior_changed:
    action: 'Revert and analyze where behavior diverged'
    escalation: 'Review refactoring approach with QA agent'

  quality_degraded:
    action: 'Revert changes, try different refactoring technique'
    escalation: 'Accept current code quality, document technical debt'
```

## Quality Metrics Dashboard

### Per-Phase Metrics

```yaml
metrics_tracking:
  red_phase:
    - failing_tests_count
    - test_creation_time
    - mocking_complexity

  green_phase:
    - implementation_time
    - lines_of_code_added
    - test_pass_rate

  refactor_phase:
    - code_quality_delta
    - test_execution_time_delta
    - refactoring_safety_score
```

### Story-Level Metrics

```yaml
story_metrics:
  total_tdd_cycle_time: '{hours}'
  cycles_completed: '{count}'
  test_to_code_ratio: '{percentage}'
  coverage_achieved: '{percentage}'
  quality_improvement_score: '{0-100}'
```

## Integration with Standard Gates

### How TDD Gates Extend Standard QA Gates

- **Standard gates still apply** for final story review
- **TDD gates are additional checkpoints** during development
- **Phase-specific criteria** supplement overall quality assessment
- **Traceability maintained** between TDD progress and story completion

### Gate Reporting

```yaml
gate_report_template:
  story_id: '{epic}.{story}'
  tdd_enabled: true
  phases_completed: ['red', 'green', 'refactor']

  phase_gates:
    red:
      status: 'PASS'
      completed_date: '2025-01-01T10:00:00Z'
      criteria_met: 6/6

    green:
      status: 'PASS'
      completed_date: '2025-01-01T14:00:00Z'
      criteria_met: 7/7

    refactor:
      status: 'PASS'
      completed_date: '2025-01-01T16:00:00Z'
      criteria_met: 6/6

  final_assessment:
    overall_gate: 'PASS'
    quality_score: 92
    recommendations: []
```

This template ensures consistent quality standards across all TDD phases while maintaining compatibility with existing BMAD quality gates.
