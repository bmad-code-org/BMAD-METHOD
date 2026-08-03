---
title: "The Theory of Project Context"
description: Why bmad-project-context captures so little, what earns a place in the context system, and what is deliberately left out
sidebar:
  order: 12
---

`bmad-project-context` is built on an uncomfortable finding: most documentation written *for* AI agents makes them worse. This page explains the theory behind the skill — what it captures and why, and more importantly, what it deliberately refuses to capture. If you are coming from `bmad-document-project` or `bmad-generate-project-context`, the second half explains exactly what changed and why.

For what the skill *does* and how to run it, see [Project Context](project-context.md) and the [how-to guide](../how-to/project-context.md).

## The problem with generated documentation

Three findings drive the design:

1. **LLM-generated context documents measurably degrade agent performance** — lower correctness at higher cost. A generated overview is a paraphrase of the code, and a paraphrase is worse than the code: it drops detail, it drifts the moment the code changes, and the agent trusts it instead of looking.
2. **Every line of always-loaded context is paid for in every session.** A 2,000-line context file is not "thorough" — it is a tax on every future task, most of it spent on things the agent would have gotten right anyway.
3. **Wrong context is worse than no context.** An agent with no documentation explores and finds the truth. An agent with a stale document confidently follows it off a cliff. Staleness is not a cosmetic problem; it is the failure mode.

The conclusion: the valuable set is the **minimum of non-derivable, verified truths** — everything an agent cannot learn by reading the code, and nothing it can.

## What earns a place

The test for every line is the **pruning test**: *would removing this line change agent behavior?* If an agent would do the right thing anyway — because the code shows it, or because it is the ecosystem default — the line is noise. What passes:

- **Commands where the obvious guess fails.** `npm install`, never `npm ci`, because lockfiles are deliberately gitignored. An agent cannot derive "deliberately" from a missing file.
- **Conventions that differ from defaults.** Only the divergences. "Use conventional commits" earns a line; "write tests for new code" does not — the agent already believes that.
- **Landmines.** The docs folder that predates two migrations. The workflow that looks live but is broken. The two generations of config variables that must not be mixed. These are the facts whose absence produces confident, wrong work.
- **Decision rationale.** *Why* the architecture is shaped this way — the code shows the shape, never the reason. Decisions are born in `bmad-architecture`; they live here.
- **Org requirements and domain facts** that exist nowhere in the repo at all.

Everything captured is **verified before it is written as truth**: mined claims are checked against code (the trust ladder — code and configs are ground truth, existing docs are untrusted until proven), then confirmed with a human. Every entry carries its trust status (`verified` or `generated`), its sources, and its verification date. A claim nobody confirmed is stored as `generated` — visible as inference, never laundered into fact.

## What is deliberately not captured

The negative space is the design. Each exclusion has a reason:

| Not captured | Why |
|---|---|
| **What the code already says** | Agents read source better than they read summaries of source. A paraphrase adds a second copy that rots while the original stays true. |
| **Repo structure and file maps** | Structure changes with every commit — stored maps rot fastest of all. Agents derive structure fresh in seconds with the tools they already have. |
| **Overview and tour documents** | The classic generated deliverable, and the measured harm: long overviews add wasted exploration and misplaced confidence. The kernel's job is to change behavior, not to orient a reader. |
| **Ecosystem defaults** | An LLM already knows how a typical Node, Python, or Go project works. Restating defaults spends budget teaching the agent what it arrived knowing. |
| **History and edit narration** | "We removed X because…" is banned prose. Git and the memlog own history; entries state present truth only, and supersession is a dated frontmatter field, not a story. |
| **Unverified inference presented as fact** | Anything not confirmed stays marked `generated`. The trust field is the contract: `verified` asserts a human was in the loop. |
| **User-facing documentation** | Tutorials, setup guides, and reference sites serve human readers — a different artifact with different rules. The skill will flag user docs that have drifted (as a landmine: "distrust docs/ on these topics") but it does not write or replace them. |
| **Aspirational state** | What the system *should* become belongs in specs and architecture documents. Context describes what *is* — an agent acting on aspiration ships fiction. |

The result is small by design. A healthy kernel is a screenful; a healthy bundle for a real repo is a dozen small entries. Small projects need the kernel and nothing else — that outcome is success, not an unfinished job.

## Context is a liability to be re-earned

The old model treated documentation as an asset: more coverage, more value. This skill treats context as a **liability that must keep proving itself**. Staleness sweeps check every claim's sources against the repo; the audit intent applies the pruning test to every line and ends with the context smaller or equal, never larger; entries that merely paraphrase readable code are deleted. When a claim's source disappears, the claim is fixed against the new reality or removed — never quietly re-pointed at a document that happens to still mention it.

## Versus the two replaced skills

`bmad-document-project` scanned a brownfield repo and generated a documentation tree — overview, source tree, per-area deep dives. It embodied the asset model, and the evidence went against it: the output was large, unverified, stale on arrival, and precisely the kind of context that degrades agents. Its valid instinct — *understand the repo before working in it* — survives as the ingest scan, which now feeds verification instead of prose generation. Where it would have described the repo's structure, the new skill lets agents derive structure fresh; where it would have summarized code, the new skill writes nothing.

`bmad-generate-project-context` had the right instinct — a single small rules file of unobvious, project-specific facts — and that instinct is now the whole architecture. What it lacked was everything around the file: no verification (its content was as trusted as its generation run was lucky), no trust marks, no staleness model, no maintenance loop, and no room for the *why* behind the rules. The kernel is its descendant, held to a measured budget; the bundle carries the rationale it had nowhere to put; ingest/audit keep both true over time. An existing `project-context.md` keeps loading and becomes a mining source on the next ingest.

The one-line version: the old skills wrote more documentation; this skill maintains less truth — and less, verified, wins.
