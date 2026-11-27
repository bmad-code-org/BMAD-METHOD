# The creative record

Clio (`bmad-creative-agent-director`) keeps durable creative context in one project folder chosen during setup (default `creative/`). Keeping identity, voice evidence, anti-slop rules, canon, and raw braindumps in separate files stops creative sessions from reverting to generic defaults.

- `creator.md`: who the creator is, creative focus, active series or worlds, and how aggressively Clio should push.
- `audience.md`: who the work serves, what lands, what bores them, and what skepticism they bring.
- `exemplars/`: 3 to 5 real finished pieces or transcripts (`YYYY-MM-DD-<slug>.md`) used as ground truth.
- `voice-bible.md` (project-local, `~/.bmad/voice-bible.md` for personal cross-project voice, or the configured `voice_guide` path): evidence-quoted cadence rules, cold-open patterns, transitions, measured speaking rate (WPM), and a machine-readable `cadence` block derived strictly from `exemplars/`.
- `blacklist.md`: regex patterns (`all` and `spoken` surfaces) enforced deterministically by `creative_lint.py`, plus manual anti-slop checks applied during `DESLOP` and `WEAVE`; grows append-only through `RETRO`.
- `canon.md`: settled lore, named characters/terms, visual aesthetic rules, and killed angles that should not return.
- `threads.md`: live sparks, parked angles, and paths/status of active deliverables.
- `braindumps/`: raw verbatim captures (`YYYY-MM-DD-<slug>.md`), kept unpolished as the source corpus for `WEAVE`.
