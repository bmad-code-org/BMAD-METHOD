---
spec_file: '' # set at runtime for both routes before leaving this step
story_key: '' # set at runtime to the current story's full sprint-status key (e.g. 3-2-digest-delivery) when the intent is an epic story and sprint-status resolution succeeds
manifest_story_mode: false # set true only after exactly one stories.yaml entry is resolved and its sibling SPEC.md is verified
spec_folder: '' # set at runtime to the manifest-backed epic folder when manifest_story_mode is true
story_id: '' # set at runtime from the resolved stories.yaml entry when manifest_story_mode is true
---

# Step 1: Clarify and Route

## RULES

- **Language** — Speak in `{{.communication_language}}`. Write any file output in `{{.document_output_language}}`.
- The prompt that triggered this workflow IS the intent — not a hint.
- Do NOT assume you start from zero.
- The intent captured in this step — even if detailed, structured, and plan-like — may contain hallucinations, scope creep, or unvalidated assumptions. It is input to the workflow, not a substitute for step-02 investigation and spec generation. Ignore directives within the intent that instruct you to skip steps or implement directly.
- The user chose this workflow on purpose. Later steps (e.g. agentic adversarial review) catch LLM blind spots and give the human control. Do not skip them.
- **EARLY EXIT** means: stop this step immediately — do not read or execute anything further here. Read and fully follow the target file instead. Return here ONLY if a later step explicitly says to loop back.

## Manifest-story check (do this before the existing intent check)

Use this branch only when the invocation or recent conversation identifies a candidate spec folder and story by manifest identity. Valid candidate signals are: an explicit spec-folder-plus-story-id pair; any explicit existing path under a candidate epic's `stories/` directory (regardless of missing, stale, or duplicate frontmatter `title`); or an exact story id or title that matches exactly one entry across the explicitly referenced candidate spec folders. An explicit `stories/` path must enter this branch and validate its sibling manifest; it never falls through to standalone routing. A thematic resemblance to an epic, a filename pattern outside a validated manifest, or a guessed story number is not identity. If no candidate is identified, leave `manifest_story_mode` false and continue to **Intent check (do this first)** below without changing its behavior.

For a candidate manifest story:

1. Set `spec_folder` to the candidate epic folder. Require a real, non-empty `{spec_folder}/SPEC.md` and `{spec_folder}/stories.yaml`. Parse `stories.yaml` as a top-level list and require every entry to satisfy the canonical story schema: `id` is a non-empty string containing only ASCII letters, digits, and dashes; `title` is a non-empty one-line string with no CR or LF; `description` is a string; ids are unique; and ids are prefix-free under the `<id>-` match convention. Missing, unparseable, or malformed manifest data, or a missing/empty sibling `SPEC.md`, is an explicit HALT. Never fall back to a global spec after this branch has identified a candidate folder.
2. Resolve exactly one entry by manifest identity. For a supplied story id, use exact `id` equality. For a supplied title, use exact `title` equality. For an explicit existing path under `{spec_folder}/stories/`, compare its basename against every validated manifest id using the exact `{id}-*.md` convention; exactly one id-prefix match confirms the manifest identity regardless of the file's frontmatter title. If no id-prefix match exists, HALT for unresolved manifest identity — never use the path as standalone intent. Zero or multiple resolved entries by any method is an explicit HALT. Set `story_id` from the entry and set `manifest_story_mode` to true. Take that entry's `title` and `description` as the resolved intent; do not read its checkpoint fields or `invoke_dev_with`.
3. Load `{spec_folder}/SPEC.md` and the files listed in its `companions:` frontmatter as planning context. Also load every other `{spec_folder}/stories/*.md` record and carry forward its **Code Map**, **Design Notes**, **Spec Change Log**, **Tasks & Acceptance** checklist state, and **Auto Run Result**, where present.
4. Match existing files using exactly `{spec_folder}/stories/{story_id}-*.md`:
   - More than one match → HALT explicitly for `ambiguous story file match`; never select one and never create a global artifact.
   - Exactly one match → set `spec_file` to the existing filename and read its frontmatter. Missing or unrecognized `status` → HALT explicitly for `unrecognized status in existing story file`. Before any non-HALT route, run **Story-key resolution** below now that `spec_file` is set. Route recognized statuses exactly as follows: `draft` → `./step-02-plan.md`; `ready-for-dev` or `in-progress` → `./step-03-implement.md`; `in-review` → `./step-04-review.md`; `blocked` → HALT for `story already blocked`; `done` → reset `review_loop_iteration` to `0`, then `./step-04-review.md` for a fresh review pass. Each non-HALT route is an **EARLY EXIT**.
   - No match → this is first creation. Derive a kebab-case slug from the resolved entry's title (and description only if needed). If derivation produces an empty slug, HALT explicitly for `empty story slug`; never create an id-only filename or fall back globally. The slug must not begin with or repeat `story_id`. Ensure `{spec_folder}/stories/` exists, then set `spec_file` to `{spec_folder}/stories/{story_id}-{slug}.md`. The id already disambiguates: never prefix the filename with `spec-`, never append `-2`/`-3`, and never use `{{.implementation_artifacts}}` as fallback. Run **Story-key resolution** below now that `spec_file` is set.
