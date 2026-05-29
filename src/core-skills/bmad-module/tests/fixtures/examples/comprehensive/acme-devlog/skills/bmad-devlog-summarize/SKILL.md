---
name: bmad-devlog-summarize
description: Summarize devlog entries across a date range. Use when the user says "summarize devlog", "what happened last week", or "devlog summary <range>".
---

# Devlog Summarize

Walks devlog entries in a date range and produces a structured summary: themes, recurring blockers, decisions, open questions.

## EXECUTION

### Step 1: Resolve config

Read `{project-root}/_bmad/devlog/config.yaml`. If missing, run `/bmad-devlog-setup` first.

### Step 2: Parse the range argument

Accept these forms:

- `today` / `yesterday`
- `last-week` / `last-month` / `last-quarter`
- ISO date: `2026-05-21`
- ISO range: `2026-05-01..2026-05-21`
- ISO week: `2026-W21`
- ISO month: `2026-05`

If no argument, ask the user.

### Step 3: Collect entries

Enumerate all entries under `devlog_path` whose date falls in the range. For `weekly`/`monthly` formats, parse sub-sections by their date heading.

If zero entries match, report "No entries in <range>." and stop.

### Step 4: Summarize

For long ranges (>14 days), delegate per-week summarization to the `changelog-archivist` Claude subagent (fan-out). For short ranges, summarize inline.

Produce:

```
# Devlog summary — <range>

## Themes
- _patterns across entries_

## Blockers (recurring)
- _what came up more than once_

## Decisions
- _commitments visible in entries_

## Open questions
- _still unresolved at end of range_

## By the numbers
- Entries: <N>
- Days with no entry: <M>
```

### Step 5: Optionally save

Ask: "Save to `<devlog_path>/_summaries/<range>.md`?" Write if yes.
