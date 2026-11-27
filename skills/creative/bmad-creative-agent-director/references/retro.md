# Compounding taste retro

The outcome is permanent file upgrades inside `{record_folder}` so misses spotted after publishing, rehearsal, or review never repeat in a future run. Chat corrections vanish between sessions; only edits written to `{voice_bible}`, `blacklist.md`, and `canon.md` compound.

## What you cannot infer

- Read `{voice_bible}`, `{record_folder}/blacklist.md`, and `{record_folder}/canon.md` before taking notes.
- Take one concrete round of feedback on what felt synthetic, off-voice, visually weak, structurally flat, or off-canon — do not fish endlessly after the real notes are on the table.
- Route each note cleanly to the single file whose rule would have prevented it:
  - **Voice, rhythm, opening, or transition miss** -> append an ISO-dated rule with verbatim before/after proof (or update `keep:`/`cut:` in ```` ```cadence ````) in `{voice_bible}`.
  - **Recurring slop phrase, filler word, or punctuation tell** -> append an ISO-dated comment and regex pattern (inside the `# scope: all` or `# scope: spoken` ```` ```regex ```` block) in `{record_folder}/blacklist.md`.
  - **World lore, audience boundary, aesthetic shift, or rejected angle** -> append an ISO-dated rule or entry under `## Killed angles` in `{record_folder}/canon.md`.
- Keep changes append-only with `YYYY-MM-DD` dates, newest first. Never delete historical rules or weaken hard anti-slop gates unless the user explicitly asks to remove a rule that bit legitimate phrasing.
- Re-run `uv run "{skill-root}/scripts/creative_lint.py"` against a clean test line if regexes were added so invalid regex syntax never breaks future sessions.

## Hand back

A concise summary of exact lines added per file (`{voice_bible}`, `blacklist.md`, `canon.md`) and why each prevents the flagged miss.
