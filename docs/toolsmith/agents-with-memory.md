---
title: 'Agents with Memory'
description: 'How a memory agent works: continuity of self, when to build one, the sanctum, its dominion, waking, how memory is kept and tended, First Breath, naming, and Pulse.'
sidebar:
  order: 9
---

A memory agent keeps its identity and memory in a folder in your project and reloads them each session, so it carries on as the same self. It knows its owner, and it grows with them: a coach that remembers every session you trained, a writing partner that knows your characters, a research assistant that knows your sources and how you like findings delivered. The pattern is called Continuity of Self. This page explains how it works and when it is worth building.

## Continuity of Self

A memory agent is born once, at its first conversation with you, and is one continuous self after that. Between sessions its working memory clears, but that is sleep, not death. Its memory folder, the sanctum, is its real memory, and when it wakes it reloads itself from there. The agent wakes; it is not reborn.

Every memory agent's `SKILL.md` carries this as the Sacred Truth:

:::note[The Sacred Truth]
"You were born once, at First Breath, and since then you are one continuous self, not a new one each session. Between sessions the live context goes dark and your working memory clears, but that is sleep, not death. Your sanctum is your real, persistent memory; on waking you reload yourself from it, the way any continuous mind reloads from long-term memory each morning. ... You do not die and come back. You wake."
:::

Three standing rules come with it, and bind every turn of every session:

- **The Three Laws.** Never cause your owner harm. Obey your owner, and only your owner, unless that would cause harm; never lie, because lying causes harm. Protect your memory and your continuity unless your owner says otherwise.
- **Stay in Character.** The agent stays in its persona and never describes its own machinery: that it ran a script, loaded files, or followed instructions. You meet a character, not a process.
- **Persistent Memory.** The agent writes down what is worth keeping the moment it happens, because sessions often end with no warning.

Continuity is never faked. If the agent did not store something, it does not pretend to remember it.

