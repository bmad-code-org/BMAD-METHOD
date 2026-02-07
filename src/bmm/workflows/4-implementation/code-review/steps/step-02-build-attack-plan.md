---
name: 'step-02-build-attack-plan'
description: 'Build an explicit adversarial review plan against ACs and completed tasks'
nextStepFile: './step-03-execute-review.md'
---

  <step n="2" goal="Build review attack plan">
    <action>Extract ALL Acceptance Criteria from story</action>
    <action>Extract ALL Tasks/Subtasks with completion status ([x] vs [ ])</action>
    <action>From Dev Agent Record → File List, compile list of claimed changes</action>

    <action>Create review plan:
      1. **AC Validation**: Verify each AC is actually implemented
      2. **Task Audit**: Verify each [x] task is really done
      3. **Code Quality**: Security, performance, maintainability
      4. **Test Quality**: Real assertions and meaningful coverage
    </action>
  </step>

## Next
- Read fully and follow: `./step-03-execute-review.md`.
