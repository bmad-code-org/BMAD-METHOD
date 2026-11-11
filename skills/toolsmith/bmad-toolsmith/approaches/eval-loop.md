# Eval loop

`approaches/eval-first.md` and `approaches/skill-creator-loop.md` load this loop after their own opening. Its outcome: a skill whose cases pass because of what the skill adds, with the evidence on record.

Every run here invokes the `bmad-eval` skill on `{target}`.

## Cases

Cases live at `{target}/evals/cases.json` as `{id, input, rubric[], state_prefix, files[]}`. A `state_prefix` places a case mid-flow.

Seed them from real requests and transcripts before inventing any, because invented cases come out homogeneous and easy. Start with two or three realistic, messy inputs and no rubric.

## One round

1. Invoke the `bmad-eval` skill in baseline mode, so the skill and the bare model see the same inputs. Runs land in its reports folder, by default `{output_folder}/eval-reports`.
2. Write the rubric after the first outputs. Each entry is binary and names one failure mode you saw. Prefer graders computed from the transcript and files; keep a model judge for short outputs only, per the `bmad-eval` skill's eval-format reference. Sharpen or drop an assertion that passes in both arms, since it tests nothing the skill adds.
3. Grade three runs per case, because output varies run to run. Invoke the `bmad-eval` skill in quality mode and read the delta between arms, never the with-skill score alone.
4. Read the transcripts, not just the grades. Several approaches tried before one works: an instruction is too vague. An instruction followed where it does not apply: too broad. Stalling between alternatives: no default named. The same helper rewritten every run: bundle a script.
5. Change one thing, with its why, and cut any line whose removal did not change results.
6. Rerun in `bmad-eval` variant mode against the prior snapshot to see whether the change, not chance, moved the score.

## When to stop

- Every grader passes three runs: done.
- The user says it is good enough: done, and tell them which cases still fail.
- Two rounds move nothing: the cases are the problem, not the words, so re-examine them for weak assertions, inputs too tidy to fail, or a rubric grading what the bare model already does.
- The with-skill arm stays behind the bare model: say the model has caught up and propose retiring the skill, not patching it.

## The honest check

Before leaving the loop, say in one line what the cases do not cover and whether any assertion passed for a trivial reason. The user decides whether to add harder ones.
