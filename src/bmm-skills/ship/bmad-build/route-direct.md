# Direct Build Route

## RULES

- **Language** — Speak in `{{.communication_language}}`. Write any file output in `{{.document_output_language}}`.
- NEVER push.

## THE LOOP

This route is an interactive editing loop, not a pipeline: the user is watching the file on screen and is the review process.

{workflow.direct_route}

## CODE REVIEW

When an edit in this loop touches code — a file a machine executes or parses for behavior, not prose, prompts, or docs — run the review below after the edit lands, with `{diff_output}` set to the diff of that edit. Fix or surface anything it returns; drop everything else silently — no classification, no deferred-work entries, no spec trace.

{workflow.direct_review}

## ESCALATION

If an edit needs to reach beyond its pointed span — another section, a second file, a decision the user did not pin — or any direct-route tell from SKILL.md stops holding, stop editing. Keep what you learned, then read fully and follow `[[bmad-snapshot:workflow.md]]`.
