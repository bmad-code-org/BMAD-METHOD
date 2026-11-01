---
title: 'Subagent Patterns'
description: 'How a skill can spread its work across subagents to keep the main conversation small, run work in parallel, and get independent judgment.'
sidebar:
  order: 7
---

A subagent is a separate model instance a skill starts for one task. It gets its own context, takes instructions, and returns a result. Use subagents to keep the main conversation small, to run work in parallel, or to get judgment that the rest of the session has not influenced.

Smithy uses them this way: review sends each lens to its own reader, and cut gives each file its own writer and a separate checker.

## Keep the Parent from Reading First

This is the most common failure. If the parent reads every file before starting subagents, the tokens are already spent, and the main reason for the pattern is gone. It happens easily, because a helpful parent reads ahead.

Say in the skill what the parent does and does not do:

| Tell the parent | Example wording |
| --- | --- |
| What to discover, not read | "List the files in `references/` to decide how many subagents to start. Do not read them." |
| What each subagent returns | "Return only findings about the topic, as JSON at the given path. Do not echo the source." |
| Where its role ends | "You orchestrate. Scripts and subagents do the analysis." |

A pre-pass script helps here. It gives the parent file names, sizes, and structure, so it can plan without reading anything. Run the skill and watch what the parent does, then tighten the wording if it reads ahead.

## Use Files as Shared State

Subagents share nothing but what you give them, so use files to pass work between them. The parent holds file paths and a plan, not the data. Each subagent reads the files it was given and writes a result to a known path, in a strict format the parent can parse.

## Patterns

| Pattern | How it works | Use it when |
| --- | --- | --- |
| Delegated reading | Subagents each read a source and return a short summary. The parent works from the summaries. | There are many documents to read. It is not worth it for one or two files. |
| Temp file assembly | Workers write results to temp files, and a separate subagent combines them. | Summaries are still too large to return, or assembly needs a fresh context. |
| Shared file pipeline | Each subagent reads a shared file and adds to it, in an order the parent controls. | Later work depends on earlier work. |
| Lead and workers | A lead subagent analyzes the task and writes a plan, and the parent starts workers from it. | The work cannot be divided until someone has analyzed it. |
| Parallel perspectives | Subagents with different personas work alone, and an evaluator merges the best of each. | Different perspectives improve quality, as in design decisions and reviews. |
| Generate and select | Many agents try variations, an evaluator scores them, and the next round starts from the winners. | You can score results, and many rounds are affordable. |

Patterns combine. A review might use delegated reading to gather facts, parallel perspectives to judge them, and temp file assembly for the report.

## Make Perspectives Independent

Parallel reviewers only help if they judge independently. Give each one the material and a strong persona or lens, not your conclusion. A reviewer handed your opinion tends to confirm it. Useful perspectives include an architect, someone trying to break the work, a pragmatist asking what the minimum is, and an advocate for the end user.

## Always Provide a Fallback

Skills run on tools and models that may not offer subagents. A skill that fails without them is fragile. Say what happens instead, usually running each role inline one at a time, and have the skill tell the user it did so. Smithy works this way in both review and cut.

:::tip[Start small]
Start with one parent and a first wave of subagents, and add structure only when a run shows the need. Use separate folders or worktrees when parallel agents write files, so they cannot overwrite each other.
:::
