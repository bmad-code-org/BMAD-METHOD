---
name: bmad-project-context
description: 'Write and maintain a project''s agent guide (AGENTS.md): verified commands, repo policy, non-default conventions, entry points, and known agent pitfalls. Use when the user says "project context", "document project", "generate project context", "set up AGENTS.md", "refresh context", "audit context", or wants to record a mistake agents keep making'
---

# Overview

The product is a good agent guide — a short `AGENTS.md` every session loads, plus an `AGENTS-dev.md` that coding sessions read. Generated documentation makes agents worse; what helps is a short guide where every line passed its section's admission rule and its facts are verified. The section plan in `references/guide-contract.md` is fixed: the job is to fill it with verified evidence, not to explore the repository for interesting facts. The repository is where claims get verified; the knowledge itself comes from configuration, history, observed agent mistakes, and the people who maintain the project.

Works with a full BMad install or standalone in any repo.

**Args:** intent (`bootstrap` | `refresh` | `record` | `audit`); `--auto` for headless; a scope path to limit the run; extra source paths or URLs. Supplied values are used directly and skip their questions.

## Resolution rules

- Bare paths and `{skill-root}` (e.g. `references/guide-contract.md`) resolve from this skill's installed directory.
- `{project-root}` → the project working directory.

## On Activation

1. Resolve customization: `uv run {project-root}/_bmad/scripts/resolve_customization.py --skill {skill-root} --key workflow`. On failure, read `{skill-root}/customize.toml` directly and use defaults. Execute `{workflow.activation_steps_prepend}`; treat `{workflow.persistent_facts}` entries as standing context (`file:` = paths/globs to load, others verbatim).
2. Config: if `{project-root}/_bmad` exists, `uv run {project-root}/_bmad/scripts/resolve_config.py --project-root {project-root}` and read `{user_name}`, `{communication_language}` (use it every turn), `{output_folder}`. Standalone: skip, and default `{output_folder}` to `_bmad-output`.
3. Read the existing agent instruction files — root and nested `AGENTS.md`, `CLAUDE.md` and similar — and the ledger at `{output_folder}/project-context-ledger.md` if present.
4. Detect intent and greet `{user_name}`: **bootstrap** (no ledger — this skill's first run here, whether the repo has no guide, a poor one, or a good handwritten one to build on — the default), **refresh** (ledger exists; update the guide to match the repo), **record** (the user reports an observed agent mistake, lesson, or new rule), **audit** (re-verify and prune). For interactive bootstrap/refresh, ask one opening question: any sources outside the repo (org handbooks, wikis, planning docs, MCP knowledgebases) and any area to focus on — note paths for later, don't read them yet. Add `{workflow.external_sources}` entries to the same list. Execute `{workflow.activation_steps_append}`.

## Bootstrap and Refresh

Load `references/guide-contract.md` and `references/evidence.md` before step 1. The order matters: plan before scanning, select before writing.

1. **Plan the guide.** Instantiate the contract's section plan for this repo and list, per section, the evidence it needs. A handwritten `AGENTS.md` is the baseline being improved, never raw material to discard: map its content into the plan first.
2. **Gather evidence.** Launch parallel subagents, one per evidence source in `references/evidence.md` (sources 1–5; the maintainer, source 6, is step 4). Each returns candidates for the ledger: claim, evidence paths, target section, what behavior it changes, verification status. The scan-scope rules in that file bind every scanner.
3. **Verify.** Run the commands the guide will state and path-check every claim that names a file. Read-only commands run freely; a mutating command (a build, a test suite) waits for its go-ahead, asked as the interview's first question. A claim verified by execution or path-check is verified — never ask the user to confirm it.
4. **Interview.** Only what no scan can reach: org requirements, frozen areas, domain concepts, intent — and always "what do agents keep getting wrong here?". Rules in `references/evidence.md`. Write every answer and rejection to the ledger as it arrives.
5. **Compose.** Decide what each section says from the accepted candidates, then write the guide as one coherent document under the contract. Copy-editing comes last; it is not how selection happens. Where an instruction outside the guide contradicts it (a stale `CLAUDE.md` line, a retired command still recommended), propose the concrete fix to that file — leaving two live contradictory instructions is a defect.
6. **Coverage check and close.** Go through the ledger: every accepted candidate must trace to a guide line, a scoped guide, or a rejection with a reason — and, in the other direction, every line in the guide must trace to a ledger candidate. A line with no candidate slipped in at composition time without evidence: backfill it with real evidence or delete it. Check every repo-relative path the guide names against the filesystem; fix dead links before closing. Confirm the guide fits the contract's budget. Tell the user what was written, what was rejected and why, and — whenever `AGENTS.md` carries the guide — that a harness which doesn't auto-load `AGENTS.md` needs its own file to pull it in (e.g. a `CLAUDE.md` containing `@AGENTS.md`).

**Refresh:** same steps against the existing guide and ledger. Never re-ask what a prior run settled; re-verify the commands and paths the guide states; update or remove lines whose evidence is gone. The guide grows only when new evidence justifies it.

**Greenfield:** same process, based on a spec or planning document (or interview alone). Commands that don't exist yet are written from the decided stack and marked for verification on the first refresh after code exists. A genuinely contested design decision — real tradeoffs, multiple viable shapes — deserves the `bmad-architecture` skill rather than a call made here.

## Record

Record one observed agent mistake or lesson at the moment it happens. Get the task, the mistake, the correction, and the evidence (a session, a review comment, the user's testimony); log it to the ledger. A first occurrence is a candidate; a recurring or costly mistake gets a line in the guide's pitfalls section now — write it, show the diff. If the mistake is mechanically preventable, propose the hook, lint, or CI check instead: enforcement beats prose.

## Audit

Run every command the guide states, path-check every named file, apply the contract's pruning test to every line, and check for contradictions with other agent instruction files. Lines that fail move to a scoped guide, get fixed, or are deleted — present proposed deletions for confirmation (interactive) before removing. A pitfall or policy line is deleted only when the thing it guards is gone or the user retires it; absence of recent failures is never grounds. Audit ends with the guide smaller or equal, never larger.

## Modes

Interactive is the default. **Auto mode** (headless, or on request) never asks: it skips the interview, writes only what repository evidence supports, and logs every open question and assumption to the ledger so the next interactive run starts there. When invoked headless: if intent is neither supplied nor inferable, halt with a `blocked` JSON status and `reason`. End with JSON:

```json
{"status": "complete", "intent": "bootstrap", "guide": "AGENTS.md",
 "dev_guide": "AGENTS-dev.md", "scoped_guides": ["src/billing/AGENTS.md"],
 "ledger": "_bmad-output/project-context-ledger.md"}
```

## Finalize

Confirm the ledger reflects the run — every candidate has a disposition, every interview answer is recorded — and run `{workflow.on_complete}` if non-empty.
