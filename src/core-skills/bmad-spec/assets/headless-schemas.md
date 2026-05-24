# Headless JSON Schemas

The default invocation is headless: input goes in, JSON comes out. Omit keys for artifacts not produced.

## Common fields

- `status` — `"complete"`, `"partial"`, or `"blocked"`
- `intent` — `"create"`, `"update"`, or `"validate"` (inferred from inputs)
- `reason` — required when `status` is `"blocked"`; one-sentence explanation
- `assumptions` — array of inferred values not directly confirmed by inputs
- `open_questions` — array of gaps that need a human decision

## Create / Update

```json
{
  "status": "complete",
  "intent": "create",
  "spec_path": "{run_folder}/prd-spec-20260518-1432.md",
  "decision_log_path": "{run_folder}/.decision-log.md",
  "source_artifact": "{run_folder}/prd.md",
  "capabilities": [
    {"id": "CAP-1", "intent": "User can record a voice memo pinned to current GPS coords."},
    {"id": "CAP-2", "intent": "User hears memos auto-trigger when walking within range of a drop."}
  ],
  "verdict": "Ready for downstream. All six Spec Law rules pass.",
  "assumptions": [],
  "open_questions": []
}
```

- `spec_path` follows the **Workspace** rules in `SKILL.md`: sibling of the source file (`{input-basename}-spec-{datetime}.md`) when input is a local file, or `{planning_artifacts}/specs/{slug}-spec-{datetime}.md` when input is chat-only or remote.
- `source_artifact` is the path consumed when distilling a ceremony doc; `null` for pure brain-dump or chat-only runs.
- `decision_log_path` is included only when a `.decision-log.md` was actually written to (the source's folder already had one). Omit the key entirely otherwise.
- `capabilities` carries IDs and one-line intents only — enough for downstream consumers to address them without re-reading the Spec.
- `verdict` is the one-paragraph self-validate result. When `status` is `"partial"`, the verdict explains what is blocking "ready for downstream."

## Validate-only

```json
{
  "status": "complete",
  "intent": "validate",
  "spec_path": "{run_folder}/prd-spec-20260518-1432.md",
  "decision_log_path": "{run_folder}/.decision-log.md",
  "verdict": "Two rules weak: success signal is decorative; non-goals section empty.",
  "findings": [
    {"rule": "Success signal is concrete", "note": "Currently reads 'users love it' — not testable."},
    {"rule": "Non-goals are explicit", "note": "Section absent."}
  ],
  "offer_to_update": true
}
```

## Blocked

```json
{
  "status": "blocked",
  "intent": "create",
  "reason": "Input was a one-line idea with no surrounding context; too thin to distill. Suggest bmad-prd to draw the vision out first."
}
```

Always include the intent (best-guess if not certain) and a one-sentence `reason`.
