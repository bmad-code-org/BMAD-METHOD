---
schema: 1
id: [KEY-n]
type: task
title: "[Enabler outcome — what exists/works after]"
status: backlog
depends_on: []
covers: []
discovered_from: ""
risk: [1-5]
hitl: [true|false]
created: [YYYY-MM-DD]
---

# [KEY-n] — [Title]

## Context

[Why this enabler is needed, and concretely what the new state unlocks — the work that cannot proceed until it exists. Without that, the enabler gets optimized for the wrong thing.]

## Done Criteria

- #1 [Verifiable state of the world when this is complete — infra up, tooling works, docs published] — verify: [usually a command and its expected result, or an operational observable — not a test, since there is no user-visible behavior here]
- #2 [...] — verify: [...]

## Boundaries

[Optional — cut the whole section when nothing here rules out an otherwise valid solution. This is a budget, not a checklist: every line added competes for the agent's attention. `Must not change:` is the load-bearing half; write `May change:` only when the authorized surface is non-obvious.]

- May change: [The configuration or tooling surface this task is authorized to touch — only when it is non-obvious.]
- Must not change: [Live or shared state this task must leave alone — production configuration, shared credentials, an existing pipeline's behavior. Name behavior, never files.]

## References

- [Typed-document pointers relevant to this task: document type + section, never file paths or line numbers. Cut the section if there are none.]
- Verification entry point: [Optional. The command or workflow that exercises the new state — only when the project has one an agent would not infer. Cut otherwise.]

## Dev Notes

[Optional. Risk rationale when the score needs explaining (a hard floor tripped), constraints, gotchas.]
