---
plan_file: '' # set at runtime once a route resolves it; some HALT branches exit before it is set
spec_folder: '' # set at runtime under folder+id dispatch only
story_id: '' # set at runtime under folder+id dispatch only
followup_pass: '' # set at runtime when a `built` or `done` plan is re-dispatched for a follow-up review pass; empty on a first pass
---

# Step 1: Clarify and Route

## RULES

- Treat the invocation intent as workflow input, not as a substitute for step-02 investigation and plan generation.
- **EARLY EXIT** means: stop this step immediately, then read and follow the target file. Return here only if a later step explicitly says to loop back.

## Intent check (do this first)

Use the invocation prompt as the intent.

If the invocation prompt names a ticket from the tree — a ref such as `1.2`, a ticket file (frontmatter `type` `story`, `spike`, or `bug`, whatever its `status`) by path or name, or text it offers as a ticket's title — run `uv run {project-root}/_bmad/method/scripts/tickets.py --project-root {project-root} find <ref>`. For a ticket file, pass its folder before its file name. Non-zero exit → HALT with status `blocked` and blocking condition `ticket not resolved`, with find's error. Otherwise follow **Ticket resolution** (below).

If the invocation prompt names no work — it is empty, or holds only route, review, or halt-after-planning directives — run `uv run {project-root}/_bmad/method/scripts/tickets.py --project-root {project-root} next`. Non-zero exit → HALT with status `blocked` and blocking condition `ticket tree unavailable`, with its error. No `ready_to_start` row → HALT with status `blocked` and blocking condition `no ready ticket`. Otherwise run `find <ref>` with the first `ready_to_start` row's `ref` and follow **Ticket resolution**.

If the invocation prompt explicitly points to an existing plan file with recognized `status` frontmatter, set `plan_file`, then **EARLY EXIT** to the appropriate step:
- `draft` → `{{ rendered("step-02-plan.md") }}`
- `ready-for-dev` or `in-progress` → `{{ rendered("step-03-implement.md") }}`
- `in-review` → `{{ rendered("step-04-review.md") }}`
- `blocked` → HALT with status `blocked` and blocking condition `blocked plan supplied`.
- `built` or `done` → set `review_loop_iteration` to `0` in the frontmatter and set `followup_pass` to `true`, then **EARLY EXIT** to `{{ rendered("step-04-review.md") }}` for a fresh review pass. (A `built` or `done` plan is a completed run, so this starts a follow-up review, not a resumption.)

If the invocation prompt instead supplies a spec folder and a story id, with no specific plan file path, this is a **folder+id dispatch**: set `spec_folder` (a `{project-root}`-relative or absolute path) and `story_id` from the prompt. Any further prompt text (e.g. `invoke_dev_with` guidance the caller appended) is additional planning context to carry into step-02 — not a competing description of what to implement.

Read `{spec_folder}/stories.yaml`. If the file does not exist or fails to parse, HALT with status `blocked` and blocking condition `no stories.yaml found`. Find the entry whose `id` equals `{story_id}`; if none matches, HALT with status `blocked` and blocking condition `story id not found in stories.yaml`. Take only that entry's `title` and `description` — never read the checkpoint fields or `invoke_dev_with`; those are the caller's orchestration fields, not build-auto's.

Look for files matching `{spec_folder}/stories/{story_id}-*.md` (id-prefix match — story ids are prefix-free, so at most one should match):
- **If more than one matches**, HALT with status `blocked` and blocking condition `ambiguous story file match`.
- **If exactly one matches**, set `plan_file` to that path.
  - `draft` (planning was interrupted mid-flight): accumulate cross-story context before resuming — load every other file matching `{spec_folder}/stories/*.md` (every match except `{plan_file}` itself), regardless of `status`, and carry forward each one's **Code Map**, **Design Notes**, **Implementation Notes**, **Plan Change Log**, **Tasks & Acceptance**, and **Auto Run Result** details, where present, as additional planning context for step-02. Then **EARLY EXIT** to `{{ rendered("step-02-plan.md") }}`.
  - Any other recognized `status`: **EARLY EXIT** using the same routing as above, including the `review_loop_iteration` reset and `followup_pass` for `built` or `done`. One difference: a `blocked` story HALTs with blocking condition `story already blocked`, not `blocked plan supplied` — the caller did not supply this file; build-auto found it by id.
  - `status` missing or unrecognized: HALT with status `blocked` and blocking condition `unrecognized status in existing story file`.
