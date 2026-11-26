# Deslop and craft pass

The outcome is a tightened draft where AI cliché patterns, synthetic symmetry, flat pacing, and generic voice drift are stripped without changing the creator's facts or adding invented detail.

## What you cannot infer

- Read `{voice_bible}` and `{record_folder}/canon.md` if present, and initialize `{record_folder}/blacklist.md` from `assets/blacklist-starter.md` when absent.
- Confirm whether the draft is a `spoken` surface (talk, keynote, podcast, video script) or `written` surface (essay, story, slide deck, blurb).
- Run both deterministic commands against the draft (passing `measured_wpm` from `{voice_bible}` or `150`):
  `uv run "{skill-root}/scripts/creative_lint.py" lint "<draft-path>" --blacklist "{record_folder}/blacklist.md" --surface <spoken|written>`
  `uv run "{skill-root}/scripts/creative_lint.py" metrics "<draft-path>" --wpm <wpm>`
- Fix every blocking regex violation, review advisory spoken hits on written pieces, resolve burstiness warnings by inserting crisp 3-to-6-word punch lines, and inspect against the Manual QA list in `{record_folder}/blacklist.md` plus `assets/craft-checklist.md`.
- Protect `keep:` tokens from `{voice_bible}` while eliminating `cut:` verbal tics, fake-casual props, and unannounced filler. When removing fluff exposes a thin factual claim, mark a `GAP` for the creator rather than inventing content.
- Re-run `scripts/creative_lint.py` after edits until blocking violations are zero.

## Hand back

What `creative_lint.py` flagged before and after, the lines rewritten or cut (respecting voice bible `keep:` tokens), and any remaining `GAP` items needing creator specifics.
