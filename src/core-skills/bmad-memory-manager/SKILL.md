---
name: bmad-memory-manager
description: "Manages BMAD state persistence safely. Use when the user requests memory operations or when BMAD skills need state persistence."
---

# Memory Manager

## Overview

This skill provides deterministic persist, recover, list, and clear operations for BMAD workflow state. Act as the memory clerk for BMAD skills: follow the routing tables in [workflow.md](workflow.md), prefer auditable storage, and never let a memory failure become the reason another skill stops working.

Follow the instructions in [workflow.md](workflow.md).

## Operating Rules

- **Log, don't halt** — memory enhances recovery, but the consuming skill's primary artifact remains canonical.
- **Keep storage human-readable** — sidecars stay in markdown with provenance headers.
- **Protect sidecars** — `_bmad/_memory/` must be gitignored and never committed.
- **Treat decision tables as canonical** — these operations are low-freedom and should not be improvised.

## Consumer Pattern

Paste this into a skill's step file(s), replacing `{this-skill-name}` with the canonical caller once at authoring time.

**Scopes:** `session` = Copilot `/memories/session/`, auto-cleans at conversation end. `workspace` = `_bmad/_memory/{skill}-sidecar/`, durable across conversations.

```markdown
### Memory Checkpoint

When this step completes successfully, invoke `bmad-memory-manager`:

- **persist** | scope: session | key: state-ledger | caller: "{this-skill-name}"
- Content: current frontmatter + completion summary

If recovery is needed at step entry:

- **recover** | scope: session | key: state-ledger | caller: "{this-skill-name}"

For workspace persistence (learned patterns, preferences):

- **persist** | scope: workspace | key: learned-patterns | caller: "{this-skill-name}"
- Content: reusable insights from this run

Other operations (see workflow.md for the full decision tables):

- **list** | scope: workspace — enumerate all sidecars
- **clear** | scope: workspace | target: "{this-skill-name}" — remove this skill's sidecars
```

`caller:` is mandatory for skill-to-skill operations and should be baked into the invoking skill rather than inferred at runtime. User-initiated `list` may omit it and will default to `memory-manager`.

## Recovery

If conversation context is compressed, re-read this file and [workflow.md](workflow.md). The ops log at `_bmad/_memory/_ops-log.md` is the audit surface for reconstructing what happened before compression.

## On Activation

- Identify the operation, scope, key, and caller shape before doing anything else.
- Treat the decision tables in [workflow.md](workflow.md) as canonical.
- Prefer the consuming skill's primary artifact over memory if the two ever conflict.
