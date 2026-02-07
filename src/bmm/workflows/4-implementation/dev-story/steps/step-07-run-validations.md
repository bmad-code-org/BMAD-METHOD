---
name: 'step-07-run-validations'
description: 'Run repository test and validation commands, then stop on regressions'
nextStepFile: './step-08-mark-task-complete.md'
---

  <step n="7" goal="Run validations and tests">
    <action>Determine how to run tests for this repo (infer test framework from project structure)</action>
    <action>Run all existing tests to ensure no regressions</action>
    <action>Run the new tests to verify implementation correctness</action>
    <action>Run linting and code quality checks if configured in project</action>
    <action>Validate implementation meets ALL story acceptance criteria; enforce quantitative thresholds explicitly</action>
    <action if="regression tests fail">STOP and fix before continuing - identify breaking changes immediately</action>
    <action if="new tests fail">STOP and fix before continuing - ensure implementation correctness</action>
  </step>

## Next
- Read fully and follow: `./step-08-mark-task-complete.md`.
