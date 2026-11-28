---
title: 'Voice, Writing, and Studio Rooms'
description: 'Build a personal or project voice bible, weave drafts from real braindumps, catch AI clichés and pacing problems automatically, and rehearse with Clio.'
sidebar:
  order: 2
---

Clio (`bmad-creative-agent-director`) works from a simple rule: anything published under your name should come from your own ideas and sound like you, not a generic language model.

## Capture Your Real Voice

Instead of describing your style with vague adjectives like `"punchy"` or `"conversational"`, Clio builds a voice bible from 3 to 5 real pieces or talk transcripts you actually wrote or spoke. She quotes your real openings, transitions, sentence rhythm, and natural filler words to keep versus cut, and calculates your real speaking speed (words per minute) when transcripts include durations.

You can keep your voice bible inside one project (`creative/voice-bible.md`) or save it in your home folder (`~/.bmad/voice-bible.md`) so your personal voice carries across every project you open.

## Braindump First, Then Weave in Your Own Words

When writing a talk, essay, or script from scratch, Clio separates gathering raw thoughts from polishing prose:

1. During the braindump, Clio interviews you one focused question at a time (or files an existing voice memo or transcript untouched in `creative/braindumps/`), keeping your exact phrasing, slang, and half-formed sparks intact.
2. Before drafting prose, she proposes three distinct opening hooks and a beat-by-beat outline tied directly to lines from your braindump, flagging any spots where real proof is still missing with `[GAP]` questions for outline approval.
3. In Quote-or-Cut drafting, she weaves the draft from your braindump phrasing, writes the opening hook last once the body proves it, and visibly tags any synthetic connective sentence she had to add with `[INVENTED]`. If more than 25% of the draft consists of `[INVENTED]` lines, she stops and asks for real material instead of padding.

Here is how those markers look inside a draft so you can fix or confirm them in seconds:

```text
We cut our deploy script from 900 lines down to 40, and incidents dropped overnight.
[INVENTED] That single change shifted how the whole team thought about tooling.
[GAP: Add the exact month this happened and the number of incidents before vs. after.]
```

## Automatic Cliché and Pacing Checks

Before presenting woven prose, revised drafts, titles, or spoken scripts, Clio runs automated script checks on the text:

- An AI tell and cliché scan catches entries from your `blacklist.md`, stiff essay transitions, and punctuation breaks that trip up teleprompter reads on scripts meant to be spoken aloud.
- A spoken runtime and rhythm check estimates real speaking duration at your measured pace (skipping notes and tables of contents on talk scripts), counts short lines alongside longer ones, and warns if long sentences pile up in a row without breathing room.

## Visuals, Slide Critique, and Live Rehearsal

- Visual escalation and slide critique turns dense prose into clear diagrams, comparisons, or editable sketches, and audits existing slide decks for 3-second readability, strong assertion headlines, and clean layouts free of dense text walls.
- Title and hook workshops generate distinct, non-obvious options across safe and bold angles, then check that your actual draft delivers on every promise each title makes.
- Talk rehearsal roleplays a skeptical audience Q&A after checking spoken timing and tongue-twisting phrases, then debriefs where pushback hit hardest.

## Make Feedback Stick Across Sessions

Whenever you spot an off-voice phrase, a cheesy trope, or a direction you want retired for good, tell Clio. Instead of fixing it only in chat (where the lesson disappears next session), she appends dated rules to `voice-bible.md`, `blacklist.md`, or `canon.md` so every future draft starts sharper.

## Creative Studio Rooms

When a piece needs more than one perspective, Clio can convene three multi-voice rooms:

| Room | Cast and focus |
| --- | --- |
| The Creative Studio | Hosted by Clio with Carson (pushes past obvious first ideas), Dr. Quinn (hunts root causes and contradictions), Maya (tests real human habits and friction), Victor (challenges category strategy), Sophia (demands real narrative stakes), and Caravaggio (enforces 3-second visual restraint). This room remembers insights across sessions. |
| The Midnight Salon | Hosted by Clio with Carson, Leonardo (sketches mechanisms from nature and craft), Dalí (proposes surreal inversions), Sophia, Victor, Pip (a blunt seven-year-old who asks `"but why?"` until jargon disappears), and Margaret (the practical client who decides whether the best surviving idea holds up on Thursday). |
| The Critique Table | A tight pre-ship editorial and visual review led by Clio with Sophia, Caravaggio, Dr. Quinn, Pip, and Margaret, focused strictly on concrete lines or slides to cut or sharpen. |

:::note[Studio Rooms prerequisite]
The three Studio Rooms use `bmad-party-mode`, which is included when you install BMad core tools with `--skill '*'`. If you ran a minimal install without `bmad-party-mode`, add it first (`npx skills add bmad-code-org/BMAD-METHOD/skills/core-tools --skill bmad-party-mode`) before opening a room.
:::

:::note[Ways to start]
```text
/bmad-creative-agent-director Build my voice bible from these three blog posts I wrote last year.
```

```text
Hey Clio, open The Critique Table on my keynote draft and cut anything that drags or sounds generic.
```
:::
