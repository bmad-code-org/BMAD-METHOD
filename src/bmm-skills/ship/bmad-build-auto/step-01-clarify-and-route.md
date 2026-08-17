---
spec_file: '' # set at runtime once a route resolves it; some HALT branches exit before it is set
spec_folder: '' # set at runtime under folder+id dispatch only
story_id: '' # set at runtime under folder+id dispatch only
ticket_file: '' # set at runtime to the absolute path of the ticket leaf when the work definition is a ticket rather than a stories.yaml entry
---

# Step 1: Clarify and Route

## RULES

- **Language** — Speak in `{{.communication_language}}`, tailored to `{{.user_skill_level}}`. Write files in `{{.document_output_language}}`.
- Treat the invocation intent as workflow input, not as a substitute for step-02 investigation and spec generation.
- **EARLY EXIT** means: stop this step immediately, then read and follow the target file. Return here only if a later step explicitly says to loop back.

## Intent check (do this first)

Use the invocation prompt as the intent.

If the invocation prompt explicitly points to a ticket file (see **Ticket work definition** below), set `ticket_file`, read it as the work definition, and continue to INSTRUCTIONS. Never route on a ticket's `status`; it is a different vocabulary from a spec's.

If the invocation prompt explicitly points to an existing spec file with recognized `status` frontmatter, set `spec_file`, then **EARLY EXIT** to the appropriate step:
- `draft` → `[[bmad-snapshot:step-02-plan.md]]`
- `ready-for-dev` or `in-progress` → `[[bmad-snapshot:step-03-implement.md]]`
- `in-review` → `[[bmad-snapshot:step-04-review.md]]`
- `blocked` → HALT with status `blocked` and blocking condition `blocked spec supplied`.
- `done` → set `review_loop_iteration` to `0` in the frontmatter, then **EARLY EXIT** to `[[bmad-snapshot:step-04-review.md]]` for a fresh review pass. (A `done` spec is a completed run, so this starts a follow-up review, not a resumption.)

If the invocation prompt instead supplies a spec folder and a story id, with no specific spec file path, this is a **folder+id dispatch**: set `spec_folder` (a `{project-root}`-relative or absolute path) and `story_id` from the prompt. Any further prompt text (e.g. `invoke_dev_with` guidance the caller appended) is additional planning context to carry into step-02 — not a competing description of what to implement.

Read `{spec_folder}/stories.yaml` and find the entry whose `id` equals `{story_id}`. Take only that entry's `title` and `description` — never read the checkpoint fields or `invoke_dev_with`; those are the caller's orchestration fields, not build-auto's. Then continue with the on-disk story-file lookup below.

If the file does not exist, fails to parse, or holds no matching entry, look for a ticket leaf instead: files matching `{spec_folder}/**/{story_id}-*.md` whose frontmatter is a ticket (see **Ticket work definition** below). Exactly one match → set `ticket_file` to that path, read it as the work definition, and continue with the on-disk story-file lookup below like any other dispatch — a re-dispatch of the same `{spec_folder}` + `{story_id}` must resume or halt on the spec a previous run already wrote, never re-plan over it. More than one match → HALT with status `blocked` and blocking condition `ambiguous ticket file match`. No match → HALT with status `blocked`, and pick the blocking condition by what was actually on disk: `story id not found in stories.yaml` when `{spec_folder}/stories.yaml` resolved and parsed but held no entry for `{story_id}`, otherwise `no ticket or stories.yaml found` — both are legal work definitions, so never report only the missing `stories.yaml`.

Look for files matching `{spec_folder}/stories/{story_id}-*.md` (id-prefix match — story ids are prefix-free, so at most one should match):
- **If more than one matches**, HALT with status `blocked` and blocking condition `ambiguous story file match`.
- **If exactly one matches**, set `spec_file` to that path.
  - `draft` (planning was interrupted mid-flight): accumulate cross-story context before resuming — load every other file matching `{spec_folder}/stories/*.md` (every match except `{spec_file}` itself), regardless of `status`, and carry forward each one's **Code Map**, **Design Notes**, **Spec Change Log**, **Tasks & Acceptance** checklist state, and **Auto Run Result** details, where present, as additional planning context for step-02. Then **EARLY EXIT** to `[[bmad-snapshot:step-02-plan.md]]`.
  - Any other recognized `status`: **EARLY EXIT** using the same routing as above, including the `review_loop_iteration` reset for `done`. One difference: a `blocked` story HALTs with blocking condition `story already blocked`, not `blocked spec supplied` — the caller did not supply this file; build-auto found it by id.
  - `status` missing or unrecognized: HALT with status `blocked` and blocking condition `unrecognized status in existing story file`.
