# Subagents in a skill

Read this when the user asks whether a skill should use subagents, how to run work in parallel, or why a skill with subagents still loads everything.

A subagent is a separate model instance a skill starts for one task. Use one to keep the main conversation small, to run work in parallel, or to get judgment the rest of the session has not influenced. Smithy does this himself: review gives each lens its own reader, and cut gives each file a writer and a separate checker.

The most common failure is the parent reading the files before delegating them, which spends the tokens the pattern exists to save. The skill says what the parent does not read, and a pre-pass script gives it names and sizes to plan from.

Subagents share only what they are given, so files carry the work. The parent holds paths and a plan, and each subagent writes its result to a known path in a strict format.

| Pattern | Fits when |
|---|---|
| Subagents each read a source and return a summary | Many documents, and the parent needs only the distilled result |
| Workers write temp files, and one subagent assembles them | Summaries are still too large to return |
| Each subagent adds to a shared file in a set order | Later work depends on earlier work |
| A lead writes a plan, and the parent starts workers from it | The work cannot be divided until it has been analyzed |
| Parallel personas, with an evaluator merging the best | Different perspectives improve quality; each gets the material, not a conclusion |
| Many variations, scored, with the next round built from the winners | Results can be scored and many rounds are affordable |

Every skill that uses subagents says what happens without them, usually running each role inline and telling the user.
