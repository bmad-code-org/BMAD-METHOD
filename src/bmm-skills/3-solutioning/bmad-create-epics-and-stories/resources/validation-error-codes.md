# Validation Error Codes

The lookup table for every error and warning `scripts/validate_initiative.py` emits — what each code means, how it arises, and how to fix it. Loaded by `prompts/validate.md` when surfacing failures conversationally.

The output shape is always:

```json
{"level": "error|warning", "code": "<code>", "message": "<human text>", "path": "<absolute path>"}
```

`level` controls the exit code: any `error` causes the validator to return 1; warnings don't. `coverage-missing` is the one code whose level depends on a flag (`--coverage-strict` escalates it).

## Schema errors

These fire when a file's front matter doesn't match the locked schema in `resources/epic-frontmatter-schema.md` and `resources/story-frontmatter-schema.md`.

| Code | Meaning | Fix |
| --- | --- | --- |
| `epic-frontmatter-parse` | The validator's loose YAML parser couldn't read the front matter. Usually a missing `:`, an unindented continuation, or unclosed `---`. | Open the `epic.md` and check the front-matter block. The parser tolerates inline lists and inline strings; reject indented multi-line strings. |
| `epic-extra-keys` | The epic's front matter has a top-level key that isn't in `{title, epic, status, depends_on, metadata}`. | Move the key under `metadata:` (which is free-form), or remove it. |
| `epic-missing-keys` | A required top-level key is absent: `title`, `epic`, `status`, or `depends_on`. | Add it. `init_epic.py` always emits all four; this fires when a hand-edit dropped one. |
| `epic-bad-status` | `status` value isn't one of `draft / ready / in-progress / review / done / blocked`. | Set to a valid enum value. New epics should be `draft`. |
| `epic-nn-mismatch` | `epic:` field doesn't match the folder's NN prefix. The folder name is canonical. | Edit the front matter to match the folder. If the folder name itself is wrong, use `rename_epic.py --to-nn`. |
| `epic-deps-not-list` | `depends_on:` is not a YAML list. | Make it `[]` (empty) or `["01", "02"]`. Inline lists only. |
| `story-frontmatter-parse` | Same as above, for a story file. | Check the front-matter block. |
| `story-extra-keys` | Story has a top-level key not in `{title, type, status, epic, depends_on, metadata}`. | Move under `metadata:` or remove. |
| `story-missing-keys` | A required key is absent. | Add it. |
| `story-bad-type` | `type` isn't one of `feature / bug / task / spike`. | Pick one. Story type drives body skeleton choices (the user-story stanza is required for `feature`, optional for `bug`/`spike`, absent for `task`). |
| `story-bad-status` | Same as `epic-bad-status` for a story. | Set a valid status. |
| `story-bad-prefix` | Story filename doesn't start with `NN-`. | Rename to match the convention. The validator expects `^\d+-`. |
| `story-epic-mismatch` | Story's `epic:` field doesn't match its enclosing folder name. The folder name is canonical. | Edit the front matter to match the folder. Or move the file with `move_story.py`. |
| `story-deps-not-list` | `depends_on:` is not a YAML list. | Make it `[]` or an inline list. |

## Dependency errors

These fire when references don't resolve.

| Code | Meaning | Fix |
| --- | --- | --- |
| `epic-dep-unresolved` | An epic's `depends_on` references an NN that has no corresponding folder in the tree. | Either fix the typo, or remove the dep, or create the missing epic. |
| `epic-dep-cycle` | The cross-epic depends_on graph has a cycle (Epic A → B → A, directly or transitively). The message lists the cycle. | Break the cycle. If the cycle reflects a real bidirectional dependency, the epics should probably be merged or the seam reconsidered. |
| `story-dep-unresolved` | A story's `depends_on` entry doesn't resolve — either as a within-epic basename or as a cross-epic `<folder>/<basename>` ref. | Fix the typo, or use `move_story.py` / `rename_story.py` going forward (they update refs atomically). For after-the-fact fixes, edit `depends_on:` directly and re-validate. |

## Structural errors

| Code | Meaning | Fix |
| --- | --- | --- |
| `no-epics-dir` | `{initiative_store}/epics/` doesn't exist. | Either you have the wrong `--initiative-store`, or no tree has been generated yet. Run the skill in create mode. |
| `missing-epic-md` | A folder matches `NN-*` but has no `epic.md` inside. | Either the folder is bogus (delete it) or the `epic.md` was lost (regenerate with `init_epic.py` and re-fill). |
| `story-numbering-gaps` | Story NNs in an epic are not sequential `01..N`. The message lists what was found vs expected. | Use `rename_story.py --to-nn` to fill the gap or renumber the survivors. |

## Coverage findings

| Code | Meaning | Fix |
| --- | --- | --- |
| `coverage-missing` | An inventory code from `--inventory <file>` does not appear textually in any story body. **Warning** by default; **error** under `--coverage-strict`. | Use the `coverage-fix` edit-mode entry point in `prompts/edit-mode.md` — extend an existing story's `## Coverage` section, or add a new story for the missing code. |

## Sizing warnings

