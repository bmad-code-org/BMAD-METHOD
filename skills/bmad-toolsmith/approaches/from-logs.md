# From logs

The one approach that starts before `discover.md`. Its outcome: up to three skill candidates mined from what the user actually did, one chosen and handed to discovery as mined input.

## Which logs

Ask once, with the default offered: this project's Claude Code sessions (`--project {project-root}`), their memlogs, or files they name. The formats read today are Claude Code transcripts and memlogs. Say that the digest is computed locally and nothing leaves the machine, and wait for a yes before reading.

## Digest

`uv run {skill-root}/scripts/read_session_log.py --project {project-root}` or `--format claude-code|memlog|auto <paths...>`, with `--max-items N` to cap the lists. The JSON holds `user_requests` with counts, `tool_sequences`, `corrections`, `files_touched` and `skills_invoked`. Read it whole before proposing anything.

## Candidates

A candidate is a request made repeatedly, the tool sequence that answered it, and the corrections the user made along the way. The corrections are the know-how a skill exists to encode; a request with none is probably something the model already does well and needs no skill. Propose at most three, each with its counts: how often asked, in which words, which tools in which order, and the corrections verbatim. Leave out what an installed skill already covers (`skills_invoked` says). The user picks one or none; none ends here with the digest path noted.

## Hand-off

Load `discover.md` with the candidate as the mined input: discovery confirms the purpose, consumer, trigger phrases and know-how from the digest rather than asking for them, and asks only what the logs cannot say. Name the declined candidates so discovery does not re-propose them. From the read-back on, the approach is lean unless the user named another.
