# Close: Retrospective Document and Sprint Status

Phase 5. Finalize the retrospective and update sprint tracking. Two writes: the retro document, and the `sprint-status.yaml` close-out.

## The retrospective document

This document is the run's working artifact: it is created as a skeleton once the epic is fixed and filled as each phase completes, so Phase 5 finalizes rather than writes it from scratch. It lives at `{implementation_artifacts}/epic-{{epic_number}}-retro-{date}.md`, in `{document_output_language}`, as readable markdown; ensure `{implementation_artifacts}` exists. Sections:

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
  --date {date}
```

It sets `development_status["epic-{{epic_number}}-retrospective"]` to `done`, appends one `action_items` entry per proposed item (`status: open`), and bumps `last_updated`. Read the JSON it returns:

- `ok: true` → report the retro-key transition and `action_items_added`.
- `ok: false` → the file was left untouched; surface the error, do not hand-edit.
- `retro_key_found: false` → the retro key was absent, so nothing was marked done; the document still saved, but tell the user sprint-status needs a manual retro entry.

Adjusting a *previous* epic's action-item statuses from the Phase 4 follow-through is recorded in the retro document; sprint-status surfaces open items regardless, so leave those YAML entries unless the user asks to change them.

## Finish

Report where the document was saved, the verdict, and the action-item count. Then, if `{workflow.on_complete}` is non-empty, follow it as the final terminal instruction before exiting.
