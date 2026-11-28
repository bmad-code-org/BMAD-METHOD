---
title: 'The Theory of Project Context'
description: Why bmad-project-context captures so little, what belongs in a repository's agent instructions, and what is left out.
sidebar:
  order: 4
---

Long documentation written for AI coding agents often hurts more than it helps. `bmad-project-context` keeps your `AGENTS.md` block intentionally small, verified, and focused on rules that change agent behavior. For instructions on running the skill, see [Set and Maintain Project Context](./set-and-maintain-project-context.md).

## What Is Worth Writing Down

A rule belongs in `AGENTS.md` when the fact is expensive to rediscover on every session or only becomes obvious after an agent makes a mistake. The right question is not whether an agent could eventually derive a fact from the repository, but what happens when it fails to look in time.

Coding agents read live source code more accurately than prose summaries of that code. A written description of files, modules, or tech stacks begins drifting on the next commit and consumes tokens (the units of text an AI model reads and pays for on every request) on every session. By contrast, intent, policy, rejected approaches, and non-obvious runtime catches cannot be recovered reliably from source alone. Writing down only those high-value facts prevents repeated errors without bloating every conversation.

## Why Bloated Instruction Files Hurt

Repository instruction files frequently fail to improve results while increasing token usage and diluting attention across too many rules. Most bloated `AGENTS.md` files restate what the repository already contains: directory layouts, framework lists, and architecture tours.

When an instruction file grows long, two problems reinforce each other:

- Agents pay the context cost of reading every line on every session, even when most lines do not apply to the current task.
- As the always-loaded rule set grows, models follow individual instructions less reliably, so critical constraints get buried under generic background text.

Keeping the block tight makes the remaining rules far more likely to be followed.

## Why Always-Loaded Pointers Beat Optional Retrieval

Agents reliably follow short rules that are already loaded in their context, whereas they frequently skip external documentation or optional tools when they have to decide on their own whether to fetch them. Even when told a reference exists, an agent will often guess paths or behavior instead of stopping to look it up.

That behavior drives two rules in `bmad-project-context`:

- Anything an agent must follow on ordinary tasks belongs directly inside the `AGENTS.md` block.
- Any pointer to a separate file must state an observable trigger (such as a specific directory path, file type, or named task) rather than a vague judgment call like "when the task is complex" or "before your first edit".

## What Earns a Place

Every candidate line faces one test: would removing this line change what an agent does? On instructions written by a human maintainer, a weak answer opens a discussion rather than triggering an automatic deletion (see [A Working Rule Stays](#a-working-rule-stays)).

- Command caveats that config files do not reveal, such as which script is the real entry point when several look plausible, whether integration tests require a running service, or whether CI runs an extra typecheck.
- Policy the code cannot express, including frozen paths, generated files, branch and commit rules, and security or compliance requirements stated by the team.
- Conventions that differ from typical language or framework defaults, because an agent will follow common defaults unless told otherwise.
- Known pitfalls backed by observed failures, such as a recorded lesson, maintainer experience, recurring fixes in git history, or a mistake caught during the session; a surprising scan finding becomes a question to ask, never an unconfirmed rule.
- Cross-component rules and required tool or runtime versions that an agent cannot see from the single file it is editing.
- Clear prohibitions paired with the permitted alternative, because explicit "do not X; use Y instead" rules are easier for agents to apply consistently than general advice.

## What Is Left Out

| Not captured | Why |
| --- | --- |
| **What the code already says** | Agents read source code more accurately than paraphrases, and summaries drift while source stays current. |
| **Repo structure and file maps** | Layouts change with every commit, stored maps rot fastest, and agents inspect directories fresh in seconds. |
| **Overview and tour documents** | The block exists to change coding behavior, not to give a general introduction to the repository. |
| **Language and framework defaults** | Models already know standard Node, Python, or Go conventions, so restating them wastes space. |
| **Anything included for being interesting** | Curiosity is not evidence that an agent will make a mistake without the note. |
| **Style rules an agent should self-enforce** | Formatting and mechanical style belong in a formatter, linter, hook, or CI check; once a check lands, delete the prose line. |
| **History and edit narration** | Git records why old code was removed; the block states present truth only. |
| **Aspirational state** | Planned changes belong in tickets and specs, because an agent that mistakes future intent for current reality writes broken code. |

When the evidence supports ten lines, ten lines is the right deliverable.

## A Working Rule Stays

A policy or pitfall stays in the block until the thing it guards is gone, a tool enforces it mechanically, or a human maintainer explicitly retires it. An absence of recent failures is never grounds for deleting a rule, because a working rule erases the evidence that it is still needed.

The same safeguard protects every instruction a human wrote by hand. During adoption or audit, a handwritten line is removed only when it is stale or wrong, already enforced by a hook or CI check, harmful or contradictory, or approved for deletion as an explicit line item. Brevity alone or the fact that an answer exists somewhere in the codebase is never enough to delete a maintainer's rule.

## Two Kinds of Context, Two Artifacts

Implementation context and planning context have different lifecycles and belong in different places.

Implementation context (commands, conventions, frozen paths, and observed pitfalls) belongs to a code repository. It is verifiable against the code, can change on any commit, and loads on every coding session, which is why `bmad-project-context` keeps it small and concrete inside `AGENTS.md`.

Planning context (product rationale, rejected options, domain definitions, and long-term goals) belongs to an initiative or epic inside `_bmad-output/`. It traces to requirements and decisions, changes over weeks or months rather than commits, and is consulted during planning and spec work rather than loaded into every minor coding session.

## Extra Context Is a Cost

Adding lines to `AGENTS.md` is never free, because every line is read on every session and must stay accurate over time. That is why `bmad-project-context` treats maintenance as a first-class job: Refresh re-checks caveats and diffs deleted or renamed files since the last verified commit, while Audit verifies each line against the live repo and ends with a block that is the same size or smaller. Generating the first version is quick, and keeping it honest is where the lasting value comes from.
