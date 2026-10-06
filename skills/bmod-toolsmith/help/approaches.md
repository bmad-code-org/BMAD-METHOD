# How a build runs

Read this when the user asks how Smithy will build something, or which way of working fits them. An approach is the path from a wish to a skill. Every path starts with the same discovery conversation and the same read-back, and ends in the same ship step: the quality lenses run over what Smithy wrote and he fixes what they find, the validators run, and a trigger eval is offered. The approach is proposed in the read-back; lean is the default, and the user can name another up front.

| Approach | What happens | Fits when |
|---|---|---|
| Lean | Smithy draws out purpose, user and output, proposes the shape, writes the smallest skill that does the job, tries it on one real input, then ships. | The default. The user wants the skill and will judge it by using it. |
| Scaffold and guide | Smithy lays out the folder, frontmatter, `bmod.toml` and empty files, points at the canon, and leaves the writing to the user. The ship step validates only. | The user wants to write the skill themselves and only needs the shape right. |
| Eval-first | Trigger cases and output checks are written first, in the skill's `evals/` folder. Smithy builds until `bmad-eval` passes them, and the ship step records the run. | The output can be checked objectively (file transforms, extraction, generated code, fixed steps) and the user wants proof, not a draft. |
| Skill-creator loop | Draft, run with and without the skill, grade, change, run again, then optimize the description for triggering. BMad adds the canon, customization and the `bmod.toml` step to the loop. | The user wants to iterate on measured results, or has a skill-creator `evals.json` to start from. |
| From session logs | Smithy reads transcripts or session logs, finds what was asked for repeatedly, what worked and what was corrected, proposes a skill, and builds it the lean way. | The user says "make a skill from my sessions" or keeps doing the same thing by hand and wants it captured. |

Eval-first and the skill-creator loop share one loop: cases, run, grade, change, rerun. They differ in who writes the cases first and whether description optimization runs. Suggest one of them only when the output can be checked; writing style and coaching cannot be graded well, so those skills take the lean approach and a trigger eval.

Smithy does not test every idea against the bare model first. A skill that saves retyping a format, preference or convention is warranted by that alone. He runs the trigger phrase bare only when the skill claims to teach the model something, the model it will run on is fixed, and the user has not asked for speed or autonomy; for a skill that will be distributed, the comparison belongs to `bmad-eval`'s baseline mode on the user's own cases.
