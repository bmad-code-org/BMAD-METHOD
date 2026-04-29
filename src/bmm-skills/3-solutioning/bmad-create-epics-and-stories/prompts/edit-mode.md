**Language:** Use `{communication_language}` for all output.
**Output Language:** Use `{document_output_language}` for documents.
**Paths:** Bare paths (e.g. `scripts/move_story.py`) resolve from the skill root.

# Edit-Mode Dispatch

You arrive here when Stage 0 detected `{mode}=edit` (the v7 tree at `{initiative_store}/epics/` already has content). Stage 0 also classified `{edit_submode}` from the user's opening message; if it's still ambiguous, ask which of the flows below they want.

**Principle:** never re-walk Stages 1 (intent) and 2 (discovery). Never re-prompt for things visible in existing files. Read the relevant files and ask only what's actually needed.

## add-epic

The user wants a new epic.

1. **Mini Stage 1.** Ask only about the new epic: title, intent, expected story-type theme. Skip everything else.
2. **Mini Stage 3.** With the existing epic list visible (read every `epic.md` for title and `depends_on`), discuss where the new epic fits — its NN (next available), its `depends_on`, and how it relates to the existing graph. Validate no cycle.
3. **Mini Stage 4.** Route to `prompts/epic-authoring.md` for the new epic only. Step 1 (`init_epic.py`) creates the folder; steps 2–6 author it normally. Other epics are not touched.
4. **Strict validation.** Route to `prompts/validate.md` strict. Tree-wide check ensures the addition didn't break anything.

## split-epic

The user wants to split one existing epic into two (or more).

1. **Mini Stage 3 — design the split.** Read the target epic's `epic.md` and every story file under it. Discuss with the user:
   - Where the seam falls (which stories belong in each post-split epic).
   - The new epic's NN (next available), title, intent, and `depends_on` — typically the new sibling depends on the original where the split is downstream.
   - Whether any existing stories should be split themselves (rare; usually the seam falls cleanly between stories).
2. **Mini Stage 4 — execute the split.**
   - Run `init_epic.py` for the new epic folder (the one receiving migrated stories).
   - For each story moving to the new epic, run `scripts/move_story.py --from <old-epic>/<basename> --to-epic <new-epic> [--new-nn N]`. The script rewrites the moved story's `epic:` field, rewrites within-epic depends_on entries that pointed at the moved story (turning bare basenames into cross-epic refs), and updates cross-epic refs across the whole tree. Use a fresh NN sequence in the destination starting at 01 — pass `--new-nn` to renumber.
   - Re-author each affected `epic.md` body so its Goal, Shared Context, and Story Sequence reflect the post-split shape.
   - Renumber any gaps left behind in the source epic with `scripts/rename_story.py --to-nn`.
3. **Strict validation.** Route to `prompts/validate.md` strict.

## merge-epics

The user wants to merge two epics into one.

1. **Mini Stage 3 — design the merge.** Decide which epic survives. Discuss how the surviving `depends_on` collapses (union of both, minus any that becomes self-referential).
2. **Mini Stage 4 — execute.**
   - For each story in the disappearing epic, run `scripts/move_story.py --from <gone-epic>/<basename> --to-epic <surviving-epic> --new-nn <next-N>` to land it after the existing surviving-epic stories.
   - Update the surviving `epic.md` body — consolidate Goal, Shared Context, Story Sequence.
   - Delete the now-empty `gone-epic` folder.
3. **Strict validation.** Route to `prompts/validate.md` strict.

## refine-story

The user wants to fix one specific story.

1. Read the story file and its enclosing `epic.md` for context.
2. **Targeted edit** in `prompts/epic-authoring.md` step 5 only — fill or rewrite ACs, technical notes, coverage. If the story title changed, run `scripts/rename_story.py --to-title "<new title>"` first; it renames the file, updates the `title:` front-matter, and rewrites every depends_on reference across the tree. If the NN changed, also pass `--to-nn`.
3. **Narrow validation.** Route to `prompts/validate.md` strict (the script is fast even on whole trees; no need to scope unless the tree is huge).

## re-derive-deps

The user wants the dependency graph rebuilt — typically because epics or stories were added/removed by hand and the depends_on lists are stale.

1. **Cross-epic** — Mini Stage 3, walking each `epic.md` and discussing whether its current `depends_on` reflects the actual sequencing. Edit the `depends_on:` line in each affected `epic.md` directly.
2. **Within-epic** — Mini Stage 4, walking each epic's stories and confirming each story's `depends_on` reflects what it actually relies on. Edit the `depends_on:` line in each story file directly.
3. **Strict validation.** Route to `prompts/validate.md` strict — the cycle check and dep resolution are the point.

## re-validate

Just run validation. Route directly to `prompts/validate.md` strict. (When the user invoked the skill with `--re-validate` / `--headless` / `-H`, Stage 0 already routed straight to `prompts/validate.md` and never touched this file.)

## Stage Complete

After any flow above, the routed `prompts/validate.md` run becomes the terminal step. Stage 6 (Finalize) is **not re-run** in edit mode — the user already has the tree; there's no fresh hand-off to make. After validation passes, summarize what changed in 1–3 lines and exit.
