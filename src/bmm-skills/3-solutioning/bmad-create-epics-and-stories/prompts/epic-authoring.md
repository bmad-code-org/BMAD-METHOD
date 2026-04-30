**Language:** Use `{communication_language}` for all output.
**Output Language:** Use `{document_output_language}` for documents.
**Paths:** Bare paths (e.g. `scripts/init_epic.py`) resolve from the skill root.

# Stage 4: Per-Epic Authoring

**Goal:** Write `epic.md` and the story files for every approved epic, in order. This is the **only stage that writes files**. Every write goes through `scripts/init_epic.py` or `scripts/init_story.py` so paths and front matter are derived consistently. The Stage 2 inventory at `{initiative_store}/.bmad-cache/inventory.json` is the source of truth for which FR / NFR / UX-DR / debt-item codes you allocate to which AC.

`resources/sizing-heuristics.md` should already be in your context as a persistent fact (loaded once via the customize.toml `persistent_facts` mechanism). Before authoring the first epic, load `resources/examples/epic-feature-example.md` and `resources/examples/epic-techdebt-example.md` to anchor body density and Coverage section format.

## Inventory recovery

Re-read `{initiative_store}/.bmad-cache/inventory.json` at the start of each per-epic loop iteration. If the file is missing (manual deletion, a fresh session resuming mid-flow, or compaction since Stage 2):

1. Tell the user the inventory cache is missing and you're rebuilding it.
2. Re-launch `agents/artifact-analyzer.md` with the same inputs Stage 2 used (initiative intent, scan paths). Merge any user-volunteered details from the conversation.
3. Write the rebuilt inventory back to the same path.

Never proceed with an empty inventory — the Stage 5 coverage gate depends on it.

## Per-epic loop

For each approved epic, in order:

### 1. Bootstrap the epic folder

```
python3 scripts/init_epic.py --initiative-store {initiative_store} \
  --epic-nn <NN> --title "<title>" --depends-on <comma-NNs>
```

Take its JSON output (`epic`, `epic_nn`, `path`) — `epic` is the canonical folder name you pass to every subsequent `init_story.py` call. **Never compose the folder name yourself in prose.**

### 2. Fill the epic body conversationally

Read the file the script just wrote. The skeleton has four sections — fill them by working with the user:

- **Goal.** One paragraph. The user-value (or measurable engineering improvement) this epic delivers as a whole.
- **Shared Context.** Architectural decisions, constraints, integration points that apply to every story. This is the cache `bmad-dev-story` and downstream skills read instead of re-deriving context per story. Tight; if a fact would change story-to-story, it doesn't go here.
- **Story Sequence.** Brief notes on inter-story flow within this epic — what unlocks what.
- **References.** Links into PRD / architecture / UX sections most load-bearing for this epic. Anchored paths where possible.

Edit the file in place when the user is satisfied with each section's content.

### 3. Decompose into stories

Discuss the story breakdown with the user. Apply the sizing heuristics:

- **One AI session, verifiable end-state, bounded blast radius.** If you can't picture a single dev agent finishing the story without context exhaustion, split it.
- **Vertical slices preferred.** Horizontal slices acceptable when the epic's Shared Context explicitly justifies the seam.
- **Story types.** `feature` for user-visible capability; `task` for setup or refactor with no user-story stanza by default; `bug` for a defect with optional user-story; `spike` for research with optional user-story.

Confirm the story list with the user before any write. The list is: ordered NN, story type, title, within-epic or cross-epic `depends_on`.

### 4. Bootstrap each story file

```
python3 scripts/init_story.py --initiative-store {initiative_store} \
  --epic <folder-from-step-1> --story-nn <NN> --title "<title>" \
  --type <feature|bug|task|spike> --depends-on <comma-refs>
```

Within-epic refs are bare basenames (`01-define-schema`); cross-epic refs use the form `<epic-folder>/<basename>` (`02-auth-migration/04-session-management`).

### 5. Fill the story body conversationally

Read the file the script just wrote. Sections, in order:

- **User-story stanza** — required for `feature`, optional for `bug`/`spike`, absent for `task`. Fill or remove as appropriate.
- **Acceptance Criteria** — Given/When/Then. Each AC stands alone, specific, testable. Cover happy path, key edge cases, at least one failure mode where applicable. Aim for ≤6 ACs; if you need more, the story may be over-sized — pause and consider splitting.
- **Technical Notes** — implementation hints, file paths, API contracts. Not a full design.
- **Coverage** — one line per AC mapping to the FR / NFR / UX-DR / debt-item codes from `inventory.json`. The format `AC1: FR1, NFR3.2` is what `scripts/extract_coverage.py` and the validator both parse.

### 6. Per-epic non-strict validation

After all stories for the current epic are drafted, run:

```
python3 scripts/validate_initiative.py --initiative-store {initiative_store} --lax --epic <folder>
```

`--lax` skips sizing warnings (still mid-flow). Schema and dep checks always run. Fix any errors before moving on.

### 7. User checkpoint

Before starting the next epic, confirm with the user that this epic is complete. The next epic does not begin until the current is approved.

In `{yolo}=true`, **skip the per-epic checkpoint** entirely — author the full epic list end-to-end, then surface a single batched recap before routing to validation.

## After all epics are authored

Route to `prompts/validate.md` for full-tree strict validation.

## Edit-mode entry points

When this stage is entered from `prompts/edit-mode.md`:

- **add-epic:** run steps 1–6 for the single new epic, then route to `prompts/validate.md` strict.
- **split-epic / merge-epics:** for each affected epic, run step 1 (if a new folder is needed), step 2 (re-author the `epic.md`), and use `scripts/move_story.py` for any story file that changes its epic. Never copy-paste a story across folders — always move.
- **rename-epic:** invoke `scripts/rename_epic.py --epic <folder> [--to-title "<text>"] [--to-nn <int>]`. The script renames the folder, updates the renamed `epic.md`'s `title:` and `epic:` fields, rewrites every story's `epic:` field, and propagates cross-epic depends_on references and other epics' NN-based deps. After it returns, route directly to `prompts/validate.md` strict — no body re-authoring is required.
- **refine-story:** narrow to step 5 for the single story file. If the title changed, run `scripts/rename_story.py --to-title "<new title>"` first. If the NN changed, also pass `--to-nn`.
- **re-derive-deps:** within-epic dep updates only here; cross-epic was settled in Stage 3. Walk story files in each affected epic and edit the `depends_on` line directly.
- **coverage-fix:** Stage 5 routes here when a requirement code is missing from coverage. Identify the right story (existing or new), then either run step 5 against the existing story to extend its Coverage section, or run steps 4–5 to add a new story under the right epic. After the fix, route to `prompts/validate.md` strict.

After any edit-mode flow finishes, route to `prompts/validate.md` strict.

## Stage Complete

Stage 4 ends when every approved epic has its `epic.md` and all its story files written, the per-epic non-strict validation passes for each, and the user has confirmed completion (or `{yolo}=true` auto-confirmed after the batch recap).
