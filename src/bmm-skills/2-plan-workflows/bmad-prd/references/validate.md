# Validate

The Validate intent playbook. Standalone — this intent critiques an existing PRD without changing it and ends after the user has seen the report; it does not run Finalize. The structural-validator rendering pipeline below is also reused for mid-session report requests during Create/Update.

## Orient

Source-extract against `.decision-log.md`, any original inputs, and the PRD/addendum themselves. Delegate to subagents per PRD Discipline → "Extract, don't ingest" (in SKILL.md); the parent assembles from extracts.

## Run the Reviewer Gate

Run the Reviewer Gate (see SKILL.md) against `prd.md` (and `addendum.md` if present). The structural checklist validator is one entry in the gate menu; under Validate intent it additionally runs the rendering pipeline below. The Finalize discipline pass during Create/Update does NOT render a report — its findings stay in-conversation.

## Structural validator pipeline

The structural validator subagent walks `{workflow.validation_checklist_template}` against `prd.md` (and `addendum.md` if present) and writes findings to `{doc_workspace}/validation-findings.json`:

```json
{
  "prd_name": "Example Product",
  "prd_path": "{doc_workspace}/prd.md",
  "checklist_path": "{workflow.validation_checklist_template}",
  "timestamp": "2026-01-15T09:14:00",
  "overall_synthesis": "2-3 sentences of judgment about the PRD's overall state — what holds up, what's at risk. Written by the subagent, not the parent.",
  "findings": [
    {
      "id": "Q-7",
      "category": "Quality",
      "title": "FR testability",
      "status": "warn",
      "severity": "medium",
      "location": "§4.2 Feature Name, FR-3",
      "note": "FR-3's consequences include 'system handles errors gracefully' which is not testable.",
      "suggested_fix": "Replace with a specific testable condition, e.g. 'System returns HTTP 4xx for invalid input within 200ms.'"
    }
  ]
}
```

Required per-finding fields: `id`, `status` (`pass` | `warn` | `fail` | `n/a`), `severity` (`low` | `medium` | `high` | `critical`). Optional: `category` (renderer derives from ID prefix if omitted), `title`, `location` (cite specifics, never abstract criticism), `note`, `suggested_fix`.

### Render

```bash
python3 {skill-root}/scripts/render-validation-html.py \
  --findings {doc_workspace}/validation-findings.json \
  --template {workflow.validation_report_template} \
  --output {doc_workspace}/validation-report.html \
  --open
```

Use `--open` interactive, omit headless. Writes HTML + markdown twin + JSON summary on stdout; re-running overwrites in place. Update mode reads the markdown form when rolling findings into a revision.

## Close

Surface artifact paths; the rendered HTML/markdown is the persistent artifact. Always offer to roll findings into an Update.