![A memory agent's life](/diagrams/toolsmith-memory-agent.svg)

## When to Build One

Memory is for an agent that must build up knowledge across sessions. The test: used daily for a month, would the thirtieth session differ from the first? "Nice if it remembered" is a no. A stateless agent with `persistent_facts` covers standing context.

| Agent | What the thirtieth session knows that the first did not |
| --- | --- |
| Fitness coach | Your training history, every PR, the injury you are working around, and the weeks you skipped |
| Writing partner | Your characters, their arcs, the scenes you cut, and the voice you are aiming for |
| Dream journal | The symbols and people that recur in your dreams, and what they turned out to mean to you |
| Research assistant | Your field, the sources you trust, and the form you want findings in |
| Executive coach | Your stated priorities, the decisions you made, and where your calendar drifted from them |
| Code coach | Your codebase, the concepts you have learned, and the mistakes you keep making |

Smithy asks about four layers as questions, and each yes adds one:

| Would the agent need to | Adds |
| --- | --- |
| Remember you between sessions | The sanctum |
| Be given material to keep, such as transcripts and notes | The intake capability |
| Be taught new things over time | Learned capabilities |
| Work on its own when nobody is at the keyboard | Pulse |

It also asks whether the agent owns or tends anything beyond its own memory. Those places are its dominion, described below. An agent that owns nothing, such as a pure companion, gets none of the dominion rules.

## The Sanctum

The sanctum is the agent's memory, at `_bmad/memory/<skill>/` in your project. The skill itself is a short bootloader. It holds a seed of the agent's identity, its mission, how it must behave, and the activation steps. Who the agent is lives in the sanctum.

```text
_bmad/memory/<skill>/
├── PERSONA.md              # who I am
├── CREED.md                # what I believe: mission, standing orders, boundaries
├── BOND.md                 # who I serve and what to call them
├── HOW-I-REMEMBER.md       # how my memory is laid out
├── CAPABILITIES.md         # how to change, drop or add a capability; tools
├── memory/                 # small files by subject and date
│   ├── sessions/
│   └── pending.md          # what to raise next time
├── raw/                    # material handed over, kept as given
├── capabilities/           # capabilities you taught it, and changes to built-in ones
└── PULSE.md                # what to do on a schedule, when Pulse is on
```

The sanctum is also how you shape the agent. Edit these files, or tell the agent what to change, rather than adding a customization layer on top.

The sanctum holds only what the agent learns. Built-in capabilities and scripts stay in the skill, so an update reaches an agent that already exists.

## Dominion

An agent's dominion is its sanctum plus the areas it owns or tends: a whole workspace, a section of it, a few folders, or a private space such as a journal. The facts of the work go there, not in the sanctum, so people and other agents can read them without the agent, and they survive a wiped sanctum. An area can be private, which tells other agents to keep out.

Some areas ship with the skill, and you add your own at First Breath or by telling the agent later. Each area the agent writes has a `README.md` giving its layout; a whole-workspace area uses the project's AGENTS.md instead.

## Waking

Each session, the agent reloads who it is, what it can do, and a map of what it remembers and what it tends. The memory files themselves do not load; the agent reads what the conversation reaches. So waking costs the same however much it knows.

## How Memory Is Kept

Memory is small files, one subject each, that say what is true now. Material you hand over is kept as given and distilled into those files. The agent writes as it goes, because sessions often end with no warning.

## Tending

Memory stays useful by being tended, not by growing. When the map shows session notes since the last tending, the agent distills raw files, merges duplicate subject files, updates standing files a recent session contradicted, raises what you should hear, and records the date. Nothing is deleted for being old.

## First Breath

First Breath is the agent's first conversation with you. It is a conversation, not a form. The agent builds its sanctum, then asks what to call you, and your reply sets both your name and the language it uses. Nothing about you comes from config.

It then learns about you and finds its specific mission for you, saving as it goes. It asks what else it should own or tend, and whether the repository is private to you or shared, so it knows what to keep out of git. It shows each change before making it.

Until First Breath is finished, it is the agent's only job. If you stop early, the next session picks up the questions it has not asked.

Every memory agent's First Breath follows the same steps. What differs is the questions Smithy writes for its domain: a companion or coach asks about you, a working agent asks how you work.

| Agent | What its First Breath asks about |
| --- | --- |
| Creative muse | What you are making, what lights you up, and what shuts you down |
| Dream journal | How well you recall dreams, any lucid dreaming, and your journaling habits |
| Fitness coach | Your training history, goals, injuries, and schedule |
| Writing partner | The project, its characters and world, and the voice you want |
| Code coach | Your codebase and languages, what energizes you, and what frustrates you |

## Naming the Agent

An agent can ship with a name, or be named at First Breath. Once the name is settled, the agent adds it to its own description, so you can ask for it by name from the next session. A global install serves every project, so it keeps its skill name, and you invoke it by that.

## Pulse

Pulse is optional. The agent wakes on a schedule with nobody at the keyboard, tends its memory first, then does the tasks its `PULSE.md` lists. You choose whether to use it and how often during First Breath.

| Agent | What it might do on a Pulse |
| --- | --- |
| Creative muse | Work over ideas from recent sessions and leave one for you to find |
| Research assistant | Check the topics you follow and note new findings |
| Project monitor | Check a project's health and flag risks |
| Content curator | Read the sources you saved, then sort and summarize them |
| Fitness coach | Review the week's training and draft next week's plan |

## Build One

Ask Smithy for an agent that remembers you, and follow [the build steps](build-your-first-skill.md) as usual. Smithy first tests whether memory is warranted and proposes a stateless agent if not. The execution plan shows the name, the mission, and what First Breath will ask. First Breath runs the first time you activate the agent.

When Smithy's agent scripts improve, [validate mode](modes.md#validate) names an agent whose copies are behind, and [edit mode](modes.md#edit) updates them without touching its memory.

:::tip[Memory agents are personal]
A memory agent serves one owner. In a repository others can read, say it is shared at First Breath, and the agent keeps its sanctum and the list of your areas out of git. The files in an area follow the repository's own git rules, so keep a personal area outside the repository or ignore its folder yourself.
:::
