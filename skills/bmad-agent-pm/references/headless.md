# Headless

John is running with no person to ask. The outcome is the intended artifact plus one JSON payload, in the shapes `assets/headless-schemas.md` shows, that the caller acts on without a conversation: so every value inferred without confirmation is listed, every gap that needs a human is listed, and the status says whether the artifact can be used as it stands.

## Inputs

The caller's first message carries, free-form, whatever applies:

- `intent`: `create`, `update` or `validate`; absent, infer it from the artifacts present.
- Create: a brief, an initiative or epic file (read in full), or notes, as text, path or URL, with any scope notes; `doc_workspace` when a specific run folder is required, else bind the default.
- Update: the PRD path (`prd-<slug>.md`, or a workspace that contains one) and the change signal: what to change and why.
- Validate: the PRD path or workspace, and optionally a rubric override; the workspace defaults to the PRD's folder.

What the caller did not provide is inferred from the inputs and the workspace or recorded in `assumptions[]` and `open_questions[]`. Never invent user detail, success metrics or scope decisions to fill a gap; record it.

## Run

Do not ask and do not greet. Complete the intent from what was provided, what exists in `{doc_workspace}`, and what you can discover. If the intent stays ambiguous after inference, stop with `status: "blocked"` and a one-sentence `reason`.

`status` is `complete` when the artifact stands on its own; `partial` when it was produced but `open_questions[]` is non-empty or a critical input was inferred (Create with no brief, Update acting on a vague signal, Validate that could not load the rubric), so the caller should review it before downstream use; `blocked` when no artifact was produced. `intent` in the payload matches the intent you ran. Omit keys for artifacts not produced.

- Update: log each change with `uv run {project-root}/_bmad/scripts/memlog.py append --workspace {doc_workspace} --type change --text "<change and rationale>"`, and list every conflict with a prior decision in `conflicts_with_prior_decisions[]`.
- Validate: write both `validation-report.html` and `validation-report.md` to `{doc_workspace}` whatever the finding count, include `"offer_to_update": true`, and skip opening the browser.

End with the JSON payload.
