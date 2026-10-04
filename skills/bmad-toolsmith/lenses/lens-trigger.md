# Lens: trigger

Lane: the description as the whole trigger. The bar is the canon's trigger section: the model decides to load a skill from the description alone, so it must fire on the real requests and stay quiet on the neighbors. Start from `description_chars`, `has_use_when` and `frontmatter_ok`, then read the description.

- Over 1024 characters, or no `Use when`: high; the validator fails it too. Over 500: medium, with the clauses that are not anchors named for cutting.
- Nothing on what it does before the `Use when`, or first person ("I help you"): medium.
- No concrete anchors: no file types, tool names, artifact names or phrases a user types, only adjectives ("helps with planning"). High; it will hijack neighbors or never fire.
- Nothing on what it is not for when a sibling skill shares its vocabulary: medium; name the sibling.
- Procedure in the description: steps or flow the body should own. Medium; the model can skip the body and improvise.
- "When to use" text in the body: an overview saying when the skill applies, trigger phrases under a heading. Medium; the model never sees it when choosing.
- One noun covering a whole domain: high. A single phrasing where users say it several ways: medium. Several wordings of one situation stacked as separate clauses: low; collapse them. A tool's symptom where the user's problem is the trigger, in a skill not about that tool: low.
- `{target}/evals/triggers.json` absent, or without near misses (`should_trigger: false` cases sharing vocabulary): low; recommend writing it from the discovery, eight to ten each way.
- Doubt about any of the above: recommend a trigger eval through the `bmad-eval` skill, not a rewrite by opinion. When a description is revised from failures, change its contexts and anchors; never paste a failed query's words into it.

Not flagged: length between 500 and 1024 when every clause is an anchor; a one-line description on a skill with model invocation disabled; a description naming sibling skills, which is the exclusion working; the body for lacking trigger text, which is where it should not be.
