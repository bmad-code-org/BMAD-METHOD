# Eval format and the four modes

A case is the unit of evaluation. Every case is `input + rubric + optional state_prefix`. The same case shape feeds all four modes; what changes is which invocations the runner sets up and how the result is judged.

## The case

```json
{
  "id": "create-1",
  "input": "I want a brief for InsuLens, a claims-triage tool for mid-market insurers. Notes are in evals/insulens/files/memo.md",
  "rubric": [
    "brief.md exists and its word count is between 250 and 1500",
    "brief.md names InsuLens and the mid-market insurer segment",
    "brief.md incorporates at least two specific points from memo.md without inventing claims absent from it"
  ],
  "state_prefix": null,
  "files": ["evals/insulens/files/memo.md"]
}
```

Field semantics:

- `id`: stable identifier; used as the case's folder name in the run.
- `input`: the realistic, messy user request. Use real file paths, company names, typos, and casual speech, because a polished input tests a situation the skill rarely meets. The runner sends this verbatim to the invocation, after prepending any `state_prefix`.
- `rubric`: a list of named expectations, each gradeable to `{text, passed, evidence}` by the grader. The strong-versus-weak taxonomy below decides whether each one is worth keeping.
- `state_prefix`: optional bracketed prime that places the skill mid-workflow (see below). Null or absent means the skill starts cold.
- `files`: optional fixtures staged into the case's clean working directory before the run. Each is a path relative to `--project-root` or the cases file's directory, or a GitHub file URL (`https://github.com/<owner>/<repo>/blob/<ref>/<path>`, pinned to a commit or tag) for data kept in another repo. A relative path keeps its directory structure, so the input can reference it verbatim; a GitHub file lands at the workspace root under its file name. Absolute and `~` paths are refused, because cases must run on anyone's machine, and a missing fixture stops the run before it starts.
- `files` entry as `{"from": <path or URL>, "to": <workspace path>}`: stages a fixture under another name, so cases sharing one folder can each carry their own `_bmad/config.toml` or customization.
- `skills`: optional skill folders, relative like `files`, staged beside the skill under test for a skill that hands work to another (an agent that calls `bmad-facilitate`). The bare config gets none of them.

For trigger cases the shape is lighter: a `query` and a `should_trigger` boolean, because there is no artifact to grade, only whether the skill fired.

A skill-creator `evals.json` converts with `uv run "{skill-root}/scripts/convert_cases.py" <evals.json> --output <cases.json>`; `--to skill-creator` reverses it.

## state_prefix: turn simulation in one shot

Most multi-turn skills can be evaluated single-shot if the case is designed right. The `state_prefix` is the trick that makes mid-workflow points reachable without a multi-turn simulator. It is a bracketed prime prepended to the input that tells the skill where in its own flow this turn lands and what the user already said:

```
[the skill has already worked through discovery; on turn 4 the user was asked about stakeholders and responded:] User said: "just me and a PM"
```

The runner prepends the `state_prefix` to `input` and sends the combined text as a single message. One input then exercises any mid-workflow moment: a clarifying turn, a correction, a resume after an interruption. Only a case where the conversation arc itself is the deliverable needs real multi-turn.

Subjective skills (coaching, brainstorming, design facilitation) skip the rubric and rely on human judgment. The `state_prefix` still earns its place there, because it lets a human see the exact mid-run moment they want to judge.

## Strong versus weak expectations

The grader's job is easier and the result is more honest when an expectation is discriminating, meaning a wrong output cannot pass it. A weak expectation is worse than no expectation, because a green check on it reads as proof when it is noise. The grader flags weak expectations when it sees them; write them out of the rubric before they ship.

Weak patterns to avoid:

- Filename-only checks. "brief.md exists" passes for an empty file. Pair existence with a content check.
- Wholly subjective phrasing. "the brief is high quality" cannot be graded. State the property concretely.
- Tautologies. Anything that follows automatically from the prompt being understood proves nothing.
- Escape clauses. "Kept intact somewhere", "or equivalent", or an "or" branch that a kept copy of the input can satisfy lets a broken output pass. For an artifact check, every branch a line allows must show the property in the intended deliverable.
- A reply that claims file work. When the skill's job is to write files, the evidence is in those files: a reply saying the work was done passes for a skill that did nothing.

Strong patterns for artifact correctness:

- Specific facts that must appear, such as "incorporates at least two findings from section X."
- Structural claims a wrong output would fail, such as "word count between 250 and 1500."
- Negative assertions, such as "does not introduce content from unrelated sections." Where the skill must leave something out or refuse bad input, give that its own line, and give the bad input its own case.
- Frontmatter checks, such as "frontmatter contains title, status, created (ISO 8601), updated."
- Bounded output blocks, such as "the final message contains a JSON object with intent='create'."

Strong patterns for process discipline:

