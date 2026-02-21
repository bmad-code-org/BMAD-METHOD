# NWS Quick Start

## 1. Install

From the `bmad-novel-suite` repository root:

```bash
node tools/bmad-npx-wrapper.js install
```

Select **Novel Writing Suite**, your novel project directory, and your AI tool. See [INSTALL.md](INSTALL.md) for full details.

## 2. Open Your Novel Project in Claude Code

After installation, six slash commands are available. Type `/` and search for `nws`:

```
/bmad-agent-nws-librarian   — analyze published novels
/bmad-agent-nws-sage        — discover your story
/bmad-agent-nws-atlas       — plan characters and plot
/bmad-agent-nws-muse        — design your narrative voice
/bmad-agent-nws-scribe      — draft chapters
/bmad-agent-nws-editor      — revise and polish
```

## 3. Recommended Starting Path

### Study a book you admire (optional but powerful)

```
/bmad-agent-nws-librarian
> Analyze uploaded text
[Paste or upload a chapter from a novel in your genre]
```

The Librarian extracts plot structure, character techniques, prose rhythm, and specific craft patterns — all saved to your persistent knowledge base.

### Discover your story

```
/bmad-agent-nws-sage
> Create story brief
```

Sage helps you clarify premise, central conflict, themes, and audience. Produces a **story-brief.md** document.

### Build your architecture

```
/bmad-agent-nws-atlas
> Create character profiles
> Design plot structure
```

Atlas designs your characters (arcs, motivations, relationships) and maps your plot beat by beat.

### Define your voice

```
/bmad-agent-nws-muse
> Design narrative architecture
```

Muse locks in POV, tense, prose style guidelines, and chapter structure — the style guide Scribe follows when drafting.

### Write

```
/bmad-agent-nws-scribe
> Write chapter
```

Scribe drafts with you, referencing your architecture documents and applying the techniques from Librarian's analysis.

### Revise

```
/bmad-agent-nws-editor
> Developmental edit
```

Editor reviews structure, character, pacing (developmental), prose and sentences (line edit), or grammar and consistency (copy edit).

## What Each Agent Produces

| Agent | Output |
|---|---|
| Librarian | Analysis reports, persistent technique library |
| Sage | `story-brief.md` |
| Atlas | `character-profiles.md`, `plot-outline.md` |
| Muse | `narrative-architecture.md` |
| Scribe | Chapter drafts |
| Editor | Critique reports with specific suggestions |

## Available Workflows

Workflows are structured multi-step processes you can run directly:

- `analyze-text` — deep analysis of a novel passage
- `create-story-brief` — guided story discovery
- `create-character-profiles` — character development
- `design-plot-structure` — act-by-act outline
- `write-chapter` — guided chapter drafting

## The Core Idea

NWS is built around one principle: **you learn craft by understanding why great writing works, not by having AI write for you.**

The loop:
1. **Analyze** — Librarian studies a published novel
2. **Plan** — Sage and Atlas design your story with those insights
3. **Write** — Scribe drafts using your architecture
4. **Revise** — Editor strengthens the manuscript
5. **Repeat** — knowledge base grows with every book studied

Good luck! 📚
