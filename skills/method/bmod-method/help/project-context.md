# Project context and what belongs in AGENTS.md

Use this when a user asks which `bmad-project-context` intent to run, why its block is small and has no repo overview, or what to do when agents repeat a mistake.

## What it produces

A small, verified block of rules in `AGENTS.md` at the repo root, between the `<!-- bmad:context -->` and `<!-- /bmad:context -->` markers. The run is a conversation, and the user approves every write.

## Intents

| Intent | Recommend when |
|---|---|
| setup | No instruction file has meaningful content. |
| adopt | The user already wrote an `AGENTS.md` or `CLAUDE.md`. The user sees what happens to each instruction. |
| refresh | A block exists and the code changed a lot. It does not re-ask what was settled. |
| record | An agent just got something wrong. A recurring or costly mistake earns a line. |
| audit | The block feels stale or bloated. It ends smaller or equal. |

## What earns a line

- Policy the code cannot express: branch rules, frozen paths, generated files, security.
- What a config file cannot say about running the project: integration tests need a service up first.
- Conventions that differ from ecosystem defaults, including a command whose obvious form is wrong.
- Pitfalls someone has observed. A scan finding alone becomes a question to the user.
- Rules that must hold across components, required tool versions, and entry points.

## What stays out

Repo overviews, directory trees, stack lists, commands the obvious guess gets right, pasted code, history, and plans. For a style rule a linter, hook, or CI check can enforce, the skill proposes the check. Product intent belongs in a spec, and a contested design decision in `bmad-architecture`. To learn the code, recommend `bmad-walkthrough` (`help/existing-codebase.md`).

## Why the block is small

- Every line loads in every session, and agents follow instructions less well as the loaded set grows.
- Agents read code better than prose about code, and a stored copy goes stale.
- Instruction files that restate what the repo already shows cost tokens every session and do not make agents more successful.
- Agents often skip context they must choose to fetch, so rules that must hold stay in the block.

## Where it writes

- Only between the markers. Text outside them changes only with the user's approval.
- For a tool that reads another file, it proposes a one-line `@AGENTS.md` import.
- It never commits. The user reviews and commits the change.
- Personal preferences and rules shared by all of a user's projects belong in their global agent config.

## How a rule gets removed

A policy or pitfall goes only when the thing it guards is gone or the user retires it. No recent failures is not a reason. An instruction a human wrote is deleted only when it is stale or wrong, enforced by a hook or check, contradictory, or approved for deletion as its own item.

## An old project-context.md

The older `bmad-generate-project-context` and `bmad-document-project` skills were removed; this skill replaces both. It reads an existing `project-context.md`, offers to absorb its content, and does not delete the file without the user's agreement.
