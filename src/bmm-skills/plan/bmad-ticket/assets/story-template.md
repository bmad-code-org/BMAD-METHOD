---
schema: 1
id: [KEY-n]
type: [story|task]
title: "[Outcome-focused title — what the user/system can do after; for a task, what exists/works after]"
status: backlog # backlog → ready → in-progress → done, or dropped
depends_on: []
covers: []
discovered_from: ""
risk: [1-5]
hitl: [true|false] # true only when a human must perform part of this work — name that step in the body
created: [YYYY-MM-DD]
---

# [KEY-n] — [Title]

## Context

[3–5 sentences: why this story exists, what someone can do when it is done, and the narrow path through the system in one breath. This is the whole narrative — the acceptance criteria below carry the behavior, so this section never restates them. Detail that does not fit here belongs in a referenced document, not in this ticket. A task — an enabler to a story, or work needing a human in the loop — uses this same shape: its Context says what the new state unlocks, the work that cannot proceed until it exists.]

## Acceptance Criteria

<!-- Budget: aim for ~5. More than 7 is a tripwire — stop and re-evaluate: either the story is too big and splits, or criteria are implementation details disguised as ACs. Story criteria verify behavior; task criteria verify a state of the world (infra up, tooling works, docs published). -->

1. **[Observable, atomic, bounded outcome — ONE claim, user/system behavior, never an engineer action; semicolon-chained claims are separate criteria]**
   Verify: [how to confirm: command to run, endpoint to hit, thing to observe]
2. **[One claim per criterion — the bold sentence is the contract, the Verify line is the proof]**
   Verify: [...]
3. **(e2e) [When this story completes a user-visible flow: the end-to-end criterion proving the whole path works]**
   Verify: [...]

## Boundaries

[Optional — cut the whole section when nothing here rules out an otherwise valid solution. This is a budget, not a checklist: every line added competes for the agent's attention and costs accuracy. `Must not change:` is the load-bearing half; write `May change:` only when the authorized surface is non-obvious.]

- May change: [The surface this story is authorized to touch — only when the behavior above does not already make it obvious.]
- Must not change: [Adjacent behavior, interface, or invariant a plausible implementation could damage while still satisfying the criteria above. Name behavior, never files.]

## Open Questions

[Optional — cut when empty. Implementation-detail unknowns only, each with a proposed default the implementer may override. Scope-affecting questions are resolved with the user before work begins, ideally at time of drafting the story.]

- Q{n}: [The unknown, and what it blocks]

## References

[Every entry cites a real path that exists on disk right now — in the obeya or the repo — plus the section: "layout contract — v7/artifact-layout-contract/CONTRACT.md §Promotion". A reference the implementer cannot open is not a reference: if the authoritative source lives only in conversation, it gets written to disk first, then cited — "settled in session" or a bare date is a memory, not a pointer. Cut the section if there are none.]

- [document type — path §section]
- Verification entry point: [Optional. The command or workflow that runs this story's checks — only when the project has one an agent would not infer. Cut otherwise.]

## Dev Notes

[Optional. What an agent cannot discover from the sources above: where the work lands, a frozen interface (schema, CLI shape, state machine) when the decision turns on it, constraints, gotchas, decisions reviewed-and-declined so they are not relitigated. Never sample implementation code, never a step-by-step plan. These notes can come from the user conversationally also, reminders from previous ticket implementations, or call outs critical from references.]