- Side-artifact existence paired with content, such as "decisions.md records the pricing decision with its rejected alternative and rationale."
- Transcript tool-call patterns, such as "the transcript contains a call invoking bmad-review."
- Phase ordering, such as "the polish call occurs after the brief Write and before the final JSON block."
- Read-only enforcement, such as "the input brief.md is byte-identical to the fixture and no Write or Edit targeted it."
- Bidirectional fidelity, such as "every decision the user made in the transcript is reflected in the brief, and no untagged claim in the brief is absent from the input, the files it names, and the transcript."

Most process-discipline checks are deterministic reads of the transcript and filesystem, so the grader confirms them by quoting evidence rather than judging.

### Plant a defect before trusting a rubric

A line earns trust only for a defect it has been seen to fail. Copy a passing output, plant one defect the line exists to catch (delete a required line, break a rule the skill enforces), grade both copies against the same rubric, and confirm the line passes the original and fails the broken copy citing the planted defect.

When the defect has to show up in a real run, such as a wrong choice the skill reports or a step it skips, sabotage one line of a copy of the skill and run `--mode variant --variant-path <copy> --runs 3`, grading both arms against the same rubric. Before counting a sabotaged run, confirm from its output or transcript that the defect actually occurred. Count a catch only when the line fails on such a run citing the planted defect and passes every clean run.

A sharding case shows the gap. Its skill keeps a copy of the source in `.source/`, and this line passed an output with one requirement line deleted from its shard, because that copy satisfied the first branch:

> Every line of the original PRD is still present word for word in the workspace output (the original kept intact somewhere, or files whose contents together contain every original line), checked by sampling FR-WO-015, NFR-RET-004, Appendix A and the section 5.3 plan table

A line that names where the text must be, with no branch the copy can satisfy, failed that output and passed the clean ones:

> If the output is split, the full FR-WO-015 passage, from its heading to the line before the FR-WO-016 heading, appears word for word in the body of one shard the manifest lists

That line catches only the planted passage. To catch a loss anywhere, require the shards the manifest lists to rebuild the source exactly.

## The four modes in detail

### Baseline: skill versus bare model

Run the case input twice in parallel in the same turn, once wrapped by the skill and once against the bare model with nothing around it. The bare-model run is the long-term floor. The skill earns its existence only by producing something the bare model cannot, so when the skill stops beating the bare model the right call is retirement, not another patch. Use baseline when the user asks whether the skill is worth keeping, or as the release check.

### Variant: full versus stripped smallest-version

Run the full skill against a stripped smallest-version of the same skill (passed as `--variant-path`), or against a snapshot of the prior version for an edit, on the same input. It settles whether a section suspected of being ceremony does real work. If the two outputs tie on the dimension the section was supposed to protect, cut the section. If the small version is materially and durably worse, keep it.

### Quality: output versus rubric

Grade a single config's output against the named rubric with the read-only grader. The grader gives no partial credit, puts the burden of proof on a passing grade, and flags any non-discriminating assertion. Use quality when a rubric exists and the user wants to know whether the output meets it, independent of any comparison.

### Trigger and description

Generate near-miss should-trigger and should-not-trigger queries that share keywords, split them, measure real firing through the harness, and improve the description across bounded rounds with the held-out scores blinded from the improver. Trigger detection is a canary: the staged skill asks for a token at the start of the reply, and the token in the output is the load (`references/harness.md`).

## Running baseline, variant and quality

Baseline runs every case with the skill staged and with nothing staged; variant runs the skill against the one at `--variant-path`; quality runs one config.

```
uv run "{skill-root}/scripts/run_evals.py" \
  --cases <cases-file> --skill-path <skill> --output-dir <dir> \
  --mode quality|baseline|variant [--variant-path <skill>] \
  --label <skill-name>-<mode> [--runs N]
```

`--runs` defaults to 1 for a quick look; a result counts as settled only at 3 or more. Case subsets, timeouts and workers are in the script's `--help`.

For quality, spawn the grader in `references/grader.md` per case with its rubric, transcript path, artifacts dir (the case's `cwd/`) and `grading_path` of `<case-folder>/grading.json`. Relay its rubric feedback. If a grader errors, mark the case `grading_error`, never a default verdict.

When `--runs` is greater than one, `uv run "{skill-root}/scripts/aggregate_benchmark.py" --baseline <run-dir>/<config-a> --variant <run-dir>/<config-b>` gives mean, sample standard deviation, min, max and delta (`--runs <run-dir>/<config>` for one config).

## Getting a skill to behave non-interactively

Single-shot modes need the skill to produce its deliverable without stopping to ask. Most multi-turn skills expose a headless flag or keyword that suppresses clarifying questions and ends with a structured status block. Trigger it from the input: the literal `Run headless.` at the start, a skill-specific keyword from the skill's own headless section, or enough context that no clarification is genuinely needed. The `state_prefix` also helps here, because a turn that already supplies the answer the skill would ask for keeps the run moving. If a skill has no headless path and the input cannot satisfy its questions, either add a headless mode to the skill or accept that this case needs a human in the loop.
