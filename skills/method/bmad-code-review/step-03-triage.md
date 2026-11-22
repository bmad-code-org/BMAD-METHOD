---
triage_file: '' # set at runtime: path to the triage file
---

# Step 3: Triage

The objective of triage is to collect the findings from the review step, and turn them into a unified list of things to deal with. The common triage failures are:

- forgetting about a finding
- rejecting a finding of a real defect for any reason, e.g. because it looks similar enough to a previously rejected finding -> defect ships to production
- assigning wrong severity -> a defect with real consequences misclassified as low (cosmetic) ships into production; a hard-to-fix finding with negligible consequence misclassified as medium creates accidental complexity.

## INSTRUCTIONS

1. Wait for all review lenses to finish and report their findings. Do not attempt to triage findings as they come - this leads to forgotten findings.
2. **Normalize** findings from all lenses into a unified list where each finding has:
   - `id` -- `R` for "raw", followed by sequential integer (`R1`, `R2` etc)
   - `source` -- the `id` of the lens that produced the finding (e.g., `blind-hunter`)
   - `title` -- one-line summary
   - `detail` -- full description
   - `location` -- file and line reference (if available)
    Do not attempt to deduplicate or group findings at this point - this breaks traceability and you don't know enough about them yet.

    Write this list to `{triage_file}`, a uniquely-named temp file outside the repository, one block per finding. Later steps render the review from this file, so a decision that is not in it does not exist.
3. Classify each reported finding from the list as one of the following: [high, medium, low, false, maybe-false], by following this process:

3a. **Verify the finding's claim.**
Is a finding real? If a finding alleges (or implies) some unwanted code behavior, can that behavior actually occur at the cited file and line? Can the program ever reach the state that makes this behavior occur? Is the alleged behavior actually unwanted?

Read beyond the changed lines -- follow callers, guards upstream, etc -- try to get a definite yes or no answer.

A finding that says "this throws / crashes when X" is only real if you can show that X happens. An assert or throw on a state the program can never reach is defensive programming, not a defect. Ignoring corner cases for simplicity may be intentional.

Do not decide about finding B because it's similar to finding A you've already looked into. This shortcut only works when both findings cite the exact same behavior at the exact same file/line. When finding A alleges a non-existent behavior, while finding B points to a real defect, trying to judge B by similarity to A allows said defect to escape to production.

Do not bring into claim verification any notion of how severe, how rare, or how fixable the alleged outcome is - only whether it can happen or not.

Skip verification for any gap finding from the `verification-gap` review lens. If that lens found a verification gap, it's real. Do verify findings it reports under `Other findings` rubric though.

3b. **Assign severity to real findings**
What would a single occurrence of the bad outcome do to an end user or a developer? How tolerable is it?

Descriptions of `high`, `medium` and `low` are provided in 3c. Use your own judgement if a finding doesn't fit any of these.

Disregard any severity a lens assigned -- it lacks the context to grade. If a finding is not real, skip judging its severity, it won't matter.

A gap finding from the `verification-gap` lens is `medium`; skip grading it. Its `Other findings` are graded like everything else.

For developer-only problems (inconsistent design, eroded invariants, duplicated sources of truth etc): a vague "this is messy" is not a severity; name where it will cause trouble -- e.g., which caller will diverge, which rule will break, or how will it hurt code readability/comprehension. If you can't, think whether this is still a real finding, and consider the severity as "low".

Just like in verification, do not judge severity of finding B based on a similar, but different finding A.

Severity is about the impact of a single occurrence of the bad outcome. It must not depend on how rare the outcome may be, how hard it is to fix, or whether the defect predates the change under review.

The only distinction that really changes what happens to a finding within this process is whether or not it is `low`. `high` and `medium` only affect the sorting order in the triage report.

If you cannot decide between `medium` and `low`, pick `medium`.

3c. **Render your verdict**

- `high` -- data loss or corruption, a security exposure, a silently wrong result, or a path broken with no workaround.
- `medium` -- broken or wrong, but noticed and worked around, or limited in reach.
- `low` -- cosmetic or a minor inconvenience.
- `false` -- the finding is not real.
- `maybe-false` -- you cannot decide whether the finding is real or not. Use this only when the diff and surrounding code leave the question open.

Each verdict comes with a sentence of evidence: for `high`, `medium`, `low` the harm you named; for `false` what disproves the claim; for `maybe-false` what would settle it.

3d. Reject some findings
Reject every `false` finding.
Reject a `low` finding if it would be rarely visible to a user or developer, and the fix creates extra complexity - anything more than a direct correction or deletion.
If you have a plan file for the change under review, reject any finding whose fix is to edit the intent section thereof.

Once every finding has a verdict, update `{triage_file}` in one pass: each block gets its verdict and evidence, and a rejected finding stays in, marked rejected, with the reason.

4. Group the findings you did not reject by the root cause
Several raw review findings can say different things about what effectively is the same defect. At this point, you have learned enough to accurately deduplicate them. The idea is to turn them into a single finding per root cause, that carries the highest verdict of the group, but remembers which raw findings, from which sources it's based upon.

   Two raw findings belong in one group only when the same root cause produced both. Be careful that it's same, not merely similar. Same location does not necessarily mean same root cause - there can be multiple bugs on the same line of code.

   A deduplicated finding carries:
   - `title` -- one line naming the root cause
   - `location` -- the member findings' distinct locations
   - `detail` -- summary of member findings' bad outcomes, focusing on most severe verified ones.
   - `verdict` -- the highest verdict among the member findings (`high` > `medium` > `low` > `maybe-false`)
   - `source` -- distinct sources of member findings joined with `+` (e.g., `blind-hunter+edge-case-hunter`)
   - `members` -- the `R` ids it is built from

Order these deduplicated findings by verdict (highest first), and assign each of them with an `id`: `F` for "finding", followed by sequential number (`F1`, `F2` etc). Append them to `{triage_file}`.

None of the member raw findings can be `false` - all these were rejected.
A deduplicated finding which is a group of one should be identical to its single raw finding, except the `id`.

5. `{triage_file}` is this step's output: every raw finding with its verdict and evidence, every rejection with its reason, and the `F` findings with their members. Check that nothing is missing before moving on.

## NEXT

Read fully and follow `{{ rendered("step-04-route.md") }}`