| Code | Meaning | Fix |
| --- | --- | --- |
| `story-oversized` (warning) | A story's body is more than 3× the epic mean (computed when the epic has ≥ 3 stories). | Often a real signal that the story should be split. Sometimes the threshold is too tight for legitimately-large foundational stories — judgment call. The warning never fails CI. Pass `--lax` to suppress mid-flow. |

## Validator runtime errors

These exit `2` and aren't structured findings.

| Symptom | Cause | Fix |
| --- | --- | --- |
| `template missing: ...` | `resources/epic-md-template.md` or `resources/story-md-template.md` not found. | Reinstall the skill; resources are required. |
| `inventory file not found: ...` | `--inventory <path>` was passed but the file doesn't exist. | Either the path is wrong, or the inventory cache was deleted. The cache lives at `{initiative_store}/.bmad-cache/inventory.json` and is auto-deleted at finalize — that's expected. |
| `could not parse <path>: ...` | The inventory file isn't valid JSON. | Fix the JSON. |

## from-spec errors

`scripts/from_spec.py` validates the spec before doing any work; on failure it returns:

```json
{"error": "invalid spec", "details": ["epic[0] missing `title`", "..."]}
```

Common shapes:

| Detail | Cause | Fix |
| --- | --- | --- |
| `spec must contain a non-empty epics list` | Top-level `epics` is missing or empty. | Add at least one epic. |
| `epic[N] missing nn` / `missing title` | A required epic field is absent. | Add it. |
| `epic[N].stories[M] missing nn / title / type` | A required story field is absent. | Add it. |
| `epic[N].stories[M].type invalid: '...'` | `type` is not `feature` / `task` / `bug` / `spike`. | Pick a valid type. |

If the spec is valid but `init_epic.py` or `init_story.py` fails (e.g. a folder collision), the envelope returns:

```json
{"error": "init_epic.py failed", "details": "epic folder already exists: ...", "epic": "..."}
```

Usually means the target initiative store isn't empty. Either clean it (`rm -rf <store>/epics`) or generate into a fresh path.

## parse_v6_epics.py warnings

The parser emits warnings in its `warnings[]` array rather than failing. The LLM driving the migrate flow surfaces these to the user for confirmation.

| Warning shape | Meaning |
| --- | --- |
| `no '## Requirements Inventory' section found` | The v6 file doesn't have the canonical inventory heading. The migrate flow proceeds without populating the requirements block. |
| `no '## Epic N:' headings found; file may not be canonical v6` | The parser couldn't find epic headings. Likely a hand-edited v6 file. Pick option 3 from the migrate menu (walk through manually). |
| `epic N (Title): no stories parsed` | An epic heading was found but no `### Story N.M:` blocks under it. Either the v6 file has stories elsewhere, or the epic is genuinely empty. |
| `epic N story M: no acceptance criteria parsed` | The `**Acceptance Criteria:**` block is missing or formatted differently. The v7 story will have empty ACs; fix in the LLM-driven migrate confirmation step. |
| `input <path> is a directory; sharded v6 input — flatten first` | Sharded v6 detected. The migrate flow offers to flatten before re-parsing. |

## Common operator scenarios

### "The skill won't let me edit because it thinks it's create mode"

Mode detection is filesystem-driven. Either `{initiative_store}/epics/` has no folders matching `NN-*`, or your `{initiative_store}` is pointing at the wrong path. Check `_bmad/config.yaml` and the resolution chain documented in `SKILL.md` Step 4 ("Load Config").

### "Validation passes but I know there's a coverage gap"

You forgot to pass `--inventory`. Without it, the validator only emits `mentioned_requirements` (the textual extraction) and won't compare to anything. The coverage gate requires the inventory file to compare against.

### "I want to delete an epic and the skill won't let me"

By design — see `prompts/edit-mode.md` under "Boundaries". Run `rm -rf {initiative_store}/epics/<folder>`, then `re-validate` to surface every dep ref that pointed at the deleted epic.

### "rename_epic.py refuses to renumber"

Probably the new NN collides with another existing epic. The message says which one. Renumber that epic out of the way first.

### "I keep getting story-numbering-gaps after a manual delete"

`rm`'ing a story file leaves a gap (e.g. 01, 02, 04). Fix with `rename_story.py --epic <e> --from <basename> --to-nn N` to renumber the survivors into a contiguous sequence.

### "Validator output is huge — I just want to see one thing"

For a quick view of the tree shape: `--summary-only` (JSON) or `--tree` (plain text). Both skip the findings list.

For a single epic's findings: `--epic <folder>`. Cross-epic refs still resolve against the whole tree, so a story whose dep references another epic gets reported correctly.

### "validate_initiative.py exits 0 but the JSON has errors"

The exit code only counts `error`-level findings. Schema and dep checks are always errors; coverage findings default to warnings unless `--coverage-strict`. If you want exit 1 on warnings too, post-process the JSON:

```bash
out=$(python3 scripts/validate_initiative.py --initiative-store $S)
warns=$(echo "$out" | jq '.summary.warnings')
[ "$warns" -gt 0 ] && exit 1 || exit 0
```
