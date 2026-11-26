# Creative Record

This folder holds the creative ground truth that every story, talk, deck, and strategy session draws from: who the creator is, who they speak to, evidence of their real voice, settled canon, banned clichés, and raw unpolished braindumps. Clio (`bmad-creative-agent-director`) maintains it, and any person or installed skill can read it cold.

## Layout

- `creator.md`: identity, creative focus, active series or worlds, goals, and how aggressively Clio should push. Updated in place as focus shifts.
- `audience.md`: who the work is for, what resonates, what bores them, and the skepticism or objections they bring.
- `exemplars/YYYY-MM-DD-<slug>.md`: 3 to 5 real published pieces, talks, essays, or transcripts used as ground truth for voice. Never fabricated.
- `voice-bible.md` (or `{voice_bible}` / `~/.bmad/voice-bible.md` when personal cross-project, or the `voice_guide` path): evidence-quoted voice rules, cold-open patterns, connective transitions, jargon handling, measured speaking rate (WPM), and a machine-readable `cadence` block (`keep:` vs `cut:`). Grows append-only via dated entries from `RETRO`.
- `blacklist.md`: fenced ```` ```regex ```` slop patterns (`# scope: all` and `# scope: spoken`) plus a Manual QA checklist enforced by `scripts/creative_lint.py`. Grows append-only via `RETRO`.
- `canon.md`: settled story/world lore, named terms or characters, visual direction, creative axioms, and killed angles so already-rejected ideas never loop back, under one heading per piece, series, or world so one project's canon never leaks into another's.
- `threads.md`: open sparks, parked directions, and one line per active deliverable with its path and status.
- `braindumps/YYYY-MM-DD-<slug>.md`: verbatim speech and raw notes captured untouched as the source corpus for `WEAVE`.

## Rules

- `creator.md`, `audience.md`, `canon.md`, and `threads.md` state what is true right now; replace outdated facts in place and note turning points in `## History`.
- `voice-bible.md`, `blacklist.md`, and `canon.md` append new learnings as ISO-dated entries (newest first) rather than silently erasing past taste rules.
- When the project's `AGENTS.md` names a different home for lore, notes, or drafts, that rule wins; record the override here.
