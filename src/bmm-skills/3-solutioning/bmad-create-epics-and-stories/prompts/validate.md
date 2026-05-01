**Language:** Use `{communication_language}` for all output.
**Output Language:** Use `{document_output_language}` for documents.
**Paths:** Bare paths (e.g. `scripts/validate_initiative.py`) resolve from the skill root.

# Stage 5: Validation

**Goal:** Confirm the v7 epic-and-story tree is sound — schema, deps, numbering, cycles, and coverage. This stage is also the **headless surface** for CI: when invoked with `--re-validate` (or `--headless` / `-H`), it runs once and exits with JSON only.

## Strict validation

The validator handles coverage deterministically when given the inventory. Default invocation:

```
python3 scripts/validate_initiative.py --initiative-store {initiative_store} \
  --inventory {initiative_store}/.bmad-cache/inventory.json
```

Without `--inventory`, the validator only checks schema/deps/cycles/numbering and emits the Coverage-section codes as `mentioned_requirements`; coverage findings will not be generated.

The JSON contract:

- `findings[]` — every error and warning. `coverage-missing` fires for inventory codes that no story's `## Coverage` section claims (mentions in prose elsewhere do not count). Default level is `warning`; pass `--coverage-strict` to escalate to `error`. Other dependency-shape codes: `story-dep-forward` (within-epic dep on a later sibling), `story-dep-cycle` (loop in the story-level depends_on graph), `epic-dep-cycle` (loop in the epic-level graph).
- `summary.epics[]` — full per-epic summary including story-level metadata (basename, title, type, status, depends_on, body_len). Use this instead of re-reading every file.
- `summary.mentioned_requirements` — deduplicated set of codes the validator found in any story's `## Coverage` section. The strict source for the coverage gate.
- `summary.coverage_missing` — codes from the inventory not claimed by any story's `## Coverage` section (only populated when `--inventory` was passed).

## Headless mode

If `{mode}=headless`:

1. Run the validator strict with `--inventory {initiative_store}/.bmad-cache/inventory.json` if the file exists, else without. When the inventory is present and the user wants CI to fail on coverage gaps, pass `--coverage-strict`.
2. Print the JSON output to stdout, unmodified.
3. Exit. Do not greet, converse, or invoke the coverage auditor.
4. Exit code mirrors the validator: 0 if no errors, 1 if any error. Warnings do not change the exit code.

## Interactive mode

### 1. Surface failures conversationally

For each error in `findings`, explain it in one sentence and offer to fix. Group by file when several errors land on the same path. The full code → meaning → fix lookup lives at `resources/validation-error-codes.md` — load it when surfacing failures so the explanation and fix are accurate. Common shortcuts to the right next step:

- **Schema errors** (`*-extra-keys`, `*-missing-keys`, `*-bad-status`, `*-bad-type`) → loop back to `prompts/epic-authoring.md` for that one file, edit the front matter, re-validate.
- **`epic-nn-mismatch` / `story-epic-mismatch`** → likely a hand-edit of the front matter; the folder name is canonical, so update the front matter to match.
- **`story-dep-unresolved`** → either the dep was a typo (fix the depends_on entry) or the target was renamed (`scripts/rename_story.py`) or moved (`scripts/move_story.py`) without updating refs. Use the move/rename scripts going forward — they update refs atomically.
- **`epic-dep-cycle`** → cross-epic graph has a loop. Loop back to `prompts/epic-design.md` (re-derive-deps flow) to fix it.
- **`story-dep-forward`** → a within-epic dep points at a later sibling. Either reorder the stories with `rename_story.py --to-nn` so the dep points backward, or move the dep target into an upstream epic and use the cross-epic ref form.
- **`story-dep-cycle`** → loop in the story-level graph. Loop back to `prompts/edit-mode.md` re-derive-deps. Often a sign two stories should be merged.
- **`story-numbering-gaps`** / **`story-numbering-duplicates`** → use `scripts/rename_story.py --to-nn` to fill the gap or break the duplicate.
- **`epic-filter-not-found`** → the `--epic` flag named a folder that doesn't exist. Spell-check the folder name (including the `NN-` prefix), or drop the flag.

### 2. Coverage check

When `--inventory` was passed, the validator already produced `coverage_missing` deterministically — surface those codes conversationally and route into the **coverage-fix** edit-mode entry point in `prompts/epic-authoring.md`.

For each missing code: ask whether it should be added to an existing story's AC mapping or whether a new story is needed. A code mentioned in Technical Notes (or any prose outside the `## Coverage` section) is treated as uncovered — that's by design, since the AC→codes contract is what downstream skills like `bmad-code-review` rely on. If you suspect the requirement *is* implicitly covered but no story claims its code, fan out `agents/coverage-auditor.md` to do a fuzzy semantic check before adding new stories.

#### Speeding up the auditor with a deterministic pre-pass

When you do invoke the coverage auditor, run `scripts/extract_coverage.py` first and pass the JSON output into the auditor's prompt. The script parses every story's `## Coverage` section into a compact AC→codes map, freeing the auditor to spend tokens on fuzzy semantic matching, not section-locating:

```
python3 scripts/extract_coverage.py --initiative-store {initiative_store}
```

If subagents are unavailable, do the fuzzy pass inline against the same JSON.

### 3. Sizing warnings

The validator emits warnings (not errors) for stories whose body is more than 3× the epic mean. These are advisory — surface them as "this story may not fit one session" and let the user decide whether to split. If many fire on real-world stories, the threshold may need tuning rather than the stories — note for follow-up.

### 4. Re-validate after fixes

Loop back to step 1 after any fix. Stage 5 ends when strict validation has zero errors (and zero `coverage-missing` errors when `--coverage-strict` is in effect) and every inventory item is either covered or explicitly de-scoped by the user.

## Stage Complete

When the validator returns zero errors and coverage is settled, route to `prompts/finalize.md`. In headless mode, exit after step 1 of "Headless mode" above — there is no Stage 6 in headless.
