**Language:** Use `{communication_language}` for all output.
**Output Language:** Use `{document_output_language}` for documents.
**Paths:** Bare paths (e.g. `scripts/validate_initiative.py`) resolve from the skill root.

# Stage 5: Validation

**Goal:** Confirm the v7 epic-and-story tree is sound — schema, deps, numbering, cycles — and that every initiative-level requirement is covered by at least one story's AC mapping. This stage is also the **headless surface** for CI: when invoked with `--re-validate` (or `--headless` / `-H`), it runs once and exits with JSON only.

## Strict validation

Run:

```
python3 scripts/validate_initiative.py --initiative-store {initiative_store}
```

Strict mode is the default. Take the JSON output. The `findings` list contains every error and warning; the `summary` block has the epic list, story counts by status, error/warning counts, and `mentioned_requirements` (the deduplicated set of FR / NFR / UX-DR codes the script extracted from story bodies via regex).

**The script does not check coverage.** The Stage 2 inventory lives in your working memory, not on disk — only you can compare. See "Coverage check" below.

## Headless mode

If `{mode}=headless`:

1. Run the validator strict.
2. Print the JSON output to stdout, unmodified.
3. Exit. Do not greet, do not converse, do not invoke the coverage auditor (CI doesn't have the inventory in memory).
4. Exit code mirrors the validator: 0 if no errors, 1 if errors. Warnings do not change the exit code.

## Interactive mode

### 1. Surface failures conversationally

For each error in `findings`, explain it in one sentence and offer to fix. Group by file when there are several errors on the same path. Common patterns and the right next step:

- **Schema errors** (`*-extra-keys`, `*-missing-keys`, `*-bad-status`, `*-bad-type`) → loop back to `prompts/epic-authoring.md` for that one file, edit the front matter, re-validate.
- **`epic-nn-mismatch` / `story-epic-mismatch`** → likely a hand-edit of the front matter; the folder name is canonical, so update the front matter to match.
- **`story-dep-unresolved`** → either the dep was a typo (fix the depends_on entry) or the target was renamed (`scripts/rename_story.py`) or moved (`scripts/move_story.py`) without updating refs. Use the move/rename scripts for renames going forward — they update refs atomically.
- **`epic-dep-cycle`** → the cross-epic graph has a loop. Loop back to `prompts/epic-design.md` (re-derive-deps flow) to fix it.
- **`story-numbering-gaps`** → use `scripts/rename_story.py --to-nn` to fill the gap or renumber the survivors.

### 2. Coverage check

The validator's `summary.mentioned_requirements` is the set of codes that appear textually anywhere in any story body. Compare it to the Stage 2 inventory:

- **Codes in inventory but not in `mentioned_requirements`** → likely uncovered. Confirm by spot-reading the relevant epic's stories.
- **If the prose is ambiguous** (a story's Coverage line uses prose like "password policy" instead of `NFR3.2`) → fan out `agents/coverage-auditor.md` with the inventory and the tree path. The auditor returns exact + fuzzy matches and a list of uncovered codes.

For each uncovered requirement: surface it conversationally, ask whether it should be added to an existing story's AC mapping or whether a new story is needed. Loop back to `prompts/epic-authoring.md` for the targeted edit.

### 3. Sizing warnings

The validator emits warnings (not errors) for stories whose body is more than 3× the epic mean. These are advisory — surface them as "this story may not fit one session" and let the user decide whether to split. If many warnings fire on real-world stories, the threshold may need tuning rather than the stories — note it for a follow-up.

### 4. Re-validate after fixes

Loop back to step 1 after any fix. Stage 5 ends when strict validation has zero errors and every inventory item is either covered or explicitly de-scoped by the user.

## Stage Complete

When the validator returns zero errors and coverage is settled, route to `prompts/finalize.md`. In headless mode, exit after step 1 of "Headless mode" above — there is no Stage 6 in headless.
