---
plan_file: '' # set at runtime once a route resolves it; some HALT branches exit before it is set
ticket_args: '' # set at runtime to the arguments `tickets.py find` resolved the ticket with (its folder, when one was passed, then the ref); HALT passes them to `mark`
followup_pass: '' # set at runtime when a `built` or `done` plan is re-dispatched for a follow-up review pass; empty on a first pass
---

# Step 1: Clarify and Route

## RULES

- Treat the invocation intent as workflow input, not as a substitute for step-02 investigation and plan generation.
- **EARLY EXIT** means: stop this step immediately, then read and follow the target file. Return here only if a later step explicitly says to loop back.

## Intent check (do this first)

Use the invocation prompt as the intent.

The invocation prompt names a ticket from the tree when it calls a reference a ticket (such as `ticket 1.2`, a ticket file's name, or a ticket's title), or points to a file whose frontmatter `type` is `story`, `spike`, or `bug`, whatever its `status`. A ref or title it does not present as a ticket is not one. Resolve a named ticket's plan, entry, and prerequisites with `uv run {project-root}/_bmad/method/scripts/tickets.py --project-root {project-root} find <ref>`; for a ticket file, pass its folder before its file name. Non-zero exit → HALT with status `blocked` and blocking condition `ticket not resolved`, with find's error. Otherwise follow **Ticket resolution** (below).

If the invocation prompt explicitly points to an existing plan file with recognized `status` frontmatter, set `plan_file`, then **EARLY EXIT** to the appropriate step:
- `draft` → `{{ rendered("step-02-plan.md") }}`
- `ready-for-dev` or `in-progress` → `{{ rendered("step-03-implement.md") }}`
- `in-review` → `{{ rendered("step-04-review.md") }}`
- `blocked` → HALT with status `blocked` and blocking condition `blocked plan supplied`.
- `built` or `done` → set `review_loop_iteration` to `0` in the frontmatter and set `followup_pass` to `true`, then **EARLY EXIT** to `{{ rendered("step-04-review.md") }}` for a fresh review pass.

Otherwise, treat the invocation prompt as starting intent. This may be a story ID, ticket ID, file path, short description, or longer free-form intent. Do not infer workflow state from non-plan files.
If the invocation prompt does not contain enough intent to identify what to implement, HALT with status `blocked` and blocking condition `unclear intent`.

One ticket per invocation: never read another entry, and never advance to a different ticket regardless of outcome.

### Ticket resolution

This runs on the output of `tickets.py find` for one ticket. Set `ticket_args` to the arguments find resolved it with. Find's `description`, `verify`, `references`, `notes`, and `unknown` are the intent, together with `epic_file` and what that file's References name when it is not null, and `story_file` when it is not null. Never write to a ticket file, and never run `pull`; only HALT runs `mark`.

- When the file at find's `plan` exists on disk, treat it as a plan file the invocation prompt pointed to and route it by its `status` (above).
- Otherwise set `plan_file` to find's `plan`; the plan's frontmatter carries `ticket` set to find's `id`, or to the stem of find's `story_file` when `id` is null, never its `ref`. Continue to INSTRUCTIONS, skipping item 5.

## INSTRUCTIONS

1. Load context.
   - **A ticket from the tree** — when **Ticket resolution** set `plan_file`: the entry, its epic file and what that file's References name, and the story file when there is one are already the intent. For continuity, read the plans beside `plan_file` whose `ticket` is one of find's `after` ids that is a plain number (an entry of the same epic; a ref such as `1.5` is another epic's). Carry forward each one's **Code Map**, **Design Notes**, **Implementation Notes**, **Plan Change Log**, and **Tasks & Acceptance**, where present, as continuity context for step-02.
   - **Anything else:**
     - List files in `{{ config.planning_artifacts }}` and `{{ config.implementation_artifacts }}`.
     - If the invocation prompt points to an unformatted plan or intent file, ingest that file. Do not scan for unrelated intent files.
     - Planning artifacts are the output of BMAD phases 1-3. Typical files include:
       - **PRD** (`*prd*`) — product requirements and success criteria
       - **Architecture** (`*architecture*`) — technical design decisions and constraints
       - **UX/Design** (`*ux*`) — user experience and interaction design
       - **Product Brief** (`*brief*`) — project vision and scope
     - Scan the listing for files matching these patterns. If any look relevant to the current intent, load them selectively — you don't need all of them, but you need the right constraints and requirements rather than guessing from code alone.
2. Resolve intent from the invocation prompt and loaded artifacts. Do not fantasize or leave open questions. If the intent cannot be resolved, HALT with status `blocked` and the unresolved questions as blocking condition.
3. Version control sanity check. If version control is unavailable, skip this check. Otherwise require a clean working tree, a branch that fits the intent, and writable repository metadata. For Git, run `git add --refresh -- .`, then confirm the tree is still clean; on failure or change, HALT with status `blocked` and blocking condition `version-control metadata not writable`. For a ticket from the tree, judge the branch against the epic, not the story. HALT on a dirty tree or obvious branch mismatch.
4. Multi-goal warning. If the intent appears to contain multiple independently shippable goals, carry `multiple-goals` forward so step-02 can add it to `{plan_file}` frontmatter `warnings`. Do not split or block.
5. Set the plan file.

   Derive a valid kebab-case slug from the clarified intent. If the intent references a tracking identifier (story number, issue number, ticket ID), lead the slug with it (e.g. `3-2-digest-delivery`, `gh-47-fix-auth`). If `{{ config.implementation_artifacts }}/plan-{slug}.md` already exists: if its status is `draft`, treat it as the same work and resume it (set `plan_file` to that path, **EARLY EXIT** → `{{ rendered("step-02-plan.md") }}`); otherwise append `-2`, `-3`, etc. Set `plan_file` = `{{ config.implementation_artifacts }}/plan-{slug}.md`.

## NEXT

Read fully and follow `{{ rendered("step-02-plan.md") }}`
