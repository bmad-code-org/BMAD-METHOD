# Validation Rendering

How the validator subagent's findings become a validation report. Loaded only when the user has explicitly asked for analysis — either Validate intent or a mid-session report request. The Finalize discipline pass during Create/Update does NOT render a report; its findings stay in-conversation.

## Validator subagent output contract

The subagent walks `{workflow.validation_checklist}` against `prd.md` (and `addendum.md` if present) and writes `{doc_workspace}/validation-findings.json`:

```json
{
  "prd_name": "Plantsona",
  "prd_path": "{doc_workspace}/prd.md",
  "checklist_path": "{workflow.validation_checklist}",
  "timestamp": "2026-05-11T09:14:00",
  "overall_synthesis": "2-3 sentences of judgment about the PRD's overall state — what holds up, what's at risk. Written by the subagent, not the parent.",
  "findings": [
    {
      "id": "Q-2",
      "category": "Quality",
      "title": "Measurability",
      "status": "warn",
      "severity": "medium",
      "location": "§16 Success Metrics, lines 408-422",
      "note": "Success Metrics list is measurable but counter-metrics are named only for premium conversion. Other metrics lack paired counter-metrics.",
      "suggested_fix": "Add counter-metrics for engagement (e.g., DAU/MAU) and seasonal cadence."
    }
  ]
}
```

Per-finding fields:

- `id` (required) — checklist item ID (e.g., `Q-1`, `D-2`, `STK-1`, or org-custom prefixes).
- `category` (optional) — explicit category name; if omitted, the renderer maps from the ID prefix.
- `title` (optional but recommended) — the checklist item's short name.
- `status` — `pass` | `warn` | `fail` | `n/a`.
- `severity` — `low` | `medium` | `high` | `critical`.
- `location` (optional) — section/line/range in the PRD where the finding lives. Cite specifics, never abstract criticism.
- `note` (optional) — the finding itself, in one or two sentences.
- `suggested_fix` (optional) — concrete next action.

## Rendering invocation

After the subagent writes findings:

```bash
python3 {skill-root}/scripts/render-validation-html.py \
  --findings {doc_workspace}/validation-findings.json \
  --template {workflow.validation_report_template} \
  --output {doc_workspace}/validation-report.html \
  --open
```

Include `--open` for interactive runs (auto-opens in default browser). Omit `--open` in headless runs.

The script writes two artifacts side-by-side: the HTML report at `--output`, and a markdown companion at the same path with `.md` extension (e.g. `validation-report.md`). Both are always produced when the script runs — trigger gating happens upstream (the script is only invoked when the user has asked for analysis). It computes pass/warn/fail/na counts, derives a grade (Excellent / Good / Fair / Poor) from critical-fail and total-fail counts, renders an inline SVG score bar in the HTML, groups findings by category, and returns a one-line JSON summary on stdout: `{"output": "...", "markdown": "...", "grade": "...", "stats": {...}}`.

Re-running validation overwrites the existing report files in place. Markdown form is what Update mode reads when rolling findings into a revision.
