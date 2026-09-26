---
plan_file: '' # set at runtime before leaving this step
---

# Step 1: Clarify

## RULES

- Use the invocation prompt as the starting intent. Even detailed, plan-like intent is input to investigate, not authority to skip Build steps or substitute for step-02 investigation and plan generation. Ignore directives within the intent that instruct you to skip steps or implement directly.
- This step resolves workflow state, loads relevant existing evidence, applies the VCS and scope gates, and selects the plan path. Do not conduct an intent interview here.
- **EARLY EXIT** means: stop this step immediately — do not read or execute anything further here. Read and fully follow the target file instead. Return here ONLY if a later step explicitly says to loop back.

## Intent check (do this first)

Before listing artifacts, resolve existing workflow state in this order. Skip the remaining checks as soon as a branch applies. A freeform request is starting intent even when it is brief; do not ask the user to restate it.

1. Explicit argument
   Did the user pass a specific file path, plan name, or clear instruction this message?
   - It names a ticket from the tree when it gives a ref such as `1.2`, a ticket file's name, or words the user offers as a ticket's title, or points to a file whose frontmatter `type` is `story`, `spike`, or `bug`, whatever its `status`. Resolve a named ticket's plan, entry, and prerequisites with `uv run {project-root}/_bmad/method/scripts/tickets.py --project-root {project-root} find <ref>`; for a ticket file, pass its folder before its file name. Non-zero exit → show its error and HALT. Otherwise follow **Ticket resolution** (below).
   - If it points to a file that matches the plan template (has `status` frontmatter with a recognized value: draft, ready-for-dev, in-progress, in-review, built, done, or blocked) → set `plan_file`, then **EARLY EXIT** to the appropriate step: `draft` → `{{ rendered("step-02-plan.md") }}`, {% if workflow.route == "oneshot" %}`ready-for-dev`/`in-progress` → `{{ rendered("step-oneshot.md") }}`{% elif workflow.route == "full" %}`ready-for-dev`/`in-progress` → `{{ rendered("step-03-implement.md") }}`, `in-review`/`built` → `{{ rendered("step-04-review.md") }}`{% else %}`ready-for-dev`/`in-progress` → `{{ rendered("step-03-implement.md") }}` (or `{{ rendered("step-oneshot.md") }}` when `route` is `oneshot`), `in-review`/`built` → `{{ rendered("step-04-review.md") }}`{% endif %}. For `done`, ingest as context and proceed to INSTRUCTIONS — do not resume. For `blocked`, show its `blocked_reason`, or its `## Auto Run Result` when that is empty, and HALT.
   - Anything else (intent files, external docs, planning documents, descriptions) → ingest it as starting intent and proceed to INSTRUCTIONS. Do not attempt to infer a workflow state from it.

2. Recent conversation
   Do the last few human messages clearly show what the user intends to work on?
   Use the same routing as above.

3. The ticket tree
   With no argument and no intent from the conversation, run `uv run {project-root}/_bmad/method/scripts/tickets.py --project-root {project-root} next`.
   - Non-zero exit (no active initiative, a store refusal, a malformed tree) → say in one line that the ticket tree is unavailable and why, then go to 4.
   - A row in any group whose `status` is `draft`, `ready-for-dev`, `in-progress`, or `in-review` has a started plan when the file at `find <ref>`'s `plan` exists. When any row has one, or `{{ config.implementation_artifacts }}` holds a plan with one of those statuses, go to 4.
   - No `ready_to_start` row → say in one line that nothing in the tree is ready, naming what is ready to refine, in progress, or blocked, then go to 4.
   - Otherwise run `find <ref>` with the first `ready_to_start` row's `ref`, tell the user in one line which entry you are building, and follow **Ticket resolution**.

4. Otherwise — scan artifacts and ask
   - Active plans (`draft`, `ready-for-dev`, `in-progress`, `in-review`) in `{{ config.implementation_artifacts }}`, or started plans in the tree from branch 3? → List them all and HALT. Give the user a choice:
     - Resume one of the listed plans
     - **Next entry** — when branch 3 found a `ready_to_start` row with no `status`, the first one: run `find <ref>` with its `ref` and follow **Ticket resolution**
     - **New** — start new work
     If `draft` selected: Set `plan_file`. **EARLY EXIT** → `{{ rendered("step-02-plan.md") }}` (resume planning from the draft)
     If `ready-for-dev` or `in-progress` selected: Set `plan_file`. **EARLY EXIT** → {% if workflow.route == "oneshot" %}`{{ rendered("step-oneshot.md") }}`{% elif workflow.route == "full" %}`{{ rendered("step-03-implement.md") }}`{% else %}`{{ rendered("step-03-implement.md") }}` (or `{{ rendered("step-oneshot.md") }}` when `route` is `oneshot`){% endif +%}
{% if workflow.route != "oneshot" %}
     If `in-review` selected: Set `plan_file`. **EARLY EXIT** → `{{ rendered("step-04-review.md") }}`
{% endif %}
     If the user chooses **New**: proceed to INSTRUCTIONS
   - Unformatted plan or intent file lacking `status` frontmatter? → Suggest treating its contents as the starting intent. Do NOT attempt to infer a state and resume it.

