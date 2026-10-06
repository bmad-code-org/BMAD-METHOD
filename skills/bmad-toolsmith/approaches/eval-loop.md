# Eval loop

The shared loop that `approaches/eval-first.md` and `approaches/skill-creator-loop.md` load after their own opening. Its outcome: a skill whose cases pass because of what the skill adds, with the evidence on record. Every run here is "invoke the `bmad-eval` skill" on `{target}`; this file never runs a skill itself.

## Cases

Cases live at `{target}/evals/cases.json` as `{id, input, rubric[], state_prefix, files[]}`. Seed them from real requests and transcripts before inventing any, because invented cases come out homogeneous and easy. Two or three realistic, messy inputs to start, with no rubric yet. A `state_prefix` places a case mid-flow without a multi-turn harness.

## One round

1. Run with and without. Invoke the `bmad-eval` skill in baseline mode, so the skill and the bare model see the same inputs in parallel. Runs land in bmad-eval's reports folder, by default `{output_folder}/eval-reports`; bmad-eval writes them.
2. Write the rubric after the first outputs. Each entry is binary and names one failure mode you saw; prefer graders computed from the transcript and files, and keep a model judge for short outputs only, per the `bmad-eval` skill's eval-format reference. An assertion that passes in both arms tests nothing the skill adds: sharpen it or drop it.
3. Grade. Three runs per case, because output varies run to run. Invoke the `bmad-eval` skill in quality mode for the rubric and read the delta between arms, never the with-skill score alone.
4. Read the transcripts, not just the grades. Several approaches tried before one works: an instruction is too vague. An instruction followed where it does not apply: too broad. Stalling between alternatives: no default named. The same helper rewritten every run: bundle a script.
5. Change one thing, with its why, and cut any line whose removal did not change results.
6. Rerun. A variant run (invoke the `bmad-eval` skill in variant mode against the prior snapshot) says whether the change, not chance, moved the score.

## When to stop

- Every grader passes three runs: done.
- The user says it is good enough: done, and tell them which cases still fail.
- Two rounds move nothing: the cases are the problem, not the words. Re-examine them for weak assertions, inputs too tidy to fail, or a rubric grading what the bare model already does.
- The with-skill arm loses to the bare model and stays behind: the model has caught up. Say so plainly and propose retiring the skill, not patching it.

## The honest check

Before leaving the loop, say in one line what the cases do not cover and whether any assertion passed for a trivial reason. A passing run on easy cases is not proof; the user decides whether to add harder ones.
