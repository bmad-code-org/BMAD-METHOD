# From logs

The one approach that starts before `discover.md`. Its outcome: skill candidates mined from what the user did, one chosen and handed to discovery.

## Which logs

Ask once, with the default offered: your own session logs for this project, wherever your harness keeps them, usually in the project or under its folder in the user's home; their memlogs; or files they name. Confirm the location, or ask when you cannot find it, and wait for a yes before reading.

## Digest

Before proposing anything, digest the logs for what each candidate must carry, plus the files touched and the skills invoked. `uv run {skill-root}/scripts/read_session_log.py --help` is a tool for this on Claude Code transcripts and memlogs.

## Candidates

Propose at most three, each a repeated request with its counts: how often asked, in which words, which tools in which order, and the corrections verbatim.

The corrections are the know-how a skill encodes; a request with none is probably one the model already does well and needs no skill.

Leave out what an installed skill already covers, unless the corrections show it falling short: where that skill has a `customize.toml`, the candidate is a customization of it instead of a new skill.

The user picks one or none; none ends here.

## Hand-off

A customization goes to the `bmad-customize` skill with the corrections as its input, and this approach ends.

For a new skill, load `discover.md` with the candidate as the mined input: discovery confirms the purpose, consumer, trigger phrases and know-how from the digest and asks only what the logs cannot say. Name the declined candidates so discovery does not re-propose them. From the read-back on, the approach is lean unless the user named another.
