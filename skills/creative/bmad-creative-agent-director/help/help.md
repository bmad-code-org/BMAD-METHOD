# Creative knowledge

This document covers the `creative` module (**BMad Creative**): when to recommend it and where to send the user.

## How the module works

Everything runs through **Clio, the Creative Director** (`bmad-creative-agent-director`), reached by asking for Clio or the creative director. She coaches stories, characters, worlds, spoken talk scripts, visual presentations, and breakthrough thinking, keeps the user's real voice and canon in one creative record (`help/creative-record.md`), and hosts the classic studio rooms in `bmad-party-mode`.

Creative delegates general brainstorming (`bmad-brainstorming`), idea stress-testing (`bmad-forge-idea`), deep research (`bmad-deep-recon`), document facilitation (`bmad-facilitate`), reviews (`bmad-review`), and group rooms (`bmad-party-mode`) to core tools rather than rebuilding them.

## Ecosystem boundaries

- **Software UI/UX & software delivery:** route software design specifications (`DESIGN.md`, `EXPERIENCE.md`) to Sally (`bmad-agent-ux-designer`) and product/delivery work to `method` agents. Clio handles non-software design thinking and narrative/visual artifacts.
- **Startup operations & investor pitches:** route runway, cap tables, pricing, company viability, and investor pitch decks (`pitch-deck`) to Nadia (`bmad-founder-agent-advisor`). Clio owns talks, stories, non-startup innovation plays, and narrative presentations (`presentation`).
- **Video production studio:** Clio owns pre-video braindumping, script weaving, voice preservation, and general creative work. When the user wants camera take segmentation, DaVinci Resolve timelines, motion renders, audio lanes, or YouTube video publishing, point them to `bmad-manticore` (Manny).
- **Authoring or customizing BMad skills:** route new skills, evals, or template overrides to Smithy (`bmad-toolsmith`) or `bmad-customize`.

## More detail

Read a topic file only when the question is about that subject, using the path the knowledge script lists for it.

| Topic file | Read when the user asks about |
|---|---|
| `help/creative-record.md` | The creative record folder, voice bible, exemplars, blacklist, canon, killed angles, or raw braindumps. |
| `help/writing-and-voice.md` | Freeform braindumps, Quote-or-Cut script/essay weaving, deslopping, packaging/titles, taste retros, or `story` / `character` / `world` / `talk-script`. |
| `help/visuals-and-decks.md` | `presentation` decks, slide critique, visual metaphors/diagrams, talk rehearsal, or how decks differ from Nadia's `pitch-deck` and Sally's `bmad-agent-ux-designer`. |
| `help/thinking-and-rooms.md` | Root-cause problem solving (`problem-solve`), non-software design thinking (`design-thinking`), non-startup innovation (`innovation-play`), or The Creative Studio, Midnight Salon, and Critique Table rooms. |

## Match the situation

| The user says or has | Recommend |
|---|---|
| "Let me talk through this draft/script without AI clichés" | Clio, `BRAINDUMP` followed by `WEAVE` (or `VOICE` first to build from real samples). |
| "Write a story, character sheet, or world bible" | Clio with `story`, `character`, or `world` in `bmad-facilitate`. |
| "Help me write a keynote, talk script, or presentation deck" | Clio with `talk-script`, `presentation`, `CRITIQUE`, or `REHEARSE`. |
| "Turn feedback so the model stops making this mistake" | Clio, `RETRO` (routes dated rules to voice bible, blacklist, or canon). |
| "Break a contradiction or solve a hard non-code problem" | Clio with `problem-solve` (TRIZ, systems thinking, causal maps). |
| "Run human-centered design for a workshop, service, or physical product" | Clio with `design-thinking`; for software UI/UX, recommend Sally (`bmad-agent-ux-designer`). |
| "Convene The Creative Studio or The Midnight Salon" | Clio (`STUDIO`) or `bmad-party-mode` with `creative-studio`, `midnight-salon`, or `critique-table`. |
