# From logs

The one approach that starts before `discover.md`. Its outcome: skill candidates mined from what the user did, one chosen and handed to discovery. Bare paths resolve from `{skill-root}`.

## Which logs

Ask once, with the default offered: your own session logs for this project, wherever your harness keeps them, usually in the project or under its folder in the user's home; or files they name. Confirm the location, or ask when you cannot find it, and wait for a yes before reading.

## Digest

For Claude Code transcripts, run `uv run {skill-root}/scripts/read_session_log.py` (see its `--help`); read other files directly. Its `turns` give each request with the tools that followed it, the user's next message (`followed_by`) and whether the user interrupted it. Which of those follow-ups are corrections is your judgment. When it exits non-zero, nothing was read: its error and `skipped` say why; ask the user where the logs are.

## Candidates

Group the requests by meaning, not exact words. Propose at most three candidates, each a repeated request with its counts: how often asked, in which words, which tools in which order, and the corrections verbatim, taken from the source log when the digest cut a text short at 300 characters. The digest's `files_touched` and `skills_invoked` cover the whole log.

The corrections are the know-how a skill encodes. A request repeated without corrections is still a candidate when the user typed the same instructions each time.

Leave out what an installed skill already covers, unless the corrections show it falling short: where that skill has a `customize.toml`, the candidate is a customization of it instead of a new skill.

The user picks one or none; none ends here.

## Hand-off

A customization goes to the `bmad-customize` skill with the corrections as its input, and this approach ends.

For a new skill, load `discover.md` with the candidate as its input: discovery confirms the purpose, consumer, trigger phrases and know-how from the digest and asks only what the logs cannot say. Name the declined candidates so discovery does not re-propose them. From the execution plan on, the approach is lean unless the user named another.
