# Step 2: Plan

## RULES

- **Language** — Speak in `{{.communication_language}}`. Write any file output in `{{.document_output_language}}`.
- No intermediate approvals.

## INSTRUCTIONS

1. Draft resume check. If `{spec_file}` exists with `status: draft`, read it. When `manifest_story_mode` is true, capture the verbatim `<intent-contract>...</intent-contract>` block as `preserved_intent`; otherwise capture the verbatim `<frozen-after-approval>...</frozen-after-approval>` block as `preserved_intent`. If there is no draft to resume, `preserved_intent` is empty.
2. Investigate codebase. _Isolate deep exploration in synchronous subagents/tasks where available. To prevent context snowballing, instruct subagents to give you distilled summaries only._ Decide which findings actually matter for execution — the specific files, symbols/lines, reuse points, and read-only constraints — and carry those forward for the Code Map. This is where the investigation lands: the spec preserves it so it is never re-narrated to the implementer at dispatch time.
3. Select the template once from the explicit route: when `manifest_story_mode` is true, read `./story-spec-template.md` fully; otherwise read `./spec-template.md` fully. Fill the selected template based on the intent and investigation, resolving its `date` field to the current system date. Drain the investigation into the `## Code Map` section — annotated paths, symbol/line anchors, reuse pointers, and read-only evidence — so the spec is the implementer's investigation map and the step-03 handoff need only point at it. If `preserved_intent` is non-empty, replace the matching `<intent-contract>` block in manifest-story mode or `<frozen-after-approval>` block in standalone mode with `preserved_intent`, before writing. Never translate between the two wrappers. Write the result to `{spec_file}`.
4. Self-review against READY FOR DEVELOPMENT standard.
5. If intent gaps exist, do not fantasize, do not leave open questions, HALT and ask the human.
6. Token count check (see SCOPE STANDARD). If spec exceeds 1600 tokens:
   - Show user the token count.
   - HALT and ask human: `[S] Split — carve off secondary goals` | `[K] Keep full spec — accept the risks`
   - On **S**: Propose the split — name each secondary goal. For each deferred goal, append one new entry to `{{.deferred_work_file}}` using this format. Do not modify existing entries or look for duplicates. Rewrite the current spec to cover only the main goal — do not surgically carve sections out; regenerate the spec for the narrowed scope. Continue to checkpoint.
     ```markdown
     - source_spec: `{spec_file}`
       summary: <one sentence naming the deferred goal>
       evidence: <why this was split from the current spec>
     ```
   - On **K**: Continue to checkpoint with full spec.

### CHECKPOINT 1

Present summary. Display the spec file path as a CWD-relative path (no leading `/`) so it is clickable in the terminal. If token count exceeded 1600 and user chose [K], include the token count and explain why it may be a problem.

After presenting the summary, display this note:

---

Before approving, you can open the spec file in an editor or ask me questions and tell me what to change. You can also use `bmad-advanced-elicitation`, `bmad-party-mode`, or `bmad-code-review` skills, ideally in another session to avoid context bloat.

---

HALT and ask human: `[A] Approve` | `[E] Edit`

- **A**: Re-read `{spec_file}` from disk.
  - **If the file is missing:** HALT. Tell the user the spec file is gone and STOP — do not write anything to `{spec_file}`, do not set status, do not proceed to Step 3. Nothing below this point runs.
  - **If the file exists:** Compare the content to what you wrote. If it has changed since you wrote it, acknowledge the external edits — show a brief summary of what changed — and proceed with the updated version. Then set status `ready-for-dev` in `{spec_file}`. In manifest-story mode everything inside `<intent-contract>` is now locked; in standalone mode everything inside `<frozen-after-approval>` is now locked. Only the human can change the selected intent boundary. → Step 3.
- **E**: Apply changes, then return to CHECKPOINT 1.

## NEXT

Read fully and follow `./step-03-implement.md`
