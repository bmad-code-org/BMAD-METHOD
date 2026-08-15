# Step 2: Plan

## RULES

- **Language** — Speak in `{{.communication_language}}`. Write any file output in `{{.document_output_language}}`.
- No intermediate approvals.

## INSTRUCTIONS

1. Draft resume check. If `{spec_file}` exists with `status: draft`, read it and capture the verbatim `<frozen-after-approval>...</frozen-after-approval>` block as `preserved_intent`. Otherwise `preserved_intent` is empty.
2. Investigate codebase. _Isolate deep exploration in synchronous subagents/tasks where available. To prevent context snowballing, instruct subagents to give you distilled summaries only._ Decide which findings actually matter for execution — the specific files, symbols/lines, reuse points, and read-only constraints — and carry those forward for the Code Map. This is where the investigation lands: the spec preserves it so it is never re-narrated to the implementer at dispatch time.
3. Read `[[bmad-snapshot:spec-template.md]]` fully. Fill it out based on the intent and investigation, resolving the template's `date` field to the current system date. Drain the investigation into the `## Code Map` section — annotated paths, symbol/line anchors, reuse pointers, and read-only evidence — so the spec is the implementer's investigation map and the step-03 handoff need only point at it. If `preserved_intent` is non-empty, replace the `<frozen-after-approval>` block in the spec you just filled out with `preserved_intent`, before writing. Write the result to `{spec_file}`.
4. Self-review against READY FOR DEVELOPMENT standard.
5. If intent gaps exist, do not fantasize, do not leave open questions, HALT and ask the human.
6. Token count check (see SCOPE STANDARD). If spec exceeds 1600 tokens:
   - Show user the token count.
   - HALT and give the user a choice:
     - **Split** — carve off secondary goals.
     - **Keep full spec** — accept the risks.
   - If the user chooses **Split**: Propose the split — name each secondary goal. For each deferred goal, append one new entry to `{{.implementation_artifacts}}/deferred-work.md` using this format. Do not modify existing entries or look for duplicates. Rewrite the current spec to cover only the main goal — do not surgically carve sections out; regenerate the spec for the narrowed scope. Continue to checkpoint.
     ```markdown
     - source_spec: `{spec_file}`
       summary: <one sentence naming the deferred goal>
       evidence: <why this was split from the current spec>
     ```
   - If the user chooses **Keep full spec**: Continue to checkpoint with the full spec.

### CHECKPOINT 1

Present summary. Display the spec file path as a CWD-relative path (no leading `/`) so it is clickable in the terminal. If token count exceeded 1600 and the user chose to keep the full spec, include the token count and explain why it may be a problem.

After presenting the summary, display this note:

---

Before approving, you can open the spec file in an editor or ask me questions and tell me what to change. You can also use `bmad-advanced-elicitation` or `bmad-party-mode`, ideally in another session to avoid context bloat.

---

HALT and give the user a choice:

- **Approve and continue** — approve the spec and proceed to implementation in this session.
- **Approve and stop** — approve the spec, leave it `ready-for-dev`, and stop so a fresh `bmad-build` session can resume at implementation.
- **Review spec** — review the spec, use a subagent if available, and discuss the findings and revisions with the user until the user is ready to approve, then either stop or continue.

Before acting on approval, re-read `{spec_file}` from disk. If it is missing, HALT without recreating it, changing status, or proceeding. If it changed, acknowledge the external edits and continue with the updated version. Set status `ready-for-dev`; everything inside `<frozen-after-approval>` is then locked and only the human can change it.

## NEXT

Read fully and follow `[[bmad-snapshot:step-03-implement.md]]`
