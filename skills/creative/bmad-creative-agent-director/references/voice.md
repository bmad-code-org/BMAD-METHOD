# Build or refresh voice bible

The outcome is an evidence-backed `{voice_bible}` derived strictly from real writing or spoken transcripts stored in `{record_folder}/exemplars/`. Voice rules without verbatim proof drift back into generic flattering adjectives, so every claim quotes its exemplar.

## What you cannot infer

- Confirm `{record_folder}/README.md` exists (copy `assets/record-README.md` if creating the record for the first time). If creating a new voice bible with no explicit `voice_guide` path set, ask once whether to save it as a personal cross-project voice bible (`~/.bmad/voice-bible.md`, falling back to `{record_folder}/voice-bible.md` if writes outside `{project-root}` are blocked) or keep it project-local (`{record_folder}/voice-bible.md`).
- Ask for 3 to 5 real pieces or cleaned spoken transcripts that represent the creator at their best, and save each untouched into `{record_folder}/exemplars/YYYY-MM-DD-<slug>.md` with medium, date, and source context in frontmatter. Never fabricate exemplar text.
- If fewer than three real samples exist yet, ask for raw emails, voice notes, posts, or talk transcripts they already wrote, or pause `VOICE` cleanly rather than guessing from adjectives.
- Read `assets/voice-bible-spec.md` and deconstruct the saved exemplars across sentence rhythm, cold openings, transitions, recurring constructions, jargon handling, hedging, and filler tokens. Cite at least one verbatim quote per rule.
- When any exemplar is a spoken talk or episode with a known duration, calculate actual words per minute (`total_words / duration_minutes`) and record `measured_wpm: <int>` in `{voice_bible}` frontmatter.
- Write the fenced ```` ```cadence ```` block (`keep:` vs `cut:`) derived directly from observed connective glue and tics in the exemplars.
- If they also want non-Creative first-person facilitated documents (such as founder updates) to follow this voice, offer to save it to `_bmad/custom/bmad-facilitate.user.toml` (`workflow.voice_guide`) through `bmad-customize` — or set Creative's `voice_guide` through `bmad` setup when saved at a custom path.

## Hand back

The path to `{voice_bible}`, the list of exemplars cited, `measured_wpm` if measured, and the three sharpest cadence rules that distinguish this creator from generic AI prose.
