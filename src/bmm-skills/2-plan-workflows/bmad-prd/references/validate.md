# Validate

The full Validate intent playbook. Also covers the structural-validator rendering pipeline used during mid-session report requests.

Critique an existing PRD without changing it. Standalone; does NOT enter `## Finalize`.

## Orient

Source-extract against `decision-log.md`, any original inputs, and the PRD/addendum themselves. Delegate to subagents per `## Constraints` → Extract, don't ingest; the parent assembles from extracts.

## Run the Reviewer Gate

Run the `## Reviewer Gate` (in SKILL.md) against `prd.md` (and `addendum.md` if present). The gate handles menu assembly, parallel dispatch, the subagent contract, and the section-by-section walk-through.

The structural checklist validator is one entry in the gate menu; under Validate intent it additionally runs the rendering pipeline below. The Finalize discipline pass during Create/Update does NOT render a report — its findings stay in-conversation.

## Structural validator pipeline

The structural validator subagent walks `{workflow.validation_checklist}` against `prd.md` (and `addendum.md` if present) and writes findings to `{doc_workspace}/validation-findings.json`:

```json
{
  "prd_name": "Example Product",
  "prd_path": "{doc_workspace}/prd.md",
  "checklist_path": "{workflow.validation_checklist}",
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

Per-finding fields:

- `id` (required) — checklist item ID (e.g., `Q-1`, `D-2`, `STK-1`, or org-custom prefixes).
- `category` (optional) — explicit category name; if omitted, the renderer maps from the ID prefix.
- `title` (optional but recommended) — the checklist item's short name.
- `status` — `pass` | `warn` | `fail` | `n/a`.
- `severity` — `low` | `medium` | `high` | `critical`.
- `location` (optional) — section/line/range in the PRD where the finding lives. Cite specifics, never abstract criticism.
- `note` (optional) — the finding itself, in one or two sentences.
- `suggested_fix` (optional) — concrete next action.

### Render

After the subagent writes findings:

```bash
python3 {skill-root}/scripts/render-validation-html.py \
  --findings {doc_workspace}/validation-findings.json \
  --template {workflow.validation_report_template} \
  --output {doc_workspace}/validation-report.html \
  --open
```

Include `--open` for interactive runs (auto-opens in default browser). Omit `--open` in headless runs.

The script writes two artifacts side-by-side: the HTML report at `--output`, and a markdown companion at the same path with `.md` extension (e.g. `validation-report.md`). Both are always produced when the script runs. It computes pass/warn/fail/na counts, derives a grade (Excellent / Good / Fair / Poor) from critical-fail and total-fail counts, renders an inline SVG score bar in the HTML, groups findings by category, and returns a one-line JSON summary on stdout: `{"output": "...", "markdown": "...", "grade": "...", "stats": {...}}`.

Re-running validation overwrites existing report files in place. Markdown form is what Update mode reads when rolling findings into a revision.

## Close

Surface all artifact paths and summaries to the user. The Reviewer Gate's walk-through covers section-by-section review of findings; the rendered HTML/markdown report is the persistent artifact. Always offer to roll findings into an Update; Validate itself does not change `prd.md`.
