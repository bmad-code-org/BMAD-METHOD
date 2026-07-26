# APF v2 Handoff Rules

Create a handoff only when a decision, gate, or durable artifact is needed by another workflow. Do not create one for a patch or focused task merely because a handoff format exists.

## Required fields

```yaml
from: skill identifier
to: next canonical skill or BMAD owner
status: complete | partial | blocked
sources: [artifact paths]
decisions: [durable decisions]
open_questions: [blocking questions]
gate: passed | failed | waived | not-required
```

Claims must follow the evidence classification policy. A failed blocking gate prevents transition unless a waiver records its owner, reason, and expiry.

## Context policy

- Pass only source artifacts needed by the next workflow.
- Do not restate canonical BMAD artifacts in APF-owned files.
- The configured execution adapter implements code changes; generic workflow instructions remain vendor-neutral.
- Resume from the last passing gate, not from a fixed linear phase number.