- **If none matches**, this is the first dispatch for `{story_id}`. On the ticket path the ticket is already the resolved intent and its `## References` say where context lives, so skip the rest of this bullet — no `SPEC.md` requirement, no cross-story accumulation — and continue to INSTRUCTIONS item 3 (items 1 and 2 do not apply). Otherwise the entry's `title` and `description` are the resolved intent. If `{spec_folder}/SPEC.md` does not exist, HALT with status `blocked` and blocking condition `no epic spec found`. Otherwise load it and the files listed in its `companions:` frontmatter as planning context, then accumulate cross-story context the same way as the `draft` case above — load every file matching `{spec_folder}/stories/*.md` (none yet exists for `{story_id}` at this point, so nothing is excluded), regardless of `status`, carrying forward the same fields, where present, as additional planning context for step-02. Then continue to INSTRUCTIONS item 3 below — not `step-03-implement.md`, item 3 of the numbered list in this file (items 1 and 2 do not apply — context and intent are already resolved; item 1.A.5's previous-story continuity scan in particular never runs here, since folder+id dispatch already skips items 1 and 2 entirely — the cross-story accumulation above is its replacement for this dispatch mode).

One `stories.yaml` entry per invocation: never read another entry, and never advance to a different story id regardless of outcome.

Otherwise, treat the invocation prompt as starting intent. This may be a story ID, ticket ID, file path, short description, or longer free-form intent. Do not infer workflow state from non-spec files.
If the invocation prompt does not contain enough intent to identify what to implement, HALT with status `blocked` and blocking condition `unclear intent`.

### Ticket work definition

A **ticket file** is a `KEY-n-slug.md` leaf written by the `bmad-ticket` skill: `schema: 1` frontmatter carrying `id`, `type` (`story`, `bug`, `task`, or `spike`), `title`, `status`, `risk`, `hitl`, and body sections `## Context`, `## Behavior` (or `## Requirements`), `## Acceptance Criteria`, `## Boundaries`, `## References`, `## Dev Notes`. Recognize it by that frontmatter, never by path. Its `status` is the ticket lifecycle (`backlog`, `in-progress`, `review`, `done`, `dropped`), a different vocabulary from a spec's — never route on it, and never treat a ticket as a resumable spec.

When `ticket_file` is set it is the whole work definition, filling the role a `stories.yaml` entry plays with more in it. Everything else in this workflow runs unchanged; carry the ticket forward like this:

| Ticket | Build input |
|---|---|
| `title`, `## Context`, `## Behavior` (or `## Requirements`) | the resolved intent — what step-02 plans from. Already clarified by the ticket author |
| `## Acceptance Criteria` | the verify contract. Every `#n` becomes an acceptance criterion in `{spec_file}`, and its verify tail becomes a `## Verification` entry. These are the ticket author's, not yours — never drop, merge, or soften one; a criterion that cannot be satisfied is a HALT with status `blocked`, not a rewrite |
| `## Boundaries` — `Must not change:` | `Never:` in the spec's Boundaries & Constraints, as hard constraints: an implementation that violates one has failed even with every criterion green |
| `## Boundaries` — `May change:` | `Always:` — the authorized surface |
| `## References` | typed-document pointers (document type plus section, not paths). Resolve them against `{{.planning_artifacts}}` and load what the work actually needs — this replaces the freeform artifact scan in INSTRUCTIONS item 1B |
| `## Dev Notes`, `covers:` | design constraints and requirement ids carried into step-02 investigation and into the spec's Intent for traceability |
| `risk` ≥ 4 or `hitl: true` | high-consequence work running unattended: carry `hitl` forward so step-02 adds it to `{spec_file}` frontmatter `warnings`, and name independent evidence in `## Verification` — a check outside the ticket's own criteria |
| `depends_on` | any listed id that is not `done` is carried forward as a `warnings` entry; do not block on it |
| `id` + `title` | the slug for `spec_file`: `{id}` lowercased, then a kebab-case slug from the title |

The ticket is read-only here. Never edit its frontmatter or body — status moves through the gate (`uv run <bmad-ticket skill scripts>/update_ticket.py`) when that skill is installed, and full status convergence is its own work.

## INSTRUCTIONS

