---
deferred_work_file: '{implementation_artifacts}/deferred-work.md'
spec_file: '' # set at runtime for both routes before leaving this step
---

# Step 1: Clarify and Route

## RULES

- YOU MUST ALWAYS SPEAK OUTPUT in your Agent communication style with the config `{communication_language}`
- Treat the invocation intent as workflow input, not as a substitute for step-02 investigation and spec generation.
- **EARLY EXIT** means: stop this step immediately, then read and follow the target file. Return here only if a later step explicitly says to loop back.

## Intent check (do this first)

Use the invocation prompt as the intent.

If the invocation prompt explicitly points to an existing spec file with recognized `status` frontmatter, set `spec_file`, then **EARLY EXIT** to the appropriate step:
- `draft` → `./step-02-plan.md`
- `ready-for-dev` or `in-progress` → `./step-03-implement.md`
- `in-review` → `./step-04-review.md`
- `blocked` → HALT with status `blocked` and blocking condition `blocked spec supplied`.
- `done` → set `review_loop_iteration` to `0` in the frontmatter, then **EARLY EXIT** to `./step-04-review.md` for a fresh review pass. (A `done` spec is a completed run, so this starts a follow-up review, not a resumption.)

Otherwise, treat the invocation prompt as starting intent. This may be a story ID, ticket ID, file path, short description, or longer free-form intent. Do not infer workflow state from non-spec files.
If the invocation prompt does not contain enough intent to identify what to implement, HALT with status `blocked` and blocking condition `unclear intent`.

## INSTRUCTIONS

1. Load context.
   - List files in `{planning_artifacts}` and `{implementation_artifacts}`.
   - If the invocation prompt points to an unformatted spec or intent file, ingest that file. Do not scan for unrelated intent files.
   - **Determine context strategy.** Using the intent and the artifact listing, infer whether the current work is a story from an epic. Do not rely on filename patterns or regex — reason about the intent, the listing, and any epics file content together.

     **A) Epic story path** — if the intent is clearly an epic story:

     1. Identify the epic number `{epic_num}` and (if present) the story number `{story_num}`. If you can't identify an epic number, use path B.

     2. **Check for a valid cached epic context.** Look for `{implementation_artifacts}/epic-<N>-context.md` (where `<N>` is the epic number). A file is **valid** when it exists, is non-empty, starts with `# Epic <N> Context:` (with the correct epic number), and no file in `{planning_artifacts}` is newer.
        - **If valid:** load it as the primary planning context. Do not load raw planning docs (PRD, architecture, UX, etc.).
        - **If missing, empty, or invalid:** compile it in the next bullet.

     3. **Compile epic context if needed.** If no valid cached epic context was loaded, produce `{implementation_artifacts}/epic-<N>-context.md` by spawning a subagent with `./compile-epic-context.md` as its prompt. Pass it the epic number, the epics file path, the `{planning_artifacts}` directory, and the output path `{implementation_artifacts}/epic-<N>-context.md`.

     4. **Verify if compiled.** If epic context was compiled, verify the output file exists, is non-empty, and starts with `# Epic <N> Context:`. If valid, load it. If verification fails, HALT with status `blocked` and blocking condition `context compilation verification failed`.

     5. **Previous story continuity.** Regardless of which context source succeeded above, scan `{implementation_artifacts}` for specs from the same epic with `status: done` and a lower story number. Load the most recent one (highest story number below current). Extract its **Code Map**, **Design Notes**, **Spec Change Log**, and **task list** as continuity context for step-02 planning. If no `done` spec is found but an `in-review` spec exists for the same epic with a lower story number, HALT with status `blocked` and blocking condition `missing previous-story continuity decision`.

     **B) Freeform path** — if the intent is not an epic story:
     - Planning artifacts are the output of BMAD phases 1-3. Typical files include:
       - **PRD** (`*prd*`) — product requirements and success criteria
       - **Architecture** (`*architecture*`) — technical design decisions and constraints
       - **UX/Design** (`*ux*`) — user experience and interaction design
       - **Epics** (`*epic*`) — feature breakdown into implementable stories
       - **Product Brief** (`*brief*`) — project vision and scope
     - Scan the listing for files matching these patterns. If any look relevant to the current intent, load them selectively — you don't need all of them, but you need the right constraints and requirements rather than guessing from code alone.
2. Resolve intent from the invocation prompt and loaded artifacts. Do not fantasize or leave open questions. If the intent cannot be resolved, HALT with status `blocked` and the unresolved questions as blocking condition.
3. Version control sanity check. Is the working tree clean? Does the current branch make sense for this intent — considering its name and recent history? If the tree is dirty or the branch is an obvious mismatch, HALT with status `blocked` and that condition as blocking condition. If version control is unavailable, skip this check.
4. Multi-goal warning. If the intent appears to contain multiple independently shippable goals, carry `multiple-goals` forward so step-02 can add it to `{spec_file}` frontmatter `warnings`. Do not split or block.
5. Route:

   Derive a valid kebab-case slug from the clarified intent. If the intent references a tracking identifier (story number, issue number, ticket ID), lead the slug with it (e.g. `3-2-digest-delivery`, `gh-47-fix-auth`). If `{implementation_artifacts}/spec-{slug}.md` already exists: if its status is `draft`, treat it as the same work and resume it (set `spec_file` to that path, **EARLY EXIT** → `./step-02-plan.md`); otherwise append `-2`, `-3`, etc. Set `spec_file` = `{implementation_artifacts}/spec-{slug}.md`.

## NEXT

Read fully and follow `./step-02-plan.md`
