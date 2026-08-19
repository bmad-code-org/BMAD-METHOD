---
schema: 1
id: [KEY-n]
type: spike
title: "[The question being answered]"
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

[What decision or slicing is blocked on this unknown.]

## Research Questions

1. **[Specific question the spike must answer]**
   Verify: [the artifact or measurement that constitutes the answer — a recorded benchmark run with raw numbers, a written comparison with stated assumptions, a decision record naming the deciding criterion. Not a test, and never "research it"]
2. **[...]**
   Verify: [...]

## Timebox

[Bound the investigation — e.g. one session. Output is knowledge (recorded findings), not shipped code.]

## Boundaries

[Optional — cut the whole section when nothing here rules out an otherwise valid line of investigation, though it earns its place here more often than on other types, since an unbounded spike ships half a product nobody asked for. Still a budget, not a checklist: every line added competes for the agent's attention. `Must not change:` is the load-bearing half; write `May change:` only when the authorized surface is non-obvious.]

- May change: [The throwaway surface the investigation may build in — a scratch harness, a scratch branch — and whether any of it merges.]
- Must not change: [Production code and configuration, unless the spike genuinely requires touching them. Name behavior, never files.]

## References

- [Document citations relevant to this spike: document type + a path that exists on disk + section. A source that lives only in conversation is written to disk first, then cited. Cut the section if there are none. Often thin — the authoritative answer does not exist yet.]
- Verification entry point: [Optional. The command or workflow that reproduces the measurement — only when the project has one an agent would not infer. Cut otherwise.]

## Dev Notes

[Optional. Risk rationale when the score needs explaining (a hard floor tripped — a spike into auth or migrations is not risk 1), constraints, gotchas.]
