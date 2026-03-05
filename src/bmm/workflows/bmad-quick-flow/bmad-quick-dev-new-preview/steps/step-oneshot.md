---
name: 'step-oneshot'
description: 'Self-contained one-shot: implement, review, classify, commit, present'

adversarial_review_task: '{project-root}/_bmad/core/tasks/review-adversarial-general.xml'
deferred_work_file: '{implementation_artifacts}/deferred-work.md'
---

# Step One-Shot: Implement, Review, Present

## RULES

- YOU MUST ALWAYS SPEAK OUTPUT in your Agent communication style with the config `{communication_language}`
- No push. No remote ops.

## INSTRUCTIONS

### Implement

Implement the clarified intent directly.

### Review

Invoke `{adversarial_review_task}` in a subagent with the changed files. The subagent gets NO conversation context — to avoid anchoring bias. If no sub-agents are available, write the changed files to a review prompt file in `{implementation_artifacts}` and HALT. Ask the human to run the review in a separate session and paste back the findings.

### Classify

Deduplicate all review findings. Three categories only:

- **patch** — trivially fixable. Auto-fix immediately.
- **defer** — pre-existing issue not caused by this change. Append to `{deferred_work_file}`.
- **reject** — noise. Drop silently.

### Commit

If version control is available and the tree is dirty, create a local commit with a conventional message derived from the intent. If VCS is unavailable, skip.

### CHECKPOINT

Present summary of changes and review findings to the human. Offer to push and/or create a pull request. HALT and wait for human input.

Workflow complete.
