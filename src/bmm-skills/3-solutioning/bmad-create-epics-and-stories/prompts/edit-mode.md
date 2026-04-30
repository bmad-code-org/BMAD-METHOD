**Language:** Use `{communication_language}` for all output.
**Output Language:** Use `{document_output_language}` for documents.
**Paths:** Bare paths (e.g. `scripts/move_story.py`) resolve from the skill root.

# Edit-Mode Dispatch

You arrive here when Stage 0 detected `{mode}=edit` (the v7 tree at `{initiative_store}/epics/` already has content). Stage 0 also classified `{edit_submode}` from the user's opening message; if the user's intent maps to one of the sub-modes below, route immediately. Otherwise present the menu.

**Principle:** never re-walk Stages 1 (intent) and 2 (discovery). Never re-prompt for things visible in existing files. Use the validator's structured summary as your view of the tree instead of reading every file.

## Get the tree summary up front

Before any sub-mode, call:

```
python3 scripts/validate_initiative.py --initiative-store {initiative_store} --summary-only
```

The JSON's `summary.epics[]` already contains, per epic: folder, NN, title, status, depends_on, story_count, and per-story metadata (basename, title, type, status, depends_on). Use this — do not read every `epic.md` and every story file.

## Ambiguous-intent menu

If the user's opening message did not match any sub-mode, ask:

> Which would you like — add an epic, split an epic, merge two epics, rename an epic, refine a story, re-derive deps, or just re-validate?

One soft-prompt sentence per option is enough; do not lecture.

## add-epic

The user wants a new epic.

1. **Mini Stage 1.** Ask only about the new epic: title, intent, expected story-type theme. Skip everything else.
2. **Mini Stage 3.** Using the summary fetched above (titles + depends_on of every existing epic), discuss where the new epic fits — its NN (next available), its `depends_on`, and how it relates to the existing graph. Validate no cycle.
3. **Mini Stage 4.** Route to `prompts/epic-authoring.md` for the new epic only. Step 1 (`init_epic.py`) creates the folder; steps 2–6 author it normally. Other epics are not touched.
4. **Strict validation.** Route to `prompts/validate.md` strict.

## split-epic

The user wants to split one existing epic into two (or more).

1. **Mini Stage 3 — design the split.** From the summary, you already have the target epic's story list (basename, title, type, depends_on). Use it as the working view of the split. Read individual story bodies only when the user wants to discuss a specific story. Discuss with the user:
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

## rename-epic

The user wants to rename or renumber an existing epic without changing its contents.

1. **Mini Stage 3 — confirm.** Identify the target epic from the summary. Confirm the new title (and optionally the new NN) with the user. If the new NN collides with another epic, suggest renumbering the colliding epic out of the way first.
2. **Mini Stage 4 — execute.**
   ```
   python3 scripts/rename_epic.py --initiative-store {initiative_store} \
     --epic <current-folder> [--to-title "<new title>"] [--to-nn <int>]
   ```
   The script renames the folder, updates the renamed `epic.md`'s `title:` and `epic:` fields, rewrites every story's `epic:` field, and propagates cross-epic depends_on and other epics' NN-based deps. No body re-authoring is required.
3. **Strict validation.** Route to `prompts/validate.md` strict.

## refine-story

The user wants to fix one specific story.

1. Read the story file (and only that one). Use the summary for surrounding context.
2. **Targeted edit** in `prompts/epic-authoring.md` step 5 only — fill or rewrite ACs, technical notes, coverage. If the story title changed, run `scripts/rename_story.py --to-title "<new title>"` first. If the NN changed, also pass `--to-nn`.
3. **Validation.** Route to `prompts/validate.md` strict.

## re-derive-deps

The user wants the dependency graph rebuilt — typically because epics or stories were added/removed by hand and the depends_on lists are stale.

1. **Cross-epic** — Mini Stage 3, walking the summary's epic list and discussing whether each `depends_on` reflects the actual sequencing. Edit the `depends_on:` line in each affected `epic.md` directly.
2. **Within-epic** — Mini Stage 4, walking each epic's stories from the summary and confirming each `depends_on` reflects what it actually relies on. Edit the `depends_on:` line in each story file directly.
3. **Strict validation.** Route to `prompts/validate.md` strict.

## re-validate

Just run validation. Route directly to `prompts/validate.md` strict. (When the user invoked the skill with `--re-validate` / `--headless` / `-H`, Stage 0 already routed straight to `prompts/validate.md` and never touched this file.)

## coverage-fix

`prompts/validate.md` routes here when `coverage_missing` reports an inventory code that no story body references. Treat it as a narrow refine-story or new-story flow:

1. From the missing-code list, pick the right epic to host coverage. Ask the user when not obvious.
2. Either extend an existing story's `## Coverage` section (refine-story flow above), or add a new story (epic-authoring step 4 + step 5).
3. Re-validate.

## Boundaries (intentionally not supported here)

- **Destructive delete of an epic.** Removing an epic and all its stories irrecoverably is not a sub-mode. The user should `rm -rf` the folder themselves and then run `re-validate` to surface any cross-epic dep refs that need cleanup. Two reasons: a guarded skill flow gives the appearance of safety it doesn't actually provide, and dependent-ref cleanup is exactly what the validator already does post-deletion.
- **Renaming the initiative itself.** Out of scope here — the initiative is identified by `{initiative_store}` configuration upstream of this skill.

## Stage Complete

After any flow above, the routed `prompts/validate.md` run becomes the terminal step. Stage 6 (Finalize) is **not re-run** in edit mode — the user already has the tree; there's no fresh hand-off to make. After validation passes, summarize what changed in 1–3 lines and exit.