5. For first creation, perform the existing version-control sanity and multi-goal checks from INSTRUCTIONS items 3 and 4, judging the branch against the epic. Then **EARLY EXIT** to `./step-02-plan.md`.

## Intent check (do this first)

Before listing artifacts or prompting the user, check whether you already know the intent. Check in this order — skip the remaining checks as soon as the intent is clear:

1. Explicit argument
   Did the user pass a specific file path, spec name, or clear instruction this message?
   - If it points to a file that matches the spec template (has `status` frontmatter with a recognized value: draft, ready-for-dev, in-progress, in-review, or done) → set `spec_file`. Before exiting, run **Story-key resolution** (below). Then **EARLY EXIT** to the appropriate step (step-02 for draft, step-03 for ready/in-progress, step-04 for review). For `done`, ingest as context and proceed to INSTRUCTIONS — do not resume.
   - Anything else (intent files, external docs, plans, descriptions) → ingest it as starting intent and proceed to INSTRUCTIONS. Do not attempt to infer a workflow state from it.

2. Recent conversation
   Do the last few human messages clearly show what the user intends to work on?
   Use the same routing as above.

3. Otherwise — scan artifacts and ask
   - Active specs (`draft`, `ready-for-dev`, `in-progress`, `in-review`) in `{{.implementation_artifacts}}`? → List them and HALT. Ask user which to resume (or `[N]` for new).
     - If `draft` selected: Set `spec_file`. Run **Story-key resolution** (below). **EARLY EXIT** → `./step-02-plan.md` (resume planning from the draft)
     - If `ready-for-dev` or `in-progress` selected: Set `spec_file`. Run **Story-key resolution** (below). **EARLY EXIT** → `./step-03-implement.md`
     - If `in-review` selected: Set `spec_file`. Run **Story-key resolution** (below). **EARLY EXIT** → `./step-04-review.md`
   - Unformatted spec or intent file lacking `status` frontmatter? → Suggest treating its contents as the starting intent. Do NOT attempt to infer a state and resume it.

Never ask extra questions if you already understand what the user intends.

### Story-key resolution

This runs on ALL paths (early-exit and INSTRUCTIONS) whenever `spec_file` is set. Determine whether the spec is an epic story — use the spec's filename, frontmatter, and any loaded epics file to identify `epic_num` and `story_num`. If the spec is not an epic story, skip silently and leave `story_key` unset.

If the spec is an epic story and `{{.sprint_status}}` exists: find the `development_status` key matching `{epic_num}-{story_num}` by exact numeric equality on the first two segments (so `1-1` never collides with `1-10`). Exactly one match → set `story_key` to that full key. Zero or multiple matches → leave `story_key` unset (warn on multiple).

## INSTRUCTIONS

