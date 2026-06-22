# Deferred Work Format

Canonical entry format for `{implementation_artifacts}/deferred-work.md`.
Used (in `bmad-auto` automation mode) by bmad-quick-dev (multi-goal splits,
token splits, review defers) and bmad-code-review (defer findings). The file is
append-only — never rewrite or delete existing entries. (One exception: freeform
pre-DW-format content from older projects is rewritten wholesale into canonical
entries by a `bmad-auto sweep` migration session — see
`bmad-auto-sweep/migration-mode.md`; the TUI displays such legacy items
read-only until that happens.)

## Before appending: dedupe check

Scan the existing file for an entry describing the same issue or goal (same
location and same substance, even if worded differently). If one exists, do
NOT append a duplicate — add a `seen-again:` line to the existing entry
instead:

```markdown
seen-again: 2026-06-12 (code review of spec-3-3-export.md)
```

## Entry format

Number entries sequentially (`DW-1`, `DW-2`, …) by scanning the file for the
highest existing number. One entry per deferred item:

```markdown
### DW-<seq>: <one-line title>

origin: <workflow + artifact + date, e.g. "bmad-quick-dev split of spec-3-2-digest.md, 2026-06-12">
location: <file:line or component, or "n/a" for deferred goals>
severity: <critical | high | medium | low — how much it matters if never done>
reason: <why this was deferred rather than done now, one or two sentences>
status: open
```

`severity:` is optional — entries written before this field existed have none
and that is fine; readers must treat a missing or unrecognized value as
"unspecified". Use `critical` for correctness/security issues, `high` for
likely user-visible problems, `medium` for quality and robustness gaps, `low`
for polish and nice-to-haves.

When a deferred item is later completed, set its `status:` to `done` with the
date (e.g. `status: done 2026-06-20`) — do not delete the entry.

## Sweep annotations

`bmad-auto sweep` runs (the orchestrator and its bundle dev sessions) add two
optional field lines to existing entries — both directly after `status:`:

```markdown
resolution: <one line: what was built or why the entry was closed>
decision: <date> <chosen option label> — <detail>
```

- `resolution:` accompanies every sweep close (`status: done <date>`). Bundle
  dev sessions write it when finishing a bundle's entries; the orchestrator
  writes it when closing entries triage proved already resolved.
- `decision:` records a human's sweep-time choice on an entry. It does not by
  itself change `status:` — a `keep-open` decision leaves the entry open.
