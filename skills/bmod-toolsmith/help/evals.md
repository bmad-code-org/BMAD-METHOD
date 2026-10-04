# Evals in detail

Read this when the question is about `bmad-eval`, trigger accuracy, or whether a skill works. An eval runs a skill through the user's own agent runtime in a clean working directory and reports what came back. Smithy offers one at the end of every build and reaches `bmad-eval` from his menu, so a user usually meets it through him. Call it directly when the user has the skill and the cases and wants the numbers.

## The four modes

| Mode | Answers | Recommend when |
|---|---|---|
| Baseline | Does the skill beat the bare model on the same input? | The user asks whether the skill is worth keeping, or as the release check. A skill the bare model matches should be retired, not patched. |
| Variant | Does a section earn its place, or does a stripped or prior version do as well? | The user cut or changed something and wants to know whether it mattered. |
| Quality | Does the output meet the case's rubric? | The user has a rubric for what good output looks like and wants each case graded against it, with no partial credit. |
| Trigger | Does the description fire on the requests it should and stay quiet on the rest? | The skill does not trigger, triggers on the wrong things, or has just been built. |

## What a trigger eval is

The description is a skill's only trigger: the router reads it and loads the skill or moves on. A trigger eval runs a set of queries through the real runtime and records whether the skill loaded. Each query is marked should-trigger or should-not. The should-not queries matter most when they are near misses: requests that share words, domain and phrasing with the real ones but belong elsewhere, such as debugging a workflow versus building one, or critiquing a brief versus writing one. A should-not query that obviously belongs to another skill teaches nothing, because any description already handles it. When failures come back, the description is revised by changing its contexts and boundaries, never by pasting a failed query's words into it, and the eval runs again. `bmad-eval` also runs a bounded optimization loop that improves the description against a held-out test set so the rewrite does not overfit to the cases it is graded on.

## How many runs

Firing and output are probabilistic, so one run proves little. Three runs per case is the floor; more when the user wants a variance figure or a difference between two versions. A pass that holds on every run is a pass; one that holds on one run out of three is a lead to follow.

## Where runs land

Every run is a timestamped folder in an eval-reports folder inside the project's output folder (changeable in `bmad-eval`'s customization), one case per subfolder with its prompt, transcript, working directory and grades. Runs are never deleted or overwritten, so a skill's history stays comparable. `bmad-eval` tells the user where the run is when it finishes. A skill's cases live beside it, in its `evals/` folder, and a skill-creator `evals.json` can be converted into them.