1. Load context.
   - List files in `{{.planning_artifacts}}` and `{{.implementation_artifacts}}`.
   - If the invocation prompt points to an unformatted spec or intent file, ingest that file. Do not scan for unrelated intent files.
   - **Ticket path.** If `ticket_file` is set, the ticket is the intent and its `## References` say where the authoritative context lives — load those, plus the node `ticket.md` of the parent folder of the `tickets/` directory containing the ticket, when one exists (a bin leaf has no such node), and skip the context strategy below. Then continue at item 3.
   - **Determine context strategy.** Using the intent and the artifact listing, infer whether the current work is a story from an epic. Do not rely on filename patterns or regex — reason about the intent, the listing, and any epics file content together.

     **A) Epic story path** — if the intent is clearly an epic story:

     1. Identify the epic number `{epic_num}` and (if present) the story number `{story_num}`. If you can't identify an epic number, use path B.

     2. **Check for a valid cached epic context.** Look for `{{.implementation_artifacts}}/epic-<N>-context.md` (where `<N>` is the epic number). A file is **valid** when it exists, is non-empty, starts with `# Epic <N> Context:` (with the correct epic number), and no file in `{{.planning_artifacts}}` is newer.
        - **If valid:** load it as the primary planning context. Do not load raw planning docs (PRD, architecture, UX, etc.).
        - **If missing, empty, or invalid:** compile it in the next bullet.

     3. **Compile epic context if needed.** If no valid cached epic context was loaded, produce `{{.implementation_artifacts}}/epic-<N>-context.md` by spawning a subagent synchronously with `[[bmad-snapshot:compile-epic-context.md]]` as its prompt. Pass it the epic number, epics file path, `{{.planning_artifacts}}`, and output path `{{.implementation_artifacts}}/epic-<N>-context.md`.

     4. **Verify if compiled.** If epic context was compiled, verify the output file exists, is non-empty, and starts with `# Epic <N> Context:`. If valid, load it. If verification fails, HALT with status `blocked` and blocking condition `context compilation verification failed`.

     5. **Previous story continuity.** Regardless of which context source succeeded above, scan `{{.implementation_artifacts}}` for specs from the same epic with `status: done` and a lower story number. Load the most recent one (highest story number below current). Extract its **Code Map**, **Design Notes**, **Spec Change Log**, and **task list** as continuity context for step-02 planning. If no `done` spec is found but an `in-review` spec exists for the same epic with a lower story number, HALT with status `blocked` and blocking condition `missing previous-story continuity decision`.

     **B) Freeform path** — if the intent is not an epic story:
     - Planning artifacts are the output of BMAD phases 1-3. Typical files include:
       - **PRD** (`*prd*`) — product requirements and success criteria
       - **Architecture** (`*architecture*`) — technical design decisions and constraints
       - **UX/Design** (`*ux*`) — user experience and interaction design
       - **Epics** (`*epic*`) — feature breakdown into implementable stories
       - **Product Brief** (`*brief*`) — project vision and scope
     - Scan the listing for files matching these patterns. If any look relevant to the current intent, load them selectively — you don't need all of them, but you need the right constraints and requirements rather than guessing from code alone.
2. Resolve intent from the invocation prompt and loaded artifacts. Do not fantasize or leave open questions. If the intent cannot be resolved, HALT with status `blocked` and the unresolved questions as blocking condition.
3. Version control sanity check. If version control is unavailable, skip this check. Otherwise require a clean working tree, a branch that fits the intent, and writable repository metadata. For Git, run `git add --refresh -- .`, then confirm the tree is still clean; on failure or change, HALT with status `blocked` and blocking condition `version-control metadata not writable`. Under folder+id dispatch, judge the branch against the epic, not the story. HALT on a dirty tree or obvious branch mismatch.
4. Multi-goal warning. If the intent appears to contain multiple independently shippable goals, carry `multiple-goals` forward so step-02 can add it to `{spec_file}` frontmatter `warnings`. Do not split or block. On the ticket path, carry the ticket's `hitl` and unmet-dependency warnings forward the same way.
5. Route:

   **Ticket path:** under folder+id dispatch, derive a kebab-case slug from the ticket's `title` with no id prefix — the id is already the filename's separate leading segment — and set `spec_file` = `{spec_folder}/stories/{story_id}-{slug}.md`, so the write-back lands where the caller expects it. Otherwise derive the slug from the ticket's `id` and `title` as the mapping above says and set `spec_file` = `{{.implementation_artifacts}}/spec-{slug}.md`. Never write the spec next to the ticket — the ticket tree holds tickets only.

   **Folder+id dispatch:** derive a valid kebab-case slug from the entry's `title` (and `description` if needed) — the same kebab-casing convention as below, but never prefixed with `{story_id}`, since the id is already the filename's separate leading segment. Set `spec_file` = `{spec_folder}/stories/{story_id}-{slug}.md`. The id already disambiguates: no `{{.implementation_artifacts}}` fallback, no `-2`/`-3` suffixing.

   **Otherwise:** derive a valid kebab-case slug from the clarified intent. If the intent references a tracking identifier (story number, issue number, ticket ID), lead the slug with it (e.g. `3-2-digest-delivery`, `gh-47-fix-auth`). If `{{.implementation_artifacts}}/spec-{slug}.md` already exists: if its status is `draft`, treat it as the same work and resume it (set `spec_file` to that path, **EARLY EXIT** → `[[bmad-snapshot:step-02-plan.md]]`); otherwise append `-2`, `-3`, etc. Set `spec_file` = `{{.implementation_artifacts}}/spec-{slug}.md`.

## NEXT

Read fully and follow `[[bmad-snapshot:step-02-plan.md]]`
