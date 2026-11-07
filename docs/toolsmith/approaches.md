---
title: 'Ways to Build a Skill'
description: 'The approaches Smithy offers: a conversation then a lean build, scaffold and guide, eval-driven, the skill-creator loop, and a skill from session logs.'
sidebar:
  order: 3
---

An approach is the path from an idea to a skill. Every approach starts with the same discovery conversation and execution plan, and ends with the same review, validation, and hand-off, unless noted below. Smithy proposes one in the execution plan. Lean is the default, and you can name another at any time.

| Approach | What happens | Choose it when |
| --- | --- | --- |
| Lean | Smithy writes the smallest skill that does the job, tries it on one real input, and ships it. | You want the skill and will judge it by using it. |
| Scaffold and guide | Smithy lays out the files and leaves the writing to you. | You want to write the skill yourself. |
| Eval-first | Smithy writes the cases first, then builds until they pass. | The output can be checked and you want proof. |
| Skill-creator loop | Smithy drafts, measures with and without the skill, changes it, and tunes the description. | You want to iterate on measured results. |
| From session logs | Smithy finds what you keep asking for in your logs and proposes a skill. | You want to capture work you already do. |

## Lean

Smithy scaffolds the skill and writes `SKILL.md`, then shows you the draft and description before writing anything else. A change to what the skill must do is cheap at this point.

When you have a real input, Smithy runs the skill on it once through a subagent that sees only the skill and the input, and reads the trace. Several attempts before one worked means no default was named. An instruction followed where it did not apply needs a narrower condition. A helper rewritten by hand should become a script. A line the run never needed gets cut. Smithy fixes what the trace shows once, then moves to review.

With no real input, Smithy applies its writing standard line by line and tells you the skill has not run.

## Scaffold and Guide

Use menu code `SCAFFOLD`, or say "scaffold a skill". Smithy creates the folder, the frontmatter, the `bmod.toml`, and the starting files, with placeholders left visible. It then tells you where the know-how goes and what each folder is for.

The ship step only validates here, because Smithy did not write the content. The checks fail until you replace every `[TODO:` marker.

## Eval-First

Smithy writes `evals/cases.json` before the skill exists, from your real requests, and confirms the cases with you. Each rubric entry is a pass or fail condition, never a quality word. Smithy then writes the smallest skill aimed at the cases, not at the rubric's wording, because a skill that quotes its grader passes the test and fails the user.

The loop below runs until a stop condition is met, and Smithy tells you which run folder holds the passing run.

Use this approach when the output can be checked objectively: file transforms, extraction, generated code, fixed steps. Writing style and coaching cannot be graded well, so those skills do better with lean and a trigger eval.

## Skill-Creator Loop

This is the loop from Anthropic's skill-creator, using BMad's shapes and eval runner. Smithy writes a draft with a deliberately specific description, because widening a description is easier than narrowing it. It writes two or three prompts with empty rubrics, then runs the loop. After that, `bmad-eval` tunes the description, and Smithy asks whether a team needs to change a rule or step without forking.

If you have a skill-creator `evals.json`, `bmad-eval` can convert it.

## The Eval Loop

Eval-first and the skill-creator loop share one loop. Each round does the following:

1. Run the skill and the bare model on the same inputs.
2. Write the rubric from the first outputs, one binary check per failure seen. Drop a check that passes in both arms, because it tests nothing the skill adds.
3. Grade three runs per case and read the difference between the arms.
4. Read the transcripts as well as the grades.
5. Change one thing, and cut any line whose removal did not change results.
6. Rerun against the prior version to see whether the change moved the score.

The loop stops when every check passes on three runs, or when you say it is good enough. If two rounds move nothing, the cases are the problem. If the skill stays behind the bare model, the model has caught up, and Smithy proposes retiring the skill.

## From Session Logs

Use menu code `LOGS`, or say "make a skill from my sessions". This approach starts before discovery.

Smithy offers to read the logs of the agent you are talking to, your memlogs, or files you name. It confirms the location with you, or asks if it cannot find it, and waits for a yes before reading.

It then proposes at most three candidates. Each is a repeated request with its counts: how often you asked, in which words, which tools ran in which order, and your corrections word for word. Your corrections are the know-how a skill encodes. A request you never corrected is probably one the model already does well.

When your corrections show an installed skill falling short, and that skill has a `customize.toml`, the candidate is a customization of it, not a new skill. It goes to `bmad-customize`. For a new skill, you pick one candidate and discovery asks only what the logs cannot say. The build then runs the lean way.

:::tip[Keep repeating yourself?]
You do not need logs to capture something you do by hand. Say "turn this chat into a skill" or "I keep pasting this prompt", and Smithy mines the conversation first.
:::
