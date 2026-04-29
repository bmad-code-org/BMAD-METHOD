**Language:** Use `{communication_language}` for all output.
**Output Language:** Use `{document_output_language}` for documents.
**Paths:** Bare paths (e.g. `scripts/init_epic.py`) resolve from the skill root.

# Stage 4: Per-Epic Authoring

**Goal:** Write `epic.md` and the story files for every approved epic, in order, conversationally. This is the **only stage that writes files**. Every write goes through `scripts/init_epic.py` or `scripts/init_story.py` so paths and front matter are derived consistently.

Load `resources/sizing-heuristics.md` as a fact (if not already loaded in Stage 3). Optionally load `resources/examples/epic-feature-example.md` and `resources/examples/epic-techdebt-example.md` as shape primers if you want concrete reference for the body density and Coverage section format.

## Per-epic loop

For each approved epic, in order:

### 1. Bootstrap the epic folder

Run:

```
python3 scripts/init_epic.py \
  --initiative-store {initiative_store} \
  --epic-nn <NN> \
  --title "<title>" \
  --depends-on <comma-separated NNs from Stage 3>
```

The script creates `{initiative_store}/epics/NN-kebab/epic.md` with locked front matter and a body skeleton. Take its JSON output (`epic`, `epic_nn`, `path`) — the `epic` field is the canonical folder name you pass to every subsequent `init_story.py` call.

**Never compose the folder name yourself in prose.** Always read it back from the script's JSON output.

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

For each story in the approved list:

```
python3 scripts/init_story.py \
  --initiative-store {initiative_store} \
  --epic <epic-folder-from-step-1> \
  --story-nn <NN> \
  --title "<title>" \
  --type <feature|bug|task|spike> \
  --depends-on <comma-separated refs>
```

`--depends-on` entries are bare basenames for within-epic refs (e.g. `01-define-schema`) or `<epic-folder>/<basename>` for cross-epic refs (e.g. `02-auth-migration/04-session-management`).

### 5. Fill the story body conversationally

Read the file the script just wrote. The skeleton matches `resources/story-md-template.md`:

- **User-story stanza** — present for `feature` (required), `bug`/`spike` (optional), absent for `task`. Fill or remove as appropriate.
- **Acceptance Criteria** — Given/When/Then form. Each AC stands alone, specific and testable. Cover happy path, key edge cases, at least one failure mode where applicable. Aim for ≤6 ACs; if you need more, the story may be over-sized — pause and consider splitting.
- **Technical Notes** — implementation hints, file paths, API contracts. Not a full design.
- **Coverage** — one line per AC mapping to the FR / NFR / UX-DR / debt-item codes from the Stage 2 inventory. This is what Stage 5 reads to verify nothing was dropped.

### 6. Per-epic non-strict validation

After all stories for the current epic are drafted, run:

```
python3 scripts/validate_initiative.py --initiative-store {initiative_store} --lax --epic <epic-folder>
```

`--lax` skips sizing warnings (still mid-flow). Schema and dep checks always run. If errors come back, fix them before moving to the next epic. Common issues at this stage: a within-epic dep typo, a forgotten `epic:` field mismatch (the script catches both).

### 7. User checkpoint

Before starting the next epic, confirm with the user that this epic is complete. The next epic does not begin until the current is approved.

## After all epics are authored

Route to `prompts/validate.md` for full-tree strict validation.

## Edit-mode entry points

When this stage is entered from `prompts/edit-mode.md`:

- **add-epic:** run steps 1–6 for the single new epic, then route to `prompts/validate.md` strict.
- **split-epic / merge-epics:** for each affected epic, run step 1 (if a new folder is needed), step 2 (re-author the `epic.md`), and use `scripts/move_story.py` for any story file that changes its epic. The skill never copy-pastes a story across folders — always move.
- **refine-story:** narrow to step 5 for the single story file. If the story title changed, use `scripts/rename_story.py` first to rename and update sibling refs. Skip steps 1–4.
- **re-derive-deps:** within-epic dep updates only here; the cross-epic dep updates were already settled in Stage 3. Walk story files in each affected epic and edit the `depends_on` line directly.

After any edit-mode flow finishes, route to `prompts/validate.md` strict.

## Stage Complete

Stage 4 ends when every approved epic has its `epic.md` and all its story files written, the per-epic non-strict validation passes for each, and the user has confirmed completion of the last epic.
