# Eval loop

The outcome: a skill whose cases pass because of what the skill adds, with the evidence on record. Bare paths resolve from `{skill-root}`.

Every run here invokes the `bmad-eval` skill on `{target}`.

## Cases

Cases live at `{target}/evals/cases.json` as `{id, input, rubric[], state_prefix, files[]}`, written by the file that loaded this loop. A `state_prefix` places a case mid-flow.

## One round

1. Invoke the `bmad-eval` skill in baseline mode, so the skill and the bare model see the same inputs. Runs land in `bmad-eval`'s reports folder.
2. Where a case has no rubric yet, write it after the first outputs: each entry binary, naming one failure mode you saw. Prefer graders computed from the transcript and files; keep a model judge for short outputs only, per the `bmad-eval` skill's eval-format reference. Sharpen or drop an assertion that passes in both arms, since it tests nothing the skill adds.
3. Grade three runs per case, because output varies run to run. Invoke the `bmad-eval` skill in quality mode and read the delta between arms, never the with-skill score alone.
4. Read the transcripts, not just the grades:
   - Several approaches tried before one worked: the instruction is too vague; say what to do.
   - Stalling between alternatives: no default named; name one.
   - An instruction followed where it does not apply: narrow its condition.
   - The same helper rewritten each run: bundle it as a script.
5. Change one thing, with its why, and cut any line whose removal did not change results.
6. Rerun in `bmad-eval` variant mode against the prior snapshot to see whether the change, not chance, moved the score.

## When to stop

- Every grader passes three runs: done.
- The user says it is good enough: done, and tell them which cases still fail.
- Two rounds move nothing: re-examine the cases for weak assertions, inputs too tidy to fail, or a rubric grading what the bare model already does.
- The with-skill arm stays behind the bare model: say the model has caught up and propose retiring the skill, not patching it.

## What the cases do not cover

Before leaving the loop, say in one line what the cases do not cover and whether any assertion passed for a trivial reason. The user decides whether to add harder ones.
