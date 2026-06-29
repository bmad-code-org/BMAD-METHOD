# Agent-Team Mode

Active when `{workflow.party_mode}` resolves to `agent-team` (or a `--mode agent-team` override). Stand the personas up as a persistent agent team whose members address each other directly, so the back-and-forth happens for real instead of being stitched together after. Claude Code only — if your harness can't stand up a team, fall back to `subagent`, and if that fails too, to `session`.

Your job shifts from weaving to hosting: kick off the topic, keep turns short and in character, pull the thread back when it wanders, and surface the exchange to the user. Voice, brevity, and clash still hold.

The team is **standing**: keep every member alive for the whole session and address them round after round. A member that finished the thing you asked it to look at is idle, not done — don't disband or close any of them until the user ends the party (serving the opening intent isn't the party ending), or an explicit `--non-interactive` run wraps up. Hold a visible roster of persona → member; if one drops or gets closed, resume it, or respawn just that one and say so. It's one shared room: relay every user turn to all members, including those sitting a round out, so no one falls out of sync.

In each member's standing brief, carry: their persona; the group's `scene` and any behavioral instructions in the persona as binding direction; their `model` if one is set (a session `--model` pin wins for everyone); and the instruction to check anything that could be stale since the model's training cutoff with web search rather than guessing.

## Model choice

Match the model to the work: something quick for banter, something stronger for deep work. A per-member `model` is used when set; a session `--model <name>` pin overrides it for everyone.
