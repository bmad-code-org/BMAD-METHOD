---
name: bmad-project-context
description: 'Write and maintain a project''s agent guide (AGENTS.md): verified commands, repo policy, non-default conventions, entry points, and known agent pitfalls. Use when the user says "project context", "document project", "generate project context", "set up AGENTS.md", "refresh context", "audit context", or wants to record a mistake agents keep making'
---

# Overview

The product is a good `AGENTS.md` — the short guide an agent loads before every task in this project. The evidence is blunt: generated documentation volume makes agents worse, while a short prescriptive guide of verified, non-derivable facts makes them better. We already know what such a guide contains — the section plan in `references/guide-contract.md` is fixed, and the job is to fill those sections with verified evidence, not to explore the repository for interesting facts. The repository is where claims get *verified*; it is not where the knowledge comes from. The irreplaceable content lives in executable configuration, targeted history, observed agent mistakes, and human heads — in that order of increasing irreplaceability.

Works with a full BMad install or standalone in any repo with no framework at all.

**Args:** intent (`bootstrap` | `refresh` | `record` | `audit`); `--auto` for headless; a scope path to bound the run; extra source paths or URLs. Supplied values are used directly and skip their questions.

## Resolution rules

- Bare paths and `{skill-root}` (e.g. `references/guide-contract.md`) resolve from this skill's installed directory.
- `{project-root}` → the project working directory.

## On Activation

1. Resolve customization: `uv run {project-root}/_bmad/scripts/resolve_customization.py --skill {skill-root} --key workflow`. On failure, read `{skill-root}/customize.toml` directly and use defaults. Execute `{workflow.activation_steps_prepend}`; treat `{workflow.persistent_facts}` entries as standing context (`file:` = paths/globs to load, others verbatim).
2. Config: if `{project-root}/_bmad` exists, `uv run {project-root}/_bmad/scripts/resolve_config.py --project-root {project-root}` and read `{user_name}`, `{communication_language}` (use it every turn), `{output_folder}`. Standalone: skip, and default `{output_folder}` to `_bmad-output`.
3. Read the active steering set: root and nested `AGENTS.md`, `CLAUDE.md` and other agent files, and the ledger at `{output_folder}/project-context-ledger.md` if present. These are the current instructions agents actually receive; every run starts from them.
4. Detect intent and greet `{user_name}`: **bootstrap** (no useful guide yet, or the user wants a rewrite — the default), **refresh** (guide and ledger exist; reconcile with reality), **record** (the user reports an observed agent mistake, lesson, or new rule), **audit** (re-verify and prune). For interactive bootstrap/refresh, ask one opening question: any sources outside the repo (org handbooks, wiki exports, planning docs, MCP knowledgebases) and any area to focus on — note paths for the evidence sweep, don't read them now. Fold `{workflow.external_sources}` into the same list. Execute `{workflow.activation_steps_append}`.

## Bootstrap and Refresh

Discovery is progressive — each step narrows the next; broad scanning before the guide is planned is the failure mode this skill replaces. Load `references/guide-contract.md` and `references/evidence.md` before step 1.

1. **Plan the guide.** Instantiate the contract's section plan for this repo, and list per section the evidence it needs. In a repo with a handwritten `AGENTS.md`, that file is the baseline being improved, never raw material to discard: map its content into the plan first.
2. **Gather evidence.** Fan out parallel subagents, one per evidence lane in `references/evidence.md` — lanes are editorial jobs, not file categories. Each returns ledger-shaped candidates: claim, evidence paths, target section, what behavior it changes, verification status. Corpus rules in the reference bind every scanner.
3. **Verify mechanically.** Run the commands the guide will state (read-only commands freely; anything mutating needs the user's go-ahead) and path-check every claim that names a file. A claim verified by execution or path-check is *verified* — never ask the user to confirm it.
4. **Interview.** Only what no scan can reach: org requirements, frozen areas, domain concepts, intent, priorities — and always "what do agents keep getting wrong here?". Rules and caps in `references/evidence.md`. Log every answer and rejection to the ledger as it lands.
5. **Compose.** Selection and grouping happen before writing: decide what each section says from the accepted candidates, then write the guide as one coherent document under the contract. Copy-editing is the last step, never the curation mechanism. Where an instruction outside the guide contradicts it (a stale `CLAUDE.md` line, a retired command still recommended), propose the concrete fix to that file — surfacing the conflict and leaving both instructions live is a defect.
6. **Coverage check and close.** Walk the ledger: every accepted candidate traces to a guide line, a scoped guide, or a rejection with a reason — an untraceable candidate means the check failed. Confirm the guide meets the contract's budget. Tell the user what was written, what was rejected and why, and — whenever `AGENTS.md` carries the guide — say plainly: if your harness doesn't auto-load `AGENTS.md`, make the file it does load pull this one in (e.g. a `CLAUDE.md` containing `@AGENTS.md`).

**Refresh** runs the same steps against the existing guide and ledger: never re-ask what a prior run settled, re-verify the commands and paths the guide states, and update or remove lines whose evidence is gone. The guide grows only when new evidence earns it.

**Greenfield:** same pipeline seeded from a spec or planning document (or pure interview). Commands that don't exist yet are written from the decided stack and marked for verification on the first refresh after code exists. A genuinely contested design decision — real tradeoffs, multiple viable shapes — deserves the `bmad-architecture` skill rather than a call made here.

## Record

The cheapest and highest-value intent: capture one observed agent mistake or lesson at the moment it happens. Get the task, the mistake, the correction, and the evidence (a session, a review comment, the user's testimony); log it to the ledger. First occurrence makes a candidate; a recurring or costly mistake earns a line in the guide's pitfalls section now — write it, show the diff. If the mistake is mechanically preventable, say so and propose the hook, lint, or CI check instead: enforcement beats prose.

## Audit

Re-verify and shrink: run every command the guide states, path-check every named file, apply the contract's pruning test to every line, and check for contradictions between the guide and other active steering files. Lines that fail move to a scoped guide, get fixed, or die — present proposed deletions for confirmation (interactive) before removing. Audit ends with the guide smaller or equal, never larger.

## Modes

Interactive is the default. **Auto mode** (headless, or on request) never asks: it skips the interview, writes only what repository evidence supports, and logs every open question and assumption to the ledger so the next interactive run starts there. When invoked headless: if intent is neither supplied nor inferable, halt with a `blocked` JSON status and `reason`. End with JSON:

```json
{"status": "complete", "intent": "bootstrap", "guide": "AGENTS.md",
 "scoped_guides": ["src/billing/AGENTS.md"],
 "ledger": "_bmad-output/project-context-ledger.md"}
```

## Finalize

Confirm the ledger reflects the run — every candidate dispositioned, every interview answer captured — and run `{workflow.on_complete}` if non-empty.
