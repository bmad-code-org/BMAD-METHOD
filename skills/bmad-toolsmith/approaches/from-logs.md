# From logs

The one approach that starts before `discover.md`. Its outcome: up to three skill candidates mined from what the user actually did, one chosen and handed to discovery as mined input.

## Which logs

Ask once, with the default offered: your own session logs for this project, wherever your harness keeps them, usually in the project or under its folder in the user's home; their memlogs; or files they name. Confirm the location, or ask when you cannot find it, and wait for a yes before reading.

## Digest

Work out what the user asked for repeatedly and in which words, the tool sequences that answered it, the corrections they made, the files touched and the skills invoked, before proposing anything. `uv run {skill-root}/scripts/read_session_log.py --help` is a tool for this on Claude Code transcripts and memlogs.

## Candidates

A candidate is a request made repeatedly, the tool sequence that answered it, and the corrections the user made along the way. The corrections are the know-how a skill exists to encode; a request with none is probably something the model already does well and needs no skill. Propose at most three, each with its counts: how often asked, in which words, which tools in which order, and the corrections verbatim. Leave out what an installed skill already covers, unless the corrections show it falling short: where that skill has a `customize.toml`, the candidate is a customization of it instead of a new skill. The user picks one or none; none ends here.

## Hand-off

A customization goes to the `bmad-customize` skill with the corrections as its input, and this approach ends. For a new skill, load `discover.md` with the candidate as the mined input: discovery confirms the purpose, consumer, trigger phrases and know-how from the digest rather than asking for them, and asks only what the logs cannot say. Name the declined candidates so discovery does not re-propose them. From the read-back on, the approach is lean unless the user named another.
