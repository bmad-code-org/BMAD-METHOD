---
title: "The Theory of Project Context"
description: Why bmad-project-context captures so little, what earns a place in a repository's agent instructions, and what is deliberately left out
sidebar:
  order: 11
---

`bmad-project-context` is built on an uncomfortable finding: most documentation written *for* AI agents makes them worse. This page explains the theory behind the skill — what it captures and why, and more importantly, what it deliberately refuses to capture. If you are coming from `bmad-document-project` or `bmad-generate-project-context`, the last section explains exactly what changed.

For what the skill *does* and how to run it, see [Project Context](project-context.md) and the [how-to guide](../how-to/project-context.md).

## The line: derivable or not

Written context earns its cost only when it carries something the agent cannot derive by reading the repository.

Two results from different literatures locate the same boundary. Separating code reasoning from documentation memorization across repository-level tasks, **code access delivers the dominant gains over documentation access** — a document describing how the system works loses to the source it describes. Running the inverse experiment — generating requirements *from* code — models prove unreliable at producing anything not already implemented. Current behavior is recoverable from source. **Intent, rationale, and what was deliberately rejected are not.**

So anything derivable is read live and never stored. A stored copy is a stale duplicate of something the agent reads more accurately first-hand, and it is charged on every single call.

## Why most AGENTS.md files measure as worthless

The repository instruction file is the most-studied artifact of 2026, and its record on task correctness is poor. Measured present versus absent: **no improvement in success rate, and +20% inference cost.** Replicated on real repositories, with failures traced to implementation skill gaps rather than missing repository knowledge. In one study at scale, **randomly generated rules matched expert-curated ones.**

That is a damning result until you notice what those files contain. They overwhelmingly restate what the repository already holds — structure, stack, architecture summaries. The studies measured *derivable* written context, not written context in general.

## Why a short index in the always-loaded file is the opposite result

One controlled comparison ran four configurations against framework APIs absent from the model's training data:

| Configuration | Pass rate |
|---|---|
| No documentation | 53% |
| Reusable skill, unaided | 53% |
| Same skill, with explicit instructions to invoke it | 79% |
| **Compressed documentation index in `AGENTS.md`** | **100%** |

Same file format as the null results above. Opposite content: knowledge the model did not have, rather than a restatement of the repo. The index was 8KB, compressed from 40KB with no loss in performance.

The other half of that result matters just as much. The unaided skill was **never invoked in 56% of cases**. Adding explicit instructions raised trigger rates above 95% and still capped at 79%, with outcomes swinging on subtle wording changes.

**Conditional retrieval is unreliable**, and separate measurements agree. In an ablation over a 709-page wiki, agents skipped the index entirely and inferred page paths from the question rather than fetching it.

The rule that reconciles all of it: **an index the agent must choose to fetch gets skipped; an index already in context does not.** Anything load-bearing goes in the always-loaded file. Pointers out of it must name a trigger the agent can *observe* — a path, a file type, a concrete task — never one it must judge or self-monitor.

## What earns a place

The test for every line is the **pruning test**: *would removing this line change agent behavior?*

- **What a config file cannot say about running the project.** The invocation itself lives in `package.json`, a `Makefile`, or CI config and is read from there. What does not live there is the correction: the root test script does nothing in this workspace, integration tests need a service up first, the suite is slow enough that you should iterate on single files, CI runs a check the test script does not.
- **Policy the code cannot express.** Frozen paths, generated files, branch rules, security and compliance requirements. Admitted by authority, not by discovery.
- **Conventions that differ from ecosystem defaults.** Only the divergences. An agent follows the norm unless told otherwise, so a fact nobody would get wrong by default is not worth a line.
- **Known pitfalls, from observed failure only.** A repository yields hundreds of trap-looking facts, and no property of the fact separates the few that cause real mistakes — that signal exists only in observed behavior. A surprising scan finding becomes a question, never a line.
- **Negative constraints over positive guidance**, which measured better, and which is why a prohibition here always names the permitted alternative.

## What is deliberately not captured

The negative space is the design.

| Not captured | Why |
|---|---|
| **What the code already says** | Agents read source better than summaries of source. A paraphrase adds a second copy that rots while the original stays true. |
| **Repo structure and file maps** | Structure changes with every commit — stored maps rot fastest of all, and agents derive structure fresh in seconds. |
| **Overview and tour documents** | The classic generated deliverable, and the measured harm. The block's job is to change behavior, not to orient a reader. |
| **Ecosystem defaults** | An LLM already knows how a typical Node, Python, or Go project works. Restating them spends budget teaching the agent what it arrived knowing. |
| **Anything included for being interesting** | Interest is not evidence of need. This is the failure mode the skill exists to avoid. |
| **Style rules an agent should self-enforce** | That job belongs to a formatter, linter, hook, or CI check. The skill proposes the check instead, and a check that lands deletes its line. |
| **History and edit narration** | "We removed X because…" is banned prose. Git owns history; the block states present truth only. |
| **Aspirational state** | What the system *should* become belongs in specs. An agent acting on aspiration ships fiction. |

The result is small by design. When the evidence supports ten lines, ten lines is the deliverable.

## Retirement runs the other way

There is one rule that inverts the pruning instinct, and getting it wrong quietly destroys the best content in the file.

**A policy or pitfall line retires only when the thing it guards is gone** — removed, or now mechanically enforced — **or when a human retires it.** Absence of recent failures is never grounds. A working rule erases its own evidence, and much of the value of the block is the failures that no longer happen.

## Two altitudes, two artifacts

One artifact cannot serve both coding and planning work. The material divides, and the halves barely overlap.

**Implementation context** — constraints, commands, conventions, pitfalls — is a property of a **code repository**. It is verifiable against the code, executably. It goes stale on every commit. It is loaded on every session, so it must be tiny. That is what this skill owns.

**Planning context** — rationale, rejected approaches, ownership, domain meaning, org standards — is a property of a **project or initiative**. It is traceable only to source documents. It goes stale on organizational time, in months rather than hours. It is consulted in bursts, not loaded continuously. That is a different capability, and it is coming separately.

Trying to serve both from one file is what produced the two skills this one replaced.

## Context is a liability to be re-earned

The old model treated documentation as an asset: more coverage, more value. This skill treats context as a **liability that must keep proving itself.** Refresh re-checks every caveat and diffs deletions and renames against every line. Audit applies the pruning test and ends with the block smaller or equal, never larger. When a claim's source disappears, the claim is fixed against the new reality or removed — never quietly re-pointed at a document that happens to still mention it.

Generating the first version is the cheap part. Keeping it true is where the value is, and it is why refresh and audit exist as first-class intents rather than a note in the documentation.

## Versus the two replaced skills

`bmad-document-project` scanned a brownfield repo and generated a documentation tree — overview, source tree, per-area deep dives. It embodied the asset model, and the evidence went against it: large, unverified, stale on arrival, and precisely the kind of context that degrades agents. Its valid instinct — *understand the repo before working in it* — survives as the discovery pass, which now feeds verification instead of prose generation.

`bmad-generate-project-context` had the right instinct: a single small rules file of unobvious, project-specific facts. That instinct is now the whole architecture. What it lacked was everything around the file — no verification, no maintenance loop, and no way to tell an inference from a confirmed fact.

The one-line version: the old skills wrote more documentation; this skill maintains less truth, and less, verified, wins.
