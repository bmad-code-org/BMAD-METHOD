# APF Skill Authoring Standard

Every public APF skill has one primary outcome and the following sections:

1. `Outcome`
2. `Use when`
3. `Do not use when`
4. `Inputs`
5. `Procedure`
6. `Execution defaults`
7. `Escalate when`
8. `Done when`

Standard skills stay within 100 lines; workflow skills stay within 180 lines. Use a `lint-waiver:` comment only when a concrete safety requirement makes the exception necessary.

Keep durable project rules in `AGENTS.md`, conditional knowledge in `references/`, and deterministic checks in scripts. Do not repeat generic quality slogans, force an artifact, or load all references by default.

An expensive workflow must declare `allow_implicit_invocation: false` in its frontmatter. It must state its trigger and its anti-trigger clearly.
