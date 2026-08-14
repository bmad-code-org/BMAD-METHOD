---
schema: 1
id: [KEY-n]
type: story
title: "[Outcome-focused title — what the user/system can do after]"
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

[1–3 sentences: why this story exists and where it fits in the epic. No file paths.]

## Behavior

[The end-to-end behavior being built, from the user's perspective, in prose — a narrow but complete path, not a layer-by-layer implementation list. This is what the implementation plan gets built from.]

## Acceptance Criteria

- #1 [Observable, atomic, bounded outcome — user/system behavior, never an engineer action] — verify: [how to confirm: command to run, endpoint to hit, thing to observe]
- #2 [One claim per criterion] — verify: [...]
- #3 (e2e) [When this story completes a user-visible flow: the end-to-end criterion proving the whole path works] — verify: [...]

## Boundaries

[Optional — cut the whole section when nothing here rules out an otherwise valid solution. This is a budget, not a checklist: every line added competes for the agent's attention and costs accuracy. `Must not change:` is the load-bearing half; write `May change:` only when the authorized surface is non-obvious.]

- May change: [The surface this story is authorized to touch — only when the behavior above does not already make it obvious.]
- Must not change: [Adjacent behavior, interface, or invariant a plausible implementation could damage while still satisfying the criteria above. Name behavior, never files.]

## References

- [Typed-document pointers relevant to this story: "epic spec — §auth decisions", "ux — checkout flow", "test plan — scenarios 4–6", "architecture — data model". Document type + section, never file paths or line numbers.]
- Verification entry point: [Optional. The command or workflow that runs this story's checks — only when the project has one an agent would not infer. Cut otherwise.]

## Dev Notes

[Optional. Constraints and gotchas. A stable contract (schema, state machine, interface) may be reproduced when it is the decision — never sample implementation code, never a pasted code wall, never file paths.]
