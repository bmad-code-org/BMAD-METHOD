---
schema: 1
id: [KEY-n]
type: bug
title: "[Symptom, not cause — what goes wrong]"
status: backlog
depends_on: []
covers: []
discovered_from: ""
severity: [1-5]
risk: [1-5]
hitl: [true|false]
created: [YYYY-MM-DD]
---

# [KEY-n] — [Title]

## Context

[Where this shows up: environment, frequency, who is affected.]

## Observed Behavior

[What actually happens. Evidence over narrative — but prose, not a raw log dump.]

## Expected Behavior

[What should happen instead.]

## Cause Hypothesis

[Best current theory of the cause — a hypothesis, never a prescription. No "preferred fix," no solution steps.]

## Acceptance Criteria

- #1 A test reproduces the failure before any fix exists — verify: new regression test, red before green
- #2 [The corrected behavior, stated as an observable outcome] — verify: [the same regression test, after the fix]
- #3 [Adjacent behavior that must still hold once the fix lands] — verify: [suite, command, or observable that proves it]

## Boundaries

[Keep the no-change condition. Everything else is optional and cut when nothing rules out an otherwise valid fix — each added line competes for the agent's attention.]

- No-change condition: Reproduce first. If the expected behavior already holds against current code, return the reproduction evidence and make no patch. If it reproduces only partially, fix only what still fails.
- Must not change: [Optional. Protected behavior, interface, or invariant the fix could plausibly damage. Name behavior, never files.]

## References

- [Typed-document pointers relevant to this bug: document type + section, never file paths or line numbers. Set `discovered_from` in the frontmatter to the KEY-n that revealed this, when known. Cut the section if there are none.]
- Verification entry point: [Optional. The command or workflow that runs this area's checks — only when the project has one an agent would not infer. Cut otherwise.]

## Dev Notes

[Optional. Risk rationale when the score needs explaining (a hard floor tripped), constraints, gotchas.]
