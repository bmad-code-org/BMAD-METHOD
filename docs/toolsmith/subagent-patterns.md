---
title: 'Subagent Patterns'
description: 'How a skill can spread its work across subagents to keep the main conversation small, run work in parallel, and get independent judgment.'
sidebar:
  order: 7
---

A subagent is a separate model instance a skill starts for one focused task, with its own clean context window, explicit instructions, and structured return value. Use subagents to keep the main conversation small, to run independent tasks in parallel, or to get judgment that earlier chat history has not biased.

Smithy uses subagents in both review and cut modes: review sends each lens to its own independent reader, and cut assigns each file its own writer paired with a separate checker.

## Keep the Parent from Reading First

The most common mistake in subagent skills is letting the parent read every file before spawning workers. Once the parent reads those files, the tokens are already spent and the main benefit of delegation disappears. Because models try to be helpful by reading ahead, state clearly what the parent does and does not touch:

| Tell the parent | Example wording |
| --- | --- |
| What to discover without reading | `"List the files in references/ to decide how many subagents to start. Do not read them."` |
| What each subagent returns | `"Return only findings about the topic, as JSON at the given path. Do not echo the source."` |
| Where its role ends | `"You orchestrate. Scripts and subagents do the analysis."` |

A pre-pass script helps here by giving the parent filenames, sizes, and structure so it can plan without reading file contents. Run the skill, watch what the parent actually reads in the transcript, and tighten the wording if it peeks ahead.

## Use Files as Shared State

Subagents share nothing except what you explicitly pass them, so use files on disk to hand work between stages. The parent tracks file paths and a plan rather than holding raw payloads in chat, while each subagent reads its assigned input files and writes its output to a known path in a strict format the parent can parse.

## Patterns

| Pattern | How it works | Use it when |
| --- | --- | --- |
| Delegated reading | Each subagent reads one source and returns a short summary so the parent works from summaries alone. | You have many documents to inspect (not worth the overhead for one or two small files). |
| Temp file assembly | Workers write results to temporary files and a separate subagent combines them. | Worker outputs are still too large to pass through chat, or assembly needs a fresh context. |
| Shared file pipeline | Each subagent reads a shared file and extends it in an order controlled by the parent. | Later stages build directly on earlier outputs. |
| Lead and workers | A lead subagent analyzes the task and writes a plan, and the parent launches workers from that plan. | The work cannot be partitioned until someone inspects the scope first. |
| Parallel perspectives | Subagents with competing personas evaluate the same material independently, and an evaluator merges the best points. | Independent viewpoints improve quality, such as design trade-offs or code reviews. |
| Generate and select | Several subagents attempt variations, an evaluator scores them, and the next round starts from the winners. | Outputs can be scored cleanly and multiple rounds are affordable. |

These patterns also compose well: a review workflow might use delegated reading to gather evidence, parallel perspectives to judge it, and temp file assembly to write the final report.

## Make Perspectives Independent

Parallel reviewers only earn their cost when they judge independently. Give each reviewer the source material and a clear lens or persona, never your own conclusion, because a reviewer handed an opinion tends to confirm it. Strong lenses include an architect, someone trying to break the design, a pragmatist hunting the smallest safe scope, and an advocate for the end user.

## Always Provide a Fallback

Skills run across AI tools and environments where subagents may be unavailable or disabled, so a skill that assumes subagents exist is fragile. Specify a clear fallback, typically running each role inline one at a time, and instruct the skill to tell the user when it fell back. Smithy uses that sequential fallback in both review and cut modes.

:::tip[Start small]
Begin with one parent and a single wave of subagents, adding extra stages only when a real run proves they are needed. Give parallel writers separate folders or git worktrees so they cannot overwrite each other's files.
:::