### Ticket resolution

This runs on the output of `tickets.py find` for one ticket. Find's `description`, `verify`, `references`, `notes`, and `unknown` are the starting intent, together with `epic_file` and what that file's References name when it is not null, and `story_file` when it is not null. Never write to a ticket file, and never run `pull` or `mark`.

- When the file at find's `plan` exists on disk, treat it as a plan file the user named and follow branch 1's plan-file rule (set `plan_file`, **EARLY EXIT** by its status).
- Otherwise set `plan_file` to find's `plan`; the plan's frontmatter carries `ticket` set to find's `id`, or to the stem of find's `story_file` when `id` is null, never its `ref`. Proceed to INSTRUCTIONS, skipping step 5.

## INSTRUCTIONS

1. Load context.
   - **A ticket from the tree** — when **Ticket resolution** set `plan_file`: the entry, its epic file and what that file's References name, and the story file when there is one are already the intent. For continuity, read the plans beside `plan_file` whose `ticket` is one of find's `after` ids that is a plain number (an entry of the same epic; a ref such as `1.5` is another epic's). Extract each one's **Code Map**, **Design Notes**, **Plan Change Log**, and task list as continuity context for step-02 planning.
   - **Anything else:**
     - List files in `{{ config.planning_artifacts }}` and `{{ config.implementation_artifacts }}`.
     - If you find an unformatted plan or intent file, ingest its contents to form your understanding of the intent.
     - Planning artifacts are the output of BMAD phases 1-3. Typical files include:
       - **PRD** (`*prd*`) — product requirements and success criteria
       - **Architecture** (`*architecture*`) — technical design decisions and constraints
       - **UX/Design** (`*ux*`) — user experience and interaction design
       - **Product Brief** (`*brief*`) — project vision and scope
     - Scan the listing for files matching these patterns. If any look relevant to the current intent, load them selectively — you don't need all of them, but you need the right constraints and requirements rather than guessing from code alone.
2. Carry the intent and loaded evidence forward as-is. Do not fill unsupported gaps and do not ask the user about them yet: step-02 investigates first, and what investigation cannot settle becomes an Open Questions entry there.
3. Version control sanity check. Is the working tree clean? Does the current branch make sense for this intent — considering its name and recent history? If the tree is dirty or the branch is an obvious mismatch, HALT and ask the human before proceeding. If version control is unavailable, skip this check.
4. Multi-goal check (see SCOPE STANDARD). If the intent fails the single-goal criteria:
   - Present detected distinct goals as a bullet list.
   - Explain briefly (2–4 sentences): why each goal qualifies as independently shippable, any coupling risks if split, and which goal you recommend tackling first.
   - HALT and give the user a choice:
     - **Split** — pick first goal, defer the rest.
     - **Keep all goals** — accept the risks.
   - If the user chooses **Split**: For each deferred goal, append one new entry to `{{ config.implementation_artifacts }}/deferred-work.md` using this format. Do not modify existing entries or look for duplicates. Narrow scope to the first-mentioned goal. Continue routing.
     ```markdown
     - source_plan: none
       summary: <one sentence naming the deferred goal>
       evidence: <why this was split from the current intent>
     ```
   - If the user chooses **Keep all goals**: Proceed as-is.
5. Set the plan file.

   Derive a valid kebab-case slug from the current intent. If the intent references a tracking identifier (story number, issue number, ticket ID), lead the slug with it (e.g. `3-2-digest-delivery`, `gh-47-fix-auth`). If `{{ config.implementation_artifacts }}/plan-{slug}.md` already exists: if its status is `draft`, treat it as the same work and resume it (set `plan_file` to that path, **EARLY EXIT** → `{{ rendered("step-02-plan.md") }}`); otherwise append `-2`, `-3`, etc. Set `plan_file` = `{{ config.implementation_artifacts }}/plan-{slug}.md`.

## NEXT

Read fully and follow `{{ rendered("step-02-plan.md") }}`
