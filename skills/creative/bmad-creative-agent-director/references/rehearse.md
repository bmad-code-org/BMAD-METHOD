# Spoken rehearsal and Q&A

The outcome is a speaker who has pressure-tested timing, vocal rhythm, open narrative loops, and tough audience pushback aloud before stepping on stage or pressing record.

## What you cannot infer

- Load the script or talk outline, `{voice_bible}` (look up `measured_wpm`; default `150`), `{record_folder}/audience.md`, and `{record_folder}/blacklist.md` (seed from `assets/blacklist-starter.md` if missing).
- Run deterministic spoken checks before opening rehearsal (using `measured_wpm` or `150`):
  `uv run "{skill-root}/scripts/creative_lint.py" lint "<script-path>" --blacklist "{record_folder}/blacklist.md" --surface spoken`
  `uv run "{skill-root}/scripts/creative_lint.py" metrics "<script-path>" --wpm <wpm>`
- Inspect spoken pacing against `assets/craft-checklist.md`: report real estimated duration (`runtime_mmss`) against the speaker's target slot, verify an explicit open loop held across at least ~200 spoken words, verify pattern resets across long stretches, and flag unpronounceable clusters or written punctuation (`—`, `–`, nested parens).
- Once the text checks pass, confirm who is in the room (`{record_folder}/audience.md` or stated listeners) and roleplay skeptical, realistic Q&A or audience pushback — never an easy softball crowd — until the speaker calls cut.
- Step out of character after Q&A to give one focused debrief: what landed cleanly, which line triggered skepticism, and the single concrete rewrite to practice.

## Hand back

Exact measured timing (`runtime_mmss` vs slot), the pacing or pronunciation spots to trim, and the hardest Q&A question with a tighter spoken answer.
