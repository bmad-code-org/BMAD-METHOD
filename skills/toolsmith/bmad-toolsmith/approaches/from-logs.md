# From logs

The one approach that starts before `discover.md`. Its outcome: skill candidates mined from what the user did, one chosen and handed to discovery. Bare paths resolve from `{skill-root}`.

## Which logs

Read the logs the user's request points to: by default your own recent session logs for this project, wherever your harness keeps them; or the projects, time span or files they name. Confirm the location, or ask when you cannot find it, and wait for a yes before reading.

## Digest

Logs can run to many sessions and megabytes, so plan how to read them before you start and keep your own context for the judgment: batches, a subagent per log, or a script, whichever fits. From each session you need what it was for and where it went wrong, each request with the tools that followed and the user's next message verbatim, and the files touched and skills invoked. Which follow-ups are corrections is your judgment. Keep any copies of the logs in a scratch folder and delete it when you are done.

## Candidates

Group the requests by meaning, not exact words, and weigh each group by its evidence: how often it came up, in which words, which tools ran in which order, and the corrections verbatim. The evidence is for your judgment and for discovery; do not show it to the user.

Propose the ideas the logs support, strongest first. Each is a repeated request, or a need the logs show without one, such as an ongoing pursuit a memory agent could carry. Give each in a few sentences: what it would do and how it would help, with a short quote when one makes the need plain.

The corrections are the know-how a skill encodes. A request repeated without corrections is still a candidate when the user typed the same instructions each time.

Leave out what an installed skill already covers, unless the corrections show it falling short. Then the candidate is an edit of that skill when the user owns it; ask when unsure. It is a customization when the skill's `customize.toml` exposes what the corrections change. Otherwise, name the shortfall with its corrections, so the user can report it upstream, and leave it out. A correction that is a rule for agents in one repository, not a skill, is a pitfall for that repository's AGENTS.md.

The user picks one or none. When they pick none, write the list to `{reports_folder}`, and this approach ends.

## Hand-off

An edit loads `modes/edit.md` with the skill and the corrections as its input. A customization goes to the `bmad-customize` skill with the corrections as its input. A pitfall goes to the `bmad-project-context` skill's `record` intent with the task, the mistake, the correction and the log it came from. Each ends this approach.

For a new skill, load `discover.md` with the candidate as its input: discovery confirms the purpose, consumer, trigger phrases and know-how from the digest and asks only what the logs cannot say. Name the declined candidates so discovery does not re-propose them. From the execution plan on, the approach is lean unless the user named another.
