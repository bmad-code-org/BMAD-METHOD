---
title: 'The Theory of Project Context'
description: Why bmad-project-context captures so little, what belongs in a repository's agent instructions, and what is left out.
sidebar:
  order: 4
---

Most documentation written for AI agents makes them worse.
`bmad-project-context` captures little on purpose. This page is the evidence
and the rules. For how to run the skill, see
[Set and Maintain Project Context](./set-and-maintain-project-context.md).

## What is worth writing down

A line belongs when the fact is expensive to get from the repository — not
whether an agent *could* derive it, but what it costs every time one doesn't,
and whether the fact shows up before the mistake or after it.

Two results show where that line is. On repository-level tasks, **code access
beats documentation access** — a document describing the system loses to the
source it describes. When models generate requirements *from* code, they are
unreliable at producing anything not already implemented. Implementation
behavior is recoverable from source; **intent, rationale, and what was
deliberately rejected are not.**

So what the agent can read cheaply first-hand is read live and never stored.
A stored copy goes stale and costs tokens on every call. A line that stops
the same costly rediscovery every session stays, even if the agent could
eventually find it.

## Why most AGENTS.md files do not help

Measured present versus absent, repository instruction files show **no
improvement in success rate and +20% inference cost.** The result has been
replicated on real repositories, with failures traced to implementation skill
gaps rather than missing repository knowledge. In one study at scale, randomly
generated rules matched expert-curated ones.

Those files overwhelmingly restate what the repository already holds —
structure, stack, architecture summaries. The studies measured *derivable*
written context, not written context in general.

## When a short index in AGENTS.md does help

One controlled comparison ran four configurations against framework APIs
absent from the model's training data:

| Configuration | Pass rate |
|---|---|
| No documentation | 53% |
| Reusable skill, unaided | 53% |
| Same skill, with explicit instructions to invoke it | 79% |
| **Compressed documentation index in `AGENTS.md`** | **100%** |

Same file format as the studies that found no improvement; opposite content —
knowledge the model did not have, rather than a restatement of the repo. The
index was 8KB, compressed from 40KB with no loss in performance.

The other half matters as much. The unaided skill was **never invoked in 56%
of cases**; telling the agent to use it raised that above 95% and still
capped at 79%, with outcomes swinging on small wording changes. **Agents
often skip retrieval they have to choose.** In a test over a 709-page wiki,
agents skipped the index and guessed page paths from the question instead.

An index the agent must choose to fetch gets skipped; an index already in
context does not. Anything the agent must follow goes in `AGENTS.md`. Pointers
out of it must name a trigger the agent can *observe* — a path, a file type, a
concrete task — never one it must judge.

## What earns a place

The test for every line: *would removing this line change agent behavior?* On
a line a human wrote, a failed test opens a question rather than settling one
— see [A working rule stays](#a-working-rule-stays).

- **What a config file cannot say about running the project.** An invocation
  the obvious guess gets right lives in `package.json` or CI config. What does
  not live there is which command is right when several look plausible, and
  the correction: integration tests need a service up first, CI runs a check
  the test script does not.
- **Policy the code cannot express.** Frozen paths, generated files, branch
  rules, security and compliance requirements. These come from people, not
  from a scan.
- **Conventions that differ from ecosystem defaults.** Only the divergences.
  A fact nobody would get wrong by default is not worth a line.
- **Known pitfalls, from observed failure only.** A repository yields hundreds
  of trap-looking facts; only observed behavior separates the few that cause
  real mistakes. A surprising scan finding becomes a question, never a line.
- **Cross-component rules and required versions.** The few rules that must
  hold across parts of the system an agent cannot see from the file it is
  editing, plus the tool versions the project actually builds with.
- **Negative constraints over positive guidance**, which measured better, and
  which is why a prohibition here always names the permitted alternative.

## What is left out

| Not captured | Why |
|---|---|
| **What the code already says** | Agents read source better than summaries of source. A paraphrase adds a second copy that goes stale while the original stays true. |
| **Repo structure and file maps** | Structure changes with every commit — stored maps rot fastest of all, and agents derive structure fresh in seconds. |
| **Overview and tour documents** | These are the documents that were measured to hurt. The block's job is to change behavior, not to give a tour. |
| **Ecosystem defaults** | An LLM already knows how a typical Node, Python, or Go project works. Restating them spends budget teaching the agent what it arrived knowing. |
| **Anything included for being interesting** | Interest is not evidence of need. |
| **Style rules an agent should self-enforce** | That job belongs to a formatter, linter, hook, or CI check. The skill proposes the check instead, and a check that lands deletes its line. |
| **History and edit narration** | Do not write "We removed X because…". Git holds history; the block states present truth only. |
| **Aspirational state** | What the system *should* become belongs in specs. An agent that treats a future state as current will write the wrong code. |

When the evidence supports ten lines, ten lines is the deliverable.

## A working rule stays

**A policy or pitfall is removed only when what it is about is gone** —
deleted, or now enforced by a tool — **or when a human removes it.** Absence
of recent failures is never grounds: a working rule erases the evidence that
it is still needed.

The same protection covers every instruction a human wrote. It goes only when
it is stale or wrong, already enforced by a hook or a check, harmful or
contradictory, or you approve the deletion as a line item — never because it
looks derivable, and never because it is discoverable somewhere in the
repository.

## Two kinds of context, two artifacts

One artifact cannot serve both coding and planning work.

**Implementation context** — constraints, commands, conventions, pitfalls —
belongs to a **code repository**: checkable against the code, stale on every
commit, loaded on every session, so it must be tiny. That is what this skill
owns.

**Planning context** — rationale, rejected approaches, ownership, domain
meaning, org standards — belongs to a **project or initiative**: traceable
only to source documents, stale in months rather than hours, consulted in
bursts rather than loaded continuously. That is a different capability, and it
is coming separately.

Serving both from one file is what produced the two skills this one replaced.

## Extra context is a cost

More documentation is not more value. Extra context is a cost. Refresh
re-checks every caveat and diffs deletions and renames against every line.
Audit asks whether each line still changes agent behavior — subject to the
grounds above on anything a human wrote — and ends with the block smaller or
equal, never larger. When a claim's source disappears, the claim is fixed or
removed, never silently pointed at a different document that still mentions
it.

Generating the first version is cheap. Keeping it true is the work, which is
why refresh and audit exist as their own commands.

## Versus the two replaced skills

`bmad-document-project` scanned an existing repo and generated a documentation
tree — overview, source tree, per-area deep dives. Large, unverified, stale on
arrival: the kind of context that makes agents worse. Its valid instinct —
understand the repo before working in it — survives as the discovery pass,
which now feeds verification instead of prose.

`bmad-generate-project-context` had the right instinct: a single small rules
file of unobvious, project-specific facts. What it lacked was everything
around the file — no verification, no maintenance loop, no way to tell an
inference from a confirmed fact.

The old skills wrote more documentation. This skill keeps less, and checks it.
