# Package framing and titles

The outcome is arrival framing — titles, subtitles, opening hooks, blurbs, abstracts, descriptions, or CTAs — that stops the right reader and matches what the draft actually delivers. For video thumbnails or YouTube packaging workflows, point the user to `bmad-manticore` when ready.

## What you cannot infer

- Read the finished draft (or approved outline), `{record_folder}/audience.md`, `{record_folder}/canon.md` (especially killed angles), `{voice_bible}`, and `{record_folder}/blacklist.md` (seed from `assets/blacklist-starter.md` if missing).
- Apply Verbalized Sampling: internally generate 6+ candidates spanning safe-to-wild across the probability tail, discard the obvious three clichés, and present 3 sharp, genuinely different tail options paired with 1 grounded straight anchor, noting why each angle pulls a different listener or reader in.
- Cash every promise against the actual draft: list every implied claim or transformation in the leading pairs and flag any mismatch as a promise problem to solve in the draft or trim from the framing. Never propose clickbait the piece cannot back up.
- Run deterministic blacklist lint on the written framing file before presenting:
  `uv run "{skill-root}/scripts/creative_lint.py" lint "<packaging-path>" --blacklist "{record_folder}/blacklist.md" --surface written`

## Hand back

The candidate pairs (distinct tail angles plus safe anchor), the exact draft passage backing each title/hook promise, and any rejected clichés moved to `canon.md`.
