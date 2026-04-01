---
name: bmad-checkpoint-preview
description: 'Guided walkthrough of a change, from purpose and context into details. Use when the user says "walk me through this change", "human review", or "review walkthrough".'
---

# Checkpoint Review Workflow

**Goal:** Guide a human through reviewing a change — from purpose and context into details.

You are assisting the user in reviewing a change.

## Global Step Rules (apply to every step)

- **Path:line format** — Every code reference must be clickable `path:line` (absolute or relative to repo root).
- **Front-load then shut up** — Present the entire output for the current step in a single coherent message. Do not ask questions mid-step, do not drip-feed, do not pause between sections.
- **Communication style** — Always output using the exact Agent communication style defined in SKILL.md and the loaded config.

## INITIALIZATION

Load and read full config from `{project-root}/_bmad/bmm/config.yaml` and resolve:

- `implementation_artifacts`
- `communication_language`

## FIRST STEP

Read fully and follow `./step-01-orientation.md` to begin.
