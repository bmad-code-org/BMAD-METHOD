---
name: bmad-project-context
description: 'Set up or refresh agent instructions so AI agents work well in it. Use when the user says "project context", "set up AGENTS.md", "document this project", "refresh context", "audit context", wants to apply coding standards or governance to a repo, or wants to record a mistake agents keep making'
---

# Overview

A conversation that produces a repository's agent instructions: a small verified block inside `AGENTS.md`. The user brings rules they want followed — governance, security, standards — and the repository supplies the rest, verified.

Conversational always; the user approves every write.

**Args:** intent (`setup` | `refresh` | `record` | `audit`); a target repo or path; extra source paths or URLs. Supplied values skip their questions.

## Resolution rules

- Bare paths and `{skill-root}` (e.g. `references/best-practices.md`) resolve from this skill's installed directory.
- `{project-root}` → the project working directory.
- **Target** → the repository being described, defaulting to `{project-root}`. If it resolves to more than one working tree, or to one the user cannot commit in, ask before writing.

## On Activation

1. Resolve customization: `uv run {project-root}/_bmad/scripts/resolve_customization.py --skill {skill-root} --key workflow`. On failure, read `{skill-root}/customize.toml` directly and use defaults. Execute `{workflow.activation_steps_prepend}`; treat `{workflow.persistent_facts}` entries as standing context (`file:` = paths/globs to load, others verbatim).
2. Config: if `{project-root}/_bmad` exists, `uv run {project-root}/_bmad/scripts/resolve_config.py --project-root {project-root}` and read `{user_name}`, `{communication_language}` (use it every turn), `{output_folder}`. Standalone: skip.
3. **Load `references/best-practices.md` and `references/template.md` before anything else.** Every decision below is made against them.
4. Detect intent and greet `{user_name}`: **setup** (no block in the target — the default), **refresh** (a block exists), **record** (the user reports a mistake agents made), **audit** (re-verify and prune). Fold `{workflow.external_sources}` into the source list. Execute `{workflow.activation_steps_append}`.

## Setup and Refresh Steps

No writes until step 5!

### 1. Assess and report

Read `AGENTS.md`, harness or agent specific rule files, docs folders, and any notes carrying lessons. Report what exists and how it measures up, per `best-practices.md`.

If the target contains separable units — a workspace manifest listing members, or directories carrying their own build manifest — name them and ask whether this run covers the root only, all of them, or which. Absent that evidence, do not ask. Sibling repositories are not children; each is its own target, offered in turn.

### 2. Ask what they bring

Rules to follow regardless of what the repo does: governance, security and compliance, coding standards, style guides, frozen areas. Ask for outside documents too — handbooks, wikis, architecture docs, MCP knowledgebases. Note the paths; do not read them yet.

Greenfield: this is the whole content. Brownfield: it is the half no scan reaches.

### 3. Discover and verify

Fan out with parallel subagents against what the sections need — executable config and CI for policy and for what they already state, tracked source for conventions and boundaries, targeted history for constraints whose reason must still hold.

`package.json`, a `Makefile`, `pyproject.toml`, and CI config are read to know what the block must not repeat. Their caveats come from the human in step 4. Path-check every claim naming a file.

Each child agreed in step 1 is scanned as its own scope, against its own manifests.

### 4. Interview the gaps

Only what no scan reaches: what agents keep getting wrong here, what is off limits, what a domain term means, why a constraint exists.

- Never ask what a scan could answer. Asking the user to confirm a path-checked claim, or one a config file already states, is a defect.
- Ask recall questions, not review lists. Never hand the user a selection problem a scan created.
- A mistake this session made and caught is observed evidence — offer it.
- Batches of at most eight; fewer is better. A batch yielding nothing new means write.
- When the repo contradicts the user, show the evidence and ask. Never write the claim as given, never drop it silently.

### 5. Show the block, then write it

Compose against `template.md`. For each candidate, ask first whether a hook, lint rule, or CI check enforces it better than prose; if so propose the check, and the line becomes the fallback if they decline.

**Show the complete block before writing it**, and every child block alongside it — one approval covers the set. On approval, splice between the markers, leaving everything outside them byte-identical. Fill each provenance line with today's date and the verified SHA.

Where an instruction elsewhere contradicts the block in a way that changes behavior — a stale `CLAUDE.md` line, a retired command — propose the fix to that file. Two live contradictory instructions is a defect.

Never commit.

### 6. Close

- What went in, and what was left out and why.
- Why, in the user's terms, from `best-practices.md` — why it is small, why what the repo already states stays out, why a pitfall line stays until its cause is gone.
- How it loads, and that other harness files can point at it.
- Maintenance: re-run after significant change, `record` the moment an agent gets something wrong, prefer a check over a new line.
- Rules repeating across their projects, or personal rather than the team's, belong in their global agent config.

### Refresh

Same steps, step 1 as a diff. Read the provenance line, re-verify every path and every caveat, and run `git log --diff-filter=DR --name-only` since the recorded SHA against every line — update or remove lines whose evidence is gone. Never re-ask what a prior run settled; the interview shrinks to what changed about how the team works. The block grows only on new evidence.

### Greenfield

Seeded from a spec or planning document, or interview alone. Commands that do not exist yet are written as explicit TODOs naming the decided stack, never a guessed invocation stated as fact, and verified on the first refresh after code exists. A genuinely contested design decision — real tradeoffs, multiple viable shapes — goes to `bmad-architecture`.

### Migration

If the target has a `project-context.md` from the retired skills, commonly under `{output_folder}`, read it in step 1 and offer to absorb its content. Do not delete it without agreement, and do not silently orphan it.

## Record

Capture one observed agent mistake as it happens — the only admissible source for a pitfall line.

Take the task, the mistake, the correction, and its evidence. Check the block for a line already covering it. One occurrence is noted; a recurring or costly mistake earns a line now — write it, show the diff. If it is mechanically preventable, propose the hook, lint rule, or CI check instead.

## Audit

Re-check every caveat, path-check every file, follow every pointer, and ask of every line whether removing it would change agent behavior. Check for contradictions with other instruction files.

Failing lines move behind an observable trigger, get fixed, or are deleted — confirm deletions first. **A policy or pitfall line goes only when the thing it guards is gone or the user retires it; nothing failing lately is not grounds.** Audit ends smaller or equal.

## Children

A component, nested repository, or extracted rules file gets its own file under the same shape when work keeps landing there and its truths do not belong at the parent level. Rules bounded to a directory go in a nested `AGENTS.md` there, attached by location. Use a linked file only when the trigger is not a path.

A chosen child that ends with nothing its parent does not already say gets no file. Say so and move on.

List every child in the parent's **Where things are** with one line and its path. Discovery never depends on the harness finding it.
