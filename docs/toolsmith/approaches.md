---
title: 'Ways to Build a Skill'
description: 'The approaches Smithy offers: a conversation then a lean build, scaffold and guide, eval-driven, the iterative eval loop, and building a skill from session logs.'
sidebar:
  order: 3
---

An approach is the path Smithy takes from an idea to a finished skill. Every approach starts with the same discovery conversation and execution plan, and ends with the same review, validation, and hand-off unless noted below. Smithy proposes an approach in his execution plan: lean is the default, and you can request any of the others up front.

| Approach | What happens | Choose it when |
| --- | --- | --- |
| Lean | Smithy writes the smallest skill that does the job, tries it on one real input, and ships it. | You want a working skill quickly and will judge it by using it. |
| Scaffold and guide | Smithy lays out the folder and boilerplate files and leaves the writing to you. | You want to author the instructions yourself. |
| Eval-first | Smithy writes test cases first, then iterates on the skill until they pass. | The output is verifiable and you want automated proof. |
| Skill-creator loop | Smithy drafts, benchmarks with and without the skill, revises, and optimizes the trigger description. | You want iterative refinement backed by measured runs. |
| From session logs | Smithy mines your past chat logs for repeated requests and corrections, then proposes a skill. | You want to capture workflows you already do by hand. |

## Lean

Smithy writes the smallest skill that gets the job done and shows you the draft and trigger description first, while changes are still cheap. When you supply a real input, he runs the skill on it once and fixes anything the trial reveals. Because lean is the default, simply describe what you want:

```text
Build me a skill that writes release notes from the pull requests merged since the last tag.
```

You get a working, reviewed, and validated skill, with a trigger eval offered at hand-off. If you have no real input to test yet, Smithy notes clearly that the skill has not been run.

## Scaffold and Guide

Ask Smithy to `"scaffold a skill"` (or use code `SCAFFOLD`). He creates the folder, frontmatter, `bmod.toml`, and starter files with clearly marked placeholders showing where your domain instructions belong. Validation reports any remaining placeholder markers until you replace them with your own prose.

## Eval-First

Smithy writes evaluation cases from your real requests before drafting the skill, confirms the cases with you, and then iterates until the skill passes them. Choose eval-first when the output has clear right-or-wrong checks: file transforms, structured extraction, generated code, or fixed procedures. Open-ended writing and coaching are harder to grade automatically, so they usually fit the lean approach better.

```text
Build it eval-first. Here are three real requests it should handle.
```

You get the skill, its test cases saved under `evals/` at the repository root, and the passing benchmark report (or the remaining failing cases if you stop early).

## Skill-Creator Loop

This iterative refinement loop drafts the skill using BMad's shapes, benchmarks it against the bare model on real inputs, revises and re-measures until the output improves, and then tunes the description against held-out queries so it fires on the right requests. You review and approve the winning description before Smithy applies it. If you already have an `evals.json` file from an external skill-creation tool, `bmad-eval` can convert it into BMad's format.

## The Eval Loop

Both eval-first and the skill-creator loop follow the same cycle: run the skill and the bare model on identical inputs, grade the outputs and read the transcripts, change one thing, and re-run. The loop stops once every check passes across three runs or when you decide the skill is ready. If the skill cannot outperform the bare model, the underlying model has caught up and Smithy recommends retiring the skill rather than adding more prose.

![The eval loop](/diagrams/toolsmith-eval-loop.svg)

## From Session Logs

Smithy reads your past agent sessions and proposes skills for workflows you keep doing manually, using the corrections you gave in those chats as the core instructions. Ask him in plain English (or use code `LOGS`):

```text
Look at my sessions from the past few weeks and propose skills that would make my life easier.
```

Smithy ranks the candidate ideas strongest first, explaining what each skill would do and why the logs support it. Pick one and he builds it using the lean approach, or decline and he saves the shortlist to his reports folder. When your past corrections point to gaps in an existing skill rather than a brand-new job, he recommends editing that skill instead.

:::tip[Keep repeating yourself?]
You do not need archived logs to capture a workflow you repeat by hand. Tell Smithy `"turn this chat into a skill"` or `"I keep pasting this prompt"`, and he mines the current conversation first.
:::
