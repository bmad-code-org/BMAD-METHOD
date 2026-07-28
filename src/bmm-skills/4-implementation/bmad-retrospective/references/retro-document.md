# Close: Retrospective Document and Sprint Status

Phase 5. Finalize the retrospective and update sprint tracking. Two writes: the retro document, and the `sprint-status.yaml` close-out.

## The retrospective document

This document is the run's working artifact: it is created as a skeleton once the epic is fixed and filled as each phase completes, so Phase 5 finalizes rather than writes it from scratch. It lives at `{implementation_artifacts}/epic-{{epic_number}}-retro-{date}.md`, in `{document_output_language}`, as readable markdown; ensure `{implementation_artifacts}` exists.

Open the document with YAML frontmatter a machine can read without parsing the prose — an epic gate or orchestrator keys off `verdict` to decide whether to hold the next epic:

```
---
epic: {{epic_number}}
date: {date}
verdict: accepted | accepted-with-open-items | rejected
criteria: declared | profiled
headless: true | false
---
```

Keep `verdict` in sync with the Acceptance verdict section below. Do not encode the verdict in the sprint-status retro key — that key's value stays `done` so the existing lifecycle consumers (sprint planning's `optional ↔ done` transition, status TUIs) keep working unchanged.

Sections:

- **Epic summary** — which epic, the diff range, stories completed, the evidence inventory (what was available, what was missing).
- **Findings** — grouped by aggregate view and by lens, each with its source reference and disposition (fix now / defer / accept). This is the record; do not summarize away the provenance.
- **Behavior verification** — what was exercised end to end and what was observed, or an explicit note that runtime behavior was not exercised.
- **Previous-retro follow-through** — if a prior retro exists, whether its action items landed, with evidence.
- **Action items** — the routed fix-now items and process lessons, each with an owner. Note which are proposed remediation or spec reconciliations awaiting human application.
- **Acceptance verdict** — accepted / accepted with open items / rejected, whether the criteria were declared or profiled, and the evidence behind the call.
- **Open questions** — what a human answer would materially change, and anything the analyses could not resolve.
- **Assumptions** — in headless runs, every choice made without the user: which epic was auto-selected, a verdict rendered with no human decision, each proposed item. Omit in interactive runs.

Do not state time estimates anywhere in the document.

## Sprint-status update

Do not hand-edit `sprint-status.yaml` — its comment blocks and quoting are exactly the write that most often corrupts the file. Use the bundled script, which round-trips through a comment-preserving YAML parser, force-quotes values so punctuation (a leading `#`, a colon) cannot break parsing, and validates the result — restoring the original file untouched if the write does not verify:

```
uv run {skill-root}/scripts/sprint_status.py update \
  --file {implementation_artifacts}/sprint-status.yaml \
  --epic {{epic_number}} --set-retro-done \
  --add-action '[{"action":"...","owner":"..."}, ...]' \
  --ref {implementation_artifacts}/epic-{{epic_number}}-retro-{date}.md \
  --verdict "<the acceptance verdict>" \
  --date {date}
```

It sets `development_status["epic-{{epic_number}}-retrospective"]` to `done`, appends one `action_items` entry per proposed item, and bumps `last_updated`. Each appended item carries `status: open`, a stable `id` (`epic-<N>-retro-item-<n>-<slug>` derived from the action text, or the `id` you supply in the JSON), and a `ref` back to this retro document (from `--ref`, or a per-item `ref` in the JSON) — so an orchestrator can dedupe items across re-runs and dispatch each one to its full, sourced finding. `--verdict` is not written into the file; it is echoed back in the result JSON as a signal for consumers. Read the JSON it returns:

- `ok: true` → report the retro-key transition, `action_items_added`, `action_items_updated`, and the echoed `verdict`.
- `ok: false` → the file was left untouched (`restored: true`); surface the error, do not hand-edit. `restored: false` means the rollback write also failed and the file may be incomplete — warn the user explicitly.
- `retro_key_found: false` → the retro key was absent, so nothing was marked done; the document still saved, but tell the user sprint-status needs a manual retro entry.

Moving a *previous* epic's action items off `open` is recorded in the retro document either way. When the Phase 4 follow-through has evidence an item landed, or the user says one did, offer to update the sprint-status entries too and run `--set-action-status` with exactly what the user confirms — that flag is the one sanctioned path to change a status, and hand-editing is never one. It composes with the close-out above, or runs on its own:

```
uv run {skill-root}/scripts/sprint_status.py update \
  --file {implementation_artifacts}/sprint-status.yaml \
  --epic {{epic_number}} \
  --set-action-status '[{"id":"epic-1-retro-item-1-add-error-handling","status":"done"},{"epic":1,"action":"Exact action text","status":"in-progress"}]'
```

Rules:

- Select an item by its `id`, or — for legacy entries written before ids existed — by `epic` plus the item's exact `action` text. An entry carrying both uses the `id`. Matching is exact: no trimming, no case folding, and `epic` must be a JSON integer. The `--epic` flag does not scope selectors; it only names the retro key and the epic recorded on appended items, so items from any epic are addressable in one call.
- The only statuses are `open`, `in-progress`, and `done`. `bmad-sprint-status` counts both `open` and `in-progress` as open action items, so only `done` retires an item from the surfaced list — moving something to `in-progress` records progress, it does not quiet the dashboard.
- Every selector must resolve to exactly one item already in the file. Matching nothing, matching more than one, or colliding with another entry in the same array aborts the whole invocation — `ok: false`, `restored: true`, the file byte-identical and nothing partially applied. "Whole invocation" includes any `--set-retro-done` and `--add-action` passed in the same call: one mistyped selector drops the entire close-out, so re-run the full command after fixing it rather than assuming the retro key was set.
- Items appended by `--add-action` in the same run are not addressable in that run; they are always written as `open`.
- Only ever apply a status the user confirmed, and in a headless run do not pass this flag at all.
- Success reports `action_items_updated`.

Only ever apply a status the user confirmed: the evidence justifies the offer, never the write. In a headless run do not use this flag at all — record the transitions you would have proposed in the Previous-retro follow-through section and leave the prior items' statuses alone.

## Finish

Report where the document was saved, the verdict, and the action-item count. Then, if `{workflow.on_complete}` is non-empty, follow it as the final terminal instruction before exiting.
