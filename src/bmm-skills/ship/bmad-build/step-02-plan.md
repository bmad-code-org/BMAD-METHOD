# Step 2: Plan

## RULES

- **Language** — Speak in `{{.communication_language}}`. Write any file output in `{{.document_output_language}}`.
- No intermediate approvals.
- **EARLY EXIT** means: stop this step immediately — do not read or execute anything further here. Read and fully follow the target file instead. Return here ONLY if a later step explicitly says to loop back.

## INSTRUCTIONS

1. Draft resume check. If `{spec_file}` exists with `status: draft`, read it and capture the verbatim `<frozen-after-approval>...</frozen-after-approval>` block as `preserved_intent`. Otherwise `preserved_intent` is empty.
2. Investigate codebase. _Isolate deep exploration in synchronous subagents/tasks where available. To prevent context snowballing, instruct subagents to give you distilled summaries only._ Decide which findings actually matter for execution — the specific files, symbols/lines, reuse points, and read-only constraints — and carry those forward for the Code Map. This is where the investigation lands: the spec preserves it so it is never re-narrated to the implementer at dispatch time.
3. Route gate. The design is now settled; report three facts about it. This is fact-reporting about a finished design, not prediction:
   - **Forks** — judgment calls where a defensible alternative exists and neither the intent nor codebase convention decides it. Test: for each "I chose X over Y" in the design, could a reasonable reviewer answer "actually, Y"?
   - **Irreversibles** — migrations, data deletion or mutation, external side effects, deploy or config triggers.
   - **Footprint** — files touched and new public surface.

   **All three clean** (no forks, no irreversibles, small footprint) → light path. Read `[[bmad-snapshot:spec-template.md]]` fully and write `{spec_file}` keeping only the frontmatter, `## Intent` (inside its `<frozen-after-approval>` block), and `## Implementation Notes` — delete every other section per the template's deletion license. Set `route: 'in-session'` and `status: 'in-progress'`, resolving `date` to the current system date. If `preserved_intent` is non-empty, use it as the frozen block. **EARLY EXIT** → `[[bmad-snapshot:step-oneshot.md]]`.

   **Any flag** → full spec. Set `route: 'dispatch'` and continue.
4. Read `[[bmad-snapshot:spec-template.md]]` fully. Fill it out based on the intent and investigation, resolving the template's `date` field to the current system date. Drain the investigation into the `## Code Map` section — annotated paths, symbol/line anchors, reuse pointers, and read-only evidence — so the spec is the implementer's investigation map and the step-03 handoff need only point at it. Record each fork the gate reported as one `## Open Questions` entry: the choice, the defensible options, each option's consequence. If `preserved_intent` is non-empty, replace the `<frozen-after-approval>` block in the spec you just filled out with `preserved_intent`, before writing. Write the result to `{spec_file}`.
5. Self-review against READY FOR DEVELOPMENT standard.
6. If intent gaps exist, do not fantasize, HALT and ask the human.
7. Token count check (see SCOPE STANDARD). If spec exceeds 1600 tokens:
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
   - If the user chooses **Keep full spec**: Continue with the full spec.
8. Drain Open Questions. While the spec's `## Open Questions` section is non-empty: present every entry as a numbered question with its options and each option's consequence, then HALT for the human's answers. Fold each answer into the `<frozen-after-approval>` block as a recorded decision and delete its entry. Then re-scan the design — an answer may create a new fork; add any as new entries and repeat. Never offer approval while entries remain. When the last entry resolves, delete the section.

### CHECKPOINT 1

Reachable only at zero open questions.

Present summary. Display the spec file path as a CWD-relative path (no leading `/`) so it is clickable in the terminal. If token count exceeded 1600 and the user chose to keep the full spec, include the token count and explain why it may be a problem.

After presenting the summary, display this note:

---

Before approving, you can open the spec file in an editor or ask me questions and tell me what to change. You can also use `bmad-advanced-elicitation` or `bmad-party-mode`, ideally in another session to avoid context bloat.

---

HALT and give the user a choice:

- **[C] Approve & continue** — approve the spec and implement it in this session, directly from the spec: proceed to step-03 and take its no-subagent path (do not dispatch an implementation subagent), then step-04 as usual.
- **[S] Approve & stop** — approve the spec, leave it `ready-for-dev`, and stop; a later `bmad-build` resume dispatches implementation via step-03 normally.
- **[E] Edit** — apply the user's requested changes to the spec, then return to this checkpoint.

Before acting on approval, re-read `{spec_file}` from disk. If it is missing, HALT without recreating it, changing status, or proceeding. If it changed, acknowledge the external edits and continue with the updated version. Set status `ready-for-dev`; everything inside `<frozen-after-approval>` is then locked and only the human can change it.

## NEXT

Read fully and follow `[[bmad-snapshot:step-03-implement.md]]`
