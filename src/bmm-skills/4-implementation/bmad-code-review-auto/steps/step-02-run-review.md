---
failed_layers: ''
incomplete_review_evidence: ''
dismiss_count: ''
normalized_findings: ''
automation_result_file: '{implementation_artifacts}/code-review-auto-result.json'
---

# Step 2: Run Review

## Rules

- Run without human interaction.
- Do not present interactive choices.
- Do not apply patches.
- Do not call interactive review steps.
- Do not convert `decision_needed` findings into patches.
- If review layers cannot run, produce a structured failure result.
- Preserve BMAD code-review semantics.
- Do not assign review or triage ownership to Archon.

## Instructions

1. Use the loaded diff plus story or spec context and loaded context docs as review evidence.
2. Run Blind Hunter when subagents are available.
3. Run Edge Case Hunter when subagents are available.
4. Run Acceptance Auditor when `review_mode` is `full` and story or spec context is available.
5. Give Acceptance Auditor the diff plus story or spec context and loaded context docs.
6. Treat a parseable empty finding set, empty `findings` array, or explicit no-findings response as a successful completed layer with zero findings.
7. If a required review layer fails, times out, or returns no raw response at all, append the layer name to `failed_layers`.
8. Record every failed, timed out, or empty-response layer as incomplete review evidence with the layer name, status, reason when known, and available input evidence.
9. Do not record a successful zero-finding layer as incomplete review evidence.
10. If no review layers can run, write a structured failure result to `{automation_result_file}` with:
   - `workflow: "bmad-code-review-auto"`
   - `status: "ERROR"`
   - `failure_type: "review_layers_unavailable"`
   - `failed_layers`
   - `incomplete_review_evidence`
   - `message`
11. Stop after writing the structured failure result when no review layer can run.
12. Normalize completed layer output into finding records when available.
13. Deduplicate findings that describe the same issue before triage.
14. Preserve merged source identity when duplicate findings are merged, such as `blind+edge` or `blind+auditor`.
15. Include these fields when the values are available:
   - `id`
   - `source`
   - `title`
   - `detail`
   - `location`
   - `evidence`
   - `reason`
   - `source_context`
16. Preserve enough evidence for later report, gate, and decision-needed stories.
17. Classify every non-dismissed finding into exactly one of `patch`, `decision_needed`, or `defer`.
18. Classify noise, false positives, and findings handled elsewhere as `dismiss`.
19. Preserve the dismiss count as `dismiss_count` even when dismissed findings are not emitted as active findings.
20. Reject any category outside `patch`, `decision_needed`, `defer`, and `dismiss`.
21. Use `defer` when a finding is real but pre-existing, outside the reviewed change, or already belongs to future planned work.
22. Classify a finding as `patch` when the correct fix is an unambiguous development fix.
23. Use `patch` only when the correct fix is an unambiguous development fix.
24. Keep `patch` as a finding category and output value only.
25. Preserve enough location and evidence data on `patch` findings for later development routing.
26. Do not apply code changes.
27. Classify a finding as `decision_needed` when the correct fix requires human product, design, operator, or policy judgment.
28. Use `decision_needed` only when a finding requires human product, design, operator, or policy judgment.
29. Preserve a human-judgment reason on every `decision_needed` finding when the reason is available.
30. Do not ask the human to resolve a `decision_needed` finding inside this skill.
31. When `review_mode` is `no-spec`, do not emit `decision_needed` findings.
32. When `review_mode` is `no-spec` and a finding would otherwise be `decision_needed`, classify it as `patch` if the fix is an unambiguous development fix, otherwise classify it as `defer`.
33. Do not convert `decision_needed` to `patch` after triage during automated review.

## Output For Next Step

Carry forward `normalized_findings`, `failed_layers`, `incomplete_review_evidence`, and `dismiss_count`.

## Next

Read fully and follow `./step-03-write-results.md`.
