---
findings_file: '{implementation_artifacts}/code-review-auto-findings.json'
report_file: '{implementation_artifacts}/code-review-auto-report.md'
automation_result_file: '{implementation_artifacts}/code-review-auto-result.json'
failed_layers: ''
incomplete_review_evidence: ''
dismiss_count: ''
---

# Step 3: Write Results

## Rules

- Write findings and artifacts only.
- This step does not apply patches.
- This step does not present interactive choices.
- This step does not ask for decisions.
- This step does not execute downstream development work.
- This step emits only BMAD triage categories: `patch`, `decision_needed`, `defer`, and `dismiss`.

## Instructions

1. Write normalized findings to `{findings_file}`.
2. Write a concise human-readable report to `{report_file}`.
3. Write a structured automation result to `{automation_result_file}`.
4. Use `status: "OK"` when review layers ran and artifacts were written.
5. Use `status: "ERROR"` when artifact writing or validation fails.
6. Include `failed_layers` in the result when any layer failed.
7. Include `incomplete_review_evidence` in the result when any layer failed, timed out, or returned empty output.
8. Include `dismiss_count` in the result when known.
9. Include `findings_file` and `report_file` in the result when known.
10. Leave `patch` findings as findings.
11. Leave `decision_needed` findings as findings.
12. Do not emit or require a field that converts decisions into patches.
13. Do not offer any menu, numbered option, approval checkpoint, or patch action.
14. Do not apply code changes.
15. Do not ask the human to resolve a finding.
16. Do not emit categories outside the BMAD triage set.

## On Complete

Run: `python3 {project-root}/_bmad/scripts/resolve_customization.py --skill {skill-root} --key workflow.on_complete`

If the resolved `workflow.on_complete` is non-empty, follow it as the final terminal instruction before exiting.
