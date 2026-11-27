---
title: 'Creative'
description: 'Use Clio, the Creative Director (bmad-creative-agent-director), for voice-grounded writing and talks, fiction and worldbuilding, visual decks, and creative problem solving.'
sidebar:
  order: 1
---

Creative is a BMad module for writing, storytelling, presentations, and non-code breakthrough thinking. Everything runs through **Clio, the Creative Director** (`bmad-creative-agent-director`), who keeps your real voice, world rules, and anti-cliché standards in one creative record so every piece sounds like you rather than generic AI prose.

Creative replaces the older Creative Intelligence Suite (`cis`).

## Install and Setup

With [BMad core tools](../start/install-bmad.md) installed, add Creative from your project folder:

```bash
npx skills add bmad-code-org/BMAD-METHOD/skills/creative
```

Then ask the `bmad` skill to run `bmad setup creative`. If any retired `cis` skills are still installed, `bmad setup` offers to clean them up in the same run.

Setup asks two quick questions:

- **Where to keep your creative record:** defaults to `creative/` in your project.
- **Optional personal voice guide:** point to a shared voice file (such as one in your home folder) if you want your personal writing and speaking voice available across every project.

## One Creative Record That Compounds

Keeping your background, real writing samples, and settled lore in separate files stops sessions from resetting to blank defaults:

- **Your background and audience:** who you are, active projects or worlds, how hard you want Clio to push, and what skepticism your readers or listeners bring.
- **Real samples and voice bible:** 3 to 5 untouched pieces you actually wrote or spoke, distilled into evidence-backed rules for how you open, transition, and pace sentences.
- **Your anti-slop list:** banned AI clichés and spoken stumbling blocks checked automatically before drafts are handed over, growing over time whenever you spot a tell.
- **Canon and sparks:** settled character or world lore, visual direction, rejected angles that should stay dead, active drafts, and raw unpolished braindumps.

## What Clio Helps You Do

Ask Clio in plain English, or ask "Clio, what can you help me with?" anytime.

### Write talks, essays, and scripts in your voice

Talk through messy ideas in a conversational braindump, weave drafts strictly from your own words without invented anecdotes, calibrate talk length to your real speaking pace, and sharpen titles, hooks, and blurbs that the piece actually pays off.

### Build stories, characters, and worlds

Coach narrative arcs, brand origin stories, rich character sheets, and full world almanacs (rulesets, factions, tensions, and visual canon) kept consistent across installments.

### Create visual presentations and explainer graphics

Design narrative slide decks with speaker notes and custom visual slide treatments, turn dense explanations into clear diagrams or sketches, and critique existing slides for instant 3-second clarity. Finished visual deliverables follow your project's shared design system when presenting as yourself or your organization, while fiction and invented worlds keep their own look.

### Crack hard non-code problems and explore strategy

When you are stuck on a tough non-software challenge, design a workshop, service, or physical experience, or explore bold strategic angles outside startup fundraising, Clio coaches structured creative problem-solving, human-centered design, and strategic reframing exercises.

### Convene creative rooms

Bring a cast of distinct creative personalities together for multi-angle brainstorming, wild lateral thinking grounded in real-world reality checks, or an honest pre-ship critique.

:::note[Ways to start]
```text
/bmad-creative-agent-director Interview me for a 15-minute conference talk on why small engineering teams ship faster, then weave an outline in my voice.
```

```text
/bmad-creative-agent-director Help me build the villain and setting rules for my sci-fi novella without slipping into generic tropes.
```
:::

## Where Creative Hands Off

- **Software UI, app screens, and corporate brand kits:** work with [Sally](../agents/sally-ux-designer.md).
- **Startup fundraising, investor pitch decks, and financial modeling:** work with [Nadia](../founder/founder.md).

See [Voice, Writing, and Studio Rooms](voice-lint-and-rooms.md) for Clio's voice pipeline, anti-slop checks, rehearsal, and creative rooms.

## Tailoring Clio

To prefer plain markdown, tables, and Mermaid diagrams over rich HTML pages, or to adjust Clio's visual style and voice guide, invoke `bmad-customize` and describe what you want changed.
