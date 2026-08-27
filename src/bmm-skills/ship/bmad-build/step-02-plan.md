# Step 2: Plan

## RULES

- **Language** — Speak in `{{.communication_language}}`. Write any file output in `{{.document_output_language}}`.
- No intermediate approvals.
- **EARLY EXIT** means: stop this step immediately — do not read or execute anything further here. Read and fully follow the target file instead. Return here ONLY if a later step explicitly says to loop back.

## INSTRUCTIONS

1. Draft resume check. If `{spec_file}` exists with `status: draft`, read it and capture the verbatim `<frozen-after-approval>...</frozen-after-approval>` block as `preserved_intent`. Otherwise `preserved_intent` is empty.
2. Investigate the codebase. When you can, send deep searches to subagents and wait for them in this turn. Tell them to return short summaries only, so this session does not fill up with their notes. Keep only what the work needs: the specific files, symbols or lines, what to reuse, and what not to change. Write that into the Code Map. Do not retell the investigation when implementation starts — the spec already has it.

   Do not ask the human during investigation. When something is unclear, look in the repository, planning artifacts, or history first. Keep looking until you know, or until those sources have nothing more to say. Leave any remaining choice for the next step.
3. Decide the path. You already have a plan. Write down three facts about it — as it is now, not as a guess:
   - **Forks** — choices where someone could reasonably pick a different option, and neither the request nor the existing code picks for you. Test: for each "I chose X over Y", could a reasonable reviewer say "actually, Y"?
   - **Irreversibles** — things you cannot undo: migrations, data deletion or mutation, external side effects, deploy or config triggers.
   - **Footprint** — how big: files you will change, and anything new that other code will call or depend on.

   If there are no forks, nothing irreversible, and the change is small: read `[[bmad-snapshot:spec-template.md]]` fully and write `{spec_file}` with only the frontmatter, `## Intent` (inside its `<frozen-after-approval>` block), and `## Implementation Notes`. Delete every other section; the template says you may. Set `route: 'in-session'` and `status: 'in-progress'`, resolving `date` to the current system date. If `preserved_intent` is non-empty, use it as the frozen block. **EARLY EXIT** → `[[bmad-snapshot:step-oneshot.md]]`.

   Otherwise write the full spec. Set `route: 'dispatch'` and continue.
4. Read `[[bmad-snapshot:spec-template.md]]` fully. Fill it out from the intent and investigation, resolving the template's `date` field to the current system date. Put the investigation into `## Code Map`: paths, symbols or lines, what to reuse, and what not to change. Implementation should work from the spec without being told the investigation again. For each Fork you listed, add one `## Open Questions` entry: the choice, the options, and what each option means. If `preserved_intent` is non-empty, replace the `<frozen-after-approval>` block with it before writing. Write the result to `{spec_file}`.
5. Self-review against READY FOR DEVELOPMENT standard. For anything important that's missing: if the repository can tell you, go look and fix the spec; if a human has to decide, add an `## Open Questions` entry. Do not invent the answer.
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
   - If the user chooses **Keep full spec**: Continue with the full spec.
7. Ask the Open Questions. While the spec's `## Open Questions` section is not empty: present every entry as a numbered question with its options and what each option means, then HALT for the human's answers. Write each answer into the `<frozen-after-approval>` block as a decision and delete that entry. Then look at the plan again — an answer may create a new Fork; add any as new entries and repeat. Never offer approval while entries remain. When the last entry is gone, delete the section.

### CHECKPOINT 1

Only when Open Questions is empty.

Present summary. Display the spec file path in whatever form is clickable where you are presenting it (e.g. code citation in chat, CWD-relative path with no leading `/` in terminal). If unsure, use CWD-relative path. 

If token count exceeded 1600 and the user chose to keep the full spec, include the token count and explain why it may be a problem.

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
