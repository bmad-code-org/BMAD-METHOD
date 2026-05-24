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
  "spec_path": "_bmad-output/specs/spec-quarter-drop/",
  "decision_log_path": "_bmad-output/specs/spec-quarter-drop/.decision-log.md",
  "sources": ["_bmad-output/planning-artifacts/prds/prd-quarter-drop-2026-05-22/prd.md"],
  "companions": ["glossary.md", "../planning-artifacts/ux-designs/ux-quarter-drop-2026-05-22/DESIGN.md"],
  "capabilities": [
    {"id": "CAP-1", "intent": "User can record a voice memo pinned to current GPS coords."},
    {"id": "CAP-2", "intent": "User hears memos auto-trigger when walking within range of a drop."}
  ],
  "verdict": "Ready for downstream. All eight Spec Law rules pass.",
  "assumptions": [],
  "open_questions": []
}
```

- `spec_path` is the **spec folder**, per Workspace rules in `SKILL.md` (default: `{output_folder}/specs/spec-{slug}/`). The kernel file inside is named per `customize.toml.spec_filename` (default `SPEC.md`).
- `sources` is the array of files fully absorbed into the SPEC; audit-only, downstream does NOT read these. Empty when input had no fully-absorbed source (e.g., a UX-folder-only input).
- `companions` is the array of `.md` files downstream MUST read alongside SPEC.md. Sibling-relative for spec-authored (e.g., `glossary.md`); outside-folder-relative for adopted (e.g., `../planning-artifacts/ux-designs/{run}/DESIGN.md`).
- `capabilities` carries IDs and one-line intents only — enough for downstream consumers to address them without re-reading the spec.
- `verdict` is the one-paragraph self-validate result. When `status` is `"partial"`, the verdict explains what is blocking "ready for downstream."

## Validate-only

```json
{
  "status": "complete",
  "intent": "validate",
  "spec_path": "_bmad-output/specs/spec-quarter-drop/",
  "decision_log_path": "_bmad-output/specs/spec-quarter-drop/.decision-log.md",
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

Always include `intent` (best-guess if not certain). When `status` is `"blocked"`, include a one-sentence `reason`.