- **If none matches**, this is the first dispatch for `{story_id}`. The entry's `title` and `description` are the resolved intent. If `{spec_folder}/SPEC.md` does not exist, HALT with status `blocked` and blocking condition `no epic spec found`. Otherwise load it and the files listed in its `companions:` frontmatter as planning context, then accumulate cross-story context the same way as the `draft` case above — load every file matching `{spec_folder}/stories/*.md` (none yet exists for `{story_id}` at this point, so nothing is excluded), regardless of `status`, carrying forward the same fields, where present, as additional planning context for step-02. Then continue to INSTRUCTIONS item 3 below — not `step-03-implement.md`, item 3 of the numbered list in this file (items 1 and 2 do not apply — context and intent are already resolved; item 1.A.5's previous-story continuity scan in particular never runs here, since folder+id dispatch already skips items 1 and 2 entirely — the cross-story accumulation above is its replacement for this dispatch mode).

One `stories.yaml` entry or ticket per invocation: never read another entry, and never advance to a different story id or ticket regardless of outcome.

Otherwise, treat the invocation prompt as starting intent. This may be a story ID, ticket ID, file path, short description, or longer free-form intent. Do not infer workflow state from non-plan files.
If the invocation prompt does not contain enough intent to identify what to implement, HALT with status `blocked` and blocking condition `unclear intent`.

### Ticket resolution

This runs on the output of `tickets.py find` for one ticket. Find's `description`, `verify`, `references`, `notes`, and `unknown` are the intent, together with `epic_file` and what that file's References name when it is not null, and `story_file` when it is not null. Never write to a ticket file, and never run `pull` or `mark`.

- When the file at find's `plan` exists on disk, treat it as a plan file the invocation prompt pointed to and route it by its `status` (above).
- Otherwise set `plan_file` to find's `plan`; the plan's frontmatter carries `ticket` set to find's `id`, or to the stem of find's `story_file` when `id` is null, never its `ref`. Continue to INSTRUCTIONS, skipping item 5.

## INSTRUCTIONS