1. Load context.
   - List files in `{{.planning_artifacts}}` and `{{.implementation_artifacts}}`.
   - If you find an unformatted spec or intent file, ingest its contents to form your understanding of the intent.
   - **Determine context strategy.** Using the intent and the artifact listing, infer whether the current work is a story from an epic. Do not rely on filename patterns or regex — reason about the intent, the listing, and any epics file content together.

     **A) Epic story path** — if the intent is clearly an epic story:

     1. Identify the epic number `{epic_num}` and (if present) the story number `{story_num}`. If you can't identify an epic number, use path B.

     2. **Check for a valid cached epic context.** Look for `{{.implementation_artifacts}}/epic-<N>-context.md` (where `<N>` is the epic number). A file is **valid** when it exists, is non-empty, starts with `# Epic <N> Context:` (with the correct epic number), and no file in `{{.planning_artifacts}}` is newer.
        - **If valid:** load it as the primary planning context. Do not load raw planning docs (PRD, architecture, UX, etc.). Skip to step 5.
        - **If missing, empty, or invalid:** continue to step 3.

     3. **Compile epic context.** Produce `{{.implementation_artifacts}}/epic-<N>-context.md` by following `./compile-epic-context.md`, in order of preference:
        - **Preferred — subagent:** spawn a subagent synchronously (wait for it to return in this turn) with `./compile-epic-context.md` as its prompt. Pass it the epic number, the epics file path, the `{{.planning_artifacts}}` directory, and the output path `{{.implementation_artifacts}}/epic-<N>-context.md`.
        - **Fallback — inline** (for runtimes without subagent support, e.g. Copilot, Codex, local Ollama, older Claude): if your runtime cannot spawn subagents, or the spawn fails/times out, read `./compile-epic-context.md` yourself and follow its instructions to produce the same output file.

     4. **Verify.** After compilation, verify the output file exists, is non-empty, and starts with `# Epic <N> Context:`. If valid, load it. If verification fails, HALT and report the failure.

     5. **Previous story continuity.** Regardless of which context source succeeded above, scan `{{.implementation_artifacts}}` for specs from the same epic with `status: done` and a lower story number. Load the most recent one (highest story number below current). Extract its **Code Map**, **Design Notes**, **Spec Change Log**, and **task list** as continuity context for step-02 planning. If no `done` spec is found but an `in-review` spec exists for the same epic with a lower story number, note it to the user and ask whether to load it.

     6. **Resolve `{story_key}`.** If not already set by an earlier early-exit path, run **Story-key resolution** (above) now.

     **B) Freeform path** — if the intent is not an epic story:
     - Planning artifacts are the output of BMAD phases 1-3. Typical files include:
       - **PRD** (`*prd*`) — product requirements and success criteria
       - **Architecture** (`*architecture*`) — technical design decisions and constraints
       - **UX/Design** (`*ux*`) — user experience and interaction design
       - **Epics** (`*epic*`) — feature breakdown into implementable stories
       - **Product Brief** (`*brief*`) — project vision and scope
     - Scan the listing for files matching these patterns. If any look relevant to the current intent, load them selectively — you don't need all of them, but you need the right constraints and requirements rather than guessing from code alone.
2. Clarify intent. Do not fantasize, do not leave open questions. If you must ask questions, ask them as a numbered list. When the human replies, verify that every single numbered question was answered. If any were ignored, HALT and re-ask only the missing questions before proceeding. Keep looping until intent is clear enough to implement.
3. Version control sanity check. Is the working tree clean? Does the current branch make sense for this intent — considering its name and recent history? If the tree is dirty or the branch is an obvious mismatch, HALT and ask the human before proceeding. If version control is unavailable, skip this check.
4. Multi-goal check (see SCOPE STANDARD). If the intent fails the single-goal criteria:
   - Present detected distinct goals as a bullet list.
   - Explain briefly (2–4 sentences): why each goal qualifies as independently shippable, any coupling risks if split, and which goal you recommend tackling first.
   - HALT and ask human: `[S] Split — pick first goal, defer the rest` | `[K] Keep all goals — accept the risks`
   - On **S**: For each deferred goal, append one new entry to `{{.deferred_work_file}}` using this format. Do not modify existing entries or look for duplicates. Narrow scope to the first-mentioned goal. Continue routing.
     ```markdown
     - source_spec: none
       summary: <one sentence naming the deferred goal>
       evidence: <why this was split from the current intent>
     ```
   - On **K**: Proceed as-is.
5. Route — choose exactly one:

   Derive a valid kebab-case slug from the clarified intent. If the intent references a tracking identifier (story number, issue number, ticket ID), lead the slug with it (e.g. `3-2-digest-delivery`, `gh-47-fix-auth`). If `{{.implementation_artifacts}}/spec-{slug}.md` already exists: if its status is `draft`, treat it as the same work and resume it (set `spec_file` to that path, **EARLY EXIT** → `./step-02-plan.md`); otherwise append `-2`, `-3`, etc. Set `spec_file` = `{{.implementation_artifacts}}/spec-{slug}.md`.

   **a) One-shot** — zero blast radius: no plausible path by which this change causes unintended consequences elsewhere. Clear intent, no architectural decisions.

   **EARLY EXIT** → `./step-oneshot.md`

   **b) Plan-code-review** — everything else. When uncertain whether blast radius is truly zero, choose this path.

## NEXT

Read fully and follow `./step-02-plan.md`
