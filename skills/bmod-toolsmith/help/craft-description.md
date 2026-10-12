# Writing the description

Read this when the user asks why their skill does not fire, fires on the wrong things, or how to write the description.

The description is the skill's only trigger. The agent's router reads it, with every other installed skill's, and decides whether to load the skill. Nothing in the body helps with that decision.

It has two parts: a five-to-eight-word summary of what the skill does, in the third person, then `Use when the user says ...` with the quoted phrases a user would actually type. Every installed description is paid on every session, so it stays that short; 1024 characters is the hard ceiling, not a target. Most BMad skills are asked for explicitly, so explicit phrases are the default; a skill that must fire unasked describes the context instead, such as "when code imports the anthropic SDK". One phrase per situation; a synonym stack adds length and no reach. Describe the user's problem, not the tool's symptom: "release notes from merged PRs", not "changelog generation".

Near misses are requests that share words and domain but belong elsewhere: debugging a workflow versus building one, critiquing a brief versus writing one. Smithy asks for them during discovery and the trigger eval tests them. When a skill takes a sibling's requests, the description adds `Not for ...` naming that sibling; without a collision it stays at two parts.

An agent is the exception to keeping it short. Its `Use when` starts with the user asking for it by name, then lists the phrases of every capability built into it, since nothing else triggers those capabilities. The summary stays short; the list does not.

A skill only ever called by name, such as a slash command, gets a one-line description and, where the harness supports it, `disable-model-invocation: true`, so it never competes in the router.

A description is revised from eval failures by changing its situations and boundaries, never by pasting a failed query's words into it. Smithy offers a trigger eval at the end of every build (`help/evals.md`).