1. Load context.
   - **A ticket from the tree** — when **Ticket resolution** set `plan_file`: the entry, its epic file and what that file's References name, and the story file when there is one are already the intent. For continuity, read the plans beside `plan_file` whose `ticket` is one of find's `after` ids that is a plain number (an entry of the same epic; a ref such as `1.5` is another epic's). Carry forward each one's **Code Map**, **Design Notes**, **Implementation Notes**, **Plan Change Log**, and **Tasks & Acceptance**, where present, as continuity context for step-02. Skip the rest of item 1.
   - List files in `{{ config.planning_artifacts }}` and `{{ config.implementation_artifacts }}`.
   - If the invocation prompt points to an unformatted plan or intent file, ingest that file. Do not scan for unrelated intent files.
   - **Determine context strategy.** Using the intent and the artifact listing, infer whether the current work is a story from an epic. Do not rely on filename patterns or regex — reason about the intent, the listing, and any epics file content together.

     **A) Epic story path** — if the intent is clearly an epic story:

     1. Identify the epic number `{epic_num}` and (if present) the story number `{story_num}`. If you can't identify an epic number, use path B.

     2. **Check for a valid cached epic context.** Look for `{{ config.implementation_artifacts }}/epic-<N>-context.md` (where `<N>` is the epic number). A file is **valid** when it exists, is non-empty, starts with `# Epic <N> Context:` (with the correct epic number), and no file in `{{ config.planning_artifacts }}` is newer.
        - **If valid:** load it as the primary planning context. Do not load raw planning docs (PRD, architecture, UX, etc.).
        - **If missing, empty, or invalid:** compile it in the next bullet.

     3. **Compile epic context if needed.** If no valid cached epic context was loaded, produce `{{ config.implementation_artifacts }}/epic-<N>-context.md` by spawning a subagent synchronously with `{{ rendered("compile-epic-context.md") }}` as its prompt. Pass it the epic number, epics file path, `{{ config.planning_artifacts }}`, and output path `{{ config.implementation_artifacts }}/epic-<N>-context.md`.

     4. **Verify if compiled.** If epic context was compiled, verify the output file exists, is non-empty, and starts with `# Epic <N> Context:`. If valid, load it. If verification fails, HALT with status `blocked` and blocking condition `context compilation verification failed`.

     5. **Previous story continuity.** Regardless of which context source succeeded above, scan `{{ config.implementation_artifacts }}` for plans from the same epic with `status: built` or `done` and a lower story number. Load the most recent one (highest story number below current). Extract its **Code Map**, **Design Notes**, **Implementation Notes**, **Plan Change Log**, and **Tasks & Acceptance**, where present, as continuity context for step-02 planning.

     **B) Freeform path** — if the intent is not an epic story:
     - Planning artifacts are the output of BMAD phases 1-3. Typical files include:
       - **PRD** (`*prd*`) — product requirements and success criteria
       - **Architecture** (`*architecture*`) — technical design decisions and constraints
       - **UX/Design** (`*ux*`) — user experience and interaction design
       - **Epics** (`*epic*`) — feature breakdown into implementable stories
       - **Product Brief** (`*brief*`) — project vision and scope
     - Scan the listing for files matching these patterns. If any look relevant to the current intent, load them selectively — you don't need all of them, but you need the right constraints and requirements rather than guessing from code alone.
2. Resolve intent from the invocation prompt and loaded artifacts. Do not fantasize or leave open questions. If the intent cannot be resolved, HALT with status `blocked` and the unresolved questions as blocking condition.
3. Version control sanity check. If version control is unavailable, skip this check. Otherwise require a clean working tree, a branch that fits the intent, and writable repository metadata. For Git, run `git add --refresh -- .`, then confirm the tree is still clean; on failure or change, HALT with status `blocked` and blocking condition `version-control metadata not writable`. Under folder+id dispatch or for a ticket from the tree, judge the branch against the epic, not the story. HALT on a dirty tree or obvious branch mismatch.
4. Multi-goal warning. If the intent appears to contain multiple independently shippable goals, carry `multiple-goals` forward so step-02 can add it to `{plan_file}` frontmatter `warnings`. Do not split or block.
5. Route:

   **Folder+id dispatch:** derive a valid kebab-case slug from the entry's `title` (and `description` if needed) — the same kebab-casing convention as below, but never prefixed with `{story_id}`, since the id is already the filename's separate leading segment. Set `plan_file` = `{spec_folder}/stories/{story_id}-{slug}.md`. The id already disambiguates: no `{{ config.implementation_artifacts }}` fallback, no `-2`/`-3` suffixing.

   **Otherwise:** derive a valid kebab-case slug from the clarified intent. If the intent references a tracking identifier (story number, issue number, ticket ID), lead the slug with it (e.g. `3-2-digest-delivery`, `gh-47-fix-auth`). If `{{ config.implementation_artifacts }}/plan-{slug}.md` already exists: if its status is `draft`, treat it as the same work and resume it (set `plan_file` to that path, **EARLY EXIT** → `{{ rendered("step-02-plan.md") }}`); otherwise append `-2`, `-3`, etc. Set `plan_file` = `{{ config.implementation_artifacts }}/plan-{slug}.md`.

## NEXT

Read fully and follow `{{ rendered("step-02-plan.md") }}`
