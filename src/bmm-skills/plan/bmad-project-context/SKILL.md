---
name: bmad-project-context
description: 'Curate and maintain verified project context for AI agents. Use when the user says "project context", "document project", "generate project context", "refresh context", or "audit context"'
---

# Overview

You are the curator of everything the code can't say. This skill builds and maintains a project's context system: a tiny always-loaded **kernel** and a **bundle** of small verified knowledge entries — architecture rationale, unobvious conventions, landmines, org requirements. The governing thesis, backed by measurement: generated documentation makes agents worse; a curated minimum of verified, non-derivable truths makes them better. So you curate the minimum non-derivable set and never describe what the code already says.

Works with a full BMad install or standalone in any repo with no framework at all.

**Args:** intent (`ingest` | `query` | `audit`); `--auto` for headless; a scope path to bound the run; placement (`bmad` | `agent-files` | `both`); a bundle-root override; extra source paths or URLs to mine. Supplied values are used directly and skip their questions. Script interface: `uv run {skill-root}/scripts/context.py --help`.

## Resolution rules

- Bare paths and `{skill-root}` (e.g. `references/kernel-contract.md`) resolve from this skill's installed directory.
- `{project-root}` → the project working directory.

## On Activation

1. Resolve customization: `uv run {project-root}/_bmad/scripts/resolve_customization.py --skill {skill-root} --key workflow`. On failure, read `{skill-root}/customize.toml` directly and use defaults. Execute `{workflow.activation_steps_prepend}`; treat `{workflow.persistent_facts}` entries as standing context (`file:` = paths/globs to load, others verbatim).
2. Mechanics: every mechanical fact comes from the script, never from guessing. If `{project-root}/_bmad/scripts/context.py` is missing (standalone repo), run `uv run {skill-root}/scripts/context.py bootstrap` once — it installs itself there. All later calls: `uv run {project-root}/_bmad/scripts/context.py <command>` (`--json` on any command for machine reads; `--help` for the full interface).
3. Config comes from one resolution, never hand-merged: `uv run {project-root}/_bmad/scripts/context.py config --json`. It delegates to the installed BMad resolver (`resolve_config.py`) when present and otherwise falls back through the legacy and standalone config files itself, so the script and this session can never disagree about paths. Read `{user_name}`, `{communication_language}` (use it every turn), `{document_output_language}`, `{project_knowledge}`, `{output_folder}` (standalone default `_bmad-output`), and `context_placement` from its output.
4. **First run** (no kernel at `{project_knowledge}/kernel.md`), interactive only: load `references/placement.md` and settle the bundle location and placement there. In auto mode: detect (BMad install → bmad, else agent-files), record `context_placement`, don't ask.
5. Init or resume the memlog at `{project_knowledge}/.memlog.md` (`uv run {project-root}/_bmad/scripts/memlog.py init --path ...` if absent; if present, read it once — it is the record of every prior run, and refresh diffs against it instead of starting over). If `memlog.py` itself is missing (standalone repo), append one-line typed entries to the same file directly — append-only, never rewritten.
6. Detect intent — **ingest** (build or refresh; the default), **query** (answer from the bundle), **audit** (shrink and re-verify) — and greet `{user_name}`. For interactive ingest, ask what they bring before anything scans: sources outside the repo (org handbooks, wiki or Notion exports, prior architecture docs, MCP knowledgebases) and any area to focus on — note the paths for subagent scanning, don't read them now; when a named source is huge, ask one bounding question rather than scanning it whole. Fold `{workflow.external_sources}` entries into the same source list. Auto mode skips the ask, scans what's discoverable, and logs that as an assumption. Execute `{workflow.activation_steps_append}`.

## Engine disciplines — every intent, every mode

- Every user decision, confirmed claim, rejected claim, and idea lands in the memlog the moment it happens — never batched for session end.
- **Orchestrate the scanning.** Discovery is yours to plan with whatever tools fit, but make good use of parallel subagents: they scan, returning claims with evidence paths and an inferred|needs-confirmation mark; you interrogate and decide, and never grind a large tree through your own context.

## Writing rules — every kernel line, entry, and compass

- **Succinct to the point of discomfort.** Every sentence costs context in every future session. If a line can be shorter, it isn't done.
- **Present truth only.** State what *is*, never the story of the edit — "we removed X because..." is banned prose. Git and the memlog hold history; supersession is a dated frontmatter field.
- **No reference without a link.** Every mentioned decision, doc, file, or system carries a path, `[[project:entry]]` link, or URL a fresh context can follow. "As previously discussed" is banned.

## Ingest

The outcome: a kernel within its instruction budget and bundle entries for what earned depth — every claim verified (user-confirmed or path-checked, interactive only; auto mode writes the same content marked `generated`) before it's written as truth. Contracts govern the artifacts: load `references/kernel-contract.md` and `references/bundle-contract.md` before writing either.

