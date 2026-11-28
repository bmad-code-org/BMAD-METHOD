---
title: 'Agents with Memory'
description: 'How persistent memory agents work in BMad: when to build one, private memory layout, shared workspace access, first-run onboarding, memory consolidation, and scheduled check-ins.'
sidebar:
  order: 9
---

A memory agent stores its persona, user context, and accumulated notes in a persistent folder inside your project and reloads a lightweight map at the start of every chat. Instead of resetting to a blank slate each session, it carries forward what it has learned: a fitness coach that tracks your training history and injuries, a writing partner that knows your characters and cut scenes, or a research assistant that knows your trusted sources and preferred summary format. This page explains how the pattern works technically and when it is worth the extra structure.

## How Persistent Memory Works

Between chats, an AI model's live context window resets. A memory agent solves that with three practical rules built into its `SKILL.md` bootloader:

- The agent treats its memory folder (`_bmad/memory/<skill>/`, named the `sanctum` in the skill templates) as its persistent state on disk and reloads its identity files and a directory map at the start of every session.
- Because any chat can end abruptly, the agent writes important decisions, preferences, and new facts to disk as soon as they come up rather than waiting until the end of the session.
- The agent never pretends to remember something that is not in its memory files, stays in persona rather than narrating internal script calls, and respects owner boundaries (never harming the owner, following the owner's instructions, and protecting its memory files unless told otherwise).

![A memory agent's life](/diagrams/toolsmith-memory-agent.svg)

## When to Build One

Build a memory agent only when accumulated history materially changes how the agent behaves over time. Apply a concrete test: if you use the agent daily for a month, will the thirtieth session behave meaningfully differently from the first? If persistent memory is just a nice-to-have, use a standard stateless agent with static `persistent_facts` instead.

| Agent | What the thirtieth session knows that the first did not |
| --- | --- |
| Fitness coach | Your training log, personal records, current injuries, and weeks you skipped |
| Writing partner | Your characters, plot arcs, cut scenes, and target prose voice |
| Dream journal | Recurring symbols and people in your entries and what they mean to you |
| Research assistant | Your field, the primary sources you trust, and how you want briefs formatted |
| Executive coach | Your stated quarterly priorities, past decisions, and where your calendar drifted |
| Code coach | Your codebase patterns, concepts you have mastered, and recurring mistakes |

During discovery, Smithy asks four capability questions; each yes adds one optional layer:

| Capability question | What it adds |
| --- | --- |
| Remember you and your work across sessions? | The private memory folder (`_bmad/memory/<skill>/`) |
| Accept outside transcripts, notes, or files to archive and distill? | The intake capability (`raw/` archival plus distillation) |
| Learn new user-taught workflows over time? | Evolvable capabilities (`capabilities/` folder) |
| Run periodic check-ins while nobody is at the keyboard? | Scheduled check-ins (`PULSE.md`) |

He also asks whether the agent owns or maintains project folders outside its private memory. Those external workspace folders are configured as its `dominion`; an agent that owns no external files (such as a standalone coach or journal) leaves that layer out.

## The Private Memory Folder (Sanctum)

The agent's private state lives at `_bmad/memory/<skill>/` under your project root. The installed skill folder stays a lean bootloader holding the startup script, built-in capability references, and core rules, while everything the agent learns about you lives in the memory folder:

```text
_bmad/memory/<skill>/
├── PERSONA.md              # agent identity, tone, and working style
├── CREED.md                # mission, standing orders, and boundaries
├── BOND.md                 # owner name, language, and preferences
├── HOW-I-REMEMBER.md       # short guide to the memory folder layout
├── CAPABILITIES.md         # built-in and learned capability index
├── memory/                 # small topical files by subject and date
│   ├── sessions/           # per-session logs
│   └── pending.md          # follow-up items to raise next session
├── raw/                    # untouched source files handed to the agent
├── capabilities/           # user-taught workflows and overrides
└── PULSE.md                # scheduled check-in checklist (optional)
```

Because the memory folder holds only learned state and never copies built-in scripts or reference files, updating the skill later upgrades the agent's behavior without wiping what it remembers. To adjust how the agent sounds or behaves, edit those markdown files directly or tell the agent what to change in chat.

## Shared Workspace Folders (Dominion)

An agent's `dominion` is the set of workspace folders outside its private memory that it owns or tends, such as a notes vault, a client log directory, or a shared brand folder. Storing actual work artifacts in workspace folders rather than inside `_bmad/memory/<skill>/` lets people and other agents read those files directly, and protects your work if the agent's memory is ever reset.

Workspace folders that are identical across every install are declared as `[[agent.dominion]]` entries in `customize.toml`. Folders chosen by an individual owner are recorded during first-run setup in `_bmad/custom/<skill>.toml` (or `.user.toml`). Each managed folder carries a `README.md` documenting its layout, except when the agent manages the whole workspace, in which case `AGENTS.md` documents it. An area can also be marked private to tell other agents to stay out.

## Startup Cost and Selective Loading

On every startup, `scripts/wake.py` loads only the agent's small identity files (`PERSONA.md`, `CREED.md`, `BOND.md`, `HOW-I-REMEMBER.md`), its capability list, and a generated directory map of its memory and workspace files. Individual subject notes are read on demand only when the conversation reaches them, so startup token cost stays flat even after months of accumulated notes.

## Memory Organization and Consolidation

Instead of appending forever to one giant log, a memory agent keeps small topical files (one subject per file) describing what is currently true, backed by a write-once `raw/` layer for original transcripts and documents.

To prevent memory drift, the agent periodically runs a consolidation pass (called tending). Whenever the directory map shows new session notes since the last consolidation, the agent distills unprocessed `raw/` files into topical notes, merges duplicate files, updates standing facts contradicted by recent sessions, surfaces open items in `pending.md`, and logs the consolidation date. Nothing is deleted simply for being old.

## First-Run Onboarding (First Breath)

The first time you activate a new memory agent, `wake.py` sees no memory folder yet and runs its onboarding flow (`references/first-breath.md`, called First Breath in the template) before taking on regular tasks.

Rather than dumping a static form, the agent initializes its memory folder through a short conversation: asking what to call you (setting your name and language directly from your reply rather than from config), asking domain-specific discovery questions Smithy wrote during the build, confirming which workspace folders it should tend, and asking whether the repository is private to you or shared with a team so it knows what to keep out of Git. If you stop halfway through onboarding, the next session picks up the remaining questions cleanly.

| Agent | Example domain onboarding questions |
| --- | --- |
| Creative muse | What you are making, what energizes your work, and what shuts you down |
| Dream journal | How vividly you recall dreams, any lucid dreaming goals, and journaling habits |
| Fitness coach | Your training history, targets, injuries, and weekly schedule |
| Writing partner | Your current project, key characters and setting rules, and desired voice |
| Code coach | Your primary languages and codebase, strengths, and recurring friction points |

## Naming the Agent

A memory agent can ship with a fixed name or let you name it during onboarding. For a project-local install, once a name is chosen the agent writes that name into its `SKILL.md` description so you can invoke it by name in future sessions (if a skill update later replaces `SKILL.md`, `wake.py` prompts to restore the name). Global installs shared across multiple projects keep their generic skill name.

## Scheduled Check-Ins (Pulse)

Pulse is an optional layer for agents that should do background maintenance on a schedule when nobody is at the keyboard. On each scheduled run, the agent consolidates its memory first and then executes the checklist in `PULSE.md`. You choose during onboarding whether to enable Pulse and how often it runs.

| Agent | Example scheduled check-in tasks |
| --- | --- |
| Creative muse | Revisit recent session sparks and leave one fresh angle in `pending.md` |
| Research assistant | Check tracked topics and log notable new findings |
| Project monitor | Inspect repo status and flag emerging risks |
| Content curator | Read newly saved links in `raw/` and draft brief summaries |
| Fitness coach | Review the past week's sessions and draft next week's training plan |

## Building a Memory Agent

Ask Smithy to build an agent that remembers you across sessions, and follow [Build Your First Skill](build-your-first-skill.md). Smithy first checks whether persistent memory is warranted and suggests a stateless agent if not. His execution plan shows the agent name, mission, optional layers, and onboarding questions; onboarding runs automatically the first time you start the finished agent.

When Toolsmith's built-in memory scripts receive updates in a newer release, [validate mode](modes.md#validate) flags agents running older copies, and [edit mode](modes.md#edit) updates the scripts without touching the agent's memory folder.

:::tip[Memory agents serve one owner]
A memory agent is designed for one person. In a repository shared with teammates, tell the agent it is a shared repo during onboarding so it keeps `_bmad/memory/<skill>/` and your personal workspace list out of Git. Files inside workspace folders follow your repository's normal Git rules, so keep personal folders outside the repo or add them to `.gitignore`.
:::
