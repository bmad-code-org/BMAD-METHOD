# Story Front-Matter Schema (canonical, locked for v7)

Every file inside an epic folder **except** `epic.md` is a story. The first six top-level keys are the **only** allowed top-level keys; anything else fails strict validation.

```yaml
---
title: "Payment API Integration"          # REQUIRED — string, double-quoted to keep colons safe
type: feature                              # REQUIRED — one of: feature | bug | task | spike
status: draft                              # REQUIRED — one of: draft | ready | in-progress | review | done | blocked
epic: 01-billing-stripe                    # REQUIRED — must exactly match the enclosing epic folder name
depends_on: []                             # REQUIRED — list (may be empty)
metadata:                                  # OPTIONAL — free-form table; BMad ignores its contents
  jira_key: BILL-234
  priority: high
  story_points: 3
---
```

## Field rules

- **title** — Always emitted with double quotes by `init_story.py`. Inner double quotes escaped with `\`.
- **type** — Drives body-skeleton generation: `task` omits the As-a/I-want/So-that stanza by default; `bug` and `spike` make it optional; `feature` requires it.
- **status** — `init_story.py` always writes `draft`. Promotion to any other value is owned by downstream skills (`bmad-dev-story` etc.). This skill never auto-promotes.
- **epic** — The enclosing folder name (e.g. `01-billing-stripe`), not just the NN. Emitted unquoted (the dash makes it unambiguously a string in YAML). The folder name wins on conflict; the validator flags drift.
- **depends_on** — Inline YAML list. Two reference forms:
  - **Within-epic:** the sibling story's basename without `.md` — e.g. `04-define-schema`.
  - **Cross-epic:** `<epic-folder>/<story-basename>` — e.g. `02-auth-migration/04-session-management`.
- **metadata** — Anything goes. BMad does not read or rewrite it. Useful for org-specific tracker keys, points, owners.

## What is NOT allowed at the top level

`description`, `assignee`, `points`, `priority`, `created`, `updated`, `tags`, `labels`, `body`, `acceptance_criteria`, `notes`, anything else. Put org-specific fields under `metadata:` instead.

## Why this is locked

Downstream skills (`bmad-dev-story`, `bmad-code-review`, `bmad-retrospective`, future `bmad-initiative-status`) read state directly from these files. A drifting schema would silently break them. The set is small on purpose so a human editor can hold the whole shape in their head.
