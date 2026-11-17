# Lens: trigger

Lane: the description as the whole trigger. The bar is the canon's trigger section: the model decides to load a skill from the description alone, so it must fire on the real requests and stay quiet on the neighbors. Start from `description_chars`, `has_use_when` and `frontmatter_ok`, then read the description.

- Over 1024 characters, or no `Use when`: high.
- Past the canon's two parts: a third sentence, or a `Not for` no collision called for: medium. A summary past the canon's five to eight words: low. Name what to cut.
- An agent whose `Use when` omits its name, or has no phrase for a capability that lives inside it: medium; name the capability.
- Nothing on what it does before the `Use when`, or first person ("I help you"): medium.
- No concrete anchors: no file types, tool names, artifact names or phrases a user types, only adjectives ("helps with planning"). High.
- A sibling skill shares its vocabulary and the skill's `triggers.json` holds no near miss from that sibling's requests: low; recommend adding them, and a `Not for` naming the sibling only if a run fails them.
- Procedure in the description: steps or flow the body should own. Medium.
- "When to use" text in the body: an overview saying when the skill applies, trigger phrases under a heading. Medium.
- One noun covering a whole domain: high. Several wordings of one situation stacked as separate clauses: low; collapse them. A tool's symptom where the user's problem is the trigger, in a skill not about that tool: low.
- `{evals}/triggers.json` absent, or without near misses (`should_trigger: false` cases sharing vocabulary): low; recommend writing it, eight to ten each way.
- Doubt about any of the above: recommend a trigger eval through the `bmad-eval` skill, not a rewrite by opinion.

Not flagged: an agent's long `Use when` when each phrase belongs to an internal capability; a `Not for` naming a sibling that an eval or a known collision called for; a one-line description on a skill with model invocation disabled; the body for lacking trigger text, which is where it should not be.
