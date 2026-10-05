# Writing the description

Read this when the user asks why their skill does not fire, fires on the wrong things, or how to write the description.

The description is the skill's only trigger. The agent's router reads it, with every other installed skill's, and decides whether to load the skill. Nothing in the body helps with that decision.

Its shape, in three parts: what the skill does, in the third person; `Use when` followed by the phrases a user would actually type; then what it is not for, naming the nearby skills that handle those. Aim under 500 characters; the hard ceiling is 1024. One clause per situation, in words the model already knows; a synonym stack adds length and no reach. Describe the user's problem, not the tool's symptom: "wants release notes from merged pull requests", not "needs changelog generation".

The near misses matter most. A good description stays quiet on requests that share words and domain but belong elsewhere: debugging a workflow versus building one, critiquing a brief versus writing one. Smithy asks for those during discovery and the trigger eval tests them.

A skill only ever called by name, such as a slash command, gets a one-line description and, where the harness supports it, `disable-model-invocation: true`, so it never competes in the router.

A description is revised from eval failures by changing its situations and boundaries, never by pasting a failed query's words into it. Smithy offers a trigger eval at the end of every build (`help/evals.md`).
