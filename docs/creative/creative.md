---
title: 'Creative'
description: 'Use Clio, the Creative Director (bmad-creative-agent-director), for voice-grounded writing and talks, fiction and worldbuilding, visual decks, and creative problem solving.'
sidebar:
  order: 1
---

Creative is a BMad module for writing, storytelling, presentations, and non-code breakthrough thinking. Everything runs through **Clio, the Creative Director** (`bmad-creative-agent-director`), who keeps your real voice, settled canon, and cliché blacklist in one creative record so every draft sounds like you rather than generic AI prose.

By default, Clio produces rich, interactive HTML pages for finished documents, decks, character sheets, and visual sketches, backed by plain markdown files on disk so every deliverable is both pleasant to read and easy to version-control. If you prefer plain markdown and diagrams instead of HTML pages, you can switch that preference anytime through `bmad-customize`.

## Install and Setup

Writers, speakers, and storytellers can install Creative in a dedicated writing or notes folder outside any software repository, or right inside an existing project. With Node.js, [uv](https://docs.astral.sh/uv/), and an AI coding tool ready (see [How to Install BMad](../start/install-bmad.md)), install BMad core tools and Creative:

```bash
npx skills add bmad-code-org/BMAD-METHOD/skills/core-tools --skill '*'
npx skills add bmad-code-org/BMAD-METHOD/skills/creative --skill '*'
```

Open your AI tool in that folder and ask the `bmad` skill to run `bmad setup`. Setup asks two quick questions:

- Where to keep your creative record, which defaults to `creative/` in that folder.
- Whether to link an optional personal voice guide, such as `~/.bmad/voice-bible.md` in your home folder, so your personal writing and speaking voice is available across every project.

Creative replaces the retired Creative Intelligence Suite (`cis`). If any older `cis` skills are still installed, `bmad setup` offers to clean them up during setup.

## One Creative Record That Compounds

Keeping your background, real writing samples, and settled rules in a `creative/` folder stops new chats from resetting to generic defaults:

| Files | What they hold |
| --- | --- |
| `creator.md` and `audience.md` | Who you are, active projects or series, how aggressively Clio should push, and what skepticism your readers or listeners bring |
| `exemplars/` and `voice-bible.md` | 3 to 5 untouched pieces you actually wrote or spoke, distilled into evidence-backed rules for how you open, transition, and pace sentences |
| `blacklist.md` | Your cliché and overused-phrase blacklist, checked automatically by script before drafts are handed over and updated whenever you spot an off-voice tell |
| `canon.md`, `threads.md`, and `braindumps/` | Your settled ground truth (recurring examples, named concepts, audience promises, and retired angles for talks and essays, or character and world rules for fiction), active project threads, and raw unpolished braindumps kept intact |

## What Clio Helps You Do

Call Clio with `/bmad-creative-agent-director` in tools that support slash commands (such as Claude Code), or speak to her in plain English in any tool. Ask `"Clio, what can you help me with?"` anytime.

Clio adapts to how much time you have. In full coaching mode she interviews you and builds piece by piece; when you are in a hurry and say `"just write it"`, she asks at most three quick questions for facts only you know and drafts cleanly around explicit gap markers without inventing stories under your name. Whenever a quick outside perspective would unstick a draft, she can also drop in a brief one-line studio cameo from a guest persona before returning as Clio.

### Write talks, essays, and scripts in your voice

Talk through messy ideas in a conversational braindump, weave drafts strictly from your own words without invented anecdotes, calibrate talk length to your real speaking pace, and sharpen titles, hooks, and blurbs that the piece actually pays off.

### Build stories, characters, and worlds

Coach narrative arcs, brand origin stories, rich character sheets, and full world almanacs (rulesets, factions, tensions, and visual canon) kept consistent across installments.

### Create visual presentations and explainer graphics

Design narrative slide decks with speaker notes and custom visual slide treatments, turn dense explanations into clear diagrams or sketches, and critique existing slides for instant 3-second clarity. Finished visual deliverables automatically inherit the shared design system you wired during [`bmad setup`](../start/install-bmad.md) (for example, a brand kit built with [Sally](../agents/sally-ux-designer.md)) when presenting as yourself or your organization, while fiction and invented worlds keep their own look.

### Solve hard non-code problems and explore strategy

When you are stuck on a tough non-software challenge, designing a workshop, service, or physical experience, or exploring bold strategic moves outside startup fundraising, Clio coaches structured creative problem-solving, human-centered design, and strategic innovation plays.

Clio includes eight built-in creative formats covering stories, characters, worlds, talk scripts, presentations, root-cause problem solving, non-software design thinking, and innovation plays; see [Document Templates](../reference/document-templates.md) for the full list.

### Convene creative rooms

Bring a cast of distinct creative personalities together for multi-angle brainstorming, wild lateral thinking grounded in real-world reality checks, or an honest pre-ship critique.

:::note[Ways to start]
```text
/bmad-creative-agent-director Interview me for a 15-minute conference talk on why small engineering teams ship faster, then weave an outline in my voice.
```

```text
Hey Clio, help me build the villain and setting rules for my sci-fi novella without slipping into generic tropes.
```
:::

## Where Creative Hands Off

- Software UI, app screens, and corporate brand kits belong with [Sally](../agents/sally-ux-designer.md).
- Startup fundraising, investor pitch decks, and financial modeling belong with [Nadia](../founder/founder.md).

See [Voice, Writing, and Studio Rooms](voice-lint-and-rooms.md) for Clio's voice pipeline, automated cliché checks, rehearsal, and creative rooms.

## Tailoring Clio

To switch from rich HTML pages to plain markdown and diagrams, adjust Clio's visual style, or change how she uses your voice guide, invoke `bmad-customize` and describe what you want changed.
