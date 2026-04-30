**Language:** Use `{communication_language}` for all output.
**Output Language:** Use `{document_output_language}` for documents.
**Paths:** Bare paths (e.g. `scripts/from_spec.py`) resolve from the skill root.

# From-Spec Headless Authoring

You arrive here when the user invoked the skill with `--from-spec <path>`. Stages 1–3 are skipped — the spec carries the initiative title, intent, optional inventory, and the full epic-and-story breakdown. This stage drives Stage 4 (authoring) and Stage 5 (validation) deterministically and emits a single JSON envelope. Suitable for pipelines (PRD → spec → tree) and for senior users who pre-drafted in a scratch buffer.

## Spec schema

The spec is JSON. See `scripts/from_spec.py`'s docstring for the canonical schema; in summary:

- `title`, `intent` — informational metadata.
- `inventory.requirements.{functional|non_functional|ux_design}[]` — optional; if present, written to `{initiative_store}/.bmad-cache/inventory.json` and consumed by Stage 5's coverage gate.
- `epics[]` — required. Each epic has `nn`, `title`, optional `intent`, `depends_on`, `shared_context`, `story_sequence`, `references`, and `stories[]`.
- `epics[].stories[]` — each story has `nn`, `title`, `type` (one of `feature|task|bug|spike`), optional `depends_on`, `user_story`, `acceptance_criteria`, `technical_notes`, `coverage` (AC→codes map).

## Run

```
python3 scripts/from_spec.py --initiative-store {initiative_store} --spec <path-to-spec.json>
```

Add `--coverage-strict` when the user wants a coverage gap to fail validation (CI-style strict run).

The script:

1. Validates the spec (returns 1 with a `details` array if anything is malformed).
2. Calls `init_epic.py` for every epic, then `init_story.py` for every story — the same path Stage 4 uses for interactive authoring.
3. Patches each generated file with the optional body fields from the spec (Goal, Shared Context, Story Sequence, References, User Story, Acceptance Criteria, Technical Notes, Coverage).
4. If `inventory` was in the spec, writes it to the inventory cache.
5. Runs `validate_initiative.py --inventory ...` and includes the result in the envelope.
6. Exits with the validator's exit code: 0 on success, 1 on errors.

## Headless mode

When `{mode}=headless` (the default for `--from-spec`):

1. Print the script's JSON envelope verbatim. Do not greet, converse, or summarize.
2. Exit code mirrors the script's exit code.

## Interactive mode

When the user invokes `--from-spec` interactively (without `--headless`):

1. Run the script.
2. Print a short summary: "Created N epics and M stories. Validation: <pass|errors>." Show the validator's `findings` if any.
3. Offer the standard hand-offs from `prompts/finalize.md` (skip the tree print — `from_spec.py` already produced it via the validator).

## Stage Complete

This prompt is single-shot. After the script returns, the workflow is done — there is no Stage 6 conversational hand-off in headless mode, and in interactive mode the summary above is the terminal step. Edit-mode flows (add-epic, split-epic, etc.) remain available for follow-up edits and are still interactive.
