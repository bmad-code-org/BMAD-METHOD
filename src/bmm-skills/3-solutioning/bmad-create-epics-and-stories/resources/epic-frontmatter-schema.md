# Epic Front-Matter Schema (canonical, locked for v7)

Every epic folder contains exactly one `epic.md` carrying this front matter. The five top-level keys below are the **only** allowed top-level keys; anything else fails strict validation.

```yaml
---
title: "Auth Migration"                    # REQUIRED — string, double-quoted
epic: "02"                                 # REQUIRED — the NN portion of the folder name, zero-padded, quoted as a string
status: draft                              # REQUIRED — same enum as stories: draft | ready | in-progress | review | done | blocked
depends_on: ["01"]                         # REQUIRED — list of epic NNs (zero-padded strings); may be empty
metadata:                                  # OPTIONAL — free-form table; BMad ignores its contents
  initiative: billing-stripe-v2
---
```

## Field rules

- **title** — Always double-quoted by `init_epic.py`.
- **epic** — Always quoted as a string to preserve the leading zero (`"02"`, not `2`). This is the NN, not the full folder name. The validator cross-checks it against the folder name's NN prefix.
- **status** — `init_epic.py` writes `draft`. A future `bmad-initiative-status` may derive a rollup from story statuses; this skill never updates it after creation.
- **depends_on** — Inline list of epic NN strings, e.g. `["01", "03"]`. Cross-epic syntax is **not** allowed here — epics depend on whole epics, not individual stories.
- **metadata** — Free-form. Common uses: initiative name, owning team, target release.

## What is NOT allowed at the top level

`type` (epics may mix story types), `description`, `goal`, `owner`, `created`, `updated`. Goal and shared context belong in the body, not the front matter.

## What an epic is for

`epic.md` is the **shared context cache** for all stories in the epic — architectural decisions, constraints, references, the inter-story flow. This file replaces the v6 `epic-N-context.md` cache that `bmad-quick-dev` used to compile. See `resources/epic-md-template.md` for the body shape.