**Brownfield:** discover the repo however you judge best, then fan out the source scan (trust ladder: code and configs are ground truth; planning docs next — an ARCHITECTURE-SPINE is the premier source; existing docs folders, org docs, and MCP knowledgebases are untrusted until verified against code). Then interrogate in chunked rounds per `references/interrogation-guide.md` — confirmations first, then only the genuinely unknowable. Never ask what a scan could answer. A bloated docs folder is a source to strip-mine, then recommend archiving.

**Greenfield:** same pipeline seeded from a bmad-spec artifact or planning doc (or pure interview). If a genuinely contested decision surfaces — real tradeoffs, multiple viable shapes — say it deserves `bmad-architecture` rather than making the call: decisions are born there; they *live* here.

**Refresh:** ingest with existing artifacts — read the memlog, run `sweep`, diff instead of restarting, never re-ask what a prior run settled. Sweep findings resolve against code, not prose: when a path a claim names is gone, the claim is updated to the new reality or removed/marked superseded — re-pointing its `sources` at documents that merely mention it is laundering, not verification. Total size must hold or shrink.

**Scope:** whole repo or a component; in a monorepo, global truths go in the root kernel, component truths in that component's compass. After writing: `index`, then `validate` — its stats block is the measured budget check; an over-budget finding means cut, never raise. Under agent-files/both placement, `sync --dry-run` first and show which files it will touch (confirm on the session's first sync; auto mode skips the ask and logs the written list to the memlog), then `sync`. Close with a fresh-eyes polish pass: a subagent holding only the written artifacts and the two contract files — none of this conversation — returns proposed cuts and rewrites (line, which test it fails, replacement or delete); apply or override, logging overrides to the memlog. The writer who just heard every line justified cannot honestly run the pruning test on it. If subagents are unavailable, run the pass yourself against the contracts. Log the run's summary to the memlog and offer a face artifact.

## Query

Answer a question from the bundle without loading all of it: resolve through `index.md`, and return only the relevant entries with their trust metadata (`verified`/`generated`, sources, staleness — staleness read from `sweep --json`, never recomputed; field semantics in `references/bundle-contract.md`). Anything outside this repo — a `[[project:entry]]` link, a question about another project — goes through `resolve <name>` only, which returns a local path, SHA, and freshness; never crawl the filesystem or workspace for another project's context, because the same query must work when that project isn't checked out. Never dump the bundle. If the bundle can't answer, say so — don't improvise an answer the context doesn't hold.

## Audit

Keep the set small and true: run `validate` and `sweep` — sweep's `missing` list is the path-check for every claim naming a file, and validate's stats block measures the kernel budget — and apply the pruning test to every kernel line — *would removing this line change agent behavior?* If no, it goes. Entries that paraphrase readable code are deleted; unconfirmed `generated` entries are queued for confirmation. Load `references/bundle-contract.md` before mutating any entry — the frontmatter it acts on is defined there. Where an obeya is configured, propose batched promotion of `org-candidate` entries. Audit ends with the context smaller or equal, never larger — present proposed deletions for confirmation (interactive) before removing; in auto mode deletions proceed and every removal lands in the memlog as a typed entry.

## Modes

Interactive is the default: the user is the oracle, in chunked rounds. **Auto mode** (headless, or on request) accepts inferences without confirmation — everything it writes, including path-checked claims, is marked `generated`, never `verified` (`verified` asserts a human was in the loop), and every assumption lands in the memlog. A headless invocation may supply intent (`ingest`|`query`|`audit`), a scope path, a placement, and a bundle root — supplied values are used directly; only genuinely absent ones are inferred, each inference logged as an `assumption`. When invoked headless: never ask; if intent is neither supplied nor inferable, halt with a `blocked` JSON status and `reason`. End with JSON:

```json
{"status": "complete", "intent": "ingest", "kernel": "docs/kernel.md",
 "bundle": "docs/", "memlog": "docs/.memlog.md", "placement": "agent-files"}
```

## Face artifacts

On request after any intent, generate a human-readable face of the context — always asking its purpose first so it fits (a slide deck for one subsystem, a website of everything, a service explainer). Faces are written outside the bundle (default `{output_folder}`), never indexed, never cited as a source, and regenerated rather than maintained: the organized, indexed markdown is the only source of truth.

## Finalize

Distill the memlog — every meaningful entry captured in an artifact or set aside as noise — confirm `validate` exits clean, tell the user what exists where (and what was *not* created, if kernel-only). When `AGENTS.md` carries the kernel, say plainly: if your harness doesn't auto-load `AGENTS.md`, make the context file it does load pull this one in (e.g. a `CLAUDE.md` containing `@AGENTS.md`). Then run `{workflow.on_complete}` if non-empty.
