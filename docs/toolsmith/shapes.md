---
title: 'Shapes of a Skill'
description: 'The shapes Smithy builds: a plain skill, an agent with capabilities, a memory agent, a script-backed utility, a document template, and advanced rendered skills.'
sidebar:
  order: 4
---

A shape is how a skill is structured on disk. Smithy chooses the shape during discovery from your goal, user, and output, and explains his choice in one line of the execution plan. You do not need to choose a shape ahead of time; if you name one up front, he weighs it and tells you if the requirements point somewhere simpler.

| Shape | What you get | Your need lands here when |
| --- | --- | --- |
| Plain skill | A `SKILL.md` with optional reference files loaded only when needed | You want an agent to do one job well on request |
| Agent with capabilities | A named persona with a greeting and menu of internal or external capabilities | You want a partner across multiple turns who owns several related jobs |
| Memory agent | An agent with a persistent memory folder that carries context across sessions | The agent needs accumulated history over weeks, shaped per owner |
| Script-backed utility | A thin `SKILL.md` wrapping tested Python scripts | Most of the work has one deterministic right answer |
| Document template | A template run by `bmad-facilitate`, standalone or carried by an agent | A person talks through a topic and produces a structured document |
| Rendered skill or agent *(advanced)* | Template-compiled workflow files rendered from team config before each run | A maintainer explicitly needs render-time block replacement inside steps |

Registration with BMad is a separate choice: any shape can register as a single-skill module, join a multi-skill module, or remain a plain unregistered skill. See [Modules and Registration](modules.md).

## Plain Skill

Most needs land here, including multi-step workflows. A plain skill can hold:

| File | Holds |
| --- | --- |
| `SKILL.md` | Frontmatter with `name` and `description`, followed by instructions |
| `references/<topic>.md` | Branch-specific instructions loaded only when that path runs |
| `scripts/<name>.py` | Deterministic work with one right answer per input, paired with tests |
| `assets/` | Starter templates and static files the skill emits |
| `customize.toml` | Settings teams can override without forking, added only when shared |
| `bmod.toml` | Module registration metadata for BMad |

Only `SKILL.md` is required. A small job stays one file, and a complex workflow stays a plain skill as long as each branch sits in its own reference file so a single run loads only what it needs.

## Agent with Capabilities

An agent is a skill named `<prefix>-agent-<name>` with a persona and a menu of capabilities. Choose an agent when a user will collaborate across multiple turns on several related jobs. Choose a plain skill when the job produces one output and needs no ongoing persona.

The persona guides how the agent responds in open conversation when no specific capability runs.

### Internal and External Capabilities

An agent's capabilities can live inside the agent folder or call separate installed skills. Only the active capability loads on a given turn, so one agent can cover a wide role cleanly.

| | Internal capability | External skill |
| --- | --- | --- |
| Lives in | The agent's own folder | Its own skill folder |
| Used by | This agent only | Any agent or skill that invokes it |
| Fits when | The job is tied closely to this agent's persona | The job stands alone, users run it directly, or several agents share it |

Most agents mix both. When a capability grows large enough to stand on its own, promote it into a separate skill. If you are unsure whether you need an agent at all, build a plain skill first; you can wrap it behind an agent later without rewriting the skill.

## Memory Agent

A memory agent stores its persona and topical memory files in a project folder and reloads them selectively each session. Build one only when the agent must accumulate knowledge across weeks of use (the test: would session thirty behave meaningfully differently from session one?). See [Agents with Memory](agents-with-memory.md).

## Script-Backed Utility

A thin `SKILL.md` states the outcome and when to run each script, while tested scripts handle the deterministic work: transforming files, counting, checking structure, or generating outputs from fixed rules. Prose stays focused on judgment and what to do with the script's results. See [Use Scripts for Work with One Right Answer](write-a-good-skill.md#use-scripts-for-work-with-one-right-answer).

## Document Template

When a user talks through a topic and ends with a structured document (such as an appraisal report, architecture decision record, or patient intake), Smithy builds a document template for `bmad-facilitate` rather than coding a hand-rolled interview workflow. That gives you guided questioning, review, cross-session resume, and team customization automatically. Smithy proposes the smallest fit: a standalone template, an agent carrying a set of templates when domain persona matters across documents, or a custom skill only when template coaching cannot do the job. See [Write a Document Template](../customize/write-a-document-template.md).

## Rendered Skills and Agents (Advanced)

For complex shared workflows maintained by a module author (such as `bmad-build` or `bmad-agent-po`), a rendered skill or rendered agent keeps its instructions as Jinja templates compiled against the team's resolved configuration before each run. That lets teams select fixed routes or swap entire instruction blocks at declared extension points without forking. A standard plain skill or agent with `customize.toml` achieves nearly the same flexibility with far less machinery, so Smithy only builds the rendered shape when you specifically ask for it, and memory agents are never rendered.

## Changing Shape Later

A skill can change shape through [edit mode](modes.md#edit) as its scope grows. Adding a menu to a plain skill or adding persistent memory to an agent counts as a shape change, so Smithy confirms it with you before modifying the structure.
